#!/usr/bin/env python3
"""Potting Shed Responsive QA: overlay behaviour on phones (Step 3).

Opens every menu, drawer, modal or panel listed in interactions.json with real taps and keys, then checks
what a person on a phone needs:

  fits        the overlay sits inside the screen, or scrolls inside itself
  close       a close control is on screen
  focus in    a modal moves focus inside itself when it opens
  locked      the page behind can't scroll while a modal or full-screen overlay is open
  esc         Esc closes it
  outside     a tap on empty space outside it closes it (when anything outside it is visible)
  focus back  focus returns to the control that opened it

In-page disclosures (an accordion row) are only checked for fit and a visible toggle.

    python3 overlays.py --base http://localhost:8090/ --interactions interactions.json
    python3 overlays.py --base URL --interactions interactions.json --sizes 390x844,280x653

Exits non-zero if any check fails. Needs Google Chrome."""
import argparse, json, sys, time, urllib.parse
from cdp import browser, size, go, SETTLE

STATE = r"""((scope, trig) => {
  const vis = e => !!e && e.checkVisibility({ opacityProperty: true, visibilityProperty: true }) && e.getBoundingClientRect().width > 0;
  const s = document.querySelector(scope); if (!s) return { found: false };
  const d = s.closest('dialog') || (s.tagName === 'DIALOG' ? s : null);
  const open = d ? d.open : vis(s);
  const r = s.getBoundingClientRect(), W = innerWidth, H = innerHeight;
  const scrolls = [s, ...s.querySelectorAll('*')].some(e => /(auto|scroll)/.test(getComputedStyle(e).overflowY) && e.scrollHeight > e.clientHeight + 1);
  let floating = !!d; for (let e = s; e && !floating; e = e.parentElement) floating = /fixed|absolute/.test(getComputedStyle(e).position);
  const fits = r.left >= -1 && r.right <= W + 1 && (!floating || (r.top >= -1 && r.bottom <= H + 1) || scrolls);   // in-page rows just grow the page
  const closers = [...s.querySelectorAll('button, a, [role=button]')].filter(b => /close|dismiss/i.test((b.getAttribute('aria-label') || '') + ' ' + b.textContent + ' ' + b.className) || /(^|[-_ ])x\b/.test(b.className));
  const t = window.__psqaTrig;
  if (t && t.getAttribute('aria-expanded') === 'true' && vis(t)) closers.push(t);          // a menu button that also closes the menu
  const onScreen = b => { const q = b.getBoundingClientRect(); return vis(b) && q.top >= 0 && q.bottom <= H && q.left >= 0 && q.right <= W; };
  const a = document.activeElement;
  // somewhere outside the overlay that isn't itself a control, for the outside tap
  const free = (x, y) => { if (x < 0 || y < 0 || x > W || y > H) return false; const e = document.elementFromPoint(x, y);
    if (d && e === d && (x < r.left || x > r.right || y < r.top || y > r.bottom)) return true;     // a modal's ::backdrop hit-tests as the dialog
    return !!e && !s.contains(e) && !e.closest('a, button, input, select, textarea, label, summary, [role=button], [tabindex]') && (!t || !t.contains(e)); };
  let outside = null;
  for (const [x, y] of [[12, H / 2], [W - 12, H / 2], [W / 2, H - 12], [W / 2, r.bottom + 30], [12, H - 12], [W - 12, H - 12], [W / 2, H / 2]]) if (free(x, y)) { outside = [x, y]; break; }
  return { found: true, modal: !!d && d.matches(':modal'), floating, open, fits, close: closers.some(onScreen), focusIn: !!a && s.contains(a),
           focusBack: !!t && (a === t || t.contains(a)), full: r.left <= 1 && r.right >= W - 1 && r.top <= 1 && r.bottom >= H - 1, outside,
           // the page can't scroll when the viewport's overflow (from html, or body when html is visible) is hidden or clip
           locked: /(hidden|clip)/.test(getComputedStyle(document.documentElement).overflowY !== 'visible' ? getComputedStyle(document.documentElement).overflowY : getComputedStyle(document.body).overflowY) };
})"""

PICK = r"""(sel => { const vis = e => e.checkVisibility({ opacityProperty: true, visibilityProperty: true }) && e.getBoundingClientRect().width > 0;
  const t = [...document.querySelectorAll(sel)].find(vis); window.__psqaTrig = t || null; if (!t) return null;
  t.scrollIntoView({ block: 'center' }); const r = t.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })"""


def tap(ws, x, y):
    for t in ('mousePressed', 'mouseReleased'):
        ws.call('Input.dispatchMouseEvent', type=t, x=x, y=y, button='left', clickCount=1)


def key(ws, k, code):
    for t in ('keyDown', 'keyUp'):
        ws.call('Input.dispatchKeyEvent', type=t, key=k, code=k, windowsVirtualKeyCode=code, nativeVirtualKeyCode=code)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--base', required=True)
    ap.add_argument('--interactions', required=True)
    ap.add_argument('--sizes', default='390x844')
    ap.add_argument('--hash', default='')
    ap.add_argument('--init-js', default=None)
    ap.add_argument('--port', type=int, default=9535)
    a = ap.parse_args()
    base = a.base if a.base.endswith('/') else a.base + '/'
    sizes = [tuple(int(x) for x in s.split('x')) for s in a.sizes.split(',')]
    cols = ['fits', 'close', 'focus in', 'locked', 'esc', 'outside', 'focus back']
    rows, failed = [], 0
    p, ws = browser(a.port, a.init_js)
    try:
        for it in json.load(open(a.interactions)):
            for w, h in sizes:
                url = urllib.parse.urljoin(base, it['page']) + a.hash
                st = lambda: ws.ev(f"({STATE})({json.dumps(it['scope'])})")
                def opened():
                    size(ws, w, h, True, dpr=2); go(ws, url, 0.8); ws.ev(SETTLE)
                    xy = ws.ev(f"({PICK})({json.dumps(it['click'])})")
                    if not xy:
                        return None
                    time.sleep(0.4); tap(ws, *xy); time.sleep(1.0)
                    return st()
                res = {}
                s = opened()
                if s is None:                                 # no visible trigger at this size (a burger on desktop): not applicable
                    rows.append((it['name'], f'{w}x{h}', {c: 'no trigger at this size' if c == 'fits' else '' for c in cols})); continue
                if not s.get('found') or not s.get('open'):
                    rows.append((it['name'], f'{w}x{h}', {c: 'did not open' if c == 'fits' else '' for c in cols})); failed += 1; continue
                res['fits'] = s['fits']; res['close'] = s['close']; res['focus in'] = s['focusIn'] if s['modal'] else None
                if not s['floating']:                         # an in-page disclosure (accordion row): only layout and its toggle apply
                    res.update({'locked': None, 'esc': None, 'outside': None, 'focus back': None})
                else:
                    res['locked'] = s['locked'] if s['modal'] or s['full'] else None   # only overlays that cover the page must lock it
                    key(ws, 'Escape', 27); time.sleep(1.0); s2 = st()
                    # an overlay that is removed from the page when it closes reports as not found: that is closed
                    res['esc'] = not s2.get('open', False); res['focus back'] = s2.get('focusBack') if res['esc'] else None
                    s = opened()                              # reopen for the outside tap
                    if s and s.get('open') and s['outside']:
                        tap(ws, *s['outside']); time.sleep(1.0); res['outside'] = not st().get('open', False)
                    else:
                        res['outside'] = None
                bad = [c for c in cols if res.get(c) is False]; failed += bool(bad)
                rows.append((it['name'], f'{w}x{h}', {c: ('yes' if res.get(c) else 'n/a' if res.get(c) is None else 'NO') for c in cols}))
    finally:
        p.terminate()
    print('| Overlay | Size | ' + ' | '.join(cols) + ' |')
    print('|---|---|' + '---|' * len(cols))
    for name, sz, r in rows:
        print(f'| {name} | {sz} | ' + ' | '.join(r[c] for c in cols) + ' |')
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
