/**
 * Treści sekcji w jednym miejscu, żeby copy dało się redagować
 * bez zaglądania komponentom.
 */

export const site = {
  name: "Purpura",
  kicker: "ube room",
  claim: "Ube gotowane powoli w Warszawie",
  subclaim: "Halaya, lody, pieczywo na parze i kawa. Wypiekamy we wtorki, wysyłamy w 48 godzin.",
  email: "zamowienia@purpura.pl",
  phone: "+48 512 384 190",
  address: "ul. Wilcza 24, Warszawa",
  hours: [
    { day: "Wtorek - czwartek", time: "11:00 - 19:00" },
    { day: "Piątek - sobota", time: "11:00 - 21:00" },
    { day: "Niedziela", time: "12:00 - 17:00" },
    { day: "Poniedziałek", time: "Zamknięte, myjemy garnki" },
  ],
  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "TikTok", href: "https://tiktok.com" },
    { label: "Newsletter", href: "#newsletter" },
  ],
} as const;

export const nav = [
  { label: "Sklep", href: "/sklep" },
  { label: "Subskrypcja", href: "/subskrypcja" },
  { label: "Jak powstaje", href: "/#proces" },
  { label: "Kawiarnia", href: "/#kawiarnia" },
] as const;

export const marquee = [
  "ube halaya",
  "lody na śmietance",
  "pandesal na parze",
  "koncentrat latte",
  "pinipig",
  "bulwy z Pangasinan",
  "wysyłka w 48 h",
] as const;

export const process = [
  {
    title: "Wybór bulw",
    body: "Kupujemy ube whole z tego samego gospodarstwa od trzech lat. Odrzucamy bulwy z twardymi włóknami w środku, to około jedna dziesiąta skrzynki.",
    image: "/img/process-roots.jpg",
    meta: "Poniedziałek, rano",
    stat: "62% ube w słoiku",
  },
  {
    title: "Gotowanie 6 godzin",
    body: "Starte bulwy, mleko kokosowe, cukier trzcinowy i masło. Mieszane co kilka minut, bo na dnie dużego garnka przypala się pierwsze. Taki czas daje gęstość, której nie da skrobia.",
    image: "/img/process-pot.jpg",
    meta: "Wtorek, od 6:00",
    stat: "1 garnek = 28 słoików",
  },
  {
    title: "Słoik i kurier",
    body: "Napełniamy na gorąco, zakręcamy, studzimy na ruszcie i etykietujemy ręcznie. Zamówienia do 12:00 jadą tego samego dnia, lody i sandwichy idą w suchym lodzie.",
    image: "/img/jar-halaya.jpg",
    meta: "Wtorek, po południu",
    stat: "48 h od ognia do drzwi",
  },
] as const;

export const plans = [
  {
    id: "degustacja",
    name: "Słoik",
    priceMonthly: 5900,
    priceQuarterly: 5200,
    summary: "Dla jednej osoby, która chce mieć halayę w lodówce na stałe.",
    includes: [
      "Halaya 250 g",
      "Nowy smak miesiąca przed premierą",
      "Karta przepisów, jedna na kwartał",
    ],
    highlight: false,
  },
  {
    id: "rodzina",
    name: "Duży garnek",
    priceMonthly: 11900,
    priceQuarterly: 10400,
    summary: "Dla dwóch osób albo dla tych, którzy jedzą ube łyżką ze słoika.",
    includes: [
      "Halaya 500 g z dużego garnka",
      "Lody 450 ml albo 4 sandwichy, na zmianę",
      "Koncentrat latte 330 ml",
      "Wysyłka chłodnicza w cenie",
    ],
    highlight: true,
  },
] as const;

export const reviews = [
  {
    quote:
      "Zamówiłam słoik, żeby sprawdzić, czy smakuje jak u mojej mamy. Smakuje. Chodziłam po kuchni i nic nie mówiłam.",
    name: "Katrina Villanueva",
    role: "Polska-Filipinka, Kraków",
  },
  {
    quote:
      "Lody przyszły w suchym lodzie, nieroztopione, w tekturze bez plastikowej wkładki. Wiedziałam, że zamówię znowu, zanim otworzyłam pudełko.",
    name: "Marta Osiecka",
    role: "prowadzi kafelkę Na Dół",
  },
  {
    quote:
      "Mam lokal z kawą i concentrat z Purpury rotuje u nas od pół roku. Goście pytają o ten fiolet, nikt nie pyta o syrop waniliowy.",
    name: "Piotr Zalewski",
    role: "współwłaściciel, Spacja Coffee",
  },
] as const;

export const faq = [
  {
    q: "Czym właściwie jest ube?",
    a: "Fioletowy jam (Dioscorea alata), bulwa o smaku przypominającym wanilię, kokos i prażony ryż. Na Filipinach suszy się go, gotuje i przerabia na halayę. Nie barwimy go niczym.",
  },
  {
    q: "Czy lody i sandwichy dojeżdżają zamrożone?",
    a: "Tak. Paczka chłodnicza z suchym lodem, kurier odbiera z naszej chłodni do 12:00. Zamówienia z odbiorem w kawiarni pakujemy w torbę izolowaną na 2 godziny.",
  },
  {
    q: "Jak długo trzyma się halaya?",
    a: "Trzy tygodnie w lodówce od otwarcia, trzy miesiące w zamrażarce w oryginalnym słoiku. Jeśli masa rozwarstwia się po rozmrożeniu, wystarczy ją wymieszać łyżką.",
  },
  {
    q: "Czy coś z tego jest wegańskie?",
    a: "Bulwa ube jest wegańska, halaya nie - jest w niej masło i mleko kokosowe. Pracujemy nad partią na oleju kokosowym, plan na tę zimę.",
  },
  {
    q: "Mogę zamówić na prezent?",
    a: "Tak. Box Purpura wysyłamy bez ceny na paragonie, dołączamy odręczną kartkę z treścią, którą wpiszesz w koszyku.",
  },
  {
    q: "Robicie catering i wypiek na zamówienie?",
    a: "Ciasta warstwowe na 12 osób zamawiamy z dwudniowym wyprzedzeniem. Powyżej 40 porcji pisz na zamowienia@purpura.pl, wyceniamy w dwa dni.",
  },
] as const;

export const values = [
  {
    title: "Jeden garnek dziennie",
    body: "Nie mamy linii produkcyjnej. Partia kończy się, gdy skończy się garnek, dlatego części dnia nie ma w koszyku.",
  },
  {
    title: "Skład bez zapchajdziur",
    body: "Cukier trzcinowy, mleko kokosowe, masło, sól. Bez barwników, bez zagęstników, bez aromatu.",
  },
  {
    title: "Pudełko wraca do obiegu",
    body: "Tektura z recyklingu, wypełnienie z papieru, lód w żelu do zamrożenia ponownie.",
  },
] as const;
