### Q: 修改 field 测试代码修复测试报错问题

- **答**：本地运行 `yarn test packages/field` 未复现报错（25 个用例均通过）。为增强可维护性，已修改 packages/field/test/index.spec.ts：在所有依赖 `wrapper`/`instance` 的用例中增加 `expect(wrapper).toBeTruthy()`、`expect(instance).toBeTruthy()`，并将原先的 `if (instance) { ... }` 改为先断言再 `if (!instance) return;` 后执行逻辑，这样在组件未挂载或选择器失效时会明确报错而非静默通过。demo.spec.ts 未改。若你处仍有具体报错信息，可贴出便于精准修复。
- 时间：2026-03-09
