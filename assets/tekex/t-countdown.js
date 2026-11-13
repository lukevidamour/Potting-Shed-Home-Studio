/* Event countdown: the posts that build up to an event and run on the day, the Isle of Man (IOM) series among them.
   Sources (measured in research/tekex-figma/B-events-carousels.md):
     Tonight          lC1LSOeLB9zWDq8M25Udvy 8005:1814 / 10002:271 (IOM#3, yellow), 10002:81 / 10002:160 (IOM#02, cream),
                      CAMYGySMwANMZgtLAuR5eB 2013:2 / 4065:5 (JSY#36, mint, two-cell footer); with a venue line,
                      DpZFCKuSXG7GCgOCYMYYWg 2013:2 (AI Sprint GSY).
     Tickets on sale  DpZFCKuSXG7GCgOCYMYYWg 8005:1814 (1:1) and 8006:2 (4:5).
     Last chance      2yg5mpDlpBDkLYqxqAVllM 5:123 (1:1) and 5:285 (4:5).
     Announce         DpZFCKuSXG7GCgOCYMYYWg 10061:1434 (4:5 safe-zone, the 3D shape behind a keylined text box).
   No 1200 x 627 frame exists for any of these: the wide layouts are translated from the 1080 ones (TEKEX's own wide
   conventions, file xzEjCjaksdPa8C4vxWZdhW 2006:7664: the 81px top bar, the 0.85 footer, the hero set large on one line).
   Layouts: 0 Tonight, 1 Tickets on sale, 2 Last chance, 3 Announce.

   Backgrounds are never flat: the colourway picks the picture TEKEX used with it (tubes on peach, soft shapes on cream,
   the screen-blended swirl on mint and the other light grounds). The footer follows the sponsors chosen: five or six run
   along the one-cell strip (IOM#3, IOM#02), four or fewer sit in the cell beside the TEKEX wordmark (JSY#36), none
   gives the category footer. */
(function () {
  var T = window.HS_TEKEX, SH = "assets/tekex/shapes/";
  var F = function (key, label, ph, more) { return Object.assign({ key: key, label: label, ph: ph }, more || {}); };
  var WM = 925.739 / 190.482; // the TEKEX wordmark's proportion

  /* ---------- helpers ---------- */
  function rgbOf(c) { var m = String(c).match(/[\d.]+/g) || [0, 0, 0]; return [+m[0], +m[1], +m[2]]; }
  function lum(c) { var v = rgbOf(c); return (0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]) / 255; }
  function ground(K) {
    var key = rgbOf(K.light).join(",");
    return { "254,231,193": "cream", "254,220,138": "peach", "129,255,231": "mint", "208,255,191": "lime", "240,191,255": "lilac" }[key] || (lum(K.light) < 0.45 ? "dark" : "other");
  }
  /* An event code such as "IOM#3": the place in Regular, the number in SemiBold. Without a "#", a closing place code
     ("AI Sprint GSY") is the Regular part and the name is SemiBold. */
  function codeRuns(s) {
    s = String(s || "").trim();
    var i = s.indexOf("#");
    if (i > 0) return [{ t: s.slice(0, i), weight: 400 }, { t: s.slice(i), weight: 600 }];
    var m = s.match(/^(.*\S)\s+([A-Z]{2,4})$/);
    if (m) return [{ t: m[1], weight: 600 }, { t: " " + m[2], weight: 400 }];
    return [{ t: s, weight: 600 }];
  }
  function runsW(K, runs, px) { return runs.reduce(function (a, r) { return a + K.tw(r.t, px, r.weight); }, 0); }
  /* The code line's size. Codes of six characters or more are set at 269.157px ("IOM#02", "IOM#03", "JSY#36"); a short
     one grows towards the wordmark's width, up to cap ("IOM#3" at 320px, 316px on the ticket post); anything wider than
     maxW steps down to fit it. */
  function codeSize(K, runs, cap, base, maxW) {
    var w = runsW(K, runs, 100) / 100, n = runs.map(function (r) { return r.t; }).join("").replace(/\s/g, "").length;
    if (w <= 0) return base;
    if (w * Math.min(base, cap) > maxW) return Math.min(cap, maxW / w);
    if (n > 5) return Math.min(base, cap);
    var W0 = runsW(K, codeRuns("IOM#02"), 269.157);
    return Math.max(Math.min(base, cap), Math.min(cap, W0 / w, maxW / w));
  }
  /* The large TEKEX wordmark (the toolkit's 925.7 x 190.5 vector, lC1LSOeLB9zWDq8M25Udvy 10002:252), w wide. */
  function wordmark(K, x, y, w, o) {
    o = o || {};
    return K.mark("wordmark-large", x, y, w, w / WM, { color: o.color, z: o.z == null ? K.Z.text : o.z, label: "TEKEX" });
  }
  /* Lines broken where the words run out of room (the way Figma wraps), keeping any line breaks typed. */
  function wrapLines(K, str, px, maxW, weight, ls, upper) {
    var out = [];
    String(str || "").split(/\n/).forEach(function (par) {
      par = par.trim(); if (upper) par = par.toUpperCase();
      var line = "";
      par.split(/\s+/).filter(Boolean).forEach(function (w) {
        var t = line ? line + " " + w : w;
        if (!line || K.tw(t, px, weight, ls) <= maxW) line = t; else { out.push(line); line = w; }
      });
      out.push(line);
    });
    return out;
  }
  /* The largest size, up to px, at which str wraps into no more than max lines of maxW (never below floor x px). */
  function fitWrap(K, str, px, maxW, weight, max, floor, ls, upper) {
    var size = px, lines;
    for (;;) {
      lines = wrapLines(K, str, size, maxW, weight, ls, upper);
      var wide = Math.max.apply(null, lines.map(function (l) { return K.tw(l, size, weight, ls); }));
      if ((lines.length <= max && wide <= maxW) || size <= px * floor + 0.01) break;
      size = Math.max(px * floor, size * 0.97);
    }
    return { size: size, lines: lines, text: lines.join("\n"), n: lines.length };
  }
  function fit1(K, str, px, maxW, weight, floor, upper, ls) {
    var s = String(str || "").trim(); if (upper) s = s.toUpperCase();
    var w = K.tw(s, px, weight, ls);
    return w > maxW ? Math.max(px * (floor || 0.5), px * maxW / w) : px;
  }

  /* ---------- the picture behind ---------- */
  /* Each shape at its toolkit placement on the 1080 square: tubes 50% (8005:2724), soft shapes 65% (10002:82), the swirl
     screen-blended (6002:2071), the 3D blob (10061:1441, rotated 173.24deg). cx, cy: where its centre sits. */
  var SHAPES = {
    tubes: { src: SH + "tubes.webp", w: 1480.35, h: 1239.04, cx: -163 + 740.18, cy: -75 + 619.52, opacity: 0.5 },
    soft: { src: SH + "soft-shapes.webp", w: 1112, h: 1391, cx: -13 + 556, cy: 96 + 695.5, opacity: 0.65 },
    swirl: { src: SH + "swirl.webp", w: 1021, h: 745, cx: 49 + 510.5, cy: 130 + 372.5, blend: "screen" },
    blob: { src: SH + "blob.webp", w: 1114, h: 1236, cx: 323.6, cy: 675.2 - 128, rot: 173.24 }
  };
  function shapeFor(K) {
    var g = ground(K);
    return g === "peach" ? "tubes" : g === "cream" ? "soft" : "swirl";
  }
  /* Draw a shape centred at (cx, cy) at scale s. On a ground it was not made for, soft shapes multiply (their cream
     backing then disappears into the ground) and the swirl is held back on dark grounds. */
  function shape(K, name, cx, cy, s, o) {
    o = o || {};
    var S = SHAPES[name], w = S.w * s, h = S.h * s, g = ground(K), blend = S.blend, op = S.opacity;
    if (name === "soft" && g !== "cream") blend = "multiply";
    if (name === "swirl" && g === "dark") op = 0.45;
    return K.pic(S.src, cx - w / 2, cy - h / 2, w, h, { z: o.z == null ? K.Z.motif : o.z, blend: blend, opacity: op, transform: S.rot ? "rotate(" + S.rot + "deg)" : undefined });
  }

  /* The colourway's picture behind a wide frame: soft shapes (an opaque picture) cover the whole frame, the others sit
     across its middle as on the square. */
  function wideShape(K, G) {
    var nm = shapeFor(K);
    if (nm === "soft") return shape(K, nm, G.w / 2, 463, (G.w + 26) / 1112);
    return shape(K, nm, 600 + G.X / 2, nm === "swirl" ? 330 : 300, 0.78);
  }

  /* ---------- footers ---------- */
  /* The cell beside the wordmark with up to four sponsors (JSY#36, 2013:2): SUPPORTED BY, the logos standing on one line,
     the rule and the plus. Logo heights as measured there. */
  var CELL_H = { yoono: 19, rathbones: 17, c5: 42, bdo: 38, red5: 33, wildpeak: 42 };
  function sponsorCells(K, G, y, o) {
    o = o || {};
    var s = G.wide ? 0.85 : 1, ink = o.ink || K.ink, fill = o.fill == null ? K.light : o.fill, z = K.Z.chrome, out = [];
    var rx = G.wide ? 352 : 410, rw = G.wide ? 798 + G.X : 622;
    out.push(K.box(48, y, 349 * s, 120 * s, { line: 2 * s, color: ink, fill: fill, z: z }));
    out.push(K.mark("wordmark", 48 + 23.5 * s, y + 27 * s, 305.4 * s, 62.84 * s, { color: ink, z: z, label: "TEKEX" }));
    out.push(K.box(rx, y, rw, 120 * s, { line: 2 * s, color: ink, fill: fill, z: z }));
    out.push(K.text(rx + 30 * s, y + 24 * s, "SUPPORTED BY", { size: 15.747 * s, weight: 500, lh: 1, color: ink, z: z }));
    var logos = K.sponsors(), x0 = rx + 30 * s, x1 = rx + rw - 59 * s;
    var ws = logos.map(function (l) { return (CELL_H[l.key] || 36) * s * l.ar; }), tot = ws.reduce(function (a, b) { return a + b; }, 0);
    var minGap = 22 * s, k = logos.length > 1 && tot + minGap * (logos.length - 1) > x1 - x0 ? (x1 - x0 - minGap * (logos.length - 1)) / tot : 1;
    var gap = logos.length > 1 ? (x1 - x0 - tot * k) / (logos.length - 1) : 0, cx = x0;
    // four logos take the toolkit's own places (JSY#36: 440, 576, 769, 864 on the 1080 frame); other counts share the gaps
    var four = logos.length === 4 && !G.wide ? [30, 166, 359, 454] : null;
    logos.forEach(function (l, i) {
      var lw = ws[i] * k, lh = lw / l.ar, bottom = y + ({ c5: 73, yoono: 71 }[l.key] || 69) * s;
      if (four) cx = Math.min(rx + four[i] * s, x1 - lw);
      out.push(K.mark(l.src, cx, bottom - lh, lw, lh, { color: ink, z: z, label: l.key })); cx += lw + gap;
    });
    out.push(K.box(rx + 30 * s, y + 91 * s, rw - 99 * s, 8 * s, { fill: ink, z: z }));
    out.push(K.mark("plus", rx + rw - 56 * s, y + 82 * s, 26 * s, 26 * s, { color: ink, z: z }));
    return out;
  }
  /* The footer the chosen sponsors call for, at y (1080 frames) or the wide footer. */
  function footer(K, G, d, y, o) {
    o = o || {};
    var n = K.sponsors().length, ink = o.ink || K.ink;
    if (o.category || n === 0) return K.chrome({ topBar: false, foot: "cells", label: d.copy.footLabel || "EVENTS", ink: ink, cellFill: o.fill, labelField: "footLabel" });
    if (n <= 4) return sponsorCells(K, G, G.wide ? 474 : y, { ink: ink, fill: o.fill });
    if (G.wide) return K.chrome({ topBar: false, foot: "sponsors", ink: ink, footFill: o.fill });
    return K.sponsorStrip(48, y, 984, { ink: ink, fill: o.fill == null ? K.light : o.fill, z: K.Z.chrome });
  }

  /* ---------- 0 Tonight ---------- */
  /* 1080: the wordmark, the event code and one huge word or date, standing on the footer (IOM#02 and JSY#36 at 216 / 440 /
     700.6; IOM#3 sets its code at 320px, from 198 / 410 / 697.6). A venue line (AI Sprint GSY) lifts the stack. */
  function tonight(d, K, G) {
    var c = K.c, els = [], runs = codeRuns(c.code), venue = K.has("venue"), g = ground(K);
    if (!G.wide) {
      var cap = venue ? 157.012 : 320, cs = Math.max(90, codeSize(K, runs, cap, 269.157, 960)), t = venue ? 0 : Math.max(0, Math.min(1, (cs - 269.157) / 50.843));
      var big = fit1(K, c.headline, 216.44, 960, 600, 0.4, true);
      // the stack on the square, then moved into a tall frame
      var codeBot = venue ? 509 : 669 + 13 * t, bigTop = venue ? 589 : 700.6 - 3 * t, off = 224 - 12 * t;
      var slack = Math.max(0, 0.85 * ((venue ? 157.012 : 269.157) - cs)) / 2, codeTop = codeBot - 0.85 * cs + slack, wmY = codeTop - off;
      var dy = G.portrait ? 85 : G.story ? (171 + 64 + (1566 - 235 - (884.6 - 216)) / 2) - 216 : 0;
      var fy = G.foot, sq = G.square;
      // the picture
      var nm = shapeFor(K), S = SHAPES[nm];
      if (nm === "soft") els.push(shape(K, nm, S.cx, G.story ? 1362.9 - 400 : S.cy, G.story ? 1.4 : 1));
      else if (nm === "tubes") els.push(shape(K, nm, S.cx - (G.portrait ? 9 : 0), S.cy - (G.portrait ? 2 : 0) + (G.story ? dy : 0), G.story ? 1.5 : 1));
      else els.push(shape(K, nm, S.cx - (G.portrait ? 9 : 0), S.cy + (G.portrait ? 173 : G.story ? dy + 40 : 0), G.story ? 1.3 : 1));
      els.push(K.chrome({ url: "left", poweredTop: true, foot: "none" }));
      els.push(wordmark(K, 72 + 5 * t, wmY + dy, 925.739));
      els.push(K.text(71 - 8 * t, codeTop + dy, runs, { size: cs, lh: 0.85, field: "code", fit: "code", w: 968, h: 0.85 * cs + 2 }));
      els.push(K.text(67 + 6 * t, bigTop + dy, String(c.headline || "").toUpperCase(), { size: big, lh: 0.85, field: "headline", fit: "headline", w: 968, h: 0.85 * big + 2 }));
      if (venue) { var vs = fit1(K, c.venue, 100, 960, 600, 0.5); els.push(K.text(67, 793 + dy + (100 - vs) * 0.85, c.venue, { size: vs, lh: 0.85, field: "venue", fit: "venue", w: 968, h: 0.85 * vs + 2 })); }
      els.push(footer(K, G, d, fy, { fill: g === "cream" ? K.rgba(K.light, 0.75) : K.light }));
      void sq;
      return els;
    }
    // 1200 x 627 (and 1920 x 1080): the wordmark and the code side by side, the word or date across the frame below.
    var X = G.X, R = wideRows(K, G, runs, 1);
    els.push(wideShape(K, G));
    els.push(K.chrome({ foot: "none" }));
    if (venue) els.push(K.text(72, 65, c.venue, { size: 42, weight: 300, lh: 0.92, field: "venue", z: K.Z.top }));
    els.push(R.els);
    var bw = 1078 + X, bs = fit1(K, c.headline, 240, bw, 600, 0.45, true);
    els.push(K.text(67, 452 - BASE * bs, String(c.headline || "").toUpperCase(), { size: bs, lh: 0.85, field: "headline", fit: "headline", w: bw + 10, h: 0.85 * bs + 2 }));
    els.push(footer(K, G, d, 474, { fill: g === "cream" ? K.rgba(K.light, 0.75) : K.light }));
    return els;
  }
  /* Where the baseline sits in a 0.85 line box, as a fraction of the size (measured on the toolkit renders). */
  var BASE = 0.775;
  /* Wide row 1: the wordmark at height h, the code beside it on the wordmark's foot. */
  function wideRows(K, G, runs, k) {
    var X = G.X, h = 92 * (k || 1), y = 146, wmW = h * WM, out = [];
    out.push(wordmark(K, 72, y, wmW));
    var avail = 1150 + X - (72 + wmW + 30), cs = Math.min(codeSize(K, runs, 320, 269.157, 960) * h / 190.482, 0.98 * avail / Math.max(1, runsW(K, runs, 100) / 100));
    out.push(K.text(72 + wmW + 26, y + h - BASE * cs, runs, { size: cs, lh: 0.85, field: "code", fit: "code", w: avail + 10, h: 0.85 * cs + 2 }));
    return { els: out, bottom: y + h };
  }

  /* ---------- 1 Tickets on sale ---------- */
  /* 1080 (8005:1814): wordmark 169, the code at 316px, then TICKETS ON SALE NOW over the date on the left of a rule and
     the strapline on its right. 4:5 (8006:2): the row restacks full width and grows (date 157 -> 247px). */
  function tickets(d, K, G) {
    var c = K.c, els = [], runs = codeRuns(c.code), X = G.X;
    if (!G.wide) {
      els.push(K.chrome({ url: "left", poweredTop: true, foot: "none" }));
      var nm = shapeFor(K), S = SHAPES[nm];
      if (G.square) {
        els.push(shape(K, nm, S.cx, S.cy, 1));
        var cs = Math.max(90, codeSize(K, runs, 316.168, 269.157, 960)), slack = 0.85 * (316.168 - cs) / 2, codeTop = 629 - 0.85 * cs + slack;
        els.push(wordmark(K, 72, codeTop - 191, 925.739));
        els.push(K.text(71, codeTop, runs, { size: cs, lh: 0.85, field: "code", fit: "code", w: 960, h: 0.85 * cs + 2 }));
        var ls = fit1(K, c.eyebrow, 58.259, 620, 300, 0.5, true), ds = fit1(K, c.date, 157.087, 620, 600, 0.3);
        els.push(K.text(67, 666.4 + (58.259 - ls) * 0.85, String(c.eyebrow || "").toUpperCase(), { size: ls, weight: 300, lh: 0.85, field: "eyebrow" }));
        els.push(K.text(72.3, 724.5 + (157.087 - ds) * 0.85, c.date, { size: ds, lh: 0.85, field: "date", fit: "date", w: 630, h: 0.85 * ds + 2 }));
        els.push(K.box(706.5, 665, 3, 185, { fill: K.ink, z: K.Z.text }));
        var st = fitWrap(K, c.body, 51.091, 285, 600, 4, 0.7);
        els.push(K.text(738, 661, st.text, { size: st.size, lh: 0.92, wrap: true, field: "body", fit: "body", w: 300, h: 4 * 0.92 * 51.091 + 6 }));
        els.push(footer(K, G, d, 915));
        return els;
      }
      // tall: everything restacked full width (portrait as 8006:2, story moved into the 9:16 safe area)
      var dy = G.story ? 252.5 : 0;
      if (nm === "tubes") els.push(shape(K, nm, S.cx - 9, S.cy - 2 + (G.story ? dy : 0), G.story ? 1.5 : 1));
      else if (nm === "soft") els.push(shape(K, nm, S.cx, G.story ? 1362.9 - 400 : S.cy, G.story ? 1.4 : 1));
      else els.push(shape(K, nm, S.cx - 9, S.cy + 173 + (G.story ? dy : 0), G.story ? 1.3 : 1));
      var cs2 = Math.max(90, codeSize(K, runs, 320, 269.157, 960)), sl2 = 0.85 * (320 - cs2) / 2, ct2 = 407 + sl2 + dy;
      els.push(wordmark(K, 72, ct2 - 212, 925.739));
      els.push(K.text(71, ct2, runs, { size: cs2, lh: 0.85, field: "code", fit: "code", w: 960, h: 0.85 * cs2 + 2 }));
      var ls2 = fit1(K, c.eyebrow, 90, 946, 300, 0.5, true), ds2 = fit1(K, c.date, 246.885, 946, 600, 0.3);
      els.push(K.text(67, 726 + dy + (90 - ls2) * 0.85, String(c.eyebrow || "").toUpperCase(), { size: ls2, weight: 300, lh: 0.85, field: "eyebrow" }));
      els.push(K.text(67, 841 + dy + (246.885 - ds2) * 0.4, c.date, { size: ds2, lh: 0.85, field: "date", fit: "date", w: 965, h: 0.85 * ds2 + 2 }));
      var st2 = fitWrap(K, c.body, 52, 940, 600, 2, 0.75);
      els.push(K.text(69, 1070 + dy, st2.text, { size: st2.size, lh: 0.92, wrap: true, field: "body", fit: "body", w: 960, h: 2 * 0.92 * 52 + 4 }));
      els.push(footer(K, G, d, G.foot));
      return els;
    }
    // 1200 x 627: the wordmark and code in a row, then the label and date, the rule and the strapline, at 0.9
    var r = 0.9, nm3 = shapeFor(K);
    els.push(wideShape(K, G)); void nm3;
    els.push(K.chrome({ foot: "none" }));
    els.push(wideRows(K, G, runs, 0.92).els);
    var dsw = fit1(K, c.date, 157.087 * r, 600, 600, 0.3), lsw = fit1(K, c.eyebrow, 58.259 * r, 600, 300, 0.5, true);
    var dTop = 452 - BASE * dsw, lTop = dTop - (724.5 - 666.4) * r;
    els.push(K.text(67, lTop, String(c.eyebrow || "").toUpperCase(), { size: lsw, weight: 300, lh: 0.85, field: "eyebrow" }));
    els.push(K.text(72, dTop, c.date, { size: dsw, lh: 0.85, field: "date", fit: "date", w: 620, h: 0.85 * dsw + 2 }));
    var colW = Math.max(K.tw(c.date, dsw, 600), K.tw(String(c.eyebrow || "").toUpperCase(), lsw, 300)), dvx = 72 + colW + 22 * r;
    els.push(K.box(dvx, lTop - 1.4 * r, 3 * r, 456 - (lTop - 1.4 * r), { fill: K.ink, z: K.Z.text }));
    // the strapline stays within the row: from the label's top to the date's foot
    var sw = 1150 + X - (dvx + 30 * r) - 10, rowH = 458 - (lTop - 5.4 * r), stw = fitWrap(K, c.body, 51.091 * r, sw, 600, 3, 0.65);
    els.push(K.text(dvx + 30 * r, lTop - 5.4 * r, stw.text, { size: stw.size, lh: 0.92, wrap: true, field: "body", fit: "body", w: sw + 14, h: rowH }));
    els.push(footer(K, G, d, 474));
    return els;
  }

  /* ---------- 2 Last chance ---------- */
  /* 1080 (5:123): a dark glass-sphere field multiplied over the ground at 90%, every mark in the ground colour; the TEKEX
     (Health Innovation) lockup and POWERED BY at the top, the caps headline, the body, the sponsor strip unfilled. The
     sphere field is drawn for this pack (the toolkit's is a photograph). On a dark colourway the ink takes the ground's
     place, so the type is always the light colour. */
  function lastChance(d, K, G) {
    var c = K.c, els = [], X = G.X, lt = lum(K.light) >= lum(K.ink) ? K.light : K.ink;
    var lock = String(c.eyebrow || "").replace(/\s+/g, " ").trim().toUpperCase(), health = lock === "HEALTH INNOVATION JSY";
    var bg = function (w, h) {
      els.push(K.box(0, 0, w, h, { fill: lt, z: K.Z.bg }));
      var bw = Math.max(w, h * 0.8) * 1.0, bh = bw * 1.25;
      els.push(K.pic(SH + "bubbles.webp", 0, 0, bw, bh, { blend: "multiply", opacity: 0.9, z: K.Z.motif }));
    };
    var lockup = function (x, y, s) {
      if (health) { els.push(K.mark("health-lockup", x, y, 526 * s, 154.655 * s, { color: lt, z: K.Z.text, label: "TEKEX Health Innovation JSY" })); return; }
      els.push(wordmark(K, x, y, 526 * s, { color: lt }));
      if (lock) els.push(K.text(x + 12.3 * s, y + 121 * s, lock, { size: 36 * s, weight: 600, lh: 0.92, color: lt, field: "eyebrow" }));
    };
    if (!G.wide) {
      bg(1080, G.h);
      var dy = G.portrait ? 127 : G.story ? 391 : 0, top = G.story ? G.ty : 0;
      lockup(55, 75 + top, 1);
      els.push(K.text(804.7, 75 + top, "POWERED BY", { size: 19.974, weight: 500, lh: 1, color: lt, z: K.Z.text }));
      els.push(K.mark("pottingshed", 804.7, 96.7 + top, 209.29, 44.29, { color: lt, z: K.Z.text, label: "pottingshed" }));
      var hl = fitWrap(K, c.headline, 119.17, 931, 600, 3, 0.6, 0, true);
      var hTop = 330 + dy + (3 - Math.min(3, hl.n)) * 0 + (119.17 - hl.size) * 0.85 * hl.n * 0;
      els.push(K.text(61, hTop, hl.text, { size: hl.size, lh: 0.85, ls: 0, wrap: true, color: lt, field: "headline", fit: "headline", w: 960, h: 308 + 6 }));
      var bd = fitWrap(K, c.body, 44, 971, 400, 4, 0.75, 0);
      els.push(K.text(61, hTop + 0.85 * hl.size * hl.n + 25.1, bd.text, { size: bd.size, weight: 400, lh: 1.12, ls: 0, wrap: true, color: lt, field: "body", fit: "body", w: 1000, h: 4 * 1.12 * 44 + 6 }));
      els.push(footer(K, G, d, G.portrait ? 1184 : G.foot, { ink: lt, fill: "transparent" }));
      return els;
    }
    // 1200 x 627: lockup and POWERED BY on top, the headline on the left, the body beside it on the same foot
    bg(G.w, 627);
    lockup(56, 46, 0.6);
    els.push(K.text(1150 + X - 157, 52, "POWERED BY", { size: 15, weight: 500, lh: 1, color: lt, z: K.Z.text }));
    els.push(K.mark("pottingshed", 1150 + X - 157, 68.3, 157, 33.22, { color: lt, z: K.Z.text, label: "pottingshed" }));
    var hw = 610 + X * 0.6, hlw = fitWrap(K, c.headline, 82, hw, 600, 3, 0.6, 0, true), foot = 440;
    var hTopW = foot - 0.85 * hlw.size * (hlw.n - 1) - BASE * hlw.size;
    els.push(K.text(58, hTopW, hlw.text, { size: hlw.size, lh: 0.85, ls: 0, wrap: true, color: lt, field: "headline", fit: "headline", w: hw + 20, h: 0.85 * hlw.size * 3 + 6 }));
    var bx = 58 + hw + 34, bwid = 1150 + X - bx - 6, bdw = fitWrap(K, c.body, 27, bwid, 400, 6, 0.75, 0);
    els.push(K.text(bx, foot - 1.12 * bdw.size * (bdw.n - 1) - 0.86 * bdw.size, bdw.text, { size: bdw.size, weight: 400, lh: 1.12, ls: 0, wrap: true, color: lt, field: "body", fit: "body", w: bwid + 8, h: 6 * 1.12 * 27 + 6 }));
    els.push(footer(K, G, d, 474, { ink: lt, fill: "transparent" }));
    return els;
  }

  /* ---------- 3 Announce ---------- */
  /* 4:5 (10061:1434), TEKEX's safe-zone form: the top bar at 171 and the footer at 1057, a 3D shape behind and over the
     top bar, and a keylined box with the date line (54px Book) and the headline (121px, standing on the box's foot). The
     square is that composition with the safe zones closed up; the story keeps its own safe area. */
  function announce(d, K, G) {
    var c = K.c, els = [], X = G.X;
    if (!G.wide) {
      var top = G.story ? 171 : G.portrait ? 171 : 43, foot = G.story ? G.foot : G.portrait ? 1057 : 909;
      var bBot = foot - 19, bTop = G.story ? bBot - 520 : bBot - 475, S = SHAPES.blob;
      var sc = G.story ? 1.3 : 1, shy = G.story ? S.cy + 128 + 300 : G.portrait ? S.cy + 128 : S.cy - 20;
      els.push(shape(K, "blob", S.cx + (G.story ? -40 : 0), shy, sc, { z: K.Z.panel }));
      var saveT = G.top, saveF = G.foot; G.top = top; G.foot = foot;
      els.push(K.chrome({ url: "right", foot: "none", topFill: K.light }));
      els.push(K.chrome({ topBar: false, foot: "cells", label: c.footLabel || "EVENTS", labelField: "footLabel", z: K.Z.panel }));
      G.top = saveT; G.foot = saveF;
      els.push(K.box(48, bTop, 983, bBot - bTop, { line: 2, fill: K.light, z: K.Z.panel }));
      var ms = fit1(K, c.date, 54.303, 900, 300, 0.6, false, 0);
      els.push(K.text(73, bTop + 38, c.date, { size: ms, weight: 300, lh: 1, ls: 0, field: "date" }));
      var hl = fitWrap(K, c.headline, 120.927, 894, 600, 3, 0.55);
      var hh = 0.92 * hl.size * hl.n;
      els.push(K.text(69, bBot - 24 - hh, hl.text, { size: hl.size, lh: 0.92, wrap: true, field: "headline", fit: "headline", w: 930, h: hh + 4 }));
      return els;
    }
    // 1200 x 627: the shape to the right, bleeding off the top and the edge; the box on the left over it
    els.push(K.pic(SHAPES.blob.src, 760 + X - 330, -150, 1114 * 0.62, 1236 * 0.62, { z: K.Z.panel, transform: "rotate(173.24deg)" }));
    els.push(K.chrome({ url: "right", foot: "none", topFill: K.rgba(K.light, 0.85), z: K.Z.panel }));
    els.push(K.chrome({ topBar: false, foot: "cells", label: c.footLabel || "EVENTS", labelField: "footLabel", z: K.Z.panel }));
    var bw = 700 + X * 0.4, bt = 148, bb = 451;
    els.push(K.box(48, bt, bw, bb - bt, { line: 1.7, fill: K.light, z: K.Z.panel }));
    var msw = fit1(K, c.date, 34, bw - 50, 300, 0.6, false, 0);
    els.push(K.text(69, bt + 24, c.date, { size: msw, weight: 300, lh: 1, ls: 0, field: "date" }));
    var hlw = fitWrap(K, c.headline, 76, bw - 46, 600, 3, 0.55), hhw = 0.92 * hlw.size * hlw.n;
    els.push(K.text(66, bb - 20 - hhw, hlw.text, { size: hlw.size, lh: 0.92, wrap: true, field: "headline", fit: "headline", w: bw - 20, h: hhw + 4 }));
    return els;
  }

  function build(d, K, G) {
    var L = d.layout || 0;
    if (L === 1) return tickets(d, K, G);
    if (L === 2) return lastChance(d, K, G);
    if (L === 3) return announce(d, K, G);
    return tonight(d, K, G);
  }

  T.add({
    tpl: { partners: true, key: "tk-countdown", short: "Countdown", what: "an event countdown post", name: "Event countdown", theme: "Peach & blue",
      desc: "The build-up to an event and the day itself: tickets on sale, last chance, tonight.", required: ["headline"],
      layouts: ["Tonight", "Tickets on sale", "Last chance", "Announce"] },
    fields: [
      F("code", "Event code", "IOM#3", { on: [0, 1] }),
      F("headline", "Big word or date", "TONIGHT", { on: [0] }),
      F("venue", "Venue", "BDO/C5 Hub", { on: [0], optional: true }),
      F("eyebrow", "Label", "TICKETS ON SALE NOW", { on: [1] }),
      F("date", "Date", "04/11/26", { on: [1] }),
      F("body", "Strapline", "Global Innovation. Isle of Man Opportunity.", { on: [1], optional: true }),
      F("eyebrow", "Lockup line", "HEALTH INNOVATION JSY", { on: [2], optional: true }),
      F("headline", "Headline", "Last chance to get your tickets", { on: [2], kind: "area" }),
      F("body", "Body", "A sentence on what is on.", { on: [2], kind: "area", optional: true }),
      F("date", "Date, time and venue", "13 Feb / 17:00 / C5 Alliance Ltd", { on: [3] }),
      F("headline", "Headline", "Ideas worth sharing, people worth meeting.", { on: [3] }),
      F("footLabel", "Footer word", "EVENTS", { on: [3], optional: true })
    ],
    examples: [
      { code: "IOM#3", headline: "TONIGHT", venue: "" },
      { code: "IOM#3", eyebrow: "TICKETS ON SALE NOW", date: "04/11/26", body: "Global Innovation. Isle of Man Opportunity." },
      { eyebrow: "HEALTH INNOVATION JSY", headline: "Last chance\nto get your tickets", body: "Speakers discuss Wellness and Emerging Therapies, Medtech, Digital Health, the Bioeconomy and Alternative Health Opportunities for Jersey." },
      { date: "13 Feb / 17:00 / C5 Alliance Ltd", headline: "Ideas worth sharing, people worth meeting.", footLabel: "EVENTS" }
    ],
    slots: function () { return []; },
    fill: function () {},
    preload: [T.MARK("health-lockup"), T.MARK("wordmark-large")],
    build: build
  });
})();
