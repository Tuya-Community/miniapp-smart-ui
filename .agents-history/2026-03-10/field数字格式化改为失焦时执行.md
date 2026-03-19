### Q: field 组件 numberFormat 在 value change 时格式化导致输入异常，改为失焦时格式化

- **答**：在 `packages/field/index.ts` 中：① `updateDisplayValue()` 内仅在 `numberFormat && displayValue && !this.focused` 时调用 `formatNumber`，聚焦时不格式化；② `onBlur()` 中在 `this.focused = false` 后调用 `this.updateDisplayValue()`，失焦时再格式化显示。输入过程展示原始值，失焦后展示千分位等格式化结果。
- 时间：2026-03-10
