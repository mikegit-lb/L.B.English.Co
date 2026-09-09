import { readFile, writeFile, copyFile } from 'node:fs/promises';
import { layout } from '../src/ui.js';
import { home } from '../src/pages/home.mjs';
import { course } from '../src/pages/courses.mjs';
import { library } from '../src/pages/library.mjs';
import { speaking, national, legal } from '../src/pages/supporting.mjs';
import { localizePage } from './localize.mjs';

// Output is directly deployable static HTML; no client rendering is needed for navigation.
const pages = [home(), course('IELTS'), course('SAT'), library(), speaking(), national(), legal()];
for (const page of pages) {
  const html = layout(page);
  await writeFile(`${page.page}.html`, html);
  await writeFile(`${page.page}-tr.html`, localizePage(html, page.page, 'tr'));
}
for (const weight of [400, 600, 700, 800]) {
  const file = `manrope-latin-${weight}-normal.woff2`;
  await copyFile(`node_modules/@fontsource/manrope/files/${file}`, `assets/${file}`);
}
// Keep build metadata useful without nondeterministic timestamps.
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
console.log(`Built ${pages.length * 2} localized static pages · L.B. English Co. ${pkg.version}`);
