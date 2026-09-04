/**
 * Animated statistics.
 * Counts up once when the stats band scrolls into view.
 *
 * Replaces the old scroll-listener version, which never fired if the band was
 * already visible on load and could overshoot its target.
 *
 * Markup: <span class="stat__value" data-count-to="500" data-suffix="+">0</span>
 */

import { prefersReducedMotion } from './motion.js';

const DURATION = 1600;

// Decelerating curve so the number settles rather than stopping dead.
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

function format(el, value) {
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  el.textContent = `${prefix}${value.toLocaleString('en-IN')}${suffix}`;
}

function countUp(el) {
  const target = Number(el.dataset.countTo);
  if (!Number.isFinite(target)) return;

  if (prefersReducedMotion()) {
    format(el, target);
    return;
  }

  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / DURATION, 1);
    format(el, Math.round(easeOutCubic(progress) * target));
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

export function initCounters() {
  const counters = document.querySelectorAll('[data-count-to]');
  if (!counters.length) return;

  if (!('IntersectionObserver' in window)) {
    counters.forEach(countUp);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        observer.unobserve(entry.target); // animate once, never on re-entry
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
}
