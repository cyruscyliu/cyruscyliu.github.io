#!/usr/bin/env python3
"""Pull Bing Webmaster QueryStats for 55aaseclab.com (Bing's analog of GSC Performance).

Usage:
  python3 scripts/bing_pull.py [--days 28]

Reads bing_api_key from seo/keys.env (never commit).
Saves snapshot to seo/data/bing-YYYY-MM-DD.json and prints daily + top queries.
"""
import argparse
import datetime as dt
import json
from pathlib import Path

import requests

HERE = Path(__file__).resolve().parent.parent
SITE = "https://www.55aaseclab.com/"
API = "https://ssl.bing.com/webmaster/api.svc/json"


def load_key():
    for line in (HERE / "seo" / "keys.env").read_text().splitlines():
        if line.startswith("bing_api_key="):
            return line.split("=", 1)[1].strip()
    sys.exit("bing_api_key not found in seo/keys.env")


import sys


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=28)
    args = ap.parse_args()
    key = load_key()

    end = dt.date.today()
    start = end - dt.timedelta(days=args.days)
    r = requests.get(f"{API}/GetQueryStats", params={
        "siteUrl": SITE, "apikey": key,
        "startDate": start.isoformat(), "endDate": end.isoformat(),
    }, timeout=60)
    r.raise_for_status()
    data = r.json().get("d", {})

    daily = []
    for day in data.get("DailyStats", []):
        for q in day.get("QueryStats", []):
            daily.append({
                "date": day["Date"].replace("/Date(", "").replace(")/", "")[:8],
                "query": q.get("Query"),
                "clicks": q.get("Clicks", 0),
                "impressions": q.get("Impressions", 0),
                "position": round(q.get("Position", 0), 1),
            })
    # aggregate by query
    agg = {}
    for row in daily:
        a = agg.setdefault(row["query"], dict(clicks=0, impressions=0, position=0.0, n=0))
        a["clicks"] += row["clicks"]
        a["impressions"] += row["impressions"]
        a["position"] += row["position"]
        a["n"] += 1
    queries = [
        {"keys": [q], "clicks": a["clicks"], "impressions": a["impressions"],
         "position": round(a["position"] / a["n"], 1)}
        for q, a in sorted(agg.items(), key=lambda x: -x[1]["impressions"])
    ]

    print(f"== Bing QueryStats {start} .. {end} ({SITE}) ==")
    print(f"total clicks={sum(a['clicks'] for a in agg.values())}, "
          f"impressions={sum(a['impressions'] for a in agg.values())}, "
          f"queries={len(agg)}")
    for q in queries[:20]:
        print(f"  {q['clicks']:5.0f} clicks  {q['impressions']:7.0f} impr  pos={q['position']:5.1f}  {q['keys'][0][:60]}")
    if not queries:
        print("  (empty - Bing may not have query data yet, or site not fully verified)")

    out = HERE / "seo" / "data" / f"bing-{dt.date.today().isoformat()}.json"
    out.write_text(json.dumps({
        "generated_at": dt.datetime.now().isoformat(timespec="seconds"),
        "platform": "bing", "site": SITE,
        "start": start.isoformat(), "end": end.isoformat(),
        "queries": queries,
    }, ensure_ascii=False, indent=1))
    print(f"snapshot: {out.name}")


if __name__ == "__main__":
    main()
