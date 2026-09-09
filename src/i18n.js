import { localizedHref, translate } from './lib/i18n-core.js';
export const locale = typeof document !== 'undefined' ? document.body.dataset.locale || 'en' : 'en';
const catalog = locale === 'tr' ? (await import('./locales/tr.js')).default : {};
export const t = (message, values) => translate(message, catalog, values);
export const route = (href) => localizedHref(href, locale);
export const translated = (value) => Array.isArray(value) ? value.map(t) : t(value);
export const localizeRecord = (record, fields) => Object.fromEntries(Object.entries(record).map(([key,value]) => [key,fields.includes(key) ? translated(value) : value]));
export const initLanguageLinks = () => {
  document.querySelectorAll('[data-locale]').forEach((link) => {
    link.addEventListener('click', (event) => {
      // Resolve at click time because resource filters can update the URL.
      const file=location.pathname.split('/').pop() || 'index.html';
      link.href=localizedHref(file,link.dataset.locale)+location.search+location.hash;
    });
  });
};
