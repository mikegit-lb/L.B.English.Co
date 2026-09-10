import { t, localizeRecord } from './i18n.js';
import { resources as originalResources } from './content.js';
const resources=originalResources.map(resource=>localizeRecord(resource,['title','description','prompt','items','tags']));
const resourceSource = new Map(originalResources.map((resource) => [resource.id, resource]));
import { styles as s, icon } from './components.js';
import { escapeHtml as esc } from './lib/core.js';
import { $, $$, storage, notify, openDialog, downloadText } from './lib/dom.js';
import { timer } from './components.js';
import { mountTimer } from './course-tools.js';
import { examIds } from './exams.js';

const resourceIds = new Set(resources.map((item) => item.id));
const loadSaved = () => new Set(storage.read('lbFreeSaved', [], (value) => Array.isArray(value) && value.every((id)=>typeof id==='string')).filter((id)=>resourceIds.has(id)));
let resourceTimer = null;
let preparePrint = null;

export const openResource = (id) => {
  const resource = resources.find((item) => item.id===id);
  if (!resource) return;
  resourceTimer?.destroy();
  resourceTimer = null;
  $('#resource-title').textContent = resource.title;
  const key = `lbFreeNote-${id}`;
  $('#resource-body').innerHTML = `<p class="mb-3 text-xs font-bold uppercase tracking-wide text-muted">${esc(resource.exam)} · ${t('Free practice tool')}</p><p class="mb-5 text-sm leading-7 text-muted">${esc(resource.description)}</p><fieldset><legend class="mb-3 text-sm font-bold">${t("Your checklist")}</legend><div class="space-y-3">${resource.items.map((item,index)=>`<label class="flex items-start gap-3 rounded-xl border border-line p-3 text-sm leading-6 has-checked:bg-lime/25"><input type="checkbox" data-resource-check="${index}" class="mt-1 h-4 w-4 shrink-0 accent-ink"><span>${esc(item)}</span></label>`).join('')}</div></fieldset>
    ${id==='speaking-reset'?`<div class="my-5 print:hidden">${timer('resource-speaking',60)}</div>`:''}
    <label for="resource-notes" class="mt-6 block text-sm font-bold">${esc(resource.prompt)}</label><textarea id="resource-notes" maxlength="12000" rows="4" class="${s.input}" placeholder="${t('Your notes or next useful improvement…')}"></textarea><p id="resource-note-status" class="mt-2 text-xs text-muted" role="status">${t("Notes and checks stay on this device.")}</p>
    <div class="mt-6 flex flex-wrap gap-3 print:hidden"><button type="button" id="download-resource" class="${s.button}">${t("Download notes &amp; checklist")} ${icon('diagonal')}</button><button type="button" id="print-resource" class="${s.secondary}">${t("Print / save PDF")}</button></div>`;
  $('#resource-notes').value = storage.text(key);
  const saveStatus = (success) => { $('#resource-note-status').textContent = success ? t("Saved on this device.") : t("Could not save. Download a copy before closing this page."); };
  $('#resource-notes').addEventListener('input', (event) => saveStatus(storage.writeText(key,event.target.value)));
  $$('[data-resource-check]').forEach((input) => {
    input.checked = storage.text(`${key}-check-${input.dataset.resourceCheck}`)==='1';
    input.addEventListener('change', () => saveStatus(storage.writeText(`${key}-check-${input.dataset.resourceCheck}`,input.checked?'1':'0')));
  });
  $('#download-resource').addEventListener('click', () => {
    const checked = $$('[data-resource-check]').map((input,index)=>`[${input.checked?'x':' '}] ${resource.items[index]}`).join('\n');
    downloadText(`lb-${id}-notes.txt`,`L.B. ENGLISH CO. / ${resource.title}\n\n${resource.description}\n\n${checked}\n\n${resource.prompt}\n${$('#resource-notes').value}\n\n${t('Original, independent practice material.')}`);
  });
  preparePrint = () => {
    // Print ordinary document flow so long notes can continue onto another page.
    // Native top-layer dialogs and textarea scroll areas can clip printed content.
    $('#print-sheet')?.remove();
    const sheet=document.createElement('section');
    sheet.id='print-sheet';
    sheet.className='hidden print:block print:p-8';
    const checked=$$('[data-resource-check]');
    sheet.innerHTML=`<h1 class="mb-3 text-2xl font-bold">${esc(resource.title)}</h1><p class="mb-5 text-sm">L.B. English Co. · ${t('Original independent practice')}</p><ul class="space-y-3 text-sm">${resource.items.map((item,index)=>`<li>[${checked[index].checked?'x':' '}] ${esc(item)}</li>`).join('')}</ul><h2 class="mb-3 mt-7 text-lg font-bold">${esc(resource.prompt)}</h2><p class="whitespace-pre-wrap break-words text-sm leading-7">${esc($('#resource-notes').value)}</p>`;
    document.body.append(sheet);
  };
  $('#print-resource').addEventListener('click', () => window.print());
  if (id==='speaking-reset') resourceTimer = mountTimer($('[data-timer="resource-speaking"]'));
  openDialog('resource');
};

export const initLibrary = () => {
  document.addEventListener('click', (event) => {
    const opener = event.target.closest('[data-resource]');
    if (opener) openResource(opener.dataset.resource);
  });
  window.addEventListener('beforeprint', () => preparePrint?.());
  window.addEventListener('afterprint', () => $('#print-sheet')?.remove());
  $('#resource-dialog').addEventListener('close', () => { resourceTimer?.destroy(); resourceTimer=null; preparePrint=null; $('#print-sheet')?.remove(); });
  if (!$('#resource-grid')) return;
  const parameters = new URLSearchParams(location.search);
  const initialFilter = parameters.get('exam');
  const filterAliases = { 'YÖKDİL': 'YOKDIL' };
  const canonicalFilter = filterAliases[initialFilter] || initialFilter;
  let filter = [...examIds,'Speaking','Saved'].includes(canonicalFilter) ? canonicalFilter : 'All';
  let saved = loadSaved();
  $('#resource-search').value = parameters.get('q') || '';
  const requestedType = parameters.get('type');
  if (['web','doc','template','pdf'].includes(requestedType)) $('#resource-type').value=requestedType;

  const render = () => {
    const normalize = (value) => String(value).normalize('NFKC').toLocaleLowerCase('en-US').replaceAll('ı','i').replaceAll('İ','i');
    const query = normalize($('#resource-search').value.trim());
    const type = $('#resource-type').value;
    let count = 0;
    resources.forEach((resource) => {
      const haystack = normalize([resource.title,resource.exam,resource.description,...resource.tags].join(' '));
      const goalMatches = filter==='All' || (filter==='Saved' ? saved.has(resource.id) : filter==='Speaking' ? resourceSource.get(resource.id)?.tags?.includes('Speaking') : Boolean(resource.examIds?.includes(filter)));
      const visible = goalMatches && (type==='all' || resource.type===type) && haystack.includes(query);
      $(`[data-resource-card="${resource.id}"]`).hidden = !visible;
      count += Number(visible);
      const save = $(`[data-save="${resource.id}"]`);
      save.setAttribute('aria-pressed',String(saved.has(resource.id)));
      save.setAttribute('aria-label',t(saved.has(resource.id)?'Remove saved {title}':'Save {title}',{title:resource.title}));
    });
    $$('[data-filter]').forEach((control) => control.setAttribute('aria-pressed',String(control.dataset.filter===filter)));
    $('#resource-count').textContent = t('{count} free {resourceWord} shown',{count,resourceWord:t(count===1?'resource':'resources')});
    $('#resource-empty').hidden = count!==0;
  };
  const syncUrl = () => {
    const params = new URLSearchParams();
    if (filter!=='All') params.set('exam',filter);
    if ($('#resource-search').value.trim()) params.set('q',$('#resource-search').value.trim());
    if ($('#resource-type').value!=='all') params.set('type',$('#resource-type').value);
    history.replaceState(null,'',location.pathname+(params.size?'?'+params.toString():'')+location.hash);
  };
  const handleFilter = () => { render(); syncUrl(); };
  $$('[data-filter]').forEach((control) => control.addEventListener('click', () => { filter=control.dataset.filter; handleFilter(); }));
  $('#resource-search').addEventListener('input',handleFilter);
  $('#resource-type').addEventListener('change',handleFilter);
  const handleClear = () => { filter='All'; $('#resource-search').value=''; $('#resource-type').value='all'; handleFilter(); };
  $('#clear-filters').addEventListener('click',handleClear);
  $('[data-clear-filters]').addEventListener('click',handleClear);
  $$('[data-save]').forEach((control) => control.addEventListener('click', () => {
    const id=control.dataset.save;
    const next=new Set(saved);
    next.has(id)?next.delete(id):next.add(id);
    if (!storage.write('lbFreeSaved',[...next])) { notify(t("Could not save to this browser. Your previous saved items are unchanged.")); return; }
    saved=next; render();
    notify(saved.has(id)?t("Saved on this device."):t("Removed from saved resources."));
  }));
  window.addEventListener('storage', () => { saved=loadSaved(); render(); });
  render();
  if (resourceIds.has(parameters.get('resource'))) openResource(parameters.get('resource'));
};
