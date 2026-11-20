# Image 位图原生着色

负责人：田坤；AI 工具：Codex；日期：2026-11-16。

## 问题与变更

Android 15 / OnePlus PJD110 / TEST-涂鸦 7.13.0 / Lynx SDK 4.0.2，IPC 宝宝首页的远程 PNG 消息图标有地址和尺寸，原 Image 被隐藏，CSS URL mask 层没有绘制图形。业务先用 Ray Image 的原生 `tint-color` 验证有效，本轮将能力收口回 Smart UI。

- 仅改 `lynx/overrides/lynx-runtime/{model,adapters}.ts` 和 `build/lynx.cjs` 的 Image 转换；WebView `packages/`、`dist/`、`lib/` SHA 基线不变。
- 位图保留原 Image，绑定 `tint-color="{{lynxImageTint}}"`，删除位图 mask 节点；原 src、fit/mode、加载、错误占位、点击及尺寸语义保留。
- 可解析 SVG 保留独立 svg-render；远程/base64 SVG 不传原生位图 tint。位图/SVG/清空颜色切换会清掉旧状态。
- 复用主题表、ConfigProvider 自定义变量和嵌套 var 回退；不在组件库中硬编码 IPC 私有变量名。业务私有变量只存在于 CSS 时，需通过 ConfigProvider 或显式 fallback 提供逻辑侧颜色。
- 原生 tint 为当前宿主新增能力，本轮不声明更早宿主已支持。

## 验证

- 改前新增合同测试在旧 mask 实现上失败（native tint 为 undefined），改后通过。
- `yarn build:lynx` / `yarn verify:package`：70 个独立组件、WebView SHA 和归档闭包检查通过（1139 必需文件、2342 总文件）。
- `yarn test:lynx`：52 项通过；含主题回调注册/清理、ConfigProvider 色值、资源格式和颜色状态切换。
- `yarn test:lynx:render`：11 项通过；保留 load/error API。WeChat 模拟 Image 会丢弃 Lynx 专有属性，native 属性绑定由生成产物检查与真机共同验证，模拟挂载不冒充原生绘制。
- 原版 `yarn test --runInBand`：117 suites / 1094 tests / 51 snapshots 通过；变更 TS 文件 ESLint 通过。
- IPC 使用显式 `IPC_SMART_UI_DEBUG_SOURCE` 指向本仓，保持官方 React 包装层、未修改 node_modules；新构建后业务统一调用 Smart UI Image/tintColor，安卓深色铃铛和人形图标恢复白色，原生 Image 节点收到 `tint-color="white"`，原 URL 不变。
- 用户切换 App 至浅色并回到同一宝宝设备后，现场确认铃铛/人形为黑色，顶部与功能区原图正常。逻辑层确认首页和原设备一致、theme=light；两个原生 Image 均收到 `tint-color="black"`。深浅主题证据来自本地 Smart UI 新包，不沿用此前 Ray Image 临时组件的截图。
- 同当前安装的 SDK 对比，Lynx dist 差异仅 `image/index.wxml`、`lynx-runtime/{adapters.js,model.js,model.d.ts}` 四个文件，未将其他本地组件改动带入联调。

当前真机记录：安卓宝宝设备深浅主题通过；SVG 扩展、iOS、大屏未做新增真机验收。没有提交、推送或 npm 发布；IPC 正式依赖仍是旧发布包，去掉本地调试环境变量不会自动消费本次修复。

业务截图留在其忽略目录 `.clix/tmp/android-message-tint-20261116/`，不新增大图到本库。
