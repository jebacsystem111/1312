"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react/dist/ssr";
import { ProductCard } from "./ProductCard";
import { categories, products, type CategoryId } from "@/lib/products";
import { plural } from "@/lib/format";
import { cn } from "@/lib/cn";

type Filter = CategoryId | "all";
type Sort = "polecane" | "cena-wzrost" | "cena-spadek" | "stan";

const sortLabels: Record<Sort, string> = {
  polecane: "Polecane",
  "cena-wzrost": "Cena rosnąco",
  "cena-spadek": "Cena malejąco",
  stan: "Kończy się dziś",
};

export function ShopGrid() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("polecane");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter((p) => {
      const okCat = filter === "all" || p.category === filter;
      const okQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.blurb.toLowerCase().includes(q);
      return okCat && okQuery;
    });
    const sorted = [...list];
    if (sort === "cena-wzrost") sorted.sort((a, b) => a.price - b.price);
    if (sort === "cena-spadek") sorted.sort((a, b) => b.price - a.price);
    if (sort === "stan") sorted.sort((a, b) => a.stock - b.stock);
    return sorted;
  }, [filter, query, sort]);

  const chips: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "Wszystko", count: products.length },
    ...categories.map((c) => ({
      id: c.id as Filter,
      label: c.label,
      count: products.filter((p) => p.category === c.id).length,
    })),
  ];

  return (
    <div>
      <div className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0">
        {chips.map((chip) => {
          const active = filter === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(chip.id)}
              className={cn(
                "inline-flex h-10 shrink-0 snap-start items-center gap-2 rounded-full border px-4 text-[14.5px] font-medium",
                "transition-[background-color,color,border-color,transform] duration-[190ms] ease-[var(--ease-ui)] active:scale-[0.98]",
                active
                  ? "border-transparent bg-ink text-paper"
                  : "border-line bg-paper text-ink-2 hover:border-ube hover:text-ink",
              )}
            >
              {chip.label}
              <span className={cn("text-[12.5px] tnum", active ? "text-paper/70" : "text-ink-3")}>
                {chip.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-3 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-72">
          <label htmlFor="szukaj" className="sr-only">
            Szukaj w sklepie
          </label>
          <MagnifyingGlass
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-3"
          />
          <input
            id="szukaj"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Szukaj: halaya, lody, pandesal"
            className="h-11 w-full rounded-full border border-line bg-panel pl-11 pr-10 text-[15px] outline-none transition-[border-color] duration-[190ms] placeholder:text-ink-3 focus:border-ube"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Wyczyść wyszukiwanie"
              className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-ink-3 transition-colors duration-[150ms] hover:bg-ube-tint hover:text-ink"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <p className="text-[14px] text-ink-3" aria-live="polite">
            {results.length}{" "}
            {plural(results.length, "pozycja", "pozycje", "pozycji")}
          </p>
          <label htmlFor="sort" className="sr-only">
            Sortowanie
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="h-11 rounded-full border border-line bg-panel px-4 text-[14.5px] outline-none transition-[border-color] duration-[190ms] focus:border-ube"
          >
            {Object.entries(sortLabels).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="mt-16 flex flex-col items-start gap-4 border-t border-line pt-14">
          <h2 className="display-md max-w-[18ch]">Nic takiego nie leży w tej lodówce</h2>
          <p className="max-w-[46ch] text-[15.5px] leading-relaxed text-ink-2">
            Nie mamy tego w bieżącej partii. Możesz wyczyścić filtry albo napisać, czego szukasz -
            sprawdzimy, czy damy radę ugotować.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
            className="inline-flex h-11 items-center rounded-full bg-ube-deep px-5 text-[15px] font-medium text-ube-on transition-[background-color,transform] duration-[190ms] ease-[var(--ease-ui)] hover:bg-ube-deeper active:scale-[0.98]"
          >
            Pokaż wszystko
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
