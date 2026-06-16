# Evolving Intake Questionnaire

Purpose: route a person to the smallest useful next step without making onboarding feel like a test or interrogation.

## Design rules

- Ask the minimum needed to choose a safe starting floor.
- Do not imply diagnosis.
- Give an immediate value return after every section.
- Let the user skip depth and still reach the dashboard.

## Intake modes

### Minimal

For low trust, low energy, or first contact.

Questions:

1. What is blocking action right now?
2. Which floor is easiest: body, space, mind, contact, or ten-second start?
3. Do you want quick setup or full setup?

Output: one floor action and a direct route to the app.

### Standard

For normal onboarding.

Sections:

1. Boundary and support awareness.
2. Current energy tier.
3. Sleep and rhythm disruption.
4. Initiation block.
5. Environment drag.
6. Shame and self-trust load.
7. Meaning and purpose load.
8. Support/contact availability.
9. Preferred anchor style.

Output: recommended template, first Minimum Viable Day, and fallback floor.

### Deep

For users who want more personalization.

Adds:

- PHQ-9 history entry.
- Anchor preference details.
- Local safe contact list.
- Export preferences.
- Weekly review cadence.

## Pattern routing

- Rhythm Collapse: sleep disruption plus morning initiation delay.
- Environmental Drag: clutter, admin overload, object friction, or blocked setup.
- Total Initiation Failure: high task-entry threshold.
- High Shame / Low Trust: high self-attack and low belief that action matters.
- Good-Day Overreach: energy spikes followed by collapse.

## Sharing boundaries

- The app should not autonomously contact people.
- Any sharing or export must be explicit and reviewable.
- Sensitive free-text should stay local unless the user chooses export.

## Acceptance criteria

- A user can reach a useful floor in under two minutes.
- Every question has a clear reason for existing.
- Intake can be resumed without shame language.
- No answer permanently labels the person.
