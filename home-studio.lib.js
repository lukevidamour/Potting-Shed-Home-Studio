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
    /* TEKEX photography from the Health Innovation site */
    { id: "tk-andrew-mcneill", name: "Andrew McNeill — speaker portrait", src: "assets/photos/andrew-mcneill.webp" },
    { id: "tk-jeff-macleod", name: "Jeff MacLeod — speaker portrait", src: "assets/photos/jeff-macleod.webp" },
    { id: "tk-nic-rose", name: "Nic Rose — speaker portrait", src: "assets/photos/nic-rose.webp" },
    { id: "tk-niraj-singh", name: "Dr Niraj Singh — speaker portrait", src: "assets/photos/niraj-singh.webp" },
    { id: "tk-guy-thompson", name: "Guy Thompson — speaker portrait", src: "assets/photos/guy-thompson.webp" },
    { id: "tk-ian-rhodes", name: "Ian Rhodes — speaker portrait", src: "assets/photos/ian-rhodes.webp" },
    { id: "tk-gabe-drogon", name: "Gabe Drogon — speaker portrait", src: "assets/photos/gabe-drogon.webp" },
    { id: "tk-peter-o-brady", name: "Peter O'Brady — speaker portrait", src: "assets/photos/peter-o-brady.webp" },
    { id: "tk-claire-trant", name: "Claire Trant — speaker portrait", src: "assets/photos/claire-trant.webp" },
    { id: "tk-lisa-mccabe", name: "Lisa McCabe — speaker portrait", src: "assets/photos/lisa-mccabe.webp" },
    { id: "tk-hannah-mellor", name: "Hannah Mellor — speaker portrait", src: "assets/photos/hannah-mellor.webp" },
    { id: "tk-jake-schofield", name: "Jake Schofield — speaker portrait", src: "assets/photos/jake-schofield.webp" },
    { id: "tk-oliver-le-brun", name: "Oliver Le Brun — speaker portrait", src: "assets/photos/oliver-le-brun.webp" },
    { id: "tk-austin-gibbs", name: "Austin Gibbs — speaker portrait", src: "assets/photos/austin-gibbs.webp" },
    { id: "tk-dr-omar", name: "Dr Omar — speaker portrait", src: "assets/photos/dr-omar.webp" },
    { id: "tk-event-photo-bw", name: "Event — audience, black and white", src: "assets/photos/event-photo-bw.webp" },
    { id: "tk-audience-photo-bw", name: "Audience — black and white", src: "assets/photos/audience-photo-bw.webp" },
    { id: "tk-hero-loop-poster", name: "Health Innovation hero still", src: "assets/photos/hero-loop-poster.jpg" },
    { id: "tk-overview-4-5-poster", name: "Overview still — portrait", src: "assets/photos/overview-4-5-poster.jpg" },
    { id: "tk-closing-loop-poster", name: "Closing still", src: "assets/photos/closing-loop-poster.jpg" },
    { id: "tk-reasons-1", name: "Venue — detail 1", src: "assets/photos/reasons-1.jpg" },
    { id: "tk-reasons-2", name: "Venue — detail 2", src: "assets/photos/reasons-2.jpg" },
    { id: "tk-reasons-3", name: "Venue — detail 3", src: "assets/photos/reasons-3.jpg" },
    { id: "tk-reasons-4", name: "Venue — detail 4", src: "assets/photos/reasons-4.jpg" },
    { id: "lib-al-mitchell", name: "Al Mitchell — speaker portrait", src: "assets/speaker-al-mitchell.jpg", w: 675, h: 900 },
    /* Example stock imagery (Unsplash, served with CORS so it exports). Replace with approved TEKEX photography. */
    { id: "u1", name: "Team around a table",     src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80", stock: true },
    { id: "u2", name: "Working session",         src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80", stock: true },
    { id: "u3", name: "Boardroom meeting",       src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=80", stock: true },
    { id: "u4", name: "Speaker portrait — woman", src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1600&q=80", stock: true },
    { id: "u5", name: "Speaker portrait — man",  src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1600&q=80", stock: true },
    { id: "u6", name: "Portrait — smiling",      src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1600&q=80", stock: true },
    { id: "u7", name: "Portrait — outdoors",     src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=80", stock: true },
    { id: "u8", name: "Laptops at a workshop",   src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&q=80", stock: true },
    { id: "u9", name: "Desk and notebook",       src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&q=80", stock: true },
    { id: "u10", name: "Co-working space",       src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&q=80", stock: true }
  ]
};
const LIB = Object.fromEntries(BRAND.library.map(im => [im.id, im]));

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
function initials(name) { return String(name || "").split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("") || "P"; }
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
  return {
    id: uid("d"), tpl, size, theme: 0, title: TPL[tpl].name, projectId: projectId || null, familyId: uid("f"), scheduledAt: "", thumb: "",
    platforms: (DEFAULT_PLATFORMS[size] || ["linkedin"]).slice(), caption: { mode: "auto", variant: 0, text: {} },
    copy: Object.assign({}, EXAMPLE_COPY),
    speakers: EXAMPLE_SPEAKERS.map(s => Object.assign({}, s)),
    trio: EXAMPLE_TRIO.map(t => Object.assign({}, t)),
    images: {}, partnersOn: BRAND.partners.map(p => p.key),
    showBar: true, showPowered: true, showHero: true, showPortraits: true,
    updatedAt: Date.now()
  };
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
if (typeof module !== 'undefined') module.exports = { SIZES, SIZE_ORDER, BRAND, TEMPLATES, TPL, FIELDS, PLATFORMS, DEFAULT_PLATFORMS, composeDateLine, composeEyebrow, fitSize, slug, join, draftCaption, newDesign, newProject, slotsFor, seedExamples, contrast, listNames, isoDay, fmtShort };
