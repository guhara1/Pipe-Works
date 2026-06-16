// 지역 콘텐츠 자동 생성기
//
// 손으로 쓴 고유 콘텐츠(node.content)가 없는 지역에 대해, 지역별 데이터를 조합해
// "실질적으로 서로 다른" 본문을 만든다. 동일 문장 복붙(도어웨이)을 피하기 위해:
//  - 상위 시·도, 시/군/구 유형, 인접 지역(형제 노드)을 본문에 반영
//  - 슬러그 시드로 표현 변형 풀에서 문장을 회전 선택
//
// 주의: 자동 생성은 "구조 + 기본 안내"를 채우는 용도다. 실제 사례·현장 사진이
// 생기면 해당 지역 node.content 를 손으로 보강해 품질을 높이는 것이 권장된다.

import type { AreaContent, RegionNode } from "./regions";

type RegionType = "시도" | "구" | "군" | "시";

function seed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(arr: T[], n: number): T {
  // n 이 음수(부호 비트 시프트 결과)여도 안전하게 인덱싱
  const i = ((n % arr.length) + arr.length) % arr.length;
  return arr[i];
}

// 받침 유무로 은/는 조사 선택
function topicParticle(word: string): string {
  const last = word.charCodeAt(word.length - 1);
  if (last < 0xac00 || last > 0xd7a3) return "는"; // 한글이 아니면 기본값
  return (last - 0xac00) % 28 !== 0 ? "은" : "는";
}

function regionType(node: RegionNode): RegionType {
  if (node.level === "sido") return "시도";
  if (node.level === "gu") return "구";
  const n = node.name;
  if (n.endsWith("군")) return "군";
  if (n.endsWith("구")) return "구";
  return "시";
}

// 인접(형제) 지역 링크
function nearbyFromSiblings(node: RegionNode, parentPath: string[], siblings: RegionNode[]): { name: string; path: string }[] {
  const others = siblings.filter((s) => s.slug !== node.slug);
  const base = parentPath.length ? `/area/${parentPath.join("/")}` : "/area";
  // 시드로 시작 위치를 회전시켜 인접 목록이 지역마다 달라지게 함
  const start = others.length ? seed(node.slug) % others.length : 0;
  const ordered = [...others.slice(start), ...others.slice(0, start)];
  return ordered.slice(0, 5).map((s) => ({ name: `${s.name} 배관공사`, path: `${base}/${s.slug}/` }));
}

const LEAD_BY_TYPE: Record<RegionType, string[]> = {
  시도: [
    "{sido}는 도심 상권과 노후 주거지, 신축 단지, 공장·창고가 폭넓게 분포해 같은 하수구막힘이라도 지역마다 원인이 다릅니다.",
    "{sido}는 시·군·구마다 주거 형태와 상권 밀집도가 크게 달라, 배관 문제도 지역별로 다른 양상을 보입니다.",
  ],
  구: [
    "{topic} 아파트·오피스텔과 상가, 음식점, 사무실이 함께 밀집한 {sido}의 도심형 지역이라 배관 문제가 단순 가정용 막힘으로 끝나지 않는 경우가 많습니다.",
    "{topic} 주거 단지와 상권이 섞여 있는 {sido}의 자치구로, 세대 내 막힘부터 상가·음식점 배관 적체까지 상담 유형이 다양합니다.",
  ],
  시: [
    "{topic} 아파트 단지와 단독·다세대주택, 상가가 혼재한 {sido}의 도시 지역으로, 주거지 막힘과 상권 배관 적체가 함께 접수됩니다.",
    "{topic} 신축과 노후 건물이 섞여 있는 {sido}의 시 지역이라, 현장마다 배관 노후도와 막힘 원인이 다릅니다.",
  ],
  군: [
    "{topic} 단독주택과 농가, 펜션·식당, 노후 건물이 많은 {sido}의 군 지역으로, 정화조·오수관·노후 배관 관련 상담이 자주 발생합니다.",
    "{topic} 주택가와 상가가 흩어져 있는 {sido}의 군 지역이라, 배관 노후와 구배 불량으로 인한 반복 막힘이 잦습니다.",
  ],
};

// 본문 분량 확보용 — 지역명이 들어가는 추가 안내 문단(유형별 변형)
const DETAIL_BY_TYPE: Record<RegionType, string[]> = {
  시도: [
    "주거지는 머리카락·비누 찌꺼기·음식물 찌꺼기가, 상가·음식점은 기름 슬러지가 주된 막힘 원인이 됩니다. 반복 막힘이 있으면 배관내시경으로 내부 상태를 먼저 확인한 뒤 고압세척 여부를 판단하는 것이 안전합니다.",
  ],
  구: [
    "{name}에서는 싱크대 기름막힘, 욕실 배수 지연, 변기 반복 막힘, 상가 바닥 배수 역류 상담이 고르게 접수됩니다. 단순 이물질은 스프링으로 해결되지만, 같은 자리가 반복해서 막히면 기름·퇴적물 적체나 구배 문제일 수 있어 내시경 확인을 권합니다.",
  ],
  시: [
    "{name}에서는 아파트 세대 내 막힘과 단독·다세대주택의 노후 배관 문제, 상가·음식점의 기름 적체가 함께 나타납니다. 현장 유형에 따라 스프링·고압세척·내시경 중 필요한 장비를 선택해 처리합니다.",
  ],
  군: [
    "{name}에서는 노후 주택과 농가의 배관 구배 불량, 정화조·오수관 적체, 식당·펜션의 기름 막힘 상담이 잦습니다. 겨울철에는 동결·해빙으로 인한 배관 문제도 함께 접수되므로 계절에 따라 점검 방향을 안내합니다.",
  ],
};

const PROBLEM_BY_TYPE: Record<RegionType, string[]> = {
  시도: [
    "도심 노후 주거지는 관 노후·구배 불량으로 인한 역류가, 상권은 음식점 주방의 기름 슬러지 적체가 주된 원인입니다. 신축 단지는 시공 직후 이물질이나 공용 배관 적체가 접수됩니다.",
  ],
  구: [
    "가정집은 머리카락·비누 찌꺼기·음식물 찌꺼기가, 음식점·카페는 기름 슬러지와 배관 내부 퇴적물이 주된 막힘 원인입니다. 같은 자리가 반복해서 막히면 배관내시경으로 내부 상태를 먼저 확인하는 것이 안전합니다.",
    "오피스·상가는 화장실 배수 지연이, 주거 세대는 싱크대·욕실 배수 지연이 잦습니다. 영업장 배관은 가정집보다 원인이 복잡해 작업 전 확인이 특히 중요합니다.",
  ],
  시: [
    "주거지는 머리카락·음식물 찌꺼기로 인한 국소 막힘이, 상가·음식점은 기름 적체가 주된 원인입니다. 오래된 건물은 배관 노후·구배 문제까지 겹치는 경우가 많습니다.",
  ],
  군: [
    "노후 주택과 농가는 배관 구배 불량·정화조 적체로 인한 역류가, 식당·펜션은 기름과 음식물 적체가 잦습니다. 겨울철 동결·해빙으로 인한 배관 문제도 함께 접수됩니다.",
  ],
};

const FAQ_VARIANTS: { q: string; a: string }[][] = [
  [
    { q: "{name} 하수구막힘은 바로 출동 가능한가요?", a: "지역과 시간대, 현장 상황에 따라 상담 후 안내됩니다. 증상과 사진을 먼저 보내주시면 필요한 장비를 더 정확히 판단할 수 있습니다." },
    { q: "{name}에서 자주 막히면 고압세척이 필요한가요?", a: "반복 막힘이라면 단순 이물질보다 배관 내부 기름때·퇴적물이 원인일 수 있습니다. 배관내시경으로 내부를 확인한 뒤 고압세척 여부를 판단하는 것이 좋습니다." },
    { q: "{name} 상가나 음식점도 작업 가능한가요?", a: "상가·음식점·사무실 등 현장 구조에 따라 상담이 가능합니다. 영업장 배관은 작업 전 확인이 중요합니다." },
  ],
  [
    { q: "{name}도 야간·주말 출동이 되나요?", a: "야간·주말·공휴일 긴급출동이 가능합니다. 시간대에 따라 비용 기준이 달라지는 점은 작업 전에 안내합니다." },
    { q: "변기가 막혔을 때 약품을 써도 되나요?", a: "약품은 일시적으로 도움이 될 수 있지만 배관 손상·악취 문제가 생길 수 있습니다. 반복 막힘·역류가 있으면 상담이 안전합니다." },
    { q: "{name} 오래된 건물도 작업 가능한가요?", a: "가능합니다. 노후 정도와 배관 구조를 내시경으로 확인한 뒤 안전한 방식으로 작업합니다." },
  ],
];

export function generateAreaContent(node: RegionNode, parentPath: string[], siblings: RegionNode[], sidoName: string): AreaContent {
  const t = regionType(node);
  const n = seed(node.slug);
  const topic = node.name + topicParticle(node.name);
  const fill = (s: string) =>
    s.replaceAll("{topic}", topic).replaceAll("{name}", node.name).replaceAll("{sido}", sidoName);

  const lead =
    fill(pick(LEAD_BY_TYPE[t], n)) +
    ` 스피드 배관공사는 ${node.name} 현장의 건물 유형과 사용 환경을 먼저 확인한 뒤, 단순 막힘인지 반복 막힘인지 배관 내부 문제인지에 따라 필요한 장비와 작업 방향을 안내합니다. 무리하게 작업부터 시작하지 않고 증상과 위치를 확인하는 단계를 먼저 거치며, 야간·주말 긴급출동과 음식점·상가 영업장 시간대 조율도 가능합니다. 작업 후에는 배수 테스트로 흐름을 확인하고, 재발 방지 방법과 A/S 기준을 함께 안내해 같은 문제가 반복되지 않도록 돕습니다. ${node.name} 지역은 상담 시 증상과 현장 사진을 먼저 확인하면 출동과 작업이 더 빠르고 정확하게 진행됩니다.`;

  const problems = fill(pick(PROBLEM_BY_TYPE[t], n >> 3)) + " " + fill(pick(DETAIL_BY_TYPE[t], n >> 7));

  const faq = pick(FAQ_VARIANTS, n >> 5).map((f) => ({ q: fill(f.q), a: fill(f.a) }));

  return {
    lead,
    symptomList: [
      "물이 평소보다 천천히 빠지는 경우",
      "배수구에서 하수 냄새가 올라오는 경우",
      "싱크대 물이 역류하거나 거품이 올라오는 경우",
      "욕실 바닥 배수가 늦어지고 물이 고이는 경우",
      "변기가 반복적으로 막히거나 물이 잘 안 내려가는 경우",
      "음식점 주방 배관에 기름때가 쌓여 바닥 배수가 막히는 경우",
      "오래된 건물에서 배관 구배가 좋지 않아 적체가 반복되는 경우",
    ],
    problems,
    serviceItems: [
      `${node.name} 하수구막힘`,
      `${node.name} 배관공사`,
      `${node.name} 싱크대막힘`,
      `${node.name} 변기막힘`,
      `${node.name} 욕실 배수구막힘`,
      `${node.name} 오수관막힘`,
      `${node.name} 배관내시경`,
      `${node.name} 고압세척`,
      `${node.name} 음식점 하수구막힘`,
      `${node.name} 상가·아파트 배관공사`,
    ],
    steps: [
      "증상 확인",
      "사진 또는 영상 상담",
      "막힘 위치 추정",
      "현장 접근 가능 여부 확인",
      "작업 전 비용 기준 안내",
      "장비 선택",
      "막힘 제거 또는 배관 세척",
      "배수 테스트",
      "재발 방지 안내",
    ],
    costFactors: [
      "막힘 위치",
      "배관 길이",
      "배관 노후도",
      "장비 사용 여부",
      "배관내시경 필요 여부",
      "고압세척 필요 여부",
      "야간·주말 출동 여부",
      "상가·음식점 여부",
      "배관 교체 필요 여부",
    ],
    costNote: `${node.name} 배관공사 비용은 현장 구조와 막힘 정도를 확인한 뒤 안내됩니다. 단순 막힘인지, 반복 막힘인지, 배관 내부 문제인지에 따라 필요한 장비와 작업 시간이 달라질 수 있습니다. 작업 전에 예상 기준을 안내하고, 추가 작업이 필요하면 진행 전에 다시 설명한 뒤 동의를 받고 진행합니다.`,
    preparation: `상담이 더 정확하려면 ${node.name}의 막힘 증상과 발생 위치(싱크대·욕실·변기·바닥 등), 건물 형태(아파트·주택·상가·음식점), 물이 내려가는 속도, 냄새 여부를 알려주시면 좋습니다. 가능하면 증상이 보이는 부위 사진 1~3장을 함께 보내주시면 필요한 장비를 더 정확히 판단할 수 있고, 영업장은 작업 가능 시간대와 차량 접근·주차 가능 여부를 미리 알려주시면 출동이 빨라집니다.`,
    faq,
    nearbyLinks: node.level === "sido" ? undefined : nearbyFromSiblings(node, parentPath, siblings),
  };
}
