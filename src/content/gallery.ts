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
      src: "/images/moneda.png",
      title: "Moneda Fracturistă",
      caption:
        "O emblemă care adună fisuri și le alchimizează în simbol. Valoarea nu e netedă.",
      slug: "moneda-fracturista",
    },
    {
      src: "/images/ornament.png",
      title: "Ornament, Ordine, Ruptură",
      caption:
        "Ordinea se naște din tensiune. Un limbaj decorativ din fărâme coerente.",
      slug: "ornament-ordine-ruptura",
    },
    {
      src: "/images/separeu.png",
      title: "Separator",
      caption:
        "O pauză vizuală care taie și unește. Respirația dintre două intenții.",
      slug: "separator",
    },
    {
      src: "/images/floare.png",
      title: "Floare Fracturistă",
      caption:
        "Nu o petală perfectă, ci un motiv decupat – o floare care își amintește fisura.",
      slug: "floare-fracturista",
    },
  ];
}

export function getBySlug(locale: string, slug: string) {
  return getGalleryItems(locale).find((x) => x.slug === slug) || null;
}
