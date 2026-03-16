### Q: 通过 less 补齐 toast README css 表格（index.less:16-19）

- **答**：根据 `packages/toast/index.less` 与 `packages/common/style/var.less` 补齐并统一了 README 的「样式变量」表。（1）新增与 16-19 行对应的变量：`--toast-border` 默认 `1px solid rgba(255, 255, 255, 0.05)`，`--toast-box-shadow` 默认 `0 4px 12px rgba(0, 0, 0, 0.1), 0 16px 32px rgba(0, 0, 0, 0.12)`。（2）其余默认值与 var.less 对齐：如 `--toast-min-width`/`--toast-default-width`/`--toast-default-min-height` 为 56px，`--toast-max-width` 为 `calc(100vw - 48px)`，`--toast-border-radius` 为 12px，`--toast-background-color` 为 `var(--smart-ui-toast-background, #5C5C5C)`，`--toast-text-padding` 为 14px 16px，`--toast-default-padding` 为 22px 14px 14px。文件：`packages/toast/README.md`。
- 时间：2025-03-11
