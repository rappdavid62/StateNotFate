# State Not Fate Automation Agent Portfolio

This file turns the automation research report into repo-level operating rules.

## First agents to ship

1. Hourly synthetic monitor
   - Runs public Playwright smoke tests against the Netlify production URL.
   - Stores failure artifacts in GitHub Actions.
   - Does not touch user data.

2. Weekly evidence watch
   - Refreshes PubMed and evidence files through the existing scripts.
   - Runs external link checks.
   - Opens a review pull request instead of publishing silently.

3. Weekly boundary watch
   - Checks deployment-facing metadata and artifact boundaries.
   - Treats metadata problems as warnings and broken deployment assets as failures.

## Deferred agents

These should not be automated until consent, logging, and review flows exist:

- User nudge agent.
- Contact or outreach agent.
- Auto-send email or message agent.
- Any agent that stores or transmits private journal text.

## Frequency map

- Hourly: production smoke monitor.
- Weekly: evidence refresh, link report, boundary audit.
- Per pull request: unit, integration, and browser tests.
- Manual only: translation publishing, collaborator outreach, support response drafts.

## Implementation principle

Use boring automation first. Scheduled checks, reviewable pull requests, and artifact-backed failures are safer than autonomous behavior.
