import { styles as s, icon, link, button, eyebrow } from '../ui.js';

const courseCard = (exam, title, copy, bullets, color, href) => `<article class="group flex flex-col rounded-[1.75rem] border border-line ${color} p-7 sm:p-9">
  <div class="mb-8 flex items-center justify-between"><span class="rounded-full border border-ink/25 px-4 py-1.5 text-xs font-bold tracking-widest">${exam}</span><span class="text-xs font-medium">LIVE ONLINE · PERSONAL COACHING</span></div>
  <h3 class="max-w-sm text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">${title}</h3><p class="mt-4 max-w-md text-sm leading-7 text-muted">${copy}</p>
  <ul class="my-7 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold">${bullets.map((text) => `<li class="flex items-center gap-2">${icon('check','h-4 w-4')}${text}</li>`).join('')}</ul>
  <a href="${href}" class="mt-auto flex min-h-12 items-center justify-between border-t border-ink/20 pt-5 text-sm font-bold">Explore ${exam} lessons <span class="grid h-10 w-10 place-items-center rounded-full bg-ink text-white transition-transform motion-safe:group-hover:rotate-[-35deg]">${icon('arrow')}</span></a>
</article>`;

export const home = () => ({
  page: 'index', title: 'IELTS & SAT coaching for your next chapter',
  description: 'Personal IELTS and SAT Reading & Writing coaching. Try original mini-lessons, build your study plan, and learn in private or small-group classes.',
  body: `
  <section id="top" class="${s.wrap} grid items-center gap-12 pb-14 pt-12 sm:pt-16 lg:grid-cols-[1.12fr_1fr] lg:gap-14 lg:pb-20">
    <div>
      <p class="${s.eyebrow} mb-6 flex items-center gap-2.5 text-muted"><span class="h-2 w-2 rounded-full bg-ink"></span>Big ambitions. Personal attention.</p>
      <h1 class="max-w-xl text-[clamp(3.15rem,5.6vw,5.1rem)] font-semibold leading-[1.06] tracking-[-0.065em]">Your next<br>chapter starts<br>with <span class="relative inline-block">better English.<span class="absolute -bottom-2 left-0 -z-10 h-5 w-full -rotate-2 rounded-sm bg-lime"></span></span></h1>
      <p class="mt-7 max-w-lg text-base leading-8 text-muted">An IELTS goal. A university ambition. A more confident you. Get focused teaching and a clear route from where you are to where you want to be.</p>
      <div class="mt-8 flex flex-wrap gap-3">${link('Explore IELTS', 'ielts.html')}${link('Explore SAT', 'sat.html', true)}</div>
      <div class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold text-muted"><span class="flex items-center gap-2">${icon('check','h-4 w-4')}Private 1:1 &amp; groups of 3–5</span><span class="flex items-center gap-2">${icon('check','h-4 w-4')}Online, around your life</span></div>
    </div>
    <div class="relative min-w-0 rounded-[2rem] bg-[#e6e9dc] p-4 pb-5 sm:p-5">
      <div class="mb-4 flex items-center justify-between px-1"><span class="text-xs font-bold tracking-wider">THE L.B. LEARNING STUDIO</span><span class="flex items-center gap-2 text-[11px] font-medium"><span class="h-1.5 w-1.5 rounded-full bg-ink"></span>One goal. Your pace.</span></div>
      <div class="relative overflow-hidden rounded-[1.2rem]"><img src="assets/hero-coaching.jpg" alt="An online English coaching conversation" width="1536" height="1024" fetchpriority="high" class="h-72 w-full object-cover object-[35%_center] sm:h-[22rem]">
        <div class="absolute bottom-4 left-4 rounded-2xl bg-paper/95 px-4 py-3 shadow-sm"><p class="text-[10px] font-bold uppercase tracking-widest text-muted">More than a test score</p><p class="mt-1 text-sm font-bold">English you take with you. ${icon('diagonal','ml-2 inline h-4 w-4')}</p></div>
      </div>
      <div class="mt-4 rounded-xl bg-white p-4">
        <div class="mb-3 flex items-center justify-between"><p class="text-xs font-bold text-muted">A FIRST STEP, ON US</p><div class="flex gap-1" aria-label="Choose a lesson preview"><button type="button" data-hero="IELTS" aria-pressed="true" class="min-h-9 rounded-full px-3 text-xs font-bold aria-pressed:bg-lime">IELTS</button><button type="button" data-hero="SAT" aria-pressed="false" class="min-h-9 rounded-full px-3 text-xs font-bold aria-pressed:bg-lime">SAT</button></div></div>
        <a id="hero-lesson-link" href="ielts.html#lessons" class="flex min-h-12 items-center justify-between gap-4"><span><strong id="hero-lesson-title" class="block text-sm">Make your position unmistakable</strong><span id="hero-lesson-meta" class="mt-1 block text-xs text-muted">Writing · 8-minute mini-lesson</span></span><span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-lime">${icon('play')}</span></a>
      </div>
    </div>
  </section>
  <div class="border-y border-line"><div class="${s.wrap} grid grid-cols-2 gap-5 py-6 text-xs font-semibold text-muted md:grid-cols-4"><span>01 <span class="ml-3 text-ink">Know your starting point</span></span><span>02 <span class="ml-3 text-ink">Learn with a purpose</span></span><span>03 <span class="ml-3 text-ink">Practise with feedback</span></span><span>04 <span class="ml-3 text-ink">Build your next step</span></span></div></div>
  <section id="programmes" class="${s.wrap} py-20 sm:py-24">
    <div class="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div>${eyebrow('Two ambitions. One thoughtful approach.')}<h2 class="${s.heading}">Where do you want to go?</h2></div><button type="button" data-open="finder" class="flex min-h-11 items-center gap-2 text-sm font-bold underline underline-offset-4">Help me choose ${icon('arrow')}</button></div>
    <div class="grid gap-5 md:grid-cols-2">
      ${courseCard('IELTS', 'Make your next band<br>your next beginning.', 'Build control across reading, writing, listening and speaking. Learn the task, apply the strategy, and understand your next improvement.', ['All four skills', 'Academic & General routes', '4 free mini-lessons'], 'bg-lime/50', 'ielts.html')}
      ${courseCard('SAT', 'Think clearly.<br>Choose confidently.', 'Bring evidence, language and timing together in Digital SAT Reading & Writing. Turn uncertain guesses into decisions you can explain.', ['Reading & Writing', 'Evidence-led practice', '4 free mini-lessons'], 'bg-lilac/70', 'sat.html')}
    </div>
    <details class="mt-7 rounded-2xl border border-line bg-white p-5 sm:p-6"><summary class="cursor-pointer text-sm font-semibold">A different goal? Explore more ways to learn</summary><div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <a class="rounded-xl bg-paper p-5" href="ydt-yds.html"><strong class="text-sm">YDT · YDS · YÖKDİL ↗</strong><p class="mt-2 text-xs leading-6 text-muted">Vocabulary, close reading and exam strategy.</p></a>
      <a class="rounded-xl bg-paper p-5" href="speaking.html"><strong class="text-sm">Speaking studio ↗</strong><p class="mt-2 text-xs leading-6 text-muted">Live practice for everyday and professional life.</p></a>
      <button type="button" data-open="consultation" data-goal="TOEFL" class="rounded-xl bg-paper p-5 text-left"><strong class="text-sm">TOEFL coaching ↗</strong><span class="mt-2 block text-xs leading-6 text-muted">Prepare a brief for an individual study route.</span></button>
      <button type="button" data-open="consultation" data-goal="Business English" class="rounded-xl bg-paper p-5 text-left"><strong class="text-sm">Business &amp; CEFR English ↗</strong><span class="mt-2 block text-xs leading-6 text-muted">Build language around the situations that matter.</span></button>
    </div></details>
  </section>
  <section class="bg-white" id="how-it-works"><div class="${s.wrap} grid gap-12 py-20 lg:grid-cols-[0.8fr_1.4fr]">
    <div>${eyebrow('A better way to make progress')}<h2 class="${s.heading}">Less guesswork.<br>More direction.</h2><p class="mt-5 text-sm leading-7 text-muted">A clear learning cycle makes every lesson and every hour between lessons count.</p>${button('Find my starting point','data-open="finder"',true)}</div>
    <div class="grid gap-8 sm:grid-cols-3">${[['01','Find the real gap','Look at your current work, your goal and the time you have. Decide what deserves attention first.'],['02','Learn. Try. Refine.','Work through a strategy, try it in a new task and use specific feedback to improve.'],['03','Take it further','Carry one improvement into the next task. Use a manageable study plan to keep going.']].map(([n,t,d])=>`<div><span class="mb-7 grid h-12 w-12 place-items-center rounded-full border border-line text-sm">${n}</span><h3 class="text-lg font-bold tracking-tight">${t}</h3><p class="mt-3 text-sm leading-7 text-muted">${d}</p></div>`).join('')}</div>
  </div></section>
  <section id="formats" class="${s.wrap} py-20 sm:py-24">
    ${eyebrow('Your learning, your way')}<h2 class="${s.heading}">Personal doesn’t mean one-size-fits-all.</h2>
    <div class="mt-10 grid gap-4 md:grid-cols-3">${[['Private 1:1','A room for your goals.','A flexible pace, individual feedback and focused attention on your next useful improvement.'],['VIP group of 3–5','Small group. Shared momentum.','Level-matched practice with room to speak, ask questions and learn from each other.'],['Exam consultancy','A clearer route forward.','A focused review of your approach, priorities and study plan for independent preparation.']].map(([t,tag,d],i)=>`<article class="flex flex-col rounded-2xl border border-line p-7"><span class="text-xs font-semibold text-muted">0${i+1} / ${t.toUpperCase()}</span><h3 class="mt-5 text-xl font-bold tracking-tight">${tag}</h3><p class="mb-6 mt-4 text-sm leading-7 text-muted">${d}</p><button type="button" data-open="consultation" data-format="${t}" class="mt-auto flex min-h-11 items-center justify-between text-sm font-bold">Prepare a coaching brief ${icon('arrow')}</button></article>`).join('')}</div>
  </section>
  <section id="resources" class="${s.wrap} pb-20">
    <div class="grid gap-10 rounded-[2rem] bg-ink p-7 text-white sm:p-12 lg:grid-cols-[1fr_1fr]"><div><p class="${s.eyebrow} mb-5 text-lime">Good practice starts here</p><h2 class="${s.heading}">A small toolkit.<br>A stronger study habit.</h2><p class="my-6 max-w-sm text-sm leading-7 text-white/70">Free checklists, editable notes and practical tools. Save your progress and pick up where you left off.</p><a href="resources.html" class="inline-flex min-h-12 items-center gap-3 rounded-full bg-lime px-6 py-3 text-sm font-bold text-ink">Open the free library ${icon('arrow')}</a></div>
    <div class="grid content-center gap-3">${[['IELTS','Writing self-check','ielts-check'],['SAT','Reading & Writing pacing map','sat-pacing'],['YOUR WEEK','A study plan you can stick to','planner']].map(([a,b,id])=>`<${id==='planner'?'button type="button" data-open="planner"':'a href="resources.html?resource='+id+'"'} class="flex min-h-24 items-center justify-between gap-4 rounded-xl border border-white/25 px-5 py-4 text-left hover:bg-white/5"><span><span class="text-[10px] font-bold tracking-widest text-lime">${a}</span><strong class="mt-2 block text-sm">${b}</strong></span>${icon('diagonal')}</${id==='planner'?'button':'a'}>`).join('')}</div></div>
  </section>
  <section id="faq" class="${s.wrap} grid gap-10 pb-24 md:grid-cols-[0.8fr_1.2fr]"><div>${eyebrow('Before you begin')}<h2 class="${s.heading}">Good questions.<br>Clear answers.</h2></div><div>${[
    ['How do I choose between IELTS and SAT?','Choose based on the requirements of your target institution or purpose. IELTS assesses English proficiency; the SAT serves a different admissions purpose. Check the exact requirements directly before choosing a course.'],
    ['Can I try a lesson first?','Yes. Each IELTS and SAT page includes four original mini-lessons with explanations and practice. They are free to use, and completion stays in this browser.'],
    ['Does SAT coaching include Math?','The SAT course on this site covers Reading & Writing only. It does not include SAT Math.'],
    ['How does online coaching work?','The formats offered are private 1:1, VIP groups of 3–5, and exam consultancy. Prepare a coaching brief with your goals and preferences. Session availability, pricing and a booking channel are not connected on this site yet.'],
    ['Will these tools predict my official score?','No. Mini-lessons and the language check give feedback on the practice you complete. The IELTS calculator only rounds the four scores you enter. No tool here guarantees an exam result.'],
  ].map(([q,a])=>`<details class="border-b border-line py-5"><summary class="cursor-pointer pr-5 text-sm font-bold leading-6">${q}</summary><p class="mt-4 pr-4 text-sm leading-7 text-muted">${a}</p></details>`).join('')}</div></section>`
});
