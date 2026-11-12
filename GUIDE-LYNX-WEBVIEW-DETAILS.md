# Lynx / WebView 接入附录

简明步骤见 [快速接入](GUIDE-LYNX-WEBVIEW.md)。

更新日期：2026-11-12。面向涂鸦小程序及 Ray 项目；按页面选择组件实现，同一项目可以保留 WebView 页面并新增 Lynx 页面。

## 1. 先明确接入的三层

| 层级 | 当前职责 | 如何选择渲染实现 |
| --- | --- | --- |
| 宿主、MiniPack、页面配置 | 决定页面运行于 Lynx 还是 WebView | 按项目已有的双渲染接入规范配置；本库不创建 Lynx 页面 |
| `@tuya/miniapp-smart-ui` | 小程序组件模板、样式和逻辑 | 默认 `dist/`、`lib/` 是 WebView；`lynx/dist/`、`lynx/lib/` 是 Lynx |
| Ray React 包装层 | JSX 属性、事件、插槽转换 | 需要本文的分流适配器，才支持 `renderMode="lynx"` |

**只安装底层新包、只给现有组件添加 `renderMode`，都不足以完成 Ray 接入。** 当前参考包装层 `@ray-js/smart-ui@2.13.3` 静态引用 `@tuya-miniapp/smart-ui/dist/...`，没有渲染器选择逻辑。本仓库的生成器为它补充分流；该适配器尚未作为新版 React 包发布。

两条接入路径：

- 原生小程序：安装完整底层包，按页面直接引用不同组件路径，见第 3 节。
- Ray 项目：安装依赖，再用**固定提交的本仓库源码**生成适配器，配置别名并按页面传模式，见第 4～6 节。

不要将全局 `@tuya-miniapp/smart-ui` 别名指向 `lynx` 目录：混合项目中的 WebView 页面也会被切换。不要按 iOS / Android 判断组件模式；两个系统都可能运行两种页面。

## 2. 准备版本与检查安装内容

新项目先使用已经支持双渲染的 Ray / MiniPack / 宿主模板，确认空白 Lynx 页面能够启动，再接 UI 库。本文不提供独立的宿主升级或页面 renderer 配置替代方案。

本地已验证的组合是 React 包装层 `2.13.3`、TySlider `0.3.10-beta.3`；这是参考组合，不代表任意包装层都已通过验证。固定确切版本并提交锁文件。React 沿用项目模板版本，生成器声明的 peer 为 `^17.0.2`，避免适配器另装一份 React。

在**业务项目根目录**执行：

```bash
# 替换为已发布、通过归档检查的底层完整版本；不要照抄占位值。
export SMART_UI_VERSION='填写已验证的完整版本号'
yarn add --exact "@tuya/miniapp-smart-ui@$SMART_UI_VERSION"
yarn add --exact @ray-js/smart-ui@2.13.3 @ray-js/components-ty-slider@0.3.10-beta.3
```

本仓库当前源码版本仍为 `2.13.7`；本次默认构建修复尚未发布，不能仅凭版本号推断远端已有完整产物。此前 `2.13.7-canary.brelease-2-x-lynx.sd4215cd.43172925210.1` 的归档只有 `lynx/package.json`，缺少编译目录，**不要作为完整 Lynx 包使用**。

安装后在业务目录检查，任一缺失就先处理发包问题：

```bash
node <<'NODE'
const fs = require('fs');
const path = require('path');
const root = path.dirname(require.resolve('@tuya/miniapp-smart-ui/package.json'));
const required = ['lynx/package.json'];
for (const format of ['lib', 'dist']) {
  for (const component of ['popup', 'picker', 'picker-column', 'toast']) {
    required.push(`${format}/${component}/index.js`);
    required.push(`lynx/${format}/${component}/index.js`);
  }
}
for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) throw Error(`Missing ${file}`);
}
console.log('基础入口齐全：', root);
NODE
```

这只是消费端快速检查；组件库完整归档门禁是 `yarn verify:package`，会检查全部 70 个小程序组件及运行时文件。

## 3. 原生小程序直接引用

WebView 页面的 JSON：

```json
{
  "usingComponents": {
    "smart-popup": "@tuya/miniapp-smart-ui/lib/popup/index",
    "smart-picker": "@tuya/miniapp-smart-ui/lib/picker/index"
  }
}
```

Lynx 页面的 JSON：

```json
{
  "usingComponents": {
    "smart-popup": "@tuya/miniapp-smart-ui/lynx/lib/popup/index",
    "smart-picker": "@tuya/miniapp-smart-ui/lynx/lib/picker/index"
  }
}
```

页面本身仍须在工程配置中声明为对应 renderer。组件名、属性和 `bind:confirm` 等事件沿用组件文档，不需要给原生组件传 React 适配器的 `renderMode`。

同一业务若分别提供两种页面入口，应分别配置 `usingComponents`，不要在共享全局配置里将同一个标签强制绑定至某一端。原生插槽可用 `lynx-has-default-slot`、`lynx-slot-names` 传递是否存在默认内容及具名插槽列表；未传时保留内容。Ray 适配器会自动补这些信息。

## 4. Ray：生成独立适配器

生成器位于源码仓库的 [build/lynx-ray.cjs](build/lynx-ray.cjs)，**不在 npm 发布包中**。需要源码构建步骤，不能在安装后的 SDK 里直接运行 `yarn build:lynx:ray`。

先取得本仓库的 Lynx 分支，并将经过审查的提交固定到团队 CI 配置。以下路径按实际情况替换；输出目录必须专用，生成器会重建其中内容：

```bash
export SMART_UI_SOURCE='/绝对路径/miniapp-smart-ui'
export BUSINESS_PROJECT='/绝对路径/你的业务项目'

cd "$SMART_UI_SOURCE"
# 本地完整构建已在 Node 24.19.0 / Yarn 1.22.22 下验证。
yarn build

SMART_UI_RAY_WRAPPER_ROOT="$BUSINESS_PROJECT/node_modules/@ray-js/smart-ui" \
SMART_UI_TY_SLIDER_ROOT="$BUSINESS_PROJECT/node_modules/@ray-js/components-ty-slider" \
SMART_UI_RAY_OUTPUT_ROOT="$BUSINESS_PROJECT/.generated/smart-ui-bridge" \
yarn build:lynx:ray
```

生成结果：

```text
业务项目/.generated/smart-ui-bridge/
├── es/、lib/                # 默认 WebView、显式 Lynx 的 React 分流及类型
├── webview/                 # 只读复制的原 React 包装层
├── native/                  # 改写为 Lynx 组件入口的 React 包装层
├── native-package/          # 本仓库构建的独立 Lynx 小程序组件
├── package.json
└── adapter-receipt.json     # 包装层版本、摘要、模式等生成信息
```

**适配器使用的是源码 checkout 构建的 Lynx 产物，并非自动读取业务安装包的 `lynx` 目录。** 团队应将已发布的完整 SDK 版本、对应源码提交、包装层版本、Slider 版本作为同一组接入基线记录。升级安装包后也要重建适配器，且使用对应源码，避免混用不同修复。

生成目录放在业务项目内，让 React 等依赖沿业务环境解析。Native Slider 入口还包含生成时解析出的 Slider 文件路径，因此换机器、换工作目录或重装依赖后须重新生成，不能直接分发旧机器生成的适配器目录。CI 固定输入后重新生成；不要从开发机复制整个目录到云构建。

原有 `node_modules` 不会被改写。生成器会验证 Slider 恰好为 `0.3.10-beta.3`，并检查原包装层文件摘要；`runtimeVerified: false` 表示尚不能用生成结果代替真机验收。

## 5. Ray：别名、自动导入和类型同时接入

将以下配置**合并**到业务 `ray.config.ts`，保留项目原有配置项：

```ts
import path from 'node:path';
import { createRequire } from 'node:module';
import SmartUIAutoImport from '@ray-js/smart-ui/lib/auto-import';

// 单独命名，避免与小程序全局 require 类型混淆。
const nodeRequire = createRequire(__filename);
const smartUIBridge = path.resolve(__dirname, '.generated/smart-ui-bridge');
const smartUIPackage = path.dirname(
  nodeRequire.resolve('@tuya/miniapp-smart-ui/package.json')
);

export default {
  // 有其他转换器时追加，不要覆盖原数组。
  importTransformer: [SmartUIAutoImport],
  resolveAlias: {
    '@ray-js/smart-ui': smartUIBridge,
    '@tuya-miniapp/smart-ui': smartUIPackage,
  },
};
```

第一个别名让根导入和自动导入后的 `@ray-js/smart-ui/es/picker` 都经过分流适配器。第二个别名处理参考包装层中的旧底层包名，让 **WebView** 分支仍引用完整 SDK 的默认 `dist/` / `lib/`。它的目标是包根目录，不是 `lynx`。若项目采用 npm 包别名等其他解析方案，应检查两种包名实际解析到哪里。

`SmartUIAutoImport` 在配置加载时来自原包装层，其转换规则保留。不要仅手动替换某个根入口文件而漏掉自动导入后的组件子路径。

TypeScript 同步合并 `tsconfig.json`，示例假定 `baseUrl` 为项目根目录；已有 paths 要保留：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@ray-js/smart-ui": [".generated/smart-ui-bridge/es/index.d.ts"],
      "@ray-js/smart-ui/*": [".generated/smart-ui-bridge/es/*"]
    }
  }
}
```

生成必须先于类型检查和 Ray 构建。若类型仍报没有 `renderMode`，检查 paths 是否被其他配置覆盖、生成目录是否存在，而不是先加 `@ts-ignore`。

## 6. Ray：以页面为单位传递模式

模式来自项目真实路由 / renderer 配置；不要从手机系统、UA 或应用全局的“支持 Lynx”开关推断。建议将页面 renderer 注入上下文，组件统一读取。上下文只是传值，**不会自动修改 Smart UI 的导入或属性**。

下面示例放入业务文件，用于说明数据流。页面入口从自己的路由配置取值后传 `mode`；不要在页面挂载后通过修改 `mode` 尝试切换实际页面 renderer。

```tsx
import React, { createContext, useContext, useState } from 'react';
import { Button, Picker, Popup, Toast, ToastInstance, LynxToastInstance } from '@ray-js/smart-ui';

type RenderMode = 'webview' | 'lynx';
export const SmartUIRenderMode = createContext<RenderMode>('webview');

type Labels = { open: string; title: string; saved: string };

function Settings({ labels, columns }: { labels: Labels; columns: string[] }) {
  const renderMode = useContext(SmartUIRenderMode);
  const [show, setShow] = useState(false);
  const close = () => setShow(false);
  const confirm = () => {
    // 实际业务按 Picker 事件类型读取选中值，再保存。
    close();
    const toast = renderMode === 'lynx' ? LynxToastInstance : ToastInstance;
    toast({ selector: '#settings-toast', message: labels.saved });
  };

  return (
    <>
      <Button renderMode={renderMode} onClick={() => setShow(true)}>{labels.open}</Button>
      <Popup renderMode={renderMode} show={show} position="bottom" onClickOverlay={close}>
        <Picker
          renderMode={renderMode}
          showToolbar
          title={labels.title}
          columns={columns}
          onConfirm={confirm}
          onCancel={close}
        />
      </Popup>
      <Toast renderMode={renderMode} id="settings-toast" />
    </>
  );
}

// mode 由调用方读取实际页面配置；labels 由业务多语言系统生成。
export function SettingsPage(props: { mode: RenderMode; labels: Labels; columns: string[] }) {
  return (
    <SmartUIRenderMode.Provider value={props.mode}>
      <Settings labels={props.labels} columns={props.columns} />
    </SmartUIRenderMode.Provider>
  );
}
```

同一弹层内的 Popup、Picker，以及页面上的 Toast 都传相同模式。仅给外层 Popup 传模式，不会让内层 Picker 自动变成 Lynx。未传时适配器默认 WebView，方便保留旧页面，但新增 Lynx 页面必须主动补齐。

### 实例 API、Slider 与插槽

| 声明式组件模式 | 对应实例 API |
| --- | --- |
| WebView Toast / Dialog / Notify | `ToastInstance` / `DialogInstance` / `NotifyInstance` |
| Lynx Toast / Dialog / Notify | `LynxToastInstance` / `LynxDialogInstance` / `LynxNotifyInstance` |

组件的 `renderMode` 不会切换另一模块的实例 API。先在当前页面挂载同模式的组件，再调用对应实例；自定义 `id` 时传相同 `selector`，跨组件作用域时按现有 API 传正确的 `context`。Dialog 的取消等路径可能 reject，业务保留相应处理。上述实例导出均支持根导入和自动导入。

- 单值 `Slider` 仍使用独立 TySlider，适配器在 Lynx 分支向其传模式；不要复制 Slider 内部实现到业务。
- `Slider.RangeSlider` 也须显式传模式，继续使用数组值及原回调，不要改成单值 Slider 的协议。
- 事件仍通过原包装层的转换，保留组件声明的事件类型；不要假定所有 `onChange` 的 `detail` 结构相同。
- 默认 children、`slot` 对象沿用原包装层约定。适配器自动补充 Lynx 插槽元数据；不要把原本具名插槽改成不相关的普通属性。
- 新增业务包装组件时保留所需的 ref 转发、静态成员及实例导出。当前生成声明使用 `React.FC`，不能据此保证所有 ref 用法的类型都已覆盖；有实例需求应单独验证，避免用类型断言掩盖差异。
- 主题沿用 ConfigProvider / CSS 变量；ConfigProvider 等 UI 组件同样按页面传模式。不要全局硬编码文字颜色解决 Picker 可见性。

## 7. CI 与升级顺序

组件库维护者：

```bash
yarn build                 # WebView + Lynx + 实际 npm 文件清单门禁
yarn test:package
yarn test:lynx
yarn test:lynx:render
yarn verify:package        # 测试完成后再核对归档，避免临时测试文件被采集
yarn prepublishOnly       # 校验已有构建并执行原后处理；不会替你补编译
```

平台 `preMinipackBuild` 也调用 `yarn build`。发布前审阅实际 `npm pack` / `yarn pack` 内容，确认两种编译目录、公共运行时及本文档存在；`lynx/package.json` 单独存在不算完成。生成器、源码、测试、联编适配器不进入底层 npm 包。

业务项目 CI 按以下顺序配置：

1. 固定 Node / Yarn、SDK / 包装层 / Slider 版本及锁文件；安装业务依赖。
2. checkout 固定的 Smart UI 源码提交，安装组件库依赖并完整构建。
3. 在当前 CI 机器上生成业务目录内的适配器，保留源码提交与 `adapter-receipt.json` 供追溯。
4. 运行业务已有的类型检查和构建命令，检查组件根入口、自动导入子入口均命中适配器。
5. 同一组输入分别验证 WebView 与 Lynx 页面，再测试发布。清理生成目录后重跑以上步骤，也应能够重建。

业务源码、生成步骤、路由模式配置与别名配置应一起进入版本管理；`.generated/smart-ui-bridge/` 建议忽略并由流水线重建。适配器缓存键至少包含源码提交、包装层与 Slider 版本、锁文件及构建环境；更换绝对工作路径时重建。

## 8. 验收与排查

首次接入至少选择一个 WebView 页面与一个 Lynx 页面，iOS / Android 分别验证；具备其他目标平台时增加相应宿主验收，不根据 Android 成功推断其他平台成功。

| 场景 | 需要观察的结果 |
| --- | --- |
| 实际 renderer 与入口 | 运行时明确为目标 renderer，构建解析命中对应组件；仅看到 JS 文件内含 Lynx 字符串不算验证 |
| Popup + Picker | 首开、关闭后重开、拖动、列联动、确认 / 取消正常，内容可见且能触摸；不能只有灰色遮罩 |
| Toast / Dialog / Notify | 当前页面显示、对应 selector 命中；退出重进后无旧实例残留 |
| Slider / RangeSlider | 单值 / 数组、拖动及结束回调与现有合同一致 |
| 布局与主题 | 深浅主题、长文案、横竖屏、大屏；弹层位置、文字与尺寸更新正常 |
| 页面生命周期 | 同进程重复进入、隐藏恢复、快速开关弹层，无卡住遮罩或失效触摸 |
| 原生层交互 | 有播放器 / 地图时确认遮罩、弹层与触摸命中；普通页面通过不能覆盖这些场景 |

常见症状：

| 症状 | 优先检查 |
| --- | --- |
| 找不到 `lynx/lib/...` | SDK 归档是否漏编译；不要只检查仓库源码存在 |
| 有 `renderMode` 但仍加载原实现 | 是否接入生成器；自动导入后的 `es/<组件>` 是否也命中别名 |
| Picker 只有灰屏或无文字 | 页面实际 renderer、Popup 与 Picker 模式是否一致、native-package 是否为预期源码构建；再抓组件布局和事件日志 |
| WebView 旧页面回归 | 是否将默认底层入口全局指向了 Lynx；是否遗漏默认 WebView 分支 |
| Toast 等不显示 | 组件是否已挂载、实例 API 模式及 selector/context 是否匹配 |
| 本机可用、CI 失败 | 是否缺少源码构建 / 生成步骤、Slider 是否为固定版、是否复用了旧机器绝对路径 |
| TypeScript 不认识模式属性 | 类型 paths 与构建别名是否一致；是否先生成再检查 |

当前 70 组件的状态仍是实现完成、全量真机待验收。SVG 实际绘制、图片着色、复杂字体 classPrefix、远程 / Base64 SVG、复杂自定义样式等需按业务补验；编译器过滤部分浏览器排版声明的边界见 [README-LYNX.md](README-LYNX.md#当前验收边界)。不要将构建通过写成全平台视觉与交互通过。

## 9. 参考与后续维护

以下实现与证据链接供浏览源码仓库时使用；npm 包仅携带接入指南、README 和组件编译产物，不携带构建工具与验收记录。

- [适配实现、能力范围与限制](README-LYNX.md)
- [组件清单与逐组件场景](lynx/components.json)
- [构建与归档修复证据](lynx/evidence/publish-build-2026-11-12.md)
- [已有验证记录](lynx/evidence/README.md)

将来若 React 包装层正式发布双渲染入口，可改为安装该正式版本并移除本地生成步骤；先对照其公开 API 和验收结果更新本文，不假定当前生成目录已经等同于正式发布包。
