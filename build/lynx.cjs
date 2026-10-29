/* Independent build: never writes packages/, dist/ or lib/. */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const less = require('less');
const postcss = require('postcss');
const ts = require('typescript');
const vm = require('vm');
const { parseDocument } = require('htmlparser2');
const serialize = require('dom-serializer').default;
const { Element, Text } = require('domhandler');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'packages');
const target = path.join(root, 'lynx');
const staged = path.join(target, '.generated/packages');
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const inherited = {
  color: '#323233',
  'font-size': '14px',
  'line-height': 'normal',
  'font-weight': 'normal',
  'font-family': 'sans-serif',
  'font-style': 'normal',
  'letter-spacing': '0px',
  'text-align': 'left',
  'border-radius': '0px',
  'border-color': 'transparent',
  'border-style': 'solid',
  border: '0px solid transparent',
};
function files(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? files(file) : [file];
  });
}
function write(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, data);
}
function baseline() {
  const data = JSON.parse(fs.readFileSync(path.join(target, 'webview-baseline.json')));
  for (const [rel, expected] of Object.entries(data.sha256)) {
    const file = path.join(root, rel);
    if (!fs.existsSync(file) || sha(fs.readFileSync(file)) !== expected) {
      throw new Error(`WebView isolation failed: ${rel}`);
    }
  }
}
function inventory() {
  const components = fs
    .readdirSync(source)
    .filter(name => {
      const file = path.join(source, name, 'index.json');
      return fs.existsSync(file) && JSON.parse(fs.readFileSync(file)).component;
    })
    .sort();
  const data = components.map(name => {
    const own = files(path.join(source, name)).filter(f => !/\/(demo|test)\//.test(f));
    const text = own
      .filter(f => /\.(ts|wxml|wxs|less|rjs)$/.test(f))
      .map(f => fs.readFileSync(f, 'utf8'))
      .join('\n');
    const json = JSON.parse(fs.readFileSync(path.join(source, name, 'index.json')));
    return {
      name,
      dependencies: json.usingComponents || {},
      risks: [
        '::before',
        '::after',
        'mask-',
        'change:',
        'callMethod',
        '.setStyle(',
        'rotateX(',
        '.rjs',
        'nativeDisabled',
        'scroll-view',
        'createSelectorQuery',
      ].filter(s => text.includes(s)),
      override: files(path.join(target, 'overrides', name)).map(f => path.relative(target, f)),
      source: 'packages/' + name,
      target: 'lynx/dist/' + name,
      status: 'IMPLEMENTED_RUNTIME_PENDING',
      cases: [
        'light/dark + theme change',
        'default/active/disabled/loading/empty',
        'props + slots + external classes',
        'events + controlled updates',
        'open/close/reenter + cleanup',
        'phone/tablet + long text',
      ],
      runtimeEvidence: [],
    };
  });
  write(
    path.join(target, 'components.json'),
    JSON.stringify({ base: '45e7e1e', components: data }, null, 2) + '\n'
  );
  return data;
}

// Replace decorative pseudo-elements with real nodes. All changes are confined
// to the Lynx output; descendant properties and state selectors are retained.
function template(input, pseudoClasses) {
  // XML parsers must not interpret `<` inside WXML interpolation as a tag.
  const expressions = [];
  const masked = input.replace(
    /\{\{[\s\S]*?\}\}/g,
    value => `SMART_UI_EXPR_${expressions.push(value) - 1}_END`
  );
  const restore = text => text.replace(/SMART_UI_EXPR_(\d+)_END/g, (_, i) => expressions[+i]);
  const expression = value => {
    const text = restore(value || '').trim();
    if (/^\{\{[\s\S]*\}\}$/.test(text)) return text.slice(2, -2);
    return text ? "'" + text.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'" : "''";
  };
  const mask = text =>
    text.replace(/\{\{[\s\S]*?\}\}/g, value => `SMART_UI_EXPR_${expressions.push(value) - 1}_END`);
  const joinClass = (node, text) => {
    node.attribs.class = (node.attribs.class || '') + ' ' + mask(text);
  };
  function childrenPresent(children) {
    let previousIf = [];
    return (
      children
        .map(child => {
          if (child.type === 'text') {
            if (!child.data.trim()) return 'false';
            return `smartLynxStyle.content(${expression(child.data)})`;
          }
          if (!child.name || ['wxs', 'import'].includes(child.name)) return 'false';
          const attrs = child.attribs || {};
          if ('wx:for' in attrs) return `smartLynxStyle.length(${expression(attrs['wx:for'])}) > 0`;
          let condition = 'true';
          if ('wx:if' in attrs) {
            condition = expression(attrs['wx:if']);
            previousIf = [condition];
          } else if ('wx:elif' in attrs) {
            const current = expression(attrs['wx:elif']);
            condition = `!(${previousIf.join(' || ')}) && (${current})`;
            previousIf.push(current);
          } else if ('wx:else' in attrs)
            condition = previousIf.length ? `!(${previousIf.join(' || ')})` : 'true';
          else previousIf = [];
          if ('wx:for' in attrs)
            condition = `(${condition}) && smartLynxStyle.length(${expression(
              attrs['wx:for']
            )}) > 0`;
          const present =
            child.name === 'slot'
              ? `smartLynxStyle.slot(lynxSlotNames, '${attrs.name || ''}', lynxHasDefaultSlot)`
              : child.name === 'block'
              ? childrenPresent(child.children || [])
              : 'true';
          return `((${condition}) && (${present}))`;
        })
        .join(' || ') || 'false'
    );
  }
  const doc = parseDocument(masked, { xmlMode: true, decodeEntities: false });
  function visit(node, parent) {
    if (
      node.type === 'text' &&
      node.data.trim() &&
      parent &&
      !['text', 'wxs', 'rich-text'].includes(parent.name)
    ) {
      // Formatting newlines around implicit text are collapsed by MiniApp
      // templates, but Lynx paints them as extra lines. Keep explicit <text>
      // and data-provided newlines intact; remove only source indentation here.
      const text = node.data.replace(/^\s*\r?\n\s*|\s*\r?\n\s*$/g, '');
      const el = new Element('text', { class: 'smart-lynx-text' }, [new Text(text)]);
      el.children[0].parent = el;
      el.parent = parent;
      return el;
    }
    if (!node.children || node.name === 'wxs') return node;
    const original = node.children.slice();
    const isElement =
      !!node.name && !['wxs', 'import', 'include', 'template', 'block'].includes(node.name);
    if (isElement) {
      const list = node.attribs['wx:for'];
      const siblings = (parent?.children || []).filter(
        n => n.name && !['wxs', 'import'].includes(n.name)
      );
      const index = node.attribs['wx:for-index'] || 'index';
      const rootNode = parent?.type === 'root';
      const first = list
        ? `${index} === 0`
        : rootNode
        ? 'lynxIndex === 0'
        : String(siblings[0] === node);
      const last = list
        ? `${index} === smartLynxStyle.length(${expression(list)}) - 1`
        : rootNode
        ? 'lynxCount > 0 && lynxIndex === lynxCount - 1'
        : String(siblings[siblings.length - 1] === node);
      joinClass(
        node,
        `{{(${first}) ? 'smart-lynx-first' : ''}} {{(${last}) ? 'smart-lynx-last' : ''}}`
      );
      const cls = restore(node.attribs.class || '');
      if (
        node.name === 'view' &&
        (/smart-bottom-sheet__content/.test(cls) ||
          /bem\('dialog__message'/.test(cls) ||
          /bem\('tab__pane'/.test(cls))
      ) {
        node.name = 'scroll-view';
        node.attribs['scroll-y'] = mask('{{true}}');
      }
      if (node.name === 'scroll-view' && /smart-action-sheet__list/.test(cls))
        node.attribs['scroll-y'] = mask('{{true}}');
      if (node.name === 'scroll-view' && /tabs__scroll/.test(cls))
        node.attribs['show-scrollbar'] = mask('{{false}}');
      if (
        /smart-(cell|button|calendar|empty|checkbox|radio|field|bottom-sheet|loading)/.test(cls) ||
        /bem\('(cell|button|checkbox|radio)/.test(cls)
      )
        joinClass(node, `{{(${childrenPresent(original)}) ? '' : 'smart-lynx-empty'}}`);
      if (
        node.name.startsWith('smart-') ||
        ['picker-column', 'month', 'month-list', 'year-list', 'header', 'loading'].includes(
          node.name
        )
      ) {
        node.attribs['lynx-has-default-slot'] = mask(
          `{{!!(${childrenPresent(original.filter(c => !c.attribs?.slot))})}}`
        );
        const slotNames = original.filter(c => c.attribs?.slot).map(c => c.attribs.slot);
        node.attribs['lynx-slot-names'] = mask(
          `{{[${slotNames.map(n => "'" + n + "'").join(',')}]}}`
        );
        if (list) {
          node.attribs['lynx-index'] = mask(`{{${index}}}`);
          node.attribs['lynx-count'] = mask(`{{smartLynxStyle.length(${expression(list)})}}`);
        }
      }
      if (node.name === 'text') {
        joinClass(node, 'smart-lynx-text');
        if (cls.includes('smart-multi-ellipsis--l2')) node.attribs['text-maxline'] = '2';
        else if (cls.includes('smart-multi-ellipsis--l3')) node.attribs['text-maxline'] = '3';
        else if (cls.includes('smart-ellipsis')) node.attribs['text-maxline'] = '1';
      }
      // Expose inline visual styles as inherited CSS variables. Literal and
      // mixed interpolation are handled by the same concatenation expression.
      if (node.attribs.style) {
        const raw = restore(node.attribs.style);
        const parts = raw
          .split(/(\{\{[\s\S]*?\}\})/)
          .filter(Boolean)
          .map(part =>
            part.startsWith('{{')
              ? `(${part.slice(2, -2)})`
              : "'" + part.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"
          );
        node.attribs.style = mask(`{{smartLynxStyle.decorate(${parts.join(' + ')})}}`);
      }
    }
    node.children = node.children.map(n => visit(n, node));
    const attr = restore(node.attribs?.class || '');
    let ancestor = parent;
    let nested = false;
    while (ancestor) {
      if (['view', 'button', 'scroll-view'].includes(ancestor.name)) nested = true;
      ancestor = ancestor.parent;
    }
    const pseudoHost =
      !pseudoClasses ||
      !nested ||
      [...pseudoClasses].some(name => {
        if (attr.includes(name)) return true;
        const bemName = name.replace(/^smart-/, '').replace(/--.*$/, '');
        return attr.includes(`'${bemName}'`) || attr.includes(`"${bemName}"`);
      });
    if (['view', 'button', 'scroll-view'].includes(node.name) && pseudoHost) {
      for (const kind of ['before', 'after']) {
        const child = new Element(
          'view',
          { class: 'smart-lynx-' + kind, 'aria-hidden': 'true' },
          []
        );
        child.parent = node;
        if (kind === 'before') node.children.unshift(child);
        else node.children.push(child);
      }
    }
    return node;
  }
  doc.children = doc.children.map(n => visit(n, doc));
  return (
    '<wxs src="../lynx-runtime/style.wxs" module="smartLynxStyle"/>\n' +
    restore(serialize(doc, { xmlMode: true, encodeEntities: false }))
  );
}
function styles(input) {
  const tree = postcss.parse(input);
  // Keep the original non-blur overlay fallback. @supports is a browser query,
  // not a runtime capability switch in this compiler.
  tree.walkAtRules('supports', rule => rule.remove());
  tree.walkRules(rule => {
    if (rule.selector.includes('::-webkit-scrollbar')) {
      rule.remove();
      return;
    }
    rule.selector = rule.selector
      .replace(/:first-child\b/g, '.smart-lynx-first')
      .replace(/:last-child\b/g, '.smart-lynx-last')
      .replace(/:empty\b/g, '.smart-lynx-empty');
    if (/::?(before|after)\b/.test(rule.selector)) {
      rule.selector = rule.selector.replace(/::?(before|after)\b/g, ' > .smart-lynx-$1');
      rule.prepend({ prop: 'display', value: 'flex' });
      rule.walkDecls('content', d => d.remove());
    }
    // Lynx has no float layout. Col spans/offsets remain percentages.
    rule.walkDecls('float', d => d.remove());
    rule.walkDecls('clear', d => d.remove());
    rule.walkDecls('display', d => {
      if (['inline-block', 'inline-flex', 'table', 'block'].includes(d.value)) d.value = 'flex';
    });
    rule.walkDecls('box-sizing', d => {
      if (d.value === 'content-box') {
        // Keep it as a known review item; component-specific overrides define
        // the correct border-box dimensions instead of silently shrinking it.
        d.value = 'border-box';
      }
    });
    rule.walkDecls(d => {
      if (d.prop === 'border-left' && rule.selector === '.smart-sidebar-item') {
        d.cloneBefore({
          prop: 'border-left-width',
          value: 'var(--smart-lynx-sidebar-border-width, 3px)',
        });
        d.cloneBefore({ prop: 'border-left-style', value: 'solid' });
        d.cloneBefore({
          prop: 'border-left-color',
          value: 'var(--smart-lynx-sidebar-border-color, transparent)',
        });
        d.remove();
      }
      if (
        /^border-image-/.test(d.prop) &&
        rule.selector.includes('smart-datetime-picker-hairline')
      ) {
        if (d.prop === 'border-image-source')
          rule.append({ prop: '--smart-lynx-picker-edge-image', value: d.value });
        d.remove();
      }
      if (
        /^(-webkit-)?(font-smoothing|text-size-adjust|overflow-scrolling)$/.test(d.prop) ||
        ['text-rendering', 'will-change', 'cursor'].includes(d.prop)
      )
        d.remove();
      if (d.value === 'inherit' && inherited[d.prop])
        d.value = `var(--smart-lynx-${d.prop}, ${inherited[d.prop]})`;
      else if (inherited[d.prop] && !d.value.includes('--smart-lynx-'))
        rule.append({ prop: '--smart-lynx-' + d.prop, value: d.value });
      if (d.prop === 'display' && ['inline', '-webkit-box'].includes(d.value)) d.value = 'flex';
      if (
        [
          '-webkit-box-orient',
          '-webkit-line-clamp',
          '-webkit-appearance',
          '-webkit-tap-highlight-color',
          '-webkit-user-select',
          'user-select',
          'resize',
          'isolation',
        ].includes(d.prop) ||
        d.value.includes('constant(safe-area')
      )
        d.remove();
      if (rule.selector.includes('smart-picker__columns') && /^(?:-webkit-)?mask-/.test(d.prop))
        d.remove();
      if (/^overflow(-[xy])?$/.test(d.prop) && /^(auto|scroll)$/.test(d.value)) d.remove();
      if (
        d.prop === 'background' &&
        /^(#[0-9a-f]+|rgba?\([^)]*\)|transparent|white|black)$/i.test(d.value)
      )
        d.prop = 'background-color';
      if (/^border-(width|style|color)$/.test(d.prop)) {
        const values =
          d.prop === 'border-width' && rule.selector.includes('smart-hairline--top-bottom')
            ? ['1px', '0', '1px', '0']
            : postcss.list.space(d.value);
        if (values.length > 1) {
          const sides = [
            values[0],
            values[1] || values[0],
            values[2] || values[0],
            values[3] || values[1] || values[0],
          ];
          ['top', 'right', 'bottom', 'left'].forEach((side, i) =>
            d.cloneBefore({
              prop: `border-${side}-${d.prop.slice(7)}`,
              value:
                d.prop === 'border-width'
                  ? `var(--smart-lynx-border-${side}-width, ${sides[i]})`
                  : sides[i],
            })
          );
          d.remove();
        }
      }
      if (
        /^border-(top|right|bottom|left)-width$/.test(d.prop) &&
        !d.value.startsWith('var(--smart-lynx-')
      )
        d.value = `var(--smart-lynx-${d.prop}, ${d.value})`;
    });
  });
  const textDefaults = [
    'font-size',
    'line-height',
    'color',
    'font-family',
    'font-weight',
    'text-align',
  ]
    .map(p => `${p}:var(--smart-lynx-${p},${inherited[p]})`)
    .join(';');
  return (
    `.smart-lynx-before,.smart-lynx-after{display:none;pointer-events:none}.smart-lynx-text{${textDefaults};flex-shrink:1}\n` +
    tree.toString()
  );
}
async function prepare() {
  baseline();
  fs.rmSync(path.join(target, '.generated'), { recursive: true, force: true });
  for (const file of files(source).filter(f => !/\/(test|demo)\//.test(f))) {
    const rel = path.relative(source, file);
    const override = path.join(target, 'overrides', rel);
    const selected = fs.existsSync(override) ? override : file;
    write(path.join(staged, rel), fs.readFileSync(selected));
  }
  for (const file of files(path.join(target, 'overrides'))) {
    const rel = path.relative(path.join(target, 'overrides'), file);
    write(path.join(staged, rel), fs.readFileSync(file));
  }
  // Decorate the unchanged logic only inside the isolated compilation tree.
  for (const name of [
    'picker-column',
    'picker',
    'slider',
    'normal-slider',
    'bottom-sheet',
    'icon',
    'image',
    'loading',
    'circle',
    'config-provider',
    'calendar',
    'calendar-month',
  ]) {
    const file = path.join(staged, name, 'index.ts');
    let text = fs.readFileSync(file, 'utf8');
    text = text.replace(/\}\);\s*$/, `}, '${name}');\n`);
    write(file, text);
  }
  const component = path.join(staged, 'common/component.ts');
  let registration = fs.readFileSync(component, 'utf8');
  registration = "import { adapt } from '../lynx-runtime/adapters';\n" + registration;
  registration = registration.replace(
    "    classes: 'externalClasses',",
    "    classes: 'externalClasses',\n    pageLifetimes: 'pageLifetimes',"
  );
  registration = registration.replace(
    '  // add default externalClasses',
    `  options.properties = { ...options.properties, lynxHasDefaultSlot: {type:null,value:null}, lynxSlotNames: {type:null,value:null}, lynxIndex: {type:Number,value:-1}, lynxCount: {type:Number,value:0} } as any;\n  // add default externalClasses`
  );
  registration = registration.replace(
    'smartOptions: SmartComponentOptions<Data, Props, Methods>): void {',
    'smartOptions: SmartComponentOptions<Data, Props, Methods>, lynxKind?: string): void {\n  smartOptions = adapt(lynxKind, smartOptions);'
  );
  write(component, registration);
  const iconDir = path.dirname(require.resolve('@tuya-miniapp/icons/package.json'));
  const icons = {};
  for (const file of files(path.join(iconDir, 'dist/svg')).filter(f => f.endsWith('.js'))) {
    const syntax = ts.createSourceFile(
      file,
      fs.readFileSync(file, 'utf8'),
      ts.ScriptTarget.Latest,
      true
    );
    const statement = syntax.statements.find(
      s => ts.isExportAssignment(s) && ts.isStringLiteral(s.expression)
    );
    if (statement)
      icons[path.basename(file, '.js').replace(/[-_]/g, '').toLowerCase()] =
        statement.expression.text;
  }
  write(
    path.join(staged, 'lynx-runtime/icons.ts'),
    'export const icons: Record<string, string> = ' + JSON.stringify(icons) + ';\n'
  );
  for (const [alias, name] of Object.entries({
    success: 'checkmark',
    fail: 'xmark',
    cross: 'xmark',
    arrow: 'right',
    arrowleft: 'left',
    arrowup: 'up',
    arrowdown: 'down',
    clear: 'xmarkcircle',
    plus: 'plus',
    minus: 'minus',
  })) {
    if (icons[name]) icons[alias] = icons[name];
  }
  write(
    path.join(staged, 'lynx-runtime/icons.ts'),
    'export const icons: Record<string, string> = ' + JSON.stringify(icons) + ';\n'
  );
  const palettes = {};
  for (const name of ['light', 'dark']) {
    const context = { module: { exports: {} } };
    vm.runInNewContext(
      fs.readFileSync(path.join(source, 'config-provider', name + '.wxs'), 'utf8'),
      context
    );
    palettes[name] = context.module.exports;
  }
  write(
    path.join(staged, 'lynx-runtime/palettes.ts'),
    'export const palettes: Record<string, Record<string,string>> = ' +
      JSON.stringify(palettes) +
      ';\n'
  );
  const change = (rel, fn) => {
    const file = path.join(staged, rel);
    write(file, fn(fs.readFileSync(file, 'utf8')));
  };
  change('wxs/utils.wxs', s =>
    s
      .replace(/function queryComponent[\s\S]*?\};/, '')
      .replace('  queryComponent: queryComponent,', '')
  );
  change('slider/index.wxml', s =>
    s.replace(/bind:touchcancel="onTouchEnd"/g, 'bind:touchcancel="onLynxCancel"')
  );
  change('picker/index.wxml', s =>
    s
      .replace(
        'style="{{ computed.columnsStyle({ itemHeight, visibleItemCount, fullHeight }) }}"',
        'style="{{ computed.columnsStyle({ itemHeight, visibleItemCount, fullHeight }) }};z-index:{{lynxLayerReady ? 2 : 0}};opacity:{{lynxLayerReady ? 1 : 0}};"'
      )
      .replace(
        /<view\s+class="smart-picker__columns"/,
        '<view class="smart-picker__viewport" style="{{ computed.columnsStyle({ itemHeight, visibleItemCount, fullHeight }) }}">\n  <view class="smart-picker__columns"'
      )
      .replace(
        '  <include wx:if="{{ toolbarPosition === \'bottom\' }}"',
        '  </view>\n\n  <include wx:if="{{ toolbarPosition === \'bottom\' }}"'
      )
      .replace(
        /(<view\s+class="smart-picker__frame[\s\S]*?)\/>/,
        '$1><view class="smart-picker__edge-top" style="background-color:{{lynxPickerEdgeColor}};background-image:{{lynxPickerEdgeImage}};"/><view class="smart-picker__edge-bottom" style="background-color:{{lynxPickerEdgeColor}};background-image:{{lynxPickerEdgeImage}};"/></view>'
      )
      .replace(
        'style="{{ computed.frameStyle({ itemHeight }) }}"',
        'style="{{ computed.frameStyle({ itemHeight }) }};border-top-width:0;border-bottom-width:0;"'
      )
  );
  change('datetime-picker/index.wxml', s =>
    s.replace('<smart-picker', '<smart-picker lynx-datetime="{{true}}"')
  );
  change(
    'picker/index.less',
    s =>
      s +
      `
.smart-picker__frame > .smart-lynx-after {display:none;}
.smart-picker__viewport {position:relative;width:100%;z-index:0;}
.smart-picker__columns {position:absolute;top:0;left:0;right:0;z-index:2;}
.smart-picker__frame {display:flex;flex-direction:column;justify-content:space-between;}
.smart-picker__edge-top,.smart-picker__edge-bottom {position:relative;width:100%;height:0.5px;flex-shrink:0;background-color:var(--hairline-color, @hairline-color);background-image:var(--smart-lynx-picker-edge-image, none);pointer-events:none;}
:root[data-a11y='true'] .smart-picker__edge-top,:root[data-a11y='true'] .smart-picker__edge-bottom {display:none;}
`
  );
  change('bottom-sheet/index.wxml', s =>
    s
      .replace('change:tick="{{computed.init(curInstanceId, currentHeight)}}"', '')
      .replace(
        'bind:touchstart="{{computed.onDragStart(curInstanceId)}}"',
        'bind:touchstart="onLynxDragStart"'
      )
      .replace(
        'catch:touchmove="{{computed.onDrag(curInstanceId, { maxDragHeight, lockMaxDrag })}}"',
        'catch:touchmove="onLynxDragMove"'
      )
      .replace(
        'bind:touchend="{{computed.onDragEnd(curInstanceId, { maxDragHeight, minDragHeight, windowHeight, midDragHeight, closeDragHeight })}}"',
        'bind:touchend="onLynxDragEnd" bind:touchcancel="onLynxDragCancel"'
      )
      .replace(
        'class="smart-bottom-sheet__content"\n      >',
        'class="smart-bottom-sheet__content" style="height:{{currentHeight || windowHeight / 2}}px;"\n      >'
      )
      .replace('<scroll-view wx:else', '<scroll-view scroll-y="{{true}}" wx:else')
  );
  change(
    'bottom-sheet/index.wxs',
    s =>
      s.slice(0, s.indexOf('function queryComponent')) +
      '\nmodule.exports={getHeight:getHeight,getCustomStyle:getCustomStyle};\n'
  );
  // Date objects stay in the logic layer; WXS consumes serializable parts only.
  change('calendar/calendar.wxml', s =>
    s
      .replace('formatYearTitle(originCurrentDateMonthly,', 'formatYearTitle(lynxCalendarDate,')
      .replace('formatMonthTitle(months[visibleIndex],', 'formatMonthTitle(lynxCalendarDate,')
  );
  change('calendar-month/index.wxml', s =>
    s
      .replace('getMonthStyle(visible, date,', 'getMonthStyle(visible, lynxMonthDate,')
      .replace(
        'getDayStyle(item.type, index, date,',
        'getDayStyle(item.type, index, lynxMonthDate,'
      )
  );
  // Switch uses a single positioning mechanism and explicit border-box totals.
  change(
    'switch/index.less',
    s =>
      s +
      `
.smart-switch { width:calc(var(--switch-width, @switch-width) + var(--switch-padding, @switch-padding) * 2); height:calc(var(--switch-height, @switch-height) + var(--switch-padding, @switch-padding) * 2); }
.smart-switch--label { width:calc(var(--switch-label-width, @switch-label-width) + var(--switch-padding, @switch-padding) * 2); }
.smart-switch__node { left:0; transform:none; }
.smart-switch--on .smart-switch__node { left:calc(100% - var(--switch-node-size, @switch-node-size)); }
`
  );
  change('toast/index.wxml', s =>
    s.replace('z-index: {{ zIndex }}"', 'z-index: {{ zIndex + 1 }}"')
  );
  change('toast/index.less', s =>
    s.replace('right: -1000px;', 'right: auto;').replace('width: fit-content;', 'max-width: 90%;')
  );
  change('popup/popup.wxml', s =>
    s.replace('zIndex, currentDuration', 'zIndex: zIndex + 1, currentDuration')
  );
  change('image/index.wxml', s =>
    s
      .replace(
        "style=\"visibility:{{ tintColor ? 'hidden' : '' }};\"",
        "style=\"visibility:{{ lynxImageMask || lynxImageSvg ? 'hidden' : '' }};\""
      )
      .replace('wx:if="{{ tintColor }}"', 'wx:if="{{ lynxImageMask && !error }}"')
      .replace('computed.maskStyle(src, tintColor)', 'lynxImageMask')
      .replace(
        '  <view\n    wx:if="{{ loading && showLoading }}"',
        '  <svg-render wx:if="{{lynxImageSvg && !error}}" source="{{lynxImageSvg}}" class="image-class smart-image__img smart-image__tint-color" />\n  <view\n    wx:if="{{ loading && showLoading }}"'
      )
  );
  change('image/index.wxs', s =>
    s.replace(/function maskStyle[\s\S]*?return str\n}/, '').replace('  maskStyle: maskStyle', '')
  );
  change(
    'image/index.less',
    s =>
      s +
      '\n.smart-image {z-index:0;}\n.smart-image__tint-color {z-index:1;pointer-events:none;}\n.smart-image__loading,.smart-image__error {z-index:2;}\n'
  );
  change('cell/index.wxml', s =>
    s.replace(
      '  <smart-icon',
      '  <text wx:if="{{required}}" class="smart-lynx-required">*</text>\n  <smart-icon'
    )
  );
  change(
    'cell/index.less',
    s =>
      s +
      '\n.smart-lynx-required {position:absolute;left:var(--padding-xs, @padding-xs);color:var(--cell-required-color, @cell-required-color);font-size:inherit;}\n'
  );
  // Only the two WXS-driven rendering components had DOM mutations. Pure WXS
  // formatting/calendars remain in use, preserving the public date API.
  // No canvas RJS or WXS DOM bridges in the Lynx component graph.
  for (const file of files(staged).filter(f => f.endsWith('.rjs'))) fs.unlinkSync(file);
  const pseudoClasses = new Set();
  for (const file of files(staged).filter(f => f.endsWith('.less'))) {
    const css = (await less.render(fs.readFileSync(file, 'utf8'), { filename: file })).css;
    postcss.parse(css).walkRules(rule => {
      if (/::?(before|after)\b/.test(rule.selector))
        for (const token of rule.selector.match(/\.[\w-]+/g) || [])
          pseudoClasses.add(token.slice(1));
    });
  }
  for (const file of files(staged).filter(f => f.endsWith('.wxml')))
    write(file, template(fs.readFileSync(file, 'utf8'), pseudoClasses));
  return inventory();
}
async function build() {
  const components = await prepare();
  for (const kind of ['dist', 'lib']) {
    const out = path.join(target, kind);
    fs.rmSync(out, { recursive: true, force: true });
    const config = ts.readConfigFile(path.join(root, 'tsconfig.json'), ts.sys.readFile).config;
    const parsed = ts.parseJsonConfigFileContent(config, ts.sys, root);
    const compilerOptions = {
      ...parsed.options,
      paths: { ...parsed.options.paths, 'definitions/*': [path.join(staged, 'definitions/*')] },
      outDir: out,
      rootDir: staged,
      declaration: true,
      module: kind === 'dist' ? ts.ModuleKind.ES2015 : ts.ModuleKind.CommonJS,
      noEmitOnError: true,
    };
    const program = ts.createProgram(
      files(staged).filter(f => /\.ts$/.test(f)),
      compilerOptions
    );
    const errors = ts
      .getPreEmitDiagnostics(program)
      .filter(d => d.category === ts.DiagnosticCategory.Error);
    if (errors.length)
      throw new Error(
        ts.formatDiagnosticsWithColorAndContext(errors, {
          getCanonicalFileName: f => f,
          getCurrentDirectory: () => root,
          getNewLine: () => '\n',
        })
      );
    const emitted = program.emit();
    if (emitted.emitSkipped) throw new Error('Lynx TypeScript emit skipped');
    for (const file of files(staged)) {
      const rel = path.relative(staged, file);
      if (file.endsWith('.less')) {
        const css = styles(
          (await less.render(fs.readFileSync(file, 'utf8'), { filename: file })).css
        );
        const prefix =
          path.dirname(rel) === 'common'
            ? ''
            : `@import '${path
                .relative(path.dirname(rel), 'common/index.css')
                .replace(/\\/g, '/')}';\n`;
        write(path.join(out, rel.replace(/\.less$/, '.css')), prefix + css);
        write(
          path.join(out, rel.replace(/\.less$/, '.wxss')),
          prefix.replace(/\.css'/g, ".wxss'") + css
        );
      } else if (/\.(wxml|wxs|json|tyml|tyss)$/.test(file))
        write(path.join(out, rel), fs.readFileSync(file));
    }
    for (const { name } of components)
      for (const ext of ['css', 'wxss']) {
        const stylesheet = path.join(out, name, 'index.' + ext);
        if (!fs.existsSync(stylesheet)) write(stylesheet, `@import '../common/index.${ext}';\n`);
      }
  }
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json')));
  write(
    path.join(target, 'package.json'),
    JSON.stringify(
      {
        name: pkg.name,
        version: pkg.version,
        miniprogram: 'lib',
        private: true,
        description: 'Isolated Lynx entry; default package remains WebView',
      },
      null,
      2
    )
  );
  write(
    path.join(target, 'build-receipt.json'),
    JSON.stringify(
      {
        base: '45e7e1e',
        builtAt: new Date().toISOString(),
        components: components.map(c => c.name),
        sourceHashes: Object.fromEntries(
          files(staged).map(f => [path.relative(staged, f), sha(fs.readFileSync(f))])
        ),
        runtimeVerified: false,
      },
      null,
      2
    )
  );
  verify();
}
function verify() {
  baseline();
  const rows = JSON.parse(fs.readFileSync(path.join(target, 'components.json'))).components;
  for (const kind of ['dist', 'lib']) {
    const folder = path.join(target, kind);
    for (const { name } of rows)
      for (const ext of ['js', 'json', 'wxml', 'css', 'wxss']) {
        if (!fs.existsSync(path.join(folder, name, 'index.' + ext)))
          throw new Error(`Missing ${kind}/${name}/index.${ext}`);
      }
    for (const file of files(folder)) {
      const rel = path.relative(folder, file);
      if (/\.(js|wxml|wxs|json)$/.test(file)) {
        const text = fs.readFileSync(file, 'utf8');
        if (
          /\.rjs\b|ownerInstance\.callMethod|ownerInstance\.selectComponent|\.setStyle\(/.test(text)
        )
          throw new Error(`WebView render dependency leaked: ${kind}/${rel}`);
        if (file.endsWith('.json')) {
          const config = JSON.parse(text);
          for (const request of Object.values(config.usingComponents || {})) {
            if (request.startsWith('.')) {
              const resolved = path.resolve(path.dirname(file), request + '.json');
              if (!resolved.startsWith(folder + path.sep) || !fs.existsSync(resolved))
                throw new Error(`Invalid Lynx dependency: ${rel}: ${request}`);
            }
          }
        }
      }
      if (/\.(css|wxss)$/.test(file)) {
        postcss.parse(fs.readFileSync(file, 'utf8')).walkRules(rule => {
          if (/::?(before|after)\b/.test(rule.selector))
            throw new Error(`Pseudo element leaked: ${rel}`);
        });
      }
    }
  }
  console.log(
    `Verified ${rows.length} isolated Lynx components; WebView sources and baseline artifacts unchanged. Runtime acceptance remains pending.`
  );
}
if (require.main === module) {
  const command = process.argv[2] || 'build';
  Promise.resolve(
    command === 'build' ? build() : command === 'verify' ? verify() : inventory()
  ).catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}
module.exports = { template, styles, inventory, prepare, verify };
