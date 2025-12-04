// src/app/[locale]/galerie/[slug]/page.tsx
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/seo/meta";
import { getBySlug } from "@/content/gallery";
import { getMessages } from "@/i18n/get-messages";

type ParamsP = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: ParamsP): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? (raw as Locale) : "ro";
  const item = await getBySlug(locale, slug);
  const t = await getMessages(locale);

  // Preluare SEO personalizat din i18n
  const itemMessages = t.gallery?.items?.[slug as any];
  
  const seoTitle = itemMessages?.seoTitle || 
    (item?.title ? `${item.title} – Galerie` : "Galerie");
  
  const seoDescription = itemMessages?.seoDescription ?? item?.caption 
    ?? t.galleryItem.defaultSeoDescription;


  // metadatele de bază (fără "images")
  const base = buildPageMetadata({
    locale,
    pathname: `/galerie/${slug}`,
    title: seoTitle,
    description: seoDescription,
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

/** * Helper pentru a afișa descrierea lungă (care poate include linii noi) 
 * ca o serie de paragrafe, îmbunătățind lizibilitatea.
 */
const LongDescriptionRenderer = ({ text }: { text: string }) => {
    // Împarte textul la liniile noi (\n) și creează paragrafe distincte.
    const paragraphs = text.split('\n').filter(p => p.trim() !== '');

    return (
        <div className="space-y-4">
            {paragraphs.map((p, index) => (
                <p key={index} className="font-serif text-base leading-relaxed text-zinc-300">
                    {p}
                </p>
            ))}
        </div>
    );
};


export default async function GalleryItemPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? (raw as Locale) : "ro";
  const item = await getBySlug(locale, slug);
const t = await getMessages(locale);
  if (!item) {
    return (
      <div className="min-h-[60vh] grid place-items-center p-10">
<p>{t.galleryItem.notFound}</p>      </div>
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
      <div className="max-w-4xl mx-auto px-6 py-8 md:py-16"> 
        <JsonLd data={jsonld} />

        {/* Titlu și imagine */}
        <header className="mb-6 md:mb-12">
          <h1
            className="font-[var(--font-arhaic)] text-3xl md:text-5xl mb-6" // Ajustat: text-3xl pe mobil
            style={{ color: "var(--color-theme-accent)" }}
          >
            {item.title}
          </h1>
          
          <div
            className="relative w-full rounded-lg shadow-2xl mt-4" // Ajustat: mt-4 sub titlu
            style={{ aspectRatio: "3/2", maxHeight: "80vh", overflow: "hidden" }}
          >
            <img
              src={item.src}
              alt={item.title}
              className="absolute inset-0 h-full w-full object-contain bg-black/10"
            />
          </div>
        </header>

        <main className="pt-6 md:pt-8"> 
          
          {/* Descrierea Scurtă (Caption) - evidențiată ca introducere */}
          <section className="mb-8 md:mb-10 p-4 border-l-4 border-[var(--color-theme-accent)] bg-black/10">  
            <p className="font-serif text-lg md:text-2xl italic leading-relaxed text-white"> 
              {item.caption}
            </p>
          </section>

          {/* Descrierea Lungă (Long Description) - detaliile clare */}
          <section className="mt-8 md:mt-12"> 
            <h2 
                className="font-[var(--font-arhaic)] text-2xl md:text-3xl mb-4 border-b border-white/20 pb-2" // Ajustat: text-2xl pe mobil, mb-4
                style={{ color: "var(--color-theme-accent)" }}
             >
{t.galleryItem.sectionTitle}
             </h2>
             
             {/* Aici folosim noul helper pentru a formata textul lung */}
            <LongDescriptionRenderer text={item.longDescription} />
          </section>
        </main>
      </div>
    </div>
  );
}