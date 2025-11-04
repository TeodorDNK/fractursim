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
