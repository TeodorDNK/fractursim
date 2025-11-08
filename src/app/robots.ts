// src/app/robots.ts
import { MetadataRoute } from "next";
import { SITE_BASE } from "@/seo/meta";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_BASE}/sitemap.xml`,
  };
}
