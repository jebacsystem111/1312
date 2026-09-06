"use client";

import { useState } from "react";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { plans } from "@/lib/content";
import { zl } from "@/lib/format";
import { cn } from "@/lib/cn";
import Link from "next/link";

type Cadence = "monthly" | "quarterly";

/**
 * Dwa plany z przełącznikiem cyklu rozliczeń.
 * Nie trzy karty - plany są dwa, więc są dwie pozycje w układzie,
 * a różnica ceny jest pokazana w tym samym wierszu co kwota.
 */
export function SubscribePlans({ compact = false }: { compact?: boolean }) {
  const [cadence, setCadence] = useState<Cadence>("monthly");

  return (
    <div className={cn("flex flex-col", compact ? "gap-5" : "gap-6")}>
      <div className="inline-flex w-fit items-center rounded-full border border-line bg-paper p-1">
        {(
          [
            ["monthly", "Co miesiąc"],
            ["quarterly", "Co kwartał (taniej o 12%)"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={cadence === id}
            onClick={() => setCadence(id)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-[13.5px] font-medium",
              "transition-[background-color,color] duration-[190ms] ease-[var(--ease-ui)]",
              cadence === id ? "bg-ink text-paper" : "text-ink-2 hover:text-ink",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className={cn("grid gap-4", compact ? "" : "sm:grid-cols-2")}>
        {plans.map((plan) => {
          const price = cadence === "monthly" ? plan.priceMonthly : plan.priceQuarterly;
          return (
            <li
              key={plan.id}
              className={cn(
                "flex flex-col rounded-tile border bg-panel p-6",
                "transition-[border-color,box-shadow] duration-[220ms] ease-[var(--ease-ui)]",
                plan.highlight
                  ? "border-ube/55 shadow-[0_20px_50px_-34px_var(--ube)]"
                  : "border-line hover:border-ube/40",
              )}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-[22px] tracking-[-0.025em]">{plan.name}</h3>
                <p className="text-right">
                  <span className="font-display text-[26px] tnum tracking-[-0.02em]">
                    {zl(price)}
                  </span>
                  <span className="text-[13.5px] text-ink-3"> / {cadence === "monthly" ? "mies." : "kw."}</span>
                </p>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{plan.summary}</p>
              <ul className="mt-5 space-y-2.5">
                {plan.includes.map((line) => (
                  <li key={line} className="flex items-start gap-2.5 text-[15px]">
                    <Check size={17} className="mt-0.5 shrink-0 text-ube" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center gap-3 pt-1">
                <Link
                  href={`/subskrypcja?plan=${plan.id}&cykl=${cadence}`}
                  className={cn(
                    "inline-flex h-11 items-center rounded-full px-5 text-[15px] font-medium",
                    "transition-[background-color,color,transform] duration-[190ms] ease-[var(--ease-ui)] active:scale-[0.98]",
                    plan.highlight
                      ? "bg-ube-deep text-ube-on hover:bg-ube-deeper"
                      : "border border-line text-ink hover:border-ube",
                  )}
                >
                  Wybieram
                </Link>
                <span className="text-[13px] text-ink-3">Bez umowy, anulujesz do 5. dnia</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
