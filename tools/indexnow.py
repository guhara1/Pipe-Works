#!/usr/bin/env python3
"""IndexNow 일괄 색인 통보 — 빙·네이버·얀덱스 등에 URL 즉시 통보.

사용법:
    python tools/indexnow.py                 # out/sitemap.xml 의 모든 URL 통보
    python tools/indexnow.py https://.../a/   # 특정 URL 한 개만 통보 (글 올릴 때)
    python tools/indexnow.py url1 url2 ...    # 여러 URL 통보

준비:
    1) `npm run build` 로 out/ 생성 (sitemap.xml 포함)
    2) public/<KEY>.txt 가 사이트 루트에 배포되어 있어야 함
       (현재 KEY = 아래 KEY 상수, 파일: public/<KEY>.txt)

IndexNow 는 한 곳에 통보하면 참여 검색엔진(Bing·Naver·Yandex·Seznam)에 공유됩니다.
안전하게 네이버·빙 엔드포인트에도 함께 통보합니다. 외부 의존성 없음(표준 라이브러리).
"""
import json
import re
import sys
import urllib.request
import urllib.error

HOST = "pipe-works.pages.dev"
KEY = "1d1eb2631f48b9d45e8234984d26adf9"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"
SITEMAP = "out/sitemap.xml"

ENDPOINTS = [
    "https://api.indexnow.org/indexnow",      # 참여 엔진 공유
    "https://searchadvisor.naver.com/indexnow",  # 네이버
    "https://www.bing.com/indexnow",          # 빙
]


def urls_from_sitemap(path: str):
    with open(path, encoding="utf-8") as f:
        xml = f.read()
    return re.findall(r"<loc>([^<]+)</loc>", xml)


def submit(batch):
    payload = json.dumps({
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": batch,
    }).encode("utf-8")
    for ep in ENDPOINTS:
        req = urllib.request.Request(
            ep, data=payload,
            headers={"Content-Type": "application/json; charset=utf-8"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                print(f"  [{r.status}] {ep}  ({len(batch)} URL)")
        except urllib.error.HTTPError as e:
            print(f"  [{e.code}] {ep}  {e.reason}")
        except Exception as e:  # noqa
            print(f"  [ERR] {ep}  {e}")


def main():
    args = [a for a in sys.argv[1:] if a.startswith("http")]
    if args:
        urls = args
    else:
        try:
            urls = urls_from_sitemap(SITEMAP)
        except FileNotFoundError:
            print(f"{SITEMAP} 없음 — 먼저 `npm run build` 실행하세요.")
            sys.exit(1)
    print(f"통보 대상 {len(urls)}개 URL → IndexNow(빙·네이버·얀덱스)")
    # IndexNow 1회 요청당 최대 10,000 URL
    for i in range(0, len(urls), 10000):
        submit(urls[i:i + 10000])
    print("완료. (색인 반영까지는 검색엔진 정책에 따라 시간이 걸릴 수 있습니다)")


if __name__ == "__main__":
    main()
