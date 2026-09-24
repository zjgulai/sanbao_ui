#!/usr/bin/env python3
"""Build the standalone SanBao HTML using only Python's standard library."""
from pathlib import Path
import base64

ROOT = Path(__file__).resolve().parent
BLOCKS = {
    "{{WORLD_PILOT_STYLES}}": "src/styles.css",
    "{{WORLD_PILOT_BUSINESS_DATA}}": "src/data/business.json",
    "{{WORLD_PILOT_ENGLISH_DATA}}": "src/data/en.json",
    "{{WORLD_PILOT_APP}}": "src/app.js",
}
ASSETS = {
    "favicon.svg": "image/svg+xml",
    "dsh-reference.jpg": "image/jpeg",
    "earth-texture.png": "image/png",
}

def read_text(relative_path):
    return (ROOT / relative_path).read_bytes().decode("utf-8")

def build():
    html = read_text("src/index.template.html")
    for token, relative_path in BLOCKS.items():
        if html.count(token) != 1:
            raise ValueError(f"Expected exactly one {token} in the template")
        html = html.replace(token, read_text(relative_path))
    for filename, mime_type in ASSETS.items():
        token = "{{WORLD_PILOT_ASSET:" + filename + "}}"
        if html.count(token) != 1:
            raise ValueError(f"Expected exactly one asset reference: {filename}")
        encoded = base64.b64encode((ROOT / "assets" / filename).read_bytes()).decode("ascii")
        html = html.replace(token, f"data:{mime_type};base64,{encoded}")
    if "{{WORLD_PILOT_" in html:
        raise ValueError("An unresolved build placeholder remains")
    destination = ROOT / "index.html"
    destination.write_bytes(html.encode("utf-8"))
    print(f"Built {destination.name} ({destination.stat().st_size:,} bytes)")

if __name__ == "__main__":
    build()
