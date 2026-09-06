"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Gift, Trash, X } from "@phosphor-icons/react/dist/ssr";
import { Price } from "./Price";
import { ProductCard } from "./ProductCard";
import { Quantity } from "./Quantity";
import { useCart } from "@/lib/cart";
import { FREE_SHIPPING_FROM, PROMOS, productBySlug, products } from "@/lib/products";
import { zl } from "@/lib/format";
import { cn } from "@/lib/cn";

export function CartView() {
  const {
    ready,
    lines,
    count,
    subtotal,
    discount,
    total,
    freeShippingLeft,
    promo,
    applyPromo,
    clearPromo,
    setQty,
    remove,
    clear,
    note,
    setNote,
    gift,
    setGift,
  } = useCart();
  const [code, setCode] = useState("");
  const [promoError, setPromoError] = useState("");

  const suggestions = products
    .filter((p) => !lines.some((l) => l.slug === p.slug) && p.stock > 0)
    .sort((a, b) => a.price - b.price)
    .slice(0, 2);

  if (!ready) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8" aria-busy="true">
        <div className="h-9 w-32 animate-pulse rounded-full bg-ube-tint" />
        <div className="mt-10 space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-tile bg-paper-2" />
          ))}
        </div>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h1 className="display-lg max-w-[16ch]">Koszyk jest pusty</h1>
            <p className="mt-5 max-w-[44ch] text-[16.5px] leading-relaxed text-ink-2">
              Nic tu nie leży. Od tego się zaczyna: halaya do chleba i kawy, lody na potem, a box
              Purpura, jeśli chcesz mieć cztery rzeczy naraz.
            </p>
            <Link
              href="/sklep"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-ube-deep px-5 text-[15.5px] font-medium text-ube-on transition-[background-color,transform] duration-[190ms] ease-[var(--ease-ui)] hover:bg-ube-deeper active:scale-[0.98]"
            >
              Przejdź do sklepu <ArrowRight size={17} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-6">
            {products.slice(0, 2).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-8">
        <h1 className="display-lg">
          Koszyk
          <span className="ml-3 align-middle font-sans text-[15px] font-normal text-ink-3 tnum">
            {count} {count === 1 ? "rzecz" : "rzeczy"}
          </span>
        </h1>
        <div className="flex items-center gap-5 text-[14.5px]">
          <Link href="/sklep" className="text-ink-2 underline decoration-line underline-offset-4 hover:text-ube-deep">
            Dodaj coś jeszcze
          </Link>
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-1.5 text-ink-3 transition-colors duration-[150ms] hover:text-ube-deep"
          >
            <Trash size={15} /> Opróżnij
          </button>
        </div>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-x-14">
        <div className="lg:col-span-7">
          <ul>
            {lines.map((line) => {
              const product = productBySlug(line.slug);
              return (
                <li key={line.slug} className="flex gap-5 border-b border-line-soft py-6 first:pt-0">
                  <Link
                    href={`/produkt/${line.slug}`}
                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-card border border-line bg-ube-tint sm:h-28 sm:w-28"
                  >
                    <Image src={line.image} alt={line.name} fill sizes="112px" className="object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="font-display text-[19px] leading-tight tracking-[-0.02em]">
                          <Link href={`/produkt/${line.slug}`} className="hover:text-ube-deep">
                            {line.name}
                          </Link>
                        </h2>
                        <p className="mt-1 text-[13.5px] text-ink-3">
                          <span className="tnum">{line.weight}</span>
                          {product ? (
                            <>
                              <span className="mx-2 text-line" aria-hidden>
                                |
                              </span>
                              <span className="tnum">{zl(line.price)} / szt.</span>
                            </>
                          ) : null}
                        </p>
                      </div>
                      <Price value={line.lineTotal} className="shrink-0" />
                    </div>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                      <Quantity
                        size="sm"
                        value={line.qty}
                        min={1}
                        max={line.stock}
                        onChange={(next) => setQty(line.slug, next)}
                        label={`Sztuki: ${line.name}`}
                      />
                      <div className="flex items-center gap-3">
                        {line.qty >= line.stock && (
                          <span className="text-[13px] text-ube-deep">
                            Więcej niż w partii ({line.stock})
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => remove(line.slug)}
                          className="grid h-8 w-8 place-items-center rounded-full border border-line text-ink-3 transition-[border-color,color] duration-[150ms] hover:border-ube hover:text-ube-deep"
                          aria-label={`Usuń ${line.name} z koszyka`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 rounded-tile border border-line bg-panel p-5 sm:p-6">
            <label htmlFor="kod" className="text-[15px] font-medium">
              Kod rabatowy
            </label>
            <p className="mt-1 text-[13.5px] text-ink-3">
              Działają: {Object.keys(PROMOS).join(", ")}. Kod liczony od sumy częściowej.
            </p>
            {promo ? (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="inline-flex items-center gap-2 rounded-full bg-ube-tint px-3.5 py-2 text-[14.5px] font-medium text-ube-deep">
                  {promo.code}
                  <span className="font-normal text-ink-2">{promo.label}</span>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    clearPromo();
                    setCode("");
                  }}
                  className="text-[14px] text-ink-3 underline decoration-line underline-offset-4 hover:text-ube-deep"
                >
                  Zdejmij kod
                </button>
              </div>
            ) : (
              <form
                className="mt-4 flex flex-wrap gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const res = applyPromo(code);
                  setPromoError(res.ok ? "" : res.message);
                  if (res.ok) setCode("");
                }}
              >
                <div className="min-w-[12rem] flex-1">
                  <input
                    id="kod"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase());
                      setPromoError("");
                    }}
                    aria-invalid={Boolean(promoError)}
                    aria-describedby={promoError ? "kod-error" : undefined}
                    placeholder="UBE10"
                    className={cn(
                      "h-11 w-full rounded-full border bg-paper px-4 text-[15px] uppercase outline-none transition-[border-color] duration-[190ms]",
                      promoError ? "border-ube-deep" : "border-line focus:border-ube",
                    )}
                  />
                </div>
                <button
                  type="submit"
                  className="h-11 rounded-full border border-line px-5 text-[15px] font-medium transition-[border-color,background-color] duration-[190ms] hover:border-ube hover:bg-ube-tint"
                >
                  Zastosuj
                </button>
                {promoError && (
                  <p id="kod-error" role="alert" className="w-full text-[13.5px] text-ube-deep">
                    {promoError}
                  </p>
                )}
              </form>
            )}
          </div>

          <div className="mt-6 rounded-tile border border-line p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <Gift size={20} weight="duotone" className="mt-0.5 shrink-0 text-ube" />
              <div>
                <label htmlFor="zyczenia" className="text-[15px] font-medium">
                  Kartka do paczki
                </label>
                <p className="mt-1 text-[13.5px] text-ink-3">
                  Napisz, co mamy wpisać. Przy prezacie nie ma ceny na paragonie.
                </p>
              </div>
            </div>
            <textarea
              id="zyczenia"
              rows={3}
              maxLength={240}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Wszystkiego najlepszego, jedz na zimno."
              className="mt-4 w-full resize-none rounded-card border border-line bg-paper p-3.5 text-[15px] leading-relaxed outline-none transition-[border-color] duration-[190ms] placeholder:text-ink-3 focus:border-ube"
            />
            <div className="mt-3 flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2.5 text-[14.5px] text-ink-2">
                <input
                  type="checkbox"
                  checked={gift}
                  onChange={(e) => setGift(e.target.checked)}
                  className="h-4 w-4 accent-[var(--ube)]"
                />
                To prezent, ukryj ceny
              </label>
              <span className="text-[13px] text-ink-3 tnum">{note.length}/240</span>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <div className="rounded-tile border border-line bg-panel p-6">
              <h2 className="font-display text-[21px] tracking-[-0.02em]">Podsumowanie</h2>
              <dl className="mt-5 space-y-2.5 text-[15px]">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-2">Suma częściowa</dt>
                  <dd className="tnum">{zl(subtotal)}</dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between gap-4 text-ube-deep">
                    <dt>Rabat {promo?.code}</dt>
                    <dd className="tnum">-{zl(discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-2">Dostawa</dt>
                  <dd className="text-ink-2">
                    {freeShippingLeft > 0 ? `od ${zl(1500)}` : "w cenie"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-line pt-3 font-display text-[20px] tracking-[-0.02em]">
                  <dt>Razem</dt>
                  <dd className="tnum">{zl(total)}</dd>
                </div>
              </dl>

              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-3">
                {freeShippingLeft > 0
                  ? `Darmowa dostawa od ${zl(FREE_SHIPPING_FROM)}. Brakuje ${zl(freeShippingLeft)}.`
                  : "Dostawa gratis. Sposób dostawy i płatności wybierzesz na następnym kroku."}
              </p>

              <Link
                href="/zamowienie"
                className="mt-6 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-ube-deep text-[16px] font-medium text-ube-on transition-[background-color,transform] duration-[190ms] ease-[var(--ease-ui)] hover:bg-ube-deeper active:scale-[0.98]"
              >
                Zamawiam <ArrowRight size={17} />
              </Link>
              <p className="mt-3 text-center text-[13px] text-ink-3">
                Płatność BLIK, kartą albo przelewem. Paragon w paczce.
              </p>
            </div>

            {suggestions.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-[17px] tracking-[-0.02em]">Dorzuć do partii</h2>
                <div className="mt-4 grid gap-4">
                  {suggestions.map((p) => (
                    <ProductCard key={p.slug} product={p} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
