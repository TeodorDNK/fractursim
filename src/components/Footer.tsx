import Link from "next/link";

type Props = { t: Record<string, any>; locale?: "ro" | "en" | "it" };

export default function Footer({ t, locale = "ro" }: Props) {
  const base = `/${locale}`;
  const year = new Date().getFullYear();

  return (
    <footer
      className="
        border-t mt-16
        bg-[var(--background)] text-[var(--foreground)]
      "
      role="contentinfo"
    >
      <div className="max-w-[1100px] mx-auto px-5 py-8">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <small className="opacity-80">
            {t.footer?.rights ?? "Fracturism®"} &copy; {year}
          </small>

          <div className="hidden md:block h-4 w-px bg-[var(--foreground)]/20" />

          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <Link
              href={`${base}/legal/termeni`}
              className="hover:underline underline-offset-4"
            >
              {t.footer?.terms ?? "Termene și condiții"}
            </Link>
            <Link
              href={`${base}/legal/cookies`}
              className="hover:underline underline-offset-4"
            >
              {t.footer?.cookies ?? "Politica de cookie"}
            </Link>
            <Link
              href={`${base}/legal/confidentialitate`}
              className="hover:underline underline-offset-4"
            >
              {t.footer?.privacy ?? "Politica de confidențialitate"}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
