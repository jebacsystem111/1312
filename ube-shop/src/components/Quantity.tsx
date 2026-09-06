"use client";

import { Minus, Plus } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/cn";

/** Stepper liczby sztuk. Enter i klawiatura działają, bo pole jest prawdziwym inputem. */
export function Quantity({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  label = "Liczba sztuk",
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
}) {
  const box = size === "sm" ? "h-9" : "h-11";
  const btn = size === "sm" ? "w-9" : "w-11";
  const input = size === "sm" ? "w-8 text-[14px]" : "w-10 text-[15px]";

  const step = (delta: number) => {
    const next = Math.max(min, Math.min(max, value + delta));
    if (next !== value) onChange(next);
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-line bg-paper",
        box,
      )}
    >
      <button
        type="button"
        aria-label="Jedna mniej"
        disabled={value <= min}
        onClick={() => step(-1)}
        className={cn(
          "grid h-full place-items-center rounded-full text-ink-2",
          "transition-colors duration-[140ms] ease-[var(--ease-ui)] hover:text-ube-deep",
          "disabled:opacity-35 disabled:hover:text-ink-2",
          btn,
        )}
      >
        <Minus size={14} />
      </button>
      <input
        aria-label={label}
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const n = Number.parseInt(e.target.value.replace(/\D/g, ""), 10);
          onChange(Number.isNaN(n) ? min : Math.max(min, Math.min(max, n)));
        }}
        className={cn(
          "h-full border-x border-line bg-transparent text-center font-medium tnum",
          "outline-none focus-visible:outline-2 focus-visible:outline-ube",
          input,
        )}
      />
      <button
        type="button"
        aria-label="Jedna więcej"
        disabled={value >= max}
        onClick={() => step(1)}
        className={cn(
          "grid h-full place-items-center rounded-full text-ink-2",
          "transition-colors duration-[140ms] ease-[var(--ease-ui)] hover:text-ube-deep",
          "disabled:opacity-35 disabled:hover:text-ink-2",
          btn,
        )}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
