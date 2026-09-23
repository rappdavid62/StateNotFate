# State Not Fate Automation Control Plane

This folder contains the local control plane for the State Not Fate automation stack. It is a safety boundary, not an autonomous deployer. Its only side effects are writing queue state and an event log beneath the ignored `outputs/` directory.

## Operating model

```text
DOV (canonical when directly available)
          |
          v
  Research / Writing / Insight / Video producers
          |  local artifacts + AUTOMATION_EVENT_V1
          v
      Control-plane queue -------------------------------+
          |                                               |
          | local-only work                               | external effect
          v                                               v
  artifact package -> human/reviewer -> explicit approval record
                                                          |
                                                          v
                                            GitHub / Netlify / Drive / Wisebase
                                            (separate connector or human action)
```

The seven lanes are `research`, `writing`, `insight`, `video`, `maintenance`, `storage`, and `github`.

- Research produces source-grounded briefs and evidence ledgers.
- Writing produces essays and reports only after a source check.
- Insight produces synthesis that distinguishes evidence from inference.
- Video produces a script, storyboard, captions, and a safety review packet; publishing is a separate external task.
- Maintenance produces an audit, local fix proposal, tests, and a release candidate; deployment is a separate external task.
- Storage packages local artifacts for Google Drive or AI Wisebase; upload is a separate external task.
- GitHub records review, issue, pull-request, or release tasks. It does not call GitHub itself.

## Safety contract

The queue distinguishes local preparation from external effects. These effects cannot be claimed until an explicit approval record is supplied:

- `github_write`
- `netlify_deploy`
- `drive_upload`
- `wisebase_upload`
- `public_publish`
- `delete`

Approval only makes a task claimable. It does not execute the action. A worker must still use the appropriate connector or a human-reviewed procedure, then record completion. This prevents a cached task, a stale browser session, or an accidental scheduler retry from publishing or deleting content.

All event log entries are machine-readable lines beginning with `AUTOMATION_EVENT_V1`. The existing Continuity & Knowledge Base Router can consume the latest stable fingerprint without re-reading the full queue.

## Local use

All examples are local-only. Replace `DEMO_TASK_ID` with the identifier returned by `enqueue`.

```powershell
node automation/control-plane.mjs init
node automation/control-plane.mjs enqueue --lane research --title "Verify one source" --source DOV --fingerprint research-source-001
node automation/control-plane.mjs enqueue --lane storage --title "Prepare reviewed research packet for Drive" --effect drive_upload --source local-artifact --fingerprint drive-packet-001
node automation/control-plane.mjs approve --task DEMO_TASK_ID --approval-id approved-in-review-2026-08-23
node automation/control-plane.mjs claim --task DEMO_TASK_ID --worker research-producer
node automation/control-plane.mjs complete --task DEMO_TASK_ID --worker research-producer
node automation/control-plane.mjs recover
node automation/control-plane.mjs status
```

Runtime files live under `outputs/automation-control-plane/` and are ignored by Git. Prepared artifacts belong under `outputs/automation-artifacts/<lane>/`; committing an artifact to the repository, uploading it, publishing it, or deploying it requires the relevant approval gate outside this tool.

## Job inbox routing

The local job inbox router converts a single job-service event into a structured decision without performing any outbound action. It reads the canonical contract in `docs/job-inbox-reply-contract-2026-08-30.json`, chooses the resume family, classifies the queue, and prepares a reply draft only when the event is a true human callback or scheduling request.

The router now has a stable event-packet shape in `automation/job-inbox-event-schema-v1.json`, plus reusable examples in `automation/examples/job-inbox-events/`.
It can also read `docs/job-platform-account-state-2026-08-31.json` so repeated platforms such as TELUS or DataAnnotation are handled as existing account flows instead of fresh unknowns every time.
For real callback threads, `compose` returns a reusable reply packet with the mapped resume artifact, draft, approval block, and next-action note in one JSON output.

Examples:

```powershell
node automation/job-inbox-router.mjs summary --contract docs/job-inbox-reply-contract-2026-08-30.json
node automation/job-inbox-router.mjs validate --event automation\examples\job-inbox-events\lead-review-welo-data.json
node automation/job-inbox-router.mjs route --contract docs/job-inbox-reply-contract-2026-08-30.json --event path\to\job-event.json
node automation/job-inbox-router.mjs compose --contract docs/job-inbox-reply-contract-2026-08-30.json --event automation\examples\job-inbox-events\reply-now-human-outreach.json
node automation/job-inbox-router.mjs route --contract docs/job-inbox-reply-contract-2026-08-30.json --event path\to\job-event.json --account-state docs\job-platform-account-state-2026-08-31.json
node automation/job-inbox-router.mjs compose --contract docs/job-inbox-reply-contract-2026-08-30.json --event path\to\job-event.json --account-state docs\job-platform-account-state-2026-08-31.json
```

Safe behavior:

- `reply_now` prepares a draft but still returns `authorized_action: none`.
- `wait` returns log-only behavior with no draft.
- `lead_review`, `save`, and `backup` stay approval-gated until David approves a specific outbound step.

## Recovery procedure

1. Run `status` and inspect only queued, running, and approval-waiting tasks.
2. Run `recover` to return expired leases to `queued`. It never bypasses an approval gate.
3. If a task has an unsafe, stale, or invalid premise, mark it failed through its worker record and create a new task with a new fingerprint.
4. If DOV direct access is unavailable, label any DOV-derived work as a fallback snapshot/index until a live direct read is available.
5. Before a Netlify production task, verify the selected deploy, routes, cache version, and production behavior. A GitHub push or a local test pass is not deployment proof.

## State Not Fate production gate

The current release gate remains separate from this queue. The homepage must allow browser zoom and `crisis.html` must say to call **911** for immediate danger before the next safety release can be approved. The production site is currently a manual Netlify drop, so a source commit cannot establish that the live site changed.
