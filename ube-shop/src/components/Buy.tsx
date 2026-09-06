"use client";

import { useState } from "react";
import { AddToCart } from "./AddToCart";
import { Quantity } from "./Quantity";
import { cn } from "@/lib/cn";

/** Pasek zakupu na stronie produktu: liczba sztuk + przycisk. Jeden stan, nie dwa. */
export function Buy({
  slug,
  stock,
  className,
}: {
  slug: string;
  stock: number;
  className?: string;
}) {
  const [qty, setQty] = useState(1);

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <Quantity value={qty} onChange={setQty} min={1} max={Math.max(1, stock)} label="Liczba sztuk" />
      <AddToCart slug={slug} qty={qty} size="lg" label="Dodaj do koszyka" />
      {stock <= 15 && (
        <p className="w-full text-[13.5px] text-ube-deep sm:w-auto">
          Partia schodzi szybko, przy większym zamówieniu napisz do nas.
        </p>
      )}
    </div>
  );
}
