# Canonical Job Pipeline Contract

Status: dry-run only  
Policy version: `2026-07-24-v1`  
Outbound actions: disabled

This package converts the system-design document into a machine-checkable contract. It does not activate either job-search automation, send a message, schedule an interview, submit an application, or write to Google Drive or AI Wisebase.

## Current evidence boundary

- Confirmed on 2026-07-24: `daily-remote-job-opportunity-scan` is paused.
- Confirmed on 2026-07-24: the older `daily-remote-job-scan` is also paused.
- Confirmed local snapshot: the newest job-pipeline queue, router, profile, and playbook artifacts are dated 2026-07-22.
- Confirmed drift: `candidate-profile-v1.json` and `daily-job-search-playbook.md` still describe `daily-remote-job-scan` as active.
- Corrected current state: a read-only Gmail recheck on 2026-07-24 found that Acme Lock & Door rejected the Access Control Technician application on 2026-07-20. The older invitation and both unsent drafts do not create a reply-now action.
- Reconciled application proposals: DataAnnotation, TELUS US Raters, TELUS Online Data Analyst, and Aircall are held at `lead_review`; Element451 is held at `backup`. Public role state and unavailable authenticated applicant state remain explicitly separate.
- Effective queue: one closed record, four wait records, four lead-review records, one backup record, and zero authorized outbound actions.
- Unavailable: the referenced `chatgpt-conversation://` document cannot be read by the current tools.
- External write pending: Google Drive native conversion and AI Wisebase ingestion require explicit user approval.

## Files

- `job-pipeline-schema-v1.json` — canonical state and safety contract.
- `job-pipeline-policy-v1.json` — lanes, queues, resume registry, freshness rules, deduplication, approval boundary, and rollout gates.
- `handoff-manifest-v1.json` — exact Google Drive and AI Wisebase handoff plan.
- `verify_job_pipeline_contract.mjs` — dependency-free validator and July 22 queue dry-run.
- `dry-run-2026-07-24.md` — verified result and the next safe transition.
- `current-state-delta-2026-07-24.md` — current Gmail reconciliation that closes the stale Acme reply-now row.
- `current-state-acme-2026-07-24.json` — schema-shaped terminal state transition for that live validation event.
- `current-state-dataannotation-2026-07-24.md` — current role verification separated from unavailable applicant-account state.
- `current-state-dataannotation-2026-07-24.json` — safe `lead_review` transition that supersedes the stale apply instruction.
- `current-state-telus-2026-07-24.md` — current public role evidence separated from unavailable TELUS account state.
- `current-state-telus-2026-07-24.json` — safe review-only transitions for both stale TELUS apply instructions.
- `current-state-support-roles-2026-07-24.md` — current Aircall and Element451 requirements plus evidence gaps.
- `current-state-support-roles-2026-07-24.json` — safe `lead_review` and `backup` transitions for the two support roles.
- `effective-queue-2026-07-24.md` — compact post-reconciliation queue for human and retrieval handoff.

## Canonical model

The proposed transaction store is one local state package in the existing job-search workspace. Gmail, public job sources, Google Drive, AI Wisebase, GitHub, and local artifacts are evidence inputs. Queue files, dated reports, Google Docs, and Wisebase knowledge are projections.

No derived projection may silently become authoritative for current application or contact state.

## Dry-run command

```powershell
node .\verify_job_pipeline_contract.mjs "C:\Users\rappd\Documents\Codex\2026-06-18\goal-search-the-internet-as-well\outputs\job-service-inbox-queue-2026-07-22.csv" --as-of "2026-07-24T12:00:00-04:00"
```

Expected safety behavior:

- unchanged or duplicate records merge by stable key and material fingerprint;
- all proposed applications, replies, and scheduling actions remain unauthorized;
- outbound proposals older than the freshness window require a new source read;
- application proposals without reconciled contact history remain blocked;
- wait/log-only records may be normalized locally without contacting anyone.

## Token yield

The highest-cost waste is repeatedly researching and summarizing known companies while application/contact state remains unknown. This contract shifts the unit of work from “sources scanned” to “verified state transition or completed approved action.”

The next run should load only:

1. this policy;
2. the canonical state package when created;
3. the newest source event;
4. the relevant resume family.

## Next exact action

David must explicitly approve the Google Drive and AI Wisebase external writes before the staged handoff can be published. In parallel, provide the authenticated account/application states named in `effective-queue-2026-07-24.md`; only then may one verified role become an approval-ready action card.
