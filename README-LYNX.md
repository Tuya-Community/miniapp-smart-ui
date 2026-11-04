# Smart UI Lynx 适配

本地分支：`codex/lynx-smart-ui`。基线为 `origin/main` 的
`45e7e1e30529f79f86f4876f1af42523286c76a1`，原包版本 `2.13.7`。

## 包和仓库的关系

本仓库当前包名是 `@tuya/miniapp-smart-ui`，提供小程序组件；业务使用的
`@ray-js/smart-ui` 是另一层 React 包装，当前 IPC 工程安装的是 `2.13.3`。
本次修改底层库源码，并提供可生成的本地 React 接入适配器，不修改 `node_modules`，
不代替 React 包装层的正式源码发版。

## 双端隔离

| 范围 | WebView | Lynx |
| --- | --- | --- |
| 源码 | `packages/`，保持 main 原样 | `lynx/overrides/` + 独立构建转换 |
| 产物 | 原有 `dist/`、`lib/` | `lynx/dist/`、`lynx/lib/` |
| 原构建 | 原 `build/compiler.js` 不变 | `yarn build:lynx` |
| React 本地接入 | `renderMode` 默认 `webview` | 显式 `renderMode="lynx"` |
| 小程序直接接入 | 原路径不变 | 显式引用 `/lynx/lib/<组件>/index` |

`build/lynx.cjs` 先从原目录构建独立工作副本，再应用 Lynx 专用实现；不原地改写
原组件，也不把两端 Less 混到同一入口。`lynx/webview-baseline.json` 校验原源码和
已构建 WebView 文件的 SHA-256。修改 main 基线时应重新审查并更新该清单，不能
通过删除校验绕过差异。

## 覆盖范围

全部 **70 个小程序组件**登记在 [lynx/components.json](lynx/components.json)，包括内部子组件。
不是只适配 IPC 当前用到的几个组件。清单含依赖、风险、专用覆盖文件和逐组件验收场景。

- 统一：真实 Text、文字样式变量、首末项与空内容判断、实际边框节点、Flex 栅格、滚动容器。
- Icon：普通图片仍用 Image；图标库名称、SVG URI、SVG path 转成完整 SVG 片段，用现有 `svg-render` / `SvgRender`。
- Loading：真实节点绘制圆环 / 八段旋转，不依赖 WebKit mask。
- Switch：保留属性及事件，统一圆点定位，补齐 border-box 的实际总尺寸。
- Picker / DatetimePicker：真实文字、有限可见行、禁用项、循环、单位、程序设置、父子列接口；去掉 WXS DOM 修改和三维伪元素文字。选中框改成实际边缘节点。 Lynx列通过`pan-intercept-direction=1`/`pan-intercept-scope=1`隔离祖先纵向原生滚动；禁用/空列不拦截。当前MiniApp会把数组原生属性转为JSON字符串，不能用`consume-slide-event`模板属性存在当作生效证据，实测见[嵌套滚动记录](lynx/evidence/picker-nested-scroll-2026-10-28.md)。
- Slider / NormalSlider：独立逻辑层手势，保留范围、步长、方向和事件；处理取消、多指、异步测量、页面隐藏与销毁。React 单值 Slider 继续使用已适配的 TySlider。
- Popup / Overlay / Dialog / ActionSheet / BottomSheet / Toast：遮罩低于内容；快速切换清理旧动画；嵌套原生锁按持有者计数；关闭、隐藏和销毁清理。
- Circle：用现有 SvgRender 替换 RJS canvas，保留模式、进度、渐变、颜色、圆角线帽和线宽。
- Image：保留加载、错误、占位及事件；位图 `tintColor` 使用标准 CSS Mask（含 fit 对应的 size、居中和禁止重复）。可解析的 SVG data URI 使用 `svg-render`，单色图显式改色、多色图保留各路径颜色；远程 SVG / base64 SVG 暂保留原图，不走不受支持的 SVG Mask，着色需提供可解析 SVG XML 或位图。
- ConfigProvider：与 SVG/Loading 的颜色刷新关联，复用原深浅色变量与覆盖顺序。
- 其余组件保留原逻辑层，在独立模板、样式及依赖闭包内做公共适配。

## 本地构建与检查

集成编译使用 Node `>=24.11`（本机 `24.19.0`）和 MiniPack `5.0.0-alpha39.0`。
先安装仓库依赖，再建立 WebView 产物，保留可比对基线：

```bash
yarn install
MODE=build yarn gulp -f build/compiler.js --series buildEs buildLib
yarn build:lynx
yarn verify:lynx
yarn test:lynx
yarn test:lynx:render
```

原版回归使用 `yarn test --runInBand`。新增测试分为逻辑 / 生命周期、属性插槽保留、
真实小程序组件挂载。挂载测试的 SvgRender 是测试替身，只证明传参，不算真机 SVG 验收。

真实编译完整 70 组件树：

```bash
SMART_UI_MINIPACK_ROOT=/本机/node_modules/@tuya-miniapp/minipack yarn build:lynx:fixture
```

工程和输出在 `lynx/.generated/`，独立于原示例目录。命令不推包、不操作设备、不调用设备 DP。

## React 本地接入

从业务当前安装的包装层生成可复现适配器，原包装层只读。推荐输出在业务仓库内，使 React、lodash-es 等依赖沿用业务解析环境：

```bash
SMART_UI_RAY_WRAPPER_ROOT=/业务工程/node_modules/@ray-js/smart-ui \
SMART_UI_RAY_OUTPUT_ROOT=/业务工程/.local-pkg-build/smart-ui-lynx \
yarn build:lynx:ray
```

生成指定的业务联编目录（未指定输出目录时为 `lynx/ray/`），包含默认 WebView 与显式 Lynx 的 React 分流、原事件 / 插槽转换、
类型导出，以及包装层版本和原文件摘要。隔离底层组件会一并物理复制；Lynx Slider 校验并定向使用业务安装的 `0.3.10-beta.3`，避免本地库自己的旧依赖覆盖它。此目录仅供本地联调；它是构建产物，
不是已经发布的新版 `@ray-js/smart-ui`。

本地业务可以将 `@ray-js/smart-ui` 的解析别名指向该目录，但仍需在业务包装层按
当前页面 renderer 显式传模式，不能全局固定成 Lynx：

```tsx
<Switch renderMode={isLynxPage ? 'lynx' : 'webview'} checked={checked} />
<Picker renderMode={isLynxPage ? 'lynx' : 'webview'} columns={columns} />
```

AutoImport 的根入口和按组件入口均保留。Slider.RangeSlider 单独分流；普通 Slider
的 Lynx 分支向 `@ray-js/components-ty-slider@0.3.10-beta.3` 传 `renderMode="lynx"`。
默认 ToastInstance / DialogInstance / NotifyInstance 保持 WebView；Lynx 页面使用
对应的 `LynxToastInstance` / `LynxDialogInstance` / `LynxNotifyInstance`，并绑定相同页面的组件。

原生小程序直接引用 Lynx 入口时，如组件包含默认 / 具名插槽，可传
`lynx-has-default-slot`、`lynx-slot-names` 帮助判断空内容；不传时保留内容，避免误删。
React 适配器和库内部组件调用会补充这些元数据。

## 当前验收边界

源码、类型、原版回归、逻辑回归、挂载与实际编译分别记录，均不替代真机验收。
70 项的运行状态仍为 `IMPLEMENTED_RUNTIME_PENDING`，不能据此宣称所有主题、设备和交互已通过。

仍需重点核验：

1. iOS / Android、深浅主题切换、大屏、长文案、首次显示、退出重进。
2. SvgRender 实际绘制、图片 tint-color 实际生效；编译保留属性不等于客户端已绘制正确。
3. Picker 循环、惯性、窗口化大列、单位对齐、列联动、确认 / 取消；与业务原有绕过组件逐项回接。
4. 嵌套弹层、播放器 / 地图等原生层命中、滚动与所有关闭路径。
5. 当前编译器会过滤 `text-align:justify`、`white-space:pre-wrap`、`word-wrap:break-word` 等浏览器排版声明；Dialog 两端对齐、Toast 连续空格 / 长单词暂不能标为一致。Overlay 保留原有半透明降级背景，不依赖 `@supports` 毛玻璃分支。
6. 自定义字体式 classPrefix、远程 / Base64 SVG、复杂自定义样式算式等扩展用法，不能仅凭默认示例认定全部兼容。

正式 npm 版本号、打包和发布由维护者决定；本轮没有修改 IPC 业务的 Smart UI 依赖、
没有替换已经固定的 Slider / DirectionControl 版本，也没有推送手机。

参考实现依据：本机安装包的 Ray SvgRender 声明
`@ray-js/adapter/esm/hostComponents/SvgRender` 公开映射为 `svg-render`、属性为 `source`；
[涂鸦 Image 迁移说明](https://lynx-dev.fast-daily.tuya-inc.cn/development/migration/image.html)区分位图 Mask、SVG 渲染及原生 tint-color，Smart UI Image 的着色按资源格式分流；
[Lynx Text](https://lynxjs.org/4.0/zh/api/elements/built-in/text.html)说明真实文本与多行限制。

## 本轮验证记录（2026-10-27）

门禁与运行验收分开记录，详见 [验证记录](lynx/evidence/README.md) 和
[机器可读结果](lynx/evidence/validation-2026-10-27.json)。本地新增源码 ESLint、
26 项逻辑/分流检查、8 项组件挂载、React 模式类型冒烟、原版 1094 项测试 / 51 个快照、
70 组件 MiniPack 编译及 npm dry-run 均已执行；真机状态保留待验收。

## 已登记的真机细节（2026-10-28）

植物 TV 灯光循环时间：用户确认本轮 Picker 显示/位置正常，但文案首帧出现有延迟，待优化。本轮按要求仅记录，未量化延迟，不能据此声明所有 Picker 场景已通过；详见 `lynx/evidence/picker-time-color-2026-10-27.md`。

## Smart UI Slider 包装层（2026-10-28）

消费方保留 import { Slider } from @ray-js/smart-ui 及原 Slider JSX。本地 IPC 接入按页面上下文分流；组件库显式入口仍由 renderMode 选择，默认 WebView 语义不变。

- 单值 Slider 底层仍为独立 @ray-js/components-ty-slider@0.3.10-beta.3，只透传 Lynx 模式，不复制其绘制或手势实现。
- 默认 minTrackRadius=inherit 在包装层解析为 trackStyle.borderRadius，其次 maxTrackRadius，最后原默认 4px。显式半径（含 0）、barStyle 覆盖优先级保持，业务无需额外传默认圆角。
- value/min/max/step、onChange/onAfterChange、事件通道和自定义样式保持原值与回调身份，不修改事件 detail 格式。
- Slider.RangeSlider 保留 Smart UI 范围组件和数组/事件合同；原生 normal-slider 保持独立 Lynx 入口。
- WebView 原源码/产物 SHA 保持不变。ESM 助手引用 dist，CommonJS 引用 lib。

44 项逻辑/产物、11 项模板挂载、70 组件 WebView 隔离校验通过。实际回接验收见 lynx/evidence/smart-ui-slider-wrapper-2026-10-28.md。PerfText 是另一业务依赖，其真实 Text 修正不归 Slider 内部绘制负责。


## 提交前复核（2026-10-29）

本轮提交独立 Lynx 源码、构建工具、组件清单、隔离基线及验证记录；生成的
`lynx/dist`、`lynx/lib`、联编适配器和 fixture 不进入 Git，由对应构建命令重建。
原 `packages`、`dist`、`lib` 保持不变。仅将颜色解析函数的声明移到调用之前，
消除 ESLint 的声明顺序错误，不改变运行逻辑。

本轮检查及验收边界见 [提交前验证记录](lynx/evidence/precommit-2026-10-29.md)。
提交与推送不包含 npm 发布，版本仍为 `2.13.7`；此前记录的 Picker 首帧文案延迟
仍待优化，70 组件的全量真机验收状态保持待验证。
