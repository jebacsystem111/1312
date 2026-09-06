import type { MetadataRoute } from "next";
import { products } from "@/lib/products";

const base = "https://purpura.pl";

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();
  return [
    { url: `${base}/`, lastModified: today, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/sklep`, lastModified: today, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/subskrypcja`, lastModified: today, changeFrequency: "monthly", priority: 0.7 },
    ...products.map((p) => ({
      url: `${base}/produkt/${p.slug}`,
      lastModified: today,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
