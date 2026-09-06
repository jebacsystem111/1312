import { cn } from "@/lib/cn";

/**
 * Jeden marquee na stronę. Ruch jest dekoracyjny i niesie tylko zasięg asortymentu,
 * więc pod prefers-reduced-motion zwalnia do statycznej listy.
 */
export function Marquee({ items, className }: { items: readonly string[]; className?: string }) {
  const row = [...items, ...items];
  return (
    <div className={cn("relative overflow-hidden border-y border-line bg-panel py-3.5", className)}>
      <div className="marquee flex w-max items-center gap-8 whitespace-nowrap">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8" aria-hidden={i >= items.length}>
            <span className="font-display text-[15px] uppercase tracking-[0.1em] text-ink-2">
              {item}
            </span>
            <span className="text-ube" aria-hidden>
              /
            </span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-panel to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-panel to-transparent" />
    </div>
  );
}
