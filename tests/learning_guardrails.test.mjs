import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs/promises';
import path from 'path';
import {
    loadState,
    saveState,
    runOptimizerLoop,
    setFilePaths
} from '../scripts/optimizer_loop.mjs';

const TEST_STATE_FILE = path.join(process.cwd(), 'data', 'test_learning_state.json');
const TEST_REPORT_FILE = path.join(process.cwd(), 'outputs', 'test_system_report.md');
setFilePaths(TEST_STATE_FILE, TEST_REPORT_FILE);

async function resetTestFiles() {
    try { await fs.unlink(TEST_STATE_FILE); } catch (e) { if (e.code !== 'ENOENT') throw e; }
    try { await fs.unlink(TEST_REPORT_FILE); } catch (e) { if (e.code !== 'ENOENT') throw e; }
}

test('Guardrail: Hard reserve policy (usage > 95%)', async (t) => {
    await resetTestFiles();
    await saveState({
        run_count: 0,
        weekly_estimate_usage_pct: 96.0,
        builder_state: 'IDLE'
    });
    
    const { nextAction } = await runOptimizerLoop();
    assert.match(nextAction, /Hard 5% reserve policy enforced/);
});

test('Guardrail: 6-hour builder short-circuit', async (t) => {
    await resetTestFiles();
    await saveState({
        run_count: 0,
        weekly_estimate_usage_pct: 50.0,
        builder_state: 'SIX_HOUR_ACTIVE'
    });
    
    const { nextAction } = await runOptimizerLoop();
    assert.match(nextAction, /6-hour builder is currently active/);
});

test('Optimizer: Generates recommendation when capacity allows', async (t) => {
    await resetTestFiles();
    await saveState({
        run_count: 0,
        weekly_estimate_usage_pct: 50.0,
        builder_state: 'IDLE'
    });
    
    const { nextAction } = await runOptimizerLoop();
    assert.match(nextAction, /Implement 'Automate daily state snapshot'/);
    
    // verify report is generated
    const reportStr = await fs.readFile(TEST_REPORT_FILE, 'utf8');
    assert.match(reportStr, /Accessibility Statement/);
    assert.match(reportStr, /\*\*ClickUp\*\*: Unavailable/);
});

test('State Integrity: run_count is updated', async (t) => {
    await resetTestFiles();
    await saveState({
        run_count: 0,
        weekly_estimate_usage_pct: 0.0,
        builder_state: 'IDLE'
    });
    
    await runOptimizerLoop();
    const state = await loadState();
    
    assert.strictEqual(state.run_count, 1);
    await resetTestFiles();
});
