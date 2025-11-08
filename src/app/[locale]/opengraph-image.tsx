// src/app/[locale]/opengraph-image.tsx
import { ImageResponse } from "next/og";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({ params }: { params: { locale: "ro"|"en"|"it" } }) {
  const l = params.locale;
  const title = l === "ro" ? "Fracturism – Arta rupturii"
             : l === "it" ? "Fracturismo – L’arte della frattura"
             : "Fracturism – The Art of Rupture";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
          background: "#1a404d", color: "white", fontSize: 72, fontFamily: "serif"
        }}
      >
        {title}
      </div>
    ),
    { ...size }
  );
}
