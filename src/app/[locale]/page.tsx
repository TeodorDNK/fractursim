import Link from "next/link";

export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  return (
    <section className="relative grid place-items-center min-h-[calc(100dvh-4rem)] overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-zinc-100 via-white to-zinc-100" />
      <div className="absolute inset-0 -z-10 opacity-[0.08] bg-[radial-gradient(circle_at_30%_20%,black_1px,transparent_1px)] bg-[length:22px_22px]" />
      <div className="px-6 text-center max-w-[920px]">
        <div className="text-zinc-600 tracking-[0.25em] uppercase mb-3">Fracturism</div>
        <h1 className="font-display text-[clamp(40px,5vw,72px)] leading-tight mb-3">
          Fracturism – Arta rupturii. Frumusețea imperfecțiunii.
        </h1>
        <p className="text-lg text-zinc-700 font-serif">
          Un curent fondat de Teodor G. Dinică. O lume spartă în sensuri noi.
        </p>
        <div className="mt-6">
          <Link className="inline-block border border-zinc-900 px-5 py-3 hover:bg-zinc-900 hover:text-white transition"
                href="./manifest">
            Descoperă Manifestul
          </Link>
        </div>
      </div>
    </section>
  );
}
