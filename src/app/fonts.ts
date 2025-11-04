import { EB_Garamond, Cormorant_SC } from "next/font/google";

export const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
  display: "swap"
});

export const cormorantSc = Cormorant_SC({
  subsets: ["latin"],
  weight: ["400","500","600","700"],
  variable: "--font-cormorant-sc",
  display: "swap"
});
