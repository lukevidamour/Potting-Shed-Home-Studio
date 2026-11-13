/* Made by tools/build-tekex.mjs from the files in assets/tekex (don't edit this file: edit them, then run it). */
/* ---- pack.js ---- */
try {
/* TEKEX social media templates, rebuilt from the TEKEX toolkit and published posts in Figma.

   Every TEKEX post sits in one frame: a keylined top bar, the content, and a footer of keylined cells. One ink colour
   draws every mark on a light ground that belongs to the post's category.

   Layouts are drawn in a design space and scaled to the export size:
     square and tall formats are 1080 wide (1080 x 1080, 1080 x 1350, 1080 x 1920);
     wide formats are 627 high (1200 x 627, and 1920 x 1080, which is 1114.7 x 627 in design space).
   Each template part draws its layout from the Figma measurements for the square and the 1200 x 627 frames, and says
   how the tall frames grow. Tall frames follow TEKEX's own conventions: at 4:5 the bars stay at the edges, at 9:16 they
   are pulled in to 171 from the top and 234 from the bottom so a phone's own controls never cover them.

   Parts (assets/tekex/t-*.js) register with HS_TEKEX.add(). The artwork is drawn by one generic element list
   (assets/tekex/templates.html), so a part never touches the markup. */
(function () {
  var T = window.HS_TEKEX = { id: "tekex", templates: [], fields: {}, builders: {}, examples: {}, slotDefs: {}, fills: {}, preload: [], ideas: null, order: [] };
  T.parts = ["speaker", "lineup", "event", "countdown", "news", "fundraising", "sponsor", "statement", "series", "campaign"];
  var MARK = function (n) { return "assets/tekex/marks/" + n + ".svg"; };
  T.MARK = MARK;
  ["rings", "arrow-down", "arrow-small", "pottingshed", "wordmark", "plus"].forEach(function (n) { T.preload.push(MARK(n)); });
  var FONT = "'TK Neue','PP Neue Montreal','Helvetica Neue',Helvetica,Arial,sans-serif";
  T.FONT = FONT;

  /* Sponsor logos for footers, with their measured proportions (width / height). */
  var LOGO = {
    yoono: { src: "assets/logos/yoono.svg", ar: 120 / 23 }, rathbones: { src: "assets/logos/rathbones.svg", ar: 181 / 20 },
    c5: { src: "assets/logos/c5.svg", ar: 57 / 50 }, bdo: { src: "assets/logos/bdo.svg", ar: 97.7 / 37.5 },
    wildpeak: { src: "assets/logos/wildpeak.svg", ar: 76 / 50 }, red5: { src: "assets/logos/red5.svg", ar: 108.1 / 37.4 },
    digitaljersey: { src: "assets/logos/digitaljersey.svg", ar: 137 / 52 }, pwc: { src: "assets/logos/pwc.svg", ar: 58.7826 / 45.1223 },
    ps: { src: "assets/ps-logo.svg", ar: 165 / 34.92 }
  };
  T.LOGO = LOGO;

  /* ---------- the design space ---------- */
  function geo(S) {
    if (S.w / S.h > 1.2) {
      var kw = S.h / 627, w = S.w / kw;
      return { fam: "wide", k: kw, w: w, h: 627, X: w - 1200, ty: 0, fy: 0, top: 44, foot: 474, story: false, portrait: false, square: false, wide: true };
    }
    var k = S.w / 1080, h = S.h / k, story = h / 1080 > 1.6, portrait = !story && h > 1080;
    var top = story ? 171 : 43, foot = story ? 1566 : portrait ? 1189 : 909;
    return { fam: h > 1080 ? "tall" : "sq", k: k, w: 1080, h: h, X: 0, top: top, foot: foot, ty: top - 43, fy: foot - 909, story: story, portrait: portrait, square: !story && !portrait, wide: false };
  }
  T.geo = geo;

  var Z = { bg: 1, motif: 2, photo: 3, wash: 4, chrome: 5, panel: 6, text: 7, top: 8 };
  T.Z = Z;

  function rgb(c) { var m = String(c).match(/[\d.]+/g) || [0, 0, 0]; return [+m[0], +m[1], +m[2]]; }
  function rgba(c, a) { var v = rgb(c); return "rgba(" + v[0] + "," + v[1] + "," + v[2] + "," + a + ")"; }

  /* ---------- the kit a template part draws with ---------- */
  function kit(d, ctx, G) {
    var th = ctx.th || { ground: "rgb(129,255,231)", accent: "rgb(248,36,255)" };
    var K = { G: G, Z: Z, ink: th.accent, light: th.ground, rgba: rgba, d: d, c: d.copy || {}, MARK: MARK, LOGO: LOGO, FONT: FONT };
    var has = function (k) { return !!String(K.c[k] || "").trim(); };
    K.has = has;

    K.box = function (x, y, w, h, o) {
      o = o || {};
      return { k: "box", z: o.z == null ? Z.chrome : o.z, style: Object.assign({ position: "absolute", left: x, top: y, width: w, height: h, boxSizing: "border-box",
        border: o.line ? o.line + "px solid " + (o.color || K.ink) : "none", background: o.fill || "transparent", opacity: o.opacity == null ? undefined : o.opacity }, o.css || {}) };
    };
    /* A brand mark or logo drawn in a colour (the SVG is used as a mask). stretch: fill the box without keeping proportion. */
    K.mark = function (src, x, y, w, h, o) {
      o = o || {};
      var st = ctx.mask(src.indexOf("/") < 0 ? MARK(src) : src, w, h);
      if (o.stretch) { st.WebkitMaskSize = "100% 100%"; st.maskSize = "100% 100%"; }
      if (o.align === "left") { st.WebkitMaskPosition = "left center"; st.maskPosition = "left center"; }
      return { k: "mask", z: o.z == null ? Z.chrome : o.z, label: o.label || "", style: Object.assign({}, st, { position: "absolute", left: x, top: y, color: o.color || K.ink, background: "currentColor",
        transform: o.rot ? "rotate(" + o.rot + "deg)" : undefined, opacity: o.opacity == null ? undefined : o.opacity, mixBlendMode: o.blend || undefined }) };
    };
    /* A fixed brand picture (shapes, motifs). */
    K.pic = function (src, x, y, w, h, o) {
      o = o || {};
      return { k: "pic", z: o.z == null ? Z.motif : o.z, src: src, style: Object.assign({ position: "absolute", left: x, top: y, width: w, height: h, display: "block", objectFit: o.fit || "fill", maxWidth: "none",
        mixBlendMode: o.blend || undefined, opacity: o.opacity == null ? undefined : o.opacity, transform: o.transform || undefined }, o.css || {}) };
    };
    /* A picture the person chooses. cover fills the box; a cut-out stands on the box's bottom edge. */
    K.slot = function (id, label, x, y, w, h, o) {
      o = o || {};
      var im = ctx.img(id) || { has: false }, rec = d.images && d.images[id];
      // o.cover: a photo area always fills its box, even with a cut-out in it (the ground shows through the cut-out)
      if (o.cover && im.has && rec && rec.cut) {
        var fx = rec.x == null ? 50 : rec.x, fyy = rec.y == null ? 30 : rec.y;
        im = Object.assign({}, im, { style: { position: "absolute", left: 0, top: 0, width: "100%", height: "100%", display: "block", objectFit: "cover", objectPosition: fx + "% " + fyy + "%",
          transform: "scale(" + (rec.zoom || 1) + ")", transformOrigin: fx + "% " + fyy + "%" } });
      }
      return { k: "slot", z: o.z == null ? Z.photo : o.z, slot: id, label: label, img: im, style: Object.assign({ position: "absolute", left: x, top: y, width: w, height: h, overflow: o.clip === false ? "visible" : "hidden",
        mixBlendMode: o.blend || undefined, opacity: o.opacity == null ? undefined : o.opacity }, o.css || {}) };
    };
    /* Text. runs: a string, or [{ t, weight }] for mixed weights on one line. o.field makes it editable on the artwork;
       o.fit (with a fixed w and h) makes copy that runs out of its box show as a warning. */
    K.text = function (x, y, runs, o) {
      o = o || {};
      if (typeof runs === "string") runs = [{ t: runs }];
      var size = o.size || 32;
      return { k: "text", z: o.z == null ? Z.text : o.z, field: o.field || "", fit: o.fit || "",
        style: Object.assign({ position: "absolute", left: x, top: y, width: o.w, height: o.h, margin: 0, padding: 0, display: "block", fontFamily: FONT, fontSize: size, fontWeight: o.weight || 600,
          lineHeight: String(o.lh || 0.92), letterSpacing: ((o.ls == null ? -0.02 : o.ls) * size).toFixed(3) + "px", color: o.color || K.ink, whiteSpace: o.wrap ? "pre-line" : "pre",
          textTransform: o.upper ? "uppercase" : "none", textAlign: o.align || "left", textWrap: o.balance ? "balance" : undefined, overflow: "visible", opacity: o.opacity == null ? undefined : o.opacity }, o.css || {}),
        runs: runs.map(function (r) { return { t: r.t, style: r.weight ? { fontWeight: r.weight } : (r.style || {}) }; }) };
    };

    /* ---------- measuring words ---------- */
    K.tw = function (str, px, weight, ls) { return ctx.tw ? ctx.tw(String(str || ""), px, weight || 600, ls == null ? -0.02 : ls, "TK Neue") : String(str || "").length * px * 0.55; };
    /* Lines for a run of words: one line if it fits, else split where the lines come out most even, up to max lines. */
    K.lines = function (str, px, maxW, weight, max, upper) {
      var s = String(str || "").trim(); if (upper) s = s.toUpperCase();
      if (!s) return [""];
      var forced = s.split(/\n+/); if (forced.length > 1) return forced;
      var words = s.split(/\s+/), n = Math.min(max || 2, words.length), w = function (x) { return K.tw(x, px, weight); };
      if (n <= 1 || w(s) <= maxW) return [s];
      var best = null;
      var tryLines = function (cnt) {
        // every split of the words into cnt lines, scored by the widest line
        var out = null;
        var rec = function (start, left, acc) {
          if (left === 1) { var line = words.slice(start).join(" "); var ls = acc.concat([line]); var m = Math.max.apply(null, ls.map(w)); if (!out || m < out.m) out = { m: m, ls: ls }; return; }
          for (var i = start + 1; i <= words.length - left + 1; i++) rec(i, left - 1, acc.concat([words.slice(start, i).join(" ")]));
        };
        rec(0, cnt, []);
        return out;
      };
      for (var c = 2; c <= n; c++) { var t = tryLines(c); if (t && (!best || t.m < best.m)) best = t; if (best && best.m <= maxW) break; }
      return best ? best.ls : [s];
    };
    /* The largest size, up to px, at which str sets in no more than max lines of maxW. Never below floor x px. */
    K.fit = function (str, px, maxW, weight, max, floor, upper) {
      var size = px, ls = K.lines(str, size, maxW, weight, max, upper);
      var widest = function (l, sz) { return Math.max.apply(null, l.map(function (x) { return K.tw(x, sz, weight); })); };
      var wd = widest(ls, size);
      if (wd > maxW) { size = Math.max(Math.round(px * (floor || 0.55)), Math.floor(px * maxW / wd)); ls = K.lines(str, size, maxW, weight, max, upper); }
      return { size: size, lines: ls, text: ls.join("\n"), n: ls.length };
    };

    /* ---------- the shared frame ---------- */
    /* o: label (footer category word), foot: "cells" | "sponsors" | "partners" | "label" | "none", topLeft (text in the
       top bar's left), url: "right" | "left" | "none", topFill, cellFill, topBar: false, shortTop: [x, w] (a top bar that
       starts at x), footFill, ink/light overrides, logoCell: false. */
    K.chrome = function (o) {
      o = o || {};
      var ink = o.ink || K.ink, light = o.light || K.light, out = [], wide = G.wide, X = G.X, top = G.top, foot = G.foot, zt = o.z == null ? Z.chrome : o.z;
      var cellFill = o.cellFill == null ? light : o.cellFill, topFill = o.topFill || "transparent";
      // top bar
      if (o.topBar !== false) {
        if (!wide) {
          var tx = o.shortTop ? o.shortTop[0] : 49, tw = o.shortTop ? o.shortTop[1] : 983;
          out.push(K.box(tx, top, tw, 64, { line: 2, color: ink, fill: topFill, z: zt }));
          var urlLeft = o.url === "left";
          if (o.url !== "none") {
            var ax = urlLeft ? 72 : 826, txx = urlLeft ? 104 : 858;
            out.push(K.mark("arrow-small", ax - 1.11, top + 24.39 - 0.94, 24.02, 24.02, { rot: -90, color: ink, z: Z.top }));
            out.push(K.text(txx, top + 18, [{ t: "TEKEX", weight: 600 }, { t: ".CO", weight: 500 }], { size: 32, color: ink, z: Z.top }));
          }
          if (o.topLeft) out.push(K.text(o.topLeftX || 72, top + 18, o.topLeft, { size: 32, weight: 600, upper: o.topLeftUpper !== false, color: ink, z: Z.top, field: o.topLeftField || "" }));
          if (o.poweredTop) { out.push(K.text(728, top + 24, "POWERED BY", { size: 15.747, weight: 500, lh: 1, color: ink, z: Z.top })); out.push(K.mark("pottingshed", 847, top + 18, 165, 34.917, { color: ink, z: Z.top })); }
        } else {
          var sx = o.shortTop ? o.shortTop[0] : 48, sw = o.shortTop ? o.shortTop[1] + X : 1102 + X, sh = o.shortTop ? 87.23 : 81;
          out.push(K.box(sx, o.shortTop ? 43.88 : 44, sw, sh, { line: o.shortTop ? 2.154 : 2, color: ink, fill: topFill, z: zt }));
          if (o.url !== "none") {
            var dy = o.shortTop ? 3 : 0;
            out.push(K.mark("arrow-small", 939 + X - 1.11, 78.39 + dy - 0.94, 24.02, 24.02, { rot: -90, color: ink, z: Z.top }));
            out.push(K.text(971.83 + X, 74 + dy, [{ t: "TEKEX", weight: 600 }, { t: ".CO", weight: 500 }], { size: 32, color: ink, z: Z.top }));
          }
          if (o.topLeft) out.push(K.text(o.topLeftX || 72, 68, o.topLeft, { size: 32, weight: 600, upper: o.topLeftUpper !== false, color: ink, z: Z.top, field: o.topLeftField || "" }));
        }
      }
      // footer
      var f = o.foot || "cells";
      if (f === "none") return out;
      if (!wide) {
        if (f === "sponsors") return out.concat(K.sponsorStrip(48, foot, 984, { ink: ink, fill: o.footFill == null ? light : o.footFill, z: zt }));
        if (o.logoCell !== false) {
          out.push(K.box(48, foot, 349, 120, { line: 2, color: ink, fill: cellFill, z: zt }));
          out.push(K.mark("wordmark", 71.5, foot + 27, 305.4, 62.84, { color: ink, z: zt, label: "TEKEX" }));
        }
        out.push(K.box(410, foot, 622, 120, { line: 2, color: ink, fill: cellFill, z: zt }));
        if (f === "partners") return out.concat(K.partnerCell(410, foot, 622, 120, { ink: ink, z: zt }));
        var lab = String(o.label || "").toUpperCase(), small = lab.length > 9;
        var lsz = o.labelSize || (small ? 40 : 46);
        out.push(K.mark("arrow-down", 436.51, foot + 24.97, 64.985, 64.985, { color: ink, z: zt }));
        out.push(K.text(515, foot + 24 + (small ? 8 : 0), lab, { size: lsz, weight: 600, color: ink, z: zt, field: o.labelField || "" }));
        out.push(K.box(515, foot + 81, 448, 8, { fill: ink, z: zt }));
        out.push(K.text(798, foot + 24, "POWERED BY", { size: 15.747, weight: 500, lh: 1, color: ink, z: zt }));
        out.push(K.mark("pottingshed", 798, foot + 41.12, 165, 34.917, { color: ink, z: zt, label: "pottingshed" }));
        out.push(K.mark("plus", 976, foot + 72, 26, 26, { color: ink, z: zt }));
        return out;
      }
      // wide: the 1080 footer scaled by 0.85, the label cell stretched to the right edge
      if (f === "sponsors") return out.concat(K.sponsorStrip(48, 474, 1102 + X, { ink: ink, fill: o.footFill == null ? light : o.footFill, z: zt, scale: 0.85 }));
      out.push(K.box(48, 474, 296.65, 102, { line: 1.7, color: ink, fill: cellFill, z: zt }));
      out.push(K.mark("wordmark", 68.4, 496.95, 257.86, 53.06, { color: ink, z: zt, label: "TEKEX" }));
      out.push(K.box(352, 474, 798 + X, 102, { line: 1.7, color: ink, fill: cellFill, z: zt }));
      if (f === "partners") return out.concat(K.partnerCell(352, 474, 798 + X, 102, { ink: ink, z: zt, scale: 0.85 }));
      var labw = String(o.label || "").toUpperCase(), smallw = labw.length > 9;
      out.push(K.mark("arrow-down", 368 - 2.12, 496.88 - 2.51, 54.387, 54.387, { color: ink, z: zt }));
      out.push(K.text(434, 494.4 + (smallw ? 6.8 : 0), labw, { size: smallw ? 34 : 39.1, weight: 600, color: ink, z: zt, field: o.labelField || "" }));
      out.push(K.box(434, 542.6, 660 + X, 6.8, { fill: ink, z: zt }));
      out.push(K.text(993.1 + X, 494, "POWERED BY", { size: 12.598, weight: 500, lh: 1, color: ink, z: zt }));
      out.push(K.mark("pottingshed", 993.1 + X, 507.69, 132, 27.93, { color: ink, z: zt, label: "pottingshed" }));
      out.push(K.mark("plus", 1103.35 + X, 535.2, 22.1, 22.1, { color: ink, z: zt }));
      return out;
    };

    /* The sponsors chosen for this design, in the order the brand lists them. */
    K.sponsors = function () {
      var on = d.partnersOn || [], list = [];
      Object.keys(LOGO).forEach(function (k) { if (k !== "ps" && on.indexOf(k) >= 0) list.push(Object.assign({ key: k }, LOGO[k])); });
      return list;
    };
    /* Footer form A: one cell, SUPPORTED BY and the sponsor logos along a rule. */
    K.sponsorStrip = function (x, y, w, o) {
      o = o || {};
      var s = o.scale || 1, ink = o.ink || K.ink, out = [K.box(x, y, w, 120 * s, { line: 2 * s, color: ink, fill: o.fill, z: o.z })];
      out.push(K.text(x + 24 * s, y + 41 * s, "SUPPORTED BY", { size: 15.747 * s, weight: 500, lh: 1, color: ink, z: o.z }));
      // each logo at its measured height, centred on one line 48 below the strip's top (Figma 8005:1814, 10002:81)
      var HT = { yoono: 23, rathbones: 20, c5: 50, bdo: 37.5, wildpeak: 50, red5: 37.4, digitaljersey: 40, pwc: 40 };
      var logos = K.sponsors(), six = logos.length >= 6, x0 = x + (six ? 155 : 182) * s, x1 = x + w - (six ? 25 : 30) * s;
      var widths = logos.map(function (l) { return (HT[l.key] || 38) * s * l.ar; }), total = widths.reduce(function (a, b) { return a + b; }, 0);
      var gap = logos.length > 1 ? Math.max(14 * s, (x1 - x0 - total) / (logos.length - 1)) : 0, cx = x0;
      logos.forEach(function (l, i) { var lw = widths[i], lh = lw / l.ar; out.push(K.mark(l.src, cx, y + 48 * s - lh / 2, lw, lh, { color: ink, z: o.z, label: l.key })); cx += lw + gap; });
      out.push(K.box(x + 24 * s, y + 91 * s, w - 90 * s, 8 * s, { fill: ink, z: o.z }));
      out.push(K.mark("plus", x + w - 51 * s, y + 82 * s, 26 * s, 26 * s, { color: ink, z: o.z }));
      return out;
    };
    /* Footer right cell, "partner logos" form: POWERED BY pottingshed and the partners, along a rule. */
    K.partnerCell = function (x, y, w, h, o) {
      o = o || {};
      var s = o.scale || 1, ink = o.ink || K.ink, out = [];
      out.push(K.text(x + 34 * s, y + 23 * s, "POWERED BY", { size: 15.747 * s, weight: 500, lh: 1, color: ink, z: o.z }));
      out.push(K.mark("pottingshed", x + 34 * s, y + 40.1 * s, 165 * s, 34.917 * s, { color: ink, z: o.z }));
      var logos = K.sponsors().filter(function (l) { return l.key !== "yoono"; }).slice(0, 3), cx = x + 225 * s;
      logos.forEach(function (l) { var lh = l.ar > 4 ? 17 * s : 34 * s, lw = lh * l.ar; out.push(K.mark(l.src, cx, y + (l.ar > 4 ? 42 : 30) * s, lw, lh, { color: ink, z: o.z, label: l.key })); cx += lw + 26 * s; });
      out.push(K.box(x + 30 * s, y + 91 * s, w - 90 * s, 8 * s, { fill: ink, z: o.z }));
      out.push(K.mark("plus", x + w - 56 * s, y + 82 * s, 26 * s, 26 * s, { color: ink, z: o.z }));
      return out;
    };
    return K;
  }
  T.kit = kit;

  /* ---------- registry ---------- */
  T.add = function (def) {
    var t = Object.assign({ set: "core", pack: "tekex" }, def.tpl);
    if (!T.builders[t.key]) { T.templates.push(t); T.order.push(t.key); }
    T.fields[t.key] = def.fields || [];
    T.builders[t.key] = def.build;
    if (def.examples) T.examples[t.key] = def.examples;
    if (def.slots) T.slotDefs[t.key] = def.slots;
    if (def.fill) T.fills[t.key] = def.fill;
    (def.preload || []).forEach(function (p) { if (T.preload.indexOf(p) < 0) T.preload.push(p); });
  };
  /* The library picture of a named person: their cut-out (cut: true) or their photo (cut: false), or null. Names match on
     the library entry's name or person, ignoring titles such as Dr. Never someone else's face. */
  T.personPic = function (name, cut) {
    // "Matt Tabb, CMO BDO/C5" and "Simon Franc - CEO, Anatomap" are Matt Tabb and Simon Franc
    var lib = (typeof LIB !== "undefined" && LIB) || {}, n = String(name || "").split(/,|\s[-–—]\s/)[0].toLowerCase().replace(/^(dr|prof|professor|sir|dame|mr|mrs|ms)\.?\s+/, "").trim();
    if (!n) return null;
    var ids = Object.keys(lib).filter(function (k) { var im = lib[k]; if (!im || !im.src) return false; var nm = String(im.person || im.name || "").toLowerCase().replace(/^(dr|prof)\.?\s+/, ""); return nm.indexOf(n) === 0; });
    var pick = ids.filter(function (k) { return !!lib[k].cut === !!cut; })[0];
    return pick || null;
  };
  /* A person in the library named anywhere in some words ("Hear from Louis Pike"): their cut-out or photo, or null. */
  T.personIn = function (text, cut) {
    var lib = (typeof LIB !== "undefined" && LIB) || {}, t = String(text || "").toLowerCase(), best = null, len = 0;
    Object.keys(lib).forEach(function (k) {
      var im = lib[k], nm = im && im.person && String(im.person).toLowerCase();
      if (nm && nm.length > len && t.indexOf(nm) >= 0 && !!im.cut === !!cut) { best = k; len = nm.length; }
    });
    return best;
  };
  /* The assistant reads a brief into the first six templates' terms (speaker, event, listing, trio, partners, lockup).
     For TEKEX those become the toolkit's templates, with the copy in the toolkit's form: one kicker line for a speaker,
     one slash-separated line for when and where. A line-up becomes a carousel. A target template that is not built yet
     leaves the brief as it was. */
  /* Carousels from a brief, built from the toolkit's own carousels. A brief that asks for a carousel (or slides) gets one:
     a line-up when it names people, otherwise the event, partnership, year-in-numbers or "This is TEKEX" set it is about.
     Copy comes from the brief where it says something, and from the toolkit's published posts where it doesn't. A real
     person only appears when the brief names them; slides whose words still need writing are marked to rewrite. */
  var ROLEWORD = /^(ceo|cmo|cto|coo|cfo|md|founder|co-?founder|chair|chairman|chairwoman|director|head|partner|vice|president|former|managing|lead|principal|senior|chief|manager|investor|advisor|adviser|the|our|at|of|in)\b/i;
  var nameAt = function (s) { var m = String(s || "").trim().match(/^((?:Dr|Prof|Sir|Dame)\.?\s+)?([A-Z][a-z'’-]+(?:\s+(?:[A-Z][a-z'’-]+|de|van|von|le|la)){1,2})\b/); return m && !ROLEWORD.test(m[2]) ? (m[1] || "") + m[2] : ""; };
  // People named in a brief: "with A and B", or "A, role; B, role" lists. Never a role read as a name.
  T.peopleIn = function (text) {
    var t = String(text || ""), m = t.match(/\b(?:with|featuring|ft\.)\s+(.+)$/i) || t.match(/\b(?:speakers?|line-?up|panel(?:lists)?)\s*:\s+(.+)$/i) || (/;/.test(t) && t.match(/:\s+(.+)$/)), part = m ? m[1] : (/;/.test(t) ? t : "");
    if (!part) return [];
    var items = /;/.test(part) ? part.split(/\s*;\s*/) : part.split(/\s*(?:,|&|\band\b)\s*/);
    var out = [];
    items.forEach(function (it) {
      var nm = nameAt(it.replace(/^(?:and|&)\s+/i, "")); if (!nm || out.some(function (p) { return p.name === nm; })) return;
      var rest = /;/.test(part) ? it.slice(it.indexOf(nm) + nm.length).replace(/^[\s,–—-]+/, "").replace(/\s+(?:at|on)\s+the\b.*$/i, "").trim() : "";
      out.push({ name: nm, role: rest });
    });
    return out;
  };
  var CAROUSEL = /\b(carousel|slides|slideshow|swipe(?:able)?)\b/i;
  var PARTNERS = [["BDO/C5", /\bbdo\s*\/?\s*c5\b/i], ["Rathbones", /\brathbones\b/i], ["BDO", /\bbdo\b/i], ["C5 Alliance", /\bc5\b/i], ["Red5 Systems", /\bred\s?5\b/i], ["Yoono", /\byoono\b/i], ["Wild Peak", /\bwild\s?peak\b/i], ["Digital Jersey", /\bdigital jersey\b/i], ["PwC", /\bpwc\b/i], ["All—in", /\ball[\s—-]*in\b/i]];
  function carouselFor(r, text, when) {
    var c = r.copy || {}, n0 = c.eventNumber, ex = function (k, L) { return T.exampleFor(k, L) || {}; };
    var slide = function (tpl, L, title, copy, ph) { var o = Object.assign({}, ex(tpl, L), copy || {}); if (!(copy && copy.name)) { if (!(tpl === "tk-sponsor" && L === 1)) o.name = ""; o.person = ""; if (tpl === "tk-lineup") o.role = ""; } return { tpl: tpl, layout: L, title: title, copy: o, ph: ph || [] }; };
    var number = function (set) { set.forEach(function (sl, i) { sl.title = (i + 1) + " " + sl.title; }); return set; };
    var done = function (set, title, said, note) { r.set = number(set); r.tpl = set[0].tpl; r.layout = set[0].layout; r.title = title; r.said = said; r.sizes = r.sizes && r.sizes.length ? r.sizes : ["square"]; if (note) r.setNote = note; return r; };
    var head = String(c.headline || "").trim(); if (CAROUSEL.test(head) || /^(make|create|do|build|give)\b/i.test(head)) head = "";
    // 1. People named: the line-up carousel (the main brief reader builds it from r.speakers)
    var people = T.peopleIn(text);
    if (people.length) {
      var known = (r.speakers || []).filter(function (sp) { return people.some(function (p) { return p.name === sp.name; }); });
      r.speakers = people.map(function (p) { var k = known.filter(function (sp) { return sp.name === p.name; })[0]; return k && !p.role ? k : { name: p.name, role: p.role, company: "" }; });
      r.tpl = "listing"; return null;
    }
    var cm = text.match(/\b(TEKEX|IOM|JSY|GSY)\s?#\s?(\d+)/i), code = n0 ? "TEKEX #" + n0 : cm ? (/tekex/i.test(cm[1]) ? "TEKEX #" + cm[2] : cm[1].toUpperCase() + "#" + cm[2]) : "";
    // 2. A year in numbers: TEKEX Wrapped. The figures are the toolkit's 2025 ones, to be confirmed.
    if (/\b(year in (?:numbers|review)|wrapped|in numbers|stats|statistics|our year|annual)\b/i.test(text)) {
      return done([
        slide("tk-campaign", 0, "Cover", { eyebrow: "TEKEX Wrapped", headline: head || "Our year in numbers", extra: "TEKEX Wrapped" }),
        slide("tk-statement", 3, "Events", { eyebrow: "EVENTS", stat: "12", headline: "Events", body: "A year of conversations, collaborations and connection.", step: "1/3" }, ["stat"]),
        slide("tk-statement", 3, "Members", { eyebrow: "COMMUNITY", stat: "1,000+", headline: "Ecosystem Members", body: "Startups, investors, creatives, corporates and policymakers, growing stronger together across three islands.", step: "2/3" }, ["stat"]),
        slide("tk-statement", 3, "Raised", { eyebrow: "FUNDRAISING", stat: "£22M", headline: "Raised through TEKEX", body: "Capital raised by founders who met their investors at TEKEX.", step: "3/3" }, ["stat"]),
        slide("tk-campaign", 3, "Supported by", { eyebrow: "Supported by", extra: "TEKEX Wrapped" })
      ], "Carousel: " + (head || "Our year in numbers"), ["five slides: cover, three figures, supporters"], " The figures are 2025's from the toolkit: change them to this year's before posting (they can't be downloaded until you have).");
    }
    // 3. A partnership: the partner's posts as TEKEX published them. A person only where the toolkit names one.
    if (/\b(partner(?:ship)?s?|sponsor(?:s|ship)?|supporting|supporters?|collaborators?)\b/i.test(text)) {
      var pn = (PARTNERS.filter(function (p) { return p[1].test(text); })[0] || [""])[0], lab = (pn || "Partner") + " x TEKEX", set = [];
      if (pn === "Rathbones") set.push(slide("tk-sponsor", 0, "Proudly supporting", { partner: "Rathbones", headline: "Rathbones proudly supporting TEKEX" }));
      if (pn === "BDO/C5") set.push(slide("tk-sponsor", 1, "Partnership", { label: lab, headline: lab }));
      set.push(slide("tk-sponsor", 2, "In their words", { label: lab, step: "" }, pn === "BDO/C5" ? [] : ["quote"]));
      set.push(slide("tk-sponsor", 3, "Collaborators", { label: lab, headline: "Thanks to our collaborators" }));
      set.push(slide("tk-sponsor", 4, "Welcome", { headline: "Innovation starts here", body: "Welcome to TEKEX" }));
      return done(set, "Carousel: " + lab, [set.length + " slides for " + (pn || "a partner")], pn === "BDO/C5" ? "" : " The quote is BDO/C5's from the toolkit: replace it with " + (pn || "the partner") + "'s own words before posting.");
    }
    // 4. An event: announcement, the event itself, how to register, who supports it
    if (code || c.date || c.venue || /\b(event|summit|breakfast|social|launch|meet-?up|night)\b/i.test(text)) {
      // no one is named, so no one appears: the line-up example's speaker never carries over
      var base = { edition: code.replace(/^TEKEX\s?/, ""), date: when.num || when.day || "", venue: when.line || "", footLabel: "Events", name: "", role: "", person: "", extra: "" };
      return done([
        slide("tk-lineup", 0, "Cover", Object.assign({}, base, { eyebrow: "Event announcement", headline: head })),
        slide("tk-event", 2, "The event", { eyebrow: code || "TEKEX", headline: head || "Event title", date: when.num || when.day || "", venue: when.line || "", label: n0 ? "EVENT#" + n0 : "EVENTS" }, head ? [] : ["headline"]),
        slide("tk-lineup", 2, "Register", Object.assign({}, base, { cta: "Register now at tekex.co" })),
        slide("tk-lineup", 3, "Supported by", base)
      ], "Carousel: " + (head || code || "Event"), ["four slides", when.line].filter(Boolean), head ? "" : " Give the event its title on slide 2.");
    }
    // 5. Anything else: This is TEKEX, the brand campaign
    return done([
      slide("tk-campaign", 0, "Cover", head ? { headline: head } : {}),
      slide("tk-campaign", 1, "What we do", {}),
      slide("tk-campaign", 2, "What is TEKEX", {}),
      slide("tk-campaign", 3, "Supported by", {})
    ], "Carousel: " + (head || "This is TEKEX"), ["four slides from the brand campaign"]);
  }

  /* When and where from a brief: "Thu 26 Nov" gives the toolkit's 26/11/26 hero date and its 26th Nov line. */
  function whenOf(c) {
    var t0 = c.startTime ? c.startTime + (c.endTime ? " – " + c.endTime : "") : "", MS0 = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"], DL = { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday" };
    var m0 = String(c.date || "").match(/(\d{1,2})\s+([A-Za-z]{3})/), w = { num: "", day: c.date || "", long: c.date || "", time: t0 };
    if (m0) { var mi0 = MS0.indexOf(m0[2].toLowerCase()); if (mi0 >= 0) { var nw = new Date(), y0 = nw.getFullYear(); if (new Date(y0, mi0, +m0[1]) < new Date(y0, nw.getMonth(), nw.getDate() - 30)) y0++;
      w.num = ("0" + m0[1]).slice(-2) + "/" + ("0" + (mi0 + 1)).slice(-2) + "/" + String(y0).slice(-2); var n1 = +m0[1];
      w.day = n1 + (n1 % 10 === 1 && n1 !== 11 ? "st" : n1 % 10 === 2 && n1 !== 12 ? "nd" : n1 % 10 === 3 && n1 !== 13 ? "rd" : "th") + " " + m0[2];
      w.long = DL[["sun", "mon", "tue", "wed", "thu", "fri", "sat"][new Date(y0, mi0, n1).getDay()]] + " " + n1 + " " + m0[2]; } }
    w.line = [w.day, t0, c.venue].filter(Boolean).join(" / ");
    return w;
  }
  var cap = function (x) { x = String(x || "").trim(); return x.charAt(0).toUpperCase() + x.slice(1); };
  var tidy = function (x) { return String(x || "").replace(/\s+/g, " ").replace(/^[\s:–—-]+|[\s.]+$/g, "").trim(); };
  /* The toolkit's own kinds of post, read from a brief in the words the TEKEX team uses. Each sets the template, the
     layout and the copy it can; a real person only appears when the brief names them. Returns true when it read one. */
  function route(r, text) {
    var t = String(text || ""), c = r.copy = r.copy || {}, w = whenOf(c);
    var cm = t.match(/\b(TEKEX|IOM|JSY|GSY)\s?#\s?(\d+)/i), code = cm ? (/tekex/i.test(cm[1]) ? "TEKEX#" + cm[2] : cm[1].toUpperCase() + "#" + cm[2]) : (c.eventNumber ? "TEKEX#" + c.eventNumber : "");
    var put = function (tpl, L, copy, title, said) {
      if (typeof TPL !== "undefined" && !TPL[tpl]) return false;
      var o = Object.assign({}, T.exampleFor(tpl, L) || {});
      ["name", "person", "quote"].forEach(function (k) { if (!(copy && copy[k])) delete o[k]; }); // never someone else's words or face
      r.tpl = tpl; r.layout = L; r.copy = Object.assign(o, copy || {}); r.title = title; r.said = said; r.set = null; r.speakers = []; return true;
    };
    var quoted = t.match(/[“"]([^”"]{6,})[”"]/), who = (t.match(/\b(?:from|by|says|said)\s+((?:Dr\.?\s+)?[A-Z][a-z'’-]+(?:\s+[A-Z][a-z'’-]+){1,2})/) || [])[1];
    if (/\bpodcast\b/i.test(t)) {
      var ep = (t.match(/\b(?:episode|ep\.?|#)\s*(\d+)/i) || [])[1], hosts = T.peopleIn(t).map(function (p) { return p.name; });
      return put("tk-campaign", 4, { eyebrow: "Podcast" + (ep ? " #" + ep : ""), headline: quoted ? quoted[1] : "Episode title", name: hosts.join(" & ") }, "Podcast" + (ep ? " #" + ep : "") + " cover", ["a podcast cover" + (hosts.length ? " with " + hosts.join(" & ") : "")]);
    }
    if (quoted && (who || /\bquote\b/i.test(t))) return put("tk-statement", 1, { quote: quoted[1], name: who || "" }, "Quote" + (who ? " · " + who : ""), ["a quote" + (who ? " from " + who : "")]);
    // a stat is a number followed by what it counts ("1,000+ ecosystem members"), or any number when the brief says "stat";
    // never a date ("3 Dec")
    var MON = /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i;
    var st = t.match(/([£$€]?\d[\d,.]*\s*(?:k|m|bn|million|billion)?\+?)\s+((?:[a-z]+\s+)?(?:members|events|founders|investors|startups|attendees|connections|introductions|deals|raised)\b[^.,;:]*)/i)
      || (/\bstats?\b/i.test(t) ? t.match(/([£$€]?\d[\d,.]*\s*(?:k|m|bn|million|billion)?\+?)\s+([A-Za-z][^.,;:]*)/i) : null);
    if (st && MON.test(st[2])) st = null;
    if (st && !/\b(raises|raised \w+ in|series [a-d]|round)\b/i.test(t))
      return put("tk-statement", 2, { stat: st[1].replace(/\s+/g, ""), headline: cap(tidy(st[2])) }, "Stat · " + st[1].trim(), ["a stat: " + st[1].trim()]);
    if (/\b(rais(es|ed|ing)|clos(es|ed|ing)|secur(es|ed)|funding round|series [a-d]\b|seed round|pre-seed|angel round)\b/i.test(t))
      return put("tk-fundraising", 1, { headline: tidy(t.replace(/^(fundraising|news)\s*[:–—-]\s*/i, "")) }, tidy(t).slice(0, 48), ["a fundraising announcement"]);
    if (/\bhealth innovation\b/i.test(t)) return put("tk-series", 3, { date: w.num || w.day || "", time: w.time || "", venue: c.venue || "" }, "Health Innovation" + (w.day ? " · " + w.day : ""), ["Health Innovation", w.line].filter(Boolean));
    if (/\blast friday( club)?\b/i.test(t)) return /\btomorrow\b/i.test(t)
      ? put("tk-series", 2, { date: w.day || "", time: c.startTime || "17:00" }, "Last Friday Club · Tomorrow", ["Last Friday Club, tomorrow"])
      : put("tk-series", 0, { date: w.long || "" }, "Last Friday Club" + (w.long ? " · " + w.long : ""), ["Last Friday Club", w.long].filter(Boolean));
    if (/\b(last chance|final call|last few tickets|selling fast|few tickets left)\b/i.test(t)) return put("tk-countdown", 2, { eyebrow: (code || "TEKEX").toUpperCase(), headline: "Last chance\nto get your tickets", body: "" }, (code || "TEKEX") + " · Last chance", ["last chance for tickets"]);
    if (/\btickets?\b/i.test(t) && /\b(on sale|available|out now|live|book now|released|booking)\b/i.test(t)) return put("tk-countdown", 1, { code: code || "TEKEX", eyebrow: "TICKETS ON SALE NOW", date: w.num || "", body: /^IOM/.test(code) ? "Global Innovation. Isle of Man Opportunity." : "" }, (code || "TEKEX") + " tickets on sale", ["tickets on sale", w.day].filter(Boolean));
    if (/\b(tonight|tomorrow)\b/i.test(t) && (code || /\b(event|tekex)\b/i.test(t))) { var when = /\btonight\b/i.test(t) ? "TONIGHT" : "TOMORROW"; return put("tk-countdown", 0, { code: code || "TEKEX", headline: when, venue: c.venue || "" }, (code || "TEKEX") + " " + when.toLowerCase(), [(code || "TEKEX") + " is " + when.toLowerCase()]); }
    var pn = (PARTNERS.filter(function (p) { return p[1].test(t); })[0] || [""])[0];
    if (/\b(welcome|welcomes|welcoming|joins?|joined|newest)\b/i.test(t) && /\b(partner|sponsor|supporter)s?\b/i.test(t)) {
      if (!pn) { var nm = t.match(/\b(?:welcome|welcomes|welcoming)\s+([A-Z][\w&/.-]*(?:\s+[A-Z][\w&/.-]*){0,3})/); pn = nm ? nm[1] : ""; }
      return pn === "Rathbones" ? put("tk-sponsor", 0, { partner: "Rathbones", headline: "Rathbones proudly supporting TEKEX" }, "Rathbones proudly supporting TEKEX", ["welcoming Rathbones"])
        : put("tk-sponsor", 4, { headline: pn ? "Welcome, " + pn : "Innovation starts here", body: pn ? "Our newest partner" : "Welcome to TEKEX" }, "Welcome" + (pn ? ", " + pn : ""), ["welcoming " + (pn || "a new partner")]);
    }
    if (/\bwhat is tekex\b/i.test(t)) return put("tk-campaign", 2, {}, "What is TEKEX?", ["What is TEKEX?"]);
    if (/\b(what can tekex do|this is tekex)\b/i.test(t)) return put("tk-campaign", 0, {}, "What can TEKEX do for you?", ["This is TEKEX"]);
    if (/^\s*news\b\s*[:–—-]?/i.test(t)) { var h = tidy(t.replace(/^\s*news\b\s*[:–—-]?\s*/i, "")); var hear = h.match(/^hear from\s+([A-Z][a-z'’-]+(?:\s+[A-Z][a-z'’-]+){1,2})/i);
      return hear ? put("tk-news", 4, { headline: "Hear from " + hear[1], body: "" }, "Hear from " + hear[1], ["news: hear from " + hear[1]]) : put("tk-news", 1, { headline: h }, h.slice(0, 48), ["news"]); }
    return false;
  }
  T.route = route;

  T.fromBrief = function (r, text) {
    if (r && text && !CAROUSEL.test(text) && route(r, text)) return r;
    if (r && text && CAROUSEL.test(text)) {
      var c0 = r.copy || {}, t0 = c0.startTime ? c0.startTime + (c0.endTime ? " – " + c0.endTime : "") : "", MS0 = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"], m0 = String(c0.date || "").match(/(\d{1,2})\s+([A-Za-z]{3})/), w = { num: "", day: c0.date || "" };
      if (m0) { var mi0 = MS0.indexOf(m0[2].toLowerCase()); if (mi0 >= 0) { var nw = new Date(), y0 = nw.getFullYear(); if (new Date(y0, mi0, +m0[1]) < new Date(y0, nw.getMonth(), nw.getDate() - 30)) y0++; w.num = ("0" + m0[1]).slice(-2) + "/" + ("0" + (mi0 + 1)).slice(-2) + "/" + String(y0).slice(-2); var n1 = +m0[1]; w.day = n1 + (n1 % 10 === 1 && n1 !== 11 ? "st" : n1 % 10 === 2 && n1 !== 12 ? "nd" : n1 % 10 === 3 && n1 !== 13 ? "rd" : "th") + " " + m0[2]; } }
      w.line = [w.day, t0, c0.venue].filter(Boolean).join(" / ");
      r.copy = r.copy || {};
      var made = carouselFor(r, text, w);
      if (made) return made;
    }
    if (r && r.copy) {
      // "Introduce Jenson Artus, our Isle of Man Lead" is Jenson Artus, Isle of Man Lead
      ["name", "person"].forEach(function (k) { if (r.copy[k]) r.copy[k] = String(r.copy[k]).replace(/^(introduce|introducing|meet|welcome|announce|announcing|say hello to|hello)\s+/i, ""); });
      if (r.copy.role) r.copy.role = String(r.copy.role).replace(/^(our|the)\s+/i, "");
    }
    if (r && !r.tpl && text) {
      var c9 = r.copy || {};
      if (c9.date || c9.venue) { r.tpl = "event"; if (!c9.headline) { var lead = String(text).split(/,|\s+on\s+(?=(mon|tue|wed|thu|fri|sat|sun))/i)[0]; c9.headline = tidy(lead.replace(/^(announce|announcing|save the date( for)?)\s+/i, "")); } r.copy = c9; }
      else { r.tpl = "tk-news"; r.layout = 1; r.copy = { headline: tidy(text).slice(0, 110) }; r.title = tidy(text).slice(0, 48); r.said = ["a headline post"]; return r; }
    }
    if (!r || !r.tpl) return r;
    // a line-up's people as the brief names them, so a role ("CEO, Digital Isle of Man") is never read as a speaker
    if ((r.tpl === "listing" || r.tpl === "trio") && text) { var pp = T.peopleIn(text); if (pp.length) r.speakers = pp.map(function (p) { var k = (r.speakers || []).filter(function (sp) { return sp.name === p.name; })[0]; return k && !p.role ? k : { name: p.name, role: p.role, company: "" }; }); }
    var c = Object.assign({}, r.copy || {}), tpl = r.tpl, on = function (k) { return typeof TPL !== "undefined" && !!TPL[k]; };
    var time = c.startTime ? c.startTime + (c.endTime ? " – " + c.endTime : "") : "";
    // "Thu 26 Nov" becomes the toolkit's 26th Nov line and its 26/11/26 hero date, in the year it next falls
    var MS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"], m = String(c.date || "").match(/(\d{1,2})\s+([A-Za-z]{3})/), num = "", day = c.date || "";
    if (m) {
      var mi = MS.indexOf(m[2].toLowerCase()), now = new Date(), y = now.getFullYear(); if (mi >= 0) { var dt = new Date(y, mi, +m[1]); if (dt < new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30)) y++;
        num = ("0" + m[1]).slice(-2) + "/" + ("0" + (mi + 1)).slice(-2) + "/" + String(y).slice(-2);
        var n = +m[1], sfx = n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th"; day = n + sfx + " " + m[2]; }
    }
    var when = [day, time, c.venue].filter(Boolean).join(" / ");
    var role = function (o) { return [String(o.role || "").replace(/[,\s]+$/, ""), o.company].filter(Boolean).join(", "); };
    var n0 = c.eventNumber || (String(text || "").match(/\btekex\s?#\s?(\d+)/i) || [])[1], code = n0 ? "TEKEX #" + n0 : "TEKEX";
    if (tpl === "speaker" && on("tk-speaker")) { r.tpl = "tk-speaker"; r.layout = 0; r.copy = Object.assign(c, { eyebrow: (n0 ? "Tekex #" + n0 : "Tekex") + " Speaker:", role: role(c), person: c.name }); }
    else if (tpl === "event" && on("tk-event")) {
      // the event's own title, where the brief gives one ("TEKEX #37: Founders & Funders, Thu 3 Dec")
      var ttl = String(text || "").match(/#\s?\d+\s*[:–—-]\s*([^,]+)/);
      if (ttl) c.headline = tidy(ttl[1]); else if (!c.headline || /^tekex\s?#?\d*$/i.test(String(c.headline).trim())) c.headline = c.headline && !/^tekex/i.test(c.headline) ? c.headline : "Event title";
      r.tpl = "tk-event"; r.layout = 0; r.copy = Object.assign(c, { eyebrow: code, date: num || day, venue: when, label: n0 ? "EVENT#" + n0 : "EVENTS" }); }
    else if ((tpl === "listing" || tpl === "trio") && on("tk-lineup") && r.speakers && r.speakers.length) {
      var em = String(text || "").match(/\b(TEKEX|IOM|JSY|GSY)\s?#\s?(\d+)/i), ed = n0 ? "#" + n0 : em ? (/tekex/i.test(em[1]) ? "#" + em[2] : em[1].toUpperCase() + "#" + em[2]) : "", base = { edition: ed, date: num || day, venue: when, footLabel: "Speakers", name: "", role: "", person: "", extra: "" };
      var set = [{ tpl: "tk-lineup", layout: 0, title: "1 Cover", copy: Object.assign({}, base, { eyebrow: "Speaker introduction", headline: c.headline || "" }) }];
      r.speakers.forEach(function (sp, i) { set.push({ tpl: "tk-lineup", layout: 1, title: (i + 2) + " " + sp.name, copy: Object.assign({}, base, { name: sp.name, role: role(sp), person: sp.name }) }); });
      set.push({ tpl: "tk-lineup", layout: 2, title: (set.length + 1) + " Register", copy: Object.assign({}, base, { cta: "Register now at tekex.co" }) });
      set.push({ tpl: "tk-lineup", layout: 3, title: (set.length + 1) + " Supported by", copy: Object.assign({}, base) });
      r.set = set; r.title = "Line-up: " + (c.headline || code + " speakers"); r.said = [r.speakers.length + " speakers", when].filter(Boolean); r.tpl = "tk-lineup";
    }
    else if (tpl === "partners" && on("tk-sponsor")) { r.tpl = "tk-sponsor"; r.layout = 3; }
    else if (tpl === "lockup" && on("tk-statement")) { r.tpl = "tk-statement"; r.layout = 0; r.copy = Object.assign(c, { headline: c.body }); }
    return r;
  };
  T.slots = function (d) { var f = T.slotDefs[d.tpl]; return f ? f(d) : []; };
  T.fill = function (d, put, libImg, match) { var f = T.fills[d.tpl]; if (f) f(d, put, libImg, match); };
  T.exampleFor = function (tpl, layout) { var e = T.examples[tpl]; if (!e) return null; return Array.isArray(e) ? (e[layout || 0] || e[0]) : e; };

  function norm(e) {
    var o = Object.assign({}, e);
    o.isBox = e.k === "box"; o.isMask = e.k === "mask"; o.isPic = e.k === "pic"; o.isSlot = e.k === "slot";
    o.isText = e.k === "text" && !e.field; o.isField = e.k === "text" && !!e.field && !e.fit; o.isFit = e.k === "text" && !!e.field && !!e.fit;
    o.style = Object.assign({}, e.style, { zIndex: e.z });
    Object.keys(o.style).forEach(function (k) { if (o.style[k] === undefined) delete o.style[k]; });
    if (o.isSlot) { o.hasImg = !!(e.img && e.img.has); o.imgSrc = o.hasImg ? e.img.src : ""; o.imgStyle = o.hasImg ? e.img.style : {}; }
    return o;
  }
  function flat(list, out) { (list || []).forEach(function (x) { if (!x) return; if (Array.isArray(x)) flat(x, out); else out.push(x); }); return out; }

  T.vals = function (d, ctx) {
    var S = ctx.S, G = geo(S), K = kit(d, ctx, G), b = T.builders[d.tpl];
    var res = b ? b(d, K, G) : [];
    var bg = (res && res.bg) || K.light, els = flat(res && res.els ? res.els : res, []);
    els = els.map(function (e, i) { e._i = i; return e; }).sort(function (a, c) { return (a.z || 0) - (c.z || 0) || a._i - c._i; });
    var frame = { position: "absolute", left: 0, top: 0, width: G.w, height: G.h, overflow: "hidden", background: bg,
      transform: G.k === 1 ? "none" : "translate(" + (-(G.w - S.w) / 2) + "px," + (-(G.h - S.h) / 2) + "px) scale(" + G.k + ")" };
    return {
      t_on: true, url: "", showBar: false, isSpeaker: false, isEvent: false, isPartners: false, isLockup: false, isListing: false, isTrio: false,
      canvasPatch: { position: "relative", overflow: "hidden", padding: 0, background: bg, color: K.ink, display: "block", fontFamily: FONT },
      t_frame: frame, t_els: els.map(norm)
    };
  };

  // The workspace's icon in the sidebar: TEKEX's favicon from tekex.co, a red open square on lilac, on its own ground.
  T.icon = { src: "assets/tekex/favicon.svg", ground: "#F6C5FF", size: "auto 68%" };
  // The brand book cover's signature graphic: the inflated cross from the toolkit, pink and violet on the mint ground.
  T.cover = "assets/tekex/library/graphics/3d-inflated-cross-pink-violet.webp";
})();

} catch (e) { console.warn("TEKEX pack.js didn't load", e); }

/* ---- t-speaker.js ---- */
try {
/* Speaker: one person, their name and their role, on the Speakers pair (magenta on aqua).
   Source: TEKEX toolkit (rVWbcVBLtLKYvbMFFs8XZV) frames 9028:174, 9037:2045, 9038:2086, 9038:19720 (1080 x 1080) and
   9038:22885, 9038:22996, 9038:22941, 9038:23180 (1200 x 627); the published Tekex34, Tekex35 and Tekex36 speaker posts.
   Layouts: 0 cut-out over the rings, 1 full-bleed photo, 2 cut-out over the ribbon, 3 name only. */
(function () {
  var T = window.HS_TEKEX, RIBBON = "assets/tekex/shapes/ribbon.webp";
  var F = function (key, label, ph, more) { return Object.assign({ key: key, label: label, ph: ph }, more || {}); };

  /* The words on a 1080 frame: kicker 78 SemiBold, name 128 SemiBold capitals, role 43 Medium. The role never moves (814
     on the square), the name sits on it and the kicker on the name; a second line of name pushes both up. */
  function panelText(K, G, o) {
    var c = K.c, fy = G.fy, s = o.scale || 1, x = o.x || 95, maxW = o.maxW || 890;
    var name = K.fit(c.name, 128 * s, maxW, 600, 2, 0.6, true), kick = K.fit(c.eyebrow, 78 * s, maxW, 600, 1, 0.6);
    var role = K.fit(c.role, 43 * s, maxW + 30, 500, 2, 0.8);
    var roleY = (o.roleY == null ? 814 : o.roleY) + fy, nameH = name.size * 0.92 * name.n, nameY = roleY - 4 * s - nameH, kickY = nameY - 80 * s;
    var out = [];
    if (K.has("eyebrow")) out.push(K.text(x, kickY, kick.text, { size: kick.size, weight: 600, field: "eyebrow" }));
    out.push(K.text(x, nameY, name.text, { size: name.size, weight: 600, upper: true, wrap: true, field: "name", fit: "name", w: maxW + 20, h: nameH + 4 }));
    if (K.has("role")) out.push(K.text(x + 6 * s, roleY, role.text, { size: role.size, weight: 500, lh: 1, wrap: true, field: "role" }));
    return { els: out, top: K.has("eyebrow") ? kickY : nameY, lines: name.n };
  }

  /* The rings motif, centred where the toolkit puts it, moved and grown into the extra height of a tall frame. */
  function rings(K, G, x, y, size) {
    var grow = G.wide ? 0 : (G.fy - G.ty), sc = 1 + grow / 1080 * 0.55, sz = size * sc;
    var cx = x + size / 2, cy = y + size / 2 + G.ty + grow * 0.5;
    return K.mark("rings", cx - sz / 2, cy - sz / 2, sz, sz, { color: "#FFFFFF", z: K.Z.motif, label: "" });
  }

  function build(d, K, G) {
    var L = d.layout || 0, els = [], X = G.X;
    if (!G.wide) {
      var t = panelText(K, G, {});
      var pTop = t.top - (t.lines === 1 ? 33 : 43), pBot = 895 + G.fy;
      if (L === 0) {
        els.push(rings(K, G, -28.92, -166.92, 991.92));
        els.push(K.slot("portrait", "Speaker cut-out", 230, 20 + G.ty, 952, 830 + (G.fy - G.ty) * 0.9));
      }
      if (L === 1) els.push(K.slot("photo", "Speaker photo", 0, 0, G.w, G.h, { cover: true }));
      if (L === 2) {
        var g2 = G.fy - G.ty, rs = 1 + g2 / 1080 * 0.5;
        els.push(K.pic(RIBBON, 44 - (958 * rs - 958) / 2, -72 + G.ty + g2 * 0.35, 958 * rs, 699 * rs, { z: K.Z.motif }));
        els.push(K.slot("portrait", "Speaker cut-out", 0, 20 + G.ty, 880, 830 + g2 * 0.9));
      }
      if (L === 3) {
        els.push(rings(K, G, -56, -241, 991.92));
        var c = K.c, name = K.fit(c.name, 250.576, 890, 600, 2, 0.5, true), fy = G.fy;
        var nameH = name.size * 0.92 * name.n, nameY = 810 + fy - nameH;
        if (K.has("eyebrow")) els.push(K.text(95, nameY - 78, K.fit(c.eyebrow, 78, 890, 600, 1, 0.6).text, { size: K.fit(c.eyebrow, 78, 890, 600, 1, 0.6).size, field: "eyebrow" }));
        els.push(K.text(95, nameY, name.text, { size: name.size, upper: true, wrap: true, field: "name", fit: "name", w: 910, h: nameH + 4 }));
        if (K.has("role")) els.push(K.text(101, 814 + fy, K.fit(c.role, 43, 920, 500, 2, 0.8).text, { size: 43, weight: 500, lh: 1, wrap: true, field: "role" }));
      } else {
        els.push(K.box(48, pTop, 984, pBot - pTop, { line: 2, fill: K.light, z: K.Z.panel }));
        els.push(t.els);
      }
      els.push(K.chrome({ label: d.copy.footLabel || "SPEAKERS", foot: d.copy.footer === "sponsors" ? "sponsors" : "cells" }));
      return els;
    }
    // ---- 1200 x 627 (and 1920 x 1080 at the same proportions, X narrower)
    var c2 = K.c, s = 0.6186;
    if (L === 0) {
      els.push(K.mark("rings", 579.9 + X, 33, 650.1, 617.9, { color: "#FFFFFF", z: K.Z.motif, stretch: true }));
      els.push(K.slot("portrait", "Speaker cut-out", 610 + X, 112, 560, 420));
      els.push(K.box(48, 44, 532, 421, { line: 1.7, fill: K.light, z: K.Z.panel }));
      els.push(panelText(K, G, { scale: s, x: 77.79, roleY: 410.96, maxW: 472 }).els);
      els.push(K.chrome({ label: d.copy.footLabel || "SPEAKERS", shortTop: [590, 560] }));
      return els;
    }
    if (L === 1) {
      els.push(K.slot("photo", "Speaker photo", 0, 0, G.w, G.h, { cover: true }));
      els.push(K.box(48, 300, 1102 + X, 164, { line: 1.7, fill: K.light, z: K.Z.panel }));
      var s1 = 0.6423, nm = K.fit(c2.name, 128 * s1, 540, 600, 1, 0.6, true), kk = K.fit(c2.eyebrow, 78 * s1, 1040 + X, 600, 1, 0.6);
      if (K.has("eyebrow")) els.push(K.text(77, 321, kk.text, { size: kk.size, field: "eyebrow" }));
      els.push(K.text(68, 371, nm.text, { size: nm.size, upper: true, field: "name", fit: "name", w: 560, h: 82 }));
      var nmW = K.tw(String(c2.name || "").toUpperCase(), nm.size, 600), rx = Math.max(635, 68 + nmW + 40);
      if (K.has("role")) els.push(K.text(rx, 413, K.fit(c2.role, 43 * s1, 1150 + X - rx - 24, 500, 2, 0.75).text, { size: K.fit(c2.role, 43 * s1, 1150 + X - rx - 24, 500, 2, 0.75).size, weight: 500, lh: 1, wrap: true, field: "role" }));
      els.push(K.chrome({ label: d.copy.footLabel || "SPEAKERS" }));
      return els;
    }
    if (L === 2) {
      els.push(K.pic(RIBBON, 599.8 + X, -268, 1181.99, 1096.23, { z: K.Z.motif }));
      els.push(K.slot("portrait", "Speaker cut-out", 600 + X, 96, 560, 436));
      els.push(panelText(K, G, { scale: 0.6423, x: 79, roleY: 406.5, maxW: 500 }).els);
      els.push(K.chrome({ label: d.copy.footLabel || "SPEAKERS" }));
      return els;
    }
    // name only
    els.push(K.mark("rings", -31, -183, 991.92, 991.92, { color: "#FFFFFF", z: K.Z.motif }));
    var nm3 = K.fit(c2.name, 167.939, 570, 600, 2, 0.5, true), nh3 = nm3.size * 0.92 * nm3.n;
    if (K.has("eyebrow")) els.push(K.text(60.95 + 11, 58.8 + 5, K.fit(c2.eyebrow, 56.562 * 0.62, 560, 600, 1, 0.6).text, { size: K.fit(c2.eyebrow, 35, 560, 600, 1, 0.6).size, field: "eyebrow", z: K.Z.top }));
    els.push(K.text(70.97, 455 - nh3, nm3.text, { size: nm3.size, upper: true, wrap: true, field: "name", fit: "name", w: 590, h: nh3 + 4 }));
    var nmRight = 70.97 + Math.max.apply(null, nm3.lines.map(function (l) { return K.tw(l.toUpperCase(), nm3.size, 600); })), rx3 = Math.max(656 + X * 0.5, nmRight + 34);
    if (K.has("role")) els.push(K.text(rx3, 395, K.fit(c2.role, 43, 1150 + X - rx3 - 20, 500, 2, 0.6).text, { size: K.fit(c2.role, 43, 1150 + X - rx3 - 20, 500, 2, 0.6).size, weight: 500, lh: 1, wrap: true, field: "role" }));
    els.push(K.chrome({ label: d.copy.footLabel || "SPEAKERS" }));
    return els;
  }

  T.add({
    tpl: { key: "tk-speaker", short: "Speaker", what: "a speaker card", name: "Speaker", theme: "Mint & magenta",
      desc: "One speaker: their cut-out or photo, name and role, on the speakers colours.", required: ["name"],
      layouts: ["Cut-out over rings", "Full-bleed photo", "Cut-out over ribbon", "Name only"] },
    fields: [F("eyebrow", "Kicker", "Tekex #34 Speaker:", { optional: true }), F("name", "Name", "Tim Huelin"), F("role", "Role", "Founder & CEO, Daysium", { optional: true })],
    // A published TEKEX speaker (Tekex #34), whose cut-out is in the library
    examples: { eyebrow: "Tekex #34 Speaker:", name: "Tim Huelin", role: "Founder & CEO, Daysium" },
    slots: function (d) { var L = d.layout || 0; return L === 1 ? [{ id: "photo", label: "Speaker photo" }] : L === 3 ? [] : [{ id: "portrait", label: "Speaker cut-out" }]; },
    // A named speaker only ever gets their own picture: with none in the library the area stays empty to be filled.
    fill: function (d, put, libImg) {
      var L = d.layout || 0, name = d.copy && d.copy.name;
      if (L === 1) { var ph = T.personPic(name, false) || T.personPic(name, true); if (ph) put("photo", libImg(ph, 50, 25)); }
      else if (L !== 3) { var cut = T.personPic(name, true); if (cut) put("portrait", libImg(cut)); }
    },
    preload: [], build: build
  });
})();

} catch (e) { console.warn("TEKEX t-speaker.js didn't load", e); }

/* ---- t-lineup.js ---- */
try {
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

} catch (e) { console.warn("TEKEX t-lineup.js didn't load", e); }

/* ---- t-event.js ---- */
try {
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

} catch (e) { console.warn("TEKEX t-event.js didn't load", e); }

/* ---- t-countdown.js ---- */
try {
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

} catch (e) { console.warn("TEKEX t-countdown.js didn't load", e); }

/* ---- t-news.js ---- */
try {
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

} catch (e) { console.warn("TEKEX t-news.js didn't load", e); }

/* ---- t-fundraising.js ---- */
try {
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

} catch (e) { console.warn("TEKEX t-fundraising.js didn't load", e); }

/* ---- t-sponsor.js ---- */
try {
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
      // a long quote steps down to 28 on up to 8 lines before it would ever run out of its 266-high box
      var qw = fitWords(K, c.quote, { size: 54, min: 28, w: 1020 + X, lines: 8, h: 266, lh: 1, base: 300, strong: 600 });
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

} catch (e) { console.warn("TEKEX t-sponsor.js didn't load", e); }

/* ---- t-statement.js ---- */
try {
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

} catch (e) { console.warn("TEKEX t-statement.js didn't load", e); }

/* ---- t-series.js ---- */
try {
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

} catch (e) { console.warn("TEKEX t-series.js didn't load", e); }

/* ---- t-campaign.js ---- */
try {
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

} catch (e) { console.warn("TEKEX t-campaign.js didn't load", e); }

/* ---- examples.js ---- */
try {
/* TEKEX's example designs: what All designs and Drafts show on a first visit, and what "Bring back the examples"
   restores. Every template and nearly every layout appears, with TEKEX's own people, events and partners, and the
   copy from the toolkit and published posts. Several designs come in more than one format, so their tiles show the
   sizes layered. Dates are worked out from the day they arrive (api.now) and roll forward a week at a time with today
   (see hs-tk-seed-at in Home Studio.dc.html), so the calendar always has work going out this week.
   A person is only ever shown with their own picture and a role they are credited with in TEKEX's files. */
(function () {
  var T = window.HS_TEKEX;
  if (!T) return;

  var MS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var ML = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var WD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  function seed(api) {
    var now = new Date(api.now || Date.now()), y0 = now.getFullYear(), m0 = now.getMonth(), d0 = now.getDate();
    var at = function (days) { return new Date(y0, m0, d0 + days); };
    var p2 = function (n) { return ("0" + n).slice(-2); };
    var ord = function (n) { var t = n % 100; return n + (t > 10 && t < 14 ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th"); };
    var dmy = function (days) { var t = at(days); return p2(t.getDate()) + "/" + p2(t.getMonth() + 1) + "/" + String(t.getFullYear()).slice(-2); };
    var dm = function (days) { var t = at(days); return ord(t.getDate()) + " " + MS[t.getMonth()]; };
    var day = function (days) { var t = at(days); return WD[t.getDay()] + " " + t.getDate() + " " + MS[t.getMonth()]; };
    var iso = function (days) { var t = at(days); return t.getFullYear() + "-" + p2(t.getMonth() + 1) + "-" + p2(t.getDate()); };
    // the next given weekday (0 Sunday) at least `min` days away
    var next = function (dow, min) { var n = min; while (at(n).getDay() !== dow) n++; return n; };
    // the last Friday of the month, the month after if this month's is under a week away
    var lastFri = function () {
      for (var k = 0; k < 3; k++) {
        var e = new Date(y0, m0 + k + 1, 0), n = Math.round((e - at(0)) / 86400000); while (at(n).getDay() !== 5) n--;
        if (n >= 7) return n;
      }
      return 28;
    };

    var IOM = next(4, 12), HI = next(4, 33), LF = lastFri(), JSY = next(3, 19);
    var projects = [], drafts = [], FAM = {};
    var P = function (name, brief) { var p = api.project(name, brief); projects.push(p); return p; };
    // A design in a layout: the layout's example copy, then this design's own words.
    var D = function (p, tpl, layout, title, copy, o) {
      o = o || {};
      var blank = {}; (T.fields[tpl] || []).forEach(function (f) { blank[f.key] = ""; });
      var d = api.design(p, tpl, title, o.theme || null, Object.assign(blank, T.exampleFor(tpl, layout) || {}, copy || {}), o.pics, layout);
      // posts go out on weekdays: a date that lands on a weekend moves to the Monday
      if (o.sched != null) { var sd = o.sched; while (at(sd).getDay() === 0 || at(sd).getDay() === 6) sd++; d.scheduledAt = iso(sd); }
      if (o.partners) d.partnersOn = o.partners.slice();
      if (o.sizes) FAM[d.id] = o.sizes;
      drafts.push(d);
      return d;
    };

    // 1. Isle of Man #3: the panel line-up carousel, the ticket countdown and the day-of post
    var p = P("TEKEX IOM #3", "The Isle of Man event on " + day(IOM) + ". The panel line-up carousel, the ticket countdown and a post for the day itself.");
    var lu = { edition: "IOM#3", date: dmy(IOM), eyebrow: "Panel introduction", venue: dm(IOM) + " / 17:30 / Isle of Man", cta: "Register now at tekex.co", footLabel: "Speakers" };
    var luP = { sched: 1 };
    D(p, "tk-lineup", 0, "IOM#3 line-up · Cover", Object.assign({}, lu, { name: "", role: "" }), luP);
    [["Carol Glover", "Vice President, Chamber of Commerce"], ["Lyle Wraxall", "CEO, Digital Isle of Man"],
     ["Steve Billinghurst", "Chair, IoD"], ["Guy Templer", "Chair, Junior Achievement"]].forEach(function (s, i) {
      D(p, "tk-lineup", 1, "IOM#3 line-up · " + s[0], Object.assign({}, lu, { name: s[0], role: s[1] }), { sched: 1 });
    });
    D(p, "tk-lineup", 2, "IOM#3 line-up · Register", lu, luP);
    D(p, "tk-lineup", 3, "IOM#3 line-up · Supported by", lu, luP);
    D(p, "tk-countdown", 1, "IOM#3 tickets on sale", { code: "IOM#3", eyebrow: "TICKETS ON SALE NOW", date: dmy(IOM), body: "Global Innovation. Isle of Man Opportunity." }, { sched: 0, sizes: ["story", "linkedin"] });
    D(p, "tk-countdown", 0, "IOM#3 tonight", { code: "IOM#3", headline: "TONIGHT" }, { sched: IOM });

    // 2. Health Innovation Jersey
    p = P("Health Innovation Jersey", "A one-day event at the BDO/C5 Hub on " + day(HI) + ": the announcement in every format, the last-chance post and the news story.");
    D(p, "tk-series", 3, "Is Health Jersey's next key industry?", { date: dmy(HI), time: "10.30–20.00", venue: "BDO/C5 Hub, St Helier" }, { sched: 3, sizes: ["portrait", "story", "linkedin"] });
    D(p, "tk-news", 0, "Tekex to host the Health Innovation Summit", null, { sched: 2, sizes: ["linkedin"] });
    D(p, "tk-countdown", 2, "Health Innovation · Last chance", null, { sched: HI - 3 });
    D(p, "tk-statement", 0, "Cross-pollination", null);

    // 3. Speaker cards
    p = P("Speaker cards", "Speaker announcements from TEKEX #34, #36 and IOM #3, in each of the speaker layouts.");
    D(p, "tk-speaker", 0, "Tim Huelin", null, { sched: 4, sizes: ["portrait", "story", "linkedin"] });
    D(p, "tk-speaker", 2, "Serena Guthrie", { eyebrow: "Tekex #36 Speaker:", name: "Serena Guthrie", role: "Former England netball player" }, { sizes: ["story"] });
    D(p, "tk-speaker", 3, "Lyle Wraxall", { eyebrow: "IOM#3 Speaker:", name: "Lyle Wraxall", role: "CEO, Digital Isle of Man" }, { sched: 6, sizes: ["linkedin"] });
    D(p, "tk-speaker", 1, "Tim Huelin · Photo", null);

    // 4. Last Friday Club
    p = P("Last Friday Club · " + ML[at(LF).getMonth()], "The community social on " + day(LF) + ": the save-the-date, a cut-out version and the reminder the day before.");
    D(p, "tk-series", 0, "Last Friday Club · Save the date", { date: day(LF) }, { sched: LF - 7, sizes: ["story", "landscape"] });
    D(p, "tk-series", 1, "Last Friday Club · Shapes", { date: day(LF) }, null);
    D(p, "tk-series", 2, "Last Friday Club · Tomorrow", { date: dm(LF), time: "17:00" }, { sched: LF - 1, sizes: ["linkedin"] });

    // 5. Partners
    p = P("Partners · Rathbones and BDO/C5", "Partner posts: Rathbones' support, the BDO/C5 partnership carousel, the logo panel and the welcome post.");
    D(p, "tk-sponsor", 0, "Rathbones proudly supporting TEKEX", null, { sched: 5, sizes: ["portrait", "linkedin"] });
    D(p, "tk-sponsor", 1, "BDO/C5 x TEKEX · Partnership benefits", null);
    D(p, "tk-sponsor", 2, "BDO/C5 x TEKEX · Quote", null);
    D(p, "tk-sponsor", 3, "Thanks to our collaborators", null);
    D(p, "tk-sponsor", 4, "Innovation starts here", null, { sizes: ["story"] });

    // 6. TEKEX Wrapped
    p = P("TEKEX Wrapped 2025", "The year in numbers, slide by slide, with the statements and quotes from the year.");
    D(p, "tk-statement", 3, "Wrapped · 12 events", { step: "1/7" }, { sched: 20 });
    D(p, "tk-statement", 3, "Wrapped · 1,000+ members", { eyebrow: "COMMUNITY", stat: "1,000+", headline: "Ecosystem Members", body: "Startups, investors, creatives, corporates and policymakers, growing stronger together across three islands.", step: "2/7" }, { sched: 20 });
    D(p, "tk-statement", 2, "Wrapped · £22M raised", null, { sched: 20, sizes: ["linkedin"] });
    D(p, "tk-statement", 1, "The best introductions", null, { sizes: ["linkedin"] });

    // 7. Fundraising and news
    p = P("Fundraising and news", "Fundraising announcements and news from the community.");
    D(p, "tk-fundraising", 0, "Io-Co closes its Series A", null, { sched: 2, sizes: ["linkedin"] });
    D(p, "tk-fundraising", 1, "CI Airlines' Angel round", null);
    D(p, "tk-fundraising", 2, "We found our lead investor at Tekex", null);
    D(p, "tk-fundraising", 3, "£22M raised", null);
    D(p, "tk-news", 4, "Hear from Louis Pike", null, { sched: 7, sizes: ["story"] });
    D(p, "tk-news", 3, "Simon Franc on TEKEX #32", null);
    D(p, "tk-news", 1, "Tekex lands in the Isle of Man", null);

    // 8. This is TEKEX
    p = P("This is TEKEX", "The brand campaign: what TEKEX is and who it's for, the supporters, and the podcast cover.");
    D(p, "tk-campaign", 0, "What can Tekex do for you?", null, { sched: 9, sizes: ["story", "linkedin"] });
    D(p, "tk-campaign", 1, "What can Tekex do for you? · List", null);
    D(p, "tk-campaign", 2, "What is Tekex?", null);
    D(p, "tk-campaign", 3, "Supported by", null);
    D(p, "tk-campaign", 4, "Podcast #3 · Deals from A to Z", null, { sched: 12 });

    // 9. TEKEX #31, the toolkit's event posts as they were published
    p = P("TEKEX #31 · Founders, Film & New Frontiers", "The event announcement from the toolkit in each of its six layouts.");
    D(p, "tk-event", 0, "Founders, Film & New Frontiers", null, { sizes: ["portrait", "story", "linkedin"] });
    [1, 2, 3, 4, 5].forEach(function (L) { D(p, "tk-event", L, "Founders, Film & New Frontiers · " + T.templates.filter(function (t) { return t.key === "tk-event"; })[0].layouts[L], null); });

    // The other formats sit with their design, so each family is together in the list
    var out = [];
    drafts.forEach(function (d) { out.push(d); if (FAM[d.id] && api.sizes) api.sizes(d, FAM[d.id]).forEach(function (x) { out.push(x); }); });
    // All designs lists work newest first: stamp the families in a mixed order so the wall reads evenly
    var t0 = Date.now();
    mix(out).forEach(function (d, i) { d.updatedAt = t0 - i * 60000; });
    projects.forEach(function (pj, i) { pj.createdAt = t0 - (i + 1) * 86400000 * 2; pj.updatedAt = t0 - i * 3600000; });
    return { projects: projects, drafts: out };
  }

  /* The order All designs shows the examples in. Each project's work is spread across the whole wall, in its own order,
     and neighbouring tiles avoid sharing a project, a template or a colour, so no corner is all one colour.
     Takes designs (a family's sizes stay together) and returns them in that order. */
  // What each layout's tile looks like at a glance, measured from its thumbnail (the layouts set their own grounds,
  // so the colourway number doesn't say). Used to keep tiles of the same colour apart.
  var TONE = {
    "tk-lineup": ["teal", "teal", "teal", "teal"], "tk-speaker": ["teal", "photo", "teal", "teal"],
    "tk-countdown": ["peach", "peach", "dark"], "tk-fundraising": ["photo", "peach", "peach", "peach"],
    "tk-series": ["dark", "lilac", "photo", "lilac"], "tk-statement": ["lilac", "lilac", "lilac", "lilac"],
    "tk-news": ["photo", "lilac", "photo", "lilac", "lilac"], "tk-sponsor": ["photo", "mint", "mint", "mint", "dark"],
    "tk-campaign": ["dark", "dark", "dark", "dark", "dark"], "tk-event": ["mint", "dark", "dark", "mint", "photo", "photo"]
  };
  function mix(list) {
    var fams = [], byF = {}, projs = [], count = {}, seen = {};
    list.forEach(function (d) {
      var k = d.familyId || d.id;
      if (!byF[k]) { byF[k] = { p: d.projectId, tpl: d.tpl, th: (TONE[d.tpl] || [])[d.layout || 0] || d.theme, ds: [] }; fams.push(byF[k]); if (projs.indexOf(d.projectId) < 0) projs.push(d.projectId); count[d.projectId] = (count[d.projectId] || 0) + 1; }
      byF[k].ds.push(d);
    });
    fams.forEach(function (f) { var i = seen[f.p] = (seen[f.p] || 0) + 1; f.pos = (i - 1 + (projs.indexOf(f.p) * 0.618 + 0.3) % 1) / count[f.p]; });
    var left = fams.slice().sort(function (a, b) { return a.pos - b.pos; }), out = [], last = null;
    var tests = [function (f) { return f.p !== last.p && f.tpl !== last.tpl && f.th !== last.th; }, function (f) { return f.p !== last.p && f.tpl !== last.tpl; }, function (f) { return f.p !== last.p; }];
    while (left.length) {
      var pick = 0;
      if (last) {
        search: for (var t = 0; t < tests.length; t++) for (var c = 0; c < Math.min(6, left.length); c++) {
          var f = left[c], first = true;
          for (var e = 0; e < c; e++) if (left[e].p === f.p) { first = false; break; } // a project's work keeps its own order
          if (first && tests[t](f)) { pick = c; break search; }
        }
      }
      last = left.splice(pick, 1)[0]; out.push(last);
    }
    var flat = []; out.forEach(function (f) { f.ds.forEach(function (d) { flat.push(d); }); });
    return flat;
  }

  T.mix = mix;
  T.seed = seed;
  T.seedThumbs = { dir: "assets/seed/tk-", n: 73 };
})();

} catch (e) { console.warn("TEKEX examples.js didn't load", e); }

/* ---- templates.html and library/manifest.json ---- */
if (window.HS_TEKEX) { window.HS_TEKEX.markupHtml = "<!-- TEKEX templates (assets/tekex/pack.js and its parts). One generic list of elements, in drawing order:\n     boxes and keylines, brand marks (drawn in the ink through a mask), brand pictures, the person's pictures, and words. -->\n<sc-if value=\"{{ a.t_on }}\">\n  <div style=\"{{ a.t_frame }}\">\n    <sc-for list=\"{{ a.t_els }}\" as=\"el\">\n      <sc-if value=\"{{ el.isBox }}\"><div style=\"{{ el.style }}\"></div></sc-if>\n      <sc-if value=\"{{ el.isMask }}\"><div style=\"{{ el.style }}\" role=\"img\" aria-label=\"{{ el.label }}\"></div></sc-if>\n      <sc-if value=\"{{ el.isPic }}\"><img sc-camel-src=\"{{ el.src }}\" alt=\"\" style=\"{{ el.style }}\" /></sc-if>\n      <sc-if value=\"{{ el.isSlot }}\"><div data-slot=\"{{ el.slot }}\" style=\"{{ el.style }}\"><sc-if value=\"{{ el.hasImg }}\"><img sc-camel-src=\"{{ el.imgSrc }}\" alt=\"\" style=\"{{ el.imgStyle }}\" /></sc-if><sc-if value=\"{{ !el.hasImg }}\"><div class=\"ph\" data-guide=\"1\"><span>{{ el.label }}</span></div></sc-if></div></sc-if>\n      <sc-if value=\"{{ el.isText }}\"><span style=\"{{ el.style }}\"><sc-for list=\"{{ el.runs }}\" as=\"ru\"><span style=\"{{ ru.style }}\">{{ ru.t }}</span></sc-for></span></sc-if>\n      <sc-if value=\"{{ el.isField }}\"><span data-field=\"{{ el.field }}\" style=\"{{ el.style }}\"><sc-for list=\"{{ el.runs }}\" as=\"ru\"><span style=\"{{ ru.style }}\">{{ ru.t }}</span></sc-for></span></sc-if>\n      <sc-if value=\"{{ el.isFit }}\"><span data-field=\"{{ el.field }}\" data-fit=\"{{ el.fit }}\" style=\"{{ el.style }}\"><sc-for list=\"{{ el.runs }}\" as=\"ru\"><span style=\"{{ ru.style }}\">{{ ru.t }}</span></sc-for></span></sc-if>\n    </sc-for>\n  </div>\n</sc-if>\n";
  window.HS_TEKEX.library = [{"id":"tkl-aj-coetzee-cutout","name":"AJ Coetzee, Summit; TEKEX Podcast #3 guest (cut-out; named left-to-right from the cover, check)","src":"assets/tekex/library/speakers/aj-coetzee-cutout.webp","group":"Speakers","w":2000,"h":1951,"cut":true,"source":"figma mNSDBhKxUDNbgyCuBeK4ZT 1:5 (podcast cover; layers 2:7 / 2:8)"},{"id":"tkl-andy-robins-rathbones","name":"Andy Robins, Rathbones; sponsor post portrait","src":"assets/tekex/library/speakers/andy-robins-rathbones.webp","group":"Speakers","w":1080,"h":1080,"cut":false,"source":"figma rVWbcVBLtLKYvbMFFs8XZV 9061:92"},{"id":"tkl-ben-dryden-cutout","name":"Ben Dryden, Summit; TEKEX Podcast #3 guest (cut-out; named left-to-right from the cover, check)","src":"assets/tekex/library/speakers/ben-dryden-cutout.webp","group":"Speakers","w":2000,"h":1633,"cut":true,"source":"figma mNSDBhKxUDNbgyCuBeK4ZT 1:5 (podcast cover; layers 2:7 / 2:8)"},{"id":"tkl-carol-glover-cutout","name":"Carol Glover, Vice President, Chamber of Commerce; TEKEX IOM #3 panellist (cut-out)","src":"assets/tekex/library/speakers/carol-glover-cutout.webp","group":"Speakers","w":998,"h":1269,"cut":true,"source":"figma GR5Bd2WU3HI3IYfwSe9ilP 12011:1318"},{"id":"tkl-chris-lee-cutout","name":"Chris Lee, TEKEX #36 speaker (cut-out)","src":"assets/tekex/library/speakers/chris-lee-cutout.webp","group":"Speakers","w":1076,"h":1135,"cut":true,"source":"figma D2H9Lf2gvm0m4j7ORsUmaD 6001:540"},{"id":"tkl-chris-sheldrick-cutout","name":"Chris Sheldrick, TEKEX #36 speaker (cut-out)","src":"assets/tekex/library/speakers/chris-sheldrick-cutout.webp","group":"Speakers","w":2000,"h":1963,"cut":true,"source":"figma D2H9Lf2gvm0m4j7ORsUmaD 6001:273"},{"id":"tkl-claire-owen-cutout","name":"Claire Owen, TEKEX #35 speaker (cut-out)","src":"assets/tekex/library/speakers/claire-owen-cutout.webp","group":"Speakers","w":1246,"h":2000,"cut":true,"source":"figma EpQlazaPNN518sycKxGz6w 2003:5487"},{"id":"tkl-fred-kalinke-cutout","name":"Fred Kalinke, TEKEX #36 speaker (cut-out)","src":"assets/tekex/library/speakers/fred-kalinke-cutout.webp","group":"Speakers","w":1566,"h":1842,"cut":true,"source":"figma D2H9Lf2gvm0m4j7ORsUmaD 6001:607"},{"id":"tkl-gus-fraser","name":"Gus Fraser, TEKEX #34 speaker (photo)","src":"assets/tekex/library/speakers/gus-fraser.webp","group":"Speakers","w":1339,"h":1205,"cut":false,"source":"figma FM3l7K1nHbIAyi5nKCMw9K 5:134"},{"id":"tkl-guy-templer","name":"Guy Templer, Chair, Junior Achievement; TEKEX IOM #3 panellist (black and white)","src":"assets/tekex/library/speakers/guy-templer.webp","group":"Speakers","w":2000,"h":1500,"cut":false,"source":"figma GR5Bd2WU3HI3IYfwSe9ilP 12011:658"},{"id":"tkl-jayne-sibley-cutout","name":"Jayne Sibley, TEKEX #35 speaker (cut-out, small original)","src":"assets/tekex/library/speakers/jayne-sibley-cutout.webp","group":"Speakers","w":291,"h":483,"cut":true,"source":"figma EpQlazaPNN518sycKxGz6w 2003:1822"},{"id":"tkl-jen-lothian-cutout","name":"Jen Lothian, TEKEX #36 speaker (cut-out)","src":"assets/tekex/library/speakers/jen-lothian-cutout.webp","group":"Speakers","w":1634,"h":1759,"cut":true,"source":"figma D2H9Lf2gvm0m4j7ORsUmaD 6001:679"},{"id":"tkl-jenson-artus","name":"Jenson Artus, Lead Isle of Man, Director MGS; TEKEX IOM #3 panellist","src":"assets/tekex/library/speakers/jenson-artus.webp","group":"Speakers","w":1336,"h":2000,"cut":false,"source":"figma GR5Bd2WU3HI3IYfwSe9ilP 12011:1368"},{"id":"tkl-lauren-perchard-rees-cutout","name":"Lauren Perchard-Rees, TEKEX #35 speaker (cut-out)","src":"assets/tekex/library/speakers/lauren-perchard-rees-cutout.webp","group":"Speakers","w":1340,"h":2000,"cut":true,"source":"figma EpQlazaPNN518sycKxGz6w 2003:5490"},{"id":"tkl-lindsay-de-sausmarez-cutout","name":"Lindsay de Sausmarez, TEKEX #35 speaker (cut-out)","src":"assets/tekex/library/speakers/lindsay-de-sausmarez-cutout.webp","group":"Speakers","w":442,"h":1003,"cut":true,"source":"figma EpQlazaPNN518sycKxGz6w 2015:902"},{"id":"tkl-louis-pike-cutout","name":"Louis Pike, IoD; TEKEX post 43 (cut-out, small original)","src":"assets/tekex/library/speakers/louis-pike-cutout.webp","group":"Speakers","w":449,"h":512,"cut":true,"source":"figma E7viRv163FwdwvSYYleNkD 15040:1938"},{"id":"tkl-lyle-wraxall","name":"Lyle Wraxall, CEO, Digital Isle of Man; TEKEX IOM #3 panellist (black and white)","src":"assets/tekex/library/speakers/lyle-wraxall.webp","group":"Speakers","w":2000,"h":1500,"cut":false,"source":"figma GR5Bd2WU3HI3IYfwSe9ilP 12011:608"},{"id":"tkl-matt-tabb-cutout","name":"Matt Tabb, BDO; partner post (cut-out)","src":"assets/tekex/library/speakers/matt-tabb-cutout.webp","group":"Speakers","w":1713,"h":2000,"cut":true,"source":"figma gyoY3wOZTz7a8jOWCtZySD 2028:619"},{"id":"tkl-millie-venner-cutout","name":"Millie Venner, TEKEX #35 speaker (cut-out)","src":"assets/tekex/library/speakers/millie-venner-cutout.webp","group":"Speakers","w":1147,"h":2000,"cut":true,"source":"figma EpQlazaPNN518sycKxGz6w 2003:5488"},{"id":"tkl-nyx-redondo","name":"Nyx Redondo, TEKEX #34 speaker (photo)","src":"assets/tekex/library/speakers/nyx-redondo.webp","group":"Speakers","w":1254,"h":1373,"cut":false,"source":"figma FM3l7K1nHbIAyi5nKCMw9K 0:77"},{"id":"tkl-nyx-redondo-cutout","name":"Nyx Redondo, TEKEX #34 speaker (cut-out)","src":"assets/tekex/library/speakers/nyx-redondo-cutout.webp","group":"Speakers","w":731,"h":933,"cut":true,"source":"figma FM3l7K1nHbIAyi5nKCMw9K 0:12"},{"id":"tkl-richard-tavernor-cutout","name":"Richard Tavernor, TEKEX #36 speaker (cut-out)","src":"assets/tekex/library/speakers/richard-tavernor-cutout.webp","group":"Speakers","w":1822,"h":2000,"cut":true,"source":"figma D2H9Lf2gvm0m4j7ORsUmaD 6001:605"},{"id":"tkl-rus-newton-cutout","name":"Rus Newton, TEKEX #36 speaker (cut-out)","src":"assets/tekex/library/speakers/rus-newton-cutout.webp","group":"Speakers","w":734,"h":1080,"cut":true,"source":"figma D2H9Lf2gvm0m4j7ORsUmaD 6001:680"},{"id":"tkl-steve-billinghurst","name":"Steve Billinghurst, Chair, IoD; TEKEX IOM #3 panellist","src":"assets/tekex/library/speakers/steve-billinghurst.webp","group":"Speakers","w":1753,"h":2000,"cut":false,"source":"figma GR5Bd2WU3HI3IYfwSe9ilP 12011:758"},{"id":"tkl-tim-huelin","name":"Tim Huelin, Founder and CEO, Daysium; TEKEX #34 speaker (photo)","src":"assets/tekex/library/speakers/tim-huelin.webp","group":"Speakers","w":2000,"h":1333,"cut":false,"source":"figma FM3l7K1nHbIAyi5nKCMw9K 4:68"},{"id":"tkl-tom-langford-cutout","name":"Tom Langford, speaker at the AI Sprint events in Guernsey (cut-out)","src":"assets/tekex/library/speakers/tom-langford-cutout.webp","group":"Speakers","w":1046,"h":1318,"cut":true,"source":"figma DpZFCKuSXG7GCgOCYMYYWg 10011:1926"},{"id":"tkl-tom-ogden","name":"Tom Ogden, TEKEX #34 speaker (photo)","src":"assets/tekex/library/speakers/tom-ogden.webp","group":"Speakers","w":1565,"h":1294,"cut":false,"source":"figma FM3l7K1nHbIAyi5nKCMw9K 5:68"},{"id":"tkl-audience-in-hall","name":"TEKEX event audience in a large hall, seen from above","src":"assets/tekex/library/events/audience-in-hall.webp","group":"Events","w":2000,"h":1223,"cut":false,"source":"https://www.tekex.co/about"},{"id":"tkl-ed-prow-and-jenson-artus","name":"Ed Prow and Jenson Artus at a TEKEX event","src":"assets/tekex/library/events/ed-prow-and-jenson-artus.webp","group":"Events","w":2000,"h":1126,"cut":false,"source":"https://www.tekex.co/journal"},{"id":"tkl-event-artwork-ai-sprint-guernsey","name":"TEKEX AI Sprint Guernsey artwork: the All-in and TEKEX marks on a green gradient, with the session title and date","src":"assets/tekex/library/events/event-artwork-ai-sprint-guernsey.webp","group":"Events","w":1880,"h":940,"cut":false,"source":"https://www.tekex.co/events"},{"id":"tkl-event-artwork-bootcamp-special","name":"TEKEX Bootcamp Special event artwork","src":"assets/tekex/library/events/event-artwork-bootcamp-special.webp","group":"Events","w":1200,"h":600,"cut":false,"source":"https://www.tekex.co/events"},{"id":"tkl-event-artwork-gsy-4","name":"TEKEX Gsy #4 event artwork","src":"assets/tekex/library/events/event-artwork-gsy-4.webp","group":"Events","w":1200,"h":600,"cut":false,"source":"https://www.tekex.co/events"},{"id":"tkl-event-artwork-gsy-5","name":"TEKEX Gsy #5 event artwork","src":"assets/tekex/library/events/event-artwork-gsy-5.webp","group":"Events","w":940,"h":470,"cut":false,"source":"https://www.tekex.co/events"},{"id":"tkl-event-artwork-health-innovation-jersey","name":"Health Innovation Jersey event artwork","src":"assets/tekex/library/events/event-artwork-health-innovation-jersey.webp","group":"Events","w":1880,"h":940,"cut":false,"source":"https://www.tekex.co/events"},{"id":"tkl-event-artwork-innovation-breakfast-iom","name":"Innovation Breakfast: Isle of Man event artwork","src":"assets/tekex/library/events/event-artwork-innovation-breakfast-iom.webp","group":"Events","w":1200,"h":600,"cut":false,"source":"https://www.tekex.co/events"},{"id":"tkl-event-artwork-iom-1-launch","name":"TEKEX IOM #1: Isle of Man launch event artwork","src":"assets/tekex/library/events/event-artwork-iom-1-launch.webp","group":"Events","w":1200,"h":600,"cut":false,"source":"https://www.tekex.co/events"},{"id":"tkl-event-artwork-iom-2","name":"TEKEX IOM #2 event artwork","src":"assets/tekex/library/events/event-artwork-iom-2.webp","group":"Events","w":1200,"h":600,"cut":false,"source":"https://www.tekex.co/events"},{"id":"tkl-event-artwork-iom-3","name":"TEKEX IOM #3 key art: the letters T-E-K-E-X carved in rock at sunset, two figures standing on top, with the partner logos beneath","src":"assets/tekex/library/events/event-artwork-iom-3.webp","group":"Events","w":2000,"h":1000,"cut":false,"source":"https://www.tekex.co/events"},{"id":"tkl-event-artwork-summer-social","name":"TEKEX Summer Social event artwork","src":"assets/tekex/library/events/event-artwork-summer-social.webp","group":"Events","w":1200,"h":600,"cut":false,"source":"https://www.tekex.co/events"},{"id":"tkl-event-artwork-summer-sundown-social","name":"Summer Sundown Social Jam Night event artwork","src":"assets/tekex/library/events/event-artwork-summer-sundown-social.webp","group":"Events","w":1880,"h":940,"cut":false,"source":"https://www.tekex.co/events"},{"id":"tkl-event-artwork-tekex-12-first-birthday","name":"TEKEX #12: First birthday event artwork (one example of the 2019-style #1 to #22 series)","src":"assets/tekex/library/events/event-artwork-tekex-12-first-birthday.webp","group":"Events","w":1880,"h":940,"cut":false,"source":"https://www.tekex.co/events"},{"id":"tkl-event-artwork-tekex-26","name":"TEKEX #26: Happier Healthier Humans event artwork","src":"assets/tekex/library/events/event-artwork-tekex-26.webp","group":"Events","w":1200,"h":600,"cut":false,"source":"https://www.tekex.co/events"},{"id":"tkl-event-artwork-tekex-27","name":"TEKEX #27 event artwork","src":"assets/tekex/library/events/event-artwork-tekex-27.webp","group":"Events","w":1880,"h":940,"cut":false,"source":"https://www.tekex.co/events"},{"id":"tkl-event-artwork-tekex-28-bootcamp-2024","name":"TEKEX #28: Bootcamp 2024 event artwork","src":"assets/tekex/library/events/event-artwork-tekex-28-bootcamp-2024.webp","group":"Events","w":1880,"h":940,"cut":false,"source":"https://www.tekex.co/events"},{"id":"tkl-event-artwork-tekex-29","name":"TEKEX #29 event artwork","src":"assets/tekex/library/events/event-artwork-tekex-29.webp","group":"Events","w":1880,"h":940,"cut":false,"source":"https://www.tekex.co/events"},{"id":"tkl-event-artwork-tekex-30-female-founders","name":"TEKEX #30: Female Founders event artwork","src":"assets/tekex/library/events/event-artwork-tekex-30-female-founders.webp","group":"Events","w":1880,"h":940,"cut":false,"source":"https://www.tekex.co/events"},{"id":"tkl-event-artwork-tekex-31","name":"TEKEX #31 event artwork","src":"assets/tekex/library/events/event-artwork-tekex-31.webp","group":"Events","w":1880,"h":940,"cut":false,"source":"https://www.tekex.co/events"},{"id":"tkl-event-artwork-tekex-32","name":"TEKEX #32 event artwork","src":"assets/tekex/library/events/event-artwork-tekex-32.webp","group":"Events","w":1200,"h":600,"cut":false,"source":"https://www.tekex.co/events"},{"id":"tkl-event-artwork-tekex-33","name":"TEKEX #33 event artwork","src":"assets/tekex/library/events/event-artwork-tekex-33.webp","group":"Events","w":1200,"h":600,"cut":false,"source":"https://www.tekex.co/events"},{"id":"tkl-event-artwork-tekex-34","name":"TEKEX #34 event artwork","src":"assets/tekex/library/events/event-artwork-tekex-34.webp","group":"Events","w":1200,"h":600,"cut":false,"source":"https://www.tekex.co/events"},{"id":"tkl-event-artwork-tekex-35-female-founders","name":"TEKEX #35: Female Founders event artwork","src":"assets/tekex/library/events/event-artwork-tekex-35-female-founders.webp","group":"Events","w":1200,"h":600,"cut":false,"source":"https://www.tekex.co/events"},{"id":"tkl-event-artwork-tekex-36","name":"TEKEX #36 event artwork","src":"assets/tekex/library/events/event-artwork-tekex-36.webp","group":"Events","w":1200,"h":600,"cut":false,"source":"https://www.tekex.co/events"},{"id":"tkl-event-artwork-tekex-gen-1","name":"TEKEX Gen #1 event artwork","src":"assets/tekex/library/events/event-artwork-tekex-gen-1.webp","group":"Events","w":1200,"h":600,"cut":false,"source":"https://www.tekex.co/events"},{"id":"tkl-event-artwork-tekexmas-2023","name":"TEKEXmas 2023 event artwork","src":"assets/tekex/library/events/event-artwork-tekexmas-2023.webp","group":"Events","w":1880,"h":940,"cut":false,"source":"https://www.tekex.co/events"},{"id":"tkl-health-innovation-jersey-audience","name":"TEKEX Health Innovation Jersey audience applauding a speaker","src":"assets/tekex/library/events/health-innovation-jersey-audience.webp","group":"Events","w":2000,"h":1126,"cut":false,"source":"https://www.tekex.co/"},{"id":"tkl-jenson-artus-appointment","name":"Jenson Artus with a colleague at a TEKEX event (appointment post 82)","src":"assets/tekex/library/events/jenson-artus-appointment.webp","group":"Events","w":2000,"h":2000,"cut":false,"source":"figma Td4QcZxLv3dJ32UZfDEONG 13039:50"},{"id":"tkl-last-friday-club-beer-and-swirl","name":"Last Friday Club: pint glass with violet and orange swirl, transparent","src":"assets/tekex/library/events/last-friday-club-beer-and-swirl.webp","group":"Events","w":784,"h":961,"cut":false,"source":"figma xzEjCjaksdPa8C4vxWZdhW 11006:354"},{"id":"tkl-last-friday-club-hand-and-pint","name":"Last Friday Club: hand holding a pint, transparent","src":"assets/tekex/library/events/last-friday-club-hand-and-pint.webp","group":"Events","w":613,"h":1145,"cut":false,"source":"figma xzEjCjaksdPa8C4vxWZdhW 11006:397"},{"id":"tkl-last-friday-club-tekex-drink-from-above","name":"Last Friday Club: drink from above with a TEKEX lemon slice, transparent","src":"assets/tekex/library/events/last-friday-club-tekex-drink-from-above.webp","group":"Events","w":672,"h":680,"cut":false,"source":"figma xzEjCjaksdPa8C4vxWZdhW 11025:144"},{"id":"tkl-last-friday-club-tekex-pint","name":"Last Friday Club: TEKEX-branded pint glass on black","src":"assets/tekex/library/events/last-friday-club-tekex-pint.webp","group":"Events","w":1254,"h":1254,"cut":false,"source":"figma xzEjCjaksdPa8C4vxWZdhW 11008:47"},{"id":"tkl-podcast-3-studio","name":"TEKEX Podcast #3 recording, studio with host and guests (Summit: Deals from A to Z)","src":"assets/tekex/library/events/podcast-3-studio.webp","group":"Events","w":2000,"h":1125,"cut":false,"source":"figma mNSDBhKxUDNbgyCuBeK4ZT 4:89"},{"id":"tkl-tekex-35-female-founders-audience","name":"TEKEX #35 Female Founders audience at the C5 hub","src":"assets/tekex/library/events/tekex-35-female-founders-audience.webp","group":"Events","w":2000,"h":1500,"cut":false,"source":"figma E7viRv163FwdwvSYYleNkD 13039:1067; caption from https://www.tekex.co/journal"},{"id":"tkl-3d-blob-on-black","name":"Iridescent 3D blob on black (Understanding Tekex ad campaign)","src":"assets/tekex/library/graphics/3d-blob-on-black.webp","group":"Graphics","w":1560,"h":964,"cut":false,"source":"figma 7mn8qElo8GZbxg4GzmRmIB 4181:378"},{"id":"tkl-3d-bubbles-on-black","name":"Iridescent 3D bubble cluster on black (Understanding Tekex ad campaign)","src":"assets/tekex/library/graphics/3d-bubbles-on-black.webp","group":"Graphics","w":1861,"h":1077,"cut":false,"source":"figma 7mn8qElo8GZbxg4GzmRmIB 4181:378"},{"id":"tkl-3d-coil-on-black","name":"Iridescent 3D coil on black (Understanding Tekex ad campaign)","src":"assets/tekex/library/graphics/3d-coil-on-black.webp","group":"Graphics","w":1476,"h":1013,"cut":false,"source":"figma 7mn8qElo8GZbxg4GzmRmIB 4181:378"},{"id":"tkl-3d-firework-on-black","name":"Iridescent 3D firework burst on black (Understanding Tekex ad campaign)","src":"assets/tekex/library/graphics/3d-firework-on-black.webp","group":"Graphics","w":1488,"h":987,"cut":false,"source":"figma 7mn8qElo8GZbxg4GzmRmIB 4181:378"},{"id":"tkl-3d-glass-cross","name":"3D clear glass cross, transparent (Post 81)","src":"assets/tekex/library/graphics/3d-glass-cross.webp","group":"Graphics","w":973,"h":966,"cut":false,"source":"figma DpZFCKuSXG7GCgOCYMYYWg 10065:9"},{"id":"tkl-3d-glass-ring","name":"3D clear glass ring, transparent (Post 81 agenda background study)","src":"assets/tekex/library/graphics/3d-glass-ring.webp","group":"Graphics","w":969,"h":970,"cut":false,"source":"figma DpZFCKuSXG7GCgOCYMYYWg 10065:9"},{"id":"tkl-3d-glass-twisted-square","name":"3D clear glass twisted square, transparent (Post 81)","src":"assets/tekex/library/graphics/3d-glass-twisted-square.webp","group":"Graphics","w":977,"h":978,"cut":false,"source":"figma DpZFCKuSXG7GCgOCYMYYWg 10065:9"},{"id":"tkl-3d-inflated-cross-pink-violet","name":"3D inflated cross, pink to violet, transparent (Post 81)","src":"assets/tekex/library/graphics/3d-inflated-cross-pink-violet.webp","group":"Graphics","w":919,"h":948,"cut":false,"source":"figma DpZFCKuSXG7GCgOCYMYYWg 10065:13"},{"id":"tkl-3d-pink-arc","name":"3D soft pink arc, transparent (Post 81)","src":"assets/tekex/library/graphics/3d-pink-arc.webp","group":"Graphics","w":861,"h":570,"cut":false,"source":"figma DpZFCKuSXG7GCgOCYMYYWg 10065:13"},{"id":"tkl-3d-pink-capsule","name":"3D soft pink capsule, transparent (Post 81)","src":"assets/tekex/library/graphics/3d-pink-capsule.webp","group":"Graphics","w":600,"h":734,"cut":false,"source":"figma DpZFCKuSXG7GCgOCYMYYWg 10065:13"},{"id":"tkl-3d-pink-x","name":"3D soft pink X, transparent (Post 81)","src":"assets/tekex/library/graphics/3d-pink-x.webp","group":"Graphics","w":681,"h":721,"cut":false,"source":"figma DpZFCKuSXG7GCgOCYMYYWg 10065:13"},{"id":"tkl-3d-ring-on-black","name":"Iridescent 3D ring on black (Understanding Tekex ad campaign)","src":"assets/tekex/library/graphics/3d-ring-on-black.webp","group":"Graphics","w":1060,"h":616,"cut":false,"source":"figma 7mn8qElo8GZbxg4GzmRmIB 4181:378"},{"id":"tkl-3d-spiky-star-on-black","name":"Iridescent 3D spiky star on black (Understanding Tekex ad campaign)","src":"assets/tekex/library/graphics/3d-spiky-star-on-black.webp","group":"Graphics","w":1917,"h":1085,"cut":false,"source":"figma 7mn8qElo8GZbxg4GzmRmIB 4181:378"},{"id":"tkl-3d-star-ring-on-black","name":"Iridescent 3D star ring on black (Understanding Tekex ad campaign)","src":"assets/tekex/library/graphics/3d-star-ring-on-black.webp","group":"Graphics","w":1618,"h":1064,"cut":false,"source":"figma 7mn8qElo8GZbxg4GzmRmIB 4181:378"},{"id":"tkl-dark-bubbles","name":"Dark glass bubbles background (Health Innovation Jersey last-chance post)","src":"assets/tekex/library/graphics/dark-bubbles.webp","group":"Graphics","w":1918,"h":1074,"cut":false,"source":"figma 2yg5mpDlpBDkLYqxqAVllM 5:124"},{"id":"tkl-doodad-blue-z-on-peach","name":"Doodad: blue 3D Z on peach #FEDC8A, cropped by its frame (Wrapped, Fundraising ground)","src":"assets/tekex/library/graphics/doodad-blue-z-on-peach.webp","group":"Graphics","w":1236,"h":1290,"cut":false,"source":"figma SO455XNoL6vfqCKx0kVmSW 3:15631"},{"id":"tkl-doodad-multicolour-w-on-mint","name":"Doodad: multicolour 3D W on mint #D0FFBF (Events ground)","src":"assets/tekex/library/graphics/doodad-multicolour-w-on-mint.webp","group":"Graphics","w":1750,"h":1162,"cut":false,"source":"figma rVWbcVBLtLKYvbMFFs8XZV 9038:13400"},{"id":"tkl-doodad-orange-bolt-on-peach","name":"Doodad: orange and cream 3D bolt on peach #FEDC8A (Fundraising ground)","src":"assets/tekex/library/graphics/doodad-orange-bolt-on-peach.webp","group":"Graphics","w":1709,"h":1836,"cut":false,"source":"figma rVWbcVBLtLKYvbMFFs8XZV 9038:3197"},{"id":"tkl-doodad-white-z-on-lilac","name":"Doodad: soft white 3D Z on lilac #F0BFFF (News ground)","src":"assets/tekex/library/graphics/doodad-white-z-on-lilac.webp","group":"Graphics","w":1647,"h":1712,"cut":false,"source":"figma rVWbcVBLtLKYvbMFFs8XZV 9038:25142"},{"id":"tkl-doodad-white-zigzag-on-lilac","name":"Doodad: soft white and pink 3D zig-zag on lilac #F0BFFF (News ground)","src":"assets/tekex/library/graphics/doodad-white-zigzag-on-lilac.webp","group":"Graphics","w":1950,"h":1809,"cut":false,"source":"figma rVWbcVBLtLKYvbMFFs8XZV 9038:21071"},{"id":"tkl-mono-swirl-knot","name":"Black and white 3D knot, transparent","src":"assets/tekex/library/graphics/mono-swirl-knot.webp","group":"Graphics","w":800,"h":696,"cut":false,"source":"https://www.tekex.co/about"},{"id":"tkl-mono-swirl-z","name":"Black and white 3D Z, transparent","src":"assets/tekex/library/graphics/mono-swirl-z.webp","group":"Graphics","w":1600,"h":1469,"cut":false,"source":"https://www.tekex.co/"},{"id":"tkl-mono-swirl-zigzag","name":"Black and white 3D zig-zag, transparent","src":"assets/tekex/library/graphics/mono-swirl-zigzag.webp","group":"Graphics","w":1600,"h":1663,"cut":false,"source":"https://www.tekex.co/about"},{"id":"tkl-orange-tubes-on-cream","name":"Soft orange 3D tubes on cream (IOM Tekex 2 day-of-event background)","src":"assets/tekex/library/graphics/orange-tubes-on-cream.webp","group":"Graphics","w":541,"h":677,"cut":false,"source":"figma GR5Bd2WU3HI3IYfwSe9ilP 10002:82"},{"id":"tkl-orange-tubes-on-yellow","name":"Orange 3D tubes on yellow, cropped by its frame (IOM #3 day-of-event and ticket-sales background)","src":"assets/tekex/library/graphics/orange-tubes-on-yellow.webp","group":"Graphics","w":1458,"h":1458,"cut":false,"source":"figma lC1LSOeLB9zWDq8M25Udvy 8005:2724"},{"id":"tkl-soft-blur-pink-mint","name":"Soft blurred pink, white and mint gradient background, 4:5 (Post 81)","src":"assets/tekex/library/graphics/soft-blur-pink-mint.webp","group":"Graphics","w":1080,"h":1350,"cut":false,"source":"figma DpZFCKuSXG7GCgOCYMYYWg 10065:5"},{"id":"tkl-tekex-balloon-letters","name":"TEKEX in silver balloon letters, transparent (Wrapped)","src":"assets/tekex/library/graphics/tekex-balloon-letters.webp","group":"Graphics","w":2000,"h":455,"cut":false,"source":"figma SO455XNoL6vfqCKx0kVmSW 3:11859"},{"id":"tkl-tekex-letters-film-reel","name":"TEKEX letters on a film reel (generated image; event posts)","src":"assets/tekex/library/graphics/tekex-letters-film-reel.webp","group":"Graphics","w":2000,"h":2000,"cut":false,"source":"figma rVWbcVBLtLKYvbMFFs8XZV 9028:960"},{"id":"tkl-tekex-letters-microphone","name":"TEKEX letters on a black microphone (generated image; event posts)","src":"assets/tekex/library/graphics/tekex-letters-microphone.webp","group":"Graphics","w":2000,"h":2000,"cut":false,"source":"figma rVWbcVBLtLKYvbMFFs8XZV 9028:1204"},{"id":"tkl-tekex-letters-moon","name":"TEKEX letters on the moon (generated image; welcome post)","src":"assets/tekex/library/graphics/tekex-letters-moon.webp","group":"Graphics","w":2000,"h":2000,"cut":false,"source":"figma rVWbcVBLtLKYvbMFFs8XZV 9045:330"},{"id":"tkl-tekex-letters-mountain-road","name":"TEKEX letters over a mountain road (generated image; TEKEX #31 Founders, Film and New Frontiers)","src":"assets/tekex/library/graphics/tekex-letters-mountain-road.webp","group":"Graphics","w":2000,"h":2000,"cut":false,"source":"figma rVWbcVBLtLKYvbMFFs8XZV 9028:956"},{"id":"tkl-tekex-letters-on-fire","name":"TEKEX letters on fire (generated image; TEKEX #31 Founders, Film and New Frontiers)","src":"assets/tekex/library/graphics/tekex-letters-on-fire.webp","group":"Graphics","w":2000,"h":1143,"cut":false,"source":"figma rVWbcVBLtLKYvbMFFs8XZV 9028:850"},{"id":"tkl-tekex-letters-pink-clouds","name":"TEKEX letters in pink clouds (generated image; welcome post and Wrapped)","src":"assets/tekex/library/graphics/tekex-letters-pink-clouds.webp","group":"Graphics","w":2000,"h":2000,"cut":false,"source":"figma rVWbcVBLtLKYvbMFFs8XZV 9045:248"},{"id":"tkl-tekex-letters-pink-drip","name":"TEKEX letters in dripping pink (generated image; event posts)","src":"assets/tekex/library/graphics/tekex-letters-pink-drip.webp","group":"Graphics","w":2000,"h":1143,"cut":false,"source":"figma rVWbcVBLtLKYvbMFFs8XZV 9028:627"},{"id":"tkl-all-in","name":"All—in logo (AI Sprints Guernsey co-brand)","src":"assets/tekex/library/logos/all-in.svg","group":"Logos","w":257,"h":62,"cut":false,"source":"figma DpZFCKuSXG7GCgOCYMYYWg 10011:1969"},{"id":"tkl-bdo","name":"BDO logo (sponsor)","src":"assets/tekex/library/logos/bdo.svg","group":"Logos","w":283,"h":109,"cut":false,"source":"figma gyoY3wOZTz7a8jOWCtZySD 2028:398"},{"id":"tkl-c5-alliance","name":"C5 Alliance logo (sponsor)","src":"assets/tekex/library/logos/c5-alliance.svg","group":"Logos","w":172,"h":154,"cut":false,"source":"figma gyoY3wOZTz7a8jOWCtZySD 2028:403"},{"id":"tkl-digital-jersey","name":"Digital Jersey logo (partner)","src":"assets/tekex/library/logos/digital-jersey.svg","group":"Logos","w":137,"h":52,"cut":false,"source":"figma mNSDBhKxUDNbgyCuBeK4ZT 3:642 (supporters row)"},{"id":"tkl-pwc","name":"PwC logo (partner)","src":"assets/tekex/library/logos/pwc.svg","group":"Logos","w":59,"h":45,"cut":false,"source":"figma mNSDBhKxUDNbgyCuBeK4ZT 3:642 (supporters row)"},{"id":"tkl-rathbones","name":"Rathbones logo (sponsor)","src":"assets/tekex/library/logos/rathbones.svg","group":"Logos","w":877,"h":101,"cut":false,"source":"figma gyoY3wOZTz7a8jOWCtZySD 2028:450"},{"id":"tkl-rathbones-small","name":"Rathbones logo with emblem (compact lockup)","src":"assets/tekex/library/logos/rathbones-small.svg","group":"Logos","w":257,"h":26,"cut":false,"source":"figma rVWbcVBLtLKYvbMFFs8XZV 9061:92"},{"id":"tkl-red5-systems","name":"Red5 Systems logo (sponsor)","src":"assets/tekex/library/logos/red5-systems.svg","group":"Logos","w":352,"h":120,"cut":false,"source":"figma gyoY3wOZTz7a8jOWCtZySD 2028:414"},{"id":"tkl-tekex-health-innovation-jsy","name":"TEKEX Health Innovation JSY lockup","src":"assets/tekex/library/logos/tekex-health-innovation-jsy.svg","group":"Logos","w":526,"h":155,"cut":false,"source":"figma 2yg5mpDlpBDkLYqxqAVllM 5:126"},{"id":"tkl-the-oche-club","name":"The Oche Club logo (raster only in Figma)","src":"assets/tekex/library/logos/the-oche-club.webp","group":"Logos","w":2000,"h":656,"cut":false,"source":"figma rVWbcVBLtLKYvbMFFs8XZV 9052:160"},{"id":"tkl-wild-peak-holdings","name":"Wild Peak Holdings logo (sponsor)","src":"assets/tekex/library/logos/wild-peak-holdings.svg","group":"Logos","w":233,"h":154,"cut":false,"source":"figma gyoY3wOZTz7a8jOWCtZySD 2028:416"},{"id":"tkl-yoono","name":"Yoono logo (sponsor)","src":"assets/tekex/library/logos/yoono.svg","group":"Logos","w":517,"h":103,"cut":false,"source":"figma gyoY3wOZTz7a8jOWCtZySD 2028:401"}]; }
