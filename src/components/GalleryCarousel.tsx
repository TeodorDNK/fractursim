// src/components/GalleryCarousel.tsx
"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type GalleryItem = {
  src: string;
  title: string;
  caption: string;
  slug: string;
};

function cn(...a: (string | false | null | undefined)[]) {
  return a.filter(Boolean).join(" ");
}

export default function GalleryCarousel({
  items,
  locale = "ro",
}: {
  items: GalleryItem[];
  locale?: string;
}) {
  const [idx, setIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const startX = useRef<number | null>(null);
  const deltaX = useRef<number>(0);

  const go = (n: number) => setIdx((p) => (n + items.length) % items.length);
  const next = () => go(idx + 1);
  const prev = () => go(idx - 1);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx]);

  // helper pentru lățimea reală a viewport-ului caruselului
  const getViewportWidth = () =>
    trackRef.current?.parentElement?.clientWidth || trackRef.current?.clientWidth || 1;

  // touch
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    deltaX.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    deltaX.current = e.touches[0].clientX - startX.current;

    const vw = getViewportWidth();
    const shiftPct = (deltaX.current / vw) * 100; // deplasare relativă la viewport, nu la track
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(calc(${-idx * 100}% + ${shiftPct}%))`;
    }
  };
  const onTouchEnd = () => {
    const threshold = 60;
    if (deltaX.current > threshold) prev();
    else if (deltaX.current < -threshold) next();

    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${-idx * 100}%)`;
    }
    startX.current = null;
    deltaX.current = 0;
  };

  // aplică transform-ul corect când se schimbă idx
  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${-idx * 100}%)`;
    }
  }, [idx]);

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-xl border border-white/20">
        <div
          ref={trackRef}
          className="flex transition-transform duration-300 will-change-transform"
          style={{ transform: `translateX(${-idx * 100}%)` }} // fără width pe track!
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {items.map((it, i) => (
            <figure key={i} className="min-w-full flex-none"> {/* slide = 100% din viewport */}
              <Link href={`/${locale}/galerie/${it.slug}`} className="block group">
                <div
                  className="relative w-full"
                  style={{ aspectRatio: "3/2", maxHeight: "70vh", overflow: "hidden" }}
                >
                  <img
                    src={it.src}
                    alt={it.title}
                    className="absolute inset-0 h-full w-full object-contain bg-black/10 transition-transform duration-300 group-hover:scale-[1.02]"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                </div>

                <figcaption className="px-4 sm:px-6 py-5 bg-black/15 backdrop-blur">
                  <h3
                    className="font-[var(--font-arhaic)] text-2xl mb-1"
                    style={{ color: "var(--color-theme-accent)" }}
                  >
                    {it.title}
                  </h3>
                  <p className="font-serif text-zinc-200 leading-relaxed line-clamp-2">
                    {it.caption}
                  </p>
                  <span className="mt-2 inline-block text-sm text-zinc-300 underline underline-offset-4">
                    Află mai mult →
                  </span>
                </figcaption>
              </Link>
            </figure>
          ))}
        </div>

        <button
          onClick={prev}
          aria-label="Anterior"
          className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-white/40 bg-black/30 hover:bg-black/50 backdrop-blur text-white"
        >
          ‹
        </button>
        <button
          onClick={next}
          aria-label="Următor"
          className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-white/40 bg-black/30 hover:bg-black/50 backdrop-blur text-white"
        >
          ›
        </button>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => go(i)}
              className={cn(
                "h-2.5 w-2.5 rounded-full border border-white/70",
                i === idx ? "bg-white/90" : "bg-white/30 hover:bg-white/60"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
