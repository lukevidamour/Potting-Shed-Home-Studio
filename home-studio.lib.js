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
  name: "TEKEX",
  url: "TEKEX.CO",
  logo: null,                             // null = the built-in TEKEX wordmark; otherwise { src, name } (SVG or PNG with a transparent background)
  about: "TEKEX is the innovation community for the Crown Dependencies. It connects founders, investors, operators and policymakers through talks, socials and an annual summit.",
  voice: "Confident, plain-spoken and warm. Lead with the person or the event, not with TEKEX. Short sentences. No jargon, no exclamation marks.",
  dos: ["Name the speaker and their company in full", "Give the date, time and venue on every event post", "Use one colourway per campaign so a series reads as a set"],
  donts: ["Stretch, recolour or crop the wordmark", "Put text over faces in photography", "Mix more than two brand colours on one artwork"],
  hashtags: "#TEKEX #ChannelIslands #Innovation",
  palette: [
    { name: "Mint",    value: "#81FFE7" },
    { name: "Magenta", value: "#F824FF" },
    { name: "Violet",  value: "#7824FF" },
    { name: "Lime",    value: "#D0FFBF" },
    { name: "Ink",     value: "#141414" },
    { name: "Light",   value: "#E5E6E7" }
  ],
  fonts: { display: "PP Neue Montreal", accent: "Quarto Italic" },
  /* How the templates are drawn. These are the levers a designer would reach for; everything else is fixed by the layout. */
  type: { headWeight: 600 },                       // 400 Regular · 500 Medium · 600 Semi-bold, for names, headlines and labels
  style: { line: 2, radius: 0, photo: "colour" },  // keyline weight in px (0 = none) · image corner radius · "colour" or "mono"
  logoSize: "m",                                   // how large the logo sits in the footer: s · m · l
  imagery: "Mono cut-out portraits on a brand colour. Wide, well-lit room shots for events. No stock photography.",
  strategy: { strapline: "", positioning: "", messages: ["The innovation community for the Crown Dependencies", "Founders, investors, operators and policymakers in one room", "Talks, socials and an annual summit"], audiences: ["Founders and operators", "Investors", "Policymakers", "Partners and sponsors"] },
  compliance: { approver: "", wording: "", social: "" },
  templatesOn: ["speaker", "event", "listing", "trio", "partners", "lockup"],
  team: [
    { name: "Luke Vidamour", role: "Partner, Potting Shed", src: "assets/team/luke-vidamour.jpg" },
    { name: "Ed Prow",       role: "Partner, Potting Shed", src: "assets/team/ed-prow.jpg" },
    { name: "Tom Langford",  role: "Partner, Potting Shed", src: "assets/team/tom-langford.jpg" },
    { name: "Al Mitchell",   role: "Partner, Potting Shed", src: "assets/team/al-mitchell.jpg" }
  ],
  log: [],
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
/* Focal points for portraits: [face centre across, top of the head down], as % of the image. Used as the default
   position, because object-position P% lines up the image's P% with the frame's P%: the top of the head then sits
   just inside the frame at any frame shape, instead of being cropped by a fixed guess. */
const FOCUS = {
  "tk-andrew-mcneill": [42, 2], "tk-jeff-macleod": [50, 5], "tk-nic-rose": [50, 3], "tk-niraj-singh": [50, 4], "tk-guy-thompson": [50, 3],
  "tk-ian-rhodes": [50, 3], "tk-gabe-drogon": [50, 2], "tk-peter-o-brady": [50, 3], "tk-claire-trant": [49, 4], "tk-lisa-mccabe": [50, 4],
  "tk-hannah-mellor": [48, 3], "tk-jake-schofield": [50, 4], "tk-oliver-le-brun": [47, 5], "tk-austin-gibbs": [50, 4], "tk-dr-omar": [48, 4],
  "tk-serena-guthrie-cutout": [50, 3], "tk-serena-guthrie": [50, 3], "tk-tim-huelin-cutout": [45, 2], "lib-al-mitchell": [55, 6],
  "tk-ed": [50, 8], "tk-ed-bw": [48, 8], "tk-tom": [48, 10], "tk-tom-bw": [48, 10], "tk-louis": [50, 3], "tk-al-mitchell-portrait": [42, 21]
};
Object.keys(FOCUS).forEach(id => { if (LIB[id]) { LIB[id].fx = FOCUS[id][0]; LIB[id].fy = FOCUS[id][1]; } });
/* Cut-outs (a person on a transparent background) are never stretched to fill a frame: that blows the head up and
   cuts off the shoulders. They stand on the bottom edge at the frame's height, centred on the face. */
BRAND.library.forEach(im => { if (/\.webp$/.test(im.src) && im.group === "Speakers" || /-cutout\./.test(im.src)) { im.cut = true; im.w = im.w || 680; im.h = im.h || 638; } });
const CUT_SRC = {}; BRAND.library.forEach(im => { if (im.cut) CUT_SRC[im.src] = true; });
function focusOf(im, x, y) { return im && im.fx != null ? { x: im.fx, y: im.fy } : { x: x == null ? 50 : x, y: y == null ? 50 : y }; }
/* Default imagery: every image area starts filled with TEKEX photography, chosen from the design id so it is stable. */
const PORTRAIT_IDS = ["tk-nic-rose", "tk-niraj-singh", "tk-lisa-mccabe", "tk-andrew-mcneill", "tk-jeff-macleod", "tk-guy-thompson", "tk-ian-rhodes", "tk-gabe-drogon", "tk-peter-o-brady", "tk-claire-trant", "tk-hannah-mellor", "tk-jake-schofield", "tk-oliver-le-brun", "tk-austin-gibbs", "tk-dr-omar", "tk-serena-guthrie"];
/* Defaults for event imagery: wide, well-lit room shots that survive any crop. Close-ups and reel frames stay in the library but are not picked automatically. */
const EVENT_IDS = ["tk-event-03", "tk-event-10", "tk-event-01", "tk-event-02", "tk-event-06", "tk-event-04", "tk-event-07", "tk-event-09", "tk-event-05", "tk-iom-02", "tk-iom-07", "tk-iom-06", "tk-iom-09", "tk-event-extra-01", "tk-event-12", "tk-event-14"];
function hashStr(str) { let h = 0; for (let i = 0; i < String(str).length; i++) h = (h * 31 + String(str).charCodeAt(i)) >>> 0; return h; }
function libImg(id, x, y) { const im = LIB[id]; if (!im) return null; const f = focusOf(im, x, y); const rec = { src: im.src, name: im.name, x: f.x, y: f.y, zoom: 1 }; if (im.cut) rec.cut = true; if (im.w) { rec.w = im.w; rec.h = im.h; } return rec; }
/* The library portrait that belongs to a name, if there is one. Titles are ignored, so "Dr Niraj Singh" finds Niraj Singh. */
function portraitMatch(name) {
  const s = slug(String(name || "").replace(/^(dr|prof|professor|sir|dame|mr|mrs|ms)\.?\s+/i, "")); if (!s) return null;
  return PORTRAIT_IDS.find(id => id === "tk-" + s || id === "staff-" + s) || PORTRAIT_IDS.find(id => LIB[id] && LIB[id].person && slug(LIB[id].person) === s) || null;
}
function portraitFor(name, seed) { return libImg(portraitMatch(name) || PORTRAIT_IDS[hashStr(seed) % PORTRAIT_IDS.length], 50, 28); }
function eventImageFor(seed) { return libImg(EVENT_IDS[hashStr(seed) % EVENT_IDS.length], 50, 50); }
/* Fill any empty image area on a design. Returns a new images map (or the same one if nothing was missing). */
function fillImages(d) {
  const images = Object.assign({}, d.images || {}); let changed = false;
  const put = (slot, im) => { if (!images[slot] && im) { images[slot] = im; changed = true; } };
  if (packTpl(d.tpl) && PACK.fill) { PACK.fill(d, put, libImg, portraitMatch); return changed ? images : (d.images || {}); }
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
  { key: "partners", name: "Showcase your partners",   desc: "Approved partner logos in a tidy grid.",                         required: ["headline"] },
  { key: "lockup",   name: "Brand announcement",       desc: "The logo with a single line of copy.",                        required: ["body"] }
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
  date: (() => { const t = new Date(); t.setDate(t.getDate() + 14 + ((5 - t.getDay() + 7) % 7)); return "Fri " + t.getDate() + " " + ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][t.getMonth()]; })(), startTime: "2pm", endTime: "5pm", venue: "C5 Hub, Windward House",
  barLabel: "SPEAKERS", url: BRAND.url
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
  const url = (c.url || BRAND.url || "").trim().toLowerCase();
  const when = composeDateLine(c);
  let hook = "", body = "", cta = "";
  if (T === "speaker") {
    const roleCo = join([(c.role || "").replace(/[,\s]+$/, ""), c.company], " at ");
    hook = c.name ? pick(["Meet " + c.name + ".", c.name + " joins the " + BRAND.name + " line-up.", "Speaker announcement: " + c.name + "."]) : "";
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
  cta = url ? pick(["Details at " + url, "More at " + url, "Find out more: " + url]) : "";
  const brandTags = (BRAND.hashtags || "").trim();
  const tags = join([brandTags, (T === "speaker" || T === "listing" || T === "trio" ? "#Speakers" : ""), (T === "event" ? "#Events" : "")], " ");
  if (!hook && !body) return "";
  if (platform === "x") {
    let t = join([hook, body, cta], " ");
    if (t.length > 280) t = join([hook, cta], " ");
    if (t.length > 280) t = t.slice(0, 277).replace(/\s+\S*$/, "") + "…";
    return t;
  }
  if (platform === "instagram") return join([hook, body, cta, tags], "\n\n");
  if (platform === "facebook") return join([hook, body, cta], "\n\n");
  return join([hook, body, cta, brandTags.split(/\s+/).filter(Boolean).slice(0, 2).join(" ")], "\n\n");
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
function seedExamples(existing, opts) {
  const have = new Set(existing.map(pj => pj.name));
  const DAY = 86400000, now = (opts && opts.now) || Date.now();
  /* The examples were written as if today were Wed 23 Sep 2026. Every date below is given as written and moved by
     whole weeks to sit the same distance from the real today, so weekdays stay true and the calendar is never stale. */
  const weeks = opts && opts.weeks != null ? opts.weeks : seedWeeks(now);
  const at = (base) => { const [y, m, d] = base.split("-").map(Number); return new Date(y, m - 1, d + weeks * 7); };
  const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], ML = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const iso = (base) => isoDay(at(base));
  const day = (base) => { const t = at(base); return WD[t.getDay()] + " " + t.getDate() + " " + MS[t.getMonth()]; };
  const mon = (base) => ML[at(base).getMonth()], monS = (base) => MS[at(base).getMonth()], yr = (base) => at(base).getFullYear();
  const season = (base) => ["Winter", "Winter", "Spring", "Spring", "Spring", "Summer", "Summer", "Summer", "Autumn", "Autumn", "Autumn", "Winter"][at(base).getMonth()];
  const SP = season("2026-11-16"), SS = season("2026-06-18"), SR = season("2026-03-12"); // programme, social, roundtable
  const projects = [], drafts = [];
  const img = (id, x, y) => libImg(id, x, y);
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
  pj = P("TEKEX #36 · Speaker campaign", "Social assets for the " + mon("2026-10-02") + " speaker event. One card per speaker, plus the event announcement.", 6);
  fam = uid("f");
  add(pj, [
    D(pj, "trio", "square", "Wellness sessions · Square", { theme: 4, sched: iso("2026-09-24"), copy: { date: day("2026-10-02") }, images: { "trio-1": img("tk-nic-rose", 50, 30), "trio-2": img("tk-niraj-singh", 50, 30), "trio-3": img("tk-lisa-mccabe", 50, 30) } }),
    D(pj, "event", "portrait", "Event announcement · Portrait", { theme: 1, age: 1, sched: iso("2026-09-23"), copy: { date: day("2026-10-02") }, images: { "event-image": img("u1") } }),
    D(pj, "speaker", "square", "Richard Tavernor · Square", { age: 2, family: fam, sched: iso("2026-09-29"), copy: { date: day("2026-10-02") }, images: { "speaker-photo": img("u5", 50, 30) } }),
    D(pj, "speaker", "linkedin", "Richard Tavernor · LinkedIn post", { age: 2, family: fam, sched: iso("2026-09-29"), copy: { date: day("2026-10-02") }, images: { "speaker-photo": img("u5", 50, 30) } })
  ]);
  // 2 — active
  pj = P("Health Innovation Summit", "Two-day summit at the BDO/C5 Hub. Speaker cards for the keynote line-up and a partner wall for the sponsors.", 12);
  fam = uid("f");
  add(pj, [
    D(pj, "listing", "portrait", "Keynote line-up · Portrait", { theme: 2, sched: iso("2026-10-02"), copy: { eyebrow: "Health Innovation Summit · Day one", headline: "Meet the keynote speakers", body: "Clinicians, founders and investors on where health tech goes next.", date: day("2026-10-08"), startTime: "9am", endTime: "5pm", venue: "BDO/C5 Hub, St Helier", barLabel: "TALKS" }, images: { "listing-hero": img("u3") }, speakers: [{ name: "Dr Niraj Singh", role: "Founder", company: "Ketamine Therapies" }, { name: "Lisa McCabe", role: "CEO", company: "The Wellbeing Co" }, { name: "Nic Rose", role: "Director", company: "iO-CO" }, { name: "Priya Nair", role: "CTO", company: "C5 Alliance" }] }),
    D(pj, "speaker", "portrait", "Dr Niraj Singh · Portrait", { theme: 5, age: 1, family: fam, sched: iso("2026-10-05"), copy: { eventNumber: "37", name: "Dr Niraj Singh", role: "Founder,", company: "Ketamine Therapies", date: day("2026-10-08"), startTime: "9am", endTime: "5pm", venue: "BDO/C5 Hub, St Helier", barLabel: "TALKS" }, images: { "speaker-photo": img("tk-niraj-singh", 50, 25) } }),
    D(pj, "speaker", "story", "Dr Niraj Singh · Story", { theme: 5, age: 1, family: fam, sched: iso("2026-10-06"), copy: { eventNumber: "37", name: "Dr Niraj Singh", role: "Founder,", company: "Ketamine Therapies", date: day("2026-10-08"), startTime: "9am", endTime: "5pm", venue: "BDO/C5 Hub, St Helier", barLabel: "TALKS" }, images: { "speaker-photo": img("tk-niraj-singh", 50, 25) } }),
    D(pj, "partners", "square", "Summit sponsors · Square", { theme: 3, age: 2, copy: { headline: "With thanks to our partners", barLabel: "PARTNERS" } })
  ]);
  // 3 — active
  pj = P("Founders Breakfast · " + mon("2026-10-14"), "Monthly founders breakfast. Announcement post, speaker card and a LinkedIn version for the host.", 4);
  fam = uid("f");
  add(pj, [
    D(pj, "event", "square", "Breakfast announcement · Square", { theme: 0, family: fam, sched: iso("2026-09-30"), copy: { headline: "Founders Breakfast", body: "Coffee, pastries and honest conversation about building companies from the Channel Islands.", date: day("2026-10-14"), startTime: "8am", endTime: "9.30am", venue: "Wild Peak, St Peter Port", barLabel: "COMMUNITY" }, images: { "event-image": img("u9") } }),
    D(pj, "event", "linkedin", "Breakfast announcement · LinkedIn post", { theme: 0, family: fam, sched: iso("2026-10-01"), copy: { headline: "Founders Breakfast", body: "Coffee, pastries and honest conversation about building companies from the Channel Islands.", date: day("2026-10-14"), startTime: "8am", endTime: "9.30am", venue: "Wild Peak, St Peter Port", barLabel: "COMMUNITY" }, images: { "event-image": img("u9") } }),
    D(pj, "speaker", "square", "Anna Le Page · Square", { theme: 1, age: 1, sched: iso("2026-10-09"), copy: { eventNumber: "38", name: "Anna Le Page", role: "Partner,", company: "Rathbones", date: day("2026-10-14"), startTime: "8am", endTime: "9.30am", venue: "Wild Peak, St Peter Port", barLabel: "COMMUNITY" }, images: { "speaker-photo": img("u4", 50, 30) } })
  ]);
  // 4 — active
  pj = P("Partner announcement · Rathbones", "Welcoming Rathbones as a founding partner. Brand announcement plus the refreshed partner wall.", 9);
  add(pj, [
    D(pj, "lockup", "square", "Rathbones announcement · Square", { theme: 3, sched: iso("2026-09-26"), family: "f-rathbones-" + pj.id, copy: { body: "TEKEX welcomes Rathbones as a founding partner of the innovation community.", barLabel: "PARTNERS" } }),
    D(pj, "partners", "landscape", "Partner wall · Landscape", { theme: 4, age: 1, copy: { headline: "TEKEX X Rathbones", barLabel: "PARTNERS" } }),
    D(pj, "lockup", "story", "Rathbones announcement · Story", { theme: 3, age: 1, sched: iso("2026-09-26"), family: "f-rathbones-" + pj.id, copy: { body: "TEKEX welcomes Rathbones as a founding partner of the innovation community.", barLabel: "PARTNERS" } })
  ]);
  // 5 — active
  pj = P(SP + " programme launch", "The full " + SP.toLowerCase() + " calendar: talks, workshops and socials. One announcement in three sizes and a listing of what's on.", 2);
  fam = uid("f");
  add(pj, [
    D(pj, "event", "portrait", SP + " programme · Portrait", { theme: 2, family: fam, sched: iso("2026-10-12"), copy: { headline: SP + " at TEKEX", body: "Twelve events across ten weeks. Talks, workshops and socials for founders, investors and operators.", date: "From " + day("2026-10-12"), startTime: "", endTime: "", venue: "Across Jersey and Guernsey", barLabel: "EVENT" }, images: { "event-image": img("u10") } }),
    D(pj, "event", "story", SP + " programme · Story", { theme: 2, family: fam, sched: iso("2026-10-12"), copy: { headline: SP + " at TEKEX", body: "Twelve events across ten weeks. Talks, workshops and socials for founders, investors and operators.", date: "From " + day("2026-10-12"), startTime: "", endTime: "", venue: "Across Jersey and Guernsey", barLabel: "EVENT" }, images: { "event-image": img("u10") } }),
    D(pj, "event", "landscape", SP + " programme · Landscape", { theme: 2, family: fam, copy: { headline: SP + " at TEKEX", body: "Twelve events across ten weeks. Talks, workshops and socials for founders, investors and operators.", date: "From " + day("2026-10-12"), startTime: "", endTime: "", venue: "Across Jersey and Guernsey", barLabel: "EVENT" }, images: { "event-image": img("u10") } }),
    D(pj, "listing", "square", "What's on · Square", { theme: 0, age: 1, copy: { eyebrow: SP + " " + yr("2026-10-12") + " · What's on", headline: "Twelve events, ten weeks", body: "Save the dates. Tickets open a fortnight before each event.", date: monS("2026-10-12") + " – " + monS("2026-12-21"), startTime: "", endTime: "", venue: "", barLabel: "EVENT" }, speakers: [{ name: "Founders Breakfast", role: day("2026-10-14"), company: "Wild Peak" }, { name: "Health Innovation Summit", role: day("2026-10-08"), company: "BDO/C5 Hub" }, { name: "Investor roundtable", role: day("2026-11-03"), company: "Rathbones" }, { name: season("2026-12-10") + " social", role: day("2026-12-10"), company: "Windward House" }] })
  ]);
  // 6 — active
  pj = P("Jersey Innovation Week", "TEKEX's programme within Innovation Week. Session trio for the panel, speaker cards and a thank-you to partners.", 15);
  add(pj, [
    D(pj, "trio", "square", "Future of finance panel · Square", { theme: 1, sched: iso("2026-10-16"), copy: { sessionPrefix: "2.00pm · Panel", sessionTitle: "The future of finance in the islands", date: day("2026-10-20"), venue: "Windward House, St Helier" }, trio: [{ name: "Sam Ozanne", company: "BDO" }, { name: "Anna Le Page", company: "Rathbones" }, { name: "Priya Nair", company: "C5 Alliance" }], images: { "trio-1": img("u5", 50, 30), "trio-2": img("u4", 50, 30), "trio-3": img("u6", 50, 30) } }),
    D(pj, "speaker", "portrait", "Sam Ozanne · Portrait", { theme: 0, age: 1, sched: iso("2026-10-19"), copy: { eventNumber: "39", name: "Sam Ozanne", role: "Director,", company: "BDO", date: day("2026-10-20"), startTime: "2pm", endTime: "3.30pm", venue: "Windward House, St Helier" }, images: { "speaker-photo": img("u5", 50, 30) } }),
    D(pj, "partners", "square", "Thank you partners · Square", { theme: 5, age: 2, sched: iso("2026-10-23"), copy: { headline: "Thank you", barLabel: "PARTNERS" } })
  ]);
  // 7 — archived
  pj = P("TEKEX #35 · " + SS + " social", mon("2026-06-18") + " rooftop social. Announcement and the two speaker cards that went out on the day.", 100, true);
  add(pj, [
    D(pj, "event", "square", SS + " social · Square", { theme: 0, sched: iso("2026-06-10"), copy: { headline: SS + " social", body: "Rooftop drinks with the TEKEX community. Bring a founder who hasn't been before.", date: day("2026-06-18"), startTime: "6pm", endTime: "9pm", venue: "The Rooftop, St Helier", barLabel: "COMMUNITY" }, images: { "event-image": img("u2") } }),
    D(pj, "speaker", "square", "Lisa McCabe · Square", { theme: 5, age: 1, sched: iso("2026-06-15"), copy: { eventNumber: "35", name: "Lisa McCabe", role: "CEO,", company: "The Wellbeing Co", date: day("2026-06-18"), startTime: "6pm", endTime: "9pm", venue: "The Rooftop, St Helier" }, images: { "speaker-photo": img("tk-lisa-mccabe", 50, 30) } })
  ]);
  // 8 — archived
  pj = P("2040 Accelerator pitch night", "Pitch night for the 2040 Accelerator cohort. Brand announcement and the cohort listing.", 130, true);
  add(pj, [
    D(pj, "lockup", "square", "Pitch night · Square", { theme: 2, sched: iso("2026-05-14"), copy: { body: "Eight founders. Five minutes each. One room full of people who can help.", barLabel: "EVENT" } }),
    D(pj, "listing", "portrait", "Cohort listing · Portrait", { theme: 4, age: 1, sched: iso("2026-05-18"), copy: { eyebrow: "2040 Accelerator · Cohort one", headline: "Meet the cohort", body: "Eight companies building from the Crown Dependencies.", date: day("2026-05-21"), startTime: "6pm", endTime: "8.30pm", venue: "Digital Jersey Hub", barLabel: "SPEAKERS" }, speakers: [{ name: "Nic Rose", role: "Founder", company: "iO-CO" }, { name: "Priya Nair", role: "Co-founder", company: "Tideway" }, { name: "Sam Ozanne", role: "Founder", company: "Harbourline" }] })
  ]);
  // 9 — archived
  pj = P(SR + " investor roundtable", "Closed-door investor roundtable in " + mon("2026-03-12") + ". Speaker card for the chair and the announcement.", 190, true);
  add(pj, [
    D(pj, "speaker", "square", "Anna Le Page · Square", { theme: 3, sched: iso("2026-03-09"), copy: { eventNumber: "33", name: "Anna Le Page", role: "Partner,", company: "Rathbones", date: day("2026-03-12"), startTime: "12pm", endTime: "2pm", venue: "Rathbones, St Helier", barLabel: "TALKS" }, images: { "speaker-photo": img("u4", 50, 30) } }),
    D(pj, "event", "linkedin", "Roundtable · LinkedIn post", { theme: 1, age: 1, sched: iso("2026-03-05"), copy: { headline: "Investor roundtable", body: "An invitation-only conversation on early-stage capital in the islands.", date: day("2026-03-12"), startTime: "12pm", endTime: "2pm", venue: "Rathbones, St Helier", barLabel: "TALKS" }, images: { "event-image": img("u8") } })
  ]);
  return { projects, drafts };
}
/* How many whole weeks today is from the day the examples were written for. */
function seedWeeks(now) { const t = new Date(now || Date.now()); return Math.round((new Date(t.getFullYear(), t.getMonth(), t.getDate()) - new Date(2026, 8, 23)) / (7 * 86400000)); }
/* Move example content that nobody has touched from one week offset to another. A field is only changed if it still
   holds exactly what the examples put there, so anything a person edited is left alone. Returns the ids that changed. */
function redateExamples(projects, drafts, fromWeeks, toWeeks) {
  const orig = seedExamples([], { weeks: fromWeeks }), fresh = seedExamples([], { weeks: toWeeks });
  const LEGACY = ["Fri 22nd Aug", "Social assets for the September speaker event. One card per speaker, plus the event announcement."]; // what the first version of the examples said
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const untouched = (cur, was) => same(cur, was) || LEGACY.indexOf(cur) >= 0;
  const P2 = projects.slice(), D2 = drafts.slice(), changed = [];
  orig.projects.forEach((op, i) => {
    const np = fresh.projects[i], pi = P2.findIndex(p => p.example && p.name === op.name);
    if (pi < 0) return;
    const pj = P2[pi], pp = {};
    if (np.name !== pj.name) pp.name = np.name;
    if (untouched(pj.brief, op.brief) && np.brief !== pj.brief) pp.brief = np.brief;
    if (Object.keys(pp).length) P2[pi] = Object.assign({}, pj, pp);
    const od = orig.drafts.filter(d => d.projectId === op.id), nd = fresh.drafts.filter(d => d.projectId === np.id);
    od.forEach((o, k) => {
      const n = nd[k], di = D2.findIndex(d => d.projectId === pj.id && d.tpl === o.tpl && d.size === o.size && d.title === o.title);
      if (di < 0 || !n) return;
      const cur = D2[di], next = Object.assign({}, cur); let hit = false;
      if (n.title !== cur.title) { next.title = n.title; hit = true; }
      if (cur.scheduledAt === o.scheduledAt && n.scheduledAt !== cur.scheduledAt) { next.scheduledAt = n.scheduledAt; hit = true; }
      const copy = Object.assign({}, cur.copy);
      Object.keys(o.copy).forEach(key => { if (untouched(cur.copy[key], o.copy[key]) && !same(cur.copy[key], n.copy[key])) { copy[key] = n.copy[key]; hit = true; } });
      next.copy = copy;
      if (same(cur.speakers, o.speakers) && !same(cur.speakers, n.speakers)) { next.speakers = n.speakers; hit = true; }
      if (hit) { D2[di] = next; changed.push(cur.id); }
    });
  });
  return { projects: P2, drafts: D2, changed };
}
const UPLOADS_KEY = "hs-uploads-v1";
const MAX_UPLOAD_MB = 15;
const MAX_EDGE = 1800;

function uid(p) { return (p || "d") + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4); }
/* A plain ZIP (stored, not compressed: PNGs are already compressed) so a set of images arrives as one file. */
const CRC_TABLE = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(bytes) { let c = 0xFFFFFFFF; for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
function zipStore(files, when) {
  const enc = new TextEncoder(), d = when || new Date();
  const time = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1), date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  const parts = [], central = []; let offset = 0;
  files.forEach(f => {
    const name = enc.encode(f.name), crc = crc32(f.bytes), size = f.bytes.length;
    const head = new DataView(new ArrayBuffer(30));
    head.setUint32(0, 0x04034b50, true); head.setUint16(4, 20, true); head.setUint16(6, 0x0800, true); head.setUint16(8, 0, true); head.setUint16(10, time, true); head.setUint16(12, date, true);
    head.setUint32(14, crc, true); head.setUint32(18, size, true); head.setUint32(22, size, true); head.setUint16(26, name.length, true); head.setUint16(28, 0, true);
    parts.push(new Uint8Array(head.buffer), name, f.bytes);
    const cd = new DataView(new ArrayBuffer(46));
    cd.setUint32(0, 0x02014b50, true); cd.setUint16(4, 20, true); cd.setUint16(6, 20, true); cd.setUint16(8, 0x0800, true); cd.setUint16(10, 0, true); cd.setUint16(12, time, true); cd.setUint16(14, date, true);
    cd.setUint32(16, crc, true); cd.setUint32(20, size, true); cd.setUint32(24, size, true); cd.setUint16(28, name.length, true); cd.setUint32(42, offset, true);
    central.push(new Uint8Array(cd.buffer), name);
    offset += 30 + name.length + size;
  });
  const cdSize = central.reduce((n, p) => n + p.length, 0), end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true); end.setUint32(12, cdSize, true); end.setUint32(16, offset, true);
  return parts.concat(central, [new Uint8Array(end.buffer)]);
}
function slug(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "design"; }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function join(parts, sep) { return parts.filter(p => p && String(p).trim()).join(sep); }
function composeDateLine(c) {
  const when = join([c.startTime, c.endTime], " – ");
  const first = join([c.date, when], ": ");
  return join([first, c.venue], ", ");
}
function composeEyebrow(c) { const k = BRAND.speakerKicker; if (k) return (c.eventNumber ? k + " #" + c.eventNumber : k) + ":"; return c.eventNumber ? BRAND.name + " #" + c.eventNumber + " Speaker:" : BRAND.name + " Speaker:"; }
function lum(rgb) { const p = rgb.map(v => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }); return 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2]; }
function parseRgb(str) { const m = String(str).match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/); return m ? [+m[1], +m[2], +m[3]] : [0, 0, 0]; }
function contrast(a, b) { const la = lum(parseRgb(a)), lb = lum(parseRgb(b)); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); }
function fitSize(str, base, minRatio) {
  const n = (str || "").length;
  const r = n <= 14 ? 1 : n <= 20 ? 0.82 : n <= 28 ? 0.66 : n <= 40 ? 0.54 : minRatio;
  return Math.round(base * Math.max(r, minRatio));
}
function newDesign(tpl, size, projectId) {
  if (TPL[tpl] && TPL[tpl].sizes && TPL[tpl].sizes.indexOf(size) < 0) size = TPL[tpl].sizes[0]; // a template that comes in fixed sizes
  const d = {
    id: uid("d"), tpl, size, theme: 0, layout: 0, title: TPL[tpl].name, projectId: projectId || null, familyId: uid("f"), scheduledAt: "", thumb: "",
    platforms: (DEFAULT_PLATFORMS[size] || ["linkedin"]).slice(), caption: { mode: "auto", variant: 0, text: {} },
    copy: Object.assign({}, EXAMPLE_COPY, packTpl(tpl) && PACK.examples ? PACK.examples[tpl] : null),
    speakers: EXAMPLE_SPEAKERS.map(s => Object.assign({}, s)),
    trio: EXAMPLE_TRIO.map(t => Object.assign({}, t)),
    images: {}, partnersOn: BRAND.partners.map(p => p.key),
    showBar: true, showPowered: BRAND.powered !== false, showHero: true, showPortraits: true,
    updatedAt: Date.now()
  };
  d.images = fillImages(d);
  return d;
}
/* The copy fields a design shows: a template's fields, less any that belong to a layout it is not using. */
function fieldsFor(d) { const L = d.layout || 0; return (FIELDS[d.tpl] || []).filter(f => !f.on || f.on.indexOf(L) >= 0); }
function slotsFor(d) {
  if (packTpl(d.tpl) && PACK.slots) { const ps = PACK.slots(d); if (ps) return ps; }
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
  if (im.cut) return {
    has: true, src: im.src, cut: true,
    // Stands on the bottom edge at the frame's height. x centres the face; when zoomed, y chooses how much of the top stays in view.
    style: { position: "absolute", left: "50%", bottom: 0, top: "auto", right: "auto", height: (100 * z) + "%", width: "auto", maxWidth: (170 * z) + "%", display: "block", objectFit: "contain", objectPosition: "50% 100%", // in a tall, narrow frame the figure is capped at 1.7 frame widths so it stays a figure, not a face fragment
             transform: "translate(-" + x + "%, " + ((1 - y / 100) * (z - 1) / z * 100).toFixed(2) + "%)" }
  };
  const mono = BRAND.style && BRAND.style.photo === "mono";
  return {
    has: true, src: im.src,
    style: { filter: mono ? "grayscale(1) contrast(1.06)" : "none", position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", objectFit: "cover",
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
        // A person on a transparent background is treated as a cut-out: all four corners see-through.
        let cut = false;
        if (file.type !== "image/jpeg") { try { const cx = cv.getContext("2d"); cut = [[1, 1], [w - 2, 1], [1, Math.round(h * 0.4)], [w - 2, Math.round(h * 0.4)]].every(pt => cx.getImageData(pt[0], pt[1], 1, 1).data[3] < 24); } catch (e) {} }
        const keepPng = file.type === "image/png" || cut;
        const src = keepPng ? cv.toDataURL("image/png") : cv.toDataURL("image/jpeg", 0.88);
        URL.revokeObjectURL(url);
        const rec = { id: uid("u"), name: file.name.replace(/\.[^.]+$/, ""), src, w, h, addedAt: Date.now() };
        if (cut) rec.cut = true;
        resolve(rec);
      } catch (e) { reject(new Error("We couldn't read that image.")); }
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("We couldn't read that image.")); };
    img.src = url;
  });
}


/* ---------- persistence adapter: swap this for a real backend without touching the UI ---------- */
const GLOBAL_KEYS = { "hs-theme": 1, "hs-workspaces-v1": 1, "hs-ws-current": 1 };
const Store = {
  ns: "", // "" for the first client (TEKEX); "hs-ws-<id>:" for every client added later, so each keeps its own work
  k(key) { return this.ns && !GLOBAL_KEYS[key] ? this.ns + key : key; },
  get(key, fallback) { try { const v = JSON.parse(localStorage.getItem(this.k(key)) || "null"); return v == null ? fallback : v; } catch (e) { return fallback; } },
  set(key, value) { localStorage.setItem(this.k(key), JSON.stringify(value)); },
  raw(key) { try { return localStorage.getItem(this.k(key)); } catch (e) { return null; } },
  flag(key) { try { localStorage.setItem(this.k(key), "1"); } catch (e) {} },
  del(key) { try { localStorage.removeItem(this.k(key)); } catch (e) {} }
};

/* ---------- clients and their brand books ----------
   A client is a workspace: its own brand book, projects, designs and uploads. The brand book is the single
   source every template reads from (BRAND), so editing it re-skins the artwork. Switching client reloads the page. */
const WS_KEY = "hs-workspaces-v1", WS_CUR = "hs-ws-current", BRAND_KEY = "hs-brand-v1", DEFAULT_WS = "tekex";
const BRAND_EDITABLE = ["powered", "speakerKicker", "type", "style", "logoSize", "imagery", "strategy", "compliance", "templateSet", "name", "url", "logo", "about", "voice", "dos", "donts", "hashtags", "palette", "themes", "barLabels", "partners", "templatesOn", "team", "log", "updatedAt", "updatedBy"];
const BRAND_DEFAULT = JSON.parse(JSON.stringify(BRAND));
function hexToRgb(hex) { const m = String(hex || "").trim().replace(/^#/, ""); const f = m.length === 3 ? m.split("").map(ch => ch + ch).join("") : m; const n = parseInt(f, 16); return /^[0-9a-fA-F]{6}$/.test(f) ? "rgb(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + ")" : "rgb(0,0,0)"; }
function rgbToHex(rgb) { return "#" + parseRgb(rgb).map(v => v.toString(16).padStart(2, "0")).join("").toUpperCase(); }
function validHex(v) { return /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(String(v || "").trim()); }
function normHex(v) { const m = String(v || "").trim().replace(/^#/, ""); return "#" + (m.length === 3 ? m.split("").map(ch => ch + ch).join("") : m).toUpperCase(); }
function contrastVerdict(ratio) { return ratio >= 4.5 ? { key: "pass", text: "Passes AA" } : ratio >= 3 ? { key: "large", text: "Large text only" } : { key: "fail", text: "Too low to read" }; }
/* A starter brand book for a new client: two colours in, three approved colourways out. */
function blankBrand(name, primary, secondary, url) {
  const p = normHex(validHex(primary) ? primary : "#245FFF"), q = normHex(validHex(secondary) ? secondary : "#F2F2F2");
  const ink = "#141414", paper = "#F5F4F0";
  const best = (ground) => [q, ink, paper, p].filter(c => c !== ground).sort((a, b) => contrast(hexToRgb(b), hexToRgb(ground)) - contrast(hexToRgb(a), hexToRgb(ground)))[0];
  const way = (label, ground, accent) => ({ name: label, ground: hexToRgb(ground), accent: hexToRgb(accent) });
  return {
    workspace: name, name, url: (url || "").trim().toUpperCase(), logo: null, about: "", voice: "", dos: [], donts: [], hashtags: "#" + String(name).replace(/[^A-Za-z0-9]+/g, ""),
    palette: [{ name: "Primary", value: p }, { name: "Secondary", value: q }, { name: "Ink", value: ink }, { name: "Paper", value: paper }],
    themes: [way("Primary", p, best(p)), way("Secondary", q, best(q)), way("Ink", ink, [p, q, paper].sort((a, b) => contrast(hexToRgb(b), hexToRgb(ink)) - contrast(hexToRgb(a), hexToRgb(ink)))[0])],
    barLabels: ["EVENT", "SPEAKERS", "PARTNERS", "NEWS"], partners: [{ key: "ps", name: "Potting Shed", src: "assets/ps-logo.svg" }], library: [],
    fonts: { display: "PP Neue Montreal", accent: "Quarto Italic" }, templatesOn: ["speaker", "event", "listing", "trio", "partners", "lockup"],
    type: { headWeight: 500 }, style: { line: 2, radius: 0, photo: "colour" }, logoSize: "m", imagery: "", strategy: { strapline: "", positioning: "", messages: [], audiences: [] }, compliance: { approver: "", wording: "", social: "" },
    team: JSON.parse(JSON.stringify(BRAND_DEFAULT.team)), log: [], studioEmail: BRAND_DEFAULT.studioEmail
  };
}

/* Built-in clients other than the first are described by presets: a function that returns a whole brand book. */
const PRESETS = {};
/* A client pack is a folder that holds one client's brand book, templates and imagery (see assets/<client>/pack.js).
   The app loads it only when it is present, so a client's material can live outside this repository. */
const PACK = (typeof window !== "undefined" && window.HS_PACK) || null;
if (PACK) {
  PRESETS[PACK.preset] = PACK.brand;
  Object.assign(SIZES, PACK.sizes || {});
  (PACK.templates || []).forEach(t => { if (!TPL[t.key]) { TEMPLATES.push(t); TPL[t.key] = t; } });
  Object.assign(FIELDS, PACK.fields || {});
}
const packTpl = (key) => !!(PACK && TPL[key] && TPL[key].set === PACK.set);
const RETIRED_WS = ["potting-shed"]; // clients that have been removed: dropped from the list, and their saved work cleared
function wsList() { let l = null; try { l = JSON.parse(localStorage.getItem(WS_KEY) || "null"); } catch (e) {} const rest = (l || []).filter(w => w && w.id && w.id !== DEFAULT_WS); return [{ id: DEFAULT_WS, name: (wsBrandName(DEFAULT_WS) || BRAND_DEFAULT.name) }].concat(rest); }
function wsBrandName(id) { try { const b = JSON.parse(localStorage.getItem((id === DEFAULT_WS ? "" : "hs-ws-" + id + ":") + BRAND_KEY) || "null"); return b && b.name; } catch (e) { return ""; } }
function wsCurrentId() { let id = DEFAULT_WS; try { id = localStorage.getItem(WS_CUR) || DEFAULT_WS; } catch (e) {} return wsList().some(w => w.id === id) ? id : DEFAULT_WS; }
function wsSave(list) { try { localStorage.setItem(WS_KEY, JSON.stringify(list.filter(w => w.id !== DEFAULT_WS))); } catch (e) {} }
function wsSwitch(id) { try { localStorage.setItem(WS_CUR, id); } catch (e) {} }
/* Write the saved brand book over BRAND in place, so everything that reads BRAND picks it up. */
function applyBrand(saved) {
  if (!saved) return BRAND;
  BRAND_EDITABLE.forEach(k => { if (saved[k] !== undefined) BRAND[k] = JSON.parse(JSON.stringify(saved[k])); });
  if (!BRAND.themes || !BRAND.themes.length) BRAND.themes = JSON.parse(JSON.stringify(BRAND_DEFAULT.themes));
  if (!BRAND.templatesOn || !BRAND.templatesOn.length) BRAND.templatesOn = TEMPLATES.map(t => t.key);
  if (!BRAND.type) BRAND.type = { headWeight: 600 };
  if (!BRAND.style) BRAND.style = { line: 2, radius: 0, photo: "colour" };
  if (!BRAND.logoSize) BRAND.logoSize = "m";
  BRAND.strategy = Object.assign({ strapline: "", positioning: "", messages: [], audiences: [] }, BRAND.strategy || {});
  BRAND.compliance = Object.assign({ approver: "", wording: "", social: "" }, BRAND.compliance || {});
  // only templates that exist for this client can be switched on
  BRAND.templatesOn = (BRAND.templatesOn || []).filter(k => TPL[k] && (TPL[k].set || "core") === (BRAND.templateSet || "core"));
  if (!BRAND.templatesOn.length) BRAND.templatesOn = TEMPLATES.filter(t => (t.set || "core") === (BRAND.templateSet || "core")).map(t => t.key);
  BRAND.workspace = BRAND.name;
  return BRAND;
}
try {
  // A pack's client joins the list the first time the pack is seen.
  if (PACK && !localStorage.getItem("hs-pack-" + PACK.id)) { const l0 = JSON.parse(localStorage.getItem(WS_KEY) || "[]"); if (!l0.some(w => w.id === PACK.id)) l0.unshift({ id: PACK.id, name: PACK.name, preset: PACK.preset, primary: PACK.primary, createdAt: Date.now() }); localStorage.setItem(WS_KEY, JSON.stringify(l0)); localStorage.setItem("hs-pack-" + PACK.id, "1"); }
  const l = JSON.parse(localStorage.getItem(WS_KEY) || "[]");
  if (l.some(w => RETIRED_WS.indexOf(w.id) >= 0)) {
    localStorage.setItem(WS_KEY, JSON.stringify(l.filter(w => RETIRED_WS.indexOf(w.id) < 0)));
    RETIRED_WS.forEach(id => Object.keys(localStorage).filter(k => k.indexOf("hs-ws-" + id + ":") === 0).forEach(k => localStorage.removeItem(k)));
    if (RETIRED_WS.indexOf(localStorage.getItem(WS_CUR)) >= 0) localStorage.setItem(WS_CUR, DEFAULT_WS);
  }
} catch (e) {}
const WS_ID = wsCurrentId();
Store.ns = WS_ID === DEFAULT_WS ? "" : "hs-ws-" + WS_ID + ":";
if (WS_ID !== DEFAULT_WS) {
  // A client added later starts from a blank book: none of the first client's imagery, partners or copy carries over.
  const meta = wsList().find(w => w.id === WS_ID) || {};
  Object.keys(BRAND).forEach(k => delete BRAND[k]);
  Object.assign(BRAND, PRESETS[meta.preset] ? PRESETS[meta.preset]() : blankBrand(meta.name || "New client", meta.primary, meta.secondary, meta.url));
  Object.keys(LIB).forEach(k => delete LIB[k]);
  PORTRAIT_IDS.length = 0; EVENT_IDS.length = 0;
  (BRAND.library || []).forEach(im => { LIB[im.id] = im; if (im.group === "Team" || im.group === "Staff") PORTRAIT_IDS.push(im.id); else EVENT_IDS.push(im.id); });
  LIB_GROUPS.length = 0; Array.from(new Set((BRAND.library || []).map(im => im.group))).forEach(g => LIB_GROUPS.push(g));
  Object.assign(EXAMPLE_COPY, { eventNumber: "", name: "Speaker name", role: "Job title,", company: "Company", headline: "Your headline", body: "One or two sentences about what is happening and why it matters.", eyebrow: BRAND.name + " · Line-up", sessionPrefix: "11.00am · Talks", sessionTitle: "Session title", startTime: "2pm", endTime: "5pm", venue: "Venue name", barLabel: (BRAND.barLabels || ["EVENT"])[0], url: BRAND.url });
  if (PACK && meta.preset === PACK.preset && PACK.exampleCopy) Object.assign(EXAMPLE_COPY, PACK.exampleCopy);
}
applyBrand(Store.get(BRAND_KEY, null));
const THUMBS_KEY = "hs-thumbs-v1";
/* Lazy-load the export/thumbnail renderer only when first needed. */
let __shotP = null;
function ensureShot() {
  if (window.modernScreenshot) return Promise.resolve(window.modernScreenshot);
  if (!__shotP) __shotP = new Promise((res, rej) => { const el = document.createElement("script"); el.src = "vendor/modern-screenshot.js"; el.onload = () => res(window.modernScreenshot); el.onerror = () => { __shotP = null; rej(new Error("renderer failed to load")); }; document.head.appendChild(el); });
  return __shotP;
}

/* ---------- make by describing ----------
   Reads a plain-English brief and works out what to make. Rule-based: no model and no network, so it is instant and
   private, and it only claims what it can actually read: who, what, when, where, which sizes and which colourway. */
const MK_MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const MK_ROLE = "(?:Managing |Creative |Senior |Executive |Studio |Account |Project |Co-)?(?:Partner|Founder|founder|CEO|CTO|COO|CFO|Director|Manager|Designer|Developer|Chair|Lead|President|Officer|Investor|Author|Head of [A-Z][a-z]+)";
function readBrief(text, now) {
  const raw = String(text || "").replace(/\s+/g, " ").trim(), low = " " + raw.toLowerCase() + " ";
  const out = { tpl: null, copy: {}, sizes: [], theme: null, nextTheme: false, remove: false, speakers: [], title: "", said: [] };
  if (!raw) return out;
  // sizes
  if (/\ball (the )?sizes\b|every size/.test(low)) out.sizes = SIZE_ORDER.slice();
  else [["square", /\bsquare\b|1:1/], ["portrait", /\bportrait\b|4:5/], ["story", /\bstor(y|ies)\b|9:16/], ["landscape", /\blandscape\b|16:9/], ["linkedin", /\blinkedin\b/]].forEach(([k, re]) => { if (re.test(low)) out.sizes.push(k); });
  // colourway: a full name ("lime & violet") or its first word ("in pink")
  BRAND.themes.forEach((th, i) => { const n = th.name.toLowerCase(); if (out.theme == null && low.indexOf(" " + n + " ") >= 0 || out.theme == null && low.indexOf(" " + n.replace(/ & /g, " and ") + " ") >= 0) out.theme = i; });
  if (out.theme == null) { const m = low.match(/\b(?:in|use|try|make it) (?:the )?([a-z]+)\b/g) || []; m.forEach(x => { const w = x.split(" ").pop(); const i = BRAND.themes.findIndex(th => th.name.toLowerCase().split(/[ &]+/)[0] === w); if (i >= 0 && out.theme == null) out.theme = i; }); }
  out.nextTheme = /another colou?r|different colou?r|other colou?r|change (the )?colou?r/.test(low);
  out.remove = /^(undo|delete( that| it)?|remove( that| it)?|scrap( that| it)?)\.?$/i.test(raw);
  // when
  const dm = raw.match(/\b(?:(?:mon|tue|tues|wed|thu|thur|thurs|fri|sat|sun)[a-z]*,? )?(\d{1,2})(?:st|nd|rd|th)? (?:of )?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/i);
  if (dm) {
    const t = new Date(now || Date.now()), mi = MK_MONTHS.indexOf(dm[2].toLowerCase().slice(0, 3));
    let d = new Date(t.getFullYear(), mi, +dm[1]); if (d < new Date(t.getFullYear(), t.getMonth(), t.getDate() - 30)) d = new Date(t.getFullYear() + 1, mi, +dm[1]);
    out.copy.date = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()] + " " + d.getDate() + " " + ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][mi];
    out.said.push(out.copy.date);
  }
  const tm = raw.match(/\b(\d{1,2}(?:[:.]\d{2})?) ?(am|pm)(?: ?(?:-|–|to|until|til) ?(\d{1,2}(?:[:.]\d{2})?) ?(am|pm))?/i);
  if (tm) { out.copy.startTime = tm[1] + tm[2].toLowerCase(); out.copy.endTime = tm[3] ? tm[3] + tm[4].toLowerCase() : ""; out.said.push(out.copy.startTime + (out.copy.endTime ? " – " + out.copy.endTime : "")); }
  // who: a role and a company, then people
  const rc = raw.match(new RegExp("(" + MK_ROLE + ")(?:,| at| of| from)? ([A-Z][A-Za-z0-9&'.-]*(?: [A-Z][A-Za-z0-9&'.-]*){0,3})"));
  const company = rc ? rc[2] : "";
  const names = []; const nre = /\b((?:Dr|Prof|Sir|Dame)\.? )?([A-Z][a-z'’-]+(?: (?:de |le |van |von )?[A-Z][a-z'’-]+){1,2})\b/g; let nm;
  while ((nm = nre.exec(raw))) names.push({ name: (nm[1] || "") + nm[2], at: nm.index });
  // where: the last "at / in / @ Place" that is not the company and not a date
  let venue = ""; const vre = /(?:\bat|\bin|@) (?:the )?([A-Z][A-Za-z0-9'&/.-]*(?:,? (?:[A-Z0-9][A-Za-z0-9'&/.-]*|St|of|the))*)/g; let vm;
  const sentences = raw.split(/(?<=[.!?])\s+/); // a place never runs on into the next sentence
  sentences.forEach(sen => { vre.lastIndex = 0; while ((vm = vre.exec(sen))) { const v = vm[1].replace(/[,. ]+$/, ""); if (v !== company && !/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/.test(v)) venue = v; } });
  if (venue) { out.copy.venue = venue; out.said.push(venue); }
  const brandWords = (BRAND.name || "").toLowerCase();
  const isPlace = (n) => n === venue || venue.indexOf(n) >= 0 || n === company || company.indexOf(n) >= 0 || n.toLowerCase() === brandWords;
  const personCue = /\b(speak(s|ing|er)?|talk(s|ing)?|keynote|joins?|joining|meet|introduc\w+|welcom\w+|hosted by|with|chair(s|ed|ing)?)\b/.test(low);
  const eventCue = /\b(announc\w+|event|breakfast|lunch|dinner|social|summit|launch\w*|workshop|meet-?up|roundtable|party|evening|night|conference|programme|festival|open day|webinar)\b/.test(low);
  const quoted = (raw.match(/["“]([^"”]{3,80})["”]/) || [])[1] || "";
  const people = names.filter(n => !isPlace(n.name) && !/^(The|Our|Thank|Meet|Announce|Introducing|Join|Welcome|Founders Breakfast)$/.test(n.name.split(" ")[0] === "Founders" ? "Founders Breakfast" : n.name.split(" ")[0]) && !/(Breakfast|Summit|Social|Week|Night|Launch|Roundtable|Session|Sessions|Programme|Awards|Conference|Festival)$/.test(n.name));
  // what
  if (/\b(partners?|sponsors?)\b/.test(low) && /\b(thank|thanks|wall|logos?|showcase|supported by)\b/.test(low)) { out.tpl = "partners"; out.copy.headline = quoted || (/thank/.test(low) ? "Thank you" : "With thanks to our partners"); out.copy.barLabel = pickLabel("PARTNERS"); }
  else if (/\bline-?up\b|\bagenda\b|\bspeakers:/.test(low) || people.length >= 4) { out.tpl = "listing"; out.speakers = people.map(x => ({ name: x.name, role: "", company: "" })); out.copy.headline = quoted || "Meet the speakers"; }
  else if ((/\bpanel\b|\bsessions?\b|\bthree\b/.test(low) && people.length >= 2) || people.length === 3) { out.tpl = "trio"; out.speakers = people.slice(0, 3).map(x => ({ name: x.name, company: "" })); out.copy.sessionTitle = quoted || "In conversation"; out.copy.sessionPrefix = out.copy.startTime ? out.copy.startTime + " · Panel" : "Panel"; }
  else if (people.length && (personCue || rc) && !(eventCue && !personCue && !rc)) {
    out.tpl = "speaker"; out.copy.name = people[0].name; out.said.unshift(people[0].name);
    if (rc) { out.copy.role = rc[1].replace(/^founder$/, "Founder") + ","; out.copy.company = company; out.said.splice(1, 0, rc[1] + ", " + company); } else { out.copy.role = ""; out.copy.company = ""; }
    out.copy.eventNumber = (raw.match(/#(\d{1,3})\b/) || [])[1] || "";
    out.title = people[0].name;
  }
  else if (eventCue) {
    out.tpl = "event";
    let head = quoted;
    if (!head) { const m = raw.match(/(?:announc\w+|launch\w*|introducing|join us (?:for|at)|come to)? ?(?:the |our |a |an )?([A-Z][^,.;:!?]*?)(?= (?:on|at|from|this|next|in) |,|\.|;|:|!|\?|$)/); head = m ? m[1].trim() : ""; }
    if (!head || head.length < 3) head = raw.split(/[,.;]/)[0];
    out.copy.headline = head.replace(/^(Announce|Announcing|Launch|Launching)\s+(the\s+|our\s+)?/i, "").slice(0, 60);
    // What follows the first sentence is the intro, minus anything that is an instruction to us (sizes, colourways).
    const rest = sentences.slice(1).filter(x => !/\b(square|stor(y|ies)|portrait|landscape|linkedin|sizes?|colou?rways?)\b/i.test(x)).join(" "); out.copy.body = rest && rest.length > 12 ? rest.slice(0, 220) : "";
    out.copy.barLabel = pickLabel("EVENT"); out.title = out.copy.headline; out.said.unshift(out.copy.headline);
  }
  return out;
}
function pickLabel(want) { const l = BRAND.barLabels || []; return l.indexOf(want) >= 0 ? want : (l[0] || want); }

/* GSAP is only needed for the sign-in intro, so it is fetched when that plays. */
let __gsapP = null;
function ensureGsap() {
  if (window.gsap) return Promise.resolve(window.gsap);
  if (!__gsapP) __gsapP = new Promise((res, rej) => { const el = document.createElement("script"); el.src = "vendor/gsap.min.js"; el.onload = () => (window.gsap ? res(window.gsap) : rej(new Error("gsap missing"))); el.onerror = () => { __gsapP = null; rej(new Error("gsap failed to load")); }; document.head.appendChild(el); });
  return __gsapP;
}

/* expose for tests (node) */
if (typeof module !== 'undefined') module.exports = { zipStore, crc32, fieldsFor, portraitMatch, readBrief, PRESETS, PACK, packTpl, imgVals, CUT_SRC, seedWeeks, redateExamples, FOCUS, focusOf, libImg, LIB, hexToRgb, rgbToHex, validHex, normHex, contrastVerdict, blankBrand, applyBrand, BRAND_DEFAULT, Store, SIZES, SIZE_ORDER, BRAND, TEMPLATES, TPL, FIELDS, PLATFORMS, DEFAULT_PLATFORMS, composeDateLine, composeEyebrow, fitSize, slug, join, draftCaption, newDesign, newProject, slotsFor, seedExamples, contrast, listNames, isoDay, fmtShort, fillImages, portraitFor };
