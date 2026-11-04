const { test } = require('node:test');
const assert = require('node:assert/strict');
const { sourceModule, model } = require('./helpers.cjs');
const decode = uri => decodeURIComponent(uri.split(',').slice(1).join(','));

test('Image bitmap tint uses standard masks, preserves signed URLs and follows fit', () => {
  const src = 'https://example.com/icon.png?signature=a+b%2Fc&v=1';
  const visual = model.imageVisual(src, 'white', 'contain');
  assert.equal(visual.svg, '');
  assert.ok(visual.mask.includes(`mask-image:url("${src}")`));
  assert.ok(visual.mask.includes('mask-size:contain;mask-position:center;mask-repeat:no-repeat;'));
  assert.ok(visual.mask.includes('background-color:white;'));
  assert.ok(model.imageVisual(src, 'black', 'fill').mask.includes('mask-size:100% 100%'));
  assert.equal(model.imageVisual(src, '').mask, '');
  assert.equal(model.imageVisual('', 'red').mask, '');
  assert.ok(model.imageVisual('a"b\\c.png', 'red').mask.includes('a\\"b\\\\c.png'));
});
test('Image never masks SVG; inline monochrome SVG changes paint and multicolor is preserved', () => {
  const mono = model.svgUri('<svg><path fill="#000" d="M0 0"/></svg>');
  assert.equal(model.imageVisual(mono, '').svg, '');
  const visual = model.imageVisual(mono, '#fff');
  assert.equal(visual.mask, '');
  assert.match(visual.svg, /fill="#fff"/);
  const multi = '<svg><path fill="#f00"/><path fill="#00f"/></svg>';
  const colored = model.imageVisual(model.svgUri(multi), '#fff').svg;
  assert.match(colored, /fill="#f00"/);
  assert.match(colored, /fill="#00f"/);
  for (const src of ['https://example.com/icon.svg?v=1', 'data:image/svg+xml;base64,PHN2Zy8+']) {
    assert.equal(model.imageVisual(src, 'red').mask, '');
    assert.equal(model.imageVisual(src, 'red').svg, '');
  }
});

test('slider quantization: nonzero minimum, fractional step, clamp, zero range', () => {
  assert.equal(model.snap(12.31, 10, 20, 0.2), 12.4);
  assert.equal(model.snap(-100, 10, 20, 2), 10);
  assert.equal(model.snap(200, 10, 20, 2), 20);
  assert.equal(model.snap(20, 10, 10, 1), 10);
  assert.equal(model.snap(0.3, 0, 1, 0.1), 0.3);
});
test('touch coordinates preserve zero and identifier; page/client spaces are explicit', () => {
  const event = {
    touches: [
      { identifier: 1, clientX: 0 },
      { identifier: 2, clientX: 80 },
    ],
  };
  assert.equal(model.point(event, 'x', 1).value, 0);
  assert.equal(model.point(event, 'x', 2).value, 80);
  assert.equal(model.point(event, 'x', 9), null);
  assert.equal(model.point({ changedTouches: [{ pageY: 13 }] }, 'y').space, 'page');
});
test('picker: disabled item, clamped end, loop, empty and all disabled', () => {
  const data = ['A', { text: 'B', disabled: true }, 'C'];
  assert.equal(model.selectIndex(data, 1, false), 2);
  assert.equal(model.selectIndex(data, 99, false), 2);
  assert.equal(model.selectIndex(data, -1, true), 2);
  assert.equal(model.selectIndex([], 0, true), -1);
  assert.equal(model.selectIndex([{ disabled: true }], 0, false), -1);
});
test('picker text resolves light/dark and selected tokens to concrete colors', () => {
  const light = { '--app-B6-N1': 'rgba(0, 0, 0, 0.90)' };
  const dark = { '--app-B6-N1': 'rgba(255, 255, 255, 0.90)' };
  assert.equal(model.pickerTextColor({}, light, false), light['--app-B6-N1']);
  assert.equal(model.pickerTextColor({}, dark, true), dark['--app-B6-N1']);
  assert.equal(model.pickerTextColor({}, {}, false), '#000000');
  assert.equal(
    model.pickerTextColor(
      {},
      {
        ...light,
        '--picker-option-text-color': '#555555',
        '--picker-option-selected-text-color': '#00aa00',
      },
      true
    ),
    '#00aa00'
  );
});
test('picker preserves explicit font/active style priority and transparent colors', () => {
  const data = {
    fontStyle: 'font-size:18px;color:#111111;color:var(--custom)',
    activeStyle: 'color:#222222 !important;font-weight:700',
  };
  assert.equal(model.pickerTextColor(data, { '--custom': '#123456' }, false), '#123456');
  assert.equal(model.pickerTextColor(data, { '--custom': '#123456' }, true), '#222222');
  assert.equal(model.pickerTextColor({ fontStyle: 'color:transparent' }, {}, false), 'transparent');
});
test('picker resolves row and text weight without passing nested var() to native fonts', () => {
  assert.equal(model.pickerTextWeight({}, {}, false), '500');
  assert.equal(model.pickerTextWeight({}, {}, true), '700');
  assert.equal(model.pickerTextWeight({}, { '--font-weight-bold': '600' }, false), '600');
  const data = { fontStyle: 'font-weight:400', activeStyle: 'font-weight:900 !important' };
  assert.equal(model.pickerTextWeight(data, {}, false), '400');
  assert.equal(model.pickerTextWeight(data, {}, true), '900');
});
test('datetime picker uses faded half-pixel edges, generic picker keeps its solid token', () => {
  assert.equal(model.pickerEdges({}, false).image, 'none');
  assert.equal(model.pickerEdges({ '--hairline-color': '#123456' }, false).color, '#123456');
  const light = model.pickerEdges({}, true);
  assert.equal(light.color, 'transparent');
  assert.match(light.image, /rgba\(0,0,0,0\.3\)/);
  assert.match(
    model.pickerEdges({ '--app-B6-N1': 'rgba(255, 255, 255, 0.9)' }, true).image,
    /rgba\(255,255,255,0\.3\)/
  );
  assert.equal(
    model.pickerEdges({ '--hairline-border-image-color': 'linear-gradient(red,blue)' }, true).image,
    'linear-gradient(red,blue)'
  );
});
test('picker uses visible real text and bounded virtualization for 100000 items', () => {
  const options = Array.from({ length: 100000 }, (_, i) => ({ label: String(i) }));
  const rows = model.pickerRows({
    options,
    valueKey: 'label',
    itemHeight: 44,
    visibleItemCount: 5,
    animationIndex: 50000,
    currentIndex: 50000,
  });
  assert.ok(rows.length <= 9);
  const selected = rows.find(r => r.selected);
  assert.equal(selected.text, '50000');
  assert.equal(selected.top, 88);
});
test('nested CSS theme variables resolve without corrupting SVG multicolors', () => {
  assert.equal(model.resolveColor('var(--a, var(--b, #fff))', { '--b': '#123456' }), '#123456');
  const uri = model.svgUri(
    '<svg fill="none"><path fill="currentColor"/><path fill="#ff0000"/></svg>'
  );
  const result = decode(model.iconSource(uri, '#00ff00'));
  assert.match(result, /fill="none"/);
  assert.match(result, /fill="#00ff00"/);
  assert.match(result, /fill="#ff0000"/);
});
test('SVG path and default-fill icons retain explicit aspect ratio and color', () => {
  assert.match(decode(model.iconSource('M0 0 L10 10 Z', '#abc')), /viewBox="0 0 1024 1024"/);
  assert.match(
    decode(model.iconSource(model.svgUri('<svg><path d="M0 0"/></svg>'), '#abc')),
    /<svg fill="#abc">/
  );
  assert.equal(
    model.iconSource('https://example.com/icon.png', 'red'),
    'https://example.com/icon.png'
  );
});
test('circle handles 0/100%, angle/angle2 and SVG gradients with round caps', () => {
  const data = {
    trackWidth: 10,
    trackColor: '#333',
    fillColor: '#fff',
    maskColor: 'transparent',
    mode: 'basic',
    percent: 0,
    round: true,
    angleOffset: -1,
  };
  assert.equal((decode(model.circleSvg(data)).match(/<path/g) || []).length, 1);
  assert.equal(
    (decode(model.circleSvg({ ...data, percent: 100 })).match(/<path/g) || []).length,
    2
  );
  const angle = decode(
    model.circleSvg({
      ...data,
      mode: 'angle2',
      percent: 50,
      fillColorStops: { '0%': '#000', '100%': '#fff' },
    })
  );
  assert.match(angle, /linearGradient/);
  assert.match(angle, /stroke-linecap="round"/);
  assert.doesNotMatch(angle, /NaN/);
});
test('native layer locks are reference counted across nested overlays and teardown', () => {
  const calls = [];
  const layer = sourceModule(
    'lynx-runtime/layers.ts',
    {},
    { ty: { nativeDisabled: v => calls.push(v) } }
  );
  const one = {},
    two = {};
  layer.holdNative(one);
  layer.holdNative(one);
  layer.holdNative(two);
  layer.releaseNative(one);
  assert.equal(layer.nativeHolderCount(), 1);
  assert.deepEqual(calls, [true]);
  layer.releaseNative(two);
  layer.releaseNative(two);
  assert.deepEqual(calls, [true, false]);
});

test('circle trackWidth stays in pixels when size changes', () => {
  const svg = decode(
    model.circleSvg({
      size: '200px',
      trackWidth: 10,
      trackColor: '#000',
      fillColor: '#fff',
      percent: 50,
      mode: 'basic',
    })
  );
  assert.match(svg, /viewBox="0 0 200 200"/);
  assert.match(svg, /stroke-width="10"/);
  assert.match(svg, /A95 95/);
});

test('slider thumb formatter preserves reverse/scale/offset order and HSL conversion', () => {
  const opts = {
    min: 10,
    max: 110,
    thumbStyleRenderValueReverse: true,
    thumbStyleRenderValueScale: 2,
    thumbStyleRenderValueStart: 3,
  };
  assert.equal(model.thumbPattern('value', 20, opts), '203');
  assert.equal(model.nativeHsl('hsl(0,100%,50%)'), 'rgb(255,0,0)');
  assert.equal(model.nativeHsl('hsla(120,100%,50%,0.5)'), 'rgba(0,255,0,0.5)');
});
