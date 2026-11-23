const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const { sourceModule, model } = require('./helpers.cjs');
const normal = sourceModule('lynx-runtime/normal-slider.ts', {
  './model': model,
  '../common/utils': { getRect: async () => ({}) },
});
function style(value) {
  if (Array.isArray(value))
    return value
      .filter(v => v != null)
      .map(style)
      .join(';');
  if (typeof value === 'object')
    return Object.entries(value)
      .filter(([, v]) => v != null && v !== '')
      .map(([k, v]) => `${k}:${v}`)
      .join(';');
  return value || '';
}
function popupCss(data) {
  const module = { exports: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../lib/popup/index.wxs'), 'utf8'), {
    module,
    require: name => {
      assert.equal(name, '../wxs/style.wxs');
      return style;
    },
  });
  return module.exports.popupStyle({
    position: 'bottom',
    status: 'enter',
    display: true,
    zIndex: 101,
    currentDuration: 300,
    ...data,
  });
}
function create(info, props = {}) {
  let system = info;
  const resize = new Set();
  const host = {
    getSystemInfoSync: () => system,
    onWindowResize: fn => resize.add(fn),
    offWindowResize: fn => resize.delete(fn),
  };
  const adapters = sourceModule(
    'lynx-runtime/adapters.ts',
    {
      './model': model,
      './normal-slider': normal,
      './icons': { icons: {} },
      './palette': { themeVars: () => ({}), paletteConsumer() {}, configProvider() {} },
      '../common/utils': { getRect: async () => ({}) },
    },
    { ty: host, wx: host }
  );
  const options = adapters.adapt('popup', {
    props: { safeAreaInsetBottom: Boolean, safeAreaInsetBottomMin: Number },
    data: {},
    methods: {},
  });
  const comp = {
    data: {
      ...options.data,
      show: true,
      safeAreaInsetBottom: true,
      safeAreaInsetBottomMin: 0,
      ...props,
    },
    setData(value) {
      Object.assign(this.data, value);
    },
  };
  for (const [key, fn] of Object.entries(options.methods)) comp[key] = fn.bind(comp);
  options.created?.call(comp);
  return {
    comp,
    options,
    resize,
    setInfo(value) {
      system = value;
    },
    update(value) {
      system = value;
      resize.forEach(fn => fn());
    },
  };
}
test('iOS bottom Popup keeps safe area plus base gap as concrete pixels', () => {
  const { comp } = create({
    screenHeight: 852,
    useableWindowHeight: 852,
    safeArea: { bottom: 818 },
  });
  assert.match(popupCss(comp.data), /margin-bottom:50px(?:;|$)/);
  assert.doesNotMatch(popupCss(comp.data), /max\(|env\(/);
  assert.match(
    popupCss({ ...comp.data, status: 'leave' }),
    /translate3d\(0, calc\(100% \+ 50px\), 0\)/
  );
});
test('Android excludes system navigation outside the usable viewport; explicit minimum wins', () => {
  const { comp } = create({
    screenHeight: 792,
    useableWindowHeight: 776,
    safeArea: { bottom: 776 },
  });
  assert.match(popupCss(comp.data), /margin-bottom:16px(?:;|$)/);
  const min = create(
    { screenHeight: 852, safeArea: { bottom: 818 } },
    { safeAreaInsetBottomMin: 80 }
  );
  assert.match(popupCss(min.comp.data), /margin-bottom:80px(?:;|$)/);
  assert.doesNotMatch(popupCss({ ...comp.data, safeAreaInsetBottom: false }), /margin-bottom/);
});
test('resize and inset property changes refresh the gap, unsubscribe on detach', () => {
  const x = create({ screenHeight: 852, safeArea: { bottom: 818 } });
  x.update({ screenHeight: 393, useableWindowHeight: 393, safeArea: { bottom: 372 } });
  assert.match(popupCss(x.comp.data), /margin-bottom:37px(?:;|$)/);
  x.setInfo({ screenHeight: 852, safeArea: { bottom: 818 } });
  x.options.props.safeAreaInsetBottom.observer.call(x.comp, true);
  assert.match(popupCss(x.comp.data), /margin-bottom:50px(?:;|$)/);
  assert.equal(x.resize.size, 1);
  x.options.destroyed?.call(x.comp);
  assert.equal(x.resize.size, 0);
});

test('built Popup actually activates the adapter and passes its inset to native style', () => {
  const code = fs.readFileSync(path.join(__dirname, '../lib/popup/index.js'), 'utf8');
  const template = fs.readFileSync(path.join(__dirname, '../lib/popup/popup.wxml'), 'utf8');
  assert.match(code, /, ['"]popup['"]\);/);
  assert.match(template, /safeAreaInsetBottomMin, safeAreaTabBar, lynxSafeBottomOffset/);
});

test('Popup leaves Behavior-owned show untouched so controlled reopening still runs transition', () => {
  const { options } = create({ screenHeight: 852, safeArea: { bottom: 818 } });
  assert.equal(Object.hasOwn(options.props, 'show'), false);
});

test('caller style keeps the final override and bottom anchor remains independent', () => {
  const { comp } = create({ screenHeight: 852, safeArea: { bottom: 818 } });
  const css = popupCss({ ...comp.data, customStyle: 'bottom:16px;margin-bottom:0px' });
  assert.match(css, /margin-bottom:50px/);
  assert.match(css, /bottom:16px;margin-bottom:0px$/);
});
