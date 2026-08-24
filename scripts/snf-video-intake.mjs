#!/usr/bin/env node
/**
 * Headless SNF Video Intake harness.
 *   node scripts/snf-video-intake.mjs inspect|validate|status|stale|gaps|ingest|media-status
 *   node scripts/snf-video-intake.mjs ingest --id VID-004
 *   node scripts/snf-video-intake.mjs media-status --id VID-004
 *   node scripts/snf-video-intake.mjs gaps --id VID-004
 *
 * Does not overwrite source media. Does not promote suicide-adjacent
 * claims to public copy. Does not write to DOV unless RLV is LOCAL or BRIDGE VERIFIED.
 * Does not invent a transcript when MP4 bytes have not landed.
 *
 * Failure mode DRIVE_DOWNLOAD_REPORTED_SIZE_BYTES_NOT_LANDED: Drive download
 * may report size_bytes while no MP4 appears. Direct export can hit Google login HTML.
 * Whisper base is usable only after bytes land.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const INTAKE_DIR = path.join(ROOT, "research/video-intake");
const MANIFEST = path.join(INTAKE_DIR, "manifest.json");

const STATUSES = new Set([
  "PASS",
  "PASS_WITH_EVIDENCE_GAPS",
  "PASS_WITH_EVIDENCE_GAPS_SAFETY_HOLD",
  "PARTIAL",
  "BLOCKED",
]);
const PASS_STATUSES = new Set([
  "PASS",
  "PASS_WITH_EVIDENCE_GAPS",
  "PASS_WITH_EVIDENCE_GAPS_SAFETY_HOLD",
]);
const PUBLIC_OPEN = new Set(["open", "promote"]);

function readJson(p) {
  if (!fs.existsSync(p)) throw new Error(`missing ${path.relative(ROOT, p)}`);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}
function rel(p) {
  return path.relative(ROOT, p).split(path.sep).join("/");
}
function listIntakeFiles() {
  if (!fs.existsSync(INTAKE_DIR)) return [];
  return fs.readdirSync(INTAKE_DIR);
}
function bundleFor(id, video = {}) {
  const files = listIntakeFiles();
  const declared = video.record ? path.join(ROOT, video.record) : null;
  const guessedMd = files.find(
    (f) => f.startsWith(`${id}-`) && f.endsWith(".md") && f.includes("intake") && !f.includes("transcript"),
  );
  const recordAbs = declared || (guessedMd ? path.join(INTAKE_DIR, guessedMd) : null);
  const ledgerAbs = path.join(INTAKE_DIR, `${id}-claim-ledger.json`);
  const preauditAbs = path.join(INTAKE_DIR, `${id}-neighbor-canon-preaudit.json`);
  const transcripts = files
    .filter((f) => f.startsWith(`${id}-`) && f.includes("transcript"))
    .map((f) => path.join(INTAKE_DIR, f));
  return {
    id,
    recordAbs,
    recordExists: !!(recordAbs && fs.existsSync(recordAbs)),
    ledgerAbs,
    ledgerExists: fs.existsSync(ledgerAbs),
    preauditAbs,
    preauditExists: fs.existsSync(preauditAbs),
    transcripts,
    transcriptExists: transcripts.some((p) => fs.existsSync(p)),
  };
}
function mediaCandidates(id) {
  const slug = id.toLowerCase();
  const compact = slug.replace("-", "");
  return [
    path.join(ROOT, "artifacts", "snf", slug, `${id}.mp4`),
    path.join(ROOT, "artifacts", "snf", compact, "Meal_Timing___Mood.mp4"),
    path.join(ROOT, "artifacts", "snf", "vid004", "Meal_Timing___Mood.mp4"),
    path.join(ROOT, "artifacts", "snf", `${id}.mp4`),
    path.join(ROOT, "research", "video-intake", `${id}.mp4"),
    path.join("/home/workdir/artifacts", "snf", "vid004", "Meal_Timing___Mood.mp4"),
  ];
}
function findLandedMedia(id) {
  const hits = [];
  for (const p of mediaCandidates(id)) {
    if (fs.existsSync(p) && fs.statSync(p).size > 1024) {
      hits.push({ path: p, size_bytes: fs.statSync(p).size });
    }
  }
  return hits;
}
function inspect() {
  const m = readJson(MANIFEST);
  const files = {};
  for (const v of m.videos || []) {
    const b = bundleFor(v.id, v);
    files[v.id] = {
      record: b.recordExists,
      ledger: b.ledgerExists,
      transcript: b.transcriptExists,
      preaudit: b.preauditExists,
      media_bytes_landed: findLandedMedia(v.id).length > 0,
    };
  }
  return {
    ok: true,
    command: "inspect",
    runtime_location: m.runtime_location,
    pipeline: m.pipeline?.name,
    videos: (m.videos || []).map((v) => ({
      id: v.id,
      title: v.title,
      status: v.status,
      notebooklm: !!v.notebooklm,
      suicide_adjacent: !!v.suicide_adjacent,
      public_use: v.public_use,
      source_id: v.source_id || null,
    })),
    files,
  };
}
function validate() {
  const errors = [];
  const warnings = [];
  const m = readJson(MANIFEST);
  if (m.schema !== "snf.video-intake.manifest.v2") errors.push("manifest.schema must be snf.video-intake.manifest.v2");
  if (!m.runtime_location?.dov) errors.push("runtime_location.dov required");
  const ids = new Set();
  for (const v of m.videos || []) {
    if (!v.id || !/^VID-\d{3}$/.test(v.id)) errors.push(`bad id: ${v.id}`);
    if (ids.has(v.id)) errors.push(`duplicate id ${v.id}`);
    ids.add(v.id);
    if (!STATUSES.has(v.status)) errors.push(`${v.id} unknown status ${v.status}`);
    if (!v.source_id) errors.push(`${v.id} missing source_id`);
    if (v.suicide_adjacent && PUBLIC_OPEN.has(v.public_use)) {
      errors.push(`${v.id} suicide-adjacent cannot be public_use=${v.public_use}`);
    }
    if (v.status === "PASS" && v.suicide_adjacent) {
      errors.push(`${v.id} suicide-adjacent cannot be unmarked PASS`);
    }
    const b = bundleFor(v.id, v);
    if (v.record && !b.recordExists) errors.push(`${v.id} declared record missing: ${v.record}`);
    if (PASS_STATUSES.has(v.status) && v.record) {
      if (!b.recordExists) errors.push(`${v.id} PASS-family status requires an intake record`);
      if (!b.ledgerExists) errors.push(`${v.id} PASS-family status requires a claim ledger`);
      if (!b.transcriptExists) warnings.push(`${v.id} PASS-family status but no transcript on disk`);
    }
    if (b.ledgerExists) {
      const ledger = readJson(b.ledgerAbs);
      if (ledger.video_id && ledger.video_id !== v.id) errors.push(`${v.id} ledger.video_id mismatch (${ledger.video_id})`);
      if (PASS_STATUSES.has(v.status) && (!Array.isArray(ledger.claims) || ledger.claims.length < 1)) {
        errors.push(`${v.id} claim ledger empty`);
      }
      for (const c of ledger.claims || []) {
        if (!c.id || !c.wording || !c.class) errors.push(`${v.id} claim missing fields: ${c.id}`);
        if (c.public_use === "promote" && c.suicide_adjacent) {
          errors.push(`${c.id} suicide-adjacent claim marked promote`);
        }
      }
    } else if (PASS_STATUSES.has(v.status)) {
      warnings.push(`${v.id} claim ledger not on disk`);
    }
    if (v.status === "PARTIAL" && !b.transcriptExists) {
      warnings.push(`${v.id} PARTIAL: transcript still missing (do not invent one)`);
    }
  }
  return { ok: errors.length === 0, command: "validate", errors, warnings, video_count: (m.videos || []).length };
}
function status() {
  const m = readJson(MANIFEST);
  const counts = {};
  for (const v of m.videos) counts[v.status] = (counts[v.status] || 0) + 1;
  return { ok: true, command: "status", counts, videos: m.videos.map((v) => `${v.id} ${v.status}`) };
}
function stale() {
  const m = readJson(MANIFEST);
  const items = m.videos.filter((v) => v.status === "PARTIAL" || v.status === "BLOCKED");
  return { ok: true, command: "stale", count: items.length, items };
}
function gapsForVideo(m, id) {
  const v = m.videos.find((x) => x.id === id);
  if (!v) return { ok: false, command: "gaps", error: `unknown ${id}` };
  const b = bundleFor(id, v);
  let research_queue = [];
  let open_claims = [];
  if (b.ledgerExists) {
    const ledger = readJson(b.ledgerAbs);
    research_queue = ledger.research_queue || [];
    open_claims = (ledger.claims || [])
      .filter(
        (c) =>
          c.evidence_status === "NEEDS_VERIFICATION" ||
          c.evidence_status === "MISMATCH" ||
          c.public_use === "blocked_pending_human_review",
      )
      .map((c) => ({ id: c.id, evidence_status: c.evidence_status, public_use: c.public_use, wording: c.wording }));
  }
  if (b.preauditExists) {
    const pre = readJson(b.preauditAbs);
    research_queue = research_queue.concat(pre.research_queue || []);
  }
  return {
    ok: true,
    command: "gaps",
    video_id: id,
    status: v.status,
    suicide_adjacent: !!v.suicide_adjacent,
    public_use: v.public_use,
    open: v.open || [],
    research_queue,
    open_claims,
    ledger: b.ledgerExists,
    preaudit: b.preauditExists,
    transcript: b.transcriptExists,
    note: b.ledgerExists
      ? undefined
      : "No video claim ledger. Do not invent transcript claims. Neighbor-canon preaudit is not a video ledger.",
  };
}
function gaps(id) {
  const m = readJson(MANIFEST);
  if (id) return gapsForVideo(m, id);
  const vid003 = m.videos.find((v) => v.id === "VID-003")
    ? gapsForVideo(m, "VID-003")
    : { open_claims: [], research_queue: [] };
  return {
    ok: true,
    command: "gaps",
    video_id: "VID-003",
    research_queue: vid003.research_queue || [],
    open_claims: vid003.open_claims || [],
    all: (m.videos || []).map((v) => ({
      id: v.id,
      status: v.status,
      open: v.open || [],
      suicide_adjacent: !!v.suicide_adjacent,
    })),
  };
}
function mediaStatus(id) {
  const m = readJson(MANIFEST);
  const videos = id ? m.videos.filter((v) => v.id === id) : m.videos;
  if (id && videos.length === 0) return { ok: false, command: "media-status", error: `unknown ${id}` };
  const items = videos.map((v) => {
    const landed = findLandedMedia(v.id);
    const b = bundleFor(v.id, v);
    const failure_mode =
      landed.length > 0 ? "BYTES_LANDED" : v.source_id ? "DRIVE_DOWNLOAD_REPORTED_SIZE_BYTES_NOT_LANDED" : "SOURCE_UNRESOLVED";
    return {
      id: v.id,
      source_id: v.source_id || null,
      source_id_copy: v.source_id_copy_2026_08_24 || null,
      bytes_landed: landed.length > 0,
      landed,
      whisper_ready: true,
      whisper_usable: landed.length > 0,
      transcript_on_disk: b.transcriptExists,
      failure_mode,
      note:
        landed.length > 0
          ? "Local media present. Whisper base can run. Do not overwrite source."
          : "Drive download may report size_bytes without writing a file. Do not invent a transcript.",
    };
  });
  return { ok: true, command: "media-status", runtime_location: m.runtime_location, count: items.length, items };
}
function ingest(id) {
  const m = readJson(MANIFEST);
  const v = m.videos.find((x) => x.id === id);
  if (!v) return { ok: false, command: "ingest", error: `unknown ${id}` };
  if (!v.source_id) return { ok: false, command: "ingest", status: "BLOCKED", reason: "source_id unresolved" };
  const b = bundleFor(id, v);
  const landed = findLandedMedia(id);
  const vres = validate();
  const base = {
    command: "ingest",
    id,
    status: v.status,
    source_preserved: true,
    source_id: v.source_id,
    suicide_adjacent: !!v.suicide_adjacent,
    public_use: v.public_use,
    record: b.recordExists ? rel(b.recordAbs) : null,
    ledger: b.ledgerExists ? rel(b.ledgerAbs) : null,
    preaudit: b.preauditExists ? rel(b.preauditAbs) : null,
    transcript: b.transcriptExists
      ? "machine-generated-whisper-base"
      : landed.length > 0
        ? "bytes_landed_transcript_missing"
        : "blocked_bytes_not_landed",
    media_bytes_landed: landed.length > 0,
    dov_write: m.runtime_location?.dov === "NO ACCESS" ? "NOT CLAIMED — promotion queue only" : "check RLV",
    validate: { ok: vres.ok, errors: vres.errors, warnings: vres.warnings.filter((w) => w.startsWith(id)) },
  };
  if (v.suicide_adjacent && PUBLIC_OPEN.has(v.public_use)) {
    return { ...base, ok: false, error: "suicide-adjacent cannot be publicly promoted" };
  }
  const next =
    v.suicide_adjacent
      ? "Human review of suicide-adjacent public copy. Do not auto-edit suicide-prevention.html or the Compendium."
      : "Register remaining open items; do not dump NotebookLM narration onto the site.";
  return { ...base, ok: vres.ok || v.status === "PARTIAL", highest_honest_status: v.status, open: v.open || [], next };
}
function parseArgs(argv) {
  const cmd = argv[0] || "inspect";
  const flags = {};
  for (let i = 1; i < argv.length; i++) {
    if (argv[i] === "--id") flags.id = argv[++i];
    else if (argv[i] === "--json") flags.json = true;
  }
  return { cmd, flags };
}
function main() {
  const { cmd, flags } = parseArgs(process.argv.slice(2));
  let out;
  try {
    switch (cmd) {
      case "inspect": out = inspect(); break;
      case "validate": out = validate(); break;
      case "status": out = status(); break;
      case "stale": out = stale(); break;
      case "gaps": out = gaps(flags.id); break;
      case "ingest": out = ingest(flags.id || "VID-003"); break;
      case "media-status": out = mediaStatus(flags.id); break;
      default:
        out = { ok: false, error: `unknown command ${cmd}` };
        process.exitCode = 2;
    }
  } catch (err) {
    out = { ok: false, error: err.message };
    process.exitCode = 1;
  }
  if (out && out.ok === false && !process.exitCode) process.exitCode = 1;
  process.stdout.write(JSON.stringify(out, null, 2) + "\n");
}
main();
