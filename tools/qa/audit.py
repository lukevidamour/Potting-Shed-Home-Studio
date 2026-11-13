#!/usr/bin/env python3
"""Potting Shed Responsive QA: automated audit.

Loads every page at the standard device matrix in headless Chrome (2x density, touch on phones and tablets)
and checks what separates an excellent responsive site from one that merely works, plus how fast the first
screen appears on a mid-range phone. Standard library only; needs Google Chrome.

    python3 audit.py --base http://localhost:8090/                      # crawl from the homepage
    python3 audit.py --base http://localhost:8090/ --pages index.html about.html
    python3 audit.py --base URL --sizes phones                           # phones | tablets | desktops | quick | all
    python3 audit.py --base URL --ignore ".marquee, .ticker"             # decoration that overflows by design
    python3 audit.py --base URL --interactions interactions.json         # also audit opened menus and drawers
    python3 audit.py --base URL --report qa-report.md --json qa.json     # write the report and findings
    python3 audit.py --base URL --compare qa-first.json                  # before and after, against an earlier run

--init-js runs before each page's own scripts, for example to pass a review gate.
--hash appends a fragment to every URL (some builds use one for a still, animation-free mode).
--workers sets how many pages run in parallel (default 3); --no-perf skips the phone speed pass.

Exit status: 0 with no blockers or majors, 1 otherwise, 2 if a password panel stopped the run."""
import argparse, json, os, re, sys, time, urllib.parse
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from cdp import browser, size, go, SETTLE

MATRIX = {
    'phones': [(280, 653), (320, 568), (360, 640), (360, 800), (375, 667), (390, 844), (393, 852), (412, 915), (430, 932),
               (568, 320), (667, 375), (844, 390), (932, 430)],
    'tablets': [(600, 960), (768, 1024), (820, 1180), (1024, 768), (1024, 1366), (1180, 820), (1366, 1024)],
    'desktops': [(1280, 720), (1280, 800), (1366, 768), (1440, 900), (1536, 864), (1680, 1050), (1920, 1080), (2560, 1440), (3440, 1440)],
}
MATRIX['all'] = MATRIX['phones'] + MATRIX['tablets'] + MATRIX['desktops']
MATRIX['quick'] = [(280, 653), (320, 568), (390, 844), (844, 390), (768, 1024), (1024, 768), (1440, 900), (2560, 1440)]   # for fast iteration
TOUCH = set(MATRIX['phones'] + MATRIX['tablets'])           # phones and tablets are touch devices
is_touch = lambda w, h: (w, h) in TOUCH or w < 1024 or min(w, h) <= 500

SEVERITY = {
    'blocker': ['not-loaded', 'overflow', 'offscreen', 'text-overlap', 'clipped', 'fold', 'sticky-tall', 'img-broken',
                'img-distorted', 'ios-zoom', 'tap-small'],
    'major': ['spill', 'tiny-text', 'header-tall', 'video-heavy', 'page-weight', 'slow-load', 'layout-shift'],
    'polish': ['widow', 'img-soft', 'tap-tight', 'measure', 'small-body', 'load-time', 'small-shift'],
}
LEVEL = {t: lvl for lvl, ts in SEVERITY.items() for t in ts}
EXPLAIN = {
    'not-loaded': 'page failed to load or rendered empty',
    'overflow': 'the page scrolls sideways',
    'offscreen': 'an element pokes past the screen edge',
    'text-overlap': 'two pieces of text sit on top of each other',
    'clipped': 'text is cut off by a container that hides overflow',
    'fold': "the page's main headline (or primary button) starts below the first screen",
    'sticky-tall': 'a sticky element is taller than the screen, so part of it can never be seen',
    'img-broken': 'an image failed to load', 'img-distorted': 'an image is squashed or stretched',
    'ios-zoom': 'a form field under 16px on a phone: iOS zooms the page when it is tapped',
    'tap-small': 'a control smaller than 24x24px (WCAG 2.2 AA minimum)',
    'spill': 'a button or no-wrap line is too wide for its container at this size, so it runs into the padding or the page margin',
    'tiny-text': 'text under 12px', 'header-tall': 'a fixed or sticky header takes more than a quarter of a short screen',
    'video-heavy': 'a phone downloads a video wider than 1280px', 'page-weight': 'a phone downloads more than 3MB before scrolling',
    'widow': 'a headline or lead ends on one short word, under half the width of the line above', 'img-soft': 'a photo shown larger than its pixels on a 2x (retina) screen',
    'tap-tight': 'a control under 44x44px on a touch screen (Apple and Material guidance)',
    'measure': 'reading lines over 95 or under 22 characters', 'small-body': 'body copy under 15px on a phone',
    'slow-load': 'the main content takes over 4s to appear on a mid-range phone on 4G',
    'load-time': 'the main content takes 2.5-4s to appear on a mid-range phone on 4G (good is under 2.5s)',
    'layout-shift': 'content jumps while the page loads (layout shift over 0.25)',
    'small-shift': 'content shifts a little while the page loads (layout shift 0.1-0.25; good is under 0.1)',
}

HINT = {   # one line of what usually fixes it; references/fix-playbook.md has the detail
    'not-loaded': 'Check the URL and that the server is running; a password gate needs --init-js.',
    'overflow': 'Find the element wider than the screen: a fixed width, a no-wrap line, or a grid track that will not shrink (use minmax(0, 1fr)).',
    'offscreen': 'Same causes as overflow. Decoration that bleeds on purpose goes in --ignore, inside a parent with overflow: hidden.',
    'text-overlap': 'Usually absolute positioning or negative margins colliding at one size: give the element room, or restack it at that breakpoint.',
    'clipped': 'A box that hides overflow is too small for its text at this size: let it grow (min-height, not height) or tighten the type.',
    'fold': 'Trim the header top padding and min-height at this size; on landscape phones use a compact header under (max-height: 500px).',
    'sticky-tall': 'Only stick when it fits: turn position: sticky off under a max-height media query.',
    'img-broken': 'Check the file path and that the file was deployed.',
    'img-distorted': 'Add object-fit: cover (and an aspect-ratio on the frame), or set only width or height.',
    'ios-zoom': 'Give form fields font-size: max(16px, 1em) on phones.',
    'tap-small': 'Enlarge the hit area with padding, or an invisible ::after on touch screens.',
    'spill': 'Tighten the button or line at small sizes, use minmax(0, 1fr) grid tracks, or let display type follow the screen width (min(64px, 17vw)).',
    'tiny-text': 'Raise it to 12px or more.',
    'header-tall': 'Use a compact header on short landscape screens, or shrink it on scroll.',
    'video-heavy': 'Give phones a 720p file: <source src="film-720.mp4" media="(max-width: 900px)">.',
    'page-weight': 'Lazy-load everything below the first screen; lighter first-screen images and a 720p phone film.',
    'slow-load': 'Find the largest first-screen image or poster: preload it, give it fetchpriority="high", never lazy-load it, and serve a phone-sized file.',
    'load-time': 'As slow-load: make the first-screen image smaller and load it first.',
    'layout-shift': 'Give every image, video and embed width and height (or an aspect-ratio), and reserve space for anything injected late.',
    'small-shift': 'As layout-shift; web fonts swapping in can also nudge text (size-adjust on the fallback font).',
    'widow': 'text-wrap: balance on headings and short leads; on small phones let display type follow the screen width.',
    'img-soft': 'Serve a bigger file through srcset, and make sizes match how wide the image really shows (crops show wider than the screen).',
    'tap-tight': 'On touch screens grow the hit area to 44px: padding for stacked links, an invisible ::after for inline ones.',
    'measure': 'Cap paragraphs at 32-38em, or let a narrow column span wider at this size.',
    'small-body': 'Body copy on phones at 15px or more.',
}

IGNORE_DEFAULT = ('dialog:not([open]), [hidden], [aria-hidden="true"], svg, video, iframe, canvas, '
                  '.sr-only, .visually-hidden, .screen-reader-text')

CHECKS = r"""(async (IGN, SCOPE, TOUCH) => {
const root = (SCOPE && document.querySelector(SCOPE)) || document.body;
const W = innerWidth, H = innerHeight, DPR = 2, touch = TOUCH;
const cs = el => getComputedStyle(el);
const ign = el => !!el.closest(IGN);
const vis = el => { if (el.checkVisibility && !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false;
  const s = cs(el); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false; const r = el.getBoundingClientRect();
  if (r.width <= 1 && r.height <= 1 && s.overflow === 'hidden') return false;   // screen-reader-only text: there for assistive tech, not on screen
  return r.width > 0 && r.height > 0; };
// Ancestors that clip el, per axis. Hidden or clip overflow clips that axis. A scroll container ends the search on its axis:
// what's inside can be scrolled into view, so with scroller set it counts only as the visible window.
const clips = (el, scroller) => { const l = []; let p = el.parentElement, sx = false, sy = false;
  while (p && p !== document.documentElement && !(sx && sy)) { const s = cs(p), hx = /(hidden|clip)/.test(s.overflowX), hy = /(hidden|clip)/.test(s.overflowY),
    ax = /(auto|scroll)/.test(s.overflowX), ay = /(auto|scroll)/.test(s.overflowY), x = !sx && (hx || (scroller && ax)), y = !sy && (hy || (scroller && ay));
    if (x || y) l.push({ p, x, y }); if (ax) sx = true; if (ay) sy = true; p = p.parentElement; } return l; };
const shown = (r, el) => { let L = r.left, T = r.top, R = r.right, B = r.bottom; for (const { p, x, y } of clips(el, true)) { const q = p.getBoundingClientRect();
  if (x) { L = Math.max(L, q.left); R = Math.min(R, q.right); } if (y) { T = Math.max(T, q.top); B = Math.min(B, q.bottom); } if (R <= L || B <= T) return null; }
  return { left: L, top: T, right: R, bottom: B, width: R - L, height: B - T }; };
const name = el => { if (!el) return ''; let s = el.tagName.toLowerCase(); if (el.id) s += '#' + el.id; if (el.classList.length) s += '.' + [...el.classList].slice(0, 3).join('.');
  const p = el.parentElement && el.parentElement.closest('section, header, footer, article, dialog, aside, nav, main > *');
  if (p) s = (p.id ? '#' + p.id : p.tagName.toLowerCase() + (p.classList.length ? '.' + [...p.classList].slice(0, 2).join('.') : '')) + ' > ' + s; return s; };
const txt = el => (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 48);
const out = []; const add = (type, el, msg) => out.push({ type, el: name(el), msg });
if (document.documentElement.scrollWidth > W + 1) add('overflow', null, `page is ${document.documentElement.scrollWidth}px wide on a ${W}px screen`);
const all = [...root.querySelectorAll('*')].filter(el => !ign(el));
all.forEach(el => { if (!vis(el) || cs(el).position === 'fixed') return; const r = el.getBoundingClientRect(); if (r.right > W + 1 || r.left < -1) { const v = shown(r, el); if (v && (v.right > W + 1 || v.left < -1)) add('offscreen', el, `${Math.round(r.left)}..${Math.round(r.right)}px`); } });
all.forEach(el => { const pa = el.parentElement; if (!pa || !vis(el)) return; const s = cs(el), ps = cs(pa); if (/absolute|fixed/.test(s.position)) return;
  const r = el.getBoundingClientRect();
  if (/flex|grid/.test(ps.display) && !/(auto|scroll)/.test(ps.overflowX) && parseFloat(s.marginLeft) >= 0 && parseFloat(s.marginRight) >= 0) {   // an item too wide for its row
    const q = pa.getBoundingClientRect(), cr = q.right - parseFloat(ps.borderRightWidth) - parseFloat(ps.paddingRight), cl = q.left + parseFloat(ps.borderLeftWidth) + parseFloat(ps.paddingLeft);
    const over = Math.max(r.right - cr, cl - r.left); if (over > 2) { add('spill', el, `runs ${Math.round(over)}px past the inside edge of ${name(pa)}`); return; } }
  if (/nowrap|pre/.test(s.whiteSpace) && !/inline$/.test(s.display) && s.overflowX === 'visible' && el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0)   // no-wrap text wider than its box
    add('spill', el, `no-wrap text runs ${el.scrollWidth - el.clientWidth}px past its box`); });
const textEls = all.filter(el => vis(el) && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()));
textEls.forEach(el => { const fs = parseFloat(cs(el).fontSize); if (fs < 12) add('tiny-text', el, `${fs}px "${txt(el)}"`); });
if (W < 768) root.querySelectorAll('p').forEach(el => { if (ign(el) || !vis(el) || el.textContent.trim().length < 120) return; const fs = parseFloat(cs(el).fontSize); if (fs < 15) add('small-body', el, `${fs}px paragraph`); });
const taps = [];
all.filter(el => el.matches('a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button]') && vis(el)).forEach(el => {
  if (el.matches('input[type=radio], input[type=checkbox]')) return;
  if (el.matches('a') && cs(el).display === 'inline' && el.closest('p, li, dd, dt, td')) return;   // inline links in running text are exempt
  const r = el.getBoundingClientRect(); if (Math.min(r.width, r.height) < (touch ? 44 : 24)) taps.push(el);
});
root.querySelectorAll('label').forEach(l => { if (!l.querySelector('input[type=radio], input[type=checkbox]') || ign(l) || !vis(l)) return; const r = l.getBoundingClientRect(); if (Math.min(r.width, r.height) < (touch ? 44 : 24)) taps.push(l); });
const boxes = [];
textEls.forEach(el => { const fs = parseFloat(cs(el).fontSize); [...el.childNodes].forEach(n => { if (n.nodeType !== 3 || !n.textContent.trim()) return; const rg = document.createRange(); rg.selectNodeContents(n);
  [...rg.getClientRects()].forEach(r => { if (r.width > 1 && r.height > 1) { const v = shown(r, el); if (!v) return; const k = Math.min(0.18 * fs, v.height * 0.3);
    boxes.push({ el, r, fs, v: { left: v.left, right: v.right, top: v.top + k, bottom: v.bottom - k, width: v.width, height: Math.max(1, v.height - 2 * k) } }); } }); }); });
const seen = new Set();
for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
  const a = boxes[i], b = boxes[j]; if (a.el === b.el || a.el.contains(b.el) || b.el.contains(a.el)) continue;
  // text inside an open modal dialog sits over the page, which is dimmed and inert behind it: not a collision
  { const ma = a.el.closest('[aria-modal="true"]'), mb = b.el.closest('[aria-modal="true"]'); if (ma !== mb && (ma || mb)) continue; }
  const ox = Math.min(a.v.right, b.v.right) - Math.max(a.v.left, b.v.left), oy = Math.min(a.v.bottom, b.v.bottom) - Math.max(a.v.top, b.v.top);
  if (ox > 2 && oy > Math.min(a.v.height, b.v.height) * 0.35) { const k = name(a.el) + '|' + name(b.el); if (!seen.has(k)) { seen.add(k); add('text-overlap', a.el, `"${txt(a.el)}" overlaps ${name(b.el)} "${txt(b.el)}"`); } } }
const clipSeen = new Set();
boxes.forEach(({ el, r, fs }) => { const tol = 0.25 * fs; for (const { p, x, y } of clips(el)) { const q = p.getBoundingClientRect();
  if ((x && (r.left < q.left - 1 || r.right > q.right + 1)) || (y && (r.top < q.top - tol || r.bottom > q.bottom + tol))) { const k = name(el); if (!clipSeen.has(k)) { clipSeen.add(k); add('clipped', el, `"${txt(el)}" cut off by ${name(p)}`); } break; } } });
root.querySelectorAll('h1, h2, h3, blockquote, [class*=lead], [class*=hero] p').forEach(el => {
  if (ign(el) || !vis(el)) return; const blocks = new Map(); let seg = 0; const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT); let n;
  const blockOf = t => { let e = t.parentElement; while (e && e !== el) { if (!/^(inline|contents)/.test(cs(e).display)) return e; e = e.parentElement; } return el; };   // each block wraps on its own
  while ((n = w.nextNode())) { if (n.nodeType === 1) { if (n.tagName === 'BR') seg++; continue; } const blk = blockOf(n);
    const re = /\S+/g; let m; while ((m = re.exec(n.textContent))) { const rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length); const rr = rg.getClientRects();
      if (rr.length) { if (!blocks.has(blk)) blocks.set(blk, []); blocks.get(blk).push({ w: m[0], seg, top: Math.round(rr[rr.length - 1].top), l: rr[0].left, r: rr[rr.length - 1].right }); } } }
  for (const words of blocks.values()) { if (words.length < 3) continue; const lines = [];
    words.forEach(x => { const L = lines.find(l => Math.abs(l.top - x.top) < 6); if (L) { L.n++; L.l = Math.min(L.l, x.l); L.r = Math.max(L.r, x.r); } else lines.push({ top: x.top, n: 1, l: x.l, r: x.r }); });
    lines.sort((a, b) => a.top - b.top); if (lines.length < 2) continue;
    const last = lines[lines.length - 1], above = lines[lines.length - 2], lw = words[words.length - 1], ratio = (last.r - last.l) / Math.max(1, above.r - above.l);
    if (last.n !== 1 || words.filter(x => x.seg === lw.seg).length === 1) continue;          // a word set on its own line with <br> is deliberate
    if (ratio < 0.5) add('widow', el, `"${lw.w}" alone on the last of ${lines.length} lines (${Math.round(ratio * 100)}% of the line above)`); } });
const filePx = src => new Promise(res => { const im = new Image(); im.onload = () => res([im.naturalWidth, im.naturalHeight]); im.onerror = () => res(null); im.src = src; });   // no srcset, so 1 image pixel = 1 px
for (const img of root.querySelectorAll('img')) { if (!vis(img)) continue; const r = img.getBoundingClientRect();
  if (!img.naturalWidth) { if (img.complete) add('img-broken', img, img.currentSrc || img.src); continue; }
  const src = img.currentSrc || img.src; if (/\.svg(\?|$)/i.test(src)) continue;
  const px = (await filePx(src)) || [img.naturalWidth, img.naturalHeight], fit = cs(img).objectFit; let need;
  if (fit === 'cover') need = Math.max(r.width / px[0], r.height / px[1]);
  else if (fit === 'contain' || fit === 'scale-down') need = Math.min(r.width / px[0], r.height / px[1]);
  else { need = r.width / px[0]; const a1 = r.width / r.height, a2 = px[0] / px[1]; if (Math.abs(a1 / a2 - 1) > 0.03) add('img-distorted', img, `shown at ${a1.toFixed(2)}:1, image is ${a2.toFixed(2)}:1`); }
  if (need * DPR > 1.2) add('img-soft', img, `${src.split('/').pop().split('?')[0]} (${px[0]}px wide) shown at ${(need * DPR).toFixed(2)}x its pixels on a 2x screen; sharp needs about ${Math.ceil(px[0] * need * DPR / 100) * 100}px`); }
if (W < 768 || (touch && H < 500)) root.querySelectorAll('input, textarea, select').forEach(i => { if (['hidden', 'radio', 'checkbox'].includes(i.type) || ign(i) || !vis(i)) return; const fs = parseFloat(cs(i).fontSize); if (fs < 16) add('ios-zoom', i, `${fs}px field`); });
const h1 = [...root.querySelectorAll('h1')].find(h => vis(h) && !ign(h));
if (h1) { const b = h1.getBoundingClientRect().top + Math.min(h1.getBoundingClientRect().height, parseFloat(cs(h1).lineHeight) || 60); if (b > H) add('fold', h1, `headline's first line ends at ${Math.round(b)}px on a ${H}px screen`); }
all.forEach(el => { const s = cs(el); if (!vis(el)) return; const r = el.getBoundingClientRect();
  if (s.position === 'sticky') { const top = parseFloat(s.top) || 0; if (r.height + top > H + 1) add('sticky-tall', el, `${Math.round(r.height)}px tall + ${Math.round(top)}px offset on a ${H}px screen`); }
  // a full-screen dialog is not a header: it is meant to cover the page, and closes
  if ((s.position === 'fixed' || s.position === 'sticky') && r.top <= 1 && r.width > W * 0.6 && H < 560 && !el.parentElement.closest('[style*=fixed]') && !el.matches('dialog,[role=dialog],[aria-modal=true]') && !el.querySelector('[role=dialog],[aria-modal=true]')) {
    let y = 0; for (; y < H; y += 4) { const e = document.elementFromPoint(W / 2, y); if (!e || !el.contains(e)) break; }    // what the header really covers
    if (y > H * 0.25) add('header-tall', el, `covers the top ${y}px of a ${H}px screen`); } });
root.querySelectorAll('p, li, dd').forEach(el => { if (ign(el) || !vis(el) || el.querySelector('p, div, h1, h2, h3, h4, ul, ol, dl, figure')) return;
  const fs = parseFloat(cs(el).fontSize); if (fs < 15 || fs > 26) return; const t = el.textContent.trim(); if (t.length < 140) return;
  const rg = document.createRange(); rg.selectNodeContents(el); const lines = new Set([...rg.getClientRects()].filter(r => r.width > 2).map(r => Math.round(r.top / 4))).size; if (!lines) return;
  const cpl = t.length / lines; if (cpl > 95) add('measure', el, `${Math.round(cpl)} characters per line (long)`); else if (W >= 360 && cpl < 22) add('measure', el, `${Math.round(cpl)} characters per line (short)`); });
if (W <= 900) root.querySelectorAll('video').forEach(v => { if (v.videoWidth > 1280) add('video-heavy', v, `${v.videoWidth}px video: ${(v.currentSrc || '').split('/').pop().split('?')[0]}`); });
const reach = el => { const keep = []; for (let p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) { const s = cs(p); keep.push([p, /(hidden|clip)/.test(s.overflowY) && p.scrollTop, /(hidden|clip)/.test(s.overflowX) && p.scrollLeft]); }
  el.scrollIntoView({ block: 'center', inline: 'nearest' }); keep.forEach(([p, t, l]) => { if (t !== false) p.scrollTop = t; if (l !== false) p.scrollLeft = l; });   /* scroll the page, never a clipping box */
  const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const own = e => !!e && (e === el || el.contains(e) || (el.htmlFor && e.id === el.htmlFor)); const probe = (dx, dy) => { let d = 0; for (let i = 1; i <= 40; i++) { if (own(document.elementFromPoint(cx + dx * i, cy + dy * i))) d = i; else break; } return d; };
  if (!own(document.elementFromPoint(cx, cy))) return { w: r.width, h: r.height }; return { w: probe(-1, 0) + probe(1, 0) + 1, h: probe(0, -1) + probe(0, 1) + 1 }; };
taps.forEach(el => { const t = reach(el), m = Math.min(t.w, t.h), label = txt(el) || el.getAttribute('aria-label') || '';
  if (m < 24) add('tap-small', el, `${Math.round(t.w)}x${Math.round(t.h)}px tappable "${label}"`); else if (touch && m < 44) add('tap-tight', el, `${Math.round(t.w)}x${Math.round(t.h)}px tappable "${label}"`); });
window.scrollTo(0, 0);
return out;
})"""

WEIGHT = """(() => { const n = performance.getEntriesByType('navigation')[0]; let t = n ? (n.transferSize || n.encodedBodySize || 0) : 0;
  performance.getEntriesByType('resource').forEach(r => t += (r.transferSize || r.encodedBodySize || 0)); return t; })()"""

# Largest contentful paint and layout shift from a cold, throttled load (Lighthouse's mobile profile: 150ms, 1.6Mbps, 4x CPU)
PERF = """(async () => { const seen = (type, fn) => new Promise(res => { try { new PerformanceObserver(l => l.getEntries().forEach(fn)).observe({ type, buffered: true }); } catch (e) {} setTimeout(res, 300); });
  let lcp = 0, cls = 0, el = '';
  await seen('largest-contentful-paint', e => { if (e.startTime >= lcp) { lcp = e.startTime; const t = e.element;
    el = (t ? t.tagName.toLowerCase() + (typeof t.className === 'string' && t.className.trim() ? '.' + t.className.trim().split(/\\s+/).slice(0, 2).join('.') : '') : '') + (e.url ? ' ' + e.url.split('/').pop().split('?')[0] : ''); } });
  await seen('layout-shift', e => { if (!e.hadRecentInput) cls += e.value; });
  return { lcp, cls, el }; })()"""

# A password panel covering the page: the audit would measure the panel, not the site
GATE = """(() => { const pw = [...document.querySelectorAll('input[type=password]')].find(e => e.checkVisibility() && e.getBoundingClientRect().width > 0); if (!pw) return false;
  for (let e = pw.parentElement; e && e !== document.documentElement; e = e.parentElement) { const s = getComputedStyle(e), r = e.getBoundingClientRect();
    if (/fixed|absolute/.test(s.position) && r.width * r.height > innerWidth * innerHeight * 0.6) return true; } return false; })()"""


def crawl(ws, base, limit):
    """Same-site pages linked from the homepage (and from those pages), up to limit."""
    origin = urllib.parse.urlsplit(base)
    found, queue = [], [base]
    while queue and len(found) < limit:
        url = queue.pop(0)
        if url in found:
            continue
        go(ws, url, 0.6)
        found.append(url)
        links = ws.ev("[...document.querySelectorAll('a[href]')].map(a => a.href)") or []
        for h in links:
            u = urllib.parse.urlsplit(h)
            if u.netloc != origin.netloc or not u.path.startswith(origin.path) or re.search(r'\.(pdf|jpe?g|png|svg|zip|mp4)$', u.path, re.I):
                continue
            clean = urllib.parse.urlunsplit((u.scheme, u.netloc, u.path, '', ''))
            if clean not in found and clean not in queue:
                queue.append(clean)
    return found


def audit_pages(base, urls, sizes, a, ignore, port, interactions):
    """Audit urls at sizes in this worker's own browsers (one for mouse sizes, one for touch). Returns (found, loads)."""
    found = defaultdict(lambda: defaultdict(set)); loads = 0
    label = lambda u: urllib.parse.urlsplit(u).path[len(urllib.parse.urlsplit(base).path):] or '/'
    groups = [(False, [s for s in sizes if not is_touch(*s)]), (True, [s for s in sizes if is_touch(*s)])]
    for gi, (touch, group) in enumerate(groups):
        if not group and not (touch and interactions):
            continue
        p, ws = browser(port + gi, a.init_js)
        try:
            if touch and group:
                ws.call('Network.enable'); ws.call('Network.setCacheDisabled', cacheDisabled=True)
                size(ws, 390, 844, True, dpr=2)
                for u in urls:                            # page weight on a phone, cold cache, before any scrolling
                    go(ws, u + a.hash, 2.0)
                    kb = (ws.ev(WEIGHT) or 0) / 1024
                    if kb > 3072:
                        found['page-weight'][(label(u), '', f'{kb / 1024:.1f}MB before scrolling at 390x844')].add('390x844')
                if a.perf:                                # how fast the first screen appears on a mid-range phone on 4G
                    ws.call('Network.emulateNetworkConditions', offline=False, latency=150, downloadThroughput=1.6e6 / 8, uploadThroughput=7.5e5 / 8)
                    ws.call('Emulation.setCPUThrottlingRate', rate=4)
                    for u in urls:
                        if any(x and x in u for x in a.no_perf_for.split(',')):
                            continue                      # a state opened by a tap, not a page anyone lands on: layout only
                        go(ws, u + a.hash, 1.5, limit=30)
                        m = ws.ev(PERF) or {}
                        lcp, cls, el = (m.get('lcp') or 0) / 1000, m.get('cls') or 0, m.get('el') or ''
                        if lcp > 4: found['slow-load'][(label(u), el, f'{lcp:.1f}s to the largest first-screen element')].add('390x844')
                        elif lcp > 2.5: found['load-time'][(label(u), el, f'{lcp:.1f}s to the largest first-screen element')].add('390x844')
                        if cls > 0.25: found['layout-shift'][(label(u), '', f'layout shift {cls:.2f} while loading')].add('390x844')
                        elif cls > 0.1: found['small-shift'][(label(u), '', f'layout shift {cls:.2f} while loading')].add('390x844')
                    ws.call('Emulation.setCPUThrottlingRate', rate=1)
                    ws.call('Network.emulateNetworkConditions', offline=False, latency=0, downloadThroughput=-1, uploadThroughput=-1)
                ws.call('Network.setCacheDisabled', cacheDisabled=False)
            checks = f'({CHECKS})({json.dumps(ignore)}, null, {json.dumps(touch)})'
            for u in urls:
                for w, h in group:
                    size(ws, w, h, touch, dpr=2)
                    go(ws, u + a.hash, 0.8)
                    ok = ws.ev("document.readyState === 'complete' && document.body && document.body.innerText.trim().length > 40")
                    if not ok:
                        found['not-loaded'][(label(u), '', '')].add(f'{w}x{h}'); continue
                    ws.ev(SETTLE)
                    for f in ws.ev(checks) or []:
                        keep_msg = f['type'] in ('overflow', 'fold', 'sticky-tall', 'ios-zoom', 'video-heavy', 'header-tall')
                        found[f['type']][(label(u), f['el'], f['msg'] if keep_msg else f['msg'].split(' (')[0][:90])].add(f'{w}x{h}')
                    loads += 1
            if touch:                                     # overlays, opened, at every phone size
                for it in interactions:
                    u = urllib.parse.urljoin(base, it['page'])
                    for w, h in [s for s in sizes if s[0] < 768] or [(390, 844)]:
                        size(ws, w, h, True, dpr=2); go(ws, u + a.hash, 0.8); ws.ev(SETTLE)
                        ws.ev(f"(async () => {{ const all = [...document.querySelectorAll({json.dumps(it['click'])})], b = all.find(e => e.checkVisibility()) || all[0]; if (b) b.click(); await new Promise(r => setTimeout(r, 900)); }})()")
                        scoped = f"({CHECKS})({json.dumps(ignore)}, {json.dumps(it.get('scope'))}, true)"
                        for f in ws.ev(scoped) or []:
                            found[f['type']][(label(u) + ' [' + it.get('name', it['click']) + ']', f['el'], f['msg'][:90])].add(f'{w}x{h}')
        finally:
            p.terminate()
    return found, loads


def group_rows(items, npages):
    """Rows for the report: an element that fails on most pages becomes one site-wide row."""
    by = defaultdict(dict)
    for (pg, el, msg), szs in items.items():
        by[(el, msg)][pg] = szs
    rows = []
    for (el, msg), pages in by.items():
        if len(pages) >= 3 and len(pages) >= npages / 2 and el:
            rows.append((f'site-wide ({len(pages)} of {npages} pages)', el, msg, set().union(*pages.values())))
        else:
            rows += [(pg, el, msg, szs) for pg, szs in pages.items()]
    return sorted(rows, key=lambda r: (not r[0].startswith('site-wide'), r[0], -len(r[3])))


def where(szs):
    s = sorted(szs, key=lambda x: (int(x.split('x')[0]), int(x.split('x')[1])))
    return ', '.join(s) if len(s) <= 6 else f'{len(s)} sizes, {s[0]} to {s[-1]}'


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--base', required=True, help='site root, e.g. http://localhost:8090/')
    ap.add_argument('--pages', nargs='*', help='paths relative to --base (default: crawl from the homepage)')
    ap.add_argument('--max-pages', type=int, default=30)
    ap.add_argument('--sizes', default='all', help='phones | tablets | desktops | quick | all | a list like 390x844,1440x900')
    ap.add_argument('--ignore', default='', help='extra CSS selectors for decoration that overflows by design (marquees, bleeding art)')
    ap.add_argument('--init-js', default=None, help='JavaScript run before page scripts (e.g. to pass a review gate)')
    ap.add_argument('--hash', default='', help='fragment appended to every URL, e.g. "#still"')
    ap.add_argument('--interactions', help='JSON list of {"page", "click", "scope"} overlays to audit when open')
    ap.add_argument('--no-perf', dest='perf', action='store_false', help='skip the throttled phone speed pass')
    ap.add_argument('--no-perf-for', default='', help='comma-separated URL fragments whose pages skip the speed pass (states reached by a tap rather than by landing on an address)')
    ap.add_argument('--workers', type=int, default=3, help='pages audited in parallel (each worker runs two headless Chromes)')
    ap.add_argument('--compare', help='an earlier --json file: the report lists what was fixed, what is new and what is still open')
    ap.add_argument('--report', help='write a Markdown report here')
    ap.add_argument('--json', help='write machine-readable findings here')
    ap.add_argument('--port', type=int, default=9520)
    a = ap.parse_args()
    base = a.base if a.base.endswith('/') else a.base + '/'
    sizes = MATRIX.get(a.sizes) or [tuple(int(x) for x in s.split('x')) for s in a.sizes.split(',')]
    ignore = IGNORE_DEFAULT + (', ' + a.ignore if a.ignore else '')
    interactions = json.load(open(a.interactions)) if a.interactions else []
    t0 = time.time()

    p, ws = browser(a.port + 40, a.init_js)              # find the pages, and make sure no password panel is in the way
    try:
        size(ws, 1440, 900, False)
        urls = [urllib.parse.urljoin(base, x) for x in a.pages] if a.pages else crawl(ws, base, a.max_pages)
        go(ws, urls[0] + a.hash, 1.0)
        gated = ws.ev(GATE)
    finally:
        p.terminate()
    if gated:
        print(f'STOPPED: a password panel covers {urls[0]}, so the audit would measure the panel, not the site.\n'
              'Either audit the ungated build (usually the local dev server), or pass the gate with --init-js: JavaScript that\n'
              'stores what the gate remembers after a correct password, e.g. --init-js "localStorage.setItem(\'<key>\', \'<value>\')".\n'
              'Find the key in the gate script (search it for localStorage or document.cookie).', file=sys.stderr)
        return 2

    found = defaultdict(lambda: defaultdict(set)); loads = 0
    n = max(1, min(a.workers, len(urls)))
    chunks = [urls[i::n] for i in range(n)]
    with ThreadPoolExecutor(n) as pool:
        jobs = [pool.submit(audit_pages, base, chunk, sizes, a, ignore, a.port + 2 * i, interactions if i == 0 else []) for i, chunk in enumerate(chunks)]
        for j in jobs:
            f, l = j.result(); loads += l
            for t, items in f.items():
                for k, szs in items.items():
                    found[t][k] |= szs

    npages = len(urls)
    label = lambda u: urllib.parse.urlsplit(u).path[len(urllib.parse.urlsplit(base).path):] or '/'
    rows = {t: group_rows(items, npages) for t, items in found.items()}
    counts = {lvl: sum(len(rows[t]) for t in ts if t in rows) for lvl, ts in SEVERITY.items()}
    keyset = {(t, pg, el, msg) for t, items in found.items() for (pg, el, msg) in items}
    lines = ['# Responsive QA report', '',
             f'{npages} pages x {len(sizes)} device sizes = {loads} page loads at 2x density, {time.strftime("%d %b %Y %H:%M")}, '
             f'{(time.time() - t0) / 60:.0f} min' + ('; phone speed measured on a throttled 4G mid-range profile (lab figures)' if a.perf else ''), '']
    old = None
    if a.compare:
        raw = json.load(open(a.compare)); old_f = raw['findings'] if isinstance(raw, dict) else raw
        old = {(f['type'], f['page'], f['element'], f['message']) for f in old_f}
        old_counts = {lvl: 0 for lvl in SEVERITY}
        old_found = defaultdict(lambda: defaultdict(set))
        for f in old_f:
            old_found[f['type']][(f['page'], f['element'], f['message'])] = set(f['sizes'])
        for t, items in old_found.items():
            old_counts[LEVEL.get(t, 'polish')] += len(group_rows(items, npages))
        lines += ['| Severity | Before | Now | Bar |', '|---|---|---|---|',
                  f"| Blocker | {old_counts['blocker']} | {counts['blocker']} | must be 0 |",
                  f"| Major | {old_counts['major']} | {counts['major']} | must be 0 before client review |",
                  f"| Polish | {old_counts['polish']} | {counts['polish']} | 0, or each one justified, for a world-class finish |", '']
        # only call something fixed if this run looked again: same page, and at least one of the sizes it failed at
        run_pages = {label(u) for u in urls}; run_sizes = {f'{w}x{h}' for w, h in sizes}
        retested = {k for k in old if k[1].split(' [')[0] in run_pages and (old_found[k[0]][k[1:]] & run_sizes or k[0] in ('page-weight', 'slow-load', 'load-time', 'layout-shift', 'small-shift'))}
        fixed = sorted(retested - keyset); new = sorted(keyset - old)
        lines.append(f'Compared with {os.path.basename(a.compare)}: {len(fixed)} fixed, {len(new)} new, {len(keyset & old)} still open'
                     + (f', {len(old - retested)} not re-tested (other pages or sizes)' if old - retested else '') + ' (counted per page).')
        for title, ks in (('New since last run', new), ('Fixed since last run', fixed)):
            if ks:
                lines += ['', f'### {title}'] + [f'- {t}: `{pg}` {el} {msg}' for t, pg, el, msg in ks[:40]] + ([f'- …and {len(ks) - 40} more'] if len(ks) > 40 else [])
        lines.append('')
    else:
        lines += ['| Severity | Issues | Bar |', '|---|---|---|',
                  f"| Blocker | {counts['blocker']} | must be 0 |", f"| Major | {counts['major']} | must be 0 before client review |",
                  f"| Polish | {counts['polish']} | 0, or each one justified, for a world-class finish |", '']
    for lvl in ('blocker', 'major', 'polish'):
        for t in SEVERITY[lvl]:
            if t not in rows:
                continue
            lines += [f'## {lvl.title()}: {t} ({len(rows[t])}): {EXPLAIN[t]}', f'*Fix:* {HINT.get(t, "see references/fix-playbook.md")}', '']
            lines += [f'- `{pg}` {el} {msg} ({where(szs)})' for pg, el, msg, szs in rows[t]]
            lines.append('')
    verdict = 'FAIL: blockers remain' if counts['blocker'] else 'FAIL: majors remain' if counts['major'] else 'PASS' + (' (polish to review)' if counts['polish'] else '')
    lines.insert(2, f'**{verdict}**')
    lines.insert(3, '')
    text = '\n'.join(lines)
    print(text)
    if a.report:
        open(a.report, 'w').write(text + '\n')
    if a.json:
        json.dump({'meta': {'base': base, 'pages': [urllib.parse.urlsplit(u).path for u in urls], 'sizes': [f'{w}x{h}' for w, h in sizes],
                            'date': time.strftime('%Y-%m-%d %H:%M'), 'counts': counts},
                   'findings': [{'type': t, 'severity': LEVEL.get(t, 'polish'), 'page': pg, 'element': el, 'message': msg, 'sizes': sorted(szs)}
                                for t, items in found.items() for (pg, el, msg), szs in items.items()]}, open(a.json, 'w'), indent=1)
    return 1 if counts['blocker'] or counts['major'] else 0


if __name__ == '__main__':
    sys.exit(main())
