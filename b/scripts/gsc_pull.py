#!/usr/bin/env python3
"""Google Search Console API pull for the b/ site.

Usage:
  python3 scripts/gsc_pull.py [--days 28] [--site auto]

Reads gsc-service-account.json (never commit). Outputs a compact report:
sites accessible, query x page performance, CTR opportunities, ranking drops.
"""
import argparse
import datetime as dt
import json
import sys
import time
from pathlib import Path

import requests
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding
import base64

HERE = Path(__file__).resolve().parent.parent
KEY_PATH = HERE / "gsc-service-account.json"
SCOPE = "https://www.googleapis.com/auth/webmasters.readonly"
TOKEN_URL = "https://oauth2.googleapis.com/token"


def b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def get_access_token() -> str:
    key = json.loads(KEY_PATH.read_text())
    now = int(time.time())
    header = b64url(json.dumps({"alg": "RS256", "typ": "JWT"}).encode())
    payload = b64url(json.dumps({
        "iss": key["client_email"],
        "scope": SCOPE,
        "aud": TOKEN_URL,
        "iat": now,
        "exp": now + 3600,
    }).encode())
    signing_input = f"{header}.{payload}".encode()
    private_key = serialization.load_pem_private_key(key["private_key"].encode(), None)
    sig = private_key.sign(signing_input, padding.PKCS1v15(), hashes.SHA256())
    jwt_value = f"{header}.{payload}.{b64url(sig)}"
    resp = requests.post(TOKEN_URL, data={
        "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "assertion": jwt_value,
    }, timeout=30)
    resp.raise_for_status()
    return resp.json()["access_token"]


def api(token: str, method: str, path: str, body: dict | None = None):
    url = f"https://searchconsole.googleapis.com/webmasters/v3/{path}"
    r = requests.request(method, url, json=body,
                         headers={"Authorization": f"Bearer {token}"}, timeout=60)
    r.raise_for_status()
    return r.json() if r.text else {}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=28)
    ap.add_argument("--site", default="auto")
    args = ap.parse_args()

    token = get_access_token()

    # 1) list accessible properties
    sites = api(token, "GET", "sites").get("siteEntry", [])
    if not sites:
        print("NO SITES: service account has not been added to any Search Console property.")
        print("Fix: Search Console -> Settings -> Users and permissions -> add",
              json.loads(KEY_PATH.read_text())["client_email"])
        sys.exit(2)
    print("== Accessible properties ==")
    for s in sites:
        print(f"  {s['siteUrl']}  permission={s['permissionLevel']}")

    if args.site == "auto":
        target = sites[0]["siteUrl"]
    else:
        target = args.site
    print(f"\n== Using property: {target} ==")

    end = dt.date.today() - dt.timedelta(days=3)   # fresh data lag
    start = end - dt.timedelta(days=args.days)
    body_base = {"startDate": start.isoformat(), "endDate": end.isoformat()}

    def query(dimensions, extra=None, limit=25000):
        body = dict(body_base, dimensions=dimensions, rowLimit=limit)
        if extra:
            body.update(extra)
        res = api(token, "POST",
                  f"sites/{requests.utils.quote(target, safe='')}/searchAnalytics/query",
                  body)
        return res.get("rows", [])

    # 2) daily totals
    daily = query(["date"])
    print(f"\n== Daily totals ({start} .. {end}) ==")
    for r in daily:
        print(f"  {r['keys'][0]}  clicks={r.get('clicks',0):5.0f}  impr={r.get('impressions',0):6.0f}  ctr={r.get('ctr',0)*100:5.2f}%  pos={r.get('position',0):5.1f}")

    # 3) top queries
    queries = query(["query"])
    print(f"\n== Top queries by clicks (total {len(queries)} rows) ==")
    for r in queries[:20]:
        print(f"  {r.get('clicks',0):5.0f} clicks  {r.get('impressions',0):7.0f} impr  ctr={r.get('ctr',0)*100:5.2f}%  pos={r.get('position',0):5.1f}  {r['keys'][0][:60]}")

    # 4) top pages
    pages = query(["page"])
    print(f"\n== Top pages by clicks (total {len(pages)} rows) ==")
    for r in pages[:15]:
        print(f"  {r.get('clicks',0):5.0f} clicks  {r.get('impressions',0):7.0f} impr  ctr={r.get('ctr',0)*100:5.2f}%  pos={r.get('position',0):5.1f}  {r['keys'][0][:80]}")

    # 5) opportunities: impressions > 20, position 5..20, low CTR
    qp = query(["query"])
    opp = [r for r in qp
           if r.get("impressions", 0) >= 20 and 5 <= r.get("position", 0) <= 20]
    opp.sort(key=lambda r: -r.get("impressions", 0))
    print(f"\n== Opportunities: impr>=20 & pos 5-20 ({len(opp)} rows, top 15) ==")
    for r in opp[:15]:
        print(f"  impr={r.get('impressions',0):6.0f}  pos={r.get('position',0):5.1f}  ctr={r.get('ctr',0)*100:5.2f}%  {r['keys'][0][:60]}")


if __name__ == "__main__":
    main()
