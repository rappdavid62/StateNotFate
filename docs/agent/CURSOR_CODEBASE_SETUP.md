# Cursor codebase setup — State Not Fate

Verified 2026-11-12 from Cursor's repository list and GitHub source.

## Open the right project

Cursor codebase: snf-helpme. It already contains StateNotFate, state-not-fate-beta, and ObsidianVault.
For website work choose StateNotFate. GitHub source is rappdavid62/StateNotFate; source branch is SNF.
ObsidianVault contains notes; state-not-fate-beta is a separate implementation. Do not merge them as a setup step.
Live deployment identity and local Windows checkout were not verified in this review.

## Files already provided

- AGENTS.md: static PWA architecture, constraints, test commands.
- .cursor/environment.json: npm ci && npx playwright install --with-deps chromium; terminal npm run serve.
- .cursor/rules/workspace-source-truth.mdc: repository/branch identity.
- .cursor/rules/snf-voice-no-hope-pitch.mdc: project voice.
- .cursorignore: indexing exclusions.
- .cursor/agents/: implementation and verification role instructions.
- .cursor/hooks.json and .cursor/permissions.json: existing workspace controls.

No framework, API key, new repository, or Slack subscription is needed for public-site testing.
Do not copy personal notes, credentials, or environment secrets into this public repository.

## Known cloud compatibility blockers

The committed implementation role restricts work to the Windows SNF_DEPLOY path.
The hook command names a Windows Python314 executable; its Python script also hard-codes the Windows project root.
The source-truth rule and permissions text refer to that local path.
These are not proof that a Linux cloud checkout can execute successfully.
Do not disable the controls to get around this. A follow-up implementation should validate the actual Git root and exact repository remote, preserve approval behavior, and support both Windows and Linux.
This setup packet does not change those controls or assert that they work in the cloud.

## First session

Use CURSOR_FIRST_RUN.md in this folder as the first agent request.
Start only one manual session. Do not enable recurring agents or automatic retries.
Read the checkout identity, installed tools, hook failures, and package scripts before any install or test.
The committed environment install may already have run; do not repeat it without evidence it is needed.
Use npm run health first, then relevant tests. Full public browser tests are npm run test:public.
Report command output and failures honestly; a source review is not a passing test run.

## Completion evidence

Record repository URL, branch, commit, Git status, environment/install result, health output, browser test output, and any blockers.
A generated prompt is not an executed task. A passing local run is not a production verification.
Merge and deployment remain separate decisions.
