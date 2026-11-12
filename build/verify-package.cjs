/* Check npm's real pack list without publishing a package. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { verify } = require('./lynx.cjs');

const root = path.resolve(__dirname, '..');

// npm 10 can prepend prepare output even with pack --ignore-scripts --json.
function parsePackResult(stdout) {
  for (const match of stdout.matchAll(/^\s*\[/gm)) {
    let result;
    try {
      result = JSON.parse(stdout.slice(match.index));
    } catch (error) {
      result = null;
    }
    if (
      Array.isArray(result) &&
      result.length === 1 &&
      Array.isArray(result[0]?.files) &&
      result[0].files.every(file => typeof file.path === 'string')
    ) {
      return result[0];
    }
  }
  throw new Error('npm pack did not return a valid file manifest');
}

function files(dir) {
  assert.ok(fs.existsSync(dir), `Missing ${path.relative(root, dir)}; run yarn build first`);
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory()
      ? files(file)
      : [path.relative(root, file).split(path.sep).join('/')];
  });
}

function verifyPackage() {
  for (const kind of ['dist', 'lib']) {
    assert.ok(
      fs.existsSync(path.join(root, 'lynx', kind)),
      `Missing lynx/${kind}; run yarn build first`
    );
  }
  verify();
  const required = ['lynx/package.json'];
  for (const kind of ['dist', 'lib']) {
    const folder = `lynx/${kind}`;
    for (const critical of [
      'common/component.js',
      'lynx-runtime/adapters.js',
      'lynx-runtime/model.js',
    ]) {
      assert.ok(fs.existsSync(path.join(root, folder, critical)), `Missing ${folder}/${critical}`);
    }
    required.push(...files(path.join(root, folder)));
    assert.ok(fs.existsSync(path.join(root, kind, 'picker/index.wxml')), `Missing WebView ${kind}`);
    required.push(`${kind}/picker/index.wxml`, `${kind}/popup/index.wxml`);
  }
  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const result = spawnSync(command, ['pack', '--dry-run', '--ignore-scripts', '--json'], {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const archive = parsePackResult(result.stdout);
  const packed = new Set(archive.files.map(file => file.path));
  const missing = required.filter(file => !packed.has(file));
  assert.equal(
    missing.length,
    0,
    `npm archive omits ${missing.length} built files: ${missing.slice(0, 5).join(', ')}`
  );
  const forbidden = [...packed].filter(
    file =>
      /^lynx\/(?:\.generated|overrides|test|ray)\//.test(file) ||
      /^(?:dist|lib)\/[^/]+\/demo\//.test(file) ||
      /^lynx\/(?:build-receipt|components|webview-baseline)\.json$/.test(file)
  );
  assert.deepEqual(forbidden, [], 'Development-only Lynx directories must not be published');
  console.log(
    `npm package verified: ${required.length} required entries, ${packed.size} total files.`
  );
  return { requiredFiles: required.length, packedFiles: packed.size };
}

if (require.main === module) {
  try {
    verifyPackage();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { verifyPackage, parsePackResult };
