import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { services } from "@/data/services";
import { businesses } from "@/data/businesses";
import { cases } from "@/data/cases";
import { allRegionPaths, findByPath, isIndexable } from "@/data/regions";
import { absoluteUrl } from "@/lib/seo";

// 색인 가능한(가치 있는) 페이지만 사이트맵에 포함한다.
// 읍·면·동 등 noindex 페이지는 콘텐츠가 쌓여 indexable이 되면 자동 포함된다.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["/", "/service/", "/business/", "/area/", "/case/", "/price/", "/faq/", "/about/", "/contact/"];

  const entries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: absoluteUrl(p),
    changeFrequency: "weekly",
    priority: p === "/" ? 1 : 0.7,
  }));

  for (const s of services) entries.push({ url: absoluteUrl(`/service/${s.slug}/`), priority: 0.8 });
  for (const b of businesses) entries.push({ url: absoluteUrl(`/business/${b.slug}/`), priority: 0.7 });
  for (const c of cases) entries.push({ url: absoluteUrl(`/case/${c.slug}/`), priority: 0.6 });

  for (const path of allRegionPaths()) {
    const node = findByPath(path);
    if (node && isIndexable(node)) {
      entries.push({ url: absoluteUrl(`/area/${path.join("/")}/`), priority: node.level === "sido" ? 0.8 : 0.7 });
    }
  }

  return entries;
}

export const dynamic = "force-static";
export const baseUrl = site.url;
