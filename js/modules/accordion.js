/**
 * FAQ accordion.
 * One panel open at a time, animated by measuring the panel's natural height
 * so the transition works without hardcoding pixel values.
 */

export function initAccordion() {
  const root = document.querySelector('[data-accordion]');
  if (!root) return;

  const items = [...root.querySelectorAll('.accordion__item')];
  if (!items.length) return;

  const close = (item) => {
    const trigger = item.querySelector('.accordion__trigger');
    const panel = item.querySelector('.accordion__panel');
    item.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    panel.style.height = '0px';
  };

  const open = (item) => {
    const trigger = item.querySelector('.accordion__trigger');
    const panel = item.querySelector('.accordion__panel');
    const inner = panel.firstElementChild;
    item.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    panel.style.height = `${inner.scrollHeight}px`;
  };

  items.forEach((item) => {
    const trigger = item.querySelector('.accordion__trigger');
    const panel = item.querySelector('.accordion__panel');
    if (!trigger || !panel) return;

    panel.style.height = '0px';

    trigger.addEventListener('click', () => {
      const wasOpen = item.classList.contains('is-open');
      items.forEach(close);
      if (!wasOpen) open(item);
    });
  });

  // An open panel must keep fitting its content when the layout reflows.
  window.addEventListener('resize', () => {
    const current = root.querySelector('.accordion__item.is-open');
    if (current) open(current);
  });
}
