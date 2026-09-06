/**
 * Katalog Purpury.
 *
 * Uwaga: ceny, stany magazynowe i składy to dane demonstracyjne projektu
 * (mock) - przed wdrożeniem podpiąć je pod źródło prawdy (Shopify / własny
 * backend). Struktura typu jest natomiast docelowa.
 */

export type CategoryId =
  | "kremy"
  | "lody"
  | "wypieki"
  | "napoje"
  | "zestawy"
  | "skladniki";

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  category: CategoryId;
  /** cena w groszach */
  price: number;
  /** cena przed promocją, grosze */
  compareAt?: number;
  weight: string;
  image: string;
  gallery: string[];
  badge?: "bestseller" | "nowosc" | "limit";
  /** ile sztuk jest dziś w chłodni */
  stock: number;
  blurb: string;
  ingredients: string[];
  allergens: string[];
  storage: string;
  serving: { title: string; body: string }[];
};

export const categories: { id: CategoryId; label: string }[] = [
  { id: "kremy", label: "Kremy" },
  { id: "lody", label: "Lody" },
  { id: "wypieki", label: "Wypieki" },
  { id: "napoje", label: "Napoje" },
  { id: "zestawy", label: "Zestawy" },
  { id: "skladniki", label: "Składniki" },
];

export const categoryLabel = (id: CategoryId) =>
  categories.find((c) => c.id === id)?.label ?? id;

export const products: Product[] = [
  {
    slug: "halaya-250",
    name: "Halaya klasyczna",
    tagline: "Ube gotowane 6 godzin w mleku kokosowym",
    category: "kremy",
    price: 3900,
    weight: "250 g",
    image: "/img/jar-halaya.jpg",
    gallery: ["/img/jar-halaya.jpg", "/img/process-pot.jpg", "/img/box-flatlay.jpg"],
    badge: "bestseller",
    stock: 48,
    blurb:
      "Nasza baza: starty bulwa ube, mleko kokosowe, cukier trzcinowy i szczypta soli. Gotowane powoli w jednym dużym garnku, aż masa zrobi się gęsta i lekko ciągnąca. Bez barwników, bez skrobi tapioki na siłę.",
    ingredients: ["ube (62%)", "mleko kokosowe", "cukier trzcinowy", "masło", "sól morska"],
    allergens: ["mleko"],
    storage: "Lodówka, do 3 tygodni od otwarcia. Przed jedzeniem wyjmij na 15 minut.",
    serving: [
      { title: "Na toście", body: "Łyżka na ciepłym chlebie na parze, odrobina soli." },
      { title: "Do kawy", body: "2 łyżki pod mleko w latte, wymieszać przed nalaniem kawy." },
      { title: "Jak w Baguio", body: "Z lodami waniliowymi i startym mlekiem w proszku." },
    ],
  },
  {
    slug: "halaya-duzy-garnek",
    name: "Halaya z dużego garnka",
    tagline: "Edycja tygodnia, z pierwszej partii dnia",
    category: "kremy",
    price: 6900,
    weight: "500 g",
    image: "/img/process-pot.jpg",
    gallery: ["/img/process-pot.jpg", "/img/jar-halaya.jpg", "/img/process-roots.jpg"],
    badge: "limit",
    stock: 12,
    blurb:
      "Ta sama receptura, większy garnek i krótszy czas od ognia do słoika. Trafia do sprzedaży tylko we wtorki i piątki, zwykle rozchodzi się tego samego dnia.",
    ingredients: ["ube (64%)", "mleko kokosowe", "cukier trzcinowy", "masło", "sól morska"],
    allergens: ["mleko"],
    storage: "Lodówka do 4 tygodni. Mrozić do 3 miesięcy w oryginalnym słoiku.",
    serving: [
      { title: "Na zapas", body: "Podziel na 4 porcje i zamroź, rozmrażaj w lodówce." },
      { title: "Do wypieków", body: "Wmieszaj w ciasto drożdżowe lub nadzienie pandesal." },
    ],
  },
  {
    slug: "lody-ube-450",
    name: "Lody ube",
    tagline: "Gęste, na śmietance, z kawałkami halayi",
    category: "lody",
    price: 3400,
    weight: "450 ml",
    image: "/img/icecream-cup.jpg",
    gallery: ["/img/icecream-cup.jpg", "/img/hero-sandwich.jpg", "/img/halo-halo.jpg"],
    badge: "bestseller",
    stock: 34,
    blurb:
      "Kręcone rzadziej niż w fabryce, więc zostaje w nich tekstura. Kolor bierze się wyłącznie z ube, więc kolejne partie różnią się odcieniem.",
    ingredients: ["śmietanka", "mleko", "ube", "żółtka", "cukier", "sól"],
    allergens: ["mleko", "jaja"],
    storage: "Minus 18 stopni. Nie zamrażać powtórnie po rozmrożeniu.",
    serving: [
      { title: "Temperowanie", body: "10 minut na blacie - wtedy są kremowe, nie lodowate." },
      { title: "Posypka", body: "Pinipig albo prażony ryż, dla chrupania." },
    ],
  },
  {
    slug: "sandwich-x4",
    name: "Sandwich lodowy x4",
    tagline: "Crinkle cookie, lody ube, mrożone do Twoich drzwi",
    category: "lody",
    price: 4200,
    weight: "4 szt.",
    image: "/img/hero-sandwich.jpg",
    gallery: ["/img/hero-sandwich.jpg", "/img/icecream-cup.jpg", "/img/box-flatlay.jpg"],
    badge: "nowosc",
    stock: 21,
    blurb:
      "Ciastko pieczemy dzień wcześniej, przekładamy gałką lodów i zamrażamy. Brzegi zostają miękkie, środek twardy przez cały transport.",
    ingredients: ["mąka pszenna", "masło", "ube", "cukier", "śmietanka", "jaja", "kakao"],
    allergens: ["gluten", "mleko", "jaja"],
    storage: "Minus 18 stopni, do 3 tygodni.",
    serving: [{ title: "Bez rozmrażania", body: "Jedz w 4 minuty po wyjęciu z zamrażarki." }],
  },
  {
    slug: "latte-koncentrat",
    name: "Koncentrat do latte",
    tagline: "330 ml, na osiem szklanek",
    category: "napoje",
    price: 2400,
    weight: "330 ml",
    image: "/img/latte.jpg",
    gallery: ["/img/latte.jpg", "/img/jar-halaya.jpg", "/img/box-flatlay.jpg"],
    stock: 60,
    blurb:
      "Rozcieńczany syrop ube z mlekiem skondensowanym. Butelka starcza na osiem latte, w lodówce trzyma dwa tygodnie.",
    ingredients: ["ube", "mleko skondensowane", "woda", "cukier trzcinowy"],
    allergens: ["mleko"],
    storage: "Lodówka, 2 tygodnie po otwarciu. Wstrząsnąć przed użyciem.",
    serving: [
      { title: "Na zimno", body: "40 ml koncentratu, 200 ml mleka, lód." },
      { title: "Na ciepło", body: "Podgrzać mleko do 65 stopni, wlać koncentrat, nie gotować." },
    ],
  },
  {
    slug: "ciasto-warstwowe",
    name: "Ciasto warstwowe ube",
    tagline: "Osiem biszkoptów, krem ube, na 12 osób",
    category: "wypieki",
    price: 14900,
    weight: "ok. 1,4 kg",
    image: "/img/cake-slice.jpg",
    gallery: ["/img/cake-slice.jpg", "/img/jar-halaya.jpg", "/img/box-flatlay.jpg"],
    badge: "limit",
    stock: 6,
    blurb:
      "Zamawiane z dwudniowym wyprzedzeniem, bo każdy blat pieczemy osobno i chłodzimy między warstwami. Do odbioru w kawiarni albo kurierem chłodniczym.",
    ingredients: ["mąka pszenna", "ube", "masło", "cukier", "jaja", "mleko", "śmietanka"],
    allergens: ["gluten", "mleko", "jaja"],
    storage: "Lodówka do 3 dni. Wyjąć 30 minut przed krojeniem.",
    serving: [
      { title: "Krojenie", body: "Nóż zanurzyć we wrzątku i wytrzeć między kawałkami." },
      { title: "Do kawy", body: "Bez dodatkowego cukru - krem jest już wystarczająco słodki." },
    ],
  },
  {
    slug: "halo-halo-zestaw",
    name: "Zestaw halo-halo",
    tagline: "Na dwie porcje, z lodami i pinipig",
    category: "zestawy",
    price: 5800,
    weight: "2 porcje",
    image: "/img/halo-halo.jpg",
    gallery: ["/img/halo-halo.jpg", "/img/icecream-cup.jpg", "/img/latte.jpg"],
    stock: 18,
    blurb:
      "Komplet do złożenia w domu: lody ube, słodzona fasola, żelki, mleko skondensowane, pinipig i syrop ube. Złożenie zajmuje 10 minut.",
    ingredients: ["lody ube", "fasola adzuki", "żelki kokosowe", "mleko skondensowane", "ryż pinipig", "ube"],
    allergens: ["mleko"],
    storage: "Lody w zamrażarce, reszta w lodówce do 5 dni.",
    serving: [
      { title: "Kolejność", body: "Najpierw stałe dodatki, potem lód, na wierzch gałka." },
      { title: "Mleko", body: "Polać po ściance, nie na lody. Mieszać dopiero przy stole." },
    ],
  },
  {
    slug: "bulwa-ube-1kg",
    name: "Bulwa ube, cała",
    tagline: "Do samodzielnego gotowania, z Pangasinan",
    category: "skladniki",
    price: 2900,
    weight: "1 kg",
    image: "/img/process-roots.jpg",
    gallery: ["/img/process-roots.jpg", "/img/process-pot.jpg", "/img/jar-halaya.jpg"],
    stock: 40,
    blurb:
      "Świeże bulwy, nie mrożonka w proszku. Obrać, gotować 40 minut, rozgnieść i smażyć z mlekiem kokosowym. Przepis z czasem gotowania jest w każdej paczce.",
    ingredients: ["ube 100%"],
    allergens: [],
    storage: "Chłodno i ciemno, do 3 tygodni. Nie w lodówce, jeśli masz spiżarnię.",
    serving: [
      { title: "Uwaga na dłonie", body: "Fiolet schodzi z rąk po dwóch dobach. Rękawiczki pomagają." },
      { title: "Ile z tego wyjdzie", body: "Z kilograma wychodzi około 700 g gotowej halayi." },
    ],
  },
  {
    slug: "box-purpura",
    name: "Box Purpura",
    tagline: "Cztery rzeczy do spróbowania, karta przepisów",
    category: "zestawy",
    price: 12900,
    compareAt: 14800,
    weight: "4 pozycje",
    image: "/img/box-flatlay.jpg",
    gallery: ["/img/box-flatlay.jpg", "/img/jar-halaya.jpg", "/img/icecream-cup.jpg"],
    badge: "bestseller",
    stock: 25,
    blurb:
      "Wejście w ube bez zgadywania: halaya 250 g, lody, cztery sandwich i koncentrat latte. Pudełko jest złożone z recyklingu, wypełnienie z papieru, lód w żelu do pakowania.",
    ingredients: ["ube", "śmietanka", "mleko", "mąka pszenna", "cukier trzcinowy", "jaja"],
    allergens: ["mleko", "gluten", "jaja"],
    storage: "Zamówić z dostawą chłodniczą. Na miejscu: lody do zamrażarki, resztę do lodówki.",
    serving: [
      { title: "Jako prezent", body: "Wybierz opcję bez ceny na paragonie, dodamy odręczną kartkę." },
    ],
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

export const featuredSlugs = ["box-purpura", "halaya-250", "lody-ube-450", "sandwich-x4", "latte-koncentrat"];

/** Darmowa dostawa od tej kwoty */
export const FREE_SHIPPING_FROM = 15000;
export const SHIPPING = {
  inpost: { label: "InPost lub paczkomat", price: 1500, eta: "1-2 dni robocze" },
  courier: { label: "Kurier chłodniczy", price: 1900, eta: "następny dzień, do 12:00" },
  pickup: { label: "Odbiór w kawiarni na Wilczej", price: 0, eta: "do 2 godzin od potwierdzenia" },
} as const;

export type ShippingId = keyof typeof SHIPPING;

/** Kody promocyjne - demonstracja walidacji i stanu błędu */
export const PROMOS: Record<string, { off: number; label: string }> = {
  UBE10: { off: 0.1, label: "-10% na całe zamówienie" },
  START: { off: 0.15, label: "-15% na pierwszy box" },
};
