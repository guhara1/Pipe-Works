import Link from "next/link";
import { site } from "@/data/site";
import { services, featuredServiceSlugs, getService } from "@/data/services";
import { sidoList } from "@/data/regions";
import { cases } from "@/data/cases";
import JsonLd from "@/components/JsonLd";
import FaqList from "@/components/FaqList";
import { plumberJsonLd, faqJsonLd } from "@/lib/seo";

const symptomCards = [
  { icon: "💧", label: "물이 안 내려가요", href: "/service/drain-clog/" },
  { icon: "👃", label: "하수구 냄새가 올라와요", href: "/service/odor-diagnosis/" },
  { icon: "🔁", label: "싱크대가 역류해요", href: "/service/kitchen-sink-clog/" },
  { icon: "🚽", label: "변기가 자주 막혀요", href: "/service/toilet-clog/" },
  { icon: "🚿", label: "욕실 배수구가 느려요", href: "/service/bathroom-drain-clog/" },
  { icon: "🍳", label: "음식점 바닥 배수가 막혔어요", href: "/business/restaurant-drain/" },
  { icon: "📷", label: "배관 위치를 확인하고 싶어요", href: "/service/pipe-camera-inspection/" },
  { icon: "🚰", label: "고압세척이 필요한지 궁금해요", href: "/service/high-pressure-cleaning/" },
];

const processSteps = [
  "증상 확인",
  "사진 또는 현장 확인",
  "막힘 위치 추정",
  "장비 선택",
  "작업 전 비용 안내",
  "작업 진행",
  "배수 테스트",
  "재발 방지 안내",
];

const equipment = [
  { name: "배관내시경", desc: "막힘 위치·원인·배관 상태를 직접 확인할 때 사용합니다." },
  { name: "스프링 장비", desc: "국소 막힘·머리카락 엉킴 등 표면 가까운 막힘에 사용합니다." },
  { name: "석션 장비", desc: "고인 물·이물질을 빨아들여 작업 환경을 확보합니다." },
  { name: "고압세척 장비", desc: "기름·슬러지가 관 전체에 낀 경우 내벽을 씻어냅니다." },
  { name: "악취 진단 장비", desc: "냄새의 발생 위치와 원인을 진단할 때 사용합니다." },
  { name: "배관 교체 공구", desc: "노후·파손 구간 보수·교체 시 사용합니다." },
];

const costFactors = [
  "막힘 위치",
  "배관 길이",
  "배관 노후도",
  "장비 사용 여부",
  "야간·주말 출동 여부",
  "배관 교체 필요 여부",
  "상가·음식점 영업장 여부",
];

const mainFaqs = [
  { q: "하수구막힘은 셀프로 뚫어도 되나요?", a: "표면 가까운 가벼운 막힘은 효과가 있을 수 있지만, 화학 세정제 반복 사용은 배관을 상하게 할 수 있습니다. 여러 배수구가 동시에 느리면 공용 배관 문제이므로 위치 확인 후 장비 작업을 권합니다." },
  { q: "싱크대가 자주 막히는 이유는 무엇인가요?", a: "기름과 음식물 찌꺼기가 관 내벽에 굳어 점점 좁아지기 때문입니다. 거름망 사용과 정기 세척으로 재발을 줄일 수 있습니다." },
  { q: "배관내시경은 언제 필요한가요?", a: "막힘이 반복되거나 원인·위치가 불확실할 때, 또는 배관 노후·파손 여부를 확인해야 할 때 사용합니다." },
  { q: "고압세척은 모든 현장에 필요한가요?", a: "아닙니다. 기름·슬러지가 관 전체에 낀 경우에 효과적이며, 국소 막힘은 스프링 장비로 충분한 경우가 많습니다." },
  { q: "야간 출동 비용은 어떻게 달라지나요?", a: "야간·주말·공휴일은 출동 기준이 달라질 수 있습니다. 통화 시와 작업 전에 기준을 안내드립니다." },
  { q: "오래된 아파트도 작업 가능한가요?", a: "가능합니다. 노후 정도와 배관 구조를 내시경으로 확인한 뒤 안전한 방식으로 작업합니다." },
];

export default function Home() {
  const featured = featuredServiceSlugs.map(getService).filter(Boolean);
  const latestCases = cases.slice(0, 9);

  return (
    <>
      <JsonLd data={[plumberJsonLd(), faqJsonLd(mainFaqs)]} />

      {/* 1) 히어로 */}
      <section className="hero">
        <div className="container">
          <span className="eyebrow">전국 출동 · 24시간 긴급</span>
          <h1>전국 하수구막힘·배관공사 긴급출동, {site.name}</h1>
          <p className="lead">
            싱크대, 변기, 욕실 배수구, 오수관, 상가 배관, 음식점 하수구까지 — 증상과 현장 조건을 확인한 뒤 필요한 장비로 처리합니다.
          </p>
          <div className="hero__actions">
            <a className="btn btn--cta" href={site.phoneHref}>
              📞 전화 상담 {site.phone}
            </a>
            <Link className="btn btn--ghost" href="/contact/">
              📷 사진 보내기
            </Link>
            <Link className="btn btn--ghost" href="/price/">
              💰 비용 기준 보기
            </Link>
            <Link className="btn btn--ghost" href="/area/">
              📍 내 지역 찾기
            </Link>
          </div>
          <div className="hero__badges">
            <span className="badge">✔ 작업 전 비용 안내</span>
            <span className="badge">✔ 작업 후 배수 테스트</span>
            <span className="badge">✔ 실제 출동 가능 지역 운영</span>
          </div>
        </div>
      </section>

      {/* 2) 긴급 증상 선택 */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">긴급 증상</span>
          <h2 className="section-title">지금 어떤 상황인가요?</h2>
          <p className="section-sub">증상을 고르면 원인과 작업 방식, 비용 기준을 안내합니다.</p>
          <div className="grid grid--4">
            {symptomCards.map((c) => (
              <Link key={c.label} href={c.href} className="card">
                <h3>
                  <span aria-hidden style={{ marginRight: 8 }}>
                    {c.icon}
                  </span>
                  {c.label}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3) 대표 서비스 */}
      <section className="section" style={{ background: "var(--surface-charcoal-blue)" }}>
        <div className="container">
          <span className="eyebrow">대표 서비스</span>
          <h2 className="section-title">증상과 현장에 맞춰 처리합니다</h2>
          <p className="section-sub">무조건 같은 장비를 쓰지 않고, 막힘 위치와 원인을 확인한 뒤 필요한 방식을 선택합니다.</p>
          <div className="grid grid--4">
            {featured.map((s) => (
              <Link key={s!.slug} href={`/service/${s!.slug}/`} className="card">
                <h3>{s!.title}</h3>
                <p>{s!.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4) 전국 지역 찾기 */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">전국 지역 찾기</span>
          <h2 className="section-title">내 지역 배관공사 찾기</h2>
          <p className="section-sub">시·도를 선택하면 시·군·구로 이동합니다. 실제 출동 가능 지역을 중심으로 안내합니다.</p>
          <div className="glass area-search">
            <input
              type="search"
              placeholder="지역명 입력: 강남구, 수원시, 역삼동, 양평읍"
              aria-label="지역 검색"
            />
            <div className="chips" style={{ marginTop: 16 }}>
              {sidoList.map((s) => (
                <Link key={s.slug} href={`/area/${s.slug}/`} className="chip">
                  {s.shortName}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5) 작업 과정 */}
      <section className="section" style={{ background: "var(--surface-charcoal-blue)" }}>
        <div className="container">
          <span className="eyebrow">작업 과정</span>
          <h2 className="section-title">이렇게 진행합니다</h2>
          <div className="grid grid--2">
            {processSteps.map((label, i) => (
              <div key={label} className="step">
                <span className="step__num">{i + 1}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6) 장비 소개 */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">장비 소개</span>
          <h2 className="section-title">상황에 맞는 장비를 사용합니다</h2>
          <p className="section-sub">장비를 과장하지 않고, 어떤 상황에서 필요한지 설명합니다.</p>
          <div className="grid grid--3">
            {equipment.map((e) => (
              <div key={e.name} className="card">
                <h3>{e.name}</h3>
                <p>{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7) 비용 안내 요약 */}
      <section className="section" style={{ background: "var(--surface-charcoal-blue)" }}>
        <div className="container">
          <div className="grid grid--2" style={{ alignItems: "center" }}>
            <div>
              <span className="eyebrow">비용 안내</span>
              <h2 className="section-title">비용은 현장 조건에 따라 달라집니다</h2>
              <p className="section-sub">
                금액을 단정하지 않고, 비용이 달라지는 기준을 투명하게 안내합니다. 작업 전 예상 기준을 설명하고, 추가 작업이 필요하면 진행 전에 다시 안내합니다.
              </p>
              <Link className="btn btn--cta" href="/price/">
                비용 기준 자세히 보기
              </Link>
            </div>
            <div className="cost-card">
              <h3 style={{ marginTop: 0 }}>비용이 달라지는 조건</h3>
              <ul>
                {costFactors.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 8) 실제 현장 사례 */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">현장 사례</span>
          <h2 className="section-title">최근 작업 기록</h2>
          <p className="section-sub">실제 작업 기록만 게시합니다. 개인정보·주소는 노출하지 않습니다.</p>
          <div className="grid grid--3">
            {latestCases.map((c) => (
              <Link key={c.slug} href={`/case/${c.slug}/`} className="case-card">
                <div className="case-card__media">
                  <span className="case-card__badge">{c.regionName}</span>
                </div>
                <div className="case-card__body">
                  <h3>{c.title}</h3>
                  <p className="muted" style={{ margin: 0, fontSize: "0.9rem" }}>
                    {c.categoryLabel} · {c.date}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 22 }}>
            <Link className="btn btn--ghost" href="/case/">
              모든 현장 사례 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 9) 신뢰 정보 + 10) FAQ */}
      <section className="section" style={{ background: "var(--surface-charcoal-blue)" }}>
        <div className="container">
          <div className="grid grid--2">
            <div>
              <span className="eyebrow">신뢰 정보</span>
              <h2 className="section-title">정직하게 안내합니다</h2>
              <ul className="prose" style={{ paddingLeft: 18 }}>
                <li>상호: {site.name}</li>
                <li>상담 가능 시간: {site.hours}</li>
                <li>서비스 가능 지역: 전국 주요 지역 출동</li>
                <li>작업 전 비용 기준 안내, 작업 후 배수 테스트</li>
                <li>A/S 기준 및 재발 방지 안내</li>
                <li>현장 사진은 동의받은 경우만 사용, 개인정보·주소 제거</li>
              </ul>
            </div>
            <div>
              <span className="eyebrow">FAQ</span>
              <h2 className="section-title">자주 묻는 질문</h2>
              <FaqList faqs={mainFaqs} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
