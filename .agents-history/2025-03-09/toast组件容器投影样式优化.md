### Q: toast 组件容器投影样式优化（浅色/深色面板规范）

- **答**：按提供的面板规范做了两处修改。（1）在 `packages/common/style/var.less` 的 `:root` 中新增 Toast 浅色面板变量：`--toast-panel-background: #5C5C5C`、`--toast-panel-border-color: rgba(255,255,255,0.05)`、`--toast-panel-box-shadow: 0 4px 12px rgba(0,0,0,0.1), 0 16px 32px rgba(0,0,0,0.12)`；在 `:root[theme='dark']` 中覆盖为深色：`--toast-panel-background: #3C3C3C`、`--toast-panel-box-shadow: 0 8px 24px rgba(0,0,0,0.15)`（描边沿用 5% 白）。（2）在 `packages/toast/index.less` 的 `.smart-toast` 上使用上述变量：`background-color`、`border: 1px solid`、`box-shadow`，并保留对 `--toast-background-color` / `@toast-background-color` 的 fallback 以兼容未设置新变量的场景。
- 时间：2025-03-09
