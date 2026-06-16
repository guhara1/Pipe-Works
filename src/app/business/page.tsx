import type { Metadata } from "next";
import Link from "next/link";
import { businesses } from "@/data/businesses";
import Breadcrumb from "@/components/Breadcrumb";
import CtaBlock from "@/components/CtaBlock";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "업종별 배관공사 | 음식점·상가·아파트·공장",
  description: "음식점, 카페, 상가, 아파트, 빌라·주택, 공장, 오피스 등 업종별 배관 문제와 처리 방식을 안내합니다.",
  alternates: { canonical: "/business/" },
};

export default function BusinessIndex() {
  const crumbs = [{ name: "홈", url: "/" }, { name: "업종별 배관공사", url: "/business/" }];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumb items={crumbs} />
      <section className="section section--tight">
        <div className="container">
          <span className="eyebrow">업종별</span>
          <h1 className="section-title">업종별 배관공사</h1>
          <p className="section-sub">업종마다 적체 물질과 작업 조건이 다릅니다. 현장에 맞춰 처리합니다.</p>
          <div className="grid grid--3">
            {businesses.map((b) => (
              <Link key={b.slug} href={`/business/${b.slug}/`} className="card">
                <h3>{b.title}</h3>
                <p>{b.summary}</p>
              </Link>
            ))}
          </div>
          <CtaBlock />
        </div>
      </section>
    </>
  );
}
