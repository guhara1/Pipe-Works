// 업종별 페이지 데이터 — /business/[slug]
export type Business = {
  slug: string;
  title: string;
  seoDescription: string;
  summary: string;
  body?: string;
};

export const businesses: Business[] = [
  {
    slug: "restaurant-drain",
    title: "음식점 하수구막힘",
    seoDescription: "주방 기름·음식물로 막힌 음식점 하수구. 영업 전·후 시간대를 조율해 고압세척·내시경으로 처리합니다.",
    summary: "주방 기름과 음식물 적체로 바닥 배수가 역류하는 경우가 많습니다. 영업 시간을 조율해 처리합니다.",
    body: "음식점은 점심·저녁 영업이 집중되며 주방 바닥 배수와 그리스트랩 이후 오수관에 기름이 빠르게 쌓입니다. 고압세척으로 관 내벽을 씻어내고, 재발이 잦으면 내시경으로 적체 구간을 확인해 정기 관리 주기를 안내합니다. 영업에 지장이 없도록 영업 전·마감 후 시간대를 조율하며, 긴급 역류는 영업 중에도 최소 범위로 우선 처리합니다.",
  },
  {
    slug: "cafe-drain",
    title: "카페 배수구막힘",
    seoDescription: "원두 찌꺼기·우유·시럽으로 막힌 카페 배수구를 점검·처리합니다.",
    summary: "원두 찌꺼기와 유지방이 배수 트랩·관에 쌓여 배수가 느려지는 경우가 많습니다.",
  },
  {
    slug: "commercial-building",
    title: "상가 배관공사",
    seoDescription: "여러 업종이 함께 쓰는 상가 공용 배관 막힘·역류를 진단하고 처리합니다.",
    summary: "여러 점포가 공용 배관을 함께 쓰는 상가는 한 곳의 적체가 전체 역류로 번지기 쉽습니다.",
  },
  {
    slug: "apartment",
    title: "아파트 배관공사",
    seoDescription: "세대 내 싱크대·욕실 막힘부터 공용 오수관 역류까지 아파트 배관을 점검·처리합니다.",
    summary: "세대 내 막힘과 공용 배관 문제를 구분해 처리합니다. 노후 단지는 내시경 진단을 권합니다.",
  },
  {
    slug: "villa-house",
    title: "빌라·주택 배관공사",
    seoDescription: "빌라·단독·다세대 주택의 배관 막힘·노후·역류를 점검하고 처리합니다.",
    summary: "오래된 빌라·주택은 관 노후와 구배 문제로 막힘이 반복되는 경우가 많습니다.",
  },
  {
    slug: "factory",
    title: "공장·창고 배관공사",
    seoDescription: "공장·창고의 대형 배관, 오·폐수 라인 막힘과 적체를 점검하고 처리합니다.",
    summary: "공정 특성에 따라 적체 물질이 다르므로 현장 확인 후 장비와 작업 방식을 정합니다.",
  },
  {
    slug: "office-building",
    title: "오피스·빌딩 배관관리",
    seoDescription: "사무실·빌딩 화장실·탕비실 배수 지연과 공용 배관 관리를 점검·처리합니다.",
    summary: "이용 인원이 많은 화장실·탕비실 배수 지연과 공용 배관 관리를 점검합니다.",
  },
];

export function getBusiness(slug: string): Business | undefined {
  return businesses.find((b) => b.slug === slug);
}
