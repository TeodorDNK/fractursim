// src/seo/meta.ts
import type { Metadata } from "next";
import { locales } from "@/i18n/routing";

export const SITE_BASE = "https://fracturism.example.com"; // schimbă cu domeniul tău

export function buildI18nAlternates(pathname: string, currentLocale: string) {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `${SITE_BASE}/${l}${pathname}`;
  return {
    canonical: `${SITE_BASE}/${currentLocale}${pathname}`,
    languages: { "x-default": `${SITE_BASE}/en${pathname}`, ...languages },
  };
}

export function buildPageMetadata(opts: {
  locale: "ro"|"en"|"it";
  pathname: string;                // ex: "/", "/manifest"
  title: string;
  description?: string;
  siteName?: string;
}): Metadata {
  const { locale, pathname, title, description = "", siteName = "Fracturism" } = opts;
  const alternates = buildI18nAlternates(pathname, locale);
  const url = `${SITE_BASE}/${locale}${pathname}`;
  return {
    title,
    description,
    alternates,
    openGraph: {
      locale,
      url,
      title,
      description,
      siteName,
      type: "website",
    },
  };
}
