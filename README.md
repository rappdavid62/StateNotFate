# StateNotFate - Enhanced Master Operating System v2

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

The Obsidian vault (notes) and the PWA (the recovery app) are set up for cross-device use, but phone sync has common pitfalls.

### Obsidian Vault on Phone (Primary Notes Access)
- Vault location: OneDrive/Desktop/ObsidianVault (hybrid OneDrive + git via obsidian-git plugin).
- **Obvious issue found**: .git folder exists but git commands fail to recognize it as a repo (possible corruption from OneDrive trying to sync .git internals, which are many small files and don't play well with cloud sync). There are also .tmp.drivedownload / .tmp.driveupload artifacts indicating OneDrive sync hiccups.
- **Recommended fix steps (do on desktop first)**:
  1. Backup the entire vault folder.
  2. Pause or unlink OneDrive sync for the ObsidianVault folder (or exclude the .git subfolder if OneDrive allows selective sync).
  3. In terminal (PowerShell): cd "OneDrive\Desktop\ObsidianVault"
     - Try `git fsck --full` to check/repair.
     - If broken: `rm -rf .git` (after backup), then `git init`, `git add .`, `git commit -m "re-init after sync issue"`.
     - Set remote if needed: `git remote add origin https://github.com/rappdavid62/StateNotFate.git` (note: this repo is mainly the PWA code; notes/MOCs have been pushed to /docs/ in past).
  4. On phone:
     - Install OneDrive app, sign in with same account, make the ObsidianVault folder "Available offline" or fully download.
     - Open Obsidian mobile app > Open folder as vault > navigate via OneDrive/Files to the vault.
     - For git on phone (advanced/limited): Use "Working Copy" app (iOS) or equivalent + Obsidian Git plugin. Full git on mobile is tricky; desktop is better for pushes/pulls.
- Alternative for seamless phone sync: Obsidian Sync (paid feature) instead of OneDrive/git hybrid.

### The PWA / Recovery App on Phone
- This is a static PWA (index.html + app.js + service-worker for offline).
- **To use on phone**:
  - Visit the deployed HTTPS version (Netlify or your domain from the SNF branch deploy – check your Netlify dashboard for the live URL).
  - Add to home screen (install as PWA) for standalone mode.
  - The service worker (cache v5) handles offline after first load. If it says "not connected", ensure you have internet for the initial load from the deployed URL (localhost testing won't work on phone).
  - Manifest is set for portrait, theme teal, etc.
- If issues: Clear browser cache / reinstall PWA. The app is local-first (state in browser storage), no server "connection" beyond initial load.

### GitHub Connection Notes
- Repo is primarily the PWA code + some synced notes/MOCs in /docs/.
- Phone access to GitHub: Use the GitHub mobile app for code review, or browser for the live PWA.
- If trying to sync notes via git on phone to this repo: See Obsidian section above.

If these steps don't resolve the phone connection (e.g., specific error message on phone?), share the exact error and I'll dig deeper or propose more targeted fixes (e.g., update service worker, add better mobile instructions in code).