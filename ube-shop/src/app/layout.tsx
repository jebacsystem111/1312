import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

const base = "https://purpura.pl";

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: {
    default: "Purpura - ube halaya, lody i kawa. Warszawa",
    template: "%s - Purpura",
  },
  description:
    "Sklep z prawdziwym ube: halaya gotowana 6 godzin, lody na śmietance, pieczywo na parze i koncentrat do latte. Wypiekamy we wtorki, wysyłamy w 48 godzin.",
  keywords: ["ube", "ube halaya", "fioletowy jam", "desery filipińskie", "sklep z ube", "Warszawa"],
  authors: [{ name: "Purpura" }],
  openGraph: {
    type: "website",
    url: base,
    siteName: "Purpura",
    title: "Purpura - ube gotowane powoli w Warszawie",
    description:
      "Halaya, lody, pandesal i kawa z prawdziwego ube. Jeden garnek dziennie, wysyłka w 48 godzin.",
    images: [{ url: "/img/hero-sandwich.jpg", width: 1000, height: 1250, alt: "Sandwich lodowy z ube" }],
    locale: "pl_PL",
  },
  twitter: { card: "summary_large_image", creator: "@purpura" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6f4" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1521" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className="min-h-[100dvh] bg-paper antialiased">
        <CartProvider>
          <Header />
          <main id="tresc">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
