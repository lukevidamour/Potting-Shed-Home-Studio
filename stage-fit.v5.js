(function () {
  var STAGE = "main[data-stage]";
  var CANVAS = "[data-canvas]";

  function fit() {
    var stage = document.querySelector(STAGE);
    var canvas = document.querySelector(CANVAS);
    if (!stage || !canvas) return;
    var w = parseFloat(canvas.style.width) || 0;
    var h = parseFloat(canvas.style.height) || 0;
    if (!w || !h || !stage.clientWidth || !stage.clientHeight) return;
    var s = Math.min((stage.clientWidth - 64) / w, (stage.clientHeight - 64) / h, 1);
    if (!(s > 0) || !isFinite(s)) return;
    var v = String(Math.round(s * 1000) / 1000);
    if (document.documentElement.style.getPropertyValue("--tkx-scale") !== v) {
      document.documentElement.style.setProperty("--tkx-scale", v);
    }
  }
  window.__tkxFit = fit;

  var t = null;
  function schedule() {
    if (t) return;
    t = setTimeout(function () { t = null; fit(); }, 24);
  }

  var ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(schedule) : null;
  var observed = { stage: null, canvas: null };

  function attach() {
    var stage = document.querySelector(STAGE);
    var canvas = document.querySelector(CANVAS);
    if (ro && stage && stage !== observed.stage) { ro.observe(stage); observed.stage = stage; }
    if (ro && canvas && canvas !== observed.canvas) { ro.observe(canvas); observed.canvas = canvas; }
    return !!(stage && canvas);
  }

  function boot() {
    attach();
    fit();
    if (document.body) {
      // the canvas box is what changes when the user switches size — watch its style attr,
      // and re-attach if React swaps the node out.
      new MutationObserver(function () { attach(); schedule(); })
        .observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["style"] });
    }
    window.addEventListener("resize", schedule);
    setInterval(function () { attach(); fit(); }, 500);
  }

  function safeBoot() { try { boot(); } catch (e) { console.warn("[tkx-fit]", e); } }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", safeBoot);
  else safeBoot();
})();
