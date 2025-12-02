// src/app/[locale]/noutati/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/routing";
import { getMessages } from "@/i18n/get-messages";
import { buildPageMetadata } from "@/seo/meta";

type ParamsP = { params: Promise<{ locale: string }> };

/** pictogramă colorabilă la accent */
function TintedIcon({
  src, width, height, alt, className,
}: { src: string; width: number; height: number; alt: string; className?: string }) {
  return (
    <span
      role="img"
      aria-label={alt}
      className={className}
      style={{
        display: "inline-block",
        width, height,
        backgroundColor: "var(--color-theme-accent)",
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

/** coloane laterale ornament */
const FrameColumn = ({ position }: { position: "left" | "right" }) => {
  const ornamentUrl = "/images/floare.png";
  const borderStyle =
    position === "left"
      ? { borderLeft: "5px solid var(--color-theme-accent)", borderRight: "2px solid var(--color-theme-accent)" }
      : { borderRight: "5px solid var(--color-theme-accent)", borderLeft: "2px solid var(--color-theme-accent)" };
  const topTransform = position === "left" ? "none" : "scaleX(-1)";
  const bottomTransform = position === "left" ? "scaleY(-1)" : "scale(-1, -1)";
  return (
    <div className="hidden md:flex flex-col justify-between p-5" style={{ minHeight: "100vh", flexBasis: "100px", flexShrink: 0 }}>
      <figure className={position === "right" ? "self-end" : "self-start"} style={{ transform: topTransform as any }}>
        <TintedIcon src={ornamentUrl} alt="Ornament" width={60} height={60} />
      </figure>
      <div className="flex-1 w-2 mx-auto my-[-3px]" style={borderStyle} />
      <figure className={position === "right" ? "self-end" : "self-start"} style={{ transform: bottomTransform as any }}>
        <TintedIcon src={ornamentUrl} alt="Ornament" width={60} height={60} />
      </figure>
    </div>
  );
};

// SEO
export async function generateMetadata({ params }: ParamsP): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? (raw as Locale) : "ro";
  const t = await getMessages(locale);

  return buildPageMetadata({
    locale,
    pathname: "/noutati",
    title: t?.meta?.news?.title ?? "Noutăți – Fracturism",
    description: t?.meta?.news?.description ?? "Noutăți, articole și anunțuri din lumea Fracturismului.",
  });
}

// JSON-LD helper
function JsonLd({ data }: { data: Record<string, any> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  cover?: string;
  readingTime?: string;
};

// Card cu imagine integrală (fără tăiere)
function NewsCard({ item, locale }: { item: NewsItem; locale: string }) {
  return (
    <article className="rounded-xl border border-white/15 bg-black/10 backdrop-blur hover:bg-black/20 transition">
      <Link href={`/${locale}/noutati/${item.slug}`} className="block">
        {item.cover ? (
          <div className="relative w-full overflow-hidden rounded-t-xl bg-black/10 flex items-center justify-center h-[200px] sm:h-[220px] lg:h-[240px]">
            <img
              src={item.cover}
              alt={item.title}
              className="max-h-full max-w-full h-auto w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
              draggable={false}
            />
          </div>
        ) : null}

        <div className="p-5">
          <h3 className="font-[var(--font-arhaic)] text-2xl leading-tight" style={{ color: "var(--color-theme-accent)" }}>
            {item.title}
          </h3>
          <p className="mt-2 text-sm text-zinc-300">
            {new Date(item.date).toLocaleDateString(locale, { year: "numeric", month: "long", day: "2-digit" })}
            {item.readingTime ? ` • ${item.readingTime}` : ""}
          </p>
          <p className="mt-3 font-serif text-zinc-100 line-clamp-3">{item.excerpt}</p>
          <span className="mt-4 inline-block text-sm underline underline-offset-4 text-zinc-300">
            Citește mai mult →
          </span>
        </div>
      </Link>
    </article>
  );
}

export default async function NewsIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? (raw as Locale) : "ro";
  const t = await getMessages(locale);

  const title = t?.news?.title ?? "Noutăți";
  const dek = t?.news?.subtitle ?? "Articole, anunțuri și gânduri despre Fracturism.";

  const items: NewsItem[] =
    (Array.isArray(t?.news?.items) &&
      (t.news.items as any[]).map((x, i) => ({
        slug: x.slug ?? `articol-${i + 1}`,
        title: x.title ?? `Articol ${i + 1}`,
        excerpt: x.excerpt ?? "Rezumat scurt al articolului. În câteva rânduri, conține ideea principală.",
        date: x.date ?? new Date().toISOString(),
        cover: x.cover ?? "/images/ornament.png",
        readingTime: x.readingTime ?? "4 min",
      }))) || [
      { slug: "manifest-si-ruptura", title: "Manifest și ruptură: un limbaj vizual viu", excerpt: "Cum transformă Fracturismul tensiunea dintre ordine și accident într-un manifest plastic coerent.", date: "2025-10-01", cover: "/images/1.jpg", readingTime: "5 min" },
      { slug: "ateliere-si-intalniri", title: "Ateliere și întâlniri deschise", excerpt: "Programul atelierelor din toamnă: exerciții practice, discuții despre compoziție și ritm fracturat.", date: "2025-10-18", cover: "/images/2.jpg", readingTime: "3 min" },
      { slug: "povestea-unui-ornament", title: "Povestea unui ornament", excerpt: "Din fisură în motiv recurent: traseul unei forme care își găsește locul într-o serie.", date: "2025-11-01", cover: "/images/3.jpg", readingTime: "4 min" },
    ];

  // JSON-LD ca ItemList cu NewsArticle
  const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://fracturism.tld";
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "NewsArticle",
        headline: it.title,
        datePublished: it.date,
        inLanguage: locale,
        url: `${SITE}/${locale}/noutati/${it.slug}`,
        image: it.cover ? [`${SITE}${it.cover}`] : undefined,
        description: it.excerpt,
      },
    })),
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#1a404d] text-zinc-200">
      <FrameColumn position="left" />

      <div className="max-w-6xl w-full bg-transparent">
        <JsonLd data={jsonld} />

        <header className="py-10 md:py-16 text-center">
          <h1 className="font-[var(--font-arhaic)] text-4xl md:text-5xl">{title}</h1>
          <p className="font-serif text-lg text-zinc-300 mt-2 max-w-3xl mx-auto">{dek}</p>
        </header>

        <main className="px-6 pb-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it) => (
              <NewsCard key={it.slug} item={it} locale={locale} />
            ))}
          </div>
        </main>

        <footer className="py-12 border-t border-white/20">
          <div className="text-center max-w-6xl mx-auto px-6">
            <p className="font-[var(--font-arhaic)] text-2xl" style={{ color: "var(--color-theme-accent)", lineHeight: "0" }}>
              ✦
            </p>
          </div>
        </footer>
      </div>

      <FrameColumn position="right" />
    </div>
  );
}
