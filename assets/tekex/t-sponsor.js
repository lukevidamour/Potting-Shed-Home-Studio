/* Sponsor and welcome: a partner's support for TEKEX, the person behind it, their words, the logo wall, and the welcome.
   Sources: TEKEX toolkit (rVWbcVBLtLKYvbMFFs8XZV) sponsor 9061:92 (violet bars 9061:2306, peach 9061:134) and welcome
   9045:247 (moon 9045:289); the BDO sponsor carousel "Post 59 - Sponsors - BDO Post 2" (gyoY3wOZTz7a8jOWCtZySD): cover
   2028:615, quote slides 2028:143 to 2028:328, logo panel 2028:363. All 1080 x 1080; no 1200 x 627 exists, so the wide
   layouts follow the toolkit's own landscape builds (the split 9028:899 and the speaker panel 9038:22885).
   Layouts: 0 proudly supporting, 1 partner and person, 2 partner quote, 3 logo panel, 4 welcome. */
(function () {
  var T = window.HS_TEKEX, WHITE = "#FFFFFF";
  var F = function (key, label, ph, more) { return Object.assign({ key: key, label: label, ph: ph }, more || {}); };

  /* ---------- partner logos ---------- */
  // Proportions from the SVG files; heights from the logo panel (2028:363), where all six sit together.
  var LG = { yoono: { ar: 850.39 / 168.4, h: 103 }, bdo: { ar: 82.047 / 31.508, h: 108.7 }, rathbones: { ar: 877 / 100.716, h: 100.7 },
    c5: { ar: 47 / 42, h: 154 }, red5: { ar: 1163.98 / 401.77, h: 120 }, wildpeak: { ar: 1599.6 / 1055.4, h: 154 } };
  var ORDER = ["yoono", "bdo", "rathbones", "c5", "red5", "wildpeak"];
  // Rathbones with its emblem, as the sponsor posts set it (2028:450); the shared file is the wordmark alone.
  var src = function (k) { return k === "rathbones" ? "assets/tekex/logos/rathbones-emblem.svg" : (T.LOGO[k] || {}).src; };
  /* The partners named in a line of copy ("Rathbones", "BDO/C5", "Wild Peak Holdings"), in the order they are named. */
  function named(str) {
    var s = String(str || "").toLowerCase().replace(/[^a-z0-9]/g, ""), hits = [];
    ORDER.forEach(function (k) { var i = s.indexOf(k); if (i >= 0) hits.push({ k: k, i: i }); });
    return hits.sort(function (a, b) { return a.i - b.i; }).map(function (h) { return h.k; });
  }
  /* The partners chosen for this design (d.partnersOn), in the order the logo panel sets them. */
  function chosen(d) { var on = d.partnersOn || []; return ORDER.filter(function (k) { return on.indexOf(k) >= 0; }); }

  /* ---------- words ---------- */
  /* Words with their weights. *Stars* mark the emphasis (SemiBold in a Book quote); a lone "x" between names is Book,
     as in "BDO/C5 x TEKEX". A word glued to an emphasis ("*connects*,") stays one word. */
  function words(str, o) {
    var out = [], cur = null, bold = false, s = String(str || "");
    if (o.upper) s = s.toUpperCase();
    s.split(/(\*)/).forEach(function (seg) {
      if (seg === "*") { bold = !bold; return; }
      (seg.match(/\n|[^\S\n]+|[^\s]+/g) || []).forEach(function (m) {
        if (m === "\n") { out.push({ br: true }); cur = null; return; }
        if (/^\s+$/.test(m)) { cur = null; return; }
        var w = bold ? o.strong : o.base;
        if (o.xBook && /^[xX×]$/.test(m) && !cur) w = 300;
        var piece = { t: m, w: w };
        if (cur) cur.p.push(piece); else { cur = { p: [piece] }; out.push(cur); }
      });
    });
    return out;
  }
  /* Lines as Figma sets a text box: as many words as fit, then the next line. */
  function wrap(K, ws, size, maxW, base) {
    var sp = K.tw("a a", size, base) - K.tw("aa", size, base), lines = [{ ws: [], w: 0 }];
    ws.forEach(function (wd) {
      if (wd.br) { lines.push({ ws: [], w: 0 }); return; }
      var ww = wd.p.reduce(function (a, p) { return a + K.tw(p.t, size, p.w); }, 0), ln = lines[lines.length - 1];
      if (ln.ws.length && ln.w + sp + ww > maxW) { ln = { ws: [], w: 0 }; lines.push(ln); }
      ln.w += (ln.ws.length ? sp : 0) + ww; ln.ws.push(wd);
    });
    return lines;
  }
  function toRuns(lines) {
    var runs = [];
    var add = function (t, w) { var r = runs[runs.length - 1]; if (r && r.weight === w) r.t += t; else runs.push({ t: t, weight: w }); };
    lines.forEach(function (ln, li) {
      ln.ws.forEach(function (wd, wi) { wd.p.forEach(function (p, pi) { add(p.t + (pi === wd.p.length - 1 && wi < ln.ws.length - 1 ? " " : ""), p.w); }); });
      if (li < lines.length - 1) add("\n", runs.length ? runs[runs.length - 1].weight : 400);
    });
    return runs.length ? runs : [{ t: "", weight: 400 }];
  }
  /* The largest size, from o.size down to o.min, at which the copy sets in o.lines lines of o.w and o.h of height. */
  function fitWords(K, str, o) {
    var ws = words(str, o), size = o.size, min = o.min || o.size * 0.55, lh = o.lh || 0.92, res;
    for (;;) {
      var lines = wrap(K, ws, size, o.w, o.base), widest = Math.max.apply(null, lines.map(function (l) { return l.w; }));
      res = { size: size, n: lines.length, runs: toRuns(lines), widest: widest, lines: lines };
      if ((lines.length <= (o.lines || 99) && widest <= o.w + 0.5 && lines.length * size * lh <= (o.h || 1e9) + 0.5) || size <= min) break;
      size = Math.max(min, Math.floor(size * 0.97 * 10) / 10);
    }
    return res;
  }
  var xRuns = function (K, str, size, w, upper) { return fitWords(K, str, { size: size, w: w || 2000, base: 600, xBook: true, upper: upper, lines: 1 }); };
  /* On a photo, words take the lighter of the two colours. */
  function lum(c) { var m = String(c).match(/[\d.]+/g) || [0, 0, 0]; return 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]; }

  /* ---------- the top bar's own label, and the partner logos that can sit in it ---------- */
  function barLabel(K, G, x, maxW) {
    if (!K.has("label")) return [];
    var y = G.wide ? 74 : G.top + 18, f = xRuns(K, K.c.label, 32, maxW, true);
    if (f.widest > maxW) f = xRuns(K, K.c.label, Math.max(22, 32 * maxW / f.widest), maxW, true);
    return [K.text(x, y + (32 - f.size) * 0.46, f.runs, { size: f.size, field: "label", z: K.Z.top })];
  }
  /* The named partner's logo(s) in the top bar, at the size 9061:92 gives Rathbones (256.94 x 26 at 79,63). */
  function barLogos(K, x, cy, maxW, s) {
    s = s || 1;
    var keys = named(K.c.partner), out = [], cx = x;
    if (!keys.length) {
      if (!K.has("partner")) return out;
      var f = K.fit(K.c.partner, 32 * s, maxW, 600, 1, 0.6, true);
      return [K.text(x, cy - f.size * 0.46, f.text, { size: f.size, upper: true, field: "partner", z: K.Z.top })];
    }
    var sizes = keys.map(function (k) { var a = LG[k].ar, h = (a > 6 ? 29.43 : a > 4 ? 33 : a > 2 ? 40 : 48) * s; return { k: k, w: h * a, h: h }; });
    var gap = 26 * s, total = sizes.reduce(function (a, z) { return a + z.w; }, 0) + gap * (sizes.length - 1), sc = Math.min(1, maxW / total);
    sizes.forEach(function (z) { out.push(K.mark(src(z.k), cx, cy - z.h * sc / 2, z.w * sc, z.h * sc, { z: K.Z.top, label: z.k })); cx += (z.w + gap) * sc; });
    return out;
  }

  /* ---------- the "partner" footer (2028:615, 2028:363): a smaller arrow, a big PARTNER label, a longer rule ---------- */
  function partnerFoot(K, G, o) {
    o = o || {};
    var ink = K.ink, fill = o.fill == null ? K.light : o.fill, z = K.Z.chrome, out = [], X = G.X;
    var lab = String(K.c.footLabel || "PARTNER").toUpperCase();
    if (!G.wide) {
      var f = G.foot, lf = K.fit(lab, 60.867, 290, 600, 1, 0.55, true);
      out.push(K.box(48, f, 349, 120, { line: 2, fill: fill, z: z }));
      out.push(K.mark("wordmark", 71.5, f + 27, 305.4, 62.84, { z: z, label: "TEKEX" }));
      out.push(K.box(410, f, 622, 120, { line: 2, fill: fill, z: z }));
      out.push(K.mark("arrow-down", 438.98, f + 27.67, 44.42, 44.42, { z: z }));
      out.push(K.text(497, f + 22 + (60.867 - lf.size) * 0.5, lf.text, { size: lf.size, upper: true, field: "footLabel", z: z }));
      out.push(K.box(440, f + 86, 523, 8, { fill: ink, z: z }));
      out.push(K.mark("plus", 974, f + 77, 26, 26, { z: z }));
      out.push(K.text(798, f + 27, "POWERED BY", { size: 15.747, weight: 500, lh: 1, z: z }));
      out.push(K.mark("pottingshed", 798, f + 44.12, 165, 34.917, { z: z, label: "pottingshed" }));
      return out;
    }
    var lw = K.fit(lab, 51.737, 560 + X - 418, 600, 1, 0.55, true);
    out.push(K.box(48, 474, 296.65, 102, { line: 1.7, fill: fill, z: z }));
    out.push(K.mark("wordmark", 68.4, 496.95, 257.86, 53.06, { z: z, label: "TEKEX" }));
    out.push(K.box(352, 474, 798 + X, 102, { line: 1.7, fill: fill, z: z }));
    out.push(K.mark("arrow-down", 368.25, 496.93, 37.18, 37.18, { z: z }));
    out.push(K.text(418.2, 492.7 + (51.737 - lw.size) * 0.5, lw.text, { size: lw.size, upper: true, field: "footLabel", z: z }));
    out.push(K.box(369.7, 546.85, 724.3 + X, 6.8, { fill: ink, z: z }));
    out.push(K.mark("plus", 1101.65 + X, 539.45, 22.1, 22.1, { z: z }));
    out.push(K.text(993.1 + X, 496.55, "POWERED BY", { size: 12.598, weight: 500, lh: 1, z: z }));
    out.push(K.mark("pottingshed", 993.1 + X, 510.24, 132, 27.93, { z: z, label: "pottingshed" }));
    return out;
  }

  /* ---------- the logo wall (2028:363): rows of logos, the wide wordmarks on a row of their own ---------- */
  function logoWall(K, keys, x0, y0, W, H, o) {
    o = o || {};
    if (!keys.length) return [K.text(x0, y0 + H / 2 - 20, "Choose partners to show", { size: 36, weight: 500, lh: 1, opacity: 0.6 })];
    var rows;
    if (o.wide) {
      var n = keys.length, cut = n <= 3 ? n : Math.ceil(n / 2);
      rows = n <= 3 ? [keys] : [keys.slice(0, cut), keys.slice(cut)];
    } else {
      var wideK = keys.filter(function (k) { return LG[k].ar > 6; }), rest = keys.filter(function (k) { return LG[k].ar <= 6; });
      var r = rest.length <= 3 ? [rest] : rest.length === 4 ? [rest.slice(0, 2), rest.slice(2)] : [rest.slice(0, 2), rest.slice(2)];
      rows = [r[0]].concat(wideK.map(function (k) { return [k]; })).concat(r.slice(1)).filter(function (x) { return x.length; });
    }
    var minGap = 48, rowW = function (row, g) { return row.reduce(function (a, k) { return a + LG[k].h * g * LG[k].ar; }, 0) + minGap * (row.length - 1); };
    var rowH = function (row, g) { return Math.max.apply(null, row.map(function (k) { return LG[k].h * g; })); };
    var g = o.max || 1.4;
    rows.forEach(function (row) { var w1 = rowW(row, 1) - minGap * (row.length - 1); g = Math.min(g, (W - minGap * (row.length - 1)) / w1); });
    var sumH = function (gg) { return rows.reduce(function (a, row) { return a + rowH(row, gg); }, 0); };
    var minV = o.minV || 40;
    if (sumH(g) + minV * (rows.length + 1) > H) g = Math.min(g, (H - minV * (rows.length + 1)) / sumH(1));
    // 2028:363 keeps 47 above the first row and 49 below the last, the rows evenly spaced between
    var free = H - sumH(g), outer = rows.length > 1 && free > 96 + minV * (rows.length - 1) ? 48 : free / (rows.length + 1);
    var gapV = rows.length > 1 ? Math.min(140, (free - 2 * outer) / (rows.length - 1)) : 0;
    var y = y0 + (H - sumH(g) - gapV * (rows.length - 1)) / 2 - 1, out = [];
    rows.forEach(function (row) {
      var rh = rowH(row, g), ws = row.map(function (k) { return LG[k].h * g * LG[k].ar; }), tot = ws.reduce(function (a, b) { return a + b; }, 0);
      var gapH = row.length > 1 ? (W - tot) / (row.length - 1) : 0, x = row.length > 1 ? x0 : x0 + (W - tot) / 2;
      if (row.length > 1 && gapH > 140) { gapH = 140; x = x0 + (W - tot - gapH * (row.length - 1)) / 2; }
      row.forEach(function (k, i) { var h = LG[k].h * g; out.push(K.mark(src(k), x, y + (rh - h) / 2, ws[i], h, { label: k, z: K.Z.text })); x += ws[i] + gapH; });
      y += rh + gapV;
    });
    return out;
  }

  /* ---------- the carousel motifs (2028:143 to 2028:328): one per slide, each pair sharing a shape across the join ---------- */
  var MOTIFS = [
    ["rings", -738, -555, 1465, 1465],            // slide 2: the right half of the cover's target
    ["triangles", 192, 134, 1411.52, 1553.43],    // slides 3 and 4
    ["triangles", -921, 134, 1411.52, 1553.43],
    ["squares-open", 393, -285, 1379.23, 1379.23], // slides 5 and 6
    ["squares-open", -720, -285, 1379.23, 1379.23],
    ["asterisk", 235, 395, 1183, 1183],           // slides 7 and 8
    ["asterisk", -878, 395, 1183, 1183]
  ];
  function step(K) {
    var m = String(K.c.step || "").match(/(\d+)\s*(?:\/|of)\s*(\d+)/i), n = m ? +m[1] : 1, N = m ? +m[2] : 7;
    N = Math.max(1, N); n = Math.max(1, Math.min(N, n));
    return { n: n, N: N };
  }

  function build(d, K, G) {
    var L = d.layout || 0, c = K.c, els = [], X = G.X, ty = G.ty, fy = G.fy, Z = K.Z;

    // ---------------- 0: proudly supporting (9061:92)
    if (L === 0) {
      if (!G.wide) {
        els.push(K.slot("photo", "Photo", 0, 0, G.w, G.h, { cover: true }));
        var hl = fitWords(K, c.headline, { size: 86, min: 50, w: 930, lines: G.square ? 3 : 4, h: 330 + (fy - ty) * 0.4, lh: 1.1, base: 600, upper: true });
        var hlH = hl.n * hl.size * 1.1, hTop = 872.2 + fy - hlH, pTop = hTop - 29;
        els.push(K.box(49, pTop, 983, 894 + fy - pTop, { line: 2, fill: K.light, z: Z.panel }));
        els.push(K.text(80, hTop, hl.runs, { size: hl.size, lh: 1.1, upper: true, wrap: true, field: "headline", fit: "headline", w: 952, h: hlH + 4 }));
        els.push(K.chrome({ label: c.footLabel || "PARTNER", topFill: K.light, labelField: "footLabel" }));
        els.push(barLogos(K, 79, G.top + 33, 560));
        return els;
      }
      // wide: the toolkit's landscape split (9028:899): the photo square on the right, the words on the ground
      els.push(K.slot("photo", "Photo", 576 + X, 0, 624, 627, { cover: true }));
      els.push(K.box(48, 44, 492, 81, { line: 2, fill: K.light, z: Z.chrome }));
      var tk = K.tw("TEKEX", 32, 600) + K.tw(".CO", 32, 500), ux = 516 - tk;
      els.push(K.mark("arrow-small", ux - 33.11, 77.45, 24.02, 24.02, { rot: -90, z: Z.top }));
      els.push(K.text(ux, 74, [{ t: "TEKEX", weight: 600 }, { t: ".CO", weight: 500 }], { size: 32, z: Z.top }));
      els.push(barLogos(K, 72, 84.5, ux - 72 - 60, 0.92));
      var hw = fitWords(K, c.headline, { size: 66, min: 40, w: 476, lines: 4, h: 290, lh: 1.1, base: 600, upper: true });
      var hwH = hw.n * hw.size * 1.1;
      els.push(K.text(71, 446 - hwH, hw.runs, { size: hw.size, lh: 1.1, upper: true, wrap: true, field: "headline", fit: "headline", w: 490, h: hwH + 4 }));
      els.push(K.chrome({ label: c.footLabel || "PARTNER", topBar: false, labelField: "footLabel" }));
      return els;
    }

    // ---------------- 1: partner and person (2028:615)
    if (L === 1) {
      if (!G.wide) {
        els.push(K.mark("rings", 375, -555 + ty, 1465, 1465, { color: WHITE, z: Z.motif }));
        els.push(K.chrome({ foot: "none", url: "right" }));
        els.push(barLabel(K, G, 72, 700));
        var ph = 1067 + (fy - ty) * 0.5;
        els.push(K.slot("person", "Partner cut-out", 57, G.h - ph, 930, ph, { z: Z.chrome })); // in front of the top bar's keyline, behind the panel
        var nm = K.fit(c.name, 43, 950, 500, 1, 0.7, true), nameY = 823 + fy;
        var h1 = fitWords(K, c.headline, { size: 120, min: 72, w: 950, lines: 2, base: 600, xBook: true, upper: true });
        var h1H = h1.n * h1.size * 0.92, h1Top = (K.has("name") ? nameY - 10.74 : 870 + fy) - h1H;
        var kk = K.fit(c.eyebrow, 78, 950, 600, 1, 0.6), kTop = h1Top - 81.86;
        var top1 = K.has("eyebrow") ? kTop : h1Top, pT = top1 - 30;
        els.push(K.box(48, pT, 984, 893 + fy - pT, { line: 2, fill: K.light, z: Z.panel }));
        if (K.has("eyebrow")) els.push(K.text(72, kTop, kk.text, { size: kk.size, field: "eyebrow" }));
        els.push(K.text(72, h1Top, h1.runs, { size: h1.size, upper: true, wrap: true, field: "headline", fit: "headline", w: 940, h: h1H + 4 }));
        if (K.has("name")) els.push(K.text(72, nameY, nm.text, { size: nm.size, weight: 500, lh: 1, upper: true, field: "name" }));
        els.push(partnerFoot(K, G)); // 2028:615 leaves these cells open over a light shirt; filled, the wordmark holds over any picture
        return els;
      }
      // wide: the toolkit's landscape speaker (9038:22885): panel left, the person over the rings on the right
      var s = 0.6186;
      els.push(K.mark("rings", 579.9 + X, 33, 650.1, 617.9, { color: WHITE, z: Z.motif, stretch: true }));
      els.push(K.slot("person", "Partner cut-out", 600 + X, 112, 570, 420, { z: Z.photo }));
      els.push(K.box(48, 44, 532, 421, { line: 1.7, fill: K.light, z: Z.panel }));
      var nmW = K.fit(c.name, 43 * s, 480, 500, 1, 0.7, true), nY = 411;
      var hW = fitWords(K, c.headline, { size: 120 * s, min: 44, w: 476, lines: 2, base: 600, xBook: true, upper: true });
      var hWH = hW.n * hW.size * 0.92, hWTop = (K.has("name") ? nY - 6.64 : 438) - hWH;
      var kW = K.fit(c.eyebrow, 78 * s, 476, 600, 1, 0.6);
      if (K.has("eyebrow")) els.push(K.text(76, hWTop - 50.64, kW.text, { size: kW.size, field: "eyebrow" }));
      els.push(K.text(76, hWTop, hW.runs, { size: hW.size, upper: true, wrap: true, field: "headline", fit: "headline", w: 492, h: hWH + 4 }));
      if (K.has("name")) els.push(K.text(76, nY, nmW.text, { size: nmW.size, weight: 500, lh: 1, upper: true, field: "name" }));
      els.push(K.chrome({ foot: "none", shortTop: [590, 560] }));
      els.push(barLabel(K, G, 614, 300 + X));
      els.push(partnerFoot(K, G));
      return els;
    }

    // ---------------- 2: partner quote (2028:143 and the slides after it)
    if (L === 2) {
      var st = step(K), mo = MOTIFS[(st.n - 1) % MOTIFS.length];
      if (!G.wide) {
        var grow = fy - ty, dy = ty + grow * 0.45;
        els.push(K.mark(mo[0], mo[1], mo[2] + dy, mo[3], mo[4], { color: WHITE, z: Z.motif }));
        els.push(K.chrome({ foot: "none" }));
        els.push(barLabel(K, G, 72, 700));
        var qTop = 177 + ty + grow * 0.3;
        els.push(K.mark("quote-open", 77, qTop, 129, 121, { z: Z.text }));
        var tY = qTop + 170, maxH = 987 + fy - 40 - tY;
        var q = fitWords(K, c.quote, { size: 90, min: 52, w: 966, lines: 7, h: maxH, lh: 1, base: 300, strong: 600 });
        els.push(K.text(66, tY, q.runs, { size: q.size, weight: 300, lh: 1, wrap: true, field: "quote", fit: "quote", w: 990, h: maxH }));
        var tr = 999 + fy, fw = st.n >= st.N ? 896 : 855.75 * st.n / st.N;
        els.push(K.box(66, tr - 4, 888, 8, { fill: WHITE, z: Z.chrome }));
        els.push(K.box(67, tr - 4, fw, 8, { fill: K.ink, z: Z.chrome }));
        els.push(K.mark("plus", 974, tr - 13, 26, 26, { z: Z.chrome }));
        return els;
      }
      var sw = 0.62;
      els.push(K.mark(mo[0], mo[1] * sw + 60, mo[2] * sw + 10, mo[3] * sw, mo[4] * sw, { color: WHITE, z: Z.motif }));
      els.push(K.chrome({ foot: "none" }));
      els.push(barLabel(K, G, 72, 600 + X));
      els.push(K.mark("quote-open", 72, 158, 80, 75.04, { z: Z.text }));
      var qw = fitWords(K, c.quote, { size: 54, min: 34, w: 1020 + X, lines: 5, h: 266, lh: 1, base: 300, strong: 600 });
      els.push(K.text(66, 256, qw.runs, { size: qw.size, weight: 300, lh: 1, wrap: true, field: "quote", fit: "quote", w: 1040 + X, h: 266 }));
      var fw2 = st.n >= st.N ? 1 : st.n / st.N * 0.955;
      els.push(K.box(66, 553.6, 1020 + X, 6.8, { fill: WHITE, z: Z.chrome }));
      els.push(K.box(67, 553.6, (1020 + X) * fw2, 6.8, { fill: K.ink, z: Z.chrome }));
      els.push(K.mark("plus", 1103.35 + X, 545.95, 22.1, 22.1, { z: Z.chrome }));
      return els;
    }

    // ---------------- 3: logo panel (2028:363)
    if (L === 3) {
      var keys = chosen(d);
      if (!G.wide) {
        var cs = G.h / 1080;
        els.push(K.mark("cross", -7 - (1412 * cs - 1412) / 2, 0, 1412 * cs, G.h, { color: WHITE, z: Z.motif }));
        els.push(K.chrome({ foot: "none" }));
        els.push(barLabel(K, G, 72, 700));
        var pB = 896 + fy, pH = 569 + (fy - ty) * 0.45, pT3 = pB - pH;
        var hd = fitWords(K, c.headline, { size: 75, min: 48, w: 940, lines: 2, lh: 1, base: 600 });
        var hdH = hd.n * hd.size, hdTop = pT3 - 59 - hdH;
        els.push(K.text(49, hdTop, hd.runs, { size: hd.size, lh: 1, wrap: true, align: "center", w: 982, field: "headline", fit: "headline", h: hdH + 4 }));
        els.push(K.box(48, pT3, 984, pH, { line: 2, fill: K.light, z: Z.panel }));
        els.push(logoWall(K, keys, 101, pT3, 876, pH));
        els.push(partnerFoot(K, G));
        return els;
      }
      els.push(K.mark("cross", 480 + X * 0.5, -60, 1412 * 0.72, 1080 * 0.72, { color: WHITE, z: Z.motif }));
      els.push(K.chrome({ foot: "none" }));
      els.push(barLabel(K, G, 72, 600 + X));
      var hd2 = fitWords(K, c.headline, { size: 46, min: 32, w: 1000 + X, lines: 1, lh: 1, base: 600 });
      els.push(K.text(48, 146 + (46 - hd2.size) * 0.5, hd2.runs, { size: hd2.size, lh: 1, align: "center", w: 1102 + X, field: "headline", fit: "headline", h: 50 }));
      els.push(K.box(48, 212, 1102 + X, 253, { line: 1.7, fill: K.light, z: Z.panel }));
      els.push(logoWall(K, keys, 96, 212, 1006 + X, 253, { wide: true, minV: 26, max: 0.75 }));
      els.push(partnerFoot(K, G));
      return els;
    }

    // ---------------- 4: welcome (9045:247): words straight on the picture, the frame in the light colour
    var pale = lum(K.light) >= lum(K.ink) ? K.light : K.ink;
    var pic = K.slot("photo", "Picture", 0, 0, G.w, G.h, { cover: true }), rec = d.images && d.images.photo;
    // the toolkit's crop (1346 square at -15,-266) suits the square only; elsewhere the letters sit above the words
    if (!G.square && rec && rec.zoom === 1.2463 && pic.img && pic.img.style) pic.img = Object.assign({}, pic.img, { style: Object.assign({}, pic.img.style, { objectPosition: G.wide ? "50% 62%" : "50% 50%", transform: "none" }) });
    els.push(pic);
    if (!G.wide) {
      var sub = K.fit(c.body, 60, 955, 500, 1, 0.6, true), subY = 811 + fy;
      var hw4 = fitWords(K, c.headline, { size: 99, min: 60, w: 955, lines: 2, base: 600 });
      var h4H = hw4.n * hw4.size * 0.92, h4Top = (K.has("body") ? subY - 14.92 : 811 + fy + 45) - h4H;
      els.push(K.text(72, h4Top, hw4.runs, { size: hw4.size, color: pale, wrap: true, field: "headline", fit: "headline", w: 970, h: h4H + 4 }));
      if (K.has("body")) els.push(K.text(72, subY, sub.text, { size: sub.size, weight: 500, lh: 1, upper: true, color: pale, field: "body" }));
      els.push(K.chrome({ ink: pale, cellFill: "transparent", label: "" }));
      return els;
    }
    // a square picture in a wide frame puts its subject behind the words: a soft dark wash under them keeps them legible
    els.push(K.box(0, 200, G.w, 427, { z: Z.wash, css: { background: "linear-gradient(180deg, rgba(28,0,52,0) 0%, rgba(28,0,52,0.5) 45%, rgba(28,0,52,0.62) 100%)" } }));
    var sw4 = K.fit(c.body, 38, 1000 + X, 500, 1, 0.6, true), sY = 410;
    var hw5 = fitWords(K, c.headline, { size: 63.4, min: 40, w: 1040 + X, lines: 2, base: 600 });
    var h5H = hw5.n * hw5.size * 0.92, h5Top = (K.has("body") ? sY - 9.5 : 438) - h5H;
    els.push(K.text(72, h5Top, hw5.runs, { size: hw5.size, color: pale, wrap: true, field: "headline", fit: "headline", w: 1060 + X, h: h5H + 4 }));
    if (K.has("body")) els.push(K.text(72, sY, sw4.text, { size: sw4.size, weight: 500, lh: 1, upper: true, color: pale, field: "body" }));
    els.push(K.chrome({ ink: pale, cellFill: "transparent", label: "" }));
    return els;
  }

  T.add({
    tpl: { partners: true, key: "tk-sponsor", short: "Sponsor", what: "a sponsor or welcome post", name: "Sponsor and welcome", theme: "Lime & violet",
      desc: "A partner's support for TEKEX: their logo and a photo, the person behind it, their words, a wall of logos, or the welcome.", required: ["headline"],
      layouts: ["Proudly supporting", "Partner and person", "Partner quote", "Logo panel", "Welcome"] },
    fields: [
      F("partner", "Partner", "Rathbones", { optional: true, on: [0] }),
      F("label", "Top bar", "BDO/C5 x TEKEX", { optional: true, on: [1, 2, 3] }),
      F("eyebrow", "Kicker", "Partnership Benefits", { optional: true, on: [1] }),
      F("headline", "Headline", "Rathbones proudly supporting TEKEX", { on: [0, 1, 3, 4] }),
      F("name", "Name and role", "Matt Tabb, CMO BDO/C5", { optional: true, on: [1] }),
      F("quote", "Quote (*stars* for bold)", "TEKEX *connects innovators* to accelerate growth.", { kind: "area", on: [2] }),
      F("step", "Slide", "1/7", { optional: true, on: [2] }),
      F("body", "Sub-line", "Welcome to TEKEX", { optional: true, on: [4] }),
      F("footLabel", "Footer label", "PARTNER", { optional: true, on: [0, 1, 3] })
    ],
    examples: [
      { partner: "Rathbones", headline: "Rathbones proudly supporting TEKEX", footLabel: "EVENT#34" },
      { label: "BDO/C5 x TEKEX", eyebrow: "Partnership Benefits", headline: "BDO/C5 x TEKEX", name: "Matt Tabb, CMO BDO/C5", footLabel: "PARTNER" },
      { label: "BDO/C5 x TEKEX", quote: "TEKEX *connects innovators, investors & expertise* to accelerate growth across our islands. That’s a conversation we want to be part of.", step: "1/7" },
      { label: "BDO/C5 x TEKEX", headline: "Thanks to our collaborators", footLabel: "PARTNER" },
      { headline: "Innovation starts here", body: "Welcome to TEKEX" }
    ],
    slots: function (d) { var L = d.layout || 0; return L === 0 || L === 4 ? [{ id: "photo", label: L === 4 ? "Picture" : "Photo" }] : L === 1 ? [{ id: "person", label: "Partner cut-out" }] : []; },
    fill: function (d, put, libImg) {
      var L = d.layout || 0;
      if (L === 0) put("photo", libImg("tkl-andy-robins-rathbones", 50, 20)); // Andy Robins of Rathbones, as the toolkit post (9061:92)
      // the person named gets their own picture (Matt Tabb's cut-out for the example); nobody named, a TEKEX portrait
      if (L === 1) { var who = T.personPic(d.copy && d.copy.name, true) || T.personPic(d.copy && d.copy.name, false); put("person", libImg(who || (d.copy && d.copy.name ? "" : "tk-jake-schofield"))); }
      if (L === 4) { var im = libImg("tk-reel-26-sq", 5.6, 100); if (im) im.zoom = 1.2463; put("photo", im); } // the welcome crop: 1346 square at -15,-266
    },
    preload: ["quote-open", "cross", "squares-open", "asterisk", "triangles"].map(function (n) { return T.MARK(n); }), build: build
  });
})();
