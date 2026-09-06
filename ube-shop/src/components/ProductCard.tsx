import Image from "next/image";
import Link from "next/link";
import { AddToCart } from "./AddToCart";
import { Price } from "./Price";
import type { Product } from "@/lib/products";
import { categoryLabel } from "@/lib/products";
import { cn } from "@/lib/cn";

const badgeCopy: Record<NonNullable<Product["badge"]>, string> = {
  bestseller: "Najczęściej zamawiane",
  nowosc: "Nowość",
  limit: "Limitowana partia",
};

/**
 * Karta produktu. Reakcja na hover jest na kontenerze i przycisku,
 * nigdy na zdjęciu - zdjęcie nie jest celem kliknięcia.
 */
export function ProductCard({
  product,
  className,
  priority = false,
}: {
  product: Product;
  className?: string;
  priority?: boolean;
}) {
  const out = product.stock === 0;

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-tile border border-line bg-panel",
        "transition-[border-color,box-shadow] duration-[220ms] ease-[var(--ease-ui)]",
        "hover:border-ube/50 hover:shadow-[0_22px_54px_-30px_var(--ube)]",
        className,
      )}
    >
      <Link
        href={`/produkt/${product.slug}`}
        tabIndex={-1}
        aria-hidden
        className="relative block aspect-[5/4] overflow-hidden bg-ube-tint"
      >
        <Image
          src={product.image}
          alt={`${product.name} - ${product.weight}`}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-[19px] leading-tight tracking-[-0.02em]">
            <Link href={`/produkt/${product.slug}`} className="outline-none">
              <span className="transition-colors duration-[150ms] group-hover:text-ube-deep">
                {product.name}
              </span>
            </Link>
          </h3>
          <Price value={product.price} compareAt={product.compareAt} size="sm" className="mt-0.5" />
        </div>

        <p className="text-[14.5px] leading-[1.5] text-ink-2">{product.tagline}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[12.5px] text-ink-3">
            <span>{categoryLabel(product.category)}</span>
            <span aria-hidden className="text-line">|</span>
            <span className="tnum">{product.weight}</span>
            {product.badge ? (
              <span className="font-medium text-ube-deep">{badgeCopy[product.badge]}</span>
            ) : null}
          </p>
          {out ? (
            <span className="text-[13px] font-medium text-ink-3">Brak w tej partii</span>
          ) : (
            <AddToCart slug={product.slug} size="sm" />
          )}
        </div>
      </div>
    </article>
  );
}
