// @ts-nocheck

import type { Metadata, PageProps } from "next";
import { isLocale, type Locale } from "@/i18n/routing";
import { getMessages } from "@/i18n/get-messages";
import { buildPageMetadata } from "@/seo/meta";
import Link from "next/link";

interface PolicySection {
  title: string;
  body: string | string[];
  subsections?: PolicySection[];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = isLocale(params.locale) ? (params.locale as Locale) : "ro";
  const t = await getMessages(locale);

  return buildPageMetadata({
    locale,
    pathname: "/legal/confidentialitate",
    title: t.pages?.privacy?.metaTitle ?? "Politica de Confidențialitate – Fracturism",
    description:
      t.pages?.privacy?.metaDescription ??
      "Cum sunt colectate, utilizate și protejate datele personale în contextul Fracturism.",
  });
}

interface PolicySectionRendererProps {
  section: PolicySection;
  level?: 2 | 3 | 4 | 5 | 6;
  baseIndex?: number;
}

const PolicySectionRenderer = ({ section, level = 2, baseIndex = 0 }: PolicySectionRendererProps) => {
  const index = baseIndex > 0 ? `${baseIndex}` : "";
  const titleContent = `${index} ${section.title}`.trim();

  const className = `font-bold mt-8 mb-4 ${
    level === 2 ? "text-2xl md:text-3xl border-b pb-2" : "text-xl md:text-2xl"
  }`;

  const HeadingTag = `h${level}` as any;

  return (
    <section className="mb-8">
      <HeadingTag className={className}>{titleContent}</HeadingTag>

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
              level={(level < 6 ? level + 1 : 6) as 2 | 3 | 4 | 5 | 6}
              baseIndex={baseIndex * 10 + i + 1}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default async function ConfidentialitatePage({ params }: PageProps) {
  const locale = isLocale(params.locale) ? (params.locale as Locale) : "ro";
  const t = await getMessages(locale);

  const privacyData = t.pages?.privacy;

  if (!privacyData?.sections) {
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

      <p className="text-xl italic mb-10 opacity-90">{intro}</p>

      {sections.map((section: PolicySection, index: number) => (
        <PolicySectionRenderer key={index} section={section} level={2} baseIndex={index + 1} />
      ))}

      <div className="mt-16 pt-8 border-t">
        <p className="text-center text-sm opacity-60">
          &copy; {year} {t.brand}. Confidențialitatea datelor dumneavoastră este esențială.
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
