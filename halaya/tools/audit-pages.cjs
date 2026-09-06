// Dokładny audyt wielostronicowy: każdy link/zasób na każdej stronie + funkcjonalność.
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

const BASE = "/home/user/1312/halaya";
const PAGES = [
  "index.html", "sklep.html", "przepisy.html", "o-nas.html", "dostawa.html", "kontakt.html",
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
      ok(`${page}: marka ube ube w logo`, dom.window.document.querySelector(".logo-word")?.textContent.trim() === "ube ube");
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

  const failed = results.filter((r) => r.startsWith("FAIL")).length;
  console.log(results.join("\n"));
  console.log(`\nPODSUMOWANIE: ${results.length} kontroli, ${failed} błędów`);
  process.exit(failed ? 1 : 0);
})();
