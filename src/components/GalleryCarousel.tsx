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
  const [vw, setVw] = useState(0); // lățimea reală a viewport-ului caruselului (px)
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const startX = useRef<number | null>(null);
  const deltaX = useRef<number>(0);

  const measure = () => {
    const w = wrapRef.current?.clientWidth || 0;
    setVw(w);
    // repoziționează exact pe slide curent
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${-idx * w}px)`;
    }
  };

  useEffect(() => {
    measure();
    // re-măsurare la resize/orientation change
    const onR = () => measure();
    window.addEventListener("resize", onR);
    window.addEventListener("orientationchange", onR);
    return () => {
      window.removeEventListener("resize", onR);
      window.removeEventListener("orientationchange", onR);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = (n: number) =>
    setIdx((p) => {
      const next = (n + items.length) % items.length;
      if (trackRef.current) {
        trackRef.current.style.transition = "transform 300ms";
        trackRef.current.style.transform = `translateX(${-next * vw}px)`;
      }
      // curăță transition după animare
      window.setTimeout(() => {
        if (trackRef.current) trackRef.current.style.transition = "";
      }, 320);
      return next;
    });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, vw]);

  // touch
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    deltaX.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    deltaX.current = e.touches[0].clientX - startX.current; // px
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${-(idx * vw) + deltaX.current}px)`;
    }
  };

  const onTouchEnd = () => {
    // prag: 15% din lățimea viewport-ului sau 60px (oricare e mai mic)
    const threshold = Math.min(vw * 0.15, 60);
    if (deltaX.current > threshold) prev();
    else if (deltaX.current < -threshold) next();
    else {
      // revine la slide curent
      if (trackRef.current) {
        trackRef.current.style.transition = "transform 200ms";
        trackRef.current.style.transform = `translateX(${-idx * vw}px)`;
        window.setTimeout(() => {
          if (trackRef.current) trackRef.current.style.transition = "";
        }, 220);
      }
    }
    startX.current = null;
    deltaX.current = 0;
  };

  // repoziționează când se schimbă idx (de ex. prin bullets)
  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${-idx * vw}px)`;
    }
  }, [idx, vw]);

  return (
    <div className="w-full">
      <div
        ref={wrapRef}
        className="relative overflow-hidden rounded-xl border border-white/20"
      >
        <div
          ref={trackRef}
          className="flex will-change-transform touch-pan-y"
          style={{ transform: `translateX(${-idx * vw}px)` }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {items.map((it, i) => (
            <figure
              key={i}
              className="m-0 flex-none" // fără margin implicit la <figure>
              style={{ width: vw || "100%" }} // fiecare slide = lățimea viewport-ului
            >
              <Link
                href={`/${locale}/galerie/${it.slug}`}
                className="block group select-none"
              >
                {/* container imagine: pe mobil 65vh, centrat; imaginea se vede integral */}
                <div
                  className="relative w-full flex items-center justify-center bg-black/10"
                  style={{ height: "65vh" }}
                >
                  <img
                    src={it.src}
                    alt={it.title}
                    className="max-h-full max-w-full h-auto w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    loading={i === 0 ? "eager" : "lazy"}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
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
