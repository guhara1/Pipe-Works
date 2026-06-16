import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  allRegionPaths,
  ancestorsOfPath,
  findByPath,
  isIndexable,
  type RegionNode,
} from "@/data/regions";
import { site } from "@/data/site";
import { featuredServiceSlugs, getService } from "@/data/services";
import Breadcrumb from "@/components/Breadcrumb";
import FaqList from "@/components/FaqList";
import CtaBlock from "@/components/CtaBlock";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return allRegionPaths().map((path) => ({ path }));
}

function titleFor(node: RegionNode): string {
  if (node.level === "sido") return `${node.shortName ?? node.name} 하수구막힘·배관공사`;
  if (node.level === "eupmyeondong") return `${node.name} 하수구막힘 상담`;
  return `${node.name} 하수구막힘·배관공사`;
}

function descFor(node: RegionNode): string {
  if (node.content?.intro) return node.content.intro.slice(0, 150);
  if (node.level === "eupmyeondong")
    return `${node.name} 하수구막힘·싱크대·욕실 배수구·변기 막힘 상담. 증상과 현장 조건을 확인한 뒤 필요한 장비로 처리합니다.`;
  return `${node.name} 하수구막힘·배관공사·고압세척·배관내시경 상담. 실제 출동 가능 지역 중심으로 안내합니다.`;
}

export async function generateMetadata({ params }: { params: Promise<{ path: string[] }> }): Promise<Metadata> {
  const { path } = await params;
  const node = findByPath(path);
  if (!node) return {};
  const url = `/area/${path.join("/")}/`;
  const indexable = isIndexable(node);
  return {
    title: titleFor(node),
    description: descFor(node),
    alternates: { canonical: url },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: { title: `${titleFor(node)} | ${site.name}`, description: descFor(node), url: absoluteUrl(url) },
  };
}

export default async function AreaPage({ params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const node = findByPath(path);
  if (!node) notFound();

  const chain = ancestorsOfPath(path);
  const url = `/area/${path.join("/")}/`;
  const indexable = isIndexable(node);
  const content = node.content;
  const isHub = !!(node.children && node.children.length);

  // 브레드크럼: 홈 > 지역별 찾기 > ...조상들
  const crumbs = [
    { name: "홈", url: "/" },
    { name: "지역별 찾기", url: "/area/" },
    ...chain.map((n, i) => ({
      name: n.name,
      url: `/area/${path.slice(0, i + 1).join("/")}/`,
    })),
  ];

  const jsonLd: object[] = [breadcrumbJsonLd(crumbs)];
  if (indexable) {
    jsonLd.push(serviceJsonLd({ name: `${node.name} 하수구막힘·배관공사`, description: descFor(node), url: absoluteUrl(url), areaServed: node.name }));
    if (content?.faq?.length) jsonLd.push(faqJsonLd(content.faq));
  }

  const featured = featuredServiceSlugs.slice(0, 8).map(getService).filter(Boolean);

  return (
    <>
      <JsonLd data={jsonLd} />
      <Breadcrumb items={crumbs} />

      <article className="section section--tight">
        <div className="container" style={{ maxWidth: isHub ? undefined : 820 }}>
          <span className="eyebrow">{node.level === "sido" ? "시·도 허브" : node.level === "eupmyeondong" ? "읍·면·동" : "지역"}</span>
          <h1 style={{ fontSize: "clamp(1.7rem, 4vw, 2.3rem)", margin: "0 0 12px" }}>
            {titleFor(node)}
          </h1>

          {!indexable && (
            <p className="notice">
              이 지역 페이지는 실제 현장 사례·작업 기록이 쌓이면 정식 공개(색인)됩니다. 지금도 상담·출동은 가능하니 증상과 사진을 보내주세요.
            </p>
          )}

          <div className="prose">
            {content?.intro && (
              <>
                <h2>지역 특성</h2>
                <p>{content.intro}</p>
              </>
            )}
            {content?.symptoms && (
              <>
                <h2>자주 발생하는 막힘</h2>
                <p>{content.symptoms}</p>
              </>
            )}
            {content?.serviceScope && (
              <>
                <h2>서비스 가능 범위</h2>
                <p>{content.serviceScope}</p>
              </>
            )}
            {content?.method && (
              <>
                <h2>작업 방식</h2>
                <p>{content.method}</p>
              </>
            )}
            {content?.cost && (
              <>
                <h2>비용 기준</h2>
                <p>{content.cost}</p>
              </>
            )}
            {content?.checklist && (
              <>
                <h2>출동 전 확인사항</h2>
                <p>{content.checklist}</p>
              </>
            )}
            {content?.caseStudy && (
              <>
                <h2>실제 사례</h2>
                <p>{content.caseStudy}</p>
              </>
            )}

            {!content && (
              <p className="muted">
                {node.name} 지역의 하수구막힘·싱크대·변기·욕실 배수구 막힘, 오수관 역류, 배관내시경·고압세척 상담이 가능합니다. 증상과 현장 사진을 보내주시면 원인과 작업 방식, 비용 기준을 안내드립니다.
              </p>
            )}
          </div>

          {/* 하위 지역 (허브) */}
          {isHub && (
            <>
              <h2 className="section-title" style={{ fontSize: "1.3rem", marginTop: 36 }}>
                {node.name} 하위 지역
              </h2>
              <div className="chips" style={{ marginTop: 12 }}>
                {node.children!.map((c) => (
                  <Link key={c.slug} href={`/area/${path.join("/")}/${c.slug}/`} className="chip">
                    {c.name}
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* 인접 지역 안내 */}
          {content?.nearby?.length ? (
            <>
              <h2 className="section-title" style={{ fontSize: "1.2rem", marginTop: 32 }}>
                인접 지역 안내
              </h2>
              <p className="muted">{content.nearby.join(" · ")} 등 인접 지역도 출동이 가능합니다.</p>
            </>
          ) : null}

          {/* FAQ */}
          {content?.faq?.length ? (
            <>
              <h2 className="section-title" style={{ fontSize: "1.3rem", marginTop: 32 }}>
                {node.name} 자주 묻는 질문
              </h2>
              <FaqList faqs={content.faq} />
            </>
          ) : null}

          {/* 서비스 바로가기 */}
          <h2 className="section-title" style={{ fontSize: "1.2rem", marginTop: 32 }}>
            {node.name}에서 가능한 서비스
          </h2>
          <div className="chips" style={{ marginTop: 12 }}>
            {featured.map((s) => (
              <Link key={s!.slug} href={`/service/${s!.slug}/`} className="chip">
                {s!.title}
              </Link>
            ))}
          </div>

          <CtaBlock label={`${node.name} 하수구막힘·배관공사 상담`} />
        </div>
      </article>
    </>
  );
}
