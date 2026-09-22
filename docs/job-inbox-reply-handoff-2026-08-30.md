# Job Inbox Reply Handoff

Date: 2026-08-30  
Purpose: durable handoff for David Rapp's second brain and AI inbox so future job-service messages can be classified, matched to the right resume family, and drafted safely without pretending approval already exists.

## Bottom Line

The routing logic already existed in rough form, but it was buried in `.codex-tmp` and stale on the actual queue. This handoff plus the paired JSON contract turn that into one current workspace artifact keyed to the evidence from 2026-08-30.

Current safe state:

- `reply-now` items: `0`
- strongest net-new lead with direct outreach: `Welo Data`
- strongest carry-forward AI-eval lanes still live: `DataAnnotation` and `TELUS Online Data Analyst`
- best currently verified W-2 support stretch: `TeamSnap`
- all outbound actions still require explicit approval from David

## Canonical Contract

- Machine-readable routing contract: [job-inbox-reply-contract-2026-08-30.json](/C:/Users/rappd/OneDrive/Desktop/SNF_Deploy/docs/job-inbox-reply-contract-2026-08-30.json)
- Platform account-state registry: [job-platform-account-state-2026-08-31.json](/C:/Users/rappd/OneDrive/Desktop/SNF_Deploy/docs/job-platform-account-state-2026-08-31.json)
- Event packet schema: [job-inbox-event-schema-v1.json](/C:/Users/rappd/OneDrive/Desktop/SNF_Deploy/automation/job-inbox-event-schema-v1.json)
- Example event packets: [job-inbox-events](/C:/Users/rappd/OneDrive/Desktop/SNF_Deploy/automation/examples/job-inbox-events)

## Resume Families

### Remote AI / Search Quality / Prompt QA

- Primary local artifact: [remote-ai-search-quality-resume-v1.md](/C:/Users/rappd/Documents/Codex/2026-06-18/goal-search-the-internet-as-well/outputs/remote-ai-search-quality-resume-v1.md)
- Use for: `DataAnnotation`, `TELUS Online Data Analyst`, `TELUS Media Search Analyst`, `Welo Data`, prompt QA, search quality, AI workflow review, documentation-heavy AI support
- Confirmed evidence behind it:
  - Google Drive baseline profile PDF
  - GitHub `StateNotFate` work through 2026-08-28

### Remote SaaS / Product Support / Support Ops

- Primary local artifact: [remote-saas-product-support-resume-v1.md](/C:/Users/rappd/Documents/Codex/2026-06-18/goal-search-the-internet-as-well/outputs/remote-saas-product-support-resume-v1.md)
- Supporting Drive evidence: [David Rapp - Operations Logistics Inventory Resume 2026.pdf](https://drive.google.com/file/d/1ad1S7YTW8OJbhoQPPRyOZwfW4PfakTBW/view?usp=drivesdk)
- Use for: `TeamSnap`, `Everway`, customer support specialist, product support specialist, support operations, AI tool support

### Low-Voltage / Field Tech

- Drive artifact: [David Rapp - Security Low Voltage Resume 2026.pdf](https://drive.google.com/file/d/1coQ6egcNIAq7v-YyWp5GGIr_yYBNZcq6/view?usp=drivesdk)
- Local artifact: [low-voltage-field-tech-resume-v1.md](/C:/Users/rappd/Documents/Codex/2026-06-18/goal-search-the-internet-as-well/outputs/low-voltage-field-tech-resume-v1.md)
- Use for: callbacks or applications in security, low-voltage, field service, alarm, CCTV, and access-control lanes

### PRS / Care

- Drive artifact: [David_Rapp_PRS_Resume.docx](https://docs.google.com/document/d/1Kyn5Q4m6OeJFJz8uGKMkKFHBh2lHJDZy/edit?usp=drivesdk&ouid=103719185395746002128&rtpof=true&sd=true)
- Use for: peer recovery or behavioral-health support roles

## Reply Logic

## Intake Packet Shape

Required fields:

- `source_type`
- `source_label`
- `observed_at`
- `company`
- at least one of `role` or `subject`

Useful optional fields:

- `event_type`
- `sender_type`
- `body`
- `snippet`
- `contact_name`
- `requires_response`
- `scheduling_link`
- `currentness`
- `status`
- `contact_history_state`

Recommended flow:

1. Create or export an event packet using the schema in `automation/job-inbox-event-schema-v1.json`.
2. Validate the packet with `node automation/job-inbox-router.mjs validate --event <path>`.
3. Refresh `docs/job-platform-account-state-2026-08-31.json` when a platform or employer state changes, such as `started`, `applied`, `assessment_pending`, `contacted`, or `rejected`.
4. Route the validated packet through `node automation/job-inbox-router.mjs route --contract docs/job-inbox-reply-contract-2026-08-30.json --event <path>`.
5. If the result is `reply_now`, run `node automation/job-inbox-router.mjs compose --contract docs/job-inbox-reply-contract-2026-08-30.json --event <path>` to produce the reply packet.
6. Surface the mapped resume family, draft, and approval gate, then stop for approval.

## Platform State Layer

The account-state registry is the bridge between a generic inbox event and a usable real-world next step.

Use it to record:

- whether a platform account exists
- whether an application was already started
- whether an assessment is pending
- whether a recruiter thread already exists
- whether a lane is closed or rejected

This prevents the second brain from treating every repeated TELUS or DataAnnotation hit as a brand-new unknown lead.

## Reply Packet

For a true callback or scheduling email, the `compose` command produces one durable JSON packet that includes:

- mapped `resume_family`
- exact `resume_artifact`
- `draft`
- `reply_template_id`
- `approval` block with `authorized_action: none`
- `next_action`
- `platform_state` when available

That packet is the closest thing to a safe “reply-ready” object in the current system.

### `reply_now`

Use when a human recruiter, hiring manager, or interviewer asks for a reply, asks a direct question, or offers scheduling.

System behavior:

1. Pick the mapped resume family.
2. Prepare a short acknowledgement draft.
3. Surface the exact thread, evidence event, and draft.
4. Stop and wait for David's explicit approval before sending.

### `wait`

Use for automated receipts or confirmations that do not call for a reply.

System behavior:

1. Log only.
2. Do not draft.
3. Do not resurface unless a new human event arrives.

### `lead_review`

Use for public roles, digests, recruiter-style opportunities, or platform messages that still require fit review or account-state checks.

System behavior:

1. Pick the mapped resume family.
2. Check whether the account or prior-application state is already known.
3. If state is unknown, stop at review and do not imply a clean apply path.

## Current Queue

### High Priority

- `Welo Data - Maps Visual Design Relevance Evaluator`
  - Queue: `lead_review`
  - Resume family: `remote_ai_search_quality`
  - Why it matters: direct outreach on 2026-08-28 plus a live public role page
  - Blocker: privacy and consent review first

- `DataAnnotation - Generalist`
  - Queue: `lead_review`
  - Resume family: `remote_ai_search_quality`
  - Why it matters: still one of the cleanest evidence-backed fits
  - Blocker: current account and qualification state unknown

- `TELUS - Online Data Analyst - United States of America`
  - Queue: `lead_review`
  - Resume family: `remote_ai_search_quality`
  - Why it matters: close match for research, maps, relevance, and guideline-driven work
  - Blocker: current account, exam, and application state unknown

### Stretch W-2 Support

- `TeamSnap - Customer Support Specialist`
  - Queue: `lead_review`
  - Resume family: `remote_saas_product_support`
  - Why it matters: clean full-time remote support role with troubleshooting and written communication
  - Blocker: support-track-record bar is higher than the currently verified evidence

- `Everway - Customer Support Specialist`
  - Queue: `save`
  - Resume family: `remote_saas_product_support`
  - Why it matters: knowledge-base and accessible-explanation work align reasonably well
  - Blocker: asks for 2+ years of support background and has a 2026-09-03 deadline

### Lower Yield Or Higher Friction

- `TELUS - Media Search Analyst - English (United States)`
  - Queue: `backup`
  - Resume family: `remote_ai_search_quality`
  - Blocker: requires an Apple account and Apple device

- `TELUS - Face Deduplication Project`
  - Queue: `backup`
  - Resume family: `none`
  - Blocker: low-value one-off task with personal-photo privacy tradeoff

## Confirmed Evidence Vs Inference

Confirmed on 2026-08-30:

- Google Drive baseline profile PDF exists and was re-opened by title.
- Drive contains current PRS, operations/logistics, security/low-voltage, and field-service resume artifacts.
- Gmail contains a direct Welo Data outreach on 2026-08-28.
- Gmail contains a TELUS face-image microtask outreach on 2026-08-17.
- Public job pages for DataAnnotation, TELUS Online Data Analyst, Welo Data, TeamSnap, and Everway were live on 2026-08-30.
- GitHub shows fresh public `StateNotFate` work on 2026-08-27 and 2026-08-28.

Inference:

- Remote AI evaluation is still David's strongest remote lane.
- Remote SaaS or support-ops work is a plausible but weaker lane because the support evidence is more indirect.

## Real Blockers

- The remote AI and remote SaaS support resume variants are still local artifacts rather than clearly promoted canonical Drive or Wisebase items.
- DataAnnotation and TELUS authenticated dashboard state still cannot be read directly in this run; the new account-state registry is a local operator record, not a live dashboard feed.
- There is no current verified `reply-now` callback thread to answer.
- No outbound approval exists for apply, reply, or schedule actions.

## Exact Next System Steps

1. Choose one canonical storage target for the remote AI and remote SaaS support resume families: local-only, Google Drive, or Wisebase.
2. Keep `job-platform-account-state-2026-08-31.json` current for `DataAnnotation`, `TELUS`, `Welo Data`, `TeamSnap`, and any repeated lane that produces callbacks.
3. When the next human callback arrives, use this contract to draft the reply with the mapped resume family, then stop for approval.

## Exact Next Human Action

If David wants one immediate move, review `Welo Data` first, because it is the only current top lead backed by both a live role page and direct outreach in Gmail.
