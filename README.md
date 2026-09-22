# Potting Shed Home Studio

Client self-service asset studio. TEKEX is the first client workspace.

- `Home Studio.dc.html` — the app (projects, calendar, editor, publish). Runs on the dc-runtime in `support.js`.
- `home-studio.css` — Potting Shed shell styles. Client artwork styling lives in the templates inside the HTML.
- `home-studio.lib.js` — brand configuration (TEKEX colourways, partners, templates, sizes), data model and pure helpers.
- `TEKEX Asset Studio.dc.html` — the original Claude Design prototype, kept for reference.
- `tests/` — node tests for the helpers: `node --test tests/`.

## Run locally

Serve the folder over HTTP (fonts and the export renderer need it). Either run `./serve.sh` or:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

then open http://127.0.0.1:8765/Home%20Studio.dc.html

Designs, projects and thumbnails are stored in the browser (`localStorage`). Swap the `Store` adapter in `home-studio.lib.js` to move them to a backend.
