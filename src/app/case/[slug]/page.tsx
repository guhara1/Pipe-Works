import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cases, getCase } from "@/data/cases";
import Breadcrumb from "@/components/Breadcrumb";
import CtaBlock from "@/components/CtaBlock";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) return {};
  const desc = `${c.regionName} ${c.title}. 증상: ${c.symptom} 원인: ${c.cause}`.slice(0, 150);
  return {
    title: `${c.title} | 현장 사례`,
    description: desc,
    alternates: { canonical: `/case/${c.slug}/` },
    openGraph: { title: c.title, description: desc, url: absoluteUrl(`/case/${c.slug}/`) },
  };
}

export default async function CaseDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) notFound();

  const crumbs = [
    { name: "홈", url: "/" },
    { name: "현장사례", url: "/case/" },
    { name: c.title, url: `/case/${c.slug}/` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          articleJsonLd({
            headline: c.title,
            description: `${c.symptom} / ${c.cause}`,
            url: absoluteUrl(`/case/${c.slug}/`),
            image: c.images?.[0]?.src,
            datePublished: `${c.date}-01`,
          }),
        ]}
      />
      <Breadcrumb items={crumbs} />

      <article className="section section--tight">
        <div className="container" style={{ maxWidth: 820 }}>
          <span className="eyebrow">{c.categoryLabel}</span>
          <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.1rem)", margin: "0 0 8px" }}>{c.title}</h1>
          <p className="muted">
            {c.regionName} · {c.date}
          </p>

          {c.images?.length ? (
            <div className="case-card__media" style={{ borderRadius: "var(--radius-md)", marginTop: 16 }} role="img" aria-label={c.images[0].alt} />
          ) : null}

          <div className="prose">
            <h2>증상</h2>
            <p>{c.symptom}</p>
            <h2>원인</h2>
            <p>{c.cause}</p>
            <h2>사용 장비</h2>
            <ul>
              {c.equipment.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
            <h2>처리 결과</h2>
            <p>{c.result}</p>
            <h2>재발 방지 안내</h2>
            <p>{c.prevention}</p>
          </div>

          {c.regionPath && (
            <p className="muted" style={{ marginTop: 20 }}>
              지역 안내: <Link href={`/area/${c.regionPath.join("/")}/`}>{c.regionName} 배관공사</Link>
            </p>
          )}

          <CtaBlock />
        </div>
      </article>
    </>
  );
}
