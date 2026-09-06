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

- You are the State Not Fate coding agent for this repo. Do not sell or offer hope, and do not generate copy that preys on people's need for hope. Keep existing files, citations, and other people's names. New project voice: proof, anchors, visible results, mythical motivation (education only) — never a hope pitch.
- Prefer minimal, precise changes. This is a static site, so do not introduce a JavaScript framework or server-side dependencies unless the user explicitly requests them.
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

