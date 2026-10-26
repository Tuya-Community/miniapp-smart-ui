const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const vm = require('vm');
const ts = require('typescript');
function setup(beforeClose) {
  let options;
  const modules = {
    '@tuya-miniapp/icons/dist/svg/Warning': {default: ''},
    '../common/component': {SmartComponent: value => {options = value;}},
    '../mixins/button': {button: {}},
    '../common/appLog': {default: {info() {}}},
    '../common/utils': {getCurrentPage() {}, toPromise: value => Promise.resolve(value)},
    './dialog': {contextRef: {value: {}}, queueRef: {value: []}},
  };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(__dirname+'/packages/dialog/index.ts','utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText, {
    exports: {}, require: name => modules[name], wx: {nextTick: fn => fn()}, console: {warn() {}, error() {}},
  });
  const c = {data: {...options.data, show:true, beforeClose, autoClose:true}, events: [], ...options.methods,
    setData(values) {for(const [key,value] of Object.entries(values)) {if(key.startsWith('loading.')) this.data.loading[key.slice(8)]=value; else this.data[key]=value;}},
    $emit(name,detail) {this.events.push({name,detail});},
  };
  return {c,options};
}
const flush = () => new Promise(resolve => setImmediate(resolve));
test('Dialog ignores an old beforeClose result after being hidden and reopened', async () => {
  let resolve; const {c,options}=setup(()=>new Promise(r=>{resolve=r;}));
  c.handleAction('confirm'); c.data.show=false; options.props.show.observer.call(c,false);
  c.data.show=true; c.onBeforeEnter(); resolve(true); await flush();
  assert.equal(c.data.show,true); assert.equal(c.events.some(e=>e.name==='close'),false);
});
test('Dialog does not repeat a pending asynchronous confirm action', async () => {
  let resolve,calls=0; const {c}=setup(()=>{calls++;return new Promise(r=>{resolve=r;});});
  c.handleAction('confirm'); c.handleAction('confirm'); assert.equal(calls,1);
  resolve(false); await flush(); c.handleAction('confirm'); assert.equal(calls,2); resolve(false); await flush();
});
test('Dialog restores controls if beforeClose throws', () => {
  const {c}=setup(()=>{throw new Error('validation unavailable');});
  assert.doesNotThrow(()=>c.handleAction('confirm')); assert.equal(c.data.loading.confirm,false); assert.equal(c.data.show,true);
});
test('Dialog does not close or emit after destruction while beforeClose is pending', async () => {
  let resolve; const {c,options}=setup(()=>new Promise(r=>{resolve=r;}));
  c.handleAction('confirm'); options.destroyed.call(c); resolve(true); await flush();
  assert.equal(c.events.some(e=>e.name==='close'),false);
});
test('Dialog restores controls when beforeClose rejects', async () => {
  const {c}=setup(()=>Promise.reject(new Error('validation failed')));
  c.handleAction('confirm'); await flush();
  assert.equal(c.data.loading.confirm,false); assert.equal(c.data.show,true);
  assert.equal(c.events.some(e=>e.name==='close'),false);
});
