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

// ---------------------------------------------------------------------------
// Schema Validation based on docs/polaris/POLARIS_KNOWLEDGE_SCHEMA.md
// ---------------------------------------------------------------------------
const APPROVED_DOMAINS = [
  "philosophy-and-product-scope",
  "hope-and-activation",
  "intake-to-first-action",
  "energy-state-rules",
  "minimum-viable-day",
  "anchors",
  "restart-and-relapse",
  "proof-and-self-trust",
  "friction-reduction",
  "social-reentry",
  "treatment-boundaries",
  "substance-use-reality"
];

const APPROVED_TONES = ["directive", "affirming", "boundary", "psychoeducation"];
const APPROVED_ENERGY_STATES = ["high", "medium", "low", "collapse", "any"];
const APPROVED_ORIGINS = ["snf-internal", "clinical-consensus", "evidence-based", "peer-reviewed"];
const APPROVED_STATUSES = ["approved", "draft", "flagged"];

const validationErrors = [];
const seenIds = new Set();

units.forEach((unit, idx) => {
  const prefix = `[Unit #${idx + 1} ID: ${unit.id || "unknown"}]`;

  // 1. Required fields presence checks
  if (!unit.id) {
    validationErrors.push(`${prefix} Missing required field: id`);
    return;
  }

  if (seenIds.has(unit.id)) {
    validationErrors.push(`${prefix} Duplicate ID detected: "${unit.id}"`);
  }
  seenIds.add(unit.id);

  // 2. ID kebab-case check
  if (!/^[a-z0-9]+-[a-z0-9-]+$/.test(unit.id)) {
    validationErrors.push(`${prefix} ID must be stable kebab-case (e.g., hope-001)`);
  }

  // 3. Domain validation
  if (!unit.domain) {
    validationErrors.push(`${prefix} Missing required field: domain`);
  } else if (!APPROVED_DOMAINS.includes(unit.domain)) {
    validationErrors.push(`${prefix} Invalid domain: "${unit.domain}"`);
  }

  // 4. Title validation
  if (!unit.title) {
    validationErrors.push(`${prefix} Missing required field: title`);
  } else if (typeof unit.title !== "string" || unit.title.trim() === "") {
    validationErrors.push(`${prefix} Title must be a non-empty string`);
  } else if (unit.title.length > 80) {
    validationErrors.push(`${prefix} Title must be 80 characters or fewer (current: ${unit.title.length})`);
  }

  // 5. Body validation (no Markdown formatting check)
  if (!unit.body) {
    validationErrors.push(`${prefix} Missing required field: body`);
  } else if (typeof unit.body !== "string" || unit.body.trim() === "") {
    validationErrors.push(`${prefix} Body must be a non-empty string`);
  } else {
    // Check for obvious markdown headers, links, bold, italics, or code blocks
    if (/^\s*#/m.test(unit.body)) {
      validationErrors.push(`${prefix} Body contains a markdown header`);
    }
    if (/\[.*?\]\(.*?\)/.test(unit.body)) {
      validationErrors.push(`${prefix} Body contains a markdown link`);
    }
    if (/\*\*|__/.test(unit.body)) {
      // Allow triple underscore ___ as a fill-in-the-blank line
      const cleanBody = unit.body.replace(/___+/g, " ");
      if (/\*\*|__/.test(cleanBody)) {
        validationErrors.push(`${prefix} Body contains markdown bold formatting (**, __)`);
      }
    }
    if (/\`.*?\`/.test(unit.body)) {
      validationErrors.push(`${prefix} Body contains inline code formatting (\`)`);
    }
    if (/\*[^\s*].*?\*/.test(unit.body)) {
      validationErrors.push(`${prefix} Body contains markdown italic (*) formatting`);
    }
    // Check for single underscore italics, ignoring the ___ blank placeholder
    const bodyWithoutTripleUnderscores = unit.body.replace(/___+/g, " ");
    if (/_([^\s_].*?|.*?[^\s_])_/.test(bodyWithoutTripleUnderscores)) {
      validationErrors.push(`${prefix} Body contains markdown italic (_) formatting`);
    }
  }

  // 6. Tone validation
  if (!unit.tone) {
    validationErrors.push(`${prefix} Missing required field: tone`);
  } else if (!APPROVED_TONES.includes(unit.tone)) {
    validationErrors.push(`${prefix} Invalid tone: "${unit.tone}"`);
  }

  // 7. Energy states validation
  if (!unit.energy_states || !Array.isArray(unit.energy_states) || unit.energy_states.length === 0) {
    validationErrors.push(`${prefix} Missing or empty required field: energy_states`);
  } else {
    unit.energy_states.forEach(es => {
      if (!APPROVED_ENERGY_STATES.includes(es)) {
        validationErrors.push(`${prefix} Invalid energy state: "${es}"`);
      }
    });
  }

  // 8. Source sub-fields validation
  if (!unit.source || typeof unit.source !== "object") {
    validationErrors.push(`${prefix} Missing or invalid required field: source`);
  } else {
    const s = unit.source;
    if (!s.origin) {
      validationErrors.push(`${prefix} Missing required field: source.origin`);
    } else if (!APPROVED_ORIGINS.includes(s.origin)) {
      validationErrors.push(`${prefix} Invalid source.origin: "${s.origin}"`);
    }

    if (s.vault_approved === undefined) {
      validationErrors.push(`${prefix} Missing required field: source.vault_approved`);
    } else if (typeof s.vault_approved !== "boolean") {
      validationErrors.push(`${prefix} source.vault_approved must be a boolean`);
    }

    if (!s.reviewed_by) {
      validationErrors.push(`${prefix} Missing required field: source.reviewed_by`);
    }

    if (!s.reviewed_at) {
      validationErrors.push(`${prefix} Missing required field: source.reviewed_at`);
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(s.reviewed_at)) {
      validationErrors.push(`${prefix} source.reviewed_at must be an ISO date string (YYYY-MM-DD)`);
    }
  }

  // 9. Review status validation
  if (!unit.review_status) {
    validationErrors.push(`${prefix} Missing required field: review_status`);
  } else if (!APPROVED_STATUSES.includes(unit.review_status)) {
    validationErrors.push(`${prefix} Invalid review_status: "${unit.review_status}"`);
  }

  // 10. Flag rules validation
  if (unit.review_status === "flagged") {
    if (!unit.flags || typeof unit.flags !== "object") {
      validationErrors.push(`${prefix} Flagged unit must have a "flags" object`);
    } else {
      if (!unit.flags.duplicate_of && !unit.flags.contradicts) {
        validationErrors.push(`${prefix} Flagged unit must specify "flags.duplicate_of" or "flags.contradicts"`);
      }
      if (unit.flags.contradicts && (!unit.flags.reason || typeof unit.flags.reason !== "string" || unit.flags.reason.trim() === "")) {
        validationErrors.push(`${prefix} Contradicting flagged unit must specify a non-empty "flags.reason"`);
      }
    }
  }
});

if (validationErrors.length > 0) {
  console.error("\n❌ SCHEMA VALIDATION FAILED on knowledge/registry.yaml:");
  validationErrors.forEach(err => console.error(`  - ${err}`));
  console.error("");
  process.exit(1);
}

console.log(`[generate-knowledge-bundle] Schema validation succeeded for all ${units.length} units.`);

const bundle = {
  schema_version: "1.0.0",
  generated_at: new Date().toISOString(),
  unit_count: units.length,   // always derived from the array length
  units,
};

writeFileSync(bundlePath, JSON.stringify(bundle, null, 2) + "\n");
console.log(`[generate-knowledge-bundle] ${units.length} units written to knowledge/polaris-knowledge-bundle.json`);
