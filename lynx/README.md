# SmartUI for Tuya Lynx (beta)

`@tuya/miniapp-smart-ui-lynx` 是 SmartUI 的独立 Lynx 实现，面向涂鸦 `renderer: native` 页面，当前兼容验证目标为 iOS / Lynx 4.0。原版小程序继续使用 `@tuya/miniapp-smart-ui`。

## 安装

```sh
yarn add @tuya/miniapp-smart-ui-lynx@0.1.0-beta.0
# 或获取独立 Lynx 包最新的 beta：
yarn add @tuya/miniapp-smart-ui-lynx@beta
```

发布包的 `miniprogram` 目录为 `dist`，包含 CommonJS、WXML/WXS/WXSS、TYML/SJS/TYSS 和类型声明。请按业务工具链的小程序 npm 组件规则引用；没有默认 JavaScript 聚合入口。配套 Ray 包装仍在 `Tuya-Community/ray-smart-ui` 的独立 Lynx 源码目录开发，本次仅发布底层包。

原生小程序页面配置示例（已用安装后的 tarball 通过 MiniPack 编译）：

```json
{
  "renderer": "native",
  "usingComponents": {
    "smart-icon": "@tuya/miniapp-smart-ui-lynx/dist/icon/index",
    "smart-switch": "@tuya/miniapp-smart-ui-lynx/dist/switch/index"
  }
}
```

## 范围

首批公开组件：Icon、Image、Loading、Switch、Grid、GridItem、Popup、Overlay、ActionSheet、Toast、Picker、DateTimePicker、Calendar、Dialog、Slider。PickerColumn 和 Calendar 子组件随父组件提供，另包含必要的依赖组件。Slider 的原生示例使用 `normal-slider` 实现；`slider` 目录保留供包装适配，业务需按实际 API 选择。

这是供接入验证的 beta。已做代表场景对照，完整 API 和业务验收仍在进行。已知待办包括远程 SVG 请求合法域名、完整主题覆盖、Slider 高级 API、弹层原生地图/视频命中、表单边界，以及真机新包和 Android 回归。完整列表见仓库的 [issues.json](https://github.com/Tuya-Community/miniapp-smart-ui/blob/codex/lynx/lynx/issues.json)。

## 仓库内构建

在仓库根目录执行：

```sh
yarn install --frozen-lockfile
npm run build --prefix lynx
node lynx/build-example.cjs --components-only
./node_modules/.bin/tsc -p lynx/tsconfig.build.json
node --test lynx/*.test.cjs
npm run typecheck --prefix lynx
npm run verify:package --prefix lynx
```

原小程序的 `packages/` 与 Lynx 的 `lynx/packages/` 分开维护。`lynx/example/` 是从原版独立示例生成的目录；`lynx/dist/` 是组件发布产物，两者都不提交。原生示例完整构建需额外配置 MiniPack 与 Lynx Framework，见 [迁移记录](./MIGRATION.md)。

## 发布 beta

发布分支为 `codex/lynx`，独立包使用 `beta` dist-tag。首次发布复用 GitHub 已登记的 `Publish Canary (standalone preview)` 手动入口；选择 `codex/lynx`，填写 `lynx_version`，该分支会调用专门的 `publish-lynx-beta.yml`，不会发布原版包。

```sh
gh workflow run publish-canary.yml --ref codex/lynx -f lynx_version=0.1.0-beta.0
```

发布流程仅接受 `数字.数字.数字-beta.数字` 版本，检查包内容、运行回归并上传经过校验的 tarball，发布后核对 npm 完整性和 beta 标签。版本不自动提交回分支；后续版本显式递增。
