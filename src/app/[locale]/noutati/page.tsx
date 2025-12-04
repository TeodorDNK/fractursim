import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/routing";
import { getMessages } from "@/i18n/get-messages";
import { buildPageMetadata } from "@/seo/meta";
import { getGalleryItems } from "@/content/gallery"; 

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
    <div className="hidden xl:flex flex-col justify-between p-5" style={{ minHeight: "100vh", flexBasis: "100px", flexShrink: 0 }}>
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

// SEO (Next.js Metadata)
export async function generateMetadata({ params }: ParamsP): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? (raw as Locale) : "ro";
  const t = await getMessages(locale);

  const baseMetadata = buildPageMetadata({
    locale,
    pathname: "/noutati",
    title: t?.meta?.news?.title ?? "Galerie | Lucrări Recente – Fracturism",
    description: t?.meta?.news?.description ?? "Descoperiți cele mai noi lucrări și piese de artă adăugate în galeria Fracturism. O colecție de imagini, sculpturi și compoziții vizuale unice.",
  });

  return {
    ...baseMetadata,
    keywords: ["Fracturism", "artă modernă", "galerie online", "lucrări recente", "pictură", "sculptură digitală"],
  };
}

// JSON-LD helper
function JsonLd({ data }: { data: Record<string, any> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

// Tipul de date pentru afișare
type NewsDisplayItem = {
  slug: string;
  title: string;
  excerpt: string; 
  cover: string; 
  linkText: string;
};

// Cardul adaptat (JSX compactat)
function NewsCard({ item, locale }: { item: NewsDisplayItem; locale: string }) {
  const itemHref = `/${locale}/galerie/${item.slug}`;

  return (
    <article className="rounded-xl border border-white/15 bg-black/10 backdrop-blur hover:bg-black/20 transition">
      <Link href={itemHref} className="block group">
        <div className="relative w-full overflow-hidden rounded-t-xl bg-black/10 flex items-center justify-center h-[200px] sm:h-[220px] lg:h-[240px]">
          <img alt={item.title} className="max-h-full max-w-full h-auto w-auto object-contain transition-transform duration-300 group-hover:scale-[1.05]" loading="lazy" draggable={false} src={item.cover} />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none flex items-center justify-center text-3xl font-[var(--font-arhaic)]" style={{ color: "var(--color-theme-accent)" }}>⇱</div>
        </div>
        <div className="p-5 text-center">
          <h3 className="font-[var(--font-arhaic)] text-2xl leading-tight" style={{ color: "var(--color-theme-accent)" }}>{item.title}</h3>
          <p className="mt-3 font-serif text-zinc-100 line-clamp-3 text-base/relaxed">{item.excerpt}</p>
          <span className="mt-4 inline-block text-sm underline underline-offset-4 text-zinc-300 group-hover:text-white transition">{item.linkText}</span>
        </div>
      </Link>
    </article>
  );
}

export default async function NewsIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? (raw as Locale) : "ro";
  const t = await getMessages(locale);

  const title = t?.news?.title ?? "Lucrări Recente";
  const dek = t?.news?.subtitle ?? "O selecție de lucrări din galerie, văzută ca noutăți.";
  
  const readMoreText = t.gallery?.readMore || "Află mai mult →";
  
  const galleryItems = await getGalleryItems(locale);
  
  const items: NewsDisplayItem[] = galleryItems.map(item => ({
    slug: item.slug,
    title: item.title,
    excerpt: item.caption,
    cover: item.src,
    linkText: readMoreText,
  }));


  // JSON-LD (Schema Markup)
  const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://fracturism.tld";
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Acasă", item: `${SITE}/${locale}`, },
          { "@type": "ListItem", position: 2, name: title, item: `${SITE}/${locale}/noutati`, },
        ],
      },
      {
        "@type": "CollectionPage", 
        name: title,
        description: dek,
        inLanguage: locale,
        url: `${SITE}/${locale}/noutati`,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: items.map((it, i) => ({
            "@type": "ListItem",
            position: i + 1, 
            item: {
              "@type": "CreativeWork", 
              name: it.title,
              description: it.excerpt,
              url: `${SITE}/${locale}/galerie/${it.slug}`, 
              image: `${SITE}${it.cover}`, 
              author: { "@type": "Person", name: "Fracturism", },
            },
          })),
        },
      },
    ],
  };


  return (
    
    <div className="min-h-screen w-full flex bg-[#1a404d] text-zinc-200">
      
      <FrameColumn position="left" />{/* Compactat pentru a elimina spațiul alb adiacent */}<div className="w-full bg-transparent">
        <JsonLd data={jsonld} />

        <header className="py-10 md:py-16 text-center px-6">
          <h1 className="font-[var(--font-arhaic)] text-4xl md:text-5xl">{title}</h1>
          <p className="font-serif text-lg text-zinc-300 mt-2 max-w-3xl mx-auto">{dek}</p>
        </header>

        
        <main className="px-6 pb-16">
          {/* Adăugat whitespace-nowrap pentru a omorî orice spațiu generat de randarea listei. */}
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto **whitespace-nowrap**">
            {/* Randare compactă pe o singură linie pentru a preveni spațiile generate de JSX */}
            {items.map((it) => <NewsCard key={it.slug} item={it} locale={locale} />)}
          </div>
        </main>

        <footer className="py-12 border-t border-white/20">
          <div className="text-center max-w-6xl mx-auto px-6">
            <p className="font-[var(--font-arhaic)] text-2xl" style={{ color: "var(--color-theme-accent)", lineHeight: "0" }}>
              ✦
            </p>
          </div>
        </footer>
      </div>{/* Compactat pentru a elimina spațiul alb adiacent */}<FrameColumn position="right" />
    </div>
  );
}