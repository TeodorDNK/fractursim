set -euo pipefail

mkdir -p "src/app/[locale]"/{manifest,galerie,moda-design,artistul,noutati,contact,legal} \
         src/components src/messages src/i18n

cat > src/i18n/routing.ts <<'EOF'
export const locales = ['ro','en','it'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'ro';
export function isLocale(x: string): x is Locale {
  return (locales as readonly string[]).includes(x);
}
EOF

cat > src/i18n/get-messages.ts <<'EOF'
import type { Locale } from './routing';

export async function getMessages(locale: Locale) {
  const messages = await import(`../messages/${locale}.json`).then(m => m.default);
  return messages as Record<string, any>;
}
EOF

cat > src/messages/ro.json <<'EOF'
{
  "brand": "Fracturism",
  "nav": {
    "home": "Acasă",
    "manifest": "Manifest",
    "gallery": "Galerie",
    "fashion": "Modă & Design",
    "artist": "Artistul",
    "news": "Noutăți",
    "contact": "Contact",
    "legal": "Legal"
  },
  "home": {
    "title": "Fracturism – Arta rupturii. Frumusețea imperfecțiunii.",
    "sub": "Un curent fondat de Teodor G. Dinică. O lume spartă în sensuri noi.",
    "cta": "Descoperă Manifestul"
  },
  "footer": { "rights": "Fracturism® – toate drepturile rezervate." },
  "manifest": { "title": "Manifestul Fracturist", "by": "De Teodor G. Dinică" },
  "gallery": { "title": "Galerie" },
  "fashion": { "title": "Modă & Design", "disclaimer": "Fracturism®️ este o marcă protejată. Toate produsele sunt originale." },
  "artist": { "title": "Artistul" },
  "news": { "title": "Noutăți" },
  "contact": { "title": "Contact", "note": "Fracturism®️ este o marcă protejată. Utilizarea numelui sau a logoului necesită acordul scris al artistului." },
  "legal": { "title": "Legal" },
  "lang": { "label": "Limba" }
}
EOF

cat > src/messages/en.json <<'EOF'
{
  "brand": "Fracturism",
  "nav": {
    "home": "Home",
    "manifest": "Manifest",
    "gallery": "Gallery",
    "fashion": "Fashion & Design",
    "artist": "The Artist",
    "news": "News",
    "contact": "Contact",
    "legal": "Legal"
  },
  "home": {
    "title": "Fracturism – The art of rupture. The beauty of imperfection.",
    "sub": "A movement founded by Teodor G. Dinică. A world shattered into new meanings.",
    "cta": "Read the Manifest"
  },
  "footer": { "rights": "Fracturism® – all rights reserved." },
  "manifest": { "title": "The Fracturist Manifest", "by": "By Teodor G. Dinică" },
  "gallery": { "title": "Gallery" },
  "fashion": { "title": "Fashion & Design", "disclaimer": "Fracturism®️ is a protected trademark. All products are original." },
  "artist": { "title": "The Artist" },
  "news": { "title": "News" },
  "contact": { "title": "Contact", "note": "Fracturism®️ is a protected trademark. Use of the name or logo requires written permission." },
  "legal": { "title": "Legal" },
  "lang": { "label": "Language" }
}
EOF

cat > src/messages/it.json <<'EOF'
{
  "brand": "Fracturism",
  "nav": {
    "home": "Home",
    "manifest": "Manifesto",
    "gallery": "Galleria",
    "fashion": "Moda & Design",
    "artist": "L'Artista",
    "news": "Novità",
    "contact": "Contatto",
    "legal": "Legale"
  },
  "home": {
    "title": "Fratturismo – L'arte della rottura. La bellezza dell'imperfezione.",
    "sub": "Un movimento fondato da Teodor G. Dinică. Un mondo frantumato in nuovi significati.",
    "cta": "Scopri il Manifesto"
  },
  "footer": { "rights": "Fracturism® – tutti i diritti riservati." },
  "manifest": { "title": "Il Manifesto Fratturista", "by": "Di Teodor G. Dinică" },
  "gallery": { "title": "Galleria" },
  "fashion": { "title": "Moda & Design", "disclaimer": "Fracturism®️ è un marchio registrato. Tutti i prodotti sono originali." },
  "artist": { "title": "L'Artista" },
  "news": { "title": "Novità" },
  "contact": { "title": "Contatto", "note": "Fracturism®️ è un marchio protetto. L'uso del nome o del logo richiede il permesso scritto." },
  "legal": { "title": "Legale" },
  "lang": { "label": "Lingua" }
}
EOF

cat > middleware.ts <<'EOF'
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { defaultLocale, isLocale } from './src/i18n/routing';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname === '/favicon.ico' || pathname.startsWith('/assets')) {
    return NextResponse.next();
  }

  const seg0 = pathname.split('/')[1];
  if (isLocale(seg0)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api|assets).*)']
};
EOF

cat > src/components/Header.tsx <<'EOF'
import Link from "next/link";
type Props = { locale: string; t: Record<string, any>; };

export default function Header({ locale, t }: Props) {
  const nav = t.nav;
  const base = `/${locale}`;
  return (
    <header className="site sticky top-0 z-50 h-16 flex items-center gap-6 px-5 border-b bg-white">
      <Link href={base} className="badge uppercase tracking-wide" aria-label={t.brand}>
        {t.brand}
      </Link>
      <nav className="main flex gap-4 flex-wrap" aria-label="Main">
        <Link href={`${base}`}>{nav.home}</Link>
        <Link href={`${base}/manifest`}>{nav.manifest}</Link>
        <Link href={`${base}/galerie`}>{nav.gallery}</Link>
        <Link href={`${base}/moda-design`}>{nav.fashion}</Link>
        <Link href={`${base}/artistul`}>{nav.artist}</Link>
        <Link href={`${base}/noutati`}>{nav.news}</Link>
        <Link href={`${base}/contact`}>{nav.contact}</Link>
        <Link href={`${base}/legal`}>{nav.legal}</Link>
      </nav>
      <div className="lang ml-auto" aria-label={t.lang?.label || 'Language'}>
        <Link href={`/ro`}>RO</Link> · <Link href={`/en`}>EN</Link> · <Link href={`/it`}>IT</Link>
      </div>
    </header>
  );
}
EOF

cat > src/components/Footer.tsx <<'EOF'
type Props = { t: Record<string, any> };
export default function Footer({ t }: Props) {
  return (
    <footer className="site border-t text-gray-500">
      <div className="max-w-[1100px] mx-auto px-5 py-6">
        <small>{t.footer?.rights || 'Fracturism®'}</small>
      </div>
    </footer>
  );
}
EOF

cat > "src/app/[locale]/layout.tsx" <<'EOF'
import type { ReactNode } from 'react';
import { isLocale, type Locale } from '../../i18n/routing';
import { getMessages } from '../../i18n/get-messages';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../globals.css';

export const dynamic = 'force-static';

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const locale = isLocale(params.locale) ? (params.locale as Locale) : 'ro';
  const t = await getMessages(locale);

  return (
    <html lang={locale}>
      <body>
        <Header locale={locale} t={t} />
        <main className="min-h-[calc(100dvh-4rem)]">{children}</main>
        <Footer t={t} />
      </body>
    </html>
  );
}
EOF

cat > "src/app/[locale]/page.tsx" <<'EOF'
import Link from "next/link";

export default function Home({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const T: Record<string, any> = {
    ro: {
      title: "Fracturism – Arta rupturii. Frumusețea imperfecțiunii.",
      sub: "Un curent fondat de Teodor G. Dinică. O lume spartă în sensuri noi.",
      cta: "Descoperă Manifestul"
    },
    en: {
      title: "Fracturism – The art of rupture. The beauty of imperfection.",
      sub: "A movement founded by Teodor G. Dinică. A world shattered into new meanings.",
      cta: "Read the Manifest"
    },
    it: {
      title: "Fratturismo – L'arte della rottura. La bellezza dell'imperfezione.",
      sub: "Un movimento fondato da Teodor G. Dinică. Un mondo frantumato in nuovi significati.",
      cta: "Scopri il Manifesto"
    }
  };
  const t = T[locale] ?? T.ro;

  return (
    <section className="grid place-items-center min-h-[calc(100dvh-4rem)] bg-black text-white text-center">
      <div className="px-5">
        <div className="uppercase tracking-wide opacity-80 mb-2">Fracturism</div>
        <h1 className="text-[clamp(40px,6vw,72px)] leading-tight font-semibold mb-2">{t.title}</h1>
        <p className="opacity-90 max-w-[760px] mx-auto">{t.sub}</p>
        <Link className="inline-block border px-4 py-3 mt-4" href={`/${locale}/manifest`}>{t.cta}</Link>
      </div>
    </section>
  );
}
EOF

