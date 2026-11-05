const path = require('path');
const fs = require('fs');
const assert = require('assert');
const simulate = require('miniprogram-simulate');
const root = path.resolve(__dirname, '../lib');
const created = [];
const variants = {
  cell: 'title="{{props.title}}" value="{{props.value}}" label="{{props.label}}" lynx-has-default-slot="{{false}}" lynx-slot-names="{{[]}}"',
  icon: 'name="{{props.name}}" size="{{props.size}}" color="{{props.color}}"',
  loading: 'type="{{props.type}}" size="{{props.size}}" color="{{props.color}}"',
  'picker-column':
    'options="{{props.options}}" value-key="{{props.valueKey}}" item-height="44" visible-item-count="5" active-index="0"',
  picker: 'columns="{{props.columns}}" value-key="{{props.valueKey}}"',
  image:
    'src="{{props.src}}" width="{{props.width}}" height="{{props.height}}" tint-color="{{props.tintColor}}"',
  calendar:
    'min-date="{{props.minDate}}" max-date="{{props.maxDate}}" default-date="{{props.defaultDate}}" show-title="{{false}}"',
  circle: 'percent="{{props.percent}}" size="{{props.size}}"',
  popup: 'show="{{props.show}}" duration="{{props.duration}}"',
  toast: 'show="{{props.show}}" message="{{props.message}}"',
};
const holderDir = path.join(root, '__lynx-test-holder');
fs.mkdirSync(holderDir, { recursive: true });
fs.writeFileSync(
  path.join(holderDir, 'index.json'),
  JSON.stringify({
    component: true,
    usingComponents: Object.fromEntries(
      Object.keys(variants).map(name => ['smart-' + name, '/' + name + '/index'])
    ),
  })
);
fs.writeFileSync(
  path.join(holderDir, 'index.js'),
  'Component({properties:{kind:String,props:Object}});'
);
fs.writeFileSync(
  path.join(holderDir, 'index.wxml'),
  Object.entries(variants)
    .map(([name, attrs]) => `<smart-${name} wx:if="{{kind === '${name}'}}" id="target" ${attrs}/>`)
    .join('')
);
const svgStub = simulate.load({ properties: { source: String }, template: '<view />' });
const holder = simulate.load(path.join(holderDir, 'index'), 'smart-ui-test-holder', {
  rootPath: root,
  usingComponents: { 'svg-render': svgStub },
});
afterAll(() => fs.rmSync(holderDir, { recursive: true, force: true }));
function mount(name, props) {
  const parent = simulate.render(holder, { kind: name, props });
  parent.attach(document.createElement('host'));
  created.push(parent);
  return parent.querySelector('#target');
}
let errors;
beforeEach(() => {
  errors = jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  while (created.length) created.pop().detach();
  const { calls } = errors.mock;
  errors.mockRestore();
  assert.strictEqual(calls.length, 0, JSON.stringify(calls));
});

test('Lynx Cell renders zero and label in real text nodes', async () => {
  const comp = mount('cell', {
    title: 'Temperature',
    value: 0,
    label: 'Current',
    lynxHasDefaultSlot: false,
    lynxSlotNames: [],
  });
  await simulate.sleep(10);
  expect(comp.dom.textContent).toContain('Temperature');
  expect(comp.dom.textContent).toContain('Current');
  expect(comp.dom.textContent).toContain('0');
  expect(comp.querySelectorAll('.smart-lynx-text').length).toBeGreaterThan(0);
});
test('Lynx Icon has an explicitly sized image; changing color updates the SVG', async () => {
  const comp = mount('icon', { name: 'Left', size: 24, color: '#ff0000' });
  await simulate.sleep(10);
  expect(comp.data.lynxIconSrc).toContain('data:image/svg+xml');
  expect(decodeURIComponent(comp.data.lynxIconSrc)).toContain('#ff0000');
  comp.setData({ color: '#00ff00' });
  await simulate.sleep(10);
  expect(decodeURIComponent(comp.data.lynxIconSrc)).toContain('#00ff00');
  expect(comp.querySelectorAll('.smart-icon__image').length).toBe(1);
});
test('Loading spinner uses eight real spokes and no mask rendering', async () => {
  const comp = mount('loading', { type: 'spinner', size: '24', color: '#ff0000' });
  await simulate.sleep(10);
  expect(comp.querySelectorAll('.smart-loading__spoke').length).toBe(8);
  expect(comp.data.lynxLoadingColor).toBe('#ff0000');
});
test('Picker column displays option text and preserves get/set value API', async () => {
  const comp = mount('picker-column', {
    options: [{ label: 'One' }, { label: 'Two' }],
    valueKey: 'label',
    itemHeight: 44,
    visibleItemCount: 5,
    activeIndex: 0,
  });
  await simulate.sleep(10);
  expect(comp.dom.textContent).toContain('One');
  expect(comp.dom.textContent).toContain('Two');
  await comp.instance.setValue('Two');
  await simulate.sleep(10);
  expect(comp.instance.getValue().label).toBe('Two');
  expect(comp.data.currentIndex).toBe(1);
});
test('Picker parent preserves linked column APIs', async () => {
  const comp = mount('picker', {
    columns: [{ values: ['A', 'B'] }, { values: ['1', '2'] }],
    valueKey: 'text',
  });
  await simulate.sleep(60);
  expect(comp.instance.getValues()).toEqual(['A', '1']);
  await comp.instance.setIndexes([1, 1]);
  await simulate.sleep(20);
  expect(comp.instance.getValues()).toEqual(['B', '2']);
});
test('Image bitmap tint renders a mask, updates color, and preserves load/error API', async () => {
  const comp = mount('image', {
    src: 'https://example.com/icon.png',
    width: 24,
    height: 24,
    tintColor: '#ff0000',
  });
  await simulate.sleep(10);
  expect(comp.data.lynxImageTint).toBe('#ff0000');
  expect(comp.querySelectorAll('.smart-image__tint-color').length).toBe(1);
  expect(comp.data.lynxImageMask).toContain('mask-image:url("https://example.com/icon.png")');
  expect(comp.data.lynxImageMask).toContain('background-color:#ff0000;');
  comp.setData({ tintColor: 'white' });
  await simulate.sleep(10);
  expect(comp.data.lynxImageMask).toContain('background-color:white;');
  comp.instance.onLoad({ detail: { width: 24, height: 24 } });
  expect(comp.data.loading).toBe(false);
  comp.instance.onError({ detail: { errMsg: 'test' } });
  await simulate.sleep(10);
  expect(comp.data.error).toBe(true);
  expect(comp.data.loading).toBe(false);
  expect(comp.querySelectorAll('.smart-image__tint-color').length).toBe(0);
});
test('Image without tint displays original; SVG XML uses svg-render instead of mask', async () => {
  const plain = mount('image', { src: 'icon.png', width: 24, height: 24 });
  await simulate.sleep(10);
  expect(plain.querySelectorAll('.smart-image__tint-color').length).toBe(0);
  const svg = mount('image', {
    src: 'data:image/svg+xml,' + encodeURIComponent('<svg><path fill="#000"/></svg>'),
    tintColor: 'white',
    width: 24,
    height: 24,
  });
  await simulate.sleep(10);
  expect(svg.data.lynxImageMask).toBe('');
  expect(svg.data.lynxImageSvg).toContain('fill="white"');
  expect(svg.querySelectorAll('.smart-image__tint-color').length).toBe(1);
});
test('Circle changes are reflected by SVG without creating an RJS canvas', async () => {
  const comp = mount('circle', { percent: 25, size: '100px' });
  await simulate.sleep(10);
  const original = comp.data.lynxCircleSrc;
  comp.setData({ percent: 75 });
  await simulate.sleep(10);
  expect(comp.data.lynxCircleSrc).not.toBe(original);
  expect(comp.querySelectorAll('canvas').length).toBe(0);
});
test('Calendar renders dates and month title, and refreshes both when changing month', async () => {
  const comp = mount('calendar', {
    minDate: new Date(2026, 9, 28).getTime(),
    maxDate: new Date(2026, 10, 4).getTime(),
    defaultDate: new Date(2026, 9, 28).getTime(),
  });
  await simulate.sleep(30);
  expect(comp.dom.textContent).toContain('2026-10');
  expect(comp.querySelector('.month').querySelectorAll('.smart-calendar__day').length).toBe(31);
  comp.instance.onNext();
  await simulate.sleep(30);
  expect(comp.dom.textContent).toContain('2026-11');
  expect(comp.querySelector('.month').querySelectorAll('.smart-calendar__day').length).toBe(30);
  comp.instance.onNext();
  expect(comp.data.visibleIndex).toBe(1);
  comp.instance.onPrev();
  await simulate.sleep(30);
  expect(comp.dom.textContent).toContain('2026-10');
});
test('Popup mask is removed after controlled close', async () => {
  const comp = mount('popup', { show: true, duration: 0 });
  await simulate.sleep(50);
  expect(comp.data.display).toBe(true);
  comp.setData({ show: false });
  await simulate.sleep(50);
  expect(comp.data.display).toBe(false);
  expect(comp.data.isShowed).toBe(false);
});

test('initially hidden Toast does not flash an empty container', async () => {
  const comp = mount('toast', { show: false, message: '' });
  await simulate.sleep(10);
  expect(comp.dom.querySelector('.smart-toast')).toBeNull();
  comp.setData({ show: true, message: 'Saved' });
  await simulate.sleep(40);
  expect(comp.dom.textContent).toContain('Saved');
  comp.setData({ show: false });
  await simulate.sleep(360);
  expect(comp.dom.querySelector('.smart-toast')).toBeNull();
});
