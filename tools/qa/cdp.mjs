// Minimal CDP driver for headless Chrome. Usage: import { open } from './cdp.mjs'
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
export async function open({ profile, port = 9333, width = 1440, height = 900, dpr = 1 }) {
  const proc = spawn(CHROME, ["--headless=new", "--remote-debugging-port=" + port, "--user-data-dir=" + profile, "--no-first-run", "--no-default-browser-check", "--hide-scrollbars", "--window-size=" + width + "," + height, "about:blank"], { stdio: "ignore" });
  let ws, targets;
  for (let i = 0; i < 60; i++) { try { targets = await (await fetch("http://127.0.0.1:" + port + "/json")).json(); if (targets.find(t => t.type === "page")) break; } catch (e) {} await new Promise(r => setTimeout(r, 250)); }
  const page = targets.find(t => t.type === "page");
  ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0; const pending = new Map(); const logs = [];
  ws.onmessage = (m) => { const msg = JSON.parse(m.data); if (msg.id && pending.has(msg.id)) { const { res, rej } = pending.get(msg.id); pending.delete(msg.id); msg.error ? rej(new Error(msg.error.message)) : res(msg.result); }
    else if (msg.method === "Runtime.exceptionThrown") logs.push("EXC " + (msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text));
    else if (msg.method === "Runtime.consoleAPICalled" && (msg.params.type === "error" || msg.params.type === "warning")) logs.push(msg.params.type + " " + msg.params.args.map(a => a.value ?? a.description).join(" "));
    else if (msg.method === "Network.responseReceived" && msg.params.response.status >= 400) logs.push("HTTP " + msg.params.response.status + " " + msg.params.response.url); };
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  await send("Page.enable"); await send("Runtime.enable"); await send("Network.enable"); await send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__hsQa = true;" }); // automated checks skip the demo sign-in screen
  const api = {
    logs, send,
    async viewport(w, h, d = dpr, dark) { await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: d, mobile: false }); },
    async dark(on) { await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: on ? "dark" : "light" }] }); },
    async goto(url, wait = 2500) { await send("Page.navigate", { url }); await new Promise(r => setTimeout(r, wait)); },
    async eval(expr) { const r = await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; },
    async wait(ms) { await new Promise(r => setTimeout(r, ms)); },
    async shot(file, clip) { const p = { format: "png" }; if (clip) p.clip = Object.assign({ scale: 1 }, clip); const r = await send("Page.captureScreenshot", p); writeFileSync(file, Buffer.from(r.data, "base64")); return file; },
    async click(sel, nth = 0) { const pt = await api.eval(`(()=>{const e=[...document.querySelectorAll(${JSON.stringify(sel)})][${nth}]; if(!e) return null; e.scrollIntoView({block:'center'}); const r=e.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2};})()`); if (!pt) throw new Error("no element " + sel); await send("Input.dispatchMouseEvent", { type: "mousePressed", x: pt.x, y: pt.y, button: "left", clickCount: 1 }); await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: pt.x, y: pt.y, button: "left", clickCount: 1 }); await api.wait(350); },
    async clickText(text, sel = "button") { const pt = await api.eval(`(()=>{const e=[...document.querySelectorAll(${JSON.stringify(sel)})].find(n=>n.textContent.trim().indexOf(${JSON.stringify(text)})===0 && n.offsetParent!==null); if(!e) return null; e.scrollIntoView({block:'center'}); const r=e.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2};})()`); if (!pt) throw new Error("no text " + text); await send("Input.dispatchMouseEvent", { type: "mousePressed", x: pt.x, y: pt.y, button: "left", clickCount: 1 }); await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: pt.x, y: pt.y, button: "left", clickCount: 1 }); await api.wait(350); },
    async close() { try { await send("Browser.close"); } catch (e) {} proc.kill(); }
  };
  await api.viewport(width, height, dpr);
  return api;
}
