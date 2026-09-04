/**
 * Enquiry form.
 *
 * Validates client-side, then hands the enquiry to WhatsApp with the answers
 * pre-filled. This needs no backend and matches how the centre already takes
 * enquiries. The Google Form remains available as an alternative route.
 */

const PHONE_RE = /^[6-9]\d{9}$/;

const RULES = {
  name: (v) =>
    v.trim().length >= 2 ? '' : 'Please enter your full name.',
  phone: (v) =>
    PHONE_RE.test(v.replace(/[\s-]/g, '').replace(/^(\+?91)/, ''))
      ? ''
      : 'Enter a valid 10-digit mobile number.',
  course: (v) => (v ? '' : 'Please choose a course of interest.'),
  message: () => '',
};

function setError(field, message) {
  const wrapper = field.closest('.field');
  const slot = wrapper?.querySelector('.field__error');
  wrapper?.classList.toggle('has-error', Boolean(message));
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
  if (slot) slot.textContent = message;
}

function validateField(field) {
  const rule = RULES[field.name];
  if (!rule) return true;
  const message = rule(field.value);
  setError(field, message);
  return !message;
}

function buildWhatsAppMessage(data) {
  const lines = [
    'Hello J.M.S. Education Center, I would like admission guidance.',
    '',
    `Name: ${data.name.trim()}`,
    `Phone: ${data.phone.trim()}`,
    `Course of interest: ${data.course}`,
  ];

  if (data.message.trim()) lines.push(`Message: ${data.message.trim()}`);

  return lines.join('\n');
}

export function initEnquiryForm() {
  const form = document.querySelector('[data-enquiry-form]');
  if (!form) return;

  const status = form.querySelector('[data-form-status]');
  const fields = [...form.querySelectorAll('input, select, textarea')];

  // Validate on blur, but clear an error as soon as the user starts fixing it.
  fields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.closest('.field')?.classList.contains('has-error')) {
        validateField(field);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const invalid = fields.filter((field) => !validateField(field));

    if (invalid.length) {
      if (status) status.textContent = 'Please correct the highlighted fields.';
      invalid[0].focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    const phone = form.dataset.whatsapp;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(
      buildWhatsAppMessage(data)
    )}`;

    if (status) {
      status.textContent = 'Opening WhatsApp with your details…';
    }

    const opened = window.open(url, '_blank', 'noopener');
    if (!opened) window.location.href = url; // popup blocked — navigate instead

    form.reset();
  });
}
