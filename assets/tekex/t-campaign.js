/* Campaign: the "Understanding TEKEX" ad campaign and the TEKEX podcast cover.
   Source: "37918 TKX Ad Campaign - Understanding Tekex" (7mn8qElo8GZbxg4GzmRmIB): Static 1 bullets 4035:44 (1:1),
   4023:2 (4:5), 4035:2 (9:16); Static 2 paragraph 4035:3122, 4023:81, 4035:3166; animation slide 1 kicker and headline
   4025:2 (4:5); slide 7 supporters 4035:87 (4:5). "TKX Podcast Cover" (mNSDBhKxUDNbgyCuBeK4ZT): cover A 2:470 and
   cover B 2:328, both 1280 x 720.
   Layouts: 0 kicker and headline, 1 bullets, 2 paragraph, 3 supporters, 4 podcast cover.
   The campaign is a dark colourway: the ground and white words come from the colourway; its keylines, arrows, bullets
   and logo are the campaign's magenta (#E6007E) whenever the ground is dark, and the colourway's ink on a light ground.
   The tall formats use the campaign's own 4:5 and 9:16 frames (bars pulled in to 172 / 1057 at 4:5). The podcast cover
   is cover A at 16:9 (its own proportions), cover B at 1200 x 627 (Figma calls B the "1200 build"), and cover B's
   arrangement (title bar, hosts, logo and guests cells) on the square and tall formats. */
(function () {
  var T = window.HS_TEKEX, SH = "assets/tekex/shapes/";
  var RING = SH + "campaign-ring.webp", BURST = SH + "campaign-burst.webp", BLOB = SH + "campaign-blob.webp";
  var F = function (key, label, ph, more) { return Object.assign({ key: key, label: label, ph: ph }, more || {}); };
  function lum(c) { var m = String(c).match(/[\d.]+/g) || [0, 0, 0]; return (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255; }
  function accent(K) { return lum(K.light) < 0.2 ? "#E6007E" : K.ink; }
  function up(s) { return String(s || "").toUpperCase(); }
  function widest(K, lines, size, weight) { return Math.max.apply(null, lines.map(function (l) { return K.tw(l, size, weight); }).concat([0])); }
  /* Running text: fill each line as far as it goes. */
  function wrap(K, str, size, maxW, weight, ls) {
    var out = [];
    String(str || "").split(/\n/).forEach(function (para) {
      var words = para.trim().split(/\s+/).filter(Boolean), line = "";
      words.forEach(function (w) { var t = line ? line + " " + w : w; if (line && K.tw(t, size, weight, ls || 0) > maxW) { out.push(line); line = w; } else line = t; });
      if (line) out.push(line);
    });
    return out;
  }
  /* The frame per format: where the bars sit (the campaign's own conventions). */
  function frame(G) {
    if (G.story) return { top: 171, foot: 1566 };
    if (G.portrait) return { top: 172, foot: 1057 };
    return { top: 44, foot: 909 };
  }

  /* ---------- the campaign frame: THIS IS TEKEX top bar, TEKEX.CO footer ---------- */
  function chrome(K, G, P, o) {
    o = o || {};
    var A = accent(K), W = K.ink, out = [], op = o.opacity == null ? 1 : o.opacity, z = K.Z.chrome, X = G.X;
    var bar = String(K.c.extra || "This is TEKEX").trim().toUpperCase().split(/\s+/), last = bar.pop();
    var runs = (bar.length ? [{ t: bar.join(" ") + " ", weight: 500 }] : []).concat([{ t: last, weight: 600 }]);
    if (!G.wide) {
      var top = P.top, foot = P.foot;
      out.push(K.box(48, top, 983, 64, { line: 2, color: A, fill: K.light, opacity: op, z: z }));
      var tw = K.tw(bar.join(" ") + (bar.length ? " " : ""), 32, 500) + K.tw(last, 32, 600), tx = Math.min(802, 1009 - tw);
      out.push(K.mark("arrow-small", tx - 35 - 1.11, top + 24.39 - 0.94, 24.02, 24.02, { rot: -90, color: A, z: K.Z.top }));
      out.push(K.text(tx, top + 17, runs, { size: 32, color: W, z: K.Z.top, field: "extra" }));
      out.push(K.box(48, foot, 349, 120, { line: 2, color: A, fill: K.light, opacity: op, z: z }));
      out.push(K.mark("wordmark", 71.5, foot + 27, 305.4, 62.84, { color: A, z: z, label: "TEKEX" }));
      out.push(K.box(410, foot, 622, 120, { line: 2, color: A, fill: K.light, opacity: op, z: z }));
      out.push(K.mark("arrow-down", 436.51, foot + 24.97, 64.985, 64.985, { color: A, z: z }));
      out.push(K.text(514, foot + 24, [{ t: "TEKEX", weight: 600 }, { t: ".CO", weight: 400 }], { size: 46, color: W, z: z }));
      out.push(K.box(514, foot + 81, 456, 8, { fill: A, z: z }));
      out.push(K.mark("plus", 983, foot + 72, 26, 26, { color: A, z: z }));
      out.push(K.text(805, foot + 24, "POWERED BY", { size: 15.747, weight: 500, lh: 1, color: W, z: z }));
      out.push(K.mark("pottingshed", 805, foot + 41.12, 165, 34.917, { color: W, z: z, label: "pottingshed" }));
      return out;
    }
    // 1200 x 627: TEKEX's landscape frame (C-1200) in the campaign's colours
    out.push(K.box(48, 44, 1102 + X, 81, { line: 2, color: A, fill: K.light, opacity: op, z: z }));
    var tw2 = K.tw(bar.join(" ") + (bar.length ? " " : ""), 32, 500) + K.tw(last, 32, 600), tx2 = 1123 + X - tw2;
    out.push(K.mark("arrow-small", tx2 - 35 - 1.11, 78.39 - 0.94, 24.02, 24.02, { rot: -90, color: A, z: K.Z.top }));
    out.push(K.text(tx2, 74, runs, { size: 32, color: W, z: K.Z.top, field: "extra" }));
    out.push(K.box(48, 474, 296.65, 102, { line: 1.7, color: A, fill: K.light, opacity: op, z: z }));
    out.push(K.mark("wordmark", 68.4, 496.95, 257.86, 53.06, { color: A, z: z, label: "TEKEX" }));
    out.push(K.box(352, 474, 798 + X, 102, { line: 1.7, color: A, fill: K.light, opacity: op, z: z }));
    out.push(K.mark("arrow-down", 368 - 2.12, 496.88 - 2.51, 54.387, 54.387, { color: A, z: z }));
    out.push(K.text(434, 494.4, [{ t: "TEKEX", weight: 600 }, { t: ".CO", weight: 400 }], { size: 39.1, color: W, z: z }));
    out.push(K.box(434, 542.6, 660 + X, 6.8, { fill: A, z: z }));
    out.push(K.mark("plus", 1103.35 + X, 535.2, 22.1, 22.1, { color: A, z: z }));
    out.push(K.text(993.1 + X, 494, "POWERED BY", { size: 12.598, weight: 500, lh: 1, color: W, z: z }));
    out.push(K.mark("pottingshed", 993.1 + X, 507.69, 132, 27.93, { color: W, z: z, label: "pottingshed" }));
    return out;
  }
  /* The 3D art, screened over the ground. sq/pt/st: [x, y, w, h] per format as measured; wide: centred right of the panel. */
  function art(K, G, src, pos, opacity, wide) {
    var p = G.story ? pos.st : G.portrait ? pos.pt : pos.sq;
    if (G.wide) { var s = wide.s, w = p[2] * s, h = p[3] * s; p = [wide.cx + G.X * 0.6 - w / 2, wide.cy - h / 2, w, h]; }
    return K.pic(src, p[0], p[1], p[2], p[3], { blend: "screen", opacity: opacity, z: K.Z.motif });
  }
  function panel(K, x, y, w, h, line) { return K.box(x, y, w, h, { line: line || 2, color: accent(K), fill: K.light, opacity: 0.95, z: K.Z.panel }); }

  /* ---------- 0: kicker and headline (animation slide 1) ---------- */
  function kicker(d, K, G) {
    var c = K.c, A = accent(K), P = frame(G), els = [];
    var pos = { sq: [-744, -213, 2520, 1464], pt: [-744, -113, 2520, 1464], st: [-720, -155, 2520, 1464] };
    els.push(art(K, G, RING, pos, 0.8, { s: 0.62, cx: 900, cy: 300 }));
    if (G.portrait) els.push(K.box(0, 0, G.w, G.h, { fill: "rgba(0,0,0,0.2)", z: K.Z.bg }));
    if (!G.wide) {
      var bottom = P.foot - 19, hb = bottom - 31, minTop = P.top + 64 + 40;
      var h = K.fit(c.headline, 108, 940, 600, 3, 0.5), hs = h.size;
      var room = function (n, s) { return hb - n * s * 0.92 - (K.has("eyebrow") ? 38.3 + 54 : 10) - 26; };
      while (room(h.n, hs) < minTop && hs > 60) { hs -= 4; h = K.fit(c.headline, hs, 940, 600, 3, 0.5); }
      var hTop = hb - h.n * h.size * 0.92, kTop = hTop - 38.3 - 54, pTop = (K.has("eyebrow") ? kTop : hTop - 10) - 26;
      els.push(panel(K, 48, pTop, 983, bottom - pTop));
      if (K.has("eyebrow")) els.push(K.text(74, kTop, K.fit(c.eyebrow, 54.303, 930, 400, 1, 0.6).text, { size: K.fit(c.eyebrow, 54.303, 930, 400, 1, 0.6).size, weight: 400, lh: 1, ls: 0, color: A, field: "eyebrow" }));
      els.push(K.text(69, hTop, h.text, { size: h.size, ls: -0.01, wrap: true, field: "headline", fit: "headline", w: 980, h: h.n * h.size * 0.92 + 4 }));
      els.push(chrome(K, G, P));
      return els;
    }
    var X = G.X, pw = 620 + X * 0.3, hw = K.fit(c.headline, 70, pw - 60, 600, 3, 0.55), kw = K.fit(c.eyebrow, 34, pw - 60, 400, 1, 0.6);
    var hTop2 = 430 - hw.n * hw.size * 0.92, kTop2 = hTop2 - 24 - 34, pTop2 = Math.max(140, (K.has("eyebrow") ? kTop2 : hTop2 - 6) - 18);
    els.push(panel(K, 48, pTop2, pw, 457 - pTop2, 1.7));
    if (K.has("eyebrow")) els.push(K.text(66, kTop2, kw.text, { size: kw.size, weight: 400, lh: 1, ls: 0, color: A, field: "eyebrow" }));
    els.push(K.text(64, hTop2, hw.text, { size: hw.size, ls: -0.01, wrap: true, field: "headline", fit: "headline", w: pw - 30, h: hw.n * hw.size * 0.92 + 4 }));
    els.push(chrome(K, G, P));
    return els;
  }

  /* ---------- 1: bullets (Static 1) ---------- */
  function bulletLayout(K, items, size, maxW) {
    var rows = [];
    items.forEach(function (it) { wrap(K, it, size, maxW, 400).forEach(function (l, i) { rows.push({ t: l, first: i === 0 }); }); });
    return rows;
  }
  function bullets(d, K, G) {
    var c = K.c, A = accent(K), P = frame(G), els = [];
    var pos = { sq: [-744, -213, 2520, 1464], pt: [-744, -113, 2520, 1464], st: [-720, -155, 2520, 1464] };
    els.push(art(K, G, RING, pos, 0.8, { s: 0.62, cx: 920, cy: 280 }));
    if (G.portrait) els.push(K.box(0, 0, G.w, G.h, { fill: "rgba(0,0,0,0.2)", z: K.Z.bg }));
    var items = String(c.body || "").split(/\n+/).map(function (s) { return s.replace(/^\s*[•\-\*]\s*/, "").trim(); }).filter(Boolean);
    if (!G.wide) {
      var M = G.portrait ? { hx: 82, bx: 119, pad: 52, gap: 29.5, gy: 0, bot: 35.4, b: 19 } : { hx: 79, bx: 108, pad: 50, gap: 23.5, gy: -4, bot: 38.4, b: G.story ? 19 : 18 };
      var bottom = P.foot - M.b, minTop = P.top + 64 + 30, k = 1, h, rows, bs, H;
      for (var i = 0; i < 20; i++) {
        h = K.fit(c.headline, 120.927 * k, 930, 600, 2, 0.5); bs = 52 * k;
        rows = bulletLayout(K, items, bs, 1007 - M.bx);
        H = M.pad * k + h.n * h.size * 0.92 + M.gap * k + rows.length * bs * 1.2 + M.bot * k;
        if (bottom - H >= minTop || k < 0.6) break;
        k -= 0.04;
      }
      var py = bottom - H, hy = py + M.pad * k, by = hy + h.n * h.size * 0.92 + M.gap * k;
      els.push(panel(K, 48, py, 983, bottom - py));
      els.push(K.text(M.hx, hy, h.text, { size: h.size, wrap: true, field: "headline", fit: "headline", w: 960, h: h.n * h.size * 0.92 + 4 }));
      els.push(K.text(M.bx, by, rows.map(function (r) { return r.t; }).join("\n"), { size: bs, weight: 400, lh: 1.2, ls: 0, wrap: true, field: "body", fit: "body", w: 1031 - M.bx, h: Math.max(0, bottom - by - 10) }));
      els.push(K.text(M.hx, by + M.gy * k, rows.map(function (r) { return r.first ? "•" : " "; }).join("\n"), { size: bs, weight: 300, lh: 1.2, ls: 0, wrap: true, color: A }));
      els.push(chrome(K, G, P, { opacity: 0.95 }));
      return els;
    }
    var X = G.X, pw = 660 + X * 0.3, kk = 1, hw, rw, bw, Hw;
    for (var j = 0; j < 20; j++) {
      hw = K.fit(c.headline, 64 * kk, pw - 50, 600, 2, 0.5); bw = 29 * kk; rw = bulletLayout(K, items, bw, pw - 64);
      Hw = 26 + hw.n * hw.size * 0.92 + 14 + rw.length * bw * 1.2 + 20;
      if (Hw <= 457 - 140 || kk < 0.6) break;
      kk -= 0.04;
    }
    var pyw = 457 - Hw, hyw = pyw + 26, byw = hyw + hw.n * hw.size * 0.92 + 14;
    els.push(panel(K, 48, pyw, pw, Hw, 1.7));
    els.push(K.text(66, hyw, hw.text, { size: hw.size, wrap: true, field: "headline", fit: "headline", w: pw - 30, h: hw.n * hw.size * 0.92 + 4 }));
    els.push(K.text(84, byw, rw.map(function (r) { return r.t; }).join("\n"), { size: bw, weight: 400, lh: 1.2, ls: 0, wrap: true, field: "body", fit: "body", w: pw - 40, h: 457 - byw - 6 }));
    els.push(K.text(66, byw - 2, rw.map(function (r) { return r.first ? "•" : " "; }).join("\n"), { size: bw, weight: 300, lh: 1.2, ls: 0, wrap: true, color: A }));
    els.push(chrome(K, G, P, { opacity: 0.95 }));
    return els;
  }

  /* ---------- 2: paragraph (Static 2) ---------- */
  function paragraph(d, K, G) {
    var c = K.c, P = frame(G), els = [];
    var pos = { sq: [-850, -228, 2694, 1787], pt: [-868, -203, 2694, 1787], st: [-868, -203, 2694, 1787] };
    els.push(art(K, G, BURST, pos, 0.7, { s: 0.5, cx: 930, cy: 300 }));
    if (G.portrait) els.push(K.box(0, 0, G.w, G.h, { fill: "rgba(0,0,0,0.2)", z: K.Z.bg }));
    if (!G.wide) {
      var bottom = P.foot - (G.square ? 22 : 19), minTop = P.top + 64 + 30, k = 1, h, ls, ps, H;
      for (var i = 0; i < 20; i++) {
        h = K.fit(c.headline, 120.927 * k, 930, 600, 2, 0.5); ps = 54.303 * k;
        ls = wrap(K, c.body, ps, 920, 400);
        H = 49 * k + h.n * h.size * 0.92 + (182 - 49 - 111.25) * k + ls.length * ps * 1.1 + 49.3 * k;
        if (bottom - H >= minTop || k < 0.6) break;
        k -= 0.04;
      }
      var py = bottom - H, hy = py + 49 * k, by = hy + h.n * h.size * 0.92 + (182 - 49 - 111.25) * k;
      els.push(panel(K, 48, py, 983, bottom - py));
      els.push(K.text(99, hy, h.text, { size: h.size, wrap: true, field: "headline", fit: "headline", w: 940, h: h.n * h.size * 0.92 + 4 }));
      els.push(K.text(99, by, ls.join("\n"), { size: ps, weight: 400, lh: 1.1, ls: 0, wrap: true, field: "body", fit: "body", w: 932, h: Math.max(0, bottom - by - 8) }));
      els.push(chrome(K, G, P, { opacity: 0.95 }));
      return els;
    }
    var X = G.X, pw = 680 + X * 0.3, kk = 1, hw, lw, pz, Hw;
    for (var j = 0; j < 20; j++) {
      hw = K.fit(c.headline, 64 * kk, pw - 56, 600, 2, 0.5); pz = 29 * kk; lw = wrap(K, c.body, pz, pw - 60, 400);
      Hw = 26 + hw.n * hw.size * 0.92 + 14 + lw.length * pz * 1.1 + 22;
      if (Hw <= 457 - 140 || kk < 0.6) break;
      kk -= 0.04;
    }
    var pyw = 457 - Hw, hyw = pyw + 26, byw = hyw + hw.n * hw.size * 0.92 + 14;
    els.push(panel(K, 48, pyw, pw, Hw, 1.7));
    els.push(K.text(70, hyw, hw.text, { size: hw.size, wrap: true, field: "headline", fit: "headline", w: pw - 30, h: hw.n * hw.size * 0.92 + 4 }));
    els.push(K.text(70, byw, lw.join("\n"), { size: pz, weight: 400, lh: 1.1, ls: 0, wrap: true, field: "body", fit: "body", w: pw - 30, h: 457 - byw - 6 }));
    els.push(chrome(K, G, P, { opacity: 0.95 }));
    return els;
  }

  /* ---------- 3: supporters (animation slide 7) ---------- */
  var SIX = { yoono: [97, 126, 517, 103], bdo: [689, 123, 283, 108.7], rathbones: [233.7, 299.8, 741.3, 81.9], c5: [98, 442, 172, 154], red5: [335, 458.25, 351, 121.5], wildpeak: [743, 442, 233, 154] };
  /* Logos in rows across a box: the slide's own arrangement when all six are chosen, otherwise rows that fill the width. */
  function logoGrid(K, x, y, w, h, rowH, gap) {
    var logos = K.sponsors(), out = [];
    if (!logos.length) return out;
    // compact marks (C5, Wild Peak) are set larger, as on the slide (154 high against 103 to 120)
    var kf = function (l) { return l.ar < 2 ? 1.3 : 1; }, ar = function (l) { return l.ar * kf(l) * (l.ar > 4 ? 0.95 : 1); }, best = null;
    // try one to three rows (split in order, by count) and keep the arrangement with the tallest logos
    for (var r = 1; r <= Math.min(3, logos.length); r++) {
      var per = Math.ceil(logos.length / r), rows = [];
      for (var i = 0; i < logos.length; i += per) rows.push(logos.slice(i, i + per));
      var H = Math.min(rowH, (h - (rows.length - 1) * gap * 0.6) / rows.length);
      rows.forEach(function (row) { var need = row.reduce(function (a, l) { return a + H * ar(l); }, 0) + (row.length - 1) * gap; if (need > w) H = Math.min(H, H * (w - (row.length - 1) * gap) / (need - (row.length - 1) * gap)); });
      if (!best || H > best.H + 0.5) best = { rows: rows, H: H };
    }
    var R = best.rows, Hh = best.H, vgap = R.length > 1 ? Math.min(gap * 1.6, (h - R.length * Hh) / (R.length - 1)) : 0, y0 = y + (h - (R.length * Hh + (R.length - 1) * vgap)) / 2;
    R.forEach(function (row, ri) {
      var ws = row.map(function (l) { return Math.min(w, Hh * ar(l)); }), tot = ws.reduce(function (a, b) { return a + b; }, 0);
      var g = row.length > 1 ? (w - tot) / (row.length - 1) : 0, cx = x, cy = y0 + ri * (Hh + vgap);
      row.forEach(function (l, i) { var lw = ws[i], lh = lw / l.ar; out.push(K.mark(l.src, cx, cy + (Hh - lh) / 2, lw, lh, { color: K.ink, z: K.Z.text, label: l.key })); cx += lw + g; });
    });
    return out;
  }
  function supporters(d, K, G) {
    var c = K.c, A = accent(K), P = frame(G), els = [];
    var pos = { sq: [-872, -106, 2227, 1376], pt: [-872, -6, 2227, 1376], st: [-848, -48, 2227, 1376] };
    els.push(art(K, G, BLOB, pos, 0.7, { s: 0.55, cx: 760, cy: 290 }));
    if (G.portrait) els.push(K.box(0, 0, G.w, G.h, { fill: "rgba(0,0,0,0.2)", z: K.Z.bg }));
    var lab = c.eyebrow || "Supported by", keys = K.sponsors().map(function (l) { return l.key; }).sort().join();
    if (!G.wide) {
      var bottom = P.foot - 19, py = Math.max(P.top + 64 + 30, bottom - 632);
      els.push(panel(K, 48, py, 983, bottom - py));
      els.push(K.text(98, py + 33, K.fit(lab, 44.288, 880, 500, 1, 0.6, true).text, { size: K.fit(lab, 44.288, 880, 500, 1, 0.6, true).size, weight: 500, lh: 1, upper: true, color: A, field: "eyebrow" }));
      if (keys === "bdo,c5,rathbones,red5,wildpeak,yoono") {
        K.sponsors().forEach(function (l) { var p = SIX[l.key]; els.push(K.mark(l.src, p[0], py + p[1], p[2], p[3], { color: K.ink, z: K.Z.text, label: l.key })); });
      } else els.push(logoGrid(K, 98, py + 123, 877, bottom - py - 123 - 36, 120, 60));
      els.push(chrome(K, G, P));
      return els;
    }
    var X = G.X;
    els.push(panel(K, 48, 140, 1102 + X, 317, 1.7));
    els.push(K.text(72, 160, K.fit(lab, 30, 900, 500, 1, 0.6, true).text, { size: K.fit(lab, 30, 900, 500, 1, 0.6, true).size, weight: 500, lh: 1, upper: true, color: A, field: "eyebrow" }));
    els.push(logoGrid(K, 74, 214, 1050 + X, 220, 78, 50));
    els.push(chrome(K, G, P));
    return els;
  }

  /* ---------- 4: podcast cover ---------- */
  function hostSlots(K, boxes) { return boxes.map(function (b, i) { return K.slot("host-" + (i + 1), "Host " + (i + 1), b[0], b[1], b[2], b[3], { z: K.Z.photo }); }); }
  /* Guests: the first name or pair in SemiBold, from "&" on in Regular (cover B). */
  function guestRuns(str) {
    var s = String(str || ""), i = s.indexOf(" & ");
    return i < 0 ? [{ t: s, weight: 600 }] : [{ t: s.slice(0, i), weight: 600 }, { t: s.slice(i), weight: 400 }];
  }
  /* Supporter logos in one row from x0 to x1, centred on cy, at the measured heights (wide marks 13.6, others 46). */
  function logoRow(K, x0, x1, cy, s, color) {
    var logos = K.sponsors(), out = [];
    if (!logos.length) return out;
    var ws = logos.map(function (l) { return l.ar > 4 ? Math.min(118.4, 13.6 * l.ar) * s : Math.min(70, 40 * l.ar) * s; }), tot = ws.reduce(function (a, b) { return a + b; }, 0);
    var gap = logos.length > 1 ? Math.min(60 * s, (x1 - x0 - tot) / (logos.length - 1)) : 0;
    if (gap < 10 * s) { var f = (x1 - x0 - 10 * s * (logos.length - 1)) / tot; ws = ws.map(function (w) { return w * f; }); gap = 10 * s; tot = ws.reduce(function (a, b) { return a + b; }, 0); }
    var cx = x1 - tot - gap * (logos.length - 1);
    logos.forEach(function (l, i) { var lw = ws[i], lh = lw / l.ar; out.push(K.mark(l.src, cx, cy - lh / 2, lw, lh, { color: color, z: K.Z.chrome, label: l.key })); cx += lw + gap; });
    return out;
  }
  function podcast(d, K, G) {
    var c = K.c, A = accent(K), W = lum(K.light) < 0.2 ? K.ink : K.ink, els = [], z = K.Z.chrome;
    var hosts = d.images && (d.images["host-1"] || d.images["host-2"]), n = K.sponsors().length;
    var title = String(c.headline || ""), ci = title.indexOf(":"), series = ci > 0 ? title.slice(0, ci + 1) : "", ep = ci > 0 ? title.slice(ci + 1).trim() : title;
    if (G.wide && G.w < 1150) {
      // cover A (2:470) at 16:9: Figma px x s
      var s = 627 / 720, E = 0, f = function (v) { return v * s; }, ln = 1.7 * s;
      els.push(K.box(f(40), f(40), f(296.6), f(102), { line: ln, color: A, fill: K.light, z: z }));
      els.push(K.mark("wordmark", f(60.4 - 0.43), f(62.95 - 0.17), f(259.6), f(53.45), { color: A, z: z, label: "TEKEX" }));
      els.push(K.box(f(362), f(41), f(880) + E, f(101), { line: ln, color: A, fill: K.light, z: z }));
      els.push(K.mark("arrow-down", f(378 - 2.12), f(66.9 - 2.51), f(54.387), f(54.387), { color: A, z: z }));
      var lb = K.fit(c.eyebrow, f(39.1), f(620), 600, 1, 0.6, true);
      els.push(K.text(f(444), f(64.4) + (f(39.1) - lb.size) * 0.5, lb.text, { size: lb.size, upper: true, color: A, field: "eyebrow", z: K.Z.top }));
      els.push(K.box(f(447), f(116 - 3.4), f(750) + E, f(6.8), { fill: A, z: z }));
      els.push(K.text(f(1095) + E, f(63), "POWERED BY", { size: f(12.598), weight: 500, lh: 1, color: A, z: z }));
      els.push(K.mark("pottingshed", f(1095) + E, f(76.7), f(132), f(27.93), { color: A, z: z, label: "pottingshed" }));
      els.push(K.mark("plus", f(1205) + E, f(105), f(22.1), f(22.1), { color: A, z: z }));
      els.push(K.box(f(40), f(187), f(532), f(493), { line: ln, color: A, fill: K.light, z: K.Z.panel }));
      // the episode title, right-aligned to 557 and set justified, line by line; the series line above it
      // the lines fill from the first (DEALS FROM / A TO Z), as the cover sets them, rather than balancing
      var tw = f(487), tsz = f(79.182), tl = wrap(K, up(ep), tsz, tw, 600, -0.02);
      while ((tl.length > 3 || widest(K, tl, tsz, 600) > tw) && tsz > f(79.182) * 0.55) { tsz -= 1; tl = wrap(K, up(ep), tsz, tw, 600, -0.02); }
      var t = { size: tsz, lines: tl, n: tl.length }, lh = t.size * 0.92, ty = f(487.5 + 146) - t.n * lh;
      t.lines.forEach(function (l, i) {
        var lw = K.tw(up(l), t.size, 600), words = l.trim().split(/\s+/).length;
        var just = words > 1 && lw > tw * 0.45;
        var inset = just && i > 0 ? f(6) : 0; // the cover spreads later lines with spaces, so they stop just short of the first line's ends
        els.push(K.text(f(557) - (just ? tw : lw) + inset, ty + i * lh, l, { size: t.size, upper: true, w: just ? tw - inset : undefined, color: A, field: "headline", z: K.Z.text,
          css: just ? { textAlign: "justify", textAlignLast: "justify", whiteSpace: "nowrap" } : {} }));
      });
      if (series) { var sr = K.fit(series, f(48.252), tw, 600, 1, 0.6, true); els.push(K.text(f(70), ty - f(487.5 - 438), sr.text, { size: sr.size, upper: true, color: A, field: "headline", z: K.Z.text })); }
      if (K.has("name")) { var gu = K.fit(c.name, f(26.6), f(470), 500, 1, 0.6); els.push(K.text(f(73.7), f(641.6), gu.text, { size: gu.size, weight: 500, lh: 1, color: A, field: "name", z: K.Z.text })); }
      if (n) {
        els.push(K.text(f(597), f(646), "SUPPORTED BY", { size: f(12.598), weight: 500, lh: 1, color: A, z: z }));
        els.push(logoRow(K, f(741), f(1227) + E, f(654), s, A));
      }
      els.push(hostSlots(K, [[f(585), f(150), f(370), n ? f(470) : f(570)], [f(890), f(165), f(370), n ? f(455) : f(555)]]));
      return els;
    }
    if (G.wide) {
      // cover B (2:328) at 1200 x 627: Figma px x s, the bars stretched to the right edge
      var s2 = 627 / 720, E2 = G.w - 1280 * s2, g = function (v) { return v * s2; }, ln2 = 1.7 * s2;
      els.push(hostSlots(K, [[g(30), g(150), g(560), g(570)], [g(700) + E2, g(170), g(560), g(550)]]));
      // a title too long for one line takes two, and the bar grows (as in the two-line covers 1:60 and 2:213)
      var tt = K.fit(title, g(82.209), g(1140) + E2, 600, 1, 0.75, true);
      if (K.tw(up(title), tt.size, 600) > g(1140) + E2) tt = K.fit(title, g(70), g(1140) + E2, 600, 2, 0.7, true);
      var tbx = (tt.n - 1) * tt.size * 0.92;
      els.push(K.box(g(40), g(40), g(1200) + E2, g(136) + tbx, { line: ln2, color: A, fill: K.light, z: z }));
      els.push(K.text(g(70), g(70) + (tt.n > 1 ? 0 : (g(82.209) - tt.size) * 0.5), tt.text, { size: tt.size, upper: true, wrap: true, color: A, field: "headline", fit: "headline", w: g(1160) + E2, h: tt.n * tt.size * 0.92 + 4, z: K.Z.top }));
      els.push(K.box(g(40), g(524), g(324), g(156), { line: ln2, color: A, fill: K.light, z: z }));
      els.push(K.mark("wordmark", g(70 - 0.43), g(547 - 0.17), g(259.6), g(53.45), { color: A, z: z, label: "TEKEX" }));
      var pn = K.fit(c.eyebrow, g(50.096), g(292), 600, 1, 0.6);
      els.push(K.text(g(70), g(615), pn.text, { size: pn.size, color: A, field: "eyebrow", z: K.Z.top }));
      els.push(K.box(g(378), g(524), g(862) + E2, g(156), { line: ln2, color: A, fill: K.light, z: z }));
      els.push(K.mark("arrow-down", g(398 - 2.12), g(547.9 - 2.51), g(54.387), g(54.387), { color: A, z: z }));
      var gw = g(724) + E2, gs = Math.min(g(39.1), g(39.1) * gw / Math.max(1, K.tw(c.name, g(39.1), 600)));
      if (K.has("name")) els.push(K.text(g(464), g(545.4) + (g(39.1) - gs) * 0.5, guestRuns(c.name), { size: gs, color: A, field: "name", z: K.Z.top }));
      els.push(K.box(g(464), g(597 - 3.4), gw, g(6.8), { fill: A, z: z }));
      els.push(K.mark("plus", g(1197.4) + E2, g(586), g(22.1), g(22.1), { color: A, z: z }));
      els.push(K.text(g(464), g(619), "POWERED BY", { size: g(12.598), weight: 500, lh: 1, color: A, z: z }));
      els.push(K.mark("pottingshed", g(464), g(632.7), g(132), g(27.93), { color: A, z: z, label: "pottingshed" }));
      if (n) {
        els.push(K.text(g(632), g(634), "SUPPORTED BY", { size: g(12.598), weight: 500, lh: 1, color: A, z: z }));
        els.push(logoRow(K, g(759), g(1189) + E2, g(641), s2 * 0.9, A));
      }
      return els;
    }
    // square and tall: cover B's arrangement on TEKEX's 1080 frame
    var top = G.top, foot = G.foot - 36, tb = K.fit(title, 96, 924, 600, 2, 0.5, true), tbh = 34 + tb.n * tb.size * 0.92 + 30;
    var hTop = top + tbh + 20, hH = Math.min(foot - hTop + 40, 940);
    els.push(hostSlots(K, [[-40, foot + 40 - hH, 600, hH], [480, foot + 40 - hH * 0.97, 600, hH * 0.97]]));
    els.push(K.box(48, top, 984, tbh, { line: 2, color: A, fill: K.light, z: z }));
    els.push(K.text(72, top + 34, tb.text, { size: tb.size, upper: true, wrap: true, color: A, field: "headline", fit: "headline", w: 950, h: tb.n * tb.size * 0.92 + 4, z: K.Z.top }));
    els.push(K.box(48, foot, 349, 156, { line: 2, color: A, fill: K.light, z: z }));
    els.push(K.mark("wordmark", 71.5, foot + 25, 305.4, 62.84, { color: A, z: z, label: "TEKEX" }));
    var pn2 = K.fit(c.eyebrow, 58, 300, 600, 1, 0.6);
    els.push(K.text(72, foot + 100, pn2.text, { size: pn2.size, color: A, field: "eyebrow", z: K.Z.top }));
    els.push(K.box(410, foot, 622, 156, { line: 2, color: A, fill: K.light, z: z }));
    els.push(K.mark("arrow-down", 436.51, foot + 22.97, 64.985, 64.985, { color: A, z: z }));
    var gs2 = Math.min(46, 46 * 448 / Math.max(1, K.tw(c.name, 46, 600)));
    if (K.has("name")) els.push(K.text(515, foot + 24 + (46 - gs2) * 0.5, guestRuns(c.name), { size: gs2, color: A, field: "name", z: K.Z.top }));
    els.push(K.box(515, foot + 79, 448, 8, { fill: A, z: z }));
    els.push(K.mark("plus", 976, foot + 70, 26, 26, { color: A, z: z }));
    els.push(K.text(515, foot + 104, "POWERED BY", { size: 14.5, weight: 500, lh: 1, color: A, z: z }));
    els.push(K.mark("pottingshed", 515, foot + 119.5, 152, 32.17, { color: A, z: z, label: "pottingshed" }));
    if (n) {
      els.push(K.text(700, foot + 122, "SUPPORTED BY", { size: 14.5, weight: 500, lh: 1, color: A, z: z }));
      els.push(logoRow(K, 812, 1006, foot + 128, 0.62, A));
    }
    return els;
  }

  function build(d, K, G) {
    var L = d.layout || 0;
    return [kicker, bullets, paragraph, supporters, podcast][Math.min(4, L)](d, K, G);
  }

  T.add({
    tpl: { partners: true, key: "tk-campaign", short: "Campaign", what: "a campaign post or podcast cover", name: "Campaign", theme: "Midnight & white",
      desc: "The Understanding TEKEX ad campaign on the midnight ground, and the TEKEX podcast cover.", required: ["headline"],
      layouts: ["Kicker and headline", "Bullets", "Paragraph", "Supporters", "Podcast cover"] },
    fields: [
      F("eyebrow", "Kicker or label", "Inspire. Invest. Impact.", { optional: true }),
      F("headline", "Headline", "What can Tekex do for you?", { on: [0, 1, 2, 4] }),
      F("body", "Text (one bullet per line)", "A platform for founders and businesses", { kind: "area", optional: true, on: [1, 2] }),
      F("name", "Guests", "AJ Coetzee & Ben Dryden", { optional: true, on: [4] }),
      F("extra", "Top bar", "This is TEKEX", { optional: true, on: [0, 1, 2, 3] })
    ],
    examples: [
      { eyebrow: "Inspire. Invest. Impact.", headline: "What can Tekex do for you?", extra: "This is TEKEX" },
      { headline: "What can Tekex do for you?", body: "A platform for founders and businesses\nA funding opportunity for investors\nA place to connect for innovators\nA chance for anyone to shape the future", extra: "This is TEKEX" },
      { headline: "What is Tekex?", body: "Tekex is a platform for founders and businesses, a funding opportunity for investors, a place to connect for innovators; a chance for anyone to shape the future.", extra: "This is TEKEX" },
      { eyebrow: "Supported by", extra: "This is TEKEX" },
      { eyebrow: "Podcast #3", headline: "Summit: Deals from A to Z", name: "AJ Coetzee & Ben Dryden" }
    ],
    slots: function (d) { return (d.layout || 0) === 4 ? [{ id: "host-1", label: "Host 1" }, { id: "host-2", label: "Host 2" }] : []; },
    fill: function (d, put, libImg) {
      if ((d.layout || 0) !== 4) return;
      // the guests named ("AJ Coetzee & Ben Dryden"), each with their own cut-out
      var names = String(d.copy && d.copy.name || "").split(/\s*(?:&|\band\b|,)\s*/).filter(Boolean);
      ["host-1", "host-2"].forEach(function (k, i) { var id = names[i] && (T.personPic(names[i], true) || T.personPic(names[i], false)); if (id) put(k, libImg(id)); });
    },
    preload: [], build: build
  });
})();
