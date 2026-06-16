#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SKIP_DIRS = new Set(['.git', 'node_modules', 'playwright-report', 'test-results', 'coverage']);
const SCAN_EXTENSIONS = new Set(['.html', '.md', '.json']);
const SKIP_PREFIXES = ['#', 'mailto:', 'tel:'];

export function extractLinks(text) {
  const links = new Set();
  const patterns = [
    /(?:href|src)=['"]([^'"]+)['"]/gi,
    /\[[^\]]+\]\(([^)\s]+)\)/g,
    /https?:\/\/[^\s'"<>)]+/g
  ];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const raw = match[1] || match[0];
      const cleaned = raw.trim().replace(/[.,;:!?]+$/g, '');
      if (cleaned) links.add(cleaned);
    }
  }
  return [...links];
}

export function shouldSkipLink(link) {
  const lower = link.toLowerCase();
  return SKIP_PREFIXES.some((prefix) => lower.startsWith(prefix));
}

export function isExternalLink(link) {
  return /^https?:\/\//i.test(link);
}

async function walkFiles(root, results = []) {
  const entries = await fs.readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) await walkFiles(fullPath, results);
    if (entry.isFile() && SCAN_EXTENSIONS.has(path.extname(entry.name))) results.push(fullPath);
  }
  return results;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function localCandidates(repoRoot, sourceFile, link) {
  const clean = link.split('#')[0].split('?')[0];
  if (!clean || shouldSkipLink(clean) || isExternalLink(clean)) return [];
  const base = clean.startsWith('/') ? repoRoot : path.dirname(sourceFile);
  const resolved = path.resolve(base, clean.replace(/^\//, ''));
  return [resolved, `${resolved}.html`, path.join(resolved, 'index.html')];
}

async function checkExternal(link, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let response = await fetch(link, { method: 'HEAD', redirect: 'follow', signal: controller.signal });
    if ([403, 405, 429].includes(response.status)) {
      response = await fetch(link, { method: 'GET', redirect: 'follow', signal: controller.signal });
    }
    return { ok: response.status < 400 || [401, 403, 429].includes(response.status), message: `HTTP ${response.status}` };
  } catch (error) {
    return { ok: false, message: error.name === 'AbortError' ? 'timeout' : error.message };
  } finally {
    clearTimeout(timeout);
  }
}

function parseArgs(argv) {
  const args = { externalOnly: argv.includes('--external-only'), soft: argv.includes('--soft'), timeoutMs: 15000, reportPath: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--timeout' && argv[i + 1]) args.timeoutMs = Number(argv[i + 1]);
    if (argv[i] === '--report' && argv[i + 1]) args.reportPath = argv[i + 1];
  }
  return args;
}

export async function runLinkCheck(options = {}) {
  const repoRoot = options.repoRoot || process.cwd();
  const files = await walkFiles(repoRoot);
  const checked = [];
  const failures = [];
  for (const file of files) {
    const text = await fs.readFile(file, 'utf8');
    for (const link of extractLinks(text)) {
      if (shouldSkipLink(link)) continue;
      if (isExternalLink(link)) {
        const result = await checkExternal(link, options.timeoutMs ?? 15000);
        const record = { file: path.relative(repoRoot, file), link, type: 'external', ...result };
        checked.push(record);
        if (!record.ok) failures.push(record);
      } else if (!options.externalOnly) {
        const candidates = localCandidates(repoRoot, file, link);
        const ok = candidates.length === 0 || (await Promise.all(candidates.map(fileExists))).some(Boolean);
        const record = { file: path.relative(repoRoot, file), link, type: 'local', ok, message: ok ? 'found' : 'missing local target' };
        checked.push(record);
        if (!ok) failures.push(record);
      }
    }
  }
  return { pass: failures.length === 0, checked, failures };
}

async function writeReport(reportPath, result) {
  if (!reportPath) return;
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  const body = [
    '# Link Check Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Checked links: ${result.checked.length}`,
    `Failures: ${result.failures.length}`,
    '',
    ...result.failures.map((item) => `- ${item.file}: ${item.link} — ${item.message}`),
    result.failures.length ? '' : 'No failed links detected.'
  ].join('\n');
  await fs.writeFile(reportPath, `${body}\n`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = await runLinkCheck(args);
  await writeReport(args.reportPath, result);
  if (result.failures.length) {
    console.error(`Link check found ${result.failures.length} failure(s).`);
    for (const failure of result.failures.slice(0, 20)) console.error(`- ${failure.file}: ${failure.link} — ${failure.message}`);
    if (!args.soft) process.exitCode = 1;
  } else {
    console.log(`Link check passed. Checked ${result.checked.length} link(s).`);
  }
}

const executedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (executedPath === fileURLToPath(import.meta.url)) main();
