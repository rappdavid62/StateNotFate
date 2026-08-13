# Beta-only deploy (implement-card)

David Rapp granted **one-time** permission to apply these updates to **BETA only**:
https://statenotfatebeta.netlify.app

| Site | Site ID | Deploy? |
|------|---------|---------|
| **statenotfatebeta** | `38ca3a04-5be4-49aa-bec9-3074dd89a521` | YES — only this site |
| statenotfate (production) | `7edc347d-9ad4-4e43-8d19-4dc238c4ee35` | **NEVER** from this card |

Hostname gating keeps the BETA chip / collapse-first defaults off on the production host even if the same files are later promoted.

## Deploy (beta site only)

Cloud agent had **no** `NETLIFY_AUTH_TOKEN`. From a machine where David is logged into Netlify:

```bash
git checkout CursAge/beta-implement-card-0a2b
git pull origin CursAge/beta-implement-card-0a2b

# Draft preview first (optional)
npx netlify deploy --site=38ca3a04-5be4-49aa-bec9-3074dd89a521 --dir=.

# Production deploy of the BETA site only (not statenotfate)
npx netlify deploy --site=38ca3a04-5be4-49aa-bec9-3074dd89a521 --prod --dir=.
```

Do **not** use `--site=7edc347d-9ad4-4e43-8d19-4dc238c4ee35` or an unscoped `netlify link` that points at production.

## Verify after deploy

1. https://statenotfatebeta.netlify.app — sticky **BETA** banner + build stamp within 3 seconds.
2. https://statenotfate.netlify.app — must **not** show BETA (and even with identical files, production hostname suppresses the chip).
3. Lock screen: “Help is never locked” with 988 / HOME→741741 / 911 / Safe Box without PIN.
4. Collapse energy on beta → single next-action home + “Show full Main Frame”.
5. Settings → Danger zone: Lock App + Reset Intake with confirm modals.
6. `/manifest.json` lists icon-192 / icon-512 (maskable).
