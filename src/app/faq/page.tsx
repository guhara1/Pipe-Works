import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import CtaBlock from "@/components/CtaBlock";
import FaqList from "@/components/FaqList";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "자주 묻는 질문 | 고객센터",
  description: "하수구막힘, 배관내시경, 고압세척, 야간 출동, A/S 기준 등 스피드 배관공사 자주 묻는 질문을 모았습니다.",
  alternates: { canonical: "/faq/" },
};

const faqs = [
  { q: "하수구막힘은 셀프로 뚫어도 되나요?", a: "표면 가까운 가벼운 막힘은 효과가 있을 수 있지만, 화학 세정제 반복 사용은 배관을 상하게 할 수 있습니다. 여러 배수구가 동시에 느리면 공용 배관 문제이므로 위치 확인 후 장비 작업을 권합니다." },
  { q: "싱크대가 자주 막히는 이유는 무엇인가요?", a: "기름과 음식물 찌꺼기가 관 내벽에 굳어 점점 좁아지기 때문입니다. 거름망 사용과 정기 세척으로 재발을 줄일 수 있습니다." },
  { q: "배관내시경은 언제 필요한가요?", a: "막힘이 반복되거나 원인·위치가 불확실할 때, 배관 노후·파손 여부를 확인해야 할 때 사용합니다." },
  { q: "고압세척은 모든 현장에 필요한가요?", a: "아닙니다. 기름·슬러지가 관 전체에 낀 경우에 효과적이며, 국소 막힘은 스프링 장비로 충분한 경우가 많습니다." },
  { q: "야간·주말 출동 비용은 어떻게 달라지나요?", a: "야간·주말·공휴일은 출동 기준이 달라질 수 있습니다. 통화 시와 작업 전에 기준을 안내합니다." },
  { q: "오래된 아파트도 작업 가능한가요?", a: "가능합니다. 노후 정도와 배관 구조를 내시경으로 확인한 뒤 안전한 방식으로 작업합니다." },
  { q: "A/S 기준은 어떻게 되나요?", a: "작업 후 배수 테스트로 흐름을 확인하고, 같은 원인으로 재발하면 A/S 기준에 따라 재점검합니다. 자세한 기준은 작업 전에 안내합니다." },
  { q: "사진 상담은 어떻게 하나요?", a: "증상이 보이는 부위 사진 1~3장을 전화·메시지로 보내주시면 원인 추정과 작업 방식, 비용 기준을 안내합니다." },
];

export default function FaqPage() {
  const crumbs = [{ name: "홈", url: "/" }, { name: "자주 묻는 질문", url: "/faq/" }];
  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), faqJsonLd(faqs)]} />
      <Breadcrumb items={crumbs} />
      <section className="section section--tight">
        <div className="container" style={{ maxWidth: 820 }}>
          <span className="eyebrow">고객센터</span>
          <h1 className="section-title">자주 묻는 질문</h1>
          <p className="section-sub">상담 전 궁금한 점을 모았습니다. 더 궁금한 점은 전화·사진 상담으로 문의해 주세요.</p>
          <FaqList faqs={faqs} />
          <CtaBlock />
        </div>
      </section>
    </>
  );
}
