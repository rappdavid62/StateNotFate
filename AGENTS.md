# AI Agent Instructions for State Not Fate

## Purpose
This repository is a static PWA / public website for the State Not Fate recovery project. AI coding agents should treat it as a browser-first, no-framework static app with Playwright tests for quality checks.

## Key Code Areas
- `index.html` - public landing page plus the embedded local app UI screens.
- `index.css` - site and app styling.
- `app.js` - primary application logic, onboarding flows, state management, PWA registration, and user interactions.
- `service-worker.js` - offline support and caching behavior for the PWA.
- `tests/public/` - Playwright end-to-end checks for homepage, accessibility, SEO, safety, and evidence pages.
- `package.json` - developer scripts and Playwright dependency.
- `netlify.toml` - static hosting configuration, client-side routing fallback, and security headers.
- `docs/` - extended architecture and systems thinking notes; link here rather than duplicating.

## Recommended Agent Behavior
- Prefer minimal, precise changes. This is a static site, so do not introduce a JavaScript framework or server-side dependencies unless the user explicitly requests them.
- Preserve accessibility, SEO, and safety/care guidance. The site includes mental health safety content, crisis pages, and public-facing evidence resources.
- Keep PWA semantics intact: service worker registration, manifest usage, and `localStorage` state persistence are core behaviors.
- Use `npm test` and `npm run test:public` to validate changes with Playwright.
- Use `npm run serve` to run the local static server before verifying UI changes in a browser.

## Build / Test Commands
- `npm install` - install dev dependencies
- `npm run serve` - launch the static server from `scripts/static-server.mjs`
- `npm test` - run full Playwright suite
- `npm run test:public` - run the public-facing test subset in `tests/public`

## Important Notes
- This repo is not a framework-based app. It uses plain HTML, CSS, and vanilla JavaScript.
- Application state is sandboxed to the browser via `localStorage`; there is no backend state.
- Edits to `index.html` can affect both the public landing page and the embedded app experience.
- `netlify.toml` expects a static deployment with a fallback redirect to `index.html`.
- `docs/AI-Systems-MOC.md` and `docs/State-Not-Fate-MOC.md` contain domain context and should be referenced when adding larger system or evidence-related changes.

## Useful Links
- `README.md` - project overview and phone/mobile sync notes
- `netlify.toml` - deployment and security header rules
- `tests/public/` - canonical acceptance tests for public site behavior

## Suggested Next Customization
If we want stronger automation, add a skill for Playwright-based public site validation or a custom agent prompt targeting static PWA maintenance.
