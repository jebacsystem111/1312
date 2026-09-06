// Generator podstron sklepu ube ube - wspólny chrome + treść każdej strony.
// UWAGA: wszystkie wewnętrzne linki i zasoby muszą być BEZWZGLĘDNE (/...),
// bo podstrony przepisów żyją w podkatalogu przepisy/.
// Uruchomienie: node tools/gen-pages.js (z katalogu halaya/)
const fs = require("fs");
const path = require("path");
const OUT = __dirname + "/.."; // halaya/

const head = (title, desc) => `<!doctype html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="icon" type="image/png" href="/assets/favicon.png">
  <meta name="theme-color" content="#140A1D">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>html{background:#140A1D}body{background:#140A1D;color:#F5EDFB;margin:0}</style>
  <link rel="stylesheet" href="/styles.css?v=8">
</head>
<body>
  <a class="skip-link" href="#main">Przejdź do treści</a>

  <div class="announce" role="region" aria-label="Informacja o dostawie">
    <p>Darmowa dostawa od 149 zł - świeża partia ube przylatuje z Luzon co dwa tygodnie</p>
    <a href="/dostawa.html">Jak to działa</a>
  </div>

  <header class="site-header" id="siteHeader">
    <div class="wrap header-inner">
      <a class="logo" href="/index.html" aria-label="ube ube - strona główna">
        <img class="logo-img" src="/assets/logo-dark.png" alt="ube ube" width="92" height="96">
      </a>

      <nav class="main-nav" aria-label="Główna nawigacja">
        ${nav("/sklep.html", "Sklep", active)}
        ${nav("/przepisy.html", "Przepisy", active)}
        ${nav("/o-nas.html", "O nas", active)}
        ${nav("/dostawa.html", "Dostawa", active)}
        ${nav("/kontakt.html", "Kontakt", active)}
      </nav>

      <div class="header-actions">
        <button class="cart-btn" id="cartOpen" aria-haspopup="dialog" aria-controls="cartDrawer">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 8V6a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          <span class="cart-label">Koszyk</span>
          <span class="cart-count" id="cartCount" aria-live="polite">0</span>
          <span class="cart-total" id="cartTotal">0,00 zł</span>
        </button>
        <button class="menu-btn" id="menuOpen" aria-label="Otwórz menu" aria-haspopup="dialog" aria-controls="mobileMenu">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16M4 16h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>
  </header>
`;

let active = "";
const nav = (href, label, act) => act === href
  ? `        <a href="${href}" aria-current="page">${label}</a>`
  : `        <a href="${href}">${label}</a>`;

const breadcrumb = (parts) => {
  const crumbs = [['<a href="/index.html">Strona główna</a>']]
    .concat(parts.map(([href, label]) => href ? `<a href="${href}">${label}</a>` : `<span class="current">${label}</span>`));
  return `<nav class="breadcrumb" aria-label="Okruszki">${crumbs.join('<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>')}</nav>`;
};

const footer = `  <footer class="site-footer">
    <div class="wrap footer-grid">
      <div class="footer-brand">
        <a class="logo" href="/index.html">
          <img class="logo-img" src="/assets/logo-dark.png" alt="ube ube" width="92" height="96">
        </a>
        <p>Fioletowe złoto z Filipin. Proszek z ube, świeże bulwy i przepisy - zbierane ręcznie na Luzon, pakowane w chłodzie, u Ciebie w 24 godziny.</p>
      </div>
      <nav class="footer-col" aria-label="Sklep">
        <h3>Sklep</h3>
        <a href="/sklep.html">Proszek z ube</a>
        <a href="/sklep.html">Wszystkie produkty</a>
        <a href="/przepisy.html">Przepisy</a>
      </nav>
      <nav class="footer-col" aria-label="Pomoc">
        <h3>Pomoc</h3>
        <a href="/dostawa.html">Dostawa i śledzenie</a>
        <a href="/dostawa.html#faq">FAQ</a>
        <a href="/dostawa.html#zwroty">Zwroty</a>
        <a href="/kontakt.html">Kontakt</a>
      </nav>
      <div class="footer-col">
        <h3>Kontakt</h3>
        <a href="mailto:czesc@ubeube.pl">czesc@ubeube.pl</a>
        <a href="tel:+48221234567">+48 22 123 45 67</a>
        <p>ul. Fioletowa 13, Warszawa<br>pn-pt 9:00-17:00</p>
      </div>
    </div>
    <div class="wrap footer-bottom">
      <p>© 2026 ube ube · Fioletowe złoto z Filipin</p>
      <p class="footer-pay">BLIK · Visa · Mastercard · Przelew24</p>
      <svg class="barcode" viewBox="0 0 90 22" aria-hidden="true"><path d="M2 2v18M7 2v18M11 2v18M16 2v18M23 2v18M27 2v18M33 2v18M36 2v18M42 2v18M48 2v18M55 2v18M61 2v18M66 2v18M73 2v18M77 2v18M83 2v18M88 2v18" stroke="currentColor" stroke-width="1.6"/></svg>
    </div>
  </footer>
`;

const chromeEnd = `
  <!-- ============ KOSZYK (DRAWER) ============ -->
  <div class="overlay" id="cartOverlay" hidden></div>
  <aside class="drawer" id="cartDrawer" role="dialog" aria-modal="true" aria-labelledby="cartTitle" hidden>
    <div class="drawer-head">
      <h2 id="cartTitle">Twój koszyk <span id="cartCountDrawer">(0)</span></h2>
      <button class="icon-btn" id="cartClose" aria-label="Zamknij koszyk">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      </button>
    </div>

    <div class="shipping-note" id="shippingNote" aria-live="polite"></div>

    <div class="drawer-body" id="cartItems"></div>

    <div class="drawer-foot" id="cartFoot">
      <div class="cart-row">
        <span>Wartość koszyka</span>
        <strong id="cartSubtotal">0,00 zł</strong>
      </div>
      <p class="cart-hint">Dostawę i płatność wybierzesz w kasie. Zwrot do 14 dni.</p>
      <button class="btn btn-primary btn-block" id="checkoutBtn">Do kasy
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
  </aside>

  <!-- ============ KASA (MODAL) ============ -->
  <div class="overlay" id="checkoutOverlay" hidden></div>
  <div class="modal" id="checkoutModal" role="dialog" aria-modal="true" aria-labelledby="checkoutTitle" hidden>
    <div class="modal-head">
      <h2 id="checkoutTitle">Kasa</h2>
      <button class="icon-btn" id="checkoutClose" aria-label="Zamknij kasę">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      </button>
    </div>

    <form id="checkoutForm" novalidate>
      <div class="checkout-step" id="checkoutStepForm">
        <fieldset>
          <legend>Dane do wysyłki</legend>
          <div class="field-row">
            <div class="field">
              <label for="coEmail">E-mail</label>
              <input type="email" id="coEmail" name="email" autocomplete="email" required>
              <p class="field-error" data-error-for="coEmail"></p>
            </div>
            <div class="field">
              <label for="coName">Imię i nazwisko</label>
              <input type="text" id="coName" name="name" autocomplete="name" required>
              <p class="field-error" data-error-for="coName"></p>
            </div>
          </div>
          <div class="field">
            <label for="coAddress">Ulica i numer</label>
            <input type="text" id="coAddress" name="address" autocomplete="street-address" required>
            <p class="field-error" data-error-for="coAddress"></p>
          </div>
          <div class="field-row">
            <div class="field">
              <label for="coCity">Miasto</label>
              <input type="text" id="coCity" name="city" autocomplete="address-level2" required>
              <p class="field-error" data-error-for="coCity"></p>
            </div>
            <div class="field">
              <label for="coZip">Kod pocztowy</label>
              <input type="text" id="coZip" name="zip" placeholder="00-000" autocomplete="postal-code" inputmode="numeric" required>
              <p class="field-error" data-error-for="coZip"></p>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Dostawa</legend>
          <label class="radio-row">
            <input type="radio" name="shipping" value="kurier" data-cost="14.90" checked>
            <span class="radio-label"><strong>Kurier chłodniczy</strong><span>jutro, 14,90 zł</span></span>
          </label>
          <label class="radio-row">
            <input type="radio" name="shipping" value="paczkomat" data-cost="11.90">
            <span class="radio-label"><strong>Paczkomat 24/7</strong><span>1-2 dni, 11,90 zł</span></span>
          </label>
          <label class="radio-row">
            <input type="radio" name="shipping" value="odbior" data-cost="0">
            <span class="radio-label"><strong>Odbiór osobisty</strong><span>Warszawa, ul. Fioletowa 13, 0 zł</span></span>
          </label>
        </fieldset>

        <fieldset>
          <legend>Płatność</legend>
          <label class="radio-row">
            <input type="radio" name="payment" value="blik" checked>
            <span class="radio-label"><strong>BLIK</strong><span>kod z aplikacji banku</span></span>
          </label>
          <label class="radio-row">
            <input type="radio" name="payment" value="karta">
            <span class="radio-label"><strong>Karta</strong><span>Visa, Mastercard</span></span>
          </label>
          <label class="radio-row">
            <input type="radio" name="payment" value="przelew">
            <span class="radio-label"><strong>Przelew24</strong><span>szybki przelew online</span></span>
          </label>
        </fieldset>

        <div class="cart-row cart-row-total">
          <span>Razem</span>
          <strong id="checkoutTotal">0,00 zł</strong>
        </div>
        <button class="btn btn-primary btn-block" type="submit" id="payBtn">Zapłać <span id="payBtnAmount">0,00 zł</span></button>
        <p class="form-note">To sklep demonstracyjny - zamówienie nie zostanie zrealizowane.</p>
      </div>

      <div class="checkout-step" id="checkoutStepPay" hidden aria-busy="true">
        <div class="paying">
          <svg class="spinner" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="60 200"/></svg>
          <p>Łączymy z bankiem…</p>
        </div>
      </div>

      <div class="checkout-step" id="checkoutStepDone" hidden>
        <div class="done">
          <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" stroke-width="2"/><path d="M14 25l7 7 13-14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <h3>Dziękujemy! Ube jedzie do Ciebie.</h3>
          <p>Zamówienie <strong id="orderNumber">HAL-0000</strong> przyjęte. Potwierdzenie i numer przesyłki wyślemy na Twój e-mail.</p>
          <button class="btn btn-primary" type="button" id="doneClose">Wróć do sklepu</button>
        </div>
      </div>
    </form>
  </div>

  <!-- ============ MENU MOBILNE ============ -->
  <div class="overlay" id="menuOverlay" hidden></div>
  <div class="mobile-menu" id="mobileMenu" role="dialog" aria-modal="true" aria-label="Menu" hidden>
    <button class="icon-btn" id="menuClose" aria-label="Zamknij menu">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
    </button>
    <nav aria-label="Menu mobilne">
      <a href="/sklep.html">Sklep</a>
      <a href="/przepisy.html">Przepisy</a>
      <a href="/o-nas.html">O nas</a>
      <a href="/dostawa.html">Dostawa</a>
      <a href="/kontakt.html">Kontakt</a>
    </nav>
  </div>

  <!-- ============ TOAST ============ -->
  <div class="toast" id="toast" role="status" aria-live="polite" hidden></div>

  <noscript>
    <p class="noscript">Sklep działa w pełni z włączonym JavaScript. Włącz go, żeby dodać produkty do koszyka.</p>
  </noscript>

  <script src="/app.js?v=8"></script>
</body>
</html>
`;

/* ============ treści stron ============ */

// --- SKLEP ---
active = "/sklep.html";
let shop = `
  <main id="main">
    <section class="page-hero">
      <div class="wrap">
        ${breadcrumb([["/sklep.html", null]])}
        <h1 class="display reveal">Sklep</h1>
        <p class="lead reveal">Wszystkie partie pakowane w chłodzie i wysyłane w 24 godziny. Darmowa dostawa od 149 zł.</p>
      </div>
    </section>

    <section class="shop section">
      <div class="wrap">
        <div class="filters" role="group" aria-label="Filtruj produkty">
          <button class="chip is-active" data-filter="all">Wszystkie</button>
          <button class="chip" data-filter="swieze">Świeże</button>
          <button class="chip" data-filter="slodkie">Słodkie</button>
          <button class="chip" data-filter="wypieki">Do wypieków</button>
          <button class="chip" data-filter="napoje">Napoje</button>
          <button class="chip" data-filter="zestawy">Zestawy</button>
        </div>
        <div class="product-grid" id="productGrid" aria-live="polite"></div>

        <ul class="perks">
          <li>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 7h11v10H2zM13 10h4l3 3v4h-7z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="6.5" cy="17" r="1.6" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="16.5" cy="17" r="1.6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>
            <div><strong>Wysyłka w 24h</strong><span>zamówienia do 12:00 pakujemy tego samego dnia</span></div>
          </li>
          <li>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20M4 7l8-3 8 3-8 3-8-3z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <div><strong>Paczki w chłodzie</strong><span>przewiewny papier i suchy lód - fiolet nie blaknie</span></div>
          </li>
          <li>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21c0-6 5-9 14-10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M5 21c2-5 6-8 11-9" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
            <div><strong>Świeże partie co 2 tygodnie</strong><span>prosto z plantacji doliny Pampanga</span></div>
          </li>
        </ul>
      </div>
    </section>
  </main>`;
fs.writeFileSync(path.join(OUT, "sklep.html"), head("Sklep - ube ube | Proszek z ube i więcej", "Katalog sklepu ube ube: proszek z ube 100 g i kolejne produkty z fioletowego pochrzynu. Wysyłka w 24h, darmowa dostawa od 149 zł.") + shop + footer + chromeEnd);

// --- PRZEPISY ---
active = "/przepisy.html";
const recipeCard = (href, img, alt, name, desc, meta) => `
        <article class="recipe-card">
          <a href="${href}">
            <img src="${img}" alt="${alt}" loading="lazy">
            <div class="recipe-card-body">
              <h3>${name}</h3>
              <p>${desc}</p>
              <div class="recipe-meta">${meta}</div>
              <span class="more">Zobacz przepis
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
            </div>
          </a>
        </article>`;
const metaIcons = {
  czas: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 8v4l2.5 2.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  porcje: '<svg viewBox="0 0 24 24"><path d="M3 12h18a9 9 0 0 1-18 0z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 12h18" stroke="currentColor" stroke-width="1.4"/></svg>',
  poziom: '<svg viewBox="0 0 24 24"><path d="M6 16h2M11 12h2M16 8h2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
};
const m = (k, v) => `<span>${metaIcons[k]} ${v}</span>`;

let recipes = `
  <main id="main">
    <section class="page-hero">
      <div class="wrap">
        ${breadcrumb([["/przepisy.html", null]])}
        <h1 class="display reveal">Przepisy</h1>
        <p class="lead reveal">Jedna łyżeczka proszku z ube potrafi więcej, niż się wydaje. Lemoniada, latte, halaya, mochi - wszystko w kolorze, którego nie da się podrobić.</p>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="recipe-grid">
${recipeCard("/przepisy/lemoniada-ube.html", "/assets/r-lemoniada.jpg", "Fioletowa lemoniada z ube w wysokiej szklance", "Lemoniada z ube", "Kwaskowata, orzeźwiająca i całkiem fioletowa. Pięć minut roboty, efekt jak z kawiarni w Manili.", m("czas", "5 min") + m("porcje", "1 szklanka") + m("poziom", "Łatwy"))}
${recipeCard("/przepisy/latte-ube.html", "/assets/r-latte.jpg", "Latte z ube z warstwami fioletu i mleka", "Latte z ube", "Na ciepło albo na zimno z lodem. Wanilia, kokos i fioletowe smugi, które robią zdjęcia same.", m("czas", "5 min") + m("porcje", "1 porcja") + m("poziom", "Łatwy"))}
${recipeCard("/przepisy/halaya.html", "/assets/r-halaya.jpg", "Miska kremowej halayi z proszku ube", "Halaya z proszku", "Klasyczny filipiński krem, tym razem bez gotowania świeżej bulwy. Smaruj, nakładaj, jedz prosto ze słoika.", m("czas", "40 min") + m("porcje", "500 g") + m("poziom", "Średni"))}
${recipeCard("/przepisy/mochi-ube.html", "/assets/r-mochi.jpg", "Fioletowe mochi z ube oprószone skrobią", "Mochi z ube", "Kleiste, sprężyste i fioletowe w środku. Nadzienie z halayi albo kremu mascarpone.", m("czas", "30 min") + m("porcje", "10 szt.") + m("poziom", "Średni"))}
        </div>

        <div class="tip" style="margin-top: clamp(28px, 4vw, 48px)">
          <strong>Masz własny przepis z ube?</strong>
          Wyślij go na czesc@ubeube.pl - najlepsze publikujemy na stronie z podpisem autora i małą paczką proszku w podzięce.
        </div>
      </div>
    </section>
  </main>`;
fs.writeFileSync(path.join(OUT, "przepisy.html"), head("Przepisy z ube - ube ube | Lemoniada, latte, halaya, mochi", "Sprawdzone przepisy z proszkiem z ube: fioletowa lemoniada, latte z ube, halaya i mochi. Krok po kroku, ze składnikami i poradami.") + recipes + footer + chromeEnd);

// --- O NAS ---
active = "/o-nas.html";
let onas = `
  <main id="main">
    <section class="page-hero">
      <div class="wrap">
        ${breadcrumb([["/o-nas.html", null]])}
        <h1 class="display reveal">O nas</h1>
        <p class="lead reveal">Wszystko zaczęło się od jednego stołu z ube na bazarze w Manili. Dziś ten sam fiolet dowozimy do kuchni w całej Polsce.</p>
      </div>
    </section>

    <section class="story section">
      <div class="wrap story-grid">
        <figure class="story-photo">
          <img src="/assets/story.jpg" alt="Dłonie zbieracza trzymające świeżo wykopane bulwy ube nad wiklinową skrzynką" width="1024" height="1024" loading="lazy">
          <figcaption>Plantacje w dolinie rzeki Pampanga, Luzon</figcaption>
        </figure>
        <div class="story-copy">
          <h2 class="display-sm">Fiolet, który nas <em>połączył</em></h2>
          <p>Ube to na Filipinach więcej niż składnik - to kolor niedzielnych deserów, ulicznych straganów i domów, w których zawsze pachnie wanilią. Fioletowy pochrzyn (Dioscorea alata) rośnie tam od ponad dwóch tysięcy lat.</p>
          <p>Kupujemy wyłącznie od rodzinnych plantatorów z doliny Pampanga. Płacimy uczciwie, zbieramy ręcznie i pakujemy w chłodzie tak, żeby antocyjany - naturalny barwnik ube - dotarły do Ciebie w pełnej krasie.</p>
          <ul class="fact-ticket">
            <li><strong>2000 lat</strong><span>uprawy na Filipinach - ube jest starsze niż Manila</span></li>
            <li><strong>Antocyjany</strong><span>naturalny fiolet, bez barwników i aromatów</span></li>
            <li><strong>Bezpośrednio od plantatorów</strong><span>uczciwe ceny skupu, zero pośredników</span></li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section" id="wartosci">
      <div class="wrap">
        <div class="section-head">
          <h2 class="display-sm">Nasze zasady</h2>
        </div>
        <div class="values-grid">
          <div class="value">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21c-4-3-8-6-8-11a8 8 0 0 1 16 0c0 5-4 8-8 11z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
            <h3>Uczciwe ceny skupu</h3>
            <p>Plantatorzy dostają więcej, niż dyktuje rynek w Manili. Bez tego fiolet szybko by zniknął z pól.</p>
          </div>
          <div class="value">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7l8-4 8 4v10l-8 4-8-4V7z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M4 7l8 4 8-4M12 11v10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
            <h3>Transport w chłodzie</h3>
            <p>Każda partia leci z Manili w kontrolowanej temperaturze i jest pakowana tego samego dnia, w którym dotrze.</p>
          </div>
          <div class="value">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z"/></svg>
            <h3>Zero barwników</h3>
            <p>Kolor pochodzi wyłącznie z antocyjanów bulwy. Żadnych aromatów, żadnych dodatków - sam fiolet.</p>
          </div>
        </div>
      </div>
    </section>
  </main>`;
fs.writeFileSync(path.join(OUT, "o-nas.html"), head("O nas - ube ube | Fiolet, który nas połączył", "Historia sklepu ube ube: ube z rodzinnych plantacji doliny Pampanga, uczciwe ceny skupu, transport w chłodzie i zero barwników.") + onas + footer + chromeEnd);

// --- DOSTAWA ---
active = "/dostawa.html";
let dostawa = `
  <main id="main">
    <section class="page-hero">
      <div class="wrap">
        ${breadcrumb([["/dostawa.html", null]])}
        <h1 class="display reveal">Dostawa</h1>
        <p class="lead reveal">Zamów do 12:00, a jutro fiolet będzie u Ciebie. Każda paczka jedzie w chłodzie.</p>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <ol class="process-list">
          <li>
            <span class="process-num" aria-hidden="true">1</span>
            <h3>Zamawiasz do 12:00</h3>
            <p>Pakujemy tego samego dnia: proszki w szczelnych puszkach, bulwy w przewiewnym papierze.</p>
          </li>
          <li>
            <span class="process-num" aria-hidden="true">2</span>
            <h3>Ube rusza w drogę</h3>
            <p>Kurier chłodniczy dowozi w 24 godziny. Numer przesyłki dostajesz SMS-em i mailem.</p>
          </li>
          <li>
            <span class="process-num" aria-hidden="true">3</span>
            <h3>Fiolet w Twojej kuchni</h3>
            <p>W każdym pudełku czeka kartka z przepisem na pierwszą lemoniadę - krok po kroku.</p>
          </li>
        </ol>

        <div class="table-wrap">
          <table class="ship-table">
            <thead>
              <tr><th>Opcja</th><th>Czas</th><th>Koszt</th></tr>
            </thead>
            <tbody>
              <tr><td>Kurier chłodniczy</td><td>następny dzień roboczy</td><td class="num">14,90 zł</td></tr>
              <tr><td>Paczkomat 24/7</td><td>1-2 dni robocze</td><td class="num">11,90 zł</td></tr>
              <tr><td>Odbiór osobisty (Warszawa, ul. Fioletowa 13)</td><td>pn-pt 9:00-17:00</td><td class="num">0 zł</td></tr>
            </tbody>
          </table>
        </div>
        <p style="margin-top:20px">Zamówienia od <strong>149 zł</strong> wysyłamy za darmo kurierem chłodniczym.</p>
      </div>
    </section>

    <section class="faq section" id="faq">
      <div class="wrap faq-wrap">
        <div class="faq-head">
          <h2 class="display-sm">FAQ</h2>
          <p>Nie znalazłeś odpowiedzi? Napisz na <a href="mailto:czesc@ubeube.pl">czesc@ubeube.pl</a> - odpowiadamy w godzinę.</p>
        </div>
        <div class="faq-list">
          <details>
            <summary>Czym właściwie jest ube?<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></summary>
            <p>To pochrzyn fioletowy (Dioscorea alata) - bulwa z rodziny pochrzynowatych, uprawiana na Filipinach od ponad 2000 lat. Na zewnątrz szarobrązowa i niepozorna, w środku intensywnie fioletowa. Z niej robi się proszek, halayę, lody i ciasta.</p>
          </details>
          <details>
            <summary>Jak smakuje proszek z ube?<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></summary>
            <p>Delikatnie, waniliowo-orzechowo, z nutą kokosa. Jest mniej słodki niż batat, dlatego świetnie łączy się z cytrusami, mlekiem kokosowym i wanilią. Fiolet nie smakuje - ale robi wrażenie.</p>
          </details>
          <details>
            <summary>Jak przechowywać proszek?<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></summary>
            <p>W szczelnie zamkniętej puszce, w suchym i ciemnym miejscu - zachowuje kolor i aromat przez 12 miesięcy. Nie trzymaj go nad kuchenką: para zbryla proszek.</p>
          </details>
          <details>
            <summary>Kiedy wysyłacie zamówienia?<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></summary>
            <p>Zamówienia złożone do 12:00 pakujemy tego samego dnia i doręczamy w 24 godziny kurierem chłodniczym lub do paczkomatu. Świeże bulwy wysyłamy z partii, która właśnie przyleciała - jeśli najbliższy zbiór jest w drodze, poinformujemy Cię o terminie w mailu.</p>
          </details>
          <details>
            <summary>Mogę użyć proszku zamiast świeżego ube?<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></summary>
            <p>Tak. 1 łyżka proszku rozrobiona z 2-3 łyżkami wody zastępuje około 100 g ugotowanego ube. Proporcje do każdego przepisu znajdziesz w zakładce Przepisy.</p>
          </details>
        </div>
      </div>
    </section>

    <section class="section" id="zwroty">
      <div class="wrap">
        <div class="section-head">
          <h2 class="display-sm">Zwroty</h2>
        </div>
        <p style="margin-bottom:16px">Nieotwarty proszek możesz zwrócić w ciągu 14 dni od doręczenia - odeślemy pieniądze na konto w 3 dni robocze.</p>
        <p>Jeśli paczka dotarła uszkodzona albo proszek zbrylił się w transporcie, napisz do nas ze zdjęciem - wyślemy nową puszkę bez dyskusji i bez zwrotu.</p>
      </div>
    </section>
  </main>`;
fs.writeFileSync(path.join(OUT, "dostawa.html"), head("Dostawa i FAQ - ube ube | Wysyłka w 24h", "Dostawa sklepu ube ube: kurier chłodniczy 14,90 zł, paczkomat 11,90 zł, odbiór osobisty 0 zł. Darmowa dostawa od 149 zł. FAQ i zwroty.") + dostawa + footer + chromeEnd);

// --- KONTAKT ---
active = "/kontakt.html";
let kontakt = `
  <main id="main">
    <section class="page-hero">
      <div class="wrap">
        ${breadcrumb([["/kontakt.html", null]])}
        <h1 class="display reveal">Kontakt</h1>
        <p class="lead reveal">Pytanie o partię, przepis albo współpracę? Odpowiadamy w godzinę w dni robocze.</p>
      </div>
    </section>

    <section class="section">
      <div class="wrap contact-grid">
        <div class="contact-info">
          <div class="contact-line">
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3.5 7l8.5 6 8.5-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
            <div><a href="mailto:czesc@ubeube.pl">czesc@ubeube.pl</a><p>odpowiadamy w godzinę</p></div>
          </div>
          <div class="contact-line">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h4l2 5-2.5 1.5a13 13 0 0 0 5 5L16 12l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 4 5a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
            <div><a href="tel:+48221234567">+48 22 123 45 67</a><p>pn-pt 9:00-17:00</p></div>
          </div>
          <div class="contact-line">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21c-4-3-8-6-8-11a8 8 0 0 1 16 0c0 5-4 8-8 11z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>
            <div><p>ul. Fioletowa 13, Warszawa<br>odbiór osobisty pn-pt 9:00-17:00</p></div>
          </div>
        </div>

        <div class="contact-form-box">
          <form id="contactForm" novalidate>
            <div class="field">
              <label for="cName">Imię i nazwisko</label>
              <input type="text" id="cName" name="name" autocomplete="name" required>
            </div>
            <div class="field">
              <label for="cEmail">E-mail</label>
              <input type="email" id="cEmail" name="email" autocomplete="email" required>
            </div>
            <div class="field">
              <label for="cMsg">Wiadomość</label>
              <textarea id="cMsg" name="message" rows="5" placeholder="O co chcesz zapytać?" required></textarea>
            </div>
            <button class="btn btn-primary" type="submit">Wyślij wiadomość</button>
            <p class="form-note" id="contactNote" aria-live="polite"></p>
          </form>
        </div>
      </div>
    </section>
  </main>`;
fs.writeFileSync(path.join(OUT, "kontakt.html"), head("Kontakt - ube ube | Napisz do nas", "Kontakt ze sklepem ube ube: e-mail, telefon i odbiór osobisty w Warszawie. Formularz kontaktowy - odpowiadamy w godzinę.") + kontakt + footer + chromeEnd);

/* ============ przepisy (podstrony) ============ */
const recipePage = (file, title, desc, crumb, body) => {
  active = "/przepisy.html";
  fs.writeFileSync(path.join(OUT, "przepisy", file),
    head(`${title} - ube ube | Przepis krok po kroku`, desc) +
    `  <main id="main">
    <section class="page-hero">
      <div class="wrap">
        ${breadcrumb([["/przepisy.html", "Przepisy"], [null, crumb]])}
        <h1 class="display reveal">${title}</h1>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        ${body}
        <a class="text-link back-link" href="/przepisy.html">Wszystkie przepisy
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
      </div>
    </section>
  </main>` + footer + chromeEnd);
};

const chips = (...list) => `<div class="meta-chips">${list.map((c) => `<span class="meta-chip">${c}</span>`).join("")}</div>`;
const ingredients = (title, items) => `
        <div class="ingredients">
          <h2>${title}</h2>
          <ul>${items.map(([q, n]) => `<li><span>${n}</span><span class="qty">${q}</span></li>`).join("")}</ul>
        </div>`;
const steps = (...items) => `<div class="steps-col"><h2>Przygotowanie</h2>${items.map((s) => `<div class="step"><p>${s}</p></div>`).join("")}</div>`;

recipePage("lemoniada-ube.html", "Lemoniada z ube",
  "Fioletowa lemoniada z proszkiem z ube: sok z cytryny, miód, woda gazowana i lód. Kwaskowata, orzeźwiająca, gotowa w 5 minut.",
  "Lemoniada z ube", `
        <div class="recipe-layout">
          <div>
            <figure class="recipe-photo">
              <img src="/assets/r-lemoniada.jpg" alt="Fioletowa lemoniada z ube z lodem i cytryną" loading="lazy">
            </figure>
${ingredients("Składniki", [
  ["1 łyżeczka", "proszku z ube"],
  ["30 ml", "gorącej wody"],
  ["sok z 1/2 cytryny", "świeżo wyciśnięty"],
  ["1-2 łyżeczki", "miodu lub syropu klonowego"],
  ["200-250 ml", "zimnej wody gazowanej"],
  ["garść", "kostek lodu"],
  ["kilka", "listków mięty i plasterek cytryny"],
])}
${chips("5 minut", "1 szklanka", "Łatwy", "Wegański")}
          </div>
          ${steps(
            "Proszek z ube rozpuść w 30 ml gorącej wody i dokładnie wymieszaj, aż nie będzie grudek. To baza - cały kolor i smak zaczyna się tutaj.",
            "Do ciepłej bazy dodaj miód i sok z cytryny. Mieszaj, aż miód całkiem się rozpuści.",
            "Szklankę wypełnij lodem i wlej fioletową bazę.",
            "Dolej zimnej wody gazowanej i delikatnie zamieszaj łyżką - nie wstrząsaj, gaz ma zostać.",
            "Udekoruj plasterkiem cytryny i miętą. Podawaj od razu.",
          )}
        </div>
        <div class="tip"><strong>Wskazówka</strong>Kwas z cytryny lekko rozjaśnia fiolet, dlatego bazę robimy osobno, a wodę dolewamy na końcu. Chcesz intensywniejszy kolor? Dodaj pół łyżeczki proszku więcej - smak zmieni się minimalnie.</div>`);

recipePage("latte-ube.html", "Latte z ube",
  "Latte z proszkiem z ube: fioletowa pasta, mleko i opcjonalnie espresso. Na ciepło lub na zimno z lodem, w 5 minut.",
  "Latte z ube", `
        <div class="recipe-layout">
          <div>
            <figure class="recipe-photo">
              <img src="/assets/r-latte.jpg" alt="Latte z ube z warstwami fioletu i mleka" loading="lazy">
            </figure>
${ingredients("Składniki", [
  ["2 łyżeczki", "proszku z ube"],
  ["1 łyżeczka", "cukru lub miodu"],
  ["40 ml", "gorącej wody"],
  ["200 ml", "mleka (krowie, owsiane lub kokosowe)"],
  ["1 porcja", "espresso lub mocnej kawy (opcjonalnie)"],
  ["garść", "kostek lodu (wersja na zimno)"],
])}
${chips("5 minut", "1 porcja", "Łatwy", "Na ciepło lub z lodem")}
          </div>
          ${steps(
            "W kubku rozrób proszek z ube i cukier z gorącą wodą na gładką, gęstą pastę.",
            "Wersja na ciepło: podgrzej mleko, spień je lekko trzepaczką i wlej na pastę.",
            "Wersja na zimno: szklankę wypełnij lodem, wlej zimne mleko, a na końcu dodaj pastę - powstaną fioletowe smugi.",
            "Jeśli robisz kawową wersję, espresso wlej na wierzch i nie mieszaj do końca.",
            "Zamieszaj tuż przed piciem i podawaj.",
          )}
        </div>
        <div class="tip"><strong>Wskazówka</strong>Mleko kokosowe daje smak najbliższy filipińskiemu oryginałowi. Na zdjęciach najlepiej wygląda wersja z lodem - warstwy utrzymują się kilka minut, zdążysz zrobić zdjęcie.</div>`);

recipePage("halaya.html", "Halaya z proszku",
  "Domowa halaya z proszku z ube: krem z mleka kokosowego, mleka skondensowanego i masła. Bez gotowania świeżej bulwy.",
  "Halaya z proszku", `
        <div class="recipe-layout">
          <div>
            <figure class="recipe-photo">
              <img src="/assets/r-halaya.jpg" alt="Miska kremowej halayi z proszku ube z wiórkami kokosa" loading="lazy">
            </figure>
${ingredients("Składniki", [
  ["100 g", "proszku z ube"],
  ["250 ml", "mleka kokosowego"],
  ["200 ml", "słodzonego mleka skondensowanego"],
  ["60 g", "masła"],
  ["szczypta", "soli"],
])}
${chips("40 minut", "ok. 500 g", "Średni")}
          </div>
          ${steps(
            "Proszek z ube wymieszaj z mlekiem kokosowym do gładkiej, gęstej masy bez grudek.",
            "W rondlu o grubym dnie rozpuść masło i dodaj masę ube.",
            "Wlej mleko skondensowane i szczyptę soli - sól podbija słodycz i kolor.",
            "Gotuj na małym ogniu 25-35 minut, cały czas mieszając. Halaya jest gotowa, gdy masa zaczyna odchodzić od ścianek rondla.",
            "Przełóż do słoika lub miski i ostudź. W lodówce zgęstnieje jeszcze bardziej.",
          )}
        </div>
        <div class="tip"><strong>Wskazówka</strong>Podawaj na grzance z masłem, na lody albo prosto ze słoika. Chcesz klasyczną wersję? Zamiast proszku użyj 500 g ugotowanego i rozgniecionego świeżego ube - reszta kroków bez zmian.</div>`);

recipePage("mochi-ube.html", "Mochi z ube",
  "Mochi z proszkiem z ube: kleiste ciasto z mąki ryżowej, fioletowe w środku, nadziewane halayą lub kremem mascarpone.",
  "Mochi z ube", `
        <div class="recipe-layout">
          <div>
            <figure class="recipe-photo">
              <img src="/assets/r-mochi.jpg" alt="Fioletowe mochi z ube oprószone skrobią, jedno przecięte" loading="lazy">
            </figure>
${ingredients("Składniki", [
  ["100 g", "mąki kleistej (glutinous rice flour)"],
  ["30 g", "proszku z ube"],
  ["40 g", "cukru"],
  ["180 ml", "mleka kokosowego"],
  ["szczypta", "soli"],
  ["2-3 łyżki", "skrobi ziemniaczanej (do obtoczenia)"],
  ["10 łyżeczek", "halayi lub kremu mascarpone z proszkiem ube"],
])}
${chips("30 minut", "10 sztuk", "Średni")}
          </div>
          ${steps(
            "W misce wymieszaj mąkę kleistą, proszek z ube, cukier i sól.",
            "Wlej mleko kokosowe i wymieszaj na gładkie, fioletowe ciasto.",
            "Miskę przykryj folią i paruj 15 minut nad garnkiem z wrzątkiem - albo podgrzewaj w mikrofali 2 razy po 1 minucie, mieszając w połowie.",
            "Ciasto odstaw, aż lekko przestygnie. Ręce natłuść odrobiną oleju - ciasto jest bardzo kleiste.",
            "Blat oprósz skrobią. Podziel ciasto na 10 porcji, każdą rozciągnij na placuszek i owiń wokół łyżeczki nadzienia.",
            "Zlep brzegi, obtocz w skrobi i podawaj od razu - mochi najlepsze jest tego samego dnia.",
          )}
        </div>
        <div class="tip"><strong>Wskazówka</strong>Nie pomijaj skrobi - bez niej mochi przyklei się do talerza i do rąk. Nadzienie z mascarpone z łyżeczką proszku z ube to najszybsza wersja, halaya jest bardziej klasyczna.</div>`);

console.log("Wygenerowano strony:");
console.log(fs.readdirSync(OUT).filter((f) => f.endsWith(".html")).join(", "));
console.log("przepisy/:", fs.readdirSync(path.join(OUT, "przepisy")).join(", "));
