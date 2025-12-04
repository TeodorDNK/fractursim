// src/components/FitTextH3.tsx
"use client";
import React, { useRef, useState, useEffect } from 'react';

// Această componentă ajustează dinamic dimensiunea fontului (fontSize)
// pentru a se asigura că textul încape pe un singur rând.

export default function FitTextH3({ title, baseFontSize }: { title: string; baseFontSize: number }) {
  const textRef = useRef<HTMLHeadingElement>(null);
  // Starea pentru dimensiunea ajustată a fontului (în px)
  const [fontSize, setFontSize] = useState(baseFontSize); 

  const adjustFontSize = () => {
    const element = textRef.current;
    if (!element) return;

    // Lățimea containerului care NU glisează
    const containerWidth = element.parentElement?.clientWidth || 0;
    
    // 1. Resetăm dimensiunea la valoarea inițială de bază
    element.style.fontSize = `${baseFontSize}px`;
    
    // 2. Setăm textul să nu se trunchieze vizual, dar să nu fie vizibil
    // pentru a putea măsura lățimea reală (`scrollWidth`).
    element.style.overflow = 'visible';
    element.style.whiteSpace = 'nowrap';
    
    let newFontSize = baseFontSize;

    // Logica de micșorare: Cât timp textul este mai lat decât containerul
    // și fontul este mai mare decât minimul de 10px.
    while (element.scrollWidth > containerWidth && newFontSize > 10) {
      newFontSize -= 1; // Micșorăm fontul cu 1px
      element.style.fontSize = `${newFontSize}px`;
    }
    
    // 3. Restaurăm CSS-ul pentru afișare corectă
    element.style.overflow = 'hidden'; 

    // Setăm starea finală
    if (fontSize !== newFontSize) {
      setFontSize(newFontSize);
    }
  };

  // Ajustăm la montare și la fiecare redimensionare
  useEffect(() => {
    adjustFontSize();
    const handleResize = () => adjustFontSize();
    
    // Adăugăm un delay mic pentru a se asigura că măsurătorile sunt corecte după resize
    const debouncedResize = () => setTimeout(handleResize, 100); 

    window.addEventListener('resize', debouncedResize);
    window.addEventListener('orientationchange', debouncedResize);

    return () => {
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('orientationchange', debouncedResize);
    };
  }, [title, baseFontSize]); 

  return (
    <h3
      ref={textRef}
      className="font-[var(--font-arhaic)] mb-1 tracking-wider w-full" 
      title={title}
      style={{
        color: "var(--color-theme-accent)",
        // Stiluri aplicate de React:
        whiteSpace: 'nowrap', 
        overflow: 'hidden', 
        textOverflow: 'clip', // Asigură că nu avem '...' dacă ar fi trunchiat
        fontSize: `${fontSize}px`, 
        textAlign: 'left',
      }}
    >
      {title}
    </h3>
  );
}