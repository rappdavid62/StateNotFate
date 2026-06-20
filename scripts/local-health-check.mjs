#!/usr/bin/env node
/**
 * SNF Local Health Check — run with: npm run health
 *
 * Validates that the CI/CD system is internally consistent before you push.
 * Catches issues like stale Node versions, missing scripts, and config drift
 * before they become GitHub Actions failures.
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

let passed = 0;
let warned = 0;
let failed = 0;

function check(label, fn) {
  try {
    const result = fn();
    if (result === true || result === undefined) {
      console.log(`  ✅  ${label}`);
      passed++;
    } else if (typeof result === 'string') {
      console.warn(`  🟡  ${label}\n       ${result}`);
      warned++;
    }
  } catch (err) {
    console.error(`  ❌  ${label}\n       ${err.message}`);
    failed++;
  }
}

function readJson(relPath) {
  const full = join(root, relPath);
  if (!existsSync(full)) throw new Error(`File not found: ${relPath}`);
  return JSON.parse(readFileSync(full, 'utf8'));
}

function readText(relPath) {
  const full = join(root, relPath);
  if (!existsSync(full)) throw new Error(`File not found: ${relPath}`);
  return readFileSync(full, 'utf8');
}

function readWorkflow(name) {
  return readText(`.github/workflows/${name}`);
}

// ─── Section 1: Workflow Node Version Consistency ────────────────────────────
console.log('\n📋  Workflow Node version checks');

const DEPRECATED_NODE = ['16.x', '18.x', '20.x'];
const workflows = [
  'hourly-synthetic-monitor.yml',
  'layered-ci.yml',
  'node.js.yml',
  'weekly-evidence-watch.yml',
  'weekly-privacy-watch.yml',
];

for (const wf of workflows) {
  check(`${wf} — no deprecated Node versions`, () => {
    const content = readWorkflow(wf);
    for (const v of DEPRECATED_NODE) {
      if (content.includes(`node-version: ${v}`) || content.includes(`"${v}"`)) {
        throw new Error(`Found deprecated Node version ${v} in ${wf}`);
      }
    }
  });
}

// ─── Section 2: Dependabot config exists ─────────────────────────────────────
console.log('\n📋  Dependency update automation');

check('.github/dependabot.yml exists', () => {
  if (!existsSync(join(root, '.github/dependabot.yml'))) {
    throw new Error('dependabot.yml missing — action versions will go stale');
  }
});

check('dependabot.yml covers github-actions ecosystem', () => {
  const content = readText('.github/dependabot.yml');
  if (!content.includes('package-ecosystem: github-actions')) {
    throw new Error('dependabot.yml does not cover github-actions');
  }
});

// ─── Section 3: Test tagging completeness ────────────────────────────────────
console.log('\n📋  Test tier tagging (@critical / @advisory)');

import { readdirSync } from 'fs';
const specFiles = readdirSync(join(root, 'tests/public')).filter(f => f.endsWith('.spec.ts'));

for (const spec of specFiles) {
  check(`tests/public/${spec} — all tests are tagged`, () => {
    const content = readText(`tests/public/${spec}`);
    const testLines = content.split('\n').filter(l => /^test\(/.test(l.trim()));
    const untagged = testLines.filter(l => !l.includes('@critical') && !l.includes('@advisory'));
    if (untagged.length > 0) {
      throw new Error(`${untagged.length} test(s) missing @critical or @advisory tag:\n       ${untagged[0].trim().slice(0, 80)}...`);
    }
  });
}

// ─── Section 4: Monitor workflow has tiered steps ────────────────────────────
console.log('\n📋  Hourly monitor resilience');

check('monitor has @critical grep step', () => {
  const content = readWorkflow('hourly-synthetic-monitor.yml');
  if (!content.includes('@critical')) throw new Error('Missing @critical grep in monitor');
});

check('monitor has @advisory step with continue-on-error', () => {
  const content = readWorkflow('hourly-synthetic-monitor.yml');
  if (!content.includes('@advisory')) throw new Error('Missing @advisory grep in monitor');
  if (!content.includes('continue-on-error: true')) throw new Error('Missing continue-on-error on advisory step');
});

check('monitor has job-level timeout-minutes', () => {
  const content = readWorkflow('hourly-synthetic-monitor.yml');
  if (!content.includes('timeout-minutes:')) throw new Error('No timeout-minutes — monitor can hang for 19+ minutes');
});

// ─── Section 5: package.json scripts intact ───────────────────────────────────
console.log('\n📋  package.json scripts');

const pkg = readJson('package.json');
const requiredScripts = ['serve', 'test', 'test:public', 'test:unit', 'test:integration', 'health'];
for (const script of requiredScripts) {
  check(`npm run ${script} is defined`, () => {
    if (!pkg.scripts?.[script]) throw new Error(`Script "${script}" missing from package.json`);
  });
}

// ─── Section 6: Playwright configs consistent ────────────────────────────────
console.log('\n📋  Playwright config consistency');

check('playwright.config.ts references local server', () => {
  const content = readText('playwright.config.ts');
  if (!content.includes('webServer')) throw new Error('Local playwright config missing webServer');
  if (!content.includes('127.0.0.1')) throw new Error('Local playwright config not pointing to localhost');
});

check('playwright.production.config.ts references live site', () => {
  const content = readText('playwright.production.config.ts');
  if (!content.includes('statenotfate.netlify.app')) throw new Error('Production config not pointing to live site');
  if (!content.includes('globalTimeout')) return '⚠️ No globalTimeout — production runs can hang';
});

// ─── Section 7: netlify.toml has SPA fallback ────────────────────────────────
console.log('\n📋  Netlify / deployment config');

check('netlify.toml has SPA catch-all redirect', () => {
  const content = readText('netlify.toml');
  if (!content.includes('from = "/*"')) throw new Error('Missing catch-all redirect in netlify.toml');
  if (!content.includes('to = "/index.html"')) throw new Error('Redirect not pointing to index.html');
});

check('netlify.toml NODE_VERSION is not deprecated', () => {
  const content = readText('netlify.toml');
  const match = content.match(/NODE_VERSION\s*=\s*"(\d+)"/);
  if (match) {
    const v = parseInt(match[1]);
    if (v < 22) throw new Error(`netlify.toml NODE_VERSION=${v} is deprecated`);
  }
});

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(55));
console.log(`  Results: ${passed} passed, ${warned} warnings, ${failed} failed`);

if (failed > 0) {
  console.error(`\n  ❌  Health check FAILED — fix the issues above before pushing.\n`);
  process.exit(1);
} else if (warned > 0) {
  console.warn(`\n  🟡  Health check passed with warnings — review above.\n`);
} else {
  console.log(`\n  ✅  System is healthy. Safe to push.\n`);
}
