#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const FILES = [
  'index.html',
  'crisis.html',
  'suicide-prevention.html',
  'evidence.html',
  'essays.html',
  'app.js'
];

const DISALLOWED = [
  { id: 'diagnose-claim', re: /\bdiagnoses?\b(?!\s*,|\s+predict|\s+or|\s+score)/i, note: 'Avoid diagnostic claim language outside explicit cannot-do framing' },
  { id: 'cure-claim', re: /\bcures?\b/i, note: 'Avoid cure claims' },
  { id: 'clinically-validated', re: /clinically validated/i, note: 'Avoid clinically validated claims' },
  { id: 'medical-grade', re: /medical-grade/i, note: 'Avoid medical-grade claims' },
  { id: 'treatment-replacement', re: /treatment replacement|replace(?:s|ment)? (?:for )?(?:therapy|professional care|medical care)/i, note: 'Avoid treatment-replacement claims' },
  { id: 'secure-medical-storage', re: /secure medical storage/i, note: 'Avoid secure medical storage claims' },
  { id: 'verified-simulation-results', re: /verified simulation results/i, note: 'Avoid verified simulation outcome claims' }
];

// Phrases that are allowed even if they contain a banned stem (negation / boundary framing)
const ALLOWED_CONTEXT = [
  /does not diagnose/i,
  /cannot diagnose/i,
  /should not claim to diagnose/i,
  /it cannot diagnose/i,
  /not a cure/i,
  /avoid cure/i,
  /not a replacement for professional care/i,
  /does not replace/i,
  /cannot .*replace/i,
  /secure firearm storage/i,
  /secure access to means/i,
  /secure your environment/i,
  /saved securely to local storage/i,
  /secure channel established/i,
  /secure terminal/i,
  /secure the first matched move/i,
  /securely \(locked/i
];

const REQUIRED_SIGNALS = [
  { id: 'adjunctive-support', re: /adjunctive support/i, files: ['index.html'] },
  { id: 'not-replacement', re: /not a replacement for professional care/i, files: ['index.html'] },
  { id: 'crisis-routing', re: /988/, files: ['crisis.html', 'suicide-prevention.html'] },
  { id: 'local-privacy', re: /local(?:Storage)?|browser(?:-based)?|on (?:this|your) (?:device|machine)|sandboxed on your machine/i, files: ['index.html', 'app.js'] }
];

const failures = [];
const warnings = [];

function lineIsAllowed(line) {
  return ALLOWED_CONTEXT.some((re) => re.test(line));
}

for (const rel of FILES) {
  const full = path.join(ROOT, rel);
  let text = '';
  try {
    text = await fs.readFile(full, 'utf8');
  } catch {
    warnings.push(`Missing candidate file: ${rel}`);
    continue;
  }

  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const rule of DISALLOWED) {
      if (!rule.re.test(line)) continue;
      if (lineIsAllowed(line)) continue;
      // Explicit cannot-do / negation lists in the same line
      if (/cannot|does not|do not|should not|avoid|never/i.test(line) && rule.re.test(line)) continue;
      failures.push(`${rel}:${i + 1} [${rule.id}] ${rule.note} :: ${line.trim().slice(0, 160)}`);
    }
  }
}

for (const signal of REQUIRED_SIGNALS) {
  let found = false;
  for (const rel of signal.files) {
    try {
      const text = await fs.readFile(path.join(ROOT, rel), 'utf8');
      if (signal.re.test(text)) {
        found = true;
        break;
      }
    } catch {
      // ignore missing optional
    }
  }
  if (!found) failures.push(`Missing required framing [${signal.id}] in ${signal.files.join(', ')}`);
}

for (const warning of warnings) console.warn(`warning: ${warning}`);
for (const failure of failures) console.error(`failure: ${failure}`);
if (failures.length) {
  process.exitCode = 1;
} else {
  console.log('Claim hygiene audit passed.');
}
