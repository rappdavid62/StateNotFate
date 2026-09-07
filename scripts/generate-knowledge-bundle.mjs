#!/usr/bin/env node
/**
 * generate-knowledge-bundle.mjs
 *
 * Reads knowledge/registry.yaml and writes knowledge/polaris-knowledge-bundle.json.
 * Run: node scripts/generate-knowledge-bundle.mjs
 *
 * The JSON bundle is a derived artefact — always regenerate it from the YAML
 * rather than editing it directly.
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// ---------------------------------------------------------------------------
// Minimal inline YAML parser — supports only the flat structure used in
// registry.yaml (sequences of mappings with scalar / sequence leaf values).
// Avoids adding a runtime dependency.
// ---------------------------------------------------------------------------
function parseRegistryYaml(src) {
  const lines = src.split("\n");
  const units = [];
  let current = null;
  let inSource = false;
  let inEnergyStates = false;
  let inTags = false;
  let inFlags = false;

  const flush = () => {
    if (current) units.push(current);
    current = null;
    inSource = false;
    inEnergyStates = false;
    inTags = false;
    inFlags = false;
  };

  const INDENT_UNIT = 2;        // root list marker indent
  const INDENT_KEY = 4;         // unit-level keys
  const INDENT_SUBKEY = 6;      // nested object keys (source, flags)
  const INDENT_ITEM = 6;        // list items under unit-level arrays

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const stripped = raw.trimEnd();
    if (!stripped || stripped.trimStart().startsWith("#")) {
      // blank or comment — end inline sequences
      inEnergyStates = false;
      inTags = false;
      continue;
    }

    const indent = raw.length - raw.trimStart().length;

    // New unit entry
    if (stripped.trimStart() === "- id:" || stripped.trimStart().startsWith("- id:")) {
      flush();
      current = { source: {}, flags: {} };
      current.id = stripped.split("- id:")[1].trim();
      inSource = false;
      inEnergyStates = false;
      inTags = false;
      inFlags = false;
      continue;
    }

    if (!current) continue;

    const t = stripped.trimStart();

    // Detect block-scalar body (folded >)
    if (indent === INDENT_KEY && t.startsWith("body:")) {
      const rest = t.slice("body:".length).trim();
      if (rest === ">") {
        // collect following indented lines
        let body = "";
        while (i + 1 < lines.length) {
          const next = lines[i + 1];
          const nextIndent = next.length - next.trimStart().length;
          if (next.trim() === "" || nextIndent > INDENT_KEY) {
            i++;
            body += (body ? " " : "") + next.trim();
          } else break;
        }
        current.body = body.trim();
      } else {
        current.body = rest.replace(/^["']|["']$/g, "");
      }
      inEnergyStates = false;
      inTags = false;
      continue;
    }

    // source sub-object
    if (indent === INDENT_KEY && t === "source:") {
      inSource = true;
      inFlags = false;
      inEnergyStates = false;
      inTags = false;
      continue;
    }

    if (indent === INDENT_KEY && t === "flags:") {
      inSource = false;
      inFlags = true;
      inEnergyStates = false;
      inTags = false;
      continue;
    }

    // energy_states array
    if (indent === INDENT_KEY && t.startsWith("energy_states:")) {
      inEnergyStates = true;
      inTags = false;
      inSource = false;
      inFlags = false;
      // may be inline [a, b]
      const inline = t.slice("energy_states:".length).trim();
      if (inline.startsWith("[")) {
        current.energy_states = inline.replace(/[\[\]]/g, "").split(",").map(s => s.trim());
        inEnergyStates = false;
      } else {
        current.energy_states = [];
      }
      continue;
    }

    if (inEnergyStates && indent >= INDENT_ITEM && t.startsWith("- ")) {
      current.energy_states.push(t.slice(2).trim());
      continue;
    }

    // tags array
    if (indent === INDENT_KEY && t.startsWith("tags:")) {
      inTags = true;
      inEnergyStates = false;
      inSource = false;
      inFlags = false;
      const inline = t.slice("tags:".length).trim();
      if (inline.startsWith("[")) {
        current.tags = inline.replace(/[\[\]]/g, "").split(",").map(s => s.trim());
        inTags = false;
      } else {
        current.tags = [];
      }
      continue;
    }

    if (inTags && indent >= INDENT_ITEM && t.startsWith("- ")) {
      if (!current.tags) current.tags = [];
      current.tags.push(t.slice(2).trim());
      continue;
    }

    // generic key: value at unit level
    if (indent === INDENT_KEY && t.includes(":")) {
      inEnergyStates = false;
      inTags = false;
      inSource = false;
      inFlags = false;
      const colon = t.indexOf(":");
      const key = t.slice(0, colon).trim();
      const val = t.slice(colon + 1).trim().replace(/^["']|["']$/g, "");
      current[key] = val;
      continue;
    }

    // source sub-keys
    if (inSource && indent >= INDENT_SUBKEY && t.includes(":")) {
      const colon = t.indexOf(":");
      const key = t.slice(0, colon).trim();
      let val = t.slice(colon + 1).trim().replace(/^["']|["']$/g, "");
      if (val === "true") val = true;
      else if (val === "false") val = false;
      else if (val === "null") val = null;
      current.source[key] = val;
      continue;
    }

    // flags sub-keys
    if (inFlags && indent >= INDENT_SUBKEY && t.includes(":")) {
      const colon = t.indexOf(":");
      const key = t.slice(0, colon).trim();
      const val = t.slice(colon + 1).trim().replace(/^["']|["']$/g, "");
      current.flags[key] = val;
      continue;
    }
  }

  flush();
  return units;
}

// ---------------------------------------------------------------------------

const yamlPath = join(root, "knowledge", "registry.yaml");
const bundlePath = join(root, "knowledge", "polaris-knowledge-bundle.json");

const yamlSrc = readFileSync(yamlPath, "utf8");
const units = parseRegistryYaml(yamlSrc);

if (units.length === 0) {
  console.error("No units parsed — check registry.yaml syntax.");
  process.exit(1);
}

const bundle = {
  schema_version: "1.0.0",
  generated_at: new Date().toISOString(),
  unit_count: units.length,   // always derived from the array length
  units,
};

writeFileSync(bundlePath, JSON.stringify(bundle, null, 2) + "\n");
console.log(`[generate-knowledge-bundle] ${units.length} units written to knowledge/polaris-knowledge-bundle.json`);
