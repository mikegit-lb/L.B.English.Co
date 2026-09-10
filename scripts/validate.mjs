import { readFile, stat } from 'node:fs/promises';
import assert from 'node:assert/strict';
const pages=['index','international-exams','turkiye-exams','ielts','toefl','sat','ydt','yds','yokdil','resources','speaking','ydt-yds','legal'];
const localizedPages=pages.map((page)=>page+'-tr');
const sources=new Map();
for (const page of pages) sources.set(page+'.html',await readFile(page+'.html','utf8'));
for (const page of localizedPages) sources.set(page+'.html',await readFile(page+'.html','utf8'));
let checked=0;
for (const [file,html] of sources) {
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map((match)=>match[1]);
  assert.equal(ids.length,new Set(ids).size,`Duplicate IDs in ${file}`);
  assert.equal([...html.matchAll(/<h1\b/g)].length,1,`One main heading in ${file}`);
  assert.ok(!/<style\b|\sstyle=|<script>(?!<)/.test(html),`No inline implementation in ${file}`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const target=match[1].replaceAll('&amp;','&');
    if (/^(https?:|mailto:|tel:|data:)/.test(target)) continue;
    const url=new URL(target,'https://validation.invalid/'+file);
    const pathname=decodeURIComponent(url.pathname.slice(1));
    assert.ok((await stat(pathname)).isFile(),`Missing ${target} in ${file}`);
    if (url.hash && sources.has(pathname)) assert.ok(sources.get(pathname).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),`Missing anchor ${target} in ${file}`);
    checked++;
  }
  for (const match of html.matchAll(/\b(?:aria-controls|aria-labelledby|aria-describedby)="([^"]+)"/g)) {
    match[1].split(' ').forEach((id)=>assert.ok(ids.includes(id),`Missing ARIA target ${id} in ${file}`));
  }
}
assert.ok((await stat('assets/site.css')).size>1000);
console.log(`Validated ${pages.length+localizedPages.length} generated pages, ${checked} local links/assets, anchors and ARIA references.`);
