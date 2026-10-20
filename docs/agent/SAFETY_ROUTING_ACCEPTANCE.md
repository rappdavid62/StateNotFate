# Issue #5: support-routing replacement

Reviewed 2026-10-20 against [issue #5](https://github.com/rappdavid62/StateNotFate/issues/5), its accepted session-state discussion, and [issue #6](https://github.com/rappdavid62/StateNotFate/issues/6). Baseline: `SNF` at `e8570efe6fee74ee917357475a55581d7f1e8642`.

## Behavior

`src/safety-routing.js` provides a shared, deterministic interface mode for the main PWA, public crisis page, and standalone Polaris app. It does not assess or rank a person's suicide risk.

- Crisis Help, Quick Safety Plan, Emergency Floor, and the support-plan opener provide resources without intake, account setup, or a PIN. Private saved contacts still require the ordinary unlock flow when PIN-protected.
- The dialog offers United States and Canada profiles, an international directory/local-emergency fallback, saved unlocked contacts, and a copyable help request. Country selection does not infer or store location.
- Ordinary coaching, quest completion, proof/XP awards, and progress mutations pause. Both visible UI and action entry points are guarded.
- A small phrase trigger routes chat disclosures before storing or transmitting the message. It cannot recognize every disclosure; the manual Crisis Help route remains available.
- Successful model replies already in flight are discarded if a support session began while the request was pending, including if the user has since returned to their plan.
- Neutral messages, resource launches, re-renders, reloads, and Back/Forward do not resolve the mode. “Return to my plan” and Escape are explicit exits; neither requires a safety attestation.

## Persistence and boundaries

The tab's `sessionStorage` stores only:

```json
{"event":"safety-routing-opened"}
```

It stores no disclosure, inferred reason, score, category, timestamp, contact copy, or location. Existing saved history is preserved. Old numeric flags no longer determine the current interface mode. The session follows the browser tab: an independent new tab starts ordinary; reloads and same-tab navigation retain the marker. Back/Forward-restored pages reconcile it. When browser storage is unavailable, routing remains usable in memory; reload persistence cannot be guaranteed in that condition.

The old assessment forms, risk badge, score fallbacks, and production imports are removed. `src/safety-detection.js` is marked experimental/quarantined. It and the old scoring integration/router are excluded from Netlify deployment. The new routing assets are precached and revalidated; offline `/crisis` falls back to the cached crisis page rather than the homepage. Service-worker cache: `v15`.

## Acceptance checks

| Requirement | Automated coverage |
| --- | --- |
| No generated numeric/categorical suicide-risk assessment | Production source exclusion guard; deterioration browser case; old category-based test migrated to explicit routing mode |
| No method/access/timeline assessment questions | HTML exclusion guard and removal of the expanded assessment UI |
| Crisis help without intake/account/PIN | Fresh public route, real lock-screen link, and failed-script fallback |
| Pause ordinary quests/rewards | Main action writers, reflection callback, standalone proof/XP/quests; explicit exit restores proof actions |
| Session continuity without inferred resolution | Neutral message, resource click, navigation, reload, Back, independent new tab, explicit return, Escape |
| Minimal persistence and private contacts | Exact opened-event shape; no stored/transmitted disclosure; contact HTML rendered as text; PIN-protected contacts concealed |
| Deterministic regional configuration | Source IDs on configured resources; US/Canada links; unsupported/prototype-key fallback |
| Safe technical failure behavior | Storage failure, script failure, pending model reply, installed-PWA offline reload and public crisis route |

Commands: `npm run test:unit`, `npm run test:integration`, `npm run health`, and `npm test`. The browser cases live in `tests/public/safety-integration.spec.ts`; module checks live in `tests/unit/safety-routing.test.mjs`.

Baseline verification reproduced an unrelated ambiguous safety-copy selector and external Google Fonts loading failures. The selector is narrowed to the public-site container. Browser transport in this execution environment requires its outbound proxy and a test-only certificate exception for that proxy; the production configuration and HTTPS behavior are unchanged. Record final run counts in the PR verification section.

Two independent council review passes covered specification compliance and repository standards. Review found and prompted fixes for a reflection callback that could award progress in memory, the missing locked-screen opener, and missing support options on the public crisis page. Both reviewers subsequently reported no remaining reproduced #5 blocker.

## Resource provenance

Resource details were checked against their providers on 2026-10-20:

| Source ID | Provider |
| --- | --- |
| `988-lifeline` | [988 Lifeline](https://988lifeline.org/) and [chat](https://988lifeline.org/chat/) |
| `988-canada` | [Canada 9-8-8](https://988.ca/) |
| `find-a-helpline` | [Find A Helpline](https://findahelpline.com/) |

## Issue #6 remains open

Ordinary Polaris chat still uses free-form model responses. The routing guard is not a structured-response validator. The next separate implementation must:

1. Version a response schema for `recovery`, `education`, `restart`, and `safety-routing`.
2. Enforce one primary action plus an optional tiny version, action-count limits, and energy-state fit.
3. Validate explanation source IDs against an approved registry and reject unsupported claims.
4. Check privacy leakage and prohibited safety content deterministically.
5. Fall back to deterministic local Polaris rules for invalid output, parse/transport failure, or unavailable sources.
6. Test low energy, collapse, restart, privacy, and safety-routing through the actual model-response boundary.

Do not close #6 or describe this branch as satisfying that contract. Production merge/deployment is a separate transition from this reviewed branch.
