import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import { faq } from "@/lib/content";
import { cn } from "@/lib/cn";

/**
 * Akordeon na natywnym details/summary: darmowa dostępność klawiaturą,
 * otwarty pierwszy element, zero JS. Strzałka obraca się 190 ms ease-out.
 */
export function Faq({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-x-10 sm:grid-cols-2", className)}>
      {faq.map((item, i) => (
        <details
          key={item.q}
          open={i === 0}
          className="group border-b border-line py-4 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-line sm:[&:nth-child(2)]:border-t-0"
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[16.5px] font-medium marker:hidden">
            <span className="pt-0.5 transition-colors duration-[150ms] group-hover:text-ube-deep">
              {item.q}
            </span>
            <CaretDown
              size={17}
              className="mt-1 shrink-0 text-ink-3 transition-transform duration-[190ms] ease-[var(--ease-ui)] group-open:rotate-180"
            />
          </summary>
          <p className="max-w-[58ch] pt-2.5 text-[15px] leading-relaxed text-ink-2">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
