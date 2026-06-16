import type { Metadata } from "next";
import Link from "next/link";
import { cases, caseCategories } from "@/data/cases";
import Breadcrumb from "@/components/Breadcrumb";
import CtaBlock from "@/components/CtaBlock";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "현장 사례 | 하수구막힘·고압세척·배관내시경 작업 기록",
  description: "스피드 배관공사의 실제 작업 기록입니다. 하수구막힘, 음식점 고압세척, 배관내시경 진단, 오수관 역류 처리 등 현장 사례를 확인하세요.",
  alternates: { canonical: "/case/" },
};

export default function CaseIndex() {
  const crumbs = [{ name: "홈", url: "/" }, { name: "현장사례", url: "/case/" }];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumb items={crumbs} />

      <section className="section section--tight">
        <div className="container">
          <span className="eyebrow">현장사례</span>
          <h1 className="section-title">실제 작업 기록</h1>
          <p className="section-sub">실제 진행한 작업만 게시합니다. 개인정보·주소는 노출하지 않으며, 사진은 동의받은 경우만 사용합니다.</p>

          <div className="chips" style={{ marginBottom: 24 }}>
            {caseCategories.map((c) => (
              <span key={c.slug} className="chip">
                {c.label}
              </span>
            ))}
          </div>

          <div className="grid grid--3">
            {cases.map((c) => (
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

          <CtaBlock />
        </div>
      </section>
    </>
  );
}
