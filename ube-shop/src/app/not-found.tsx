import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-x-14">
        <div className="lg:col-span-5">
          <h1 className="display-xl max-w-[11ch]">Nie ma tej strony</h1>
          <p className="mt-6 max-w-[46ch] text-[16.5px] leading-relaxed text-ink-2">
            Adres się nie zgadza albo produkt wyszedł z poprzedniej partii. Koszyk na pewno został,
            jeśli coś w nim zostawiłeś.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/sklep"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-ube-deep px-5 text-[15.5px] font-medium text-ube-on transition-[background-color,transform] duration-[190ms] ease-[var(--ease-ui)] hover:bg-ube-deeper active:scale-[0.98]"
            >
              Zobacz sklep <ArrowRight size={17} />
            </Link>
            <Link
              href="/"
              className="inline-flex h-12 items-center rounded-full border border-line px-5 text-[15.5px] font-medium transition-colors duration-[190ms] hover:border-ube"
            >
              Strona główna
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {products.slice(0, 2).map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
