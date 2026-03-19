### Q: numberFormat 补齐负数能力

- **答**：已在 `formatNumber` 中解析前导 ASCII `-`（连续偶数个视为正），对绝对值做千分位后再加前缀 `-`；仅 `-` 时返回 `-` 便于输入。`parseFormattedNumber` 识别前导 `-` 与 Unicode `U+2212`，去千分位后输出 `-1234.56` 形式。单测见 `packages/field/test/numberFormat.spec.ts`。
- 时间：2026-03-18
