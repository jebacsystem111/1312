import Link from "next/link";
import { Mark } from "./Header";
import { site } from "@/lib/content";
import { categories } from "@/lib/products";

const help = [
  { label: "Wysyłka i odbiór", href: "/#faq" },
  { label: "Subskrypcja", href: "/subskrypcja" },
  { label: "Zamówienia na przyjęcia", href: `mailto:${site.email}` },
  { label: "Reklamacje", href: `mailto:${site.email}` },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper-2">
      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Mark size={24} />
              <span className="font-display text-[21px] font-semibold uppercase leading-none tracking-[0.07em]">
                Purpura
              </span>
            </div>
            <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-ink-2">
              {site.claim}. Mała kuchnia, jeden garnek dziennie, wysyłka w 48 godzin.
            </p>
          </div>

          <nav aria-label="Kategorie">
            <h2 className="font-display text-[15px] uppercase tracking-[0.06em] text-ink-3">
              Sklep
            </h2>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              <li>
                <Link href="/sklep" className="text-ink hover:text-ube-deep">
                  Wszystko
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/sklep#${c.id}`}
                    className="text-ink transition-colors duration-[150ms] hover:text-ube-deep"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Pomoc">
            <h2 className="font-display text-[15px] uppercase tracking-[0.06em] text-ink-3">
              Pomoc
            </h2>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {help.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-ink transition-colors duration-[150ms] hover:text-ube-deep"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-display text-[15px] uppercase tracking-[0.06em] text-ink-3">
              Kawiarnia
            </h2>
            <address className="mt-4 space-y-2.5 text-[15px] not-italic text-ink-2">
              <p>{site.address}</p>
              <p>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-ube-deep tnum">
                  {site.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${site.email}`} className="hover:text-ube-deep">
                  {site.email}
                </a>
              </p>
            </address>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[15px]">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="text-ink underline decoration-line underline-offset-4 transition-colors duration-[150ms] hover:text-ube-deep hover:decoration-ube"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-6 text-[13.5px] text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Purpura Sp. z o.o. Ceny zawierają VAT 8% na żywność.</p>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <Link href="/regulamin" className="hover:text-ube-deep">
              Regulamin
            </Link>
            <Link href="/polityka-prywatnosci" className="hover:text-ube-deep">
              Prywatność
            </Link>
            <span>Projekt demonstracyjny, dane sklepu są przykładowe</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
