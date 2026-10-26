const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('fs'),path=require('path'),vm=require('vm');
const cache=new Map();
function wxs(file){
 if(cache.has(file))return cache.get(file);
 const context={module:{exports:{}},Date,Math,getRegExp:(a,b)=>new RegExp(a,b),decodeURIComponent};
 cache.set(file,context);
 context.require=name=>wxs(path.resolve(path.dirname(file),name)).module.exports;
 vm.runInNewContext(fs.readFileSync(file,'utf8'),context);return context;
}
test('native wheel projection keeps the selected slot upright and suppresses the back face',()=>{
 const c=wxs(path.join(__dirname,'packages/picker-column/index.wxs'));
 const input={visibleItemCount:3,itemHeight:32,instanceId:'test',animationIndex:12,index:2};
 const selected=c.nativeProjection(input),back=c.nativeProjection({...input,index:7}),front=c.nativeProjection({...input,index:3});
 // Node does not emulate WXS's string-valued .constructor; inspect the returned geometry before WXS serialization.
 assert.match(typeof selected==='string'?selected:selected.transform,/scaleY\(1\)/);
 assert.equal(typeof back==='string'?back.includes('display:none'):back.display==='none',true);
 assert.equal(typeof front==='string'?front.includes('display:flex'):front.display==='flex',true);
});
test('Calendar WXS executes date helpers without the WebView getDate global',()=>{
 const c=wxs(path.join(__dirname,'packages/calendar/index.wxs')).module.exports;
 assert.equal(c.formatMonthTitle(new Date(2026,9,23).getTime()),'2026-10');
 const u=wxs(path.join(__dirname,'packages/calendar-utils/utils.wxs')).module.exports;
 assert.equal(u.getMonthEndDay(2024,2),29);assert.equal(u.getMonthEndDay(2026,2),28);
});
