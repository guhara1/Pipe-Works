import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  allRegionPaths,
  ancestorsOfPath,
  findByPath,
  isIndexable,
  regions,
  type RegionNode,
} from "@/data/regions";
import { generateAreaContent } from "@/data/areaContentGen";
import { site } from "@/data/site";
import { featuredServiceSlugs, getService } from "@/data/services";
import { cases } from "@/data/cases";
import Breadcrumb from "@/components/Breadcrumb";
import FaqList from "@/components/FaqList";
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

function h1For(node: RegionNode): string {
  return node.h1 ?? titleFor(node);
}

function descFor(node: RegionNode): string {
  if (node.metaDescription) return node.metaDescription;
  if (node.content?.lead) return node.content.lead.slice(0, 150);
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
    title: node.seoTitle ? { absolute: node.seoTitle } : titleFor(node),
    description: descFor(node),
    alternates: { canonical: url },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title: node.seoTitle ?? `${titleFor(node)} | ${site.name}`,
      description: descFor(node),
      url: absoluteUrl(url),
    },
  };
}

export default async function AreaPage({ params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const node = findByPath(path);
  if (!node) notFound();

  const chain = ancestorsOfPath(path);
  const url = `/area/${path.join("/")}/`;
  const indexable = isIndexable(node);

  // 손으로 쓴 고유 콘텐츠가 있으면 우선, 없으면 지역별 자동 생성 콘텐츠 사용
  const parentPath = path.slice(0, -1);
  const parent = parentPath.length ? findByPath(parentPath) : null;
  const siblings = parent ? parent.children ?? [] : regions;
  const sidoName = chain[0]?.name ?? node.name;
  const c = node.content ?? generateAreaContent(node, parentPath, siblings, sidoName);

  const isHub = !!(node.children && node.children.length);
  const basePath = path.join("/");

  // 이 지역(또는 하위)에 해당하는 실제 현장 사례
  const regionCases = cases.filter((cs) => cs.regionPath && path.every((seg, i) => cs.regionPath![i] === seg));

  const crumbs = [
    { name: "홈", url: "/" },
    { name: "지역별 찾기", url: "/area/" },
    ...chain.map((n, i) => ({ name: n.name, url: `/area/${path.slice(0, i + 1).join("/")}/` })),
  ];

  const jsonLd: object[] = [breadcrumbJsonLd(crumbs)];
  if (indexable) {
    jsonLd.push(
      serviceJsonLd({ name: `${node.name} 하수구막힘·배관공사`, description: descFor(node), url: absoluteUrl(url), areaServed: node.name }),
    );
    if (c?.faq?.length) jsonLd.push(faqJsonLd(c.faq));
  }

  const featured = featuredServiceSlugs.slice(0, 8).map(getService).filter(Boolean);

  // 본문에 존재하는 섹션 → 앵커(목차) 메뉴 구성
  const intro = c?.lead || c?.intro;
  const symptoms = c?.symptomList?.length ? c.symptomList : null;
  const symptomsText = !symptoms ? c?.symptoms : null;
  const steps = c?.steps?.length ? c.steps : null;
  const methodText = !steps ? c?.method : null;
  const costFactors = c?.costFactors?.length ? c.costFactors : null;
  const costText = !costFactors ? c?.cost : null;
  const preparation = c?.preparation || c?.checklist;
  const hasCases = !!(c?.caseTypes?.length || regionCases.length);
  const nearby = c?.nearbyLinks?.length ? c.nearbyLinks : null;

  const anchors: { id: string; label: string }[] = [];
  if (intro) anchors.push({ id: "intro", label: `${node.name} 배관공사 안내` });
  if (symptoms || symptomsText) anchors.push({ id: "symptoms", label: "하수구막힘 증상" });
  if (c?.problems) anchors.push({ id: "problems", label: "자주 발생하는 배관 문제" });
  if (c?.serviceItems?.length) anchors.push({ id: "services", label: "서비스 가능 항목" });
  if (steps || methodText) anchors.push({ id: "method", label: "작업 방식" });
  if (isHub) anchors.push({ id: "areas", label: "서비스 가능 지역" });
  if (costFactors || costText) anchors.push({ id: "cost", label: "비용이 달라지는 기준" });
  if (preparation) anchors.push({ id: "prepare", label: "현장 확인 전 준비사항" });
  if (hasCases) anchors.push({ id: "cases", label: "현장사례" });
  if (nearby || c?.nearby?.length) anchors.push({ id: "nearby", label: "인접 지역" });
  if (c?.faq?.length) anchors.push({ id: "faq", label: "자주 묻는 질문" });
  anchors.push({ id: "contact", label: "전화 상담" });

  return (
    <>
      <JsonLd data={jsonLd} />
      <Breadcrumb items={crumbs} />

      <article className="section section--tight">
        <div className="container" style={{ maxWidth: isHub ? 900 : 820 }}>
          <span className="eyebrow">{node.level === "sido" ? "시·도 허브" : node.level === "eupmyeondong" ? "읍·면·동" : "지역"}</span>
          <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", margin: "0 0 12px" }}>{h1For(node)}</h1>

          {!indexable && (
            <p className="notice">
              이 지역 페이지는 실제 현장 사례·작업 기록이 쌓이면 정식 공개(색인)됩니다. 지금도 상담·출동은 가능하니 증상과 사진을 보내주세요.
            </p>
          )}

          {/* 앵커(목차) 메뉴 */}
          {anchors.length > 1 && (
            <nav className="glass" style={{ padding: 16, margin: "8px 0 8px" }} aria-label="페이지 내 메뉴">
              <strong style={{ display: "block", marginBottom: 8, fontSize: "0.9rem" }}>{node.name} 배관공사 바로가기</strong>
              <div className="chips">
                {anchors.map((a) => (
                  <a key={a.id} href={`#${a.id}`} className="chip">
                    {a.label}
                  </a>
                ))}
              </div>
            </nav>
          )}

          <div className="prose">
            {/* 1) 안내 */}
            {intro && (
              <section id="intro">
                <h2>{node.name} 배관공사 안내</h2>
                <p>{intro}</p>
              </section>
            )}

            {/* 2) 증상 */}
            {(symptoms || symptomsText) && (
              <section id="symptoms">
                <h2>{node.name} 하수구막힘 주요 증상</h2>
                {symptoms ? (
                  <ul>
                    {symptoms.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{symptomsText}</p>
                )}
              </section>
            )}

            {/* 3) 자주 발생하는 배관 문제 */}
            {c?.problems && (
              <section id="problems">
                <h2>{node.name}에서 자주 발생하는 배관 문제</h2>
                <p>{c.problems}</p>
              </section>
            )}

            {/* 4) 서비스 가능 항목 */}
            {c?.serviceItems?.length ? (
              <section id="services">
                <h2>서비스 가능 항목</h2>
                <div className="chips">
                  {c.serviceItems.map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            {/* 5) 작업 방식 */}
            {(steps || methodText) && (
              <section id="method">
                <h2>작업 방식 안내</h2>
                {steps ? (
                  <div className="steps" style={{ marginTop: 12 }}>
                    {steps.map((label, i) => (
                      <div key={label} className="step">
                        <span className="step__num">{i + 1}</span>
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>{methodText}</p>
                )}
              </section>
            )}

            {/* 6) 서비스 가능 지역(하위 동/지역) */}
            {isHub && (
              <section id="areas">
                <h2>{node.name} 서비스 가능 지역</h2>
                <p className="muted" style={{ marginTop: 0 }}>
                  1동·2동은 대표 동명으로 통합해 안내합니다. 동을 선택하면 해당 지역 페이지로 이동합니다.
                </p>
                <div className="chips">
                  {node.children!.map((child) => (
                    <Link key={child.slug} href={`/area/${basePath}/${child.slug}/`} className="chip">
                      {child.name}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* 7) 비용 */}
            {(costFactors || costText) && (
              <section id="cost">
                <h2>{node.name} 배관공사 비용 안내</h2>
                {costFactors ? (
                  <>
                    <p style={{ marginBottom: 8 }}>비용은 현장 조건에 따라 달라집니다. 비용이 달라지는 기준은 다음과 같습니다.</p>
                    <ul>
                      {costFactors.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    {c?.costNote && <p>{c.costNote}</p>}
                  </>
                ) : (
                  <p>{costText}</p>
                )}
              </section>
            )}

            {/* 8) 현장 확인 전 준비사항 */}
            {preparation && (
              <section id="prepare">
                <h2>현장 확인 전 준비사항</h2>
                <p>{preparation}</p>
              </section>
            )}

            {/* 9) 현장사례 */}
            {hasCases && (
              <section id="cases">
                <h2>{node.name} 현장사례</h2>
                {c?.caseTypes?.length ? (
                  <>
                    <p style={{ marginBottom: 8 }}>{node.name}에서 자주 다루는 현장 유형입니다.</p>
                    <ul>
                      {c.caseTypes.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
                {regionCases.length > 0 && (
                  <div className="grid grid--2" style={{ marginTop: 12 }}>
                    {regionCases.map((cs) => (
                      <Link key={cs.slug} href={`/case/${cs.slug}/`} className="card">
                        <h3 style={{ fontSize: "1rem" }}>{cs.title}</h3>
                        <p>{cs.categoryLabel} · {cs.regionName}</p>
                      </Link>
                    ))}
                  </div>
                )}
                <p className="muted" style={{ fontSize: "0.9rem", marginTop: 12 }}>
                  현장사례는 실제 작업 기록과 동의받은 사진이 확보된 경우에만 게시합니다. <Link href="/case/">전체 현장사례 보기</Link>
                </p>
              </section>
            )}

            {/* 10) 인접 지역 */}
            {(nearby || c?.nearby?.length) && (
              <section id="nearby">
                <h2>인접 지역</h2>
                {nearby ? (
                  <div className="chips">
                    {nearby.map((n) => (
                      <Link key={n.path} href={n.path} className="chip">
                        {n.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="muted">{c!.nearby!.join(" · ")} 등 인접 지역도 출동이 가능합니다.</p>
                )}
              </section>
            )}

            {/* 11) FAQ */}
            {c?.faq?.length ? (
              <section id="faq">
                <h2>{node.name} 자주 묻는 질문</h2>
                <FaqList faqs={c.faq} />
              </section>
            ) : null}

            {/* 서비스 바로가기 */}
            <h2 style={{ marginTop: 32 }}>{node.name}에서 가능한 서비스</h2>
            <div className="chips">
              {featured.map((s) => (
                <Link key={s!.slug} href={`/service/${s!.slug}/`} className="chip">
                  {s!.title}
                </Link>
              ))}
            </div>
          </div>

          {/* 하단 CTA */}
          <div id="contact" className="glass" style={{ padding: 28, textAlign: "center", marginTop: 36 }}>
            <h3 style={{ margin: "0 0 8px", fontSize: "1.25rem" }}>{node.name} 하수구막힘·배관공사 상담</h3>
            <p className="muted" style={{ margin: "0 0 18px" }}>
              증상, 위치, 건물 형태, 물이 내려가는 속도, 냄새 여부를 알려주세요. 현장 조건을 먼저 확인하고 필요한 작업 방향을 안내합니다.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a className="btn btn--cta" href={site.phoneHref}>
                📞 전화 상담하기
              </a>
              <Link className="btn btn--ghost" href="/contact/">
                📷 사진 보내기
              </Link>
              <Link className="btn btn--ghost" href="/price/">
                💰 비용 기준 보기
              </Link>
              <Link className="btn btn--ghost" href="/case/">
                🧰 현장사례 보기
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
