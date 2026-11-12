// State audit (node tools/qa/states.mjs <folder for a browser profile> [client id] [light,dark]; serve the folder on 8765 first): hover (and focus) every control on every screen, in light and dark, and measure the contrast of its words and icons
// against what is actually behind them. Flags anything a person could not read.  node states.mjs <scratch> [client] [theme]
import { open } from "./cdp.mjs";
const S = process.argv[2] || "/tmp", client = process.argv[3] || "tekex", themes = (process.argv[4] || "light,dark").split(",");
const b = await open({ profile: S + "/chrome-profile-states", port: 9370, width: 1440, height: 900 });
const U = "http://localhost:8765/Home%20Studio.dc.html";
await b.goto(U, 800); await b.eval("sessionStorage.setItem('hs-in','1'); localStorage.setItem('hs-ws-current','" + client + "'); 1"); await b.send("Page.reload"); await b.wait(5000);
const HELP = `
window.__lum = (c) => { let m = c.match(/[\\d.]+/g).map(Number); if (/^color\\(/.test(c)) m = [m[0] * 255, m[1] * 255, m[2] * 255].concat(m.length > 3 ? [m[3]] : []); if (/^(oklab|oklch|lab|lch)/.test(c)) m = [128, 128, 128, 0]; const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return { l: 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]), a: m.length > 3 ? m[3] : 1, rgb: m.slice(0, 3) }; };
window.__bg = (el) => { let stack = []; for (let e = el; e; e = e.parentElement) { const cs = getComputedStyle(e); const c = cs.backgroundColor; const p = window.__lum(c); if (p.a > 0) { stack.push(p); if (p.a >= 0.99) break; } if (cs.backgroundImage && cs.backgroundImage !== 'none' && /gradient|url/.test(cs.backgroundImage)) { return null; } }
  let base = [242, 242, 242]; const root = getComputedStyle(document.body).backgroundColor; const rp = window.__lum(root); if (rp.a > 0) base = rp.rgb;
  for (let i = stack.length - 1; i >= 0; i--) { const s = stack[i]; base = base.map((v, k) => v * (1 - s.a) + s.rgb[k] * s.a); } return base; };
window.__ratio = (fg, bg) => { const L = (rgb) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]); }; const a = L(fg), c = L(bg); return (Math.max(a, c) + 0.05) / (Math.min(a, c) + 0.05); };
window.__measure = (el) => { const out = []; const bg = window.__bg(el); if (!bg) return { skip: 'image' };
  const nodes = [el, ...el.querySelectorAll('*')].filter(n => { if (n.closest('[data-canvas]') || n.tagName === 'IMG') return false; const cs = getComputedStyle(n); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity < 0.05) return false; const hasText = [...n.childNodes].some(t => t.nodeType === 3 && t.textContent.trim()); const isIcon = (n.tagName === 'svg' || n.tagName === 'SVG') && !n.querySelector('[fill^="#"]') && !n.closest('.google'); if (n.closest('.mini') || n.closest('.wsmark') || n.closest('.pl') || n.closest('.bbcover') || n.closest('.markbox')) return false; const val = (n.tagName === 'INPUT' || n.tagName === 'TEXTAREA' || n.tagName === 'SELECT'); return hasText || isIcon || val; });
  let worst = 99, what = '';
  nodes.forEach(n => { const cs = getComputedStyle(n); let col = cs.color; if ((n.tagName + '').toLowerCase() === 'svg') { const st = cs.stroke && cs.stroke !== 'none' ? cs.stroke : (cs.fill && cs.fill !== 'none' ? cs.fill : cs.color); col = /rgb/.test(st) ? st : cs.color; }
    const p = window.__lum(col); const nb = window.__bg(n) || bg; const fg = p.rgb.map((v, k) => v * p.a * (+cs.opacity) + nb[k] * (1 - p.a * (+cs.opacity))); const r = window.__ratio(fg, nb); if (r < worst) { worst = r; what = (n.tagName + '').toLowerCase() + ' ' + col + ' on rgb(' + nb.map(Math.round).join(',') + ')'; } });
  return { worst: +worst.toFixed(2), what }; };
window.__targets = () => [...document.querySelectorAll('button, a[href], [role=button], [role=tab], [role=radio], [role=menuitem], select, .tile, .card:not(.offcard), .weekcard, label.synccheck, summary')].filter(e => { if (e.closest('.offcard') || e.closest('[data-canvas]') || e.disabled || e.getAttribute('aria-disabled') === 'true') return false; const r = e.getBoundingClientRect(); return r.width > 4 && r.height > 4 && e.checkVisibility && e.checkVisibility(); });
window.__name = (e) => (e.className && typeof e.className === 'string' ? e.tagName.toLowerCase() + '.' + e.className.trim().split(/\\s+/).slice(0, 2).join('.') : e.tagName.toLowerCase()) + ' "' + (e.getAttribute('aria-label') || e.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 26) + '"';
1`;
const findings = [];
const sweep = async (view, theme) => {
  await b.eval(HELP);
  const n = await b.eval("(()=>{window.__t = window.__targets(); return window.__t.length})()");
  const seen = new Set();
  for (let i = 0; i < n; i++) {
    const info = await b.eval(`(()=>{const e=window.__t[${i}]; if(!e||!e.isConnected) return null; e.scrollIntoView({block:'center',inline:'center'}); const r=e.getBoundingClientRect(); if (r.width<4||r.height<4) return null; const x=Math.min(Math.max(r.left+Math.min(r.width/2, 14),1),innerWidth-2), y=Math.min(Math.max(r.top+r.height/2,1),innerHeight-2); const top=document.elementFromPoint(x,y); if(!top||!(e===top||e.contains(top))) return {covered:true}; return {x,y,name:window.__name(e),rest:window.__measure(e)}})()`);
    if (!info || info.covered) continue;
    const key = info.name.replace(/"[^"]*"/, m => m.replace(/\d+/g, "#")); 
    await b.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: info.x, y: info.y }); await b.wait(seen.has(key) ? 120 : 330);
    const hov = await b.eval(`(()=>{const e=window.__t[${i}]; return e&&e.isConnected?window.__measure(e):null})()`);
    const foc = await b.eval(`(()=>{const e=window.__t[${i}]; if(!e||!e.isConnected||!e.focus||e.tagName==='SELECT') return null; const a=document.activeElement; try{e.focus({preventScroll:true})}catch(x){} const m=window.__measure(e); try{ if(a&&a.focus) a.focus({preventScroll:true}); else e.blur(); }catch(x){} return m})()`);
    seen.add(key);
    for (const [state, m] of [["rest", info.rest], ["hover", hov], ["focus", foc]]) if (m && !m.skip && m.worst < (/svg /.test(m.what) ? 3 : 4.5)) findings.push({ view, theme, state, name: info.name, ratio: m.worst, what: m.what });
  }
  await b.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 700, y: 3 });
  return n;
};
const go = async (fn, wait = 1300) => { await b.eval(fn); await b.wait(wait); };
for (const theme of themes) {
  await go("__hs.setTheme('" + theme + "'); 1", 700);
  const views = [
    ["home", "__hs.goProjects(); 1"],
    ["designs", "__hs.goDesigns(); 1"],
    ["calendar", "__hs.goCalendar(); 1"],
    ["brand", "__hs.setState({view:'brand'}); 1"],
    ["project", "(()=>{const h=__hs; const p=h.state.projects.find(p=>h.state.drafts.filter(x=>x.projectId===p.id).length>1)||h.state.projects[0]; h.openProject(p.id); return 1})()"],
    ["templates", "(()=>{const h=__hs; h.setState({view:'templates'}); return 1})()"],
    ["editor", "(()=>{const h=__hs; const d=h.state.drafts.find(x=>(x.layout||0)===1)||h.state.drafts[0]; h.openDesign(d,false); return 1})()", 2600],
    ["editor+templates open", "(()=>{const h=__hs; if(!h.state.tplPickOpen) h.toggleTplPick(); return 1})()", 2500],
    ["size dialog", "__hs.openSizeDialog(); 1", 700],
    ["publish drawer", "(()=>{__hs.closeSizeDialog(); __hs.openReview(); return 1})()", 1200],
    ["assistant", "(()=>{__hs.closeReview(); __hs.goMake(); return 1})()", 1200],
    ["search", "(()=>{__hs.setState({makeOpen:false}); __hs.cmdToggle(); return 1})()", 800],
    ["client menu", "(()=>{if(__hs.state.cmd) __hs.cmdToggle(); __hs.goProjects(); __hs.setState({wsMenuOpen:true}); return 1})()", 900],
    ["account menu", "(()=>{__hs.setState({wsMenuOpen:false,userMenuOpen:true}); return 1})()", 700],
    ["brand menu", "(()=>{__hs.setState({userMenuOpen:false, view:'brand', bbMenuOpen:true}); return 1})()", 900],
  ];
  for (const [name, fn, w] of views) { try { await go(fn, w || 1300); const n = await sweep(name, theme); console.log(theme, name, "controls", n, "findings so far", findings.length); } catch (e) { console.log("ERR", theme, name, String(e).slice(0, 160)); } }
  await go("(()=>{__hs.setState({bbMenuOpen:false}); __hs.goProjects(); return 1})()", 500);
}
// the sign-in screen
await b.eval("__hs.setTheme('light'); __hs.signOut(); 1"); await b.wait(5000); await sweep("sign-in", "light");
const uniq = {}; findings.forEach(f => { const k = [f.theme, f.state, f.name.replace(/"[^"]*"/, ""), f.what].join("|"); (uniq[k] = uniq[k] || Object.assign({ n: 0, ex: f.name, views: new Set() }, f)).n++; uniq[k].views.add(f.view); });
console.log("\nFINDINGS (words under 4.5:1, icons under 3:1): " + Object.keys(uniq).length + " kinds, " + findings.length + " instances");
Object.values(uniq).sort((a, c) => a.ratio - c.ratio).forEach(f => console.log(`  ${f.ratio}:1  ${f.theme}/${f.state}  ${f.ex}  x${f.n}  [${[...f.views].join(", ")}]  ${f.what}`));
console.log("logs", b.logs.slice(0, 5).join(" | "));
await b.close();
