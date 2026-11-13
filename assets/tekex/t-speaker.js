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
