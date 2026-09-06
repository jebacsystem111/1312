# 1312

Zbiór skillsów AI (design/taste) w jednym repo + jeden realny projekt zbudowany na ich bazie.

## Submoduły

| Katalog | Co to jest |
| --- | --- |
| `emilskills` | Skillsy Emila Kowalskiego: decyzje animacyjne, krzywe, czasy, review ruchu |
| `gust` | Taste Skill - anty-slop frontend (dialy, paleta, typografia, pre-flight check) |
| `impeccableskills` | Impeccable - język designu, craft floor, zakazane wzorce |

To podmoduły git wskazujące na przypięte commity. Kiedyś w repo brakowało pliku `.gitmodules`,
więc po Clone folderach było pusto i `git submodule update --init` wywalało
`fatal: no submodule mapping found in .gitmodules`. Dodanie `.gitmodules` to naprawia:

```bash
git submodule update --init --depth 1
```

## Projekty

| Katalog | Co to jest |
| --- | --- |
| `ube-shop` | Purpura - sklep internetowy z ube (Next.js 16 + Tailwind v4 + Motion). Build z zastosowaniem skillsów powyżej; uzasadnienie decyzji, policzony kontrast i lista pre-flight są w `ube-shop/README.md`. |

```bash
cd ube-shop && npm install && npm run dev
```
