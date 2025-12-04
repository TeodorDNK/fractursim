// src/app/[locale]/moda-design/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/routing";
import { getMessages } from "@/i18n/get-messages";
import { buildPageMetadata } from "@/seo/meta";

type ParamsP = { params: Promise<{ locale: string }> };

function TintedIcon({
  src,
  width,
  height,
  alt,
  className,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={alt}
      className={className}
      style={{
        display: "inline-block",
        width,
        height,
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

const FrameColumn = ({ position }: { position: "left" | "right" }) => {
  const ornamentUrl = "/images/floare.png";
  const borderStyle =
    position === "left"
      ? { borderLeft: "5px solid var(--color-theme-accent)", borderRight: "2px solid var(--color-theme-accent)" }
      : { borderRight: "5px solid var(--color-theme-accent)", borderLeft: "2px solid var(--color-theme-accent)" };
  const topTransform = position === "left" ? "none" : "scaleX(-1)";
  const bottomTransform = position === "left" ? "scaleY(-1)" : "scale(-1, -1)";
  return (
    <div
      className="hidden md:flex flex-col justify-between p-5"
      style={{ minHeight: "100vh", flexBasis: "100px", flexShrink: 0 }}
    >
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
    pathname: "/moda-design",
    // Fallback-uri generice (Engleză)
    title: t?.meta?.fashion?.title ?? "Fashion & Design – Fracturism",
    description:
      t?.meta?.fashion?.description ??
      "Capsule collections, objects, and textiles influenced by the Fracturist language.",
  });
}

function JsonLd({ data }: { data: Record<string, any> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

type Collection = {
  slug: string;
  title: string;
  blurb: string;
  cover: string;
  season?: string;
};

type Look = {
  src: string;
  alt: string;
  caption?: string;
};

export default async function FashionDesignPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? (raw as Locale) : "ro";
  const t = await getMessages(locale);
  
  // Extragerea conținutului i18n
  const fashionContent = t?.fashion;
  const title = fashionContent?.title ?? "Fashion & Design";
  const dek = fashionContent?.subtitle ?? "Fractured forms, ornamental rhythm, and natural materials—applied to fashion, objects, and space.";
  const collections: Collection[] = (fashionContent?.collections as Collection[]) ?? [];
  const sectionTitleCollections = fashionContent?.sectionTitleCollections ?? "Collections";
  const sectionTitleMaterials = fashionContent?.sectionTitleMaterials ?? "Materials & Process";
  const sectionTitleLookbook = fashionContent?.sectionTitleLookbook ?? "Lookbook";
  const linkTextCollection = fashionContent?.linkTextCollection ?? "View collection →";
  const materialsList: string[] = (fashionContent?.materialsList as string[]) ?? [];
  const ctaText = fashionContent?.ctaText ?? "Looking for collaboration or special editions?";
  const ctaLink = fashionContent?.ctaLink ?? "Write to us →";


  const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://fracturism.tld";
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    inLanguage: locale,
    url: `${SITE}/${locale}/moda-design`,
    description: dek,
    hasPart: collections.map((c) => ({
      "@type": "CreativeWork",
      name: c.title,
      description: c.blurb,
      url: `${SITE}/${locale}/moda-design/${c.slug}`,
      image: `${SITE}${c.cover}`,
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

        <main className="px-6 pb-16 space-y-16">
          {/* Colecții */}
          <section>
            <h2 className="font-[var(--font-arhaic)] text-2xl mb-6" style={{ color: "var(--color-theme-accent)" }}>
              {sectionTitleCollections}
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {collections.map((c) => (
                <article key={c.slug} className="rounded-xl border border-white/15 bg-black/10 backdrop-blur hover:bg-black/20 transition">
                  <Link href={`/${locale}/moda-design/${c.slug}`} className="block group">
                    <div className="relative w-full overflow-hidden rounded-t-xl bg-black/10 flex items-center justify-center h-[220px] sm:h-[260px] lg:h-[300px]">
                      <img
                        src={c.cover}
                        alt={c.title}
                        className="max-h-full max-w-full h-auto w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                        draggable={false}
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-sm text-zinc-400">{c.season ?? fashionContent?.defaultSeasonTag ?? "Capsule"}</p>
                      <h3 className="font-[var(--font-arhaic)] text-xl mt-1" style={{ color: "var(--color-theme-accent)" }}>
                        {c.title}
                      </h3>
                      <p className="mt-2 font-serif text-zinc-100 line-clamp-3">{c.blurb}</p>
                      <span className="mt-3 inline-block text-sm underline underline-offset-4 text-zinc-300">{linkTextCollection}</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>

          {/* Lookbook (Sectiune comentata in codul original, pastram titlul i18n pentru viitor) */}
          <section>
            <h2 className="font-[var(--font-arhaic)] text-2xl mb-6" style={{ color: "var(--color-theme-accent)" }}>
              {sectionTitleLookbook}
            </h2>
            {/* Aici ar veni logica de mapare a array-ului 'looks' dacă ar fi activ */}
          </section>

          {/* Materiale & Proces */}
          <section>
            <h2 className="font-[var(--font-arhaic)] text-2xl mb-4" style={{ color: "var(--color-theme-accent)" }}>
              {sectionTitleMaterials}
            </h2>
            <div className="rounded-xl border border-white/15 bg-black/10 p-6 font-serif leading-relaxed text-zinc-100">
              <ul className="list-disc pl-5 space-y-2">
                {materialsList.length > 0 ? (
                    materialsList.map((item, i) => <li key={i}>{item}</li>)
                ) : (
                    <li>{fashionContent?.defaultMaterialItem ?? "No material information available."}</li>
                )}
              </ul>
            </div>
          </section>

          <section className="text-center">
            <p className="font-serif text-lg text-zinc-100">{ctaText}</p>
            <Link href={`/${locale}/contact`} className="mt-4 inline-block px-6 py-3 rounded-lg border border-white/30 bg-black/30 hover:bg-black/50 text-white transition">
              {ctaLink}
            </Link>
          </section>
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