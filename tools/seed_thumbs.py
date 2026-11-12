#!/usr/bin/env python3
"""Write the ready-made thumbnails of the example designs, so a first visit shows the wall at once.
Serve the folder first (python3 tools/qa/serve.py), then:
    python3 tools/seed_thumbs.py                                  TEKEX examples  -> assets/seed/tekex-NN.webp
    python3 tools/seed_thumbs.py <client id> <folder/prefix>      a client pack   -> <folder/prefix>NN.webp
Run it again whenever the example designs or their templates change. The count it prints must match SEED_THUMBS.n
in home-studio.lib.js (or seedThumbs.n in the client's pack)."""
import base64, io, os, sys, time
from PIL import Image
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'qa'))
from cdp import browser, size, go

client = sys.argv[1] if len(sys.argv) > 1 else 'tekex'
out = sys.argv[2] if len(sys.argv) > 2 else 'assets/seed/tekex-'
base = os.environ.get('QA_BASE', 'http://localhost:8765/')
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
init = "try { sessionStorage.setItem('hs-in', '1'); localStorage.setItem('hs-ws-current', '%s'); localStorage.setItem('hs-theme', 'light'); } catch (e) {}" % client
p, ws = browser(9540, init, reduce_motion=False)
try:
    size(ws, 1440, 900)
    go(ws, base + 'Home%20Studio.dc.html#/designs', 2.0)
    done = []
    for _ in range(240):
        done = ws.ev("(() => { const h = window.__hs; if (!h) return []; const d = h.state.drafts.filter(x => x.seedN != null); return d.map(x => [x.seedN, String(h.state.thumbs[x.id] || '').indexOf('data:image/') === 0]); })()") or []
        if done and all(ok for _, ok in done):
            break
        time.sleep(0.5)
    if not done or not all(ok for _, ok in done):
        raise SystemExit(f'Not every example was drawn ({sum(1 for _, ok in done if ok)} of {len(done)}).')
    pics = ws.ev("(() => { const h = window.__hs; return h.state.drafts.filter(x => x.seedN != null).map(x => [x.seedN, h.state.thumbs[x.id]]); })()")
    os.makedirs(os.path.dirname(os.path.join(root, out)), exist_ok=True)
    total = 0
    for n, url in pics:
        im = Image.open(io.BytesIO(base64.b64decode(url.split(',', 1)[1]))).convert('RGB')
        path = os.path.join(root, f'{out}{n:02d}.webp')
        im.save(path, 'WEBP', quality=78, method=6); total += os.path.getsize(path)
    print(f'{len(pics)} thumbnails written to {out}NN.webp ({total // 1024}KB)')
finally:
    p.terminate()
