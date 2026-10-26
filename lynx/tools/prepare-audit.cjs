// Test-only copies of the original independent demos. A section query exposes
// each original demo-block without depending on the deferred page scroll issue.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ts = require('typescript');
const { components, writeTuyaAliases } = (() => ({
  ...require('../prepare-example.cjs'),
  ...require('../build.cjs'),
}))();
const root = path.resolve(__dirname, '../..');
const audit = path.join(root, '.clix/test/e2e_temp/20261026-component-audit');
const webSource = path.join(root, '.clix/test/e2e_temp/20261026-example-parity/web-project');

function prepare(kind, source) {
  const target = path.join(audit, `${kind}-project`);
  if (fs.existsSync(target)) {
    const history = path.join(audit, 'history');
    fs.mkdirSync(history, { recursive: true });
    fs.renameSync(target, path.join(history, `${kind}-${Date.now()}`));
  }
  fs.mkdirSync(target, { recursive: true });
  fs.copyFileSync(path.join(source, 'project.tuya.json'), path.join(target, 'project.tuya.json'));
  fs.cpSync(path.join(source, 'example'), path.join(target, 'example'), { recursive: true });
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(target, 'node_modules'), 'dir');
  fs.writeFileSync(path.join(target, 'package.json'), JSON.stringify({ name: `smart-ui-${kind}-audit`, private: true }));
  const sections = [];
  for (const name of components) {
    const demo = path.join(target, 'example/dist', name, 'demo');
    const script = path.join(demo, 'index.js');
    const originalScript = ts.transpileModule(fs.readFileSync(script, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES5 },
    }).outputText;
    const marker = /var component_1 = require\(["']\.\.\/\.\.\/common\/component["']\);/;
    if (!marker.test(originalScript)) throw new Error(`Cannot locate demo component factory: ${name}`);
    const inject = `
component_1 = Object.assign({}, component_1, { SmartComponent: (function(factory) {
  return function(options) {
    options.props = Object.assign({}, options.props, { testSection: { type: Number, value: 0 } });
    return factory(options);
  };
})(component_1.SmartComponent) });`;
    fs.writeFileSync(script, originalScript.replace(marker, match => match + inject));
    const template = path.join(demo, 'index.wxml');
    let index = 0;
    const sourceTemplate = fs.readFileSync(template, 'utf8');
    const output = sourceTemplate.replace(/<demo-block\b((?:[^'">]|"[^"]*"|'[^']*')*)>/g, (_, attrs) => {
      index++;
      const title = (attrs.match(/\btitle="([^"]*)"/) || [])[1] || '';
      sections.push({ component: name, route: `pages/${name === 'normal-slider' ? 'slider' : name}/index`, section: index, title, status: 'NOT_CHECKED' });
      const condition = `testSection === ${index}`;
      if (/wx:if=/.test(attrs)) attrs = attrs.replace(/wx:if="\{\{([\s\S]*?)\}\}"/, (_, expr) => `wx:if="{{(${expr}) && (${condition})}}"`);
      else attrs += ` wx:if="{{${condition}}}"`;
      return '<demo-block' + attrs + '>';
    });
    fs.writeFileSync(template, output);
    const route = `pages/${name === 'normal-slider' ? 'slider' : name}/index`;
    const pageTemplate = path.join(target, 'example', route + '.wxml');
    fs.writeFileSync(pageTemplate, fs.readFileSync(pageTemplate, 'utf8').replace(/(<smart-[\w-]+-demo)\b/, '$1 wx:if="{{testSection}}" test-section="{{testSection}}"'));
  }
  const factory = path.join(target, 'example/common/page.js');
  fs.writeFileSync(factory, ts.transpileModule(fs.readFileSync(factory, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES5 },
  }).outputText);
  fs.appendFileSync(factory, `
var auditPageFactory = exports.default;
exports.default = function(options) {
  options = options || {};
  var previous = options.onLoad;
  return auditPageFactory(Object.assign({}, options, { onLoad: function(query) {
    this.setData({ testSection: Number(query.section) || 0 });
    if (previous) previous.call(this, query);
  }}));
};
`);
  if (kind === 'native') writeTuyaAliases(path.join(target, 'example'));
  fs.writeFileSync(path.join(target, 'audit-sections.json'), JSON.stringify(sections, null, 2));
  const manifest = {};
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(file);
      else manifest[path.relative(target, file)] = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    }
  }
  visit(path.join(target, 'example'));
  fs.writeFileSync(path.join(target, 'audit-manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`${kind}: ${target} (${sections.length} original demo sections)`);
}

const kind = process.argv[2] || 'both';
if (kind === 'both' || kind === 'web') prepare('web', webSource);
if (kind === 'both' || kind === 'native') prepare('native', path.join(root, 'lynx'));
