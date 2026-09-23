/* Home Studio — data, brand configuration and pure helpers. Loaded before the page logic; no DOM access here except the Store adapter. */
/* =============================================================================
   Home Studio — TEKEX workspace.  Shell = Potting Shed tokens (CSS above).
   Artwork = TEKEX brand configuration (BRAND below). The two never mix.
   ============================================================================= */

const SIZES = {
  square:    { key: "square",    label: "Square post",   ratio: "1:1",    dims: "1080 × 1080", w: 1080, h: 1080, pad: 48, barH: 120, barLeftW: 349 },
  portrait:  { key: "portrait",  label: "Portrait post", ratio: "4:5",    dims: "1080 × 1350", w: 1080, h: 1350, pad: 48, barH: 120, barLeftW: 349 },
  story:     { key: "story",     label: "Story",         ratio: "9:16",   dims: "1080 × 1920", w: 1080, h: 1920, pad: 56, barH: 130, barLeftW: 360 },
  landscape: { key: "landscape", label: "Landscape",     ratio: "16:9",   dims: "1920 × 1080", w: 1920, h: 1080, pad: 88, barH: 130, barLeftW: 400 },
  linkedin:  { key: "linkedin",  label: "LinkedIn post", ratio: "1.91:1", dims: "1200 × 627",  w: 1200, h: 627,  pad: 40, barH: 78,  barLeftW: 230 }
};
const SIZE_ORDER = ["square", "portrait", "story", "landscape", "linkedin"];

/* TEKEX brand configuration — values carried over from the existing prototype. */
const BRAND = {
  workspace: "TEKEX",
  studioEmail: "luke@pottingshed.com",   // where "Ask Potting Shed" messages go
  themes: [
    { name: "Mint & magenta",  ground: "rgb(129,255,231)", accent: "rgb(248,36,255)" },
    { name: "Lime & violet",   ground: "rgb(208,255,191)", accent: "rgb(120,36,255)" },
    { name: "Ink & mint",      ground: "rgb(20,20,20)",    accent: "rgb(129,255,231)" },
    { name: "Violet & light",  ground: "rgb(120,36,255)",  accent: "rgb(229,230,231)" },
    { name: "Light & violet",  ground: "rgb(229,230,231)", accent: "rgb(120,36,255)" },
    { name: "Magenta & ink",   ground: "rgb(248,36,255)",  accent: "rgb(20,20,20)" }
  ],
  partners: [
    { key: "ps",        name: "Potting Shed",       src: "assets/ps-logo.svg" },
    { key: "rathbones", name: "Rathbones",          src: "assets/logos/rathbones.svg" },
    { key: "bdo",       name: "BDO",                src: "assets/logos/bdo.svg" },
    { key: "c5",        name: "C5 Alliance",        src: "assets/logos/c5.svg" },
    { key: "red5",      name: "Red 5 Systems",      src: "assets/logos/red5.svg" },
    { key: "yoono",     name: "Yoono",              src: "assets/logos/yoono.svg" },
    { key: "wildpeak",  name: "Wild Peak Holdings", src: "assets/logos/wildpeak.svg" }
  ],
  barLabels: ["SPEAKERS", "EVENT", "PARTNERS", "TALKS", "COMMUNITY"],
  library: [
    /* TEKEX photography and graphics. Groups drive the picker filters. */
    { id: "tk-andrew-mcneill", name: "Andrew McNeill — speaker portrait", src: "assets/photos/andrew-mcneill.webp", group: "Speakers" },
    { id: "tk-jeff-macleod", name: "Jeff MacLeod — speaker portrait", src: "assets/photos/jeff-macleod.webp", group: "Speakers" },
    { id: "tk-nic-rose", name: "Nic Rose — speaker portrait", src: "assets/photos/nic-rose.webp", group: "Speakers" },
    { id: "tk-niraj-singh", name: "Dr Niraj Singh — speaker portrait", src: "assets/photos/niraj-singh.webp", group: "Speakers" },
    { id: "tk-guy-thompson", name: "Guy Thompson — speaker portrait", src: "assets/photos/guy-thompson.webp", group: "Speakers" },
    { id: "tk-ian-rhodes", name: "Ian Rhodes — speaker portrait", src: "assets/photos/ian-rhodes.webp", group: "Speakers" },
    { id: "tk-gabe-drogon", name: "Gabe Drogon — speaker portrait", src: "assets/photos/gabe-drogon.webp", group: "Speakers" },
    { id: "tk-peter-o-brady", name: "Peter O'Brady — speaker portrait", src: "assets/photos/peter-o-brady.webp", group: "Speakers" },
    { id: "tk-claire-trant", name: "Claire Trant — speaker portrait", src: "assets/photos/claire-trant.webp", group: "Speakers" },
    { id: "tk-lisa-mccabe", name: "Lisa McCabe — speaker portrait", src: "assets/photos/lisa-mccabe.webp", group: "Speakers" },
    { id: "tk-hannah-mellor", name: "Hannah Mellor — speaker portrait", src: "assets/photos/hannah-mellor.webp", group: "Speakers" },
    { id: "tk-jake-schofield", name: "Jake Schofield — speaker portrait", src: "assets/photos/jake-schofield.webp", group: "Speakers" },
    { id: "tk-oliver-le-brun", name: "Oliver Le Brun — speaker portrait", src: "assets/photos/oliver-le-brun.webp", group: "Speakers" },
    { id: "tk-austin-gibbs", name: "Austin Gibbs — speaker portrait", src: "assets/photos/austin-gibbs.webp", group: "Speakers" },
    { id: "tk-dr-omar", name: "Dr Omar — speaker portrait", src: "assets/photos/dr-omar.webp", group: "Speakers" },
    { id: "tk-serena-guthrie-cutout", name: "Serena Guthrie — cut-out", src: "assets/photos/serena-guthrie-cutout.png", group: "Speakers" },
    { id: "tk-serena-guthrie", name: "Serena Guthrie — portrait", src: "assets/photos/serena-guthrie.jpg", group: "Speakers" },
    { id: "tk-tim-huelin-cutout", name: "Tim Huelin — cut-out", src: "assets/photos/tim-huelin-cutout.png", group: "Speakers" },
    { id: "tk-event-photo-bw", name: "Event — audience, black and white", src: "assets/photos/event-photo-bw.webp", group: "Events" },
    { id: "tk-audience-photo-bw", name: "Audience — black and white", src: "assets/photos/audience-photo-bw.webp", group: "Events" },
    { id: "tk-hero-loop-poster", name: "Health Innovation hero still", src: "assets/photos/hero-loop-poster.jpg", group: "Events" },
    { id: "tk-overview-4-5-poster", name: "Overview still — portrait", src: "assets/photos/overview-4-5-poster.jpg", group: "Events" },
    { id: "tk-closing-loop-poster", name: "Closing still", src: "assets/photos/closing-loop-poster.jpg", group: "Events" },
    { id: "tk-reasons-1", name: "Venue — detail 1", src: "assets/photos/reasons-1.jpg", group: "Events" },
    { id: "tk-reasons-2", name: "Venue — detail 2", src: "assets/photos/reasons-2.jpg", group: "Events" },
    { id: "tk-reasons-3", name: "Venue — detail 3", src: "assets/photos/reasons-3.jpg", group: "Events" },
    { id: "tk-reasons-4", name: "Venue — detail 4", src: "assets/photos/reasons-4.jpg", group: "Events" },
    { id: "tk-event-01", name: "TEKEX event — 01", src: "assets/photos/event-01.jpg", group: "Events" },
    { id: "tk-event-02", name: "TEKEX event — 02", src: "assets/photos/event-02.jpg", group: "Events" },
    { id: "tk-event-03", name: "TEKEX event — 03", src: "assets/photos/event-03.jpg", group: "Events" },
    { id: "tk-event-04", name: "TEKEX event — 04", src: "assets/photos/event-04.jpg", group: "Events" },
    { id: "tk-event-05", name: "TEKEX event — 05", src: "assets/photos/event-05.jpg", group: "Events" },
    { id: "tk-event-06", name: "TEKEX event — 06", src: "assets/photos/event-06.jpg", group: "Events" },
    { id: "tk-event-07", name: "TEKEX event — 07", src: "assets/photos/event-07.jpg", group: "Events" },
    { id: "tk-event-08", name: "TEKEX event — 08", src: "assets/photos/event-08.jpg", group: "Events" },
    { id: "tk-event-09", name: "TEKEX event — 09", src: "assets/photos/event-09.jpg", group: "Events" },
    { id: "tk-event-10", name: "TEKEX event — 10", src: "assets/photos/event-10.jpg", group: "Events" },
    { id: "tk-event-11", name: "TEKEX event — 11", src: "assets/photos/event-11.jpg", group: "Events" },
    { id: "tk-event-12", name: "TEKEX event — 12", src: "assets/photos/event-12.jpg", group: "Events" },
    { id: "tk-event-13", name: "TEKEX event — 13", src: "assets/photos/event-13.jpg", group: "Events" },
    { id: "tk-event-14", name: "TEKEX event — 14 (mono)", src: "assets/photos/event-14.jpg", group: "Events" },
    { id: "tk-event-15", name: "TEKEX event — 15", src: "assets/photos/event-15.jpg", group: "Events" },
    { id: "tk-iom-01", name: "Isle of Man launch — 01", src: "assets/photos/iom-launch-01.jpg", group: "Events" },
    { id: "tk-iom-02", name: "Isle of Man launch — 02", src: "assets/photos/iom-launch-02.jpg", group: "Events" },
    { id: "tk-iom-03", name: "Isle of Man launch — 03", src: "assets/photos/iom-launch-03.jpg", group: "Events" },
    { id: "tk-iom-04", name: "Isle of Man launch — 04", src: "assets/photos/iom-launch-04.jpg", group: "Events" },
    { id: "tk-iom-05", name: "Isle of Man launch — 05", src: "assets/photos/iom-launch-05.jpg", group: "Events" },
    { id: "tk-iom-06", name: "Isle of Man launch — 06", src: "assets/photos/iom-launch-06.jpg", group: "Events" },
    { id: "tk-iom-07", name: "Isle of Man launch — 07", src: "assets/photos/iom-launch-07.jpg", group: "Events" },
    { id: "tk-iom-08", name: "Isle of Man launch — 08", src: "assets/photos/iom-launch-08.jpg", group: "Events" },
    { id: "tk-iom-09", name: "Isle of Man launch — 09", src: "assets/photos/iom-launch-09.jpg", group: "Events" },
    { id: "tk-iom-10", name: "Isle of Man launch — 10", src: "assets/photos/iom-launch-10.jpg", group: "Events" },
    { id: "tk-iom-11", name: "Isle of Man launch — 11", src: "assets/photos/iom-launch-11.jpg", group: "Events" },
    { id: "tk-iom-12", name: "Isle of Man launch — 12", src: "assets/photos/iom-launch-12.jpg", group: "Events" },
    { id: "tk-iom-13", name: "Isle of Man launch — 13", src: "assets/photos/iom-launch-13.jpg", group: "Events" },
    { id: "tk-event-extra-01", name: "TEKEX event — extra 01", src: "assets/photos/event-extra-01.jpg", group: "Events" },
    { id: "tk-event-extra-02", name: "TEKEX event — extra 02", src: "assets/photos/event-extra-02.jpg", group: "Events" },
    { id: "tk-reel-1", name: "TEKEX reel — frame 1", src: "assets/photos/reel-1.jpg", group: "Reel" },
    { id: "tk-reel-7", name: "TEKEX reel — frame 7", src: "assets/photos/reel-7.jpg", group: "Reel" },
    { id: "tk-reel-13", name: "TEKEX reel — frame 13", src: "assets/photos/reel-13.jpg", group: "Reel" },
    { id: "tk-reel-19", name: "TEKEX reel — frame 19", src: "assets/photos/reel-19.jpg", group: "Reel" },
    { id: "tk-reel-25", name: "TEKEX reel — frame 25", src: "assets/photos/reel-25.jpg", group: "Reel" },
    { id: "tk-reel-31", name: "TEKEX reel — frame 31", src: "assets/photos/reel-31.jpg", group: "Reel" },
    { id: "tk-reel-37", name: "TEKEX reel — frame 37", src: "assets/photos/reel-37.jpg", group: "Reel" },
    { id: "tk-reel-43", name: "TEKEX reel — frame 43", src: "assets/photos/reel-43.jpg", group: "Reel" },
    { id: "tk-reel-49", name: "TEKEX reel — frame 49", src: "assets/photos/reel-49.jpg", group: "Reel" },
    { id: "tk-reel-55", name: "TEKEX reel — frame 55", src: "assets/photos/reel-55.jpg", group: "Reel" },
    { id: "tk-reel-61", name: "TEKEX reel — frame 61", src: "assets/photos/reel-61.jpg", group: "Reel" },
    { id: "tk-reel-67", name: "TEKEX reel — frame 67", src: "assets/photos/reel-67.jpg", group: "Reel" },
    { id: "tk-reel-73", name: "TEKEX reel — frame 73", src: "assets/photos/reel-73.jpg", group: "Reel" },
    { id: "tk-reel-79", name: "TEKEX reel — frame 79", src: "assets/photos/reel-79.jpg", group: "Reel" },
    { id: "tk-reel-85", name: "TEKEX reel — frame 85", src: "assets/photos/reel-85.jpg", group: "Reel" },
    { id: "tk-reel-91", name: "TEKEX reel — frame 91", src: "assets/photos/reel-91.jpg", group: "Reel" },
    { id: "tk-reel-97", name: "TEKEX reel — frame 97", src: "assets/photos/reel-97.jpg", group: "Reel" },
    { id: "tk-reel-103", name: "TEKEX reel — frame 103", src: "assets/photos/reel-103.jpg", group: "Reel" },
    { id: "tk-reel-109", name: "TEKEX reel — frame 109", src: "assets/photos/reel-109.jpg", group: "Reel" },
    { id: "tk-reel-115", name: "TEKEX reel — frame 115", src: "assets/photos/reel-115.jpg", group: "Reel" },
    { id: "tk-reel-121", name: "TEKEX reel — frame 121", src: "assets/photos/reel-121.jpg", group: "Reel" },
    { id: "tk-reel-127", name: "TEKEX reel — frame 127", src: "assets/photos/reel-127.jpg", group: "Reel" },
    { id: "tk-reel-133", name: "TEKEX reel — frame 133", src: "assets/photos/reel-133.jpg", group: "Reel" },
    { id: "tk-reel-139", name: "TEKEX reel — frame 139", src: "assets/photos/reel-139.jpg", group: "Reel" },
    { id: "tk-reel-138-sq", name: "TEKEX reel — frame 138 (square)", src: "assets/photos/reel-138-square.jpg", group: "Reel" },
    { id: "tk-reel-26-sq", name: "TEKEX reel — frame 26 (square)", src: "assets/photos/reel-26-square.jpg", group: "Reel" },
    { id: "tk-swirl-1", name: "Gradient swirl 1", src: "assets/graphics/swirl-1.png", group: "Graphics" },
    { id: "tk-swirl-2", name: "Gradient swirl 2", src: "assets/graphics/swirl-2.png", group: "Graphics" },
    { id: "tk-swirl-3", name: "Gradient swirl 3", src: "assets/graphics/swirl-3.png", group: "Graphics" },
    { id: "tk-swirl-4", name: "Gradient swirl 4", src: "assets/graphics/swirl-4.png", group: "Graphics" },
    { id: "tk-swirl-5", name: "Gradient swirl 5", src: "assets/graphics/swirl-5.png", group: "Graphics" },
    { id: "tk-swirl-6", name: "Gradient swirl 6", src: "assets/graphics/swirl-6.png", group: "Graphics" },
    { id: "tk-swirl-7", name: "Gradient swirl 7", src: "assets/graphics/swirl-7.png", group: "Graphics" },
    { id: "tk-swirl-8", name: "Gradient swirl 8", src: "assets/graphics/swirl-8.png", group: "Graphics" },
    { id: "tk-swirl-9", name: "Gradient swirl 9", src: "assets/graphics/swirl-9.png", group: "Graphics" },
    { id: "tk-gradient", name: "TEKEX gradient", src: "assets/graphics/tekex-gradient.png", group: "Graphics" },
    { id: "tk-motif-star", name: "Motif — star", src: "assets/graphics/motif-star.svg", group: "Graphics" },
    { id: "tk-motif-tri", name: "Motif — tri", src: "assets/graphics/motif-tri.svg", group: "Graphics" },
    { id: "tk-motif-rings", name: "Motif — rings", src: "assets/graphics/motif-rings.svg", group: "Graphics" },
    { id: "tk-motif-square", name: "Motif — square", src: "assets/graphics/motif-square.svg", group: "Graphics" },
    { id: "lib-al-mitchell", name: "Al Mitchell — speaker portrait", src: "assets/speaker-al-mitchell.jpg", w: 675, h: 900, group: "Team" },
    { id: "tk-ed", name: "Ed — portrait", src: "assets/photos/ed-profile.jpg", group: "Team" },
    { id: "tk-ed-bw", name: "Ed — portrait, mono", src: "assets/photos/ed-profile-bw.jpg", group: "Team" },
    { id: "tk-tom", name: "Tom — portrait", src: "assets/photos/tom-profile.jpg", group: "Team" },
    { id: "tk-tom-bw", name: "Tom — portrait, mono", src: "assets/photos/tom-profile-bw.jpg", group: "Team" },
    { id: "tk-louis", name: "Louis Pike — portrait", src: "assets/photos/louis-pike.jpg", group: "Team" },
    { id: "tk-al-mitchell-portrait", name: "Al Mitchell — portrait", src: "assets/photos/al-mitchell-portrait.jpg", group: "Team" }
  ]
};
const LIB = Object.fromEntries(BRAND.library.map(im => [im.id, im]));
/* Old stock ids now point at TEKEX imagery so example content stays valid. */
LIB.u1 = LIB["tk-event-03"];
LIB.u2 = LIB["tk-iom-05"];
LIB.u3 = LIB["tk-event-07"];
LIB.u4 = LIB["tk-serena-guthrie"];
LIB.u5 = LIB["tk-jake-schofield"];
LIB.u6 = LIB["tk-hannah-mellor"];
LIB.u7 = LIB["tk-guy-thompson"];
LIB.u8 = LIB["tk-iom-02"];
LIB.u9 = LIB["tk-reel-13"];
LIB.u10 = LIB["tk-event-10"];
const LIB_GROUPS = ["Speakers", "Events", "Reel", "Graphics", "Team"];
/* Default imagery: every image area starts filled with TEKEX photography, chosen from the design id so it is stable. */
const PORTRAIT_IDS = ["tk-nic-rose", "tk-niraj-singh", "tk-lisa-mccabe", "tk-andrew-mcneill", "tk-jeff-macleod", "tk-guy-thompson", "tk-ian-rhodes", "tk-gabe-drogon", "tk-peter-o-brady", "tk-claire-trant", "tk-hannah-mellor", "tk-jake-schofield", "tk-oliver-le-brun", "tk-austin-gibbs", "tk-dr-omar", "tk-serena-guthrie"];
const EVENT_IDS = ["tk-event-03", "tk-event-07", "tk-event-10", "tk-iom-02", "tk-iom-05", "tk-event-01", "tk-event-04", "tk-iom-08", "tk-event-12", "tk-reel-13", "tk-event-02", "tk-iom-11", "tk-event-08", "tk-reel-61", "tk-event-14", "tk-iom-03", "tk-event-06", "tk-reel-31", "tk-event-09", "tk-iom-07"];
function hashStr(str) { let h = 0; for (let i = 0; i < String(str).length; i++) h = (h * 31 + String(str).charCodeAt(i)) >>> 0; return h; }
function libImg(id, x, y) { const im = LIB[id]; if (!im) return null; return { src: im.src, name: im.name, x: x == null ? 50 : x, y: y == null ? 50 : y, zoom: 1 }; }
function portraitFor(name, seed) { const s = slug(name || ""); const direct = PORTRAIT_IDS.find(id => id === "tk-" + s); return libImg(direct || PORTRAIT_IDS[hashStr(seed) % PORTRAIT_IDS.length], 50, 28); }
function eventImageFor(seed) { return libImg(EVENT_IDS[hashStr(seed) % EVENT_IDS.length], 50, 50); }
/* Fill any empty image area on a design. Returns a new images map (or the same one if nothing was missing). */
function fillImages(d) {
  const images = Object.assign({}, d.images || {}); let changed = false;
  const put = (slot, im) => { if (!images[slot] && im) { images[slot] = im; changed = true; } };
  if (d.tpl === "speaker") put("speaker-photo", portraitFor(d.copy && d.copy.name, d.id));
  if (d.tpl === "event") put("event-image", eventImageFor(d.id));
  if (d.tpl === "trio") (d.trio || []).forEach((t, i) => put("trio-" + (i + 1), portraitFor(t.name, d.id + i)));
  if (d.tpl === "listing") { put("listing-hero", eventImageFor(d.id + "hero")); (d.speakers || []).forEach((sp, i) => put("listing-" + sp.id, portraitFor(sp.name, d.id + sp.id))); }
  return changed ? images : (d.images || {});
}

const TEMPLATES = [
  { key: "speaker",  name: "Introduce a speaker",      desc: "One speaker portrait with their name, role and the event details.", required: ["name"] },
  { key: "event",    name: "Announce an event",        desc: "A headline, a short intro and the date, time and venue.",          required: ["headline"] },
  { key: "listing",  name: "Meet the speakers",        desc: "A full line-up with names, roles and optional portraits.",          required: ["headline"] },
  { key: "trio",     name: "Highlight three sessions", desc: "Three speakers or sessions side by side under one title.",          required: ["sessionTitle"] },
  { key: "partners", name: "Showcase your partners",   desc: "Approved partner logos in the TEKEX grid.",                         required: ["headline"] },
  { key: "lockup",   name: "Brand announcement",       desc: "The TEKEX mark with a single line of copy.",                        required: ["body"] }
];
const TPL = Object.fromEntries(TEMPLATES.map(t => [t.key, t]));

/* Content fields per template. `kind`: text | area | select. */
const FIELDS = {
  speaker:  [
    { key: "eventNumber", label: "Event number", ph: "36", optional: true },
    { key: "name",        label: "Speaker name", ph: "Richard Tavernor" },
    { key: "role",        label: "Job title",    ph: "Founder", optional: true },
    { key: "company",     label: "Company",      ph: "Yoono", optional: true }
  ],
  event:    [
    { key: "headline", label: "Headline", ph: "TEKEX X Rathbones" },
    { key: "body",     label: "Intro",    ph: "One or two sentences about the event.", kind: "area", optional: true }
  ],
  listing:  [
    { key: "eyebrow",  label: "Kicker",   ph: "TEKEX #36 · Speaker line-up", optional: true },
    { key: "headline", label: "Headline", ph: "TEKEX X Rathbones" },
    { key: "body",     label: "Intro",    ph: "A short introduction to the event.", kind: "area", optional: true }
  ],
  trio:     [
    { key: "sessionPrefix", label: "Session time and type", ph: "11.00am · Talks", optional: true },
    { key: "sessionTitle",  label: "Session title",         ph: "Wellness and emerging therapies" }
  ],
  partners: [ { key: "headline", label: "Headline", ph: "TEKEX X Rathbones" } ],
  lockup:   [ { key: "body", label: "Copy", ph: "TEKEX is the innovation community for the Crown Dependencies.", kind: "area" } ]
};
const TIME_ROW = { speaker: true, event: true, listing: true, trio: true };
const FOOTER   = { speaker: true, event: true, listing: true, partners: true, lockup: true };

const EXAMPLE_COPY = {
  eventNumber: "36", name: "Richard Tavernor", role: "Founder,", company: "Yoono",
  headline: "TEKEX X Rathbones",
  body: "TEKEX is the innovation community for the Crown Dependencies. We connect founders, investors, operators and policymakers.",
  eyebrow: "TEKEX #36 · Speaker line-up",
  sessionPrefix: "11.00am · Talks", sessionTitle: "Wellness and emerging therapies",
  date: "Fri 22nd Aug", startTime: "2pm", endTime: "5pm", venue: "C5 Hub, Windward House",
  barLabel: "SPEAKERS", url: "TEKEX.CO"
};
const EXAMPLE_SPEAKERS = [
  { id: "s1", name: "Richard Tavernor", role: "Founder",  company: "Yoono" },
  { id: "s2", name: "Anna Le Page",     role: "Partner",  company: "Rathbones" },
  { id: "s3", name: "Sam Ozanne",       role: "Director", company: "BDO" },
  { id: "s4", name: "Priya Nair",       role: "CTO",      company: "C5 Alliance" }
];
const EXAMPLE_TRIO = [
  { name: "Nic Rose",       company: "iO-CO" },
  { name: "Dr Niraj Singh", company: "Ketamine Therapies" },
  { name: "Lisa McCabe",    company: "The Wellbeing Co" }
];

const PLATFORMS = [
  { key: "linkedin",  name: "LinkedIn",  limit: 3000 },
  { key: "instagram", name: "Instagram", limit: 2200 },
  { key: "facebook",  name: "Facebook",  limit: 5000 },
  { key: "x",         name: "X",         limit: 280 }
];
const PLAT = Object.fromEntries(PLATFORMS.map(p => [p.key, p]));
const DEFAULT_PLATFORMS = { square: ["instagram", "linkedin"], portrait: ["instagram"], story: ["instagram"], landscape: ["linkedin", "x"], linkedin: ["linkedin"] };
function listNames(arr) { const a = arr.filter(Boolean); if (a.length <= 1) return a.join(""); return a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
/* Post copy drafted from the design's own details. Deterministic: no AI, no network. `variant` cycles the phrasing. */
function draftCaption(d, platform, variant) {
  const c = d.copy, T = d.tpl, v = variant || 0;
  const pick = (arr) => arr[((v % arr.length) + arr.length) % arr.length];
  const url = (c.url || "TEKEX.CO").trim().toLowerCase();
  const when = composeDateLine(c);
  let hook = "", body = "", cta = "";
  if (T === "speaker") {
    const roleCo = join([(c.role || "").replace(/[,\s]+$/, ""), c.company], " at ");
    hook = c.name ? pick(["Meet " + c.name + ".", c.name + " joins the TEKEX line-up.", "Speaker announcement: " + c.name + "."]) : "";
    body = join([roleCo ? roleCo + "." : "", when ? pick(["Join us " + when + ".", when + ".", "We're together " + when + "."]) : ""], " ");
  } else if (T === "event") {
    hook = c.headline ? pick([c.headline + ".", c.headline + " — save the date.", "Coming up: " + c.headline + "."]) : "";
    body = join([c.body, when ? when + "." : ""], " ");
  } else if (T === "listing") {
    const names = d.speakers.map(x => x.name).filter(Boolean);
    hook = c.headline ? c.headline + "." : "";
    body = join([names.length ? pick(["Hear from " + listNames(names) + ".", "With " + listNames(names) + ".", "On the line-up: " + listNames(names) + "."]) : "", c.body, when ? when + "." : ""], " ");
  } else if (T === "trio") {
    const names = d.trio.map(x => x.name).filter(Boolean);
    hook = c.sessionTitle ? pick([c.sessionTitle + ".", "On the agenda: " + c.sessionTitle + ".", "Don't miss " + c.sessionTitle.charAt(0).toLowerCase() + c.sessionTitle.slice(1) + "."]) : "";
    const dv = join([c.date, c.venue], ", ");
    body = join([names.length ? join([c.sessionPrefix, "with " + listNames(names) + "."], " — ") : "", dv ? dv + "." : ""], " ");
  } else if (T === "partners") {
    const ps = BRAND.partners.filter(x => x.key !== "ps" && d.partnersOn.indexOf(x.key) >= 0).map(x => x.name);
    hook = c.headline ? c.headline + "." : "";
    body = ps.length ? pick(["With thanks to " + listNames(ps) + ".", "Proud to work alongside " + listNames(ps) + ".", "None of this happens without " + listNames(ps) + "."]) : "";
  } else {
    hook = (c.body || "").trim();
  }
  cta = pick(["Details at " + url, "More at " + url, "Find out more: " + url]);
  const tags = "#TEKEX #ChannelIslands #Innovation" + (T === "speaker" || T === "listing" || T === "trio" ? " #Speakers" : "") + (T === "event" ? " #Events" : "");
  if (!hook && !body) return "";
  if (platform === "x") {
    let t = join([hook, body, cta], " ");
    if (t.length > 280) t = join([hook, cta], " ");
    if (t.length > 280) t = t.slice(0, 277).replace(/\s+\S*$/, "") + "…";
    return t;
  }
  if (platform === "instagram") return join([hook, body, cta, tags], "\n\n");
  if (platform === "facebook") return join([hook, body, cta], "\n\n");
  return join([hook, body, cta, "#TEKEX #Innovation"], "\n\n");
}
const DRAFTS_KEY = "hs-drafts-v1";
const PROJECTS_KEY = "hs-projects-v1";
const ICON = {
  layers: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  calendar: "M3 9h18M8 3v4M16 3v4M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
  clock: "M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  format: "M4 5h16v14H4zM4 12h16"
};
function fmtDate(iso) { if (!iso) return ""; const d = new Date(iso + (iso.length === 10 ? "T12:00:00" : "")); return isNaN(d) ? iso : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); }
function fmtWhen(t) { return new Date(t).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); }
function isoDay(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function fmtShort(iso) { if (!iso) return ""; const d = new Date(iso + "T12:00:00"); return isNaN(d) ? iso : d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }); }
function initials(name) { const words = String(name || "").split(/[\s·]+/).filter(w => /^[A-Za-z]/.test(w)); return words.slice(0, 2).map(w => w[0].toUpperCase()).join("") || "P"; }
function newProject(name, brief, due) { return { id: uid("p"), name: name || "Untitled project", brief: brief || "", due: due || "", archived: false, createdAt: Date.now(), updatedAt: Date.now() }; }

/* Example workspace content: six active and three archived projects, each with a few designs.
   Added once (flag hs-seed-v2), skipping any project whose name already exists. All deletable. */
function seedExamples(existing) {
  const have = new Set(existing.map(pj => pj.name));
  const DAY = 86400000, now = Date.now();
  const projects = [], drafts = [];
  const img = (id, x, y) => ({ src: LIB[id].src, name: LIB[id].name, x: x == null ? 50 : x, y: y == null ? 50 : y, zoom: 1 });
  const P = (name, brief, daysAgo, archived) => { const pj = newProject(name, brief, ""); pj.example = true; pj.archived = !!archived; pj.createdAt = now - daysAgo * DAY; pj.updatedAt = now - Math.max(0, daysAgo - 3) * DAY; return pj; };
  const D = (pj, tpl, size, title, o) => {
    const d = newDesign(tpl, size, pj.id); d.title = title; d.updatedAt = pj.updatedAt - (o && o.age ? o.age : 0) * DAY;
    if (o && o.copy) d.copy = Object.assign({}, d.copy, o.copy);
    if (o && o.theme != null) d.theme = o.theme;
    if (o && o.images) d.images = o.images;
    if (o && o.sched) d.scheduledAt = o.sched;
    if (o && o.family) d.familyId = o.family;
    if (o && o.speakers) d.speakers = o.speakers.map((sp, i) => Object.assign({ id: "s" + (i + 1) }, sp));
    if (o && o.trio) d.trio = o.trio;
    if (o && o.partnersOn) d.partnersOn = o.partnersOn;
    d.images = fillImages(d);
    return d;
  };
  const add = (pj, list) => { if (have.has(pj.name)) return; projects.push(pj); list.forEach(d => drafts.push(d)); };

  let pj, fam;
  // 1 — active
  pj = P("TEKEX #36 · Speaker campaign", "Social assets for the September speaker event. One card per speaker, plus the event announcement.", 6);
  fam = uid("f");
  add(pj, [
    D(pj, "trio", "square", "Wellness sessions · Square", { theme: 4, sched: "2026-09-24", images: { "trio-1": img("tk-nic-rose", 50, 30), "trio-2": img("tk-niraj-singh", 50, 30), "trio-3": img("tk-lisa-mccabe", 50, 30) } }),
    D(pj, "event", "portrait", "Event announcement · Portrait", { theme: 1, age: 1, sched: "2026-09-23", images: { "event-image": img("u1") } }),
    D(pj, "speaker", "square", "Richard Tavernor · Square", { age: 2, family: fam, sched: "2026-09-29", images: { "speaker-photo": img("u5", 50, 30) } }),
    D(pj, "speaker", "linkedin", "Richard Tavernor · LinkedIn post", { age: 2, family: fam, sched: "2026-09-29", images: { "speaker-photo": img("u5", 50, 30) } })
  ]);
  // 2 — active
  pj = P("Health Innovation Summit", "Two-day summit at the BDO/C5 Hub. Speaker cards for the keynote line-up and a partner wall for the sponsors.", 12);
  fam = uid("f");
  add(pj, [
    D(pj, "listing", "portrait", "Keynote line-up · Portrait", { theme: 2, sched: "2026-10-02", copy: { eyebrow: "Health Innovation Summit · Day one", headline: "Meet the keynote speakers", body: "Clinicians, founders and investors on where health tech goes next.", date: "Thu 8 Oct", startTime: "9am", endTime: "5pm", venue: "BDO/C5 Hub, St Helier", barLabel: "TALKS" }, images: { "listing-hero": img("u3") }, speakers: [{ name: "Dr Niraj Singh", role: "Founder", company: "Ketamine Therapies" }, { name: "Lisa McCabe", role: "CEO", company: "The Wellbeing Co" }, { name: "Nic Rose", role: "Director", company: "iO-CO" }, { name: "Priya Nair", role: "CTO", company: "C5 Alliance" }] }),
    D(pj, "speaker", "portrait", "Dr Niraj Singh · Portrait", { theme: 5, age: 1, family: fam, sched: "2026-10-05", copy: { eventNumber: "37", name: "Dr Niraj Singh", role: "Founder,", company: "Ketamine Therapies", date: "Thu 8 Oct", startTime: "9am", endTime: "5pm", venue: "BDO/C5 Hub, St Helier", barLabel: "TALKS" }, images: { "speaker-photo": img("tk-niraj-singh", 50, 25) } }),
    D(pj, "speaker", "story", "Dr Niraj Singh · Story", { theme: 5, age: 1, family: fam, sched: "2026-10-06", copy: { eventNumber: "37", name: "Dr Niraj Singh", role: "Founder,", company: "Ketamine Therapies", date: "Thu 8 Oct", startTime: "9am", endTime: "5pm", venue: "BDO/C5 Hub, St Helier", barLabel: "TALKS" }, images: { "speaker-photo": img("tk-niraj-singh", 50, 25) } }),
    D(pj, "partners", "square", "Summit sponsors · Square", { theme: 3, age: 2, copy: { headline: "With thanks to our partners", barLabel: "PARTNERS" } })
  ]);
  // 3 — active
  pj = P("Founders Breakfast · October", "Monthly founders breakfast. Announcement post, speaker card and a LinkedIn version for the host.", 4);
  fam = uid("f");
  add(pj, [
    D(pj, "event", "square", "Breakfast announcement · Square", { theme: 0, family: fam, sched: "2026-09-30", copy: { headline: "Founders Breakfast", body: "Coffee, pastries and honest conversation about building companies from the Channel Islands.", date: "Wed 14 Oct", startTime: "8am", endTime: "9.30am", venue: "Wild Peak, St Peter Port", barLabel: "COMMUNITY" }, images: { "event-image": img("u9") } }),
    D(pj, "event", "linkedin", "Breakfast announcement · LinkedIn post", { theme: 0, family: fam, sched: "2026-10-01", copy: { headline: "Founders Breakfast", body: "Coffee, pastries and honest conversation about building companies from the Channel Islands.", date: "Wed 14 Oct", startTime: "8am", endTime: "9.30am", venue: "Wild Peak, St Peter Port", barLabel: "COMMUNITY" }, images: { "event-image": img("u9") } }),
    D(pj, "speaker", "square", "Anna Le Page · Square", { theme: 1, age: 1, sched: "2026-10-09", copy: { eventNumber: "38", name: "Anna Le Page", role: "Partner,", company: "Rathbones", date: "Wed 14 Oct", startTime: "8am", endTime: "9.30am", venue: "Wild Peak, St Peter Port", barLabel: "COMMUNITY" }, images: { "speaker-photo": img("u4", 50, 30) } })
  ]);
  // 4 — active
  pj = P("Partner announcement · Rathbones", "Welcoming Rathbones as a founding partner. Brand announcement plus the refreshed partner wall.", 9);
  add(pj, [
    D(pj, "lockup", "square", "Rathbones announcement · Square", { theme: 3, sched: "2026-09-26", copy: { body: "TEKEX welcomes Rathbones as a founding partner of the innovation community.", barLabel: "PARTNERS" } }),
    D(pj, "partners", "landscape", "Partner wall · Landscape", { theme: 4, age: 1, copy: { headline: "TEKEX X Rathbones", barLabel: "PARTNERS" } }),
    D(pj, "lockup", "story", "Rathbones announcement · Story", { theme: 3, age: 1, sched: "2026-09-26", copy: { body: "TEKEX welcomes Rathbones as a founding partner of the innovation community.", barLabel: "PARTNERS" } })
  ]);
  // 5 — active
  pj = P("Autumn programme launch", "The full autumn calendar: talks, workshops and socials. One announcement in three sizes and a listing of what's on.", 2);
  fam = uid("f");
  add(pj, [
    D(pj, "event", "portrait", "Autumn programme · Portrait", { theme: 2, family: fam, sched: "2026-10-12", copy: { headline: "Autumn at TEKEX", body: "Twelve events across ten weeks. Talks, workshops and socials for founders, investors and operators.", date: "From Mon 12 Oct", startTime: "", endTime: "", venue: "Across Jersey and Guernsey", barLabel: "EVENT" }, images: { "event-image": img("u10") } }),
    D(pj, "event", "story", "Autumn programme · Story", { theme: 2, family: fam, sched: "2026-10-12", copy: { headline: "Autumn at TEKEX", body: "Twelve events across ten weeks. Talks, workshops and socials for founders, investors and operators.", date: "From Mon 12 Oct", startTime: "", endTime: "", venue: "Across Jersey and Guernsey", barLabel: "EVENT" }, images: { "event-image": img("u10") } }),
    D(pj, "event", "landscape", "Autumn programme · Landscape", { theme: 2, family: fam, copy: { headline: "Autumn at TEKEX", body: "Twelve events across ten weeks. Talks, workshops and socials for founders, investors and operators.", date: "From Mon 12 Oct", startTime: "", endTime: "", venue: "Across Jersey and Guernsey", barLabel: "EVENT" }, images: { "event-image": img("u10") } }),
    D(pj, "listing", "square", "What's on · Square", { theme: 0, age: 1, copy: { eyebrow: "Autumn 2026 · What's on", headline: "Twelve events, ten weeks", body: "Save the dates. Tickets open a fortnight before each event.", date: "Oct – Dec", startTime: "", endTime: "", venue: "", barLabel: "EVENT" }, speakers: [{ name: "Founders Breakfast", role: "Wed 14 Oct", company: "Wild Peak" }, { name: "Health Innovation Summit", role: "Thu 8 Oct", company: "BDO/C5 Hub" }, { name: "Investor roundtable", role: "Tue 3 Nov", company: "Rathbones" }, { name: "Winter social", role: "Thu 10 Dec", company: "Windward House" }] })
  ]);
  // 6 — active
  pj = P("Jersey Innovation Week", "TEKEX's programme within Innovation Week. Session trio for the panel, speaker cards and a thank-you to partners.", 15);
  add(pj, [
    D(pj, "trio", "square", "Future of finance panel · Square", { theme: 1, sched: "2026-10-16", copy: { sessionPrefix: "2.00pm · Panel", sessionTitle: "The future of finance in the islands", date: "Tue 20 Oct", venue: "Windward House, St Helier" }, trio: [{ name: "Sam Ozanne", company: "BDO" }, { name: "Anna Le Page", company: "Rathbones" }, { name: "Priya Nair", company: "C5 Alliance" }], images: { "trio-1": img("u5", 50, 30), "trio-2": img("u4", 50, 30), "trio-3": img("u6", 50, 30) } }),
    D(pj, "speaker", "portrait", "Sam Ozanne · Portrait", { theme: 0, age: 1, sched: "2026-10-19", copy: { eventNumber: "39", name: "Sam Ozanne", role: "Director,", company: "BDO", date: "Tue 20 Oct", startTime: "2pm", endTime: "3.30pm", venue: "Windward House, St Helier" }, images: { "speaker-photo": img("u5", 50, 30) } }),
    D(pj, "partners", "square", "Thank you partners · Square", { theme: 5, age: 2, sched: "2026-10-23", copy: { headline: "Thank you", barLabel: "PARTNERS" } })
  ]);
  // 7 — archived
  pj = P("TEKEX #35 · Summer social", "June rooftop social. Announcement and the two speaker cards that went out on the day.", 100, true);
  add(pj, [
    D(pj, "event", "square", "Summer social · Square", { theme: 0, sched: "2026-06-10", copy: { headline: "Summer social", body: "Rooftop drinks with the TEKEX community. Bring a founder who hasn't been before.", date: "Thu 18 Jun", startTime: "6pm", endTime: "9pm", venue: "The Rooftop, St Helier", barLabel: "COMMUNITY" }, images: { "event-image": img("u2") } }),
    D(pj, "speaker", "square", "Lisa McCabe · Square", { theme: 5, age: 1, sched: "2026-06-15", copy: { eventNumber: "35", name: "Lisa McCabe", role: "CEO,", company: "The Wellbeing Co", date: "Thu 18 Jun", startTime: "6pm", endTime: "9pm", venue: "The Rooftop, St Helier" }, images: { "speaker-photo": img("tk-lisa-mccabe", 50, 30) } })
  ]);
  // 8 — archived
  pj = P("2040 Accelerator pitch night", "Pitch night for the 2040 Accelerator cohort. Brand announcement and the cohort listing.", 130, true);
  add(pj, [
    D(pj, "lockup", "square", "Pitch night · Square", { theme: 2, sched: "2026-05-14", copy: { body: "Eight founders. Five minutes each. One room full of people who can help.", barLabel: "EVENT" } }),
    D(pj, "listing", "portrait", "Cohort listing · Portrait", { theme: 4, age: 1, sched: "2026-05-18", copy: { eyebrow: "2040 Accelerator · Cohort one", headline: "Meet the cohort", body: "Eight companies building from the Crown Dependencies.", date: "Thu 21 May", startTime: "6pm", endTime: "8.30pm", venue: "Digital Jersey Hub", barLabel: "SPEAKERS" }, speakers: [{ name: "Nic Rose", role: "Founder", company: "iO-CO" }, { name: "Priya Nair", role: "Co-founder", company: "Tideway" }, { name: "Sam Ozanne", role: "Founder", company: "Harbourline" }] })
  ]);
  // 9 — archived
  pj = P("Spring investor roundtable", "Closed-door investor roundtable in March. Speaker card for the chair and the announcement.", 190, true);
  add(pj, [
    D(pj, "speaker", "square", "Anna Le Page · Square", { theme: 3, sched: "2026-03-09", copy: { eventNumber: "33", name: "Anna Le Page", role: "Partner,", company: "Rathbones", date: "Thu 12 Mar", startTime: "12pm", endTime: "2pm", venue: "Rathbones, St Helier", barLabel: "TALKS" }, images: { "speaker-photo": img("u4", 50, 30) } }),
    D(pj, "event", "linkedin", "Roundtable · LinkedIn post", { theme: 1, age: 1, sched: "2026-03-05", copy: { headline: "Investor roundtable", body: "An invitation-only conversation on early-stage capital in the islands.", date: "Thu 12 Mar", startTime: "12pm", endTime: "2pm", venue: "Rathbones, St Helier", barLabel: "TALKS" }, images: { "event-image": img("u8") } })
  ]);
  return { projects, drafts };
}
const UPLOADS_KEY = "hs-uploads-v1";
const MAX_UPLOAD_MB = 15;
const MAX_EDGE = 1800;

function uid(p) { return (p || "d") + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4); }
function slug(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "design"; }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function join(parts, sep) { return parts.filter(p => p && String(p).trim()).join(sep); }
function composeDateLine(c) {
  const when = join([c.startTime, c.endTime], " – ");
  const first = join([c.date, when], ": ");
  return join([first, c.venue], ", ");
}
function composeEyebrow(c) { return c.eventNumber ? "TEKEX #" + c.eventNumber + " Speaker:" : "TEKEX Speaker:"; }
function lum(rgb) { const p = rgb.map(v => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }); return 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2]; }
function parseRgb(str) { const m = String(str).match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/); return m ? [+m[1], +m[2], +m[3]] : [0, 0, 0]; }
function contrast(a, b) { const la = lum(parseRgb(a)), lb = lum(parseRgb(b)); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); }
function fitSize(str, base, minRatio) {
  const n = (str || "").length;
  const r = n <= 14 ? 1 : n <= 20 ? 0.82 : n <= 28 ? 0.66 : n <= 40 ? 0.54 : minRatio;
  return Math.round(base * Math.max(r, minRatio));
}
function newDesign(tpl, size, projectId) {
  const d = {
    id: uid("d"), tpl, size, theme: 0, title: TPL[tpl].name, projectId: projectId || null, familyId: uid("f"), scheduledAt: "", thumb: "",
    platforms: (DEFAULT_PLATFORMS[size] || ["linkedin"]).slice(), caption: { mode: "auto", variant: 0, text: {} },
    copy: Object.assign({}, EXAMPLE_COPY),
    speakers: EXAMPLE_SPEAKERS.map(s => Object.assign({}, s)),
    trio: EXAMPLE_TRIO.map(t => Object.assign({}, t)),
    images: {}, partnersOn: BRAND.partners.map(p => p.key),
    showBar: true, showPowered: true, showHero: true, showPortraits: true,
    updatedAt: Date.now()
  };
  d.images = fillImages(d);
  return d;
}
function slotsFor(d) {
  if (d.tpl === "speaker") return [{ id: "speaker-photo", label: "Speaker portrait" }];
  if (d.tpl === "event")   return [{ id: "event-image", label: "Event image" }];
  if (d.tpl === "trio")    return d.trio.map((t, i) => ({ id: "trio-" + (i + 1), label: t.name || "Session " + (i + 1) }));
  if (d.tpl === "listing") {
    const out = d.showHero ? [{ id: "listing-hero", label: "Header image" }] : [];
    if (d.showPortraits) d.speakers.forEach((sp, i) => out.push({ id: "listing-" + sp.id, label: sp.name || "Speaker " + (i + 1) }));
    return out;
  }
  return [];
}
function imgVals(im) {
  if (!im || !im.src) return { has: false, src: "", style: {} };
  const x = im.x == null ? 50 : im.x, y = im.y == null ? 50 : im.y, z = im.zoom || 1;
  return {
    has: true, src: im.src,
    style: { position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", objectFit: "cover",
             objectPosition: x + "% " + y + "%", transform: "scale(" + z + ")", transformOrigin: x + "% " + y + "%" }
  };
}
function readFileAsImage(file) {
  return new Promise((resolve, reject) => {
    const okTypes = ["image/png", "image/jpeg", "image/webp"];
    if (okTypes.indexOf(file.type) < 0) return reject(new Error("That file type isn't supported. Use PNG, JPG or WebP."));
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) return reject(new Error("That file is over " + MAX_UPLOAD_MB + " MB. Try a smaller version."));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
        const w = Math.round(img.naturalWidth * scale), h = Math.round(img.naturalHeight * scale);
        const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
        cv.getContext("2d").drawImage(img, 0, 0, w, h);
        const keepPng = file.type === "image/png";
        const src = keepPng ? cv.toDataURL("image/png") : cv.toDataURL("image/jpeg", 0.88);
        URL.revokeObjectURL(url);
        resolve({ id: uid("u"), name: file.name.replace(/\.[^.]+$/, ""), src, w, h, addedAt: Date.now() });
      } catch (e) { reject(new Error("We couldn't read that image.")); }
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("We couldn't read that image.")); };
    img.src = url;
  });
}


/* ---------- persistence adapter: swap this for a real backend without touching the UI ---------- */
const Store = {
  get(key, fallback) { try { const v = JSON.parse(localStorage.getItem(key) || "null"); return v == null ? fallback : v; } catch (e) { return fallback; } },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
  raw(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
  flag(key) { try { localStorage.setItem(key, "1"); } catch (e) {} }
};
const THUMBS_KEY = "hs-thumbs-v1";
/* Lazy-load the export/thumbnail renderer only when first needed. */
let __shotP = null;
function ensureShot() {
  if (window.modernScreenshot) return Promise.resolve(window.modernScreenshot);
  if (!__shotP) __shotP = new Promise((res, rej) => { const el = document.createElement("script"); el.src = "vendor/modern-screenshot.js"; el.onload = () => res(window.modernScreenshot); el.onerror = () => { __shotP = null; rej(new Error("renderer failed to load")); }; document.head.appendChild(el); });
  return __shotP;
}

/* expose for tests (node) */
if (typeof module !== 'undefined') module.exports = { SIZES, SIZE_ORDER, BRAND, TEMPLATES, TPL, FIELDS, PLATFORMS, DEFAULT_PLATFORMS, composeDateLine, composeEyebrow, fitSize, slug, join, draftCaption, newDesign, newProject, slotsFor, seedExamples, contrast, listNames, isoDay, fmtShort, fillImages, portraitFor };
