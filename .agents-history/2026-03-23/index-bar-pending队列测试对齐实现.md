### Q: 修复测试问题（index-bar pending）

- **答**：`packages/index-bar/index.ts` 的 `scrollToAnchor` 在 then/catch 中已改为 `const dataIndex = this.pendingAnchor[0].data.index; this.scrollToAnchor(dataIndex)`（字符串），首段滚动结束后会继续滚到队列中的锚点。`index.spec.ts` 里两条 pending 用例仍按旧 bug 断言 `anchor2`/`anchor3` 的 `scrollIntoView` 不应被调用，导致失败。已改为首段完成后 `expect(anchor2.scrollIntoView).toHaveBeenCalled()`、替换场景下 `expect(anchor3.scrollIntoView).toHaveBeenCalled()` 且 `anchor2` 仍不应被调用；注释同步为当前实现。`yarn test packages/index-bar` 通过。
- 时间：2026-03-23
