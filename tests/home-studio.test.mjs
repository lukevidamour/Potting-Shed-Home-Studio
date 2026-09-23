import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
// The lib touches localStorage only inside Store; stub it so the module loads under node.
globalThis.localStorage = { _m: {}, getItem(k) { return this._m[k] ?? null; }, setItem(k, v) { this._m[k] = String(v); } };
globalThis.window = globalThis;
const lib = require("../home-studio.lib.js");

test("date line composes cleanly with blanks", () => {
  assert.equal(lib.composeDateLine({ date: "Fri 22nd Aug", startTime: "2pm", endTime: "5pm", venue: "C5 Hub" }), "Fri 22nd Aug: 2pm – 5pm, C5 Hub");
  assert.equal(lib.composeDateLine({ date: "Fri 22nd Aug", startTime: "", endTime: "", venue: "" }), "Fri 22nd Aug");
  assert.equal(lib.composeDateLine({ date: "", startTime: "", endTime: "", venue: "Hub" }), "Hub");
});

test("fitSize is bounded and never below the minimum ratio", () => {
  assert.equal(lib.fitSize("Ann", 128, 0.48), 128);
  assert.equal(lib.fitSize("A very long speaker name indeed here", 128, 0.48), Math.round(128 * 0.54));
  assert.equal(lib.fitSize("x".repeat(80), 128, 0.48), Math.round(128 * 0.48));
});

test("slug and filenames are safe", () => {
  assert.equal(lib.slug("Richard Tavernor · Square!"), "richard-tavernor-square");
  assert.equal(lib.slug(""), "design");
});

test("captions are drafted per platform and X stays under 280", () => {
  const d = lib.newDesign("speaker", "square", null);
  d.copy.name = "Richard Tavernor"; d.copy.role = "Founder,"; d.copy.company = "Yoono";
  const ig = lib.draftCaption(d, "instagram", 0);
  assert.match(ig, /Meet Richard Tavernor\./);
  assert.match(ig, /Founder at Yoono\./);
  assert.match(ig, /#TEKEX/);
  const li = lib.draftCaption(d, "linkedin", 1);
  assert.match(li, /joins the TEKEX line-up/);
  d.copy.name = "A".repeat(200); d.copy.venue = "B".repeat(200);
  assert.ok(lib.draftCaption(d, "x", 0).length <= 280);
  const blank = lib.newDesign("lockup", "square", null); blank.copy.body = "";
  assert.equal(lib.draftCaption(blank, "linkedin", 0), "");
});

test("new designs get sensible platform defaults and a size family", () => {
  const li = lib.newDesign("event", "linkedin", "p1");
  assert.deepEqual(li.platforms, ["linkedin"]);
  assert.ok(li.familyId.startsWith("f"));
  assert.equal(li.projectId, "p1");
});

test("seed builds six active and three archived projects and skips existing names", () => {
  const ex = lib.seedExamples([]);
  assert.equal(ex.projects.filter(p => !p.archived).length, 6);
  assert.equal(ex.projects.filter(p => p.archived).length, 3);
  assert.ok(ex.drafts.every(d => ex.projects.some(p => p.id === d.projectId)));
  const again = lib.seedExamples(ex.projects);
  assert.equal(again.projects.length, 0);
});

test("contrast ratio is symmetric and sane", () => {
  const r = lib.contrast("rgb(129,255,231)", "rgb(248,36,255)");
  assert.ok(r > 2 && r < 3);
  assert.equal(r, lib.contrast("rgb(248,36,255)", "rgb(129,255,231)"));
});

test("every image area starts filled with TEKEX imagery", () => {
  for (const tpl of ["speaker", "event", "trio", "listing"]) {
    const d = lib.newDesign(tpl, "square", null);
    const slots = lib.slotsFor(d);
    assert.ok(slots.length > 0, tpl + " has slots");
    for (const sl of slots) assert.ok(d.images[sl.id] && /^assets\//.test(d.images[sl.id].src), tpl + " slot " + sl.id + " filled");
  }
  assert.equal(lib.portraitFor("Nic Rose", "x").src, "assets/photos/nic-rose.webp");
  const ex = lib.seedExamples([]);
  for (const d of ex.drafts) for (const sl of lib.slotsFor(d)) assert.ok(d.images[sl.id], d.title + " " + sl.id);
});
