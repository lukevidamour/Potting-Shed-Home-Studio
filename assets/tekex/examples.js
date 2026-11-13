/* TEKEX's example designs: what All designs and Drafts show on a first visit, and what "Bring back the examples"
   restores. Every template and nearly every layout appears, with TEKEX's own people, events and partners, and the
   copy from the toolkit and published posts. Several designs come in more than one format, so their tiles show the
   sizes layered. Dates are worked out from the day they arrive (api.now) and roll forward a week at a time with today
   (see hs-tk-seed-at in Home Studio.dc.html), so the calendar always has work going out this week.
   A person is only ever shown with their own picture and a role they are credited with in TEKEX's files. */
(function () {
  var T = window.HS_TEKEX;
  if (!T) return;

  var MS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var ML = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var WD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  function seed(api) {
    var now = new Date(api.now || Date.now()), y0 = now.getFullYear(), m0 = now.getMonth(), d0 = now.getDate();
    var at = function (days) { return new Date(y0, m0, d0 + days); };
    var p2 = function (n) { return ("0" + n).slice(-2); };
    var ord = function (n) { var t = n % 100; return n + (t > 10 && t < 14 ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th"); };
    var dmy = function (days) { var t = at(days); return p2(t.getDate()) + "/" + p2(t.getMonth() + 1) + "/" + String(t.getFullYear()).slice(-2); };
    var dm = function (days) { var t = at(days); return ord(t.getDate()) + " " + MS[t.getMonth()]; };
    var day = function (days) { var t = at(days); return WD[t.getDay()] + " " + t.getDate() + " " + MS[t.getMonth()]; };
    var iso = function (days) { var t = at(days); return t.getFullYear() + "-" + p2(t.getMonth() + 1) + "-" + p2(t.getDate()); };
    // the next given weekday (0 Sunday) at least `min` days away
    var next = function (dow, min) { var n = min; while (at(n).getDay() !== dow) n++; return n; };
    // the last Friday of the month, the month after if this month's is under a week away
    var lastFri = function () {
      for (var k = 0; k < 3; k++) {
        var e = new Date(y0, m0 + k + 1, 0), n = Math.round((e - at(0)) / 86400000); while (at(n).getDay() !== 5) n--;
        if (n >= 7) return n;
      }
      return 28;
    };

    var IOM = next(4, 12), HI = next(4, 33), LF = lastFri(), JSY = next(3, 19);
    var projects = [], drafts = [], FAM = {};
    var P = function (name, brief) { var p = api.project(name, brief); projects.push(p); return p; };
    // A design in a layout: the layout's example copy, then this design's own words.
    var D = function (p, tpl, layout, title, copy, o) {
      o = o || {};
      var blank = {}; (T.fields[tpl] || []).forEach(function (f) { blank[f.key] = ""; });
      var d = api.design(p, tpl, title, o.theme || null, Object.assign(blank, T.exampleFor(tpl, layout) || {}, copy || {}), o.pics, layout);
      // posts go out on weekdays: a date that lands on a weekend moves to the Monday
      if (o.sched != null) { var sd = o.sched; while (at(sd).getDay() === 0 || at(sd).getDay() === 6) sd++; d.scheduledAt = iso(sd); }
      if (o.partners) d.partnersOn = o.partners.slice();
      if (o.sizes) FAM[d.id] = o.sizes;
      drafts.push(d);
      return d;
    };

    // 1. Isle of Man #3: the panel line-up carousel, the ticket countdown and the day-of post
    var p = P("TEKEX IOM #3", "The Isle of Man event on " + day(IOM) + ". The panel line-up carousel, the ticket countdown and a post for the day itself.");
    var lu = { edition: "IOM#3", date: dmy(IOM), eyebrow: "Panel introduction", venue: dm(IOM) + " / 17:30 / Isle of Man", cta: "Register now at tekex.co", footLabel: "Speakers" };
    var luP = { sched: 1 };
    D(p, "tk-lineup", 0, "IOM#3 line-up · Cover", Object.assign({}, lu, { name: "", role: "" }), luP);
    [["Carol Glover", "Vice President, Chamber of Commerce"], ["Lyle Wraxall", "CEO, Digital Isle of Man"],
     ["Steve Billinghurst", "Chair, IoD"], ["Guy Templer", "Chair, Junior Achievement"]].forEach(function (s, i) {
      D(p, "tk-lineup", 1, "IOM#3 line-up · " + s[0], Object.assign({}, lu, { name: s[0], role: s[1] }), { sched: 1 });
    });
    D(p, "tk-lineup", 2, "IOM#3 line-up · Register", lu, luP);
    D(p, "tk-lineup", 3, "IOM#3 line-up · Supported by", lu, luP);
    D(p, "tk-countdown", 1, "IOM#3 tickets on sale", { code: "IOM#3", eyebrow: "TICKETS ON SALE NOW", date: dmy(IOM), body: "Global Innovation. Isle of Man Opportunity." }, { sched: 0, sizes: ["story", "linkedin"] });
    D(p, "tk-countdown", 0, "IOM#3 tonight", { code: "IOM#3", headline: "TONIGHT" }, { sched: IOM });

    // 2. Health Innovation Jersey
    p = P("Health Innovation Jersey", "A one-day event at the BDO/C5 Hub on " + day(HI) + ": the announcement in every format, the last-chance post and the news story.");
    D(p, "tk-series", 3, "Is Health Jersey's next key industry?", { date: dmy(HI), time: "10.30–20.00", venue: "BDO/C5 Hub, St Helier" }, { sched: 3, sizes: ["portrait", "story", "linkedin"] });
    D(p, "tk-news", 0, "Tekex to host the Health Innovation Summit", null, { sched: 2, sizes: ["linkedin"] });
    D(p, "tk-countdown", 2, "Health Innovation · Last chance", null, { sched: HI - 3 });
    D(p, "tk-statement", 0, "Cross-pollination", null);

    // 3. Speaker cards
    p = P("Speaker cards", "Speaker announcements from TEKEX #34, #36 and IOM #3, in each of the speaker layouts.");
    D(p, "tk-speaker", 0, "Tim Huelin", null, { sched: 4, sizes: ["portrait", "story", "linkedin"] });
    D(p, "tk-speaker", 2, "Serena Guthrie", { eyebrow: "Tekex #36 Speaker:", name: "Serena Guthrie", role: "Former England netball player" }, { sizes: ["story"] });
    D(p, "tk-speaker", 3, "Lyle Wraxall", { eyebrow: "IOM#3 Speaker:", name: "Lyle Wraxall", role: "CEO, Digital Isle of Man" }, { sched: 6, sizes: ["linkedin"] });
    D(p, "tk-speaker", 1, "Tim Huelin · Photo", null);

    // 4. Last Friday Club
    p = P("Last Friday Club · " + ML[at(LF).getMonth()], "The community social on " + day(LF) + ": the save-the-date, a cut-out version and the reminder the day before.");
    D(p, "tk-series", 0, "Last Friday Club · Save the date", { date: day(LF) }, { sched: LF - 7, sizes: ["story", "landscape"] });
    D(p, "tk-series", 1, "Last Friday Club · Shapes", { date: day(LF) }, null);
    D(p, "tk-series", 2, "Last Friday Club · Tomorrow", { date: dm(LF), time: "17:00" }, { sched: LF - 1, sizes: ["linkedin"] });

    // 5. Partners
    p = P("Partners · Rathbones and BDO/C5", "Partner posts: Rathbones' support, the BDO/C5 partnership carousel, the logo panel and the welcome post.");
    D(p, "tk-sponsor", 0, "Rathbones proudly supporting TEKEX", null, { sched: 5, sizes: ["portrait", "linkedin"] });
    D(p, "tk-sponsor", 1, "BDO/C5 x TEKEX · Partnership benefits", null);
    D(p, "tk-sponsor", 2, "BDO/C5 x TEKEX · Quote", null);
    D(p, "tk-sponsor", 3, "Thanks to our collaborators", null);
    D(p, "tk-sponsor", 4, "Innovation starts here", null, { sizes: ["story"] });

    // 6. TEKEX Wrapped
    p = P("TEKEX Wrapped 2025", "The year in numbers, slide by slide, with the statements and quotes from the year.");
    D(p, "tk-statement", 3, "Wrapped · 12 events", { step: "1/7" }, { sched: 20 });
    D(p, "tk-statement", 3, "Wrapped · 1,000+ members", { eyebrow: "COMMUNITY", stat: "1,000+", headline: "Ecosystem Members", body: "Startups, investors, creatives, corporates and policymakers, growing stronger together across three islands.", step: "2/7" }, { sched: 20 });
    D(p, "tk-statement", 2, "Wrapped · £22M raised", null, { sched: 20, sizes: ["linkedin"] });
    D(p, "tk-statement", 1, "The best introductions", null, { sizes: ["linkedin"] });

    // 7. Fundraising and news
    p = P("Fundraising and news", "Fundraising announcements and news from the community.");
    D(p, "tk-fundraising", 0, "Io-Co closes its Series A", null, { sched: 2, sizes: ["linkedin"] });
    D(p, "tk-fundraising", 1, "CI Airlines' Angel round", null);
    D(p, "tk-fundraising", 2, "We found our lead investor at Tekex", null);
    D(p, "tk-fundraising", 3, "£22M raised", null);
    D(p, "tk-news", 4, "Hear from Louis Pike", null, { sched: 7, sizes: ["story"] });
    D(p, "tk-news", 3, "Simon Franc on TEKEX #32", null);
    D(p, "tk-news", 1, "Tekex lands in the Isle of Man", null);

    // 8. This is TEKEX
    p = P("This is TEKEX", "The brand campaign: what TEKEX is and who it's for, the supporters, and the podcast cover.");
    D(p, "tk-campaign", 0, "What can Tekex do for you?", null, { sched: 9, sizes: ["story", "linkedin"] });
    D(p, "tk-campaign", 1, "What can Tekex do for you? · List", null);
    D(p, "tk-campaign", 2, "What is Tekex?", null);
    D(p, "tk-campaign", 3, "Supported by", null);
    D(p, "tk-campaign", 4, "Podcast #3 · Deals from A to Z", null, { sched: 12 });

    // 9. TEKEX #31, the toolkit's event posts as they were published
    p = P("TEKEX #31 · Founders, Film & New Frontiers", "The event announcement from the toolkit in each of its six layouts.");
    D(p, "tk-event", 0, "Founders, Film & New Frontiers", null, { sizes: ["portrait", "story", "linkedin"] });
    [1, 2, 3, 4, 5].forEach(function (L) { D(p, "tk-event", L, "Founders, Film & New Frontiers · " + T.templates.filter(function (t) { return t.key === "tk-event"; })[0].layouts[L], null); });

    // The other formats sit with their design, so each family is together in the list
    var out = [];
    drafts.forEach(function (d) { out.push(d); if (FAM[d.id] && api.sizes) api.sizes(d, FAM[d.id]).forEach(function (x) { out.push(x); }); });
    // Newest first is how the app lists work: stamp them in reverse so the projects read in this order
    var t0 = Date.now();
    out.forEach(function (d, i) { d.updatedAt = t0 - i * 60000; });
    projects.forEach(function (pj, i) { pj.createdAt = t0 - (i + 1) * 86400000 * 2; pj.updatedAt = t0 - i * 3600000; });
    return { projects: projects, drafts: out };
  }

  T.seed = seed;
  T.seedThumbs = { dir: "assets/seed/tk-", n: 73 };
})();
