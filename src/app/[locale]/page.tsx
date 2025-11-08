// src/app/[locale]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, locales, type Locale } from "@/i18n/routing";
import { getMessages } from "@/i18n/get-messages";
import ContactForm from "@/components/ContactForm";
import { buildPageMetadata } from "@/seo/meta";

/** Pictograme/ornamente colorabile la culoarea textului (accent) */
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

type ParamsP = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: ParamsP) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? (raw as Locale) : "ro";
  const t = await getMessages(locale);

  return buildPageMetadata({
    locale,
    pathname: "/",
    title: t.meta?.home?.title ?? "Fracturism – Arta rupturii",
    description: t.meta?.home?.description ?? "Un curent fondat de Teodor G. Dinică. Frumusețea imperfecțiunii.",
  });
}
/** Coloanele laterale cu „crengi” */
const FrameColumn = ({ position }: { position: "left" | "right" }) => {
  const ornamentUrl = "/images/floare.png"; // local, colorăm cu TintedIcon

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

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? (raw as Locale) : "ro";
  const t = await getMessages(locale);

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#1a404d] text-zinc-200">
      {/* ----- COLANA STÂNGĂ ----- */}
      <FrameColumn position="left" />

      {/* ----- CONȚINUT (transparent, fără panou alb) ----- */}
      <div className="max-w-5xl w-full shadow-none bg-transparent">
        {/* ----- HEADER ----- */}
        <header className="py-10 md:py-16 text-center">
          <p className="font-[var(--font-arhaic)] text-4xl md:text-5xl mb-4">
            <Link href={`/${locale}`} className="hover:text-white">
              {t.home?.siteTitle ?? "Fracturism.art"}
            </Link>
          </p>
          <nav>
            <Link
              href={`/${locale}/artistul`}
              className="uppercase tracking-widest text-sm text-zinc-300 hover:text-white"
            >
              {t.home?.sections?.artist?.title ?? "Artistul"}
            </Link>
          </nav>
        </header>

        {/* ----- SECȚIUNEA PRINCIPALĂ (POSTĂRI) ----- */}
        <main>
          <section className="max-w-5xl mx-auto px-6 py-16 border-t border-b border-white/20">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Post 1: Manifest */}
              <div className="text-center">
                <h2 className="font-[var(--font-arhaic)] text-3xl mb-3">
                  <Link href={`/${locale}/manifest`} className="hover:text-white">
                    {t.home?.sections?.manifest?.title ??
                      "Manifestul Fracturism"}
                  </Link>
                </h2>
                <p className="font-serif text-zinc-200">
                  {t.home?.sections?.manifest?.description ??
                    "Ce este Fracturismul? Este ruptură. Este reacție..."}
                  <Link
                    href={`/${locale}/manifest`}
                    className="text-white font-semibold ml-1"
                  >
                    Citește mai mult.
                  </Link>
                </p>
              </div>

              {/* Separator (tintat la accent) */}
              <div className="flex justify-center">
                <TintedIcon
                  src="/images/separeu.png"
                  alt="Separator"
                  width={48}
                  height={48}
                />
              </div>

              {/* Post 2: Artist */}
              <div className="text-center">
                <h2 className="font-[var(--font-arhaic)] text-3xl mb-3">
                  <Link href={`/${locale}/artistul`} className="hover:text-white">
                    🜂 {t.home?.sections?.artist?.title ?? "Despre Artist"}
                  </Link>
                </h2>
                <p className="font-serif text-zinc-200">
                  {t.home?.sections?.artist?.description ??
                    "Teodor G. Dinică. Născut în Păunești, Vrancea..."}
                  <Link
                    href={`/${locale}/artistul`}
                    className="text-white font-semibold ml-1"
                  >
                    Citește mai mult.
                  </Link>
                </p>
              </div>
            </div>
          </section>

          {/* ----- SECȚIUNEA ARTIST (PORTRET) ----- */}
          <section className="py-20 px-6">
            <div className="grid md:grid-cols-3 gap-12 items-center max-w-5xl mx-auto">
              {/* Portret – nu îl colorăm */}
              <div className="md:col-span-1 flex justify-center">
                {/* folosim <img> simplu pentru a nu forța Next/Image aici */}
                <img
                  src="/images/profil.jpeg"
                  alt={t.home?.artistSection?.name ?? "Portret artist"}
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

              {/* Text Artist */}
              <div className="md:col-span-2 text-center md:text-left">
                <h2
                  className="font-[var(--font-arhaic)] text-4xl md:text-5xl"
                  style={{ color: "var(--color-theme-accent)" }}
                >
                  {t.home?.artistSection?.name ?? "Teodor G. Dinică"}
                </h2>
                <p className="font-serif text-lg text-zinc-200 mt-4">
                  {t.home?.artistSection?.subtitle ??
                    "Fracturism – Beyond Perfection, Within the Cracks"}
                </p>
                <div className="mt-6">
                  <Link
                    href={`/${locale}/artistul`}
                    className="uppercase tracking-widest text-sm text-zinc-300 hover:text-white"
                  >
                    {t.home?.artistSection?.cta ?? "Autorul"}
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ----- SECȚIUNEA CITAT ----- */}
          <section className="py-20">
            <blockquote className="text-center max-w-2xl mx-auto px-6">
              <p
                className="font-[var(--font-arhaic)] text-3xl md:text-4xl"
                style={{ color: "var(--color-theme-accent)" }}
              >
                {t.home?.quote?.text ??
                  "„Fracturism – A New Language of Fragments”"}
              </p>
              <cite className="font-serif text-lg text-zinc-200 not-italic block mt-4">
                — {t.home?.quote?.author ?? "Teodor G. Dinică"}
              </cite>
            </blockquote>
          </section>

          {/* ----- SECȚIUNEA ESEURI ----- */}
          <section className="py-20">
            <div className="text-center max-w-3xl mx-auto px-6">
              <TintedIcon
                src="/images/ornament.png"
                alt="Detaliu ornamental"
                width={160}
                height={36}
                className="mx-auto mb-6"
              />
              <h2 className="font-[var(--font-arhaic)] text-4xl md:text-5xl mb-12">
                {t.home?.essays?.title ?? "Eseuri"}
              </h2>

              <div className="space-y-8">
                <div>
                  <h3 className="font-[var(--font-arhaic)] text-2xl">
                    <Link
                      href={`/${locale}/artistul`}
                      className="hover:text-white"
                    >
                      🜂 {t.home?.sections?.artist?.title ?? "Despre Artist"}
                    </Link>
                  </h3>
                  <time className="font-serif text-sm text-zinc-300">
                    {t.home?.essays?.artistDate ?? "Oct 21, 2025"}
                  </time>
                </div>
                <div>
                  <h3 className="font-[var(--font-arhaic)] text-2xl">
                    <Link
                      href={`/${locale}/manifest`}
                      className="hover:text-white"
                    >
                      {t.home?.sections?.manifest?.title ??
                        "Manifestul Fracturism"}
                    </Link>
                  </h3>
                  <time className="font-serif text-sm text-zinc-300">
                    {t.home?.essays?.manifestDate ?? "Oct 19, 2025"}
                  </time>
                </div>
              </div>

              <div className="mt-12">
                <Link
                  href={`/${locale}/noutati`}
                  className="uppercase tracking-widest text-sm text-zinc-300 hover:text-white"
                >
                  {t.home?.essays?.ctaAll ?? "Citește tot"}
                </Link>
              </div>
            </div>
          </section>

          {/* ----- FORMULAR CONTACT ----- */}
          <ContactForm t={t.contact} />
        </main>

        {/* ----- FOOTER ----- */}
        <footer className="py-16 border-t border-white/20">
          <div className="text-center max-w-5xl mx-auto px-6">
            <p
              className="font-[var(--font-arhaic)] text-2xl"
              style={{ color: "var(--color-theme-accent)", lineHeight: "0" }}
            >
              ✦
            </p>
            <div className="grid md:grid-cols-3 gap-6 items-center my-8">
              <p className="font-serif text-zinc-200">
                {t.footer?.textLeft ?? "Fracturism – Beauty in Broken Patterns"}
              </p>
              <TintedIcon
                src="/images/moneda.png"
                alt="Medalion"
                width={96}
                height={96}
                className="mx-auto"
              />
              <p className="font-serif text-zinc-200">
                {t.footer?.textRight ?? "Fracturism – Art from the Rupture"}
              </p>
            </div>
            <p
              className="font-[var(--font-arhaic)] text-2xl"
              style={{ color: "var(--color-theme-accent)", lineHeight: "0" }}
            >
              ✦
            </p>
          </div>
        </footer>
      </div>

      {/* ----- COLANA DREAPTĂ ----- */}
      <FrameColumn position="right" />
    </div>
  );
}