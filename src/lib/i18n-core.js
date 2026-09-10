export const pageNames = ['index','international-exams','turkiye-exams','ielts','toefl','sat','ydt','yds','yokdil','resources','speaking','ydt-yds','legal'];

/** Locale changes never rewrite external URLs, query values or fragment IDs. */
export const localizedHref = (href, locale) => {
  const match = href.match(/^([a-z-]+)\.html([?#].*)?$/);
  if (!match) return href;
  const page = match[1].replace(/-tr$/, '');
  if (!pageNames.includes(page)) return href;
  return page + (locale === 'tr' ? '-tr' : '') + '.html' + (match[2] || '');
};

export const translate = (message, catalog, values = {}) => {
  const translated = Object.hasOwn(catalog, message) ? catalog[message] : message;
  return translated.replace(/\{(\w+)\}/g, (token, key) => Object.hasOwn(values,key) ? String(values[key]) : token);
};
