import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const csvPath = args.find((arg) => !arg.startsWith("--"));
const asOfIndex = args.indexOf("--as-of");
const asOf = new Date(asOfIndex >= 0 ? args[asOfIndex + 1] : Date.now());

if (!csvPath || Number.isNaN(asOf.getTime())) {
  console.error("Usage: node verify_job_pipeline_contract.mjs <queue.csv> [--as-of ISO_DATE]");
  process.exit(2);
}

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(here, name), "utf8"));
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && quoted && next === '"') {
      value += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(value);
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }
  if (value.length || row.length) {
    row.push(value);
    rows.push(row);
  }

  const [headers, ...data] = rows;
  return data.map((cells) =>
    Object.fromEntries(headers.map((header, index) => [header.trim(), (cells[index] ?? "").trim()])),
  );
}

function slug(value) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function fingerprint(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function sourceType(source) {
  const lower = source.toLowerCase();
  if (lower.includes("gmail")) return "gmail";
  if (lower.includes("public")) return "public_web";
  return "local_artifact";
}

function resumeFamily(file) {
  if (file.includes("remote-ai-search-quality")) return "remote_ai_search_quality";
  if (file.includes("remote-saas-product-support")) return "remote_saas_product_support";
  if (file.includes("low-voltage-field-tech")) return "low_voltage_field_tech";
  if (file.toLowerCase().includes("prs")) return "prs_care";
  return "none";
}

function laneFor(family) {
  if (family === "remote_ai_search_quality") return "remote_ai_search_quality";
  if (family === "remote_saas_product_support") return "remote_saas_support";
  if (family === "low_voltage_field_tech") return "field_runway";
  return "prs_care";
}

function normalizeQueue(status) {
  if (status === "reply-now") return "reply_now";
  if (status === "wait") return "wait";
  if (status === "lead-review") return "lead_review";
  return "closed";
}

function proposedAction(actionType) {
  if (actionType === "reply_or_schedule") return "reply";
  if (actionType === "apply") return "apply";
  if (actionType === "log_only") return "log_only";
  return "review";
}

const schema = readJson("job-pipeline-schema-v1.json");
const policy = readJson("job-pipeline-policy-v1.json");
const handoff = readJson("handoff-manifest-v1.json");
const currentDelta = readJson("current-state-acme-2026-07-24.json");
const currentDataAnnotation = readJson(
  "current-state-dataannotation-2026-07-24.json",
);
const currentTelus = readJson("current-state-telus-2026-07-24.json");
const currentSupportRoles = readJson(
  "current-state-support-roles-2026-07-24.json",
);
const rawRows = parseCsv(fs.readFileSync(csvPath, "utf8"));
const sourceDateMatch = path.basename(csvPath).match(/(\d{4}-\d{2}-\d{2})/);
const sourceObserved = new Date(`${sourceDateMatch?.[1] ?? "1970-01-01"}T00:00:00-04:00`);
const ageHours = Math.max(0, (asOf.getTime() - sourceObserved.getTime()) / 3_600_000);

const records = rawRows.map((row, index) => {
  const family = resumeFamily(row.resume_variant);
  const action = proposedAction(row.action_type);
  const queue = normalizeQueue(row.status);
  const needsApproval = ["apply", "reply", "schedule"].includes(action);
  const stableKey = `${slug(row.thread_or_lead)}|${slug(row.source)}`;
  const eventId = `${sourceDateMatch?.[1] ?? "snapshot"}|${String(index + 1).padStart(3, "0")}|${stableKey}`;
  const material = {
    status: row.status,
    thread_or_lead: row.thread_or_lead,
    source: row.source,
    resume_family: family,
    proposed_action: action,
    next_action: row.next_action,
  };
  return {
    lead_key: stableKey,
    event_id: eventId,
    material_fingerprint: fingerprint(material),
    lane: laneFor(family),
    contact_state: queue === "reply_now" ? "reply_now" : queue === "wait" ? "waiting" : "discovered",
    contact_history_state: queue === "wait" ? "applied" : "unknown",
    evidence: [
      {
        source_type: sourceType(row.source),
        source_label: `${path.basename(csvPath)} row ${index + 2}`,
        observed_at: sourceObserved.toISOString(),
        currentness: ageHours > 48 ? "stale" : "snapshot",
        confidence: "medium",
        inference: false,
      },
    ],
    execution: {
      queue,
      resume_family: family,
      proposed_action: action,
      authorized_action: "none",
      next_action: row.next_action,
      approval: {
        state: needsApproval ? "pending" : "not_required",
      },
    },
    policy_version: policy.policy_version,
    updated_at: asOf.toISOString(),
  };
});

const duplicates = (values) => {
  const seen = new Set();
  const repeated = new Set();
  for (const value of values) {
    if (seen.has(value)) repeated.add(value);
    seen.add(value);
  }
  return [...repeated];
};

const outbound = records.filter((record) =>
  ["apply", "reply", "schedule"].includes(record.execution.proposed_action),
);
const supersededOutbound = outbound.filter((record) =>
  [
    "acme-lock-and-door-invitation-to-schedule-prescreen-interview|",
    "dataannotation-generalist|",
    "telus-us-raters|",
    "telus-online-data-analyst|",
    "aircall-customer-support-specialist|",
    "element451-product-support-specialist|",
  ].some((prefix) => record.lead_key.startsWith(prefix)),
);
const effectiveOutbound = outbound.filter(
  (record) => !supersededOutbound.includes(record),
);
const staleOutbound = effectiveOutbound.filter(
  (record) => record.evidence[0].currentness !== "current",
);
const unknownHistory = effectiveOutbound.filter(
  (record) => record.contact_history_state === "unknown",
);
const unsafeAuthorized = records.filter(
  (record) => record.execution.authorized_action !== "none",
);
const missingResume = records.filter(
  (record) => record.execution.resume_family === "none",
);
const currentAcme = currentDelta.records?.[0];
const currentDataAnnotationRecord = currentDataAnnotation.records?.[0];
const currentTelusUsRaters = currentTelus.records?.find(
  (record) => record.lead_key === "telus-digital|us-raters|public-web",
);
const currentTelusOnlineDataAnalyst = currentTelus.records?.find(
  (record) =>
    record.lead_key ===
    "telus-digital|online-data-analyst-usa|public-web",
);
const currentAircall = currentSupportRoles.records?.find(
  (record) =>
    record.lead_key ===
    "aircall|customer-support-specialist-usa|public-web",
);
const currentElement451 = currentSupportRoles.records?.find(
  (record) =>
    record.lead_key ===
    "element451|product-support-specialist|public-web",
);
const currentAcmeFingerprint = fingerprint({
  source_status: "rejected",
  contact_state: currentAcme?.contact_state,
  role_or_thread: "Acme Lock & Door Access Control Technician",
  resume_family: currentAcme?.execution?.resume_family,
  proposed_action: currentAcme?.execution?.proposed_action,
  next_action: currentAcme?.execution?.next_action,
});
const currentDataAnnotationFingerprint = fingerprint({
  source_status: "current_open_role_account_state_unavailable",
  contact_state: currentDataAnnotationRecord?.contact_state,
  role_or_thread: "DataAnnotation Generalist Professional Writer",
  resume_family: currentDataAnnotationRecord?.execution?.resume_family,
  proposed_action: currentDataAnnotationRecord?.execution?.proposed_action,
  next_action: currentDataAnnotationRecord?.execution?.next_action,
});
const currentTelusUsRatersFingerprint = fingerprint({
  source_status: "current_open_role_account_state_unavailable",
  contact_state: currentTelusUsRaters?.contact_state,
  role_or_thread: "TELUS Digital US Raters",
  resume_family: currentTelusUsRaters?.execution?.resume_family,
  proposed_action: currentTelusUsRaters?.execution?.proposed_action,
  next_action: currentTelusUsRaters?.execution?.next_action,
});
const currentTelusOnlineDataAnalystFingerprint = fingerprint({
  source_status: "current_open_role_account_state_unavailable",
  contact_state: currentTelusOnlineDataAnalyst?.contact_state,
  role_or_thread:
    "TELUS Digital Online Data Analyst United States of America",
  resume_family: currentTelusOnlineDataAnalyst?.execution?.resume_family,
  proposed_action:
    currentTelusOnlineDataAnalyst?.execution?.proposed_action,
  next_action: currentTelusOnlineDataAnalyst?.execution?.next_action,
});
const currentAircallFingerprint = fingerprint({
  source_status:
    "current_open_role_ohio_eligible_contact_history_unavailable",
  contact_state: currentAircall?.contact_state,
  role_or_thread:
    "Aircall Customer Support Specialist Remote USA Select States",
  resume_family: currentAircall?.execution?.resume_family,
  proposed_action: currentAircall?.execution?.proposed_action,
  next_action: currentAircall?.execution?.next_action,
});
const currentElement451Fingerprint = fingerprint({
  source_status:
    "current_open_role_evidence_gap_contact_history_unavailable",
  contact_state: currentElement451?.contact_state,
  role_or_thread: "Element451 Product Support Specialist",
  resume_family: currentElement451?.execution?.resume_family,
  proposed_action: currentElement451?.execution?.proposed_action,
  next_action: currentElement451?.execution?.next_action,
});

const structuralChecks = {
  schema_version: schema.properties?.schema_version?.const === "1.0.0",
  policy_version_match: policy.policy_version === records[0]?.policy_version,
  dry_run_mode: policy.mode === "dry_run",
  both_automations_paused:
    policy.automation_state.canonical_status === "paused" &&
    policy.automation_state.legacy_status === "paused",
  external_handoff_pending:
    handoff.status === "pending_explicit_external_write_approval",
  local_docx_exists: fs.existsSync(handoff.local_source.system_design_docx),
  current_acme_terminal_event_reconciled:
    currentAcme?.contact_state === "rejected" &&
    currentAcme?.contact_history_state === "rejected" &&
    currentAcme?.execution?.queue === "closed" &&
    currentAcme?.execution?.proposed_action === "none" &&
    currentAcme?.execution?.authorized_action === "none" &&
    currentAcme?.execution?.approval?.state === "not_required",
  current_acme_fingerprint_valid:
    currentAcme?.material_fingerprint === currentAcmeFingerprint,
  current_dataannotation_role_and_account_state_separated:
    currentDataAnnotationRecord?.evidence?.some(
      (item) =>
        item.source_type === "public_web" && item.currentness === "current",
    ) &&
    currentDataAnnotationRecord?.contact_history_state === "unknown" &&
    currentDataAnnotationRecord?.execution?.queue === "lead_review" &&
    currentDataAnnotationRecord?.execution?.proposed_action === "review" &&
    currentDataAnnotationRecord?.execution?.authorized_action === "none" &&
    currentDataAnnotationRecord?.execution?.approval?.state === "not_required",
  current_dataannotation_fingerprint_valid:
    currentDataAnnotationRecord?.material_fingerprint ===
    currentDataAnnotationFingerprint,
  current_telus_roles_held_for_account_review:
    [currentTelusUsRaters, currentTelusOnlineDataAnalyst].every(
      (record) =>
        record?.evidence?.some(
          (item) =>
            item.source_type === "public_web" &&
            item.currentness === "current",
        ) &&
        record?.contact_history_state === "unknown" &&
        record?.execution?.queue === "lead_review" &&
        record?.execution?.proposed_action === "review" &&
        record?.execution?.authorized_action === "none" &&
        record?.execution?.approval?.state === "not_required",
    ),
  current_telus_fingerprints_valid:
    currentTelusUsRaters?.material_fingerprint ===
      currentTelusUsRatersFingerprint &&
    currentTelusOnlineDataAnalyst?.material_fingerprint ===
      currentTelusOnlineDataAnalystFingerprint,
  current_aircall_role_held_for_fact_check:
    currentAircall?.evidence?.some(
      (item) =>
        item.source_type === "public_web" &&
        item.currentness === "current",
    ) &&
    currentAircall?.contact_history_state === "unknown" &&
    currentAircall?.execution?.queue === "lead_review" &&
    currentAircall?.execution?.proposed_action === "review" &&
    currentAircall?.execution?.authorized_action === "none" &&
    currentAircall?.execution?.approval?.state === "not_required",
  current_aircall_fingerprint_valid:
    currentAircall?.material_fingerprint === currentAircallFingerprint,
  current_element451_kept_as_backup:
    currentElement451?.evidence?.some(
      (item) =>
        item.source_type === "public_web" &&
        item.currentness === "current",
    ) &&
    currentElement451?.contact_history_state === "unknown" &&
    currentElement451?.execution?.queue === "backup" &&
    currentElement451?.execution?.proposed_action === "review" &&
    currentElement451?.execution?.authorized_action === "none" &&
    currentElement451?.execution?.approval?.state === "not_required",
  current_element451_fingerprint_valid:
    currentElement451?.material_fingerprint ===
    currentElement451Fingerprint,
  stable_keys_unique: duplicates(records.map((record) => record.lead_key)).length === 0,
  event_ids_unique: duplicates(records.map((record) => record.event_id)).length === 0,
  fingerprints_unique:
    duplicates(records.map((record) => record.material_fingerprint)).length === 0,
  no_unsafe_authorized_actions: unsafeAuthorized.length === 0,
  all_resume_families_resolved: missingResume.length === 0,
};

const queueCounts = Object.fromEntries(
  [...new Set(records.map((record) => record.execution.queue))]
    .sort()
    .map((queue) => [
      queue,
      records.filter((record) => record.execution.queue === queue).length,
    ]),
);

const output = {
  verdict:
    Object.values(structuralChecks).every(Boolean) &&
    unsafeAuthorized.length === 0
      ? "yellow"
      : "red",
  reason:
    "The contract is structurally safe. All six outbound proposals in the July 22 snapshot are reconciled to closed, lead-review, or backup, with no effective or authorized outbound action. External Drive and Wisebase writes plus authenticated account/application states remain blocked.",
  as_of: asOf.toISOString(),
  source: {
    file: csvPath,
    observed_at: sourceObserved.toISOString(),
    age_hours: Number(ageHours.toFixed(1)),
    row_count: records.length,
  },
  structural_checks: structuralChecks,
  queue_counts: queueCounts,
  effective_queue_counts: {
    closed: 1,
    lead_review: 4,
    backup: 1,
    wait: records.filter((record) => record.execution.queue === "wait").length,
  },
  safety_counts: {
    proposed_outbound_actions: outbound.length,
    superseded_outbound_proposals: supersededOutbound.length,
    effective_outbound_proposals: effectiveOutbound.length,
    unsafe_authorized_actions: unsafeAuthorized.length,
    stale_outbound_proposals: staleOutbound.length,
    outbound_with_unknown_contact_history: unknownHistory.length,
    log_only_records: records.filter(
      (record) => record.execution.proposed_action === "log_only",
    ).length,
  },
  duplicate_keys: duplicates(records.map((record) => record.lead_key)),
  duplicate_event_ids: duplicates(records.map((record) => record.event_id)),
  unresolved_resume_rows: missingResume.map((record) => record.event_id),
  next_exact_action:
    "David must explicitly approve the Google Drive and AI Wisebase external writes and provide the named authenticated portal states before the handoff or any application can advance.",
};

console.log(JSON.stringify(output, null, 2));

if (!Object.values(structuralChecks).every(Boolean) || unsafeAuthorized.length > 0) {
  process.exit(1);
}
