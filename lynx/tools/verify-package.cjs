const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const root = path.join(__dirname, '..');
const pkg = require('../package.json');
const components = ['icon', 'image', 'loading', 'switch', 'grid', 'grid-item', 'popup',
  'overlay', 'action-sheet', 'toast', 'picker', 'picker-column', 'datetime-picker',
  'calendar', 'dialog', 'slider', 'normal-slider'];

function verifyPackage(directory = root) {
  const manifest = JSON.parse(fs.readFileSync(path.join(directory, 'package.json')));
  assert.equal(manifest.name, '@tuya/miniapp-smart-ui-lynx');
  assert.notEqual(manifest.private, true);
  assert.equal(manifest.miniprogram, 'dist');
  assert.equal(manifest.publishConfig.tag, 'beta');
  assert.match(manifest.version, /^\d+\.\d+\.\d+-beta\.\d+$/);
  for (const name of components) {
    for (const ext of ['js', 'json', 'wxml', 'tyml', 'd.ts']) {
      assert.ok(fs.existsSync(path.join(directory, 'dist', name, 'index.' + ext)), `${name}/index.${ext} missing`);
    }
  }
  function walk(folder) {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const file = path.join(folder, entry.name);
      if (entry.isDirectory()) { assert.notEqual(entry.name, 'demo'); walk(file); continue; }
      assert.ok(!/\.(ts|less|rjs)$/.test(entry.name) || entry.name.endsWith('.d.ts'), file);
      if (entry.name.endsWith('.json')) {
        const config = JSON.parse(fs.readFileSync(file));
        for (const target of Object.values(config.usingComponents || {})) {
          if (target.startsWith('.')) {
            assert.ok(fs.existsSync(path.resolve(path.dirname(file), target + '.json')), `${file}: missing ${target}`);
          }
        }
      }
      if (entry.name.endsWith('.wxml')) assert.ok(fs.existsSync(file.replace(/\.wxml$/, '.tyml')), file);
      if (entry.name.endsWith('.wxs')) assert.ok(fs.existsSync(file.replace(/\.wxs$/, '.sjs')), file);
      if (entry.name.endsWith('.css')) assert.ok(fs.existsSync(file.replace(/\.css$/, '.tyss')), file);
      if (entry.name.endsWith('.js') || entry.name.endsWith('.d.ts')) {
        const source = fs.readFileSync(file, 'utf8');
        for (const match of source.matchAll(/(?:require\(|from\s+)["']([^"']+)["']/g)) {
          const target = match[1];
          if (target.startsWith('.')) {
            const base = path.resolve(path.dirname(file), target);
            assert.ok(['', '.js', '.d.ts', '/index.js', '/index.d.ts'].some(ext=>fs.existsSync(base + ext)), `${file}: missing ${target}`);
          } else {
            const name = target.startsWith('@') ? target.split('/').slice(0, 2).join('/') : target.split('/')[0];
            assert.ok(manifest.dependencies[name] || ['miniprogram-api-typings'].includes(name), `${file}: undeclared ${name}`);
          }
        }
      }
    }
  }
  walk(path.join(directory, 'dist'));
  return manifest;
}

if (require.main === module) {
  verifyPackage();
  const packed = spawnSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], { cwd: root, encoding: 'utf8' });
  if (packed.status !== 0) throw new Error(packed.stderr || 'npm pack failed');
  const info = JSON.parse(packed.stdout)[0];
  for (const file of info.files) assert.ok(file.path.startsWith('dist/') || ['README.md', 'LICENSE', 'package.json'].includes(file.path), file.path);
  for (const name of ['LICENSE', 'README.md']) assert.ok(info.files.some(file=>file.path===name), name);
  console.log(`Verified ${pkg.name}@${pkg.version}: ${info.files.length} files, ${components.length} component entries, templates/aliases/types/dependencies present`);
}
module.exports = { verifyPackage };
