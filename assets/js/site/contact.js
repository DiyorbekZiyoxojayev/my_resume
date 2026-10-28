import { getLanguage, phrase } from './language.js';

// Existing public EmailJS integration. These are browser-safe service identifiers.
const config = { service_id: 'service_v1d13sv', template_id: 'template_dvxw8pb', user_id: '9mgs9BoBSXqgZPhrF' };
const messages = {
  en: { invalid: 'Please fill in your name, a valid email address and a message.', sending: 'Sending...', sent: 'Message sent. Thank you for getting in touch.', error: 'The message could not be sent. Please email diyorbekziyoxojayev@gmail.com directly.' },
  uz: { invalid: "Ism, to'g'ri email manzil va xabarni kiriting.", sending: 'Yuborilmoqda...', sent: 'Xabar yuborildi. Murojaatingiz uchun rahmat.', error: "Xabar yuborilmadi. diyorbekziyoxojayev@gmail.com manziliga yozing." }
};

export async function sendContactMessage(params) {
  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...config, template_params: params }),
    signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) throw new Error('Email delivery failed');
}

export function initContact({ send = sendContactMessage } = {}) {
  const form = document.querySelector('#cf');
  const status = document.querySelector('#form-status');
  const button = document.querySelector('#submitBtn');
  if (!form || !status || !button) return;
  const label = button.querySelector('span');
  let pending = false;
  function show(kind, text) { status.className = `form-status ${kind}`; status.textContent = text; }
  form.addEventListener('input', event => event.target.removeAttribute('aria-invalid'));
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending) return;
    const copy = messages[getLanguage()];
    const name = form.querySelector('#name-field');
    const email = form.querySelector('#email-field');
    const message = form.querySelector('#message-field');
    const invalid = [name, email, message].filter(field => !field.value.trim() || !field.validity.valid);
    for (const field of [name, email, message]) field.setAttribute('aria-invalid', String(invalid.includes(field)));
    if (invalid.length) { show('error', copy.invalid); invalid[0].focus(); return; }
    pending = true;
    button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    label.textContent = copy.sending;
    show('', '');
    try {
      await send({ from_name: name.value.trim(), from_email: email.value.trim(), reply_to: email.value.trim(), phone_number: form.querySelector('#phone-field').value.trim() || '-', service_type: form.querySelector('#service-field').value || '-', message: message.value.trim() });
      form.reset();
      show('success', messages[getLanguage()].sent);
    } catch { show('error', messages[getLanguage()].error); }
    finally {
      pending = false;
      button.disabled = false;
      form.removeAttribute('aria-busy');
      label.textContent = phrase('contact.submit', 'Send message');
    }
  });
}
