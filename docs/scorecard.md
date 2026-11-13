# Home Studio scorecard

Ten categories, each out of 100. The target is 90 or more in every one. Each score names what carries it and what caps it, and every cap is something that was measured or seen, not a feeling. Each item in the plan says what changes, roughly how many points it is worth, and how we will know it worked.

**How to keep improving:** each work session, run the checks below, pick the three plan items worth the most points per hour, do them, run the checks again, and add a row to the history. The score only goes up when a check says so.

## Run the checks

Serve the app first (`python3 tools/qa/serve.py 8765`), then:

```bash
node --test tests/*.mjs                                  # templates build in every layout and size; examples match their thumbnails
sh tools/qa/run.sh --sizes quick                         # 11 screens x 8 sizes: overflow, overlap, tap targets, speed, layout shift
node tools/qa/states.mjs /tmp/hs-qa tekex light,dark     # every control at rest, hovered and focused: contrast of words and icons
```

## History

| Date | Visual | Type & copy | Feel | Motion | Workflows | Artwork | Make | Access | Speed | Phone | Average |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 13 Nov 2026 | 85 | 86 | 84 | 83 | 76 | 88 | 68 | 84 | 64 | 70 | **79** |

## The scores, 13 November 2026

Measured on seven screens at 1440, 1024, 768, 390 and 320 wide; 88 page loads in the responsive matrix; every control hovered and focused in light and dark; 24 unit tests.

### 1. Visual craft: 85
- **Carrying it:** every screen holds one content column (1 of 1 blocks aligned on home, All designs and Make). One type family with a single italic moment per page. The artwork leads on every page that lists work. Today's rail icons and the sparkle are drawn in the same family as the footer icons.
- **Capping it:** the brand book opens on an 800 x 340 teal block with nothing in it but a word and six dots. The stylesheet has drifted: 21 font sizes, 17 corner radii and 55 raw hex colours, where a tight system needs about 9, 5 and tokens only.

### 2. Typography and copy: 86
- **Carrying it:** no line over 75 characters except one; no widows; plain, specific labels throughout ("Saved in this browser", "Keep copy in sync").
- **Capping it:** the brand book introduction runs 86 characters. The calendar's Unscheduled list shows six rows that all read "Founders, Film & New Fronti…". On a phone, "Going out this week" breaks onto two lines and crowds its meta.

### 3. Interaction feel: 84
- **Carrying it:** press feedback at 0.98, neutral hovers, focus rings on every control (38 focus rules), undo and redo in the editor, autosave stated in the header.
- **Capping it:** 182 touch targets under 44px on touch screens, for example "open the calendar" (81 x 24), "Reposition" (56 x 32), the label remove buttons (40 x 40) and the schedule date field (81 x 40). The colourway swatches are all "Aa", so you can't tell which is which without trying them.

### 4. Motion: 83
- **Carrying it:** scrolling holds 60 to 62 frames a second, with a worst frame of 34ms on home and 18ms elsewhere. The median one-shot animation is 250ms, none runs over a second, the tile opens into the editor as one continuous move, and entrances play once per session.
- **Capping it:** one one-shot animation uses linear easing. The editor stage animates a layout property instead of a transform. There are 10 reduced-motion guards for 119 animated rules.

### 5. Core workflows: 76
- **Carrying it:** drafts to editor to publish works, with checks (content, fit, images, contrast) before download. Projects, families of sizes and the calendar all hang together.
- **Capping it:** the calendar treats each size as a separate post (13 November shows the same ticket post three times), and the Unscheduled list has 29 rows, mostly repeats of the same designs. The publish drawer downloads only the size you are looking at. "Send to Potting Shed" approval goes nowhere outside this browser.

### 6. Artwork quality: 88
- **Carrying it:** ten templates and 45 layouts match the Figma toolkit within about 2px at 1080 and 1200 x 627. Every layout builds in all five sizes, with example copy and with long copy, without errors (unit test).
- **Capping it:** portrait, story and landscape are translations that no designer has signed off. 64 thumbnails are soft on a retina screen because they're stored at half size. The long quote on Sponsor layout 1 overflows in landscape.

### 7. Make assistant: 68 (not re-measured today)
- **Carrying it:** a calm full-screen start ("What shall we make?"), three starter prompts, and results that land as real, editable designs in a project.
- **Capping it:** it hasn't been tested against a set of real briefs, so its hit rate is unknown. Its corner dot still uses the old teal instead of the workspace icon.

### 8. Accessibility: 84
- **Carrying it:** no controls without a name, no images without alt text, and landmarks on every screen. The state sweep finds no contrast failures in light or dark (one found today, from the new workspace icon, was fixed the same day).
- **Capping it:** the editor has no h1, and home and the calendar skip a heading level. The 182 small touch targets count here too. The probe flagged one small editor button at 1.16:1 that I couldn't reproduce, so it needs confirming.

### 9. Speed and reliability: 64
- **Carrying it:** on a desktop with a warm cache the wall is usable in about 150ms. 24 unit tests and the journey suites guard the risky parts, and the client guard stops private work reaching the public repo.
- **Capping it:** on a mid-range phone on 4G the main content takes 4.8 to 5.4 seconds to appear (6 screens), and the page jumps while loading (layout shift 0.65 to 1.0 on 4 screens; anything over 0.25 is poor). The interface compiles in the browser from a 324 KB page on every visit, and the font files are requested several times. All work, thumbnails included, lives in browser storage, which has a size limit.

### 10. Phone and responsive: 70
- **Carrying it:** no blockers in 88 page loads: nothing overflows, overlaps or falls off screen from 280 to 2560 wide. The phone editor and bottom navigation work.
- **Capping it:** on a phone the header's Potting Shed wordmark is drawn 38 x 20, a stray rule sits at the top right, and the assistant button covers the search field. The two speed problems above are felt most on phones.

## Plan to 90+

Ordered by points per hour within each category.

### Phone 70 → 90
1. Header: wordmark at its proper size, remove the stray rule, even spacing between icon, avatar and actions. **~8 pts.** Check: screenshot at 375; wordmark 90px or more wide.
2. Lift the assistant button clear of the search field when the list is at the top, or tuck it into the bottom bar. **~4 pts.** Check: no overlap with `.search` at 280 to 430 wide.
3. Week heading on one line, with meta beneath. **~2 pts.**
4. Speed items below. **~6 pts.**

### Speed and reliability 64 → 90
1. Reserve each card's space before its thumbnail arrives, and fix the header height. **~8 pts.** Check: layout shift under 0.1 on all screens.
2. Load each font once: preload the two weights used on first paint, and drop the duplicate requests. **~5 pts.**
3. First screen first: render the wall from a pre-built page, and compile the editor only when it opens. **~10 pts.** Check: under 2.5s to the largest first-screen element on the phone profile.
4. Move thumbnails into IndexedDB and keep browser storage for small records. **~3 pts.** Check: 200 designs saved without a quota error.

### Make assistant 68 → 88
1. Build a test set of 30 real TEKEX briefs from the Figma files and score each result (right template, right copy, right person). **Sets the true score.**
2. Fix whatever that shows, worst first. **~10 pts.**
3. Use the workspace icon instead of the teal dot, and the sparkle on the send button. **~2 pts.**
4. Offer three directions per brief instead of one. **~6 pts.**

### Core workflows 76 → 90
1. The calendar shows one chip per design with its sizes (for example "3 sizes"), and Unscheduled lists designs, not files. **~6 pts.** Check: 13 Nov shows one chip; Unscheduled has no repeated names.
2. Download every size of a design at once, as a zip. **~4 pts.**
3. Make approval honest: say it stays in this browser, until there's a shared backend. **~2 pts.**
4. Scheduling by dragging a chip between days, with a confirmation. **~2 pts.**

### Accessibility 84 → 92
1. Bring every touch target to 44px with an invisible hit area, not a bigger look. **~4 pts.** Check: tap-tight 182 → 0.
2. A visually hidden h1 in the editor (the design's name), and no skipped heading levels. **~2 pts.**
3. Confirm or clear the 1.16:1 editor button. **~1 pt.**
4. Name the colourway swatches for screen readers and on hover. **~1 pt.**

### Interaction feel 84 → 91
1. The 44px hit areas above. **~3 pts.**
2. Colourway swatches show their names on hover. **~2 pts.**
3. Keyboard shortcuts listed in "How it works" (undo, redo, publish, search). **~2 pts.**

### Motion 83 → 90
1. Ease-out on the one linear one-shot; transform instead of layout on the editor stage. **~3 pts.** Check: the probe reports 0 and 0.
2. One global reduced-motion rule, then remove the per-rule guards. **~2 pts.**
3. Choreograph the Make overlay's open and close (staggered in, a softer exit). **~2 pts.**

### Visual craft 85 → 92
1. Brand book cover: show the client's real artwork and logo, not an empty block. **~3 pts.**
2. Token pass: 9 type sizes, 5 radii, colours only from tokens. **~3 pts.** Check: the counts in the stylesheet.
3. Calendar chips and the Unscheduled list redrawn as cards, one per design. **~1 pt** (shared with workflows).

### Typography and copy 86 → 92
1. Cap the brand book introduction at 65 characters. **~2 pts.**
2. Unscheduled rows use the design's own name, clamped to two lines, never six identical truncations. **~2 pts.**
3. Read every empty state, toast and confirmation aloud once and cut what isn't needed. **~2 pts.**

### Artwork quality 88 → 94
1. A designer signs off the translated sizes from a contact sheet (tools/qa/tk-render.mjs makes it). **~3 pts.**
2. Store thumbnails at full 1080 so they're sharp on retina. **~2 pts.** Check: img-soft 64 → 0.
3. Fix the long quote on Sponsor layout 1 in landscape; add the Digital Jersey and PwC logos to the sponsor list. **~1 pt.**

## Decisions only Potting Shed can make

- **Shared work:** today everything lives in one browser, so a colleague or client sees none of it. A small backend (sign-in and shared storage) is what turns the prototype into a product. It is the biggest single step, and it is a build and hosting decision.
- **Real publishing:** posting straight to LinkedIn and Instagram needs their developer apps and approval.
- **The assistant's brain:** rules today. A language model would read briefs far better, at a running cost per use.
