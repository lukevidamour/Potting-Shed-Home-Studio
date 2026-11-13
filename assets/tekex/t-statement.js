/* Statement and stat: words alone over the section's motif, a quote with the person who said it, a big number, and
   the Wrapped carousel's stat slides.
   Sources: TEKEX toolkit masters in "Post 43 - General - Louis Pike IOD" (E7viRv163FwdwvSYYleNkD; same ids in
   rVWbcVBLtLKYvbMFFs8XZV): statement 9038:19898 (published as Post 43 D1v1 15039:6) and 9038:24147 (1200 x 627);
   quote and person 9038:18675 and 9038:22778; stat 9038:19835 and 9038:22831. "Post 23 - Misc - Tekex Wrapped"
   (SO455XNoL6vfqCKx0kVmSW) stat slides 1:2786 and 1:2791 (flattened in the strip 17:80; the 1200 x 627 is translated).
   Layouts: 0 statement, 1 quote, 2 stat, 3 wrapped stat.
   Default colourway Lilac & red: the statement is the most used of these in real posts (the toolkit's news masters,
   Post 43's published D1v1 and D1v2, Wrapped slides 3 and 4). The motif follows the colourway, as TEKEX's section icons do. */
(function () {
  var T = window.HS_TEKEX, WHITE = "#FFFFFF";
  var F = function (key, label, ph, more) { return Object.assign({ key: key, label: label, ph: ph }, more || {}); };

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

  /* ---------- the section motif, by colourway ---------- */
  function kind(K) {
    var g = String(K.light).replace(/\s/g, "");
    if (g === "rgb(254,220,138)") return "tri";                              // Fundraising: the six triangles
    if (g === "rgb(208,255,191)") return "ast";                              // Events: the asterisk
    if (g === "rgb(129,255,231)" || g === "rgb(254,231,193)") return "rings"; // Speakers: the target
    return "sq";                                                             // News, and the rest: the nested squares
  }
  var PLACE = { // where each master puts its motif: square and 1200 x 627
    sq: { src: "news", sq: [197, 135, 651, 651], wd: [242, 0, 651, 651] },
    tri: { src: "triangles", sq: [-101, -27.2, 1028, 1131.4], wd: [589, -253, 1028, 1131.4] },
    ast: { src: "asterisk", sq: [6, 61, 884, 884], wd: [71, -24, 696, 696] },
    rings: { src: "rings", sq: [-28.92, -166.92, 991.92, 991.92], wd: [618, -166.92, 991.92, 991.92] }
  };
  /* White on the light grounds; on a dark ground a quiet tint of the ink. Tall frames move it into the extra height
     and grow it a little. o.at overrides the place (x, y, w, h); o.z puts it over the photo, as 9038:18675 does. */
  function motif(K, G, o) {
    o = o || {};
    var k = kind(K), p = PLACE[k], b = o.at || (G.wide ? p.wd : p.sq), dark = lum(K.light) < 90;
    var x = b[0], y = b[1], w = b[2], h = b[3];
    if (G.wide) x += G.X * (o.fixX ? 0 : 0.5);
    else { var grow = G.fy - G.ty, sc = 1 + grow / 1080 * 0.45; x -= (w * sc - w) / 2; y += G.ty + grow * 0.5 - (h * sc - h) / 2; w *= sc; h *= sc; }
    return K.mark(p.src, x, y, w, h, { color: dark ? K.ink : WHITE, opacity: dark ? 0.14 : undefined, z: o.z || K.Z.motif });
  }
  function step(K) {
    var m = String(K.c.step || "").match(/(\d+)\s*(?:\/|of)\s*(\d+)/i), n = m ? +m[1] : 1, N = m ? +m[2] : 7;
    N = Math.max(1, N); n = Math.max(1, Math.min(N, n));
    return { n: n, N: N };
  }
  function bare(s) { return String(s || "").trim().replace(/^["“‘']+|["”’']+$/g, ""); }

  function build(d, K, G) {
    var L = d.layout || 0, c = K.c, els = [], X = G.X, ty = G.ty, fy = G.fy, Z = K.Z;
    var foot = function (def) { return K.chrome({ label: c.footLabel || def, labelField: "footLabel" }); };

    // ---------------- 0: statement (9038:19898): the words stand on 826, the motif behind
    if (L === 0) {
      els.push(motif(K, G));
      if (!G.wide) {
        var bot = 826 + fy, room = bot - (150 + ty);
        var t0 = fitWords(K, c.headline, { size: 128, min: 70, w: 890, lines: G.square ? 5 : 6, h: room, base: 600 });
        var h0 = t0.n * t0.size * 0.92;
        els.push(K.text(96, bot - h0, t0.runs, { size: t0.size, wrap: true, field: "headline", fit: "headline", w: 910, h: h0 + 4 }));
        els.push(foot("NEWS"));
        return els;
      }
      var t0w = fitWords(K, c.headline, { size: 100, min: 52, w: 960 + X, lines: 3, h: 300, base: 600 });
      var h0w = t0w.n * t0w.size * 0.92;
      els.push(K.text(80, 427 - h0w, t0w.runs, { size: t0w.size, wrap: true, field: "headline", fit: "headline", w: 1000 + X, h: h0w + 4 }));
      els.push(K.chrome({ label: c.footLabel || "NEWS", labelField: "footLabel", url: "right" }));
      return els;
    }

    // ---------------- 1: quote and person (9038:18675)
    if (L === 1) {
      var hasQ = K.has("quote"), q = hasQ ? bare(c.quote) + "”" : "";
      if (!G.wide) {
        els.push(motif(K, G));
        var pTop = 150 + ty + (fy - ty) * 0.25;
        els.push(K.slot("person", "Person", 470, pTop, 700, G.h - pTop));
        var qTop = 186 + ty + (fy - ty) * 0.3, qRoom = 909 + fy - 70 - qTop - (K.has("name") ? 60 : 0);
        var t1 = fitWords(K, q, { size: 123.387, min: 64, w: 535, lines: 5, h: qRoom, base: 600 });
        var h1 = t1.n * t1.size * 0.92;
        if (hasQ) els.push(K.text(42 + (123.387 - t1.size) * 0.43, qTop, "“", { size: t1.size, z: Z.text }));
        els.push(K.text(95, qTop, t1.runs, { size: t1.size, wrap: true, field: "quote", fit: "quote", w: 560, h: h1 + 4 }));
        if (K.has("name")) { var a1 = K.fit(c.name, 36.213, 560, 500, 2, 0.7, true); els.push(K.text(101, qTop + h1 + 23, a1.text, { size: a1.size, weight: 500, lh: 1, upper: true, wrap: true, field: "name" })); }
        els.push(foot("NEWS"));
        return els;
      }
      // 9038:22778: the person on the left, the quote in a strip above the footer, the name set after it
      els.push(motif(K, G));
      els.push(K.slot("person", "Person", 20, 24, 700, 780, { z: K.Z.photo }));
      var nm2 = String(c.name || "").toUpperCase(), nmw = K.has("name") ? K.tw(nm2, 22.6, 500) + 12 : 0, full = 1040 + X;
      var q2 = hasQ ? "“" + q : "", t1w = fitWords(K, q2, { size: 56.5, min: 40, w: full - nmw, lines: 1, base: 600 });
      if (t1w.n === 1 && t1w.widest <= full - nmw) {
        // 22778 as drawn: one line of quote with the name set after it
        els.push(K.box(48, 361, 1102 + X, 106, { line: 1.7, fill: K.light, z: Z.panel }));
        var lineY = 414 - t1w.size * 0.92 / 2 - 0.5;
        els.push(K.text(81, lineY, t1w.runs, { size: t1w.size, wrap: true, field: "quote", fit: "quote", w: full + 10, h: t1w.size * 0.92 + 4 }));
        if (K.has("name")) els.push(K.text(81 + t1w.lines[0].w + 12, lineY + t1w.size * 0.92 * 0.78 - 22.6 * 0.74, nm2, { size: 22.6, weight: 500, lh: 1, field: "name" }));
      } else {
        // A longer quote: the strip grows upwards from the footer, the quote on up to three lines and the name under it
        t1w = fitWords(K, q2, { size: 40, min: 24, w: full, lines: 3, h: 3 * 40 * 0.92, base: 600 });
        var bh = t1w.n * t1w.size * 0.92, nh = K.has("name") ? 12 + 22.6 : 0, pad = 22, sTop = 467 - (pad + bh + nh + pad);
        els.push(K.box(48, sTop, 1102 + X, 467 - sTop, { line: 1.7, fill: K.light, z: Z.panel }));
        els.push(K.text(81, sTop + pad, t1w.runs, { size: t1w.size, wrap: true, field: "quote", fit: "quote", w: full + 10, h: bh + 4 }));
        if (K.has("name")) { var nf = K.fit(nm2, 22.6, full, 500, 1, 0.7, true); els.push(K.text(81, sTop + pad + bh + 12, nf.text, { size: nf.size, weight: 500, lh: 1, field: "name" })); }
      }
      els.push(K.chrome({ label: c.footLabel || "NEWS", labelField: "footLabel" }));
      return els;
    }

    // ---------------- 2: stat (9038:19835): a Book number, the caption under it
    if (L === 2) {
      els.push(motif(K, G));
      if (!G.wide) {
        var cb = 871 + fy;
        var cap = fitWords(K, c.headline, { size: 132.582, min: 72, w: 905, lines: 2, base: 600 });
        if (cap.n > 2) cap = fitWords(K, c.headline, { size: 132.582, min: 72, w: 905, lines: 3, base: 600 });
        var ch = cap.n * cap.size * 0.92, cTop = cb - ch;
        var num = K.fit(c.stat, 362.856, 960, 300, 1, 0.4), nTop = cTop - 327.88 * num.size / 362.856;
        els.push(K.text(77, nTop, num.text, { size: num.size, weight: 300, field: "stat", fit: "stat", w: 990, h: num.size * 0.92 + 4 }));
        els.push(K.text(89, cTop, cap.runs, { size: cap.size, wrap: true, field: "headline", fit: "headline", w: 925, h: ch + 4 }));
        els.push(foot("FUNDRAISING"));
        return els;
      }
      var capw = fitWords(K, c.headline, { size: 86.226, min: 50, w: 1112 + X, lines: 1, base: 600 });
      if (capw.widest > 1112 + X) capw = fitWords(K, c.headline, { size: 70, min: 46, w: 1100 + X, lines: 2, base: 600 });
      var chw = capw.n * capw.size * 0.92, cTw = 450.3 - chw;
      var numw = K.fit(c.stat, 250, 1080 + X, 300, 1, 0.4);
      els.push(K.text(38, cTw - 224 * numw.size / 250 - (capw.n - 1) * 0, numw.text, { size: numw.size, weight: 300, field: "stat", fit: "stat", w: 1110 + X, h: numw.size * 0.92 + 4 }));
      els.push(K.text(48, cTw, capw.runs, { size: capw.size, wrap: true, field: "headline", fit: "headline", w: 1110 + X, h: chw + 4 }));
      els.push(K.chrome({ label: c.footLabel || "FUNDRAISING", labelField: "footLabel" }));
      return els;
    }

    // ---------------- 3: wrapped stat (1:2786 odd slides, 1:2791 even): the shape runs across the join
    var st = step(K), odd = st.n % 2 === 1, done = st.n >= st.N;
    els.push(K.chrome({ foot: "none" }));
    if (K.has("eyebrow")) { var eb = K.fit(c.eyebrow, 32, G.wide ? 700 + X : 700, 600, 1, 0.6, true); els.push(K.text(G.wide ? 72 : 75, (G.wide ? 74 : G.top + 18) + (32 - eb.size) * 0.46, eb.text, { size: eb.size, upper: true, field: "eyebrow", z: Z.top })); }
    if (!G.wide) {
      var tr = 1004 + fy, mid = (fy - ty) * 0.5;
      els.push(K.slot("shape", "Shape", odd ? 540 : -540, 403 + fy - (odd ? 0 : 1), 950, 864, { z: Z.motif }));
      if (odd) {
        var lab = fitWords(K, c.headline, { size: 132.582, min: 80, w: 940, lines: 2, base: 600 });
        var lH = lab.n * lab.size * 0.92, lTop = 863 + fy - (lab.n - 1) * lab.size * 0.92;
        var big = K.fit(c.stat, 362.856, 940, 300, 1, 0.4);
        els.push(K.text(75, lTop - 309 * big.size / 362.856 - (362.856 - big.size) * 0.0, big.text, { size: big.size, weight: 300, field: "stat", fit: "stat", w: 960, h: big.size * 0.92 + 4 }));
        els.push(K.text(75, lTop, lab.runs, { size: lab.size, wrap: true, field: "headline", fit: "headline", w: 960, h: lH + 4 }));
        if (K.has("body")) { var cp = fitWords(K, c.body, { size: 36.213, min: 26, w: 462, lines: 3, lh: 1, base: 500 }); els.push(K.text(547, 156 + ty + mid * 0.2, cp.runs, { size: cp.size, weight: 500, lh: 1, wrap: true, field: "body" })); }
      } else {
        var blockTop = 153 + ty + mid * 0.2;
        var lab2 = fitWords(K, c.headline, { size: 132.582, min: 80, w: 700, lines: 3, base: 600 });
        var runs2 = [{ t: String(c.stat || "") + "\n", weight: 300 }].concat(lab2.runs), bh = (lab2.n + 1) * lab2.size * 0.92;
        els.push(K.text(342, blockTop, runs2, { size: lab2.size, wrap: true, field: "headline", fit: "headline", w: 720, h: bh + 4 }));
        if (K.has("body")) { var cp2 = fitWords(K, c.body, { size: 36.213, min: 26, w: 509, lines: 3, lh: 1, base: 500 }); els.push(K.text(342, blockTop + bh + 12, cp2.runs, { size: cp2.size, weight: 500, lh: 1, wrap: true, field: "body" })); }
      }
      els.push(K.box(49, tr - 4, 914, 8, { fill: WHITE, z: Z.chrome }));
      els.push(K.box(49, tr - 4, 914 * st.n / st.N, 8, { fill: K.ink, z: Z.chrome }));
      els.push(K.mark("plus", 976, tr - 13, 26, 26, { color: done ? K.ink : WHITE, z: Z.chrome }));
      return els;
    }
    // wide: the number and its label on the left, the shape on the right (or the left, on even slides)
    var Wd = 1200 + X;
    els.push(K.slot("shape", "Shape", odd ? 640 + X : -130, 196, 560, 509, { z: Z.motif }));
    var x0 = odd ? 60 : 470 + X * 0.5, wMax = odd ? 600 + X : 1080 + X - x0;
    var labw = fitWords(K, c.headline, { size: 86.226, min: 50, w: wMax, lines: 2, base: 600 });
    var lHw = labw.n * labw.size * 0.92, lTw = 520 - lHw;
    var cpw = K.has("body") ? fitWords(K, c.body, { size: 26, min: 20, w: 400, lines: 3, lh: 1, base: 500 }) : null;
    var bigw = K.fit(c.stat, 236, wMax, 300, 1, 0.4);
    if (!odd && cpw) { var room = lTw - (152 + cpw.n * cpw.size) - 14, cap0 = room * 236 / 201; if (bigw.size > cap0) bigw = { size: Math.max(90, cap0), text: bigw.text }; }
    els.push(K.text(x0 - 8 * bigw.size / 236, lTw - 201 * bigw.size / 236, bigw.text, { size: bigw.size, weight: 300, field: "stat", fit: "stat", w: wMax + 20, h: bigw.size * 0.92 + 4 }));
    els.push(K.text(x0, lTw, labw.runs, { size: labw.size, wrap: true, field: "headline", fit: "headline", w: wMax + 20, h: lHw + 4 }));
    if (cpw) { els.push(K.text(odd ? 700 + X : x0, 152, cpw.runs, { size: cpw.size, weight: 500, lh: 1, wrap: true, field: "body" })); }
    els.push(K.box(49, 556.6, 1040 + X, 6.8, { fill: WHITE, z: Z.chrome }));
    els.push(K.box(49, 556.6, (1040 + X) * st.n / st.N, 6.8, { fill: K.ink, z: Z.chrome }));
    els.push(K.mark("plus", Wd - 50 - 22.1, 549, 22.1, 22.1, { color: done ? K.ink : WHITE, z: Z.chrome }));
    return els;
  }

  T.add({
    tpl: { key: "tk-statement", short: "Statement", what: "a statement, quote or stat", name: "Statement and stat", theme: "Lilac & red",
      desc: "Big words over the section's motif: a statement, a quote with the person who said it, a headline number, or a Wrapped stat slide.", required: [],
      layouts: ["Statement", "Quote", "Stat", "Wrapped stat"] },
    fields: [
      F("eyebrow", "Top bar label", "EVENTS", { optional: true, on: [3] }),
      F("headline", "Statement", "It’s exactly this kind of cross-pollination that excites me the most.", { kind: "area", on: [0] }),
      F("quote", "Quote", "The best introductions I’ve had this year happened at TEKEX", { kind: "area", on: [1] }),
      F("name", "Who said it", "Founder, Jersey", { optional: true, on: [1] }),
      F("stat", "Number", "£22M", { on: [2, 3] }),
      F("headline", "Caption", "Raised through TEKEX in 2025", { on: [2] }),
      F("headline", "Label", "Events", { on: [3] }),
      F("body", "Line", "A year of conversations, collaborations and connection.", { optional: true, on: [3] }),
      F("step", "Slide", "1/7", { optional: true, on: [3] }),
      F("footLabel", "Footer label", "NEWS", { optional: true, on: [0, 1, 2] })
    ],
    examples: [
      { headline: "“It’s exactly this kind of cross-pollination that excites me the most.”", footLabel: "NEWS" },
      { quote: "The best introductions I’ve had this year happened at TEKEX", name: "Founder, Jersey", footLabel: "NEWS" },
      { stat: "£22M", headline: "Raised through TEKEX in 2025", footLabel: "FUNDRAISING" },
      { eyebrow: "EVENTS", stat: "12", headline: "Events", body: "A year of conversations, collaborations and connection.", step: "1/7" }
    ],
    slots: function (d) { var L = d.layout || 0; return L === 1 ? [{ id: "person", label: "Person" }] : L === 3 ? [{ id: "shape", label: "Shape" }] : []; },
    fill: function (d, put, libImg) {
      var L = d.layout || 0;
      // the person quoted, when the library has them; an unnamed speaker ("Founder, Jersey") gets a TEKEX glass shape, clear of the words
      if (L === 1) { var nm = d.copy && d.copy.name; put("person", libImg(T.personIn(nm, true) || T.personIn(nm, false) || "tkl-3d-glass-ring")); }
      if (L === 3) put("shape", libImg("tk-swirl-7", 50, 50)); // "PNG (7)", the doodad 1:2786 uses
    },
    preload: ["news", "triangles", "asterisk", "rings"].map(function (n) { return T.MARK(n); }), build: build
  });
})();
