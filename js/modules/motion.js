/**
 * Shared motion preference helper.
 * Every animated module asks this before doing anything, so a single
 * OS-level "reduce motion" setting disables the whole site's animation.
 */

const query = window.matchMedia('(prefers-reduced-motion: reduce)');

export const prefersReducedMotion = () => query.matches;

/** Run `fn` whenever the user's motion preference changes. */
export function onMotionPreferenceChange(fn) {
  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', fn);
  }
}
