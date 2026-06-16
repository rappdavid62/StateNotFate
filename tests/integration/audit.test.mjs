import test from 'node:test';
import assert from 'node:assert/strict';
import { runPrivacyAudit } from '../../scripts/privacy-audit.mjs';

test('audit script has no hard failures', async () => {
  const result = await runPrivacyAudit({ repoRoot: process.cwd() });
  assert.equal(result.pass, true, result.failures.join('\n'));
});
