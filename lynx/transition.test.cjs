const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const ts = require('typescript');

function harness() {
  const calls = [], cache = new Map(), timers = new Map(); let clock = 0, serial = 0;
  function load(relative) {
    if (relative === './ty') return { default: { nativeDisabled: v => calls.push(v) } };
    const filename = path.join(__dirname, 'packages', relative + '.ts');
    if (cache.has(filename)) return cache.get(filename);
    const exports = {}; cache.set(filename, exports);
    const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
    const requireModule = name => name === '../common/interaction-lock' ? load('common/interaction-lock')
      : name === '../common/validator' ? { isObj: v => v && typeof v === 'object' } : load(name);
    vm.runInNewContext(source, { exports, require: requireModule, Behavior: x => x,
      setTimeout: (fn, ms) => { const id = ++serial; timers.set(id, { fn, time: clock + ms }); return id; },
      clearTimeout: id => timers.delete(id), Set });
    return exports;
  }
  const behavior = load('mixins/transition').transition(false);
  const component = () => ({ data: { ...behavior.data, name: 'fade', duration: 100, nativeDisabled: true },
    events: [], ...behavior.methods,
    setData(values) { Object.assign(this.data, values); }, $emit(name) { this.events.push(name); } });
  function advance(ms) {
    const target = clock + ms;
    while (true) {
      const next = [...timers].sort((a, b) => a[1].time - b[1].time)[0];
      if (!next || next[1].time > target) break;
      clock = next[1].time; timers.delete(next[0]); next[1].fn();
    }
    clock = target;
  }
  return { calls, behavior, component, advance, timers };
}

test('nested layers retain the native interaction lock until the final close', () => {
  const h = harness(), outer = h.component(), inner = h.component();
  outer.enter(); inner.enter(); h.advance(150);
  assert.deepEqual(h.calls, [true]);
  inner.leave(); h.advance(150); assert.deepEqual(h.calls, [true]);
  outer.leave(); h.advance(150); assert.deepEqual(h.calls, [true, false]);
  assert.equal(outer.data.display, false); assert.equal(inner.data.display, false);
});
test('detach cancels callbacks and releases the lock during an unfinished transition', () => {
  const h = harness(), c = h.component(); c.enter();
  h.behavior.detached.call(c); const events = c.events.slice(); h.advance(1000);
  assert.deepEqual(c.events, events); assert.deepEqual(h.calls, [true, false]); assert.equal(h.timers.size, 0);
});
test('a rapid close then reopen cannot run stale after-leave or release the current lock', () => {
  const h = harness(), c = h.component(); c.enter(); h.advance(150);
  c.leave(); h.advance(40); c.enter(); h.advance(150);
  assert.equal(c.data.display, true); assert.equal(c.events.includes('after-leave'), false);
  assert.deepEqual(h.calls, [true]); h.behavior.detached.call(c); assert.deepEqual(h.calls, [true, false]);
});
