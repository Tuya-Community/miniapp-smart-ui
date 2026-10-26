const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { build, archiveOutput } = require('./build.cjs');
const { prepareExample } = require('./prepare-example.cjs');

async function main() {
  await build();
  const fixtures = process.argv.includes('--fixtures');
  if (fixtures) {
    archiveOutput(path.join(__dirname, 'fixtures/dist'));
    fs.cpSync(path.join(__dirname, 'dist'), path.join(__dirname, 'fixtures/dist'), { recursive: true });
  } else {
    prepareExample();
    await build(path.join(__dirname, 'example/dist'), { includeDemos: true });
  }
  if (process.argv.includes('--components-only')) return;
  const compiler = process.env.MINIPACK_CLI;
  if (!compiler || !fs.existsSync(compiler)) throw new Error('Set MINIPACK_CLI to the installed 5.0.0-alpha.34 minipack-build.js');
  const args = [compiler, fixtures ? path.join(__dirname, 'fixtures') : __dirname, '--renderer=native', '--resolve-dir', path.join(__dirname, '../node_modules'), '-o', path.join(__dirname, fixtures ? 'build-fixtures-output' : 'build-output')];
  if (process.env.LYNX_FRAMEWORK_DIR) args.push('--framework-dir', process.env.LYNX_FRAMEWORK_DIR);
  const result = spawnSync(process.execPath, args, { stdio: 'inherit' });
  process.exitCode = result.status === null ? 1 : result.status;
}
main().catch(e => { console.error(e); process.exitCode = 1; });
