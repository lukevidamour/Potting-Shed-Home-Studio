/* News: a headline, a picture and the News pair (red on lilac), with the white notched-square News icon.
   Source: TEKEX toolkit (rVWbcVBLtLKYvbMFFs8XZV) frames 9028:200, 9038:19898, 9038:20979, 9038:21023 (1080 x 1080) and
   9038:23252, 9038:24147, 9038:25031, 9038:25077 (1200 x 627); Post 43 "Louis Pike IOD" 15040:1892 and 15051:99 (person and
   headline), the toolkit photo-headline-box 9028:1204 (solid bars on a photo) and Post 82 "Jenson appointment" 13039:6 and
   13040:52 (dark photo, fade and translucent panel).
   Layouts: 0 photo and panel, 1 headline over the icon, 2 boxed image, 3 quote over a picture, 4 cut-out and headline.
   Layout 0 takes its look from the picture and the colourway: a cut-out stands behind the white ribbon (the toolkit post);
   a rectangular photo fills the frame and the bars turn solid (9028:1204); on a dark colourway the photo fades into the
   ground behind a translucent panel (Post 82). */
(function () {
  var T = window.HS_TEKEX, TUBE = "assets/tekex/shapes/news-tube.webp", ZED = "assets/tekex/shapes/news-z.webp", WHITE = "#FFFFFF";
  var F = function (key, label, ph, more) { return Object.assign({ key: key, label: label, ph: ph }, more || {}); };

  /* Lines as Figma sets them in a fixed-width box: each line takes words until the next one would not fit. A last line
     of one word takes a second from the line above when it can. */
  function wrap(K, str, px, maxW, weight, upper) {
    var s = String(str || "").trim(); if (upper) s = s.toUpperCase();
    if (!s) return [""];
    var out = [];
    s.split(/\n+/).forEach(function (para) {
      var line = "";
      para.trim().split(/\s+/).forEach(function (w) { var t = line ? line + " " + w : w; if (!line || K.tw(t, px, weight) <= maxW) line = t; else { out.push(line); line = w; } });
      out.push(line);
    });
    var n = out.length;
    if (n > 1 && out[n - 1].indexOf(" ") < 0) {
      var prev = out[n - 2].split(" ");
      if (prev.length > 2) { var cand = prev[prev.length - 1] + " " + out[n - 1]; if (K.tw(cand, px, weight) <= maxW) { prev.pop(); out[n - 2] = prev.join(" "); out[n - 1] = cand; } }
    }
    return out;
  }
  /* The largest size, up to px, at which str sets in no more than maxLines of maxW and maxH in all. Never below floor x px. */
  function fitBox(K, str, px, maxW, maxH, weight, maxLines, lh, floor, upper) {
    var min = px * (floor || 0.5), s = px, ls;
    for (;;) {
      ls = wrap(K, str, s, maxW, weight, upper);
      var wide = Math.max.apply(null, ls.map(function (l) { return K.tw(l, s, weight); }));
      if ((ls.length <= maxLines && ls.length * s * lh <= maxH + 0.5 && wide <= maxW) || s <= min) break;
      s = Math.max(min, s - 1);
    }
    return { size: s, lines: ls, text: ls.join("\n"), n: ls.length };
  }
  function lum(c) { var m = String(c).match(/[\d.]+/g) || [255, 255, 255]; return (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255; }

  /* The 1200 x 627 top bar of the News frames: 87 high, a 2.154 keyline, TEKEX.CO three pixels lower than the speaker bar. */
  function topWide(K, G, o) {
    o = o || {};
    var X = G.X, ink = o.ink || K.ink, out = [];
    out.push(K.box(o.x == null ? 48 : o.x, 44, o.w == null ? 1102 + X : o.w + X, 87, { line: 2.154, color: o.line || ink, fill: o.fill || "transparent" }));
    out.push(K.mark("arrow-small", 939 + X - 1.11, 78.39 - 0.94, 24.02, 24.02, { rot: -90, color: ink, z: K.Z.top }));
    out.push(K.text(971.83 + X, 77, [{ t: "TEKEX", weight: 600 }, { t: ".CO", weight: 500 }], { size: 32, color: ink, z: K.Z.top }));
    return out;
  }
  /* Solid bars (9028:1204): the bars fill with the ink and every mark on them turns the ground colour. */
  function solid(K, list) {
    return list.map(function (e) {
      if (e.k === "box" && e.style.background === K.ink) e.style.border = String(e.style.border).replace(/solid .*$/, "solid " + K.ink);
      return e;
    });
  }

  /* A headline (and an optional sub-line) in a keylined panel standing on the footer. Returns the panel top. */
  function panel(K, G, o) {
    var c = K.c, fy = G.fy, s = o.s || 1, bottom = (o.bottom == null ? 895 : o.bottom) + (G.wide ? 0 : fy), out = [];
    var hasSub = K.has("body"), maxH = o.maxH || 400;
    var subF = hasSub ? fitBox(K, c.body, o.subSize * s, o.subW || o.w, 999, o.subWeight, 2, 1, 0.7, true) : null;
    var subH = hasSub ? subF.n * subF.size * o.subLh : 0, gap = hasSub ? o.gap * s : 0;
    var head = fitBox(K, c.headline, o.size * s, o.w, maxH - subH - gap, 600, o.lines || 3, o.lh, 0.5);
    var headH = head.n * head.size * o.lh;
    var textTop = o.top != null ? o.top : bottom - o.padB * s - subH - gap - headH, top = o.top != null ? o.top - o.padT * s : textTop - o.padT * s;
    if (o.box !== false) out.push(K.box(o.px == null ? 49 : o.px, top, o.pw == null ? 983 : o.pw, (o.top != null ? (o.ph || 421) : bottom - top), { line: o.line || 2, fill: o.fill || K.light, z: K.Z.panel }));
    out.push(K.text(o.x, textTop, head.text, { size: head.size, lh: o.lh, wrap: true, field: "headline", fit: "headline", w: o.w + 24, h: headH + 6 }));
    if (hasSub) out.push(K.text(o.subX == null ? o.x : o.subX, textTop + headH + gap, subF.text, { size: subF.size, weight: o.subWeight, lh: o.subLh, upper: true, wrap: true, field: "body" }));
    return { els: out, top: top };
  }

  /* Layout 0: photo and panel. */
  function photoPanel(d, K, G) {
    var els = [], X = G.X, img = d.images && d.images.photo, cut = !!(img && img.cut), dark = lum(K.light) < 0.35, look = dark ? "fade" : cut || !img ? "ribbon" : "solid";
    var label = d.copy.footLabel || "NEWS";
    if (!G.wide) {
      var g = G.fy - G.ty, sc = 1 + g / 1080 * 0.5;
      if (look === "ribbon") {
        els.push(K.slot("photo", "Photo or cut-out", 90, 40 + G.ty, 990, 869 + g, {}));
        els.push(K.pic(TUBE, 54 - 1037 * (sc - 1) / 2, 4 + G.ty + g * 0.3, 1037 * sc, 952 * sc, { blend: "screen", z: K.Z.wash }));
      } else els.push(K.slot("photo", "Photo or cut-out", 0, 0, G.w, G.h, { cover: true }));
      var p;
      if (look === "fade") {
        p = panel(K, G, { x: 77, subX: 78, size: 107.362, lh: 0.87, padT: 29, padB: 31, gap: 28, subSize: 43, subWeight: 400, subLh: 1, w: 926, px: 48, pw: 984, fill: K.rgba(K.light, 0.9), maxH: 440, lines: 4 });
        var sTop = p.top - 143;
        els.push(K.box(0, sTop, G.w, G.h - sTop, { z: K.Z.wash, css: { background: "linear-gradient(to bottom, " + K.rgba(K.light, 0) + " 0%, " + K.light + " 74.038%)" } }));
        els.push(p.els);
        els.push(K.chrome({ label: label }));
        return els;
      }
      p = panel(K, G, { x: 83, size: 96, lh: 0.92, padT: 34, padB: K.has("body") ? 32 : 29.4, gap: 20, subSize: 43, subWeight: 500, subLh: 1, w: 921, maxH: 440, lines: 4 });
      els.push(p.els);
      var ch = K.chrome(look === "solid" ? { label: label, ink: K.light, light: K.ink, topFill: K.ink, cellFill: K.ink } : { label: label });
      els.push(look === "solid" ? solid(K, ch) : ch);
      return els;
    }
    // ---- 1200 x 627: the panel moves to the top left and becomes tall (9038:23252)
    if (look === "ribbon") {
      els.push(K.slot("photo", "Photo or cut-out", 600 + X, 100, 580, 432, {}));
      els.push(K.pic(TUBE, 300 + X, 4, 1037, 952, { blend: "screen", z: K.Z.wash }));
    } else els.push(K.slot("photo", "Photo or cut-out", 0, 0, G.w, G.h, { cover: true }));
    var pw = panel(K, G, { top: 78, ph: 421, x: 83, size: 96, lh: 0.92, padT: 34, gap: 14, subSize: 30, subWeight: dark ? 400 : 500, subLh: 1, w: 470, px: 48, pw: 532, line: 1.7, lines: 5,
      fill: dark ? K.rgba(K.light, 0.9) : K.light, maxH: 421 - 34 - 30 });
    els.push(pw.els);
    var cw = K.chrome(look === "solid" ? { label: label, shortTop: [590, 560], ink: K.light, light: K.ink, topFill: K.ink, cellFill: K.ink } : { label: label, shortTop: [590, 560] });
    els.push(look === "solid" ? solid(K, cw) : cw);
    return els;
  }

  function build(d, K, G) {
    var L = d.layout || 0, els = [], X = G.X, c = K.c, fy = G.fy, ty = G.ty, g = G.fy - G.ty, label = d.copy.footLabel || "NEWS";
    if (L === 0) return photoPanel(d, K, G);
    if (L === 1) {
      // the white News icon, the headline over it
      if (!G.wide) {
        var sc = 1 + g / 1080 * 0.55, sz = 651 * sc;
        els.push(K.mark("news", 522.5 - sz / 2, 460.5 + ty + g * 0.42 - sz / 2, sz, sz, { color: WHITE, z: K.Z.motif }));
        var h = fitBox(K, c.headline, 128, 883, 5 * 117.76 * 0.8 + (g > 400 ? 117.76 : 0), 600, g > 400 ? 6 : 5, 0.92, 0.5), hh = h.n * h.size * 0.92;
        els.push(K.text(96, 826.04 + fy - hh, h.text, { size: h.size, wrap: true, field: "headline", fit: "headline", w: 910, h: hh + 6 }));
        els.push(K.chrome({ label: label }));
        return els;
      }
      els.push(K.mark("news", 242 + X * 0.5, 0, 651, 651, { color: WHITE, z: K.Z.motif }));
      var hw = fitBox(K, c.headline, 99.791, 941 + Math.min(0, X), 3 * 91.81, 600, 3, 0.92, 0.5), hhw = hw.n * hw.size * 0.92;
      els.push(K.text(80, 426.4 - hhw, hw.text, { size: hw.size, wrap: true, field: "headline", fit: "headline", w: 1030 + X, h: hhw + 6 }));
      els.push(topWide(K, G), K.chrome({ label: label, topBar: false }));
      return els;
    }
    if (L === 2) {
      // a boxed image between the bars, the white Z over it, the line in capitals on the image
      if (!G.wide) {
        var iy = 119 + ty, ih = 774 + g, zs = 1 + g / 1080 * 0.6;
        els.push(K.slot("photo", "Image", 48, iy, 984, ih, { cover: true }));
        els.push(K.pic(ZED, 540.3 - 658.6 * zs / 2, iy + 27 + g * 0.25, 658.6 * zs, 684.6 * zs, { blend: "screen", z: K.Z.wash }));
        var o2 = fitBox(K, c.headline, 98.515, 908.5, 3 * 90.63, 600, 3, 0.92, 0.5, true), oh = o2.n * o2.size * 0.92;
        els.push(K.box(48, 840.3 + fy - oh - 140, 984, 893 + fy - (840.3 + fy - oh - 140), { z: K.Z.wash, css: { background: "linear-gradient(to bottom, rgba(8,0,16,0) 0%, rgba(8,0,16,0.82) 45%, rgba(8,0,16,0.9) 100%)" } })); // the red line needs a near-black ground, as the Figma photo gives it
        els.push(K.text(101, 840.3 + fy - oh, o2.text, { size: o2.size, upper: true, wrap: true, field: "headline", fit: "headline", w: 920, h: oh + 6 }));
        els.push(K.chrome({ label: label }));
        return els;
      }
      els.push(K.slot("photo", "Image", 48, 139, 1102 + X, 327, { cover: true }));
      els.push(K.pic(ZED, 434 + X, -29, 658.6, 684.6, { blend: "screen", z: K.Z.wash }));
      els.push(K.box(48, 139, 560, 327, { z: K.Z.wash, css: { background: "linear-gradient(to right, rgba(8,0,16,0.86) 0%, rgba(8,0,16,0.82) 60%, rgba(8,0,16,0) 100%)" } }));
      var ow = fitBox(K, c.headline, 69.296, 351, 4 * 63.75, 600, 5, 0.92, 0.6, true), owh = ow.n * ow.size * 0.92;
      els.push(K.text(98, 174, ow.text, { size: ow.size, upper: true, wrap: true, field: "headline", fit: "headline", w: 370, h: owh + 6 }));
      els.push(topWide(K, G), K.chrome({ label: label, topBar: false }));
      return els;
    }
    if (L === 3) {
      // a quote set high on the right of a full-bleed picture
      els.push(K.slot("photo", "Picture", 0, 0, G.w, G.h, { cover: true }));
      els.push(K.box(0, 0, G.w, G.h, { z: K.Z.wash, css: { background: "linear-gradient(to right, " + K.rgba(K.light, 0) + " 38%, " + K.rgba(K.light, 0.82) + " 52%)" } }));
      var raw = String(c.quote || "").trim(), qt = /^[“"‘']/.test(raw) ? raw : "“" + raw + "”";
      var qx = G.wide ? 657 + X : 569, qy = G.wide ? 171 : 255 + ty, maxQ = G.wide ? 474 - 20 - qy : 880 + fy - qy - (K.has("name") ? 60 : 0);
      var q = fitBox(K, qt, 62.188, 476, maxQ, 600, G.wide ? 5 : 7, 0.97, 0.6), qh = q.n * q.size * 0.97;
      els.push(K.text(qx, qy, q.text, { size: q.size, lh: 0.97, wrap: true, field: "quote", fit: "quote", w: 490, h: qh + 6 }));
      if (K.has("name")) { var a = fitBox(K, c.name, 28.213, 476, 999, 500, 2, 1, 0.75, true); els.push(K.text(qx + 7, qy + qh + 16.7, a.text, { size: a.size, weight: 500, lh: 1, upper: true, wrap: true, field: "name" })); }
      if (G.wide) els.push(topWide(K, G), K.chrome({ label: label, topBar: false }));
      else els.push(K.chrome({ label: label, topFill: K.light }));
      return els;
    }
    // L === 4: a cut-out standing behind a keylined headline box, the News icon behind (Post 43)
    if (!G.wide) {
      var ms = 1 + g / 1080 * 0.4, msz = 640 * ms;
      els.push(K.mark("news", -46, -60 + ty + g * 0.3, msz, msz, { color: WHITE, z: K.Z.motif }));
      var p4 = panel(K, G, { x: 95, size: 96, lh: 0.92, padT: 34, padB: K.has("body") ? 28.4 : 30, gap: 20, subSize: 43, subWeight: 500, subLh: 1.1, w: 950, subW: 913, px: 48, pw: 984, maxH: 400 });
      els.push(K.slot("portrait", "Cut-out", 384 - g * 0.12, 33 + ty, 578 + g * 0.24, p4.top + 53 - 33 - ty, { z: K.Z.panel }));
      els.push(p4.els);
      els.push(K.chrome({ label: label }));
      return els;
    }
    els.push(K.mark("news", 640 + X, 18, 500, 500, { color: WHITE, z: K.Z.motif }));
    els.push(K.slot("portrait", "Cut-out", 610 + X, 112, 560, 420));
    var pw4 = panel(K, G, { top: 78, ph: 421, x: 83, size: 79, lh: 0.92, padT: 34, gap: 16, subSize: 30, subWeight: 500, subLh: 1.1, w: 470, px: 48, pw: 532, line: 1.7, lines: 4, maxH: 421 - 34 - 30 });
    els.push(pw4.els);
    els.push(K.chrome({ label: label, shortTop: [590, 560] }));
    return els;
  }

  T.add({
    tpl: { key: "tk-news", short: "News", what: "a news post", name: "News", theme: "Lilac & red",
      desc: "A news headline with a photo, a boxed image or the News icon, a quote, or a person, on the news colours.", required: ["headline"],
      layouts: ["Photo and panel", "Headline", "Image box", "Quote", "Person and headline"] },
    fields: [
      F("headline", "Headline", "Tekex to host the Health Innovation Summit", { kind: "area", on: [0, 1, 2, 4] }),
      F("body", "Sub-line", "Our biggest day of the year, in Jersey this June", { optional: true, on: [0, 4] }),
      F("quote", "Quote", "Tekex #32 is going to make you think again", { kind: "area", on: [3] }),
      F("name", "Who said it", "Simon Franc, CEO, Anatomap", { optional: true, on: [3] })
    ],
    examples: [
      { headline: "Tekex to host the Health Innovation Summit", body: "" },
      { headline: "Tekex lands in the Isle of Man this spring" },
      { headline: "TEKEX#32 coming 02/06/25 be there" },
      { quote: "Tekex #32 is going to change how you think about health tech", name: "Simon Franc - CEO, Anatomap" },
      { headline: "Hear from Louis Pike", body: "On Tekex development and his recent IOD committee appointment." }
    ],
    slots: function (d) { var L = d.layout || 0; return L === 4 ? [{ id: "portrait", label: "Cut-out" }] : L === 1 ? [] : [{ id: "photo", label: L === 0 ? "Photo or cut-out" : L === 2 ? "Image" : "Picture" }]; },
    fill: function (d, put, libImg) {
      var L = d.layout || 0;
      if (L === 0) { var c0 = d.copy || {}, w0 = T.personIn(c0.headline, true) || T.personIn(c0.headline, false); put("photo", libImg(w0 || "tkl-health-innovation-jersey-audience", 50, 40)); }
      else if (L === 2) put("photo", libImg("tk-iom-12", 50, 50)); // a dark stage, as the Figma frame uses
      else if (L === 3) put("photo", libImg("tk-event-10", 30, 50));
      else if (L === 4) { var c4 = d.copy || {}, who = T.personIn(c4.headline + " " + (c4.name || ""), true) || T.personIn(c4.headline, false); put("portrait", libImg(who || (/hear from|meet|welcome/i.test(c4.headline || "") ? "" : "tk-tim-huelin-cutout"))); }
    },
    preload: [T.MARK("news"), TUBE, ZED], build: build
  });
})();
