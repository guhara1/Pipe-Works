#!/usr/bin/env python3
"""(선택) 구글 Indexing API 통보 — 구글은 IndexNow 미참여라 별도.

주의:
- 구글 Indexing API 는 공식적으로 JobPosting / BroadcastEvent 용도입니다.
  일반 페이지에 사용하는 것은 비공식이며 효과가 제한적일 수 있습니다.
- 일반 페이지의 정석은 Search Console 에 sitemap 제출입니다.
  (sitemap ping 엔드포인트는 2023년 구글·빙 모두 폐지됨 — 사용하지 않음)

준비:
    1) Google Cloud 프로젝트에서 Indexing API 활성화
    2) 서비스 계정 생성 → JSON 키 다운로드
    3) Search Console 속성에 서비스 계정 이메일을 '소유자'로 추가
    4) pip install google-auth requests
    5) export GOOGLE_APPLICATION_CREDENTIALS=/path/service-account.json

사용법:
    python tools/google_index.py https://pipe-works.pages.dev/area/seoul/gangnam-gu/
    python tools/google_index.py            # out/sitemap.xml 전체 (쿼터 주의: 일 200건)
"""
import os
import re
import sys

ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish"
SCOPES = ["https://www.googleapis.com/auth/indexing"]
SITEMAP = "out/sitemap.xml"


def urls_from_sitemap(path):
    with open(path, encoding="utf-8") as f:
        return re.findall(r"<loc>([^<]+)</loc>", f.read())


def main():
    try:
        import requests
        from google.oauth2 import service_account
        from google.auth.transport.requests import AuthorizedSession
    except ImportError:
        print("의존성 필요: pip install google-auth requests")
        sys.exit(1)

    cred_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if not cred_path:
        print("GOOGLE_APPLICATION_CREDENTIALS 환경변수(서비스 계정 JSON 경로)가 필요합니다.")
        sys.exit(1)

    creds = service_account.Credentials.from_service_account_file(cred_path, scopes=SCOPES)
    session = AuthorizedSession(creds)

    args = [a for a in sys.argv[1:] if a.startswith("http")]
    urls = args or urls_from_sitemap(SITEMAP)
    print(f"구글 Indexing API 통보: {len(urls)}개 (일일 쿼터 기본 200건 주의)")
    ok = 0
    for u in urls:
        r = session.post(ENDPOINT, json={"url": u, "type": "URL_UPDATED"})
        if r.status_code == 200:
            ok += 1
        else:
            print(f"  [{r.status_code}] {u} {r.text[:120]}")
    print(f"완료: {ok}/{len(urls)} 성공")


if __name__ == "__main__":
    main()
