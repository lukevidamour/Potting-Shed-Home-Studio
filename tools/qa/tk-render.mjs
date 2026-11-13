// Render TEKEX designs at their export size, for comparing with the Figma frames they were rebuilt from.
//   node tools/qa/tk-render.mjs <scratch folder> <jobs.json> <out folder>
// jobs.json: [{ "name": "speaker-0-sq", "tpl": "tk-speaker", "layout": 0, "size": "square", "theme": "Mint & magenta",
//               "copy": { ... }, "images": { "portrait": null }, "partnersOn": [...] }]   (serve the app on 8765 first)
import { open } from "./cdp.mjs";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const S = process.argv[2], jobs = JSON.parse(readFileSync(process.argv[3], "utf8")), out = process.argv[4];
mkdirSync(out, { recursive: true });
const port = +(process.env.TK_PORT || 9391); // give each person or agent rendering at once their own port
const b = await open({ profile: S + "/chrome-profile-tkr-" + port, port, width: 1440, height: 900 });
await b.goto("http://localhost:8765/Home%20Studio.dc.html", 800); await b.eval("sessionStorage.setItem('hs-in','1'); localStorage.setItem('hs-ws-current','tekex'); 1"); await b.send("Page.reload"); await b.wait(5000);
await b.eval("document.fonts.ready.then(()=>1)");
for (const j of jobs) {
  const r = await b.eval(`(async()=>{const h=__hs; const j=${JSON.stringify(j)}; const d=newDesign(j.tpl, j.size||'square', null); d.layout=j.layout||0;
    if (j.theme) { const i=BRAND.themes.findIndex(t=>t.name===j.theme); if (i>=0) d.theme=i; }
    Object.assign(d.copy, j.copy||{}); if (j.partnersOn) d.partnersOn=j.partnersOn; d.images={}; d.images=fillImages(d); Object.keys(j.images||{}).forEach(k=>{ if (j.images[k]===null) delete d.images[k]; else d.images[k]=j.images[k]; }); if (j.imgId) { const k=Object.keys(d.images)[0]||'photo'; d.images[k]=libImg(j.imgId); }
    h.openDesign(d,false); await new Promise(r=>setTimeout(r,1400)); await document.fonts.ready; h.setState({fontTick:(h.state.fontTick||0)+1}); await new Promise(r=>setTimeout(r,500));
    const node=document.querySelector("[data-canvas='1']"); await h.settleArt(node);
    const e=await h.exportDesign(h.state.design,node,'png',false); const fr=new FileReader(); const u=await new Promise(res=>{fr.onload=()=>res(fr.result); fr.readAsDataURL(e.blob)});
    return JSON.stringify({u, dims:e.dims, over:h.state.overflow||[]})})()`);
  const o = JSON.parse(r); writeFileSync(out + "/" + j.name + ".png", Buffer.from(o.u.split(",")[1], "base64"));
  console.log(j.name, o.dims, o.over.length ? "OVERFLOW " + o.over.join(",") : "");
}
console.log("console:", b.logs.slice(0, 5).join(" | "));
await b.close();
