# 색인(인덱싱) 도구 모음

네이버·구글·빙에 가장 빠르게 색인시키기 위한 파일/스크립트입니다.

## 1. 검증 & 사이트맵/RSS (자동 생성)

| 항목 | URL | 비고 |
| --- | --- | --- |
| robots.txt | `/robots.txt` | sitemap 위치 포함 |
| 사이트맵 | `/sitemap.xml` | 전국 색인 페이지 전체 |
| RSS 피드 | `/rss.xml` | 네이버 RSS 수집용(서비스·사례·시도·시군구) |
| 네이버 HTML 인증 | `/naver03c540cd7785ad40927631e461d6f526.html` | 서치어드바이저 소유확인 |
| 네이버 메타 인증 | `<meta name="naver-site-verification" ...>` | 전 페이지 head |
| IndexNow 키 | `/1d1eb2631f48b9d45e8234984d26adf9.txt` | 빙·네이버 즉시 통보용 |

## 2. 등록 순서 (최초 1회)

1. `npm run build` → Cloudflare 배포로 위 파일들이 라이브에 올라감
2. **네이버 서치어드바이저**: 사이트 등록 → 소유확인(HTML 또는 메타) → `sitemap.xml`, `rss.xml` 제출
3. **구글 서치콘솔**: 속성 등록 → `sitemap.xml` 제출
4. **빙 웹마스터**: 사이트 등록 → `sitemap.xml` 제출 (IndexNow 자동 연동)

## 3. IndexNow — 빙·네이버 즉시 색인 통보 (외부 의존성 없음)

글/페이지를 올리거나 바꿀 때마다 즉시 통보:

```bash
# 전체 일괄 통보 (sitemap 기반)
python tools/indexnow.py

# 새 페이지 하나만 통보
python tools/indexnow.py https://pipe-works.pages.dev/area/seoul/gangnam-gu/yeoksam-dong/
```

- 키 파일(`public/1d1eb2631f48b9d45e8234984d26adf9.txt`)이 라이브 루트에 배포되어 있어야 합니다.
- IndexNow 는 한 번 통보하면 참여 엔진(빙·네이버·얀덱스·Seznam)에 공유됩니다.

## 4. (선택) 구글 Indexing API

구글은 IndexNow 미참여라 별도입니다. 일반 페이지엔 **서치콘솔 sitemap 제출이 정석**이며,
Indexing API 는 보조 수단입니다(공식 용도는 JobPosting/BroadcastEvent).

```bash
pip install google-auth requests
export GOOGLE_APPLICATION_CREDENTIALS=/path/service-account.json
python tools/google_index.py https://pipe-works.pages.dev/...
```

> 참고: sitemap ping 엔드포인트는 구글·빙 모두 2023년 폐지되어 사용하지 않습니다.
> 빠른 색인의 핵심 수단은 IndexNow(빙·네이버) + 서치콘솔/서치어드바이저 sitemap 제출입니다.

## 도메인 변경 시
커스텀 도메인을 붙이면 `src/data/site.ts`의 `url` 과 `tools/indexnow.py`의 `HOST`,
그리고 네이버/구글/빙 콘솔의 사이트 주소를 함께 바꿔주세요.
