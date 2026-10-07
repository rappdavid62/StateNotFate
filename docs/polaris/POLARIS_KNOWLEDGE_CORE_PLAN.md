# Polaris Knowledge Core Plan

## Bottom line

Polaris should become a constrained recovery decision system grounded in curated State Not Fate knowledge, not a general chatbot and not a clinical risk-assessment engine.

The core loop is:

`current state -> retrieve relevant knowledge -> choose one safe next action -> explain why -> record proof -> update local context`

## Product role

Polaris is the central reasoning and guidance layer for State Not Fate. It should:

- translate the user's current state into a small, believable next move
- adapt recommendations to energy, burden, friction, trust, and recent history
- retrieve only relevant recovery knowledge
- separate education from action guidance
- preserve restartability and low cognitive load
- route safety concerns to human support without pretending to diagnose or predict risk
- remain useful offline with deterministic fallback behavior

Polaris should not:

- diagnose mental illness
- assign suicide-risk scores
- claim to predict suicide or deterioration
- ask for graphic or method-specific details
- replace clinicians, crisis systems, or trusted human support
- generate unlimited open-ended therapeutic dialogue

## Architecture

### 1. Local state layer

Stores only the minimum needed for personalization:

- current energy state: high, medium, low, collapse
- current burden lanes: rhythm, initiation, body, environment, rumination, isolation, admin, treatment
- preferred anchors
- recent completed actions
- restart history
- friction reasons
- optional user-authored profile and safety contacts

This remains local-first. Export and sync must be explicit.

### 2. Curated knowledge layer

The knowledge layer is versioned Markdown and JSON built from:

- State Not Fate canonical recovery documents
- front-end intake and hope/activation guidance
- anchor library and minimum viable day logic
- relapse and restart procedures
- evidence summaries with source labels
- suicide-prevention education and product-boundary material

The app should not ingest the full Obsidian vault blindly. Only approved State Not Fate material should be promoted into the Polaris corpus.

### 3. Retrieval layer

Each knowledge item receives metadata:

- id
- title
- domain
- subdomain
- audience
- energy_state
- burden_lane
- intervention_type
- safety_level
- evidence_class
- source_file
- source_date
- public_safe
- last_reviewed

Retrieval should prefer:

1. safety boundary matches
2. current energy-state matches
3. current burden-lane matches
4. recent friction and prior-response matches
5. smallest believable action

### 4. Decision layer

The decision layer should produce structured output rather than free-form text:

```json
{
  "mode": "recovery|education|restart|safety-routing",
  "state_summary": "low energy with initiation friction",
  "next_action": {
    "title": "Open the blinds",
    "tiny_version": "Stand by the brightest window for 30 seconds",
    "why": "Light is a low-friction rhythm anchor and leaves visible proof.",
    "estimated_minutes": 1
  },
  "proof_prompt": "Log it as proof when complete.",
  "source_ids": ["anchor-light-001"],
  "safety_boundary": null
}
```

A deterministic validator must reject outputs that:

- contain diagnosis or certainty claims
- recommend too many actions
- exceed the user's capacity tier
- expose private source text unnecessarily
- provide method-specific self-harm content
- omit human-support routing when safety mode is active

### 5. Model layer

Use a strong language model for synthesis and explanation, but keep authority outside the model.

The model receives:

- compact system rules
- current local state summary
- a small retrieved knowledge packet
- allowed action schema
- explicit safety and product boundaries

The model does not receive the entire vault or unrestricted conversation history.

### 6. Offline fallback

If the model or network is unavailable, Polaris should still provide:

- state-based anchor selection
- restart flow
- minimum viable day
- crisis/help routing
- proof logging

The existing rule engine can become this fallback after cleanup.

## Knowledge build pipeline

1. Inventory State Not Fate material in Obsidian and AI Wisebase.
2. Mark canonical, duplicate, private, outdated, and research-only documents.
3. Distill canonical material into small knowledge units.
4. Add metadata and source provenance.
5. Run duplication, contradiction, unsafe-language, and unsupported-claim checks.
6. Export versioned JSON for the app.
7. Test retrieval against synthetic user states.
8. Promote only reviewed bundles into production.

## Initial corpus priorities

### Recovery core

- State Not Fate philosophy and scope
- hope and activation gatekeeper
- intake-to-first-action mapping
- low, medium, high, and collapse-day rules
- minimum viable day and rescue sequence
- anchor library
- restart and relapse map
- proof and self-trust logic
- friction reduction
- social re-entry
- treatment integration boundaries
- substance-use reality without moralizing

### Suicide-prevention compendium

- product boundaries
- warning-sign education
- risk and protective factors as non-predictive education
- how to ask for help
- supporter scripts
- crisis-resource routing
- safety-planning education with human support
- caring contacts and follow-up
- postvention and safe messaging
- equity and population-specific material

The suicide-prevention corpus must be separated from ordinary recovery guidance and require a higher review standard.

## First implementation sequence

### Phase 1: foundation

- create knowledge schema
- create source registry
- create recovery and suicide-prevention corpus folders
- quarantine unsupported safety assessment code
- define structured Polaris response contract

### Phase 2: retrieval

- build local keyword/tag retrieval first
- add tests for energy state, burden lane, restart, and safety routing
- add source citations to Polaris responses

### Phase 3: model integration

- add server-side model call through a Netlify Function
- keep API keys in Netlify environment variables
- validate every model response against the response schema
- retain deterministic offline fallback

### Phase 4: evaluation

- synthetic persona and state tests
- safety-boundary tests
- hallucination and unsupported-claim tests
- reduced-overwhelm tests
- restartability tests
- mobile accessibility tests

## Success criteria

Polaris is successful when it reliably gives one safe, relevant, believable next action; shows the reason and source; preserves privacy; works without the model when necessary; and never presents itself as a clinician or suicide-risk predictor.
