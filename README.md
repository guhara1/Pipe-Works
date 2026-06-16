# 스피드 배관공사 — 전국 SEO 사이트

전국 행정구역(시·도 → 시·군·구 → 읍·면·동) 단위 검색 노출을 위한 정적 사이트입니다.
**Next.js(App Router) + 정적 export(`output: "export"`)** 로 구성되어 정적 호스팅(Netlify, Vercel, S3, Cloudflare Pages 등)에 그대로 배포할 수 있습니다.

## 설계 원칙 (구글 가이드라인 준수)

- "전국 페이지를 많이 만드는 것"이 아니라 **"전국 구조를 만들되 index는 가치 있는 페이지부터" 여는** 것이 핵심.
- 시·도 허브 → 시·군·구 핵심 → **실제 사례·콘텐츠가 있는** 읍·면·동 순으로 색인 확장.
- 콘텐츠가 없는 읍·면·동은 기본 **noindex**(페이지는 존재하되 색인 제외, 사이트맵에서도 제외).
- 도어웨이/중복 회피: 지역마다 고유 본문, 검증 불가 표현·가짜 후기·허위 지점 금지.
- 1동·2동은 대표명으로 통합 (예: 역삼1동+역삼2동 → `yeoksam-dong`).

## 시작하기

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 정적 export → out/ 디렉터리 생성
```

`out/` 디렉터리를 정적 호스팅에 업로드하면 됩니다.

## 콘텐츠/지역을 추가하는 법

모든 페이지는 데이터로 구동됩니다. **데이터를 추가하면 페이지·사이트맵이 자동 생성**됩니다.

| 추가 대상 | 파일 |
| --- | --- |
| 사이트 상호·전화·도메인 | `src/data/site.ts` |
| 서비스(증상/공법) | `src/data/services.ts` |
| 업종별 페이지 | `src/data/businesses.ts` |
| 지역(시·도/시·군·구/구/읍·면·동) | `src/data/regions.ts` |
| 현장 사례 | `src/data/cases.ts` |

### 지역 페이지 색인(index) 규칙 — `src/data/regions.ts`

- `content` 가 있는 시·군·구/읍·면·동 → 자동 index.
- `content` 가 없으면 → 자동 noindex (placeholder 페이지로 존재, 상담은 가능).
- `indexable: true/false` 로 명시적으로 덮어쓸 수 있음.
- 시·도(`level: "sido"`)는 기본 index.

읍·면·동은 **실제 출동/사례가 쌓인 곳부터** `content` 를 채워 index로 전환하세요.

### 샘플로 채워둔 페이지

- 서울특별시(시·도 허브) — 고유 본문 + 25개 구
- 서울 강남구(시·군·구) — 고유 본문 + FAQ + 인접 지역
- 서울 강남구 역삼동(읍·면·동, **index**) — 고유 본문 + 사례 연결
- 경기 수원시→영통구→매탄동, 세종 읍·면·동, 제주 읍·면·동 등 — **구조만**(noindex placeholder)
- 서비스: 하수구막힘 / 배관공사 상세 본문, 나머지는 요약+준비중

> 나머지 시·군·구·읍·면·동은 전국 구조(트리)에 모두 들어 있으나 콘텐츠가 없어 noindex 상태입니다.

## SEO

- 메타데이터: 각 페이지 `generateMetadata` (Rank Math 대신 Next 메타데이터 API).
- 구조화 데이터(`src/lib/seo.ts`): Organization, WebSite(SearchAction), Plumber(LocalBusiness),
  Service, BreadcrumbList, FAQPage, Article. **가짜 Review/평점·허위 지점 마크업은 사용하지 않음.**
- 사이트맵: `src/app/sitemap.ts` — **indexable 페이지만 포함**.
- robots: `src/app/robots.ts`.

## 배포 (Cloudflare Pages)

정적 export(`out/`)를 Cloudflare Pages에 배포합니다. 두 가지 방법이 있습니다.

### 방법 A — GitHub Actions 자동 배포 (이 저장소에 설정됨)

`.github/workflows/deploy.yml` 가 `main` 및 `claude/**` 브랜치 push 시 자동으로 빌드·배포합니다.
사전 준비:

1. Cloudflare 대시보드에서 Pages 프로젝트 생성 (이름: `pipe-works` — 워크플로의 `--project-name` 과 일치시킬 것).
2. GitHub 저장소 **Settings → Secrets and variables → Actions** 에 시크릿 등록:
   - `CLOUDFLARE_API_TOKEN` — *Cloudflare Pages: Edit* 권한 토큰
   - `CLOUDFLARE_ACCOUNT_ID` — Cloudflare 계정 ID
3. push 하면 빌드 → `wrangler pages deploy out` 으로 배포됩니다.

> 프로젝트명을 바꾸려면 `.github/workflows/deploy.yml` 의 `--project-name=pipe-works` 를 수정하세요.

### 방법 B — Cloudflare 대시보드 Git 연동 (설정 파일 불필요)

Cloudflare Pages → *Connect to Git* 후 빌드 설정:

| 항목 | 값 |
| --- | --- |
| Framework preset | None (또는 Next.js Static HTML Export) |
| Build command | `npm run build` |
| Build output directory | `out` |
| Node version | 22 (환경변수 `NODE_VERSION=22`) |

`public/_headers` 가 캐시·보안 헤더를 적용합니다(빌드 시 `out/` 루트로 복사됨).

## 배포 전 교체할 항목

`src/data/site.ts` 의 `url`(도메인), `phone`(대표 전화)을 실제 값으로 교체하세요.
이미지(`public/images/`)는 현재 SVG 플레이스홀더이며, 실제 장비·현장 사진(개인정보·주소 제거)으로 교체하세요.
