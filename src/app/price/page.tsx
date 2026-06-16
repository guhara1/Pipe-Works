import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import CtaBlock from "@/components/CtaBlock";
import FaqList from "@/components/FaqList";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "비용 안내 | 하수구막힘·배관공사 견적 기준",
  description: "하수구막힘, 고압세척, 배관내시경 비용은 현장 조건에 따라 달라집니다. 비용이 달라지는 기준과 견적 전 확인사항을 투명하게 안내합니다.",
  alternates: { canonical: "/price/" },
};

const factors = [
  { k: "막힘 위치", v: "표면 가까운 국소 막힘인지, 공용 오수관 깊은 적체인지에 따라 작업량이 달라집니다." },
  { k: "배관 길이·구조", v: "작업 구간이 길거나 굴절이 많으면 시간과 장비 사용이 늘어납니다." },
  { k: "배관 노후도", v: "노후·파손 관은 단순 뚫음 대신 보수·교체가 필요할 수 있습니다." },
  { k: "사용 장비", v: "스프링·석션·고압세척·내시경 중 무엇이 필요한지에 따라 달라집니다." },
  { k: "야간·주말 출동", v: "야간·주말·공휴일은 출동 기준이 달라질 수 있습니다." },
  { k: "영업장 여부", v: "음식점·상가 영업장은 시간대 조율과 작업 환경에 따라 달라집니다." },
];

const faqs = [
  { q: "전화로 정확한 금액을 알 수 있나요?", a: "증상과 사진으로 예상 기준은 안내할 수 있지만, 정확한 비용은 현장에서 막힘 위치·범위를 확인한 뒤 작업 전에 안내합니다." },
  { q: "추가 비용은 언제 생기나요?", a: "예상과 다르게 배관 교체가 필요하거나 작업 범위가 커지는 경우입니다. 추가 작업은 진행 전에 다시 설명하고 동의를 받은 뒤 진행합니다." },
  { q: "견적 전에 무엇을 확인하면 되나요?", a: "막힘 증상, 발생 위치, 건물 종류와 층, 영업장 여부, 작업 가능 시간대를 알려주시면 더 정확히 안내할 수 있습니다." },
];

export default function PricePage() {
  const crumbs = [{ name: "홈", url: "/" }, { name: "비용 안내", url: "/price/" }];
  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), faqJsonLd(faqs)]} />
      <Breadcrumb items={crumbs} />
      <section className="section section--tight">
        <div className="container" style={{ maxWidth: 860 }}>
          <span className="eyebrow">비용 안내</span>
          <h1 className="section-title">비용은 현장 조건에 따라 달라집니다</h1>
          <p className="section-sub">
            금액을 단정하지 않습니다. 작업 전에 예상 기준을 안내하고, 추가 작업이 필요하면 진행 전에 다시 설명합니다. 아래는 비용이 달라지는 주요 조건입니다.
          </p>

          <div className="grid grid--2">
            {factors.map((f) => (
              <div key={f.k} className="card">
                <h3>{f.k}</h3>
                <p>{f.v}</p>
              </div>
            ))}
          </div>

          <div className="cost-card" style={{ marginTop: 24 }}>
            <h3 style={{ marginTop: 0 }}>견적 전 확인사항</h3>
            <ul>
              <li>막힘 증상과 발생 위치(싱크대/욕실/변기/바닥 등)</li>
              <li>건물 종류와 층, 노후 여부</li>
              <li>영업장 여부와 작업 가능 시간대</li>
              <li>가능하면 현장 사진 1~3장</li>
            </ul>
          </div>

          <h2 className="section-title" style={{ fontSize: "1.3rem", marginTop: 36 }}>자주 묻는 질문</h2>
          <FaqList faqs={faqs} />

          <CtaBlock label="현장 조건을 확인하고 비용 기준을 안내드립니다" />
        </div>
      </section>
    </>
  );
}
