/**
 * Entry point. Each behaviour lives in its own module under js/modules/ and is
 * initialised here; every init is a no-op when its markup is absent, so
 * sections can be added or removed from index.html without touching the JS.
 */

import { initNavbar } from './modules/navbar.js';
import { initReveal } from './modules/reveal.js';
import { initCounters } from './modules/counters.js';
import { initAccordion } from './modules/accordion.js';
import { initEnquiryForm } from './modules/enquiry-form.js';
import { initYear } from './modules/year.js';

function boot() {
  initNavbar();
  initReveal();
  initCounters();
  initAccordion();
  initEnquiryForm();
  initYear();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
