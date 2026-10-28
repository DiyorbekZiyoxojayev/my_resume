import { translations } from './translations.js';

let current = 'en';
export const getLanguage = () => current;
export const phrase = (key, fallback = key) => translations[current]?.[key] ?? fallback;

export function initLanguage() {
  function apply(language) {
    current = language === 'uz' ? 'uz' : 'en';
    document.documentElement.lang = current;
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const value = translations[current][element.dataset.i18n];
      if (value !== undefined) element.textContent = value;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const value = translations[current][element.dataset.i18nPlaceholder];
      if (value !== undefined) element.placeholder = value;
    });
    document.querySelectorAll('[data-en][data-uz]').forEach(element => {
      element.textContent = element.getAttribute(`data-${current}`);
    });
    document.querySelectorAll('[data-language]').forEach(element => element.classList.toggle('is-active', element.dataset.language === current));
    const toggle = document.querySelector('[data-language-toggle]');
    toggle?.setAttribute('aria-label', current === 'en' ? "O'zbek tiliga o'tish" : 'Switch to English');
    document.title = phrase(current === 'uz' ? 'meta.titleUz' : 'meta.titleEn', document.title);
    document.querySelector('meta[name="description"]')?.setAttribute('content', phrase(current === 'uz' ? 'meta.descUz' : 'meta.descEn'));
    try { localStorage.setItem('dz-lang', current); } catch { /* Session language still works. */ }
    document.dispatchEvent(new CustomEvent('languagechange', { detail: { language: current } }));
  }
  let saved;
  try { saved = localStorage.getItem('dz-lang'); } catch { /* Storage may be unavailable. */ }
  apply(saved || 'en');
  document.querySelector('[data-language-toggle]')?.addEventListener('click', () => apply(current === 'en' ? 'uz' : 'en'));
  window.addEventListener('storage', event => { if (event.key === 'dz-lang') apply(event.newValue); });
}
