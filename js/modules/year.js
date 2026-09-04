/** Keeps the footer copyright year current without a yearly code edit. */
export function initYear() {
  const el = document.querySelector('[data-current-year]');
  if (el) el.textContent = String(new Date().getFullYear());
}
