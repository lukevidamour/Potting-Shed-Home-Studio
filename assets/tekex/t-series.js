/* Event series: TEKEX's own sub-brands, Last Friday Club and Health Innovation Jersey.
   Source: "37981 TKX Last Friday Club" (xzEjCjaksdPa8C4vxWZdhW) frames 11008:2 / 11004:294 (D1a), 11004:158 (D1b),
   11021:2 (D2c), 11028:353 (D2a, the second scrim); "37918 TKX Ad Campaign" (7mn8qElo8GZbxg4GzmRmIB) frames 4035:1304
   (1:1), 4035:2195 (4:5), 4035:413 (9:16) for Health Innovation; Post 82 (Td4QcZxLv3dJ32UZfDEONG) 11101:6 (1200 x 627).
   Layouts: 0 Last Friday Club over a dark photo, 1 Last Friday Club with a cut-out and an oversized date,
   2 Last Friday Club with a boxed title and the date in the top bar, 3 Health Innovation (sub-brand lockup, one footer bar).
   Only Health Innovation has a 1200 x 627 frame in Figma; the Last Friday Club landscapes follow TEKEX's own rule for
   turning a 1080 event post into a 1200 one (file 6, 2006:7664): the top bar carries the date line, the date or title
   becomes the hero, the footer scales by 0.85. */
(function () {
  var T = window.HS_TEKEX, LOCKUP = "assets/tekex/marks/health-lockup.svg", LOCKUP_S = "assets/tekex/marks/health-lockup-stacked.svg";
  var RIBBON = "assets/tekex/shapes/health-ribbon.webp";
  var F = function (key, label, ph, more) { return Object.assign({ key: key, label: label, ph: ph }, more || {}); };
  function lum(c) { var m = String(c).match(/[\d.]+/g) || [0, 0, 0]; return (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255; }
  /* On a dark photo the words take whichever of the two colourway colours is lighter (aqua on black in D1a). */
  function onDark(K) { return lum(K.ink) >= lum(K.light) ? K.ink : K.light; }
  function up(s) { return String(s || "").toUpperCase(); }
  function widest(K, lines, size, weight) { return Math.max.apply(null, lines.map(function (l) { return K.tw(l, size, weight); })); }
  /* The largest size, up to px, at which str sets in no more than max lines of maxW and no taller than maxH. */
  function fitBox(K, str, px, maxW, maxH, weight, max, lh, floor, upper) {
    var f = K.fit(str, px, maxW, weight, max, floor, upper), lo = Math.round(px * (floor || 0.5));
    while (f.size * lh * f.n > maxH && f.size > lo) f = K.fit(str, Math.max(lo, f.size - 2), maxW, weight, max, (lo / Math.max(lo, f.size - 2)), upper);
    return f;
  }
  /* The footer category in the LFC posts is set larger than the toolkit's (57.3 px, not 46). */
  function lfcLabel(K, G, y, color) {
    var c = K.c, lab = K.fit(c.eyebrow || "Events", 57.295, 268, 600, 1, 0.4, true);
    if (G.wide) { lab = K.fit(c.eyebrow || "Events", 48.7, 520 + G.X, 600, 1, 0.5, true); return K.text(434, 491 + (48.7 - lab.size) * 0.5, lab.text, { size: lab.size, upper: true, color: color, field: "eyebrow", fit: "eyebrow", w: 550 + G.X, h: 52, z: K.Z.top }); }
    return K.text(515, y + (57.295 - lab.size) * 0.6, lab.text, { size: lab.size, upper: true, color: color, field: "eyebrow", fit: "eyebrow", w: 278, h: 60, z: K.Z.top });
  }
  /* The date line in a top bar: "30th Oct / 17:00", Book with the slash in SemiBold. */
  function dateLine(K, parts, x, y, size, maxW, color) {
    parts = parts.filter(function (p) { return String(p || "").trim(); });
    var runs = [], str = parts.join(" / ");
    var sz = Math.min(size, Math.floor(size * maxW / Math.max(1, K.tw(str, size, 300))));
    parts.forEach(function (p, i) { if (i) runs.push({ t: " / ", weight: 600 }); runs.push({ t: p, weight: 300 }); });
    return K.text(x, y + (size - sz) * 0.5, runs, { size: sz, weight: 300, color: color, field: "date", z: K.Z.top });
  }

  /* ---------- Last Friday Club ---------- */
  function lfc(d, K, G, L) {
    var c = K.c, els = [], fy = G.fy, X = G.X;
    if (L === 0) {
      // D1a: dark photo inset 19 px from the top left, a black scrim behind the date (and D2a's second one behind the title)
      var tc = onDark(K), scrim = "linear-gradient(-6.15deg, rgba(0,0,0,0.8) 6.3%, rgba(0,0,0,0) 85.5%)";
      els.push(K.slot("photo", "Photo", 19, 19, G.w - 19, G.h - 19, { cover: true }));
      if (!G.wide) {
        els.push(K.box(0, 710 + fy, G.w, 370 + (G.h - 1080 - fy), { fill: scrim, z: K.Z.wash }));
        els.push(K.box(0, 290 + fy, G.w, 370, { fill: scrim, z: K.Z.wash }));
        var h = K.fit(c.headline, 190.48, 960, 600, String(c.headline || "").length > 24 ? 4 : 3, 0.4, true), hh = h.size * 0.85 * h.n;
        // the title stands on the date: three lines end at 723 on the square; fewer or smaller lines keep that foot
        var hy = 723 + fy - hh, dt = K.fit(c.date, 71.502, 960, 600, 1, 0.6, true);
        els.push(K.text(41, hy, h.text, { size: h.size, upper: true, lh: 0.85, wrap: true, color: tc, field: "headline", fit: "headline", w: 1000, h: hh + 6 }));
        if (K.has("date")) els.push(K.text(46, 750 + fy + (71.502 - dt.size) * 0.7, dt.text, { size: dt.size, upper: true, lh: 1, ls: 0, color: tc, field: "date" }));
        els.push(K.chrome({ ink: tc, label: "", cellFill: "transparent" }));
        els.push(lfcLabel(K, G, 930.7 + fy, tc));
        return { bg: "#000000", els: els };
      }
      els.push(K.box(0, 260, G.w, 367, { fill: scrim, z: K.Z.wash }));
      els.push(K.box(0, 0, G.w, 627, { fill: "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 60%)", z: K.Z.wash }));
      var hw = fitBox(K, c.headline, 98, 620, 252, 600, 3, 0.85, 0.5, true), hhw = hw.size * 0.85 * hw.n;
      var dw = K.fit(c.date, 42.9, 620, 600, 1, 0.6, true);
      els.push(K.text(66, 404 - hhw, hw.text, { size: hw.size, upper: true, lh: 0.85, wrap: true, color: tc, field: "headline", fit: "headline", w: 700, h: hhw + 6 }));
      if (K.has("date")) els.push(K.text(69, 418, dw.text, { size: dw.size, upper: true, lh: 1, ls: 0, color: tc, field: "date" }));
      els.push(K.chrome({ ink: tc, label: "", cellFill: "transparent" }));
      els.push(lfcLabel(K, G, 0, tc));
      return { bg: "#000000", els: els };
    }
    if (L === 1) {
      // D1b: the cut-out stands over the bars and under the words; the date runs the full width and prints over it
      if (!G.wide) {
        var bot = 830 + fy, top = Math.max(G.top + 10, bot - 800 - (fy - G.ty) * 0.35);
        els.push(K.slot("cutout", "Cut-out", 330, top, 750, bot - top, { z: K.Z.panel }));
        var h1 = K.fit(c.headline, 167.173, 600, 600, String(c.headline || "").length > 24 ? 4 : 3, 0.4, true), hh1 = h1.size * 0.92 * h1.n;
        var d1 = K.fit(c.date, 140.66, 990, 600, 1, 0.45, true); // set without tracking, as D1b
        els.push(K.text(45, 692 + fy - hh1, h1.text, { size: h1.size, upper: true, wrap: true, color: K.ink, field: "headline", fit: "headline", w: 640, h: hh1 + 6 }));
        if (K.has("date")) els.push(K.text(44, 731 + fy + (140.66 - d1.size) * 0.75, d1.text, { size: d1.size, upper: true, lh: 1, ls: 0, color: K.ink, field: "date" }));
        els.push(K.chrome({ label: "", cellFill: "transparent" }));
        els.push(lfcLabel(K, G, 930.7 + fy, K.ink));
        return els;
      }
      els.push(K.slot("cutout", "Cut-out", 600 + X, 34, 560, 452, { z: K.Z.panel }));
      var h1w = K.fit(c.headline, 92, 1040 + X, 600, 1, 0.75, true), d1w = K.fit(c.date, 170, 1060 + X, 600, 1, 0.45, true);
      if (K.tw(up(c.headline), h1w.size, 600) > 1040 + X) h1w = K.fit(c.headline, 72, 1040 + X, 600, 2, 0.6, true);
      els.push(K.text(70, 156, h1w.text, { size: h1w.size, upper: true, wrap: true, color: K.ink, field: "headline", fit: "headline", w: 1080 + X, h: h1w.n * h1w.size * 0.92 + 4 }));
      if (K.has("date")) els.push(K.text(66, 450 - d1w.size * 0.92 + (1 - d1w.size / 170) * 30, d1w.text, { size: d1w.size, upper: true, color: K.ink, field: "date" }));
      els.push(K.chrome({ label: "", cellFill: "transparent" }));
      els.push(lfcLabel(K, G, 0, K.ink));
      return els;
    }
    // L === 2, D2c: a full photo, the title in a box over the footer, the date and time in the top bar
    els.push(K.slot("photo", "Photo", 0, 0, G.w, G.h, { cover: true }));
    if (!G.wide) {
      var t2 = K.fit(c.headline, 108.165, 950, 600, 1, 0.7, true);
      if (K.tw(up(c.headline), t2.size, 600) > 950) t2 = K.fit(c.headline, 96, 950, 600, 2, 0.6, true);
      var extra = (t2.n - 1) * t2.size * 0.92;
      els.push(K.box(48, 743 + fy - extra, 984, 152 + extra, { line: 2, fill: K.light, z: K.Z.panel }));
      els.push(K.text(72, 771.5 + fy - extra + (108.165 - t2.size) * 0.46, t2.text, { size: t2.size, upper: true, wrap: true, field: "headline", fit: "headline", w: 950, h: t2.n * t2.size * 0.92 + 6 }));
      els.push(dateLine(K, [c.date, c.time], 67, G.top + 12, 42, 720, K.ink));
      els.push(K.chrome({ label: "" }));
      els.push(lfcLabel(K, G, 933 + fy, K.ink));
      return els;
    }
    var t2w = K.fit(c.headline, 92, 1050 + X, 600, 1, 0.7, true);
    if (K.tw(up(c.headline), t2w.size, 600) > 1050 + X) t2w = K.fit(c.headline, 72, 1050 + X, 600, 2, 0.65, true);
    var ex2 = (t2w.n - 1) * t2w.size * 0.92;
    els.push(K.box(48, 332 - ex2, 1102 + X, 129 + ex2, { line: 1.7, fill: K.light, z: K.Z.panel }));
    els.push(K.text(68, 356 - ex2 + (92 - t2w.size) * 0.46, t2w.text, { size: t2w.size, upper: true, wrap: true, field: "headline", fit: "headline", w: 1070 + X, h: t2w.n * t2w.size * 0.92 + 6 }));
    els.push(dateLine(K, [c.date, c.time], 72, 65, 42, 820 + X, K.ink));
    els.push(K.chrome({ label: "" }));
    els.push(lfcLabel(K, G, 0, K.ink));
    return els;
  }

  /* ---------- Health Innovation Jersey ---------- */
  /* The one footer bar: arrow, the sub-brand's name on a rule, POWERED BY pottingshed, plus. */
  function healthBar(K, x, y, w) {
    var c = K.c, out = [K.box(x, y, w, 120, { line: 2, fill: K.light, z: K.Z.chrome })];
    var lab = K.fit(c.eyebrow || "Health Innovation", 52, w - 121 - 250, 600, 1, 0.55, true);
    out.push(K.mark("arrow-down", x + 23.51, y + 24.97, 64.985, 64.985, { z: K.Z.chrome }));
    out.push(K.text(x + 121, y + 19.5 + (52 - lab.size) * 0.6, lab.text, { size: lab.size, upper: true, lh: 1, ls: 0, field: "eyebrow", z: K.Z.chrome }));
    out.push(K.box(x + 125, y + 81, w - 194, 8, { fill: K.ink, z: K.Z.chrome }));
    out.push(K.text(x + w - 234, y + 24, "POWERED BY", { size: 15.747, weight: 500, lh: 1, z: K.Z.chrome }));
    out.push(K.mark("pottingshed", x + w - 234, y + 41.12, 165, 34.917, { z: K.Z.chrome, label: "pottingshed" }));
    out.push(K.mark("plus", x + w - 56, y + 72, 26, 26, { z: K.Z.chrome }));
    return out;
  }
  function health(d, K, G) {
    var c = K.c, els = [], X = G.X;
    if (!G.wide) {
      // measured per format: 1:1 4035:1304, 4:5 4035:2195, 9:16 4035:413. Only the 1:1 and 4:5 ribbons differ in shape.
      var P = G.story ? { rib: [-56, 230, 1458, 1338.5], hy: 609, hs: 157.96, hw: 880, hl: 4, bs: 57.551, bw: 946, bar: 1717, gap: 39.7 }
        : G.portrait ? { rib: [54, 5, 1037, 1190], hy: 412, hs: 139.651, hw: 778, hl: 4, bs: 50.88, bw: 883, bar: 1184, gap: 35 }
        : { rib: [69, -37, 1037, 952], hy: 329, hs: 119.17, hw: 931, hl: 3, bs: 50.88, bw: 879, bar: 900, gap: 25 };
      els.push(K.pic(RIBBON, P.rib[0], P.rib[1], P.rib[2], P.rib[3], { blend: "screen", z: K.Z.motif }));
      els.push(K.mark(LOCKUP, 55, 75, 526, 154.655, { z: K.Z.text, label: "TEKEX Health Innovation JSY" }));
      // the body sits under the headline; together they must stay clear of the bar
      var bodyStr = String(c.body || "").trim(), meta = [c.date, c.venue].filter(function (v) { return String(v || "").trim(); }).join(" • ");
      var room = P.bar - 40 - P.hy, hs = P.hs, h, b, bl, bh, ml;
      for (var i = 0; i < 30; i++) {
        h = K.fit(c.headline, hs, P.hw, 600, P.hl, 0.999, true);
        var bsz = Math.max(P.bs * 0.7, P.bs * Math.min(1, hs / P.hs + 0.15));
        bl = bodyStr ? K.lines(bodyStr, bsz, P.bw, 400, 4) : []; ml = meta ? K.fit(meta, bsz, P.bw + 60, 600, 2, 0.999) : null;
        bh = (bl.length + (ml ? ml.n : 0)) * bsz * 1.12;
        var tot = h.size * 0.85 * h.n + P.gap + bh;
        b = bsz;
        if ((tot <= room && widest(K, h.lines.map(up), h.size, 600) <= P.hw + 2) || hs < P.hs * 0.55) break;
        hs = Math.round(hs * 0.95 * 10) / 10;
      }
      var hh = h.size * 0.85 * h.n;
      els.push(K.text(64, P.hy, h.text, { size: h.size, upper: true, lh: 0.85, ls: 0, wrap: true, field: "headline", fit: "headline", w: P.hw + 80, h: hh + 4 }));
      var by = P.hy + hh + P.gap;
      if (bl.length) els.push(K.text(64, by, bl.join("\n"), { size: b, weight: 400, lh: 1.12, ls: 0, wrap: true, field: "body" }));
      if (ml) els.push(K.text(64, by + bl.length * b * 1.12, ml.text, { size: b, weight: 600, lh: 1.12, ls: 0, wrap: true, field: "date" }));
      els.push(healthBar(K, 64, P.bar, 968));
      return els;
    }
    // 1200 x 627 (11101:6): the stacked lockup in the top bar, the title and date line as one block, partners in the bar
    els.push(K.pic(RIBBON, 273 + X * 0.5, -113, 1188.56, 1091.1, { blend: "screen", z: K.Z.motif }));
    els.push(K.box(48, 44, 1102 + X, 87, { line: 2, z: K.Z.chrome }));
    els.push(K.mark(LOCKUP_S, 62, 59, 261, 56, { z: K.Z.top, label: "TEKEX Health Innovation JSY" }));
    els.push(K.mark("arrow-small", 939 + X - 1.11, 78.39 - 0.94, 24.02, 24.02, { rot: -90, z: K.Z.top }));
    els.push(K.text(971.83 + X, 74, [{ t: "TEKEX", weight: 600 }, { t: ".CO", weight: 500 }], { size: 32, z: K.Z.top }));
    var dl = [c.date, c.time].filter(function (v) { return String(v || "").trim(); });
    var maxW = 1060 + X, sz = 99.791, hw2, dw;
    for (var j = 0; j < 30; j++) {
      hw2 = K.fit(c.headline, sz, maxW, 600, 3, 0.999, true);
      dw = dl.length ? K.tw(up(dl.join(" | ")), sz, 600) : 0;
      var n = hw2.n + (dl.length ? 1 : 0);
      if ((widest(K, hw2.lines.map(up), sz, 600) <= maxW && dw <= maxW && n * sz * 0.92 <= 300) || sz < 55) break;
      sz = Math.round(sz * 0.95 * 10) / 10;
    }
    var ty = 163.8; // the Figma box starts at 72 with an empty first line
    els.push(K.text(80, ty, hw2.text, { size: sz, upper: true, wrap: true, field: "headline", fit: "headline", w: maxW + 20, h: hw2.n * sz * 0.92 + 4 }));
    if (dl.length) {
      var runs = [];
      dl.forEach(function (p, i) { if (i) runs.push({ t: " | ", style: { color: "#FFFFFF" } }); runs.push({ t: p }); });
      els.push(K.text(80, ty + hw2.n * sz * 0.92, runs, { size: sz, upper: true, field: "date" }));
    }
    // footer: one bar, arrow, partner logos along the rule, POWERED BY pottingshed, plus
    els.push(K.box(48, 474, 1102 + X, 102, { line: 1.7, fill: K.light, z: K.Z.chrome }));
    els.push(K.mark("arrow-down", 62 - 2.12, 496.88 - 2.51, 54.387, 54.387, { z: K.Z.chrome }));
    els.push(K.box(136, 542.6, 958 + X, 6.8, { fill: K.ink, z: K.Z.chrome }));
    els.push(K.text(993.1 + X, 494, "POWERED BY", { size: 12.598, weight: 500, lh: 1, z: K.Z.chrome }));
    els.push(K.mark("pottingshed", 993.1 + X, 507.69, 132, 27.93, { z: K.Z.chrome, label: "pottingshed" }));
    els.push(K.mark("plus", 1103.35 + X, 535.2, 22.1, 22.1, { z: K.Z.chrome }));
    var logos = K.sponsors(), x0 = 167, x1 = 934 + X;
    if (logos.length) {
      var ws = logos.map(function (l) { return l.ar > 4 ? Math.min(150, 17 * l.ar) : Math.min(90, 36 * l.ar); }), tot = ws.reduce(function (a, b) { return a + b; }, 0);
      var gap = logos.length > 1 ? (x1 - x0 - tot) / (logos.length - 1) : 0, cx = x0;
      if (gap > 70) { gap = 70; }
      logos.forEach(function (l, i) { var lw = ws[i], lh = lw / l.ar; els.push(K.mark(l.src, cx, 511.5 - lh / 2, lw, lh, { z: K.Z.chrome, label: l.key })); cx += lw + gap; });
    } else {
      var lb = K.fit(c.eyebrow || "Health Innovation", 39.1, x1 - 130, 600, 1, 0.6, true);
      els.push(K.text(130, 494.4, lb.text, { size: lb.size, upper: true, field: "eyebrow", z: K.Z.chrome }));
    }
    return els;
  }

  function build(d, K, G) {
    var L = d.layout || 0;
    return L === 3 ? health(d, K, G) : lfc(d, K, G, L);
  }

  T.add({
    tpl: { partners: true, key: "tk-series", short: "Event series", what: "a post for a TEKEX event series", name: "Event series", theme: "Lilac & red",
      desc: "TEKEX's own event series: Last Friday Club (a dark photo, a cut-out, or a boxed title) and Health Innovation Jersey.", required: ["headline"],
      layouts: ["Last Friday Club: photo", "Last Friday Club: cut-out", "Last Friday Club: boxed", "Health Innovation"] },
    fields: [
      F("headline", "Title", "Last Friday Club"),
      F("body", "Introduction", "A one-day event on AI, longevity, medtech and the bioeconomy.", { kind: "area", optional: true, on: [3] }),
      F("date", "Date", "Friday 25 Sep"),
      F("time", "Time", "17:00", { optional: true, on: [2, 3] }),
      F("venue", "Venue", "BDO/C5 Hub, St Helier", { optional: true, on: [3] }),
      F("eyebrow", "Footer label", "Events", { optional: true })
    ],
    examples: [
      { headline: "Last Friday Club", date: "Friday 25 Sep", eyebrow: "Events" },
      { headline: "Last Friday Club", date: "Friday 25 Sep", eyebrow: "Events" },
      { headline: "Last Friday Club", date: "30th Oct", time: "17:00", eyebrow: "Events" },
      { headline: "Is Health Jersey's next key industry?", body: "A one-day event on AI, longevity, medtech and the bioeconomy.", date: "24/09/26", time: "10.30–20.00", venue: "BDO/C5 Hub, St Helier", eyebrow: "Health Innovation" }
    ],
    slots: function (d) { var L = d.layout || 0; return L === 1 ? [{ id: "cutout", label: "Cut-out" }] : L === 3 ? [] : [{ id: "photo", label: "Photo" }]; },
    fill: function (d, put, libImg) {
      var L = d.layout || 0;
      if (L === 0) put("photo", libImg("tk-reel-13", 50, 50)); // the neon TEKEX wordmark on black, as D1a's wordmark on a glass
      if (L === 2) put("photo", libImg("tk-reel-67", 50, 50)); // pale pink, as D2c's pastel drink
      if (L === 1) { var g = libImg("tk-swirl-1", 50, 100); if (g) { g.cut = true; put("cutout", g); } } // a 3D shape, as D1b's shapes and glass
    },
    preload: [LOCKUP, LOCKUP_S], build: build
  });
})();
