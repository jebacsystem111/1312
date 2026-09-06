"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { List, ShoppingBag, X } from "@phosphor-icons/react/dist/ssr";
import { useCart } from "@/lib/cart";
import { nav } from "@/lib/content";
import { cn } from "@/lib/cn";

/** Znak: przekrój bulwy jako geometria, bez ilustracji. */
export function Mark({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      className="shrink-0 text-ube"
    >
      <ellipse cx="12" cy="12" rx="11" ry="9.5" fill="currentColor" opacity="0.16" />
      <ellipse cx="12" cy="12" rx="7.4" ry="6.2" fill="currentColor" opacity="0.42" />
      <ellipse cx="12" cy="12" rx="3.6" ry="3" fill="currentColor" />
    </svg>
  );
}

export function Header() {
  const { count, ready, open, bump } = useCart();
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  useEffect(() => setMenu(false), [pathname]);

  // Menu mobilne nie może zostać otwarte po zmianie route'u ani po Esc.
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menu]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/88 backdrop-blur-md">
      <a
        href="#tresc"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-ube-deep focus:px-4 focus:py-2 focus:text-sm focus:text-ube-on"
      >
        Przejdź do treści
      </a>

      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Purpura - strona główna">
          <Mark />
          <span className="font-display text-[19px] font-semibold uppercase leading-none tracking-[0.07em]">
            Purpura
          </span>
        </Link>

        <nav aria-label="Główna nawigacja" className="ml-4 hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const active =
              item.href === "/#kawiarnia" || item.href === "/#proces"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-2 text-[15px] text-ink-2",
                  "transition-colors duration-[150ms] ease-[var(--ease-ui)] hover:bg-ube-tint hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/sklep"
            className="hidden rounded-full border border-line px-4 py-2 text-[14.5px] font-medium text-ink sm:inline-flex"
          >
            Cały sklep
          </Link>

          <button
            type="button"
            onClick={open}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-full bg-ink px-3.5 text-[14.5px] font-medium text-paper",
              "transition-[transform,background-color] duration-[190ms] ease-[var(--ease-ui)]",
              "hover:bg-ube-deep active:scale-[0.98]",
            )}
          >
            <ShoppingBag size={17} weight="duotone" />
            <span className="hidden sm:inline">Koszyk</span>
            <motion.span
              key={bump}
              aria-hidden
              initial={reduce ? false : { transform: "scale(0.86)" }}
              animate={{ transform: "scale(1)" }}
              transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
              className={cn(
                "grid min-w-6 place-items-center rounded-full px-1.5 text-[12.5px] tnum",
                ready && count > 0 ? "bg-ube-deep text-ube-on" : "bg-paper/25 text-paper/85",
              )}
            >
              {ready ? count : <span className="block h-2 w-2 animate-pulse rounded-full bg-paper/50" />}
            </motion.span>
            <span className="sr-only">
              {ready ? `Koszyk: ${count} ${count === 1 ? "pozycja" : "pozycji"}` : "Koszyk"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMenu((v) => !v)}
            aria-expanded={menu}
            aria-controls="menu-mobilne"
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink lg:hidden"
          >
            {menu ? <X size={18} /> : <List size={18} />}
            <span className="sr-only">{menu ? "Zamknij menu" : "Otwórz menu"}</span>
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {menu && (
          <motion.div
            id="menu-mobilne"
            key="menu"
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduce ? 0.15 : 0.26, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden border-t border-line bg-paper lg:hidden"
          >
            <nav aria-label="Menu mobilne" className="mx-auto flex max-w-[1400px] flex-col px-4 py-2 sm:px-6">
              {nav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="border-b border-line-soft py-3.5 text-[17px] last:border-0"
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/koszyk" className="py-3.5 text-[17px] font-medium text-ube-deep">
                Koszyk ({ready ? count : 0})
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
