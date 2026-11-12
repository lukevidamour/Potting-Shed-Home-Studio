#!/usr/bin/env python3
"""Prepare library images for the web.
    python3 tools/images.py            TEKEX library (assets/photos, assets/graphics, assets/*.jpg)
    python3 tools/images.py assets/x   another folder (small versions only; originals are left alone)

For the built-in library every JPEG and PNG becomes a WebP of the same pixel size (about half the weight, no visible loss),
and every image gets a small version in a sm/ folder beside it. Tiles, thumbnails and pickers load the small version;
the editor and exports load the full one. Run it again after adding images: files already done are skipped.
"""
import os, sys
from PIL import Image

SMALL_EDGE = 720


def save_webp(im, path, q):
    alpha = im.mode in ('RGBA', 'LA', 'P')
    im = im.convert('RGBA' if alpha else 'RGB')
    im.save(path, 'WEBP', quality=q, method=6, alpha_quality=92 if alpha else 100)


def small(src, folder):
    out = os.path.join(folder, 'sm', os.path.splitext(os.path.basename(src))[0] + '.webp')
    if os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(src):
        return 0
    os.makedirs(os.path.dirname(out), exist_ok=True)
    im = Image.open(src)
    im.thumbnail((SMALL_EDGE, SMALL_EDGE), Image.LANCZOS)
    save_webp(im, out, 74)
    return os.path.getsize(out)


def run(folder, convert):
    before = after = sm = 0
    for name in sorted(os.listdir(folder)):
        path = os.path.join(folder, name)
        ext = os.path.splitext(name)[1].lower()
        if not os.path.isfile(path) or ext not in ('.jpg', '.jpeg', '.png', '.webp'):
            continue
        if convert and ext != '.webp':
            out = os.path.splitext(path)[0] + '.webp'
            before += os.path.getsize(path)
            save_webp(Image.open(path), out, 82 if ext != '.png' else 88)
            after += os.path.getsize(out)
            os.remove(path)
            path = out
        sm += small(path, folder)
    print(f'{folder}: full {before // 1024}KB -> {after // 1024}KB, small versions written {sm // 1024}KB')


if __name__ == '__main__':
    here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(here)
    if len(sys.argv) > 1:
        for f in sys.argv[1:]:
            run(f, False)
    else:
        run('assets/photos', True)
        run('assets/graphics', True)
        run('assets', False)
