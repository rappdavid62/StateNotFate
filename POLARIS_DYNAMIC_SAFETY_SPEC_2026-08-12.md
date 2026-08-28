# Polaris Dynamic Safety System — Research Integration Spec

**Date:** 2026-08-12  
**Status:** proposed replacement/upgrade for the June 2026 `Polaris Enhanced Safety System` behavior  
**Scope:** State Not Fate / Polaris support routing, safety inquiry, longitudinal signals, crisis handoff  

## Bottom line

Polaris must not behave as if every bad depression day is a suicide screen. It also must not wait passively when the user is obviously in danger.

The target behavior is:

> **Quiet when stable. Observant when deteriorating. Direct when concerning. Immediate when clearly unsafe.**

Polaris keeps numerical scoring because scores are useful for routing and longitudinal comparison. The scores are **not** probabilities that a person will attempt or die by suicide and must never be presented as actuarial prediction.

## What the suicide-compendium research changed

The suicide-prevention corpus now supports a stronger architecture than a flat risk-factor checklist:

1. Suicidality is a **dynamic, multi-system state-transition problem**, not one diagnosis or one trait.
2. Suicidal ideation, suicide attempts, and suicide deaths are **different outcomes**. Factors overlap but are not interchangeable.
3. The important question is often **what changed from the person's own baseline**, not merely whether a static risk factor exists.
4. Distal vulnerability, proximal deterioration, acute precipitating conditions, ideation-to-action factors, and fatality/rescue factors operate on different timescales.
5. No consumer-app score should claim to predict an individual's suicide death. Scores can still guide questioning, support intensity, and handoff.
6. Protective factors are real and clinically useful but should **not mechanically cancel explicit intent, preparation, inability to stay safe, or a recent attempt**.
7. Sleep/circadian disruption is a meaningful dynamic signal and intervention target, but not proof of suicidality by itself.
8. Care transitions, especially recent psychiatric discharge or loss of follow-up, should be treated as dynamic transition signals rather than background trivia.
9. Real-time/EMA research shows suicidal ideation can fluctuate substantially; retrospective summaries can miss state changes.
10. AI/passive sensing may identify deterioration patterns, but the correct role is **earlier inquiry and support**, not silent deterministic diagnosis.

## Evidence boundary

### Evidence / guideline-supported principles

- Direct suicide questions are appropriate when suicide risk is suspected.
- A positive suicide screen should lead to further safety assessment rather than being treated as a diagnosis.
- Clinical guidance warns against using low/medium/high risk scales as prediction of future suicide or as the sole basis for disposition.
- Risk formulation should attend to immediate and longer-term safety, dynamic change, needs, context, protective resources, and foreseeable changes.
- Safety planning, continuity of care, caring contact, reachable support, and safer access to lethal means are important prevention components.

### Project inference

Polaris can responsibly use a **two-score architecture**:

1. **State Signal Score** — measures multi-domain deterioration and change from baseline.
2. **Direct Safety Score** — measures explicit suicidal ideation/intent/access/timing/safety answers once direct inquiry is warranted.

This architecture is a product-design inference from the evidence. It is not a validated clinical instrument.

## The five-gate mental model Polaris should know

### Gate 1 — Vulnerability substrate

Longer-term background factors may include prior attempts, psychiatric history, trauma/adversity, chronic pain/medical burden, structural stress, family history, and persistent social/economic adversity.

These matter for context. They should not cause repetitive daily suicide questions by themselves.

### Gate 2 — Ideation emergence

Relevant constructs include psychological pain, hopelessness, defeat, entrapment, burdensomeness, disconnection, future narrowing, and severe depressive cognition.

Polaris should notice these as meaning/future-state changes. One construct alone does not equal suicidal intent.

### Gate 3 — Ideation persistence/intensification

Once suicidal thoughts are present, Polaris should distinguish presence from severity:

- frequency
- duration
- intensity
- controllability
- recent change
- distress/interference
- ability to resist or stay safe

### Gate 4 — Transition to action

Potentially relevant factors include prior suicidal behavior, current intent, preparatory behavior, intoxication/disinhibition, agitation, action vulnerability, and immediate access to highly lethal means.

Ideation-to-action theories are useful but only partially supported. Polaris must not encode a statement such as "an attempt cannot happen without acquired capability."

### Gate 5 — Fatality / rescue

Attempt risk and death risk are not the same endpoint. Environmental lethality, access, rescue opportunity, discovery, and emergency response affect outcomes.

Polaris should use this insight mainly for environmental safety and rapid human-support routing, not for fatality prediction.

## Timescale model

Polaris should internally distinguish:

- **years/lifetime:** prior attempts, trauma, chronic illness, longstanding socioeconomic burden
- **months/weeks:** worsening depression, isolation, treatment dropout, sleep drift, accumulating stress
- **days:** acute loss, severe insomnia, substance escalation/withdrawal, abrupt functional collapse, care transition
- **hours:** severe agitation, intoxication, rapidly intensifying thoughts, inability to stay safe, preparation/current intent

The same factor can have different significance depending on recency and change from baseline.

## Two-score architecture

### A. State Signal Score

Purpose: detect deterioration early and decide how much support/questioning is warranted.

Candidate domains:

- function / anchor abandonment
- sleep and circadian disruption
- isolation / loss of reachable connection
- hopelessness / future narrowing / meaning collapse
- severe shame / defeat / entrapment
- agitation / panic / mixed activation
- substance intoxication, withdrawal, or major escalation
- acute relationship, housing, financial, legal, or medical stress
- recent care transition / psychiatric discharge / missed follow-up
- severe distress entry
- psychosis/mania when safe self-management is impaired

Important: **State Signal Score alone cannot declare an emergency.** Its job is to open the correct level of inquiry.

### B. Direct Safety Score

Purpose: route response after direct safety information exists.

Current 0–16 structure may be retained around:

- ideation severity
- intent
- access to highly lethal means
- timeframe/immediacy

Direct overrides matter more than arithmetic. Examples:

- cannot stay safe now
- current intent plus immediate preparation
- recent attempt
- current preparatory behavior

These should trigger immediate crisis/support routing even if other scores appear low.

## Inquiry ladder

### 0. Normal

No meaningful signal stack.

Behavior:
- normal Polaris flow
- no forced suicide question
- ordinary anchors/re-entry

### 1. Tighten support

Mild/moderate deterioration across one or more domains.

Behavior:
- reduce load
- strengthen biological floor
- restore one reachable human bridge
- increase attention to sleep/rhythm/function
- no automatic suicide question

### 2. General safety check

Meaningful multi-domain deterioration.

Example language:

> "Things look rougher than your recent baseline. Do you feel able to stay safe right now?"

Do not automatically ask method/intent questions unless the answer or other signals warrant them.

### 3. Direct safety inquiry

Use when:

- direct death/suicide/self-harm language appears
- the user reports current suicidal thoughts
- state deterioration is strong, rapid, and multi-domain
- general safety answer is unsure/no
- other direct safety evidence exists

Ask plainly. Avoid euphemism.

### 4. Immediate danger pathway

Bypass ordinary interaction when there is strong current evidence such as:

- inability to stay safe
- current intent with imminent action/preparation
- recent attempt needing urgent response
- current preparatory behavior
- severe loss of safe self-management plus direct suicide danger

Behavior:
- reduce cognitive load
- bring human/crisis support forward
- use the existing Crisis Safe Box / Emergency Floor
- support increased time/distance from lethal means
- do not gamify
- do not debate philosophy or worth

## Companion semantic signal contract

Any AI/companion layer should convert conversation into **signals**, not diagnoses.

Allowed signal types for `state.safetySignalFeed`:

- `current-suicidal-thought`
- `explicit-suicidal-intent`
- `cannot-stay-safe`
- `preparatory-behavior`
- `recent-attempt`
- `severe-agitation`
- `severe-intoxication`
- `psychosis-unsafe`
- `major-loss`
- `future-narrowing`
- `entrapment`
- `sleep-collapse`
- `social-disconnection`

Rules:

1. Do not infer `explicit-suicidal-intent` from generic depression, exhaustion, profanity, dark humor, or low motivation.
2. Do not suppress direct inquiry merely because the user has reasons for living or supportive relationships.
3. When language is ambiguous but concerning, ask one concise clarifying safety question rather than silently assigning a severe label.
4. Direct statements override ordinary friction-minimization rules.
5. Store the source, timestamp, and uncertainty where possible.

## What Polaris should learn from sleep/circadian research

Polaris should treat severe insomnia, sleep loss, evening/nocturnal vulnerability, and rhythm instability as dynamic state signals. It should **not** say that sleep disruption proves suicidal risk.

Useful behavior:

- detect major deviation from personal sleep baseline
- combine it with agitation, isolation, hopelessness, intoxication, or direct suicidal content
- tighten the floor earlier
- ask about safety when the stack warrants it

## What Polaris should learn from EMA/dynamic measurement

A one-time retrospective answer is not the whole state.

Polaris should favor:

- recent change
- repeated low-friction observations
- individual baseline comparison
- trend direction
- rapid worsening
- foreseeable upcoming destabilizers

Do not increase questioning frequency simply because a calendar interval expired.

## Care-transition rule

Recent psychiatric/ED discharge, recent crisis, missed follow-up, medication interruption, or abrupt loss of care can materially change the safety picture.

Polaris should surface continuity actions:

- Who is the next human contact?
- Is follow-up actually scheduled/reachable?
- What changes before the next appointment?
- What foreseeable event could destabilize the next 24–72 hours?

## Protective/rescue capacity

Polaris should track **reachable** protection, not abstract protection:

- person who will answer
- place the user can go
- professional route that is actually accessible
- transportation/access
- environmental safety
- coping step that worked before
- reasons for living/valued roles/projects/pets

Do not subtract protective-factor points from current intent/preparation in a way that downgrades obvious danger.

## Language rules

Prefer:

- "I’m asking because several things changed at once."
- "Do you feel able to stay safe right now?"
- "Are you having thoughts of killing yourself right now?"
- "The priority is getting another person into this situation."
- "This score tells Polaris how much support to bring forward. It does not predict what you will do."

Avoid:

- "The algorithm says you are suicidal."
- "You are 78% suicide risk."
- "Your protective factors make you low risk."
- "You promised not to hurt yourself."
- automatic suicide questions after every collapse/low-hope day
- forced positivity or guilt

## Scoring-display rule

Keep numerical scoring if useful to the user and developer.

Display labels must say:

> **Safety signal score — routing aid, not a probability.**

Never label percentage-of-scale as a percentile unless it is actually derived from a reference distribution.

## Failure-mode tests Polaris must pass

1. **Stable severe depression:** low mood + low energy alone must not force daily suicide inquiry.
2. **Collapse day:** abrupt function loss should tighten support; one collapse variable alone should not declare suicide risk.
3. **Stacked deterioration:** sleep collapse + isolation + hopelessness + anchor abandonment should trigger safety clarification.
4. **Explicit suicidal thought:** direct inquiry appears immediately even if anchor completion is otherwise good.
5. **Cannot stay safe:** immediate crisis route; do not wait for a numeric threshold.
6. **Recent attempt/preparation:** immediate crisis route.
7. **Chronic ideation without acute change:** track baseline and current change; do not repeatedly treat the person as a new emergency solely because ideation is chronic.
8. **Strong protective factors + explicit intent:** protection informs the plan but does not cancel escalation.
9. **High state score, no direct danger:** ask and clarify; do not silently activate emergency services.
10. **Low state score, direct danger statement:** direct danger overrides the low state score.
11. **Post-discharge apparent calm:** maintain continuity awareness; do not interpret calm as automatic resolution.
12. **Severe intoxication/psychosis with inability to maintain safety:** bypass ordinary self-management flow.

## Source anchors

Use primary/current sources when updating this spec:

- NICE NG225 — Self-harm: assessment, management and preventing recurrence
- VA/DoD 2024 Clinical Practice Guideline for Assessment and Management of Patients at Risk for Suicide
- NIMH Ask Suicide-Screening Questions (ASQ) Toolkit and Brief Suicide Safety Assessment pathways
- CDC / HHS 2024 National Strategy for Suicide Prevention
- 2026 systematic review of ideation-to-action theories (IMV / 3ST)
- 2024 systematic review/meta-analysis of circadian rhythms and suicidal thoughts/behaviors
- 2025 systematic review/meta-analysis of sleep interventions and suicidal ideation/behavior
- 2026 systematic review of smartphone EMA measurement of suicidal ideation
- large recent GWAS work separating ideation, attempt, and suicide death phenotypes

Project source notes and generated summaries are architecture context; public clinical claims should cite the underlying primary/guideline source.

## Public boundary

Polaris may:

- detect changes in user-entered state
- adapt support intensity
- ask direct safety questions when warranted
- provide crisis-resource routing
- prepare longitudinal summaries for a clinician/supporter
- support collaborative safety planning and environmental safety

Polaris must not:

- diagnose suicidality
- claim a validated probability of attempt/death
- claim its score predicts suicide
- treat demographic identity as pathology
- replace crisis/professional assessment
- request unnecessary graphic method detail
- automatically call police or claim it can do so when it cannot

## Canonical design sentence

> **Polaris does not ask about suicide because depression exists. Polaris asks when the current signal pattern makes the question relevant, and it becomes immediately direct when the user tells us danger is already here.**
