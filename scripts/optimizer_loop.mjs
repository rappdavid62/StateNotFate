import fs from 'fs/promises';
import path from 'path';

export let STATE_FILE_PATH = path.join(process.cwd(), 'data', 'learning_state.json');
export let REPORT_FILE_PATH = path.join(process.cwd(), 'outputs', 'system_report.md');

export function setFilePaths(statePath, reportPath) {
    STATE_FILE_PATH = statePath;
    REPORT_FILE_PATH = reportPath;
}

export async function loadState() {
    try {
        const data = await fs.readFile(STATE_FILE_PATH, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        if (e.code === 'ENOENT') {
            return {
                run_count: 0,
                weekly_estimate_usage_pct: 0.0,
                builder_state: 'IDLE',
                history: [],
                improvements: [],
                facts: [],
                assumptions: [],
                bottlenecks: [],
                broken_bridges: []
            };
        }
        throw e;
    }
}

export async function saveState(state) {
    await fs.mkdir(path.dirname(STATE_FILE_PATH), { recursive: true });
    await fs.writeFile(STATE_FILE_PATH, JSON.stringify(state, null, 2), 'utf8');
}

export function generateReportMarkdown(state, nextAction, recommendations) {
    let md = `# System Report & Optimizer Output\n\n`;
    md += `## Accessibility Statement\n`;
    md += `- **Local Files**: Accessible\n`;
    md += `- **ClickUp**: Unavailable\n`;
    md += `- **Gmail**: Unavailable\n`;
    md += `- **Drive**: Unavailable\n`;
    md += `- **Calendar**: Unavailable\n`;
    md += `- **Slack**: Unavailable\n\n`;

    md += `## System Facts & Assumptions\n`;
    md += `**Facts:**\n${(state.facts || []).map(f => `- ${f}`).join('\n') || '- None'}\n\n`;
    md += `**Assumptions:**\n${(state.assumptions || []).map(a => `- ${a}`).join('\n') || '- None'}\n\n`;

    md += `## Architecture Layers\n`;
    md += `- **Current Hub**: Local Environment\n`;
    md += `- **Source of Truth**: \`data/learning_state.json\`\n`;
    md += `- **Automation Layer**: Local Node.js Scripts\n`;
    md += `- **AI Executor**: Local Agent Process\n`;
    md += `- **Code/Repo Layer**: Local Git Repository\n\n`;

    md += `## Friction Points\n`;
    md += `**Broken Bridges:**\n${(state.broken_bridges || []).map(b => `- ${b}`).join('\n') || '- None'}\n\n`;
    md += `**Biggest Bottleneck:**\n${(state.bottlenecks || []).map(b => `- ${b}`).join('\n') || '- None'}\n\n`;

    md += `## Ranked Recommendations\n`;
    if (recommendations.length > 0) {
        recommendations.forEach((r, i) => {
            md += `${i + 1}. **${r.title}**\n`;
            md += `   - Impact: ${r.impact}\n`;
            md += `   - Effort: ${r.effort}\n`;
            md += `   - Risk: ${r.risk}\n`;
            md += `   - Kill Criteria: ${r.kill_criteria}\n`;
        });
    } else {
        md += `- No current recommendations. Capacity reached or short-circuited.\n`;
    }
    md += `\n`;

    md += `## Unverified Connectors Test Ladder\n`;
    md += `- (No unverified external connectors claimed; strictly using local state)\n\n`;

    md += `## Next Concrete Action\n`;
    md += `**${nextAction}**\n`;

    return md;
}

export async function runOptimizerLoop() {
    const state = await loadState();
    state.run_count += 1;
    let nextAction = "IDLE";
    let recommendations = [];

    const isSixHourActive = state.builder_state === 'SIX_HOUR_ACTIVE';
    const isOverCapacity = state.weekly_estimate_usage_pct >= 95.0;

    if (isSixHourActive) {
        nextAction = "Short-circuit: 6-hour builder is currently active. Monitor status only.";
    } else if (isOverCapacity) {
        nextAction = "Short-circuit: Hard 5% reserve policy enforced. Usage >= 95%.";
    } else {
        recommendations = [
            {
                title: "Automate daily state snapshot",
                impact: "Medium",
                effort: "Low",
                risk: "Low",
                kill_criteria: "If file size exceeds 5MB or git history becomes bloated"
            }
        ];
        nextAction = "Implement 'Automate daily state snapshot' as the next smallest improvement.";
        if (state.improvements && !state.improvements.includes("Automate daily state snapshot")) {
             state.improvements.push("Automate daily state snapshot");
        }
    }

    const md = generateReportMarkdown(state, nextAction, recommendations);

    await fs.mkdir(path.dirname(REPORT_FILE_PATH), { recursive: true });
    await fs.writeFile(REPORT_FILE_PATH, md, 'utf8');
    await saveState(state);

    return { md, nextAction };
}

if (process.argv[1] && process.argv[1].endsWith('optimizer_loop.mjs')) {
    runOptimizerLoop().then(({ nextAction }) => {
        console.log(`Optimizer loop finished. Next Action: ${nextAction}`);
    }).catch(console.error);
}
