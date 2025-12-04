// src/app/[locale]/artistul/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/routing";
import { getMessages } from "@/i18n/get-messages";
import { buildPageMetadata } from "@/seo/meta";

/** pictogramă colorabilă la accent */
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

/** coloane laterale ornament */
const FrameColumn = ({ position }: { position: "left" | "right" }) => {
  const ornamentUrl = "/images/floare.png";
  const borderStyle =
    position === "left"
      ? {
          borderLeft: "5px solid var(--color-theme-accent)",
          borderRight: "2px solid var(--color-theme-accent)",
        }
      : {
          borderRight: "5px solid var(--color-theme-accent)",
          borderLeft: "2px solid var(--color-theme-accent)",
        };
  const topTransform = position === "left" ? "none" : "scaleX(-1)";
  const bottomTransform = position === "left" ? "scaleY(-1)" : "scale(-1, -1)";
  return (
    <div
      className="hidden md:flex flex-col justify-between p-5"
      style={{
        minHeight: "100vh",
        flexBasis: "100px",
        flexShrink: 0,
      }}
    >
      <figure
        className={position === "right" ? "self-end" : "self-start"}
        style={{ transform: topTransform as any }}
      >
        <TintedIcon src={ornamentUrl} alt="Ornament" width={60} height={60} />
      </figure>
      <div
        className="flex-1 w-2 mx-auto my-[-3px]"
        style={borderStyle}
      />
      <figure
        className={position === "right" ? "self-end" : "self-start"}
        style={{ transform: bottomTransform as any }}
      >
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

  // Folosind t.meta?.artist
  return buildPageMetadata({
    locale,
    pathname: "/artistul",
    title: t.meta.artist?.title ?? "Teodor G. Dinică – Artistul",
    description:
      t.meta.artist?.description ??
      "Autorul Fracturismului. Biografie, viziune și lucrări.",
  });
}

// JSON-LD helper inlined (evităm importuri suplimentare)
function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? (raw as Locale) : "ro";
  const t = await getMessages(locale);

  // Extragerea textelor din i18n cu fallback-uri
  const title = t.artist?.title ?? "Teodor G. Dinică";
  const subtitle =
    t.artist?.subtitle ?? "Fracturism – Beyond Perfection, Within the Cracks";
  const bioP1 =
    t.artist?.bio?.p1 ??
    "Teodor G. Dinică este artistul și fondatorul curentului Fracturism – o explorare a frumuseții din ruptură, a ordinii care se naște din fisuri.";
  const bioP2 =
    t.artist?.bio?.p2 ??
    "Născut în Păunești, Vrancea, crescut între materie brută și poezie vizuală, își orientează practica către compoziții fragmentare, texturi stratificate și tensiuni controlate.";
  const bioP3 =
    t.artist?.bio?.p3 ??
    "În lucrările sale, „defectul” devine limbaj, iar accidentul – metodă. Fractura e tratată ca resursă, nu ca piedică.";
  const themesTitle = t.artist?.themesTitle ?? "Teme & preocupări";
  const themes = t.artist?.themes ?? [
    "Frumusețea imperfecțiunii",
    "Texturi fracturate și compoziții stratificate",
    "Ordinea care răsare din haos",
  ];
  const timelineTitle = t.artist?.timelineTitle ?? "Repere";
  const timeline = t.artist?.timeline ?? [
    {
      year: "2018–2020",
      text: "Explorări în compoziții fragmentare și mixed-media.",
    },
    {
      year: "2021–2023",
      text: "Consolidarea limbajului vizual Fracturist.",
    },
    {
      year: "2024–prezent",
      text: "Serii tematice: ruptură, cicatrizare, memorie materială.",
    },
  ];
  const quoteText =
    t.artist?.quote?.text ?? "„Fracturism – A New Language of Fragments.”";
  const quoteAuthor = t.artist?.quote?.author ?? "Teodor G. Dinică";
  const ctaManifest = t.artist?.ctaManifest ?? "Manifestul Fracturism";
  const ctaGallery = t.artist?.ctaGallery ?? "Vezi Galeria";

  // JSON-LD Person
  const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://fracturism.tld";
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": title,
    "jobTitle": "Artist vizual",
    "url": `${SITE}/${locale}/artistul`,
    "knowsAbout": ["Fracturism", "Artă contemporană", "Compoziție", "Textură"],
    "image": `${SITE}/images/profil.webp`,
    "description": subtitle,
    "nationality": "RO",
    "sameAs": [`${SITE}/${locale}/manifest`, `${SITE}/${locale}/galerie`],
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#1a404d] text-zinc-200">
      <FrameColumn position="left" />

      <div className="max-w-5xl w-full shadow-none bg-transparent">
        {/* JSON-LD */}
        <JsonLd data={personJsonLd} />

        {/* header de pagină */}
        <header className="py-10 md:py-16 text-center">
          <h1 className="font-[var(--font-arhaic)] text-4xl md:text-5xl">
            {title}
          </h1>
          <p className="font-serif text-lg text-zinc-300 mt-2">{subtitle}</p>
        </header>

        <main>
          {/* secțiune portret + bio */}
          <section className="max-w-5xl mx-auto px-6 py-12 border-t border-b border-white/20">
            <div className="grid md:grid-cols-3 gap-12 items-start">
              {/* Portret */}
              <div className="md:col-span-1 flex justify-center">
                <img
                  src="/images/profil.webp"
                  alt={title}
                  width={295}
                  height={393}
                  style={{
                    width: "100%",
                    maxWidth: 295,
                    height: "auto",
                    border: "5px solid var(--color-theme-accent)",
                    borderRadius: 120,
                    aspectRatio: "3 / 4",
                    objectFit: "cover",
                  }}
                />
              </div>

              {/* Bio */}
              <div className="md:col-span-2 font-serif text-[17px] leading-relaxed">
                <p className="mb-4">{bioP1}</p>
                <p className="mb-4">{bioP2}</p>
                <p className="mb-4">{bioP3}</p>

                {/* teme */}
                <div className="mt-6">
                  <h2
                    className="font-[var(--font-arhaic)] text-2xl mb-3"
                    style={{ color: "var(--color-theme-accent)" }}
                  >
                    {themesTitle}
                  </h2>
                  <ul className="list-disc pl-5 space-y-1">
                    {themes.map((th: string, i: number) => (
                      <li key={i}>{th}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* timeline minimalist (doar ornamentul modificat) */}
          <section className="py-16 px-6">
            <div className="max-w-4xl mx-auto">
              {/* ornament centrat și mai mare */}
              <div className="flex justify-center mb-8">
                <TintedIcon
                  src="/images/ornament.png"
                  alt="Ornament"
                  width={480} // ← ajustezi dimensiunea aici
                  height={110} // ← și aici
                  className="opacity-90"
                />
              </div>

              <h2 className="font-[var(--font-arhaic)] text-3xl text-center mb-10">
                {timelineTitle}
              </h2>

              <div className="space-y-6">
                {timeline.map((it: any, idx: number) => (
                  <div key={idx} className="grid grid-cols-[110px_1fr] gap-4">
                    <div className="text-zinc-400">{it.year}</div>
                    <div className="text-zinc-100">{it.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* citat */}
          <section className="py-12">
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
                href={`/${locale}/manifest`}
                className="uppercase tracking-widest text-sm border border-white px-5 py-3 rounded hover:bg-white hover:text-black transition"
              >
                {ctaManifest}
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

        {/* footer decorativ al paginii */}
        <footer className="py-12 border-t border-white/20">
          <div className="text-center max-w-5xl mx-auto px-6">
            <p
              className="font-[var(--font-arhaic)] text-2xl"
              style={{ color: "var(--color-theme-accent)", lineHeight: "0" }}
            >
              ✦
            </p>
          </div>
        </footer>
      </div>

      <FrameColumn position="right" />
    </div>
  );
}