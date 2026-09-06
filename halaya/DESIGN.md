# Design

## Świat wizualny

Filipiński stragan spożywczy spotyka polskie delikatesy. Materiały świata: kremowy papier pakowy, etykiety cenowe, perforowane bilety partii, barcody, wiklinowe skrzynki. Fiolet ube jest kolorem produktu — pojawia się tam, gdzie produkt.

## Paleta

- `--paper #F5EDE0` tło strony; `--paper-deep #ECE0CB` sekcje; `--paper-raised #FBF6EA` karty i pola
- `--ink #2A1330` tusz; `--ink-soft #4A2B52`; `--muted #6B5A66` (≥4.5:1 na papierze)
- `--plum #3A1E4A` powierzchnie ciemne (marquee, newsletter, stopka)
- `--ube-rich #5C2E7E` akcje; `--ube-deep #46225F` hover
- `--gold #B37E22` wyłącznie akcenty: gwiazdki, etykiety, kody rabatowe

## Typografia

Fraunces (display, italic dla słów-akcentów) + Space Grotesk (UI). Ceny i ilości: `font-variant-numeric: tabular-nums`. Nagłówki: `text-wrap: balance`, tracking ≥ -0.02em, maks. ~4.6rem.

## Kompozycja i zasady

- Karty: jedna elewacja (border 1px), radius 12–16px, hover = uniesienie + cień z offsetem i rozmyciem.
- Hairline'y i kreskowane „perforacje" zamiast dekoracyjnych ramek; żadnych bocznych pasków >1px.
- Zero eyebrow-kickerów nad nagłówkami; nagłówek niesie ciężar sam.
- Numery sekcji tylko w procesie dostawy (sekwencja jest informacją).
- Ikony: rysowane SVG, jedna kreska 1.6–1.8px; brak emoji i glifów.
- Bez gradientowego tekstu, bez szkła dekoracyjnego, bez cieni bez offsetu.

## Ruch (jeden autorski system)

1. Wejście hero — jedna orkiestracja (kaskada 0.75s, ease-out exponencjalny), tylko raz.
2. Fly-to-cart — obraz leci do koszyka (feedback + spójność przestrzenna, 0.62s spring).
3. Drawer/modal/menu — transform z springiem (0.4–0.48s).
4. Marquee — tekstura świata, pauza na hover.
5. Wszystko z `prefers-reduced-motion`; akcje częste (qty) bez animacji lub ledwo wyczuwalne.

## Stany

Hover, focus-visible (ring), disabled, loading (kasa), pusty koszyk, błędy formularzy z nazwą problemu i naprawą. `::selection`, scrollbar i caret z palety.
