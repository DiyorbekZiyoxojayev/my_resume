import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const template = await readFile(path.join(root, 'index.template.html'), 'utf8');
let output = template;
for (const match of template.matchAll(/^([ \t]*)<!-- component:([a-z/-]+) -->/gm)) {
  const source = await readFile(path.join(root, 'components', `${match[2]}.html`), 'utf8');
  const lines = source.trimEnd().split('\n');
  const indent = Math.min(...lines.filter(line => line.trim()).map(line => line.search(/\S/)));
  const component = lines.map(line => match[1] + line.slice(Math.max(0, indent))).join('\n');
  output = output.replace(match[0], component);
}
if (process.argv.includes('--check')) {
  if (await readFile(path.join(root, 'index.html'), 'utf8') !== output) {
    throw new Error('Generated page is stale. Run npm run build.');
  }
  console.log('Generated page matches all component sources.');
} else {
  await writeFile(path.join(root, 'index.html'), output, 'utf8');
  console.log('Built index.html from home, section and shared components.');
}
