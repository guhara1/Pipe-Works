import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url.replace(/\/$/, "")}/sitemap.xml`,
  };
}

export const dynamic = "force-static";
