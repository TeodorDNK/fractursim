// sursă unică de adevăr pentru galerie
import { getMessages } from "@/i18n/get-messages";
import type { Locale } from "@/i18n/routing"; // Importăm tipul Locale din i18n/routing

export type GalleryItem = {
  src: string;
  title: string; // preluat din i18n
  caption: string; // preluat din i18n
  longDescription: string; // preluat din i18n
  slug: string;
};

// Definește structura de bază (slug-uri și src)
const BASE_GALLERY_ITEMS = [
  {
    src: "/images/profil.webp",
    slug: "portret-si-materie",
  },
  {
    src: "/images/1.jpg",
    slug: "moneda-fracturista",
  },
  {
    src: "/images/2.jpg",
    slug: "ornament-ordine-ruptura",
  },
  {
    src: "/images/3.jpg",
    slug: "separator",
  },
  {
    src: "/images/4.jpg",
    slug: "mona",
  },
  {
    src: "/images/5.jpg",
    slug: "lisa",
  },
  {
    src: "/images/6.jpg",
    slug: "robo",
  },
];

// CORECTARE EROARE: Am schimbat tipul de la `string` la `Locale` (sau orice tip este definit în i18n/routing)
export async function getGalleryItems(locale: Locale): Promise<GalleryItem[]> {
  const t = await getMessages(locale);
  
  // Preluarea mesajelor se face în siguranță, presupunând o structură
  const messages = t.gallery?.items as
    | Record<
          (typeof BASE_GALLERY_ITEMS)[number]["slug"],
          { title: string; caption: string; longDescription: string }
        >
    | undefined;

  // Returnează lista completă cu datele din i18n
  return BASE_GALLERY_ITEMS.map((baseItem) => {
    const translated = messages?.[baseItem.slug] || {
      title: `[${baseItem.slug} - lipsă titlu]`,
      caption: `[${baseItem.slug} - lipsă descriere scurtă]`,
      longDescription: `[${baseItem.slug} - lipsă descriere lungă]`,
    };

    return {
      ...baseItem,
      title: translated.title,
      caption: translated.caption,
      longDescription: translated.longDescription,
    };
  });
}

// CORECTARE EROARE: Am schimbat tipul de la `string` la `Locale`
export async function getBySlug(locale: Locale, slug: string) {
  const items = await getGalleryItems(locale);
  return items.find((x) => x.slug === slug) || null;
}