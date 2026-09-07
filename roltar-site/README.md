# ROLTAR - odświeżony serwis (wersja wielostronicowa)

> **Gotowy pakiet do wgrania:** `roltar-serwis-do-wgrania.zip` (w tym katalogu).
> Rozpakuj i wgraj zawartość na serwer - szczegóły w sekcji "Wdrożenie".

Odświeżenie wizualne serwisu firmy ROLTAR / Rol-Tar PPHU Wacław Lubera
(Tarnów, ul. Makuszyńskiego 41 - osłony okienne, bramy, markizy).
Kierunek projektu: grafit + czerwień, wyrazisty i profesjonalny.
Projekt powstał z zastosowaniem reguł zawartych w zbiorach skills z tego
repozytorium (`emilskills/`, `gust/`, `impeccableskills/`).

## Struktura (12 stron + wspólne zasoby)

| Plik | Strona |
|---|---|
| `str.gl.htm` | Strona główna (skrócona, z kafelkami kategorii) |
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
| `assets/style.css` | Wspólny arkusz stylów całego serwisu |
| `assets/*.jpg` | Zdjęcia (nowe, podmienione za zgodą klienta) |
| `assets/logo2.jpg` | Lokalna kopia oryginalnego logo (fallback podglądu) |
| `tools/build_site.py` | Generator stron (wspólny szablon + treści) |

## Ważne ustalenia

- **Logo:** wszędzie w serwisie jako pierwsze ładowane jest oryginalne
  `logo2.jpg` z serwera. Kopia w `assets/logo2.jpg` służy wyłącznie jako
  fallback (np. przy podglądzie lokalnym) i jest pobierana z wizytówki
  Panorama Firm należącej do firmy (ta sama firma: adres, telefon, e-mail).
  **Nie wgrywać pliku `logo2.jpg` do katalogu głównego serwera** (tam już
  jest oryginał - nie wolno go nadpisać).
- **Podstrony szczegółowe** (np. `rolaluminiowe.htm`, `bs.htm`, `markizy2.htm`)
  są linkowane bezwzględnie na serwer (`www.roltar.in.tarnow.pl/...`) i otwie-
  rają się w nowej karcie - to wciąż oryginalne strony (do ewentualnego
  odświeżenia w przyszłości).
- Treści (dane, godziny, opisy produktów, linki) pochodzą z obecnej strony i
  katalogów firmowych - nie zostały zmyślone.
- Nowe zdjęcia produktów wygenerowano w spójnej stylistyce (oryginalne były
  przestarzałe, niskiej rozdzielczości); logo pozostaje oryginalne.

## Wdrożenie na serwer (FTP)

1. Zrób kopię zapasową katalogu na serwerze.
2. Wgraj pliki `str.gl.htm`, `syst.zac.htm`, `rolety.htm`, `bramy.htm`,
   `kraty.htm`, `markizy.htm`, `refleksole.htm`, `napedy.htm`, `moskitiery.htm`,
   `folie.htm`, `roltar.htm`, `kontakt.html` do katalogu głównego serwisu
   (zastępując obecne pliki o tych samych nazwach).
3. Wgraj katalog `assets/` obok plików (nowy katalog - nie koliduje).
4. NIE nadpisuj `logo2.jpg` ani pozostałych oryginalnych plików, do których
   serwis się odwołuje.

## Regeneracja stron

Po zmianie treści w `tools/build_site.py` wystarczy uruchomić:
`python3 tools/build_site.py` (z katalogu `roltar-site/`).
