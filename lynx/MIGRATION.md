# SmartUI Lynx 独立实现（实验版）

本目录是业务优先组件的第一轮 Lynx 转换，原小程序实现继续由仓库根目录 `packages/` 维护。两端渲染、样式和手势代码分开；本目录不会被原来的 gulp/Jest 入口自动引用。已准备独立 npm beta 发布配置；完整运行态验收尚未完成，发布状态见 README。

## 范围与状态

第一批 10 项：Icon、Image、Loading、Switch、Grid、GridItem、Popup、Overlay、ActionSheet、Toast。

第二批 6 项：Picker、PickerColumn、DateTimePicker、Calendar、Dialog、Slider。PickerColumn 是内部组件；CalendarHeader、CalendarMonth、CalendarMonthList、CalendarYearList 均随 Calendar 迁移，不另计组件。

`packages/` 同时包含这些组件的必要依赖，不代表依赖组件所有公开能力都已完成 Lynx 适配。逐项状态见 [migration-ledger.json](./migration-ledger.json)，未解决及未验收范围见 [issues.json](./issues.json)。**代码转换、构建通过和交互验收是三个不同状态。**

## 构建与检查

沿用仓库已安装的 TypeScript、Less 等依赖：

```bash
cd /Users/xiaoqi/Documents/github/miniapp-smart-ui
node lynx/build.cjs
node --test lynx/*.test.cjs
./node_modules/.bin/tsc -p lynx/tsconfig.json
```

`dist/` 生成 ES5 CommonJS、WXML/WXS/WXSS，以及供 Ray Tuya 适配器读取的 TYML/SJS/TYSS 别名。不要直接修改生成文件。已有生成目录会转存到 `.dev/history/`，避免清理其他工作。

完整原生测试包使用独立 MiniPack 工具链：

```bash
make -C lynx business-build \
  NODE=/Users/xiaoqi/.nvm/versions/node/v22.22.1/bin/node \
  MINIPACK_CLI=/Users/xiaoqi/Documents/github/miniapp-smart-ui/.clix/test/e2e_temp/20261023-lynx-setup/toolchain/node_modules/@tuya-miniapp/minipack/bin/minipack-build.js \
  LYNX_FRAMEWORK_DIR=/Users/xiaoqi/Documents/github/miniapp-smart-ui/.clix/test/e2e_temp/20261023-lynx-setup/framework
```

这里的 `--renderer=native` 只用于本目录的全原生组件测试包。混合业务工程应按页面保留 `native` / `webview`，不能全局强制转换。

默认入口已恢复为原 example 的 `pages/dashboard/index`，14 个组件 demo 各自独立成页，Slider 页沿用原 `normal-slider/demo`。目录保留原分组和顺序；未迁移的目录项会提示尚未支持。此前聚合测试页已移到 `fixtures/`，使用 `node lynx/build-example.cjs --fixtures` 单独构建，不作为默认 example。

2026-10-26 已用 `clix dev publish-preview --no-dev-id` 发布 Lynx 体验版 `99.99.99`（appId `tysncznjawnyjkyean`）。上传前校验当前 MiniPack 产物的 130 个文件哈希与 15 条 Native 路由，在 `.dev/preview-publish-20261026/` 隔离目录内使用 CLI 支持的 `pipelineConfig.skipMinipack` 上传已有构建产物。发布记录见 `../.clix/test/e2e_temp/20261026-example-parity/data/preview-publish.json`。该轮发现的 Icon 长页无法滚动已在后续 SCROLL-01 排查中修复，模拟器手动通过；最新体验版真机待复验，见下文。

远程 SVG 测试服务：`node lynx/tools/svg-fixture.cjs`，监听 `127.0.0.1:9349`，仅供本机模拟器使用。

## Ray 接入

配套包装位于 `/Users/xiaoqi/Documents/github/ray-smart-ui/lynx`。当前建议原生页面从 `@ray-js/smart-ui-lynx/native` 导入，WebView 页面继续使用现有 `@ray-js/smart-ui`。

另有实验性统一入口，支持 `renderMode` 与 Context，但当前混合产物的 MiniPack 在旧 WebView Slider RJS 上报 `schemaUrl` 错误，尚不能作为已验证的业务接入方案。原生专用入口已通过 Ray → MiniPack 构建，尚待最终模拟器验收。

本地源码联编需要保持组件目录的相对引用。已验证的探针使用业务工程内 `vendor/` 符号链接、`resolve.symlinks(false)` 和统一的 React 解析路径。不要把这里的机器绝对路径直接提交到真实业务工程。

## 验证边界

此前基础轮（2026-10-26）：Lynx 42 项行为与 example 一致性测试、类型检查、ESLint（0 错误 / 10 条沿用未使用变量警告）、Stylelint、原生组件包及 Ray → MiniPack 原生专用入口构建通过。原小程序此前 117 套 / 1094 项 / 51 快照通过，原组件源码仍无本次迁移 diff。

实际模拟器基础回归覆盖：图标点击与显式颜色、受控开关、宫格、嵌套弹层关闭和底层恢复、ActionSheet、Toast、Picker 点击确认、时间 00:00/23:59、Calendar 单日/月/年、Dialog 默认值/输入/取消、Slider 轨道提交。用户确认 Picker/Slider 可手动拖动，并保留拖动后状态；自动拖动在最小原生 View 上也只产生 start/end，保留 `pages/touch/index` 诊断页。

Calendar 月/年选中文字偏离圆形背景已修复并回归。Image 完整保留 SDK 错误；远程 SVG 本地请求返回域名未配置 40013，成功路径仍待在合法域名验证。未修改平台域名配置。

完整主题、字体图标、Slider 高级 API、实例 API、范围日历、长列表/取消/卸载等边界、业务 18 个入口及 Android 尚未全部验收。当前宿主日志为容器 3.53.0，文档要求至少 3.54.0；重载还出现导航类 Memory Leak 调试告警，未证明是组件导致。详细状态见 `issues.json` 和 `migration-ledger.json`，不能把基础用例通过当作全部迁移完成。

### 2026-10-26 其他组件增量修复

该历史轮次曾暂缓滚动；后续已重新排查并修复 SCROLL-01，见下文。本轮修复 Loading 文案插槽、普通 Slider 的 detail.value/测量竞态/松手与 parcel 端点/竖向进度、Switch 渐变/加载布局/非布尔标签，以及 ActionSheet demo 同义多语言 key。原版独立示例回归包含 Popup、Dialog、ActionSheet、Toast、Loading、Slider、Switch；只证明记录中的场景，尚非完整 API 验收。42 项 Node 测试通过，构建/类型/ESLint/Stylelint 通过（ESLint 13 条警告）。更新后的 Lynx 体验版仍为 99.99.99，二维码不变；本轮真机复验待完成。证据与本地报告位于 `../.clix/test/e2e_temp/20261026-other-components/`。

### Switch 逐项视觉复核（2026-10-26）

前轮 Switch 的“loading 已居中”判断不充分，用户反馈后重新以原版 headless（393px宽）对照。已将开关文案恢复为两行两列、51px行距，恢复30px/24px图标尺寸，并去掉无文案 Loading 的8px间距占位。最终开/关两种状态截图的图标/圆点中心偏差不超过约0.33 CSS px（含像素取整）。Demo 标题显式28px行高，与原版20px字号/1.4行高对应。42项测试、构建、类型与Stylelint通过，99.99.99已更新；真机仍待复验。原始截图、DOM、中心量测和对比报告位于 `../.clix/test/e2e_temp/20261026-switch-parity/`。

### 逐组件 headless / Native 对照（2026-10-26 增量）

14个独立示例页均进入本轮对照，检查27/99个原始demo分组。修复Image间距/比例/默认SVG色、Picker数据复用/可见窗口、Calendar范围白字/空标题、Dialog异步防护、Slider异步查询/全宽宿主、Overlay示例白屏、ActionSheet加载色与Toast间距。53项测试、类型、Stylelint通过；ESLint为0错误/14警告。正式包130文件校验后更新99.99.99，审计section包未上传。

完整API、18个真实业务入口、本轮手机复验与Android仍未完成。滚动已修复并获模拟器手动确认，真机新包待复验；远程SVG域名、主题/毛玻璃、Slider高级API、队列/手势等边界仍保留。报告：[逐组件对照](../.clix/test/e2e_temp/20261026-component-audit/report.html)。

### ScrollView 长页修复（2026-10-26）

页面 ScrollView 增加 `z-index:0` 建立层叠上下文，并使用单个普通 View 包裹内容；`onReady` 读取实际内容视口高度（本机749px，系统窗口值852px）。真实 Icon 页隔离副本的程序滚动及用户手动滚动通过，已合入15条正式示例路由。正式包 Popup 居中/底部定位、遮罩关闭及 Overlay 内外点击复验通过。55项Node测试和类型检查通过。原版 `packages/`、`example/` 无本次改动。

正式体验版 `99.99.99` 已更新，二维码不变；真机与Android的新包复验待完成。其余完整API验收范围沿用逐组件报告，不因本次滚动修复扩大通过范围。[滚动修复证据](../.clix/test/e2e_temp/20261026-scroll-probe/report.html)。
