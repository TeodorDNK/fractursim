// src/app/[locale]/contact/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import { isLocale, type Locale } from "@/i18n/routing";
import { getMessages } from "@/i18n/get-messages";
import { buildPageMetadata } from "@/seo/meta";
import ContactForm from "@/components/ContactForm"; // dacă ai deja un component de form, altfel lasă-l gol

type ParamsP = { params: Promise<{ locale: string }> };

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

// SEO
export async function generateMetadata({ params }: ParamsP): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? (raw as Locale) : "ro";
  const t = await getMessages(locale);

  return buildPageMetadata({
    locale,
    pathname: "/contact",
    title: t.meta?.contact?.title ?? "Contact – Fracturism",
    description:
      t.meta?.contact?.description ??
     "Contactează echipa Fracturism pentru colaborări, expoziții și dialog artistic.",
  });
}

// JSON-LD helper
function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? (raw as Locale) : "ro";
  const t = await getMessages(locale);

  // Extragerea textelor din i18n
  const title = t.contact?.title ?? "Contact";
  const subtitle =
    t.contact?.subtitle ??
    "Pentru colaborări, expoziții sau interviuri, ne poți scrie direct.";
  const formTitle = t.contact?.formTitle ?? "Trimite-ne un mesaj";
  const namePlaceholder = t.contact?.form?.namePlaceholder ?? "Nume";
  const emailPlaceholder = t.contact?.form?.emailPlaceholder ?? "Email";
  const messagePlaceholder = t.contact?.form?.messagePlaceholder ?? "Mesaj";
  const submitButton = t.contact?.form?.submit ?? "Trimite";

  const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://fracturism.tld";
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: title,
    description: subtitle,
    inLanguage: locale,
    url: `${SITE}/${locale}/contact`,
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
            {subtitle}
          </p>
        </header>

        <main className="px-6 pb-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Imaginea de profil */}
            <div className="flex justify-center">
              <div className="relative rounded-xl overflow-hidden border border-white/20 shadow-lg max-w-sm">
                <Image
                  src="/images/profil.webp"
                  alt="Portret Fracturism"
                  width={600}
                  height={600}
                  className="object-cover"
                />
              </div>
            </div>

            {/* Formular de contact */}
            <div>
              <h2
                className="font-[var(--font-arhaic)] text-2xl mb-4"
                style={{ color: "var(--color-theme-accent)" }}
              >
                {formTitle}
              </h2>

              {ContactForm ? (
                <ContactForm />
              ) : (
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder={namePlaceholder}
                    className="w-full bg-black/20 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--color-theme-accent)]"
                    required
                  />
                  <input
                    type="email"
                    placeholder={emailPlaceholder}
                    className="w-full bg-black/20 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--color-theme-accent)]"
                    required
                  />
                  <textarea
                    placeholder={messagePlaceholder}
                    rows={5}
                    className="w-full bg-black/20 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--color-theme-accent)]"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg border border-white/30 bg-black/30 hover:bg-black/50 text-white transition"
                  >
                    {submitButton}
                  </button>
                </form>
              )}

              <div className="mt-8 text-sm text-zinc-300 space-y-1">
                <p>
                  {t.contact?.social?.email ?? "Email"}:{" "}
                  <a href="mailto:contact@fracturism.tld" className="underline">
                    contact@fracturism.tld
                  </a>
                </p>
                <p>
                  {t.contact?.social?.instagram ?? "Instagram"}:{" "}
                  <a
                    href="https://www.instagram.com/resume_cloud_official"
                    target="_blank"
                    className="underline"
                  >
                    @resume_cloud_official
                  </a>
                </p>
                <p>
                  {t.contact?.social?.facebook ?? "Facebook"}:{" "}
                  <a
                    href="https://www.facebook.com/share/17VSijXPsq/?mibextid=wwXIfr"
                    target="_blank"
                    className="underline"
                  >
                    Fracturism
                  </a>
                </p>
              </div>
            </div>
          </div>
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