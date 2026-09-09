import { t } from './i18n.js';
export const styles = {
  wrap: 'mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12',
  eyebrow: 'text-xs font-bold uppercase tracking-[0.18em]',
  heading: 'font-display text-4xl font-semibold tracking-[-0.045em] leading-[1.12] sm:text-5xl',
  button: 'inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#294844] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40',
  secondary: 'inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-ink/25 px-6 py-3 text-sm font-bold transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink',
  input: 'mt-2 block min-h-12 w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink focus:border-ink focus:outline-2 focus:outline-offset-2 focus:outline-ink',
  label: 'block text-sm font-semibold',
  chip: 'min-h-11 rounded-full border border-line px-5 py-2 text-sm font-semibold transition-colors hover:border-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-white',
};

export const icon = (name, cls = 'h-5 w-5') => {
  const paths = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    diagonal: '<path d="M6 18 18 6M6 6h12v12"/>',
    book: '<path d="M12 5v15M3 4h5a4 4 0 0 1 4 3 4 4 0 0 1 4-3h5v15h-5a5 5 0 0 0-4 2 5 5 0 0 0-4-2H3Z"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    play: '<path d="m9 5 11 7-11 7Z"/>',
    star: '<path d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L2.3 9.4l6-.9Z"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  };
  return `<svg class="${cls} shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
};

export const timer = (id, seconds = 60) => `<div data-timer="${id}" data-duration="${seconds}" class="rounded-2xl border border-line bg-white p-5"><div class="mb-4 flex items-center justify-between gap-3"><span class="text-xs font-semibold text-muted">${t("PRACTICE TIMER")}</span><select aria-label="${t('Practice timer duration')}" data-timer-duration class="rounded-lg border border-line p-2 text-xs"><option value="60" ${seconds===60?'selected':''}>${t("1 minute · prepare")}</option><option value="120" ${seconds===120?'selected':''}>${t("2 minutes · speak")}</option><option value="1920" ${seconds===1920?'selected':''}>${t("32 minutes · module")}</option></select></div><output data-timer-display class="block text-5xl font-semibold tabular-nums tracking-tight">${seconds===1920?'32:00':seconds===120?'02:00':'01:00'}</output><div class="mt-5 flex flex-wrap gap-2"><button data-timer-toggle type="button" class="${styles.button}">${t("Start")}</button><button data-timer-reset type="button" class="${styles.secondary}">${t("Reset")}</button></div><p data-timer-status class="mt-3 text-xs text-muted" role="status">${t("Ready when you are.")}</p></div>`;

