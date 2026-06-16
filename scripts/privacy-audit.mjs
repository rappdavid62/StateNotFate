#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

async function readText(repoRoot, relativePath) {
  return fs.readFile(path.join(repoRoot, relativePath), 'utf8');
}

export async function runPrivacyAudit(options = {}) {
  const repoRoot = options.repoRoot || process.cwd();
  const failures = [];
  const warnings = [];

  const indexHtml = await readText(repoRoot, 'index.html');
  const manifest = await readText(repoRoot, 'manifest.json');
  const gitignore = await readText(repoRoot, '.gitignore');
  const appJs = await readText(repoRoot, 'app.js');

  const canonicalTag = indexHtml.match(/rel=["']canonical["'][^>]+/i)?.[0] || '';
  if (/127\.0\.0\.1|localhost/i.test(canonicalTag)) {
    failures.push('Production canonical URL still points at localhost.');
  }

  if (/knowledge\//i.test(manifest)) {
    failures.push('Manifest icon points at knowledge/, which is ignored and may not deploy.');
  }

  for (const required of ['test-results/', 'playwright-report/', '.env']) {
    if (!gitignore.includes(required)) failures.push(`.gitignore is missing ${required}.`);
  }

  if (!/not a replacement for professional care/i.test(indexHtml)) {
    failures.push('Public page is missing the professional-care boundary phrase.');
  }

  if (!/988/.test(indexHtml)) {
    warnings.push('Public page does not mention 988. If intentional, document the alternate crisis routing.');
  }

  if (/localStorage/.test(appJs) && !/scramble|encrypt|cipher/i.test(appJs)) {
    warnings.push('app.js uses localStorage without an obvious protection function name. Review sensitive state handling.');
  }

  return { pass: failures.length === 0, failures, warnings };
}

async function main() {
  const result = await runPrivacyAudit();
  for (const warning of result.warnings) console.warn(`warning: ${warning}`);
  if (!result.pass) {
    for (const failure of result.failures) console.error(`failure: ${failure}`);
    process.exitCode = 1;
    return;
  }
  console.log('Privacy boundary audit passed.');
}

const executedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (executedPath === fileURLToPath(import.meta.url)) main();
