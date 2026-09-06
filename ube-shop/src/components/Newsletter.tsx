"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle, SpinnerGap, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/cn";

type Status = "idle" | "sending" | "done" | "error";

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/** Formularz z pełnym cyklem stanów: walidacja, wysyłka, sukces, błąd. */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL.test(email.trim())) {
      setStatus("error");
      setMessage("Sprawdź adres, wygląda na niekompletny.");
      return;
    }
    setStatus("sending");
    setMessage("");
    window.setTimeout(() => {
      setStatus("done");
      setMessage("Zapisane. Pierwszy list przyjdzie w wtorek po partii.");
    }, 800);
  };

  return (
    <div className="rounded-tile border border-ube/25 bg-ube-tint p-6 sm:p-8">
      <h3 className="display-md">List z kuchni</h3>
      <p className="mt-2.5 max-w-[42ch] text-[15px] leading-relaxed text-ink-2">
        Raz w tygodniu: co gotujemy, czego już nie ma, i jedno przepisanie przepisu na domową
        halayę. Bez wyprzedażowego szumu.
      </p>

      {status === "done" ? (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded-card border border-ube/30 bg-panel px-4 py-3.5"
        >
          <CheckCircle size={20} weight="fill" className="mt-0.5 shrink-0 text-ube" />
          <div>
            <p className="text-[15px] font-medium">Dziękujemy</p>
            <p className="text-[14px] text-ink-2">{message}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="mt-6">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <label className="sr-only" htmlFor="newsletter-email">
              Adres e-mail
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="adres@email.pl"
              value={email}
              aria-invalid={status === "error"}
              aria-describedby={status === "error" ? "newsletter-error" : undefined}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") {
                  setStatus("idle");
                  setMessage("");
                }
              }}
              className={cn(
                "h-12 rounded-full border bg-panel px-4 text-[15px] text-ink placeholder:text-ink-3",
                "transition-[border-color,box-shadow] duration-[190ms] ease-[var(--ease-ui)]",
                status === "error" ? "border-ube-deep" : "border-line focus:border-ube",
              )}
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className={cn(
                "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ube-deep px-5 text-[15px] font-medium text-ube-on",
                "transition-[background-color,transform] duration-[190ms] ease-[var(--ease-ui)]",
                "hover:bg-ube-deeper active:scale-[0.98] disabled:opacity-80",
              )}
            >
              {status === "sending" ? (
                <>
                  <SpinnerGap size={17} className="animate-spin" aria-hidden /> Wysyłamy
                </>
              ) : (
                <>
                  Zapisz się <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          <p
            id="newsletter-error"
            aria-live="polite"
            className={cn(
              "mt-2.5 flex items-center gap-1.5 text-[13.5px]",
              status === "error" ? "text-ube-deep" : "sr-only",
            )}
          >
            {status === "error" && <WarningCircle size={15} aria-hidden />}
            {status === "error" ? message : "Rezygnacja jednym kliknięciem w każdym mailu."}
          </p>
        </form>
      )}
    </div>
  );
}
