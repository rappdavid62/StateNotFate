#!/usr/bin/env node
/** Deterministic hook: fail the run if the SNF video-intake manifest is invalid. */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const r = spawnSync(process.execPath, [path.join(root, "scripts/snf-video-intake.mjs"), "validate"], {
  encoding: "utf8",
  cwd: root,
});
process.stdout.write(r.stdout || "");
process.stderr.write(r.stderr || "");
process.exit(r.status === 0 ? 0 : 1);
