import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/routing"; 
import { getMessages } from "@/i18n/get-messages"; 
import { buildPageMetadata } from "@/seo/meta";
import Link from "next/link"; 

// -----------------------------------------------------------
// 1. Definiția corectă a props-urilor (FĂRĂ constrângeri PageProps)
interface TermeniPageProps {
  params: { 
    locale: string;
  };
}
// -----------------------------------------------------------

interface TermSection {
  title: string;
  body: string | string[];
  subsections?: TermSection[];
}

export async function generateMetadata({ 
  params, 
}: TermeniPageProps): Promise<Metadata> { // Tipul aplicat aici
  const locale = isLocale(params.locale) ? (params.locale as Locale) : "ro";
  const t = await getMessages(locale);
  const title = t.pages?.terms?.metaTitle || "Termene și Condiții – Fracturism";
  const description = t.pages?.terms?.metaDescription || "Termeni și condiții de utilizare a conținutului și serviciilor Fracturism.";

  return buildPageMetadata({
    locale,
    pathname: "/legal/termeni",
    title: title,
    description: description,
  });
}

// Tip separat pentru componenta recursivă
interface TermSectionRendererProps {
  section: TermSection;
  level?: 2 | 3 | 4 | 5 | 6; // Tipuri explicite pentru nivel
  baseIndex?: number;
}

const TermSectionRenderer = ({ section, level = 2, baseIndex = 0 }: TermSectionRendererProps) => { // Tipul aplicat aici
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
            <TermSectionRenderer 
              key={i} 
              section={sub} 
              // Asigurăm că nivelul rămâne în limitele definite (2-6)
              level={(level < 6 ? level + 1 : 6) as 2 | 3 | 4 | 5 | 6} 
              baseIndex={baseIndex * 10 + i + 1} 
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default async function TermeniPage({
  params,
}: TermeniPageProps) { // Tipul aplicat aici
  const locale = isLocale(params.locale) ? (params.locale as Locale) : "ro";
  const t = await getMessages(locale);
  
  const termsData = t.pages?.terms;

  if (!termsData || !termsData.sections) {
    return (
      <main className="max-w-[1100px] mx-auto px-5 py-16">
        <h1 className="text-3xl font-bold mb-4">Eroare de Încărcare</h1>
        <p>Termenii și condițiile nu au putut fi încărcați.</p>
      </main>
    );
  }

  const { title, date, intro, sections } = termsData;
  const year = new Date().getFullYear();

  return (
    <main className="max-w-[1100px] mx-auto px-5 py-16">
      <header className="mb-12 border-b pb-6">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-[var(--foreground)]">
          {title}
        </h1>
        <p className="mt-2 text-sm opacity-60">
          {t.pages?.terms?.updatedPrefix ?? "Ultima actualizare:"} {date}
        </p>
      </header>

      <p className="text-xl italic mb-10 opacity-90">
        {intro}
      </p>

      {sections.map((section: TermSection, index: number) => (
        <TermSectionRenderer 
          key={index} 
          section={section} 
          level={2} 
          baseIndex={index + 1}
        />
      ))}
      
      <div className="mt-16 pt-8 border-t">
        <p className="text-center text-sm opacity-60">
          &copy; {year} {t.brand}. Toate drepturile de fragmentare și reconstrucție sunt rezervate.
        </p>
      </div>

    </main>
  );
}