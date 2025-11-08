// fracturism/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale } from "./src/i18n/routing";
import { COUNTRIES } from "./src/i18n/countries";

// Mapare țară -> locale (din lista ta COUNTRIES)
function countryToLocale(cc?: string): "ro" | "it" | "en" {
  if (!cc) return defaultLocale;
  const hit = COUNTRIES.find(c => c.code.toUpperCase() === cc.toUpperCase());
  return hit?.locale ?? "en";
}

// Extrage codul de țară din headere, compatibil cu mai multe edge/proxy-uri
function getCountryFromHeaders(req: NextRequest): string {
  const h = req.headers;
  // Vercel Edge
  const vercel = h.get("x-vercel-ip-country");
  if (vercel) return vercel;
  // Cloudflare
  const cf = h.get("cf-ipcountry");
  if (cf) return cf;
  // AWS CloudFront
  const cfViewer = h.get("cloudfront-viewer-country");
  if (cfViewer) return cfViewer;
  // Alte proxy-uri personalizate
  const generic = h.get("x-country") || h.get("x-geo-country");
  return generic || "";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Lăsăm să treacă fișierele statice și rutele care au deja locale
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets") ||
    /^\/(ro|en|it)(\/|$)/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 1) cookie
  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && isLocale(cookieLocale)) {
    return NextResponse.redirect(new URL(`/${cookieLocale}${pathname}`, req.url));
  }

  // 2) Accept-Language
  const accept = (req.headers.get("accept-language") || "").toLowerCase();
  const byHeader = (["ro", "it", "en"] as const).find(l => accept.includes(l));

  // 3) Țară din headere (Vercel/CF/CloudFront/etc.)
  const cc = getCountryFromHeaders(req).toUpperCase();
  const byCountry = countryToLocale(cc);

  const locale = (byHeader || byCountry || defaultLocale) as "ro" | "it" | "en";

  const res = NextResponse.redirect(new URL(`/${locale}${pathname}`, req.url));
  res.cookies.set("NEXT_LOCALE", locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  return res;
}

export const config = { matcher: ["/:path*"] };
