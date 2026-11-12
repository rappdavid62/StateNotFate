# First Cursor session — bounded setup verification

Work on State Not Fate website setup only. Do not start a feature or recurring task.

1. Read AGENTS.md, .cursor/environment.json, .cursor/rules/, .cursor/hooks.json, .cursor/permissions.json, and package.json.
2. Show actual working directory, Git root, origin remote, branch, HEAD, and dirty/untracked status. Expected repository: rappdavid62/StateNotFate. SNF is the source branch; the current branch can be a review branch. Stop if identity conflicts.
3. Confirm that the workspace hook resolves the checkout and GitHub origin. If verification fails, report the blocker and stop.
4. Check Node/npm versions and dependency/browser availability. Use the committed environment install command only if dependencies are missing and execution is permitted; do not invent an alternative or repeat a successful install.
5. If the environment is valid, run npm run health once. Run the narrowest relevant tests; use npm run test:public for public-site acceptance when Chromium is available. Run at most one diagnostic follow-up per failure, then stop with evidence.
6. Do not alter application code in this first run. Do not delete files, merge, deploy, spend money, add integrations/secrets, create schedules, or start other agents.
7. Return verified facts, commands and exit results, blockers, and the smallest concrete next change. Label anything not run or not verified. Do not call setup complete unless execution evidence supports it.

Read docs/agent/CURSOR_CODEBASE_SETUP.md for the setup inventory.
