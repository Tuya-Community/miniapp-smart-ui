const { test } = require('node:test');
const assert = require('node:assert/strict');
const { sourceModule, model } = require('./helpers.cjs');
const normal = sourceModule('lynx-runtime/normal-slider.ts', {
  './model': model,
  '../common/utils': {
    getRect: () => Promise.resolve({ left: 0, top: 0, width: 100, height: 100 }),
  },
});
function component(options, data = {}) {
  const instance = {
    data,
    events: [],
    setData(value) {
      Object.assign(this.data, value);
    },
    $emit(...event) {
      this.events.push(event);
    },
  };
  for (const [name, fn] of Object.entries(options.methods || {}))
    instance[name] = fn.bind(instance);
  return instance;
}
const event = (x, y = 0, id = 1) => ({
  touches: [{ identifier: id, clientX: x, clientY: y }],
  currentTarget: { dataset: {} },
});
function adapters(getRect = () => Promise.resolve({ left: 0, top: 0, width: 100, height: 100 })) {
  return sourceModule(
    'lynx-runtime/adapters.ts',
    {
      './model': model,
      './normal-slider': normal,
      './icons': { icons: {} },
      './palette': { themeVars: () => ({}), paletteConsumer() {}, configProvider() {} },
      '../common/utils': { getRect },
    },
    { wx: { onThemeChange() {}, offThemeChange() {} } }
  );
}
function slider(getRect) {
  const options = adapters(getRect).adapt('slider', {
    props: {},
    methods: {
      calcOffset() {
        return '0%';
      },
      getScope() {
        return this.data.max - this.data.min;
      },
      getRange() {
        return this.getScope();
      },
      isRange(value) {
        return Array.isArray(value);
      },
      updateValue(value, end, drag) {
        this.value = Array.isArray(value) ? value.map(v => this.format(v)) : this.format(value);
        if (end) this.$emit('change', this.value);
        if (drag) this.$emit('drag', { value: this.value });
      },
    },
  });
  const comp = component(options, { min: 10, max: 110, step: 5, disabled: false, vertical: false });
  comp.value = 10;
  return { comp, options };
}
test('range slider buffers movement until asynchronous geometry arrives', async () => {
  let resolve;
  const { comp } = slider(
    () =>
      new Promise(r => {
        resolve = r;
      })
  );
  comp.onTouchStart(event(0));
  comp.onTouchMove(event(35));
  assert.equal(comp.value, 10);
  resolve({ left: 0, top: 0, width: 100, height: 100 });
  await Promise.resolve();
  assert.equal(comp.value, 45);
  comp.onTouchEnd({ changedTouches: [{ identifier: 1, clientX: 40 }] });
  assert.equal(comp.events.find(e => e[0] === 'change')[1], 50);
  assert.equal(comp.events.filter(e => e[0] === 'drag-end').length, 1);
});
test('slider ignores secondary-finger end and late geometry after cancellation', async () => {
  let resolve;
  const { comp } = slider(
    () =>
      new Promise(r => {
        resolve = r;
      })
  );
  comp.onTouchStart(event(0));
  comp.onTouchMove(event(30));
  comp.onTouchEnd({ changedTouches: [{ identifier: 2, clientX: 40 }] });
  assert.ok(comp._lynxDrag);
  comp.onLynxCancel();
  resolve({ width: 100, height: 100 });
  await Promise.resolve();
  assert.equal(comp.value, 10);
  assert.equal(comp.events.filter(e => e[0] === 'change').length, 0);
});
test('slider has no ghost updates after detach and no NaN for zero-width track', async () => {
  const { comp, options } = slider(() => Promise.resolve({ left: 0, width: 0, height: 0 }));
  comp.onTouchStart(event(0));
  comp.onTouchMove(event(30));
  options.destroyed.call(comp);
  await Promise.resolve();
  assert.equal(comp.value, 10);
  assert.equal(comp.events.filter(e => e[0] === 'change').length, 0);
});
test('picker preserves disabled options and change payload on drag and cancel', () => {
  const options = adapters().adapt('picker-column', {
    props: {},
    methods: {
      updateCurrentIndex() {},
      updateVisibleOptions() {},
      setIndex() {},
      animationIndexChange() {},
      activeIndexChange() {},
      animationStart() {
        this.$emit('animation-start');
      },
      animationEnd() {
        this.$emit('animation-end');
      },
      vibrateShort() {},
    },
  });
  const comp = component(options, {
    options: ['A', { text: 'B', disabled: true }, 'C'],
    itemHeight: 44,
    visibleItemCount: 5,
    valueKey: 'text',
    currentIndex: 0,
    animationIndex: 0,
    loop: false,
  });
  comp.onLynxStart(event(0, 100));
  comp.onLynxMove(event(0, 55));
  comp.onLynxCancel();
  assert.equal(comp.data.currentIndex, 0);
  assert.equal(comp.data.lynxDragging, false, "cancellation must leave no dragging state");
  assert.equal(comp.events.filter(e => e[0] === 'change').length, 0);
  comp.onLynxTap({ currentTarget: { dataset: { virtual: 1 } } });
  assert.equal(comp.data.currentIndex, 2);
  assert.equal(comp.events.find(e => e[0] === 'change')[1], 2);
});
test('picker commits its drawing layer after native layout and ignores a detached callback', async () => {
  let complete;
  const options = adapters(
    () =>
      new Promise(resolve => {
        complete = resolve;
      })
  ).adapt('picker', {
    props: {},
    methods: {},
  });
  const comp = component(options, { ...options.data });
  options.mounted.call(comp);
  assert.equal(comp.data.lynxLayerReady, false);
  complete({ height: 198, width: 300 });
  await Promise.resolve();
  assert.equal(comp.data.lynxLayerReady, true);
  comp.data.lynxLayerReady = false;
  options.mounted.call(comp);
  options.destroyed.call(comp);
  complete({ height: 198, width: 300 });
  await Promise.resolve();
  assert.equal(comp.data.lynxLayerReady, false);
});
test('normal slider preserves change/end contracts, reverse and fractional steps', async () => {
  const options = { props: {}, methods: {} };
  normal.normalSlider(options);
  const comp = component(options, {
    min: 10,
    max: 20,
    value: 10,
    step: 0.2,
    reverse: true,
    enableTouch: true,
  });
  comp.refreshNormal();
  comp.onNormalStart(event(50));
  await Promise.resolve();
  assert.equal(comp.data.normalValue, 15);
  comp.onNormalEnd({ changedTouches: [{ identifier: 1, clientX: 20 }] });
  assert.equal(comp.events.find(e => e[0] === 'end')[1].value, 18);
  comp.onNormalStart(event(50));
  await Promise.resolve();
  comp.onNormalCancel();
  assert.equal(comp.events.at(-1)[0], 'cancel');
  assert.equal(comp.data.normalValue, 18);
});
test('page hide cancels active gestures and invalidates pending measurements', () => {
  const { comp, options } = slider();
  comp.onTouchStart(event(0));
  options.pageLifetimes.hide.call(comp);
  assert.equal(comp._lynxDrag, null);
  assert.ok(comp._lynxGeneration > 1);
});
function fakeTimers() {
  let id = 0;
  const jobs = new Map();
  return {
    setTimeout: fn => {
      jobs.set(++id, fn);
      return id;
    },
    clearTimeout: key => jobs.delete(key),
    flush() {
      for (let count = 0; jobs.size && count < 20; count++) {
        const tasks = [...jobs];
        jobs.clear();
        tasks.forEach(([, fn]) => fn());
      }
    },
    get size() {
      return jobs.size;
    },
  };
}
test('initial hidden transition never starts a leave animation or mounts toast content', () => {
  const clock = fakeTimers();
  const transition = sourceModule('mixins/transition.ts', {
    '../lynx-runtime/layers': { holdNative() {}, releaseNative() {} },
  }, { Behavior: value => value, ...clock });
  const behavior = transition.transition(true);
  const comp = component(behavior, { ...behavior.data, show: false, name: 'fade', duration: 300 });
  comp.observeShow(false, undefined);
  assert.equal(comp.data.inited, false);
  assert.equal(comp.data.display, false);
  assert.equal(clock.size, 0);
  assert.equal(comp.events.length, 0);
  comp.observeShow(true, false);
  clock.flush();
  assert.equal(comp.data.display, true);
  comp.observeShow(false, true);
  clock.flush();
  assert.equal(comp.data.display, false);
});
test('rapid popup open/close releases mask and emits only the final completion', () => {
  const locks = [];
  const clock = fakeTimers();
  const transition = sourceModule(
    'mixins/transition.ts',
    {
      '../lynx-runtime/layers': {
        holdNative: () => locks.push(true),
        releaseNative: () => locks.push(false),
      },
    },
    { Behavior: value => value, ...clock }
  );
  const behavior = transition.transition(false);
  const comp = component(behavior, {
    show: false,
    name: 'fade',
    duration: 300,
    nativeDisabled: true,
  });
  comp.observeShow(true, false);
  comp.observeShow(false, true);
  clock.flush();
  assert.equal(comp.data.display, false);
  assert.equal(comp.data.isShowed, false);
  assert.equal(comp.data.animating, false);
  assert.equal(comp.events.filter(e => e[0] === 'after-enter').length, 0);
  assert.equal(comp.events.filter(e => e[0] === 'after-leave').length, 1);
  assert.equal(locks.at(-1), false);
});
test('popup detach cancels all transition timers and native locks', () => {
  const clock = fakeTimers();
  let releases = 0;
  const transition = sourceModule(
    'mixins/transition.ts',
    {
      '../lynx-runtime/layers': {
        holdNative() {},
        releaseNative() {
          releases++;
        },
      },
    },
    { Behavior: value => value, ...clock }
  );
  const behavior = transition.transition(false);
  const comp = component(behavior, {
    show: true,
    name: 'fade',
    duration: 300,
    nativeDisabled: true,
  });
  comp.observeShow(true, false);
  behavior.detached.call(comp);
  clock.flush();
  assert.equal(clock.size, 0);
  assert.equal(releases, 1);
  assert.equal(comp.events.filter(e => e[0].startsWith('after')).length, 0);
});

test('page hide cancels overlay timers; background show changes do not acquire native locks', () => {
  const clock = fakeTimers();
  const locks = [];
  const transition = sourceModule(
    'mixins/transition.ts',
    {
      '../lynx-runtime/layers': {
        holdNative: () => locks.push(true),
        releaseNative: () => locks.push(false),
      },
    },
    { Behavior: value => value, ...clock }
  );
  const behavior = transition.transition(false);
  const comp = component(behavior, {
    show: true,
    name: 'fade',
    duration: 300,
    nativeDisabled: true,
  });
  comp.observeShow(true, false);
  behavior.pageLifetimes.hide.call(comp);
  clock.flush();
  assert.equal(comp.data.animating, false);
  assert.equal(clock.size, 0);
  assert.equal(comp.events.filter(e => e[0].startsWith('after')).length, 0);
  comp.observeShow(true, false);
  behavior.properties.nativeDisabled.observer.call(comp, true);
  assert.equal(locks.at(-1), false);
  behavior.pageLifetimes.show.call(comp);
  assert.equal(locks.at(-1), true);
});
