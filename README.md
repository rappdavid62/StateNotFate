# StateNotFate - Enhanced Master Operating System v2

[![Node.js CI](https://github.com/rappdavid62/StateNotFate/actions/workflows/node.js.yml/badge.svg?branch=SNF)](https://github.com/rappdavid62/StateNotFate/actions/workflows/node.js.yml)
[![Layered CI](https://github.com/rappdavid62/StateNotFate/actions/workflows/layered-ci.yml/badge.svg?branch=SNF)](https://github.com/rappdavid62/StateNotFate/actions/workflows/layered-ci.yml)

**Smart Welcome Integration Live**

- Dynamic personalized greeting based on energy, dominantPattern, currentLayer, yesterdayFloor
- One matched first move auto-selected
- Evolving intake (more context = sharper plan)
- Full 5-year architecture with gentle long-haul framing
- Anchor Library v2 (low-energy + advanced)

Deployed on branch SNF. All council improvements included.

See smart-welcome-integration.html for standalone test.

This is 5-year systems work. Daily deposits. Restarts are data.

## Phone / Mobile Access (Obsidian + App)

The Obsidian vault (notes) and the PWA (the recovery app) are set up for cross-device use, but mobile sync requires correct platform-specific configuration.

### Obsidian Vault on Mobile (Phone & Tablet)

An Obsidian vault is just a local folder of markdown files. Because mobile operating systems restrict file system access, you cannot natively open a OneDrive cloud folder in the mobile Obsidian app. Choose the method below that matches your devices:

#### Option 1: iCloud Drive (Recommended if using iPhone or iPad)
If your mobile devices are iOS/iPadOS, this is the most reliable, free native method:
1. **On Windows PC**: Install **iCloud for Windows** from the Microsoft Store.
2. **Move Vault**: Move your `ObsidianVault` folder from `OneDrive\Desktop` into your `iCloud Drive\Obsidian` folder (it will be created automatically once you install Obsidian on iOS).
3. **On iPhone/iPad**: Install Obsidian from the App Store. When you open it, select **"Create new vault"** or **"Open folder as vault"** and select the folder inside iCloud Drive. It will sync automatically.

#### Option 2: OneDrive + OneSync App (If using Android Phone or Tablet)
Android doesn't let Obsidian read directly from the OneDrive app. You need a background sync tool:
1. **On Android**: Install **OneSync** (Autosync for OneDrive) from the Google Play Store.
2. **Configure Sync**: Link your OneDrive account and pair the `Desktop/ObsidianVault` cloud folder with a local folder on your Android storage (e.g., `/Documents/ObsidianVault`). Set it to sync automatically.
3. **On Mobile Obsidian**: Install Obsidian, choose **"Open folder as vault"**, and navigate to the local folder paired by OneSync.

#### Option 3: Git (Works on iOS, Android, and Windows — Free & Secure)
Since you already have your PWA code in Git, you can sync your notes using a private GitHub repository:
1. **Clean Desktop**: We have already deleted the corrupted `.git` folder in `C:\Users\rappd\OneDrive\Desktop\ObsidianVault` to prevent OneDrive conflicts.
2. **Create Repo**: Create a new **private** GitHub repository named `ObsidianVault`.
3. **Initialize & Push**:
   ```powershell
   cd "C:\Users\rappd\OneDrive\Desktop\ObsidianVault"
   git init
   git remote add origin https://github.com/rappdavid62/ObsidianVault.git
   git add .
   git commit -m "Initial vault commit"
   git branch -M main
   git push -u origin main
   ```
4. **On Phone/Tablet**: Install Obsidian and download the **Obsidian Git** plugin.
5. **Configure Mobile Git**: Use the plugin to clone the repository using a GitHub **Personal Access Token (PAT)** for authentication.

#### Option 4: Obsidian Sync (The Official Paid Path)
If you want zero configuration:
1. Subscribe to **Obsidian Sync** ($4-$10/month).
2. Enable it in Obsidian on your desktop under Settings > Core Plugins > Sync.
3. Open Obsidian on your phone/tablet, log in, and connect to the sync vault.

---

### The PWA / Recovery App on Phone
- This is a static PWA (index.html + app.js + service-worker for offline).
- **To use on phone**:
  - Visit the deployed HTTPS version (Netlify or your domain from the SNF branch deploy – check your Netlify dashboard for the live URL).
  - Add to home screen (install as PWA) for standalone mode.
  - The service worker (cache v11) handles offline after first load. It refreshes navigations, HTML, `app.js`, and `index.css` from the network when available, then falls back to the cache. If it says "not connected", ensure you have internet for the initial load from the deployed URL (localhost testing won't work on phone).
  - Manifest is set for portrait, theme teal, etc.
- If issues: Clear browser cache / reinstall PWA. The app is local-first (state in browser storage), no server "connection" beyond initial load.

## Developer Quick Reference

This is a no-framework static site. The local server is the canonical browser test path:

```bash
npm install
npm run serve          # http://127.0.0.1:4173
npm run health         # routing, cache, and repository checks
npm run test:public    # public-site Playwright checks
npm test               # full Playwright suite
```

### Public routes and aliases

Netlify and `scripts/static-server.mjs` keep these pretty URLs aligned with their
HTML files:

| URL | HTML file | Purpose |
| --- | --- | --- |
| `/` | `index.html` | Public landing page and local recovery app shell |
| `/evidence` or `/sources` | `evidence.html` | Evidence and source index |
| `/suicide-prevention` | `suicide-prevention.html` | Public safety and prevention appendix |
| `/education-reader` or `/reader` | `education-reader.html` | 18-unit Suicide Compendium Education Reader v3.0 |
| `/essays` | `essays.html` | Essays and core philosophy |
| `/contact` or `/join` | `contact.html` | Contact and participation |
| `/crisis` or `/help` | `crisis.html` | Immediate support routing |

The Education Reader is research-literacy content only: it does not provide
clinical care, diagnosis, therapy, or personalized risk calculation. Its 988 and
911 links must remain immediately available.

### PWA and responsive-shell constraints

`service-worker.js` precaches the core landing, evidence, contact, crisis,
404, prevention, and essays HTML pages plus shell assets under
`state-not-fate-cache-v11`. The Education Reader is network-first when visited
and is cached after a successful load. Core-shell requests are network-first with
offline fallback; other same-origin GETs remain cache-first. When adding a
precached page or changing the cache contract, update `ASSETS_TO_CACHE`, bump
`CACHE_NAME`, and extend the service-worker tests.

The private dashboard is a full-width application shell. At tablet widths
(769–1100px), its dashboard cards use one column; at mobile widths (768px and
below), the sidebar is hidden and the bottom navigation is shown. Validate shell
changes at both a tablet viewport (for example, 960px) and a mobile viewport.

### GitHub Connection Notes
- Repo is primarily the PWA code + some synced notes/MOCs in /docs/.
- Phone access to GitHub: Use the GitHub mobile app for code review, or browser for the live PWA.
- If trying to sync notes via git on phone to this repo: See Obsidian section above.

If these steps don't resolve the phone connection (e.g., specific error message on phone?), share the exact error and I'll dig deeper or propose more targeted fixes (e.g., update service worker, add better mobile instructions in code).