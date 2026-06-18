// 전국 읍·면·동(법정동) 데이터 생성기 — 이름 기준
//   node scripts/gen-regions.mjs  →  src/data/eupmyeondong.generated.ts
//
// cronozen-region-codes 의 LEGAL_DONGS 를 (시도short|시군구명) 으로 그룹.
// 코드 기준 조회는 강원·전북(특별자치도 전환으로 코드 변경) 등 45곳이 누락되므로
// 이름 기준으로 그룹해 전국을 빠짐없이 포함한다.
// 슬러그 규칙: 동/읍/면/가/리 접미사 분리 → romanize(어간)+"-"+접미사 (역삼동 → yeoksam-dong)

import { LEGAL_DONGS } from "cronozen-region-codes";
import { romanize } from "es-hangul";
import { writeFile } from "node:fs/promises";

// 시·도 정식명 → short (LAWD/트리와 동일 표기)
const SHORT = {
  서울특별시: "서울", 부산광역시: "부산", 대구광역시: "대구", 인천광역시: "인천",
  광주광역시: "광주", 대전광역시: "대전", 울산광역시: "울산", 세종특별자치시: "세종",
  경기도: "경기", 강원특별자치도: "강원", 강원도: "강원", 충청북도: "충북",
  충청남도: "충남", 전라북도: "전북", 전북특별자치도: "전북", 전라남도: "전남",
  경상북도: "경북", 경상남도: "경남", 제주특별자치도: "제주",
};

const SUF = { 동: "dong", 읍: "eup", 면: "myeon", 가: "ga", 리: "ri" };
const rom = (s) => romanize(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// 1동·2동·3동, 1가·2가 등 번호 분할을 대표동으로 통합
//   역삼1동→역삼동, 명륜1가→명륜동, 장충동1가→장충동, 종로1가→종로동
function repName(name) {
  const m = name.match(/^(.*?)(\d+)(가|동|로|길)?$/);
  if (!m) return name;
  const base = m[1];
  if (/[동읍면리가]$/.test(base)) return base; // 장충동1가 → 장충동
  return base + "동"; // 명륜1가 → 명륜동, 역삼1동 → 역삼동
}
function slugify(name) {
  const last = name[name.length - 1];
  if (SUF[last]) return (rom(name.slice(0, -1)) || "x") + "-" + SUF[last];
  return rom(name) || "x";
}

// (short|sigungu) → Set(umd)
const groups = {};
for (const d of LEGAL_DONGS) {
  if (!d.isActive || !d.umd || !d.sigungu) continue;
  const short = SHORT[d.sido] || d.sido;
  const key = `${short}|${d.sigungu}`;
  (groups[key] = groups[key] || new Set()).add(repName(d.umd));
}

const out = {};
let total = 0;
for (const key of Object.keys(groups)) {
  const seen = new Set();
  const list = [];
  for (const name of groups[key]) {
    let s = slugify(name);
    if (seen.has(s)) {
      let i = 2;
      while (seen.has(`${s}-${i}`)) i++;
      s = `${s}-${i}`;
    }
    seen.add(s);
    list.push({ n: name, s });
  }
  out[key] = list;
  total += list.length;
}

const header = `// 자동 생성 파일 — 직접 수정하지 마세요. (생성: scripts/gen-regions.mjs)
// 전국 읍·면·동(법정동) 목록. 키: "시도short|시군구명"(행정구는 "시명 구명"). 값: { n: 이름, s: 슬러그 }
// 출처: cronozen-region-codes (행정표준코드) + es-hangul 로마자 변환
export type EmdEntry = { n: string; s: string };
export const eupmyeondongByKey: Record<string, EmdEntry[]> = `;

await writeFile("src/data/eupmyeondong.generated.ts", header + JSON.stringify(out) + ";\n", "utf-8");
console.log(`생성 완료: ${Object.keys(out).length}개 그룹, 읍·면·동 ${total}개 → src/data/eupmyeondong.generated.ts`);
