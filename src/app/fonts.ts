// src/app/fonts.ts
import localFont from "next/font/local";
import { EB_Garamond, Cormorant_SC } from "next/font/google";

export const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
  display: "swap",
});

export const cormorantSc = Cormorant_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cormorant-sc",
  display: "swap",
});

// Fontul tău "bisericesc"
export const arhaic = localFont({
  src: "./fonts/Arhaic_rom.ttf",   // <- pune calea corectă
  variable: "--font-arhaic",
  display: "swap"
});
