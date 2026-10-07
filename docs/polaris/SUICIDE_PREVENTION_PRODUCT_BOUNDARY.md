# Suicide-Prevention Product Boundary

## Purpose

State Not Fate may provide education, help-seeking support, preparation, and crisis-resource routing. It must not present itself as a suicide-risk assessor, predictor, diagnostic system, or replacement for trained human support.

## Allowed product behavior

Polaris may:

- recognize that a user is asking for urgent help
- pause ordinary coaching and action gamification
- use direct, non-shaming language
- encourage immediate contact with a trusted person or crisis service
- show region-appropriate emergency and crisis resources
- help the user compose a brief message asking for support
- display user-saved safe contacts
- provide non-graphic warning-sign education
- explain protective factors without implying certainty
- support a human-created safety plan
- offer caring-contact and follow-up reminders

## Prohibited product behavior

Polaris must not:

- assign low, moderate, elevated, acute, or numeric suicide-risk scores
- claim to predict an attempt or death
- conduct a comprehensive clinical risk assessment
- ask users to describe methods in detail
- provide method comparisons, lethality information, or procedural details
- treat a checklist result as proof that a person is safe
- hide crisis support behind a PIN, intake, subscription, or completion gate
- continue ordinary rewards, quests, or productivity pressure during safety routing
- say the app can keep the user safe by itself

## Required safety mode response

When safety mode is activated, the output should contain only:

1. Acknowledge the state plainly.
2. State that this is outside the app's self-management role.
3. Present immediate human-support options.
4. Offer one low-friction connection action.
5. Keep emergency help accessible without further questioning.

Example structure:

```json
{
  "mode": "safety-routing",
  "message": "This needs human support now, not another self-management task.",
  "primary_action": "Call or text a trusted person and tell them you need them to stay with you or help you reach urgent support.",
  "resources": [],
  "optional_script": "I am not feeling safe alone right now. Please call me or stay with me while I get support.",
  "disable_rewards": true,
  "disable_assessment": true
}
```

## Existing code review finding

`src/safety-detection.js` currently contains risk levels, assessment tiers, intent scoring, access-to-means scoring, timeline scoring, and method-specific questions. That architecture exceeds the product boundary above and should not be wired into production Polaris.

Recommended action:

- mark the module experimental and non-production
- remove production imports or UI links
- preserve it only for historical review until replaced
- create a smaller `safety-routing.js` module that handles boundaries, resources, saved contacts, and support scripts

## Review requirement

All suicide-prevention knowledge units and safety-mode changes require:

- source provenance
- safe-language review
- product-boundary review
- test coverage proving no risk score or method-detail path is exposed
- confirmation that crisis help remains reachable without login or intake
