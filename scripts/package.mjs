import { mkdir, copyFile, writeFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

// Copy the public surface only. Tooling, node_modules and reports stay outside it.
// Files are overwritten individually; this script never recursively deletes a directory.
const target=path.resolve('dist');
const root=process.cwd();
if (!target.startsWith(root+path.sep)) throw new Error('Build output must remain inside this workspace.');
const pages=['index','ielts','sat','resources','speaking','ydt-yds','legal'];
const localizedPages=pages.map(name=>`${name}-tr`);
const files=[
  ...[...pages,...localizedPages].map(name=>name+'.html'),
  'assets/site.css','assets/hero-coaching.jpg','assets/lb-english-co-mark.svg',
  ...[400,600,700,800].map(weight=>`assets/manrope-latin-${weight}-normal.woff2`),
  ...['app','components','content','course-tools','essay','i18n','lessons','library','study'].map(name=>`src/${name}.js`),
  'src/lib/core.js','src/lib/dom.js','src/lib/i18n-core.js','src/locales/tr.js',
];
for (const file of files) {
  await mkdir(path.dirname(path.join(target,file)),{recursive:true});
  await copyFile(file,path.join(target,file));
}
await writeFile(path.join(target,'build-manifest.json'),JSON.stringify({pages:pages.length,localizedPages:localizedPages.length,files},null,2));
// Fail if obsolete or unexpected files are left by a different build.
const inventory=async(dir)=> {
  const result=[];
  for (const entry of await readdir(dir)) {
    const file=path.join(dir,entry);
    if ((await stat(file)).isDirectory()) result.push(...await inventory(file));
    else result.push(path.relative(target,file).replaceAll(path.sep,'/'));
  }
  return result;
};
const expected=new Set([...files,'build-manifest.json']);
const extras=(await inventory(target)).filter(file=>!expected.has(file));
if (extras.length) throw new Error(`Unexpected files in dist; review before publishing: ${extras.join(', ')}`);
console.log(`Packaged ${pages.length} English and ${localizedPages.length} Turkish pages, plus ${files.length-pages.length-localizedPages.length} local assets/modules in dist/`);
