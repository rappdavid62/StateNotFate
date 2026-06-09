# Copilot Instructions for State Not Fate

This repository is a static PWA / public website. Treat it as a plain HTML/CSS/JavaScript app, not a framework or backend project.

## What to know before editing
- Primary source of truth: `AGENTS.md`.
- Secondary context: `README.md` and `docs/AI-Systems-MOC.md`, `docs/State-Not-Fate-MOC.md`.
- Preserve the static PWA structure: `index.html`, `index.css`, `app.js`, `service-worker.js`, `manifest.json`, and `netlify.toml` are core assets.
- Do not change application architecture, migrate the app to a different stack, or add a backend.
- Do not change `index.html`, `app.js`, `index.css`, `service-worker.js`, `package.json`, or `package-lock.json` unless the user explicitly requests it.

## Safe workflow rules
1. Inspect first: review the relevant files and tests before editing.
2. Plan before edits: summarize the proposed change, affected files, and validation path.
3. Keep diffs small: prefer targeted modifications and avoid broad refactors.
4. Preserve safety and accessibility: maintain crisis content, public-facing site integrity, SEO metadata, and PWA behavior.
5. Use existing tests: `npm test` and `npm run test:public` are the trusted validation steps.
6. Roll back if needed: commit or snapshot before changes, and use git to revert any unsafe edits.

## Validation guidance
- `npm run serve` to start the local static server from `scripts/static-server.mjs`.
- `npm test` to run the full Playwright suite.
- `npm run test:public` to run the public-facing Playwright tests.

## Notes for future agents
- This repo stores state in browser `localStorage`; there is no backend state.
- Edits to `index.html` may affect both the public landing page and the embedded app experience.
- `netlify.toml` uses a static redirect fallback to `index.html`; preserve this deployment assumption.
- When in doubt, ask for clarification before applying a change.
