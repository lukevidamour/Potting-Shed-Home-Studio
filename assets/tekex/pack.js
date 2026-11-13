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
      var HT = { yoono: 23, rathbones: 20, c5: 50, bdo: 37.5, wildpeak: 50, red5: 37.4 };
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
  T.fromBrief = function (r) {
    if (!r || !r.tpl) return r;
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
    var n0 = c.eventNumber, code = n0 ? "TEKEX #" + n0 : "TEKEX";
    if (tpl === "speaker" && on("tk-speaker")) { r.tpl = "tk-speaker"; r.layout = 0; r.copy = Object.assign(c, { eyebrow: (n0 ? "Tekex #" + n0 : "Tekex") + " Speaker:", role: role(c), person: c.name }); }
    else if (tpl === "event" && on("tk-event")) { r.tpl = "tk-event"; r.layout = 0; r.copy = Object.assign(c, { eyebrow: code, date: num || day, venue: when, label: n0 ? "EVENT#" + n0 : "EVENTS" }); }
    else if ((tpl === "listing" || tpl === "trio") && on("tk-lineup") && r.speakers && r.speakers.length) {
      var ed = n0 ? "#" + n0 : "", base = { edition: ed, date: num || day, venue: when, footLabel: "Speakers" };
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
})();
