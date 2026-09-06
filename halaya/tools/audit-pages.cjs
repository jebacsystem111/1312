// Dokładny audyt wielostronicowy: każdy link/zasób na każdej stronie + funkcjonalność.
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

const BASE = "/home/user/1312/halaya";
const PAGES = [
  "index.html", "sklep.html", "przepisy.html", "partnerzy.html", "o-nas.html", "dostawa.html", "kontakt.html",
  "przepisy/lemoniada-ube.html", "przepisy/latte-ube.html", "przepisy/halaya.html", "przepisy/mochi-ube.html",
];
const results = [];
const ok = (n, c) => results.push(`${c ? "PASS" : "FAIL"} - ${n}`);

const fileExists = (p) => fs.existsSync(path.join(BASE, p));

function auditPage(page) {
  const html = fs.readFileSync(path.join(BASE, page), "utf8");
  const dom = new JSDOM(html, { url: "http://localhost:8080/" + page, runScripts: "outside-only", pretendToBeVisual: true });
  const doc = dom.window.document;
  const issues = [];

  const check = (url, kind, elDesc) => {
    if (url == null) return;
    if (/^(data:|https?:|mailto:|tel:|javascript:)/.test(url)) return;
    let [pathname, anchor] = url.split("#");
    if (pathname.startsWith("?")) return;
    if (!pathname) {
      // czysta kotwica na tej samej stronie
      if (anchor && !doc.getElementById(anchor)) issues.push(`${page}: ${elDesc} -> brak kotwicy #${anchor}`);
      return;
    }
    if (!pathname.startsWith("/")) {
      issues.push(`${page}: ${elDesc} -> ścieżka względna "${url}" (musi być bezwzględna /...)`);
      return;
    }
    const clean = pathname.split("?")[0];
    if (!fileExists(clean)) issues.push(`${page}: ${elDesc} -> plik nie istnieje: ${clean}`);
    else if (anchor) {
      const target = fs.readFileSync(path.join(BASE, clean), "utf8");
      if (!target.includes(`id="${anchor}"`)) issues.push(`${page}: ${elDesc} -> brak kotwicy #${anchor} w ${clean}`);
    }
  };

  doc.querySelectorAll('a[href]').forEach((a) => check(a.getAttribute("href"), "link", `a "${a.textContent.trim().slice(0, 40)}"`));
  doc.querySelectorAll('img[src]').forEach((img) => check(img.getAttribute("src"), "obraz", `img[alt="${img.alt}"]`));
  doc.querySelectorAll('link[rel="stylesheet"]').forEach((l) => check(l.getAttribute("href"), "css", `stylesheet`));
  doc.querySelectorAll('link[rel="icon"]').forEach((l) => check(l.getAttribute("href"), "favicon", `favicon`));
  doc.querySelectorAll('script[src]').forEach((s) => check(s.getAttribute("src"), "js", `script`));
  return issues;
}

(async () => {
  // 1. AUDYT LINKÓW - każda strona
  let total = 0;
  for (const page of PAGES) {
    const issues = auditPage(page);
    total += issues.length;
    ok(`${page}: wszystkie linki i zasoby OK (${issues.length ? issues.length + " problemów" : "0 problemów"})`, issues.length === 0);
    issues.forEach((i) => results.push(`     ${i}`));
  }

  // 2. KAŻDA STRONA: JS ładuje się i działa
  const js = fs.readFileSync(path.join(BASE, "app.js"), "utf8");
  for (const page of PAGES) {
    const html = fs.readFileSync(path.join(BASE, page), "utf8");
    const dom = new JSDOM(html, { url: "http://localhost:8080/" + page, runScripts: "outside-only", pretendToBeVisual: true });
    const { window } = dom;
    window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} });
    window.Element.prototype.scrollIntoView = function () {};
    window.HTMLElement.prototype.focus = function () {};
    const vc = new VirtualConsole();
    let errors = [];
    vc.on("jsdomError", (e) => errors.push(String(e)));
    window.eval(js);
    ok(`${page}: JS bez błędów`, errors.length === 0);
    ok(`${page}: koszyk + kasa obecne`, !!window.document.querySelector("#cartDrawer") && !!window.document.querySelector("#checkoutModal"));
  }

  // 3. FUNKCJONALNOŚĆ - sklep
  {
    const dom = new JSDOM(fs.readFileSync(path.join(BASE, "sklep.html"), "utf8"), { url: "http://localhost:8080/sklep.html", runScripts: "outside-only", pretendToBeVisual: true });
    const { window } = dom;
    window.matchMedia = () => ({ matches: false });
    window.HTMLElement.prototype.focus = function () {};
    window.eval(fs.readFileSync(path.join(BASE, "app.js"), "utf8"));
    const doc = window.document;
    const click = (el) => el.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    ok("sklep: 3 karty, proszek 59,90", doc.querySelectorAll(".card").length === 3 && [...doc.querySelectorAll(".card .price")].some((el) => el.textContent.includes("59,90")));
    ok("sklep: nav podświetla Sklep", doc.querySelector(".main-nav a[aria-current='page']")?.getAttribute("href") === "/sklep.html");
    click(doc.querySelector("[data-add]"));
    click(doc.querySelector("#cartOpen"));
    await new Promise((r) => setTimeout(r, 40));
    ok("sklep: dodanie do koszyka i drawer", doc.querySelector("#cartCount").textContent === "1" && doc.querySelectorAll(".cart-item").length === 1);
  }

  // 4. FUNKCJONALNOŚĆ - strona główna (spotlight)
  {
    const dom = new JSDOM(fs.readFileSync(path.join(BASE, "index.html"), "utf8"), { url: "http://localhost:8080/index.html", runScripts: "outside-only", pretendToBeVisual: true });
    const { window } = dom;
    window.matchMedia = () => ({ matches: false });
    window.HTMLElement.prototype.focus = function () {};
    window.eval(fs.readFileSync(path.join(BASE, "app.js"), "utf8"));
    const doc = window.document;
    const click = (el) => el.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    ok("index: spotlight renderuje kartę", doc.querySelectorAll("#spotlightProduct .card").length === 1);
    click(doc.querySelector("#spotlightProduct [data-add]"));
    ok("index: dodanie z spotlightu", doc.querySelector("#cartCount").textContent === "1");
  }

  // 5. FUNKCJONALNOŚĆ - przepis (klik z hubu prowadzi na działającą stronę)
  {
    const hub = new JSDOM(fs.readFileSync(path.join(BASE, "przepisy.html"), "utf8"), { url: "http://localhost:8080/przepisy.html" });
    const links = [...hub.window.document.querySelectorAll(".recipe-card a")].map((a) => a.getAttribute("href"));
    ok("hub: 4 linki do przepisów", links.length === 4);
    ok("hub: wszystkie cele istnieją", links.every((l) => fileExists(l)));

    const dom = new JSDOM(fs.readFileSync(path.join(BASE, "przepisy/lemoniada-ube.html"), "utf8"), { url: "http://localhost:8080/przepisy/lemoniada-ube.html", runScripts: "outside-only", pretendToBeVisual: true });
    const { window } = dom;
    window.matchMedia = () => ({ matches: false });
    window.HTMLElement.prototype.focus = function () {};
    window.eval(fs.readFileSync(path.join(BASE, "app.js"), "utf8"));
    const doc = window.document;
    ok("przepis: 7 składników, 5 kroków, wskazówka", doc.querySelectorAll(".ingredients li").length === 7 && doc.querySelectorAll(".step").length === 5 && !!doc.querySelector(".tip"));
    ok("przepis: nav podświetla Przepisy", doc.querySelector(".main-nav a[aria-current='page']")?.getAttribute("href") === "/przepisy.html");
    ok("przepis: powrót na /przepisy.html", doc.querySelector(".back-link")?.getAttribute("href") === "/przepisy.html");
  }

  // 6. FUNKCJONALNOŚĆ - dostawa (kotwice z footera) i kontakt
  {
    const dom = new JSDOM(fs.readFileSync(path.join(BASE, "dostawa.html"), "utf8"), { url: "http://localhost:8080/dostawa.html", runScripts: "outside-only", pretendToBeVisual: true });
    const { window } = dom;
    window.matchMedia = () => ({ matches: false });
    window.HTMLElement.prototype.focus = function () {};
    window.eval(fs.readFileSync(path.join(BASE, "app.js"), "utf8"));
    const doc = window.document;
    ok("dostawa: tabela 3 wiersze, FAQ 5 pytań", doc.querySelectorAll(".ship-table tbody tr").length === 3 && doc.querySelectorAll(".faq-list details").length === 5);
    ok("dostawa: kotwice faq i zwroty istnieją", !!doc.getElementById("faq") && !!doc.getElementById("zwroty"));
  }
  {
    const dom = new JSDOM(fs.readFileSync(path.join(BASE, "kontakt.html"), "utf8"), { url: "http://localhost:8080/kontakt.html", runScripts: "outside-only", pretendToBeVisual: true });
    const { window } = dom;
    window.matchMedia = () => ({ matches: false });
    window.HTMLElement.prototype.focus = function () {};
    window.eval(fs.readFileSync(path.join(BASE, "app.js"), "utf8"));
    const doc = window.document;
    const form = doc.querySelector("#contactForm");
    form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
    ok("kontakt: błąd przy pustym", doc.querySelector("#contactNote").className.includes("error"));
    doc.querySelector("#cName").value = "Jan Kowalski";
    doc.querySelector("#cEmail").value = "jan@example.com";
    doc.querySelector("#cMsg").value = "Czy proszek nadaje się do smoothie?";
    form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
    ok("kontakt: sukces po wypełnieniu", doc.querySelector("#contactNote").textContent.includes("Dziękujemy"));
  }

  // 7. PRODUKTY „WKÓTCE” - widoczne, ale nie do kupienia
  {
    const dom = new JSDOM(fs.readFileSync(path.join(BASE, "sklep.html"), "utf8"), { url: "http://localhost:8080/sklep.html", runScripts: "outside-only", pretendToBeVisual: true });
    const { window } = dom;
    window.matchMedia = () => ({ matches: false });
    window.Element.prototype.scrollIntoView = function () {};
    window.HTMLElement.prototype.focus = function () {};
    try { Object.defineProperty(window, "location", { configurable: true, value: { href: "" } }); } catch { /* bez znaczenia */ }
    const vc = new VirtualConsole();
    let errs = [];
    vc.on("jsdomError", (e) => errs.push(String(e)));
    window.eval(fs.readFileSync(path.join(BASE, "app.js"), "utf8"));
    const doc = window.document;
    const click = (el) => el.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    ok("sklep: 3 produkty (proszek + dżem + syrop)", doc.querySelectorAll(".card").length === 3);
    ok("sklep: 1 dostępny (Dodaj) i 2 wkrótce (Powiadom mnie)", doc.querySelectorAll("[data-add]").length === 1 && doc.querySelectorAll("[data-soon]").length === 2);
    ok("sklep: plakietki Wkrótce", doc.querySelectorAll(".card-badge-soon").length === 2);
    const cardText = [...doc.querySelectorAll(".card")].map((c) => c.textContent);
    ok("sklep: cena dżemu 32,90", cardText.some((t) => t.includes("32,90")));
    ok("sklep: cena syropu 29,90", cardText.some((t) => t.includes("29,90")));
    ok("sklep: ceny z dopiskiem wkrótce", doc.querySelectorAll(".soon-tag").length === 2);
    click(doc.querySelector("[data-soon]"));
    ok("sklep: klik „Powiadom mnie” nie dodaje do koszyka", doc.querySelector("#cartCount").textContent === "0");
    const realErrs = errs.filter((e) => !e.includes("Not implemented: navigation"));
    ok("sklep: brak błędów JS", realErrs.length === 0);
  }

  // 8. MARKA ube ube + spotlight pokazuje dostępny produkt
  {
    for (const page of PAGES) {
      const html = fs.readFileSync(path.join(BASE, page), "utf8");
      const dom = new JSDOM(html, { url: "http://localhost:8080/" + page });
      ok(`${page}: logo + napis UBE UBE w nagłówku`, (() => {
        const i = dom.window.document.querySelector(".logo-img");
        const w = dom.window.document.querySelector(".logo-word");
        return i && i.getAttribute("src") === "/assets/logo-dark.png" &&
          w && w.textContent.trim() === "UBE UBE";
      })());
      ok(`${page}: marka ube ube w <title>`, dom.window.document.title.includes("ube ube"));
    }
    const dom = new JSDOM(fs.readFileSync(path.join(BASE, "index.html"), "utf8"), { url: "http://localhost:8080/index.html", runScripts: "outside-only", pretendToBeVisual: true });
    const { window } = dom;
    window.matchMedia = () => ({ matches: false });
    window.Element.prototype.scrollIntoView = function () {};
    window.HTMLElement.prototype.focus = function () {};
    window.eval(fs.readFileSync(path.join(BASE, "app.js"), "utf8"));
    const doc = window.document;
    const spot = doc.querySelector("#spotlightProduct");
    ok("index: spotlight pokazuje dostępny produkt (Dodaj)", !!spot.querySelector("[data-add]") && !spot.querySelector("[data-soon]"));
  }

  // 9. OKRUSZKI: nigdy "null", bieżąca strona zawsze podpisana
  {
    for (const page of PAGES) {
      const html = fs.readFileSync(path.join(BASE, page), "utf8");
      const dom = new JSDOM(html, { url: "http://localhost:8080/" + page });
      const bc = dom.window.document.querySelector(".breadcrumb");
      if (!bc) { ok(`${page}: brak breadcrumbu (strona główna - OK)`, page === "index.html"); continue; }
      const text = bc.textContent.replace(/\s+/g, " ").trim();
      ok(`${page}: breadcrumb bez "null"`, !text.includes("null"));
      const cur = bc.querySelector(".current");
      ok(`${page}: bieżąca strona podpisana`, !!cur && cur.textContent.trim().length > 0);
      ok(`${page}: breadcrumb zaczyna się od "Strona główna"`, text.startsWith("Strona główna"));
    }
  }

  // 10. PROGRAM PARTNERSKI: nawigacja, generator, panel, rabaty, prowizja
  {
    // 10a. każda strona ma link Partnerzy
    for (const page of PAGES) {
      const html = fs.readFileSync(path.join(BASE, page), "utf8");
      const dom = new JSDOM(html, { url: "http://localhost:8080/" + page });
      ok(`${page}: link Partnerzy w nawigacji`, !!dom.window.document.querySelector('.main-nav a[href="/partnerzy.html"]'));
    }

    // 10b. strona partnerzy: generator + panel z hasłem
    {
      const html = fs.readFileSync(path.join(BASE, "partnerzy.html"), "utf8");
      const dom = new JSDOM(html, { url: "http://localhost:8080/partnerzy.html", runScripts: "outside-only", pretendToBeVisual: true });
      const { window } = dom;
      window.matchMedia = () => ({ matches: false });
      window.HTMLElement.prototype.focus = function () {};
      const vc = new VirtualConsole();
      let errs = [];
      vc.on("jsdomError", (e) => errs.push(String(e)));
      window.eval(fs.readFileSync(path.join(BASE, "app.js"), "utf8"));
      const doc = window.document;
      const submit = (form) => form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
      const setVal = (id, v) => { const el = doc.getElementById(id); el.value = v; };

      setVal("partnerCode", "M@!");
      submit(doc.querySelector("#partnerGenForm"));
      ok("partnerzy: zły format kodu odrzucony", doc.querySelector("#partnerGenNote").textContent.includes("4-20"));
      setVal("partnerCode", "MARTA10"); setVal("partnerPass", "abc");
      submit(doc.querySelector("#partnerGenForm"));
      ok("partnerzy: za krótkie hasło odrzucone", doc.querySelector("#partnerGenNote").textContent.includes("minimum 4"));
      setVal("partnerPass", "tajne123");
      submit(doc.querySelector("#partnerGenForm"));
      ok("partnerzy: kod wygenerowany", !doc.querySelector("#partnerGenOk").hidden && doc.querySelector("#genCodeOut").textContent === "MARTA10");
      setVal("partnerCode", "MARTA10"); setVal("partnerPass", "inne123");
      submit(doc.querySelector("#partnerGenForm"));
      ok("partnerzy: duplikat odrzucony", doc.querySelector("#partnerGenNote").textContent.includes("zajęty"));

      setVal("panelCode", "MARTA10"); setVal("panelPass", "zlehaslo");
      submit(doc.querySelector("#partnerPanelForm"));
      ok("partnerzy: złe hasło odrzucone", doc.querySelector("#panelNote").textContent.includes("Zły kod albo hasło"));
      setVal("panelPass", "tajne123");
      submit(doc.querySelector("#partnerPanelForm"));
      ok("partnerzy: panel otwarty", !doc.querySelector("#panelStats").hidden && doc.querySelector("#panelUses").textContent === "0");
      ok("partnerzy: brak błędów JS", errs.length === 0);
    }

    // 10c. sklep: rabat -10% w koszyku i kasie + prowizja 2% po zapłacie
    {
      const html = fs.readFileSync(path.join(BASE, "sklep.html"), "utf8");
      const dom = new JSDOM(html, { url: "http://localhost:8080/sklep.html", runScripts: "outside-only", pretendToBeVisual: true });
      const { window } = dom;
      window.matchMedia = () => ({ matches: false });
      window.Element.prototype.scrollIntoView = function () {};
      window.HTMLElement.prototype.focus = function () {};
      // zasiew rejestru: MARTA10, hasło hash djb2("tajne123")
      const djb2 = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return String(h >>> 0); };
      window.localStorage.setItem("ubeube-affiliates-v1", JSON.stringify([{ code: "MARTA10", passHash: djb2("tajne123"), uses: 0, commission: 0 }]));
      const vc = new VirtualConsole();
      let errs = [];
      vc.on("jsdomError", (e) => errs.push(String(e)));
      window.eval(fs.readFileSync(path.join(BASE, "app.js"), "utf8"));
      const doc = window.document;
      const click = (el) => el.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
      const setVal = (id, v) => { const el = doc.getElementById(id); el.value = v; };

      click(doc.querySelector("[data-add]"));
      ok("sklep: produkt w koszyku (59,90)", doc.querySelector("#cartCount").textContent === "1");

      setVal("cartCodeInput", "NIEWLASCIWY");
      click(doc.querySelector("#cartCodeApply"));
      ok("koszyk: nieznany kod odrzucony", doc.querySelector("#cartCodeNote").textContent.includes("Nie znamy"));

      setVal("cartCodeInput", "marta10");
      click(doc.querySelector("#cartCodeApply"));
      ok("koszyk: kod przyjęty (normalizacja wielkości liter)", !doc.querySelector("#cartDiscountRow").hidden);
      ok("koszyk: rabat -5,99 zł", doc.querySelector("#cartDiscountVal").textContent.includes("5,99"));
      ok("koszyk: po rabacie 53,91 zł", doc.querySelector("#cartNetTotal").textContent.includes("53,91"));
      ok("koszyk: kod w nagłówku = po rabacie", doc.querySelector("#cartTotal").textContent.includes("53,91"));

      click(doc.querySelector("#cartOpen"));
      await new Promise((r) => setTimeout(r, 40));
      click(doc.querySelector("#checkoutBtn"));
      await new Promise((r) => setTimeout(r, 40));
      ok("kasa: kod widoczny w polu", doc.querySelector("#coCodeInput").value === "MARTA10");
      ok("kasa: total 68,81 (53,91 + kurier 14,90)", doc.querySelector("#checkoutTotal").textContent.includes("68,81"));

      setVal("coEmail", "test@example.com"); setVal("coName", "Jan Kowalski");
      setVal("coAddress", "Fioletowa 13/2"); setVal("coCity", "Warszawa"); setVal("coZip", "00-001");
      doc.querySelector("#checkoutForm").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
      await new Promise((r) => setTimeout(r, 1600));
      ok("kasa: zamówienie przyjęte", !doc.querySelector("#checkoutStepDone").hidden);
      const reg = JSON.parse(window.localStorage.getItem("ubeube-affiliates-v1"));
      ok("prowizja: 1 użycie kodu", reg[0].uses === 1);
      ok("prowizja: 2% z 53,91 = 1,08", Math.abs(reg[0].commission - 1.0782) < 0.001);
      ok("kod wyczyszczony po zakupie", !window.localStorage.getItem("ubeube-cartcode-v1"));
      const realErrs = errs.filter((e) => !e.includes("Not implemented: navigation"));
      ok("sklep: brak błędów JS", realErrs.length === 0);
    }

    // 10d. strona główna: promocja partnerska zamiast newslettera z -10%
    {
      const html = fs.readFileSync(path.join(BASE, "index.html"), "utf8");
      ok("index: brak starego newslettera z kodem UBEUBE10", !html.includes("UBEUBE10") && !html.includes("newsletterForm"));
      ok("index: promocja programu partnerskiego", html.includes("Zostań partnerem") && html.includes("/partnerzy.html"));
      ok("index: CTA do 5% dla twórców", html.includes("/partnerzy.html#tworcy"));
    }
  }

  const failed = results.filter((r) => r.startsWith("FAIL")).length;
  console.log(results.join("\n"));
  console.log(`\nPODSUMOWANIE: ${results.length} kontroli, ${failed} błędów`);
  process.exit(failed ? 1 : 0);
})();
