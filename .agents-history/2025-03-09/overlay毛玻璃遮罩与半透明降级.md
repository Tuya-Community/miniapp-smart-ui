### Q: overlay 组件优化 - 毛玻璃遮罩与半透明降级、浅色/深色

- **答**：为解决 iOS 输入框弹窗聚焦时页面布局上移的体验问题，为遮罩增加「毛玻璃 + 半透明降级」并随设备能力自动适配。（1）在 `packages/common/style/var.less` 的 `:root` 中新增：`--overlay-blur-background: rgba(40,44,53,0.22)`、`--overlay-blur-radius: 24px`、`--overlay-fallback-background: rgba(0,0,0,0.4)`；在 `:root[theme='dark']` 中覆盖：`--overlay-blur-background: rgba(0,0,0,0.6)`、`--overlay-fallback-background: rgba(0,0,0,0.7)`。（2）在 `packages/overlay/index.less` 中默认使用半透明遮罩（fallback），并用 `@supports (backdrop-filter: blur(24px)) or (-webkit-backdrop-filter: blur(24px))` 在支持时改用毛玻璃背景与 `backdrop-filter: blur(24px)`；仍支持通过 `--overlay-background-color` 覆盖（如 toast 的透明遮罩）。（3）README 中补充了遮罩行为说明及新变量表。
- 时间：2025-03-09
