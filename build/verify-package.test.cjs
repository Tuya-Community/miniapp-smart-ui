const test = require('node:test');
const assert = require('node:assert/strict');
const { parsePackResult } = require('./verify-package.cjs');

const manifest = { files: [{ path: 'lynx/lib/picker/index.wxml', size: 42 }] };

test('accepts npm JSON output', () => {
  assert.deepEqual(parsePackResult(JSON.stringify([manifest], null, 2)), manifest);
});

test('accepts the prepare prefix observed with npm 10', () => {
  assert.deepEqual(
    parsePackResult(`husky - Git hooks installed\n${JSON.stringify([manifest], null, 2)}`),
    manifest
  );
});

test('ignores log lines starting with brackets before the actual manifest', () => {
  assert.deepEqual(
    parsePackResult(`[prepare] running\n${JSON.stringify([manifest], null, 2)}`),
    manifest
  );
});

test('rejects missing or malformed file manifests', () => {
  for (const input of ['build complete', '[]', '[{}]', '[{"files":[{}]}]']) {
    assert.throws(() => parsePackResult(input), /valid file manifest/);
  }
});
