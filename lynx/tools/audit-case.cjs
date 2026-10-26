const { execFile, spawn } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const run = promisify(execFile);
const root = path.resolve(__dirname, '../..');
const audit = path.join(root, '.clix/test/e2e_temp/20261026-component-audit');
const [component, rawSection] = process.argv.slice(2);
const section = Number(rawSection);
const cases = JSON.parse(fs.readFileSync(path.join(audit, 'native-project/audit-sections.json')));
const item = cases.find(c => c.component === component && c.section === section);
if (!item) throw new Error('Unknown audit section');
const key = `${component}-${section}`;
const url = `/${item.route}?section=${section}`;
const native = `tuyaSmart://miniApp?url=${encodeURIComponent(`godzilla://tysncznjawnyjkyean${url}`)}`;
const simulator = '43B738B1-1678-46A1-ABBF-107BC9C69736';
const base = ['--env', 'headless', '--cdp-port', '9347', '--quiet'];
(async () => {
  const listed = JSON.parse((await run('clix', ['headless', 'list', '--json', '--quiet'])).stdout);
  const prior = listed.find(x => x.cdpPort === 9347);
  if (prior && prior.projectRoot !== path.join(audit, 'web-project')) throw new Error('CDP 9347 belongs to another project');
  if (prior) await run('clix', ['headless', 'stop', '9347', '--quiet']);
  // A cold JS VM for each original case prevents legacy relation state from
  // leaking between repeated reLaunch calls. Use the public headless CLI only.
  const child = spawn('clix', ['headless', 'serve', '--project', path.join(audit, 'web-project'),
    '--route', url.slice(1), '--cdp-port', '9347', '--product-port', '5023', '--lang', 'zh',
    '--theme', 'light', '--framework-version', '2.32.4', '--screen-width', '393',
    '--screen-height', '852', '--dpr', '3', '--no-fetch-functional', '--no-auto-build',
    '--no-wait-auth', '--quiet'], { env: { ...process.env,
      CLIX_MINIPACK_BIN: '/Applications/Tuya MiniApp IDE.app/Contents/Resources/app/node_modules/@tuya-miniapp/minipack/bin/minipack-watch.js',
      CLIX_WEBSHELL_DIR: '/Applications/Tuya MiniApp IDE.app/Contents/Resources/app/node_modules/@tuya-miniapp/webshell/dist',
    }, stdio: ['ignore', 'pipe', 'pipe'] });
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Original headless startup did not become ready')), 45000);
    const read = chunk => {
      if (chunk.toString().includes('会话就绪')) { clearTimeout(timeout); resolve(); }
    };
    child.stdout.on('data', read);
    child.stderr.on('data', () => {});
    child.once('exit', code => { clearTimeout(timeout); reject(new Error(`Headless exited: ${code}`)); });
  });
  // Caller closes the prior native miniapp before this command. Both engines
  // receive exactly the same route and the same original demo section.
  await run('xcrun', ['simctl', 'openurl', simulator, native]);
  await Promise.all([
    run('clix', ['design', 'capture-miniapp', '-o', path.join(audit, `screenshots/web-${key}.png`), ...base]),
    run('clix', ['design', 'get-dom-snapshot', '-o', path.join(audit, `data/web-${key}.json`), ...base]),
  ]);
  await run('xcrun', ['simctl', 'io', simulator, 'screenshot', path.join(audit, `screenshots/device-${key}.png`)]);
  console.log(JSON.stringify({ ...item, key, web: `screenshots/web-${key}.png`, native: `screenshots/device-${key}.png` }));
})().catch(e => { console.error(String(e.message).slice(0, 800)); process.exitCode = 1; });
