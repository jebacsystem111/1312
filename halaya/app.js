/* ============================================================
   HALAYA - logika sklepu
   Koszyk, kasa, filtry, toast, menu. Bez zależności.
   ============================================================ */
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const fmt = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" });
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FREE_SHIPPING = 149;
  const STORAGE_KEY = "halaya-cart-v1";
  const AFFILIATE_KEY = "ubeube-affiliates-v1";
  const CARTCODE_KEY = "ubeube-cartcode-v1";
  const DISCOUNT_PCT = 10;   // kupujący z kodem płaci 10% mniej
  const COMMISSION_PCT = 2;  // właściciel kodu zbiera 2% od wartości zamówienia

  document.documentElement.classList.add("js");

  /* ---------------- dane ---------------- */
  // Struktura pozycji: { id, name, unit, price, cat, badge, desc, img, featured, soon }
  // soon: true = produkt zapowiedziany, widoczny w katalogu, ale nie do kupienia
  const PRODUCTS = [
    {
      id: "proszek-ube", name: "Proszek z ube", unit: "100 g", price: 59.9,
      cat: "wypieki", badge: null,
      desc: "Liofilizowane ube zmielone na drobny pył. Do latte, ciast, mochi i do barwienia domowej halayi.",
      img: "assets/p-powder.jpg", featured: false, soon: false,
    },
    {
      id: "dzem-ube", name: "Dżem z ube", unit: "250 g", price: 32.9,
      cat: "slodkie", badge: null,
      desc: "Aksamitny dżem z fioletowego pochrzynu z odrobiną wanilii. Do grzanek, naleśników i serów. Premiera wkrótce - o dacie powiadomimy w newsletterze.",
      img: "assets/p-dzem.jpg", featured: false, soon: true,
    },
    {
      id: "syrop-ube", name: "Syrop z ube", unit: "125 ml", price: 29.9,
      cat: "slodkie", badge: null,
      desc: "Gęsty syrop o smaku ube i karmelu. Do pancake'ów, gofrów, lodów i kawy. Premiera wkrótce - o dacie powiadomimy w newsletterze.",
      img: "assets/p-syrop.jpg", featured: false, soon: true,
    },
  ];

  /* ---------------- koszyk ---------------- */
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { cart = {}; }

  const saveCart = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch { /* tryb prywatny */ }
  };
  const cartCount = () => Object.values(cart).reduce((a, b) => a + b, 0);
  const cartSubtotal = () =>
    Object.entries(cart).reduce((sum, [id, qty]) => {
      const p = PRODUCTS.find((x) => x.id === id);
      return sum + (p ? p.price * qty : 0);
    }, 0);

  /* ---------------- program partnerski ---------------- */
  // Rejestr kodów twórców: [{ code, passHash, uses, commission }] - demo w localStorage.
  // Na Shopify: kody rabatowe Shopify + aplikacja afiliacyjna (rejestracja, hasła, wypłaty).
  let affiliates = [];
  try { affiliates = JSON.parse(localStorage.getItem(AFFILIATE_KEY)) || []; } catch { affiliates = []; }
  const saveAffiliates = () => {
    try { localStorage.setItem(AFFILIATE_KEY, JSON.stringify(affiliates)); } catch { /* tryb prywatny */ }
  };
  const normCode = (s) => String(s || "").toUpperCase().replace(/\s+/g, "");
  const codeValidFormat = (c) => /^[A-Z0-9]{4,20}$/.test(c);
  const hashPass = (s) => {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return String(h >>> 0);
  };
  const findAffiliate = (c) => affiliates.find((a) => a.code === c);

  // Kod rabatowy aktywny w koszyku (10% dla kupującego)
  let appliedCode = "";
  try { appliedCode = localStorage.getItem(CARTCODE_KEY) || ""; } catch { appliedCode = ""; }
  const setAppliedCode = (c) => {
    appliedCode = c;
    try { c ? localStorage.setItem(CARTCODE_KEY, c) : localStorage.removeItem(CARTCODE_KEY); } catch { /* tryb prywatny */ }
  };
  const discountedSubtotal = () => {
    const s = cartSubtotal();
    return appliedCode ? s * (1 - DISCOUNT_PCT / 100) : s;
  };
  const discountAmount = () => {
    const s = cartSubtotal();
    return appliedCode ? s * (DISCOUNT_PCT / 100) : 0;
  };

  // Zwraca komunikat błędu albo null przy sukcesie
  function applyCodeToCart(raw) {
    const code = normCode(raw);
    if (!code) return "Podaj kod.";
    if (!findAffiliate(code)) return "Nie znamy tego kodu. Sprawdź literówkę albo zapytaj twórcę.";
    if (cartCount() === 0) return "Dodaj najpierw produkty do koszyka.";
    setAppliedCode(code);
    renderCart();
    updateCheckoutTotal();
    return null;
  }

  /* ---------------- siatka produktów ---------------- */
  const grid = $("#productGrid");
  let activeFilter = "all";

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function cardHTML(p) {
    const badge = p.badge || (p.soon ? "Wkrótce" : "");
    const badgeCls = p.soon && !p.badge ? " card-badge-soon" : "";
    const foot = p.soon
      ? `<span class="price">${fmt.format(p.price)} <em class="soon-tag">wkrótce</em></span>
            <button class="add-btn add-btn-soon" type="button" data-soon="${p.id}" aria-label="${esc(p.name)} - wkrótce w sprzedaży">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9a6 6 0 0 1 12 0v4l2 3H4l2-3V9z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 19a2 2 0 0 0 4 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
              Powiadom mnie
            </button>`
      : `<span class="price">${fmt.format(p.price)}</span>
            <button class="add-btn" type="button" data-add="${p.id}">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
              Dodaj
            </button>`;
    return `
      <article class="card${p.featured ? " card-featured" : ""}${p.soon ? " card-soon" : ""}" data-id="${p.id}">
        <div class="card-media">
          <img src="${p.img}" alt="${esc(p.name)} - ${esc(p.unit)}" loading="lazy">
          ${badge ? `<span class="card-badge${badgeCls}">${esc(badge)}</span>` : ""}
        </div>
        <div class="card-body">
          <div>
            <h3 class="card-name">${esc(p.name)}</h3>
            <span class="card-unit">${esc(p.unit)}</span>
          </div>
          <p class="card-desc">${esc(p.desc)}</p>
          <div class="card-foot">${foot}</div>
        </div>
      </article>`;
  }

  function renderGrid(filter = activeFilter) {
    if (!grid) return;
    const filtersEl = $(".filters");
    if (filtersEl) filtersEl.hidden = PRODUCTS.length === 0;
    if (!PRODUCTS.length) {
      grid.innerHTML = `<p class="empty-filter">Katalog w przygotowaniu - prawdziwe produkty pojawią się tu wkrótce.</p>`;
      return;
    }
    const list = PRODUCTS.filter((p) => filter === "all" || p.cat === filter);
    if (!list.length) {
      grid.innerHTML = `<p class="empty-filter">W tej kategorii na razie pusto - nowa partia już w drodze z Manili.</p>`;
      return;
    }
    grid.innerHTML = list.map(cardHTML).join("");
  }

  /* wyróżniony produkt na stronie głównej */
  const spotlightEl = $("#spotlightProduct");
  function renderSpotlight() {
    if (!spotlightEl) return;
    const firstAvailable = PRODUCTS.find((p) => !p.soon) || PRODUCTS[0];
    if (firstAvailable) spotlightEl.innerHTML = cardHTML(firstAvailable);
  }

  $$(".chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      $$(".chip").forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      activeFilter = chip.dataset.filter;
      grid.classList.remove("grid-swap");
      void grid.offsetWidth;
      renderGrid();
      grid.classList.add("grid-swap");
    })
  );

  /* ---------------- dodawanie z animacją ---------------- */
  function flyToCart(imgEl) {
    if (reducedMotion || !imgEl) return;
    const from = imgEl.getBoundingClientRect();
    const btn = $("#cartOpen").getBoundingClientRect();
    const clone = document.createElement("img");
    clone.src = imgEl.currentSrc || imgEl.src;
    clone.className = "fly-img";
    clone.alt = "";
    clone.style.left = from.left + "px";
    clone.style.top = from.top + "px";
    clone.style.width = from.width + "px";
    clone.style.height = from.height + "px";
    document.body.appendChild(clone);
    void clone.offsetWidth;
    const target = 30;
    clone.style.left = btn.left + btn.width / 2 - target / 2 + "px";
    clone.style.top = btn.top + btn.height / 2 - target / 2 + "px";
    clone.style.width = target + "px";
    clone.style.height = target + "px";
    clone.style.opacity = "0.15";
    clone.addEventListener("transitionend", () => clone.remove(), { once: true });
    setTimeout(() => clone.remove(), 900);
  }

  function goKontakt() {
    window.location.href = "/kontakt.html";
  }

  function addToCart(id, qty = 1, imgEl = null) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    if (p.soon) {
      goKontakt();
      return;
    }
    cart[id] = (cart[id] || 0) + qty;
    saveCart();
    renderCart();
    flyToCart(imgEl);
    showToast(`Dodano: ${p.name}`, () => openDrawer());
    const badge = $("#cartCount");
    badge.classList.remove("pop");
    void badge.offsetWidth;
    badge.classList.add("pop");
  }

  document.addEventListener("click", (e) => {
    const soonBtn = e.target.closest("[data-soon]");
    if (soonBtn) {
      goKontakt();
      return;
    }
    const btn = e.target.closest("[data-add]");
    if (!btn) return;
    const card = btn.closest(".card");
    const img = card && $("img", card);
    addToCart(btn.dataset.add, 1, img);
  });

  /* ---------------- render koszyka ---------------- */
  const cartDrawer = $("#cartDrawer");
  const cartOverlay = $("#cartOverlay");
  const drawerItems = $("#cartItems");

  function renderCart() {
    const count = cartCount();
    const subtotal = cartSubtotal();
    const net = discountedSubtotal();
    $("#cartCount").textContent = count;
    $("#cartCountDrawer").textContent = `(${count})`;
    $("#cartTotal").textContent = fmt.format(net);
    $("#cartSubtotal").textContent = fmt.format(subtotal);

    const ids = Object.keys(cart);
    if (!ids.length) {
      drawerItems.innerHTML = `
        <div class="cart-empty">
          <svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="14" rx="6" ry="7.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 5c-1.2 3 1.2 3.8 0 7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          <p>Twój koszyk jest pusty. Fiolet czeka.</p>
          <button class="btn btn-primary" type="button" data-browse>Przeglądaj sklep</button>
        </div>`;
      $("#shippingNote").hidden = true;
      $("#cartFoot").hidden = true;
      return;
    }
    $("#cartFoot").hidden = false;

    /* wiersze rabatu */
    const dRow = $("#cartDiscountRow");
    const netRow = $("#cartNetRow");
    if (dRow) {
      if (appliedCode) {
        dRow.hidden = false;
        $("#discountCodeName").textContent = appliedCode;
        $("#cartDiscountVal").textContent = "-" + fmt.format(discountAmount());
        netRow.hidden = false;
        $("#cartNetTotal").textContent = fmt.format(net);
      } else {
        dRow.hidden = true;
        netRow.hidden = true;
      }
    }
    const codeInput = $("#cartCodeInput");
    if (codeInput && !appliedCode) codeInput.value = "";

    drawerItems.innerHTML = ids
      .map((id) => {
        const p = PRODUCTS.find((x) => x.id === id);
        const qty = cart[id];
        return `
        <div class="cart-item" data-id="${id}">
          <img src="${p.img}" alt="">
          <div class="cart-item-info">
            <span class="cart-item-name">${esc(p.name)}</span>
            <span class="cart-item-unit">${esc(p.unit)} · ${fmt.format(p.price)}</span>
            <div class="cart-item-controls">
              <button class="qty-btn" type="button" data-dec aria-label="Zmniejsz ilość">−</button>
              <span class="qty-val" aria-live="polite">${qty}</span>
              <button class="qty-btn" type="button" data-inc aria-label="Zwiększ ilość">+</button>
              <button class="remove-btn" type="button" data-remove>Usuń</button>
            </div>
          </div>
          <div class="cart-item-price">
            <strong>${fmt.format(p.price * qty)}</strong>
          </div>
        </div>`;
      })
      .join("");

    /* pasek darmowej dostawy (liczony od kwoty po rabacie) */
    const note = $("#shippingNote");
    note.hidden = false;
    if (net >= FREE_SHIPPING) {
      note.className = "shipping-note ok";
      note.innerHTML = `<strong>Masz darmową dostawę.</strong> Doręczymy jutro kurierem.`;
    } else {
      const missing = FREE_SHIPPING - net;
      const pct = Math.min(100, (net / FREE_SHIPPING) * 100);
      note.className = "shipping-note";
      note.innerHTML = `Brakuje Ci <strong>${fmt.format(missing)}</strong> do darmowej dostawy
        <span class="bar"><i style="width:${pct}%"></i></span>`;
    }
  }

  drawerItems.addEventListener("click", (e) => {
    const item = e.target.closest(".cart-item");
    const browse = e.target.closest("[data-browse]");
    if (browse) {
      closeDrawer();
      $("a[href='#sklep']").focus();
      document.getElementById("sklep").scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      return;
    }
    if (!item) return;
    const id = item.dataset.id;
    if (e.target.closest("[data-inc]")) addToCart(id, 1);
    else if (e.target.closest("[data-dec]")) {
      cart[id] -= 1;
      if (cart[id] <= 0) delete cart[id];
      saveCart();
      renderCart();
    } else if (e.target.closest("[data-remove]")) {
      delete cart[id];
      saveCart();
      renderCart();
    }
  });

  /* ---------------- otwieranie / zamykanie ---------------- */
  let lastFocus = null;
  const lockBody = (on) => (document.body.style.overflow = on ? "hidden" : "");

  function openDrawer() {
    cartDrawer.hidden = false;
    cartOverlay.hidden = false;
    requestAnimationFrame(() => {
      cartDrawer.classList.add("open");
      cartOverlay.classList.add("open");
    });
    lastFocus = $("#cartOpen");
    lockBody(true);
    $("#cartClose").focus();
  }
  function closeDrawer() {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("open");
    lockBody(false);
    setTimeout(() => {
      cartDrawer.hidden = true;
      cartOverlay.hidden = true;
    }, 480);
    if (lastFocus) lastFocus.focus();
  }

  $("#cartOpen").addEventListener("click", openDrawer);
  $("#cartClose").addEventListener("click", closeDrawer);
  cartOverlay.addEventListener("click", closeDrawer);

  /* ---------------- kasa ---------------- */
  const checkoutModal = $("#checkoutModal");
  const checkoutOverlay = $("#checkoutOverlay");
  const checkoutForm = $("#checkoutForm");
  const stepForm = $("#checkoutStepForm");
  const stepPay = $("#checkoutStepPay");
  const stepDone = $("#checkoutStepDone");

  function shippingCost() {
    if (discountedSubtotal() >= FREE_SHIPPING) return 0;
    const sel = $("input[name='shipping']:checked", checkoutForm);
    return sel ? Number(sel.dataset.cost) : 0;
  }
  function orderTotal() { return discountedSubtotal() + shippingCost(); }

  function updateCheckoutTotal() {
    const total = orderTotal();
    $("#checkoutTotal").textContent = fmt.format(total);
    $("#payBtnAmount").textContent = fmt.format(total);
    const dRow = $("#coDiscountRow");
    if (dRow) {
      if (appliedCode) {
        dRow.hidden = false;
        $("#coCodeName").textContent = appliedCode;
        $("#coDiscountVal").textContent = "-" + fmt.format(discountAmount());
      } else {
        dRow.hidden = true;
      }
    }
  }

  function openCheckout() {
    closeDrawer();
    renderCheckoutSteps("form");
    checkoutForm.reset();
    $$("[data-error-for]", checkoutForm).forEach((el) => (el.textContent = ""));
    $$("input[aria-invalid]", checkoutForm).forEach((el) => el.removeAttribute("aria-invalid"));
    const coInput = $("#coCodeInput");
    if (coInput) coInput.value = appliedCode || "";
    const coNote = $("#coCodeNote");
    if (coNote) { coNote.textContent = ""; coNote.className = "code-note"; }
    updateCheckoutTotal();
    checkoutModal.hidden = false;
    checkoutOverlay.hidden = false;
    requestAnimationFrame(() => {
      checkoutModal.classList.add("open");
      checkoutOverlay.classList.add("open");
    });
    lockBody(true);
    $("#checkoutClose").focus();
  }
  function closeCheckout() {
    checkoutModal.classList.remove("open");
    checkoutOverlay.classList.remove("open");
    lockBody(false);
    setTimeout(() => {
      checkoutModal.hidden = true;
      checkoutOverlay.hidden = true;
      renderCheckoutSteps("form");
    }, 400);
    if (lastFocus) lastFocus.focus();
  }
  function renderCheckoutSteps(step) {
    stepForm.hidden = step !== "form";
    stepPay.hidden = step !== "pay";
    stepDone.hidden = step !== "done";
  }

  $("#checkoutBtn").addEventListener("click", () => {
    if (cartCount() > 0) openCheckout();
  });
  $("#checkoutClose").addEventListener("click", closeCheckout);
  checkoutOverlay.addEventListener("click", closeCheckout);
  $("#doneClose").addEventListener("click", closeCheckout);
  checkoutForm.addEventListener("change", (e) => {
    if (e.target.name === "shipping") updateCheckoutTotal();
  });

  /* walidacja */
  const validators = {
    coEmail: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Podaj poprawny adres e-mail.",
    coName: (v) => v.trim().length >= 3 || "Podaj imię i nazwisko.",
    coAddress: (v) => v.trim().length >= 5 || "Podaj ulicę i numer.",
    coCity: (v) => v.trim().length >= 2 || "Podaj miasto.",
    coZip: (v) => /^\d{2}-\d{3}$/.test(v.trim()) || "Format: 00-000.",
  };

  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    Object.entries(validators).forEach(([id, fn]) => {
      const input = document.getElementById(id);
      const errEl = $(`[data-error-for="${id}"]`);
      const res = fn(input.value);
      if (res !== true) {
        ok = false;
        input.setAttribute("aria-invalid", "true");
        errEl.textContent = res;
      } else {
        input.removeAttribute("aria-invalid");
        errEl.textContent = "";
      }
    });
    if (!ok) {
      const firstBad = $("[aria-invalid='true']", checkoutForm);
      if (firstBad) firstBad.focus();
      return;
    }
    renderCheckoutSteps("pay");
    const orderNo = "UBE-" + (1000 + Math.floor(Math.random() * 9000));
    setTimeout(() => {
      /* naliczenie prowizji 2% dla właściciela kodu */
      if (appliedCode) {
        const owner = findAffiliate(appliedCode);
        if (owner) {
          owner.uses = (owner.uses || 0) + 1;
          owner.commission = (owner.commission || 0) + discountedSubtotal() * (COMMISSION_PCT / 100);
          saveAffiliates();
        }
        setAppliedCode("");
      }
      $("#orderNumber").textContent = orderNo;
      renderCheckoutSteps("done");
      cart = {};
      saveCart();
      renderCart();
    }, 1400);
  });

  /* ---------------- toast ---------------- */
  const toast = $("#toast");
  let toastTimer = null;
  function showToast(msg, action = null) {
    toast.innerHTML = `
      <span class="tick" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </span>
      <p>${esc(msg)}</p>`;
    if (action) {
      const btn = document.createElement("button");
      btn.className = "toast-action";
      btn.type = "button";
      btn.textContent = "Zobacz koszyk";
      btn.addEventListener("click", () => { action(); hideToast(); });
      toast.appendChild(btn);
    }
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 3400);
  }
  function hideToast() {
    toast.classList.remove("show");
    clearTimeout(toastTimer);
    setTimeout(() => (toast.hidden = true), 320);
  }

  /* ---------------- kod rabatowy: koszyk + kasa ---------------- */
  const applyFrom = (inputSel, noteSel) => {
    const input = $(inputSel);
    const note = $(noteSel);
    if (!input || !note) return;
    const err = applyCodeToCart(input.value);
    if (err) {
      note.textContent = err;
      note.className = "code-note error";
    } else {
      note.textContent = "";
      note.className = "code-note";
      input.value = "";
      showToast(`Kod -10% aktywny: ${appliedCode}`);
    }
  };
  const cartApplyBtn = $("#cartCodeApply");
  if (cartApplyBtn) {
    cartApplyBtn.addEventListener("click", () => applyFrom("#cartCodeInput", "#cartCodeNote"));
    $("#cartCodeInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); cartApplyBtn.click(); }
    });
  }
  const cartRemoveBtn = $("#cartCodeRemove");
  if (cartRemoveBtn) cartRemoveBtn.addEventListener("click", () => { setAppliedCode(""); renderCart(); });
  const coApplyBtn = $("#coCodeApply");
  if (coApplyBtn) {
    coApplyBtn.addEventListener("click", () => { applyFrom("#coCodeInput", "#coCodeNote"); updateCheckoutTotal(); });
    $("#coCodeInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); coApplyBtn.click(); }
    });
  }
  const coRemoveBtn = $("#coCodeRemove");
  if (coRemoveBtn) coRemoveBtn.addEventListener("click", () => { setAppliedCode(""); updateCheckoutTotal(); });

  /* ---------------- program partnerski (strona /partnerzy.html) ---------------- */
  function copyText(btn, text) {
    const done = () => {
      const label = btn.dataset.label || "Kopiuj";
      btn.textContent = "Skopiowano";
      setTimeout(() => (btn.textContent = label), 1600);
    };
    const fallback = () => {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch { /* demo */ }
      ta.remove();
      done();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(fallback);
    } else {
      fallback();
    }
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-copy]");
    if (!b) return;
    const el = document.getElementById(b.dataset.copy);
    if (el) copyText(b, el.textContent.trim());
  });

  const genForm = $("#partnerGenForm");
  if (genForm) genForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const code = normCode($("#partnerCode").value);
    const pass = $("#partnerPass").value;
    const note = $("#partnerGenNote");
    const okBox = $("#partnerGenOk");
    if (!codeValidFormat(code)) {
      note.textContent = "Kod: 4-20 znaków, tylko litery i cyfry.";
      note.className = "form-note error";
      okBox.hidden = true;
      return;
    }
    if (pass.length < 4) {
      note.textContent = "Hasło: minimum 4 znaki.";
      note.className = "form-note error";
      okBox.hidden = true;
      return;
    }
    if (findAffiliate(code)) {
      note.textContent = "Ten kod jest już zajęty. Wybierz inny.";
      note.className = "form-note error";
      okBox.hidden = true;
      return;
    }
    affiliates.push({ code, passHash: hashPass(pass), uses: 0, commission: 0 });
    saveAffiliates();
    note.className = "form-note";
    note.textContent = "";
    $("#genCodeOut").textContent = code;
    $("#genPassOut").textContent = pass;
    okBox.hidden = false;
    genForm.reset();
  });

  const panelForm = $("#partnerPanelForm");
  if (panelForm) panelForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const code = normCode($("#panelCode").value);
    const pass = $("#panelPass").value;
    const note = $("#panelNote");
    const stats = $("#panelStats");
    const owner = findAffiliate(code);
    if (!owner || hashPass(pass) !== owner.passHash) {
      note.textContent = "Zły kod albo hasło.";
      note.className = "form-note error";
      stats.hidden = true;
      return;
    }
    note.textContent = "";
    note.className = "form-note";
    $("#panelCodeOut").textContent = owner.code;
    $("#panelUses").textContent = owner.uses;
    $("#panelCommission").textContent = fmt.format(owner.commission);
    $("#panelShare").textContent = `Kup z kodem ${owner.code} i dostaniesz -10% na ubeube`;
    panelForm.hidden = true;
    stats.hidden = false;
  });
  const panelLogout = $("#panelLogout");
  if (panelLogout) panelLogout.addEventListener("click", () => {
    const stats = $("#panelStats");
    stats.hidden = true;
    const form = $("#partnerPanelForm");
    form.hidden = false;
    form.reset();
  });

  /* ---------------- formularz kontaktowy ---------------- */
  const contactForm = $("#contactForm");
  if (contactForm) contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#cName");
    const email = $("#cEmail");
    const msg = $("#cMsg");
    const note = $("#contactNote");
    let ok = true;
    if (name.value.trim().length < 3) { ok = false; name.setAttribute("aria-invalid", "true"); }
    else name.removeAttribute("aria-invalid");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) { ok = false; email.setAttribute("aria-invalid", "true"); }
    else email.removeAttribute("aria-invalid");
    if (msg.value.trim().length < 10) { ok = false; msg.setAttribute("aria-invalid", "true"); }
    else msg.removeAttribute("aria-invalid");
    if (!ok) {
      note.textContent = "Uzupełnij poprawnie wszystkie pola.";
      note.className = "form-note error";
      return;
    }
    note.className = "form-note";
    note.textContent = "Dziękujemy! Odpowiemy w ciągu godziny roboczej.";
    contactForm.reset();
  });

  /* ---------------- menu mobilne ---------------- */
  const mobileMenu = $("#mobileMenu");
  const menuOverlay = $("#menuOverlay");
  function openMenu() {
    mobileMenu.hidden = false;
    menuOverlay.hidden = false;
    requestAnimationFrame(() => {
      mobileMenu.classList.add("open");
      menuOverlay.classList.add("open");
    });
    lockBody(true);
    $("#menuClose").focus();
  }
  function closeMenu() {
    mobileMenu.classList.remove("open");
    menuOverlay.classList.remove("open");
    lockBody(false);
    setTimeout(() => {
      mobileMenu.hidden = true;
      menuOverlay.hidden = true;
    }, 420);
  }
  $("#menuOpen").addEventListener("click", openMenu);
  $("#menuClose").addEventListener("click", closeMenu);
  menuOverlay.addEventListener("click", closeMenu);
  $$("a", mobileMenu).forEach((a) => a.addEventListener("click", closeMenu));

  /* ---------------- klawiatura ---------------- */
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!stepDone.hidden) { closeCheckout(); return; }
    if (!checkoutModal.hidden) { closeCheckout(); return; }
    if (!cartDrawer.hidden) { closeDrawer(); return; }
    if (!mobileMenu.hidden) closeMenu();
  });

  /* ---------------- nagłówek ---------------- */
  const header = $("#siteHeader");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- start ---------------- */
  renderGrid();
  renderSpotlight();
  renderCart();
})();
