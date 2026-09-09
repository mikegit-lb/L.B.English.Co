import { execFileSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

// Tailwind's resolver mishandles '#' in Windows paths. A temporary drive alias
// keeps builds reproducible in this workspace without renaming the project.
const root = process.cwd();
let drive = null;
try {
  if (process.platform === 'win32' && root.includes('#')) {
    drive = [...'ZYXWVUTSRQPONMLKJIHGFED'].find((letter) => !fs.existsSync(letter + ':\\'));
    if (!drive) throw new Error('No free drive letter available for the Tailwind build.');
    execFileSync('subst', [drive + ':', root]);
  }
  const cwd = drive ? drive + ':\\' : root;
  execFileSync(process.execPath, [path.join(cwd, 'node_modules/@tailwindcss/cli/dist/index.mjs'), '-i', 'src/tailwind.css', '-o', 'assets/site.css', '--minify'], { cwd, stdio:'inherit' });
} finally {
  if (drive) execFileSync('subst', [drive + ':', '/D']);
}
