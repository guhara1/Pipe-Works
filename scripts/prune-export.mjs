// 정적 export 산출물에서 RSC prefetch payload(.txt)를 제거한다.
//   node scripts/prune-export.mjs
//
// 이유: Next 16 정적 export는 페이지마다 __next.*.txt / index.txt (RSC 세그먼트
// prefetch) 파일을 다수 생성한다. 페이지가 수천 개면 파일 수가 Cloudflare Pages
// 한도(20,000)를 초과해 배포가 거부된다(No deployment available).
// .html 은 완결된 정적 페이지라 제거해도 동작하며, 클라이언트 prefetch만 일반
// 내비게이션으로 폴백된다.

import { readdir, stat, unlink } from "node:fs/promises";
import { join } from "node:path";

const OUT = "out";
let removed = 0;

function isPayload(name) {
  // __next.*.txt (세그먼트 prefetch) 와 페이지별 index.txt (RSC flight) 제거.
  // robots.txt, sitemap.xml 등은 보존.
  return /^__next\..*\.txt$/.test(name) || name === "index.txt";
}

async function walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p);
    else if (isPayload(e.name)) {
      await unlink(p);
      removed++;
    }
  }
}

await walk(OUT);
console.log(`prune-export: RSC payload ${removed}개 제거`);
