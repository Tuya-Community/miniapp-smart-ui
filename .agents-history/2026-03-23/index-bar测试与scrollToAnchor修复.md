### Q: 修复 index-bar 测试问题

- **答**：失败原因：实现已改为 `scrollToAnchorIndexData`（与锚点 `data.index` 同类型的键）、`onClick` 使用 `dataset.item`、`scrollToAnchor` 仅收 string 时与单测里数字索引、`onTouchMove` 越界导致 `indexList[index]` 为 `undefined` 不一致；且 `scrollToAnchor` 在 pending 完成后用 `indexOf` 得到数字再递归调用，被 `typeof !== 'string'` 直接 return，队列无法继续。修复：`packages/index-bar/index.ts` 中 `scrollToAnchor` 支持 `string | number`（数字按 `children[i].data.index` 解析）、pending 完成后用 `pendingAnchor[0].data.index` 递归、`onTouchMove` 对 `index` 做 `0..sidebarLength-1` 钳位、去掉无效锚点时的 `console.log`；`packages/index-bar/test/index.spec.ts` 全面改用 `scrollToAnchorIndexData`、断言 `scrollToAnchor` 传入字母键或数字子脚本、`onClick` 用 `dataset.item`。`yarn test packages/index-bar` 37 项通过。
- 时间：2026-03-23
