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

test("example artwork published in several sizes shares one size family", () => {
  const ex = lib.seedExamples([]);
  const rb = ex.drafts.filter(d => d.title.startsWith("Rathbones announcement"));
  assert.equal(rb.length, 2);
  assert.equal(rb[0].familyId, rb[1].familyId);
});

test("brand book colour helpers round-trip and judge contrast", () => {
  assert.equal(lib.hexToRgb("#81FFE7"), "rgb(129,255,231)");
  assert.equal(lib.rgbToHex("rgb(129,255,231)"), "#81FFE7");
  assert.equal(lib.normHex("abc"), "#AABBCC");
  assert.equal(lib.validHex("#12"), false);
  assert.equal(lib.contrastVerdict(15).key, "pass");
  assert.equal(lib.contrastVerdict(3.5).key, "large");
  assert.equal(lib.contrastVerdict(2).key, "fail");
});

test("a new client starts with three readable colourways and none of the first client's content", () => {
  const b = lib.blankBrand("Harbour Health", "#0B5D4B", "#FFE9C7", "harbourhealth.je");
  assert.equal(b.name, "Harbour Health");
  assert.equal(b.url, "HARBOURHEALTH.JE");
  assert.equal(b.themes.length, 3);
  b.themes.forEach(t => assert.ok(lib.contrast(t.ground, t.accent) >= 4.5, t.name + " should pass AA"));
  assert.equal(b.library.length, 0);
  assert.deepEqual(b.partners.map(p => p.key), ["ps"]);
});

test("portraits open on the face rather than a fixed guess", () => {
  const im = lib.libImg("tk-serena-guthrie");
  assert.deepEqual([im.x, im.y], lib.FOCUS["tk-serena-guthrie"]);
  const ev = lib.libImg("tk-event-03");
  assert.deepEqual([ev.x, ev.y], [50, 50]);
  const d = lib.newDesign("speaker", "square", null);
  assert.ok(d.images["speaker-photo"].y <= 10, "default portrait keeps the top of the head in frame");
});

test("editing the brand book changes what templates read", () => {
  const before = lib.BRAND.themes[0].ground;
  lib.applyBrand({ themes: [{ name: "Test", ground: "rgb(1,2,3)", accent: "rgb(250,250,250)" }], name: "Renamed" });
  assert.equal(lib.BRAND.themes[0].ground, "rgb(1,2,3)");
  assert.equal(lib.composeEyebrow({ eventNumber: "9" }), "Renamed #9 Speaker:");
  lib.applyBrand({ themes: lib.BRAND_DEFAULT.themes, name: lib.BRAND_DEFAULT.name });
  assert.equal(lib.BRAND.themes[0].ground, before);
});

test("example content is dated relative to today and keeps its weekdays", () => {
  const now = new Date(2027, 1, 10).getTime(); // Wed 10 Feb 2027, twenty weeks after the examples were written
  const weeks = lib.seedWeeks(now);
  assert.equal(weeks, 20);
  const base = lib.seedExamples([], { weeks: 0 }), ex = lib.seedExamples([], { weeks, now });
  assert.equal(base.projects[2].name, "Founders Breakfast · October");
  const breakfast = ex.drafts.find(d => d.title.indexOf("Breakfast announcement") === 0);
  assert.equal(breakfast.copy.date, "Wed 3 Mar");            // was Wed 14 Oct, twenty weeks on, still a Wednesday
  assert.equal(breakfast.scheduledAt, "2027-02-17");         // was 2026-09-30
  assert.equal(ex.projects[2].name, "Founders Breakfast · March");
  ex.drafts.filter(d => d.scheduledAt && !ex.projects.find(p => p.id === d.projectId).archived).forEach(d => assert.ok(d.scheduledAt >= "2027-02-10", d.title + " is not in the past"));
});

test("re-dating only touches example fields nobody has edited", () => {
  const base = lib.seedExamples([], { weeks: 0 });
  const mine = base.drafts.map(d => Object.assign({}, d, { copy: Object.assign({}, d.copy) }));
  const edited = mine.find(d => d.title === "Anna Le Page · Square" && d.copy.eventNumber === "38");
  edited.copy.date = "Sat 1 Jan"; edited.scheduledAt = "2030-01-01";
  const r = lib.redateExamples(base.projects, mine, 0, 20);
  const after = r.drafts.find(d => d.id === edited.id);
  assert.equal(after.copy.date, "Sat 1 Jan");
  assert.equal(after.scheduledAt, "2030-01-01");
  const other = r.drafts.find(d => d.title.indexOf("Breakfast announcement") === 0);
  assert.equal(other.copy.date, "Wed 3 Mar");
  assert.equal(r.projects[2].name, "Founders Breakfast · March");
  assert.equal(lib.redateExamples(r.projects, r.drafts, 20, 20).changed.length, 0);
});

test("cut-out portraits stand in their frame and are never stretched across it", () => {
  const im = lib.libImg("tk-jake-schofield");
  assert.equal(im.cut, true);
  const v = lib.imgVals(im);
  assert.equal(v.style.bottom, 0);
  assert.equal(v.style.height, "100%");
  assert.equal(v.style.objectFit, "contain");
  const photo = lib.imgVals(lib.libImg("tk-event-03"));
  assert.equal(photo.style.objectFit, "cover");
});
