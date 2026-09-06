"use client";

import { useState } from "react";
import { Check, ShoppingBag, SpinnerGap } from "@phosphor-icons/react/dist/ssr";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/cn";

type Phase = "idle" | "adding" | "added";

/**
 * Trzy stany przycisku, bo koszyk to jedyna czynność, którą użytkownik
 * tu wykonuje wielokrotnie. 350 ms potwierdzenia to tyle, żeby ruch nie
 * wyglądał na opóźnienie, a dość, żeby go zauważyć.
 */
export function AddToCart({
  slug,
  qty = 1,
  label = "Do koszyka",
  size = "md",
  className,
}: {
  slug: string;
  qty?: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const { add } = useCart();
  const [phase, setPhase] = useState<Phase>("idle");

  const press = () => {
    if (phase !== "idle") return;
    setPhase("adding");
    window.setTimeout(() => {
      add(slug, qty);
      setPhase("added");
      window.setTimeout(() => setPhase("idle"), 1500);
    }, 320);
  };

  const sizes = {
    sm: "h-9 px-3 text-[13.5px] gap-1.5",
    md: "h-11 px-4 text-[15px] gap-2",
    lg: "h-13 px-6 text-base gap-2.5",
  } as const;

  const tone =
    phase === "added"
      ? "bg-ube-tint text-ube-deep border-transparent"
      : "bg-ube-deep text-ube-on border-transparent hover:bg-ube-deeper";

  return (
    <button
      type="button"
      onClick={press}
      aria-label={`${label}: ${phase === "added" ? "dodano" : "dodać"}`}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border font-medium",
        "transition-[background-color,color,transform,border-color] duration-[190ms] ease-[var(--ease-ui)]",
        "active:translate-y-px active:scale-[0.985] disabled:opacity-70",
        "hover:enabled:shadow-[0_10px_26px_-14px_var(--ube)]",
        sizes[size],
        tone,
        className,
      )}
    >
      {phase === "idle" && <ShoppingBag size={17} weight="duotone" />}
      {phase === "adding" && <SpinnerGap size={17} className="animate-spin" aria-hidden />}
      {phase === "added" && <Check size={17} aria-hidden />}
      <span className="whitespace-nowrap">
        {phase === "adding" ? "Wkładam" : phase === "added" ? "W koszyku" : label}
      </span>
    </button>
  );
}
