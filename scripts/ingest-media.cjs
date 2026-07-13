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
        throw new Error(`File not found at ${filePath}`);
    }
    const content = fs.readFileSync(filePath, 'utf8');

    // Parse Frontmatter
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
    const fmMatch = content.match(frontmatterRegex);
    if (!fmMatch) {
        throw new Error("Missing or malformed YAML frontmatter (needs leading/trailing ---).");
    }

    const fmText = fmMatch[1];
    const metadata = {};
    fmText.split('\n').forEach(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join(':').trim().replace(/^["']|["']$/g, '');
            metadata[key] = value;
        }
    });

    const payloadRegex = /## 🛠️ Web Application Payload [\s\S]*?```json([\s\S]*?)```/;
    const payloadMatch = content.match(payloadRegex);
    let payload = null;
    if (payloadMatch) {
        try {
            payload = JSON.parse(payloadMatch[1].trim());
        } catch (e) {
            throw new Error(`Error parsing Web Application Payload JSON block: ${e.message}`);
        }
    } else {
        const fallbackRegex = /```json([\s\S]*?)```/;
        const fallbackMatch = content.match(fallbackRegex);
        if (fallbackMatch) {
            try {
                payload = JSON.parse(fallbackMatch[1].trim());
            } catch (e) {
                console.warn("[Warning] Fallback JSON block found but failed parsing:", e.message);
            }
        }
    }

    if (!payload) {
        throw new Error("No valid MICP-PAYLOAD JSON block found.");
    }

    return { metadata, payload, rawContent: content };
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
    if (!moduleData.title || !moduleData.objective || !moduleData.psychology || !moduleData.exercise || !moduleData.placeholder) {
        throw new Error("Invalid COURSE_MODULE payload: Missing required fields (title, objective, psychology, exercise, placeholder).");
    }

    let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');
    const modulesRegex = /(const COURSE_MODULES = \[)([\s\S]*?)^(\s*\];\s*const COMPENDIUM_TABLES = \{)/m;
    const match = appJs.match(modulesRegex);
    if (!match) {
        throw new Error("Could not locate COURSE_MODULES array block in app.js. Regex failed.");
    }

    const arrayHeader = match[1];
    const arrayBody = match[2];
    const arrayFooter = match[3];

    // Find current number of modules to dynamically assign the next ID
    const idMatches = arrayBody.match(/id:\s*(\d+)/g);
    let nextId = 11;
    if (idMatches && idMatches.length > 0) {
        const ids = idMatches.map(m => parseInt(m.match(/\d+/)[0]));
        nextId = Math.max(...ids) + 1;
    }

    // Deduplication check: Extract titles
    const titleRegex = /title:\s*"([^"]+)"/g;
    let existingMatch;
    let isDuplicate = false;
    let cleanNewTitle = moduleData.title.replace(/Module\s+\d+:\s*/i, '');

    while ((existingMatch = titleRegex.exec(arrayBody)) !== null) {
        let existingTitle = existingMatch[1].replace(/Module\s+\d+:\s*/i, '');
        if (existingTitle === cleanNewTitle) {
            isDuplicate = true;
            break;
        }
    }

    if (isDuplicate) {
        console.log(`[Web App] Module '${cleanNewTitle}' already exists in app.js. Skipping injection to prevent duplicates.`);
        return;
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

    const separator = arrayBody.trim().endsWith(',') ? '\n' : (arrayBody.trim() === '' ? '' : ',\n');
    const updatedBody = arrayBody.trimEnd() + separator + newModuleString + '\n';
    const updatedAppJs = appJs.replace(modulesRegex, `${arrayHeader}\n${updatedBody}${arrayFooter}`);
    fs.writeFileSync(APP_JS_PATH, updatedAppJs, 'utf8');
    console.log(`[Web App] Successfully injected Module ${nextId} into app.js.`);
}

function injectCompendiumTable(tableData) {
    if (!tableData.id || !tableData.title || !tableData.html) {
        throw new Error("Invalid COMPENDIUM_TABLE payload: Missing required fields (id, title, html).");
    }

    let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');
    let indexHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf8');

    const tablesRegex = /(Object\.assign\(COMPENDIUM_TABLES, \{)([\s\S]*?)^(\s*\}\);\s*const SUICIDE_ACTION_MAP = \{)/m;
    const tablesMatch = appJs.match(tablesRegex);
    if (!tablesMatch) {
        throw new Error("Could not locate Object.assign(COMPENDIUM_TABLES) block in app.js.");
    }

    const assignHeader = tablesMatch[1];
    let assignBody = tablesMatch[2];
    const assignFooter = tablesMatch[3];
    const escapedHtml = tableData.html.replace(/`/g, '\\`');

    const newTableAssignment = `            ${tableData.id}: \`\n${escapedHtml}\n            \``;
    
    // Deduplication check for table ID in app.js
    const tableIdRegex = new RegExp(`\\s+${tableData.id}:\\s*\`[\\s\\S]*?\`,?`, 'g');
    if (tableIdRegex.test(assignBody)) {
        console.log(`[Web App] Table ID '${tableData.id}' already exists. Overwriting existing table in app.js.`);
        assignBody = assignBody.replace(tableIdRegex, `\n${newTableAssignment},`);
    } else {
        const separator = assignBody.trim().endsWith(',') ? '\n' : (assignBody.trim() === '' ? '' : ',\n');
        assignBody = assignBody.trimEnd() + separator + newTableAssignment + ',\n';
    }

    const updatedAppJs = appJs.replace(tablesRegex, `${assignHeader}\n${assignBody}${assignFooter}`);
    fs.writeFileSync(APP_JS_PATH, updatedAppJs, 'utf8');
    console.log(`[Web App] Successfully injected table payload '${tableData.id}' into app.js.`);

    // 2. Inject select option dropdown in index.html
    const selectRegex = /(<select id="select-compendium-section"[\s\S]*?>)([\s\S]*?)(<\/select>)/;
    const htmlMatch = indexHtml.match(selectRegex);
    if (!htmlMatch) {
        throw new Error("Could not locate <select id=\"select-compendium-section\"> block in index.html.");
    }

    const selectHeader = htmlMatch[1];
    let selectBody = htmlMatch[2];
    const selectFooter = htmlMatch[3];
    const tableIndex = (selectBody.match(/<option/g) || []).length + 1;
    const optionString = `                                        <option value="${tableData.id}">Table ${tableIndex}: ${tableData.title}</option>`;

    if (selectBody.includes(`value="${tableData.id}"`)) {
        console.log(`[Web App] Dropdown option for table '${tableData.id}' already exists in index.html. Updating text.`);
        const optionRegex = new RegExp(`\\s*<option value="${tableData.id}">.*?</option>`);
        selectBody = selectBody.replace(optionRegex, `\n${optionString}`);
    } else {
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
        selectBody = lines.join('\n');
    }

    const updatedHtml = indexHtml.replace(selectRegex, `${selectHeader}${selectBody}${selectFooter}`);
    fs.writeFileSync(INDEX_HTML_PATH, updatedHtml, 'utf8');
    console.log(`[Web App] Successfully added/updated dropdown option for '${tableData.id}' to index.html.`);
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
    
    try {
        const parsed = parseMarkdown(filePath);
        copyToObsidian(filePath, fileName, parsed.metadata);
        if (parsed.payload.type === 'COURSE_MODULE') {
            injectCourseModule(parsed.payload.data);
        } else if (parsed.payload.type === 'COMPENDIUM_TABLE') {
            injectCompendiumTable(parsed.payload.data);
        } else {
            throw new Error(`Unknown payload type '${parsed.payload.type}'.`);
        }
        console.log("[MICP] Ingestion complete and verified! Run tests to validate web application integrity.");
    } catch (e) {
        console.error(`\n[MICP-ERROR] Pipeline Failed: ${e.message}\n`);
        process.exit(1);
    }
}

main();
