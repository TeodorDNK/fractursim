export type Country = {
  code: string;        // ISO-3166 Alpha-2 (RO, IT, US etc.)
  name: string;        // Numele afișat
  locale: "ro" | "en" | "it";
  flag?: string;       // emoji, simplu
};

// Regula simplă: RO & MD -> ro; IT & VA & SM -> it; restul -> en.
// Poți extinde foarte ușor, doar adaugi rânduri.
export const COUNTRIES: Country[] = [
  { code: "RO", name: "România", locale: "ro", flag: "🇷🇴" },

  { code: "IT", name: "Italia", locale: "it", flag: "🇮🇹" },

  // Engleza ca fallback global
  { code: "US", name: "United States", locale: "en", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", locale: "en", flag: "🇬🇧" },
 // …poți adăuga rapid toate țările, modelul e clar.
];
