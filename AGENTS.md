# AI Agent Instructions for State Not Fate

## Purpose

This repository is a static PWA / public website for the State Not Fate recovery project. AI coding agents should treat it as a browser-first, no-framework static app with Playwright tests for quality checks.

## Key Code Areas

- `index.html` - public landing page plus the embedded local app UI screens.
- `index.css` - site and app styling.
- `app.js` - primary application logic, onboarding flows, state management, PWA registration, and user interactions.
- `service-worker.js` - offline support. HTML, `app.js`, and `index.css` are network-first with cache fallback; other same-origin GETs stay cache-first.
- `crisis.html`, `suicide-prevention.html`, `evidence.html`, `contact.html`, `essays.html` - public multi-page routes.
- `tests/public/` - Playwright end-to-end checks for homepage, accessibility, SEO, safety, and evidence pages.
- `package.json` - developer scripts and Playwright dependency.
- `netlify.toml` - static hosting, pretty-URL rewrites, a 404 catch-all to `404.html`, and security headers.
- `docs/agent/STATE_NOT_FATE_AGENT_LEDGER.md` - durable agent findings. Update only when state actually changes.
- `docs/` - extended architecture and systems thinking notes; link here rather than duplicating.

## Recommended Agent Behavior

- General technical execution is governed by David's canonical AI Constitution at `C:\ROOT_OBSIDIAN\DOV\_Meta\DAVID_AI_CONSTITUTION.md` and the applicable sources under `C:\ROOT_OBSIDIAN\DOV\08-TECH-AND-AI`. State Not Fate philosophy, recovery language, and content voice are project material; they do not govern unrelated programming, AI infrastructure, connector configuration, or general technical decisions.
- `snf-project-steward` is the user-facing State Not Fate project bot. It helps David develop and organize SNF content, improve and check the website, keep project files and source states straight, and support NotebookLM/video intake and production. David may describe the desired result normally; he does not need to choose a specialist.
- The SNF project steward may delegate bounded HTML, CSS, JavaScript, PWA, accessibility, routing, or Playwright implementation to `snf-implementation`. It may delegate consequential source, branch, release, deployment, Netlify, or production claims to `snf-release-verifier` for independent read-only verification.
- Delegation transfers a bounded task, not ownership of David's intent. Give specialists an explicit objective, source packet, write scope, fences, acceptance criteria, and required receipt. Do not duplicate work across agents unless the second pass is an intentional independent review.
- For SNF-authored public content only: do not sell or offer hope, and do not generate copy that preys on people's need for hope. Keep existing filenames, citations, source titles, legal names, and other people's names. This content preference does not become a general technical or programming rule.
- Prefer minimal, precise, dependency-complete changes. Do not omit a required test, route, cache update, or safety-preservation step merely to reduce the diff. This is a static site, so do not introduce a JavaScript framework or server-side dependencies unless the user explicitly requests them.
- Preserve accessibility, SEO, and safety/care guidance. The site includes mental health safety content, crisis pages, and public-facing evidence resources.
- Keep PWA semantics intact: service worker registration, manifest usage, and `localStorage` state persistence are core behaviors.
- Use `npm test` and `npm run test:public` to validate changes with Playwright. On Windows PowerShell, prefer `npm.cmd test` and `npm.cmd run test:public`.
- Use `npm run serve` to run the local static server before verifying UI changes in a browser. On Windows PowerShell, prefer `npm.cmd run serve`.

## File Delivery Rule (Hard Constraint)

Never treat a private sandbox, container, home directory, temporary directory, or internal runtime path as the final delivery location for a file I am expected to read, download, edit, reuse, share, or keep. Temporary internal storage is allowed during processing, but the finished artifact must be copied, exported, attached, or saved somewhere actually accessible to me, with a usable link or path. If no user-accessible destination is available, say so explicitly rather than claiming the file was delivered.

## Build / Test Commands

- `npm install` - install dev dependencies
- `npm run serve` - launch the static server from `scripts/static-server.mjs`
- `npm test` - run full Playwright suite
- `npm run test:public` - run the public-facing test subset in `tests/public`

Windows note: if bare `npm` hits PowerShell execution-policy friction, use `npm.cmd` and `npx.cmd`.

## Important Notes

- This repo is not a framework-based app. It uses plain HTML, CSS, and vanilla JavaScript.
- Application state is sandboxed to the browser via `localStorage`; there is no backend state.
- Edits to `index.html` can affect both the public landing page and the embedded app experience.
- `netlify.toml` is a multi-page static publish. Known routes rewrite to `.html` files. Unknown paths return `404.html`. Do not add an SPA fallback to `index.html`.
- Unhashed `app.js` and `index.css` must revalidate (`max-age=0, must-revalidate`). Do not mark them `immutable` unless filenames are content-hashed.
- `docs/AI-Systems-MOC.md` and `docs/State-Not-Fate-MOC.md` contain domain context and should be referenced when adding larger system or evidence-related changes.
- Run `npm run health` before pushing. It must describe the real routing and cache policy, not a commented workaround.

## Useful Links

- `README.md` - project overview and phone/mobile sync notes
- `netlify.toml` - deployment and security header rules
- `tests/public/` - canonical acceptance tests for public site behavior

## Suggested Next Customization

If we want stronger automation, add a skill for Playwright-based public site validation or a custom agent prompt targeting static PWA maintenance.

### Android Development & Tooling

- **Android CLI Path:** The Android CLI is located at `C:\Users\rappd\AppData\AndroidCLI\android.exe`. Use the absolute path if PowerShell environment variables are not refreshed.
- **Silent Background Installation:** When installing tools or SDKs via `winget` or other package managers in a background command, ALWAYS use the `--silent` or `/S` flags to prevent execution hangs from silent UAC or interactive prompts.
- **Obsidian Sync:** When documenting system structures, environment configurations, or troubleshooting runbooks, save them directly in the Obsidian Vault (`C:\ROOT_OBSIDIAN\DOV\01-PROJECTS\STATENOTFATE\`) to ensure the user has stable and accessible offline reference manuals.
- **Local Persistence:** Default to offline-first local persistence (like Room Database or Preferences DataStore on Android, and localStorage on Web) to honor the privacy and "sanctuary" philosophy of State Not Fate.

### State Not Fate Multi-Silo Reservoir & Educational Video Production

- **Unified Knowledge Reservoir:** The project maintains a 993-asset 4-silo unified reservoir index at `C:\ROOT_OBSIDIAN\DOV\01-PROJECTS\STATENOTFATE\video-pipeline\snf_reservoir_engine.py` connecting NotebookLM videos, DOV notes (including physical health, compounds, circadian clocks, suicide prevention), website modules, and internet video streams.
- **Master Behavioral Tools & 10 Silos:** Catalogued in `knowledge/master_behavioral_tools.json` across 10 functional clinical/somatic silos with 32 granular levers (v2.1.0).
- **Reservoir Commands:**
  - `npm.cmd run reservoir:index` — Re-index all 4 silos into `snf_unified_reservoir.json`.
  - `npm.cmd run reservoir:query -- "<query>"` — Discover cross-silo correlations.
  - `npm.cmd run reservoir:stack -- "<context>"` — Synthesize a composite 3-part behavioral stack (Primary Anchor + 2 Micro-Adjuncts) paired with biological floor substrate notes.
  - `npm.cmd run reservoir:synthesize -- "<topic>"` — Generate broadcast educational video packages.
- **Antigravity Customizations:**
  - Agent: `snf-reservoir-steward` (`.agents/agents/snf-reservoir-steward.toml`)
  - Skill: `snf-protocol-synthesizer` (`.agents/skills/snf-protocol-synthesizer/SKILL.md`)
  - Rule: `snf-mvd-and-reservoir-invariants` (`.agents/rules/snf-mvd-and-reservoir-invariants.md`)
- **Educational Video Standard:** Every video package must adhere to Polaris 25.x:
  1. Destigmatize: frame depression/crisis as an acute biological state shift / system crash, not character weakness.
  2. Concrete Action: provide a 30-second Minimum Viable Dose (MVD) physical anchor.
  3. Visuals: include 9:16 vertical storyboard and Omni Flash generation prompts.
  4. Biological Floor: frame medications and biochemicals as stabilizing the physiological substrate baseline.
  5. Mandatory Safety Gate: every release must include the 988 Lifeline and Crisis Text Line 741741 disclosures.


