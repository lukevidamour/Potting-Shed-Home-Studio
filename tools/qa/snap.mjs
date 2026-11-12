// Style record: how every element on every screen is actually styled, so a change to the stylesheet can be proved harmless.
//   node tools/qa/snap.mjs <scratch folder> <label>          record   (serve the app on 8765 first)
//   node tools/qa/snap.mjs <scratch folder> <a> <b>          compare two records
import { open } from "./cdp.mjs";
import { mkdirSync, writeFileSync, readFileSync, readdirSync } from "node:fs";
const S = process.argv[2], A = process.argv[3], B = process.argv[4];
const PROPS = ["display","position","top","right","bottom","left","width","height","margin-top","margin-right","margin-bottom","margin-left","padding-top","padding-right","padding-bottom","padding-left","border-top-width","border-right-width","border-bottom-width","border-left-width","border-top-color","border-bottom-color","border-left-color","border-top-style","border-top-left-radius","border-bottom-right-radius","background-color","background-image","color","font-family","font-size","font-weight","font-style","line-height","letter-spacing","text-transform","text-align","text-decoration-line","white-space","text-overflow","opacity","visibility","overflow-x","overflow-y","z-index","transform","translate","scale","rotate","box-shadow","outline-style","outline-width","outline-color","outline-offset","gap","flex-direction","flex-wrap","flex-grow","flex-shrink","flex-basis","align-items","justify-content","grid-template-columns","order","cursor","animation-name","animation-duration","transition-property","transition-duration","object-fit","aspect-ratio","fill","stroke","stroke-width","font-variant-numeric","pointer-events","backdrop-filter","filter","mix-blend-mode","text-wrap","container-type"];
if (B) {
  let diffs = 0, files = 0; const seen = {};
  const only = new Set(readdirSync(S + "/snap/" + B)); for (const f of readdirSync(S + "/snap/" + A).filter(x => x.endsWith(".json") && (!process.env.SNAP_PARTIAL || only.has(x)) && !(process.env.SNAP_SKIP && new RegExp(process.env.SNAP_SKIP).test(x)))) { files++; let a, b; try { a = JSON.parse(readFileSync(S + "/snap/" + A + "/" + f, "utf8")); b = JSON.parse(readFileSync(S + "/snap/" + B + "/" + f, "utf8")); } catch (e) { console.log("missing in " + B + ": " + f); diffs++; continue; }
    for (const part of ["rest", "hover"]) { const x = a[part] || [], y = b[part] || []; if (x.length !== y.length) { console.log(f + " " + part + ": " + x.length + " elements before, " + y.length + " after"); diffs++; continue; }
      const norm = (t) => t.replace(/rgba?\((36, 95, 255|255, 22, 165|254, 22, 88|255, 132, 10|18, 205, 255|1, 254, 205)(, [\d.]+)?\)/g, "ACCENT").replace(/radial-gradient\([^|]*/g, "GLOW");
      if (x.some((r, i) => r[0] !== y[i][0])) { console.log(f + " " + part + ": the page is built differently (first at " + x.findIndex((r, i) => r[0] !== y[i][0]) + ": " + (x.find((r, i) => r[0] !== y[i][0]) || [])[0] + ")"); diffs++; continue; }
      for (let i = 0; i < x.length; i++) { x[i][1] = norm(x[i][1]); y[i][1] = norm(y[i][1]); if (x[i][1] === y[i][1]) continue; const p = x[i][1].split("|"), q = y[i][1].split("|"); const names = part === "rest" ? PROPS.concat(PROPS.map(n => "::before " + n), PROPS.map(n => "::after " + n)) : null; const ch = []; for (let k = 0; k < Math.max(p.length, q.length); k++) if (p[k] !== q[k]) ch.push((names && names[k] ? names[k] : "#" + k) + ": " + String(p[k]).slice(0, 40) + " -> " + String(q[k]).slice(0, 40)); const key = x[i][0] + " " + ch.map(c => c.split(":")[0]).join(","); seen[key] = seen[key] || { n: 0, ex: f.replace(".json", "") + " " + part + " " + x[i][0] + "  " + ch.slice(0, 3).join(" ; ") }; seen[key].n++; diffs++; } } }
  console.log(files + " screens compared, " + diffs + " differences in " + Object.keys(seen).length + " kinds"); Object.values(seen).sort((m, n) => n.n - m.n).slice(0, 40).forEach(v => console.log("  x" + v.n + "  " + v.ex)); process.exit(diffs ? 1 : 0);
}
const out = S + "/snap/" + A + "/"; mkdirSync(out, { recursive: true });
const b = await open({ profile: S + "/chrome-profile-snap", port: 9380, width: 1440, height: 900 });
const U = "http://localhost:8765/Home%20Studio.dc.html";
const REST = `JSON.stringify((()=>{const P=${JSON.stringify(PROPS)}; const out=[]; const skip=e=>e.closest('[data-canvas]')||e.closest('.offcard')||e.closest('.toast')||/^(SCRIPT|STYLE|LINK|META|HEAD|TITLE|TEMPLATE)$/.test(e.tagName);
  for (const e of document.querySelectorAll('body, body *')) { if (skip(e)) continue; const cs=getComputedStyle(e); if (cs.display==='none') { out.push([e.tagName.toLowerCase()+'.'+String(e.className&&e.className.baseVal!==undefined?e.className.baseVal:e.className).trim().split(/\\s+/).slice(0,3).join('.'),'none']); continue; }
    const row=P.map(p=>cs.getPropertyValue(p)); for (const ps of ['::before','::after']) { const c=getComputedStyle(e,ps); if (c.content && c.content!=='none' && c.content!=='normal') P.forEach(p=>row.push(c.getPropertyValue(p))); else row.push(''); }
    out.push([e.tagName.toLowerCase()+'.'+String(e.className&&e.className.baseVal!==undefined?e.className.baseVal:e.className).trim().split(/\\s+/).slice(0,3).join('.'), row.join('|')]); } return out; })())`;
const HP = ["background-color","color","border-top-color","border-bottom-color","outline-style","outline-color","box-shadow","transform","translate","scale","opacity","text-decoration-line","border-top-width","background-image","fill","stroke"];
const views = [["home","__hs.goProjects(); 1"],["designs","__hs.goDesigns(); 1"],["calendar","__hs.goCalendar(); 1"],["brand","__hs.setState({view:'brand'}); 1"],["project","(()=>{const h=__hs; const p=h.state.projects.find(p=>h.state.drafts.filter(x=>x.projectId===p.id).length>1)||h.state.projects[0]; h.openProject(p.id); return 1})()"],["templates","__hs.setState({view:'templates'}); 1"],
  ["editor","(()=>{const h=__hs; h.openDesign(h.state.drafts.find(x=>(x.layout||0)===1)||h.state.drafts[0],false); return 1})()"],["editor-pick","(()=>{const h=__hs; if(!h.state.tplPickOpen) h.toggleTplPick(); return 1})()"],["sizes","__hs.openSizeDialog(); 1"],["publish","(()=>{__hs.closeSizeDialog(); __hs.openReview(); return 1})()"],
  ["assistant","(()=>{__hs.closeReview(); __hs.backToProject(); __hs.goMake(); return 1})()"],["search","(()=>{__hs.setState({makeOpen:false}); __hs.cmdToggle(); return 1})()"],["menu-client","(()=>{if(__hs.state.cmd) __hs.cmdToggle(); __hs.goProjects(); __hs.setState({wsMenuOpen:true}); return 1})()"],["menu-account","__hs.setState({wsMenuOpen:false,userMenuOpen:true}); 1"],["menu-card","(()=>{__hs.setState({userMenuOpen:false}); __hs.goDesigns(); setTimeout(()=>{const k=document.querySelector('.grid .card:not(.offcard) .kebab button'); if(k) k.click()},500); return 1})()"],["gate","(()=>{__hs.setState({menuId:null}); __hs.signOut(); return 1})()"]];
const CLIENTS = (process.env.QA_CLIENTS || "tekex").split(","); // the first is recorded in full, any others on their main screens
for (const client of CLIENTS) {
  await b.goto(U, 800); await b.eval("sessionStorage.setItem('hs-in','1'); localStorage.setItem('hs-ws-current','" + client + "'); localStorage.setItem('hs-theme','light'); 1"); await b.send("Page.reload"); await b.wait(5000);
  await b.eval("__hs.goDesigns(); 1"); for (let i = 0; i < 240; i++) { await b.wait(700); if (await b.eval("__hs.state.drafts.every(x=>String(__hs.state.thumbs[x.id]||'').indexOf('data:')===0)")) break; } await b.wait(1500);
  const THEMES = (process.env.SNAP_THEMES || "light,dark").split(","), WIDTHS = process.env.SNAP_WIDTHS ? process.env.SNAP_WIDTHS.split(",").map(Number) : null;
  for (const theme of THEMES) for (const w of (WIDTHS || (client === CLIENTS[0] ? [1440, 1024, 700, 390] : [1440, 390]))) {
    await b.viewport(w, w < 500 ? 844 : 900); await b.eval("__hs.setTheme('" + theme + "'); 1"); await b.wait(700);
    for (const [name, fn] of views) { if (client !== CLIENTS[0] && !/home|designs|brand|editor|publish|sizes|gate/.test(name)) continue;
      await b.eval(fn); await b.wait(name === "gate" ? 5200 : /editor|menu-card/.test(name) ? 3200 : 1700);
      const rec = { rest: JSON.parse(await b.eval(REST)) };
      if (!process.env.SNAP_NO_HOVER && theme === "light" && w === 1440 && name !== "gate") { // hover: what each control looks like under the pointer
        const n = await b.eval("(()=>{window.__t=[...document.querySelectorAll('button, a[href], [role=button], [role=tab], [role=radio], [role=menuitem], select, .tile, .card:not(.offcard), .weekcard')].filter(e=>!e.closest('.offcard')&&!e.closest('[data-canvas]')&&e.checkVisibility()&&e.getBoundingClientRect().width>4); return window.__t.length})()");
        rec.hover = []; const done = {};
        for (let i = 0; i < n; i++) { const info = await b.eval(`(()=>{const e=window.__t[${i}]; if(!e||!e.isConnected) return null; e.scrollIntoView({block:'center',inline:'center'}); const r=e.getBoundingClientRect(); const x=Math.min(Math.max(r.left+Math.min(r.width/2,14),1),innerWidth-2), y=Math.min(Math.max(r.top+r.height/2,1),innerHeight-2); const top=document.elementFromPoint(x,y); if(!top||!(e===top||e.contains(top))) return null; return {x,y,k:e.tagName+'.'+String(e.className).trim().split(/\\s+/).slice(0,3).join('.')+(e.getAttribute('aria-pressed')||'')+(e.getAttribute('aria-current')||'')+(e.getAttribute('aria-selected')||'')+(e.getAttribute('aria-checked')||'')+(e.closest('.menu,.dialog,.drawer,.panel,.gnav,.toolbar,.hdr,.cmdk,.makeover,.bb')||{className:''}).className}})()`);
          if (!info) continue; done[info.k] = (done[info.k] || 0) + 1; if (done[info.k] > 2) continue; // two of each kind is enough
          await b.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: info.x, y: info.y }); await b.wait(460);
          rec.hover.push([info.k, await b.eval(`(()=>{const e=window.__t[${i}]; const HP=${JSON.stringify(HP)}; return [e,...e.querySelectorAll(':scope > *, :scope > * > *')].slice(0,9).map(n=>{const c=getComputedStyle(n); return HP.map(p=>c.getPropertyValue(p)).join(',')}).join('|')})()`)]); }
        await b.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 720, y: 2 }); await b.wait(300);
      }
      writeFileSync(out + [client, theme, w, name].join("-") + ".json", JSON.stringify(rec));
    }
    await b.eval("(()=>{ if(__hs.state.gate) __hs.enterApp(); return 1})()"); await b.wait(3200);
  }
}
console.log("recorded", readdirSync(out).length, "screens to", out, "| console:", b.logs.slice(0, 3).join(" | "));
await b.close();
