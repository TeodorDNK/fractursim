"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { COUNTRIES } from "@/i18n/countries";

function setCookie(name: string, value: string, days = 365) {
  try {
    const d = new Date();
    d.setTime(d.getTime() + days*24*60*60*1000);
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;SameSite=Lax`;
  } catch {}
}

export default function LanguageCountrySwitcher({ currentLocale }: { currentLocale: "ro" | "en" | "it" }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const grouped = useMemo(() => {
    // Mică grupare: țările limbilor „native” sus, restul jos
    const ro = COUNTRIES.filter(c => c.locale === "ro");
    const it = COUNTRIES.filter(c => c.locale === "it");
    const en = COUNTRIES.filter(c => c.locale === "en");
    return { ro, it, en };
  }, []);

  const replaceLocaleInPath = useCallback((path: string, newLocale: string) => {
    // Așteptăm rutare de forma /[locale]/restul
    const segments = path.split("/");
    segments[1] = newLocale; // înlocuim segmentul 1 (după root)
    return segments.join("/") || `/${newLocale}`;
  }, []);

  const onPick = (countryCode: string) => {
    const country = COUNTRIES.find(c => c.code === countryCode);
    const newLocale = country?.locale ?? "en";
    const newPath = replaceLocaleInPath(pathname || `/${currentLocale}`, newLocale);

    setCookie("NEXT_LOCALE", newLocale);
    router.replace(newPath);
    setOpen(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest?.("[data-switcher]")) setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div className="relative" data-switcher>
      <button
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-2 border px-3 py-1.5 text-sm hover:bg-zinc-50"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="uppercase">{currentLocale}</span>
        <span aria-hidden>▾</span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-72 max-h-[60vh] overflow-auto rounded-lg border bg-white shadow-lg p-2 grid grid-cols-1 gap-1"
        >
          <div className="px-2 pt-1 text-xs uppercase tracking-wide text-zinc-500">Română</div>
          {grouped.ro.map(c => (
            <button
              key={c.code}
              className="flex items-center gap-2 w-full text-left px-3 py-2 rounded hover:bg-zinc-100"
              onClick={() => onPick(c.code)}
            >
              <span className="text-lg">{c.flag}</span>
              <span className="flex-1">{c.name}</span>
              <span className="text-[10px] px-1.5 border rounded">{c.locale.toUpperCase()}</span>
            </button>
          ))}

          <div className="px-2 pt-2 text-xs uppercase tracking-wide text-zinc-500">Italiană</div>
          {grouped.it.map(c => (
            <button key={c.code} className="flex items-center gap-2 w-full text-left px-3 py-2 rounded hover:bg-zinc-100"
                    onClick={() => onPick(c.code)}>
              <span className="text-lg">{c.flag}</span>
              <span className="flex-1">{c.name}</span>
              <span className="text-[10px] px-1.5 border rounded">{c.locale.toUpperCase()}</span>
            </button>
          ))}

          <div className="px-2 pt-2 text-xs uppercase tracking-wide text-zinc-500">Engleză (implicit)</div>
          {grouped.en.map(c => (
            <button key={c.code} className="flex items-center gap-2 w-full text-left px-3 py-2 rounded hover:bg-zinc-100"
                    onClick={() => onPick(c.code)}>
              <span className="text-lg">{c.flag}</span>
              <span className="flex-1">{c.name}</span>
              <span className="text-[10px] px-1.5 border rounded">{c.locale.toUpperCase()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
