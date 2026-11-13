/* Line-up carousel: the slides TEKEX posts as a carousel to announce an event's speakers.
   Sources (1080 x 1080 and 1080 x 1350; there is no wide carousel in Figma, so 1200 x 627 and 16:9 are translated):
     Tekex36 speaker carousel, D2H9Lf2gvm0m4j7ORsUmaD: opener 2013:2, speaker 6001:198 (and 5 siblings), end 2013:1821;
     Tekex35 speaker carousel, EpQlazaPNN518sycKxGz6w: 2013:2, 2003:985, 2013:1821;
     Isle of Man panel carousel (4:5), GR5Bd2WU3HI3IYfwSe9ilP: cover 12011:3, panellist 12011:52, register 12011:1372,
     supported by 12011:1421.
   Layouts: 0 cover, 1 one speaker, 2 call to action, 3 supported by.

   The two published carousels are two sets of one system, and the edition decides which a design belongs to:
     with an edition ("JSY#36") it is the speaker carousel: TEKEX.CO left and POWERED BY pottingshed in the top bar,
       SPEAKERS and the edition in the footer, the same screen-blended ribbon in the same place on every slide;
     without one it is the panel carousel: the toolkit frame (TEKEX.CO right, label and POWERED BY in the footer),
       85% fills, and a full-colour 3D shape that changes from slide to slide and bleeds off a side.
   The speaker slide follows its picture: a cut-out stands behind the name panel, a photograph sits in a keylined box.
   What never moves across a set: the frame, the margins, the name panel and the footer, so names and roles line up
   from slide to slide. */
(function () {
  var T = window.HS_TEKEX, RIBBON = "assets/tekex/shapes/ribbon.webp", BIG_RATH = "assets/tekex/logos/rathbones-compass.svg";
  var SWIRL = function (n) { return "assets/graphics/swirl-" + n + ".webp"; };
  var F = function (key, label, ph, more) { return Object.assign({ key: key, label: label, ph: ph }, more || {}); };
  var series = function (K) { return K.has("edition"); };

  /* "JSY#36": the place in Regular, the number in SemiBold, as TEKEX sets it. */
  function edRuns(str) {
    var s = String(str || "").trim(), i = s.indexOf("#");
    if (i <= 0) return [{ t: s, weight: 600 }];
    return [{ t: s.slice(0, i), weight: 400 }, { t: s.slice(i), weight: 600 }];
  }
  function edW(K, str, px) { return edRuns(str).reduce(function (a, r) { return a + K.tw(r.t, px, r.weight); }, 0); }
  /* The largest size up to px at which one line fits maxW. */
  function shrink(K, str, px, maxW, weight, ls, floor) {
    var w = K.tw(str, px, weight, ls);
    return w > maxW ? Math.max(px * (floor || 0.5), px * maxW / w) : px;
  }

  /* ---------- the frame ---------- */
  /* Top bar and footer for the whole set. o.strip: the speaker carousel's opener carries SUPPORTED BY in the right cell. */
  function frame(d, K, G, o) {
    o = o || {};
    var label = String(d.copy.footLabel || "Speakers"), X = G.X, out = [];
    var fill85 = K.rgba(K.light, 0.85);
    if (!series(K)) {
      // the panel carousel: the toolkit frame with 85% fills, so the shape shows through
      return K.chrome({ label: label, url: "right", topFill: fill85, cellFill: fill85, shortTop: G.wide ? [590, 560] : null });
    }
    // the speaker carousel
    if (!G.wide) {
      // 2013:2: ↗ TEKEX.CO at the left, POWERED BY pottingshed at the right, on one line (measured ink to the pixel)
      var t = G.top;
      out.push(K.box(49, t, 983, 64, { line: 2 }));
      out.push(K.mark("arrow-small", 70.89, t + 20.45, 24.02, 24.02, { rot: -90, z: K.Z.top }));
      out.push(K.text(104, t + 17, [{ t: "TEKEX", weight: 600 }, { t: ".CO", weight: 500 }], { size: 32, z: K.Z.top }));
      out.push(K.text(728, t + 25, "POWERED BY", { size: 15.747, weight: 500, lh: 1, z: K.Z.top }));
      out.push(K.mark("pottingshed", 847, t + 18, 165, 34.917, { z: K.Z.top }));
    }
    else {
      var bx = 590, bw = 560 + X;
      out.push(K.box(bx, 43.88, bw, 87.23, { line: 2.154 }));
      out.push(K.mark("arrow-small", bx + 23 - 1.11, 78.39 + 3 - 0.94, 24.02, 24.02, { rot: -90, z: K.Z.top }));
      out.push(K.text(bx + 55, 77, [{ t: "TEKEX", weight: 600 }, { t: ".CO", weight: 500 }], { size: 32, z: K.Z.top }));
      // POWERED BY over the logo, as the toolkit stacks it, at the bar's right end
      var px = bx + bw - 20 - 165;
      out.push(K.text(px, 61, "POWERED BY", { size: 15.747, weight: 500, lh: 1, z: K.Z.top }));
      out.push(K.mark("pottingshed", px, 78.12, 165, 34.917, { z: K.Z.top }));
    }
    var sq = !G.wide, s = sq ? 1 : 0.85, y = sq ? G.foot : 474, lw = 2 * s;
    var cellFill = o.leftFill || K.light;
    // logo cell
    if (sq) { out.push(K.box(48, y, 349, 120, { line: 2, fill: cellFill })); out.push(K.mark("wordmark", 71.6, y + 27, 304.4, 62.63, { label: "TEKEX" })); }
    else { out.push(K.box(48, 474, 296.65, 102, { line: 1.7, fill: cellFill })); out.push(K.mark("wordmark", 68.4, 496.95, 257.86, 53.06, { label: "TEKEX" })); }
    // right cell
    var cx = sq ? 410 : 352, cw = sq ? 622 : 798 + X, ch = 120 * s;
    out.push(K.box(cx, y, cw, ch, { line: lw, fill: K.light }));
    var logos = K.sponsors();
    if (o.strip && logos.length) return out.concat(strip(K, logos, cx, y, cw, s));
    var r0 = sq ? 517 : 435.7, r1 = cx + cw - 69 * s; // the rule
    out.push(K.mark("arrow-down", sq ? 438.51 : 367.58, y + (sq ? 27.97 : 22.92), 64.985 * s, 64.985 * s));
    var lab = label.toUpperCase(), lsz = 46 * s, edPx = 48 * s, edw = edW(K, d.copy.edition, edPx);
    var labMax = r1 - r0 - edw - 24 * s;
    if (K.tw(lab, lsz, 600) > labMax) lsz = Math.max(30 * s, lsz * labMax / K.tw(lab, lsz, 600));
    out.push(K.text(r0, y + 27 * s + (46 * s - lsz) * 0.75, lab, { size: lsz, weight: 600, field: "footLabel" }));
    out.push(K.text(r1 - 2 * s - edw, y + 28.2 * s, edRuns(d.copy.edition), { size: edPx, lh: 0.85, field: "edition" }));
    out.push(K.box(r0, y + 84 * s, r1 - r0, 8 * s, { fill: K.ink }));
    out.push(K.mark("plus", cx + cw - 56 * s, y + 75 * s, 26 * s, 26 * s));
    return out;
  }
  /* The opener's right cell: SUPPORTED BY, the sponsors along the rule (measured on 2013:2 with four of them). */
  function strip(K, logos, cx, y, cw, s) {
    var out = [], x0 = cx + 30 * s, x1 = cx + cw - 69 * s, span = x1 - x0;
    out.push(K.text(x0, y + 24 * s, "SUPPORTED BY", { size: 15.747 * s, weight: 500, lh: 1 }));
    var hOf = function (l) { return (l.ar > 6 ? 17 : l.ar > 4 ? 19.6 : l.ar > 2 ? 38 : 42) * s; };
    var ws = logos.map(function (l) { return hOf(l) * l.ar; }), tot = ws.reduce(function (a, b) { return a + b; }, 0);
    var minGap = 24 * s, k = Math.min(1, (span - minGap * (logos.length - 1)) / tot);
    var gap = logos.length > 1 ? (span - tot * k) / (logos.length - 1) : 0, x = x0;
    // the four TEKEX36 sponsors sit where the designer put them; any other set is spread evenly along the rule
    var at = logos.map(function (l) { return l.key; }).join() === "yoono,rathbones,c5,bdo" ? [-2, 133, 328, 424] : null;
    logos.forEach(function (l, i) {
      if (at) x = x0 + at[i] * s;
      var h = hOf(l) * k, w = ws[i] * k, bot = y + (l.ar > 4 ? (l.ar > 6 ? 69 : 71) : (l.ar > 1.3 && l.ar < 2.7 ? 69 + (l.ar < 2 ? 4 : 0) : 73)) * s;
      out.push(K.mark(l.src, x, bot - h, w, h, { label: l.key })); x += w + gap;
    });
    out.push(K.box(x0, y + 91 * s, span, 8 * s, { fill: K.ink }));
    out.push(K.mark("plus", cx + cw - 56 * s, y + 82 * s, 26 * s, 26 * s));
    return out;
  }

  /* ---------- the shapes ---------- */
  /* The speaker carousel: the Tekex36 ribbon, screen-blended, in the same place on every slide (49, 130 on 1080). In a
     tall frame it moves down with the content and grows into the extra room; in a wide one it fills the right half. */
  function ribbon(K, G, o) {
    o = o || {};
    if (G.wide) { var w = o.w || 760, h = w * 745 / 1021; return K.pic(RIBBON, (o.x == null ? 520 : o.x) + G.X, o.y == null ? 70 : o.y, w, h, { blend: "screen" }); }
    var grow = G.fy - G.ty, sc = 1 + grow / 1080 * 0.6, W = 1021 * sc, H = 745 * sc;
    var cx = 49 + 1021 / 2 + (G.story ? -40 : 0), cy = 130 + 745 / 2 + G.ty + grow * 0.5;
    return K.pic(RIBBON, cx - W / 2, cy - H / 2, W, H, { blend: "screen" });
  }
  /* The panel carousel: a different full-colour shape per slide, bleeding off a side (12011:3, :52, :1372, :1421).
     Positions are the 4:5 frame's; a square keeps them against the top, a story moves them down by the top bar. */
  function shape(K, G, which) {
    var S = {
      cover: { src: SWIRL(7), x: 220, y: -80, w: 1000, h: 1000 * 1274 / 1400 },
      speaker: { src: SWIRL(1), x: 488.5, y: 780 - 270, w: 682, h: 682 * 1022 / 1400, rot: 10, foot: true },
      close: { src: SWIRL(3), x: -120, y: -60, w: 1000 * 1296 / 1400, h: 1000 },
      sponsors: { src: SWIRL(1), x: 296.8, y: -180, w: 974.4, h: 974.4 * 1022 / 1400, rot: 8 }
    }[which];
    if (G.wide) {
      var Wd = { cover: [560, -40, 640], speaker: [700, 300, 520], close: [600, -30, 600], sponsors: [640, -150, 640] }[which];
      return K.pic(S.src, Wd[0] + G.X, Wd[1], Wd[2], Wd[2] * S.h / S.w, { transform: S.rot ? "rotate(" + S.rot + "deg)" : undefined });
    }
    var dy = S.foot ? G.fy : (G.portrait ? 0 : G.story ? G.ty + (G.fy - G.ty) * 0.2 : 0), sc = G.story ? 1.15 : 1;
    if (G.square && !S.foot) sc = 0.86;
    var w = S.w * sc, h = S.h * sc;
    return K.pic(S.src, S.x + (S.x > 200 ? (S.w - w) : 0), S.y + dy, w, h, { transform: S.rot ? "rotate(" + S.rot + "deg)" : undefined });
  }

  /* ---------- words ---------- */
  /* The panel under a speaker. Speaker carousel (6001:198): name SemiBold 112 / 0.87, sentence case, bottom-aligned on
     803; role Medium 43 capitals at 826; panel 48, 666, 984 x 230, opaque. Panel carousel (12011:52): role Book 44 over
     the name SemiBold 100 / 0.92, in a box 194 high, 23 above the footer, 85% fill. A second line grows upwards. */
  function namePanel(d, K, G, o) {
    var c = K.c, s = o.s || 1, x = o.x || 48, w = o.w || 984, bot = o.bot, out = [], top;
    if (series(K)) {
      var nm = K.fit(c.name, 112 * s, o.nameW || 879 * s, 600, 2, 0.6), lh = nm.size * 0.87;
      var rl = K.has("role") ? K.fit(c.role, 43 * s, w - 80 * s, 500, 2, 0.8, true) : null, rx = rl ? (rl.n - 1) * rl.size : 0;
      var nameBot = bot - 92 * s - rx, nameTop = nameBot - nm.n * lh;
      top = o.top != null ? o.top : nameTop - 39.56 * s;
      out.push(K.text(x + 35 * s, nameTop, nm.text, { size: nm.size, lh: 0.87, wrap: true, field: "name", fit: "name", w: w - 40 * s, h: nm.n * lh + 4 }));
      if (rl) out.push(K.text(x + 35 * s, bot - 70 * s - rx, rl.text, { size: rl.size, weight: 500, lh: 1, upper: true, wrap: true, field: "role" }));
    } else {
      var nm2 = K.fit(c.name, 100 * s, w - 50 * s, 600, 2, 0.6), lh2 = nm2.size * 0.92;
      var nTop = bot - 18 * s - nm2.n * lh2;
      var rl2 = K.has("role") ? K.fit(c.role, 44 * s, w - 50 * s, 300, 2, 0.8) : null;
      var rTop = rl2 ? nTop - 12 * s - rl2.n * rl2.size : nTop;
      top = o.top != null ? o.top : rTop - 28 * s + (rl2 ? 0 : -6 * s);
      if (rl2) out.push(K.text(x + 25 * s, rTop, rl2.text, { size: rl2.size, weight: 300, lh: 1, ls: 0, wrap: true, field: "role" }));
      out.push(K.text(x + 21 * s, nTop, nm2.text, { size: nm2.size, lh: 0.92, wrap: true, field: "name", fit: "name", w: w - 30 * s, h: nm2.n * lh2 + 4 }));
    }
    var fill = series(K) ? K.light : K.rgba(K.light, 0.85);
    out.unshift(K.box(x, top, w, bot - top, { line: G.wide ? 1.7 : 2, fill: fill, z: K.Z.panel }));
    return { els: out, top: top };
  }

  /* The call to action (12011:1372): the date line Book 54 at the box's top, the line SemiBold 121 / 0.92 under it. */
  function ctaBox(d, K, G, o) {
    var c = K.c, s = o.s || 1, x = o.x || 48, w = o.w || 984, bot = o.bot, out = [];
    var ct = K.fit(c.cta, 121 * s, w - 50 * s, 600, 3, 0.55), lh = ct.size * 0.92;
    var ctTop = bot - 17.4 * s - ct.n * lh, meta = K.has("venue") ? K.fit(c.venue, 54 * s, w - 50 * s, 300, 2, 0.75) : null;
    var mTop = ctTop - 106 * s - (meta ? (meta.n - 1) * meta.size : 0), top = o.top != null ? o.top : (meta ? mTop - 34 * s : ctTop - 36 * s);
    if (meta) out.push(K.text(x + 25 * s, mTop, meta.text, { size: meta.size, weight: 300, lh: 1, ls: 0, wrap: true, field: "venue" }));
    out.push(K.text(x + 21 * s, ctTop, ct.text, { size: ct.size, lh: 0.92, wrap: true, field: "cta", fit: "cta", w: w - 30 * s, h: ct.n * lh + 4 }));
    out.unshift(K.box(x, top, w, bot - top, { line: G.wide ? 1.7 : 2, fill: series(K) ? K.light : K.rgba(K.light, 0.85), z: K.Z.panel }));
    return out;
  }

  /* The speaker carousel's opener (2013:2): the wordmark, the edition, the date and the line under it, each sized to
     the same measure and stacked tight. s scales it; x0, top place it. */
  function stack(d, K, G, s, x0, cy) {
    var c = K.c, out = [], items = [];
    var M = function (v) { return v * s; };
    items.push({ h: 190.48, gap: 0, draw: function (y) { return K.mark("wordmark", x0 - M(2), y, M(928.8), M(191.1), { label: "TEKEX", z: K.Z.text }); } });
    if (K.has("edition")) {
      var ew = edW(K, c.edition, 269.157), ep = ew > 928 ? 269.157 * 928 / ew : 269.157;
      items.push({ h: ep * 0.85, gap: 33.52, draw: function (y) { return K.text(x0 - M(1), y + M(1), edRuns(c.edition), { size: M(ep), lh: 0.85, field: "edition" }); } });
    }
    if (K.has("date")) {
      var dp = shrink(K, c.date, 219.119, 921, 600, 0, 0.5);
      items.push({ h: dp * 0.85, gap: items.length > 1 ? 0 : 33.52, draw: function (y) { return K.text(x0 - M(5), y, c.date, { size: M(dp), lh: 0.85, ls: 0, field: "date" }); } });
    }
    if (K.has("eyebrow")) {
      var lp = shrink(K, String(c.eyebrow).toUpperCase(), 76.336, 922, 500, 0, 0.5);
      items.push({ h: lp * 0.92, gap: 24, draw: function (y) { return K.text(x0 - M(5), y, String(c.eyebrow), { size: M(lp), weight: 500, lh: 0.92, ls: 0, upper: true, field: "eyebrow" }); } });
    }
    var H = items.reduce(function (a, it) { return a + it.h + it.gap; }, 0) * s, y = cy - H / 2;
    items.forEach(function (it) { y += it.gap * s; out.push(it.draw(y)); y += it.h * s; });
    return out;
  }

  /* ---------- the sponsors' logos as a wall ---------- */
  /* Rows justified to the full measure, as both end slides set them; wordmark-shaped logos take a row of their own when
     that makes everything larger. Every arrangement of the logos into rows is tried and the one that shows them
     largest is kept. */
  function wall(K, logos, x, y, W, H, o) {
    o = o || {};
    var out = [], gx = o.gx || 60, gy = o.gy || 48, maxH = o.maxH || 180;
    if (!logos.length) return out;
    // the end slides' larger Rathbones carries its compass
    // drawn large, each logo keeps its own drawing's proportions
    var AR = { yoono: 850.39 / 168.4, c5: 47 / 42, bdo: 82.047 / 31.508, red5: 1163.98 / 401.77, wildpeak: 1599.6 / 1055.4 };
    logos = logos.map(function (l) { return l.key === "rathbones" ? Object.assign({}, l, { src: BIG_RATH, ar: 718 / 82.456 }) : Object.assign({}, l, { ar: AR[l.key] || l.ar }); });
    // the order each end slide reads in (2013:1821 and 12011:1421); a logo as long as Rathbones always has a row to itself
    var ORD = o.order || ["c5", "bdo", "wildpeak", "red5", "rathbones", "yoono"];
    logos = logos.slice().sort(function (a, b) { return ORD.indexOf(a.key) - ORD.indexOf(b.key); });
    var hu = function (l) { return l.ar > 6 ? 0.5 : l.ar > 4 ? 0.8 : 1; };
    var best = null, n = logos.length, solo = o.solo !== false, maxRow = o.maxRow || 3, Hs = o.Hs || H;
    var tryRows = function (rows) {
      var hs = rows.map(function (r) {
        var uw = r.reduce(function (a, l) { return a + hu(l) * l.ar; }, 0), k = (W - gx * (r.length - 1)) / uw;
        k = Math.min(k, maxH / Math.max.apply(null, r.map(hu)));
        return k;
      });
      var tot = rows.reduce(function (a, r, i) { return a + Math.max.apply(null, r.map(hu)) * hs[i]; }, 0) + gy * (rows.length - 1);
      // judged by the smallest logo first (no sponsor is left tiny), then by how large they are together
      var f = Math.min(1, Hs / tot), sizes = [];
      rows.forEach(function (r, i) { r.forEach(function (l) { var h = hu(l) * hs[i] * f; sizes.push(Math.sqrt(h * h * l.ar)); }); });
      var score = Math.min.apply(null, sizes) + 0.3 * sizes.reduce(function (a, b) { return a + b; }, 0) / n;
      if (!best || score > best.score) best = { rows: rows, ks: hs, f: f, tot: tot, score: score };
    };
    var rec = function (start, acc) {
      if (start >= n) { tryRows(acc); return; }
      for (var e = start + 1; e <= Math.min(n, start + maxRow); e++) {
        var row = logos.slice(start, e);
        if (solo && row.length > 1 && row.some(function (l) { return l.ar > 6; })) break;
        rec(e, acc.concat([row]));
      }
    };
    rec(0, []);
    var f = Math.min(1, H / best.tot), tot = best.tot * f, yy = y + (H - tot) / 2;
    best.rows.forEach(function (r, i) {
      var k = best.ks[i] * f, rh = Math.max.apply(null, r.map(hu)) * k;
      var ws = r.map(function (l) { return hu(l) * l.ar * k; }), sw = ws.reduce(function (a, b) { return a + b; }, 0);
      // a justified row keeps its gaps; a row capped in height is centred rather than spread to the edges
      var gap = r.length > 1 ? Math.min((W - sw) / (r.length - 1), gx * 1.8) : 0, xx = x + (W - sw - gap * (r.length - 1)) / 2;
      r.forEach(function (l, j) { var h = hu(l) * k; out.push(K.mark(l.src, xx, yy + (rh - h) / 2, ws[j], h, { label: l.key, z: K.Z.text })); xx += ws[j] + gap; });
      yy += rh + gy * f;
    });
    return out;
  }

  /* ---------- the layouts ---------- */
  function build(d, K, G) {
    var L = d.layout || 0, ser = series(K), c = K.c, els = [], X = G.X;
    var pic = d.images && d.images.portrait, cut = pic ? !!pic.cut : ser; // with no picture yet, the set's own form

    if (!G.wide) {
      var top = G.top + 64, bot = G.foot - 23;
      if (L === 0) {
        if (ser) {
          els.push(ribbon(K, G));
          els.push(stack(d, K, G, 1, 73, (top + G.foot) / 2 + 2.5));
          els.push(frame(d, K, G, { strip: true }));
          return els;
        }
        // the panel carousel's cover (12011:3): the host over the question, in two boxes on the footer
        els.push(shape(K, G, "cover"));
        var hasQ = K.has("headline"), q = K.fit(c.headline, 121, 920, 600, 3, 0.55), qlh = q.size * 0.92;
        var meta = K.has("venue") ? K.fit(c.venue, 54, 930, 300, 1, 0.6) : null;
        var qTop = bot - 17.4 - q.n * qlh, mTop = (hasQ ? qTop - 106 : bot - 34 - 54 - 6), boxTop = (meta ? mTop : qTop) - 34;
        if (!meta && !hasQ) boxTop = bot - 120;
        els.push(K.box(48, boxTop, 984, bot - boxTop, { line: 2, fill: K.rgba(K.light, 0.85), z: K.Z.panel }));
        if (meta) els.push(K.text(73, mTop, meta.text, { size: meta.size, weight: 300, lh: 1, ls: 0, field: "venue" }));
        if (hasQ) els.push(K.text(69, qTop, q.text, { size: q.size, lh: 0.92, wrap: true, field: "headline", fit: "headline", w: 950, h: q.n * qlh + 4 }));
        if (K.has("person") || K.has("extra")) {
          var hb = boxTop - 23 - 100, runs = [{ t: "Hosted by ", weight: 300 }, { t: String(c.person || "").trim(), weight: 600 }].concat(K.has("extra") ? [{ t: ", " + String(c.extra).trim(), weight: 300 }] : []);
          var hw = runs.reduce(function (a, r) { return a + K.tw(r.t, 46, r.weight, 0); }, 0), hs = hw > 930 ? Math.max(30, 46 * 930 / hw) : 46;
          els.push(K.box(48, hb, 984, 100, { line: 2, fill: K.rgba(K.light, 0.85), z: K.Z.panel }));
          els.push(K.text(73, hb + 27 + (46 - hs) / 2, runs, { size: hs, lh: 1, ls: 0, field: "person" }));
        }
        els.push(frame(d, K, G));
        return els;
      }
      if (L === 1) {
        var np = namePanel(d, K, G, { bot: ser ? G.foot - 13 : bot });
        if (ser) els.push(ribbon(K, G)); else els.push(shape(K, G, "speaker"));
        if (cut) {
          // a cut-out stands behind the panel and the footer; its head comes up to the top bar
          // Tekex36 crops the head large: the face fills the top half, the shoulders run behind the panel and the footer
          var g = G.fy - G.ty, sh = 1480 + g * 0.5;
          els.push(K.slot("portrait", "Speaker cut-out", -160, 34 + G.ty + g * 0.3, 1400, sh));
        } else {
          var pt = top + 23, pb = np.top - 20;
          els.push(K.slot("portrait", "Speaker photo", 48, pt, 984, pb - pt, { cover: true }));
          els.push(K.box(48, pt, 984, pb - pt, { line: 2, z: K.Z.wash }));
        }
        els.push(np.els);
        els.push(frame(d, K, G));
        return els;
      }
      if (L === 2) {
        if (ser) els.push(ribbon(K, G)); else els.push(shape(K, G, "close"));
        els.push(ctaBox(d, K, G, { bot: ser ? G.foot - 13 : bot }));
        els.push(frame(d, K, G));
        return els;
      }
      // supported by
      var logos = K.sponsors();
      if (ser) {
        // 2013:1821: "Supported by:" over a 60% panel of the logos
        els.push(ribbon(K, G));
        var pTop = 280 + G.ty + (G.fy - G.ty) * 0.18, pBot = G.foot - 13;
        els.push(K.text(103, pTop - 118.4, [{ t: "Supported ", weight: 600 }, { t: "by:", weight: 300 }], { size: 91.095, lh: 0.87 }));
        els.push(K.box(48, pTop, 984, pBot - pTop, { line: 2, fill: K.rgba(K.light, 0.6), z: K.Z.panel }));
        els.push(wall(K, logos, 178, pTop + 60, 718, pBot - pTop - 120, { gx: 65, gy: 48, maxH: 176 * (1 + (G.fy - G.ty) / 1080 * 0.35), Hs: 496 }));
        els.push(frame(d, K, G, { leftFill: K.rgba(K.light, 0.6) }));
        return els;
      }
      // 12011:1421: SUPPORTED BY inside the box, the logos under it
      els.push(shape(K, G, "sponsors"));
      var sTop = bot - 632 - (G.story ? 180 : 0);
      els.push(K.box(48, sTop, 984, bot - sTop, { line: 2, fill: K.rgba(K.light, 0.85), z: K.Z.panel }));
      els.push(K.text(98, sTop + 43, "SUPPORTED BY", { size: 44.29, weight: 500, lh: 1 }));
      els.push(wall(K, logos, 98, sTop + 123, 878, bot - sTop - 123 - 36, { gx: 60, gy: 44, maxH: 154 * (1 + (G.fy - G.ty) / 1080 * 0.35), Hs: 473, order: ["yoono", "bdo", "rathbones", "c5", "red5", "wildpeak"] }));
      els.push(frame(d, K, G));
      return els;
    }

    // ---- 1200 x 627, and 16:9 at the same height. The set keeps one arrangement: a keylined panel at the left, the
    // top bar shortened to the right of it, the picture or shape on the right (as the toolkit's wide speaker card).
    var PX = 48, PY = 44, PW = 532, PH = 421, PB = PY + PH;
    if (L === 0) {
      if (ser) {
        els.push(ribbon(K, G, { x: 520, y: 80, w: 780 }));
        els.push(K.box(PX, PY, PW, PH, { line: 1.7, fill: K.light, z: K.Z.panel }));
        els.push(stack(d, K, G, 0.505, 75, PY + PH / 2 + 2));
        els.push(frame(d, K, G, { strip: true }));
        return els;
      }
      els.push(shape(K, G, "cover"));
      var s0 = 0.62, m0 = K.has("venue") ? K.fit(c.venue, 54 * s0, PW - 44, 300, 1, 0.7) : null;
      // the question steps down until it fits under the host and the date line
      var room = PH - 14 - (K.has("person") || K.has("extra") ? 70 + 18 : 22) - (m0 ? m0.size + 66 * s0 : 0), q0, l0, qs = 121 * s0;
      do { q0 = K.fit(c.headline, qs, PW - 44, 600, 4, 0.5); l0 = q0.size * 0.92; qs = q0.size - 3; } while (q0.n * l0 > room && qs > 36);
      var qT = PB - 14 - q0.n * l0;
      els.push(K.box(PX, PY, PW, PH, { line: 1.7, fill: K.rgba(K.light, 0.85), z: K.Z.panel }));
      if (K.has("headline")) els.push(K.text(PX + 18, qT, q0.text, { size: q0.size, lh: 0.92, wrap: true, field: "headline", fit: "headline", w: PW - 20, h: q0.n * l0 + 4 }));
      if (m0) els.push(K.text(PX + 21, qT - 66 * s0 - m0.size, m0.text, { size: m0.size, weight: 300, lh: 1, ls: 0, field: "venue" }));
      if (K.has("person") || K.has("extra")) {
        var r0 = [{ t: "Hosted by ", weight: 300 }, { t: String(c.person || "").trim(), weight: 600 }].concat(K.has("extra") ? [{ t: ", " + String(c.extra).trim(), weight: 300 }] : []);
        var hw0 = r0.reduce(function (a, r) { return a + K.tw(r.t, 28.5, r.weight, 0); }, 0), hs0 = hw0 > PW - 44 ? Math.max(20, 28.5 * (PW - 44) / hw0) : 28.5;
        els.push(K.box(PX, PY, PW, 70, { line: 1.7, fill: K.rgba(K.light, 0.85), z: K.Z.panel }));
        els.push(K.text(PX + 21, PY + 35 - hs0 / 2, r0, { size: hs0, lh: 1, ls: 0, field: "person" }));
      }
      els.push(frame(d, K, G));
      return els;
    }
    if (L === 1) {
      if (ser) els.push(ribbon(K, G, { x: 560, y: 60, w: 720 })); else els.push(shape(K, G, "speaker"));
      var np2 = namePanel(d, K, G, { s: 0.68, x: PX, w: PW, bot: PB, top: PY, nameW: PW - 50 });
      if (cut) els.push(K.slot("portrait", "Speaker cut-out", 560 + X * 0.5, 96, 640, 600));
      else {
        els.push(K.slot("portrait", "Speaker photo", 590, 144, 560 + X, PB - 144, { cover: true }));
        els.push(K.box(590, 144, 560 + X, PB - 144, { line: 1.7, z: K.Z.wash }));
      }
      els.push(np2.els);
      els.push(frame(d, K, G));
      return els;
    }
    if (L === 2) {
      if (ser) els.push(ribbon(K, G, { x: 540, y: 70, w: 760 })); else els.push(shape(K, G, "close"));
      els.push(ctaBox(d, K, G, { s: 0.62, x: PX, w: PW, bot: PB, top: PY }));
      els.push(frame(d, K, G));
      return els;
    }
    // supported by: the heading beside the short top bar, the logos in a full-width panel under it
    var lg = K.sponsors(), sT = 144, sB = PB;
    if (ser) {
      els.push(ribbon(K, G, { x: 500, y: 40, w: 820 }));
      els.push(K.text(72, 53, [{ t: "Supported ", weight: 600 }, { t: "by:", weight: 300 }], { size: 64, lh: 0.87 }));
    } else {
      els.push(shape(K, G, "sponsors"));
      els.push(K.text(70, 69, "SUPPORTED BY", { size: 40, weight: 500, lh: 1 }));
    }
    els.push(K.box(PX, sT, 1102 + X, sB - sT, { line: 1.7, fill: K.rgba(K.light, ser ? 0.6 : 0.85), z: K.Z.panel }));
    els.push(wall(K, lg, PX + 60, sT + 36, 1102 + X - 120, sB - sT - 72, { gx: 56, gy: 30, maxH: 110, solo: false, maxRow: 4, order: ser ? null : ["yoono", "bdo", "rathbones", "c5", "red5", "wildpeak"] }));
    els.push(frame(d, K, G, ser ? { leftFill: K.rgba(K.light, 0.6) } : {}));
    return els;
  }

  var EX = { edition: "JSY#36", date: "21/05/26", eyebrow: "Speaker introduction", headline: "", person: "", extra: "",
    name: "Serena Guthrie", role: "Former England netball player", cta: "Register now at tekex.co", venue: "21 May / 17:30 / St Helier", footLabel: "Speakers" };

  T.add({
    tpl: { partners: true, key: "tk-lineup", short: "Line-up", what: "a line-up carousel", name: "Line-up carousel", theme: "Mint & magenta",
      desc: "The slides of a speaker carousel: a cover, one slide per speaker, the call to action and the sponsors. With an edition it is the speaker carousel; without one, the panel carousel.",
      required: [], layouts: ["Cover", "Speaker", "Close", "Supported by"] },
    fields: [
      F("edition", "Edition (empty for a panel carousel)", "JSY#36", { optional: true }),
      F("date", "Date", "21/05/26", { optional: true, on: [0] }),
      F("eyebrow", "Line under the date", "Speaker introduction", { optional: true, on: [0] }),
      F("headline", "Panel question (no edition)", "What's next for the Isle of Man?", { optional: true, on: [0] }),
      F("person", "Host (no edition)", "Ed Prow", { optional: true, on: [0] }),
      F("extra", "Host's role", "Co-founder, Tekex", { optional: true, on: [0] }),
      F("name", "Speaker name", "Serena Guthrie", { on: [1] }),
      F("role", "Role or company", "Former England netball player", { optional: true, on: [1] }),
      F("venue", "Date, time and venue", "4 Nov / 17:00 / Santander Work Café", { optional: true, on: [0, 2] }),
      F("cta", "Call to action", "Register now at tekex.co", { on: [2] }),
      F("footLabel", "Footer label", "Speakers", { optional: true })
    ],
    examples: [EX, EX, EX, EX],
    slots: function (d) { return (d.layout || 0) === 1 ? [{ id: "portrait", label: "Speaker" }] : []; },
    fill: function (d, put, libImg, match) {
      if ((d.layout || 0) !== 1) return;
      var who = match(d.copy && d.copy.name), cutId = who && libImg(who + "-cutout") ? who + "-cutout" : who;
      put("portrait", libImg(cutId || "tk-serena-guthrie-cutout"));
    },
    preload: [BIG_RATH], build: build
  });
})();
