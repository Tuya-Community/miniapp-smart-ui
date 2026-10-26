const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const less = require('less');
const postcss = require('postcss');
const root = __dirname;

function archiveOutput(output) {
  if (!fs.existsSync(output)) return;
  const resolved = path.resolve(output);
  const allowed = ['dist', 'example/dist', 'fixtures/dist'].map(p => path.join(root, p));
  if (!allowed.includes(resolved)) throw new Error('Refusing to overwrite an existing custom output directory');
  const history = path.join(root, '.dev/history');
  fs.mkdirSync(history, { recursive: true });
  fs.renameSync(resolved, path.join(history, `${path.relative(root, resolved).replace(/\//g, '-')}-${Date.now()}`));
}

// Ray's Tuya adapter discovers .tyml/.sjs/.tyss, while raw MiniApp consumers
// also accept the original WXML bundle. Emit both from the same native source.
function writeTuyaAliases(output) {
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const filename = path.join(dir, entry.name);
      if (entry.isDirectory()) { visit(filename); continue; }
      const relative = path.relative(output, filename).split(path.sep).join('/');
      if (filename.endsWith('.wxml')) {
        const source = fs.readFileSync(filename, 'utf8').replace(/\bwx:/g, 'ty:')
          .replace(/<(\/?)(wxs)\b/g, '<$1sjs').replace(/\.wxs\b/g, '.sjs').replace(/\.wxml\b/g, '.tyml');
        fs.writeFileSync(filename.replace(/\.wxml$/, '.tyml'), source);
      } else if (filename.endsWith('.wxs')) {
        let source = fs.readFileSync(filename, 'utf8').replace(/\.wxs\b/g, '.sjs')
          .replace(/\bgetRegExp\(/g, 'new RegExp(').replace(/(?<![\w.])getDate\(/g, 'new Date(');
        if (/(^|\/)wxs\/array.wxs$/.test(relative)) source = 'module.exports.isArray = Array.isArray;';
        if (/(^|\/)wxs\/object.wxs$/.test(relative)) source = 'module.exports.keys = Object.keys;';
        source = source.replace("'Object' === styles.constructor", "Object.prototype.toString.call(styles) === '[object Object]'");
        fs.writeFileSync(filename.replace(/\.wxs$/, '.sjs'), source);
      } else if (filename.endsWith('.css')) {
        fs.writeFileSync(filename.replace(/\.css$/, '.tyss'), fs.readFileSync(filename, 'utf8').replace(/\.css\b/g, '.tyss'));
      }
    }
  }
  visit(output);
}

async function build(output = path.join(root, 'dist'), { includeDemos = false } = {}) {
  archiveOutput(output);
  const source = path.join(root, 'packages');
  const plugins = [require('autoprefixer')(), require('cssnano')()];
  async function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const filename = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'demo' || includeDemos) await visit(filename);
        continue;
      }
      const relative = path.relative(source, filename);
      const target = path.join(output, relative);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      if (filename.endsWith('.d.ts')) continue;
      if (filename.endsWith('.ts')) {
        const result = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
          fileName: filename,
          compilerOptions: { target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS },
          reportDiagnostics: true,
        });
        const errors = (result.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error);
        if (errors.length) throw new Error(ts.formatDiagnosticsWithColorAndContext(errors, {
          getCurrentDirectory: () => root, getCanonicalFileName: f => f, getNewLine: () => '\n',
        }));
        fs.writeFileSync(target.replace(/\.ts$/, '.js'), result.outputText);
      } else if (filename.endsWith('.less')) {
        const rendered = await less.render(fs.readFileSync(filename, 'utf8'), { filename });
        const result = await postcss(plugins).process(rendered.css, { from: filename });
        const importPath = path.relative(path.dirname(target), path.join(output, 'common/index.css')).split(path.sep).join('/');
        const common = relative.startsWith('common' + path.sep) ? '' : `@import '${importPath}';`;
        fs.writeFileSync(target.replace(/\.less$/, '.css'), common + result.css);
        fs.writeFileSync(target.replace(/\.less$/, '.wxss'), common.replace('index.css', 'index.wxss') + result.css);
      } else if (filename.endsWith('.json')) {
        fs.writeFileSync(target, fs.readFileSync(filename, 'utf8').replace(/\/example(?=\/components\/demo-block\/index)/g, ''));
      } else if (filename.endsWith('.wxml') && relative.split(path.sep).includes('demo')) {
        fs.writeFileSync(target, require('./prepare-example.cjs').nativeText(fs.readFileSync(filename, 'utf8')));
      } else {
        fs.copyFileSync(filename, target);
      }
    }
  }
  await visit(source);
  writeTuyaAliases(output);
  fs.copyFileSync(path.join(root, '../LICENSE'), path.join(root, 'LICENSE'));
  return output;
}
if (require.main === module) build(process.argv[2]).then(p => console.log('Built Lynx components:', p)).catch(e => { console.error(e); process.exitCode = 1; });
module.exports = { build, archiveOutput, writeTuyaAliases };
