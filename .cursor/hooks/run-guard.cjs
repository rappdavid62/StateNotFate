const { spawnSync } = require('node:child_process');
const path = require('node:path');
const python = process.platform === 'win32' ? 'C:\\Python314\\python.exe' : 'python3';
const result = spawnSync(python, [path.join(__dirname, 'snf-workspace-guard.py')], { stdio: 'inherit' });
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 2);
