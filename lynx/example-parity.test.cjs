const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const ts=require('typescript');
const root=path.join(__dirname,'..');
const names=['icon','image','loading','switch','grid','popup','overlay','action-sheet','toast','picker','datetime-picker','calendar','dialog','normal-slider'];
const read=p=>fs.readFileSync(p,'utf8');
const keys=s=>[...s.matchAll(/I18n\.t\(['"]([^'"]+)['"]\)/g)].map(m=>m[1]==='popUpMenu'?'popupMenu':m[1]);
test('Native example keeps the original independent routes and Slider demo mapping',()=>{
 const original=JSON.parse(read(path.join(root,'example/app.json'))),native=JSON.parse(read(path.join(__dirname,'example/app.json')));
 const expected=original.pages.filter(p=>p==='pages/dashboard/index'||names.some(n=>p===`pages/${n==='normal-slider'?'slider':n}/index`));
 assert.deepEqual(native.pages,expected);assert.equal(native.pages.length,15);assert.equal(native.pages[0],'pages/dashboard/index');
 assert.equal(native.usingComponents['smart-slider-demo'],'./dist/normal-slider/demo/index');
 assert.ok(!native.pages.some(p=>/batch|forms|touch/.test(p)));
 for(const p of native.pages)assert.equal(JSON.parse(read(path.join(__dirname,'example',p+'.json'))).renderer,'native');
});
for(const name of names)test(`${name}: original demo sections and component bindings are preserved`,()=>{
 const original=read(path.join(root,'packages',name,'demo/index.wxml'));
 const built=read(path.join(__dirname,'example/dist',name,'demo/index.wxml'));
 assert.deepEqual(keys(built),keys(original));
 const customTags=s=>[...s.matchAll(/<smart-(?!col\b)[\w-]+(?:[^'">]|"[^"]*"|'[^']*')*>/g)].map(m=>m[0].replace(/\s+inactive-destroy="\{\{ true \}\}"/,'').replace(/\s+/g,' ').trim());
 assert.deepEqual(customTags(built),customTags(original));
});
test('Catalogue group names, entries and order are the original example contract',()=>{
 function load(p){const output=ts.transpileModule(read(p),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;const exports={};vm.runInNewContext(output,{exports,I18n:{t:k=>k}});return JSON.parse(JSON.stringify(exports.default));}
 assert.deepEqual(load(path.join(__dirname,'example/config.js')),load(path.join(root,'example/config.js')));
});

test('ActionSheet uses a single equivalent popup menu translation key',()=>{
 const strings=JSON.parse(read(path.join(root,'example/i18n/strings.json')));
 assert.equal(strings.zh.popupMenu,strings.zh.popUpMenu);
 assert.equal(strings.en.popupMenu.replace(/[^a-z]/gi,'').toLowerCase(),strings.en.popUpMenu.replace(/[^a-z]/gi,'').toLowerCase());
 const source=read(path.join(__dirname,'packages/action-sheet/demo/index.wxml'));
 assert.ok(!source.includes("I18n.t('popUpMenu')"));
});
test('Native demo columns retain their parent row gutter on real Views',()=>{
 const template=read(path.join(__dirname,'example/dist/image/demo/index.wxml'));
 const columns=[...template.matchAll(/<view\b[^>]*style="([^"]*width:33\.333[^\"]*)"/g)];
 assert.ok(columns.length>=6);
 for(const [,style] of columns){assert.match(style,/padding-left:10px/);assert.match(style,/padding-right:10px/);assert.match(style,/box-sizing:border-box/);}
});

function loadPageFactory() {
 const exports={};let options,measure;
 vm.runInNewContext(read(path.join(__dirname,'example/common/page.js')),{
  exports,Page:value=>{options=value;},
  wx:{getSystemInfoSync:()=>({windowHeight:852}),createSelectorQuery:()=>({
   selectViewport(){return this;},boundingClientRect(){return this;},exec(fn){measure=fn;}
  })}
 });
 return {create(value){exports.default(value);return options;},measure(value){measure(value);}};
}
test('Native example uses the content viewport and preserves page lifecycle callbacks',()=>{
 const harness=loadPageFactory(),calls=[];
 const page={data:{},setData(value){Object.assign(this.data,value);}};
 const options=harness.create({onLoad(query){calls.push(['load',this,query]);},onReady(){calls.push(['ready',this]);},onUnload(){calls.push(['unload',this]);}});
 const query={from:'catalogue'};options.onLoad.call(page,query);
 assert.equal(page.data.demoScrollHeight,852);
 options.onReady.call(page);harness.measure([{height:749}]);
 assert.equal(page.data.demoScrollHeight,749);
 options.onUnload.call(page);harness.measure([{height:900}]);
 assert.equal(page.data.demoScrollHeight,749);
 assert.deepEqual(calls,[['load',page,query],['ready',page],['unload',page]]);
});
test('Native example tolerates empty options and invalid viewport measurements',()=>{
 const harness=loadPageFactory(),options=harness.create(),page={data:{},setData(value){Object.assign(this.data,value);}};
 options.onLoad.call(page);options.onReady.call(page);
 for(const result of [[],null,[{height:0}],[{height:-1}]])harness.measure(result);
 assert.equal(page.data.demoScrollHeight,852);
 for(const route of JSON.parse(read(path.join(__dirname,'example/app.json'))).pages){
  const template=read(path.join(__dirname,'example',route+'.wxml'));
  assert.match(template,/^<scroll-view[^>]*z-index:0;[^>]*><view[^>]*flex-shrink:0;/);
  assert.match(template,/<\/view><\/scroll-view>$/);
 }
});
