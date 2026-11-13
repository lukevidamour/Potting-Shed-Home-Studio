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
  var nameAt = function (s) { var m = String(s || "").trim().match(/^((?:Dr|Prof|Sir|Dame)\.?\s+)?((?:[A-Z][a-z'’-]+|[A-Z]{2})(?:\s+(?:[A-Z][a-z'’-]+|de|van|von|le|la)){1,2})\b/); return m && !ROLEWORD.test(m[2]) ? (m[1] || "") + m[2] : ""; };
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
  // "Can you make a post saying…", "We need a speaker graphic for…", "Make something about…": the request, not the content
  var REQ = /^\s*(?:please\s+)?(?:(?:can|could|would)\s+you\s+|(?:we|i)\s+(?:need|want|would like)\s+|let'?s\s+|i'?d like\s+)?(?:(?:make|create|design|do|put together|draft|need|want)\s+)?(?:me\s+)?(?:(?:a|an|some)\s+)?(?:quick\s+)?(?:(?:post|graphic|card|tile|image|visual|design|something|announcement|social)\s+)?(?:(?:saying|about|for|announcing|that says|on|to say|showing)\s+)?(?:that\s+)?/i; // whole words only: "AI Sprint" keeps its A
  var content = function (t) { var c = String(t || "").replace(/^\s*(?:announcement|update|news|save the date)\s*[:–—-]\s*/i, "").replace(REQ, ""); c = c.replace(/^remind\s+(?:people|everyone|folks)\s+(?:that\s+)?/i, ""); return c.length >= 4 ? c : String(t || ""); };
  function route(r, text) {
    var t = String(text || ""), say = content(t), c = r.copy = r.copy || {}, w = whenOf(c);
    var cm = t.match(/\b(TEKEX|IOM|JSY|GSY)\s?#\s?(\d+)/i), code = cm ? (/tekex/i.test(cm[1]) ? "TEKEX#" + cm[2] : cm[1].toUpperCase() + "#" + cm[2]) : (c.eventNumber ? "TEKEX#" + c.eventNumber : "");
    var put = function (tpl, L, copy, title, said) {
      if (typeof TPL !== "undefined" && !TPL[tpl]) return false;
      var o = Object.assign({}, T.exampleFor(tpl, L) || {});
      ["name", "person", "quote"].forEach(function (k) { if (!(copy && copy[k])) delete o[k]; }); // never someone else's words or face
      r.tpl = tpl; r.layout = L; r.copy = Object.assign(o, copy || {}); r.title = title; r.said = said; r.set = null; r.speakers = []; return true;
    };
    var NAME = "((?:Dr\\.?\\s+)?(?:[A-Z][a-z'’-]+|[A-Z]{2})(?:\\s+[A-Z][a-zA-Z'’-]+){1,2})";
    var quoted = t.match(/[“"]([^”"]{6,})[”"]/), who = (t.match(new RegExp("\\b(?:from|by|says|said)\\s+" + NAME)) || t.match(new RegExp("[”\"]\\s*[-–—,]\\s*" + NAME)) || [])[1];
    if (quoted && who) return put("tk-statement", 1, { quote: quoted[1], name: who }, "Quote · " + who, ["a quote from " + who]);
    if (/\bpodcast\b/i.test(t)) {
      var ep = (t.match(/\b(?:episode|ep\.?|#)\s*(\d+)/i) || [])[1], hosts = T.peopleIn(t).map(function (p) { return p.name; });
      return put("tk-campaign", 4, { eyebrow: "Podcast" + (ep ? " #" + ep : ""), headline: quoted ? quoted[1] : "Episode title", name: hosts.join(" & ") }, "Podcast" + (ep ? " #" + ep : "") + " cover", ["a podcast cover" + (hosts.length ? " with " + hosts.join(" & ") : "")]);
    }
    if (quoted && (who || /\bquote\b/i.test(t))) return put("tk-statement", 1, { quote: quoted[1], name: who || "" }, "Quote" + (who ? " · " + who : ""), ["a quote" + (who ? " from " + who : "")]);
    // fundraising: a funding round, or a raise with money in it ("Io-Co raises £2M"); "TEKEX lands in Guernsey" is news
    if (/\b(funding round|series [a-d]\b|seed round|pre-seed|angel round|investment round)\b/i.test(t) || (/\b(rais(es|ed|ing)|clos(es|ed|ing)|secur(es|ed|ing)|land(s|ed)|bag(s|ged))\b/i.test(t) && /[£$€]\s?\d|\d\s?(?:k|m|bn|million|billion)\b/i.test(t)))
      return put("tk-fundraising", 1, { headline: cap(tidy(say.replace(/^(fundraising|news)\s*[:–—-]\s*/i, ""))) }, tidy(say).slice(0, 48), ["a fundraising announcement"]);
    // a stat is a number followed by what it counts ("1,000+ ecosystem members"), or any number when the brief says "stat";
    // never a date ("3 Dec")
    var MON = /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i;
    var st = t.match(/([£$€]?\d[\d,.]*\s*(?:k|m|bn|million|billion)?\+?)\s+((?:[a-z]+\s+)?(?:members|events|founders|investors|startups|attendees|connections|introductions|deals|raised)\b[^.,;:]*)/i)
      || (/\bstats?\b/i.test(t) ? t.match(/([£$€]?\d[\d,.]*\s*(?:k|m|bn|million|billion)?\+?)\s+([A-Za-z][^.,;:]*)/i) : null);
    if (st && MON.test(st[2])) st = null;
    if (st && !/\b(raises|raised \w+ in|series [a-d]|round)\b/i.test(t))
      return put("tk-statement", 2, { stat: st[1].replace(/\s+/g, ""), headline: cap(tidy(st[2])) }, "Stat · " + st[1].trim(), ["a stat: " + st[1].trim()]);
    if (/\b(last chance|final call|last few tickets|selling fast|few tickets left|last call)\b/i.test(t)) return put("tk-countdown", 2, { eyebrow: code ? code.toUpperCase() : /health innovation/i.test(t) ? "HEALTH INNOVATION JSY" : "TEKEX", headline: "Last chance\nto get your tickets", body: "" }, (code || (/health innovation/i.test(t) ? "Health Innovation" : "TEKEX")) + " · Last chance", ["last chance for tickets"]);
    if (/\bhealth innovation\b/i.test(t)) return put("tk-series", 3, { date: w.num || w.day || "", time: w.time || "", venue: c.venue || "" }, "Health Innovation" + (w.day ? " · " + w.day : ""), ["Health Innovation", w.line].filter(Boolean));
    if (/\blast friday( club)?\b/i.test(t)) return /\btomorrow\b/i.test(t)
      ? put("tk-series", 2, { date: w.day || "", time: c.startTime || "17:00" }, "Last Friday Club · Tomorrow", ["Last Friday Club, tomorrow"])
      : put("tk-series", 0, { date: w.long || "" }, "Last Friday Club" + (w.long ? " · " + w.long : ""), ["Last Friday Club", w.long].filter(Boolean));
    if (/\btickets?\b/i.test(t) && /\b(on sale|available|out now|live|book now|released|booking)\b/i.test(t)) return put("tk-countdown", 1, { code: code || "TEKEX", eyebrow: "TICKETS ON SALE NOW", date: w.num || "", body: /^IOM/.test(code) ? "Global Innovation. Isle of Man Opportunity." : "" }, (code || "TEKEX") + " tickets on sale", ["tickets on sale", w.day].filter(Boolean));
    if (/\b(tonight|tomorrow)\b/i.test(t) && (code || /\b(event|tekex)\b/i.test(t))) { var when = /\btonight\b/i.test(t) ? "TONIGHT" : "TOMORROW"; return put("tk-countdown", 0, { code: code || "TEKEX", headline: when, venue: c.venue || "" }, (code || "TEKEX") + " " + when.toLowerCase(), [(code || "TEKEX") + " is " + when.toLowerCase()]); }
    var pn = (PARTNERS.filter(function (p) { return p[1].test(t); })[0] || [""])[0];
    if ((/\b(welcome|welcomes|welcoming|joins?|joined|newest)\b/i.test(t) && /\b(partner|sponsor|supporter)s?\b/i.test(t)) || (pn && /\b(sponsor(s|ing|ed)?|supporting|backing|backs|partner(s|ing|ed)? with)\b/i.test(t))) {
      if (!pn) { var nm = t.match(/\b(?:welcome|welcomes|welcoming)\s+([A-Z][\w&/.-]*(?:\s+[A-Z][\w&/.-]*){0,3})/); pn = nm ? nm[1] : ""; }
      return pn === "Rathbones" ? put("tk-sponsor", 0, { partner: "Rathbones", headline: "Rathbones proudly supporting TEKEX" }, "Rathbones proudly supporting TEKEX", ["welcoming Rathbones"])
        : put("tk-sponsor", 4, { headline: pn ? "Welcome, " + pn : "Innovation starts here", body: pn ? "Our newest partner" : "Welcome to TEKEX" }, "Welcome" + (pn ? ", " + pn : ""), ["welcoming " + (pn || "a new partner")]);
    }
    if (/\b(thank|thanks|thank you|grateful)\b/i.test(t) && /\b(partner|sponsor|support(ed|ers?|ing)?|collaborator|everyone)s?\b/i.test(t)) return put("tk-sponsor", 3, { headline: "Thanks to our collaborators" }, "Thanks to our collaborators", ["a thank you to everyone who supports TEKEX"]);
    if (/\bwhat is tekex\b/i.test(t)) return put("tk-campaign", 2, {}, "What is TEKEX?", ["What is TEKEX?"]);
    if (/\b(what can tekex do|this is tekex)\b/i.test(t)) return put("tk-campaign", 0, {}, "What can TEKEX do for you?", ["This is TEKEX"]);
    if (/\b(speak(er|ers|ing)|keynote|panellist|panelist)\b/i.test(t) && !/\bpodcast\b/i.test(t)) {
      var sp = t.match(new RegExp("\\b(?:for|introduce|introducing|meet|welcome|announce|announcing|with)\\s+" + NAME));
      if (sp) { var after = t.slice(t.indexOf(sp[1]) + sp[1].length), role = (after.match(/^\s*,\s*([^,]+?)(?:,|\s+(?:speaking|is speaking|at|on)\b|$)/) || [])[1] || "";
        r.tpl = "speaker"; c.name = sp[1]; c.person = sp[1]; c.role = role.replace(/^(our|the)\s+/i, "").replace(/\s+of\s+/i, ", "); c.company = ""; return false; }
    }
    if (/^\s*save the date\b/i.test(t)) { r.tpl = "event"; c.headline = tidy(content(t).split(/,|\s+on\s+(?=(?:mon|tue|wed|thu|fri|sat|sun))/i)[0]); delete c.name; delete c.person; return false; }
    if (/^\s*news\b\s*[:–—-]?/i.test(t)) { var h = tidy(t.replace(/^\s*news\b\s*[:–—-]?\s*/i, "")); var hear = h.match(/^hear from\s+([A-Z][a-z'’-]+(?:\s+[A-Z][a-z'’-]+){1,2})/i);
      return hear ? put("tk-news", 4, { headline: "Hear from " + hear[1], body: "" }, "Hear from " + hear[1], ["news: hear from " + hear[1]]) : put("tk-news", 1, { headline: h }, h.slice(0, 48), ["news"]); }
    if (r.tpl === "event" && !c.date && !c.venue && !code && !c.startTime) return put("tk-news", 1, { headline: cap(tidy(say)) }, tidy(say).slice(0, 48), ["a news post"]);
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
      if (c9.date || c9.venue) { r.tpl = "event"; if (!c9.headline) { var lead = content(text).split(/,|\s+on\s+(?=(mon|tue|wed|thu|fri|sat|sun))/i)[0]; c9.headline = tidy(lead.replace(/^(announce|announcing|save the date( for)?)\s+/i, "")); } r.copy = c9; }
      else { var hl = cap(tidy(content(text))); r.tpl = "tk-news"; r.layout = 1; r.copy = { headline: hl.slice(0, 110) }; r.title = hl.slice(0, 48); r.said = ["a headline post"]; return r; }
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
