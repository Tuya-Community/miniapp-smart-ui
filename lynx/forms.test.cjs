const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs'), vm = require('vm'), path = require('path'), ts = require('typescript');
function transpile(file) { return ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText; }
function moduleFrom(file) { const exports={};vm.runInNewContext(transpile(file),{exports});return exports; }
function component(name, extras={}) {
 let options;
 const modules={
  './shared':moduleFrom(path.join(__dirname,'packages/picker/shared.ts')),
  '../common/component':{SmartComponent:value=>{options=value;}},
  '../common/utils':{range:(n,min,max)=>Math.min(max,Math.max(min,n)),clamp:(n,min,max)=>Math.min(max,Math.max(min,n)),addUnit:n=>n==null?undefined:String(n)+'px',addNumber:(a,b)=>a+b,nextTick:cb=>cb(),getRect:extras.getRect},
  '../common/validator':{isObj:n=>n!==null&&typeof n==='object'},
  '../common/version':{canIUseModel:()=>false},
  '../mixins/touch':{touch:{}},'../mixins/button':{button:{}},
  '../common/ty':{default:{getThemeInfo:()=>({}),selectionVibrate(){},vibrateShort(){}}},
  '../common/svg-source':moduleFrom(path.join(__dirname,'packages/common/svg-source.ts')),
  '@tuya-miniapp/icons/dist/svg/Loading':{default:''},
 };
 vm.runInNewContext(transpile(path.join(__dirname,'packages',name,'index.ts')),{exports:{},require:n=>{if(!(n in modules))throw new Error('Unmocked import '+n);return modules[n];},wx:extras.wx||{nextTick:cb=>cb()},setTimeout,clearTimeout,console});
 const c={ data:{...options.data},events:[],...options.methods,
  setData(values){Object.assign(this.data,values);},$emit(name,detail){this.events.push({name,detail});},
  touchStart(e){this.startX=e.touches[0].clientX;},touchMove(e){this.deltaX=e.touches[0].clientX-this.startX;},
 };
 return {c,options};
}
const flush=()=>new Promise(resolve=>setImmediate(resolve));
test('Slider waits for the pending layout query before committing the drag result',async()=>{
 let resolve;const {c}=component('slider',{getRect:()=>new Promise(r=>{resolve=r;})});
 Object.assign(c.data,{range:false,min:0,max:100,step:5,value:20,vertical:false});c.updateValue(20);
 c.onTouchStart({touches:[{clientX:20}],currentTarget:{dataset:{}}});
 c.onTouchMove({touches:[{clientX:80}]});c.onTouchEnd();
 assert.equal(c.events.some(e=>e.name==='change'),false);resolve({width:100,height:4,left:0,top:0});await flush();
 assert.equal(c.events.find(e=>e.name==='change').detail,80);
});
test('Slider cancellation ignores late layout results and does not commit',async()=>{
 let resolve;const {c}=component('slider',{getRect:()=>new Promise(r=>{resolve=r;})});
 Object.assign(c.data,{range:false,min:0,max:100,step:5,value:20,vertical:false});c.updateValue(20);
 c.onTouchStart({touches:[{clientX:20}],currentTarget:{dataset:{}}});c.onTouchMove({touches:[{clientX:80}]});c.onTouchCancel();
 resolve({width:100,height:4,left:0,top:0});await flush();
 assert.equal(c.value,20);assert.equal(c.events.some(e=>e.name==='change'),false);assert.equal(c.events.filter(e=>e.name==='cancel').length,1);
});
test('PickerColumn selection preserves index/value and ignores disabled options',()=>{
 const {c}=component('picker-column');Object.assign(c.data,{options:['00',{text:'Disabled',disabled:true},'02','03'],valueKey:'text',loop:false,itemHeight:32,visibleItemCount:3,activeIndex:2,currentIndex:2,animationIndex:2,animationTime:0});c.updateVisibleOptions();
 let slot=c.data.optionsVIndexList.indexOf(1);c.onNativeTap({currentTarget:{dataset:{index:slot}}});assert.equal(c.events.some(e=>e.name==='change'),false);
 slot=c.data.optionsVIndexList.indexOf(3);c.onNativeTap({currentTarget:{dataset:{index:slot}}});assert.equal(c.data.currentIndex,3);assert.equal(c.events.find(e=>e.name==='change').detail,3);
});
test('PickerColumn touch cancellation restores the initial index without change',()=>{
 const {c}=component('picker-column');Object.assign(c.data,{options:['00','01','02','03'],loop:false,itemHeight:32,visibleItemCount:3,activeIndex:2,currentIndex:2,animationIndex:2,animationTime:0});c.updateVisibleOptions();
 c.onNativeTouchStart({touches:[{pageY:100}]});c.onNativeTouchMove({touches:[{pageY:68}]});c.onNativeTouchCancel();assert.equal(c.data.currentIndex,2);assert.equal(c.events.some(e=>e.name==='change'),false);
});
test('Image SVG requests ignore stale responses and abort superseded work',()=>{
 const requests=[],aborts=[];const {c}=component('image',{wx:{nextTick:cb=>cb(),request:options=>{requests.push(options);return{abort:()=>aborts.push(true)};}}});
 c.prepareSource('https://example.test/a.svg');c.prepareSource('https://example.test/b.svg');
 requests[0].success({statusCode:200,data:'<svg xmlns="http://www.w3.org/2000/svg"></svg>'});assert.equal(c.events.length,0);
 requests[1].success({statusCode:200,data:'<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0"/></svg>'});
 assert.equal(aborts.length,1);assert.equal(c.events.filter(e=>e.name==='load').length,1);assert.match(c.data.svgDataUri,/data:image\/svg\+xml/);
});
test('Image reports failed SVG requests and restores its error state',()=>{
 let request;const {c}=component('image',{wx:{nextTick:cb=>cb(),request:options=>{request=options;return{abort(){}};}}});
 c.prepareSource('https://example.test/missing.svg');request.success({statusCode:404,data:'not SVG'});assert.equal(c.data.error,true);assert.equal(c.data.loading,false);assert.equal(c.events[0].name,'error');
});
test('Image preserves the host domain rejection details instead of emitting object Object',()=>{
 let request;const {c}=component('image',{wx:{nextTick:cb=>cb(),request:options=>{request=options;return{abort(){}};}}});
 c.prepareSource('http://127.0.0.1/icon.svg');request.fail({errorCode:40013,errorMsg:'domain is not configured'});
 assert.equal(c.data.error,true);assert.equal(c.data.loading,false);assert.equal(c.events[0].name,'error');
 assert.match(c.events[0].detail.errMsg,/40013/);assert.match(c.events[0].detail.errMsg,/domain is not configured/);
 assert.equal(c.events.some(e=>e.name==='load'),false);
});
test('Normal Slider preserves reverse/vertical bounds and step semantics for the original example',async()=>{
 const {c}=component('normal-slider',{getRect:()=>Promise.resolve({left:0,top:0,width:100,height:100})});
 Object.assign(c.data,{min:0,max:100,step:5,disable:false,enableTouch:true,direction:'vertical',reverse:true});
 await c.setFromPointer({clientX:0,clientY:25},true);
 assert.equal(c.data.nativeValue,75);assert.equal(c.events.find(e=>e.name==='end').detail.value,75);
});
test('Normal Slider cancellation fences a late layout query',async()=>{
 let resolve;const {c}=component('normal-slider',{getRect:()=>new Promise(r=>{resolve=r;})});
 Object.assign(c.data,{min:0,max:100,step:5,disable:false,nativeValue:50});
 c.onNativeStart({});c.onNativeMove({touches:[{clientX:80,clientY:0}]});c.onNativeCancel();
 resolve({left:0,top:0,width:100,height:4});await flush();
 assert.equal(c.data.nativeValue,50);assert.equal(c.events.some(e=>e.name==='change'||e.name==='end'),false);
});
test('Normal Slider exposes the documented event.detail.value contract',async()=>{
 const {c}=component('normal-slider',{getRect:()=>Promise.resolve({left:0,top:0,width:100,height:4})});
 Object.assign(c.data,{min:0,max:100,step:5,disable:false,nativeValue:20});
 c.onNativeStart({});await c.setFromPointer({clientX:75,clientY:0},true);
 assert.equal(c.events.find(e=>e.name==='start').detail.value,20);
 assert.equal(c.events.find(e=>e.name==='change').detail.value,75);
 assert.equal(c.events.find(e=>e.name==='end').detail.value,75);
});
test('Normal Slider ignores a stale move when layout queries finish out of order',async()=>{
 const pending=[];const {c}=component('normal-slider',{getRect:()=>new Promise(r=>pending.push(r))});
 Object.assign(c.data,{min:0,max:100,step:1,disable:false,nativeValue:20});c.onNativeStart({});
 c.onNativeMove({touches:[{clientX:30,clientY:0}]});c.onNativeMove({touches:[{clientX:80,clientY:0}]});c.onNativeEnd();
 pending[1]({left:0,top:0,width:100,height:4});await flush();
 pending[0]({left:0,top:0,width:100,height:4});await flush();
 assert.equal(c.data.nativeValue,80);
 assert.equal(c.events.filter(e=>e.name==='change').length,1);
 assert.equal(c.events.find(e=>e.name==='end').detail.value,80);
});
test('Normal Slider uses release coordinates for the committed value',async()=>{
 const {c}=component('normal-slider',{getRect:()=>Promise.resolve({left:0,top:0,width:100,height:4})});
 Object.assign(c.data,{min:0,max:100,step:5,disable:false,nativeValue:20});c.onNativeStart({});
 c.onNativeMove({touches:[{clientX:50,clientY:0}]});
 c.onNativeEnd({changedTouches:[{clientX:85,clientY:0}]});await flush();
 assert.equal(c.events.find(e=>e.name==='end').detail.value,85);
});
test('Normal Slider parcel geometry reaches both endpoints at the inset thumb centers',async()=>{
 const {c}=component('normal-slider',{getRect:()=>Promise.resolve({left:10,top:0,width:100,height:4})});
 Object.assign(c.data,{min:0,max:100,step:1,disable:false,parcel:true,parcelThumbWidth:20,parcelMargin:2});
 await c.setFromPointer({clientX:22,clientY:0});assert.equal(c.data.nativeValue,0);
 await c.setFromPointer({clientX:98,clientY:0});assert.equal(c.data.nativeValue,100);
});
test('Normal Slider vertical bar follows value despite a legacy fixed bar height',()=>{
 const ctx={module:{exports:{}}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'packages/normal-slider/index.wxs'),'utf8'),ctx);
 const style=ctx.module.exports.bar({nativeValue:25,min:0,max:100,direction:'vertical',reverse:true,barStyle:'width:48px;height:114px;background:#1989fa;'});
 const declarations=Object.fromEntries(style.split(';').filter(Boolean).map(d=>{const i=d.indexOf(':');return [d.slice(0,i),d.slice(i+1)];}));
 assert.equal(declarations.height,'25%');assert.equal(declarations.width,'48px');assert.equal(declarations.bottom,'0');
});
test('Switch custom gradients survive toggles and solid colors clear the previous image',()=>{
 const ctx={module:{exports:{}},getRegExp:RegExp,require:n=>n.includes('add-unit')?(n=>String(n).match(/[a-z%]/i)?n:n+'px'):(values=>Object.entries(values).filter(([,v])=>v!=null).map(([k,v])=>k+':'+v).join(';'))};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'packages/switch/index.wxs'),'utf8'),ctx);
 const data={size:'30',checked:'enabled',activeValue:'enabled',activeColor:'linear-gradient(to right, #ff7e5f, #987aff)',inactiveColor:'#ee0a24'};
 const on=ctx.module.exports.rootStyle(data);assert.match(on,/background-image:linear-gradient/);assert.match(on,/font-size:30px/);
 const off=ctx.module.exports.rootStyle({...data,checked:'disabled'});assert.match(off,/background-color:#ee0a24/);assert.match(off,/background-image:none/);
 assert.equal(ctx.module.exports.loadingSize('24px'),'24px');assert.equal(ctx.module.exports.loadingSize('30'),'30px');assert.equal(ctx.module.exports.loadingSize('24.0px'),'24px');
 assert.equal(ctx.module.exports.loadingColor(data),'#1989fa');
});
test('Slider ignores an older layout result after a newer drag measured a resized track',async()=>{
 const pending=[];const {c}=component('slider',{getRect:()=>new Promise(r=>pending.push(r))});
 Object.assign(c.data,{range:false,min:0,max:100,step:5,value:20,vertical:false});c.updateValue(20);
 c.onTouchStart({touches:[{clientX:20}],currentTarget:{dataset:{}}});
 c.onTouchMove({touches:[{clientX:40}]});c.onTouchMove({touches:[{clientX:80}]});c.onTouchEnd();
 pending[1]({left:0,top:0,width:200,height:4});await flush();
 pending[0]({left:0,top:0,width:100,height:4});await flush();
 assert.equal(c.value,50);assert.equal(c.events.find(e=>e.name==='change').detail,50);
});
test('Slider does not commit a pending rail tap after the component was destroyed',async()=>{
 let resolve;const {c,options}=component('slider',{getRect:()=>new Promise(r=>{resolve=r;})});
 Object.assign(c.data,{range:false,min:0,max:100,step:5,value:20,vertical:false});c.updateValue(20);
 c.onClick({touches:[{clientX:80}]});options.destroyed.call(c);
 resolve({left:0,top:0,width:100,height:4});await flush();
 assert.equal(c.value,20);assert.equal(c.events.some(e=>e.name==='change'),false);
});

test('Picker explicit activeIndex wins over auto-reset after a data source replacement', async()=>{
 const {c}=component('picker');Object.assign(c.data,{columns:[{values:['00','01','02'],activeIndex:2}],autoReset:true,defaultIndex:0});
 c._windows=[];let selected=1;const child={data:{options:['A','B','C']},set({options}){this.data.options=options;return Promise.resolve();},setIndex(i){selected=i;return Promise.resolve();}};c.children=[child];
 await c.setColumns();assert.equal(selected,2);
 c.data.columns=[{values:['X','Y','Z']}];await c.setColumns();assert.equal(selected,0);
});
test('PickerColumn imperative setIndex rebuilds the projected options window',()=>{
 const {c}=component('picker-column');Object.assign(c.data,{options:Array.from({length:60},(_,i)=>String(i+1)),loop:true,itemHeight:44,visibleItemCount:5,activeIndex:10,currentIndex:10,animationIndex:10});c.updateVisibleOptions();
 c.setIndex(50);const center=((Math.round(c.data.animationIndex)%18)+18)%18;
 assert.equal(c.data.optionsVIndexList[center],50);
});
