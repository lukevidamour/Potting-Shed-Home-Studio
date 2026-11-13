// node tools/qa/xheight.mjs <scratch folder>  (serve on 8765 first)
// x-height parity: every Quarto italic word set beside PP Neue Montreal must share its x-height.
import { open } from "./cdp.mjs";
const S = process.argv[2];
const fails = [], note = (ok, what) => { if (!ok) fails.push(what); console.log((ok ? "PASS " : "FAIL ") + what); };
const b = await open({ profile: S + "/chrome-profile-xh", port: 9393, width: 1440, height: 900, dpr: 2 });
const URL = "http://localhost:8765/Home%20Studio.dc.html";
await b.goto(URL, 600); await b.eval("sessionStorage.setItem('hs-in','1'); localStorage.setItem('hs-ws-current','tekex'); 1"); await b.goto(URL, 5000);
await b.eval("document.fonts.ready.then(() => 1)");
const probe = `JSON.stringify((() => {
  const cv = document.createElement('canvas').getContext('2d');
  const xh = (font) => { cv.font = font; return cv.measureText('x').actualBoundingBoxAscent; };
  return [...document.querySelectorAll('em, i, .q, [class*=quarto]')].filter(e => e.offsetParent && /quarto/i.test(getComputedStyle(e).fontFamily) && e.parentElement && !/quarto/i.test(getComputedStyle(e.parentElement).fontFamily)).map(e => {
    const a = getComputedStyle(e), p = getComputedStyle(e.parentElement);
    const fe = a.fontStyle + ' ' + a.fontWeight + ' ' + a.fontSize + ' ' + a.fontFamily, fp = p.fontStyle + ' ' + p.fontWeight + ' ' + p.fontSize + ' ' + p.fontFamily;
    const x1 = xh(fe), x2 = xh(fp);
    return { where: (e.parentElement.className || e.parentElement.tagName).toString().slice(0, 24) + ': ' + e.parentElement.textContent.trim().slice(0, 30), quarto: +x1.toFixed(2), neue: +x2.toFixed(2), diff: +(x1 - x2).toFixed(2), pct: +((x1 / x2 - 1) * 100).toFixed(1) };
  });
})())`;
const all = [];
const take = async (label) => { const r = JSON.parse(await b.eval(probe)); r.forEach(x => all.push([label, x])); };
await take("drafts");
for (const t of ["All designs", "Calendar", "Brand book"]) { await b.clickText(t, ".gtab"); await b.wait(1500); await take(t); }
await b.click(".fab"); await b.wait(1200); await take("assistant");
all.forEach(([l, x]) => note(Math.abs(x.diff) <= 0.5, l + " · " + x.where + " · x-height Quarto " + x.quarto + "px vs Neue " + x.neue + "px (" + (x.pct > 0 ? "+" : "") + x.pct + "%)"));
if (!all.length) note(false, "no italic words found to measure");
console.log("FAILS: " + fails.length); await b.close();
