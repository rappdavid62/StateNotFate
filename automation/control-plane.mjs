#!/usr/bin/env node
/**
 * State Not Fate automation control plane.
 *
 * This is an intentionally local-only queue. It records work for research,
 * writing, video, maintenance, storage, and GitHub lanes, but it never
 * performs a network action. External effects must be explicitly approved
 * before a worker may claim the task, and a worker still has to use its own
 * approved connector or human handoff to perform the effect.
 */

import { createHash, randomUUID } from 'node:crypto';
import {
  appendFile,
  mkdir,
  open,
  readFile,
  rename,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { join, resolve } from 'node:path';

const VERSION = 1;
const DEFAULT_DATA_DIR = 'outputs/automation-control-plane';
const LOCK_STALE_MS = 5 * 60 * 1000;
const LOCK_RETRIES = 20;
const LOCK_RETRY_MS = 50;
const DEFAULT_LEASE_SECONDS = 15 * 60;

const LANES = new Set([
  'research',
  'writing',
  'insight',
  'video',
  'maintenance',
  'storage',
  'github',
]);

const EFFECTS = new Set([
  'local',
  'github_write',
  'netlify_deploy',
  'drive_upload',
  'wisebase_upload',
  'public_publish',
  'delete',
]);

const EXTERNAL_EFFECTS = new Set([
  'github_write',
  'netlify_deploy',
  'drive_upload',
  'wisebase_upload',
  'public_publish',
  'delete',
]);

function fail(message) {
  throw new Error(message);
}

function now() {
  return new Date().toISOString();
}

function delay(milliseconds) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = {};

  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token.startsWith('--')) fail(`Unexpected argument: ${token}`);

    const [rawKey, inlineValue] = token.slice(2).split('=', 2);
    if (!rawKey) fail('Option names cannot be empty');
    if (inlineValue !== undefined) {
      options[rawKey] = inlineValue;
      continue;
    }

    const next = rest[index + 1];
    if (next === undefined || next.startsWith('--')) {
      options[rawKey] = true;
      continue;
    }

    options[rawKey] = next;
    index += 1;
  }

  return { command, options };
}

function required(options, key) {
  const value = options[key];
  if (typeof value !== 'string' || value.trim() === '') {
    fail(`Missing required --${key}`);
  }
  return value.trim();
}

function boundedText(value, label, maximum = 160) {
  if (value.length > maximum) fail(`${label} must be ${maximum} characters or fewer`);
  return value;
}

function approvalRequired(effect) {
  return EXTERNAL_EFFECTS.has(effect);
}

function runtimePaths(options) {
  const dataDir = resolve(String(options['data-dir'] ?? DEFAULT_DATA_DIR));
  return {
    dataDir,
    state: join(dataDir, 'queue.json'),
    events: join(dataDir, 'events.jsonl'),
    lock: join(dataDir, 'control-plane.lock'),
  };
}

function initialState() {
  return { version: VERSION, tasks: [] };
}

async function readState(paths) {
  await mkdir(paths.dataDir, { recursive: true });
  try {
    const parsed = JSON.parse(await readFile(paths.state, 'utf8'));
    if (parsed?.version !== VERSION || !Array.isArray(parsed.tasks)) {
      fail(`Unsupported queue state in ${paths.state}`);
    }
    return parsed;
  } catch (error) {
    if (error?.code === 'ENOENT') return initialState();
    throw error;
  }
}

async function writeState(paths, state) {
  const temporary = `${paths.state}.${randomUUID()}.tmp`;
  await writeFile(temporary, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
  await rename(temporary, paths.state);
}

function eventFingerprint(task) {
  return task.fingerprint ?? createHash('sha256')
    .update(`${task.lane}|${task.title}|${task.effect}`)
    .digest('hex')
    .slice(0, 20);
}

async function appendEvent(paths, task, result, next) {
  const event = {
    at: now(),
    automation_id: 'snf-control-plane',
    lane: task?.lane ?? 'system',
    result,
    severity: result === 'failed' ? 'red' : task?.status === 'awaiting_approval' ? 'yellow' : 'green',
    fingerprint: task ? eventFingerprint(task) : 'snf-control-plane-init',
    artifacts: task?.artifact_dir ? [task.artifact_dir] : [],
    approval_ids: task?.approval?.id ? [task.approval.id] : [],
    next,
    ttl_hours: 24,
  };
  await appendFile(paths.events, `AUTOMATION_EVENT_V1 ${JSON.stringify(event)}\n`, 'utf8');
  return event;
}

async function withLock(paths, operation) {
  await mkdir(paths.dataDir, { recursive: true });
  let handle;

  for (let attempt = 0; attempt < LOCK_RETRIES; attempt += 1) {
    try {
      handle = await open(paths.lock, 'wx');
      await handle.writeFile(JSON.stringify({ pid: process.pid, acquired_at: now() }));
      break;
    } catch (error) {
      if (error?.code !== 'EEXIST') throw error;

      try {
        const info = await stat(paths.lock);
        if (Date.now() - info.mtimeMs > LOCK_STALE_MS) {
          await rm(paths.lock, { force: true });
          continue;
        }
      } catch (statError) {
        if (statError?.code !== 'ENOENT') throw statError;
      }

      await delay(LOCK_RETRY_MS);
    }
  }

  if (!handle) fail(`Queue is busy: ${paths.lock}`);

  try {
    return await operation();
  } finally {
    await handle.close();
    await rm(paths.lock, { force: true });
  }
}

function findTask(state, id) {
  const task = state.tasks.find((candidate) => candidate.id === id);
  if (!task) fail(`Task not found: ${id}`);
  return task;
}

function assertClaimable(task) {
  if (task.status === 'awaiting_approval') {
    fail(`Task ${task.id} is waiting for explicit approval`);
  }
  if (task.status !== 'queued') fail(`Task ${task.id} is not queued`);
  if (approvalRequired(task.effect) && !task.approval?.id) {
    fail(`Task ${task.id} requires an approval id before it can run`);
  }
}

function summarize(state) {
  const counts = {};
  for (const task of state.tasks) counts[task.status] = (counts[task.status] ?? 0) + 1;
  return {
    version: state.version,
    total: state.tasks.length,
    counts,
    awaiting_approval: state.tasks
      .filter((task) => task.status === 'awaiting_approval')
      .map((task) => ({ id: task.id, lane: task.lane, title: task.title, effect: task.effect })),
  };
}

async function initialize(paths) {
  return withLock(paths, async () => {
    const state = await readState(paths);
    const existing = await readFile(paths.state, 'utf8').catch((error) => error?.code === 'ENOENT' ? null : Promise.reject(error));
    if (existing === null) await writeState(paths, state);
    const event = await appendEvent(paths, null, 'no_delta', 'Queue is ready for local task admission.');
    return { state: summarize(state), event };
  });
}

async function enqueue(paths, options) {
  const lane = required(options, 'lane');
  const title = boundedText(required(options, 'title'), 'title');
  const effect = String(options.effect ?? 'local');
  const source = boundedText(String(options.source ?? 'unspecified'), 'source', 80);
  const fingerprint = boundedText(String(options.fingerprint ?? ''), 'fingerprint', 128) || createHash('sha256')
    .update(`${lane}|${title}|${effect}|${source}`)
    .digest('hex')
    .slice(0, 20);

  if (!LANES.has(lane)) fail(`Unsupported lane: ${lane}`);
  if (!EFFECTS.has(effect)) fail(`Unsupported effect: ${effect}`);

  return withLock(paths, async () => {
    const state = await readState(paths);
    const duplicate = state.tasks.find((task) => task.fingerprint === fingerprint && !['completed', 'failed'].includes(task.status));
    if (duplicate) {
      return { task: duplicate, duplicate: true, event: null };
    }

    const task = {
      id: `snf-${randomUUID()}`,
      lane,
      title,
      source,
      effect,
      fingerprint,
      status: approvalRequired(effect) ? 'awaiting_approval' : 'queued',
      approval: { required: approvalRequired(effect), id: null, approved_at: null },
      artifact_dir: `outputs/automation-artifacts/${lane}`,
      lease: null,
      attempts: 0,
      created_at: now(),
      updated_at: now(),
    };
    state.tasks.push(task);
    await writeState(paths, state);
    const event = await appendEvent(
      paths,
      task,
      'changed',
      task.status === 'awaiting_approval' ? 'Record an explicit approval id before claiming this task.' : 'A local worker may claim this task.',
    );
    return { task, duplicate: false, event };
  });
}

async function approve(paths, options) {
  const taskId = required(options, 'task');
  const approvalId = boundedText(required(options, 'approval-id'), 'approval-id', 128);

  return withLock(paths, async () => {
    const state = await readState(paths);
    const task = findTask(state, taskId);
    if (!approvalRequired(task.effect)) fail(`Task ${task.id} has no external effect to approve`);
    if (task.status !== 'awaiting_approval') fail(`Task ${task.id} is not waiting for approval`);

    task.approval = { required: true, id: approvalId, approved_at: now() };
    task.status = 'queued';
    task.updated_at = now();
    await writeState(paths, state);
    const event = await appendEvent(paths, task, 'changed', 'A worker may claim the approved task; external execution remains separate.');
    return { task, event };
  });
}

async function claim(paths, options) {
  const worker = boundedText(required(options, 'worker'), 'worker', 80);
  const requestedTask = options.task ? String(options.task) : null;
  const leaseSeconds = Number(options['lease-seconds'] ?? DEFAULT_LEASE_SECONDS);
  if (!Number.isInteger(leaseSeconds) || leaseSeconds < 1 || leaseSeconds > 86400) {
    fail('--lease-seconds must be an integer from 1 to 86400');
  }

  return withLock(paths, async () => {
    const state = await readState(paths);
    const task = requestedTask ? findTask(state, requestedTask) : state.tasks.find((candidate) => candidate.status === 'queued');
    if (!task) fail('No queued task is available');
    assertClaimable(task);

    task.status = 'running';
    task.attempts += 1;
    task.lease = {
      worker,
      acquired_at: now(),
      expires_at: new Date(Date.now() + leaseSeconds * 1000).toISOString(),
    };
    task.updated_at = now();
    await writeState(paths, state);
    const event = await appendEvent(paths, task, 'changed', 'Worker must complete, fail, or allow lease recovery.');
    return { task, event };
  });
}

async function finish(paths, options, status) {
  const taskId = required(options, 'task');
  const worker = boundedText(required(options, 'worker'), 'worker', 80);

  return withLock(paths, async () => {
    const state = await readState(paths);
    const task = findTask(state, taskId);
    if (task.status !== 'running' || task.lease?.worker !== worker) {
      fail(`Only the current worker may mark task ${task.id} ${status}`);
    }

    task.status = status;
    task.lease = null;
    task.updated_at = now();
    await writeState(paths, state);
    const event = await appendEvent(paths, task, status === 'failed' ? 'failed' : 'changed', `Task recorded as ${status}; no external action was performed by this control plane.`);
    return { task, event };
  });
}

async function recover(paths) {
  return withLock(paths, async () => {
    const state = await readState(paths);
    const currentTime = Date.now();
    const recovered = [];

    for (const task of state.tasks) {
      if (task.status !== 'running' || !task.lease?.expires_at) continue;
      if (Date.parse(task.lease.expires_at) > currentTime) continue;
      task.status = 'queued';
      task.lease = null;
      task.updated_at = now();
      recovered.push(task);
    }

    if (recovered.length > 0) await writeState(paths, state);
    const events = [];
    for (const task of recovered) {
      events.push(await appendEvent(paths, task, 'changed', 'Expired lease recovered to the queue.'));
    }
    return { recovered: recovered.map((task) => task.id), events, state: summarize(state) };
  });
}

function usage() {
  return [
    'Usage: node automation/control-plane.mjs <command> [options]',
    '',
    'Commands:',
    '  init [--data-dir path]',
    '  enqueue --lane <lane> --title <title> [--effect local] [--source source] [--fingerprint id] [--data-dir path]',
    '  approve --task <id> --approval-id <recorded-approval> [--data-dir path]',
    '  claim --worker <name> [--task id] [--lease-seconds 900] [--data-dir path]',
    '  complete --task <id> --worker <name> [--data-dir path]',
    '  fail --task <id> --worker <name> [--data-dir path]',
    '  recover [--data-dir path]',
    '  status [--data-dir path]',
    '',
    `Lanes: ${[...LANES].join(', ')}`,
    `Effects requiring approval: ${[...EXTERNAL_EFFECTS].join(', ')}`,
  ].join('\n');
}

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));
  if (!command || command === 'help' || command === '--help') {
    console.log(usage());
    return;
  }

  const paths = runtimePaths(options);
  let output;
  switch (command) {
    case 'init': output = await initialize(paths); break;
    case 'enqueue': output = await enqueue(paths, options); break;
    case 'approve': output = await approve(paths, options); break;
    case 'claim': output = await claim(paths, options); break;
    case 'complete': output = await finish(paths, options, 'completed'); break;
    case 'fail': output = await finish(paths, options, 'failed'); break;
    case 'recover': output = await recover(paths); break;
    case 'status': output = summarize(await readState(paths)); break;
    default: fail(`Unknown command: ${command}`);
  }
  console.log(JSON.stringify(output, null, 2));
}

main().catch((error) => {
  console.error(`control-plane error: ${error.message}`);
  process.exitCode = 1;
});
