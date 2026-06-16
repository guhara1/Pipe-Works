import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { businesses, getBusiness } from "@/data/businesses";
import Breadcrumb from "@/components/Breadcrumb";
import CtaBlock from "@/components/CtaBlock";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return businesses.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const b = getBusiness(slug);
  if (!b) return {};
  return {
    title: b.title,
    description: b.seoDescription,
    alternates: { canonical: `/business/${b.slug}/` },
  };
}

export default async function BusinessDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = getBusiness(slug);
  if (!b) notFound();
  const crumbs = [
    { name: "홈", url: "/" },
    { name: "업종별 배관공사", url: "/business/" },
    { name: b.title, url: `/business/${b.slug}/` },
  ];
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          serviceJsonLd({ name: b.title, description: b.seoDescription, url: absoluteUrl(`/business/${b.slug}/`) }),
        ]}
      />
      <Breadcrumb items={crumbs} />
      <article className="section section--tight">
        <div className="container" style={{ maxWidth: 820 }}>
          <span className="eyebrow">업종별</span>
          <h1 style={{ fontSize: "clamp(1.7rem, 4vw, 2.2rem)", margin: "0 0 12px" }}>{b.title}</h1>
          <p className="muted" style={{ fontSize: "1.05rem" }}>{b.summary}</p>
          <div className="prose">
            {b.body ? (
              <p>{b.body}</p>
            ) : (
              <p className="notice">상세 안내는 준비 중입니다. 현장 사진과 증상을 보내주시면 작업 방식과 비용 기준을 바로 안내드립니다.</p>
            )}
          </div>
          <CtaBlock label={`${b.title} 상담`} />
        </div>
      </article>
    </>
  );
}
