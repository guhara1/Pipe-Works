import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services, getService } from "@/data/services";
import { site } from "@/data/site";
import Breadcrumb from "@/components/Breadcrumb";
import FaqList from "@/components/FaqList";
import CtaBlock from "@/components/CtaBlock";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd, absoluteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return {
    title: s.seoTitle.replace(` | ${site.name}`, ""),
    description: s.seoDescription,
    alternates: { canonical: `/service/${s.slug}/` },
    openGraph: { title: s.seoTitle, description: s.seoDescription, url: absoluteUrl(`/service/${s.slug}/`) },
  };
}

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const crumbs = [
    { name: "홈", url: "/" },
    { name: "서비스 안내", url: "/service/" },
    { name: s.title, url: `/service/${s.slug}/` },
  ];

  const jsonLd: object[] = [
    breadcrumbJsonLd(crumbs),
    serviceJsonLd({ name: s.title, description: s.seoDescription, url: absoluteUrl(`/service/${s.slug}/`) }),
  ];
  if (s.faq?.length) jsonLd.push(faqJsonLd(s.faq));

  const hasDetail = !!(s.symptom || s.causes || s.method);

  return (
    <>
      <JsonLd data={jsonLd} />
      <Breadcrumb items={crumbs} />

      <article className="section section--tight">
        <div className="container" style={{ maxWidth: 820 }}>
          <span className="eyebrow">{s.category}</span>
          <h1 style={{ fontSize: "clamp(1.7rem, 4vw, 2.3rem)", margin: "0 0 12px" }}>
            {s.title} | {site.name}
          </h1>
          <p className="muted" style={{ fontSize: "1.05rem" }}>{s.summary}</p>

          <div className="prose">
            {s.symptom && (
              <>
                <h2>증상 설명</h2>
                <p>{s.symptom}</p>
              </>
            )}
            {s.causes && (
              <>
                <h2>주요 원인</h2>
                <ul>
                  {s.causes.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </>
            )}
            {s.ifIgnored && (
              <>
                <h2>방치하면 생기는 문제</h2>
                <p>{s.ifIgnored}</p>
              </>
            )}
            {s.method && (
              <>
                <h2>작업 방식</h2>
                <p>{s.method}</p>
              </>
            )}
            {s.equipmentBasis && (
              <>
                <h2>장비 선택 기준</h2>
                <p>{s.equipmentBasis}</p>
              </>
            )}
            {s.costBasis && (
              <>
                <h2>비용 기준</h2>
                <p>{s.costBasis}</p>
              </>
            )}
            {s.selfCareWarning && (
              <>
                <h2>자가 조치 시 주의점</h2>
                <p>{s.selfCareWarning}</p>
              </>
            )}

            {!hasDetail && (
              <p className="notice" style={{ marginTop: 20 }}>
                이 서비스의 상세 안내는 준비 중입니다. 증상과 현장 사진을 보내주시면 원인과 작업 방식, 비용 기준을 바로 안내드립니다.
              </p>
            )}

            {s.faq?.length ? (
              <>
                <h2>자주 묻는 질문</h2>
                <FaqList faqs={s.faq} />
              </>
            ) : null}
          </div>

          <CtaBlock />

          <p className="muted" style={{ marginTop: 24, fontSize: "0.9rem" }}>
            관련: <Link href="/price/">비용 안내</Link> · <Link href="/case/">현장 사례</Link> ·{" "}
            <Link href="/area/">지역별 찾기</Link>
          </p>
        </div>
      </article>
    </>
  );
}
