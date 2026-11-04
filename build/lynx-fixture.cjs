// Complete component graph for the real MiniPack native compiler. No device DP.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const root = path.resolve(__dirname, '..');
const fixture = path.join(root, 'lynx/.generated/compiler-fixture');
const rows = JSON.parse(fs.readFileSync(path.join(root, 'lynx/components.json'))).components;
if (!fs.existsSync(path.join(root, 'lynx/dist/icon/index.js')))
  throw Error('Run yarn build:lynx first');
fs.mkdirSync(path.join(fixture, 'pages/index'), { recursive: true });
fs.cpSync(path.join(root, 'lynx/dist'), path.join(fixture, 'components/smart'), {
  recursive: true,
});
const write = (rel, value) =>
  fs.writeFileSync(
    path.join(fixture, rel),
    typeof value === 'string' ? value : JSON.stringify(value, null, 2)
  );
write('app.json', {
  pages: ['pages/index/index'],
  window: { navigationBarTitleText: 'Smart UI Lynx' },
});
write('app.js', 'App({});\n');
write('app.wxss', 'page{font-size:14px;background-color:#f7f8fa;color:#323233}\n');
write('pages/index/index.json', {
  renderer: 'native',
  usingComponents: Object.fromEntries(
    rows.map(c => ['smart-' + c.name, '/components/smart/' + c.name + '/index'])
  ),
});
write(
  'pages/index/index.js',
  `Page({data:{theme:'light',show:true,now:Date.now(),columns:[{values:['A','B','C']},{values:['1','2','3']}],}});`
);
// Every component is reachable by the compiler. The demo keeps complex relation
// families in their proper parent and does not invoke device/network actions.
const visible = `<smart-config-provider theme="{{theme}}"><view><smart-cell title="Lynx" value="Smart UI" is-link/><smart-switch checked="{{true}}"/><smart-loading/><smart-loading type="spinner"/><smart-icon name="Left" size="24"/><smart-picker columns="{{columns}}"/><smart-datetime-picker value="{{now}}" type="time"/><smart-slider range="{{false}}" value="{{50}}"/><smart-normal-slider value="{{50}}" show-steps="{{true}}" step="{{10}}"/><smart-circle percent="{{65}}"/><smart-row><smart-col span="12"><smart-button>Left</smart-button></smart-col><smart-col span="12"><smart-button>Right</smart-button></smart-col></smart-row><smart-calendar poppable="{{false}}" show="{{true}}"/><smart-tabs active="{{0}}"><smart-tab title="A">A</smart-tab><smart-tab title="B">B</smart-tab></smart-tabs></view></smart-config-provider>`;
write(
  'pages/index/index.wxml',
  visible + rows.map(c => `<smart-${c.name} wx:if="{{false}}"/>`).join('\n')
);
const compiler = process.env.SMART_UI_MINIPACK_ROOT;
if (!compiler) {
  console.log('Fixture prepared:', fixture);
  process.exit(0);
}
const project = {
  name: 'smart-ui-lynx-fixture',
  projectId: JSON.parse(fs.readFileSync(path.join(root, 'project.tuya.json'))).projectId,
  miniprogramRoot: '.',
  baseversion: '2.30.23',
  type: 'panel-app',
  i18n: false,
  dependencies: { BaseKit: '3.0.0', MiniKit: '3.0.1', BizKit: '4.12.1' },
};
write('project.tuya.json', project);
const result = spawnSync(
  process.execPath,
  [
    path.join(compiler, 'bin/minipack.js'),
    'build',
    fixture,
    '--source-type',
    'wx',
    '--project-json-text',
    JSON.stringify(project),
    '--resolve-dir',
    path.join(root, 'node_modules'),
    '--renderer',
    'native',
    '-o',
    path.join(root, 'lynx/.generated/compiler-output'),
  ],
  { stdio: 'inherit' }
);
if (result.error) throw result.error;
const output = path.join(root, 'lynx/.generated/compiler-output/miniprogram');
if (
  result.status === 0 &&
  (!fs.existsSync(path.join(output, 'app-config.json')) ||
    !fs.readdirSync(output).some(name => name.endsWith('.lynx.bundle')))
)
  throw Error('Compiler returned without native artifacts; see original compiler log');
process.exitCode = result.status ?? 1;
