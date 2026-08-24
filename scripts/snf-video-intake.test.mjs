import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CLI = path.join(ROOT, "scripts/snf-video-intake.mjs");

function run(args) {
  const r = spawnSync(process.execPath, [CLI, ...args], {
    encoding: "utf8",
    cwd: ROOT,
  });
  const json = JSON.parse(r.stdout);
  return { ...r, json };
}

test("inspect lists four videos and RLV", () => {
  const { status, json } = run(["inspect"]);
  assert.equal(status, 0);
  assert.equal(json.videos.length, 4);
  assert.equal(json.runtime_location.dov, "NO ACCESS");
  assert.ok(json.videos.find((v) => v.id === "VID-003").notebooklm);
  const v4 = json.videos.find((v) => v.id === "VID-004");
  assert.ok(v4.notebooklm);
  assert.equal(v4.status, "PASS_WITH_EVIDENCE_GAPS_SAFETY_HOLD");
  assert.equal(json.files["VID-004"].record, true);
  assert.equal(json.files["VID-004"].ledger, true);
  assert.equal(json.files["VID-004"].preaudit, true);
  assert.equal(json.files["VID-004"].transcript, true);
});

test("validate passes current mixed VID-003/VID-004 PASS-family bundle", () => {
  const { status, json } = run(["validate"]);
  assert.equal(status, 0, JSON.stringify(json.errors));
  assert.equal(json.ok, true);
});

test("stale still reports VID-002 PARTIAL", () => {
  const { json } = run(["stale"]);
  assert.ok(json.count >= 1);
  assert.ok(json.items.every((v) => v.status === "PARTIAL" || v.status === "BLOCKED"));
  assert.ok(json.items.some((v) => v.id === "VID-002"));
  assert.ok(!json.items.some((v) => v.id === "VID-004"));
});

test("gaps does not mark suicide-adjacent claims as promote", () => {
  const { json } = run(["gaps"]);
  assert.ok(Array.isArray(json.open_claims));
  assert.ok(json.open_claims.some((c) => c.public_use === "blocked_pending_human_review"));
});

test("gaps --id VID-004 has a real ledger and blocks suicide numbers", () => {
  const { status, json } = run(["gaps", "--id", "VID-004"]);
  assert.equal(status, 0);
  assert.equal(json.video_id, "VID-004");
  assert.equal(json.ledger, true);
  assert.equal(json.preaudit, true);
  assert.equal(json.transcript, true);
  assert.ok(json.open_claims.length >= 1);
  assert.ok(json.open_claims.every((c) => c.public_use !== "promote"));
  assert.ok(json.open_claims.some((c) => c.public_use === "blocked_pending_human_review"));
});

test("ingest VID-003 refuses public promotion", () => {
  const { json } = run(["ingest", "--id", "VID-003"]);
  assert.equal(json.public_use, "blocked_pending_human_review");
  assert.equal(json.source_preserved, true);
});

test("ingest VID-004 is safety-hold, Whisper transcript, no public promo", () => {
  const { status, json } = run(["ingest", "--id", "VID-004"]);
  assert.equal(status, 0, JSON.stringify(json));
  assert.equal(json.ok, true);
  assert.equal(json.status, "PASS_WITH_EVIDENCE_GAPS_SAFETY_HOLD");
  assert.equal(json.source_preserved, true);
  assert.equal(json.suicide_adjacent, true);
  assert.equal(json.public_use, "blocked_pending_human_review");
  assert.equal(json.transcript, "machine-generated-whisper-base");
  assert.equal(json.media_bytes_landed, true);
  assert.ok(json.ledger);
  assert.ok(json.preaudit);
  assert.ok(json.dov_write.includes("NOT CLAIMED"));
});

test("media-status reports landed VID-004 bytes", () => {
  const { status, json } = run(["media-status", "--id", "VID-004"]);
  assert.equal(status, 0);
  assert.equal(json.items.length, 1);
  assert.equal(json.items[0].bytes_landed, true);
  assert.equal(json.items[0].whisper_ready, true);
  assert.equal(json.items[0].whisper_usable, true);
  assert.equal(json.items[0].failure_mode, "BYTES_LANDED");
  assert.equal(json.items[0].source_id, "177NveaQTD7Jdwkz6VYoDVYa7bPelv_AC");
});

test("unknown video is not ok", () => {
  const { status, json } = run(["ingest", "--id", "VID-999"]);
  assert.notEqual(status, 0);
  assert.equal(json.ok, false);
});

test("suicide-adjacent fence is encoded in manifest", () => {
  const { json } = run(["inspect"]);
  const v4 = json.videos.find((v) => v.id === "VID-004");
  assert.equal(v4.suicide_adjacent, true);
  assert.notEqual(v4.public_use, "open");
  assert.notEqual(v4.public_use, "promote");
  assert.notEqual(v4.status, "PASS");
});
