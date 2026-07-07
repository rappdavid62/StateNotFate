import fs from 'fs/promises';
import path from 'path';

// For tests, allow overriding the state file path
export let STATE_FILE_PATH = path.join(process.cwd(), '.codex', 'learning_state.json');

export function setStateFilePath(newPath) {
    STATE_FILE_PATH = newPath;
}

export async function loadState() {
    try {
        const data = await fs.readFile(STATE_FILE_PATH, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        if (e.code === 'ENOENT') {
            return {
                run_count: 0,
                active_count: 0,
                paused_count: 0,
                weekly_estimate_usage_pct: 0.0,
                builder_state: 'IDLE',
                history: [],
                improvements: []
            };
        }
        throw e;
    }
}

export async function saveState(state) {
    await fs.mkdir(path.dirname(STATE_FILE_PATH), { recursive: true });
    await fs.writeFile(STATE_FILE_PATH, JSON.stringify(state, null, 2), 'utf8');
}

export async function checkGuardrails(state, proposedImprovement) {
    if (state.weekly_estimate_usage_pct > 95) {
        return { allowed: false, reason: 'Hard reserve policy: weekly usage estimate exceeds 95%.' };
    }

    if (proposedImprovement && state.improvements.includes(proposedImprovement)) {
        return { allowed: false, reason: 'Duplicate improvement detected.' };
    }

    return { allowed: true };
}

export async function evaluateNextMove(state, proposedImprovement) {
    const guardrailCheck = await checkGuardrails(state, proposedImprovement);
    if (!guardrailCheck.allowed) {
        return { action: 'STOP', reason: guardrailCheck.reason };
    }

    if (proposedImprovement) {
        return { action: 'APPLY_IMPROVEMENT', improvement: proposedImprovement };
    }

    return { action: 'IDLE', reason: 'No improvement proposed.' };
}

export async function recordRun(outcome, appliedImprovement = null) {
    const state = await loadState();
    state.run_count += 1;
    
    if (appliedImprovement) {
        state.improvements.push(appliedImprovement);
    }

    state.history.push({
        timestamp: new Date().toISOString(),
        outcome,
        improvement_applied: appliedImprovement
    });

    await saveState(state);
    return state;
}
