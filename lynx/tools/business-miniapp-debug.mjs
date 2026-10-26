#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  statSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import { createInterface } from 'node:readline/promises';

const DEFAULT_MINIMUM_VERSION = '1.3.3';
const DEFAULTS = {
  iosSimulatorBundleId: 'com.tuya.smart',
  iosSimulatorScheme: 'tuyaSmart',
  iosDeviceBundleId: 'com.tuya.smartiot.Hoc',
  iosDeviceScheme: 'tuyasmartiot',
  androidBundleId: 'com.tuya.smartiot',
  androidScheme: 'tuyasmartiot',
};

class ToolError extends Error {}

function fail(message) {
  throw new ToolError(message);
}

function quote(value) {
  const text = String(value);
  return /^[A-Za-z0-9_./:@%+=,-]+$/.test(text)
    ? text
    : `'${text.replaceAll("'", "'\\''")}'`;
}

function printCommand(command, args) {
  console.log(`$ ${[command, ...args].map(quote).join(' ')}`);
}

function run(
  command,
  args,
  { allowFailure = false, capture = false, dryRun = false, quiet = false } = {},
) {
  if (!quiet) printCommand(command, args);
  if (dryRun) return { code: 0, stdout: '', stderr: '' };

  const result = spawnSync(command, args, {
    encoding: 'utf8',
    stdio: capture ? ['inherit', 'pipe', 'pipe'] : 'inherit',
  });
  if (result.error) {
    fail(`${command} 执行失败：${result.error.message}`);
  }
  const output = {
    code: result.status ?? 1,
    stdout: String(result.stdout ?? ''),
    stderr: String(result.stderr ?? ''),
  };
  if (!allowFailure && output.code !== 0) {
    const detail = (output.stderr || output.stdout).trim();
    fail(`${command} 执行失败${detail ? `：\n${detail}` : ''}`);
  }
  return output;
}

function commandPath(command) {
  if (command.includes('/')) return existsSync(command) ? command : undefined;
  const path = process.env.PATH ?? '';
  return path
    .split(delimiter)
    .filter(Boolean)
    .map(directory => join(directory, command))
    .find(candidate => existsSync(candidate));
}

function commandExists(command) {
  return Boolean(commandPath(command));
}

function readValue(args, index, option) {
  const value = args[index + 1];
  if (!value || value.startsWith('--')) fail(`${option} 缺少参数`);
  return value;
}

export function parseArgs(argv) {
  const args = [...argv];
  const command = args.shift() ?? 'help';
  if (!['check', 'doctor', 'push', 'reopen', 'help'].includes(command)) {
    fail(`未知命令：${command}`);
  }

  const options = {
    appId: undefined,
    bundleId: undefined,
    cold: false,
    confirmGlobal: false,
    device: undefined,
    dryRun: false,
    ensureDependencies: true,
    globalMiniprogram: false,
    iosBackend: undefined,
    minimumVersion: DEFAULT_MINIMUM_VERSION,
    miniDevCli: 'mini-dev-cli',
    noOpen: false,
    openPath: undefined,
    openScheme: undefined,
    openUrl: undefined,
    packageDir: undefined,
    platform: 'ios',
    registry: 'https://registry-npm.tuya-inc.top',
    runtime: 'simulator',
    simulator: undefined,
  };
  let runtimeExplicit = false;

  const valueOptions = new Map([
    ['--app-id', 'appId'],
    ['--bundle-id', 'bundleId'],
    ['--device', 'device'],
    ['--ios-backend', 'iosBackend'],
    ['--minimum-version', 'minimumVersion'],
    ['--mini-dev-cli', 'miniDevCli'],
    ['--open-path', 'openPath'],
    ['--open-scheme', 'openScheme'],
    ['--open-url', 'openUrl'],
    ['--package-dir', 'packageDir'],
    ['--platform', 'platform'],
    ['--registry', 'registry'],
    ['--runtime', 'runtime'],
    ['--simulator', 'simulator'],
  ]);

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--cold') options.cold = true;
    else if (arg === '--confirm-global') options.confirmGlobal = true;
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--ensure-dependencies') options.ensureDependencies = true;
    else if (arg === '--no-install') options.ensureDependencies = false;
    else if (arg === '--global-miniprogram') options.globalMiniprogram = true;
    else if (arg === '--no-open') options.noOpen = true;
    else if (valueOptions.has(arg)) {
      options[valueOptions.get(arg)] = readValue(args, index, arg);
      if (arg === '--runtime') runtimeExplicit = true;
      index += 1;
    } else fail(`未知参数：${arg}`);
  }

  options.platform = options.platform.toLowerCase();
  options.runtime = options.runtime.toLowerCase();
  if (options.device && !runtimeExplicit && options.platform === 'ios') {
    options.runtime = 'device';
  }
  if (!['ios', 'android'].includes(options.platform)) {
    fail(`--platform 只支持 ios 或 android：${options.platform}`);
  }
  if (!['simulator', 'device'].includes(options.runtime)) {
    fail(`--runtime 只支持 simulator 或 device：${options.runtime}`);
  }
  if (options.platform === 'ios' && options.runtime === 'device' && options.simulator) {
    fail('iOS 真机不能同时指定 --simulator');
  }
  if (options.platform === 'ios' && options.runtime === 'simulator' && options.device) {
    fail('iOS 模拟器不能同时指定 --device');
  }
  if (options.iosBackend !== undefined) {
    options.iosBackend = options.iosBackend.trim().toLowerCase();
    if (options.platform !== 'ios' || options.runtime !== 'device') {
      fail('--ios-backend 仅适用于 iOS 真机');
    }
    if (!['pymobiledevice3', 'devicectl'].includes(options.iosBackend)) {
      fail('--ios-backend 只支持 pymobiledevice3 或 devicectl');
    }
  }
  if (options.openUrl && (options.openPath || options.openScheme)) {
    fail('--open-url 已是完整链接，不能再与 --open-path 或 --open-scheme 同时使用');
  }
  return { command, options };
}

function parseVersion(value, label) {
  const match = String(value).match(/(\d+)\.(\d+)\.(\d+)/);
  if (!match) fail(`无法解析${label}版本：${value}`);
  return match.slice(1).map(Number);
}

function compareVersions(left, right) {
  for (let index = 0; index < 3; index += 1) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return 0;
}

function checkVersion(options, repaired = false) {
  if (!commandExists('bun')) {
    fail('mini-dev-cli 1.3.3 需要 Bun >= 1.0；请先按 Bun 官方安装说明安装并加入 PATH。');
  }
  const bunVersion = run('bun', ['--version'], { capture: true, quiet: true }).stdout.trim();
  if (compareVersions(parseVersion(bunVersion, ' Bun '), [1, 0, 0]) < 0) {
    fail(`Bun ${bunVersion} 不满足 >= 1.0，请先升级 Bun。`);
  }
  if (!/^\d+\.\d+\.\d+$/.test(options.minimumVersion)) {
    fail('--minimum-version 必须指定稳定版 x.y.z，不能使用 harmony/beta 等预发布版本');
  }
  if (compareVersions(parseVersion(options.minimumVersion, '最低要求'),
    parseVersion(DEFAULT_MINIMUM_VERSION, '支持版本')) < 0) {
    fail(`最低版本不能低于 ${DEFAULT_MINIMUM_VERSION}，否则不包含本流程依赖的 Xcode 兼容修复。`);
  }
  const install = () => {
    if (!options.ensureDependencies || options.dryRun || repaired) return false;
    console.log(`正在安装或升级 mini-dev-cli 到 ${options.minimumVersion}…`);
    const currentPath = commandPath(options.miniDevCli);
    const installer = currentPath && realpathSync(currentPath).includes('/install/global/node_modules/')
      ? 'bun' : commandExists('npm') ? 'npm' : 'bun';
    run(installer, ['install', '-g', `@tuya-miniapp/mini-dev-cli@${options.minimumVersion}`,
      `--registry=${options.registry}`]);
    checkVersion(options, true);
    return true;
  };
  if (!commandExists(options.miniDevCli)) {
    if (options.miniDevCli === 'mini-dev-cli' && install()) return;
    fail(`未找到 ${options.miniDevCli}，请先运行 make business-debug-setup`);
  }
  const currentText = run(options.miniDevCli, ['--version'], {
    capture: true,
  }).stdout.trim();
  const current = parseVersion(currentText, ' mini-dev-cli ');
  const minimum = parseVersion(options.minimumVersion, '最低要求');
  if (compareVersions(current, minimum) < 0 || /\d+\.\d+\.\d+-/.test(currentText)) {
    if (options.miniDevCli === 'mini-dev-cli' && install()) return;
    fail(
      `当前 PATH 中的 mini-dev-cli ${currentText} 未满足稳定版最低要求 ${options.minimumVersion}（含 Xcode 兼容修复）。请升级；若已安装新版，请用 command -v mini-dev-cli 检查旧可执行文件是否遮蔽新版。`,
    );
  }
  console.log(`mini-dev-cli ${currentText} 已满足 >= ${options.minimumVersion}`);
}

function assertPackage(options) {
  if (!options.packageDir) fail('业务包操作必须传 --package-dir <目录>');
  if (!existsSync(options.packageDir) || !statSync(options.packageDir).isDirectory()) {
    fail(`业务包目录不存在：${options.packageDir}`);
  }
  for (const name of ['app-service.json', 'app-config.json']) {
    if (!existsSync(join(options.packageDir, name))) {
      fail(`业务包缺少 ${name}：${options.packageDir}`);
    }
  }
}

function effectiveBundleId(options) {
  if (options.bundleId) return options.bundleId;
  if (options.platform === 'android') return DEFAULTS.androidBundleId;
  return options.runtime === 'device'
    ? DEFAULTS.iosDeviceBundleId
    : DEFAULTS.iosSimulatorBundleId;
}

function targetArgs(options) {
  const args = ['--platform', options.platform];
  if (options.platform === 'ios') {
    if (options.runtime === 'device') {
      args.push('--device');
      if (options.device) args.push(options.device);
      if (options.iosBackend) args.push('--ios-backend', options.iosBackend);
    } else if (options.simulator) args.push('--simulator', options.simulator);
  } else if (options.device) args.push('--device', options.device);
  args.push('--bundle-id', effectiveBundleId(options));
  return args;
}

function parseDevices(json) {
  return (json.result?.devices ?? [])
    .map(device => ({
      identifier: String(device?.identifier ?? ''),
      udid: String(device?.hardwareProperties?.udid ?? ''),
      name: String(device?.deviceProperties?.name ?? device?.identifier ?? '?'),
      osVersion: String(device?.deviceProperties?.osVersionNumber ?? ''),
      pairingState: String(device?.connectionProperties?.pairingState ?? 'unknown'),
      transportType: String(device?.connectionProperties?.transportType ?? 'unknown'),
      tunnelState: String(device?.connectionProperties?.tunnelState ?? 'unknown'),
    }))
    .filter(device => device.identifier);
}

function devicectlJson(args, { quiet = false } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'business-mini-device-'));
  const output = join(root, 'result.json');
  try {
    run('xcrun', ['devicectl', ...args, '--json-output', output], {
      capture: true,
      quiet,
    });
    return JSON.parse(readFileSync(output, 'utf8'));
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
}

function listDevices(options) {
  return parseDevices(devicectlJson(['list', 'devices'], options));
}

function describeDevice(device) {
  const version = device.osVersion ? ` · iOS ${device.osVersion}` : '';
  const transport = device.transportType !== 'unknown' ? `, ${device.transportType}` : '';
  return `${device.name}${version} (${device.identifier}, ${device.tunnelState}/${device.pairingState}${transport})`;
}

function preferredDeviceCandidates(devices) {
  const connected = devices.filter(device => device.tunnelState === 'connected');
  if (connected.length) return connected;
  const paired = devices.filter(device => device.pairingState === 'paired');
  const wired = paired.filter(device => device.transportType === 'wired');
  return wired.length ? wired : paired;
}

function selectRequestedDevice(devices, requested) {
  const normalized = requested.toLowerCase();
  const matches = devices.filter(
    device =>
      device.identifier.toLowerCase() === normalized ||
      device.udid?.toLowerCase() === normalized ||
      device.name.toLowerCase() === normalized,
  );
  if (matches.length !== 1) {
    fail(
      `${matches.length ? '设备名称不唯一，请改传唯一 ID' : '找不到真机'} ${requested}。当前设备：\n${devices.map(describeDevice).join('\n') || '(无)'}`,
    );
  }
  return matches[0];
}

async function chooseDevice(devices, requested) {
  if (requested) return selectRequestedDevice(devices, requested);
  const candidates = preferredDeviceCandidates(devices);
  if (!candidates.length) fail('没有找到已配对真机，请连接、解锁并信任此电脑。');
  if (candidates.length === 1) return candidates[0];
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    fail(
      [
        '检测到多台同优先级真机，但当前环境不能交互选择。',
        ...candidates.map(describeDevice),
        '请传 DEVICE=<Identifier>；直接调用脚本时使用 --device <Identifier>。',
      ].join('\n'),
    );
  }

  console.log('检测到多台同优先级真机，请选择：');
  candidates.forEach((device, index) => {
    console.log(`  ${index + 1}. ${describeDevice(device)}`);
  });
  const readline = createInterface({ input: process.stdin, output: process.stdout });
  try {
    while (true) {
      const answer = await readline.question(
        `请输入编号 [1-${candidates.length}]（下次可传 DEVICE=<Identifier>）：`,
      );
      if (/^\d+$/.test(answer.trim())) {
        const index = Number(answer.trim()) - 1;
        if (index >= 0 && index < candidates.length) return candidates[index];
      }
      console.log(`输入无效，请输入 1-${candidates.length}。`);
    }
  } finally {
    readline.close();
  }
}

function preparationError(device, output) {
  const detail = output.trim();
  const normalized = detail.toLowerCase();
  const suffix = detail ? `\n原始错误：\n${detail}` : '';
  if (
    normalized.includes('device is locked') ||
    normalized.includes('devicelocked') ||
    normalized.includes('0xe80000e2')
  ) {
    return `真机预热失败：${describeDevice(device)}\n判断：手机处于锁定状态，Developer Disk Image 无法挂载。\n业务包尚未开始推送。\n请解锁手机并保持亮屏后重试。${suffix}`;
  }
  return `真机预热失败：${describeDevice(device)}\n业务包尚未开始推送。\n请保持手机解锁亮屏，确认 USB 数据连接正常后重试。${suffix}`;
}

async function prepareDevice(requested) {
  if (!commandExists('xcrun')) fail('iOS 真机调试需要 Xcode Command Line Tools（xcrun）。');
  let device = await chooseDevice(listDevices(), requested);
  console.log(`真机：${describeDevice(device)}`);
  console.log('正在预热 CoreDevice tunnel / Developer Disk Image…');
  const detail = run(
    'xcrun',
    ['devicectl', 'device', 'info', 'details', '--device', device.identifier],
    { allowFailure: true, capture: true },
  );
  if (detail.code !== 0) {
    fail(preparationError(device, detail.stderr || detail.stdout));
  }

  console.log('正在等待真机连接（最长约 15 秒）…');
  for (let attempt = 0; attempt < 15; attempt += 1) {
    device = selectRequestedDevice(listDevices({ quiet: true }), device.identifier);
    if (device.tunnelState === 'connected') {
      console.log(`真机连接已就绪：${describeDevice(device)}`);
      return device;
    }
    if (attempt < 14) await new Promise(resolve => setTimeout(resolve, 1000));
  }
  fail(
    `真机连接未就绪：${describeDevice(device)}\n业务包尚未开始推送。请保持手机解锁亮屏，检查 USB、信任状态和 xcrun devicectl list devices。`,
  );
}

function configuredIOSBackend(options) {
  const value = options.iosBackend ?? process.env.MINI_DEV_CLI_IOS_BACKEND;
  if (value === undefined) return undefined; // 不显式设置默认值，保留 CLI 的兼容回退。
  const backend = value.trim().toLowerCase();
  if (!['pymobiledevice3', 'devicectl'].includes(backend)) {
    fail('MINI_DEV_CLI_IOS_BACKEND 只支持 pymobiledevice3 或 devicectl');
  }
  return backend;
}

function usesDevicectl(options) {
  const backend = configuredIOSBackend(options);
  return backend === 'devicectl' || (
    backend === undefined &&
    /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(options.device ?? '')
  );
}

// CLI 1.3.3 尚未提供 JSON 设备清单：按表头解析公开的 console.table，
// 不能从整段日志抓取任意 UDID；格式变化时失败并要求升级脚本，不猜设备。
function parseCliDeviceTable(output) {
  const rows = output.replace(/\x1b\[[0-9;]*m/g, '').split('\n')
    .filter(line => line.includes('│'))
    .map(line => line.split('│').slice(1, -1).map(cell =>
      cell.trim().replace(/^['"]|['"]$/g, '')));
  const headerIndex = rows.findIndex(row => ['类型', '名称', '状态', 'ID'].every(key => row.includes(key)));
  if (headerIndex < 0) return [];
  const header = rows[headerIndex];
  return rows.slice(headerIndex + 1)
    .filter(row => row.length === header.length && row[header.indexOf('类型')] === 'iOS 真机')
    .map(row => ({
      identifier: row[header.indexOf('ID')],
      name: row[header.indexOf('名称')],
      tunnelState: row[header.indexOf('状态')],
      pairingState: 'paired',
      transportType: 'unknown',
    }))
    .filter(device => /^[A-Za-z0-9-]+$/.test(device.identifier));
}

async function prepareCliDevice(options) {
  console.log('正在通过 mini-dev-cli 准备真机；首次使用可能自动安装 pymobiledevice3 运行环境…');
  const backend = configuredIOSBackend(options);
  const result = run(options.miniDevCli, [
    'device', 'list', '--platform', 'ios',
    ...(backend ? ['--ios-backend', backend] : []),
  ], { capture: true, allowFailure: true });
  if (result.stderr.trim()) console.error(result.stderr.trim());
  const devices = parseCliDeviceTable(result.stdout);
  if (result.code !== 0 || !devices.length) {
    fail(`没有取得可用真机，业务包尚未开始推送。\n请连接、解锁并信任设备；检查 CLI 运行环境安装和网络。\n${result.stdout.trim()}\n请运行 mini-dev-cli device list --platform ios 核对清单；若 CLI 表格格式变化，请更新调试脚本。`);
  }
  const device = await chooseDevice(devices, options.device);
  console.log(`已锁定真机：${describeDevice(device)}`);
  return { ...options, device: device.identifier };
}

async function resolveTarget(options) {
  if (options.platform === 'ios' && options.runtime === 'device') {
    if (usesDevicectl(options)) {
      console.log('使用 devicectl 兼容通道，仍需与设备系统匹配的 Xcode；可改用硬件 UDID 及默认通道。');
      const device = await prepareDevice(options.device);
      return { ...options, device: device.identifier };
    }
    return prepareCliDevice(options);
  }
  if (options.platform === 'ios' && options.runtime === 'simulator') {
    const output = run('xcrun', ['simctl', 'list', 'devices', '--json'], { capture: true });
    const devices = Object.values(JSON.parse(output.stdout).devices ?? {})
      .flat()
      .filter(device => device.state === 'Booted' && device.isAvailable !== false);
    if (options.simulator) {
      if (!devices.some(device => device.udid === options.simulator)) {
        fail(`指定模拟器未启动或不可用：${options.simulator}，请在 Simulator 中启动后重试。`);
      }
      return options;
    }
    if (!devices.length) fail('没有已启动的模拟器，请在 Simulator 中启动目标模拟器后重试。');
    if (devices.length === 1) return { ...options, simulator: devices[0].udid };
    const listing = devices.map((device, index) => `${index + 1}. ${device.name} (${device.udid})`).join('\n');
    if (!process.stdin.isTTY || !process.stdout.isTTY) {
      fail(`检测到多台已启动模拟器：\n${listing}\n请传 SIMULATOR=<UDID>。`);
    }
    console.log(`检测到多台已启动模拟器，请选择：\n${listing}`);
    const readline = createInterface({ input: process.stdin, output: process.stdout });
    try {
      while (true) {
        const answer = (await readline.question('请输入模拟器编号：')).trim();
        const index = /^\d+$/.test(answer) ? Number(answer) - 1 : -1;
        if (index >= 0 && index < devices.length) {
          return { ...options, simulator: devices[index].udid };
        }
        console.log('编号无效，请重新输入。');
      }
    } finally {
      readline.close();
    }
  }
  return options;
}

function parseCachedAppIds(output) {
  const ids = [];
  const pattern = /(?:│\s*appId\s*│|appId\s*:)\s*([A-Za-z0-9._-]+)/g;
  for (const match of output.matchAll(pattern)) {
    if (!ids.some(id => id.toLowerCase() === match[1].toLowerCase())) ids.push(match[1]);
  }
  return ids;
}

function checkHostCache(options, requireAppId) {
  const result = run(
    options.miniDevCli,
    ['cache', 'list', ...(requireAppId ? ['--details'] : []), ...targetArgs(options)],
    { allowFailure: true, capture: true },
  );
  if (result.code !== 0) {
    fail(`宿主或缓存检查失败，业务包尚未开始推送：\n${(result.stderr || result.stdout).trim()}`);
  }
  console.log(`宿主：${effectiveBundleId(options)}（数据容器可访问）`);
  if (!requireAppId || options.platform === 'android') return;

  const escaped = requireAppId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const exact = new RegExp(
    `(?:^|[^A-Za-z0-9._-])${escaped}(?:$|[^A-Za-z0-9._-])`,
    'i',
  );
  if (!exact.test(result.stdout)) {
    const cached = parseCachedAppIds(result.stdout);
    fail(
      `目标设备尚未缓存小程序 appId=${requireAppId}。\n当前缓存 appId：${cached.join('、') || '(无)'}\n业务包尚未写入。请先在目标宿主中正常打开一次该小程序。`,
    );
  }
  console.log(`目标小程序缓存：appId=${requireAppId}（已就绪）`);
}

function extractScheme(url) {
  const match = String(url).match(/^([A-Za-z][A-Za-z0-9+.-]*):\/\//);
  if (!match) fail(`--open-url 不是合法的 schema 链接：${url}`);
  return match[1];
}

function defaultScheme(options) {
  const bundleId = effectiveBundleId(options);
  if (options.platform === 'android') return DEFAULTS.androidScheme;
  if (bundleId === DEFAULTS.iosSimulatorBundleId) return DEFAULTS.iosSimulatorScheme;
  if (bundleId === DEFAULTS.iosDeviceBundleId) return DEFAULTS.iosDeviceScheme;
  fail('自定义 iOS 宿主必须显式提供 --open-scheme 或完整 --open-url');
}

function resolveOpenTarget(options) {
  if (options.openUrl) return { scheme: extractScheme(options.openUrl), url: options.openUrl };
  if (!options.appId || !/^[A-Za-z0-9._-]+$/.test(options.appId)) {
    fail('自动打开小程序必须提供合法的 --app-id，或直接提供完整 --open-url');
  }
  const scheme = String(options.openScheme ?? defaultScheme(options))
    .trim()
    .replace(/:\/\/$/, '')
    .replace(/:$/, '');
  if (!/^[A-Za-z][A-Za-z0-9+.-]*$/.test(scheme)) {
    fail(`--open-scheme 不是合法的 URL scheme：${options.openScheme}`);
  }
  const path = String(options.openPath ?? '').trim().replace(/^\/+/, '');
  const miniappUrl = `godzilla://${options.appId}/${path}`;
  return { scheme, url: `${scheme}://miniApp?url=${encodeURIComponent(miniappUrl)}` };
}

function reopen(options, { restartMiniapp = true } = {}) {
  const target = resolveOpenTarget(options);
  const commonArgs = targetArgs(options);
  if (options.platform === 'ios' && restartMiniapp && !options.cold) {
    const exitUrl = `${target.scheme}://jumpHome`;
    console.log(`退出当前小程序：${exitUrl}（宿主 App 进程保持运行）`);
    run(options.miniDevCli, ['open-url', exitUrl, ...commonArgs], {
      dryRun: options.dryRun,
    });
    if (!options.dryRun) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 500);
  }
  if (options.platform === 'android') {
    console.log('Android open-url 按 mini-dev-cli 合同会冷启动宿主。');
  }
  console.log(`打开目标小程序：${target.url}${options.cold ? '（冷启动）' : ''}`);
  run(
    options.miniDevCli,
    ['open-url', target.url, ...(options.cold ? ['--cold'] : []), ...commonArgs],
    { dryRun: options.dryRun },
  );
}

function checkGlobalContract(options) {
  if (!options.globalMiniprogram) return;
  if (options.platform !== 'ios') fail('全局业务包 push-override 当前只支持 iOS');
  if (
    options.runtime === 'device' &&
    usesDevicectl(options) &&
    !options.dryRun &&
    !commandExists('afcclient')
  ) {
    if (!options.ensureDependencies || !commandExists('brew')) {
      fail('iOS 真机全局覆盖缺少 afcclient；自动安装需要 Homebrew，请安装 Homebrew 后重试。');
    }
    console.log('正在安装真机全局覆盖依赖 libimobiledevice…');
    run('brew', ['install', 'libimobiledevice']);
    if (!commandExists('afcclient')) fail('安装完成但找不到 afcclient，请检查 Homebrew PATH。');
  }
}

async function doctor(options) {
  checkVersion(options);
  assertPackage(options);
  checkGlobalContract(options);
  console.log(`目标：${options.platform} ${options.runtime}`);
  console.log(`业务包：${options.packageDir}`);
  if (options.dryRun) {
    console.log('dry-run：本地产物与工具检查完成，未访问模拟器或真机。');
    return;
  }
  const target = await resolveTarget(options);
  checkHostCache(target, options.globalMiniprogram ? undefined : options.appId);
  console.log('检查完成：设备、宿主缓存和业务产物已就绪。');
}

async function push(options) {
  checkVersion(options);
  assertPackage(options);
  checkGlobalContract(options);
  if (!options.globalMiniprogram && !options.appId) {
    fail('定向推送必须传 --app-id <appId>');
  }
  if (!options.noOpen) resolveOpenTarget(options);

  if (options.dryRun) {
    const args = options.globalMiniprogram
      ? ['push-override', options.packageDir, 'miniprogram', ...targetArgs(options)]
      : [
          'push',
          options.packageDir,
          'miniprogram',
          '--app-id',
          options.appId,
          ...targetArgs(options),
        ];
    run(options.miniDevCli, args, { dryRun: true });
    if (options.noOpen) {
      console.log(
        options.globalMiniprogram
          ? 'NO_OPEN=1：跳过最终 open-url；真实执行时全局 push-override 自身仍会重启宿主。'
          : 'NO_OPEN=1：只推业务包，不退出或重开小程序。',
      );
    }
    else reopen(options, { restartMiniapp: !options.globalMiniprogram });
    console.log('dry-run：已打印完整流程，未访问或写入目标环境。');
    return;
  }

  const target = await resolveTarget(options);
  checkHostCache(target, options.globalMiniprogram ? undefined : options.appId);
  if (options.globalMiniprogram) {
    console.log('模式：全局覆盖所有已缓存小程序；mini-dev-cli 会重启宿主。');
    run(options.miniDevCli, [
      'push-override',
      options.packageDir,
      'miniprogram',
      ...targetArgs(target),
    ]);
  } else {
    console.log(`模式：仅覆盖 appId=${options.appId}；宿主进程保持运行。`);
    run(options.miniDevCli, [
      'push',
      options.packageDir,
      'miniprogram',
      '--app-id',
      options.appId,
      ...targetArgs(target),
    ]);
  }

  if (options.noOpen) {
    console.log(
      options.globalMiniprogram
        ? 'NO_OPEN=1：已跳过最终 open-url；全局 push-override 自身仍会重启宿主。'
        : 'NO_OPEN=1：业务包已写入，当前宿主和小程序状态未改变。',
    );
    return;
  }
  try {
    reopen(target, { restartMiniapp: !target.globalMiniprogram });
  } catch (error) {
    fail(`业务包已写入，但小程序重开未完成。请根据上方 CLI 原始错误处理（DeviceLocked 时解锁并保持亮屏），再用相同设备、宿主和路由参数运行 make business-reopen；无需重新推送。\n${error.message}`);
  }
  console.log('完成：业务包已推送并进入目标小程序。');
}

async function reopenOnly(options) {
  checkVersion(options);
  resolveOpenTarget(options);
  if (options.dryRun) {
    reopen(options);
    return;
  }
  const target = await resolveTarget(options);
  checkHostCache(target);
  reopen(target);
}

function printHelp() {
  console.log(`
业务小程序调试工具

用法：
  node tools/business-miniapp-debug.mjs check [选项]
  node tools/business-miniapp-debug.mjs doctor --package-dir <目录> --app-id <appId> [选项]
  node tools/business-miniapp-debug.mjs push --package-dir <目录> --app-id <appId> [选项]
  node tools/business-miniapp-debug.mjs reopen --app-id <appId> [选项]

关键选项：
  --runtime <simulator|device>  iOS 目标，默认 simulator
  --simulator <UDID>            指定模拟器；省略时由 CLI 自动选择
  --device <identifier>         指定真机；省略时自动筛选，多台时交互选择
  --ios-backend <后端>          仅 iOS 真机：pymobiledevice3 / devicectl；省略保留 CLI 自动兼容
  --global-miniprogram          全局覆盖所有缓存小程序
  --confirm-global              确认全局覆盖风险
  --no-open                    推送后不退出或重开目标小程序
  --open-path / --open-url      设置重开目标
  --cold                        冷启动宿主；iOS 默认保持宿主进程
  --dry-run                     只检查本地并打印命令
  --no-install                  只检查工具版本，不自动安装/升级

要求：mini-dev-cli >= 1.3.3、Bun >= 1.0。真机默认通道不强制 Xcode/afcclient；
模拟器仍需 Xcode，devicectl 兼容通道仍受 Xcode 与设备系统版本影响。
`);
}

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));
  if (command === 'help') printHelp();
  else if (command === 'check') checkVersion(options);
  else if (command === 'doctor') await doctor(options);
  else if (command === 'push') await push(options);
  else await reopenOnly(options);
}

main().catch(error => {
  console.error(error instanceof ToolError ? `错误：${error.message}` : error);
  process.exitCode = 1;
});
