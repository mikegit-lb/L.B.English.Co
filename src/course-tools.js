import { t } from './i18n.js';
import { $, $$ } from './lib/dom.js';
import { calculateBand, createCountdown, formatTime } from './lib/core.js';
import { cueCards, topics, vocab } from './content.js';

export const mountTimer = (container) => {
  let initial = Number(container.dataset.duration);
  const clock = createCountdown(initial);
  let interval = null;
  const display = $('[data-timer-display]', container);
  const toggle = $('[data-timer-toggle]', container);
  const status = $('[data-timer-status]', container);
  const render = () => {
    const state = clock.read();
    display.textContent = formatTime(state.seconds);
    toggle.textContent = state.finished ? t("Start again") : state.running ? t("Pause") : state.seconds === initial ? t("Start") : t("Resume");
    if (state.finished) {
      clearInterval(interval); interval = null;
      status.textContent = t("Time complete. Reflect, reset or choose your next duration.");
    }
  };
  const handleToggle = () => {
    const state = clock.read();
    if (state.running) {
      clock.pause(); clearInterval(interval); interval = null; status.textContent = t("Paused.");
    } else {
      if (state.finished) clock.reset(initial);
      clock.start();
      interval = setInterval(render, 200);
      status.textContent = t("Practice in progress.");
    }
    render();
  };
  const handleReset = () => {
    clearInterval(interval); interval = null;
    clock.reset(initial); status.textContent = t("Ready when you are."); render();
  };
  toggle.addEventListener('click', handleToggle);
  $('[data-timer-reset]', container).addEventListener('click', handleReset);
  $('[data-timer-duration]', container).addEventListener('change', (event) => { initial = Number(event.target.value); handleReset(); });
  render();
  return { reset:handleReset, destroy:() => { clearInterval(interval); clock.pause(); } };
};

export const initCourseTools = () => {
  const timers = new Map($$('[data-timer]').map((node) => [node.dataset.timer, mountTimer(node)]));
  window.addEventListener('pagehide', () => timers.forEach((timer) => timer.destroy()));
  const bands = $$('[data-band]');
  if (bands.length) {
    const handleBand = () => {
      bands.forEach((input) => { $(`#value-${input.dataset.band}`).textContent = Number(input.value).toFixed(1); });
      $('#overall-band').textContent = calculateBand(bands.map((input) => Number(input.value))).toFixed(1);
    };
    bands.forEach((input) => input.addEventListener('input', handleBand));
    handleBand();
  }
  if ($('#new-cue')) {
    let index = 0;
    const renderCue = () => {
      const card = cueCards[index];
      $('#cue-category').textContent = `${t(card.category)} · ${index+1} / ${cueCards.length}`;
      $('#cue-topic').textContent = card.topic;
      $('#cue-points').replaceChildren(...card.points.map((text) => { const item=document.createElement('li'); item.textContent=text; return item; }));
    };
    $('#new-cue').addEventListener('click', () => { index=(index+1)%cueCards.length; renderCue(); timers.get('ielts')?.reset(); });
    renderCue();
  }
  if ($('#next-prompt')) {
    let index = 0;
    const renderPrompt = () => {
      const topic = topics[index];
      $('#prompt-category').textContent = `${t(topic.category)} · ${index+1} / ${topics.length}`;
      $('#prompt-title').textContent = topic.title;
      $('#prompt-description').textContent = topic.desc;
      $('#prompt-tags').replaceChildren(...topic.tags.map((text) => { const tag=document.createElement('span'); tag.className='rounded-full bg-paper px-3 py-2 text-xs font-semibold'; tag.textContent=text; return tag; }));
    };
    $('#next-prompt').addEventListener('click', () => { index=(index+1)%topics.length; renderPrompt(); timers.get('speaking')?.reset(); });
    renderPrompt();
  }
  if ($('#next-word')) {
    let index = 0;
    const renderWord = () => {
      const item = vocab[index];
      $('#vocab-type').textContent = item.type;
      $('#vocab-word').textContent = item.word;
      $('#vocab-meaning').textContent = item.meaning;
      $('#vocab-sample').textContent = item.sample;
      $('#vocab-count').textContent = `${index+1} / ${vocab.length} kelime`;
      $('#vocab-answer').hidden = true;
      $('#reveal-word').setAttribute('aria-expanded','false');
      $('#reveal-word').textContent = 'Anlamı göster';
    };
    $('#next-word').addEventListener('click', () => { index=(index+1)%vocab.length; renderWord(); });
    $('#reveal-word').addEventListener('click', () => {
      const show = $('#vocab-answer').hidden;
      $('#vocab-answer').hidden = !show;
      $('#reveal-word').setAttribute('aria-expanded',String(show));
      $('#reveal-word').textContent = show ? 'Anlamı gizle' : 'Anlamı göster';
    });
    renderWord();
    const handleNet = () => {
      const correct = Number($('#correct-count').value);
      const wrong = Number($('#wrong-count').value);
      const valid = [correct,wrong].every((value) => Number.isInteger(value) && value>=0 && value<=80) && correct+wrong<=80 && $('#correct-count').value!=='' && $('#wrong-count').value!=='';
      $('#net-error').textContent = valid ? '' : 'Doğru ve yanlış sayıları 0–80 arasında tam sayı olmalı; toplam 80’i aşmamalı.';
      $('#net-result').textContent = valid ? (correct-wrong/4).toFixed(2) : '—';
      $('#correct-count').setAttribute('aria-invalid',String(!valid));
      $('#wrong-count').setAttribute('aria-invalid',String(!valid));
    };
    ['#correct-count','#wrong-count'].forEach((id) => { $(id).setAttribute('aria-describedby','net-error'); $(id).addEventListener('input',handleNet); });
    handleNet();
  }
  if ($('#ydt-correct')) {
    const handleYdtNet = () => {
      const correct = Number($('#ydt-correct').value);
      const wrong = Number($('#ydt-wrong').value);
      const valid = [correct, wrong].every((value) => Number.isInteger(value) && value >= 0 && value <= 80) && correct + wrong <= 80 && $('#ydt-correct').value !== '' && $('#ydt-wrong').value !== '';
      $('#ydt-net-error').textContent = valid ? '' : 'Correct and incorrect answers must be whole numbers from 0 to 80, with a maximum total of 80.';
      $('#ydt-net-result').textContent = valid ? (correct - wrong / 4).toFixed(2) : '—';
      ['#ydt-correct','#ydt-wrong'].forEach((id) => { $(id).setAttribute('aria-invalid',String(!valid)); $(id).setAttribute('aria-describedby','ydt-net-error'); });
    };
    ['#ydt-correct','#ydt-wrong'].forEach((id) => $(id).addEventListener('input',handleYdtNet));
    handleYdtNet();
  }
};
