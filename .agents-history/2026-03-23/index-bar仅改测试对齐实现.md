### Q: 不是改组件代码，只改测试用例修复 index-bar 测试

- **答**：已 `git checkout` 恢复 `packages/index-bar/index.ts`（不保留对 scrollToAnchor/onTouchMove 的组件侧修改）。仅改 `packages/index-bar/test/index.spec.ts`：`scrollToAnchor` 只接受 string，用 `scrollToAnchor('A'|'B'|'C')` 替代数字 0/1/2；「相同索引」用 `scrollToAnchor('A')`；`onClick` 保持 `dataset.item`；侧栏越界触摸断言为 `scrollToAnchor(undefined)`；pending 队列两条用例按当前实现断言：首段滚动完成后 `then` 内用数字调用 `scrollToAnchor` 会被直接 return，故 `anchor2`/`anchor3` 的 `scrollIntoView` **不应**被调用。`yarn test packages/index-bar` 通过（运行中仍有组件内 `console.log('没有找到锚点')`）。
- 时间：2026-03-23
