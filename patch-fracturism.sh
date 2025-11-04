set -euo pipefail

# 1) fonturi (next/font)
mkdir -p src/app
cat > src/app/fonts.ts <<'EOF'
import { EB_Garamond, Cormorant_SC } from "next/font/google";

export const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
  display: "swap"
});

export const cormorantSc = Cormorant_SC({
  subsets: ["latin"],
  weight: ["400","500","600","700"],
  variable: "--font-cormorant-sc",
  display: "swap"
});
EOF

# 2) layout: fix pentru Next 16 (params este Promise) + aplicare fonturi și cadru UI
cat > "src/app/[locale]/layout.tsx" <<'EOF'
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
EOF

# 3) header mai elegant (nu schimba API-ul)
cat > src/components/Header.tsx <<'EOF'
import Link from "next/link";
type Props = { locale: string; t: Record<string, any>; };

export default function Header({ locale, t }: Props) {
  const nav = t.nav;
  const base = `/${locale}`;
  return (
    <header className="sticky top-0 z-50 h-16 flex items-center gap-6 px-5 border-b bg-white/80 backdrop-blur">
      <Link href={base} aria-label={t.brand} className="leading-none">
        <span className="font-display text-xl tracking-wide">{t.brand}</span>
      </Link>

      <nav className="hidden md:flex gap-5" aria-label="Main">
        <Link href={`${base}`}>{nav.home}</Link>
        <Link href={`${base}/manifest`}>{nav.manifest}</Link>
        <Link href={`${base}/galerie`}>{nav.gallery}</Link>
        <Link href={`${base}/moda-design`}>{nav.fashion}</Link>
        <Link href={`${base}/artistul`}>{nav.artist}</Link>
        <Link href={`${base}/noutati`}>{nav.news}</Link>
        <Link href={`${base}/contact`}>{nav.contact}</Link>
        <Link href={`${base}/legal`}>{nav.legal}</Link>
      </nav>

      <div className="ml-auto flex items-center gap-2 text-sm" aria-label={t.lang?.label || 'Language'}>
        <Link href={`/ro`} className={locale==='ro' ? 'underline' : ''}>RO</Link>
        <span>·</span>
        <Link href={`/en`} className={locale==='en' ? 'underline' : ''}>EN</Link>
        <span>·</span>
        <Link href={`/it`} className={locale==='it' ? 'underline' : ''}>IT</Link>
      </div>
    </header>
  );
}
EOF

# 4) home cu “aer de biserică” (titluri Cormorant SC, body EB Garamond), fundal solemn + “fracturi” discrete
cat > "src/app/[locale]/page.tsx" <<'EOF'
import Link from "next/link";

export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  return (
    <section className="relative grid place-items-center min-h-[calc(100dvh-4rem)] overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-zinc-100 via-white to-zinc-100" />
      <div className="absolute inset-0 -z-10 opacity-[0.08] bg-[radial-gradient(circle_at_30%_20%,black_1px,transparent_1px)] bg-[length:22px_22px]" />
      <div className="px-6 text-center max-w-[920px]">
        <div className="text-zinc-600 tracking-[0.25em] uppercase mb-3">Fracturism</div>
        <h1 className="font-display text-[clamp(40px,5vw,72px)] leading-tight mb-3">
          Fracturism – Arta rupturii. Frumusețea imperfecțiunii.
        </h1>
        <p className="text-lg text-zinc-700 font-serif">
          Un curent fondat de Teodor G. Dinică. O lume spartă în sensuri noi.
        </p>
        <div className="mt-6">
          <Link className="inline-block border border-zinc-900 px-5 py-3 hover:bg-zinc-900 hover:text-white transition"
                href="./manifest">
            Descoperă Manifestul
          </Link>
        </div>
      </div>
    </section>
  );
}
EOF

# 5) CSS: font families și un “fracture-bg” discret
#   - folosim variabilele definite de next/font
#   - adăugăm un pattern de linii frânte în fundal
awk '1; /@tailwind utilities/ {print "\n/* fonts */\n:root{--font-garamond:inherit;--font-cormorant-sc:inherit}\n.font-serif{font-family: var(--font-garamond), ui-serif, Georgia, Cambria, Times, serif}\n.font-display{font-family: var(--font-cormorant-sc), ui-serif, Georgia, Cambria, Times, serif}\n\n/* fracture bg */\n.fracture-bg{background:\n  linear-gradient(115deg, rgba(0,0,0,0.06) 1px, transparent 1px) 0 0/22px 22px,\n  linear-gradient(245deg, rgba(0,0,0,0.04) 1px, transparent 1px) 0 0/26px 26px;\n  mask-image: radial-gradient(ellipse at 50% 40%, black 60%, transparent 85%);\n}\n"}' src/app/globals.css > /tmp/globals.css && mv /tmp/globals.css src/app/globals.css

# 6) manifest placeholder simplu (folosește i18n în layout deja)
cat > "src/app/[locale]/manifest/page.tsx" <<'EOF'
export default function Page() {
  return (
    <div className="max-w-[980px] mx-auto px-6 py-10">
      <h1 className="font-display text-4xl mb-2">Manifestul Fracturist</h1>
      <p className="text-zinc-600 font-serif mb-6">De Teodor G. Dinică</p>
      <div className="prose prose-zinc max-w-none font-serif">
        <p><em>„Nu mai putem picta lumea întreagă, ci doar cioburile ei...”</em></p>
        <h2>Originea ideii</h2>
        <p>Text de introdus...</p>
        <h2>Principiile Fracturismului</h2>
        <ul>
          <li>Fractura ca adevăr al formei.</li>
          <li>Fragmentul ca unitate de sens.</li>
          <li>Tensiunea dintre absență și contur.</li>
        </ul>
        <h2>Estetica fragmentului</h2>
        <p>Text de introdus...</p>
        <h2>Poziționare vs. alte curente</h2>
        <p>Text de introdus...</p>
      </div>
    </div>
  );
}
EOF
