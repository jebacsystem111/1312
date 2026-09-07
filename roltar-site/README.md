# ROLTAR - odświeżony serwis (wersja wielostronicowa)

> **Gotowy pakiet do wgrania:** `roltar-serwis-do-wgrania.zip` (w tym katalogu).
> Rozpakuj i wgraj zawartość na serwer - szczegóły w sekcji "Wdrożenie".

Odświeżenie wizualne serwisu firmy ROLTAR / Rol-Tar PPHU Wacław Lubera
(Tarnów, ul. Makuszyńskiego 41 - osłony okienne, bramy, markizy).
Kierunek projektu: grafit + czerwień, wyrazisty i profesjonalny.
Projekt powstał z zastosowaniem reguł zawartych w zbiorach skills z tego
repozytorium (`emilskills/`, `gust/`, `impeccableskills/`).

## Struktura (44 strony + wspólne zasoby)

| Plik | Strona |
|---|---|
| `index.html` | **Strona główna** (skrócona, z kafelkami kategorii; ładowana automatycznie po wejściu na domenę) |
| `str.gl.htm` | Przekierowanie na `index.html` (dla starych odnośników) |
| `syst.zac.htm` | Systemy osłon okiennych (zewnętrzne / wewnętrzne) |
| `rolety.htm` | Rolety i żaluzje |
| `bramy.htm` | Bramy |
| `kraty.htm` | Kraty rolowane |
| `markizy.htm` | Markizy |
| `refleksole.htm` | Refleksole |
| `napedy.htm` | Napędy i automatyka |
| `moskitiery.htm` | Moskitiery |
| `folie.htm` | Folie okienne |
| `roltar.htm` | Dojazd do firmy (z mapą Google) |
| `kontakt.html` | Kontakt |
| `*.htm` (31 podstron) | **Strony szczegółowe** pod oryginalnymi nazwami plików serwisu (`rolaluminiowe.htm`, `zaluzjefasadowe.htm`, `pionowe.htm`, `poziome.htm`, `drewniane.htm`, `plisowane.htm`, `wolnowiszace.htm`, `mini.htm`, `besta.htm`, `luiza.htm`, `rzymskie.htm`, `dachowe.htm`, `impresja.htm`, `track.htm`, `systadap.htm`, `podtynk.htm`, `nadpro.htm`, `rolety1234.htm`, `bs.htm`, `brrol.htm`, `bpsp.htm`, `bp.htm`, `ndr.htm`, `ndbr.htm`, `ndm.htm`, `szlabany.htm`, `mtaras.htm`, `mbalkon.htm`, `mkosz.htm`, `mniest.htm`, `markizy2.htm`) - nadpisują stare podstrony, cały serwis działa w nowej szacie |
| `assets/style.css` | Wspólny arkusz stylów całego serwisu |
| `assets/*.jpg` | Zdjęcia (nowe, podmienione za zgodą klienta) |
| `assets/logo2.jpg` | Lokalna kopia oryginalnego logo (fallback podglądu) |
| `tools/build_site.py` | Generator stron (wspólny szablon + treści) |
| `tools/details.py` | Generator stron szczegółowych (ładowany przez `build_site.py`) |

## Ważne ustalenia

- **Logo:** wszędzie w serwisie jako pierwsze ładowane jest oryginalne
  `logo2.jpg` z serwera. Kopia w `assets/logo2.jpg` służy wyłącznie jako
  fallback (np. przy podglądzie lokalnym) i jest pobierana z wizytówki
  Panorama Firm należącej do firmy (ta sama firma: adres, telefon, e-mail).
  **Nie wgrywać pliku `logo2.jpg` do katalogu głównego serwera** (tam już
  jest oryginał - nie wolno go nadpisać).
- **Wszystkie podstrony są odświeżone**: strony szczegółowe powstają pod
  oryginalnymi nazwami plików (np. `ndr.htm`, `bs.htm`, `rolety1234.htm`),
  a wszystkie odnośniki w serwisie prowadzą do stron lokalnych - po wgraniu
  pakietu żadna podstrona nie otwiera się już w starej szacie.
- Treści (dane, godziny, opisy produktów, linki) pochodzą z obecnej strony i
  katalogów firmowych - nie zostały zmyślone.
- Nowe zdjęcia produktów wygenerowano w spójnej stylistyce (oryginalne były
  przestarzałe, niskiej rozdzielczości); logo pozostaje oryginalne.

## Wdrożenie na serwer (FTP)

1. Zrób kopię zapasową katalogu na serwerze.
2. Wgraj pliki `*.html`, `*.htm` z tego katalogu do katalogu głównego
   serwisu (zastępując obecne pliki o tych samych nazwach - `index.html` jako
   strona główna będzie wyświetlany automatycznie po wejściu na domenę).
3. Wgraj katalog `assets/` obok plików (nowy katalog - nie koliduje).
4. NIE nadpisuj `logo2.jpg` ani pozostałych oryginalnych plików, do których
   serwis się odwołuje.

## Regeneracja stron

Po zmianie treści w `tools/build_site.py` lub `tools/details.py` wystarczy
uruchomić: `python3 tools/build_site.py` (z katalogu `roltar-site/`).

