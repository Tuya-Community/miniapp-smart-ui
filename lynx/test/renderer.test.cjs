const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { sourceModule } = require('./helpers.cjs');
const sliderProps = sourceModule('lynx-runtime/ty-slider-props.ts');
const root = path.resolve(__dirname, '../..');
const sandbox = fs.mkdtempSync(path.join(root, 'lynx/.generated/ray-test-'));
function write(rel, value) {
  const file = path.join(sandbox, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}
write('build/lynx-ray.cjs', fs.readFileSync(path.join(root, 'build/lynx-ray.cjs')));
write('package.json', JSON.stringify({ version: '0.0.0-fixture' }));
write('lynx/dist/icon/index.js', 'export {};');
write('lynx/lib/icon/index.js', 'module.exports={};');
write('slider/package.json', JSON.stringify({ version: '0.3.10-beta.3', main: 'lib/index.js' }));
write('slider/lib/index.js', 'module.exports={};');
write(
  'wrapper/package.json',
  JSON.stringify({
    name: '@ray-js/smart-ui',
    version: '0.0.0-fixture',
    dependencies: { '@tuya-miniapp/smart-ui': '*' },
  })
);
for (const kind of ['es', 'lib']) {
  write(
    `wrapper/${kind}/index.js`,
    "export { Icon } from './icon';\nexport { Slider } from './slider';"
  );
  write(
    `wrapper/${kind}/index.d.ts`,
    "export { Icon } from './icon';\nexport { Slider } from './slider';"
  );
  for (const name of ['icon', 'slider']) {
    const symbol = name === 'icon' ? 'Icon' : 'Slider';
    write(
      `wrapper/${kind}/${name}/index.js`,
      `import Comp from '@tuya-miniapp/smart-ui/dist/${name}/index'; export const ${symbol}=Comp;`
    );
    write(`wrapper/${kind}/${name}/index.d.ts`, `export declare const ${symbol}: any;`);
  }
  write(`wrapper/${kind}/auto-import/index.js`, 'export default {};');
}
require(path.join(sandbox, 'build/lynx-ray.cjs')).main(path.join(sandbox, 'wrapper'), {
  sliderRoot: path.join(sandbox, 'slider'),
  outputRoot: path.join(sandbox, 'lynx/ray'),
});
after(() => fs.rmSync(sandbox, { recursive: true, force: true }));
function load(name) {
  const code = fs.readFileSync(path.join(sandbox, `lynx/ray/lib/${name}/index.js`), 'utf8');
  const web = function WebView() {},
    native = function Native() {};
  web.RangeSlider = function WebViewRange() {};
  native.RangeSlider = function NativeRange() {};
  const symbol = name === 'icon' ? 'Icon' : 'Slider';
  const original = { [symbol]: web },
    adapted = { [symbol]: native };
  const react = {
    isValidElement: value => !!value && typeof value === 'object' && 'type' in value,
    forwardRef: fn => fn,
    Children: { toArray: v => (v == null || v === false ? [] : [v]) },
    createElement: (type, props) => ({ type, props }),
  };
  const exports = {};
  vm.runInNewContext(code, {
    exports,
    require: request =>
      request === 'react' ? react : request.includes('ty-slider-props') ? sliderProps : request.includes('/webview/') ? original : adapted,
  });
  return { Component: exports[symbol], web, native };
}
test('React renderer defaults to WebView and preserves original props/events', () => {
  const { Component, web } = load('icon');
  const onClick = () => {};
  const output = Component({ name: 'Left', onClick });
  assert.equal(output.type, web);
  assert.equal(output.props.onClick, onClick);
  assert.equal('renderMode' in output.props, false);
  assert.equal('lynxHasDefaultSlot' in output.props, false);
});
test('only explicit Lynx mode selects the isolated component and supplies slot metadata', () => {
  const { Component, native } = load('icon');
  const output = Component({
    renderMode: 'lynx',
    name: 'Left',
    children: 'text',
    slot: { title: { type: 'text', props: { children: 'Title' } } },
  });
  assert.equal(output.type, native);
  assert.equal(output.props.lynxHasDefaultSlot, true);
  assert.equal(output.props.lynxSlotNames[0], 'title');
});
test('Slider and RangeSlider select matching renderer; single slider receives its explicit mode', () => {
  const { Component, web, native } = load('slider');
  assert.equal(Component({ value: 20 }).type, web);
  const output = Component({ renderMode: 'lynx', value: 20 });
  assert.equal(output.type, native);
  assert.equal(output.props.renderMode, 'lynx');
  assert.equal(Component.RangeSlider({ renderMode: 'lynx' }).type, native.RangeSlider);
  assert.equal(Component.RangeSlider({}).type, web.RangeSlider);
});

test('Lynx Slider resolves inherited radius inside the wrapper and leaves WebView unchanged', () => {
  const { Component } = load('slider');
  const onChange = () => {}, onAfterChange = () => {};
  const props = Object.freeze({ value: 13, min: 1, max: 24, step: 1, onChange, onAfterChange });
  const native = Component({ ...props, renderMode: 'lynx' });
  assert.equal(native.props.minTrackRadius, '4px');
  assert.equal(native.props.onChange, onChange);
  assert.equal(native.props.onAfterChange, onAfterChange);
  assert.equal(native.props.value, 13);
  assert.equal(native.props.min, 1);
  assert.equal(native.props.max, 24);
  assert.equal(native.props.step, 1);
  assert.equal(Component(props).props.minTrackRadius, undefined);
  assert.equal('minTrackRadius' in props, false);
});
test('Lynx Slider preserves custom track, explicit zero radius, bar overrides and event channels', () => {
  const { Component } = load('slider');
  const trackStyle = Object.freeze({ borderRadius: '18rpx', background: 'var(--track)' });
  const barStyle = Object.freeze({ borderRadius: '2px', background: 'var(--active)' });
  const channel = { emit() {} };
  const props = Object.freeze({ renderMode: 'lynx', minTrackRadius: 'inherit', trackStyle, barStyle, lynxEventChannel: channel, moveEventName: 'move' });
  const output = Component(props);
  assert.equal(output.props.minTrackRadius, '18rpx');
  assert.equal(output.props.trackStyle, trackStyle);
  assert.equal(output.props.barStyle, barStyle);
  assert.equal(output.props.lynxEventChannel, channel);
  assert.equal(output.props.moveEventName, 'move');
  assert.equal(props.minTrackRadius, 'inherit');
  assert.equal(Component({ ...props, minTrackRadius: 0 }).props.minTrackRadius, 0);
  assert.equal(Component({ renderMode: 'lynx', maxTrackRadius: '8px' }).props.minTrackRadius, '8px');
  assert.equal(Component({ renderMode: 'lynx', trackStyle: { borderRadius: 0 } }).props.minTrackRadius, 0);
  assert.equal(Component({ ...props, renderMode: 'webview' }).props.minTrackRadius, 'inherit');
});
test('RangeSlider keeps its array and MiniApp event contract without TySlider-only props', () => {
  const { Component, native } = load('slider');
  const value = [10, 30], onChange = () => {};
  const result = Component.RangeSlider({ renderMode: 'lynx', value, onChange, vertical: true });
  assert.equal(result.type, native.RangeSlider);
  assert.equal(result.props.value, value);
  assert.equal(result.props.onChange, onChange);
  assert.equal(result.props.vertical, true);
  assert.equal('minTrackRadius' in result.props, false);
});

test('Slider helper imports use matching ESM and CommonJS package formats', () => {
  const es = fs.readFileSync(path.join(sandbox, 'lynx/ray/es/slider/index.js'), 'utf8');
  const lib = fs.readFileSync(path.join(sandbox, 'lynx/ray/lib/slider/index.js'), 'utf8');
  assert.ok(es.includes('native-package/dist/lynx-runtime/ty-slider-props'));
  assert.ok(lib.includes('native-package/lib/lynx-runtime/ty-slider-props'));
});
