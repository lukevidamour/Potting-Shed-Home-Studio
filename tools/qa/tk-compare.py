#!/usr/bin/env python3
"""Compare a rendered TEKEX design with the Figma frame it was rebuilt from.
    python3 tools/qa/tk-compare.py mine.png figma.png out.png [--mask x,y,w,h ...]
Writes one sheet: Figma | mine | the two laid over each other (Figma in red, mine in blue: purple where they agree), and
prints how many pixels differ, ignoring any masked boxes (photos that are meant to differ)."""
import sys
from PIL import Image, ImageChops, ImageDraw
a, f, out = sys.argv[1], sys.argv[2], sys.argv[3]
masks = [tuple(float(v) for v in m.split(',')) for m in sys.argv[sys.argv.index('--mask') + 1:]] if '--mask' in sys.argv else []
mine = Image.open(a).convert('RGB'); fig = Image.open(f).convert('RGB').resize(mine.size, Image.LANCZOS)
gm, gf = mine.convert('L'), fig.convert('L')
over = Image.merge('RGB', (gf.point(lambda v: 255 - v), Image.new('L', mine.size, 0), gm.point(lambda v: 255 - v)))
diff = ImageChops.difference(gm, gf).point(lambda v: 255 if v > 48 else 0)
for (x, y, w, h) in masks:
    ImageDraw.Draw(diff).rectangle([x, y, x + w, y + h], fill=0)
n = sum(1 for v in diff.getdata() if v)
W, H = mine.size; s = 520 / max(W, H)
sheet = Image.new('RGB', (int(W * s) * 3 + 20, int(H * s)), (40, 40, 40))
for i, im in enumerate([fig, mine, over]): sheet.paste(im.resize((int(W * s), int(H * s)), Image.LANCZOS), (i * (int(W * s) + 10), 0))
sheet.save(out)
print(f'{a.split("/")[-1]}: {n} pixels differ ({100 * n / (W * H):.2f}%)')
