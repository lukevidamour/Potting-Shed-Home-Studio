// Bundles TEKEX's pack into one file, so the app makes one request for it instead of fourteen (the pack, each template,
// the examples, the template markup and the library list were fetched one after another while the page waited).
// The sources stay where they are and are what you edit; run this after changing any of them:
//
//   node tools/build-tekex.mjs        writes assets/tekex/bundle.js
//
// tests/tekex-pack.test.mjs fails if the bundle is out of date with its sources.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TK = path.join(ROOT, "assets", "tekex");

export function bundle() {
  const read = (f) => fs.readFileSync(path.join(TK, f), "utf8");
  // the order the app loads them in: the pack, then each of its parts as the pack lists them, then the examples
  const g = { console: { log() {}, warn() {} }, Math, JSON, Object, Array, String, Number, Date }; g.window = g; vm.createContext(g);
  vm.runInContext(read("pack.js"), g);
  const parts = (g.HS_TEKEX.parts || []).filter((p) => fs.existsSync(path.join(TK, "t-" + p + ".js")));
  const files = ["pack.js", ...parts.map((p) => "t-" + p + ".js"), "examples.js"];
  // each file runs on its own, as the separate loads did: one that throws doesn't stop the rest
  const block = (f) => `/* ---- ${f} ---- */\ntry {\n${read(f)}\n} catch (e) { console.warn("TEKEX ${f} didn't load", e); }\n`;
  const markup = read("templates.html"), library = JSON.parse(read("library/manifest.json"));
  return "/* Made by tools/build-tekex.mjs from the files in assets/tekex (don't edit this file: edit them, then run it). */\n" +
    files.map(block).join("\n") +
    "\n/* ---- templates.html and library/manifest.json ---- */\nif (window.HS_TEKEX) { window.HS_TEKEX.markupHtml = " + JSON.stringify(markup) + ";\n  window.HS_TEKEX.library = " + JSON.stringify(library) + "; }\n";
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const out = bundle();
  fs.writeFileSync(path.join(TK, "bundle.js"), out);
  console.log("assets/tekex/bundle.js, " + Math.round(out.length / 1024) + " KB");
}
