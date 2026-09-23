import assert from 'node:assert/strict';
import { execFile as execFileCallback } from 'node:child_process';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';
import { promisify } from 'node:util';

const execFile = promisify(execFileCallback);
const root = process.cwd();
const script = join(root, 'automation', 'job-inbox-router.mjs');
const contractPath = join(root, 'docs', 'job-inbox-reply-contract-2026-08-30.json');
const accountStatePath = join(root, 'docs', 'job-platform-account-state-2026-08-31.json');
const examplesDir = join(root, 'automation', 'examples', 'job-inbox-events');

async function runRoute(eventPayload, options = {}) {
  const dir = await mkdtemp(join(tmpdir(), 'snf-job-router-'));
  const eventPath = join(dir, 'event.json');
  await writeFile(eventPath, `${JSON.stringify(eventPayload, null, 2)}\n`, 'utf8');
  const args = [script, 'route', '--contract', contractPath, '--event', eventPath];
  if (options.accountStatePath) {
    args.push('--account-state', options.accountStatePath);
  }
  const { stdout } = await execFile(process.execPath, args, { cwd: root });
  return JSON.parse(stdout);
}

async function runValidate(eventPath) {
  const { stdout } = await execFile(process.execPath, [script, 'validate', '--event', eventPath], { cwd: root });
  return JSON.parse(stdout);
}

async function runCompose(eventPayload, options = {}) {
  const dir = await mkdtemp(join(tmpdir(), 'snf-job-router-compose-'));
  const eventPath = join(dir, 'event.json');
  await writeFile(eventPath, `${JSON.stringify(eventPayload, null, 2)}\n`, 'utf8');
  const args = [script, 'compose', '--contract', contractPath, '--event', eventPath];
  if (options.accountStatePath) {
    args.push('--account-state', options.accountStatePath);
  }
  const { stdout } = await execFile(process.execPath, args, { cwd: root });
  return JSON.parse(stdout);
}

test('routes recruiter scheduling outreach to reply_now with field-tech resume and draft', async () => {
  const result = await runRoute({
    source_type: 'gmail',
    source_label: 'Recruiter email',
    observed_at: '2026-08-30T18:00:00-04:00',
    sender_type: 'human',
    company: 'Acme Lock & Door',
    role: 'Access Control Technician',
    subject: 'Invitation to schedule prescreen interview',
    body: 'Hi David, are you still interested in the Access Control Technician role? Please use the Calendly link below to schedule your prescreen.',
    scheduling_link: 'https://example.com/calendly',
    requires_response: true,
  });

  assert.equal(result.queue, 'reply_now');
  assert.equal(result.resume_family, 'low_voltage_field_tech');
  assert.equal(result.proposed_action, 'reply');
  assert.equal(result.authorized_action, 'none');
  assert.match(result.draft, /still interested/i);
});

test('routes DataAnnotation listing to lead_review with remote AI resume and no draft', async () => {
  const result = await runRoute({
    source_type: 'public_web',
    source_label: 'DataAnnotation listing',
    observed_at: '2026-08-30T18:10:00-04:00',
    event_type: 'job_listing',
    company: 'DataAnnotation',
    role: 'Generalist',
    subject: 'Generalist',
    body: 'As a Generalist you will review and rate AI responses across a wide range of everyday topics.',
  });

  assert.equal(result.queue, 'lead_review');
  assert.equal(result.resume_family, 'remote_ai_search_quality');
  assert.equal(result.proposed_action, 'review_existing_account_state');
  assert.equal(result.draft, null);
  assert.match(result.next_action, /existing account/i);
});

test('routes automated application confirmation to wait with log-only behavior', async () => {
  const result = await runRoute({
    source_type: 'gmail',
    source_label: 'Application confirmation',
    observed_at: '2026-08-30T18:20:00-04:00',
    event_type: 'application_confirmation',
    sender_type: 'automation',
    company: 'TeamSnap',
    role: 'Customer Support Specialist',
    subject: 'Thank you for applying',
    body: 'Thank you for applying to the Customer Support Specialist role. This is an automated message. Please do not reply.',
  });

  assert.equal(result.queue, 'wait');
  assert.equal(result.resume_family, 'remote_saas_product_support');
  assert.equal(result.proposed_action, 'log_only');
  assert.equal(result.draft, null);
});

test('uses platform account state to keep existing applications from being treated as new applies', async () => {
  const result = await runRoute({
    source_type: 'public_web',
    source_label: 'TELUS listing',
    observed_at: '2026-08-31T09:05:00-04:00',
    event_type: 'job_listing',
    company: 'TELUS Digital',
    role: 'Online Data Analyst - United States of America',
    subject: 'Online Data Analyst - United States of America',
    body: 'Remote rating and online data analyst work with guidelines and quality checks.'
  }, { accountStatePath });

  assert.equal(result.resume_family, 'remote_ai_search_quality');
  assert.equal(result.proposed_action, 'complete_existing_assessment_if_approved');
  assert.match(result.next_action, /assessment/i);
  assert.equal(result.platform_state.workflow_state, 'assessment_pending');
});

test('uses platform account state to suppress duplicate-apply advice when already applied', async () => {
  const result = await runRoute({
    source_type: 'public_web',
    source_label: 'Existing applied role listing',
    observed_at: '2026-08-31T09:10:00-04:00',
    event_type: 'job_listing',
    company: 'Acme Support',
    role: 'Customer Support Specialist',
    subject: 'Customer Support Specialist',
    body: 'Remote email and chat support role.'
  }, { accountStatePath: await (async () => {
    const dir = await mkdtemp(join(tmpdir(), 'snf-job-router-state-'));
    const path = join(dir, 'account-state.json');
    await writeFile(path, `${JSON.stringify({
      registry_version: 'test-v1',
      as_of: '2026-08-31T09:00:00-04:00',
      entries: [
        {
          company: 'Acme Support',
          platform: 'Acme Support',
          resume_family: 'remote_saas_product_support',
          access_state: 'accessible',
          workflow_state: 'applied',
          contact_history_state: 'applied',
          last_confirmed_at: '2026-08-31T08:55:00-04:00'
        }
      ]
    }, null, 2)}\n`, 'utf8');
    return path;
  })() });

  assert.equal(result.queue, 'wait');
  assert.equal(result.proposed_action, 'monitor_existing_thread');
  assert.match(result.next_action, /existing application/i);
  assert.equal(result.contact_history_state, 'applied');
});

test('validates example event packets', async () => {
  const leadReview = await runValidate(join(examplesDir, 'lead-review-welo-data.json'));
  const replyNow = await runValidate(join(examplesDir, 'reply-now-human-outreach.json'));
  const wait = await runValidate(join(examplesDir, 'wait-application-confirmation.json'));

  assert.equal(leadReview.valid, true);
  assert.equal(replyNow.valid, true);
  assert.equal(wait.valid, true);
});

test('compose returns a reply packet with resume and approval gate for reply-now events', async () => {
  const packet = await runCompose({
    source_type: 'gmail',
    source_label: 'Recruiter email',
    observed_at: '2026-08-31T10:00:00-04:00',
    event_type: 'human_outreach',
    sender_type: 'human',
    company: 'Acme Lock & Door',
    role: 'Access Control Technician',
    subject: 'Invitation to schedule prescreen interview',
    body: 'Hi David, are you still interested? Use the scheduling link to book time.',
    contact_name: 'Jordan',
    scheduling_link: 'https://example.com/calendly',
    requires_response: true
  });

  assert.equal(packet.packet_type, 'job_reply_packet_v1');
  assert.equal(packet.queue, 'reply_now');
  assert.equal(packet.resume_family, 'low_voltage_field_tech');
  assert.equal(packet.resume_artifact.resume_family, 'low_voltage_field_tech');
  assert.equal(packet.reply_template_id, 'human_schedule_acknowledgement');
  assert.equal(packet.approval.required, true);
  assert.equal(packet.approval.authorized_action, 'none');
  assert.match(packet.draft, /still interested/i);
});
