// The TEKEX template pack: every template, in every layout and format, builds a complete, valid element list.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = fileURLToPath(new URL("..", import.meta.url));
const ctxGlobal = { console, Math, JSON, Object, Array, String, Number, Date };
ctxGlobal.window = ctxGlobal;
vm.createContext(ctxGlobal);
vm.runInContext(readFileSync(root + "assets/tekex/pack.js", "utf8"), ctxGlobal);
const T = ctxGlobal.HS_TEKEX;
T.parts.forEach(p => { const f = root + "assets/tekex/t-" + p + ".js"; if (existsSync(f)) vm.runInContext(readFileSync(f, "utf8"), ctxGlobal); });

const SIZES = { square: { w: 1080, h: 1080 }, portrait: { w: 1080, h: 1350 }, story: { w: 1080, h: 1920 }, landscape: { w: 1920, h: 1080 }, linkedin: { w: 1200, h: 627 } };
const stubCtx = (S) => ({
  S, th: { ground: "rgb(129,255,231)", accent: "rgb(248,36,255)" },
  img: () => ({ has: true, src: "assets/photos/event-03.webp", style: { position: "absolute" } }),
  mask: (src, w, h) => ({ width: w, height: h, WebkitMaskImage: "url(" + src + ")", maskImage: "url(" + src + ")" }),
  tw: (s, px) => String(s).length * px * 0.6
});
const designFor = (t, layout, long) => {
  const fields = T.fields[t.key] || [], ex = T.exampleFor(t.key, layout) || {};
  const copy = {};
  fields.forEach(f => { copy[f.key] = long ? (String(ex[f.key] || f.ph || "Words") + " ").repeat(4).trim() : (ex[f.key] != null ? ex[f.key] : f.ph || ""); });
  return { id: "d1", tpl: t.key, layout, copy: Object.assign({}, ex, copy), images: {}, partnersOn: ["ps", "rathbones", "bdo", "c5", "red5", "yoono", "wildpeak"], speakers: [], trio: [] };
};
const bad = (v) => typeof v === "number" ? !isFinite(v) : (typeof v === "string" && /NaN|undefined|Infinity/.test(v));

test("the pack registers its templates, each with layouts, fields and examples", () => {
  assert.ok(T.templates.length >= 1);
  T.templates.forEach(t => {
    assert.ok(t.key.indexOf("tk-") === 0, t.key);
    assert.ok(t.name && t.desc && t.theme, t.key + " has a name, description and default colourway");
    assert.ok(Array.isArray(T.fields[t.key]) && T.fields[t.key].length, t.key + " has fields");
  });
});

test("every template builds in every layout and format, with example and with long copy", () => {
  const problems = [];
  T.templates.forEach(t => {
    const layouts = (t.layouts || ["One"]).length;
    for (let L = 0; L < layouts; L++) for (const [k, S] of Object.entries(SIZES)) for (const long of [false, true]) {
      let v;
      try { v = T.vals(designFor(t, L, long), stubCtx(S)); } catch (e) { problems.push(`${t.key} layout ${L} ${k}${long ? " long" : ""}: throws ${e.message}`); continue; }
      if (!v.t_els.length) problems.push(`${t.key} layout ${L} ${k}: draws nothing`);
      v.t_els.forEach((e, i) => {
        Object.entries(e.style || {}).forEach(([p, val]) => { if (bad(val)) problems.push(`${t.key} layout ${L} ${k}: element ${i} (${e.k}) ${p}=${val}`); });
        if (e.k === "text") e.runs.forEach(r => { if (bad(r.t)) problems.push(`${t.key} layout ${L} ${k}: text "${r.t}"`); });
        if (e.k === "pic" && !existsSync(root + String(e.src).split("?")[0])) problems.push(`${t.key} layout ${L} ${k}: missing picture ${e.src}`);
        if (e.k === "mask") { const m = String(e.style.maskImage || "").match(/url\(([^)]+)\)/); if (m && !/^data:/.test(m[1]) && !existsSync(root + m[1].replace(/["']/g, ""))) problems.push(`${t.key} layout ${L} ${k}: missing mark ${m[1]}`); }
      });
    }
  });
  assert.deepEqual([...new Set(problems)].slice(0, 30), []);
});

test("the example designs use real templates, layouts, pictures and formats, and match their ready-made thumbnails", () => {
  vm.runInContext(readFileSync(root + "assets/tekex/examples.js", "utf8"), ctxGlobal);
  const lib = JSON.parse(readFileSync(root + "assets/tekex/library/manifest.json", "utf8"));
  const ids = new Set((Array.isArray(lib) ? lib : lib.items).map(x => x.id));
  let n = 0;
  const api = {
    project: (name, brief) => ({ id: "p" + (n++), name, brief }),
    design: (p, tpl, title, theme, copy, pics, layout) => {
      const t = T.templates.find(x => x.key === tpl);
      assert.ok(t, "template " + tpl);
      assert.ok(layout < (t.layouts || ["One"]).length, tpl + " layout " + layout);
      Object.keys(pics || {}).forEach(k => assert.ok(ids.has(pics[k]) || /^tk-/.test(pics[k]), "picture " + pics[k]));
      return { id: "d" + (n++), tpl, title, copy, layout, size: "square", projectId: p.id };
    },
    sizes: (d, keys) => keys.map(k => { assert.ok(SIZES[k], "format " + k); return Object.assign({}, d, { id: "d" + (n++), size: k }); })
  };
  const ex = T.seed(api);
  assert.ok(ex.projects.length >= 6);
  assert.equal(ex.drafts.length, T.seedThumbs.n, "seedThumbs.n matches the number of examples");
  ex.drafts.forEach((d, i) => assert.ok(existsSync(root + T.seedThumbs.dir + String(i).padStart(2, "0") + ".webp"), "thumbnail " + i));
  const used = new Set(ex.drafts.map(d => d.tpl));
  T.templates.forEach(t => assert.ok(used.has(t.key), "an example of " + t.key));
});

test("the bundled pack (assets/tekex/bundle.js) is up to date with its sources", async () => {
  const { bundle } = await import(root + "tools/build-tekex.mjs");
  assert.equal(readFileSync(root + "assets/tekex/bundle.js", "utf8"), bundle(), "run: node tools/build-tekex.mjs");
});
