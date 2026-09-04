/**
 * Scroll reveal.
 * Elements marked `.reveal` fade up once when they enter the viewport.
 * Children of a `[data-reveal-group]` are staggered by their index.
 */

import { prefersReducedMotion } from './motion.js';

const STAGGER_MS = 90;
const MAX_STAGGER = 5;

export function initReveal() {
  // We booted, so the inline watchdog in index.html must not force-show
  // everything and defeat the scroll animation.
  clearTimeout(window.__revealWatchdog);

  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  // No IntersectionObserver, or the user asked for less motion: show everything.
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-static'));
    return;
  }

  document.querySelectorAll('[data-reveal-group]').forEach((group) => {
    group.querySelectorAll(':scope > .reveal').forEach((child, i) => {
      child.style.setProperty(
        '--reveal-delay',
        `${Math.min(i, MAX_STAGGER) * STAGGER_MS}ms`
      );
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  items.forEach((el) => observer.observe(el));
}
