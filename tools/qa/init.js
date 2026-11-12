/* Responsive QA: Home Studio is one page with many views, so each "page" in the audit is the app with ?qa=<view>.
   This runs before the app's own scripts: it passes the sign-in screen, picks the client, then moves to the view. */
(function () {
  var q = function (k) { var m = location.search.match(new RegExp("[?&]" + k + "=([\\w-]+)")); return m ? m[1] : ""; };
  var want = q("qa") || "home", client = q("client") || "tekex";
  try { if (want !== "gate") sessionStorage.setItem("hs-in", "1"); localStorage.setItem("hs-ws-current", client); localStorage.setItem("hs-theme", "light"); } catch (e) {}
  if (want === "gate" || want === "home" || want === "designs" || want === "calendar" || want === "brand") return; // these have their own address (#/designs and so on)
  // A project and a design have addresses too. Once an earlier page in this run has stored the examples, go straight
  // there, so the speed pass measures the screen itself and not a jump to it after the home screen has drawn.
  try {
    var ns = client === "tekex" ? "" : "hs-ws-" + client + ":", ds = JSON.parse(localStorage.getItem(ns + "hs-drafts-v1") || "[]"), ps = JSON.parse(localStorage.getItem(ns + "hs-projects-v1") || "[]");
    var pk = ds.filter(function (x) { return x.layout === 1; })[0] || ds[0];
    var pj = ps.filter(function (p) { return ds.filter(function (x) { return x.projectId === p.id; }).length > 1; })[0];
    if (want === "project" && pj) { location.hash = "#/project/" + pj.id; return; }
    if (want === "editor" && pk) { location.hash = "#/design/" + pk.id; return; }
  } catch (e) {}
  var tries = 0, t = setInterval(function () {
    var h = window.__hs; if (++tries > 200) return clearInterval(t);
    if (!h || !h.state || !h.state.drafts || !h.state.drafts.length) return;
    clearInterval(t);
    var d = h.state.drafts, pick = d.filter(function (x) { return x.layout === 1; })[0] || d[0];
    var proj = h.state.projects.filter(function (p) { return d.filter(function (x) { return x.projectId === p.id; }).length > 1; })[0];
    if (want === "project" && proj) h.setState({ view: "project", projectId: proj.id });
    if (want === "editor" || want === "publish") { h.openDesign(pick, false); if (want === "publish") setTimeout(function () { h.openReview(); }, 700); }
    if (want === "chat") h.goMake();
    if (want === "chat-thread") { h.goMake(); setTimeout(function () { h.makeSend(client === "tekex" ? "Dr Niraj Singh, Founder at Ketamine Therapies, is speaking Thu 26 Nov, 9am at the BDO Hub. As a square and a story." : "A carousel for our investment in Northwind Robotics"); }, 400); }
    if (want === "search") h.cmdToggle();
  }, 100);
})();
