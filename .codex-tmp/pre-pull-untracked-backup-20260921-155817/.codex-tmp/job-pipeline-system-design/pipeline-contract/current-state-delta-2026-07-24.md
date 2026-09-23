# Current Job-Pipeline State Delta — 2026-07-24

## Bottom line

The Acme Lock & Door item is **closed/rejected**, not `reply-now`.

Do not send either Acme draft and do not use the older Calendly invitation as a current action.

## Read-only Gmail scope

Query:

```text
in:anywhere "Acme Lock & Door" after:2026/07/19 -in:spam -in:trash
```

Coverage:

- all matching Gmail messages after 2026-07-19;
- the original invitation thread and its unsent draft;
- the application-update message and its separate unsent draft.

No Gmail state was changed.

## Current evidence

1. The employer sent an Access Control Technician prescreen invitation on 2026-07-01.
2. The employer sent an application update on 2026-07-20 stating that it moved forward with another candidate.
3. An unsent recovery reply to the recruiter was drafted on 2026-07-21.
4. A separate unsent draft to a no-reply address contains malformed text and quotes the rejection.

The July 20 employer decision is the newest terminal employer event. It outranks the older invitation and both drafts.

## Canonical correction

| Field | Prior snapshot | Corrected state |
|---|---|---|
| Queue | `reply_now` | `closed` |
| Contact state | `reply_now` | `rejected` |
| Contact history | unknown | `rejected` |
| Proposed action | reply or schedule | `none` |
| Authorized action | `none` | `none` |
| Draft handling | review/send | do not send; retain unchanged unless David requests cleanup |
| Resume family | low-voltage field tech | historical only; no current packet action |

## Policy adjustment

Before a queue item becomes `reply_now` or `apply_today`, reconcile:

1. newer employer or platform decisions;
2. sent mail;
3. existing drafts;
4. current role status;
5. prior application, assessment, rejection, and contact history.

A verified terminal event such as rejection, withdrawal, filled role, or closed application supersedes older invitations, alerts, queue rows, and drafts.

## Safety verification

- Employer messages sent: 0.
- Applications submitted: 0.
- Interviews scheduled: 0.
- Gmail drafts changed or deleted: 0.
- Authorized outbound actions: 0.

## Next exact action

Remove Acme from the effective reply-now view when the canonical ledger is implemented. Then reconcile one of the five remaining application candidates against current account history and a current employer role page before preparing an approval card.
