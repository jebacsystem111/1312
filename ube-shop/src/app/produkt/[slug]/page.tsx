import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  HourglassMedium,
  Package,
  SealCheck,
  Snowflake,
  Truck,
} from "@phosphor-icons/react/dist/ssr";
import { AddToCart } from "@/components/AddToCart";
import { Gallery } from "@/components/Gallery";
import { Price } from "@/components/Price";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { FREE_SHIPPING_FROM, categoryLabel, productBySlug, products } from "@/lib/products";
import { plural, zl } from "@/lib/format";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) return { title: "Nie ma takiego produktu" };
  return {
    title: product.name,
    description: `${product.tagline}. ${product.blurb.slice(0, 120)}`,
    alternates: { canonical: `/produkt/${product.slug}` },
    openGraph: {
      title: `${product.name} - Purpura`,
      description: product.tagline,
      images: [{ url: product.image, width: 1000, height: 1250, alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .concat(products.filter((p) => p.slug !== product.slug && p.category !== product.category))
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.gallery,
    description: product.blurb,
    sku: product.slug,
    category: categoryLabel(product.category),
    offers: {
      "@type": "Offer",
      priceCurrency: "PLN",
      price: (product.price / 100).toFixed(2),
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-[1400px] px-4 pt-8 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <nav aria-label="Ścieżka" className="flex flex-wrap items-center gap-2 text-[13.5px] text-ink-3">
          <Link href="/sklep" className="transition-colors duration-[150ms] hover:text-ube-deep">
            Sklep
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ink-2">{categoryLabel(product.category)}</span>
          <span aria-hidden>/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-x-14">
          {/* --- wizual --- */}
          <div className="lg:col-span-6 xl:col-span-7">
            <div className="lg:sticky lg:top-24">
              <Gallery images={product.gallery} alt={`${product.name}, ${product.weight}`} />
            </div>
          </div>

          {/* --- zakup --- */}
          <div className="lg:col-span-6 xl:col-span-5">
            <h1 className="display-lg max-w-[14ch]">{product.name}</h1>
            <p className="mt-4 max-w-[46ch] text-[17px] leading-[1.5] text-ink-2">{product.tagline}</p>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
              <Price value={product.price} compareAt={product.compareAt} size="lg" />
              <p className="text-[14px] text-ink-3">
                <span className="tnum">{product.weight}</span>
                <span className="mx-2 text-line" aria-hidden>
                  |
                </span>
                {product.stock > 0 ? (
                  <>
                    Zostało <span className="font-medium text-ink tnum">{product.stock}</span>{" "}
                    {plural(product.stock, "sztuka", "sztuki", "sztuk")} w tej partii
                  </>
                ) : (
                  <span className="font-medium text-ube-deep">Brak w tej partii</span>
                )}
              </p>
            </div>

            <p className="mt-6 max-w-[52ch] text-[16px] leading-relaxed">{product.blurb}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <AddToCart slug={product.slug} size="lg" label="Dodaj do koszyka" />
              <Link
                href="/koszyk"
                className="inline-flex h-13 items-center gap-2 rounded-full border border-line px-5 text-[15px] font-medium transition-[border-color,background-color] duration-[190ms] ease-[var(--ease-ui)] hover:border-ube hover:bg-ube-tint"
              >
                Koszyk <ArrowRight size={16} />
              </Link>
            </div>

            <ul className="mt-8 grid gap-x-6 gap-y-3 border-t border-line pt-6 text-[14.5px] text-ink-2 sm:grid-cols-2">
              <li className="flex items-start gap-2.5">
                <Truck size={17} weight="duotone" className="mt-0.5 shrink-0 text-ube" />
                <span>
                  Kurier chłodniczy lub paczkomat, wysyłka do 48 h. Darmowo od {zl(FREE_SHIPPING_FROM)}.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Snowflake size={17} weight="duotone" className="mt-0.5 shrink-0 text-ube" />
                <span>{product.storage}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <HourglassMedium size={17} weight="duotone" className="mt-0.5 shrink-0 text-ube" />
                <span>Partia w każdy wtorek i piątek, od 6:00 w kuchni.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <SealCheck size={17} weight="duotone" className="mt-0.5 shrink-0 text-ube" />
                <span>
                  {product.allergens.length
                    ? `Alergeny: ${product.allergens.join(", ")}.`
                    : "Bez alergenów głównych."}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* --- jak jeść --- */}
        <section aria-labelledby="jak-jesc" className="mt-20 border-t border-line pt-14 lg:mt-28">
          <h2 id="jak-jesc" className="display-md max-w-[20ch]">
            Jak to jeść
          </h2>
          <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {product.serving.map((s, i) => (
              <Reveal key={s.title} delay={0.05 * i}>
                <h3 className="font-display text-[19px] tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-2 max-w-[38ch] text-[15.5px] leading-relaxed text-ink-2">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* --- skład i dane --- */}
        <section aria-label="Skład i przechowywanie" className="mt-14 grid gap-x-14 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-display text-[16px] tracking-[-0.01em] text-ink">Skład</h3>
            <p className="mt-3 text-[15.5px] leading-relaxed">{product.ingredients.join(", ")}</p>
          </div>
          <div>
            <h3 className="font-display text-[16px] tracking-[-0.01em] text-ink">Alergeny</h3>
            <p className="mt-3 text-[15.5px] leading-relaxed">
              {product.allergens.length ? product.allergens.join(", ") : "Brak"}
            </p>
          </div>
          <div>
            <h3 className="font-display text-[16px] tracking-[-0.01em] text-ink">Przechowywanie</h3>
            <p className="mt-3 text-[15.5px] leading-relaxed">{product.storage}</p>
          </div>
          <div>
            <h3 className="font-display text-[16px] tracking-[-0.01em] text-ink">Pakowanie</h3>
            <p className="mt-3 text-[15.5px] leading-relaxed">
              Tektura z recyklingu, wypełnienie z papieru, lód w żelu do zamrożenia ponownie.
            </p>
          </div>
        </section>

        {/* --- do kompletu --- */}
        <section aria-labelledby="do-kompletu" className="mt-20 border-t border-line pt-14 lg:mt-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="do-kompletu" className="display-md">
              Do kompletu
            </h2>
            <Link href="/sklep" className="group inline-flex items-center gap-2 pb-1 text-[15px] font-medium hover:text-ube-deep">
              Cały sklep
              <ArrowRight size={16} className="transition-transform duration-[190ms] ease-[var(--ease-ui)] group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      </div>

      {/* Zdjęcie z kuchni, nie dekoracja: pokazuje, co jest w środku słoika. */}
      <div className="border-t border-line bg-paper-2">
        <div className="mx-auto grid max-w-[1400px] items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-tile border border-line">
              <Image
                src="/img/process-pot.jpg"
                alt="Mieszanie gęstej masy halaya w dużym garnku mosiężnym nad ogniem"
                width={1400}
                height={900}
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-5">
            <h2 className="display-md max-w-[22ch]">
              Ta sama masa, z której jest {product.name.toLowerCase()}
            </h2>
            <p className="mt-4 max-w-[44ch] text-[16px] leading-relaxed text-ink-2">
              Smażymy ją sześć godzin w jednym garnku, bez pośpiechu i bez zagęstników. Dzięki temu
              halaya trzyma kształt na łyżce i nie puszczy wody na kanapce.
            </p>
            <Link
              href="/#proces"
              className="mt-6 inline-flex items-center gap-2 text-[15px] font-medium text-ube-deep hover:underline"
            >
              <Package size={17} weight="duotone" /> Zobacz cały proces
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
