# TEKEX template pack

The TEKEX templates in Home Studio, rebuilt from TEKEX's social media toolkit and published posts in Figma.

- `pack.js`: the engine. It holds the design space, the drawing kit, the shared frame (top bar and footer) and the
  registry. Change it only to add something every template needs.
- `t-<name>.js`: one template each. A part calls `HS_TEKEX.add({ tpl, fields, examples, slots, fill, build })`.
- `templates.html`: the one generic piece of markup that draws any part's element list. Parts never edit it.
- `examples.js`: the example designs (`HS_TEKEX.seed`) that fill All designs and Drafts on a first visit and that "Bring
  back the examples" restores. Their ready-made thumbnails are `assets/seed/tk-NN.webp`: after changing the examples or a
  template they use, run `python3 tools/seed_thumbs.py tekex assets/seed/tk-` and set `seedThumbs.n` to the count.
- `library/`: TEKEX's media library (`manifest.json`), from its Figma files and tekex.co.
- `marks/` (SVG, drawn in the ink colour through a mask), `shapes/` (brand pictures such as the ribbon and 3D shapes),
  `logos/` (sponsor and sub-brand logos as SVG).

`t-speaker.js` is the reference part: read it before writing another.

## The design space

`build(d, K, G)` draws in design pixels and the frame is scaled to the export size.

| Format | Export | Design space | Family |
|---|---|---|---|
| Square | 1080 x 1080 | 1080 x 1080 | `G.square` |
| Portrait 4:5 | 1080 x 1350 | 1080 x 1350 | tall, `G.portrait` |
| Story 9:16 | 1080 x 1920 | 1080 x 1920 | tall, `G.story` |
| LinkedIn | 1200 x 627 | 1200 x 627 | `G.wide` |
| Landscape 16:9 | 1920 x 1080 | 1114.7 x 627 | `G.wide`, `G.X = -85.3` |

- Square and LinkedIn are drawn from the Figma measurements, to the pixel.
- Tall frames grow from the square. TEKEX's own conventions: the top bar sits at `G.top` (43, or 171 on a story), the
  footer at `G.foot` (909 square, 1189 portrait, 1566 story). `G.ty` and `G.fy` are how far each moved from the square.
  Anchor what sits on the footer by `G.fy`, what hangs from the top bar by `G.ty`, and let pictures and motifs take the
  room in between.
- Landscape is the LinkedIn layout in a narrower design space: anything measured from the right edge adds `G.X`.

## The kit (`K`)

- `K.ink`, `K.light`: the colourway's ink and ground. `K.c`: the copy. `K.has(key)`: whether a field has words.
- `K.box(x, y, w, h, { line, fill, color, z, opacity, css })`: rectangles and keylines (2px on 1080, 1.7px on 1200).
- `K.mark(src, x, y, w, h, { color, rot, stretch, align, z })`: an SVG drawn in a colour. `src` is a name in `marks/`
  or a path.
- `K.pic(src, x, y, w, h, { blend, opacity, fit, z })`: a fixed brand picture.
- `K.slot(id, label, x, y, w, h, { cover, clip, z })`: a picture the person chooses. Cut-outs stand on the box's
  bottom edge; `cover: true` makes a photo area always fill its box.
- `K.text(x, y, runs, { size, weight, lh, ls, upper, wrap, w, h, field, fit, color, align, z })`: words. `runs` is a
  string, or `[{ t, weight }]` for mixed weights on one line. `field` makes it editable on the artwork; `fit` with a fixed
  `w` and `h` warns when the copy runs out of its box. Letter-spacing is a fraction of the size (TEKEX uses -0.02).
- `K.fit(str, px, maxW, weight, maxLines, floor, upper)`: the size and line breaks at which copy fits, measured in the
  real font. Use its `text` (lines joined with `\n`) with `wrap: true`.
- `K.chrome({ label, foot, url, topLeft, poweredTop, shortTop, topFill, cellFill, topBar, logoCell })`: the shared
  frame. `foot` is `"cells"` (logo cell and category cell), `"sponsors"` (SUPPORTED BY strip), `"partners"` or `"none"`.
- `K.sponsors()`, `K.sponsorStrip()`, `K.partnerCell()`: sponsor logos, in the ink, from the design's chosen partners.
- Layers (`K.Z`): `bg 1, motif 2, photo 3, wash 4, chrome 5, panel 6, text 7, top 8`.

## People and partners

- `T.personPic(name, cut)` finds a person's own picture from a name ("Matt Tabb, CMO BDO/C5" is Matt Tabb).
  `T.personIn(text, cut)` finds anyone in the library named in some words ("Hear from Louis Pike").
- A part's `fill` shows a real person only when the copy names them. Unnamed words ("Founder, Jersey") get TEKEX
  photography or a 3D shape, never a stranger's face: a picture beside a quote says who said it.
- A template whose artwork draws the chosen sponsors sets `partners: true` on its `tpl`, which shows the
  "Partners shown" switches in the editor.

## Rules

1. Square and LinkedIn must match the Figma frames: check every layout with `tools/qa/tk-render.mjs` and
   `tools/qa/tk-compare.py` against a Figma export at scale 1, with the same copy. Frame, type and keylines within 2px.
2. Every layout must hold in all five formats with the example copy and with long copy. Long copy steps down in size
   (`K.fit`) before it is allowed to overflow, and overflow is flagged (`fit`).
3. One ink colour draws every mark. The ground and ink come from the colourway; never hard-code the category's hex.
4. No stock photography from the Figma files goes into this public repository. Use TEKEX's own library photos.
5. Brand pictures go in `shapes/` as WebP (and a small version in `shapes/sm/` from `tools/images.py`).
