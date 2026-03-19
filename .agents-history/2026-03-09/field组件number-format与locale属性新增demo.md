### Q: field 组件 根据我新增的 number-format 和 locale 属性 新增 demo

- **答**：已按 demo-i18n 流程完成。1) 在 packages/field/demo/index.wxml 末尾新增 demo-block「数字格式化」，内含两个 smart-field：一个 number-format 默认（展示 12,345.67），一个 number-format + locale="de"（展示 12.345,67）；2) demo/index.ts 增加 numberFormatValue、numberFormatValueDe 初始值 12345.67；3) example/i18n/strings.json 增加 fieldNumberFormat、fieldAmount、fieldAmountLocaleDe 中英文；4) README.md / README.en.md 新增「数字格式化」章节（v2.11.2）及 API 表 number-format、locale 两行（v2.11.2）；5) 已执行 npx jest packages/field/test/demo.spec.ts -u 更新快照并通过。
- 时间：2026-03-06
