const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
function sourceModule(file, imports = {}, globals = {}) {
  const source = fs.readFileSync(path.join(root, 'overrides', file), 'utf8');
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const result = { exports: {} };
  const context = {
    module: result,
    exports: result.exports,
    require: name => {
      if (!(name in imports)) throw Error('Unmocked module ' + name);
      return imports[name];
    },
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    ...globals,
  };
  vm.runInNewContext(code, context, { filename: file });
  return result.exports;
}
const model = sourceModule('lynx-runtime/model.ts');

module.exports = { sourceModule, model };
