// src/app/sitemap.ts
import { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";
import { SITE_BASE } from "@/seo/meta";

const PAGES = [
  "/", "/manifest", "/galerie", "/moda-design", "/artistul",
  "/noutati", "/contact",
  "/legal/termeni", "/legal/cookies", "/legal/confidentialitate",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  const out: MetadataRoute.Sitemap = [];
  for (const l of locales) {
    for (const p of PAGES) {
      out.push({
        url: `${SITE_BASE}/${l}${p}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: p === "/" ? 1 : 0.6,
        alternates: {
          languages: Object.fromEntries(
            locales.map(ll => [ll, `${SITE_BASE}/${ll}${p}`])
          ),
        },
      });
    }
  }
  return out;
}
