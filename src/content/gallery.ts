// sursă unică de adevăr pentru galerie
export type GalleryItem = {
  src: string;
  title: string;
  caption: string;
  slug: string;
};

export function getGalleryItems(locale: string): GalleryItem[] {
  // poți înlocui cu t.gallery?.items când ai traducerile
  return [
    {
      src: "/images/profil.webp",
      title: "Portret și Materie",
      caption:
        "Chipul din apropiere devine textură. Fractura nu ascunde, dezvăluie – o poartă spre sens.",
      slug: "portret-si-materie",
    },
    {
      src: "/images/1.jpg",
      title: "Moneda Fracturistă",
      caption:
        "O emblemă care adună fisuri și le alchimizează în simbol. Valoarea nu e netedă.",
      slug: "moneda-fracturista",
    },
    {
      src: "/images/2.jpg",
      title: "Ornament, Ordine, Ruptură",
      caption:
        "Ordinea se naște din tensiune. Un limbaj decorativ din fărâme coerente.",
      slug: "ornament-ordine-ruptura",
    },
    {
      src: "/images/3.jpg",
      title: "Separator",
      caption:
        "O pauză vizuală care taie și unește. Respirația dintre două intenții.",
      slug: "separator",
    },
  ];
}

export function getBySlug(locale: string, slug: string) {
  return getGalleryItems(locale).find((x) => x.slug === slug) || null;
}
