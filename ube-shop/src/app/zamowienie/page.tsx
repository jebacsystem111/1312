import type { Metadata } from "next";
import { Checkout } from "@/components/Checkout";

export const metadata: Metadata = {
  title: "Zamówienie",
  description: "Dane do kontaktu, dostawa i płatność w trzech krokach na jednej stronie.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <Checkout />;
}
