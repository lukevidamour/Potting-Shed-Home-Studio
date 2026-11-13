// The assistant against real TEKEX briefs: node tools/qa/briefs.mjs <scratch folder> [fresh|blind] (serve on 8765 first)
import { open } from "./cdp.mjs";
const S = process.argv[2];
const b = await open({ profile: S + "/chrome-profile-briefs", port: 9387, width: 1440, height: 900, dpr: 1 });
const URL = "http://localhost:8765/Home%20Studio.dc.html";
await b.goto(URL, 600); await b.eval("sessionStorage.setItem('hs-in','1'); localStorage.setItem('hs-ws-current','tekex'); 1"); await b.goto(URL, 5000);
// [brief, expected template, expected layout or null, a check on the copy or set]
const CASES = process.argv[3] === "blind" ? [
  ["Could you do a graphic for Guy Templer, Chair of Junior Achievement, who is speaking at IOM#3", "tk-speaker", null, "name=Guy Templer"],
  ["Rathbones are sponsoring TEKEX #38", "tk-sponsor", null, ""],
  ["Ecoserve secured £3m from investors they met at TEKEX", "tk-fundraising", null, "headline~Ecoserve"],
  ["Save the date: Investor Showcase, Thu 21 Jan, 6pm, Jersey Museum", "tk-event", null, "headline~Investor Showcase"],
  ["TEKEX #38 is tomorrow night", "tk-countdown", 0, ""],
  ["Post about 250 founders attending this year", "tk-statement", 2, "stat~250"],
  ["New episode of the TEKEX podcast with AJ Coetzee", "tk-campaign", 4, ""],
  ["Announcement: TEKEX is coming to Alderney", "tk-news", null, "headline~Alderney"]
] : process.argv[3] === "fresh" ? [
  ["Can you make a post saying Yoono has closed a £500k seed round", "tk-fundraising", null, ""],
  ["We need a speaker graphic for Lisa McCabe, CEO of The Wellbeing Co, speaking at TEKEX #38", "tk-speaker", null, "name=Lisa McCabe"],
  ["Last chance to book for Health Innovation Jersey", "tk-countdown", 2, ""],
  ["Remind people Last Friday Club is tomorrow", "tk-series", 2, ""],
  ["Founders Breakfast, Wed 9 Dec, 8am at Wild Peak", "tk-event", null, "headline~Founders Breakfast"],
  ["Big thanks to everyone who supported TEKEX this year", "tk-sponsor", null, ""],
  ['"Every deal I\'ve done this year started with a TEKEX intro" - Jake Schofield', "tk-statement", 1, "quote~deal"],
  ["News: Louis Pike joins the IoD committee", "tk-news", null, "headline~Louis Pike"],
  ["We hit 1,200 members this month", "tk-statement", 2, "stat~1,200"],
  ["Tickets now available for TEKEX #38", "tk-countdown", 1, ""],
  ["PwC joins TEKEX as a partner", "tk-sponsor", 4, "headline~PwC"],
  ["Make something about our new website launch", "tk-news", null, ""]
] : [
  ["Speaker card for Carol Glover, Vice President, Chamber of Commerce, IOM#3 on Thu 26 Nov", "tk-speaker", null, "name=Carol Glover"],
  ["Announce TEKEX #37: Founders & Funders, Thu 3 Dec, 17:30 at the BDO/C5 Hub", "tk-event", null, "headline~Founders"],
  ["Tickets are on sale for IOM#3 on Thu 26 Nov", "tk-countdown", null, ""],
  ["Thank our partners", "tk-sponsor", null, ""],
  ["News: TEKEX lands in Guernsey this spring", "tk-news", null, "headline~Guernsey"],
  ["Io-Co raises £2M in its Series A", "tk-fundraising", null, "headline~Io-Co"],
  ["A quote from Louis Pike: \"The best introductions happen at TEKEX\"", "tk-statement", null, "quote~introductions"],
  ["Last Friday Club this month, Fri 27 Nov from 5pm", "tk-series", null, ""],
  ["Health Innovation Jersey save the date, Thu 17 Dec", "tk-series", null, ""],
  ["A carousel of our year in numbers", "tk-campaign", null, "set>=4"],
  ["Line-up carousel with Tim Huelin and Serena Guthrie for TEKEX #37 on Thu 4 Dec", "tk-lineup", null, "set>=4"],
  ["Welcome Rathbones as our newest partner", "tk-sponsor", null, ""],
  ["Podcast episode 4 cover with Ed Prow", "tk-campaign", 4, ""],
  ["TEKEX #37 is tonight", "tk-countdown", null, ""],
  ["Stat post: 1,000+ ecosystem members", "tk-statement", null, "stat~1,000"],
  ["What is TEKEX?", "tk-campaign", null, ""],
  ["Introduce Jenson Artus, our Isle of Man Lead, as a speaker", "tk-speaker", null, "name=Jenson Artus"],
  ["AI Sprint in Guernsey, Fri 11 Dec, 9am at the Digital Greenhouse", "tk-event", null, "headline~AI Sprint"]
];
const res = JSON.parse(await b.eval(`JSON.stringify(${JSON.stringify(CASES)}.map(([t, tpl, layout, chk]) => {
  let r = readBrief(t); r = HS_TEKEX.fromBrief(r, t) || r;
  const c = r.copy || {}, set = r.set || [];
  let ok = r.tpl === tpl && (layout == null || (r.layout || 0) === layout);
  if (chk) { const [k, v] = chk.split(/[=~]|>=/); if (chk.includes(">=")) ok = ok && set.length >= +v; else if (chk.includes("=")) ok = ok && String(c[k] || c.person || "").indexOf(v) === 0; else ok = ok && String(c[k] || c.headline || c.quote || "").toLowerCase().indexOf(v.toLowerCase()) >= 0; }
  return { t: t.slice(0, 64), want: tpl + (layout != null ? "/" + layout : ""), got: (r.tpl || "nothing") + "/" + (r.layout || 0) + (set.length ? " set " + set.length : ""), copy: JSON.stringify(Object.fromEntries(Object.entries(c).filter(([k, v]) => v && ["name", "headline", "quote", "stat", "date", "eyebrow", "person"].includes(k)))).slice(0, 110), ok };
}))`));
res.forEach(x => console.log((x.ok ? "PASS " : "FAIL ") + x.t + "\n      want " + x.want + "  got " + x.got + "  " + x.copy));
console.log("SCORE " + res.filter(x => x.ok).length + "/" + res.length);
await b.close();
