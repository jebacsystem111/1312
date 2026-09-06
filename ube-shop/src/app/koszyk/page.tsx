import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = {
  title: "Koszyk",
  description: "Sprawdź zawartość, użyj kodu rabatowego i dopisz kartkę do paczki.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <CartView />;
}
