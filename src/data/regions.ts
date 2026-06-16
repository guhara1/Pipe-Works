// 전국 지역 트리 — /area/[...path] 를 구동한다.
//
// 설계 원칙(스펙 11·14):
//  - "전국 구조"는 만들되 index는 가치 있는 페이지부터 연다.
//  - 시·도 허브 → 시·군·구 핵심 → 실제 사례 있는 읍·면·동 순으로 확장.
//  - 콘텐츠(content)가 없는 읍·면·동·시·군·구는 기본 noindex(placeholder).
//  - 1동·2동은 대표명으로 통합(역삼1동+역삼2동 → 역삼동).
//
// 새 지역을 추가하려면 이 트리에 노드를 추가하면 된다(페이지·사이트맵 자동 반영).

import type { Faq } from "./services";

export type RegionLevel = "sido" | "sigungu" | "gu" | "eupmyeondong";

export type AreaContent = {
  intro?: string; // 지역 특성
  symptoms?: string; // 자주 발생하는 증상
  serviceScope?: string; // 서비스 범위 / 가능 동네
  method?: string; // 작업 방식
  cost?: string; // 비용 기준
  checklist?: string; // 출동 전 확인사항
  caseStudy?: string; // 실제 사례
  nearby?: string[]; // 인접 지역 안내(텍스트)
  faq?: Faq[];
};

export type RegionNode = {
  slug: string;
  name: string; // 정식 표기 (예: 서울특별시 / 강남구 / 역삼동)
  shortName?: string; // 짧은 표기 (예: 서울)
  level: RegionLevel;
  // 명시하지 않으면: sido=true, 그 외=content 유무로 결정
  indexable?: boolean;
  content?: AreaContent;
  children?: RegionNode[];
};

// ---- 빌더 헬퍼 ---------------------------------------------------------

// 시·군·구/구 단위 (구조 placeholder)
function d(name: string, slug: string, children?: RegionNode[], content?: AreaContent): RegionNode {
  return { slug, name, level: children && children.length ? "sigungu" : "sigungu", children, content };
}
// 읍·면·동 단위
function emd(name: string, slug: string, content?: AreaContent, indexable?: boolean): RegionNode {
  return { slug, name, level: "eupmyeondong", content, indexable };
}

// ---- 샘플 상세 콘텐츠(고유 본문) ---------------------------------------

const seoulContent: AreaContent = {
  intro:
    "서울은 노후 아파트 단지와 신축, 단독·다세대주택, 그리고 음식점·상가가 밀집한 상권이 한 동네 안에 섞여 있습니다. 그래서 같은 '하수구막힘'이라도 강남·서초 같은 상권은 음식점 기름 적체가, 도심 노후 주거지는 관 노후·역류가, 신축 단지는 시공 직후 이물질이 주된 원인으로 갈립니다.",
  symptoms:
    "상권에서는 주방 바닥 배수와 그리스트랩 적체, 주거지에서는 싱크대·욕실 배수 지연과 공용 오수관 역류가 자주 접수됩니다. 오래된 건물은 관 처짐·연결부 누수까지 겹치는 경우가 많습니다.",
  serviceScope:
    "서울 25개 자치구 전역에서 상담·출동이 가능합니다. 자치구별 상권·주거 특성이 달라 구 페이지에서 더 구체적인 안내를 제공합니다.",
  method:
    "증상과 현장 사진으로 막힘 위치를 먼저 추정하고, 국소 막힘은 스프링, 기름·슬러지 적체는 고압세척, 원인 불명·재발은 배관내시경으로 확인 후 작업합니다.",
  cost: "막힘 위치·배관 길이·노후도·장비·야간/주말·영업장 여부에 따라 달라지며 작업 전 기준을 안내합니다.",
  caseStudy:
    "강남구 음식점 주방 바닥 배수 역류 건은 그리스트랩 이후 오수관 기름 적체가 원인이었고, 고압세척 후 내시경으로 잔여 적체를 확인해 마무리했습니다.",
  faq: [
    { q: "서울 전 지역 출동이 가능한가요?", a: "서울 25개 자치구 전역 상담·출동이 가능합니다. 시간대와 현장 조건에 따라 도착 시간이 달라질 수 있어 통화 시 안내드립니다." },
    { q: "야간에도 출동하나요?", a: "야간·주말·공휴일 긴급출동이 가능합니다. 시간대에 따라 비용 기준이 달라지는 점은 작업 전에 안내합니다." },
  ],
};

const gangnamContent: AreaContent = {
  intro:
    "강남구는 역삼·삼성·논현 일대 음식점·카페 상권과 대형 오피스, 그리고 도곡·대치의 주거 단지가 함께 있는 지역입니다. 상권은 주방 기름 적체로 인한 바닥 배수 역류가, 주거 단지는 세대 내 싱크대·욕실 막힘과 공용 배관 역류가 주로 접수됩니다.",
  symptoms:
    "음식점 영업장에서는 주방 바닥 배수가 느려지고 그리스트랩 주변이 역류하는 증상, 오피스·상가는 화장실 배수 지연, 주거지는 싱크대 기름막힘과 욕실 배수 지연이 자주 발생합니다.",
  serviceScope:
    "역삼동·삼성동·논현동·대치동·도곡동·청담동·신사동·압구정동 등 강남구 전역에서 상담·출동이 가능합니다. 영업장은 영업 전·후 시간대 작업도 조율합니다.",
  method:
    "영업장은 영업에 지장이 없도록 시간대를 조율하고, 주방 기름 적체는 고압세척, 세대 내 국소 막힘은 스프링으로 처리합니다. 재발이 잦은 음식점은 내시경으로 적체 구간을 확인한 뒤 정기 관리 기준을 안내합니다.",
  cost:
    "강남구는 상가·음식점 영업장 작업 비중이 높아 그리스트랩 이후 오수관 길이와 기름 적체 정도가 비용에 영향을 줍니다. 작업 전 기준과 추가 작업 가능성을 함께 안내합니다.",
  checklist:
    "영업장은 작업 가능 시간대(영업 전/마감 후)와 차량 접근·주차 가능 여부, 그리스트랩 위치를 미리 확인해 주시면 출동이 빨라집니다.",
  caseStudy:
    "역삼동 고깃집 주방 바닥 배수 역류 건(사례 001)은 그리스트랩 이후 오수관에 기름이 굳어 흐름을 막은 경우로, 고압세척 후 내시경으로 잔여 적체를 확인하고 재발 방지 관리 주기를 안내했습니다.",
  nearby: ["서초구", "송파구", "용산구"],
  faq: [
    { q: "강남구 음식점은 영업 시간에 작업이 가능한가요?", a: "가능하면 영업 전이나 마감 후로 시간을 조율해 영업에 지장이 없도록 진행합니다. 긴급 상황은 영업 중에도 최소 범위로 우선 처리합니다." },
    { q: "주방 바닥이 자꾸 역류하는데 매번 같은 작업인가요?", a: "기름 적체가 원인이면 고압세척이 효과적이지만, 반복되면 내시경으로 적체 구간을 확인해 관리 주기를 정하는 편이 비용상 유리합니다." },
    { q: "강남구 어느 동까지 출동하나요?", a: "역삼·삼성·논현·대치·도곡·청담·신사·압구정 등 강남구 전역에 출동합니다." },
  ],
};

const yeoksamContent: AreaContent = {
  intro:
    "역삼동은 테헤란로 주변 오피스와 강남역 일대 음식점·카페가 밀집한 대표 상권입니다. 점심·저녁 영업이 집중되는 주방에서 기름과 음식물이 빠르게 쌓여 바닥 배수와 그리스트랩 이후 오수관 막힘이 자주 발생합니다. (역삼1동·역삼2동을 역삼동으로 통합 안내합니다.)",
  symptoms:
    "영업장 주방 바닥 배수 지연·역류, 그리스트랩 주변 악취, 오피스 화장실 배수 지연이 대표적입니다. 주거 구역에서는 싱크대 기름막힘이 함께 접수됩니다.",
  serviceScope:
    "역삼동 전역(강남역·테헤란로 상권 포함) 상담·출동이 가능하며, 음식점은 영업 전/마감 후 시간대 작업을 조율합니다.",
  method:
    "주방 기름 적체는 고압세척으로 관 내벽을 씻어내고, 그리스트랩 이후 오수관 적체는 내시경으로 위치를 확인한 뒤 처리합니다. 작업 후 배수 테스트로 흐름을 확인합니다.",
  cost: "오수관 길이와 기름 적체 정도, 영업장 시간대(영업 전·심야)에 따라 달라지며 작업 전에 기준을 안내합니다.",
  checklist: "영업 가능 시간대와 그리스트랩 위치, 차량 접근·주차 가능 여부를 미리 알려주시면 출동이 빨라집니다.",
  caseStudy:
    "역삼동 음식점 주방 바닥 배수 역류(사례 001): 그리스트랩 이후 오수관에 기름이 굳어 흐름을 막은 사례. 고압세척 후 내시경으로 잔여 적체를 확인하고 마무리, 재발 방지를 위한 정기 세척 주기를 안내했습니다.",
  nearby: ["삼성동", "논현동", "서초동"],
  faq: [
    { q: "역삼동 음식점인데 영업 중에도 와주나요?", a: "긴급 역류는 영업 중에도 최소 범위로 우선 처리하고, 본 작업은 가능하면 마감 후로 조율합니다." },
    { q: "고압세척을 하면 한동안 안 막히나요?", a: "기름 적체를 씻어내면 흐름은 회복되지만, 영업량이 많은 주방은 다시 쌓이므로 정기 세척 주기를 안내해 재발을 줄입니다." },
  ],
};

// ---- 전국 트리 --------------------------------------------------------

export const regions: RegionNode[] = [
  {
    slug: "seoul",
    name: "서울특별시",
    shortName: "서울",
    level: "sido",
    content: seoulContent,
    children: [
      d("종로구", "jongno-gu"),
      d("중구", "jung-gu"),
      d("용산구", "yongsan-gu"),
      d("성동구", "seongdong-gu"),
      d("광진구", "gwangjin-gu"),
      d("동대문구", "dongdaemun-gu"),
      d("중랑구", "jungnang-gu"),
      d("성북구", "seongbuk-gu"),
      d("강북구", "gangbuk-gu"),
      d("도봉구", "dobong-gu"),
      d("노원구", "nowon-gu"),
      d("은평구", "eunpyeong-gu"),
      d("서대문구", "seodaemun-gu"),
      d("마포구", "mapo-gu"),
      d("양천구", "yangcheon-gu"),
      d("강서구", "gangseo-gu"),
      d("구로구", "guro-gu"),
      d("금천구", "geumcheon-gu"),
      d("영등포구", "yeongdeungpo-gu"),
      d("동작구", "dongjak-gu"),
      d("관악구", "gwanak-gu"),
      d("서초구", "seocho-gu"),
      // 강남구 — 샘플 상세(시·군·구) + 읍·면·동 샘플(역삼동)
      {
        slug: "gangnam-gu",
        name: "강남구",
        level: "sigungu",
        content: gangnamContent,
        children: [
          emd("역삼동", "yeoksam-dong", yeoksamContent, true),
          emd("삼성동", "samseong-dong"),
          emd("논현동", "nonhyeon-dong"),
          emd("대치동", "daechi-dong"),
          emd("도곡동", "dogok-dong"),
          emd("청담동", "cheongdam-dong"),
          emd("신사동", "sinsa-dong"),
          emd("압구정동", "apgujeong-dong"),
        ],
      },
      d("송파구", "songpa-gu"),
      d("강동구", "gangdong-gu"),
    ],
  },
  {
    slug: "busan",
    name: "부산광역시",
    shortName: "부산",
    level: "sido",
    children: [
      d("중구", "jung-gu"),
      d("서구", "seo-gu"),
      d("동구", "dong-gu"),
      d("영도구", "yeongdo-gu"),
      d("부산진구", "busanjin-gu"),
      d("동래구", "dongnae-gu"),
      d("남구", "nam-gu"),
      d("북구", "buk-gu"),
      d("해운대구", "haeundae-gu"),
      d("사하구", "saha-gu"),
      d("금정구", "geumjeong-gu"),
      d("강서구", "gangseo-gu"),
      d("연제구", "yeonje-gu"),
      d("수영구", "suyeong-gu"),
      d("사상구", "sasang-gu"),
      d("기장군", "gijang-gun"),
    ],
  },
  {
    slug: "daegu",
    name: "대구광역시",
    shortName: "대구",
    level: "sido",
    children: [
      d("중구", "jung-gu"),
      d("동구", "dong-gu"),
      d("서구", "seo-gu"),
      d("남구", "nam-gu"),
      d("북구", "buk-gu"),
      d("수성구", "suseong-gu"),
      d("달서구", "dalseo-gu"),
      d("달성군", "dalseong-gun"),
      d("군위군", "gunwi-gun"),
    ],
  },
  {
    slug: "incheon",
    name: "인천광역시",
    shortName: "인천",
    level: "sido",
    children: [
      d("중구", "jung-gu"),
      d("동구", "dong-gu"),
      d("미추홀구", "michuhol-gu"),
      d("연수구", "yeonsu-gu"),
      d("남동구", "namdong-gu"),
      d("부평구", "bupyeong-gu"),
      d("계양구", "gyeyang-gu"),
      d("서구", "seo-gu"),
      d("강화군", "ganghwa-gun"),
      d("옹진군", "ongjin-gun"),
    ],
  },
  {
    slug: "gwangju",
    name: "광주광역시",
    shortName: "광주",
    level: "sido",
    children: [
      d("동구", "dong-gu"),
      d("서구", "seo-gu"),
      d("남구", "nam-gu"),
      d("북구", "buk-gu"),
      d("광산구", "gwangsan-gu"),
    ],
  },
  {
    slug: "daejeon",
    name: "대전광역시",
    shortName: "대전",
    level: "sido",
    children: [
      d("동구", "dong-gu"),
      d("중구", "jung-gu"),
      d("서구", "seo-gu"),
      d("유성구", "yuseong-gu"),
      d("대덕구", "daedeok-gu"),
    ],
  },
  {
    slug: "ulsan",
    name: "울산광역시",
    shortName: "울산",
    level: "sido",
    children: [
      d("중구", "jung-gu"),
      d("남구", "nam-gu"),
      d("동구", "dong-gu"),
      d("북구", "buk-gu"),
      d("울주군", "ulju-gun"),
    ],
  },
  {
    slug: "sejong",
    name: "세종특별자치시",
    shortName: "세종",
    level: "sido",
    // 세종은 시·군·구가 없고 읍·면·동 직속
    children: [
      emd("조치원읍", "jochiwon-eup"),
      emd("연기면", "yeongi-myeon"),
      emd("연동면", "yeondong-myeon"),
      emd("부강면", "bugang-myeon"),
      emd("금남면", "geumnam-myeon"),
      emd("장군면", "janggun-myeon"),
      emd("연서면", "yeonseo-myeon"),
      emd("전의면", "jeonui-myeon"),
      emd("전동면", "jeondong-myeon"),
      emd("소정면", "sojeong-myeon"),
      emd("한솔동", "hansol-dong"),
      emd("새롬동", "saerom-dong"),
      emd("도담동", "dodam-dong"),
      emd("아름동", "areum-dong"),
      emd("종촌동", "jongchon-dong"),
      emd("고운동", "goun-dong"),
      emd("보람동", "boram-dong"),
      emd("대평동", "daepyeong-dong"),
      emd("소담동", "sodam-dong"),
      emd("반곡동", "bangok-dong"),
      emd("해밀동", "haemil-dong"),
      emd("다정동", "dajeong-dong"),
      emd("나성동", "naseong-dong"),
      emd("어진동", "eojin-dong"),
    ],
  },
  {
    slug: "gyeonggi",
    name: "경기도",
    shortName: "경기",
    level: "sido",
    children: [
      // 행정구가 있는 시 (구를 children으로)
      {
        slug: "suwon-si",
        name: "수원시",
        level: "sigungu",
        children: [
          { slug: "jangan-gu", name: "장안구", level: "gu" },
          { slug: "gwonseon-gu", name: "권선구", level: "gu" },
          { slug: "paldal-gu", name: "팔달구", level: "gu" },
          {
            slug: "yeongtong-gu",
            name: "영통구",
            level: "gu",
            children: [emd("매탄동", "maetan-dong")],
          },
        ],
      },
      {
        slug: "seongnam-si",
        name: "성남시",
        level: "sigungu",
        children: [
          { slug: "sujeong-gu", name: "수정구", level: "gu" },
          { slug: "jungwon-gu", name: "중원구", level: "gu" },
          { slug: "bundang-gu", name: "분당구", level: "gu" },
        ],
      },
      {
        slug: "goyang-si",
        name: "고양시",
        level: "sigungu",
        children: [
          { slug: "deogyang-gu", name: "덕양구", level: "gu" },
          { slug: "ilsandong-gu", name: "일산동구", level: "gu" },
          { slug: "ilsanseo-gu", name: "일산서구", level: "gu" },
        ],
      },
      {
        slug: "yongin-si",
        name: "용인시",
        level: "sigungu",
        children: [
          { slug: "cheoin-gu", name: "처인구", level: "gu" },
          { slug: "giheung-gu", name: "기흥구", level: "gu" },
          { slug: "suji-gu", name: "수지구", level: "gu" },
        ],
      },
      {
        slug: "anyang-si",
        name: "안양시",
        level: "sigungu",
        children: [
          { slug: "manan-gu", name: "만안구", level: "gu" },
          { slug: "dongan-gu", name: "동안구", level: "gu" },
        ],
      },
      {
        slug: "ansan-si",
        name: "안산시",
        level: "sigungu",
        children: [
          { slug: "sangnok-gu", name: "상록구", level: "gu" },
          { slug: "danwon-gu", name: "단원구", level: "gu" },
        ],
      },
      // 단일 시·군
      d("부천시", "bucheon-si"),
      d("남양주시", "namyangju-si"),
      d("화성시", "hwaseong-si"),
      d("평택시", "pyeongtaek-si"),
      d("의정부시", "uijeongbu-si"),
      d("시흥시", "siheung-si"),
      d("파주시", "paju-si"),
      d("김포시", "gimpo-si"),
      d("광명시", "gwangmyeong-si"),
      d("광주시", "gwangju-si"),
      d("군포시", "gunpo-si"),
      d("하남시", "hanam-si"),
      d("오산시", "osan-si"),
      d("이천시", "icheon-si"),
      d("안성시", "anseong-si"),
      d("의왕시", "uiwang-si"),
      d("여주시", "yeoju-si"),
      d("동두천시", "dongducheon-si"),
      d("과천시", "gwacheon-si"),
      d("구리시", "guri-si"),
      d("포천시", "pocheon-si"),
      d("양주시", "yangju-si"),
      // 군 (읍·면 샘플 포함: 양평군)
      {
        slug: "yangpyeong-gun",
        name: "양평군",
        level: "sigungu",
        children: [emd("양평읍", "yangpyeong-eup"), emd("용문면", "yongmun-myeon")],
      },
      d("연천군", "yeoncheon-gun"),
      d("가평군", "gapyeong-gun"),
    ],
  },
  {
    slug: "gangwon",
    name: "강원특별자치도",
    shortName: "강원",
    level: "sido",
    children: [
      d("춘천시", "chuncheon-si"),
      d("원주시", "wonju-si"),
      d("강릉시", "gangneung-si"),
      d("동해시", "donghae-si"),
      d("태백시", "taebaek-si"),
      d("속초시", "sokcho-si"),
      d("삼척시", "samcheok-si"),
      d("홍천군", "hongcheon-gun"),
      d("횡성군", "hoengseong-gun"),
      d("영월군", "yeongwol-gun"),
      d("평창군", "pyeongchang-gun"),
      d("정선군", "jeongseon-gun"),
      d("철원군", "cheorwon-gun"),
      d("화천군", "hwacheon-gun"),
      d("양구군", "yanggu-gun"),
      d("인제군", "inje-gun"),
      d("고성군", "goseong-gun"),
      d("양양군", "yangyang-gun"),
    ],
  },
  {
    slug: "chungbuk",
    name: "충청북도",
    shortName: "충북",
    level: "sido",
    children: [
      {
        slug: "cheongju-si",
        name: "청주시",
        level: "sigungu",
        children: [
          { slug: "sangdang-gu", name: "상당구", level: "gu" },
          { slug: "seowon-gu", name: "서원구", level: "gu" },
          { slug: "heungdeok-gu", name: "흥덕구", level: "gu" },
          { slug: "cheongwon-gu", name: "청원구", level: "gu" },
        ],
      },
      d("충주시", "chungju-si"),
      d("제천시", "jecheon-si"),
      d("보은군", "boeun-gun"),
      d("옥천군", "okcheon-gun"),
      d("영동군", "yeongdong-gun"),
      d("증평군", "jeungpyeong-gun"),
      d("진천군", "jincheon-gun"),
      d("괴산군", "goesan-gun"),
      d("음성군", "eumseong-gun"),
      d("단양군", "danyang-gun"),
    ],
  },
  {
    slug: "chungnam",
    name: "충청남도",
    shortName: "충남",
    level: "sido",
    children: [
      {
        slug: "cheonan-si",
        name: "천안시",
        level: "sigungu",
        children: [
          { slug: "dongnam-gu", name: "동남구", level: "gu" },
          { slug: "seobuk-gu", name: "서북구", level: "gu" },
        ],
      },
      d("공주시", "gongju-si"),
      d("보령시", "boryeong-si"),
      d("아산시", "asan-si"),
      d("서산시", "seosan-si"),
      d("논산시", "nonsan-si"),
      d("계룡시", "gyeryong-si"),
      d("당진시", "dangjin-si"),
      d("금산군", "geumsan-gun"),
      d("부여군", "buyeo-gun"),
      d("서천군", "seocheon-gun"),
      d("청양군", "cheongyang-gun"),
      d("홍성군", "hongseong-gun"),
      d("예산군", "yesan-gun"),
      d("태안군", "taean-gun"),
    ],
  },
  {
    slug: "jeonbuk",
    name: "전북특별자치도",
    shortName: "전북",
    level: "sido",
    children: [
      {
        slug: "jeonju-si",
        name: "전주시",
        level: "sigungu",
        children: [
          { slug: "wansan-gu", name: "완산구", level: "gu" },
          { slug: "deokjin-gu", name: "덕진구", level: "gu" },
        ],
      },
      d("군산시", "gunsan-si"),
      d("익산시", "iksan-si"),
      d("정읍시", "jeongeup-si"),
      d("남원시", "namwon-si"),
      d("김제시", "gimje-si"),
      d("완주군", "wanju-gun"),
      d("진안군", "jinan-gun"),
      d("무주군", "muju-gun"),
      d("장수군", "jangsu-gun"),
      d("임실군", "imsil-gun"),
      d("순창군", "sunchang-gun"),
      d("고창군", "gochang-gun"),
      d("부안군", "buan-gun"),
    ],
  },
  {
    slug: "jeonnam",
    name: "전라남도",
    shortName: "전남",
    level: "sido",
    children: [
      d("목포시", "mokpo-si"),
      d("여수시", "yeosu-si"),
      d("순천시", "suncheon-si"),
      d("나주시", "naju-si"),
      d("광양시", "gwangyang-si"),
      d("담양군", "damyang-gun"),
      d("곡성군", "gokseong-gun"),
      d("구례군", "gurye-gun"),
      d("고흥군", "goheung-gun"),
      d("보성군", "boseong-gun"),
      d("화순군", "hwasun-gun"),
      d("장흥군", "jangheung-gun"),
      d("강진군", "gangjin-gun"),
      d("해남군", "haenam-gun"),
      d("영암군", "yeongam-gun"),
      d("무안군", "muan-gun"),
      d("함평군", "hampyeong-gun"),
      d("영광군", "yeonggwang-gun"),
      d("장성군", "jangseong-gun"),
      d("완도군", "wando-gun"),
      d("진도군", "jindo-gun"),
      d("신안군", "sinan-gun"),
    ],
  },
  {
    slug: "gyeongbuk",
    name: "경상북도",
    shortName: "경북",
    level: "sido",
    children: [
      {
        slug: "pohang-si",
        name: "포항시",
        level: "sigungu",
        children: [
          { slug: "nam-gu", name: "남구", level: "gu" },
          { slug: "buk-gu", name: "북구", level: "gu" },
        ],
      },
      d("경주시", "gyeongju-si"),
      d("김천시", "gimcheon-si"),
      d("안동시", "andong-si"),
      d("구미시", "gumi-si"),
      d("영주시", "yeongju-si"),
      d("영천시", "yeongcheon-si"),
      d("상주시", "sangju-si"),
      d("문경시", "mungyeong-si"),
      d("경산시", "gyeongsan-si"),
      d("의성군", "uiseong-gun"),
      d("청송군", "cheongsong-gun"),
      d("영양군", "yeongyang-gun"),
      d("영덕군", "yeongdeok-gun"),
      d("청도군", "cheongdo-gun"),
      d("고령군", "goryeong-gun"),
      d("성주군", "seongju-gun"),
      d("칠곡군", "chilgok-gun"),
      d("예천군", "yecheon-gun"),
      d("봉화군", "bonghwa-gun"),
      d("울진군", "uljin-gun"),
      d("울릉군", "ulleung-gun"),
    ],
  },
  {
    slug: "gyeongnam",
    name: "경상남도",
    shortName: "경남",
    level: "sido",
    children: [
      {
        slug: "changwon-si",
        name: "창원시",
        level: "sigungu",
        children: [
          { slug: "uichang-gu", name: "의창구", level: "gu" },
          { slug: "seongsan-gu", name: "성산구", level: "gu" },
          { slug: "masanhappo-gu", name: "마산합포구", level: "gu" },
          { slug: "masanhoewon-gu", name: "마산회원구", level: "gu" },
          { slug: "jinhae-gu", name: "진해구", level: "gu" },
        ],
      },
      d("진주시", "jinju-si"),
      d("통영시", "tongyeong-si"),
      d("사천시", "sacheon-si"),
      d("김해시", "gimhae-si"),
      d("밀양시", "miryang-si"),
      d("거제시", "geoje-si"),
      d("양산시", "yangsan-si"),
      d("의령군", "uiryeong-gun"),
      d("함안군", "haman-gun"),
      d("창녕군", "changnyeong-gun"),
      d("고성군", "goseong-gun"),
      d("남해군", "namhae-gun"),
      d("하동군", "hadong-gun"),
      d("산청군", "sancheong-gun"),
      d("함양군", "hamyang-gun"),
      d("거창군", "geochang-gun"),
      d("합천군", "hapcheon-gun"),
    ],
  },
  {
    slug: "jeju",
    name: "제주특별자치도",
    shortName: "제주",
    level: "sido",
    children: [
      {
        slug: "jeju-si",
        name: "제주시",
        level: "sigungu",
        children: [
          emd("애월읍", "aewol-eup"),
          emd("한림읍", "hallim-eup"),
          emd("조천읍", "jocheon-eup"),
          emd("구좌읍", "gujwa-eup"),
          emd("한경면", "hangyeong-myeon"),
          emd("추자면", "chuja-myeon"),
          emd("우도면", "udo-myeon"),
          emd("이도동", "ido-dong"),
          emd("연동", "yeon-dong"),
          emd("노형동", "nohyeong-dong"),
        ],
      },
      {
        slug: "seogwipo-si",
        name: "서귀포시",
        level: "sigungu",
        children: [
          emd("대정읍", "daejeong-eup"),
          emd("남원읍", "namwon-eup"),
          emd("성산읍", "seongsan-eup"),
          emd("안덕면", "andeok-myeon"),
          emd("표선면", "pyoseon-myeon"),
          emd("중문동", "jungmun-dong"),
          emd("동홍동", "donghong-dong"),
          emd("서홍동", "seohong-dong"),
        ],
      },
    ],
  },
];

// ---- 트리 탐색 유틸 ----------------------------------------------------

export function findByPath(path: string[]): RegionNode | undefined {
  let nodes: RegionNode[] | undefined = regions;
  let node: RegionNode | undefined;
  for (const slug of path) {
    node = nodes?.find((n) => n.slug === slug);
    if (!node) return undefined;
    nodes = node.children;
  }
  return node;
}

// 경로상의 모든 조상 노드(자신 포함) — 브레드크럼용
export function ancestorsOfPath(path: string[]): RegionNode[] {
  const result: RegionNode[] = [];
  let nodes: RegionNode[] | undefined = regions;
  for (const slug of path) {
    const node: RegionNode | undefined = nodes?.find((n) => n.slug === slug);
    if (!node) break;
    result.push(node);
    nodes = node.children;
  }
  return result;
}

// 모든 경로(catch-all generateStaticParams 용)
export function allRegionPaths(): string[][] {
  const out: string[][] = [];
  const walk = (nodes: RegionNode[], prefix: string[]) => {
    for (const n of nodes) {
      const p = [...prefix, n.slug];
      out.push(p);
      if (n.children) walk(n.children, p);
    }
  };
  walk(regions, []);
  return out;
}

// 색인 가능 여부: 명시값 > sido는 기본 true > 그 외는 content 유무
export function isIndexable(node: RegionNode): boolean {
  if (typeof node.indexable === "boolean") return node.indexable;
  if (node.level === "sido") return true;
  return !!node.content;
}

export const sidoList = regions;
