// One source of truth for exam routes, families, labels and page-level positioning.
export const exams = {
  IELTS: { id:'IELTS', slug:'ielts', family:'international', label:'IELTS', route:'ielts.html', color:'lime', title:'A stronger score starts with a stronger system.', description:'Turn IELTS reading, writing, listening and speaking into a confident weekly rhythm for Academic or General Training.', skills:'Listening · Reading · Writing · Speaking', tool:'Band calculator' },
  TOEFL: { id:'TOEFL', slug:'toefl', family:'international', label:'TOEFL iBT', route:'toefl.html', color:'peach', title:'Prepare for the English universities actually use.', description:'Build clear, confident responses for the current TOEFL iBT, starting with high-value reading and email practice.', skills:'Reading · Listening · Speaking · Writing', tool:'Current-format starters' },
  SAT: { id:'SAT', slug:'sat', family:'international', label:'SAT', route:'sat.html', color:'lilac', title:'Read sharper. Decide faster. Earn your edge.', description:'Train Digital SAT Reading & Writing with an evidence-first method for language, pacing and better decisions.', skills:'Information & Ideas · Craft & Structure · Expression · Standard English', tool:'Pacing practice' },
  YDT: { id:'YDT', slug:'ydt', family:'turkiye', label:'YDT', route:'ydt.html', color:'lilac', title:'Turn YDT questions into points you can defend.', description:'Build the vocabulary, sentence logic and reading decisions that make English YDT practice count.', skills:'Vocabulary · Grammar · Reading · Meaning', tool:'Net calculator' },
  YDS: { id:'YDS', slug:'yds', family:'turkiye', label:'YDS', route:'yds.html', color:'peach', title:'Make every YDS answer earn its place.', description:'Strengthen vocabulary, grammar, translation and reading with a method built for academic and public-service requirements.', skills:'Vocabulary · Grammar · Translation · Reading', tool:'Error analysis' },
  YOKDIL: { id:'YOKDIL', slug:'yokdil', family:'turkiye', label:'YÖKDİL', route:'yokdil.html', color:'lime', title:'Academic English, tuned to your field.', description:'Build field-aware reading and language control for YÖKDİL Fen, Sağlık and Sosyal Bilimleri preparation.', skills:'Vocabulary · Grammar · Translation · Reading', tool:'Field-aware reading' },
};

export const examIds = Object.keys(exams);
export const familyMeta = {
  international: { label:'International exams', route:'international-exams.html', color:'lime', intro:'Choose the right international exam, then turn preparation into a repeatable advantage.' },
  turkiye: { label:'Türkiye exams', route:'turkiye-exams.html', color:'lilac', intro:'Three exams. Three purposes. One clearer way to prepare for the requirement in front of you.' },
};
export const familyExamIds = (family) => examIds.filter((id) => exams[id].family === family);
export const examForSlug = (slug) => examIds.find((id) => exams[id].slug === slug);
export const examDisplay = (id) => exams[id]?.label || id;
