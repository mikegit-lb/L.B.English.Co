import { t } from './i18n.js';
import { styles as s } from './components.js';
import { $, storage, downloadText } from './lib/dom.js';
import { escapeHtml as esc } from './lib/core.js';

export const essayStructures = {
  opinion: {
    label:'Opinion: agree or disagree',
    prompt:'Some people think cities should make all public transport free. To what extent do you agree or disagree?',
    steps:['State how far you agree and introduce a reason.','Develop your strongest reason with an explanation and example.','Develop another reason or address a limitation of your position.','Restate your position consistently without adding a new argument.'],
  },
  discussion: {
    label:'Discuss both views and give an opinion',
    prompt:'Some people prefer working from home, while others think a shared workplace is better. Discuss both views and give your opinion.',
    steps:['Introduce the two views and indicate your position.','Explain why some people value working from home; develop their reasoning fairly.','Explain the case for shared workplaces and evaluate it against your position.','Bring the comparison together and state your own judgement.'],
  },
  problem: {
    label:'Causes and solutions',
    prompt:'Many cities experience heavy traffic congestion. What are the main causes, and what measures could address this problem?',
    steps:['Define the problem and signal the causes and responses you will address.','Explain one or two causes, showing how each contributes to congestion.','Connect practical measures to those specific causes; explain how they would help.','Summarise the main causes and the most useful responses.'],
  },
  advantages: {
    label:'Do the advantages outweigh the disadvantages?',
    prompt:'More universities now offer degree courses online. Do the advantages of this development outweigh the disadvantages?',
    steps:['Identify the development and state which side you find more significant.','Explain a meaningful disadvantage with a concrete consequence.','Develop the advantages and show why they do or do not outweigh that disadvantage.','Return to the same overall judgement and briefly summarise its basis.'],
  },
};

export const initEssay = () => {
  const selector=$('#essay-type');
  if (!selector) return;
  const render = () => {
    const structure=essayStructures[selector.value];
    $('#essay-prompt').textContent=structure.prompt;
    $('#essay-outline').innerHTML=structure.steps.map((step,index)=>`<div><label for="essay-part-${index}" class="text-sm font-semibold">${index+1}. ${esc(t(step))}</label><textarea id="essay-part-${index}" data-essay-part="${index}" rows="2" maxlength="3000" class="${s.input}" placeholder="${t('Your ideas, in your own words…')}"></textarea></div>`).join('');
    $('#essay-status').textContent=t("Your outline stays on this device. This tool does not grade essays.");
    [...$('#essay-outline').querySelectorAll('textarea')].forEach((input) => {
      const key=`lbEssay-${selector.value}-${input.dataset.essayPart}`;
      input.value=storage.text(key);
      input.addEventListener('input',()=>{ $('#essay-status').textContent=storage.writeText(key,input.value)?t("Outline saved on this device."):t("Could not save. Download your outline to keep it."); });
    });
  };
  selector.addEventListener('change',render);
  $('#download-essay').addEventListener('click',()=>{
    const structure=essayStructures[selector.value];
    const parts=structure.steps.map((step,index)=>`${index+1}. ${t(step)}\n${$('#essay-part-'+index).value}`).join('\n\n');
    downloadText('lb-ielts-essay-outline.txt',`L.B. ENGLISH CO. / ${t('ORIGINAL TASK 2 PRACTICE')}\n\n${structure.prompt}\n\n${parts}\n\n${t('This is an outline, not an assessed essay or an official IELTS task.')}`);
  });
  render();
};
