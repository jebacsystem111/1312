/* Pizza Expert Bytów — lekki skrypt */
document.getElementById("year").textContent = new Date().getFullYear();

// "Dziś otwarte" — godziny zależne od bieżącego dnia (fail-safe: 11:00–22:00)
(function () {
  var el = document.getElementById("today-hours");
  if (!el) return;
  var H = { 0: "12:00–22:00", 1: "11:00–22:00", 2: "11:00–22:00", 3: "11:00–22:00", 4: "11:00–22:00", 5: "11:00–23:00", 6: "11:00–23:00" };
  try { el.textContent = H[new Date().getDay()]; } catch (e) {}
})();

const legend = document.querySelector(".size-legend");
if (legend) {
  const chips = legend.querySelectorAll(".size-chip");
  const prices = document.querySelectorAll("#menu-list .mi-price");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const size = chip.dataset.size;
      chips.forEach((c) => {
        const on = c === chip;
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-pressed", on ? "true" : "false");
      });
      prices.forEach((p) => p.classList.toggle("dim", p.dataset.size !== size));
    });
  });
}
