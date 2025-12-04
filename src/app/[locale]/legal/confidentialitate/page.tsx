import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/routing"; 
import { getMessages } from "@/i18n/get-messages"; 
import { buildPageMetadata } from "@/seo/meta";
import Link from "next/link";

// -----------------------------------------------------------
// 1. Definiția corectă a props-urilor (pentru a rezolva eroarea)
interface ConfidentialitatePageProps {
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

export async function generateMetadata({ 
  params, 
}: ConfidentialitatePageProps): Promise<Metadata> {
  const locale = isLocale(params.locale) ? (params.locale as Locale) : "ro";
  const t = await getMessages(locale);
  const title = t.pages?.privacy?.metaTitle || "Politica de Confidențialitate – Fracturism";
  const description = t.pages?.privacy?.metaDescription || "Cum sunt colectate, utilizate și protejate datele personale în contextul Fracturism.";

  return buildPageMetadata({
    locale,
    pathname: "/legal/confidentialitate",
    title: title,
    description: description,
  });
}

const PolicySectionRenderer = ({ section, level = 2, baseIndex = 0 }: { section: PolicySection, level?: number, baseIndex?: number }) => {
  // Logică pentru formatarea indexului: 1, 2.1, 2.2 etc.
  const index = baseIndex > 0 ? `${baseIndex}` : '';
  const titleContent = `${index} ${section.title}`.trim();
  const className = `font-bold mt-8 mb-4 ${level === 2 ? 'text-2xl md:text-3xl border-b pb-2' : 'text-xl md:text-2xl'}`;

  const renderHeading = () => {
    // Înlocuirea `as any` cu o verificare de tip sau eliminarea,
    // deoarece Next.js App Router (și majoritatea linters-urilor)
    // preferă ca elementele să fie definite explicit sau să folosească
    // o componentă tipizată corect, dar aici este OK
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
              baseIndex={baseIndex * 10 + i + 1} // Indexare recursivă pentru a păstra structura 1, 2, 2.1, 2.2
            />
          ))}
        </div>
      )}
    </section>
  );
};

// -----------------------------------------------------------
// Aplicarea tipului corect la componenta de pagină
export default async function ConfidentialitatePage({
  params,
}: ConfidentialitatePageProps) {
// -----------------------------------------------------------
  const locale = isLocale(params.locale) ? (params.locale as Locale) : "ro";
  const t = await getMessages(locale);
  
  const privacyData = t.pages?.privacy;

  if (!privacyData || !privacyData.sections) {
    return (
      <main className="max-w-[1100px] mx-auto px-5 py-16">
        <h1 className="text-3xl font-bold mb-4">Eroare de Încărcare</h1>
        <p>Politica de Confidențialitate nu a putut fi încărcată.</p>
      </main>
    );
  }

  const { title, date, intro, sections } = privacyData;
  const year = new Date().getFullYear();

  return (
    <main className="max-w-[1100px] mx-auto px-5 py-16">
      <header className="mb-12 border-b pb-6">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-[var(--foreground)]">
          {title}
        </h1>
        <p className="mt-2 text-sm opacity-60">
          {t.pages?.privacy?.updatedPrefix ?? "Ultima actualizare:"} {date}
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
          &copy; {year} {t.brand}. Confidențialitatea datelor dumneavoastră este tratată cu aceeași rigoare ca fragmentele artistice.
        </p>
        <div className="text-center mt-2 text-sm">
            <Link href={`/${locale}/legal/termeni`} className="text-[var(--primary)] hover:underline">
                {t.nav?.legal || "Legal"} - Termeni și Condiții
            </Link>
        </div>
      </div>

    </main>
  );
}