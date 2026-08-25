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
- Use `npm test` and `npm run test:public` to validate changes with Playwright. On Windows PowerShell, prefer `npm.cmd test` and `npm.cmd run test:public`.
- Use `npm run serve` to run the local static server before verifying UI changes in a browser. On Windows PowerShell, prefer `npm.cmd run serve`.

## Styling Conventions (Utility Classes & Maintainability)

- Prefer extracting repeated or common inline styles into reusable utility classes in the relevant CSS file (primarily `index.css`, or version-specific files such as those under experimental Polaris builds).
- When working on Polaris versioned UI (e.g. polaris-22.x, 23.x, 24.x, 25.x), use clear version-prefixed utility class names (pattern: `.polaris-NN-x-u-N { ... }`) to avoid collisions and improve long-term maintainability.
- Replace `style="..."` attributes on HTML elements with the corresponding utility class for common properties: font-size, margin, padding, color, border-color, display, flex/gap, width, background, border-radius, etc.
- Collect the utility class definitions in a clearly marked block at the end of the CSS (e.g. `/* Extracted Utility Classes */`).
- Benefits: reduced HTML noise, consistent design tokens, easier responsive and theme changes, better reviewability of diffs.
- Example approach (as used in Polaris 22.x–25.x UI cleanups):
  - Define `.polaris-25-x-u-1 { font-size:18px }`
  - Define `.polaris-25-x-u-2 { display:flex;gap:8px }`
  - Update the matching HTML elements to use the class instead of the inline style.
- Do not invent new global utility systems (Tailwind, etc.) unless explicitly requested; keep the approach lightweight and local to the files being edited.

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
- `netlify.toml` expects a static deployment with a fallback redirect to `index.html`.
- `docs/AI-Systems-MOC.md` and `docs/State-Not-Fate-MOC.md` contain domain context and should be referenced when adding larger system or evidence-related changes.

## Useful Links

- `README.md` - project overview and phone/mobile sync notes
- `netlify.toml` - deployment and security header rules
- `tests/public/` - canonical acceptance tests for public site behavior

## Suggested Next Customization

If we want stronger automation, add a skill for Playwright-based public site validation or a custom agent prompt targeting static PWA maintenance.

### Android Development & Tooling

- **Android CLI Path:** The Android CLI is located at `C:\Users\rappd\AppData\AndroidCLI\android.exe`. Use the absolute path if PowerShell environment variables are not refreshed.
- **Silent Background Installation:** When installing tools or SDKs via `winget` or other package managers in a background command, ALWAYS use the `--silent` or `/S` flags to prevent execution hangs from silent UAC or interactive prompts.
- **Obsidian Sync:** When documenting system structures, environment configurations, or troubleshooting runbooks, save them directly in the Obsidian Vault (`C:\Users\rappd\OneDrive\Desktop\ObsidianVault\STATENOTFATE/`) to ensure the user has stable and accessible offline reference manuals.
- **Local Persistence:** Default to offline-first local persistence (like Room Database or Preferences DataStore on Android, and localStorage on Web) to honor the privacy and "sanctuary" philosophy of State Not Fate.
