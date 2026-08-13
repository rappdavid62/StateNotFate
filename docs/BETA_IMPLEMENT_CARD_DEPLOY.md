# Beta-only deploy (implement-card)

David Rapp granted **one-time** permission to apply these updates to **BETA only**:
https://statenotfatebeta.netlify.app

Do **not** promote to production https://statenotfate.netlify.app until separately approved.
Hostname gating keeps the BETA chip / collapse-first defaults off on the production host even if the same files are deployed.

## Deploy steps (beta site only)

Netlify auth token was not available in the cloud agent environment, so deploy from a machine with access:

```bash
# from repo root, on this branch
git checkout CursAge/beta-implement-card-0a2b
npm install

# Link / select the BETA site (statenotfatebeta), not production
npx netlify login
npx netlify link   # choose statenotfatebeta / site id for beta
npx netlify status # confirm site URL includes statenotfatebeta

# Deploy draft preview first, then production of the BETA site only
npx netlify deploy --dir=. --message "implement-card beta $(git rev-parse --short HEAD)"
npx netlify deploy --dir=. --prod --message "implement-card beta $(git rev-parse --short HEAD)"
```

If the beta site is already linked via Git to branch `beta` or this PR branch, merge/push to that Netlify branch context instead of a CLI prod deploy.

## Verify after deploy

1. https://statenotfatebeta.netlify.app shows sticky **BETA** banner + build stamp within 3 seconds.
2. https://statenotfate.netlify.app does **not** show BETA (if production still on older build) — and even with identical files, production hostname suppresses the chip.
3. Lock screen shows “Help is never locked” with 988 / HOME→741741 / 911 / Safe Box without PIN.
4. Collapse energy on beta shows single next-action home + “Show full Main Frame”.
5. Settings → Danger zone holds Lock App + Reset Intake with confirm modals.
6. `/manifest.json` lists icon-192 / icon-512 (maskable).
