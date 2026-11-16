const { test } = require('node:test');
const assert = require('node:assert/strict');
const { sourceModule, model } = require('./helpers.cjs');

function image(tintColor, providers = []) {
  let listener;
  const vars = {};
  const host = {
    getThemeInfo: () => vars,
    onThemeChange: callback => {
      listener = callback;
    },
    offThemeChange: callback => {
      assert.equal(callback, listener);
      listener = null;
    },
  };
  const palette = sourceModule(
    'lynx-runtime/palette.ts',
    { './palettes': { palettes: {} } },
    {
      ty: host,
      Behavior: value => value,
    }
  );
  const { adapt } = sourceModule(
    'lynx-runtime/adapters.ts',
    {
      './model': model,
      './normal-slider': {},
      './icons': {},
      './palette': palette,
      '../common/utils': {},
    },
    { ty: host }
  );
  const options = adapt('image', {
    props: {
      src: {
        observer() {
          this.data.loading = true;
        },
      },
      tintColor: String,
    },
    methods: {},
  });
  const instance = {
    data: { src: 'https://example.com/icon.png?signature=a+b%2Fc', tintColor, loading: false },
    getRelationNodes: () => providers,
    setData: values => Object.assign(instance.data, values),
  };
  Object.assign(instance, options.methods);
  options.created.call(instance);
  return { instance, options, vars, notify: () => listener(), hasListener: () => !!listener };
}

test('native tint resolves nested theme variables, refreshes on theme change and unregisters', () => {
  const { instance, options, vars, notify, hasListener } = image(
    'var(--icon, var(--missing, black))'
  );
  assert.equal(instance.data.lynxImageTint, 'black');
  vars['--icon'] = 'white';
  notify();
  assert.equal(instance.data.lynxImageTint, 'white');
  assert.equal(instance.data.src, 'https://example.com/icon.png?signature=a+b%2Fc');
  options.destroyed.call(instance);
  assert.equal(hasListener(), false);
});

test('ConfigProvider custom colors and bitmap/SVG/no-tint transitions never retain old tint', () => {
  const provider = { data: { themeVars: { customTint: '#123456' } } };
  const { instance, options } = image('var(--custom-tint)', [provider]);
  assert.equal(instance.data.lynxImageTint, '#123456');
  instance.data.src = model.svgUri('<svg><path fill="#000"/></svg>');
  options.props.src.observer.call(instance);
  assert.equal(instance.data.loading, true);
  assert.equal(instance.data.lynxImageTint, '');
  assert.match(instance.data.lynxImageSvg, /fill="#123456"/);
  instance.data.src = 'other.png';
  options.props.src.observer.call(instance);
  assert.equal(instance.data.lynxImageTint, '#123456');
  assert.equal(instance.data.lynxImageSvg, '');
  instance.data.tintColor = '';
  options.props.tintColor.observer.call(instance);
  assert.equal(instance.data.lynxImageTint, '');
  assert.equal(instance.data.lynxImageSvg, '');
  options.destroyed.call(instance);
});
