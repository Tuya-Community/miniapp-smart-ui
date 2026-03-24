### Q: numberFormat.ts 目前支持负数吗

- **答**：不支持。`formatNumber` 与 `parseFormattedNumber` 均用 `replace(/[^\d.]/g, '')` 清洗，负号会被去掉；需支持时应单独处理前导 `-` 并与绝对值格式化后拼接。
- 时间：2026-03-18
