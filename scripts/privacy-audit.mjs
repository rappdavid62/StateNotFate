#!/usr/bin/env node
import fs from 'node:fs/promises';

const failures = [];
const warnings = [];
const indexHtml = await fs.readFile('index.html', 'utf8');
const manifest = await fs.readFile('manifest.json', 'utf8');
const gitignore = await fs.readFile('.gitignore', 'utf8');

if (indexHtml.includes('127.0.0.1') || indexHtml.includes('localhost')) {
  warnings.push('Localhost appears in index.html. Review before production SEO handoff.');
}

if (manifest.includes('knowledge/')) {
  failures.push('manifest.json points at ignored knowledge assets.');
}

for (const required of ['test-results/', 'playwright-report/', '.env']) {
  if (!gitignore.includes(required)) failures.push(`.gitignore missing ${required}`);
}

for (const warning of warnings) console.warn(`warning: ${warning}`);
for (const failure of failures) console.error(`failure: ${failure}`);
if (failures.length) process.exitCode = 1;
else console.log('Boundary audit passed.');
