#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';

console.log('🚀 Running SNF Static Build & Audit Verification Pipeline...\n');

let errorCount = 0;

// 1. Verify Core HTML & CSS Files Exist
console.log('📦 Step 1: Checking core static assets...');
const requiredFiles = ['index.html', 'index.css', 'app.js', 'service-worker.js', 'manifest.json', 'netlify.toml'];
for (const file of requiredFiles) {
  try {
    await fs.access(file);
    console.log(`  ✓ Found ${file}`);
  } catch {
    console.error(`  ❌ Missing required asset: ${file}`);
    errorCount++;
  }
}

// 2. Run Privacy & Boundary Audit
console.log('\n🔒 Step 2: Running privacy & boundary audit...');
try {
  const auditOutput = execSync('node scripts/privacy-audit.mjs', { encoding: 'utf8' });
  console.log(`  ✓ Privacy Audit Output:\n${auditOutput.trim().split('\n').map(l => '    ' + l).join('\n')}`);
} catch (err) {
  console.error(`  ❌ Privacy Audit Failed: ${err.message}`);
  errorCount++;
}

// 3. Verify netlify.toml Security & Redirect Configurations
console.log('\n🛡️ Step 3: Verifying netlify.toml headers & redirects...');
try {
  const netlifyContent = await fs.readFile('netlify.toml', 'utf8');
  if (netlifyContent.includes('Content-Security-Policy') && netlifyContent.includes('X-Frame-Options')) {
    console.log('  ✓ netlify.toml security headers verified.');
  } else {
    console.warn('  ⚠️ netlify.toml missing extended security header declarations.');
  }
} catch (err) {
  console.error(`  ❌ Could not read netlify.toml: ${err.message}`);
  errorCount++;
}

// Final Status Summary
console.log('\n----------------------------------------');
if (errorCount === 0) {
  console.log('✅ Static Build Verification PASSED cleanly!');
  process.exit(0);
} else {
  console.error(`❌ Static Build Verification FAILED with ${errorCount} error(s).`);
  process.exit(1);
}
