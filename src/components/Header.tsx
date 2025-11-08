"use client";
import Link from "next/link";
import { useState } from "react";
import LanguageCountrySwitcher from "./LanguageCountrySwitcher";

type Props = { locale: "ro" | "en" | "it"; t: Record<string, any> };

export default function Header({ locale, t }: Props) {
  const nav = t.nav ?? {};
  const base = `/${locale}`;
  const [open, setOpen] = useState(false);

  const LINKS: { href: string; label: string }[] = [
    { href: `${base}/manifest`, label: nav.manifest ?? "Manifest" },
    { href: `${base}/galerie`, label: nav.gallery ?? "Galerie" },
    { href: `${base}/moda-design`, label: nav.fashion ?? "Modă & Design" },
    { href: `${base}/artistul`, label: nav.artist ?? "Artistul" },
    { href: `${base}/noutati`, label: nav.news ?? "Noutăți" },
    { href: `${base}/contact`, label: nav.contact ?? "Contact" },
  ];

  return (
    <header
      className="
        sticky top-0 z-50
        h-16
        flex items-center
        px-4 md:px-6
        border-b
        bg-[var(--background)] text-[var(--foreground)]
        shadow-sm
      "
      role="banner"
    >
      {/* Brand (stânga) */}
      <Link href={base} aria-label={t.brand ?? "Fracturism"} className="leading-none">
        <span className="font-[var(--font-unifraktur)] text-2xl tracking-wide">
          Fracturism
        </span>
      </Link>

      {/* Spațiu flexibil */}
      <div className="ml-auto hidden md:flex items-center gap-6" aria-label="Main">
        {/* NAV pe desktop (dreapta) */}
        <nav className="flex items-center gap-5 text-sm">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:opacity-90 hover:underline underline-offset-4"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Switcher limbi */}
        <LanguageCountrySwitcher currentLocale={locale} />
      </div>

      {/* Buton mobil */}
      <button
        className="md:hidden ml-auto px-3 py-2 border rounded"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label="Deschide meniul"
      >
        ☰
      </button>

      {/* Meniu mobil */}
      {open && (
        <div
          id="mobile-nav"
          className="
            md:hidden
            absolute left-0 right-0 top-16
            border-b shadow-sm
            bg-[var(--background)] text-[var(--foreground)]
          "
        >
          <div className="px-5 py-4 flex flex-col gap-4 text-base">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="py-1"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-2 border-t">
              <LanguageCountrySwitcher currentLocale={locale} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
