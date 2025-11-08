"use client";

import { useId, useState } from "react";

type Props = {
  t?: {
    title?: string;
    description?: string;
    emailLabel?: string;
    messageLabel?: string;
    submit?: string;
    success?: string;
    error?: string;
  };
};

export default function ContactForm({ t }: Props) {
  const emailId = useId();
  const msgId = useId();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // honeypot
  const [hp, setHp] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message, hp }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setNotice({ type: "ok", text: t?.success || "Mesaj trimis. Mulțumim!" });
        setEmail("");
        setMessage("");
      } else {
        setNotice({ type: "err", text: data?.error || t?.error || "Eroare la trimitere." });
      }
    } catch {
      setNotice({ type: "err", text: t?.error || "Eroare la trimitere." });
    } finally {
      setLoading(false);
    }
  };

  return (
    // ----- MODIFICAT AICI -----
    // Am schimbat 'mt-20' în 'py-20' și am adăugat 'bg-zinc-50/50'
    // pentru a se potrivi cu designul secțiunii "Citat" și "Footer".
    // Am eliminat gradientul care nu mai este necesar.
    <section className="py-20 bg-zinc-50/50">
      <div className="max-w-[920px] mx-auto px-6">
        {/* Această cutie albă interioară arată acum perfect 
          pe fundalul 'bg-zinc-50/50' al secțiunii.
        */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-6 md:p-10">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-[var(--font-arhaic)]">
              {t?.title || "Scrie-ne un mesaj"}
            </h2>
            <p className="text-zinc-600 mt-1 font-serif"> {/* Am adăugat font-serif */}
              {t?.description || "Lasă-ne adresa ta de e-mail și mesajul. Răspundem în cel mai scurt timp."}
            </p>
          </div>

          <form onSubmit={onSubmit} className="grid gap-4">
            {/* honeypot (ascuns) */}
            <input
              type="text"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid gap-2">
              <label htmlFor={emailId} className="text-sm text-zinc-700 font-serif"> {/* Am adăugat font-serif */}
                 {t?.emailLabel || "E-mail"} 
              </label>
              <input
                id={emailId}
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-md border border-zinc-300 px-3 outline-none focus:ring-2 focus:ring-zinc-900/10 font-serif" /* Am adăugat font-serif */
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor={msgId} className="text-sm text-zinc-700 font-serif"> {/* Am adăugat font-serif */}
                 {t?.messageLabel || "Mesaj"} 
              </label>
              <textarea
                id={msgId}
                required
                rows={5}
                placeholder="Spune-ne cum te putem ajuta…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="rounded-md border border-zinc-300 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900/10 font-serif" /* Am adăugat font-serif */
              />
            </div>

            <div className="mt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                // Am adăugat font-arhaic și stilul de la link-urile 'Read more'
                className="inline-flex items-center justify-center h-11 px-6 rounded-md border border-zinc-900 bg-zinc-900 text-white hover:bg-black transition disabled:opacity-60 font-[var(--font-arhaic)] tracking-wide"
              >
                {loading ? "Se trimite…" : (t?.submit || "Trimite")}
              </button>

              {notice && (
                <div
                  className={
                    notice.type === "ok"
                      ? "text-sm text-emerald-600 font-serif" /* Am adăugat font-serif */
                      : "text-sm text-red-600 font-serif" /* Am adăugat font-serif */
                  }
                >
                  {notice.text}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}