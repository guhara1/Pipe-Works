// 구조화 데이터(JSON-LD) 헬퍼 — 스펙 9 준수.
// 주의: 가짜 후기/평점(Review/AggregateRating) 금지, 없는 지점 LocalBusiness 금지,
//       페이지 본문에 실제로 보이는 FAQ만 FAQPage로 마크업.

import { site } from "@/data/site";
import type { Faq } from "@/data/services";

export function absoluteUrl(path: string): string {
  const base = site.url.replace(/\/$/, "");
  if (!path.startsWith("/")) path = "/" + path;
  return base + path;
}

// Organization + WebSite(SearchAction) — 메인에 1회 출력
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    telephone: site.phone,
    image: absoluteUrl(site.ogImage),
    areaServed: "KR",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.url.replace(/\/$/, "")}/area/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

// Plumber(LocalBusiness 하위) — 전국 출동 서비스로 표기.
// 실제 단일 사업장 정보가 있을 때만 정확히 사용한다(허위 지점 금지).
export function plumberJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Plumber",
    name: site.name,
    url: site.url,
    telephone: site.phone,
    image: absoluteUrl(site.ogImage),
    description: site.description,
    areaServed: { "@type": "Country", name: "대한민국" },
    openingHours: "Mo-Su 08:00-22:00",
  };
}

export function serviceJsonLd(opts: { name: string; description: string; url: string; areaServed?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: opts.name,
    name: opts.name,
    description: opts.description,
    url: opts.url,
    provider: { "@type": "Plumber", name: site.name, url: site.url },
    areaServed: opts.areaServed ? { "@type": "Place", name: opts.areaServed } : { "@type": "Country", name: "대한민국" },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.url),
    })),
  };
}

// 본문에 실제로 노출되는 FAQ만 전달할 것.
export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleJsonLd(opts: { headline: string; description: string; url: string; image?: string; datePublished?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    image: opts.image ? absoluteUrl(opts.image) : absoluteUrl(site.ogImage),
    datePublished: opts.datePublished,
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };
}
