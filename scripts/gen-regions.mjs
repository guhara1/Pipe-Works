// 전국 읍·면·동(법정동) 데이터 생성기
//   node scripts/gen-regions.mjs  →  src/data/eupmyeondong.generated.ts
//
// cronozen-region-codes(행정구역 데이터) + es-hangul(로마자) 사용. devDependency 전용.
// 출력: { "시도short|시군구명": [{ n: 동이름, s: 슬러그 }, ...] }
// 슬러그 규칙: 동/읍/면/가/리 접미사 분리 → romanize(어간) + "-" + 접미사  (예: 역삼동 → yeoksam-dong)

import { LAWD_CODES, getLegalDongsBySigungu } from "cronozen-region-codes";
import { romanize } from "es-hangul";
import { writeFile } from "node:fs/promises";

const SUF = { 동: "dong", 읍: "eup", 면: "myeon", 가: "ga", 리: "ri" };

function rom(s) {
  return romanize(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function slugify(name) {
  const last = name[name.length - 1];
  if (SUF[last]) {
    const stem = name.slice(0, -1);
    const base = rom(stem);
    return (base || "x") + "-" + SUF[last];
  }
  return rom(name) || "x";
}

const out = {};
let total = 0;

for (const l of LAWD_CODES) {
  const umd = [...new Set(getLegalDongsBySigungu(l.code).filter((d) => d.isActive).map((d) => d.umd).filter(Boolean))];
  if (!umd.length) continue;
  const seen = new Set();
  const list = [];
  for (const name of umd) {
    let s = slugify(name);
    if (seen.has(s)) {
      let i = 2;
      while (seen.has(`${s}-${i}`)) i++;
      s = `${s}-${i}`;
    }
    seen.add(s);
    list.push({ n: name, s });
  }
  out[`${l.sido}|${l.sigungu}`] = list;
  total += list.length;
}

const header = `// 자동 생성 파일 — 직접 수정하지 마세요. (생성: scripts/gen-regions.mjs)
// 전국 읍·면·동(법정동) 목록. 키: "시도short|시군구명". 값: { n: 이름, s: 슬러그 }
// 출처: cronozen-region-codes (행정표준코드) + es-hangul 로마자 변환
export type EmdEntry = { n: string; s: string };
export const eupmyeondongByKey: Record<string, EmdEntry[]> = `;

await writeFile("src/data/eupmyeondong.generated.ts", header + JSON.stringify(out) + ";\n", "utf-8");
console.log(`생성 완료: ${Object.keys(out).length}개 시군구, 읍·면·동 ${total}개 → src/data/eupmyeondong.generated.ts`);
