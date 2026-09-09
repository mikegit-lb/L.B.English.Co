import { escapeHtml as esc } from './lib/core.js';

import { styles, icon } from './components.js';
export { styles, icon } from './components.js';

export const link = (label, href, secondary = false) => `<a class="${secondary ? styles.secondary : styles.button}" href="${href}">${label}${icon('arrow')}</a>`;
export const button = (label, attr = 'data-open="planner"', secondary = false) => `<button type="button" class="${secondary ? styles.secondary : styles.button}" ${attr}>${label}${icon('arrow')}</button>`;
export const eyebrow = (text) => `<p class="${styles.eyebrow} mb-5 text-muted">${text}</p>`;

export const header = (page) => {
  const items = [['index', 'Home', 'index.html'], ['ielts', 'IELTS', 'ielts.html'], ['sat', 'SAT', 'sat.html'], ['resources', 'Free resources', 'resources.html'], ['speaking', 'Speaking', 'speaking.html'], ['ydt-yds', 'YDT / YDS', 'ydt-yds.html']];
  const navigation = items.map(([id, label, href]) => `<a href="${href}" ${page === id ? 'aria-current="page"' : ''} class="flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-muted hover:bg-ink/5 hover:text-ink aria-[current=page]:text-ink aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8">${label}</a>`).join('');
  return `<a href="#main" class="fixed left-4 top-3 z-[100] -translate-y-24 rounded-lg bg-ink p-4 text-white focus:translate-y-0">Skip to content</a>
  <div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 bg-ink px-4 py-2.5 text-center text-xs font-medium tracking-wide text-white print:hidden"><div>YOUR NEXT CHAPTER <span class="mx-2 text-lime">/</span> IELTS &amp; SAT, with a plan that fits you. <a href="index.html#programmes" class="ml-3 underline underline-offset-4">Explore the courses ↗</a></div><nav aria-label="Site language" class="flex items-center gap-1"><a data-locale="en" href="${page}.html" lang="en" hreflang="en" aria-current="true" class="grid min-h-9 min-w-11 place-items-center rounded-full border border-white/30 px-3 font-bold aria-[current=true]:bg-lime aria-[current=true]:text-ink" aria-label="Switch to English">EN</a><a data-locale="tr" href="${page}-tr.html" lang="tr" hreflang="tr" aria-current="false" class="grid min-h-9 min-w-11 place-items-center rounded-full border border-white/30 px-3 font-bold aria-[current=true]:bg-lime aria-[current=true]:text-ink" aria-label="Türkçeye geç">TR</a></nav></div>
  <header lang="en" class="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-md print:hidden">
    <div class="${styles.wrap} flex min-h-21 items-center justify-between gap-4">
      <a href="index.html" aria-label="L.B. English Co. home" class="flex shrink-0 items-center gap-2.5">
        <img src="assets/lb-english-co-mark.svg" alt="" width="42" height="30" class="h-8 w-11">
        <span class="text-sm font-extrabold tracking-tight">L.B. ENGLISH CO.<span class="mt-0.5 block text-[9px] font-medium uppercase tracking-[0.19em] text-muted">Your private learning studio</span></span>
      </a>
      <nav class="hidden items-center xl:flex" aria-label="Primary navigation">${navigation}</nav>
      <div class="flex items-center gap-2">
        <button type="button" data-open="planner" class="hidden min-h-11 items-center gap-2 rounded-full bg-lime px-5 text-sm font-bold hover:bg-[#c5e36a] sm:inline-flex">My study plan ${icon('diagonal', 'h-4 w-4')}</button>
        <button type="button" id="menu-button" class="grid h-11 w-11 place-items-center rounded-full border border-line xl:hidden" aria-controls="mobile-nav" aria-expanded="false" aria-label="Open navigation">${icon('menu')}</button>
      </div>
    </div>
    <nav id="mobile-nav" hidden class="border-t border-line bg-paper px-5 pb-5 xl:hidden" aria-label="Mobile navigation">${navigation}<div class="mt-4 flex items-center gap-2 border-t border-line pt-4" aria-label="Site language"><span class="mr-2 text-xs font-semibold uppercase tracking-wide text-muted">Site language</span><a data-locale="en" href="${page}.html" lang="en" hreflang="en" aria-current="true" class="grid min-h-10 min-w-11 place-items-center rounded-full border border-line px-3 text-xs font-bold aria-[current=true]:bg-ink aria-[current=true]:text-white" aria-label="Switch to English">EN</a><a data-locale="tr" href="${page}-tr.html" lang="tr" hreflang="tr" aria-current="false" class="grid min-h-10 min-w-11 place-items-center rounded-full border border-line px-3 text-xs font-bold aria-[current=true]:bg-ink aria-[current=true]:text-white" aria-label="Türkçeye geç">TR</a></div><button type="button" data-open="planner" class="mt-3 ${styles.button}">My study plan ${icon('arrow')}</button></nav>
  </header>`;
};

export const footer = () => `<footer lang="en" class="bg-ink pb-8 pt-16 text-white print:hidden"><div class="${styles.wrap}">
  <div class="grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
    <div><a href="index.html" class="text-xl font-extrabold tracking-tight">L.B. ENGLISH CO.</a><p class="mt-4 max-w-xs text-sm leading-7 text-white/70">Build the English for where you want to go. Personal teaching. Purposeful practice.</p></div>
    <div><p class="mb-4 text-xs font-bold uppercase tracking-widest text-lime">Choose your route</p><div class="grid gap-3 text-sm"><a href="ielts.html">IELTS coaching</a><a href="sat.html">SAT Reading &amp; Writing</a><a href="ydt-yds.html">YDT · YDS · YÖKDİL</a><a href="speaking.html">Speaking studio</a></div></div>
    <div><p class="mb-4 text-xs font-bold uppercase tracking-widest text-lime">Keep learning</p><div class="grid justify-items-start gap-3 text-sm"><a href="resources.html">Free resource library</a><button type="button" data-open="planner">Study planner</button><button type="button" data-open="finder">Programme finder</button><button type="button" data-open="diagnostic">Language practice check</button></div></div>
    <div><p class="mb-4 text-xs font-bold uppercase tracking-widest text-lime">The studio</p><div class="grid gap-3 text-sm"><a href="index.html#formats">Coaching formats</a><a href="index.html#faq">Your questions</a><a href="legal.html#privacy">Privacy &amp; storage</a><a href="legal.html#terms">Service information</a></div></div>
  </div>
  <div class="flex flex-col justify-between gap-4 border-t border-white/20 pt-7 text-xs leading-6 text-white/70 sm:flex-row"><p>© ${new Date().getFullYear()} L.B. English Co.</p><p class="max-w-2xl sm:text-right">Independent coaching and original practice. Not affiliated with IELTS or College Board. Practice feedback is not an official score. SAT coaching here covers Reading &amp; Writing.</p></div>
  </div></footer>`;

export const dialog = (id, title, contents) => `<dialog lang="en" id="${id}-dialog" aria-labelledby="${id}-title" class="print:hidden m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-3xl border border-line bg-paper p-6 text-ink shadow-2xl backdrop:bg-ink/60 sm:p-9 print:fixed print:inset-0 print:m-0 print:max-h-none print:w-full print:max-w-none print:overflow-visible print:rounded-none print:border-0 print:shadow-none">
  <div class="mb-6 flex items-start justify-between gap-4"><h2 id="${id}-title" class="pr-2 text-2xl font-bold tracking-tight">${title}</h2><button type="button" data-close class="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line hover:bg-white print:hidden" aria-label="Close dialog">${icon('close')}</button></div>${contents}</dialog>`;

const field = (label, id, contents) => `<label class="${styles.label}" for="${id}">${label}${contents}</label>`;
export const dialogs = () => [
  dialog('planner', 'A little structure. A lot more focus.', `<p class="mb-6 text-sm leading-6 text-muted">Choose your route and a realistic weekly commitment. Your plan stays on this device.</p>
    <form id="planner-form" class="grid gap-5 sm:grid-cols-2">
    ${field('My goal', 'plan-exam', `<select id="plan-exam" class="${styles.input}"><option>IELTS</option><option>SAT</option><option>YDT</option><option>YDS</option><option>Speaking</option><option>General</option></select>`)}
    ${field('Time each week', 'plan-hours', `<select id="plan-hours" class="${styles.input}"><option value="4">4 hours · steady</option><option value="8" selected>8 hours · focused</option><option value="14">14 hours · intensive</option></select>`)}
    <button class="${styles.button} sm:col-span-2" type="submit">Build my week ${icon('arrow')}</button></form>
    <div id="plan-output" class="mt-6" aria-live="polite"></div><button type="button" id="download-plan" hidden class="mt-5 ${styles.secondary}">Download my plan ${icon('diagonal')}</button>`),
  dialog('consultation', 'Start with your goal.', `<p class="mb-5 text-sm leading-6 text-muted">Prepare a coaching brief to keep or share with your tutor. Downloading this brief does not book a session or send an enquiry.</p>
    <form id="brief-form" class="grid gap-5">
    ${field('I want help with', 'brief-goal', `<select id="brief-goal" class="${styles.input}"><option>IELTS</option><option>SAT</option><option>Speaking</option><option>YDT</option><option>YDS</option><option>YÖKDİL</option><option>TOEFL</option><option>Business English</option><option>CEFR English</option></select>`)}
    ${field('Preferred format', 'brief-format', `<select id="brief-format" class="${styles.input}"><option>Private 1:1</option><option>VIP group of 3–5</option><option>Exam consultancy</option></select>`)}
    ${field('My goal and timeline', 'brief-notes', `<textarea id="brief-notes" rows="4" maxlength="3000" required class="${styles.input}" placeholder="Where are you now, and what would you like to work towards?"></textarea>`)}
    <p class="text-xs leading-5 text-muted">No personal contact details are needed. Your brief is downloaded as a text file; it is not stored by the site. <a href="legal.html#privacy" class="underline">Privacy information</a></p>
    <button type="submit" class="${styles.button}">Download my coaching brief ${icon('diagonal')}</button></form><p id="brief-status" class="mt-4 text-sm font-semibold" role="status"></p>`),
  dialog('finder', 'Find your starting point.', `<form id="finder-form" class="grid gap-5">
    ${field('What matters most?', 'finder-goal', `<select id="finder-goal" class="${styles.input}"><option value="IELTS">An IELTS goal</option><option value="SAT">SAT Reading &amp; Writing</option><option value="YDT">YDT / YDS / YÖKDİL</option><option value="Speaking">Speaking with more confidence</option><option value="General">Everyday or professional English</option></select>`)}
    ${field('How do you like to learn?', 'finder-format', `<select id="finder-format" class="${styles.input}"><option>Private 1:1</option><option>VIP group of 3–5</option><option>Independent practice with guidance</option></select>`)}
    <button class="${styles.button}" type="submit">Show my route ${icon('arrow')}</button></form><div id="finder-result" class="mt-6" aria-live="polite"></div>`),
  dialog('lesson', 'A small lesson. A useful next step.', '<div id="lesson-body"></div>'),
  dialog('resource', 'Your working page', '<div id="resource-body"></div>'),
  dialog('diagnostic', 'Language practice check', '<p class="mb-5 text-sm leading-6 text-muted">Eight grammar and vocabulary questions. Feedback describes this activity only; it cannot determine your CEFR level or predict an exam score.</p><div id="diagnostic-body"></div>'),
].join('');

export const layout = ({ page, title, description, body, lang = 'en' }) => `<!doctype html>
<html lang="${lang}" class="scroll-pt-28 motion-safe:scroll-smooth">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#142b2b">
<title>${esc(title)} | L.B. English Co.</title><meta name="description" content="${esc(description)}">
<link rel="alternate" hreflang="en" href="${page}.html"><link rel="alternate" hreflang="tr" href="${page}-tr.html">
<meta property="og:title" content="${esc(title)} | L.B. English Co."><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="website">
<link rel="icon" href="assets/lb-english-co-mark.svg" type="image/svg+xml"><link rel="stylesheet" href="assets/site.css">
<link rel="preload" href="assets/manrope-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<script type="module" src="src/app.js"></script></head>
<body data-page="${page}" class="bg-paper font-sans text-ink antialiased selection:bg-lime [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-4 [&_:focus-visible]:outline-ink [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed print:[&:has(dialog[open])>main]:hidden print:[&:has(dialog[open])>footer]:hidden">
${header(page)}<main id="main" tabindex="-1">${body}</main>${footer()}${dialogs()}
<div id="toast" hidden role="status" class="fixed bottom-5 left-1/2 z-[90] w-max max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-xl bg-ink px-5 py-3 text-sm text-white shadow-xl print:hidden"></div>
<noscript><p class="fixed bottom-0 left-0 z-50 w-full bg-lime p-4 text-center text-sm">Enable JavaScript for lesson practice, timers and study tools. Course information and navigation remain available.</p></noscript>
</body></html>`;
