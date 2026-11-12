#!/bin/sh
# Potting Shed Responsive QA for Home Studio. Serve the folder first with compression, as the live host does:
#   python3 tools/qa/serve.py 8765
# Speed is measured on the screens that have an address (home, a project, a design, all designs, calendar, brand book).
# The publish drawer, the assistant and search are opened by a tap, so they are checked for layout, not for load speed.
#   sh tools/qa/run.sh                      full matrix, first client
#   QA_CLIENT=<client id> sh tools/qa/run.sh --sizes quick
cd "$(dirname "$0")"
BASE="${QA_BASE:-http://localhost:8765/}"
CLIENT="${QA_CLIENT:-tekex}"
P="Home%20Studio.dc.html"
sed "s/CLIENT/$CLIENT/g" interactions.json > out/interactions.json
PAGES=""
for v in gate home project editor publish chat chat-thread search; do PAGES="$PAGES $P?qa=$v&client=$CLIENT"; done
for v in designs calendar brand; do PAGES="$PAGES $P?qa=$v&client=$CLIENT#/$v"; done
python3 audit.py --base "$BASE" --pages $PAGES --init-js "$(cat init.js)" --interactions out/interactions.json \
  --ignore ".offcard, .offcard *, .boards.offstage, .boards.offstage *, [data-canvas] *" \
  --no-perf-for "qa=publish,qa=chat,qa=search" \
  --report out/qa-report.md --json out/qa.json "$@"
python3 overlays.py --base "$BASE" --interactions out/interactions.json --init-js "$(cat init.js)" --sizes 280x653,390x844,844x390,768x1024
