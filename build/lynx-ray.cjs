/* Local integration adapter, generated from the consumer's read-only Ray
 * wrapper. This is not a replacement source checkout of ray-smart-ui. */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
let out = path.join(root, 'lynx/ray');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function files(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap(e => (e.isDirectory() ? files(path.join(dir, e.name)) : [path.join(dir, e.name)]));
}
function write(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, data);
}
function named(text) {
  const file = ts.createSourceFile('index.js', text, ts.ScriptTarget.Latest, true);
  return file.statements
    .filter(ts.isExportDeclaration)
    .filter(s => s.moduleSpecifier && s.exportClause && ts.isNamedExports(s.exportClause))
    .map(s => ({
      request: s.moduleSpecifier.text,
      names: s.exportClause.elements.map(e => e.name.text),
    }));
}
function main(wrapperRoot, options = {}) {
  const original = path.resolve(wrapperRoot);
  const pkg = JSON.parse(fs.readFileSync(path.join(original, 'package.json')));
  if (pkg.name !== '@ray-js/smart-ui')
    throw Error('SMART_UI_RAY_WRAPPER_ROOT must point at @ray-js/smart-ui');
  if (!fs.existsSync(path.join(root, 'lynx/dist/icon/index.js')))
    throw Error('Run yarn build:lynx first');
  out = path.resolve(options.outputRoot || process.env.SMART_UI_RAY_OUTPUT_ROOT || out);
  if (
    fs.existsSync(out) &&
    fs.readdirSync(out).length &&
    !fs.existsSync(path.join(out, 'adapter-receipt.json'))
  )
    throw Error('Refusing to replace a directory not created by this generator: ' + out);
  const sliderRoot =
    options.sliderRoot ||
    process.env.SMART_UI_TY_SLIDER_ROOT ||
    path.dirname(
      require.resolve('@ray-js/components-ty-slider/package.json', {
        paths: [path.resolve(original, '../../..')],
      })
    );
  const sliderPkg = JSON.parse(fs.readFileSync(path.join(sliderRoot, 'package.json')));
  if (sliderPkg.version !== '0.3.10-beta.3')
    throw Error(
      'Lynx adapter requires @ray-js/components-ty-slider@0.3.10-beta.3, got ' + sliderPkg.version
    );
  const sliderEntry = path.join(sliderRoot, sliderPkg.module || sliderPkg.main || 'lib/index.js');
  fs.rmSync(out, { force: true, recursive: true });
  for (const kind of ['dist', 'lib'])
    fs.cpSync(path.join(root, 'lynx', kind), path.join(out, 'native-package', kind), {
      recursive: true,
    });
  write(
    path.join(out, 'native-package/package.json'),
    JSON.stringify({
      name: '@tuya/miniapp-smart-ui',
      version: JSON.parse(fs.readFileSync(path.join(root, 'package.json'))).version,
      miniprogram: 'lib',
      private: true,
    })
  );
  const originalHashes = {};
  for (const kind of ['es', 'lib'])
    for (const file of files(path.join(original, kind))) {
      const rel = path.relative(original, file);
      const data = fs.readFileSync(file);
      originalHashes[rel] = hash(data);
      write(path.join(out, 'webview', rel), data);
      const dest = path.join(out, 'native', rel);
      let text = data;
      if (/\.(js|ts)$/.test(file)) {
        text = data
          .toString()
          .replace(
            /@tuya(?:-miniapp\/smart-ui|\/miniapp-smart-ui)\/(dist|lib)\/([^'"\s)]+)/g,
            (_, format, request) => {
              let relPath = path
                .relative(path.dirname(dest), path.join(out, 'native-package', format, request))
                .replace(/\\/g, '/');
              if (!relPath.startsWith('.')) relPath = './' + relPath;
              return relPath;
            }
          )
          .replace(/(['"])@ray-js\/components-ty-slider\1/g, JSON.stringify(sliderEntry));
      }
      write(dest, text);
    }
  const api = named(fs.readFileSync(path.join(original, 'es/index.js'), 'utf8'));
  const ui = api.flatMap(g => g.names.filter(n => /^[A-Z]/.test(n) && !n.endsWith('Instance')));
  for (const kind of ['es', 'lib']) {
    for (const file of files(path.join(original, kind)).filter(
      f => f.endsWith('.d.ts') || f.includes(`${path.sep}base${path.sep}`)
    )) {
      write(
        path.join(out, kind, path.relative(path.join(original, kind), file)),
        fs.readFileSync(file)
      );
    }
    for (const group of api) {
      const dir = group.request.replace(/^\.\//, '');
      const definitions = group.names.map(name => {
        if (!ui.includes(name)) return `export { ${name} } from '../../webview/${kind}/${dir}';`;
        const extra =
          name === 'Slider'
            ? `\n${name}.RangeSlider = select(WebView.${name}.RangeSlider, Native.${name}.RangeSlider);`
            : '';
        return `export const ${name} = select(WebView.${name}, Native.${name}, ${JSON.stringify(
          name
        )});${extra}`;
      });
      const sliderImport = group.names.includes('Slider')
        ? `import { resolveTySliderProps } from '../../native-package/${kind === 'es' ? 'dist' : 'lib'}/lynx-runtime/ty-slider-props';\n`
        : '';
      const componentProps = group.names.includes('Slider')
        ? "const componentProps = renderMode === 'lynx' && name === 'Slider' ? resolveTySliderProps(rest) : rest;"
        : 'const componentProps = rest;';
      const source = `import React from 'react';\n${sliderImport}import * as WebView from '../../webview/${kind}/${dir}';\nimport * as Native from '../../native/${kind}/${dir}';\nfunction select(webview, lynx, name) {\n  const Result = React.forwardRef(function SmartUIRenderer(props, ref) {\n    const { renderMode = 'webview', ...rest } = props;\n    const Component = renderMode === 'lynx' ? lynx : webview;\n    ${componentProps}\n    const metadata = renderMode === 'lynx' ? {lynxHasDefaultSlot: React.Children.toArray(rest.children).some(child => child !== ''), lynxSlotNames: Object.keys(rest.slot || {}).filter(key => React.isValidElement(rest.slot[key]))} : {};\n    return React.createElement(Component, { ...componentProps, ...metadata, ...(ref == null ? {} : { ref }), ...(renderMode === 'lynx' && name === 'Slider' ? { renderMode: 'lynx' } : {}) });\n  });\n  Result.displayName = 'SmartUIRenderer(' + (name || 'Component') + ')';\n  return Result;\n}\n${definitions.join(
        '\n'
      )}\n`;
      write(
        path.join(out, kind, dir, 'index.js'),
        kind === 'es'
          ? source
          : ts.transpileModule(source, {
              compilerOptions: {
                allowJs: true,
                module: ts.ModuleKind.CommonJS,
                esModuleInterop: true,
                target: ts.ScriptTarget.ES2018,
              },
            }).outputText
      );
      const types = group.names
        .filter(name => ui.includes(name))
        .map(
          name =>
            `export declare const ${name}: React.FC<React.ComponentProps<typeof Original.${name}> & {renderMode?: 'webview' | 'lynx'}>${
              name === 'Slider'
                ? " & { RangeSlider: React.FC<React.ComponentProps<typeof Original.Slider.RangeSlider> & {renderMode?: 'webview' | 'lynx'}> }"
                : ''
            };`
        )
        .join('\n');
      write(
        path.join(out, kind, dir, 'index.d.ts'),
        `import * as React from 'react';\nimport * as Original from '../../webview/${kind}/${dir}';\nexport * from '../../webview/${kind}/${dir}';\n${types}\n`
      );
    }
    const extra = `\nexport { ToastInstance as LynxToastInstance } from '../native/${kind}/toast';\nexport { DialogInstance as LynxDialogInstance } from '../native/${kind}/dialog';\nexport { NotifyInstance as LynxNotifyInstance } from '../native/${kind}/notify';\n`;
    const index =
      api.map(g => `export { ${g.names.join(', ')} } from '${g.request}';`).join('\n') + extra;
    write(
      path.join(out, kind, 'index.js'),
      kind === 'es'
        ? index
        : ts.transpileModule(index, { compilerOptions: { module: ts.ModuleKind.CommonJS } })
            .outputText
    );
    write(
      path.join(out, kind, 'index.d.ts'),
      fs.readFileSync(path.join(original, kind, 'index.d.ts'), 'utf8') + extra
    );
    for (const instance of ['toast', 'dialog', 'notify']) {
      const text = `export * from '../${instance}';\n`;
      write(
        path.join(out, kind, `${instance}-instance/index.js`),
        kind === 'es'
          ? text
          : ts.transpileModule(text, { compilerOptions: { module: ts.ModuleKind.CommonJS } })
              .outputText
      );
      write(path.join(out, kind, `${instance}-instance/index.d.ts`), text);
      const symbol = instance[0].toUpperCase() + instance.slice(1) + 'Instance';
      const explicit = `export {${symbol} as Lynx${symbol}} from '../../native/${kind}/${instance}';\n`;
      write(
        path.join(out, kind, `lynx-${instance}-instance/index.js`),
        kind === 'es'
          ? explicit
          : ts.transpileModule(explicit, { compilerOptions: { module: ts.ModuleKind.CommonJS } })
              .outputText
      );
      write(path.join(out, kind, `lynx-${instance}-instance/index.d.ts`), explicit);
    }
    write(
      path.join(out, kind, 'date-time-picker/index.js'),
      kind === 'es'
        ? "export * from '../datetime-picker';\n"
        : "module.exports = require('../datetime-picker');\n"
    );
    // Auto-import is the original transformation; it resolves to our per-entry
    // dispatcher when the consumer opts into this adapter's package alias.
    for (const file of files(path.join(original, kind, 'auto-import')))
      write(
        path.join(
          out,
          kind,
          'auto-import',
          path.relative(path.join(original, kind, 'auto-import'), file)
        ),
        fs.readFileSync(file)
      );
  }
  write(
    path.join(out, 'package.json'),
    JSON.stringify(
      {
        name: pkg.name,
        version: pkg.version,
        private: true,
        main: 'lib/index.js',
        module: 'es/index.js',
        typings: 'es/index.d.ts',
        peerDependencies: {
          react: '^17.0.2',
          '@ray-js/components-ty-slider': '0.3.10-beta.3',
          '@tuya-miniapp/smart-ui': pkg.dependencies['@tuya-miniapp/smart-ui'],
        },
      },
      null,
      2
    )
  );
  for (const [rel, expected] of Object.entries(originalHashes))
    if (hash(fs.readFileSync(path.join(original, rel))) !== expected)
      throw Error('Read-only wrapper was modified');
  write(
    path.join(out, 'adapter-receipt.json'),
    JSON.stringify(
      {
        wrapperVersion: pkg.version,
        tySliderVersion: sliderPkg.version,
        wrapperHashes: originalHashes,
        modeDefault: 'webview',
        explicitLynx: ui,
        runtimeVerified: false,
      },
      null,
      2
    )
  );
  console.log(
    `Generated ${ui.length} explicit renderMode adapters; default WebView, untouched original wrapper ${pkg.version}`
  );
}
if (require.main === module) main(process.env.SMART_UI_RAY_WRAPPER_ROOT || process.argv[2] || '');
module.exports = { main };
