import { createStorage } from './core.js';
export const $ = (selector, context = document) => context.querySelector(selector);
export const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
export const storage = createStorage(() => window.localStorage);
let toastTimeout;
export const notify = (message) => {
  const toast = $('#toast');
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { toast.hidden = true; }, 3500);
};
export const downloadText = (name, text) => {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const returnFocus = new WeakMap();
export const openDialog = (id) => {
  const dialog = $(`#${id}-dialog`);
  if (!dialog || dialog.open) return;
  const active = $('dialog[open]');
  const trigger = active ? returnFocus.get(active) : document.activeElement;
  if (active) active.close();
  returnFocus.set(dialog, trigger);
  dialog.showModal();
  document.body.classList.add('overflow-hidden');
};
export const initDialogs = () => {
  $$('dialog').forEach((dialog) => {
    $('[data-close]', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      if ($('dialog[open]')) return;
      document.body.classList.remove('overflow-hidden');
      const trigger = returnFocus.get(dialog);
      if (trigger?.isConnected) trigger.focus();
    });
  });
};
