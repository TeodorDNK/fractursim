// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://fracturism.tld";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Fracturism",
  description: "Arta rupturii. Frumusețea imperfecțiunii."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
