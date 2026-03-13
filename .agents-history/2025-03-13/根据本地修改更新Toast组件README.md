### Q: 根据我本地的修改 更新组件README

- **答**：根据 git diff 与 `packages/toast/`、`packages/common/style/var.less` 的本地修改，已同步 Toast 组件 README。中文 README 的样式变量表此前已按 index.less/var.less 更新（文字/图标分离的 min-width/max-width、line-height 16px、default-padding 19px 15px、--toast-icon-text-padding-top、--toast-default-width 废弃说明等）；本次将 **README.en.md** 的「Style Variables」表与中文版及 var.less 对齐：补充 --toast-text-min-width(96px)、--toast-text-max-width(280px) v2.12.0，将 --toast-min-width 改为 82px、--toast-max-width 改为 280px，--toast-line-height 改为 16px，--toast-default-padding 改为 19px 15px，--toast-default-width 标 @deprecated v2.12.0，新增 --toast-icon-text-padding-top 8px，描述列改为与中文一致的「text-only / icon notification」等。动态更新示例中的 width 88→120 与 demo/index.ts 的修改在中英文 README 中已存在。
- 时间：2025-03-13
