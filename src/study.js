import { t, route, localizeRecord } from './i18n.js';
import { styles as s, icon } from './components.js';
import { buildSchedule, escapeHtml as esc, schedules } from './lib/core.js';
import { $, $$, storage, downloadText, openDialog } from './lib/dom.js';
import { lessons as originalLessons } from './lessons.js';
const lessons=Object.fromEntries(Object.entries(originalLessons).map(([exam,items])=>[exam,items.map(lesson=>localizeRecord(lesson,['title','concept','explanation','transfer','skill','duration']))]));
import { diagnostic } from './content.js';

const allLessons = Object.values(lessons).flat();
const validIds = new Set(allLessons.map((lesson) => lesson.id));
const readProgress = () => storage.read('lbLessons:v2', [], (value) => Array.isArray(value) && value.every((id) => typeof id === 'string')).filter((id) => validIds.has(id));
const renderProgress = () => {
  const completed = new Set(readProgress());
  $$('[data-lesson-label]').forEach((label) => { label.textContent = completed.has(label.dataset.lessonLabel) ? t("Review completed lesson") : t("Open mini-lesson"); });
  const progress = $('#course-progress');
  if (!progress) return;
  const count = lessons[progress.dataset.exam].filter((lesson) => completed.has(lesson.id)).length;
  progress.textContent = t('{count} of 4 mini-lessons completed on this device',{count});
};

export const openLesson = (id) => {
  const lesson = allLessons.find((item) => item.id === id);
  if (!lesson) return;
  $('#lesson-title').textContent = lesson.title;
  $('#lesson-body').innerHTML = `<p class="mb-5 text-xs font-bold uppercase tracking-wider text-muted">${esc(lesson.skill)} · ${esc(lesson.duration)} · ${t('Original practice')}</p><h3 class="text-sm font-bold">${t("01 / Notice the idea")}</h3><p class="my-4 text-sm leading-7 text-muted">${esc(lesson.concept)}</p><div lang="en" data-practice class="my-5 rounded-xl bg-white p-5 text-sm leading-7">${esc(lesson.example)}</div><form id="lesson-form"><fieldset><legend lang="en" class="mb-4 text-base font-bold">02 / ${esc(lesson.question)}</legend><div class="space-y-3">${lesson.options.map((option,index)=>`<label class="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-4 text-sm leading-6 has-checked:border-ink has-checked:bg-lime/30"><input type="radio" name="lesson-answer" value="${index}" required class="mt-1 h-4 w-4 shrink-0 accent-ink"><span lang="en">${esc(option)}</span></label>`).join('')}</div></fieldset><button type="submit" class="mt-5 ${s.button}">${t("Check my answer")} ${icon('arrow')}</button></form><div id="lesson-feedback" class="mt-5" aria-live="polite"></div>`;
  openDialog('lesson');
  $('#lesson-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const chosen = Number(new FormData(event.currentTarget).get('lesson-answer'));
    $('#lesson-feedback').innerHTML = `<div class="rounded-xl bg-lime/40 p-5"><h3 class="text-base font-bold">${chosen===lesson.answer?t("That’s right. Here’s why."):t("A useful distinction to notice.")}</h3><p class="mt-3 text-sm leading-7">${esc(lesson.explanation)}</p><p class="mt-3 text-sm font-semibold">${t('Answer:')} <span lang="en">${esc(lesson.options[lesson.answer])}</span></p></div><h3 class="mb-3 mt-6 text-sm font-bold">${t("03 / Take it into your next task")}</h3><label for="lesson-note" class="block text-sm leading-7 text-muted">${esc(lesson.transfer)}</label><textarea id="lesson-note" maxlength="6000" rows="3" class="${s.input}" placeholder="${t('Your reflection or practice response (optional)')}"></textarea><p id="lesson-note-status" class="mt-2 text-xs text-muted" role="status">${t("Your note stays on this device.")}</p><button type="button" id="complete-lesson" class="mt-5 ${s.button}">${t("Mark lesson complete")} ${icon('check')}</button><p id="lesson-save-status" class="mt-3 text-sm" role="status"></p>`;
    const note = $('#lesson-note');
    note.value = storage.text('lbLessonNote-' + id);
    note.addEventListener('input', () => { $('#lesson-note-status').textContent = storage.writeText('lbLessonNote-' + id, note.value) ? t("Note saved on this device.") : t("Note could not be saved. Keep a copy before leaving."); });
    $('#complete-lesson').addEventListener('click', (completeEvent) => {
      const completed = [...new Set([...readProgress(), id])];
      const saved = storage.write('lbLessons:v2', completed);
      $('#lesson-save-status').textContent = saved ? t("Completed. Your progress is saved on this device.") : t("Practice completed. Browser storage is unavailable, so progress could not be saved.");
      completeEvent.currentTarget.disabled = true;
      completeEvent.currentTarget.textContent = t("Lesson completed");
      renderProgress();
    });
    $('#lesson-feedback').scrollIntoView({ behavior:'instant', block:'nearest' });
  });
};

const explanations = [
  'The finalising happened before another past event, so the past perfect “had finalized” expresses that sequence.',
  '“Fierce opposition” is a natural collocation describing strong resistance.',
  '“Despite” can be followed by a gerund phrase. “Having prepared” also makes the preparation earlier than the debate.',
  '“Corroborate” means to provide evidence supporting a claim. “Collaborate” means to work together.',
  'An initial negative-frequency adverb such as “Rarely” triggers auxiliary–subject inversion: “have we observed”.',
  '“Nevertheless” signals that the efficiency gains justified the expenditure despite its size.',
  '“Tackle” directly takes “the issue” as its object. The other phrases do not fit this meaning and construction.',
  'With “neither … nor” in this sentence, the plural verb agrees with the nearer subject, “assistants”.',
];

const openDiagnostic = () => {
  let index = 0;
  let score = 0;
  const results = [];
  const renderQuestion = () => {
    const item = diagnostic[index];
    // Rotate the answer position; the legacy bank placed every answer first.
    const options = item.opts.map((text, original) => ({ text, correct: original===item.ans }));
    const offset = (index + 1) % options.length;
    const ordered = [...options.slice(offset), ...options.slice(0,offset)];
    $('#diagnostic-body').innerHTML = `<p class="mb-3 text-xs font-bold text-muted">${t('Question {index} of {total}',{index:index+1,total:diagnostic.length})}</p><form id="check-form"><fieldset><legend lang="en" class="mb-5 text-base font-semibold leading-7">${esc(item.q)}</legend><div class="space-y-3">${ordered.map((opt,i)=>`<label class="flex gap-3 rounded-xl border border-line p-4 text-sm has-checked:bg-lime/30"><input type="radio" name="answer" value="${i}" required class="accent-ink"><span lang="en">${esc(opt.text)}</span></label>`).join('')}</div></fieldset><button type="submit" class="mt-5 ${s.button}">${index===diagnostic.length-1?t("See my feedback"):t("Next question")} ${icon('arrow')}</button></form>`;
    $('#check-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const selected = ordered[Number(new FormData(event.currentTarget).get('answer'))];
      score += Number(selected.correct);
      results.push({ selected:selected.text, correct:selected.correct, item, explanation:explanations[index] });
      index++;
      if (index < diagnostic.length) { renderQuestion(); $('#check-form input').focus(); return; }
      $('#diagnostic-body').innerHTML = `<h3 tabindex="-1" id="check-result" class="text-2xl font-bold">${t('{score} of {total} correct in this practice',{score,total:diagnostic.length})}</h3><p class="my-4 text-sm leading-7 text-muted">${t("Use the explanations below to choose what to review. This is not a level assessment or exam prediction.")}</p><div class="space-y-3">${results.map((r,i)=>`<details class="rounded-xl border border-line p-4"><summary class="cursor-pointer text-sm font-bold">${i+1}. ${r.correct?t("Correct"):t("Review")} · ${esc(t(r.item.cat))}</summary><p class="mt-3 text-sm leading-7" lang="en">${esc(r.item.q)}</p><p class="mt-2 text-sm">${t('Your answer:')} <span lang="en">${esc(r.selected)}</span></p><p class="mt-2 text-sm font-semibold">${t('Correct answer:')} <span lang="en">${esc(r.item.opts[r.item.ans])}</span></p><p class="mt-3 text-sm leading-7 text-muted">${esc(t(r.explanation))}</p></details>`).join('')}</div><button type="button" id="retake-check" class="mt-5 ${s.secondary}">${t("Try again")}</button>`;
      $('#retake-check').addEventListener('click', openDiagnostic);
      $('#check-result').focus();
    });
  };
  renderQuestion();
  openDialog('diagnostic');
};

export const initStudy = () => {
  let currentPlan = null;
  const renderPlan = (exam, hours) => {
    const rows = buildSchedule(exam, hours);
    currentPlan = { exam, hours, rows };
    $('#plan-output').innerHTML = `<h3 class="mb-4 text-lg font-bold">${t('{exam} · {hours} hours this week',{exam:t(exam),hours})}</h3><ol class="space-y-3">${rows.map((row)=>`<li class="rounded-xl border border-line bg-white p-4"><p class="mb-2 flex justify-between gap-4 text-xs font-bold"><span>${t(row.day)}</span><span>${row.minutes} ${t('min')}</span></p><p class="text-sm leading-6">${esc(t(row.task))}</p></li>`).join('')}</ol><p class="mt-4 text-xs leading-6 text-muted">${t("Sunday: rest or optional reflection. Suggested independent practice, not scheduled tutor sessions. Split longer sessions into shorter blocks.")}</p>`;
    $('#download-plan').hidden = false;
  };
  const savedPlan = storage.read('lbPlan:v2', null, (value) => value && Object.hasOwn(schedules,value.exam) && [4,8,14].includes(value.hours));
  if (savedPlan) { $('#plan-exam').value = savedPlan.exam; $('#plan-hours').value = String(savedPlan.hours); renderPlan(savedPlan.exam,savedPlan.hours); }
  const invalidatePlan = () => { currentPlan = null; $('#plan-output').innerHTML = ''; $('#download-plan').hidden = true; };
  $('#plan-exam').addEventListener('change', invalidatePlan);
  $('#plan-hours').addEventListener('change', invalidatePlan);
  $('#planner-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const exam = $('#plan-exam').value;
    const hours = Number($('#plan-hours').value);
    renderPlan(exam,hours);
    const saved = storage.write('lbPlan:v2',{exam,hours});
    if (!saved) $('#plan-output').insertAdjacentHTML('afterbegin',`<p class="mb-4 text-sm font-semibold">${t('Your plan is ready but could not be saved. Download a copy to keep it.')}</p>`);
  });
  $('#download-plan').addEventListener('click', () => {
    if (!currentPlan) return;
    downloadText(`lb-${currentPlan.exam.toLowerCase()}-study-plan.txt`, `L.B. ENGLISH CO. / ${t('{exam} / {hours} hours per week',{exam:t(currentPlan.exam),hours:currentPlan.hours})}\n\n${currentPlan.rows.map((r)=>`${t(r.day)} — ${r.minutes} ${t('minutes')}\n${t(r.task)}`).join('\n\n')}\n\n${t('Sunday: rest or optional reflection. Suggested independent practice; not booked lessons.')}`);
  });
  $('#brief-form').addEventListener('submit', (event) => {
    event.preventDefault();
    downloadText('lb-coaching-brief.txt', `L.B. ENGLISH CO. / ${t('COACHING BRIEF')}\n\n${t('Goal:')} ${t($('#brief-goal').value)}\n${t('Format:')} ${t($('#brief-format').value)}\n\n${$('#brief-notes').value.trim()}\n\n${t('Prepared on this device. No enquiry has been sent and no booking has been made.')}`);
    $('#brief-status').textContent = t("Your brief has been downloaded. No enquiry was sent and no session is booked.");
  });
  $('#finder-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const goal = $('#finder-goal').value;
    const routes = {IELTS:'ielts.html',SAT:'sat.html',YDT:'ydt-yds.html',Speaking:'speaking.html',General:'index.html#formats'};
    $('#finder-result').innerHTML = `<div class="rounded-xl bg-lime/40 p-5"><h3 class="text-xl font-semibold">${t('{goal} · your starting route',{goal:t(goal==='General'?'Personal English':goal)})}</h3><p class="my-4 text-sm leading-7">${t('Start with a short practice activity, then build a weekly plan. Your format preference: {format}. Discuss suitability with a tutor before booking.',{format:esc(t($('#finder-format').value))})}</p><a href="${route(routes[goal])}" class="${s.button}">${t("Explore my route")} ${icon('arrow')}</a></div>`;
  });
  document.addEventListener('click', (event) => {
    const lessonButton = event.target.closest('[data-lesson]');
    if (lessonButton) { openLesson(lessonButton.dataset.lesson); return; }
    const opener = event.target.closest('[data-open]');
    if (!opener) return;
    const {open, goal, format} = opener.dataset;
    if (open === 'diagnostic') { openDiagnostic(); return; }
    if (open === 'planner' && goal && Object.hasOwn(schedules,goal) && $('#plan-exam').value !== goal) { $('#plan-exam').value = goal; invalidatePlan(); }
    if (open === 'consultation') {
      if (goal) $('#brief-goal').value = goal;
      if (format) $('#brief-format').value = format;
      $('#brief-status').textContent = '';
    }
    openDialog(open);
  });
  renderProgress();
  window.addEventListener('storage', renderProgress);
};
