#!/usr/bin/env python3
"""URL Inspection API pull for the b/ site.

Usage:
  python3 scripts/url_inspect.py [URL ...]   # default: key pages

Endpoint is https://searchconsole.googleapis.com/v1/urlInspection/index:inspect
(NOT webmasters/v3 - that path 404s). Snapshot saved to seo/data/url-inspection-YYYY-MM-DD.json.
"""
import argparse
import datetime as dt
import json
from pathlib import Path

import requests

from gsc_pull import get_access_token

HERE = Path(__file__).resolve().parent.parent
SITE = "sc-domain:55aaseclab.com"
INSPECT_URL = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect"
BASE = "https://www.55aaseclab.com"

DEFAULT_PAGES = [
    "/zh/blog/syssec-not-hard-anymore/",
    "/en/blog/syssec-not-hard-anymore/",
    "/zh/blog/gbu-hit-2027-joint-phd-admissions/",
    "/zh/blog/gbu-sustech-2027-joint-master-admissions/",
    "/en/people/qiang-liu/",
    "/zh/publications/",
    "/en/startups/",
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("urls", nargs="*", help="full URLs or paths; default key pages")
    args = ap.parse_args()

    paths = args.urls or DEFAULT_PAGES
    urls = [u if u.startswith("http") else BASE + u for u in paths]

    token = get_access_token()
    out = {"generated_at": dt.datetime.now().isoformat(timespec="seconds"), "results": []}
    for u in urls:
        body = {"inspectionUrl": u, "siteUrl": SITE, "languageCode": "en-US"}
        r = requests.post(INSPECT_URL, json=body,
                          headers={"Authorization": f"Bearer {token}"}, timeout=60)
        if r.status_code != 200:
            print(f"  HTTP {r.status_code}  {u}")
            out["results"].append({"url": u, "error": f"HTTP {r.status_code}"})
            continue
        idx = r.json().get("inspectionResult", {}).get("indexStatusResult", {})
        row = {"url": u,
               "verdict": idx.get("verdict"),
               "coverage": idx.get("coverageState"),
               "lastCrawl": idx.get("lastCrawlTime"),
               "robotsTxtState": idx.get("robotsTxtState")}
        out["results"].append(row)
        print(f"  {row['verdict']} | {(row['coverage'] or '')[:45]:45s} | "
              f"lastCrawl {(row['lastCrawl'] or '')[:10]} | {u.split('55aaseclab.com')[-1]}")

    data_dir = HERE / "seo" / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    snap = data_dir / f"url-inspection-{dt.date.today().isoformat()}.json"
    snap.write_text(json.dumps(out, ensure_ascii=False, indent=1))
    print(f"== Snapshot saved: {snap.name} ==")


if __name__ == "__main__":
    main()
