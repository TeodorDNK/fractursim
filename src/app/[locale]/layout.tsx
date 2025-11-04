import type { ReactNode } from 'react';
import { isLocale, type Locale } from '../../i18n/routing';
import { getMessages } from '../../i18n/get-messages';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../globals.css';
import { garamond, cormorantSc } from '../fonts';

export const dynamic = 'force-static';

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;                 // <<— Next 16: await params
  const locale = isLocale(raw) ? (raw as Locale) : 'ro';
  const t = await getMessages(locale);

  return (
    <html lang={locale} className={`${garamond.variable} ${cormorantSc.variable}`}>
      <body className="font-sans text-zinc-900 bg-zinc-50">
        <div className="fracture-bg pointer-events-none fixed inset-0 -z-10" />
        <Header locale={locale} t={t} />
        <main className="min-h-[calc(100dvh-4rem)]">{children}</main>
        <Footer t={t} />
      </body>
    </html>
  );
}
