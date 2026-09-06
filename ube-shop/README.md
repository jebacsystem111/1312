# Purpura - sklep z ube

Projekt strony internetowej sklepu z **ube** (filipińskim jamem fioletowym): halaya, lody,
pieczywo na parze, koncentrat do latte, zestawy i subskrypcja. Next.js 16 (App Router,
Server Components) + Tailwind v4 + Motion, bez backendu - koszyk i zamówienie działają w
przeglądarce.

```bash
cd ube-shop
npm install
npm run dev     # http://localhost:3000
npm run build   # build produkcyjny, wszystkie route'y statyczne
```

---

## Design read (krótko, zanim padnie pytanie „dlaczego tak")

> Reading this as: **e-commerce + landing dla rzemieślniczej marki deserowej** (odbiorca: 25-40,
> zna ube z TikToka i z kawiarni, kupuje online i wchodzi po odbiór), język wizualny
> **premium-consumer / hospitality**, kierunek: własny system na native CSS tokens + Tailwind v4,
> font display variable, motion o niskim natężeniu.

| Dial | Wartość | Dlaczego |
| --- | --- | --- |
| `DESIGN_VARIANCE` | **7** | Marka rzemieślnicza, nie korpo. Asymetria w hero i w bento produktów, ale bez eksperymentu agencyjnego - klient ma trafić do koszyka. |
| `MOTION_INTENSITY` | **5** | Ruch niesie hierarchię: wejście hero, scroll-reveal, sticky-stack procesu, drawer na krzywej iOS. Zero nieskończonych pętli poza jednym marquee. |
| `VISUAL_DENSITY` | **3** | Sprzedaż produktu, nie panel. Dużo powietrza, jedno zdjęcie na sekcję, dane w małych blokach. |

### Paleta

Jedno akcentowe źródło koloru: **prawdziwy ube**, czyli przygaszony fiolet (`oklch(52.5% 0.155 305)`),
a nie „AI purple gradient". Krótka reguła taste-skill mówi: jeśli brand sam jest fioletowy, wejdź
w to, ale konsekwentnie - stąd neutralna baza (mleczna biel, bakłażanowy ink) i trzymanie akcentu
w ryzach:

- `--paper` / `--paper-2` / `--panel` - powierzchni, zero czystej bieli
- `--ink` `--ink-2` `--ink-3` - trzy poziomy tekstu, zero czystej czerni
- `--ube` - akcent (ikony, wypełnienia pasków, separator), `--ube-deep` - wypełnienia przycisków,
  `--ube-deeper` - hover, `--ube-tint` - tła paneli i kafli
- Jeden zestaw tokenów na tryb jasny i ciemny (`prefers-color-scheme`), sekcje nie zmieniają motywu w połowie strony.

**Kontrast policzony, nie „na oko"** - wszystkie pary tekst/tło w obu trybach ≥ 4.5:1 (WCAG AA
dla tekstu 13-16 px). Sprawdź własnym skryptem lub:

```
# pary, które realnie występują w UI
ink, ink-2, ink-3, ube-deep na paper / paper-2 / panel / ube-tint
ube-on na ube-deep (przycisk) i na ube-deeper (hover)
```

### Typografia

- **Display:** `Bricolage Grotesque Variable` (200-800) - ma charakter, ale nie jest serifem „bo DESER = serif".
- **Tekst:** `Instrument Sans Variable`.
- Obie self-hostowane przez `@fontsource-variable`, z podzbiorem `latin-ext`, więc ą/ę/ł/ż/ź nie wypadają w piksele zapasowe. Zero `<link>` do Google Fonts.
- Skale: `display-xl` / `display-lg` / `display-md` (`clamp`, tracking `-0.03em`, nigdy mocniej niż `-0.04em`).
- Cyfry cen i gramatur: `font-variant-numeric: tabular-nums` (klasa `.tnum`).

### Ruch (reguły Emil Kowalski z submodule `emilskills`)

- Krzywe zdefiniowane raz: `--ease-ui: cubic-bezier(0.23,1,0.32,1)`, `--ease-move`, `--ease-drawer: cubic-bezier(0.32,0.72,0,1)`.
- Wejścia tylko `ease-out`, nigdy `ease-in`; `scale(0.99)` + opacity, nigdy `scale(0)`.
- UI ≤ 300 ms (drawer 340 ms, bo to pełnoekranowa powierzchnia), animowane wyłącznie `transform` i `opacity`.
- W Motion pełny string `transform` zamiast skrótów `x/y/scale` (akceleracja GPU).
- Hover odpalany tylko pod `@media (hover: hover) and (pointer: fine)`; całość pod `prefers-reduced-motion: reduce` zwalnia do fade lub stoi.
- Sticky-stack procesu jest na CSS `position: sticky`, bez GSAP i bez ScrollTriggera - tańsze narzędzie, które robi tę samą robotę.

---

## Struktura

```
src/
  app/
    layout.tsx            metadata, viewport, provider koszyka, header/footer/drawer
    page.tsx              sklep-pulpit: hero, marquee, bento produktów, proces, subskrypcja,
                          opinie, kawiarnia, FAQ + newsletter
    globals.css           tokeny, fonty, bazy, utility display-*, stack-card, marquee
    sklep/page.tsx        listing z filtrami, szukaniem i sortowaniem
    produkt/[slug]/        SSG (generateStaticParams) + galeria + JSON-LD Product
    subskrypcja/page.tsx  plany z przełącznikiem cyklu, data najbliższej partii liczona z kalendarza
    koszyk/page.tsx       pozycje, kod rabatowy, kartka do paczki, podsumowanie
    zamowienie/page.tsx   formularz z walidacją, pełny cykl stanów, ekran potwierdzenia
    regulamin/ polityka-prywatnosci/
    error.tsx not-found.tsx loading.tsx sitemap.ts robots.ts icon.svg
  components/             Header, CartDrawer, ProductCard, AddToCart, Quantity, Gallery,
                          ShopGrid, Checkout, CartView, SubscribePlans, Newsletter, Faq,
                          Marquee, Reveal, Skeletons, Price, Footer, Legal
  lib/
    products.ts           katalog, kategorie, wysyłka, kody rabatowe (typ - docelowy, dane - mock)
    cart.tsx              kontekst koszyka + localStorage (hydratacja-safe, brak mismatchu)
    content.ts            copy sekcji, godziny, opinie, FAQ, plany
    dates.ts              najbliższa partia (wtorek/piątek) liczona w strefie Europe/Warsaw
    format.ts             ceny pl-PL w groszach, odmiana liczebników
  public/img/             10 zdjęć produktowych i procesowych (wygenerowanych do projektu)
```

### Co jest zrobione „na serio", a nie atrapą

- **Koszyk**: realny stan (dodawanie, ilość z limitem partii, usuwanie, kod rabatowy, darmowa
  dostawa od progu), zapis w `localStorage`, liczenie dopiero po hydratacji.
- **Stany cyklu**: skeleton (kształt przyszłego układu, nie spinner), pusty koszyk z drogą powrotu,
  błąd walidacji pola przy polu, sukces z numerem zamówienia, `error.tsx` z resetem.
- **A11y**: skip-link, `role="dialog"` + pułapka focusu + Esc + blokada scrolla w drawerze,
  label nad inputem, `aria-invalid`/`aria-describedby`, `aria-live` na wynikach i błędach,
  focus ring w kolorze akcentu, natywny `details` w FAQ.
- **Nawierzchnie przeglądarki**: `::selection`, scrollbar, `caret-color`, `text-underline-offset`,
  `scroll-margin-top` pod kotwice - rzeczy, które zwykle nie należą do żadnego systemu.
- **SEO**: metadata per route, canonical, OG, `sitemap.xml`, `robots.txt`, JSON-LD `Store` i `Product`,
  brak indeksowania koszyka i zamówienia.
- **Wydajność**: hero `priority`, reszta lazy z `sizes`, wszystkie route'y statyczne
  (prerender), fonty variable self-hosted z `font-display: swap`.

## Dane demonstracyjne

Ceny, stany partii, składy, godziny, opinie i teksty prawne są przykładowe (oznaczone w
`src/lib/products.ts` i w `components/Legal.tsx`). Przed startem sprzedaży podmienić:
katalog na źródło (Shopify/admin), wysyłkę na kuriera z API, płatności na przelewy24/Stripe
i regulamin na wersję po prawniku.

## Jak włączyć realne płatności

1. `/src/components/Checkout.tsx`: `submit()` wysyła POST do własnego route handleru zamiast `setTimeout`.
2. Handler tworzy sesję płatności i zwraca URL; po `return_url` koszyk czyści się po potwierdzeniu, nie przed.
3. Koszyk w `src/lib/cart.tsx` ma już kształt `{ lines, note, gift }` - to payload, który idzie do backendu.

## Checklist pre-flight (taste-skill §14) - wynik

Zero em-dashy w markupie (`grep -rn "—\|–" src/` = 0), zero ikon rysowanych od zera (Phosphor,
jedna rodzina), brak `transition: all`, brak `h-screen`, brak `addEventListener("scroll")`,
jeden akcent na całą stronę, jedna rodzina radiusów (14/20 px + pill na kontrolkach),
nawigacja w jednej linii i 64 px, hero w 2 liniach z CTA w pierwszym kadrze, 0 eyebrowów
powtarzających się nad każdym nagłówkiem, marquee jeden, karty bento z realnym zdjęciem
w 3 komórkach, liczba komórek = liczba produktów (5 na 5), cytaty ≤ 3 linie,
listy na akordeonie zamiast `divide-y`, dane w koszyku i w checkout z pełnymi stanami.
