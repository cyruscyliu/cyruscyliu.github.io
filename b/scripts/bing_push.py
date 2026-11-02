#!/usr/bin/env python3
"""IndexNow push for 55aaseclab.com (Bing + Yandex + Seznam + Naver share the protocol).

Usage:
  python3 scripts/bing_push.py              # push all sitemap URLs
  python3 scripts/bing_push.py URL [URL...] # push specific URLs

Reads keys from seo/keys.env (never commit): bing_api_key, indexnow_key.
Requires public/<indexnow_key>.txt to be live on https://www.55aaseclab.com/.
"""
import json
import re
import sys
from pathlib import Path

import requests

HERE = Path(__file__).resolve().parent.parent
HOST = "www.55aaseclab.com"


def load_keys():
    env = {}
    for line in (HERE / "seo" / "keys.env").read_text().splitlines():
        if "=" in line and not line.startswith("#"):
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip()
    return env


def sitemap_urls():
    dist = HERE / "dist" / "sitemap.xml"
    if dist.exists():
        xml = dist.read_text()
    else:
        xml = requests.get(f"https://{HOST}/sitemap.xml", timeout=30).text
    return sorted(set(re.findall(r"<loc>(https://www\.55aaseclab\.com[^<]*)</loc>", xml)))


def main():
    env = load_keys()
    idx_key = env["indexnow_key"]
    urls = sys.argv[1:] or sitemap_urls()
    if not urls:
        sys.exit("no URLs to push")
    body = {
        "host": HOST,
        "key": idx_key,
        "keyLocation": f"https://{HOST}/{idx_key}.txt",
        "urlList": urls,
    }
    r = requests.post("https://api.indexnow.org/indexnow", json=body, timeout=60,
                      headers={"Content-Type": "application/json; charset=utf-8"})
    print(f"pushed {len(urls)} URLs -> HTTP {r.status_code}")
    if r.text:
        print(r.text[:300])
    if r.status_code in (200, 202):
        print("OK")
    else:
        print("check: key file live? https://%s/%s.txt" % (HOST, idx_key))
        sys.exit(1)


if __name__ == "__main__":
    main()
