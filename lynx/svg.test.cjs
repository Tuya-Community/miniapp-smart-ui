const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const { JSDOM } = require('jsdom');
const parser = new (new JSDOM().window.DOMParser)();
const context = { module: { exports: {} }, getRegExp: (p, flags) => new RegExp(p, flags), decodeURIComponent };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'packages/icon/svg.wxs'), 'utf8'), context);
const { getSource } = context.module.exports;
function valid(source) {
  const document = parser.parseFromString(source, 'image/svg+xml');
  assert.equal(document.querySelector('parsererror'), null);
  assert.equal(document.documentElement.tagName, 'svg');
}
test('encoded SVG normalizes preamble and preserves definitions/multicolor while resolving currentColor', () => {
  const name = 'data:image/svg+xml,' + encodeURIComponent('<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><linearGradient id="g"/></defs><path fill="currentColor"/><path fill="none"/><path fill="red"/></svg>');
  const source = getSource({ name, color: '#123456' }); valid(source);
  assert.match(source, /fill="#123456"/); assert.match(source, /fill="none"/); assert.match(source, /fill="red"/); assert.match(source, /linearGradient/);
});
test('base64 UTF-8 SVG and raw paths are valid', () => {
  valid(getSource({ name: 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><title>图标</title></svg>').toString('base64') }));
  const source = getSource({ name: 'M0 0 L12 12', customStyle: '--icon-color: #ff6600;' });
  valid(source); assert.match(source, /#ff6600/);
});
test('malformed data URI does not reach the native renderer as invalid XML', () => {
  assert.equal(getSource({ name: 'data:image/svg+xml,%xx' }), '');
  assert.equal(getSource({ name: 'data:image/svg+xml,' + encodeURIComponent('not SVG') }), '');
});
test('catalog vectors produce valid XML (syntax coverage, not native visual coverage)', () => {
  const dir = path.dirname(require.resolve('@tuya-miniapp/icons/dist/svg/Warning'));
  let count = 0;
  for (const name of fs.readdirSync(dir).filter(n => n.endsWith('.js'))) {
    const code = fs.readFileSync(path.join(dir, name), 'utf8');
    if (!code.startsWith('export default ')) continue;
    const value = vm.runInNewContext(code.replace('export default ', ''));
    if (typeof value !== 'string' || !value.startsWith('data:image/svg+xml')) continue;
    valid(getSource({ name: value, color: '#123456' })); count++;
  }
  assert.ok(count > 100);
});
test('host theme values and nested CSS fallbacks resolve to a concrete SVG color',()=>{
 const name='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg"><path fill="currentColor"/></svg>');
 assert.match(getSource({name,color:'var(--app-M1)',themeColors:{'--app-M1':'#ee6633'}}),/fill="#ee6633"/);
 assert.match(getSource({name,color:'var(--missing, var(--fallback, #123456))'}),/fill="#123456"/);
});
test('catalog SVG paths without fill inherit the requested Icon color',()=>{
 const code=fs.readFileSync(require.resolve('@tuya-miniapp/icons/dist/svg/Loading'),'utf8');
 const name=vm.runInNewContext(code.replace('export default ',''));
 const source=getSource({name,color:'#dcdee0'});valid(source);
 const doc=parser.parseFromString(source,'image/svg+xml');
 assert.equal(doc.documentElement.getAttribute('fill'),'#dcdee0');
 const image=getSource({name,color:'',preserveDefaultFill:true});
 assert.equal(parser.parseFromString(image,'image/svg+xml').documentElement.hasAttribute('fill'),false);
});
