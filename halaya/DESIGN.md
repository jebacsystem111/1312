# Design

## Marka

ube ube. Wordmark: Fraunces z kursywą na drugim „ube" w kolorze ube, obok znak rozciętej bulwy (SVG inline). Ostateczne logo dostarczy właściciel - wtedy trafi na ciemne tło z palety.

## Świat wizualny

Nocna, lakierowana skrzynia delikatesów: filipiński stragan po zmroku. Materiały świata: głęboka fiolet-czerń (laka), rozświetlony plum, etykiety cenowe ze złotem, perforowane bilety partii, barcody, wiklinowe skrzynki. Fiolet ube świeci jak miąższ bulwy rozciętej w ciemności; złoto pojawia się tam, gdzie cena, gwiazda, obietnica.

## Paleta

- `--paper #140A1D` tło strony; `--paper-deep #1A0E26` sekcje; `--paper-raised #241333` karty i pola; `--paper-hover #2C183C`
- `--ink #F5EDFB` nagłówki; `--ink-soft #D9C9E4`; `--muted #B4A0C2` (≥7:1 na papierze); `--faint #9A85AB` (≥5,7:1)
- `--plum #0D0614` najgłębsza czerń-fiolet; `--plum-deep #090412` stopka
- `--ube #A879D8` akcenty tekstowe i ikony (≥5,8:1); `--ube-rich #7E47B8` przyciski (biały tekst ≥6:1); `--ube-deep #6E3EA5` hover; `--ube-pale #2E1B3F` zaznaczenia
- `--gold #D4A24A` / `--gold-bright #E0B45C` / `--gold-pale #F3E3BF` — tylko akcenty: gwiazdki, etykiety, kody rabatowe, perforacje

## Typografia

Fraunces (display, italic dla słów-akcentów) + Space Grotesk (UI). Ceny i ilości: `font-variant-numeric: tabular-nums`. Nagłówki: `text-wrap: balance`, tracking ≥ -0.02em, maks. ~4.6rem.

## Kompozycja i zasady

- Karty: jedna elewacja (border 1px), radius 12–16px, hover = uniesienie + głęboki cień (czerń, nie poświata).
- Hairline'y i kreskowane „perforacje" zamiast dekoracyjnych ramek; żadnych bocznych pasków >1px.
- Zero eyebrow-kickerów nad nagłówkami; nagłówek niesie ciężar sam.
- Numery sekcji tylko w procesie dostawy (sekwencja jest informacją).
- Ikony: rysowane SVG, jedna kreska 1.6–1.8px; brak emoji i glifów.
- Bez gradientowego tekstu, bez szkła dekoracyjnego, bez poświat i neonów.

## Ruch (jeden autorski system)

1. Wejście hero — jedna orkiestracja (kaskada 0.75s, ease-out exponencjalny), tylko raz.
2. Fly-to-cart — obraz leci do koszyka (feedback + spójność przestrzenna, 0.62s spring).
3. Drawer/modal/menu — transform z springiem (0.4–0.48s).
4. Marquee — tekstura świata, pauza na hover.
5. Wszystko z `prefers-reduced-motion`; akcje częste (qty) bez animacji lub ledwo wyczuwalne.

## Stany

Hover, focus-visible (ring), disabled, loading (kasa), pusty koszyk, błędy formularzy z nazwą problemu i naprawą. `::selection`, scrollbar i caret z palety.
