# Template Distillation — System Design

## Source

- Reference: `artifact-template-system-design/assets/reference.docx`
- SHA-256 before use: `13504F6C221A42C1726460A9E865E563355539FF97D702D6C9B2267B4B261D76`
- Source must remain unchanged. Authoring occurs only in `.codex-tmp/job-pipeline-system-design/working.docx`.

## Render and structure evidence

- The supplied preview shows a portrait cover page with a light-weight system name, bold proposal title, a three-column status/owner/date row, and a blue-tinted metadata table.
- Package audit: one portrait Letter section, 0.70-inch left/right/top margins, 0.62-inch bottom margin, different first-page header enabled.
- Heading audit: 21 Heading 1 paragraphs and 3 Heading 3 paragraphs.
- Table audit: nine tables covering cover metadata, authorship, goals/non-goals, architecture components, data contract, failure scenarios, operational signals, alternatives, and milestones.
- Primary type treatment uses Helvetica Neue, with Arial as a fallback in a small number of runs.

## Semantic inventory

1. Cover: system name, proposal title, status, owner, last updated, authors, reviewers, related documents, and scope.
2. Abstract.
3. Goals and non-goals.
4. Background and problem statement.
5. Proposed architecture, including an architecture figure and component table.
6. Request lifecycle.
7. API and data contracts, including a primary field table and contract guarantees.
8. Consistency, idempotency, and replay.
9. Security and privacy considerations.
10. Operational readiness, including signal/SLO/owner/launch-gate rows and a rollout constraint.
11. Alternatives considered.
12. Open questions.
13. Decision and next steps.
14. Milestones with deliverables and exit criteria.

## Slot map

| Template slot | Job-pipeline content |
|---|---|
| Cover identity | David Rapp Job Pipeline; Canonical Job Pipeline Integration Design |
| Status metadata | Proposed; David Rapp; July 23, 2026 |
| Abstract | One canonical state model connecting discovery, inbox events, resume selection, approval, and writeback |
| Goals/non-goals | Delta-only output, low-energy execution, deduplication, privacy, human approval; no autonomous applications/messages or broad tool redesign |
| Background | Duplicate Drive copies, stale automation identifiers/status, scattered local/Drive/Wisebase artifacts, and no single canonical queue |
| Architecture figure | Sources → normalize/deduplicate → policy/classification → queues/packet selector → human approval → writebacks/learning |
| Components | Source adapters, canonical state store, classifier, queue/packet builder, approval gate, observability/review |
| Lifecycle | Ingest, normalize, compare fingerprint, classify, rank, select resume, request approval, write state, emit compact handoff |
| Data contract | Stable lead key, contact state, lane, source confidence, material-change fingerprint, resume family, next action, approval state, timestamps |
| Guarantees | No duplicate resurfacing without change; no outbound side effect without explicit approval; evidence and inference remain separate |
| Consistency/replay | Stable keys, idempotent merges, append-only events, deterministic queue views |
| Security/privacy | No credentials or private mailbox payloads in shared artifacts; minimum necessary evidence; human approval for outbound actions |
| Operational readiness | Net-new viable leads, reply latency, stale-repeat suppression, successful packet selection, tracker completeness |
| Alternatives | Drive-as-source-of-truth, Wisebase-as-transaction-store, email-only workflow, fully autonomous application agent |
| Open questions | Canonical tracker location, event-driven vs bounded cadence, application evidence retention |
| Decision/next steps | Adopt local canonical state plus native Google Doc design and Wisebase retrieval handoff; validate with one live job event |
| Milestones | Schema/router, dry run, one-event validation, bounded automation proposal |

## Fill policy

- Preserve the reference package, section setup, cover treatment, heading hierarchy, tables, fills, borders, widths, and row structures.
- Replace placeholder text in existing containers; do not rebuild the template from scratch.
- Use concise content so tables remain scannable and the design does not become a wall of grids.
- Use a generated architecture diagram in the existing figure slot.
- Retain real Word heading styles and real lists.
- The final Google Docs-targeted title must be a plain formatted paragraph after sanitization.

## Coverage obligations

- Distinguish confirmed current evidence, July 22 snapshots, and inference.
- Record that the referenced `chatgpt-conversation://` source was not directly readable.
- Capture the July 22 corrections: material deltas only, prior-action checks, multi-lane search, relocation flexibility, and no recurring-company loop.
- Reconcile the current paused automation ID with stale “active” references in local profile/playbook artifacts.
- Keep the three established resume families.
- Require explicit human approval before sending, scheduling, or applying.
- Define token-yield metrics and a one-action low-energy floor.
- Provide a concrete canonical-state contract, queue states, failure modes, rollout gates, and one smallest validation move.
