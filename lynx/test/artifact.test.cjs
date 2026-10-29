const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const root = path.resolve(__dirname, '../..');
const { template, styles, verify } = require('../../build/lynx.cjs');

test('implicit template text drops formatting newlines without touching explicit multiline text', () => {
  const output = template(
    '<view class="smart-calendar__selected-day">\n  {{ item.text }}\n</view>'
  );
  assert.match(output, /<text class="smart-lynx-text">\{\{ item.text \}\}<\/text>/);
  const explicit = template('<text>First\nSecond</text>');
  assert.match(explicit, />First\nSecond<\/text>/);
  const data = template('<view>{{ message }}</view>');
  assert.match(data, /\{\{ message \}\}/);
});

test('Image tint layer keeps full-size absolute positioning after style conversion', () => {
  const css = fs.readFileSync(path.join(root, 'lynx/lib/image/index.css'), 'utf8');
  const postcss = require('postcss');
  const declarations = selector => {
    const result = {};
    postcss.parse(css).walkRules(rule => {
      if (rule.selector !== selector) return;
      rule.walkDecls(decl => {
        result[decl.prop] = decl.value;
      });
    });
    return result;
  };
  const tint = declarations('.smart-image__tint-color');
  for (const [prop, value] of Object.entries({
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    'z-index': '1',
  }))
    assert.equal(tint[prop], value, `Image tint layer lost ${prop}`);
  assert.equal(declarations('.smart-image')['z-index'], '0');
});

function props(file) {
  const syntax = ts.createSourceFile(
    file,
    fs.readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true
  );
  let result = [];
  function walk(node) {
    if (
      ts.isCallExpression(node) &&
      node.expression.getText(syntax) === 'SmartComponent' &&
      ts.isObjectLiteralExpression(node.arguments[0])
    ) {
      const prop = node.arguments[0].properties.find(p => p.name?.getText(syntax) === 'props');
      if (prop && ts.isObjectLiteralExpression(prop.initializer))
        result = prop.initializer.properties.map(p => p.name?.getText(syntax));
    }
    ts.forEachChild(node, walk);
  }
  walk(syntax);
  return result;
}
test('all 70 component props remain available and the original sources/artifacts are unchanged', () => {
  const rows = JSON.parse(fs.readFileSync(path.join(root, 'lynx/components.json'))).components;
  assert.equal(rows.length, 70);
  for (const row of rows) {
    const original = props(path.join(root, row.source, 'index.ts'));
    const current = props(path.join(root, 'lynx/.generated/packages', row.name, 'index.ts'));
    for (const name of original)
      assert.ok(current.includes(name), row.name + ': lost property ' + name);
  }
  verify();
});
test('template interpolation containing <= stays an expression, not a generated XML tag', () => {
  const out = template('<view class="test">{{ item <= -1 || item >= maxNum ? "" : item }}</view>');
  assert.match(out, /\{\{ item <= -1 \|\| item >= maxNum \? "" : item \}\}/);
  assert.doesNotMatch(out.replace(/\{\{[\s\S]*?\}\}/g, ''), /<\/?=/);
});
test('decorative borders are real nodes and text styles use explicit inherited variables', () => {
  const out = styles(
    '.line::after{content:"";border-bottom:1px solid red}.label{font-size:18px;color:#fff}.child{font-size:inherit}'
  );
  assert.match(out, /\.line > \.smart-lynx-after/);
  assert.doesNotMatch(out, /::after|font-size:\s*inherit/);
  assert.match(out, /--smart-lynx-font-size:\s*18px/);
  assert.match(out, /font-size:\s*var\(--smart-lynx-font-size/);
});
test('slot names and default slot API are retained in all isolated templates', () => {
  const rows = JSON.parse(fs.readFileSync(path.join(root, 'lynx/components.json'))).components;
  const names = text =>
    [...text.matchAll(/<slot\b[^>]*>/g)].map(m => /\bname="([^"]+)"/.exec(m[0])?.[1] || 'default');
  for (const row of rows) {
    const original = names(fs.readFileSync(path.join(root, row.source, 'index.wxml'), 'utf8'));
    const current = names(fs.readFileSync(path.join(root, row.target, 'index.wxml'), 'utf8'));
    for (const name of original)
      assert.ok(current.includes(name), `${row.name}: missing ${name} slot`);
  }
});

test('Picker drawing viewport contains columns but leaves both toolbars in normal flow', () => {
  const { parseDocument } = require('htmlparser2');
  const input = fs.readFileSync(path.join(root, 'lynx/lib/picker/index.wxml'), 'utf8');
  const doc = parseDocument(input.replace(/\{\{[\s\S]*?\}\}/g, 'EXPR'), { xmlMode: true });
  const nodes = [];
  const walk = node => {
    nodes.push(node);
    (node.children || []).forEach(walk);
  };
  walk(doc);
  const has = (node, name) => (node.attribs?.class || '').split(/\s+/).includes(name);
  const viewport = nodes.find(node => has(node, 'smart-picker__viewport'));
  const columns = nodes.find(node => has(node, 'smart-picker__columns'));
  assert.ok(viewport && columns, 'native drawing bounds must be present in emitted WXML');
  assert.equal(columns.parent, viewport);
  const css = fs.readFileSync(path.join(root, 'lynx/lib/picker/index.css'), 'utf8');
  assert.match(
    css,
    /\.smart-picker__viewport\s*\{[^}]*z-index:\s*0/,
    'absolute drawing layer requires an explicit parent stacking context'
  );
  assert.equal(
    viewport.parent,
    nodes.find(node => has(node, 'smart-picker'))
  );
  const toolbars = nodes.filter(node => node.name === 'include');
  assert.equal(toolbars.length, 2);
  for (const toolbar of toolbars) assert.equal(toolbar.parent, viewport.parent);
});

// Platform pan recognizers do not honor JavaScript touch bubbling alone.
test('PickerColumn intercepts ancestor vertical pans using scalar native properties', () => {
  const source = fs.readFileSync(path.join(root, 'lynx/overrides/picker-column/index.wxml'), 'utf8');
  const built = fs.readFileSync(path.join(root, 'lynx/lib/picker-column/index.wxml'), 'utf8');
  for (const markup of [source, built]) {
    const { parseDocument } = require('htmlparser2');
    const doc = parseDocument(markup, { xmlMode: true });
    const column = doc.children.find(node => node.name === 'view');
    assert.equal(column.attribs['pan-intercept-direction'], '{{disabled || !options.length ? 2 : 1}}');
    assert.equal(column.attribs['pan-intercept-scope'], '{{disabled || !options.length ? 6 : 1}}');
    assert.equal(column.attribs['consume-slide-event'], undefined, 'MiniApp stringifies this array-valued native property');
    assert.equal(column.attribs.flatten, '{{false}}');
    assert.equal(column.attribs['catch:touchmove'], 'onLynxMove');
  }
});
