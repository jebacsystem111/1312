# 1312

Unified repository for the combined AI skill collections from `emilskills`, `gust`, and `impeccableskills`.

## halaya/ — sklep z ube

Sklep internetowy sprzedający ube (fioletowy pochrzyn z Filipin), zbudowany z użyciem zasad z trzech kolekcji skilli: anti-slop i diale gustu (`gust`), zasady ruchu (`emilskills`), craft floor i system design (`impeccableskills`).

- `index.html` — pełna strona (hero, marquee, historia, sklep z filtrami, proces dostawy, opinie, FAQ, newsletter, stopka)
- `styles.css` — design system: ciemny fiolet (laka) + fiolet ube + złote akcenty; Fraunces + Space Grotesk; kontrasty ≥ 4,5:1; reduced-motion
- `app.js` — koszyk (localStorage), fly-to-cart, drawer z progiem darmowej dostawy (149 zł), kasa 3-krokowa z walidacją, toast, menu mobilne
- `assets/` — 9 zdjęć produktowych w jednym języku wizualnym
- `PRODUCT.md` / `DESIGN.md` — prawda o produkcie i trwałe decyzje wizualne

Uruchomienie: `python3 -m http.server 8080 --directory halaya`
