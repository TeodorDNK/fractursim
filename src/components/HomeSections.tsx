// src/components/HomeSections.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

type Section = {
  key: string;
  title: string;
  description: string;
  href: string;
  image?: string;          // ex: "/images/manifest.jpg"
  items?: string[];        // bullets scurte
};

export default function HomeSections({ sections }: { sections: Section[] }) {
  if (!sections?.length) return null;

  return (
    <section className="px-6 pb-16">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <article
              key={s.key}
              id={s.key}
              className="group rounded-2xl border border-zinc-200 bg-white/70 backdrop-blur p-4 shadow-sm flex flex-col"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border">
                {s.image ? (
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[length:22px_22px] bg-white" />
                )}
              </div>

              <h3 className="mt-4 text-xl font-[var(--font-arhaic)]">{s.title}</h3>
              <p className="mt-1 text-zinc-700 font-serif">{s.description}</p>

              {Array.isArray(s.items) && s.items.length > 0 && (
                <ul className="mt-3 space-y-1.5 text-sm text-zinc-700 list-disc pl-5">
                  {s.items.map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ul>
              )}

              <div className="mt-4">
                <Link
                  href={s.href}
                  className="inline-flex items-center gap-2 text-sm border border-zinc-900 px-4 py-2 rounded-md hover:bg-zinc-900 hover:text-white transition font-[var(--font-arhaic)]"
                >
                  {/** folosim title ca CTA scurt, sau poți adăuga un câmp separat în i18n */}
                  {s.title}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
