const fs = require('fs');
const path = require('path');
const assert = require('assert');
const execSync = require('child_process').execSync;

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SCRIPTS_DIR = __dirname;

const TEST_MD_MODULE = path.join(SCRIPTS_DIR, 'mock-module.md');
const TEST_MD_TABLE = path.join(SCRIPTS_DIR, 'mock-table.md');

const TEMP_APP_JS = path.join(PROJECT_ROOT, 'app.test.tmp.js');
const TEMP_INDEX_HTML = path.join(PROJECT_ROOT, 'index.test.tmp.html');

function setupTestFiles() {
    // 1. Create Mock Module Note
    const mockModuleContent = `---
title: "Mock Lecture on Startup Cost"
type: "media-ingestion"
media_type: "lecture"
creator: "Dr. Alice"
source_url: "https://example.com/lecture"
date_ingested: "2026-07-07"
tags:
  - snf/ingested-media
web_target: "modules"
---

# Mock Lecture on Startup Cost
Systems details block.

## 🛠️ Web Application Payload (MICP-PAYLOAD)

\`\`\`json
{
  "type": "COURSE_MODULE",
  "data": {
    "title": "Module 11: Mock Lecture on Startup Cost",
    "objective": "Understand mock startup costs",
    "psychology": "Mock psychology sentences for test verification.",
    "exercise": "Mock reflection question.",
    "placeholder": "Mock placeholder text..."
  }
}
\`\`\`
`;
    fs.writeFileSync(TEST_MD_MODULE, mockModuleContent, 'utf8');

    // 2. Create Mock Table Note
    const mockTableContent = `---
title: "Mock Podcast on Clinical Triage"
type: "media-ingestion"
media_type: "podcast"
creator: "Bob & Charlie"
source_url: "https://example.com/podcast"
date_ingested: "2026-07-07"
tags:
  - snf/ingested-media
web_target: "tables"
---

# Mock Podcast on Clinical Triage
Podcast notes content.

## 🛠️ Web Application Payload (MICP-PAYLOAD)

\`\`\`json
{
  "type": "COMPENDIUM_TABLE",
  "data": {
    "id": "mock_table_triage",
    "title": "Mock Table on Clinical Triage Options",
    "html": "<div class='table-responsive'><table class='w-full'><tbody><tr><td>Mock Stage</td><td>Mock Vulnerability</td><td>Mock Interventions</td></tr></tbody></table></div>"
  }
}
\`\`\`
`;
    fs.writeFileSync(TEST_MD_TABLE, mockTableContent, 'utf8');

    // 3. Copy app.js and index.html to temp files
    fs.copyFileSync(path.join(PROJECT_ROOT, 'app.js'), TEMP_APP_JS);
    fs.copyFileSync(path.join(PROJECT_ROOT, 'index.html'), TEMP_INDEX_HTML);
}

function cleanupTestFiles() {
    [TEST_MD_MODULE, TEST_MD_TABLE, TEMP_APP_JS, TEMP_INDEX_HTML].forEach(file => {
        if (fs.existsSync(file)) {
            try {
                fs.unlinkSync(file);
            } catch (e) {
                console.warn(`[Warning] Failed to delete temp file ${file}: ${e.message}`);
            }
        }
    });
}

function runTest() {
    console.log("[Test] Setting up mock test files...");
    setupTestFiles();

    // Modify the ingestion script temporarily to use our temp files
    const originalScriptPath = path.join(SCRIPTS_DIR, 'ingest-media.cjs');
    let scriptContent = fs.readFileSync(originalScriptPath, 'utf8');

    // Rewrite file targets to test files
    const modifiedScriptContent = scriptContent
        .replace("const APP_JS_PATH = path.join(PROJECT_ROOT, 'app.js');", `const APP_JS_PATH = '${TEMP_APP_JS.replace(/\\/g, '\\\\')}';`)
        .replace("const INDEX_HTML_PATH = path.join(PROJECT_ROOT, 'index.html');", `const INDEX_HTML_PATH = '${TEMP_INDEX_HTML.replace(/\\/g, '\\\\')}';`);

    const tempScriptPath = path.join(SCRIPTS_DIR, 'ingest-media.test.tmp.cjs');
    fs.writeFileSync(tempScriptPath, modifiedScriptContent, 'utf8');

    try {
        console.log("[Test] Testing Course Module Ingestion...");
        execSync(`node "${tempScriptPath}" "${TEST_MD_MODULE}"`, { stdio: 'inherit' });

        // Assert app.test.tmp.js contains the mock module
        const appJsContent = fs.readFileSync(TEMP_APP_JS, 'utf8');
        assert.ok(appJsContent.includes("Module 11: Mock Lecture on Startup Cost"), "Course Module Title injection check failed.");
        assert.ok(appJsContent.includes("Mock psychology sentences for test verification."), "Course Module Psychology injection check failed.");
        console.log("[Test] Course Module Ingestion PASSED!");

        console.log("[Test] Testing Compendium Table Ingestion...");
        execSync(`node "${tempScriptPath}" "${TEST_MD_TABLE}"`, { stdio: 'inherit' });

        // Assert app.test.tmp.js contains table data and index.test.tmp.html contains the option element
        const updatedAppJsContent = fs.readFileSync(TEMP_APP_JS, 'utf8');
        const updatedIndexContent = fs.readFileSync(TEMP_INDEX_HTML, 'utf8');

        assert.ok(updatedAppJsContent.includes("mock_table_triage: `"), "Compendium Table key injection check failed.");
        assert.ok(updatedAppJsContent.includes("Mock Vulnerability"), "Compendium Table HTML body check failed.");
        assert.ok(updatedIndexContent.includes('value="mock_table_triage"'), "index.html Option value injection check failed.");
        assert.ok(updatedIndexContent.includes("Mock Table on Clinical Triage Options"), "index.html Option Text injection check failed.");
        console.log("[Test] Compendium Table Ingestion PASSED!");

        console.log("\n🎉 ALL INGESTION PARSER TESTS COMPLETED SUCCESSFULLY!");
    } catch (e) {
        console.error("\n❌ TEST FAILED:", e.message);
        process.exit(1);
    } finally {
        console.log("[Test] Cleaning up temp files...");
        cleanupTestFiles();
        if (fs.existsSync(tempScriptPath)) {
            fs.unlinkSync(tempScriptPath);
        }
    }
}

runTest();
