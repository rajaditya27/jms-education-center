/**
 * Navbar: mobile panel, scrolled state, and scroll-spy.
 *
 * The previous implementation crashed on load (`.menu-toggle` did not exist)
 * and ran two unthrottled scroll listeners. Scroll-spy now uses
 * IntersectionObserver; only the lightweight solid/transparent toggle listens
 * to scroll, and it is rAF-throttled.
 */

const SOLID_AFTER = 40;

export function initNavbar() {
  const navbar = document.querySelector('[data-navbar]');
  if (!navbar) return;

  const toggle = navbar.querySelector('[data-nav-toggle]');
  const panel = navbar.querySelector('[data-nav-panel]');
  const links = [...navbar.querySelectorAll('.nav-link')];

  /* --- Mobile panel ---------------------------------------------------- */
  const setMenu = (open) => {
    if (!toggle || !panel) return;
    panel.classList.toggle('is-open', open);
    navbar.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  const isOpen = () => toggle?.getAttribute('aria-expanded') === 'true';

  if (toggle && panel) {
    toggle.addEventListener('click', () => setMenu(!isOpen()));

    // Tapping a link should navigate and close, not leave the panel covering it.
    links.forEach((link) =>
      link.addEventListener('click', () => setMenu(false))
    );

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) {
        setMenu(false);
        toggle.focus();
      }
    });

    // Clicking outside the navbar closes the panel.
    document.addEventListener('click', (e) => {
      if (isOpen() && !navbar.contains(e.target)) setMenu(false);
    });

    // Returning to desktop must clear mobile-only state.
    window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => {
      if (e.matches) setMenu(false);
    });
  }

  /* --- Solid on scroll -------------------------------------------------- */
  let ticking = false;
  const syncSolid = () => {
    navbar.classList.toggle('is-solid', window.scrollY > SOLID_AFTER);
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(syncSolid);
    },
    { passive: true }
  );
  syncSolid();

  /* --- Scroll-spy ------------------------------------------------------- */
  if (!('IntersectionObserver' in window)) return;

  const byId = new Map();
  links.forEach((link) => {
    const id = link.getAttribute('href')?.replace('#', '');
    const section = id && document.getElementById(id);
    if (section) byId.set(section, link);
  });
  if (!byId.size) return;

  const visible = new Set();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });

      // With several sections in view, highlight the topmost one.
      const current = [...visible].sort(
        (a, b) => a.offsetTop - b.offsetTop
      )[0];

      links.forEach((link) =>
        link.classList.toggle('is-active', byId.get(current) === link)
      );
    },
    { rootMargin: '-30% 0px -55% 0px', threshold: 0 }
  );

  byId.forEach((_link, section) => observer.observe(section));
}
