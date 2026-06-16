// 사이트 전역 설정 — 상호/연락처/도메인 등 단일 출처
export const site = {
  name: "스피드 배관공사",
  shortName: "스피드 배관공사",
  // 실제 배포 도메인으로 교체하세요.
  url: "https://www.speed-pipe.co.kr",
  // 실제 대표 전화번호로 교체하세요. (조작된 지점별 번호 금지 — 가이드라인 준수)
  phone: "1500-0000",
  phoneHref: "tel:1500-0000",
  hours: "연중무휴 08:00 ~ 22:00 (야간·심야 별도 출동)",
  emergency: "24시간 긴급출동 (야간·주말·공휴일)",
  // 실제 사업장 주소가 있을 때만 정확히 기입 (없는 지점 마크업 금지)
  address: {
    region: "대한민국",
    description: "전국 주요 지역 출동",
  },
  description:
    "싱크대막힘, 변기막힘, 욕실 배수구, 오수관 역류, 배관내시경, 고압세척까지 전국 주요 지역에서 상담 가능한 스피드 배관공사입니다.",
  // 대표 이미지 (og + schema 공통 사용)
  ogImage: "/images/og/speed-pipe-main-service.svg",
  social: {} as Record<string, string>,
};

export type Site = typeof site;
