import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/koszyk", "/zamowienie"],
      },
    ],
    sitemap: "https://purpura.pl/sitemap.xml",
  };
}
