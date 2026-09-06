"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Trash, X } from "@phosphor-icons/react/dist/ssr";
import { useCart } from "@/lib/cart";
import { FREE_SHIPPING_FROM } from "@/lib/products";
import { zl } from "@/lib/format";
import { Quantity } from "./Quantity";
import { cn } from "@/lib/cn";

export function CartDrawer() {
  const { isOpen, close, ready, lines, count, subtotal, discount, total, freeShippingLeft, setQty, remove } =
    useCart();
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const closer = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && panel.current) {
        const nodes = panel.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
        );
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closer.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [isOpen, close]);

  const progress = Math.min(1, 1 - freeShippingLeft / FREE_SHIPPING_FROM);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Koszyk">
          <motion.button
            type="button"
            aria-label="Zamknij koszyk"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 cursor-default bg-ink/45 backdrop-blur-[2px]"
          />

          <motion.div
            ref={panel}
            initial={reduce ? { opacity: 0 } : { transform: "translateX(100%)" }}
            animate={reduce ? { opacity: 1 } : { transform: "translateX(0%)" }}
            exit={reduce ? { opacity: 0 } : { transform: "translateX(100%)" }}
            transition={{
              duration: reduce ? 0.15 : 0.34,
              ease: [0.32, 0.72, 0, 1],
            }}
            className="absolute inset-y-0 right-0 flex w-full max-w-[27rem] flex-col border-l border-line bg-paper"
          >
            <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
              <h2 className="font-display text-[21px] tracking-[-0.02em]">
                Koszyk
                <span className="ml-2 text-[15px] font-normal text-ink-3 tnum">
                  {ready ? `${count} ${count === 1 ? "rzecz" : "rzeczy"}` : ""}
                </span>
              </h2>
              <button
                ref={closer}
                type="button"
                onClick={close}
                className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-2 transition-colors duration-[150ms] hover:border-ube hover:text-ube-deep"
              >
                <X size={17} />
                <span className="sr-only">Zamknij</span>
              </button>
            </div>

            {!ready ? (
              <div className="flex-1 space-y-4 p-5">
                {[0, 1].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-16 w-16 animate-pulse rounded-xl bg-ube-tint" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-3.5 w-2/3 animate-pulse rounded-full bg-ube-tint" />
                      <div className="h-3 w-1/3 animate-pulse rounded-full bg-line-soft" />
                    </div>
                  </div>
                ))}
              </div>
            ) : count === 0 ? (
              <div className="flex flex-1 flex-col items-start justify-center gap-4 px-6 pb-10">
                <p className="font-display text-[26px] leading-tight tracking-[-0.03em]">
                  Pusto. Jeszcze żaden słoik tu nie czeka.
                </p>
                <p className="max-w-[38ch] text-[15px] leading-relaxed text-ink-2">
                  Zacznij od halayi 250 g albo weź box z czterema rzeczami na pierwszy raz.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Link
                    href="/sklep"
                    onClick={close}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-ube-deep px-5 text-[15px] font-medium text-ube-on transition-[background-color,transform] duration-[190ms] ease-[var(--ease-ui)] hover:bg-ube-deeper active:scale-[0.98]"
                  >
                    Zobacz sklep <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/produkt/halaya-250"
                    onClick={close}
                    className="inline-flex h-11 items-center rounded-full border border-line px-5 text-[15px] font-medium transition-colors duration-[190ms] hover:border-ube"
                  >
                    Halaya klasyczna
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="border-b border-line-soft px-5 py-3">
                  <p className="mb-2 text-[13.5px] text-ink-2">
                    {freeShippingLeft > 0 ? (
                      <>
                        Do darmowej dostawy brakuje{" "}
                        <span className="font-medium text-ink tnum">{zl(freeShippingLeft)}</span>
                      </>
                    ) : (
                      <span className="font-medium text-ube-deep">Dostawa w cenie zamówienia</span>
                    )}
                  </p>
                  <div className="h-[3px] w-full overflow-hidden rounded-full bg-line-soft">
                    <div
                      className="h-full origin-left rounded-full bg-ube transition-transform duration-[420ms] ease-[var(--ease-ui)]"
                      style={{ transform: `scaleX(${progress})` }}
                    />
                  </div>
                </div>

                <ul className="flex-1 divide-y divide-line-soft overflow-y-auto px-5">
                  {lines.map((line) => (
                    <li key={line.slug} className="flex gap-4 py-4">
                      <Link
                        href={`/produkt/${line.slug}`}
                        onClick={close}
                        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ube-tint"
                      >
                        <Image
                          src={line.image}
                          alt={line.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <Link
                            href={`/produkt/${line.slug}`}
                            onClick={close}
                            className="truncate text-[15.5px] font-medium hover:text-ube-deep"
                          >
                            {line.name}
                          </Link>
                          <span className="text-[15px] font-medium tnum">{zl(line.lineTotal)}</span>
                        </div>
                        <p className="mt-0.5 text-[13px] text-ink-3 tnum">{line.weight}</p>
                        <div className="mt-2.5 flex items-center justify-between">
                          <Quantity
                            size="sm"
                            value={line.qty}
                            min={1}
                            max={line.stock}
                            onChange={(next) => setQty(line.slug, next)}
                            label={`Sztuki: ${line.name}`}
                          />
                          <button
                            type="button"
                            onClick={() => remove(line.slug)}
                            className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[13px] text-ink-3 transition-colors duration-[150ms] hover:text-ube-deep"
                          >
                            <Trash size={14} /> Usuń
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-line px-5 py-4">
                  <dl className="space-y-1.5 text-[14.5px]">
                    <div className="flex justify-between">
                      <dt className="text-ink-2">Suma częściowa</dt>
                      <dd className="tnum">{zl(subtotal)}</dd>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-ube-deep">
                        <dt>Rabat</dt>
                        <dd className="tnum">-{zl(discount)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-line-soft pt-2 text-[17px] font-medium">
                      <dt>Razem</dt>
                      <dd className="tnum">{zl(total)}</dd>
                    </div>
                  </dl>
                  <p className="mt-1 text-[12.5px] text-ink-3">
                    Dostawa liczona przy zamówieniu. Od {zl(FREE_SHIPPING_FROM)} darmowa.
                  </p>

                  <div className="mt-4 grid gap-2">
                    <Link
                      href="/zamowienie"
                      onClick={close}
                      className={cn(
                        "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ube-deep text-[15.5px] font-medium text-ube-on",
                        "transition-[background-color,transform] duration-[190ms] ease-[var(--ease-ui)] hover:bg-ube-deeper active:scale-[0.98]",
                      )}
                    >
                      Przejdź do zamówienia <ArrowRight size={17} />
                    </Link>
                    <Link
                      href="/koszyk"
                      onClick={close}
                      className="inline-flex h-11 items-center justify-center rounded-full border border-line text-[15px] font-medium transition-colors duration-[190ms] hover:border-ube"
                    >
                      Edytuj koszyk i dane do faktury
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
