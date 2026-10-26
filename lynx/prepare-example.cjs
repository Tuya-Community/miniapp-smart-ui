const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const { writeTuyaAliases } = require('./build.cjs');
const root = __dirname;
const original = path.join(root, '../example');
const output = path.join(root, 'example');
const components = ['icon', 'image', 'loading', 'switch', 'grid', 'popup', 'overlay', 'action-sheet', 'toast', 'picker', 'datetime-picker', 'calendar', 'dialog', 'normal-slider'];
const routeNames = components.map(n => n === 'normal-slider' ? 'slider' : n);

// Preserve every original example and event binding. Native rendering needs
// explicit Text leaves; this changes the node representation, not its content.
function nativeText(source) {
  // Col is only a layout primitive in these demos. A custom-component host
  // cannot reproduce float percentage sizing; use the same span on a real View.
  source = source.replace(/(<smart-button\b[^>]*\bclass="demo-margin-right"[^>]*>)([\s\S]*?)(<\/smart-button>)/g,
    '<view style="margin-right:10px;">$1$2$3</view>');
  const rowGutters = [];
  source = source.replace(/<\/?smart-(?:row|col)\b(?:[^'">]|"[^"]*"|'[^']*')*>/g, tag => {
    if (tag.startsWith('<smart-row')) {
      rowGutters.push(Number((tag.match(/\bgutter="(\d+)"/) || [])[1] || 0));
      return tag;
    }
    if (tag.startsWith('</smart-row')) { rowGutters.pop(); return tag; }
    if (tag.startsWith('</smart-col')) return '</view>';
    const attrs = tag.slice('<smart-col'.length, -1);
    const span = Number((attrs.match(/\bspan="(\d+)"/) || [])[1] || 24);
    const gutter = rowGutters[rowGutters.length - 1] || 0;
    return '<view' + attrs.replace(/\bspan="\d+"/, '').replace(/\bcustom-class=/, 'class=') +
      ` style="width:${span * 100 / 24}%;box-sizing:border-box;flex-shrink:0;padding-left:${gutter / 2}px;padding-right:${gutter / 2}px;">`;
  });
  const tags = /<!--[\s\S]*?-->|<\/?[a-zA-Z][\w-]*(?:[^'">]|"[^"]*"|'[^']*')*>/g;
  const stack = [];
  let last = 0;
  let result = '';
  const appendText = text => {
    const leaf = ['text', 'wxs', 'sjs', 'rich-text'].includes(stack[stack.length - 1]);
    result += text.trim() && !leaf ? `<text>${text.trim()}</text>` : text;
  };
  for (const match of source.matchAll(tags)) {
    appendText(source.slice(last, match.index));
    const tag = match[0];
    result += tag;
    if (!tag.startsWith('<!--')) {
      if (tag.startsWith('</')) stack.pop();
      else if (!tag.endsWith('/>')) stack.push(tag.match(/^<([\w-]+)/)[1]);
    }
    last = match.index + tag.length;
  }
  appendText(source.slice(last));
  return result;
}

function copySource(source, target) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (source.endsWith('.js')) {
    const code = ts.transpileModule(fs.readFileSync(source, 'utf8'), {
      compilerOptions: { target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS },
    }).outputText;
    fs.writeFileSync(target, code);
  } else if (source.endsWith('.wxml')) {
    fs.writeFileSync(target, nativeText(fs.readFileSync(source, 'utf8')));
  } else fs.copyFileSync(source, target);
}

function prepareExample() {
  for (const name of ['app.js', 'app.wxss', 'config.js', 'theme.json', 'sitemap.json']) {
    if (fs.existsSync(path.join(original, name))) copySource(path.join(original, name), path.join(output, name));
  }
  for (const dir of ['common', 'components', 'i18n']) {
    function visit(relative) {
      for (const entry of fs.readdirSync(path.join(original, relative), { withFileTypes: true })) {
        const p = path.join(relative, entry.name);
        if (entry.isDirectory()) visit(p);
        else copySource(path.join(original, p), path.join(output, p));
      }
    }
    visit(dir);
  }
  // Use the actual MiniApp content viewport. A vh-sized nested custom-component
  // tree can otherwise become the ScrollView's unconstrained content height.
  fs.appendFileSync(path.join(output, 'common/page.js'), `
var originalPageFactory = exports.default;
exports.default = function(options) {
  options = options || {};
  var onLoad = options.onLoad;
  var onReady = options.onReady;
  var onUnload = options.onUnload;
  return originalPageFactory(Object.assign({}, options, {
    onLoad: function(query) {
      this._demoScrollUnloaded = false;
      var info = wx.getSystemInfoSync();
      this.setData({ demoScrollHeight: info.windowHeight || info.screenHeight });
      if (onLoad) onLoad.call(this, query);
    },
    onReady: function() {
      var page = this;
      wx.createSelectorQuery().selectViewport().boundingClientRect().exec(function(rects) {
        var height = rects && rects[0] && rects[0].height;
        if (!page._demoScrollUnloaded && typeof height === 'number' && height > 0) {
          page.setData({ demoScrollHeight: height });
        }
      });
      if (onReady) return onReady.apply(this, arguments);
    },
    onUnload: function() {
      this._demoScrollUnloaded = true;
      if (onUnload) return onUnload.apply(this, arguments);
    }
  }));
};
`);
  const app = JSON.parse(fs.readFileSync(path.join(original, 'app.json')));
  app.pages = app.pages.filter(p => p === 'pages/dashboard/index' || routeNames.includes(p.split('/')[1]));
  app.usingComponents = Object.fromEntries(Object.entries(app.usingComponents).filter(([name]) =>
    name === 'demo-block' || routeNames.some(n => name === `smart-${n}-demo`)));
  fs.writeFileSync(path.join(output, 'app.json'), JSON.stringify(app, null, 2) + '\n');
  for (const route of app.pages) {
    for (const ext of ['js', 'wxml', 'wxss', 'css', 'json']) {
      const source = path.join(original, `${route}.${ext}`);
      if (fs.existsSync(source)) copySource(source, path.join(output, `${route}.${ext}`));
    }
    const file = path.join(output, `${route}.json`);
    const config = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : {};
    config.renderer = 'native';
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(config, null, 2) + '\n');
    const markup = path.join(output, `${route}.wxml`);
    // A scroll stacking context keeps z-index descendants inside native scrolling.
    fs.writeFileSync(markup, `<scroll-view wx:if="{{demoScrollHeight}}" scroll-y="{{true}}" style="height:{{demoScrollHeight}}px;width:100%;z-index:0;"><view style="width:100%;flex-shrink:0;display:flex;flex-direction:column;">${fs.readFileSync(markup, 'utf8')}</view></scroll-view>`);
  }
  // Keep the whole original catalogue in the same order; unavailable entries
  // report their status instead of silently linking to a nonexistent page.
  const nav = path.join(output, 'components/demo-home-nav/index.js');
  let code = fs.readFileSync(nav, 'utf8').replace('event.target.dataset', 'event.currentTarget.dataset');
  code = code.replace('var url = ', 'var url = ');
  code = code.replace(/if \(getCurrentPages\(\)\.length > 9\)/, `if (${JSON.stringify(app.pages.map(p => '/' + p))}.indexOf(url) < 0) { wx.showToast({title: I18n.t('lynxDemoPending'), icon:'none'}); return; }\n            if (getCurrentPages().length > 9)`);
  fs.writeFileSync(nav, code);
  const stringsPath = path.join(output, 'i18n/strings.json');
  const strings = JSON.parse(fs.readFileSync(stringsPath));
  strings.zh.lynxDemoPending = '该组件尚未迁移至 Lynx';
  strings.en.lynxDemoPending = 'This component has not been migrated to Lynx';
  fs.writeFileSync(stringsPath, JSON.stringify(strings, null, 2) + '\n');
  // The native layout has no float/clearfix layout. Preserve demo-block sections
  // and use a real flex body for their original examples.
  const block = path.join(output, 'components/demo-block/index.wxml');
  fs.writeFileSync(block, fs.readFileSync(block, 'utf8').replace('<slot wx:else />', '<view wx:else class="demo-block__body"><slot /></view>'));
  fs.appendFileSync(path.join(output, 'components/demo-block/index.wxss'), '\n.demo-block__title{line-height:28px;}\n.demo-block__body{display:flex;flex-direction:row;flex-wrap:wrap;align-items:center;width:100%;}\n');
  fs.appendFileSync(path.join(output, 'components/demo-home-nav/index.wxss'), '\n.demo-home-nav__block{align-items:center;flex-direction:row;min-height:40px;}\n');
  const home = path.join(output, 'components/demo-home-nav/index.wxml');
  fs.writeFileSync(home, fs.readFileSync(home, 'utf8').replace(/<smart-icon[^>]*\/>/, '<view class="demo-home-nav__icon"><smart-icon name="M320 128 L704 512 L320 896 L256 832 L576 512 L256 192 Z" size="16px" color="#b6c3d2" /></view>'));
  writeTuyaAliases(output);
  return app.pages;
}
module.exports = { prepareExample, nativeText, components, routeNames };
if (require.main === module) console.log(prepareExample());
