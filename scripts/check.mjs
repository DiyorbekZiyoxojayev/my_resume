import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { translations } from '../assets/js/site/translations.js';
import { spawnSync } from 'node:child_process';

const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(ids.length, new Set(ids).size, 'Duplicate HTML IDs');
for (const id of ['home','about','experience','portfolio','credentials','contact']) assert(ids.includes(id), `Missing ${id} section`);
for (const match of html.matchAll(/(?:href|src|data-doc)="([^"]+)"/g)) {
  const reference = match[1];
  if (reference.startsWith('#')) { if (reference.length > 1) assert(ids.includes(reference.slice(1)), `Missing anchor ${reference}`); continue; }
  if (/^(https?:|mailto:|tel:)/.test(reference)) continue;
  await stat(path.join(root, reference.split('#')[0]));
}
const keys = [...html.matchAll(/data-i18n(?:-placeholder)?="([^"]+)"/g)].map(match => match[1]);
for (const language of ['en','uz']) for (const key of keys) assert(key in translations[language], `Missing ${language} translation: ${key}`);
for (const file of await readdir(path.join(root, 'files'))) assert(html.includes(`files/${file}`), `Document not linked: ${file}`);
assert.equal((html.match(/class="project-card[ "]/g) || []).length, 7, 'Project count');
assert.equal((html.match(/class="cert-card[ "]/g) || []).length, 8, 'Certificate count');
assert(!/data-rotation-toggle|rotation-toggle|data-sound|Open for work/.test(html), 'Removed UI reintroduced');
const model = await readFile(path.join(root, 'models/justice-sculpture.glb'));
assert.equal(model.readUInt32LE(0), 0x46546c67, 'Invalid GLB signature');
assert.equal(model.readUInt32LE(8), model.length, 'Incomplete GLB');
const gltf = JSON.parse(model.subarray(20, 20 + model.readUInt32LE(12)).toString('utf8'));
assert(gltf.meshes?.some(mesh => mesh.primitives.some(primitive => gltf.accessors[primitive.attributes.POSITION].count > 0)), '3D sculpture has no geometry');

async function walk(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await walk(file));
    else result.push(file);
  }
  return result;
}
for (const file of await walk(path.join(root, 'assets'))) {
  if (!/\.(css|js)$/.test(file)) continue;
  const source = await readFile(file, 'utf8');
  if (file.endsWith('.css')) {
    assert.equal((source.match(/\{/g) || []).length, (source.match(/\}/g) || []).length, `Unbalanced CSS: ${file}`);
    for (const match of source.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
      if (!match[1].startsWith('data:')) await stat(path.resolve(path.dirname(file), match[1]));
    }
  } else {
    const syntax = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    assert.equal(syntax.status, 0, syntax.stderr);
    const code = source.replace(/\/\*[\s\S]*?\*\//g, '');
    for (const match of code.matchAll(/\b(?:from\s*|import\s*\()['"](\.[^'"]+)['"]/g)) await stat(path.resolve(path.dirname(file), match[1]));
  }
}
console.log(`PASS: 6 sections, 7 projects, 8 certificates, all 11 documents, ${new Set(keys).size} bilingual keys, anchors and local asset imports.`);
