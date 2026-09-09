import { t, route, initLanguageLinks } from './i18n.js';
import { $, $$, initDialogs } from './lib/dom.js';
import { initStudy } from './study.js';

const menu = $('#mobile-nav');
const menuButton = $('#menu-button');
const handleMenu = (open) => {
  menu.hidden=!open;
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.setAttribute('aria-label',open?t("Close navigation"):t("Open navigation"));
};
menuButton.addEventListener('click', () => handleMenu(menu.hidden));
menu.addEventListener('click', (event) => {
  if (!event.target.closest('a,button')) return;
  handleMenu(false);
  if (event.target.closest('button')) menuButton.focus();
});
document.addEventListener('keydown', (event) => {
  if (event.key!=='Escape' || menu.hidden) return;
  handleMenu(false); menuButton.focus();
});
document.addEventListener('click', (event) => {
  if (!menu.hidden && !event.target.closest('header')) handleMenu(false);
});
window.matchMedia('(min-width:1280px)').addEventListener('change', (event) => { if (event.matches) handleMenu(false); });
$$('[data-hero]').forEach((control) => control.addEventListener('click', () => {
  const sat=control.dataset.hero==='SAT';
  $$('[data-hero]').forEach((item)=>item.setAttribute('aria-pressed',String(item===control)));
  $('#hero-lesson-title').textContent=sat?t("Keep the inference within the evidence"):t("Make your position unmistakable");
  $('#hero-lesson-meta').textContent=sat?t("Reading & Writing · 7-minute mini-lesson"):t("Writing · 8-minute mini-lesson");
  $('#hero-lesson-link').href=route(sat?'sat.html#lessons':'ielts.html#lessons');
}));
initLanguageLinks();
initDialogs();
initStudy();
if (document.body.dataset.page === 'resources') {
  const { initLibrary } = await import('./library.js');
  initLibrary();
}
if (['ielts','sat','speaking','ydt-yds'].includes(document.body.dataset.page)) {
  const { initCourseTools } = await import('./course-tools.js');
  initCourseTools();
}
if (document.body.dataset.page === 'ielts') {
  const { initEssay } = await import('./essay.js');
  initEssay();
}
