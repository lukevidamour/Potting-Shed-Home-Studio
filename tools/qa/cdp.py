"""Tiny Chrome DevTools Protocol client for the Potting Shed Responsive QA (standard library only).

Starts headless Google Chrome, opens pages at emulated device sizes and runs JavaScript in them.
Used by audit.py and shots.py; import it rather than running it."""
import base64, json, os, socket, struct, subprocess, tempfile, time, urllib.request

CHROME_CANDIDATES = [
    os.environ.get('CHROME_PATH', ''),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
]


def chrome_path():
    for c in CHROME_CANDIDATES:
        if c and os.path.exists(c):
            return c
    raise SystemExit('Google Chrome not found. Install it or set CHROME_PATH.')


class WS:
    """Minimal WebSocket client: enough for one DevTools page session."""

    def __init__(self, url):
        host, rest = url[5:].split('/', 1)
        h, p = host.split(':')
        self.sock = socket.create_connection((h, int(p)))
        self.sock.settimeout(90)                  # a hung page raises instead of stalling the run
        key = base64.b64encode(os.urandom(16)).decode()
        self.sock.send(f"GET /{rest} HTTP/1.1\r\nHost: {host}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n"
                       f"Sec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n".encode())
        buf = b''
        while b'\r\n\r\n' not in buf:
            buf += self.sock.recv(4096)
        self.buf = buf.split(b'\r\n\r\n', 1)[1]
        self.id = 0

    def _send(self, obj):
        data = json.dumps(obj).encode()
        hdr = bytearray([0x81]); n = len(data); mask = os.urandom(4)
        if n < 126: hdr.append(0x80 | n)
        elif n < 65536: hdr.append(0x80 | 126); hdr += struct.pack('>H', n)
        else: hdr.append(0x80 | 127); hdr += struct.pack('>Q', n)
        self.sock.send(bytes(hdr) + mask + bytes(b ^ mask[i % 4] for i, b in enumerate(data)))

    def _read(self, n):
        while len(self.buf) < n:
            self.buf += self.sock.recv(1 << 16)
        d, self.buf = self.buf[:n], self.buf[n:]
        return d

    def _recv(self):
        msg = b''
        while True:
            b1, b2 = self._read(2); n = b2 & 127
            if n == 126: n = struct.unpack('>H', self._read(2))[0]
            elif n == 127: n = struct.unpack('>Q', self._read(8))[0]
            msg += self._read(n)
            if b1 & 0x80:
                return json.loads(msg)

    def call(self, method, **params):
        self.id += 1; mid = self.id
        self._send({'id': mid, 'method': method, 'params': params})
        while True:
            r = self._recv()
            if r.get('id') == mid:
                return r

    def ev(self, js):
        """Evaluate JavaScript (await allowed) and return its JSON value."""
        r = self.call('Runtime.evaluate', expression=js, awaitPromise=True, returnByValue=True)
        res = r.get('result', {})
        if 'exceptionDetails' in res:
            raise RuntimeError(res['exceptionDetails'].get('exception', {}).get('description', 'JavaScript error'))
        return res.get('result', {}).get('value')

    def shot(self, **kw):
        return base64.b64decode(self.call('Page.captureScreenshot', format='jpeg', quality=82, **kw)['result']['data'])


def browser(port=9520, init_js=None, reduce_motion=True):
    """Start headless Chrome; return (process, ws).

    init_js runs before every page's own scripts (use it to pass a review gate, e.g. set localStorage).
    reduce_motion asks pages for prefers-reduced-motion, which well-built sites answer by showing
    content without scroll-reveal animations, so the audit sees the finished layout."""
    prof = tempfile.mkdtemp(prefix='psqa-')
    p = subprocess.Popen([chrome_path(), '--headless=new', f'--remote-debugging-port={port}', f'--user-data-dir={prof}',
                          '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required', '--mute-audio', 'about:blank'],
                         stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    tabs = None
    for _ in range(80):
        try:
            tabs = json.load(urllib.request.urlopen(f'http://127.0.0.1:{port}/json')); break
        except Exception:
            time.sleep(0.2)
    if not tabs:
        p.terminate(); raise SystemExit('Could not start headless Chrome.')
    ws = WS([t for t in tabs if t['type'] == 'page'][0]['webSocketDebuggerUrl'])
    ws.call('Page.enable')
    ws.call('Emulation.setFocusEmulationEnabled', enabled=True)   # stays focused and visible: synthetic keys (Esc) can otherwise hide the page and stop animation frames
    if reduce_motion:
        ws.call('Emulation.setEmulatedMedia', features=[{'name': 'prefers-reduced-motion', 'value': 'reduce'}])
    if init_js:
        ws.call('Page.addScriptToEvaluateOnNewDocument', source=init_js)
    return p, ws


def size(ws, w, h, touch=None, dpr=1):
    """Emulate a device. Phones and landscape phones get the mobile viewport; touch devices (phones and
    tablets) get touch emulation, which also makes CSS (pointer: coarse) match. Touch emulation can't be
    switched back off in a session, so audit mouse and touch sizes in separate browsers.
    dpr is the pixel density: at 2 the browser picks the srcset source a retina screen would download."""
    mobile = w < 768 or min(w, h) <= 500
    touch = mobile if touch is None else touch
    ws.call('Emulation.setDeviceMetricsOverride', width=w, height=h, deviceScaleFactor=dpr, mobile=mobile)
    if touch:
        ws.call('Emulation.setTouchEmulationEnabled', enabled=True, maxTouchPoints=5)
    return touch


def go(ws, url, wait=1.2, limit=None):
    """Load url as a fresh document, wait up to limit seconds for it to finish loading, then wait settle time.
    Navigating to the current URL with a #fragment is only an in-page jump, so in that case reload, or every
    size would inherit the last one's state."""
    r = ws.call('Page.navigate', url=url)
    if not r.get('result', {}).get('loaderId'):
        ws.call('Page.reload')
    for _ in range(int((limit or wait + 4) * 10)):
        time.sleep(0.1)
        try:
            if ws.ev('document.readyState') == 'complete':
                break
        except Exception:
            pass
    time.sleep(wait)


SETTLE = """(async () => { const s = ms => new Promise(r => setTimeout(r, ms));
  document.querySelectorAll('img[loading=lazy]').forEach(i => i.loading = 'eager');
  const H = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += Math.max(300, innerHeight * 0.8)) { window.scrollTo(0, y); await s(60); }
  window.scrollTo(0, 0); await s(500); return true; })()"""
"""Scroll through the page once (fires lazy loading and scroll-reveal observers), then return to the top."""
