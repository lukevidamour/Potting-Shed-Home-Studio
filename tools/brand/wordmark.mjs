// Builds the "homestudio" wordmark out of the Potting Shed logo's own outlines, the way Pinboard's "pinboard" wordmark
// was built (Pinboard: scripts/wordmark.mjs), so all three read as the same hand.
//
// The logo draws h, o, e, s, t (its plain t, bar to the right), i (with its leaf for a dot) and d, and those are used
// exactly as drawn. m and u are made from the logo's n, by the logo's rules (measured from the outlines):
//   - one weight: stems about 20.4 units; arches spring out of a stem with a notch;
//   - flat ends sit on the x-height (22.8) and the baseline (91.14); round shapes overshoot both by about 2.35;
//   - every stem top is square, except its top right-hand corner, which is rounded (radius 3.665).
// So:
//   m is the n with its arch repeated one stem along: the n's right leg becomes the middle stem, and the second arch,
//     drawn exactly as the n's, runs on along its own line until it meets the first arch, so the two arches meet in
//     a clean V over the middle stem, which has no top of its own (Luke: a square cap there read as a stray tab);
//   u is the n turned round: both tops square with their right corners rounded, the right stem standing on a square
//     foot with the bowl springing from it through the notch, and the bowl overshooting the baseline as the n's
//     arch overshoots the x-height.
// Spacing is the logo's: each pair is set so the white between the two letters (between the x-height and the
// baseline, at most 14 units into either letter) equals the white of the logo's own pair of the same kind.
//
//   node tools/brand/wordmark.mjs      writes assets/brand/home-studio.svg (ink), home-studio-white.svg, and prints the gaps
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse, box, bandBox, points, bez, split, solve, starts, near, corner, move, mirror, map, XH, BASE, R } from "./wm-geometry.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const logo = fs.readFileSync(path.join(HERE, "ps-logo-outlines.svg"), "utf8");
const outlines = [...logo.matchAll(/<path[^>]*\sd="([^"]+)"/g)].flatMap((m) => parse(m[1]));
function pick(x0, y0) {
  const found = outlines.filter((sp) => { const b = box([sp]); return near(b.x0, x0, 0.6) && near(b.y0, y0, 0.6); });
  if (found.length !== 1) throw new Error(`expected one outline at ${x0}, ${y0}, found ${found.length}`);
  return found[0];
}

// ------------------------------------------------------------------ the logo's letters, as drawn
const LOGO = {
  p: [pick(0, 21.05), pick(20.44, 40.13)],
  o: [pick(78.04, 21.05), pick(98.49, 40.13)],
  t2: [pick(191.76, 0)],
  i: [pick(228.12, 22.8), pick(228.64, 0.45)],
  n: [pick(257.19, 20.45)],
  g: [pick(326.58, 21.12), pick(347.13, 40.21), pick(357.48, 117.99)],
  s: [pick(404.41, 20.45)],
  h: [pick(464.79, 0.01)],
  e: [pick(532.97, 21.01)],
  d: [pick(608.87, 0.3), pick(629.31, 39.47)],
};

// ------------------------------------------------------------------ m
function makeM() {
  const [n] = LOGO.n, from = starts(n), segs = n.segs;
  // the n, in order: 0-2 stem down and up its inside, 3-4 the counter, 5 down the leg's inside, 6 the leg's foot,
  // 7 up the leg's outside, 8-9 the shoulder to the apex, 10 down to the notch, 11 the notch, 12 up the stem, 13-14 its corner
  const dx = segs[4].x - n.x; // the leg stands one arch along from the stem: the second arch is the first, moved by that
  const sh = move([n], dx)[0], ss = sh.segs, sfrom = starts(sh);
  // The second arch's shoulder runs on, along the line it is travelling at the notch, until it meets the first arch's
  // outer curve: the two arches meet there in a V, and the middle stem has no top of its own (no cap above the arches).
  const [ex, ey] = [ss[10].x, ss[10].y], tx = ss[10].x - ss[10].x2, ty = ss[10].y - ss[10].y2, tl = Math.hypot(tx, ty);
  const ux = tx / tl, uy = ty / tl;
  const side = (x, y) => (x - ex) * uy - (y - ey) * ux; // which side of the run-on line a point is
  let hit = null;
  for (const k of [8, 9]) {
    const f = (t) => { const [x, y] = bez(...from[k], segs[k], t); return side(x, y); };
    let prev = f(0);
    for (let q = 1; q <= 400 && !hit; q++) {
      const cur = f(q / 400);
      if ((prev <= 0) !== (cur <= 0)) { let lo = (q - 1) / 400, hi = q / 400; for (let z = 0; z < 60; z++) { const m = (lo + hi) / 2; if ((f(lo) <= 0) === (f(m) <= 0)) lo = m; else hi = m; } hit = { k, t: (lo + hi) / 2 }; }
      prev = cur;
    }
    if (hit) break;
  }
  if (!hit) throw new Error("the second arch never meets the first");
  const Q = bez(...from[hit.k], segs[hit.k], hit.t);
  const [, onward] = split(...from[hit.k], segs[hit.k], hit.t);
  const out = {
    x: n.x, y: n.y,
    segs: [
      ...segs.slice(0, 6),               // the stem, the first counter, down to where the middle stem stands
      ...ss.slice(1, 11),                // the middle stem's foot, up its inside, the second counter, the right leg, the second arch down to the n's notch point
      { type: "L", x: Q[0], y: Q[1] },   // on along the same line into the first arch: the V where the arches meet
      onward,                            // the first arch from there up to its apex
      ...segs.slice(hit.k + 1),          // ...and on round: down to the n's notch, up the stem, its corner, home
    ],
  };
  return [out];
}

// ------------------------------------------------------------------ u
function makeU() {
  const [n] = LOGO.n, b = box([n]);
  const cx = b.x0 + b.x1, cy = XH + BASE; // turned round: x' = cx - x, y' = cy - y (flat tops land on the x-height, the foot on the baseline)
  const r = map(n, (x, y) => [cx - x, cy - y]), s = r.segs;
  // after turning: 0 up the right stem's outside, 1 its top (leftwards), 2 down its inside, 3-4 the bowl's inside,
  // 5 up the left arm's inside, 6 its top (leftwards), 7 down its outside, 8-9 round the bowl, 10 up to the notch,
  // 11 the notch, 12 down the stem's left edge, 13-14 the n's rounded corner (now bottom left), then back to the start
  const rightX = s[0].x, armX = s[5].x;
  const segs = [
    { type: "L", x: rightX, y: XH + R }, corner(rightX, XH + R, rightX - R, XH, false), // right stem top, right corner rounded
    s[1], s[2], s[3], s[4],
    { type: "L", x: armX, y: XH + R }, corner(armX, XH + R, armX - R, XH, false),     // left arm top, right corner rounded
    s[6], s[7], s[8], s[9], s[10], s[11],
    { type: "L", x: s[12].x, y: BASE },                                                   // the stem's foot, square
  ];
  return [{ x: r.x, y: BASE, segs }];
}

// ------------------------------------------------------------------ spacing by white area
// The right edge of a letter's ink at height y (or its left edge), from its outline flattened finely.
function profile(subs, side) {
  const pts = subs.map((sp) => points(sp, 80));
  return (y) => {
    let v = side === "right" ? -Infinity : Infinity;
    for (const poly of pts) for (let k = 0; k < poly.length; k++) {
      const [ax, ay] = poly[k], [bx, by] = poly[(k + 1) % poly.length];
      if ((ay <= y && by > y) || (by <= y && ay > y)) { const x = ax + ((y - ay) / (by - ay)) * (bx - ax); v = side === "right" ? Math.max(v, x) : Math.min(v, x); }
    }
    return v;
  };
}
const DEPTH = 14, STEP = 0.25;
// White between a and b when b's body starts `gap` after a's body ends.
function white(a, b, gap) {
  const ba = bandBox(a), bb = bandBox(b), ra = profile(a, "right"), lb = profile(b, "left");
  let area = 0;
  for (let y = XH + STEP / 2; y < BASE; y += STEP) {
    const xr = Math.max(ra(y), ba.x1 - DEPTH), xl = Math.min(lb(y) - bb.x0, DEPTH) + ba.x1 + gap;
    area += Math.max(0, xl - (isFinite(xr) ? xr : ba.x1 - DEPTH)) * STEP;
  }
  return area;
}
const gapFor = (a, b, target) => { let lo = -6, hi = 20; for (let k = 0; k < 50; k++) { const m = (lo + hi) / 2; if (white(a, b, m) < target) lo = m; else hi = m; } return (lo + hi) / 2; };
// the logo's own pairs, at the logo's own gaps
const logoGap = (a, b) => bandBox(LOGO[b]).x0 - bandBox(LOGO[a]).x1;
const logoWhite = (a, b) => white(LOGO[a], LOGO[b], logoGap(a, b));

const L = { h: LOGO.h, o: LOGO.o, m: makeM(), e: LOGO.e, s: LOGO.s, t: LOGO.t2, u: makeU(), d: LOGO.d, i: LOGO.i };
// Each pair matched to the logo pair of the same kind: [left, right, the logo pair whose white it takes]
const PAIRS = [
  ["h", "o", ["h", "e"]],   // stem into a round letter
  ["o", "m", ["p", "i"]],   // a bowl into a stem: Pinboard's approved p·i (4.7 in Pinboard), measured the same way
  ["m", "e", ["h", "e"]],   // stem into the e, as the logo's h·e
  ["e", "s", "break"],      // the break between home and studio: wider than any pair, so it reads as two words (Luke)
  ["s", "t", ["s", "h"]],   // the s into a stem, as the logo's s·h
  ["t", "u", ["t2", "i"]],  // the t's bar into a stem, as the logo's t·i
  ["u", "d", ["n", "g"]],   // stem into a bowl, as the logo's n·g
  ["d", "i", null],         // two plain stems: Pinboard's approved straight pair (its i·n, set by eye with Luke)
  ["i", "o", ["n", "g"]],   // stem into a bowl, as the logo's n·g
];
const PINBOARD_PI = 4.7, PINBOARD_STRAIGHT = 6.06;
// The gap between the two words, in logo units (the pairs inside a word are 4.7 to 6.1). Override: WORD_BREAK=n node ...
const WORD_BREAK = +(process.env.WORD_BREAK || 18); // Luke picked 18 of 9, 12, 15 and 18 (13 Nov 2026)

export function build() {
  const word = "homestudio";
  const gaps = PAIRS.map(([a, b, like]) => {
    if (!like) return PINBOARD_STRAIGHT;
    if (like === "break") return WORD_BREAK;
    const [x, y] = like, target = x === "p" && y === "i" ? white(LOGO.p, LOGO.i, PINBOARD_PI) : logoWhite(x, y);
    return +gapFor(L[a], L[b], target).toFixed(2);
  });
  let at = 0; const placed = [];
  [...word].forEach((ch, k) => { const b = bandBox(L[ch]); placed.push(move(L[ch], at - b.x0)); at += b.x1 - b.x0 + (k < word.length - 1 ? gaps[k] : 0); });
  const ink = box(placed.flat()), x0 = Math.min(0, ink.x0), width = +(Math.max(at, ink.x1) - x0).toFixed(3);
  const top = Math.min(0, ink.y0), height = +(Math.max(BASE, ink.y1) - top).toFixed(3);
  const fmt = (v) => String(+v.toFixed(3));
  const svgPath = (subs) => subs.map((sp) => `M${fmt(sp.x)} ${fmt(sp.y)}${sp.segs.map((s) => (s.type === "L" ? `L${fmt(s.x)} ${fmt(s.y)}` : `C${fmt(s.x1)} ${fmt(s.y1)} ${fmt(s.x2)} ${fmt(s.y2)} ${fmt(s.x)} ${fmt(s.y)}`)).join("")}Z`).join("");
  const paths = placed.map((subs) => `<path fill-rule="evenodd" d="${svgPath(move(subs, -x0).map((sp) => map(sp, (x, y) => [x, y - top])))}"/>`).join("\n");
  return { gaps, width, height, svg: (fill) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" fill="${fill}">\n<title>Home Studio</title>\n${paths}\n</svg>\n` };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const w = build();
  fs.mkdirSync(path.join(ROOT, "assets", "brand"), { recursive: true });
  fs.writeFileSync(path.join(ROOT, "assets", "brand", "home-studio.svg"), w.svg("#171717"));
  fs.writeFileSync(path.join(ROOT, "assets", "brand", "home-studio-white.svg"), w.svg("#F2F2F2"));
  console.log("gaps", PAIRS.map((p, k) => p[0] + "·" + p[1] + " " + w.gaps[k]).join("  "));
  console.log(`assets/brand/home-studio.svg and home-studio-white.svg, ${w.width} x ${w.height}`);
}
