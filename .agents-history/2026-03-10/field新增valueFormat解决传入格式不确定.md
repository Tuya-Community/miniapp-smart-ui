### Q: field 传入 value 格式不确定（如 1234.5 可能已是当地格式），无法安全格式化

- **答**：新增 `valueFormat` 属性：`raw`（默认）= value 为规范数字串，组件按 locale 格式化展示；`formatted` = value 已是展示格式，组件不再格式化、原样显示。逻辑在 `updateDisplayValue`、`onInput`、`onConfirm` 中根据 `valueFormat === 'raw'` 才执行 formatNumber/parseFormattedNumber。README 中英文已补充说明与 API。
- 时间：2026-03-10
