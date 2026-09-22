#!/bin/sh
# Serve Home Studio locally. Fonts and the export renderer need HTTP, not file://.
cd "$(dirname "$0")" && echo "Open http://127.0.0.1:8765/Home%20Studio.dc.html" && exec python3 -m http.server 8765 --bind 127.0.0.1
