# 1312

Unified repository for the combined AI skill collections from `emilskills`, `gust`, and `impeccableskills`.

## halaya/ — sklep z ube

Sklep internetowy sprzedający ube (fioletowy pochrzyn z Filipin), zbudowany z użyciem zasad z trzech kolekcji skilli: anti-slop i diale gustu (`gust`), zasady ruchu (`emilskills`), craft floor i system design (`impeccableskills`).

Struktura wielostronicowa (mapowana 1:1 na Shopify: strona główna, kolekcja, blog z artykułami, podstrony):

- `index.html` — strona główna (hero, marquee, bestseller, historia, proces, opinie, newsletter)
- `sklep.html` — katalog produktów z filtrami kategorii
- `przepisy.html` — hub przepisów (blog)
- `przepisy/*.html` — 4 przepisy: lemoniada z ube, latte z ube, halaya, mochi
- `o-nas.html` — historia i wartości
- `dostawa.html` — proces, tabela dostaw, FAQ, zwroty
- `kontakt.html` — dane kontaktowe + formularz z walidacją
- `styles.css` — design system: ciemny fiolet (laka) + fiolet ube + złote akcenty; Fraunces + Space Grotesk; kontrasty ≥ 4,5:1; reduced-motion
- `app.js` — koszyk (localStorage), fly-to-cart, drawer z progiem darmowej dostawy (149 zł), kasa 3-krokowa z walidacją, toast, menu mobilne
- `assets/` — zdjęcia produktowe i przepisów w jednym języku wizualnym
- `PRODUCT.md` / `DESIGN.md` — prawda o produkcie i trwałe decyzje wizualne

Uruchomienie: `python3 -m http.server 8080 --directory halaya`
