// 현장 사례 데이터 — /case 와 메인 최신 사례에 사용.
// 실제 작업 기록만 등록한다(가짜 사례/후기 금지, 개인정보·주소 노출 제거).

export type CaseStudy = {
  slug: string;
  title: string;
  category: "drain-clog" | "kitchen-sink" | "toilet" | "high-pressure-cleaning" | "pipe-camera" | "sewer-line";
  categoryLabel: string;
  regionName: string; // 표기용 지역명 (정확한 주소·동·호수 노출 금지)
  regionPath?: string[]; // 연결할 지역 페이지 경로
  symptom: string;
  cause: string;
  equipment: string[];
  result: string;
  prevention: string;
  date: string; // YYYY-MM
  // 이미지 alt/파일명만 관리 (실제 파일은 /public/images/case 에 배치)
  images?: { src: string; alt: string }[];
};

export const cases: CaseStudy[] = [
  {
    slug: "seoul-gangnam-gu-restaurant-drain-clog-001",
    title: "강남구 음식점 주방 바닥 배수 역류 처리",
    category: "high-pressure-cleaning",
    categoryLabel: "음식점 고압세척",
    regionName: "서울 강남구 역삼동",
    regionPath: ["seoul", "gangnam-gu", "yeoksam-dong"],
    symptom: "점심 영업 중 주방 바닥 배수가 역류하고 그리스트랩 주변에서 악취가 올라옴",
    cause: "그리스트랩 이후 오수관 구간에 기름이 굳어 관 내경이 좁아지며 흐름을 막음",
    equipment: ["고압세척 장비", "배관내시경"],
    result: "고압세척으로 관 내벽 기름 적체를 제거하고, 내시경으로 잔여 적체 없음을 확인 후 배수 테스트 완료",
    prevention: "영업량을 고려해 정기 고압세척 주기(권장 분기 1회)를 안내, 그리스트랩 청소 주기 함께 점검",
    date: "2026-05",
    images: [
      { src: "/images/case/restaurant-drain-cleaning-case.svg", alt: "음식점 주방 배관 고압세척 작업 기록" },
    ],
  },
  {
    slug: "seoul-apartment-bathroom-drain-001",
    title: "아파트 욕실 배수구 지연·악취 처리",
    category: "drain-clog",
    categoryLabel: "하수구막힘",
    regionName: "서울",
    symptom: "욕실 바닥 배수가 느려지고 배수구에서 냄새가 올라옴",
    cause: "배수 트랩에 머리카락·비누때가 엉켜 배수가 지연되고 봉수가 약해져 악취 발생",
    equipment: ["스프링 장비"],
    result: "트랩 점검 후 스프링 장비로 엉킨 이물질 제거, 봉수 확인 및 배수 테스트 완료",
    prevention: "배수구 거름망 사용과 주기적 트랩 청소 안내",
    date: "2026-04",
    images: [
      { src: "/images/case/apartment-bathroom-drain-case.svg", alt: "아파트 욕실 배수구 점검 작업 기록" },
    ],
  },
];

export const caseCategories: { slug: CaseStudy["category"]; label: string }[] = [
  { slug: "drain-clog", label: "하수구막힘 사례" },
  { slug: "kitchen-sink", label: "싱크대막힘 사례" },
  { slug: "toilet", label: "변기막힘 사례" },
  { slug: "high-pressure-cleaning", label: "고압세척 사례" },
  { slug: "pipe-camera", label: "배관내시경 사례" },
  { slug: "sewer-line", label: "오수관 역류 사례" },
];

export function getCase(slug: string): CaseStudy | undefined {
  return cases.find((c) => c.slug === slug);
}
