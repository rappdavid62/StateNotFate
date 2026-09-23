#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';

const SCHEMA_VERSION = '1.0.0';
const SOURCE_TYPES = new Set(['gmail', 'public_web', 'google_drive', 'wisebase', 'github', 'local_artifact', 'user_report']);
const EVENT_TYPES = new Set(['job_listing', 'recruiter_blast', 'human_outreach', 'application_confirmation', 'status_update', 'manual_note']);
const SENDER_TYPES = new Set(['human', 'automation', 'unknown']);
const CURRENTNESS = new Set(['current', 'snapshot', 'stale', 'unavailable']);
const STATUS_VALUES = new Set(['active', 'rejected', 'closed', 'unknown']);
const CONTACT_HISTORY_STATES = new Set(['unknown', 'no_prior_action', 'saved', 'applied', 'contacted', 'rejected', 'closed']);
const ACCESS_STATES = new Set(['unknown', 'accessible', 'inaccessible', 'gmail_confirmed', 'google_sign_in_confirmed']);
const WORKFLOW_STATES = new Set(['unknown', 'not_started', 'started', 'applied', 'assessment_pending', 'assessment_completed', 'contacted', 'interview_requested', 'rejected', 'closed']);

function fail(message) {
  throw new Error(message);
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = {};

  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token.startsWith('--')) fail(`Unexpected argument: ${token}`);

    const [key, inlineValue] = token.slice(2).split('=', 2);
    if (!key) fail('Option names cannot be empty');

    if (inlineValue !== undefined) {
      options[key] = inlineValue;
      continue;
    }

    const next = rest[index + 1];
    if (next === undefined || next.startsWith('--')) {
      options[key] = true;
      continue;
    }

    options[key] = next;
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

function normalize(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function slug(value) {
  return normalize(value).replace(/\s+/g, '-');
}

function containsAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function nowIso() {
  return new Date().toISOString();
}

function hashFingerprint(parts) {
  return createHash('sha256').update(parts.join('|')).digest('hex');
}

async function readJson(path) {
  return JSON.parse(await readFile(resolve(path), 'utf8'));
}

function resolveOptionalPath(path) {
  if (!path || typeof path !== 'string' || path.trim() === '') return null;
  return resolve(path.trim());
}

function assertEnum(value, allowed, fieldName) {
  if (typeof value !== 'string' || !allowed.has(value)) {
    fail(`Invalid ${fieldName}: expected one of ${Array.from(allowed).join(', ')}`);
  }
}

function assertString(value, fieldName) {
  if (typeof value !== 'string' || value.trim() === '') {
    fail(`Invalid ${fieldName}: expected non-empty string`);
  }
}

function assertOptionalString(value, fieldName) {
  if (value === undefined || value === null) return;
  assertString(value, fieldName);
}

function assertBoolean(value, fieldName) {
  if (typeof value !== 'boolean') {
    fail(`Invalid ${fieldName}: expected boolean`);
  }
}

function assertIsoDateTime(value, fieldName) {
  assertString(value, fieldName);
  const time = Date.parse(value);
  if (Number.isNaN(time)) {
    fail(`Invalid ${fieldName}: expected ISO-8601 date-time`);
  }
}

function validateEvent(event) {
  if (!event || typeof event !== 'object' || Array.isArray(event)) {
    fail('Invalid event: expected object');
  }

  if (event.schema_version !== undefined && event.schema_version !== SCHEMA_VERSION) {
    fail(`Invalid schema_version: expected ${SCHEMA_VERSION}`);
  }

  assertEnum(event.source_type, SOURCE_TYPES, 'source_type');
  assertString(event.source_label, 'source_label');
  assertIsoDateTime(event.observed_at, 'observed_at');
  assertString(event.company, 'company');

  if (!event.role && !event.subject) {
    fail('Invalid event: at least one of role or subject is required');
  }

  assertEnum(event.event_type ?? 'manual_note', EVENT_TYPES, 'event_type');
  assertEnum(event.sender_type ?? 'unknown', SENDER_TYPES, 'sender_type');
  assertEnum(event.currentness ?? 'current', CURRENTNESS, 'currentness');
  assertEnum(event.status ?? 'active', STATUS_VALUES, 'status');
  assertEnum(event.contact_history_state ?? 'unknown', CONTACT_HISTORY_STATES, 'contact_history_state');

  assertOptionalString(event.role, 'role');
  assertOptionalString(event.subject, 'subject');
  assertOptionalString(event.body, 'body');
  assertOptionalString(event.snippet, 'snippet');
  assertOptionalString(event.contact_name, 'contact_name');
  assertOptionalString(event.scheduling_link, 'scheduling_link');

  if (event.requires_response !== undefined) {
    assertBoolean(event.requires_response, 'requires_response');
  }

  return {
    valid: true,
    schema_version: event.schema_version ?? SCHEMA_VERSION,
    source_type: event.source_type,
    event_type: event.event_type ?? 'manual_note',
    company: event.company,
    role: event.role ?? null,
  };
}

function validateAccountStateRegistry(registry) {
  if (!registry || typeof registry !== 'object' || Array.isArray(registry)) {
    fail('Invalid account-state registry: expected object');
  }

  if (!Array.isArray(registry.entries)) {
    fail('Invalid account-state registry: entries must be an array');
  }

  for (const entry of registry.entries) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      fail('Invalid account-state registry entry: expected object');
    }
    assertString(entry.company, 'account-state entry company');
    assertEnum(entry.access_state ?? 'unknown', ACCESS_STATES, 'account-state access_state');
    assertEnum(entry.workflow_state ?? 'unknown', WORKFLOW_STATES, 'account-state workflow_state');
    assertEnum(entry.contact_history_state ?? 'unknown', CONTACT_HISTORY_STATES, 'account-state contact_history_state');
    assertOptionalString(entry.platform, 'account-state platform');
    assertOptionalString(entry.resume_family, 'account-state resume_family');
    assertOptionalString(entry.next_action, 'account-state next_action');
    assertOptionalString(entry.last_confirmed_at, 'account-state last_confirmed_at');
    if (entry.last_confirmed_at !== undefined) {
      assertIsoDateTime(entry.last_confirmed_at, 'account-state last_confirmed_at');
    }
    if (entry.company_aliases !== undefined && !Array.isArray(entry.company_aliases)) {
      fail('Invalid account-state company_aliases: expected array');
    }
    if (entry.role_keywords !== undefined && !Array.isArray(entry.role_keywords)) {
      fail('Invalid account-state role_keywords: expected array');
    }
    if (entry.notes !== undefined && !Array.isArray(entry.notes)) {
      fail('Invalid account-state notes: expected array');
    }
    if (entry.blockers !== undefined && !Array.isArray(entry.blockers)) {
      fail('Invalid account-state blockers: expected array');
    }
  }

  return registry;
}

function classifyQueue(text, event) {
  const closedTerms = [
    'unfortunately',
    'not moving forward',
    'position has been filled',
    'role has been filled',
    'we will not be moving forward',
    'we have decided to move forward with other candidates',
    'rejected',
    'declined',
  ];
  if (containsAny(text, closedTerms) || event.status === 'rejected') {
    return { queue: 'closed', contactState: 'closed', proposedAction: 'none' };
  }

  const waitTerms = [
    'thank you for applying',
    'application submitted',
    'application received',
    'we have received your application',
    'do not reply',
    'automated message',
    'this is an automated',
  ];
  if (event.event_type === 'application_confirmation' || containsAny(text, waitTerms)) {
    return { queue: 'wait', contactState: 'waiting', proposedAction: 'log_only' };
  }

  const replyTerms = [
    'schedule',
    'interview',
    'prescreen',
    'choose a time',
    'calendly',
    'reply to this email',
    'are you still interested',
    'let us know your availability',
  ];
  if (event.event_type === 'human_outreach' || event.requires_response === true || (event.sender_type === 'human' && containsAny(text, replyTerms))) {
    return { queue: 'reply_now', contactState: 'reply_now', proposedAction: 'reply' };
  }

  if (event.source_type === 'public_web' || event.event_type === 'job_listing' || event.event_type === 'recruiter_blast') {
    return { queue: 'lead_review', contactState: 'discovered', proposedAction: 'review' };
  }

  return { queue: 'lead_review', contactState: 'discovered', proposedAction: 'review' };
}

function chooseResumeFamily(text, company, role) {
  const exactMap = new Map([
    ['dataannotation', 'remote_ai_search_quality'],
    ['telus digital', 'remote_ai_search_quality'],
    ['telus', 'remote_ai_search_quality'],
    ['welo data', 'remote_ai_search_quality'],
    ['welocalize', 'remote_ai_search_quality'],
    ['teamsnap', 'remote_saas_product_support'],
    ['everway', 'remote_saas_product_support'],
  ]);

  const exact = exactMap.get(normalize(company));
  if (exact) return exact;

  if (containsAny(text, ['peer recovery', 'recovery support', 'behavioral health', 'mental health'])) {
    return 'prs_care';
  }

  if (containsAny(text, [
    'low voltage',
    'security system',
    'alarm',
    'cctv',
    'field technician',
    'access control',
    'hvac',
    'service technician',
  ])) {
    return 'low_voltage_field_tech';
  }

  if (containsAny(text, [
    'customer support',
    'product support',
    'customer success',
    'knowledge base',
    'ticket',
    'zendesk',
    'saas',
    'email and chat',
    'support specialist',
  ])) {
    return 'remote_saas_product_support';
  }

  if (containsAny(text, [
    'ai',
    'prompt',
    'search quality',
    'rater',
    'relevance',
    'online data analyst',
    'media search analyst',
    'evaluation',
    'annotat',
    'review ai',
    'rubric',
  ])) {
    return 'remote_ai_search_quality';
  }

  const normalizedRole = normalize(role);
  if (normalizedRole.includes('support')) return 'remote_saas_product_support';
  return 'remote_ai_search_quality';
}

function chooseLane(resumeFamily) {
  const laneMap = {
    remote_ai_search_quality: 'remote_ai_search_quality',
    remote_saas_product_support: 'remote_saas_support',
    low_voltage_field_tech: 'field_runway',
    prs_care: 'prs_care',
    none: 'remote_ops_trust_safety',
  };
  return laneMap[resumeFamily] ?? 'remote_ops_trust_safety';
}

function knownQueueOverride(contract, company, role) {
  const normalizedCompany = normalize(company);
  const normalizedRole = normalize(role);
  return contract.current_queue?.find((item) =>
    normalize(item.company) === normalizedCompany && normalize(item.role) === normalizedRole
  );
}

function findAccountState(accountStateRegistry, company, role) {
  if (!accountStateRegistry?.entries?.length) return null;

  const normalizedCompany = normalize(company);
  const normalizedRole = normalize(role);

  for (const entry of accountStateRegistry.entries) {
    const companyNames = [entry.company, ...(entry.company_aliases ?? [])].map((value) => normalize(value));
    if (!companyNames.includes(normalizedCompany)) continue;

    const roleKeywords = (entry.role_keywords ?? []).map((value) => normalize(value));
    if (roleKeywords.length > 0 && !roleKeywords.some((keyword) => normalizedRole.includes(keyword))) {
      continue;
    }

    return entry;
  }

  return null;
}

function workflowToContactHistoryState(workflowState) {
  const mapping = {
    applied: 'applied',
    contacted: 'contacted',
    interview_requested: 'contacted',
    rejected: 'rejected',
    closed: 'closed',
  };
  return mapping[workflowState] ?? 'unknown';
}

function applyAccountState(base, platformState) {
  if (!platformState) return { ...base, accountNextAction: null };

  const workflowState = platformState.workflow_state ?? 'unknown';
  const accountNextAction = platformState.next_action ?? null;

  if (workflowState === 'rejected' || workflowState === 'closed') {
    return {
      queue: 'closed',
      contactState: workflowToContactHistoryState(workflowState),
      proposedAction: 'none',
      accountNextAction,
    };
  }

  if (base.queue === 'lead_review') {
    if (workflowState === 'unknown' && (platformState.access_state === 'inaccessible' || platformState.access_state === 'google_sign_in_confirmed')) {
      return {
        ...base,
        proposedAction: 'review_existing_account_state',
        accountNextAction: accountNextAction ?? 'Check the existing platform account state before treating this as a fresh application.',
      };
    }

    if (workflowState === 'applied' || workflowState === 'contacted' || workflowState === 'interview_requested') {
      return {
        queue: 'wait',
        contactState: workflowToContactHistoryState(workflowState),
        proposedAction: 'monitor_existing_thread',
        accountNextAction: accountNextAction ?? 'An existing application or recruiter thread is already recorded. Do not start a new application from this event.',
      };
    }

    if (workflowState === 'started') {
      return {
        ...base,
        proposedAction: 'resume_existing_application_if_approved',
        accountNextAction: accountNextAction ?? 'Resume the existing application flow instead of starting over.',
      };
    }

    if (workflowState === 'assessment_pending') {
      return {
        ...base,
        proposedAction: 'complete_existing_assessment_if_approved',
        accountNextAction: accountNextAction ?? 'An assessment is already pending. Resume that assessment before treating this as a fresh application.',
      };
    }
  }

  return {
    ...base,
    accountNextAction,
  };
}

function renderDraft(event, decision) {
  if (decision.queue !== 'reply_now') return null;

  const recruiterName = event.contact_name || 'there';
  const nameText = recruiterName === 'there' ? recruiterName : recruiterName.replace(/\s+/g, ' ').trim();
  const role = event.role || 'role';
  return `Hi ${nameText},\n\nThank you for reaching out. I am still interested in the ${role} opportunity and would be glad to continue the process. ${event.scheduling_link ? 'I can use the scheduling link you sent, or I am happy to coordinate by email if that is easier.' : 'I am happy to coordinate next steps and provide anything else you need.'}\n\nBest,\nDavid Rapp`;
}

function formatResumeArtifact(contract, resumeFamily) {
  const entry = contract.resume_registry?.find((item) => item.resume_family === resumeFamily);
  if (!entry) return null;
  return {
    resume_family: entry.resume_family,
    status: entry.status,
    primary_artifact: entry.primary_artifact,
    secondary_artifact: entry.secondary_artifact ?? null,
  };
}

function selectReplyTemplate(contract, event, decision) {
  if (decision.queue !== 'reply_now') return null;
  if (event.scheduling_link) {
    return contract.reply_templates?.find((item) => item.template_id === 'human_schedule_acknowledgement') ?? null;
  }
  return contract.reply_templates?.find((item) => item.template_id === 'human_followup_after_delay') ?? null;
}

function buildApprovalBlock(contract, event, decision) {
  return {
    required: true,
    authorized_action: 'none',
    approval_state: 'pending',
    rule: contract.approval_boundary?.rule ?? 'Explicit approval required before any outbound action.',
    requires_exact_approval_for: {
      company: event.company,
      role: event.role ?? event.subject ?? null,
      proposed_action: decision.proposed_action,
      event_id: decision.event_id,
    },
  };
}

function buildReplyPacket(contract, event, decision) {
  const template = selectReplyTemplate(contract, event, decision);
  return {
    packet_type: 'job_reply_packet_v1',
    created_at: nowIso(),
    company: event.company,
    role: event.role ?? event.subject ?? null,
    queue: decision.queue,
    lane: decision.lane,
    proposed_action: decision.proposed_action,
    contact_state: decision.contact_state,
    contact_history_state: decision.contact_history_state,
    resume_family: decision.resume_family,
    resume_artifact: decision.resume_artifact,
    reply_template_id: template?.template_id ?? null,
    draft: decision.draft,
    next_action: decision.next_action,
    approval: buildApprovalBlock(contract, event, decision),
    platform_state: decision.platform_state,
    evidence: decision.evidence,
    lead_key: decision.lead_key,
    event_id: decision.event_id,
    material_fingerprint: decision.material_fingerprint,
  };
}

function buildDecision(contract, event, accountStateRegistry = null) {
  const company = event.company || 'unknown-company';
  const role = event.role || event.subject || 'unknown-role';
  const combinedText = normalize([
    company,
    role,
    event.subject,
    event.body,
    event.snippet,
  ].filter(Boolean).join(' '));

  const base = classifyQueue(combinedText, event);
  const platformState = findAccountState(accountStateRegistry, company, role);
  const accountAwareBase = applyAccountState(base, platformState);
  const resumeFamily = platformState?.resume_family ?? chooseResumeFamily(combinedText, company, role);
  const lane = chooseLane(resumeFamily);
  const known = knownQueueOverride(contract, company, role);

  let queue = accountAwareBase.queue;
  let proposedAction = accountAwareBase.proposedAction;
  let nextAction;

  const shouldUseKnownQueueHints =
    known &&
    accountAwareBase.queue === 'lead_review' &&
    accountAwareBase.proposedAction === base.proposedAction &&
    !accountAwareBase.accountNextAction;

  if (shouldUseKnownQueueHints) {
    queue = known.queue;
    nextAction = known.next_action;
  }

  if (!nextAction && accountAwareBase.accountNextAction) {
    nextAction = accountAwareBase.accountNextAction;
  }

  if (!nextAction) {
    if (queue === 'reply_now') {
      nextAction = 'Prepare the matching reply draft and stop for David approval before sending.';
    } else if (queue === 'wait') {
      nextAction = 'Log the event only. Do not reply.';
    } else if (queue === 'backup') {
      nextAction = 'Keep as a lower-priority option unless the stronger queue is exhausted.';
    } else if (queue === 'closed') {
      nextAction = 'Keep for history only. Do not surface as active.';
    } else {
      nextAction = 'Review the role, confirm prior account or application state, and stop for approval before any outbound action.';
    }
  }

  if (shouldUseKnownQueueHints) {
    proposedAction = known.proposed_action ?? proposedAction;
  }

  const leadKey = `${slug(company)}|${slug(role)}|${slug(event.source_type ?? 'unknown')}`;
  const eventId = `${(event.observed_at || nowIso()).slice(0, 10)}|${slug(event.source_type ?? 'unknown')}|${slug(company)}-${slug(role)}`;
  const materialFingerprint = hashFingerprint([
    queue,
    accountAwareBase.contactState,
    resumeFamily,
    proposedAction,
    nextAction,
    event.subject ?? '',
  ]);

  const draft = renderDraft(event, {
    queue,
    scheduling_link: event.scheduling_link,
  });

  return {
    contract_version: contract.contract_version,
    routed_at: nowIso(),
    lead_key: leadKey,
    event_id: eventId,
    lane,
    queue,
    contact_state: accountAwareBase.contactState,
    contact_history_state: event.contact_history_state ?? platformState?.contact_history_state ?? workflowToContactHistoryState(platformState?.workflow_state) ?? 'unknown',
    resume_family: resumeFamily,
    resume_artifact: formatResumeArtifact(contract, resumeFamily),
    platform_state: platformState ? {
      platform: platformState.platform ?? platformState.company,
      company: platformState.company,
      access_state: platformState.access_state ?? 'unknown',
      workflow_state: platformState.workflow_state ?? 'unknown',
      last_confirmed_at: platformState.last_confirmed_at ?? null,
      next_action: platformState.next_action ?? null,
      blockers: platformState.blockers ?? [],
      notes: platformState.notes ?? [],
    } : null,
    proposed_action: proposedAction,
    authorized_action: 'none',
    approval_state: 'pending',
    next_action: nextAction,
    material_fingerprint: materialFingerprint,
    matched_known_queue_item: shouldUseKnownQueueHints ? {
      priority: known.priority,
      company: known.company,
      role: known.role,
    } : null,
    draft,
    evidence: {
      source_type: event.source_type ?? 'unknown',
      source_label: event.source_label ?? basename(event._event_path ?? 'inline-event.json'),
      observed_at: event.observed_at ?? nowIso(),
      currentness: event.currentness ?? 'current',
    },
  };
}

function usage() {
  return [
    'Usage: node automation/job-inbox-router.mjs route --contract <path> --event <path>',
    '       node automation/job-inbox-router.mjs compose --contract <path> --event <path>',
    '       node automation/job-inbox-router.mjs summary --contract <path>',
    '       node automation/job-inbox-router.mjs validate --event <path>',
    '       node automation/job-inbox-router.mjs route --contract <path> --event <path> --account-state <path>',
    '       node automation/job-inbox-router.mjs compose --contract <path> --event <path> --account-state <path>',
  ].join('\n');
}

async function main(argv) {
  const { command, options } = parseArgs(argv);
  if (!command || options.help) {
    console.log(usage());
    return;
  }

  if (command === 'summary') {
    const contractPath = required(options, 'contract');
    const contract = await readJson(contractPath);
    const accountStatePath = resolveOptionalPath(options['account-state'] ?? contract.account_state_registry?.default_path);
    const accountStateRegistry = accountStatePath ? validateAccountStateRegistry(await readJson(accountStatePath)) : null;
    console.log(JSON.stringify({
      contract_version: contract.contract_version,
      as_of: contract.as_of,
      current_reply_now_count: contract.current_reply_now_count,
      top_queue: contract.current_queue?.slice(0, 5) ?? [],
      account_state_registry_version: accountStateRegistry?.registry_version ?? null,
      account_state_entry_count: accountStateRegistry?.entries?.length ?? 0,
    }, null, 2));
    return;
  }

  if (command === 'validate') {
    const eventPath = required(options, 'event');
    const event = await readJson(eventPath);
    console.log(JSON.stringify(validateEvent(event), null, 2));
    return;
  }

  if (command !== 'route' && command !== 'compose') fail(`Unknown command: ${command}`);

  const contractPath = required(options, 'contract');
  const eventPath = required(options, 'event');
  const contract = await readJson(contractPath);
  const event = await readJson(eventPath);
  const accountStatePath = resolveOptionalPath(options['account-state'] ?? contract.account_state_registry?.default_path);
  const accountStateRegistry = accountStatePath ? validateAccountStateRegistry(await readJson(accountStatePath)) : null;
  validateEvent(event);
  event._event_path = eventPath;
  const decision = buildDecision(contract, event, accountStateRegistry);

  if (command === 'compose') {
    console.log(JSON.stringify(buildReplyPacket(contract, event, decision), null, 2));
    return;
  }

  console.log(JSON.stringify(decision, null, 2));
}

main(process.argv.slice(2)).catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
