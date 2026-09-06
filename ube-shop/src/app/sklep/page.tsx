import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopGrid } from "@/components/ShopGrid";
import { ProductCardSkeleton } from "@/components/Skeletons";
import { FREE_SHIPPING_FROM } from "@/lib/products";
import { zl } from "@/lib/format";

export const metadata: Metadata = {
  title: "Sklep",
  description:
    "Halaya z ube, lody na śmietance, pieczywo na parze, koncentrat do latte i zestawy prezentowe. Darmowa dostawa od 150 zł.",
  alternates: { canonical: "/sklep" },
};

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <header className="grid gap-6 border-b border-line pb-10 lg:grid-cols-12">
        <h1 className="display-xl max-w-[12ch] lg:col-span-7">Sklep</h1>
        <div className="lg:col-span-5 lg:pt-4">
          <p className="max-w-[48ch] text-[16px] leading-relaxed text-ink-2">
            Wszystko, co gotujemy, jest w jednej z dwóch partii: wtorkowej albo piątkowej. Stan
            poniżej to stan z rana, więc jeśli czegoś brakuje w koszyku, to znaczy, że garnek się
            skończył.
          </p>
          <p className="mt-3 text-[14px] text-ink-3">
            Darmowa dostawa od {zl(FREE_SHIPPING_FROM)} · wysyłka w 48 godzin · odbiór na Wilczej
          </p>
        </div>
      </header>

      <div className="pt-10">
        <Suspense
          fallback={
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <ShopGrid />
        </Suspense>
      </div>
    </div>
  );
}
