#!/usr/bin/env python3
"""Potting Shed Responsive QA: full-page screenshots for the visual review.

Captures every page at the review sizes and lays each page's sizes side by side on one contact
sheet, so a designer can compare phone, tablet and desktop at a glance.

    python3 shots.py --base http://localhost:8090/ --pages index.html about.html --out qa-shots/
    python3 shots.py --base URL --pages index.html --sizes 390x844,768x1024,1440x900 --out qa-shots/

Default review sizes: 320x568, 390x844, 844x390 (phone landscape), 768x1024, 1024x768, 1440x900, 2560x1440.
Writes <out>/<page>@<size>.jpg (full page) and <out>/<page>-sheet.jpg (every size in a labelled 400px column).
Needs Google Chrome; Pillow (pip install pillow) for the contact sheets."""
import argparse, io, os, re, urllib.parse
from cdp import browser, size, go, SETTLE

REVIEW = [(320, 568), (390, 844), (844, 390), (768, 1024), (1024, 768), (1440, 900), (2560, 1440)]
COL = 400                      # sheet column width (px)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--base', required=True)
    ap.add_argument('--pages', nargs='+', required=True)
    ap.add_argument('--sizes', default='', help='e.g. 390x844,1440x900 (default: the review set)')
    ap.add_argument('--out', default='qa-shots')
    ap.add_argument('--init-js', default=None)
    ap.add_argument('--hash', default='')
    ap.add_argument('--max-height', type=int, default=16000, help='cap very long pages (px)')
    ap.add_argument('--sheet-height', type=int, default=8000, help='cut each sheet column at this height (px)')
    ap.add_argument('--port', type=int, default=9530)
    a = ap.parse_args()
    sizes = [tuple(int(x) for x in s.split('x')) for s in a.sizes.split(',')] if a.sizes else REVIEW
    os.makedirs(a.out, exist_ok=True)
    try:
        from PIL import Image, ImageDraw, ImageFont
    except ImportError:
        Image = None
    # Touch emulation can't be switched off within a browser, so phones and tablets get their own (as in audit.py)
    touch = lambda w, h: w < 1024 or min(w, h) <= 500
    browsers = {}
    try:
        for pg in a.pages:
            url = urllib.parse.urljoin(a.base if a.base.endswith('/') else a.base + '/', pg) + a.hash
            slug = re.sub(r'[^a-z0-9]+', '-', pg.lower()).strip('-') or 'home'
            files = []
            for w, h in sizes:
                t = touch(w, h)
                if t not in browsers:
                    browsers[t] = browser(a.port + t, a.init_js)
                ws = browsers[t][1]
                size(ws, w, h, t); go(ws, url, 0.8); ws.ev(SETTLE)
                full = min(a.max_height, int(ws.ev('Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)') or h))
                data = ws.shot(captureBeyondViewport=True, clip={'x': 0, 'y': 0, 'width': w, 'height': full, 'scale': 1})
                f = os.path.join(a.out, f'{slug}@{w}x{h}.jpg'); open(f, 'wb').write(data); files.append(f)
                print(f)
            if Image:
                # Every size in a labelled column of the same width, so phone and desktop compare at a glance.
                # Long pages are cut at --sheet-height; the full captures above hold the rest.
                cols = []
                for f, (w, h) in zip(files, sizes):
                    im = Image.open(f); im = im.resize((COL, max(1, round(im.height * COL / im.width))), Image.LANCZOS)
                    cols.append((im.crop((0, 0, COL, min(im.height, a.sheet_height))), f'{w}x{h}' + ('  (continues)' if im.height > a.sheet_height else '')))
                sheet = Image.new('RGB', (len(cols) * (COL + 24) - 24, 40 + max(c.height for c, _ in cols)), 'white')
                draw = ImageDraw.Draw(sheet); font = ImageFont.load_default(size=18) if hasattr(ImageFont, 'FreeTypeFont') else None
                for i, (im, lab) in enumerate(cols):
                    x = i * (COL + 24); draw.text((x + 2, 10), lab, fill=(60, 60, 60), font=font); sheet.paste(im, (x, 40))
                out = os.path.join(a.out, f'{slug}-sheet.jpg'); sheet.save(out, quality=82); print(out)
    finally:
        for p, _ in browsers.values():
            p.terminate()


if __name__ == '__main__':
    main()
