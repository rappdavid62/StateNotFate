# Polaris Knowledge Schema v1

This document defines the canonical schema for every unit in `knowledge/registry.yaml`
and the generated `knowledge/polaris-knowledge-bundle.json`.

---

## Unit fields

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | ✅ | Stable kebab-case identifier, unique across registry |
| `domain` | string | ✅ | One of the 12 approved domains (see below) |
| `title` | string | ✅ | Short human-readable label (≤ 80 chars) |
| `body` | string | ✅ | The actionable knowledge statement (plain text, no Markdown) |
| `tone` | string | ✅ | `directive` | `affirming` | `boundary` | `psychoeducation` |
| `energy_states` | string[] | ✅ | Applicable energy states: `high` `medium` `low` `collapse` `any` |
| `source` | object | ✅ | Provenance (see sub-fields below) |
| `review_status` | string | ✅ | `approved` | `draft` | `flagged` |
| `flags` | object | ❌ | Optional — `duplicate_of`, `contradicts` with reason |
| `tags` | string[] | ❌ | Free-form search tags |

### source sub-fields

| Field | Type | Required | Description |
|---|---|---|---|
| `origin` | string | ✅ | `snf-internal` | `clinical-consensus` | `evidence-based` | `peer-reviewed` |
| `doc` | string | ❌ | Filename or doc title inside this repo |
| `vault_approved` | boolean | ✅ | `true` only if private-vault content was explicitly approved |
| `reviewed_by` | string | ✅ | Reviewer name or role |
| `reviewed_at` | string (ISO date) | ✅ | YYYY-MM-DD |

---

## Approved domains

1. `philosophy-and-product-scope`
2. `hope-and-activation`
3. `intake-to-first-action`
4. `energy-state-rules`
5. `minimum-viable-day`
6. `anchors`
7. `restart-and-relapse`
8. `proof-and-self-trust`
9. `friction-reduction`
10. `social-reentry`
11. `treatment-boundaries`
12. `substance-use-reality`

---

## Bundle format

The JSON bundle at `knowledge/polaris-knowledge-bundle.json` is generated from the YAML
registry and has the following top-level structure:

```json
{
  "schema_version": "1.0.0",
  "generated_at": "<ISO timestamp>",
  "unit_count": 0,
  "units": []
}
```

Each element in `units` is the YAML unit object serialised to JSON with all fields present.

---

## Flag rules

- Set `review_status: flagged` and add `flags.duplicate_of: "<id>"` when a unit is
  a close restatement of an existing unit.
- Set `review_status: flagged` and add `flags.contradicts: "<id>"` plus
  `flags.reason: "<explanation>"` when a unit conflicts with another.
- Private vault content MUST have `source.vault_approved: true`; otherwise it is
  excluded from both the registry and the bundle.
