import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/routing"; 
import { getMessages } from "@/i18n/get-messages"; 
import { buildPageMetadata } from "@/seo/meta";
import Link from "next/link";

// -----------------------------------------------------------
// 1. Definiția corectă a props-urilor (pentru a rezolva eroarea de tip)
interface CookiesPageProps {
  params: { 
    locale: string;
  };
}
// -----------------------------------------------------------

interface PolicySection {
  title: string;
  body: string | string[];
  subsections?: PolicySection[];
}

// SEO
export async function generateMetadata({ 
  params, 
}: CookiesPageProps): Promise<Metadata> { // Tipul aplicat aici
  const locale = isLocale(params.locale) ? (params.locale as Locale) : "ro";
  const t = await getMessages(locale);
  // Folosim noile chei de fallback
  const title = t.pages?.cookies?.metaTitle || t.legal?.cookies?.fallbackMetaTitle;
  const description = t.pages?.cookies?.metaDescription || t.legal?.cookies?.fallbackMetaDescription;

  return buildPageMetadata({
    locale,
    pathname: "/legal/cookies",
    title: title,
    description: description,
  });
}

// Renderizare Secțiune (componenta reutilizată)
const PolicySectionRenderer = ({ section, level = 2, baseIndex = 0 }: { section: PolicySection, level?: number, baseIndex?: number }) => {
  // Logică pentru formatarea indexului
  const index = baseIndex > 0 ? `${baseIndex}` : '';
  const titleContent = `${index} ${section.title}`.trim();
  const className = `font-bold mt-8 mb-4 ${level === 2 ? 'text-2xl md:text-3xl border-b pb-2' : 'text-xl md:text-2xl'}`;

  const renderHeading = () => {
    switch (level) {
      case 2:
        return <h2 className={className}>{titleContent}</h2>;
      case 3:
        return <h3 className={className}>{titleContent}</h3>;
      case 4:
        return <h4 className={className}>{titleContent}</h4>;
      case 5:
        return <h5 className={className}>{titleContent}</h5>;
      case 6:
        return <h6 className={className}>{titleContent}</h6>;
      default:
        return <h2 className={className}>{titleContent}</h2>;
    }
  };

  return (
    <section className="mb-8">
      {renderHeading()}
      
      {Array.isArray(section.body) ? (
        <ul className="list-disc list-inside space-y-3 pl-4 text-lg opacity-85">
          {section.body.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-lg opacity-90">{section.body}</p>
      )}

      {section.subsections && (
        <div className="pl-4 border-l border-[var(--primary)]/50 mt-6">
          {section.subsections.map((sub, i) => (
            <PolicySectionRenderer 
              key={i} 
              section={sub} 
              level={level < 6 ? (level + 1) : 6} 
              // Am ajustat baseIndex pentru recursivitate, ca la fișierul anterior
              baseIndex={baseIndex * 10 + i + 1} 
            />
          ))}
        </div>
      )}
    </section>
  );
};

// Componenta Principală a Paginii
export default async function CookiesPage({
  params,
}: CookiesPageProps) { // Tipul aplicat aici
  const locale = isLocale(params.locale) ? (params.locale as Locale) : "ro";
  const t = await getMessages(locale);
  
  const cookiesData = t.pages?.cookies;

  if (!cookiesData || !cookiesData.sections) {
    return (
      <main className="max-w-[1100px] mx-auto px-5 py-16">
        {/* Extragere Mesaje de Eroare */}
        <h1 className="text-3xl font-bold mb-4">{t.legal?.error?.loadTitle ?? "Eroare de Încărcare"}</h1>
        <p>{t.legal?.error?.cookiesNotFound ?? "Politica de Cookie-uri nu a putut fi încărcată."}</p>
      </main>
    );
  }

  const { title, date, intro, sections } = cookiesData;
  const year = new Date().getFullYear();

  return (
    <main className="max-w-[1100px] mx-auto px-5 py-16">
      <header className="mb-12 border-b pb-6">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-[var(--foreground)]">
          {title}
        </h1>
        <p className="mt-2 text-sm opacity-60">
          {t.pages?.cookies?.updatedPrefix ?? t.legal?.updatedPrefixFallback} {date}
        </p>
      </header>

      <p className="text-xl italic mb-10 opacity-90">
        {intro}
      </p>

      {sections.map((section: PolicySection, index: number) => (
        <PolicySectionRenderer 
          key={index} 
          section={section} 
          level={2} 
          baseIndex={index + 1}
        />
      ))}
      
      <div className="mt-16 pt-8 border-t">
        <p className="text-center text-sm opacity-60">
          &copy; {year} {t.brand}. {t.legal?.cookies?.footerText ?? "Colectarea datelor se face doar pentru a înțelege mai bine fragmentele de interacțiune."}
        </p>
        <div className="text-center mt-2 text-sm space-x-4">
            <Link href={`/${locale}/legal/termeni`} className="text-[var(--primary)] hover:underline">
                {t.legal?.links?.terms ?? "Termeni și Condiții"}
            </Link>
            <span className="text-zinc-500">|</span>
            <Link href={`/${locale}/legal/confidentialitate`} className="text-[var(--primary)] hover:underline">
                {t.legal?.links?.privacy ?? "Politica de Confidențialitate"}
            </Link>
        </div>
      </div>

    </main>
  );
}