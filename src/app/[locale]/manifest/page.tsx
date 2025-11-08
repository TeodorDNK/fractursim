// src/app/[locale]/manifest/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/routing";
import { getMessages } from "@/i18n/get-messages";
import { buildPageMetadata } from "@/seo/meta";

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

/** coloane laterale ornament (același pattern ca pe Artist) */
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

type ParamsP = { params: Promise<{ locale: string }> };

// --- SEO (hreflang/canonical/OG) ---
export async function generateMetadata({ params }: ParamsP): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? (raw as Locale) : "ro";
  const t = await getMessages(locale);

  return buildPageMetadata({
    locale,
    pathname: "/manifest",
    title: t.meta?.manifest?.title ?? "Manifestul Fracturism",
    description: t.meta?.manifest?.description ?? "Principiile, viziunea și limbajul Fracturismului.",
  });
}

// JSON-LD helper inlined
function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function ManifestPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? (raw as Locale) : "ro";
  const t = await getMessages(locale);

  // i18n content (cu fallbackuri elegante)
  const title = t.manifest?.title ?? "Manifestul Fracturism";
  const dek =
    t.manifest?.subtitle ??
    "Fractura ca resursă. Ordinea din crăpătură. Frumusețea imperfecțiunii.";

  const introP =
    t.manifest?.intro ??
    "Fracturismul propune o schimbare de perspectivă: în loc să ascundă fisurile, le face vizibile și fertile, transformând accidentul în metodă și imperfecțiunea în material expresiv.";

  const paragraphs: string[] =
    t.manifest?.paragraphs ?? [
      "Ruptura nu este un sfârșit, ci un început al formelor care se rearanjează. Din tensiunea dintre fragmente răsare o nouă coerență.",
      "Materiile imperfecte, texturile dubioase și discontinuitățile formale devin un alfabet. Ele vorbesc despre memorie, timp și cicatrizare.",
      "Fracturismul valorifică limitele ca granițe creative. Prin controlul hazardului, se construiesc compoziții ale autenticității.",
    ];

  const principles: string[] =
    t.manifest?.principles ?? [
      "Fractura e limbaj, nu defect.",
      "Accidentul e metodă, nu obstacol.",
      "Memoria materială contează.",
      "Ordinea se naște din tensiune.",
      "Imperfecțiunea are valoare estetică.",
    ];

  const quoteText = t.manifest?.quote?.text ?? "„Fracturism – A New Language of Fragments.”";
  const quoteAuthor = t.manifest?.quote?.author ?? "Teodor G. Dinică";

  const ctaArtist = t.manifest?.ctaArtist ?? "Artistul";
  const ctaGallery = t.manifest?.ctaGallery ?? "Vezi Galeria";

  // JSON-LD Article
  const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://fracturism.tld";
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "inLanguage": locale,
    "author": { "@type": "Person", "name": "Teodor G. Dinică" },
    "datePublished": "2025-01-01",
    "dateModified": "2025-01-01",
    "mainEntityOfPage": `${SITE}/${locale}/manifest`,
    "publisher": {
      "@type": "Organization",
      "name": "Fracturism",
      "logo": { "@type": "ImageObject", "url": `${SITE}/icon.png` }
    },
    "description": dek,
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#1a404d] text-zinc-200">
      <FrameColumn position="left" />

      <div className="max-w-5xl w-full shadow-none bg-transparent">
        {/* JSON-LD */}
        <JsonLd data={articleJsonLd} />

        {/* header */}
        <header className="py-10 md:py-16 text-center">
          {/* ornament centrat mare */}
          <div className="flex justify-center mb-6">
            <TintedIcon src="/images/ornament.png" alt="Ornament" width={420} height={96} className="opacity-90" />
          </div>

          <h1 className="font-[var(--font-arhaic)] text-4xl md:text-5xl">{title}</h1>
          <p className="font-serif text-lg text-zinc-300 mt-2 max-w-3xl mx-auto">{dek}</p>
        </header>

        <main>
          {/* conținut manifest */}
          <section className="max-w-5xl mx-auto px-6 py-12 border-t border-b border-white/20">
            <div className="prose prose-invert prose-zinc max-w-none">
              <p className="font-serif text-[17px] leading-relaxed">{introP}</p>

              {paragraphs.map((p, i) => (
                <p key={i} className="font-serif text-[17px] leading-relaxed mt-4">
                  {p}
                </p>
              ))}

              <h2
                className="font-[var(--font-arhaic)] text-2xl mt-8 mb-3"
                style={{ color: "var(--color-theme-accent)" }}
              >
                {t.manifest?.principlesTitle ?? "Principii"}
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-[17px]">
                {principles.map((pr, i) => (
                  <li key={i}>{pr}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* citat */}
          <section className="py-16">
            <blockquote className="text-center max-w-2xl mx-auto px-6">
              <p
                className="font-[var(--font-arhaic)] text-3xl md:text-4xl"
                style={{ color: "var(--color-theme-accent)" }}
              >
                {quoteText}
              </p>
              <cite className="font-serif text-lg text-zinc-200 not-italic block mt-4">
                — {quoteAuthor}
              </cite>
            </blockquote>
          </section>

          {/* CTA-uri */}
          <section className="py-10 px-6">
            <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/artistul`}
                className="uppercase tracking-widest text-sm border border-white px-5 py-3 rounded hover:bg-white hover:text-black transition"
              >
                {ctaArtist}
              </Link>
              <Link
                href={`/${locale}/galerie`}
                className="uppercase tracking-widest text-sm border border-white px-5 py-3 rounded hover:bg-white hover:text-black transition"
              >
                {ctaGallery}
              </Link>
            </div>
          </section>
        </main>

        {/* footer decorativ */}
        <footer className="py-12 border-t border-white/20">
          <div className="text-center max-w-5xl mx-auto px-6">
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
