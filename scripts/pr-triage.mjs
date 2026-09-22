#!/usr/bin/env node
/**
 * PR Triage Inspector — `npm run pr:triage`
 *
 * Fetches all open PRs from GitHub and prints a terminal-friendly
 * summary with age, staleness, and recommended actions.
 *
 * No auth required for public repos.
 */

const REPO = 'rappdavid62/StateNotFate';
const API = `https://api.github.com/repos/${REPO}/pulls?state=open&per_page=30`;

const BOT_AUTHORS = new Set(['Copilot', 'github-actions[bot]']);
const AGENT_PREFIXES = ['copilot/', 'CursAge/', 'grok/', 'codex/'];
const STALE_DAYS = 14;
const AUTO_CLOSE_DAYS = 21;

async function main() {
  const res = await fetch(API, {
    headers: { 'Accept': 'application/vnd.github+json' }
  });
  if (!res.ok) {
    console.error(`GitHub API error: ${res.status} ${res.statusText}`);
    process.exit(1);
  }
  const prs = await res.json();

  if (prs.length === 0) {
    console.log('\n✅  No open PRs. Backlog is clean.\n');
    return;
  }

  console.log(`\n📋  Open PRs for ${REPO}\n`);
  console.log('─'.repeat(90));
  console.log(
    '#'.padEnd(5) +
    'Author'.padEnd(18) +
    'Age'.padEnd(8) +
    'Status'.padEnd(14) +
    'Title'
  );
  console.log('─'.repeat(90));

  const now = Date.now();
  let staleCount = 0;
  let agentCount = 0;
  const closeCandidates = [];

  for (const pr of prs) {
    const isBot = BOT_AUTHORS.has(pr.user.login) || pr.user.type === 'Bot';
    const isAgentBranch = AGENT_PREFIXES.some(p => pr.head.ref.startsWith(p));
    const isAgent = isBot || isAgentBranch;
    const ageDays = Math.floor((now - new Date(pr.created_at).getTime()) / (1000 * 60 * 60 * 24));
    const staleDays = Math.floor((now - new Date(pr.updated_at).getTime()) / (1000 * 60 * 60 * 24));
    const isStale = staleDays >= STALE_DAYS;
    const isCloseable = isAgent && pr.draft && staleDays >= AUTO_CLOSE_DAYS;

    if (isStale) staleCount++;
    if (isAgent) agentCount++;

    let status = pr.draft ? 'Draft' : 'Open';
    if (isStale) status += ' ⏰';
    if (isAgent) status += ' 🤖';

    const line =
      `#${pr.number}`.padEnd(5) +
      pr.user.login.slice(0, 16).padEnd(18) +
      `${ageDays}d`.padEnd(8) +
      status.padEnd(14) +
      pr.title.slice(0, 45);

    console.log(line);

    if (isCloseable) {
      closeCandidates.push(pr);
    }
  }

  console.log('─'.repeat(90));
  console.log(`\n  Total: ${prs.length} open  |  ${agentCount} agent  |  ${staleCount} stale\n`);

  if (closeCandidates.length > 0) {
    console.log('🧹  Auto-close candidates (stale agent drafts >21 days):');
    for (const pr of closeCandidates) {
      console.log(`    PR #${pr.number}  ${pr.title.slice(0, 50)}`);
      console.log(`      → gh pr close ${pr.number} --repo ${REPO} --comment "Stale agent draft, closing."`);
    }
    console.log('');
  }

  // Provide manual close commands for all stale PRs
  const manualCloseTargets = prs.filter(pr => {
    const staleDays = Math.floor((now - new Date(pr.updated_at).getTime()) / (1000 * 60 * 60 * 24));
    return staleDays >= STALE_DAYS;
  });

  if (manualCloseTargets.length > 0) {
    console.log('📌  Quick-close commands for all stale PRs:');
    for (const pr of manualCloseTargets) {
      console.log(`    gh pr close ${pr.number} --repo ${REPO} -c "Superseded / stale — closing to keep backlog clean."`);
    }
    console.log('');
  }
}

main().catch(err => { console.error(err); process.exit(1); });
