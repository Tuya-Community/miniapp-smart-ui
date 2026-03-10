### Q: 修复测试文件问题

- **答**：失败用例在 `packages/index-anchor/test/index.spec.ts`。原因：组件 `index-anchor/index.ts` 中 `scrollIntoView` 调用 `wx.pageScrollTo` 时传入了 `complete` 和 `fail` 两个回调，而测试里只断言了 `complete: expect.any(Function)`，导致 `toHaveBeenCalledWith` 因实际多出 `fail` 而失败。修复：在两处断言中补充 `fail: expect.any(Function)`，与实现一致。修复后 `yarn test packages/index-anchor/test/index.spec.ts` 全部通过。
- 时间：2026-03-10
