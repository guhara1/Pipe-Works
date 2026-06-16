// 파비콘/아이콘 멀티 포맷 생성기
//   node scripts/gen-favicons.mjs
//
// 생성물:
//   src/app/favicon.ico        (16/32/48, Next가 자동 링크)
//   src/app/apple-icon.png     (180, Next가 자동 링크 / iOS 홈화면)
//   public/icon-192.png        (PWA/안드로이드)
//   public/icon-512.png        (PWA/안드로이드)
//
// SVG 원본(src/app/icon.svg)과 동일 톤. 작은 크기·iOS는 모서리 투명을 피하려고
// 풀블리드(꽉 찬 사각형) 버전을 사용한다.

import sharp from "sharp";
import pngToIco from "png-to-ico";
import { writeFile } from "node:fs/promises";

const grad = `
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ff6a13"/>
      <stop offset="1" stop-color="#2f93d8"/>
    </linearGradient>
  </defs>`;

// 배관 엘보(ㄱ자 관) + 플랜지 — 64 기준 좌표
const glyph = `
  <path d="M23 15 L23 35 Q23 41 29 41 L49 41" fill="none" stroke="#ffffff"
        stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="15" y="11" width="16" height="6" rx="2" fill="#ffffff"/>
  <rect x="47" y="33" width="6" height="16" rx="2" fill="#ffffff"/>`;

// 풀블리드(모서리 투명 없음) — ico/apple/PWA 용
const fullBleed = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  ${grad}
  <rect width="64" height="64" fill="url(#g)"/>
  ${glyph}
</svg>`;

async function png(svg, size) {
  return sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
}

const tasks = [
  ["src/app/apple-icon.png", 180],
  ["public/icon-192.png", 192],
  ["public/icon-512.png", 512],
];

for (const [path, size] of tasks) {
  await writeFile(path, await png(fullBleed, size));
  console.log("wrote", path, size);
}

// favicon.ico (16/32/48)
const icoSizes = await Promise.all([16, 32, 48].map((s) => png(fullBleed, s)));
await writeFile("src/app/favicon.ico", await pngToIco(icoSizes));
console.log("wrote src/app/favicon.ico");
