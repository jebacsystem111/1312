# ROLTAR - odświeżona strona główna

Odświeżenie wizualne strony głównej firmy ROLTAR (Tarnów, osłony okienne).
Kierunek projektu: grafit + czerwień, wyrazisty i profesjonalny.
Projekt powstał z zastosowaniem reguł zawartych w zbiorach skills z tego
repozytorium (`emilskills/`, `gust/`, `impeccableskills/`).

## Zawartość

- `str.gl.htm` - odświeżona strona główna (główny plik do wdrożenia)
- `assets/` - nowe zdjęcia produktów (rolety, bramy, markizy, moskitiery,
  kraty) oraz awaryjne logo `logo.svg`
- `index.html` - plik pomocniczy tylko dla podglądu lokalnego

## Wdrożenie na serwer (FTP)

1. Wgraj `str.gl.htm` do katalogu głównego serwisu, **zastępując** obecny
   plik o tej samej nazwie (najpierw zrób kopię zapasową starego pliku).
2. Wgraj katalog `assets/` obok pliku (nowy katalog, nie koliduje z
   istniejącymi plikami serwisu).
3. Oryginalne logo `logo2.jpg` i podstrony (`.htm`) już są na serwerze -
   strona odwołuje się do nich względnymi ścieżkami, więc zadziałają
   automatycznie. Gdyby logo nie było dostępne, strona sama pokaże wersję
   awaryjną z `assets/logo.svg`.

## Uwagi

- Treści (dane kontaktowe, godziny, opis firmy, linki do podstron) pochodzą
  z obecnej strony i nie zostały zmyślone.
- Zdjęcia produktów zostały wymienione na nowe (oryginalne były
  przestarzałe, niskiej rozdzielczości).
- Strona nie używa Flasha ani liczników odwiedzin.
