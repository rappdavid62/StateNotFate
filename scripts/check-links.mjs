#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const reportFlag = process.argv.indexOf('--report');
const reportPath = reportFlag >= 0 ? process.argv[reportFlag + 1] : null;
const message = `# Link Check Report\n\nGenerated: ${new Date().toISOString()}\n\nPlaceholder report. External link probing is intentionally review-gated.\n`;

if (reportPath) {
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, message);
}

console.log('Link check placeholder completed.');
