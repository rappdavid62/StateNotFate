#!/usr/bin/env node
/**
 * SNF Automated Essay, Narration & Publishing Engine
 * Tailored for State Not Fate & Obsidian Vault Workflow
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Default target: Obsidian Vault STATENOTFATE or local markdown file
const DEFAULT_OBSIDIAN_VAULT = 'C:\\Users\\rappd\\OneDrive\\Desktop\\ObsidianVault\\STATENOTFATE';

console.log('🚀 Launching SNF Automated Essay & Publishing Engine...\n');

async function runEssayEngine() {
  const args = process.argv.slice(2);
  let targetFile = args[0];

  // If no file specified, pick a sample file from workspace or vault
  if (!targetFile) {
    targetFile = path.join(PROJECT_ROOT, 'space_cadet_guide.md');
    try {
      await fs.access(targetFile);
    } catch {
      targetFile = path.join(DEFAULT_OBSIDIAN_VAULT, 'universal_prompt_and_skill_library.md');
    }
  }

  console.log(`📖 Reading source note: ${targetFile}`);

  let rawMarkdown = '';
  try {
    rawMarkdown = await fs.readFile(targetFile, 'utf8');
  } catch (err) {
    console.error(`❌ Error reading target markdown file: ${err.message}`);
    process.exit(1);
  }

  const basename = path.basename(targetFile, path.extname(targetFile));
  const outputDir = path.join(PROJECT_ROOT, 'dist', 'publishing_packs', basename);
  await fs.mkdir(outputDir, { recursive: true });

  console.log(`⚡ Processing & Synthesizing Publishing Pack for: "${basename}"...`);

  // 1. Generate Clean HTML Document for Substack / Ghost / Web
  const htmlContent = convertMarkdownToHTML(rawMarkdown, basename);
  const htmlPath = path.join(outputDir, 'article.html');
  await fs.writeFile(htmlPath, htmlContent, 'utf8');

  // 2. Generate Structured Audio Script for Narration / Podcast Overview
  const audioScript = generateAudioScript(rawMarkdown, basename);
  const audioPath = path.join(outputDir, 'audio_script.txt');
  await fs.writeFile(audioPath, audioScript, 'utf8');

  // 3. Generate Social & Content Quote Cards
  const socialCards = generateSocialCards(rawMarkdown, basename);
  const socialPath = path.join(outputDir, 'social_card.json');
  await fs.writeFile(socialPath, JSON.stringify(socialCards, null, 2), 'utf8');

  // 4. Generate Publishing Manifest
  const manifest = {
    title: basename.replace(/[-_]/g, ' '),
    generatedAt: new Date().toISOString(),
    sourcePath: targetFile,
    artifacts: {
      html: path.relative(PROJECT_ROOT, htmlPath),
      audioScript: path.relative(PROJECT_ROOT, audioPath),
      socialCards: path.relative(PROJECT_ROOT, socialPath)
    },
    wordCount: rawMarkdown.split(/\s+/).length,
    estimatedReadTimeMinutes: Math.ceil(rawMarkdown.split(/\s+/).length / 200),
    safetyCheck: {
      hasHelplineReference: rawMarkdown.includes('988') || rawMarkdown.includes('crisis') || htmlContent.includes('Helpline'),
      evidenceGrounded: rawMarkdown.toLowerCase().includes('evidence') || rawMarkdown.toLowerCase().includes('protocol')
    }
  };

  const manifestPath = path.join(outputDir, 'manifest.json');
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  console.log('\n✅ Publishing Pack Successfully Generated!');
  console.log(`📁 Location: ${path.relative(PROJECT_ROOT, outputDir)}`);
  console.log(`   📄 HTML Article:    ${path.relative(PROJECT_ROOT, htmlPath)}`);
  console.log(`   🎙️ Audio Script:    ${path.relative(PROJECT_ROOT, audioPath)}`);
  console.log(`   📱 Social Cards:    ${path.relative(PROJECT_ROOT, socialPath)}`);
  console.log(`   📋 Manifest:        ${path.relative(PROJECT_ROOT, manifestPath)}`);
}

function convertMarkdownToHTML(md, title) {
  const lines = md.split('\n');
  let bodyHtml = '';

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    if (line.startsWith('# ')) {
      bodyHtml += `<h1>${escapeHtml(line.slice(2))}</h1>\n`;
    } else if (line.startsWith('## ')) {
      bodyHtml += `<h2>${escapeHtml(line.slice(3))}</h2>\n`;
    } else if (line.startsWith('### ')) {
      bodyHtml += `<h3>${escapeHtml(line.slice(4))}</h3>\n`;
    } else if (line.startsWith('- ')) {
      bodyHtml += `<li>${escapeHtml(line.slice(2))}</li>\n`;
    } else {
      bodyHtml += `<p>${escapeHtml(line)}</p>\n`;
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} | State Not Fate Publishing</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 720px; margin: 40px auto; padding: 0 20px; color: #1e293b; background: #f8fafc; }
    h1 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
    h2 { color: #334155; margin-top: 32px; }
    p { margin: 16px 0; }
    li { margin: 8px 0; }
    .safety-banner { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 24px 0; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="safety-banner">
    <strong>State Not Fate Publishing Engine</strong> — Grounded evidence & practical recovery tools.
  </div>
  ${bodyHtml}
</body>
</html>`;
}

function generateAudioScript(md, title) {
  const cleanText = md.replace(/[#*`\-[\]()]/g, ' ').replace(/\s+/g, ' ').trim();
  const summaryParagraphs = cleanText.slice(0, 1200);

  return `[EPISODE TITLE: ${title.replace(/[-_]/g, ' ')}]
[FORMAT: Audio Essay & Concept Overview]

[NARRATOR INTRO]
Welcome to the State Not Fate audio overview. Today we are diving into "${title.replace(/[-_]/g, ' ')}".
This guide focuses on actionable steps, evidence-based systems, and low-energy execution strategies.

[CORE CONCEPTS & ANALYSIS]
${summaryParagraphs}...

[TAKEAWAY & ACTION]
Remember: progress is built through small, low-friction anchors. Keep state over fate.
Thank you for listening.`;
}

function generateSocialCards(md, title) {
  const lines = md.split('\n').map(l => l.trim()).filter(l => l.length > 30);
  const quotes = lines.slice(0, 3);

  return {
    postTitle: title.replace(/[-_]/g, ' '),
    socialHooks: [
      `Key insights from ${title.replace(/[-_]/g, ' ')}: How low-energy systems build real momentum.`,
      `Stop relying on willpower. Here is the evidence-grounded framework from State Not Fate.`
    ],
    highlightQuotes: quotes.length > 0 ? quotes : ["State Not Fate: Action creates clarity."]
  };
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

runEssayEngine();
