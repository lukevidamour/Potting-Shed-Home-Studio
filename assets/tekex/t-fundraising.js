/* Fundraising: rounds, raises and the money behind them, on the Fundraising pair (blue on peach), with the white six-triangle
   play shape. Source: TEKEX toolkit (rVWbcVBLtLKYvbMFFs8XZV) frames 9028:226, 9029:1651, 9038:18675, 9038:19835 (1080 x 1080)
   and 9038:21653, 9038:21725, 9038:22778, 9038:22831 (1200 x 627).
   Layouts: 0 photo over the swirl with a headline panel, 1 headline over the tube, 2 quote beside a photo, 3 a big figure. */
(function () {
  var T = window.HS_TEKEX, SWIRL = "assets/tekex/shapes/fund-swirl.webp", TUBE = "assets/tekex/shapes/fund-tube.webp", WHITE = "#FFFFFF";
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
  function bare(q) { return String(q || "").trim().replace(/^[“"‘']+/, "").replace(/[”"’']+$/, ""); }

  /* The frame. On 1200 x 627 FUNDRAISING keeps the 39.1 label at x 431 (the engine sets long labels smaller), and a short
     top bar is 81 high with a 2px keyline (9038:21661), not the 87-high speaker one. */
  function chrome(d, K, G, o) {
    o = o || {};
    var label = d.copy.footLabel || "FUNDRAISING", out = [], X = G.X;
    if (G.wide && o.shortTop) {
      out.push(K.box(o.shortTop[0] + X, 44, o.shortTop[1], 81, { line: 2 }));
      out.push(K.mark("arrow-small", 939 + X - 1.11, 78.39 - 0.94, 24.02, 24.02, { rot: -90, z: K.Z.top }));
      out.push(K.text(971.83 + X, 74, [{ t: "TEKEX", weight: 600 }, { t: ".CO", weight: 500 }], { size: 32, z: K.Z.top }));
    }
    var ch = K.chrome(Object.assign({ label: label }, o.chrome || {}, G.wide && o.shortTop ? { topBar: false } : {}));
    if (G.wide) ch.forEach(function (e) {
      if (e.k === "text" && e.runs && e.runs[0] && e.runs[0].t === label.toUpperCase()) Object.assign(e.style, { left: 431, top: 494.4, fontSize: 39.1, letterSpacing: "-0.782px" });
    });
    return out.concat(ch);
  }
  /* The six white triangles (9038:19836): a group 1028 x 1131.4, grown and moved into the room of a tall frame. */
  function triangles(K, G, x, y, z) {
    var g = G.fy - G.ty, sc = 1 + g / 1080 * 0.5, w = 1028 * sc, h = 1131.4 * sc;
    return K.mark("triangles", x - (w - 1028) * 0.15, y + 565.7 + G.ty + g * 0.5 - h / 2, w, h, { color: WHITE, z: z == null ? K.Z.motif : z });
  }

  function build(d, K, G) {
    var L = d.layout || 0, els = [], X = G.X, c = K.c, fy = G.fy, ty = G.ty, g = G.fy - G.ty;
    if (L === 0) {
      if (!G.wide) {
        var ss = 1 + g / 1080 * 0.6;
        els.push(K.pic(SWIRL, -105 - 1335 * (ss - 1) / 2, -183 + ty + g * 0.25, 1335 * ss, 1161 * ss, { z: K.Z.motif }));
        var h0 = fitBox(K, c.headline, 103.82, 939.8, 4 * 95.51, 600, 4, 0.92, 0.5), hh0 = h0.n * h0.size * 0.92;
        var pTop = 895 + fy - 44.5 - hh0 - 34;
        var ps = 1 + g / 1080 * 0.7, pw = 801 * ps, ph = (pTop + 110) - (43 + ty);
        els.push(K.slot("photo", "Photo or cut-out", 562.5 - pw / 2, 43 + ty, pw, ph, {}));
        els.push(K.box(49, pTop, 983, 895 + fy - pTop, { line: 2, fill: K.light, z: K.Z.panel }));
        els.push(K.text(83, pTop + 34, h0.text, { size: h0.size, wrap: true, field: "headline", fit: "headline", w: 950, h: hh0 + 6 }));
        els.push(chrome(d, K, G));
        return els;
      }
      els.push(K.pic(SWIRL, -105 + X, -183, 1335, 1161, { z: K.Z.motif }));
      els.push(K.slot("photo", "Photo or cut-out", 506 + X, 9, 644, 480, {}));
      els.push(K.box(0, 0, 586, 627, { fill: K.light, z: K.Z.wash }));
      var hw = fitBox(K, c.headline, 76.226, 498, 5 * 70.13, 600, 5, 0.92, 0.5), hhw = hw.n * hw.size * 0.92, yw = Math.max(140, 298.26 - hhw / 2);
      els.push(K.text(68, yw, hw.text, { size: hw.size, wrap: true, field: "headline", fit: "headline", w: 510, h: hhw + 6 }));
      els.push(chrome(d, K, G, { shortTop: [630, 520] }));
      return els;
    }
    if (L === 1) {
      if (!G.wide) {
        var ts = 1 + g / 1080 * 0.45, tw = 1004.85 * ts, th = 1133.91 * ts;
        els.push(K.pic(TUBE, 529.4 - tw / 2, -27 + ty * 0.5 + (G.h - 1080 - (th - 1133.91)) * 0.5, tw, th, { z: K.Z.motif }));
        var h1 = fitBox(K, c.headline, 123.387, 801, 5 * 113.52 + (g > 400 ? 113.52 : 0), 600, g > 400 ? 6 : 5, 0.92, 0.5), hh1 = h1.n * h1.size * 0.92;
        els.push(K.text(95, 858.6 + fy - hh1, h1.text, { size: h1.size, wrap: true, field: "headline", fit: "headline", w: 830, h: hh1 + 6 }));
        els.push(chrome(d, K, G));
        return els;
      }
      els.push(K.pic(TUBE, 326 + X, -493, 1004.85, 1133.91, { z: K.Z.motif }));
      var h1w = fitBox(K, c.headline, 79.022, 842 + Math.min(0, X), 3 * 72.7, 600, 3, 0.92, 0.5), hh1w = h1w.n * h1w.size * 0.92;
      els.push(K.text(82, 438.07 - hh1w, h1w.text, { size: h1w.size, wrap: true, field: "headline", fit: "headline", w: 870, h: hh1w + 6 }));
      els.push(chrome(d, K, G));
      return els;
    }
    if (L === 2) {
      var q = bare(c.quote);
      if (!G.wide) {
        // photo right, the triangles over it and over the footer fills (but under the keylines and marks), a hung quote mark
        var side = 1358 + g;
        els.push(K.slot("photo", "Photo", 250, -278 + ty * 0.5, side, side, { cover: true }));
        // the logo cell sits under the triangles, keyline and all (only the wordmark stays on top)
        els.push(K.box(48, G.foot, 349, 120, { line: 2, fill: K.light, z: K.Z.wash }), K.box(410, G.foot, 622, 120, { fill: K.light, z: K.Z.wash }));
        els.push(K.mark("wordmark", 71.5, G.foot + 27, 305.4, 62.84, { z: K.Z.chrome, label: "TEKEX" }));
        els.push(triangles(K, G, -101, -27.2, K.Z.wash)); // same layer as the cell fills, drawn after them
        var qy = 186 + ty, hasA = K.has("name"), maxQ = 909 + fy - 46 - qy - (hasA ? 23 + 36.2 : 0);
        var qf = fitBox(K, q + "”", 123.387, 523, maxQ, 600, 6, 0.92, 0.45), qh = qf.n * qf.size * 0.92;
        els.push(K.text(95 - 53 * qf.size / 123.387, qy, "“", { size: qf.size }));
        els.push(K.text(95, qy, qf.text, { size: qf.size, wrap: true, field: "quote", fit: "quote", w: 560, h: qh + 6 }));
        if (hasA) { var a = fitBox(K, c.name, 36.213, 523, 999, 500, 2, 1, 0.7, true); els.push(K.text(101, qy + qh + 23, a.text, { size: a.size, weight: 500, lh: 1, upper: true, wrap: true, field: "name" })); }
        els.push(chrome(d, K, G, { chrome: { cellFill: "transparent", logoCell: false } }));
        return els;
      }
      // the photo moves left, the triangles turn to point left on the right, the quote drops into a strip above the bar
      els.push(K.slot("photo", "Photo", -38, -225, 864, 864, { cover: true }));
      els.push(K.mark("triangles", 431.73 + X, -119.0, 872.26, 960.0, { color: WHITE, rot: 180, z: K.Z.wash }));
      var who = String(c.name || "").trim().toUpperCase(), roomW = 1033 + X, s2 = 59.387, k2 = 28.387 / 59.387;
      var widthAt = function (s) { return K.tw(q + "”", s, 600) + (who ? K.tw(" " + who, s * k2, 300) : 0); };
      while (widthAt(s2) > roomW && s2 > 42) s2 -= 1;
      var two = widthAt(s2) > roomW, qs = two ? fitBox(K, q + "”", s2, roomW, 2 * s2 * 0.92, 600, 2, 0.92, 0.7) : null;
      var qsz = two ? qs.size : s2, nL = two ? qs.n : 1, asz = qsz * k2;
      // the name follows the quote on its last line when it fits there, else it takes a line of its own
      var lastW = two ? K.tw(qs.lines[qs.n - 1], qsz, 600) : K.tw(q + "”", qsz, 600), own = !!who && lastW + K.tw(" " + who, asz, 300) > roomW;
      var aFit = own ? fitBox(K, who, asz, roomW, asz * 2, 300, 1, 1, 0.75) : null;
      var stripH = 106 + (nL - 1) * qsz * 0.92 + (own ? aFit.size * 1.15 : 0), sTop = 467 - stripH;
      els.push(K.box(48, sTop, 1102 + X, stripH, { line: 2, fill: K.light, z: K.Z.panel }));
      var runs = [{ t: two ? qs.text : q + "”" }];
      if (who) runs.push({ t: (own ? "\n" : " ") + who, style: { fontSize: ((own ? aFit.size : asz)) + "px", fontWeight: 300, letterSpacing: (-0.02 * (own ? aFit.size : asz)).toFixed(3) + "px", lineHeight: own ? "1.6" : undefined } });
      els.push(K.text(81, sTop + 19 + (qsz < 59.387 ? (59.387 - qsz) * 0.46 : 0), runs, { size: qsz, wrap: two || own, field: "quote", fit: "quote", w: roomW + 30, h: stripH - 19 }));
      els.push(chrome(d, K, G));
      return els;
    }
    // L === 3: a figure set big and light, its caption under it
    var stat = String(c.stat || "").trim();
    if (!G.wide) {
      els.push(triangles(K, G, -101, -27.2));
      var cap = fitBox(K, c.headline, 132.582, 894, 3 * 121.98, 600, 3, 0.92, 0.5), ch = cap.n * cap.size * 0.92, cTop = 870.9 + fy - ch;
      var room = Math.min(362.856, (cTop - (125 + ty)) * 362.856 / 327.9);
      var fig = fitBox(K, stat, room, 977, 340, 300, 1, 0.92, 0.3), figTop = cTop - 327.9 * fig.size / 362.856;
      els.push(K.text(77, figTop, fig.text, { size: fig.size, weight: 300, field: "stat", fit: "stat", w: 990, h: fig.size * 0.92 + 6 }));
      els.push(K.text(89, cTop, cap.text, { size: cap.size, wrap: true, field: "headline", fit: "headline", w: 920, h: ch + 6 }));
      els.push(chrome(d, K, G));
      return els;
    }
    els.push(K.mark("triangles", 589 + X, -253, 1028, 1131.4, { color: WHITE, z: K.Z.motif }));
    var capw = fitBox(K, c.headline, 86.226, 1102 + X, 79.33, 600, 1, 0.92, 0.75), oneLine = capw.n === 1 && K.tw(capw.lines[0], capw.size, 600) <= 1102 + X;
    if (!oneLine) capw = fitBox(K, c.headline, 86.226 * 0.85, 1102 + X, 2 * 79.33 * 0.85, 600, 2, 0.92, 0.7);
    var chw = capw.n * capw.size * 0.92, cwTop = 450.3 - chw, roomw = Math.min(250, (cwTop - 140) * 250 / 222.5);
    var figw = fitBox(K, stat, roomw, 1080 + X, 240, 300, 1, 0.92, 0.3);
    els.push(K.text(38, cwTop - 222.5 * figw.size / 250, figw.text, { size: figw.size, weight: 300, field: "stat", fit: "stat", w: 1100 + X, h: figw.size * 0.92 + 6 }));
    els.push(K.text(48, cwTop, capw.text, { size: capw.size, wrap: true, field: "headline", fit: "headline", w: 1110 + X, h: chw + 6 }));
    els.push(chrome(d, K, G));
    return els;
  }

  T.add({
    tpl: { key: "tk-fundraising", short: "Fundraising", what: "a fundraising post", name: "Fundraising", theme: "Peach & blue",
      desc: "A raise, a round or a result: a headline over a photo or the brand shapes, a founder's quote, or one big figure.", required: ["headline"],
      layouts: ["Photo and panel", "Headline", "Quote", "Stat"] },
    fields: [
      F("stat", "Figure", "£22M", { on: [3] }),
      F("headline", "Headline", "TEKEX helps Io-Co close their £2 Million Series A round", { kind: "area", on: [0, 1, 3] }),
      F("quote", "Quote", "We found our lead investor at Tekex", { kind: "area", on: [2] }),
      F("name", "Who said it", "Founder, Io-Co", { optional: true, on: [2] })
    ],
    examples: [
      { headline: "TEKEX helps Io-Co close their £2 Million Series A round" },
      { headline: "‘CI Airlines’ move into their Angel round of fundraising for £1 Million" },
      { quote: "We found our lead investor at Tekex", name: "Founder, Io-Co" },
      { stat: "£22M", headline: "Raised through Tekex in 2025" }
    ],
    slots: function (d) { var L = d.layout || 0; return L === 0 ? [{ id: "photo", label: "Photo or cut-out" }] : L === 2 ? [{ id: "photo", label: "Photo" }] : []; },
    fill: function (d, put, libImg) {
      var L = d.layout || 0;
      // A person only appears when the words name them; otherwise TEKEX's own event photography, so nobody is shown
      // as the founder of a company they have nothing to do with.
      var c = d.copy || {}, who = T.personIn((c.headline || "") + " " + (c.name || ""), L === 0) || T.personIn((c.headline || "") + " " + (c.name || ""), false);
      if (L === 0) put("photo", libImg(who || "tkl-audience-in-hall", 50, 40));
      else if (L === 2) put("photo", libImg(who || "tkl-doodad-orange-bolt-on-peach", 50, 50));
    },
    preload: [T.MARK("triangles"), SWIRL, TUBE], build: build
  });
})();
