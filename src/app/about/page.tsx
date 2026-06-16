import type { Metadata } from "next";
import { site } from "@/data/site";
import Breadcrumb from "@/components/Breadcrumb";
import CtaBlock from "@/components/CtaBlock";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, organizationJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "회사소개 | 기술자·장비·신뢰 정보",
  description: "스피드 배관공사는 실제 출동 가능 지역을 중심으로 운영하며, 작업 전 비용 안내와 작업 후 배수 테스트를 기본으로 합니다.",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  const crumbs = [{ name: "홈", url: "/" }, { name: "회사소개", url: "/about/" }];
  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), organizationJsonLd()]} />
      <Breadcrumb items={crumbs} />
      <section className="section section--tight">
        <div className="container" style={{ maxWidth: 820 }}>
          <span className="eyebrow">회사소개</span>
          <h1 className="section-title">{site.name}</h1>
          <div className="prose">
            <p>
              {site.name}는 하수구막힘, 싱크대·변기·욕실 배수구 막힘, 오수관 역류, 배관내시경, 고압세척, 배관교체까지 다루는 배관 전문 업체입니다. 증상과 현장 조건을 먼저 확인한 뒤 필요한 장비로만 작업하는 것을 원칙으로 합니다.
            </p>
            <h2>운영 원칙</h2>
            <ul>
              <li>실제 출동 가능 지역을 중심으로 운영합니다.</li>
              <li>작업 전 비용 기준을 안내하고, 추가 작업은 진행 전에 다시 설명합니다.</li>
              <li>작업 후 배수 테스트로 흐름을 확인하고 재발 방지를 안내합니다.</li>
              <li>검증할 수 없는 표현(전국 1위, 100% 해결 등)을 사용하지 않습니다.</li>
              <li>현장 사진은 동의받은 경우만 사용하며 개인정보·주소를 제거합니다.</li>
            </ul>
            <h2>기술자 소개</h2>
            <p>현장 경험을 갖춘 기술자가 증상에 맞는 장비와 작업 방식을 판단해 처리합니다. 자세한 인력 정보는 상담 시 안내합니다.</p>
            <h2>장비 소개</h2>
            <p>배관내시경, 스프링 장비, 석션 장비, 고압세척 장비, 악취 진단 장비, 배관 교체 공구를 상황에 맞게 사용합니다. 장비를 과장하지 않고 필요한 경우에만 사용합니다.</p>
            <h2>상담 안내</h2>
            <ul>
              <li>상호: {site.name}</li>
              <li>상담 시간: {site.hours}</li>
              <li>긴급출동: {site.emergency}</li>
              <li>서비스 가능 지역: 전국 주요 지역 출동</li>
            </ul>
          </div>
          <CtaBlock />
        </div>
      </section>
    </>
  );
}
