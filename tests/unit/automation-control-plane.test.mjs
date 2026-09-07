import assert from 'node:assert/strict';
import { execFile as execFileCallback } from 'node:child_process';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';

const execFile = promisify(execFileCallback);
const root = process.cwd();
const script = join(root, 'automation', 'control-plane.mjs');

async function run(dataDir, ...args) {
  const { stdout } = await execFile(process.execPath, [script, ...args, '--data-dir', dataDir], { cwd: root });
  return JSON.parse(stdout);
}

test('local task runs through admission, lease, and completion', async () => {
  const dataDir = await mkdtemp(join(tmpdir(), 'snf-control-plane-'));
  await run(dataDir, 'init');
  const admitted = await run(dataDir, 'enqueue', '--lane', 'research', '--title', 'Validate source ledger', '--source', 'DOV', '--fingerprint', 'research-001');

  assert.equal(admitted.task.status, 'queued');
  const claimed = await run(dataDir, 'claim', '--task', admitted.task.id, '--worker', 'research-worker');
  assert.equal(claimed.task.status, 'running');

  const completed = await run(dataDir, 'complete', '--task', admitted.task.id, '--worker', 'research-worker');
  assert.equal(completed.task.status, 'completed');
  const status = await run(dataDir, 'status');
  assert.equal(status.counts.completed, 1);
});

test('external work remains blocked until a named approval is recorded', async () => {
  const dataDir = await mkdtemp(join(tmpdir(), 'snf-control-plane-'));
  const admitted = await run(dataDir, 'enqueue', '--lane', 'storage', '--title', 'Upload reviewed packet', '--effect', 'drive_upload', '--source', 'local-artifact', '--fingerprint', 'drive-001');

  assert.equal(admitted.task.status, 'awaiting_approval');
  await assert.rejects(
    execFile(process.execPath, [script, 'claim', '--task', admitted.task.id, '--worker', 'storage-worker', '--data-dir', dataDir], { cwd: root }),
    /waiting for explicit approval/,
  );

  const approved = await run(dataDir, 'approve', '--task', admitted.task.id, '--approval-id', 'review-2026-08-23');
  assert.equal(approved.task.status, 'queued');
  const claimed = await run(dataDir, 'claim', '--task', admitted.task.id, '--worker', 'storage-worker');
  assert.equal(claimed.task.approval.id, 'review-2026-08-23');

  const events = await readFile(join(dataDir, 'events.jsonl'), 'utf8');
  assert.match(events, /^AUTOMATION_EVENT_V1 /m);
});

test('expired leases recover to the queue without clearing approval state', async () => {
  const dataDir = await mkdtemp(join(tmpdir(), 'snf-control-plane-'));
  const admitted = await run(dataDir, 'enqueue', '--lane', 'maintenance', '--title', 'Run focused accessibility audit', '--source', 'SNF_DEPLOY', '--fingerprint', 'maintenance-001');
  await run(dataDir, 'claim', '--task', admitted.task.id, '--worker', 'maintenance-worker');

  const queuePath = join(dataDir, 'queue.json');
  const queue = JSON.parse(await readFile(queuePath, 'utf8'));
  queue.tasks[0].lease.expires_at = '2000-01-01T00:00:00.000Z';
  await writeFile(queuePath, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');

  const recovered = await run(dataDir, 'recover');
  assert.deepEqual(recovered.recovered, [admitted.task.id]);
  assert.equal(recovered.state.counts.queued, 1);
});
