# State Not Fate — Production & Workflow Operations Guide

> **Last Updated**: 2026-07-23  
> **Environment**: Browser-first Static PWA / Obsidian Vault / Node.js Engine  
> **Canonical Source**: `SNF_Deploy` & `ObsidianVault/STATENOTFATE`

---

## Executive Summary

This guide documents the production workflows, automated build verifications, and content publishing engines configured for the State Not Fate (SNF) recovery project.

---

## 🛠️ Automated Tools & CLI Reference

### 1. Static Build & Security Verification Pipeline
* **Script**: [`scripts/build-static.mjs`](file:///c:/Users/rappd/OneDrive/Desktop/SNF_Deploy/scripts/build-static.mjs)
* **Command**: `npm run build:static`
* **What it does**:
  1. Checks existence of core static assets (`index.html`, `index.css`, `app.js`, `service-worker.js`, `manifest.json`, `netlify.toml`).
  2. Executes privacy boundary audit (`scripts/privacy-audit.mjs`).
  3. Verifies Netlify security header and CSP rules in `netlify.toml`.

### 2. Obsidian Essay, Audio Script & Publishing Pack Generator
* **Script**: [`scripts/essay-engine.mjs`](file:///c:/Users/rappd/OneDrive/Desktop/SNF_Deploy/scripts/essay-engine.mjs)
* **Command**: `npm run generate:essay [path-to-markdown-file]`
* **What it does**:
  1. Reads Markdown notes directly from your Obsidian Vault (`C:\Users\rappd\OneDrive\Desktop\ObsidianVault\STATENOTFATE\`) or local project files.
  2. Generates typeset HTML articles for Substack / Ghost / Web publishing.
  3. Generates structured Audio Overview Narration Scripts (`audio_script.txt`).
  4. Generates Social Hook & Quote Cards (`social_card.json`).
  5. Conducts an automated safety check (crisis helpline detection & evidence grounding).
  6. Outputs all generated assets to `dist/publishing_packs/<article_name>/`.

---

## 📁 Publishing Pack Output Architecture

When `npm run generate:essay` is executed, output packs are saved under `dist/publishing_packs/<name>/`:

```text
dist/publishing_packs/<article_name>/
├── article.html        # Formatted web & Substack/Ghost article
├── audio_script.txt    # Structured narration script for TTS / audio podcast
├── social_card.json    # Social hooks, post titles & highlight quotes
└── manifest.json       # Metadata, word count, read time & safety audit
```

### Verified Sample Runs
* `dist/publishing_packs/space_cadet_guide/` (1,190 words, 6-min read)
* `dist/publishing_packs/universal_prompt_and_skill_library/` (Vault master skill note)
* `dist/publishing_packs/five_year_depression_years_and_worksheets_2026_v2/` (5,505 words, 28-min read, helpline check PASSED)

---

## ⚡ Command Summary Cheat Sheet

| Intent | Command Line |
|---|---|
| **Run Static Build Verification** | `npm run build:static` |
| **Run Privacy & Boundary Audit** | `npm run audit:privacy` |
| **Generate Default Publishing Pack** | `npm run generate:essay` |
| **Generate Publishing Pack from Obsidian** | `node scripts/essay-engine.mjs "C:\Users\rappd\OneDrive\Desktop\ObsidianVault\STATENOTFATE\<note>.md"` |
| **Run Unit Test Suite** | `npm run test:unit` |
| **Launch Local Static Server** | `npm run serve` |
| **Run Playwright End-to-End Tests** | `npm test` |

---

## 🏛️ Top 20 Production Setup Roadmap

1. **`Remotion` CLI (Code-Driven Video Generator)** — Programmatic React/CSS video rendering.
2. **Netlify + Stripe Webhook Gateway** — Monetization for digital recovery guides.
3. **Grok CLI + Claude Essay Synthesis Engine** — Drafts-to-essay synthesis.
4. **`Substack` / `Ghost` API Auto-Publisher** — Direct newsletter scheduling.
5. **`ElevenLabs` / Edge-TTS Voice Synthesis** — Neural audio narration.
6. **Obsidian `Omnisearch` Plugin** — OCR and fuzzy note searching.
7. **Obsidian `Advanced Slides` Plugin** — Markdown web presentation decks.
8. **Obsidian `Excalidraw` Plugin** — Flowcharting recovery systems.
9. **`trufflehog` / `git-leaks` Pre-Commit Security Scanner** — Secret protection.
10. **Hardened CSP & Security Headers Suite** — Host security in `netlify.toml`.
11. **`ChromaDB` / `Qdrant` Local Vector Store** — Semantic memory database.
12. **Shopify Webhook + Digital Fulfillment Gateway** — Auto product delivery.
13. **Pandoc + LaTeX PDF & eBook Publishing Engine** — PDF book compilation.
14. **Playwright Visual Regression Suite** — Visual layout QA.
15. **Automated Static Asset Bundler (`build-static.mjs`)** — *(Implemented)*.
16. **Android ADB Wireless Sync Bridge** — Wireless PWA deployment.
17. **`axe-core/playwright` Accessibility Auditor** — WCAG AA compliance.
18. **GitHub Actions CI/CD Workflow** — Smoke test automation.
19. **Automated Master Context Compiler** — 5-second context packaging.
20. **Service Worker Offline Pre-cache Stashing Engine** — Offline resilience.
