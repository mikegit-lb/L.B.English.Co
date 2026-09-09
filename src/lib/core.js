/** @param {unknown} value @returns {string} */
export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

/** Safe storage keeps tools usable with blocked storage or malformed older data. */
export const createStorage = (provider) => ({
  read: (key, fallback, validate = () => true) => {
    try {
      const raw = provider().getItem(key);
      if (raw === null) return fallback;
      const value = JSON.parse(raw);
      return validate(value) ? value : fallback;
    } catch { return fallback; }
  },
  write: (key, value) => {
    try { provider().setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }
  },
  text: (key) => {
    try { return provider().getItem(key) || ''; } catch { return ''; }
  },
  writeText: (key, value) => {
    try { provider().setItem(key, value); return true; } catch { return false; }
  },
});

/** @param {number[]} scores */
export const calculateBand = (scores) => {
  if (scores.length !== 4 || scores.some((score) => !Number.isFinite(score) || score < 0 || score > 9)) throw new RangeError('Enter four scores between 0 and 9.');
  return Math.round((scores.reduce((sum, score) => sum + score, 0) / 4) * 2) / 2;
};

export const schedules = {
  IELTS: ['Plan a Task 2 argument and write one developed paragraph', 'Read a passage and justify each answer with evidence', 'Prepare a cue card, speak for two minutes, then reflect', 'Compare the key features of an Academic Task 1 visual, or plan a General Training letter', 'Listen to a short recording twice and review missed details', 'Revisit this week’s errors and repeat one difficult task'],
  SAT: ['Read short texts and support an inference with precise evidence', 'Use context to decide what a word means in a passage', 'Practise independent clauses and punctuation decisions', 'Choose transitions by naming the logical relationship', 'Complete a timed Reading & Writing practice set', 'Classify errors and retry missed questions without the answer key'],
  YDT: ['Bağlaçları anlam ilişkisine göre çalış', 'Kelime hatalarını bağlamıyla kaydet', 'Cümle tamamlama sorularında referansları izle', 'Paragraflarda ana fikir ve çıkarımı ayır', 'Süreli bir soru seti çöz', 'Haftanın hatalarını yeniden çöz'],
  YDS: ['Akademik cümlelerde ana yüklemi bul', 'Kelime ve eşdizim hatalarını incele', 'Paragrafta çıkarım sınırlarını kontrol et', 'Yakın anlamlı cümlelerin kapsamını karşılaştır', 'Süreli bir soru seti çöz', 'Hata defterini tekrar et'],
  Speaking: ['Describe a familiar place aloud', 'Retell an event using clear time markers', 'Give an opinion and support it with two reasons', 'Compare two approaches to a familiar problem', 'Rehearse a real meeting or interview answer', 'Repeat a previous prompt and reflect on one change'],
  General: ['Notice a useful grammar pattern in a short text', 'Retrieve new vocabulary in original sentences', 'Speak about an everyday topic', 'Read and listen for the same theme', 'Write a short reflection', 'Use this week’s language in a real situation'],
};

/** Exact minute allocation, including a weekly review; never invents booked lessons. */
export const buildSchedule = (exam, hours) => {
  if (!Object.hasOwn(schedules, exam) || ![4, 8, 14].includes(Number(hours))) throw new RangeError('Choose a supported goal and weekly study time.');
  const minutes = Number(hours) * 60;
  return schedules[exam].map((task, index) => ({ day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][index], task, minutes: Math.floor(minutes / 6) + Number(index < minutes % 6) }));
};

export const formatTime = (seconds) => `${Math.floor(Math.max(0, seconds) / 60).toString().padStart(2, '0')}:${Math.max(0, seconds % 60).toString().padStart(2, '0')}`;

/** Deadline-based countdown avoids drift when a browser tab is inactive. */
export const createCountdown = (duration, now = Date.now) => {
  let remaining = duration * 1000;
  let deadline = null;
  return {
    start: () => { if (deadline !== null || remaining <= 0) return; deadline = now() + remaining; },
    pause: () => { if (deadline === null) return; remaining = Math.max(0, deadline - now()); deadline = null; },
    reset: (seconds = duration) => { remaining = seconds * 1000; deadline = null; },
    read: () => {
      const milliseconds = deadline === null ? remaining : Math.max(0, deadline - now());
      if (milliseconds === 0) { remaining = 0; deadline = null; }
      return { seconds: Math.ceil(milliseconds / 1000), running: deadline !== null, finished: milliseconds === 0 };
    },
  };
};
