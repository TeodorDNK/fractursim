// src/app/[locale]/galerie/[slug]/page.tsx
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/seo/meta";
import { getBySlug } from "@/content/gallery";

type ParamsP = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: ParamsP): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? (raw as Locale) : "ro";
  const item = getBySlug(locale, slug);

  const title = item ? `${item.title} – Galerie` : "Galerie";
  const description = item?.caption ?? "Detaliu lucrare Fracturism.";

  // metadatele de bază (fără "images")
  const base = buildPageMetadata({
    locale,
    pathname: `/galerie/${slug}`,
    title,
    description,
  });

  // completăm cu imagini pentru OG/Twitter dacă există item
  const ogImage = item ? [{ url: item.src }] : undefined;
  const twImage = item ? [item.src] : undefined;

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      images: ogImage,
    },
    twitter: {
      ...base.twitter,
      images: twImage,
    },
  };
}

function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function GalleryItemPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? (raw as Locale) : "ro";
  const item = getBySlug(locale, slug);

  if (!item) {
    return (
      <div className="min-h-[60vh] grid place-items-center p-10">
        <p>Lucrarea nu a fost găsită.</p>
      </div>
    );
  }

  const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://fracturism.tld";
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: item.title,
    description: item.caption,
    inLanguage: locale,
    contentUrl: `${SITE}${item.src}`,
    url: `${SITE}/${locale}/galerie/${slug}`,
  };

  return (
    <div className="min-h-screen w-full bg-[#1a404d] text-zinc-200">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <JsonLd data={jsonld} />

        <h1
          className="font-[var(--font-arhaic)] text-4xl mb-4"
          style={{ color: "var(--color-theme-accent)" }}
        >
          {item.title}
        </h1>

        <div
          className="relative w-full mb-6"
          style={{ aspectRatio: "3/2", maxHeight: "80vh", overflow: "hidden" }}
        >
          <img
            src={item.src}
            alt={item.title}
            className="absolute inset-0 h-full w-full object-contain bg-black/10"
          />
        </div>

        <p className="font-serif text-lg leading-relaxed">{item.caption}</p>
      </div>
    </div>
  );
}
