/**
 * polaris-synthesis.mjs
 * Netlify Function — server-side AI synthesis for Polaris.
 *
 * POST /.netlify/functions/polaris-synthesis
 * Body: { stateSummary: { ... }, knowledgeUnits: [ ... ] }
 *
 * Returns a validated PolarisAIResponse or 503 so the client falls back
 * to the local deterministic engine.
 *
 * Environment variables (set in Netlify dashboard, never shipped to browser):
 *   SNF_AI_PROVIDER  — "openai" (default) | "none"
 *   SNF_AI_MODEL     — e.g. "gpt-4o-mini" (default)
 *   OPENAI_API_KEY   — secret key, never exposed to client
 */

// ---------------------------------------------------------------------------
// Schema validation helpers
// ---------------------------------------------------------------------------

/**
 * Validates that a raw model response object conforms to the expected
 * PolarisAIResponse schema.
 *
 * Required shape:
 * {
 *   message: string,                 // 1–500 chars
 *   dayStateLabel: string,           // one of the four day-state values
 *   anchors: [{ id, text }],         // 1–6 items
 *   floorWinsMode: boolean,
 *   synthesisSource: "ai" | "local"
 * }
 *
 * @param {unknown} raw
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validatePolarisResponse(raw) {
  const errors = [];

  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { valid: false, errors: ["Response is not an object"] };
  }

  // message
  if (typeof raw.message !== "string" || raw.message.trim().length === 0) {
    errors.push("message must be a non-empty string");
  } else if (raw.message.length > 500) {
    errors.push("message must be 500 characters or fewer");
  }

  // dayStateLabel
  const validDayStates = ["high", "medium", "low", "collapse"];
  if (!validDayStates.includes(raw.dayStateLabel)) {
    errors.push(`dayStateLabel must be one of: ${validDayStates.join(", ")}`);
  }

  // anchors
  if (!Array.isArray(raw.anchors)) {
    errors.push("anchors must be an array");
  } else if (raw.anchors.length < 1 || raw.anchors.length > 6) {
    errors.push("anchors must contain 1–6 items");
  } else {
    raw.anchors.forEach((a, i) => {
      if (!a || typeof a !== "object") {
        errors.push(`anchors[${i}] must be an object`);
      } else {
        if (typeof a.id !== "string" || a.id.trim().length === 0) {
          errors.push(`anchors[${i}].id must be a non-empty string`);
        }
        if (typeof a.text !== "string" || a.text.trim().length === 0) {
          errors.push(`anchors[${i}].text must be a non-empty string`);
        }
      }
    });
  }

  // floorWinsMode
  if (typeof raw.floorWinsMode !== "boolean") {
    errors.push("floorWinsMode must be a boolean");
  }

  // synthesisSource
  if (!["ai", "local"].includes(raw.synthesisSource)) {
    errors.push('synthesisSource must be "ai" or "local"');
  }

  return { valid: errors.length === 0, errors };
}

// ---------------------------------------------------------------------------
// Input sanitisation
// ---------------------------------------------------------------------------

/**
 * Builds a compact, privacy-preserving prompt payload from client inputs.
 * Sensitive free-text from the state is never forwarded.
 *
 * @param {{ stateSummary: object, knowledgeUnits: object[] }} body
 * @returns {{ systemPrompt: string, userContent: string }}
 */
function buildPrompt(body) {
  const { stateSummary = {}, knowledgeUnits = [] } = body;

  // Only forward structured numeric/enum fields — no raw journal text
  const safeState = {
    dayState: stateSummary.dayState || "medium",
    hopeLevel: typeof stateSummary.hopeLevel === "number" ? stateSummary.hopeLevel : null,
    proofPointsToday: typeof stateSummary.proofPointsToday === "number" ? stateSummary.proofPointsToday : null,
    floorWinsMode: !!stateSummary.floorWinsMode,
    missedDays: typeof stateSummary.missedDays === "number" ? stateSummary.missedDays : null,
  };

  // Limit knowledge units to 5 max, each trimmed
  const safeKnowledge = knowledgeUnits
    .slice(0, 5)
    .map((u) => ({
      id: String(u.id || "").slice(0, 64),
      summary: String(u.summary || u.text || "").slice(0, 300),
    }))
    .filter((u) => u.summary.length > 0);

  const systemPrompt = `You are Polaris, a compassionate recovery-support AI for the State Not Fate app.
Your sole task is to synthesize the user's current state with recovery knowledge and return a structured JSON object — nothing else.
Never provide medical advice, diagnoses, or crisis intervention text.
Respond with ONLY a valid JSON object that matches this schema exactly:
{
  "message": "<string, 1-500 chars, supportive and grounded>",
  "dayStateLabel": "<high|medium|low|collapse>",
  "anchors": [
    { "id": "<short_snake_case_id>", "text": "<actionable anchor, ≤120 chars>" }
  ],
  "floorWinsMode": <true|false>,
  "synthesisSource": "ai"
}
Rules:
- anchors array must have 1–6 items.
- If dayStateLabel is "collapse", set floorWinsMode to true and limit anchors to 3 simple survival tasks.
- Do not include markdown, code fences, or any text outside the JSON object.`;

  const userContent = JSON.stringify({ state: safeState, knowledge: safeKnowledge });

  return { systemPrompt, userContent };
}

// ---------------------------------------------------------------------------
// OpenAI call
// ---------------------------------------------------------------------------

const MODEL = process.env.SNF_AI_MODEL || "gpt-4o-mini";
const TIMEOUT_MS = 12000;

async function callOpenAI(systemPrompt, userContent) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        max_tokens: 512,
        temperature: 0.4,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (response.status === 429) throw new Error("rate_limit");
    if (!response.ok) throw new Error(`openai_http_${response.status}`);

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("empty_response");

    return JSON.parse(content);
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export const handler = async (event) => {
  // Only accept POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  // Parse body
  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  // Validate minimal input shape
  if (!body.stateSummary || typeof body.stateSummary !== "object") {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "stateSummary is required" }),
    };
  }
  if (!Array.isArray(body.knowledgeUnits)) {
    body.knowledgeUnits = [];
  }

  // Check provider config
  const provider = process.env.SNF_AI_PROVIDER || "openai";
  if (provider === "none" || !process.env.OPENAI_API_KEY) {
    return {
      statusCode: 503,
      body: JSON.stringify({ error: "AI provider not configured", fallback: true }),
    };
  }

  // Build prompt and call model
  let raw;
  try {
    const { systemPrompt, userContent } = buildPrompt(body);
    raw = await callOpenAI(systemPrompt, userContent);
  } catch (err) {
    // All network/timeout/rate-limit errors → instruct client to fall back
    const reason = err.message || "unknown";
    return {
      statusCode: 503,
      body: JSON.stringify({ error: reason, fallback: true }),
    };
  }

  // Validate schema
  const { valid, errors } = validatePolarisResponse(raw);
  if (!valid) {
    return {
      statusCode: 503,
      body: JSON.stringify({ error: "schema_validation_failed", details: errors, fallback: true }),
    };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(raw),
  };
};
