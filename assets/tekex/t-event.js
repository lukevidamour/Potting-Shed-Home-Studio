/* Event: an event announcement on the Events pair (violet on lime).
   Source: TEKEX toolkit (rVWbcVBLtLKYvbMFFs8XZV) frames 9002:1903 event-date, 9029:1246 event-photo-dark, 9028:1162
   event-image-panel and 9028:1204 event-violet (1080 x 1080); 9028:729 event-date, 9028:899 event-image-panel,
   9028:849 event-image-topbar and 9028:678 event-text (1200 x 627); 9075:178 event-wide (1600 x 627); the Last Friday
   Club builds (xzEjCjaksdPa8C4vxWZdhW 2006:947, 2006:7664).
   Layouts: 0 title and date, 1 the same over a photo, 2 image and title panel, 3 text and intro, 4 image and title panel
   with the bars filled in the ink, 5 photo with the title in the top bar.
   The date, time and venue are one line with the slashes in SemiBold: in the top bar on every layout that has room. */
(function () {
  var T = window.HS_TEKEX;
  var F = function (key, label, ph, more) { return Object.assign({ key: key, label: label, ph: ph }, more || {}); };
  var BOOK = 300, WHITE = "#FFFFFF";

  /* Words with every "/" set in SemiBold, the rest in the given weight ("13th Feb / 17:00 / C5 Alliance Ltd"). */
  function slashRuns(str, w) {
    var out = [];
    String(str || "").split(/(\/+)/).forEach(function (p) { if (p) out.push({ t: p, weight: /^\/+$/.test(p) ? 600 : w }); });
    return out;
  }
  /* Put line breaks into runs where K.lines broke the joined string (both use single spaces between words). */
  function breakRuns(runs, lines) {
    var cuts = [], at = 0;
    lines.slice(0, -1).forEach(function (l) { at += l.length; cuts.push(at); at += 1; });
    var pos = 0;
    return runs.map(function (r) {
      var t = r.t.split(""), start = pos;
      t.forEach(function (ch, i) { if (cuts.indexOf(start + i) >= 0 && ch === " ") t[i] = "\n"; });
      pos += r.t.length;
      return { t: t.join(""), weight: r.weight };
    });
  }
  /* Lines as Figma sets them in a fixed-width box: greedy, each line filled before the next starts. The largest size, up to
     px and no lower than floor x px, at which the words take no more than max lines (a word wider than the box shrinks it). */
  function gfit(K, str, px, maxW, weight, max, floor, upper) {
    var s = squash(str); if (upper) s = s.toUpperCase();
    var words = s ? s.split(" ") : [""], lo = Math.round(px * (floor || 0.55)), size = px, ls;
    var wrap = function (sz) {
      var out = [], cur = "";
      words.forEach(function (w) { var t = cur ? cur + " " + w : w; if (cur && K.tw(t, sz, weight) > maxW) { out.push(cur); cur = w; } else cur = t; });
      out.push(cur); return out;
    };
    var wide = function (l, sz) { return Math.max.apply(null, l.map(function (x) { return K.tw(x, sz, weight); })); };
    for (; size > lo; size -= 1) { ls = wrap(size); if (ls.length <= max && wide(ls, size) <= maxW) break; }
    ls = wrap(size);
    return { size: size, lines: ls, text: ls.join("\n"), n: ls.length };
  }
  /* The largest size, px down to floor x px, at which greedy lines fit maxW wide and maxH high (at line-height lh). */
  function fitBox(K, str, px, maxW, weight, maxH, lh, floor, upper) {
    var lo = Math.round(px * (floor || 0.5)), r = null;
    for (var sz = px; sz >= lo; sz -= 1) { r = gfit(K, str, sz, maxW, weight, 99, 1, upper); if (r.n * lh * sz <= maxH + 0.5 && Math.max.apply(null, r.lines.map(function (x) { return K.tw(x, sz, weight); })) <= maxW) break; }
    r.h = r.n * lh * r.size;
    return r;
  }
  /* A title set inside a top bar: one line if it fits at a readable size, else two smaller lines, centred in the bar. */
  function barTitle(K, x, y0, barH, maxW, px, ink) {
    var c = K.c, one = gfit(K, c.headline, px, maxW, 600, 1, 0.75, true), r = one, lh = 0.92;
    if (one.n > 1 || K.tw(one.lines[0], one.size, 600) > maxW) { r = fitBox(K, c.headline, Math.min(px, (barH - 14) / 2 / 0.92), maxW, 600, barH - 12, 0.92, 0.55, true); }
    var h = r.n * lh * r.size, y = y0 + (barH - h) / 2;
    return K.text(x, y, r.text, { size: r.size, weight: 600, upper: true, wrap: true, color: ink, field: "headline", fit: "headline", w: maxW + 8, h: Math.min(h, barH - 8) + 2, z: K.Z.top });
  }
  /* How light a colour is (0 to 1), from "rgb(r,g,b)" or "#rrggbb". */
  function lum(c) {
    var m = String(c).match(/[\d.]+/g), h = String(c).match(/^#([0-9a-f]{6})$/i);
    var v = h ? [0, 2, 4].map(function (i) { return parseInt(h[1].substr(i, 2), 16); }) : (m || [0, 0, 0]).slice(0, 3).map(Number);
    return (0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]) / 255;
  }
  /* The white motif belongs to the light grounds; on a dark ground it becomes a faint tint so the type stays readable. */
  var motif = function (K) { return lum(K.light) > 0.5 ? WHITE : "rgba(255,255,255,0.09)"; };
  /* Type over a photo takes the lighter colour of the pair (the ground on Lime & violet, as event-photo-dark does). */
  var onPhoto = function (K) { return lum(K.light) >= lum(K.ink) ? K.light : K.ink; };
  var squash = function (s) { return String(s || "").replace(/\s+/g, " ").trim(); };

  /* The Events motif: four white bars about one centre, at 0, 45, 90 and 135 degrees. */
  function asterisk(K, cx, cy, bw, bl, o) {
    o = o || {};
    return [0, 45, 90, 135].map(function (a) {
      return K.box(cx - bw / 2, cy - bl / 2, bw, bl, { fill: o.color || motif(K), z: K.Z.motif, css: { transform: a ? "rotate(" + a + "deg)" : undefined } });
    });
  }

  /* The date, time and venue line in the top bar's left: Book with SemiBold slashes. */
  function topLine(K, G, x, maxW, o) {
    o = o || {};
    if (!K.has("venue")) return [];
    var s = squash(K.c.venue), size = o.size || (G.wide ? 42 : 32), f = K.fit(s, size, maxW, BOOK, 1, 0.6);
    var y = G.wide ? (o.y || 65) + (size - f.size) * 0.46 : G.top + 18 + (size - f.size) * 0.46;
    return K.text(x, y, slashRuns(s, BOOK), { size: f.size, weight: BOOK, field: "venue", fit: "venue", w: maxW + 8, h: f.size, color: o.color, z: K.Z.top });
  }

  /* The 1200 x 627 events footer: three abutting cells (logo; arrow, label and powered-by; sponsor logos), the 1080 footer
     scaled by 0.85. o.ink, o.fill (cell fill, "transparent" for outlines over a photo). */
  function foot3(K, G, o) {
    o = o || {};
    var ink = o.ink || K.ink, fill = o.fill == null ? K.light : o.fill, z = K.Z.chrome, X = G.X, y = 474, h = 102, L = 1.7, out = [], lc = o.line || ink;
    var x1 = 344.65 - L, x2 = 793 - L, right = 1150 + X;
    out.push(K.box(48, y, x1 + L - 48, h, { line: L, color: lc, fill: fill, z: z }));
    out.push(K.box(x1, y, x2 + L - x1, h, { line: L, color: lc, fill: fill, z: z }));
    out.push(K.box(x2, y, right - x2, h, { line: L, color: lc, fill: fill, z: z }));
    out.push(K.mark("wordmark", 68.4, 496.95, 257.86, 53.06, { color: ink, z: z, label: "TEKEX" }));
    out.push(K.mark("arrow-down", 368 - 2.12, 496.88 - 2.51, 54.387, 54.387, { color: ink, z: z }));
    var lab = String(K.c.label || "EVENT").toUpperCase(), lf = K.fit(lab, 39.1, 188, 600, 1, 0.55);
    out.push(K.text(430.9, 494.4 + (39.1 - lf.size) * 0.92, lab, { size: lf.size, weight: 600, ls: -0.02, color: ink, z: z, field: "label" }));
    out.push(K.box(431, 542.6, 298, 6.8, { fill: ink, z: z }));
    out.push(K.text(628, 494, "POWERED BY", { size: 12.598, weight: 500, lh: 1, color: ink, z: z }));
    out.push(K.mark("pottingshed", 628, 507.69, 132, 27.93, { color: ink, z: z, label: "pottingshed" }));
    out.push(K.mark("plus", 738.25, 535.2, 22.1, 22.1, { color: ink, z: z }));
    return out.concat(sponsorRow(K, x2 + L, y, right - L - (x2 + L), h, { ink: ink, z: z }));
  }

  /* Sponsor logos side by side in a cell, at the heights TEKEX sets them (long wordmarks low, square marks tall). */
  function sponsorRow(K, x, y, w, h, o) {
    var logos = K.sponsors().filter(function (l) { return l.key !== "yoono"; }).slice(0, 3);
    if (!logos.length) return [];
    var pad = 26, ht = function (l) { return l.ar > 4 ? 14 : l.ar > 2 ? 27 : 36; };
    var ws = logos.map(function (l) { return ht(l) * l.ar; }), total = ws.reduce(function (a, b) { return a + b; }, 0);
    var room = w - pad * 2, gap = logos.length > 1 ? (room - total) / (logos.length - 1) : 0, s = 1;
    if (gap < 18 && logos.length > 1) { s = Math.min(1, (room - 18 * (logos.length - 1)) / total); gap = 18; }
    var cx = logos.length > 1 ? x + pad : x + (w - total * s) / 2, out = [];
    logos.forEach(function (l, i) {
      var lw = ws[i] * s, lh = ht(l) * s;
      out.push(K.mark(l.src, cx, y + (h - lh) / 2, lw, lh, { color: o.ink, z: o.z, label: l.key }));
      cx += lw + gap;
    });
    return out;
  }

  /* 1080 frames: the light caps title over the huge date, both standing on the footer. */
  function titleDate(K, G, ink) {
    var c = K.c, fy = G.fy, out = [], dateTop = 696 + fy;
    var dt = K.fit(squash(c.date), 214, 930, 600, 1, 0.5);
    if (!K.has("date")) dateTop = 893 + fy;
    else out.push(K.text(80, dateTop + (214 - dt.size) * 0.92, dt.text, { size: dt.size, weight: 600, color: ink, field: "date", fit: "date", w: 940, h: dt.size * 0.92 + 4 }));
    var room = Math.min(dateTop - 12 - (G.top + 64 + 30), 4 * 0.92 * 128 + 1);
    var ti = fitBox(K, c.headline, 128, 869, BOOK, room, 0.92, 0.4, true), ty = dateTop - 12 - ti.h;
    out.push(K.text(90, ty, ti.text, { size: ti.size, weight: BOOK, upper: true, wrap: true, color: ink, field: "headline", fit: "headline", w: 900, h: Math.min(ti.h, room) + 4 }));
    return out;
  }

  /* 1080 frames: the title panel above the footer (event-image-panel). Grows upward with the title. */
  function titlePanel(K, G, x) {
    var c = K.c, fy = G.fy, ti = fitBox(K, c.headline, 96, 869, 600, 4 * 0.92 * 96 + 1, 0.92, 0.45, true), lh = ti.size * 0.92;
    var bot = 894 + fy, top = bot - 34 - lh * ti.n - 29.4;
    if (ti.n < 2) top = bot - 240;
    return [K.box(49, top, 983, bot - top, { line: 2, fill: K.light, z: K.Z.panel }),
      K.text(x, top + 34 + (ti.n < 2 ? (240 - 63.4 - lh) / 2 : 0), ti.text, { size: ti.size, weight: 600, upper: true, wrap: true, field: "headline", fit: "headline", w: 940, h: lh * ti.n + 4 })];
  }

  /* 1080 frames: the motif sized and centred for the frame's height (it takes the extra room of a tall frame). */
  function bigAsterisk(K, G) {
    var grow = G.fy - G.ty, sc = 1 + grow / 1080 * 0.55;
    return asterisk(K, 448, 503 + G.ty + grow * 0.5, 170.41 * sc, 884 * sc);
  }

  function build(d, K, G) {
    var L = d.layout || 0, c = K.c, X = G.X, els = [], lab = String(c.label || "EVENT");
    var photoLayout = L === 1 || L === 2 || L === 4 || L === 5;
    if (!G.wide) {
      var urlW = 826 - 72 - 28;
      if (photoLayout) els.push(K.slot("photo", "Event picture", 0, 0, G.w, G.h, { cover: true }));
      if (L === 0 || L === 1) {
        if (L === 0) els.push(bigAsterisk(K, G));
        else els.push(K.box(0, 0, G.w, G.h, { z: K.Z.wash, css: { background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.35) 100%)" } }));
        var ink = L === 1 ? onPhoto(K) : K.ink;
        els.push(titleDate(K, G, ink));
        els.push(topLine(K, G, 72, urlW, { color: ink }));
        els.push(K.chrome({ label: lab, labelField: "label", ink: ink, cellFill: L === 1 ? "transparent" : null }));
        return els;
      }
      if (L === 2 || L === 4) {
        var violet = L === 4;
        els.push(titlePanel(K, G, violet ? 83 : 80));
        if (violet) {
          // event-violet: bars filled in the ink, everything on them in the ground colour; the top-bar arrow is dropped
          els.push(K.chrome({ label: lab, labelField: "label", url: "none", topFill: K.ink, cellFill: K.ink, light: K.ink, ink: K.light }));
          els.push(K.box(49, G.top, 983, 64, { line: 2, color: K.ink, z: K.Z.chrome }));
          els.push(K.box(48, G.foot, 349, 120, { line: 2, color: K.ink, z: K.Z.chrome }));
          els.push(K.box(410, G.foot, 622, 120, { line: 2, color: K.ink, z: K.Z.chrome }));
          els.push(K.text(858, G.top + 18, [{ t: "TEKEX", weight: 600 }, { t: ".CO", weight: 500 }], { size: 32, color: K.light, z: K.Z.top }));
          els.push(topLine(K, G, 72, urlW, { color: K.light }));
        } else {
          els.push(K.chrome({ label: lab, labelField: "label", topFill: K.light }));
          els.push(topLine(K, G, 72, urlW));
        }
        return els;
      }
      if (L === 5) {
        // the title in the filled top bar, 32px capitals as TEKEX sets top-bar labels at 1080
        els.push(K.chrome({ label: lab, labelField: "label", topFill: K.light }));
        els.push(barTitle(K, 72, G.top + 1, 64, urlW, 32));
        return els;
      }
      // L === 3: text and intro
      els.push(bigAsterisk(K, G));
      var fy = G.fy, bot = 872 + fy, by = bot;
      if (K.has("body")) {
        var bmax = 4 * 1.05 * 46 + 1, bo = fitBox(K, c.body, 46, 900, BOOK, bmax, 1.05, 0.7), bh = bo.h;
        by = bot - Math.min(bh, bmax);
        els.push(K.text(82, by, bo.text, { size: bo.size, weight: BOOK, lh: 1.05, wrap: true, field: "body", fit: "body", w: 930, h: Math.min(bh, bmax) + 4 }));
        by -= 34;
      }
      var hroom = Math.min(by - (G.top + 64 + 40), 4 * 0.92 * 128 + 1), hl = fitBox(K, c.headline, 128, 900, 600, hroom, 0.92, 0.4, true), hh = Math.min(hl.h, hroom);
      els.push(K.text(76, by - hh, hl.text, { size: hl.size, weight: 600, upper: true, wrap: true, field: "headline", fit: "headline", w: 930, h: hh + 4 }));
      els.push(topLine(K, G, 72, urlW));
      els.push(K.chrome({ label: lab, labelField: "label" }));
      return els;
    }

    // ---- 1200 x 627 (and 1920 x 1080, X narrower)
    var tbW = 939 + X - 72 - 28;
    if (L === 0 || L === 1) {
      var ink2 = L === 1 ? onPhoto(K) : K.ink;
      if (L === 0) els.push(K.mark("wordmark", -477.8, 84, 2118.99, 436.01, { color: motif(K), z: K.Z.motif, stretch: true }));
      else {
        els.push(K.slot("photo", "Event picture", 0, 0, G.w, G.h, { cover: true }));
        els.push(K.box(0, 0, G.w, G.h, { z: K.Z.wash, css: { background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.35) 100%)" } }));
      }
      // the date is the hero; the event and title run under it as one line
      var dt = K.fit(squash(c.date), 255.498, 1110 + X - 80 + 20, 600, 1, 0.5);
      var sub = K.has("eyebrow") ? [{ t: squash(c.eyebrow), weight: 600 }, { t: " // ", weight: 500 }, { t: squash(c.headline).toUpperCase(), weight: 600 }] : [{ t: squash(c.headline).toUpperCase(), weight: 600 }];
      var subS = sub.map(function (r) { return r.t; }).join(""), sw = 1150 + X - 85 - 20, sf = K.fit(subS, 45.854, sw, 600, 1, 0.75);
      if (K.tw(subS, sf.size, 600) > sw) sf = K.fit(subS, 45.854 * 0.8, sw, 600, 2, 0.7);
      var subH = sf.size * 0.92 * sf.n, subY = 425 - subH;
      var dTop = K.has("date") ? Math.min(153 + (255.498 - dt.size) * 0.6, subY - 230 + (255.498 - dt.size) * 0.92) : 0;
      if (K.has("date")) els.push(K.text(80, dTop, dt.text, { size: dt.size, weight: 600, color: ink2, field: "date", fit: "date", w: 1110 + X, h: dt.size * 0.92 + 4 }));
      els.push(K.text(85, subY, breakRuns(sub, sf.lines), { size: sf.size, weight: 600, wrap: true, color: ink2, field: "headline", fit: "headline", w: sw + 10, h: subH + 4 }));
      els.push(topLine(K, G, 72, tbW, { color: ink2 }));
      els.push(K.chrome({ foot: "none", ink: ink2 }));
      els.push(foot3(K, G, { ink: ink2, fill: L === 1 ? "transparent" : null }));
      return els;
    }
    if (L === 2 || L === 4) {
      var v = L === 4, barInk = v ? K.light : K.ink, barFill = v ? K.ink : K.light;
      // the picture takes the right of the frame, square at 1200 x 627; the words keep their place on the left
      els.push(K.slot("photo", "Event picture", 576, 0, G.w - 576, 627, { cover: true }));
      els.push(K.box(48, 44, 492, 81, { line: 2, color: K.ink, fill: barFill, z: K.Z.chrome }));
      if (!v) els.push(K.mark("arrow-small", 77 - 1.11, 75.39 - 0.94, 24.02, 24.02, { rot: -90, color: barInk, z: K.Z.top }));
      els.push(K.text(v ? 77 : 109.83, 71, [{ t: "TEKEX", weight: 600 }, { t: ".CO", weight: 500 }], { size: 32, color: barInk, z: K.Z.top }));
      var vf = null, vH = 0;
      if (K.has("venue")) { vf = fitBox(K, c.venue, 36, 576 - 72 - 18, BOOK, 36 * 1.05 * 2, 1, 0.75); vf.lh = vf.n > 1 ? 1.05 : 0.92; vH = vf.size * vf.lh * vf.n; }
      var gap = vf ? 22 : 0, tmax = Math.min(3 * 0.92 * 80.168 + 1, 452 - 150 - gap - vH);
      var t2 = fitBox(K, c.headline, 80.168, 576 - 71, 600, tmax, 0.92, 0.45, true), t2h = Math.min(t2.h, tmax);
      var t2y = 167 + Math.max(0, (3 * 0.92 * 80.168 - t2h) / 2);
      t2y = Math.max(150, Math.min(t2y, 452 - (t2h + gap + vH)));
      els.push(K.text(71, t2y, t2.text, { size: t2.size, weight: 600, upper: true, wrap: true, field: "headline", fit: "headline", w: 576 - 71 - 10, h: t2h + 4 }));
      if (vf) els.push(K.text(72, t2y + t2h + gap, breakRuns(slashRuns(squash(c.venue), BOOK), vf.lines), { size: vf.size, weight: BOOK, lh: vf.lh, wrap: true, field: "venue", fit: "venue", w: 576 - 72 - 10, h: vH + 2 }));
      els.push(foot3(K, G, { ink: barInk, fill: barFill, line: K.ink }));
      return els;
    }
    if (L === 5) {
      els.push(K.slot("photo", "Event picture", 0, 0, G.w, G.h, { cover: true }));
      els.push(K.chrome({ foot: "none", topFill: K.light }));
      els.push(barTitle(K, 69, 44, 81, tbW, 42));
      els.push(foot3(K, G, {}));
      return els;
    }
    // L === 3: text and intro (event-text). The asterisk stays with the words, as event-wide keeps the text block fixed.
    els.push(asterisk(K, 419, 324, 134.169, 696));
    var tw3 = Math.min(869, 1150 + X - 71 - 20), body = squash(c.body), bw = Math.min(990, 1150 + X - 72 - 20);
    var b3 = null, iy = 360, ilh = 0.92, tgap = 16.4, hy, h3, h3max;
    if (body) {
      b3 = fitBox(K, body, 42, bw, BOOK, 2 * 0.92 * 42 + 1, 0.92, 0.95);
      if (b3.h > 2 * 0.92 * 42 + 1 || b3.n > 2) {
        // the Oche Club post: up to three lines of 40px at 1.05, the title and intro moved up
        ilh = 1.05; b3 = fitBox(K, body, 40, bw, BOOK, 3 * 1.05 * 40 + 1, 1.05, 0.7); iy = Math.min(330, 466 - Math.min(b3.h, 3 * 1.05 * 40 + 1)); tgap = 3.4;
      }
      h3max = Math.min(2 * 0.92 * 96 + 1, iy - tgap - 140);
      h3 = fitBox(K, c.headline, 96, tw3, 600, h3max, 0.92, 0.45, true);
      hy = iy - tgap - Math.min(h3.h, h3max);
      els.push(K.text(72, iy, b3.text, { size: b3.size, weight: BOOK, lh: ilh, wrap: true, field: "body", fit: "body", w: bw + 10, h: Math.min(b3.h, 470 - iy) + 2 }));
    } else {
      h3max = 3 * 0.92 * 96 + 1; h3 = fitBox(K, c.headline, 96, tw3, 600, h3max, 0.92, 0.45, true); hy = 299.5 - Math.min(h3.h, h3max) / 2;
    }
    els.push(K.text(71, hy, h3.text, { size: h3.size, weight: 600, upper: true, wrap: true, field: "headline", fit: "headline", w: tw3 + 20, h: Math.min(h3.h, h3max) + 4 }));
    els.push(topLine(K, G, 72, tbW));
    els.push(K.chrome({ foot: "none" }));
    els.push(foot3(K, G, {}));
    return els;
  }

  var EX = { eyebrow: "TEKEX #31", headline: "Founders, Film & New Frontiers", date: "22/04/25", venue: "22nd Apr / 17:00 / C5 Alliance Ltd", label: "EVENT#31",
    body: "Get ready for TEKEX 31, where tech enthusiasts gather to explore the latest trends and innovations in the industry!" };

  T.add({
    tpl: { partners: true, key: "tk-event", short: "Event", what: "an event announcement", name: "Event", theme: "Lime & violet",
      desc: "Announce an event: its title, the date, time and venue, over the events colours or a picture.", required: ["headline"],
      layouts: ["Title and date", "Over a photo", "Image and title panel", "Text and intro", "Image panel, filled bars", "Title bar over a photo"] },
    fields: [
      F("eyebrow", "Event", "TEKEX #31", { optional: true }),
      F("headline", "Title", "Founders, Film & New Frontiers"),
      F("date", "Date", "22/04/25", { optional: true }),
      F("venue", "Date, time and venue", "22nd Apr / 17:00 / C5 Alliance Ltd", { optional: true }),
      F("body", "Intro", "A sentence or two about the event.", { kind: "area", optional: true }),
      F("label", "Footer label", "EVENT#31", { optional: true })
    ],
    examples: [EX, EX, EX, EX, EX, EX],
    slots: function (d) { var L = d.layout || 0; return L === 0 || L === 3 ? [] : [{ id: "photo", label: "Event picture" }]; },
    fill: function (d, put, libImg) {
      var L = d.layout || 0;
      if (L === 1) put("photo", libImg("tk-event-photo-bw", 50, 50));
      else if (L === 2) put("photo", libImg("tk-reel-138-sq", 50, 40));
      else if (L === 4) put("photo", libImg("tk-reel-26-sq", 50, 45));
      else if (L === 5) put("photo", libImg("tk-reel-19", 50, 55));
    },
    preload: [], build: build
  });
})();
