# Copilot Instructions for State Not Fate

This repository is a static PWA / public website. Treat it as a plain HTML/CSS/JavaScript app, not a framework or backend project.

## Source of truth
- Primary source of truth: AGENTS.md.
- Secondary context: README.md, docs/AI-Systems-MOC.md, and docs/State-Not-Fate-MOC.md.
- Core app/deployment files include index.html, index.css, app.js, service-worker.js, manifest.json, package.json, package-lock.json, and netlify.toml.

## Hard rules
- Do not migrate the app to React, TypeScript, a backend, or another framework unless explicitly requested.
- Do not change application architecture unless explicitly requested.
- Do not invent file paths.
- Do not change core app files unless the user explicitly approves the plan.
- Preserve browser localStorage state behavior; there is no backend state.
- Preserve the static Netlify deployment assumption and fallback redirect to index.html.

## Safe workflow rules
1. Inspect relevant files before editing.
2. Produce a short plan before edits.
3. Name affected files before making changes.
4. Keep diffs small and reviewable.
5. Avoid unrelated refactors.
6. Preserve safety/crisis content, accessibility, SEO metadata, public site behavior, and PWA behavior.
7. Include acceptance criteria, validation steps, and rollback notes.
8. Ask for clarification when the requested change is ambiguous.

## Validation guidance
- npm run serve starts the local static server from scripts/static-server.mjs. On Windows PowerShell, prefer `npm.cmd run serve`.
- npm test runs the full Playwright suite. On Windows PowerShell, prefer `npm.cmd test`.
- npm run test:public runs the public-facing Playwright tests. On Windows PowerShell, prefer `npm.cmd run test:public`.

## Notes for future agents
- Edits to index.html may affect both the public landing page and the embedded app experience.
- Larger system or evidence-related changes should reference docs/AI-Systems-MOC.md and docs/State-Not-Fate-MOC.md.
- When in doubt, ask before applying a change.
