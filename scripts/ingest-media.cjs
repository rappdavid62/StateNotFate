const fs = require('fs');
const path = require('path');

// Target directory paths
const PROJECT_ROOT = path.resolve(__dirname, '..');
const APP_JS_PATH = path.join(PROJECT_ROOT, 'app.js');
const INDEX_HTML_PATH = path.join(PROJECT_ROOT, 'index.html');
const DEFAULT_OBSIDIAN_VAULT = 'C:\\Users\\rappd\\OneDrive\\Desktop\\ObsidianVault\\STATENOTFATE';
const INGESTED_MEDIA_SUBDIR = 'Ingested_Media';

function parseMarkdown(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`Error: File not found at ${filePath}`);
        process.exit(1);
    }

    const content = fs.readFileSync(filePath, 'utf8');

    // Parse Frontmatter
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
    const fmMatch = content.match(frontmatterRegex);
    if (!fmMatch) {
        console.error("Error: Missing or malformed YAML frontmatter (needs leading/trailing ---).");
        process.exit(1);
    }

    const fmText = fmMatch[1];
    const metadata = {};
    fmText.split('\n').forEach(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join(':').trim().replace(/^["']|["']$/g, ''); // strip quotes
            metadata[key] = value;
        }
    });

    // Parse MICP-PAYLOAD JSON blocks
    // Look for any json code block under the payload section
    const payloadRegex = /## 🛠️ Web Application Payload [\s\S]*?```json([\s\S]*?)```/;
    const payloadMatch = content.match(payloadRegex);
    
    let payload = null;
    if (payloadMatch) {
        try {
            payload = JSON.parse(payloadMatch[1].trim());
        } catch (e) {
            console.error("Error parsing Web Application Payload JSON block:", e.message);
            process.exit(1);
        }
    } else {
        // Fallback: try finding any JSON block in the file
        const fallbackRegex = /```json([\s\S]*?)```/;
        const fallbackMatch = content.match(fallbackRegex);
        if (fallbackMatch) {
            try {
                payload = JSON.parse(fallbackMatch[1].trim());
            } catch (e) {
                console.error("Fallback: JSON block found but failed parsing:", e.message);
            }
        }
    }

    return {
        metadata,
        payload,
        rawContent: content
    };
}

function copyToObsidian(filePath, fileName, metadata) {
    const vaultPath = DEFAULT_OBSIDIAN_VAULT;
    if (!fs.existsSync(vaultPath)) {
        console.warn(`[Warning] Obsidian Vault directory not found at ${vaultPath}. Skipping Obsidian copy step.`);
        return;
    }

    const targetDir = path.join(vaultPath, INGESTED_MEDIA_SUBDIR);
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetFile = path.join(targetDir, fileName);
    fs.copyFileSync(filePath, targetFile);
    console.log(`[Obsidian] Successfully copied note to vault: ${targetFile}`);
}

function injectCourseModule(moduleData) {
    if (!fs.existsSync(APP_JS_PATH)) {
        console.error(`Error: app.js not found at ${APP_JS_PATH}`);
        process.exit(1);
    }

    let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');

    // Regex to capture COURSE_MODULES array block
    const modulesRegex = /(const COURSE_MODULES = \[)([\s\S]*?)(\];\s*const COMPENDIUM_TABLES = {)/;
    const match = appJs.match(modulesRegex);

    if (!match) {
        console.error("Error: Could not locate COURSE_MODULES array block in app.js.");
        process.exit(1);
    }

    const arrayHeader = match[1];
    const arrayBody = match[2].trim();
    const arrayFooter = match[3];

    // Find current number of modules to dynamically assign the next ID
    const idMatches = arrayBody.match(/id:\s*(\d+)/g);
    let nextId = 11; // fallback
    if (idMatches && idMatches.length > 0) {
        const ids = idMatches.map(m => parseInt(m.match(/\d+/)[0]));
        nextId = Math.max(...ids) + 1;
    }

    const titleWithModuleNumber = moduleData.title.replace(/Module\s+\d+:/i, `Module ${nextId}:`);

    const newModuleString = `            {
                id: ${nextId},
                title: "${titleWithModuleNumber.replace(/"/g, '\\"')}",
                objective: "${moduleData.objective.replace(/"/g, '\\"')}",
                psychology: "${moduleData.psychology.replace(/"/g, '\\"')}",
                exercise: "${moduleData.exercise.replace(/"/g, '\\"')}",
                placeholder: "${moduleData.placeholder.replace(/"/g, '\\"')}"
            }`;

    // Append to array body with proper trailing comma formatting
    const separator = arrayBody.endsWith(',') ? '\n' : ',\n';
    const updatedBody = arrayBody + separator + newModuleString;

    const updatedAppJs = appJs.replace(modulesRegex, `${arrayHeader}\n${updatedBody}\n        ${arrayFooter}`);
    fs.writeFileSync(APP_JS_PATH, updatedAppJs, 'utf8');
    console.log(`[Web App] Successfully injected Module ${nextId} into app.js.`);
}

function injectCompendiumTable(tableData) {
    if (!fs.existsSync(APP_JS_PATH)) {
        console.error(`Error: app.js not found at ${APP_JS_PATH}`);
        process.exit(1);
    }
    if (!fs.existsSync(INDEX_HTML_PATH)) {
        console.error(`Error: index.html not found at ${INDEX_HTML_PATH}`);
        process.exit(1);
    }

    let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');
    let indexHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf8');

    // 1. Inject into app.js Object.assign block
    const tablesRegex = /(Object\.assign\(COMPENDIUM_TABLES, \{)([\s\S]*?)(\}\);\s*const SUICIDE_ACTION_MAP = {)/;
    const tablesMatch = appJs.match(tablesRegex);

    if (!tablesMatch) {
        console.error("Error: Could not locate Object.assign(COMPENDIUM_TABLES) block in app.js.");
        process.exit(1);
    }

    const assignHeader = tablesMatch[1];
    const assignBody = tablesMatch[2].trim();
    const assignFooter = tablesMatch[3];

    // Format new table assignment
    const escapedHtml = tableData.html.replace(/`/g, '\\`');
    const newTableAssignment = `            ${tableData.id}: \`
${escapedHtml}
            \``;

    // Append to Object.assign body
    const separator = assignBody.endsWith(',') ? '\n' : ',\n';
    const updatedAssignBody = assignBody + separator + newTableAssignment;

    const updatedAppJs = appJs.replace(tablesRegex, `${assignHeader}\n${updatedAssignBody}\n        ${assignFooter}`);
    fs.writeFileSync(APP_JS_PATH, updatedAppJs, 'utf8');
    console.log(`[Web App] Successfully injected table payload '${tableData.id}' into app.js.`);

    // 2. Inject select option dropdown in index.html if it doesn't already exist
    const selectRegex = /(<select id="select-compendium-section"[\s\S]*?>)([\s\S]*?)(<\/select>)/;
    const htmlMatch = indexHtml.match(selectRegex);

    if (!htmlMatch) {
        console.error("Error: Could not locate <select id=\"select-compendium-section\"> block in index.html.");
        process.exit(1);
    }

    const selectHeader = htmlMatch[1];
    const selectBody = htmlMatch[2];
    const selectFooter = htmlMatch[3];

    // Check if option value already exists to prevent duplicate insertion
    if (selectBody.includes(`value="${tableData.id}"`)) {
        console.log(`[Web App] Dropdown option for table '${tableData.id}' already exists in index.html. Skipping.`);
        return;
    }

    // Format option element (matched spacing to original file)
    const tableIndex = (selectBody.match(/<option/g) || []).length + 1;
    const optionString = `                                        <option value="${tableData.id}">Table ${tableIndex}: ${tableData.title}</option>`;

    // Insert as the last option inside select body
    const lines = selectBody.split('\n');
    let lastOptionIdx = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].includes('</option>')) {
            lastOptionIdx = i;
            break;
        }
    }

    if (lastOptionIdx !== -1) {
        lines.splice(lastOptionIdx + 1, 0, optionString);
    } else {
        lines.push(optionString);
    }

    const updatedSelectBody = lines.join('\n');
    const updatedHtml = indexHtml.replace(selectRegex, `${selectHeader}${updatedSelectBody}${selectFooter}`);
    fs.writeFileSync(INDEX_HTML_PATH, updatedHtml, 'utf8');
    console.log(`[Web App] Successfully added dropdown option for '${tableData.id}' to index.html.`);
}

function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.log("Usage: node scripts/ingest-media.cjs <path-to-markdown-file>");
        process.exit(1);
    }

    const filePath = path.resolve(args[0]);
    const fileName = path.basename(filePath);

    console.log(`[MICP] Starting ingestion of ${fileName}...`);
    const parsed = parseMarkdown(filePath);

    // Save to Obsidian
    copyToObsidian(filePath, fileName, parsed.metadata);

    // Process Payload
    const payload = parsed.payload;
    if (!payload) {
        console.warn("[Warning] No Web Application Payload section found in note. Done (Obsidian only).");
        return;
    }

    if (payload.type === 'COURSE_MODULE') {
        injectCourseModule(payload.data);
    } else if (payload.type === 'COMPENDIUM_TABLE') {
        injectCompendiumTable(payload.data);
    } else {
        console.error(`Error: Unknown payload type '${payload.type}'.`);
        process.exit(1);
    }

    console.log("[MICP] Ingestion complete and verified! Run tests to validate web application integrity.");
}

main();
