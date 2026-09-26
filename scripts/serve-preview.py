"""Local-only static preview with cache disabled; exposes dist, not the repository."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

class PreviewHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # Ignore conditional cache validation during local design iteration.
        for header in ("If-Modified-Since", "If-None-Match"):
            if header in self.headers:
                del self.headers[header]
        super().do_GET()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()

if __name__ == "__main__":
    root = Path(__file__).resolve().parent.parent / "dist"
    if not root.is_dir():
        raise SystemExit("Build the preview before starting the server.")
    ThreadingHTTPServer(("127.0.0.1", 4173), partial(PreviewHandler, directory=str(root))).serve_forever()
