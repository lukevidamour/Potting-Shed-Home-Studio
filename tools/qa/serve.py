#!/usr/bin/env python3
"""Local server that behaves like the live host: text files are sent gzip-compressed and files are cacheable for ten minutes.
Python's own http.server sends everything uncompressed, which makes the phone speed figures look far worse than they are live.
    python3 tools/qa/serve.py [port] [folder]
"""
import gzip, os, sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

TEXT = ('.html', '.js', '.mjs', '.css', '.json', '.svg', '.txt', '.md', '.xml')
_cache = {}


class Handler(SimpleHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'

    def end_headers(self):
        self.send_header('Cache-Control', 'max-age=600')
        super().end_headers()

    def do_GET(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            path = os.path.join(path, 'index.html')
        if not (path.lower().endswith(TEXT) and os.path.isfile(path) and 'gzip' in self.headers.get('Accept-Encoding', '')):
            return super().do_GET()
        st = os.stat(path)
        key = (path, st.st_mtime_ns, st.st_size)
        body = _cache.get(key)
        if body is None:
            with open(path, 'rb') as f:
                body = _cache[key] = gzip.compress(f.read(), 6)
        self.send_response(200)
        self.send_header('Content-Type', self.guess_type(path))
        self.send_header('Content-Encoding', 'gzip')
        self.send_header('Vary', 'Accept-Encoding')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *a):
        pass


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    if len(sys.argv) > 2:
        os.chdir(sys.argv[2])
    print(f'Serving {os.getcwd()} at http://127.0.0.1:{port}/ (gzip on)')
    ThreadingHTTPServer(('127.0.0.1', port), Handler).serve_forever()
