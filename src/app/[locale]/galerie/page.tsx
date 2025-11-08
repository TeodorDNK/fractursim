// src/app/[locale]/galerie/page.tsx
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/routing";
import { getMessages } from "@/i18n/get-messages";
import { buildPageMetadata } from "@/seo/meta";
import GalleryCarousel from "@/components/GalleryCarousel";
import { getGalleryItems } from "@/content/gallery";

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
      style={{ minHeight: "100vh", flexBasis: "100px", flexShrink: 0 }}
    >
      <figure
        className={position === "right" ? "self-end" : "self-start"}
        style={{ transform: topTransform as any }}
      >
        <TintedIcon src={ornamentUrl} alt="Ornament" width={60} height={60} />
      </figure>
      <div className="flex-1 w-2 mx-auto my-[-3px]" style={borderStyle} />
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

// SEO
export async function generateMetadata({ params }: ParamsP): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? (raw as Locale) : "ro";
  const t = await getMessages(locale);

  return buildPageMetadata({
    locale,
    pathname: "/galerie",
    title: t.meta?.gallery?.title ?? "Galerie – Fracturism",
    description:
      t.meta?.gallery?.description ??
      "Selecție de lucrări Fracturiste și poveștile lor.",
  });
}

// JSON-LD helper
function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? (raw as Locale) : "ro";
  const t = await getMessages(locale);

  const title = t.gallery?.title ?? "Galerie";
  const dek = t.gallery?.subtitle ?? "Lucrări selectate și poveștile lor.";

  // sursa unică de adevăr (are și slug pentru paginile detaliu)
  const items = getGalleryItems(locale);

  // JSON-LD
  const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://fracturism.tld";
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: title,
    inLanguage: locale,
    url: `${SITE}/${locale}/galerie`,
    hasPart: items.map((it) => ({
      "@type": "ImageObject",
      contentUrl: `${SITE}${it.src}`,
      name: it.title,
      description: it.caption,
    })),
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#1a404d] text-zinc-200">
      <FrameColumn position="left" />

      <div className="max-w-5xl w-full bg-transparent">
        <JsonLd data={jsonld} />

        <header className="py-10 md:py-16 text-center">
          <h1 className="font-[var(--font-arhaic)] text-4xl md:text-5xl">
            {title}
          </h1>
          <p className="font-serif text-lg text-zinc-300 mt-2 max-w-3xl mx-auto">
            {dek}
          </p>
        </header>

        <main className="px-6 pb-16">
          <GalleryCarousel items={items} locale={locale} />
        </main>

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
