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

  document.documentElement.classList.add("js");

  /* ---------------- dane ---------------- */
  // Struktura pozycji: { id, name, unit, price, cat, badge, desc, img, featured }
  const PRODUCTS = [
    {
      id: "proszek-ube", name: "Proszek z ube", unit: "100 g", price: 59.9,
      cat: "wypieki", badge: null,
      desc: "Liofilizowane ube zmielone na drobny pył. Do latte, ciast, mochi i do barwienia domowej halayi.",
      img: "assets/p-powder.jpg", featured: false,
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

  /* ---------------- siatka produktów ---------------- */
  const grid = $("#productGrid");
  let activeFilter = "all";

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function cardHTML(p) {
    return `
      <article class="card${p.featured ? " card-featured" : ""}" data-id="${p.id}">
        <div class="card-media">
          <img src="${p.img}" alt="${esc(p.name)} - ${esc(p.unit)}" loading="lazy">
          ${p.badge ? `<span class="card-badge">${esc(p.badge)}</span>` : ""}
        </div>
        <div class="card-body">
          <div>
            <h3 class="card-name">${esc(p.name)}</h3>
            <span class="card-unit">${esc(p.unit)}</span>
          </div>
          <p class="card-desc">${esc(p.desc)}</p>
          <div class="card-foot">
            <span class="price">${fmt.format(p.price)}</span>
            <button class="add-btn" type="button" data-add="${p.id}">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
              Dodaj
            </button>
          </div>
        </div>
      </article>`;
  }

  function renderGrid(filter = activeFilter) {
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

  function addToCart(id, qty = 1, imgEl = null) {
    cart[id] = (cart[id] || 0) + qty;
    saveCart();
    renderCart();
    flyToCart(imgEl);
    const p = PRODUCTS.find((x) => x.id === id);
    if (p) showToast(`Dodano: ${p.name}`, () => openDrawer());
    const badge = $("#cartCount");
    badge.classList.remove("pop");
    void badge.offsetWidth;
    badge.classList.add("pop");
  }

  grid.addEventListener("click", (e) => {
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
    $("#cartCount").textContent = count;
    $("#cartCountDrawer").textContent = `(${count})`;
    $("#cartTotal").textContent = fmt.format(subtotal);
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

    /* pasek darmowej dostawy */
    const note = $("#shippingNote");
    note.hidden = false;
    if (subtotal >= FREE_SHIPPING) {
      note.className = "shipping-note ok";
      note.innerHTML = `<strong>Masz darmową dostawę.</strong> Doręczymy jutro kurierem chłodniczym.`;
    } else {
      const missing = FREE_SHIPPING - subtotal;
      const pct = Math.min(100, (subtotal / FREE_SHIPPING) * 100);
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
    if (cartSubtotal() >= FREE_SHIPPING) return 0;
    const sel = $("input[name='shipping']:checked", checkoutForm);
    return sel ? Number(sel.dataset.cost) : 0;
  }
  function orderTotal() { return cartSubtotal() + shippingCost(); }

  function updateCheckoutTotal() {
    $("#checkoutTotal").textContent = fmt.format(orderTotal());
    $("#payBtnAmount").textContent = fmt.format(orderTotal());
  }

  function openCheckout() {
    closeDrawer();
    renderCheckoutSteps("form");
    checkoutForm.reset();
    $$("[data-error-for]", checkoutForm).forEach((el) => (el.textContent = ""));
    $$("input[aria-invalid]", checkoutForm).forEach((el) => el.removeAttribute("aria-invalid"));
    $("#checkoutTotal").textContent = fmt.format(orderTotal());
    $("#payBtnAmount").textContent = fmt.format(orderTotal());
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
    const orderNo = "HAL-" + (1000 + Math.floor(Math.random() * 9000));
    setTimeout(() => {
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

  /* ---------------- newsletter ---------------- */
  const newsForm = $("#newsletterForm");
  newsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("#newsletterEmail");
    const note = $("#newsletterNote");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
      note.textContent = "Podaj poprawny adres e-mail, żeby odebrać kod.";
      note.className = "form-note error";
      email.focus();
      return;
    }
    note.className = "form-note";
    note.textContent = "Gotowe! Kod HALAYA10 właśnie leci na Twoją skrzynkę.";
    email.value = "";
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
  renderCart();
})();
