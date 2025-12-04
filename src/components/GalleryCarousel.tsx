// src/components/GalleryCarousel.tsx
"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { GalleryItem } from "@/content/gallery";
import { getMessages } from "@/i18n/get-messages";
import type { Locale } from "@/i18n/routing"; 
import FitTextH3 from './FitTextH3'; 

export type { GalleryItem };

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
  const [vw, setVw] = useState(0); 
  const [t, setT] = useState<Record<string, any>>({}); 
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const deltaX = useRef<number>(0);
  const deltaY = useRef<number>(0);
  
  useEffect(() => {
    async function loadMessages() {
      const messages = await getMessages(locale as Locale); 
      setT(messages);
    }
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const measure = () => {
    const w = wrapRef.current?.clientWidth || 0;
    setVw(w);
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${-idx * w}px)`;
    }
  };

  useEffect(() => {
    measure();
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
        trackRef.current.style.transition = "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)";
        trackRef.current.style.transform = `translateX(${-next * vw}px)`;
      }
      window.setTimeout(() => {
        if (trackRef.current) trackRef.current.style.transition = "";
      }, 320);
      return next;
    });

  const next = () => go(idx + 1);
  const prev = () => go(idx - 1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, vw]);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    deltaX.current = 0;
    deltaY.current = 0;
  };

// --- LOGICA CORECTATĂ ÎNCEPE AICI ---
const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current == null || startY.current == null) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;

    deltaX.current = currentX - startX.current;
    deltaY.current = currentY - startY.current;

    const threshold = 10; // Prag minim pentru detectarea unei mișcări

    // 1. Verificăm dacă a început o mișcare.
    if (Math.abs(deltaX.current) < threshold && Math.abs(deltaY.current) < threshold) {
      return;
    }

    // 2. Dacă mișcarea Orizontală este dominantă, blochează scroll-ul paginii
    if (Math.abs(deltaX.current) > Math.abs(deltaY.current)) {
      // Mișcarea orizontală este dominantă (swipe carusel).
      e.preventDefault(); 
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${-(idx * vw) + deltaX.current}px)`;
      }
    } 
    
    // 3. Dacă mișcarea verticală este dominantă, lăsăm browserul să facă scroll.
    // Nu apelăm e.preventDefault(), permițând mișcarea verticală.
  };

  const onTouchEnd = () => {
    // Dacă mișcarea pe Y a fost dominantă, nu schimbăm slide-ul.
    if (Math.abs(deltaY.current) > Math.abs(deltaX.current)) {
      // Se resetează poziția vizuală dacă mișcarea a fost inițiată, dar nu a fost swipe de carusel
      if (trackRef.current) {
        trackRef.current.style.transition = "transform 200ms";
        trackRef.current.style.transform = `translateX(${-idx * vw}px)`;
        window.setTimeout(() => {
          if (trackRef.current) trackRef.current.style.transition = "";
        }, 220);
      }
      startX.current = null;
      startY.current = null;
      deltaX.current = 0;
      deltaY.current = 0;
      return;
    }

    // Logica de schimbare a slide-ului (dacă mișcarea orizontală a fost dominantă)
    const threshold = vw * 0.2;
    if (deltaX.current > threshold) prev();
    else if (deltaX.current < -threshold) next();
    else {
      // Revine la poziția curentă
      if (trackRef.current) {
        trackRef.current.style.transition = "transform 200ms";
        trackRef.current.style.transform = `translateX(${-idx * vw}px)`;
        window.setTimeout(() => {
          if (trackRef.current) trackRef.current.style.transition = "";
        }, 220);
      }
    }
    startX.current = null;
    startY.current = null;
    deltaX.current = 0;
    deltaY.current = 0;
  };
// --- LOGICA CORECTATĂ SE TERMINĂ AICI ---

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${-idx * vw}px)`;
    }
  }, [idx, vw]);

  const readMoreText = t.gallery?.readMore || "Află mai mult →";

  return (
    <div className="w-full">
      <div
        ref={wrapRef}
        className="relative overflow-hidden rounded-xl shadow-2xl border border-white/20" 
        style={{ overscrollBehaviorX: 'none' }} // Blochează gesturile de navigare înapoi/înainte ale browserului
      >
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{ transform: `translateX(${-idx * vw}px)` }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {items.map((it, i) => (
            <figure
              key={i}
              className="m-0 flex-none" 
              style={{ width: vw || "100%" }} 
            >
              <Link
                href={`/${locale}/galerie/${it.slug}`}
                className="block group select-none"
              >
                {/* container imagine */}
                <div
                  className="relative w-full flex items-center justify-center bg-black/20"
                  style={{ height: "50vh" }} 
                >
                  <img
                    src={it.src}
                    alt={it.title}
                    className="max-h-full max-w-full h-auto w-auto object-contain transition-transform duration-300 group-hover:scale-[1.05]" 
                    loading={i === 0 ? "eager" : "lazy"}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    style={{ maxHeight: '75vh' }}
                  />
                </div>

                <figcaption className="px-4 sm:px-8 py-5 md:py-6 bg-black/25 backdrop-blur-sm"> 
                  
                  <FitTextH3 
                    title={it.title} 
                    baseFontSize={25} 
                  />
                  
                  <p className="font-serif text-sm md:text-base text-zinc-300 leading-relaxed line-clamp-3"> 
                    {it.caption}
                  </p>
                  <span className="mt-3 inline-block text-sm font-semibold text-white/90 underline underline-offset-4 group-hover:text-white group-hover:tracking-wider transition-all duration-300">
                    {readMoreText} 
                  </span>
                </figcaption>
              </Link>
            </figure>
          ))}
        </div>

        {/* Buton PREV (Anterior) */}
        <button
          onClick={prev}
          aria-label="Anterior"
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 h-8 w-8 md:h-10 md:w-10 rounded-full border border-white/30 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-lg md:text-xl text-white transition-colors duration-200 flex items-center justify-center"
        >
          <span className="translate-y-[0.5px]">‹</span>
        </button>
        
        {/* Buton NEXT (Următor) */}
        <button
          onClick={next}
          aria-label="Următor"
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 h-8 w-8 md:h-10 md:w-10 rounded-full border border-white/30 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-lg md:text-xl text-white transition-colors duration-200 flex items-center justify-center"
        >
          <span className="translate-y-[0.5px]">›</span>
        </button>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => go(i)}
              className={cn(
                "h-2 w-2 rounded-full border border-white/70 transition-colors",
                i === idx ? "bg-white/90" : "bg-white/30 hover:bg-white/60"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}