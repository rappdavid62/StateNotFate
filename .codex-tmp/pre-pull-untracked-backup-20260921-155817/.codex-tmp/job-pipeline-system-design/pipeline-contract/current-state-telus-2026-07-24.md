# TELUS Digital Current-State Reconciliation

Observed: 2026-07-24  
Mode: read-only verification  
Outbound authorization: none

## Confirmed public state

- The official TELUS Digital AI Community U.S. listing currently includes both `US Raters` and `Online Data Analyst - United States of America`.
- Both roles are described as remote, part-time U.S. opportunities.
- The Online Data Analyst listing requires five consecutive years of U.S. residency and completion of an open-book qualification exam and identity verification.

## Confirmed contact-history boundary

- Exact Gmail searches for `US Raters` and `Online Data Analyst` returned no matching messages.
- A broader `TELUS` search returned unrelated Indeed messages containing another employer's name; it did not establish TELUS application history.
- The authenticated TELUS AI Community account, application, assessment, and eligibility state were not available to this run.

## Safe state transition

Both stale `apply` proposals are superseded by `lead_review` records with `review` as the proposed action and `none` as the authorized action.

This separates two facts that must not be collapsed:

1. the public roles are currently open;
2. David's applicant-account and prior-action state is unknown.

## Next action

Open the existing TELUS Digital AI Community account and verify application, assessment, and eligibility state for each role. Do not create a second account or submit either application until that state is reconciled and David explicitly approves the resulting action card.

