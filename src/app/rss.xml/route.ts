import { site } from "@/data/site";
import { services } from "@/data/services";
import { businesses } from "@/data/businesses";
import { cases } from "@/data/cases";
import { regions, type RegionNode } from "@/data/regions";
import { absoluteUrl } from "@/lib/seo";

// 정적 export 용 RSS 2.0 피드 (/rss.xml)
// 네이버 RSS 수집 + 색인 보조용. 핵심 콘텐츠(서비스·업종·사례·시도·시군구) 포함.
export const dynamic = "force-static";

type Item = { title: string; url: string; desc: string };

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function GET() {
  const items: Item[] = [];
  const push = (title: string, path: string, desc: string) => items.push({ title, url: absoluteUrl(path), desc });

  push(`${site.name} | 전국 하수구막힘·배관공사`, "/", site.description);
  for (const s of services) push(`${s.title} | ${site.name}`, `/service/${s.slug}/`, s.summary);
  for (const b of businesses) push(`${b.title} | ${site.name}`, `/business/${b.slug}/`, b.summary);
  for (const c of cases) push(c.title, `/case/${c.slug}/`, `${c.regionName} · ${c.categoryLabel}`);

  // 시·도 + 시·군·구(핵심 색인 레이어)
  const walk = (nodes: RegionNode[], path: string[]) => {
    for (const n of nodes) {
      const p = [...path, n.slug];
      if (n.level === "sido" || n.level === "sigungu" || n.level === "gu") {
        push(`${n.name} 하수구막힘·배관공사`, `/area/${p.join("/")}/`, `${n.name} 지역 배관공사·하수구막힘 상담`);
        if (n.children) walk(n.children, p);
      }
    }
  };
  walk(regions, []);

  const now = new Date().toUTCString();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${esc(site.name)} | 전국 하수구막힘·배관공사</title>
<link>${site.url}</link>
<description>${esc(site.description)}</description>
<language>ko</language>
<lastBuildDate>${now}</lastBuildDate>
${items
  .map(
    (it) => `<item>
<title>${esc(it.title)}</title>
<link>${it.url}</link>
<guid isPermaLink="true">${it.url}</guid>
<description>${esc(it.desc)}</description>
<pubDate>${now}</pubDate>
</item>`,
  )
  .join("\n")}
</channel>
</rss>`;

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
