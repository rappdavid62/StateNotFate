# Polaris Knowledge Unit Schema

Each promoted knowledge item must be small enough to retrieve independently and specific enough to support one decision, explanation, boundary, or action.

## Required fields

```yaml
id: string
title: string
domain: recovery | suicide_prevention | product_boundary | evidence
subdomain: string
summary: string
content: string
burden_lanes: []
energy_states: []
intervention_type: education | action | restart | reflection | support_routing | boundary
audience: self | supporter | peer_supporter | public
safety_level: standard | sensitive | crisis_routing
public_safe: true | false
evidence_class: project_canonical | official_guidance | clinical_guideline | peer_reviewed | nonprofit_toolkit | lived_experience | strategic_judgment
source_file: string
source_section: string
source_date: YYYY-MM-DD
last_reviewed: YYYY-MM-DD
review_status: draft | reviewed | approved | retired
```

## Optional fields

```yaml
normal_action: string
tiny_action: string
contraindications: []
requires_human_support: false
resource_region: string
source_url: string
related_ids: []
tags: []
```

## Example

```yaml
id: recovery-initiation-001
title: Shrink the first move until it is believable
domain: recovery
subdomain: activation
summary: When initiation is impaired, reduce the action until starting feels credible.
content: Choose the smallest version of the action that leaves a visible trace. Repeat before expanding.
burden_lanes:
  - initiation
energy_states:
  - low
  - collapse
intervention_type: action
audience: self
safety_level: standard
public_safe: true
evidence_class: project_canonical
source_file: 03_Front_End_Intake_Guide.docx
source_section: Choose the first move
source_date: 2026-04-10
last_reviewed: 2026-07-10
review_status: reviewed
normal_action: Walk for five minutes.
tiny_action: Stand outside for thirty seconds.
requires_human_support: false
tags:
  - startup
  - proof
  - low-friction
```

## Promotion rules

A unit cannot enter the production corpus unless:

1. Its source is identified.
2. Its wording does not overstate evidence.
3. Its action is compatible with the named energy state.
4. Its safety classification is explicit.
5. It does not contain private vault material unless deliberately approved for local-only use.
6. Suicide-prevention content has received separate safety review.
7. Duplicates and contradictions have been resolved.

## Storage proposal

```text
knowledge/
  registry.yaml
  recovery/
    philosophy/
    activation/
    anchors/
    restart/
    relapse/
    social/
    treatment/
  suicide-prevention/
    boundaries/
    education/
    help-seeking/
    supporter-scripts/
    crisis-routing/
    postvention/
  evidence/
  generated/
    polaris-knowledge.json
```

`knowledge/generated/` is build output. Human-reviewed source units remain Markdown or YAML in the category folders.
