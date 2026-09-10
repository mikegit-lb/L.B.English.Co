import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { examIds, exams } from '../src/exams.js';
const examSlugs = examIds.map((id) => exams[id].slug);

const base=process.env.BASE_URL || 'http://127.0.0.1:8765';
const browser=await chromium.launch({channel:'chrome',headless:true});
await mkdir('artifacts',{recursive:true});
const report={pages:[],workflows:[],errors:[]};
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const page=await context.newPage();
page.on('pageerror',(error)=>report.errors.push(error.message));
page.on('console',(message)=>{if(message.type()==='error')report.errors.push(message.text());});
page.on('response',(response)=>{if(response.status()>=400)report.errors.push(response.url()+' '+response.status());});
const closeDialog=async()=>{await page.locator('dialog[open] [data-close]').click();};
try {
  for (const viewport of [{width:1440,height:1000},{width:390,height:844},{width:320,height:740}]) {
    await page.setViewportSize(viewport);
    for (const name of ['index','international-exams','turkiye-exams',...examSlugs,'resources','speaking','ydt-yds','legal']) {
      await page.goto(base+'/'+name+'.html');
      await page.waitForLoadState('networkidle');
      const metrics=await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth}));
      assert.equal(metrics.width,viewport.width);
      assert.equal(metrics.overflow,false,`Overflow ${name} ${viewport.width}`);
      const a11y=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      report.pages.push({name,viewport,a11y:a11y.violations.map((v)=>({id:v.id,impact:v.impact,nodes:v.nodes.map((n)=>n.target)}))});
      if (viewport.width===1440) await page.screenshot({path:'artifacts/'+name+'-desktop.png',fullPage:true});
      if (viewport.width===390 && ['index','ielts','sat','resources'].includes(name)) await page.screenshot({path:'artifacts/'+name+'-mobile.png',fullPage:true});
    }
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto(base+'/index.html');
  await page.locator('#menu-button').click();
  await page.locator('#mobile-nav').getByRole('link',{name:'International exams',exact:true}).click();
  await page.getByRole('link',{name:/Open SAT route/}).click();
  assert.ok(page.url().endsWith('sat.html'));
  await page.locator('[data-lesson]').first().click();
  await page.locator('#lesson-form input[value="2"]').check();
  await page.locator('#lesson-form button[type="submit"]').click();
  await page.locator('#lesson-note').fill('Evidence matters more than an attractive guess.');
  await page.locator('#complete-lesson').click();
  await page.keyboard.press('Escape');
  await page.reload();
  assert.match(await page.locator('#course-progress').textContent(),/1 of 4/);
  await page.locator('[data-lesson]').first().click();
  const dialogAxe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  report.pages.push({name:'lesson dialog',viewport:{width:390},a11y:dialogAxe.violations.map((v)=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))});
  await page.keyboard.press('Shift+Tab');
  assert.equal(await page.evaluate(()=>!!document.activeElement.closest('dialog[open]')),true);
  await closeDialog();
  report.workflows.push('Mobile navigation, SAT lesson feedback, reflection persistence, completion and dialog focus');

  await page.locator('[data-open="planner"][data-goal="SAT"]').click();
  await page.locator('#plan-hours').selectOption('4');
  await page.locator('#planner-form button').click();
  assert.match(await page.locator('#plan-output').textContent(),/SAT · 4 hours/);
  assert.equal(await page.locator('#plan-output li').count(),6);
  assert.match(await page.locator('#plan-output li').first().textContent(),/40 min/);
  const downloadPlan=page.waitForEvent('download');
  await page.locator('#download-plan').click();
  assert.match((await downloadPlan).suggestedFilename(),/sat-study-plan/);
  await page.locator('#plan-hours').selectOption('8');
  assert.equal(await page.locator('#download-plan').isVisible(),false);
  await page.locator('#planner-form button').click();
  assert.match(await page.locator('#plan-output li').first().textContent(),/80 min/);
  await closeDialog();
  report.workflows.push('SAT planner time allocation, changed-input invalidation and download');

  await page.goto(base+'/resources.html?exam=SAT');
  await page.waitForLoadState('networkidle');
  assert.match(await page.locator('#resource-count').textContent(),/^2 /);
  await page.locator('[data-save="sat-pacing"]').click();
  await page.locator('[data-filter="Saved"]').click();
  assert.match(await page.locator('#resource-count').textContent(),/^1 /);
  await page.locator('#resource-search').fill('notfoundxyz');
  assert.equal(await page.locator('#resource-empty').isVisible(),true);
  await page.locator('#clear-filters').click();
  assert.match(await page.locator('#resource-count').textContent(),/^9 /);
  await page.locator('[data-resource="ielts-check"]').click();
  assert.equal(await page.locator('[data-resource-check]').count(),12);
  await page.locator('[data-resource-check="0"]').check();
  await page.locator('#resource-notes').fill('<script>alert("safe")</script> — my note');
  const resourceDownload=page.waitForEvent('download');
  await page.locator('#download-resource').click();
  await (await resourceDownload).saveAs('artifacts/resource-notes.txt');
  await page.emulateMedia({media:'print'});
  await page.pdf({path:'artifacts/resource-print.pdf',format:'A4',printBackground:true});
  await page.emulateMedia({media:'screen'});
  await closeDialog();
  await page.reload();
  await page.locator('[data-resource="ielts-check"]').click();
  assert.equal(await page.locator('[data-resource-check="0"]').isChecked(),true);
  assert.match(await page.locator('#resource-notes').inputValue(),/my note/);
  await closeDialog();
  report.workflows.push('Library filters, save/remove state, empty recovery, 12 checks, persistent notes, text download and print PDF');

  await page.goto(base+'/resources-tr.html?exam=Speaking');
  await page.waitForLoadState('networkidle');
  assert.match(await page.locator('#resource-count').textContent(),/1/);
  const visibleSave = page.locator('[data-resource-card]:not([hidden]) [data-save]').first();
  assert.match(await visibleSave.getAttribute('aria-label'),/kaydet/i);
  await visibleSave.click();
  assert.match(await visibleSave.getAttribute('aria-label'),/kayıtlardan/i);
  report.workflows.push('Turkish Speaking resource filter uses stable source tags');

  await page.goto(base+'/ydt.html');
  await page.locator('#ydt-correct').fill('72');
  await page.locator('#ydt-wrong').fill('8');
  assert.equal(await page.locator('#ydt-net-result').textContent(),'70.00');
  await page.goto(base+'/ydt-tr.html');
  await page.locator('#ydt-correct').fill('81');
  assert.match(await page.locator('#ydt-net-error').textContent(),/Doğru ve yanlış/);
  report.workflows.push('YDT-only practice net calculation');

  await page.goto(base+'/ielts.html');
  for (const name of ['listening','reading','writing','speaking']) await page.locator('#band-'+name).fill('6');
  await page.locator('#band-speaking').fill('7');
  assert.equal(await page.locator('#overall-band').textContent(),'6.5');
  await page.locator('[data-timer-toggle]').click();
  await page.waitForTimeout(1200);
  assert.notEqual(await page.locator('[data-timer-display]').textContent(),'01:00');
  await page.locator('#new-cue').click();
  assert.equal(await page.locator('[data-timer-display]').textContent(),'01:00');
  report.workflows.push('IELTS band calculation and cue-card timer reset');
  await page.locator('#essay-part-0').fill('My first position and a clear reason.');
  await page.locator('#essay-type').selectOption('problem');
  await page.locator('#essay-part-0').fill('A specific cause of traffic congestion.');
  await page.locator('#essay-type').selectOption('opinion');
  assert.match(await page.locator('#essay-part-0').inputValue(),/My first position/);
  const essayDownload=page.waitForEvent('download');
  await page.locator('#download-essay').click();
  assert.match((await essayDownload).suggestedFilename(),/essay-outline/);
  report.workflows.push('Essay planner variants, independent saved outlines and download');

  await page.goto(base+'/speaking.html');
  const original=await page.locator('#prompt-title').textContent();
  await page.locator('#next-prompt').click();
  assert.notEqual(await page.locator('#prompt-title').textContent(),original);
  await page.goto(base+'/ydt-yds.html');
  await page.locator('#reveal-word').click();
  assert.equal(await page.locator('#vocab-answer').isVisible(),true);
  await page.locator('#next-word').click();
  assert.equal(await page.locator('#vocab-answer').isVisible(),false);
  await page.locator('#wrong-count').fill('80');
  assert.equal(await page.locator('#net-result').textContent(),'—');
  report.workflows.push('Speaking prompt rotation, Turkish flashcards and invalid net input');

  await page.goto(base+'/index.html');
  await page.locator('footer [data-open="diagnostic"]').click();
  for (let i=0;i<8;i++) {
    await page.locator('#check-form input').first().check();
    await page.locator('#check-form button').click();
  }
  assert.match(await page.locator('#check-result').textContent(),/of 8 correct/);
  await closeDialog();
  await page.locator('#formats [data-open="consultation"]').first().click();
  await page.locator('#brief-notes').fill('IELTS preparation over the next twelve weeks.');
  const briefDownload=page.waitForEvent('download');
  await page.locator('#brief-form button').click();
  await briefDownload;
  assert.match(await page.locator('#brief-status').textContent(),/No enquiry was sent/);
  await closeDialog();
  await page.getByRole('button',{name:'Help me choose',exact:true}).first().click();
  await page.locator('#finder-goal').selectOption('SAT');
  await page.locator('#finder-form button').click();
  assert.equal(await page.locator('#finder-result a').getAttribute('href'),'sat.html');
  await closeDialog();
  report.workflows.push('Eight-question feedback, honest coaching brief download and programme routing');

  await page.evaluate(()=>{localStorage.setItem('lbFreeSaved','{broken');localStorage.setItem('lbLessons:v2','{}');localStorage.setItem('lbPlan:v2','null');});
  await page.goto(base+'/resources.html');
  await page.locator('[data-resource="sat-pacing"]').click();
  assert.equal(await page.locator('#resource-dialog').isVisible(),true);
  await closeDialog();
  const blocked=await browser.newContext({viewport:{width:390,height:844}});
  await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('Storage blocked for test');}}));
  const blockedPage=await blocked.newPage();
  blockedPage.on('pageerror',(error)=>report.errors.push(error.message));
  await blockedPage.goto(base+'/ielts.html');
  await blockedPage.locator('[data-lesson]').first().click();
  await blockedPage.locator('#lesson-form input').first().check();
  await blockedPage.locator('#lesson-form button').click();
  await blockedPage.locator('#complete-lesson').click();
  assert.match(await blockedPage.locator('#lesson-save-status').textContent(),/could not be saved/);
  await blocked.close();
  report.workflows.push('Malformed and unavailable storage recovery');

  for (const viewport of [{width:1440,height:1000},{width:390,height:844}]) {
    await page.setViewportSize(viewport);
    for (const name of ['index','international-exams','turkiye-exams',...examSlugs,'resources','speaking','ydt-yds','legal']) {
      await page.goto(base+'/'+name+'-tr.html');
      await page.waitForLoadState('networkidle');
      assert.equal(await page.locator('html').getAttribute('lang'),'tr');
      assert.equal(await page.locator('body').getAttribute('data-locale'),'tr');
      assert.equal(await page.locator('h1').count() > 0,true,`Missing Turkish heading ${name}`);
      const activeLocales=await page.locator('a[data-locale="tr"][aria-current]').evaluateAll((links)=>links.map((link)=>link.getAttribute('aria-current')));
      assert.ok(activeLocales.length >= 1 && activeLocales.every((value)=>value==='true'),`Turkish locale selector is not active on ${name}`);
      const metrics=await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth}));
      assert.equal(metrics.width,viewport.width);
      assert.equal(metrics.overflow,false,`Turkish overflow ${name} ${viewport.width}`);
      const a11y=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      report.pages.push({name:name+'-tr',viewport,a11y:a11y.violations.map((v)=>({id:v.id,impact:v.impact,nodes:v.nodes.map((n)=>n.target)}))});
    }
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto(base+'/index-tr.html');
  await page.locator('#menu-button').click();
  await page.locator('#mobile-nav [data-locale="en"]').click();
  assert.ok(page.url().endsWith('index.html'));
  await page.goto(base+'/sat-tr.html');
  await page.locator('[data-lesson]').first().click();
  await page.locator('#lesson-form input').first().check();
  await page.locator('#lesson-form button[type="submit"]').click();
  assert.match(await page.locator('#lesson-feedback h3').first().textContent(),/Doğru|Fark/);
  await page.locator('#complete-lesson').click();
  await page.keyboard.press('Escape');
  await page.locator('[data-open="planner"][data-goal="SAT"]').click();
  await page.locator('#plan-hours').selectOption('4');
  await page.locator('#planner-form button').click();
  assert.match(await page.locator('#plan-output h3').textContent(),/SAT · bu hafta 4 saat/);
  assert.match(await page.locator('#plan-output').textContent(),/dk/);
  await closeDialog();
  await page.goto(base+'/resources-tr.html?exam=SAT');
  await page.waitForLoadState('networkidle');
  assert.match(await page.locator('#resource-count').textContent(),/^2 ücretsiz kaynak gösteriliyor$/);
  await page.locator('[data-resource="sat-pacing"]').click();
  assert.match(await page.locator('#resource-dialog h2').textContent(),/Dijital SAT/);
  await closeDialog();
  report.workflows.push('Turkish locale switching, translated mini-lesson feedback, planner and resource library');
  const violations=report.pages.flatMap((item)=>item.a11y.map(v=>({page:item.name,width:item.viewport.width,...v})));
  console.log(JSON.stringify({workflows:report.workflows,violations,errors:report.errors},null,2));
  assert.equal(report.errors.length,0,'No console, network or runtime errors');
  assert.equal(violations.length,0,'No detected WCAG A/AA violations');
} finally {
  await writeFile('artifacts/browser-report.json',JSON.stringify(report,null,2));
  await browser.close();
}
