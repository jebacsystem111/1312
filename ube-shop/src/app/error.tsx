"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowsClockwise } from "@phosphor-icons/react/dist/ssr";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Tu podłączysz wysyłkę do Sentry / Logs. Na razie nie zgłaszamy fałszywych alarmów.
    console.error("[purpura]", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="max-w-[54ch]">
        <h1 className="display-lg max-w-[16ch]">Strona się nie wyświetliła</h1>
        <p className="mt-6 text-[16.5px] leading-relaxed text-ink-2">
          To po naszej stronie. Koszyk masz zapisany lokalnie, więc nic nie zniknie - spróbuj
          odświeżyć, a jeśli będzie się powtarzać, napisz do nas z numerem poniżej.
        </p>
        {error.digest && (
          <p className="mt-4 font-sans text-[13.5px] text-ink-3">
            Identyfikator zdarzenia: <span className="tnum">{error.digest}</span>
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-ube-deep px-5 text-[15.5px] font-medium text-ube-on transition-[background-color,transform] duration-[190ms] ease-[var(--ease-ui)] hover:bg-ube-deeper active:scale-[0.98]"
          >
            <ArrowsClockwise size={17} /> Spróbuj ponownie
          </button>
          <Link
            href="/sklep"
            className="inline-flex h-12 items-center rounded-full border border-line px-5 text-[15.5px] font-medium transition-colors duration-[190ms] hover:border-ube"
          >
            Wróć do sklepu
          </Link>
        </div>
      </div>
    </div>
  );
}
