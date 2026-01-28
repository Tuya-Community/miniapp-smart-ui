---
name: demo-i18n-workflow
description: Adds or updates component demo and corresponding I18n entries in example/i18n/strings.json. Use when adding demo blocks, changing demo copy, adding or editing multilingual keys, or updating strings.json for SmartUI demos.
---

# Demo 与多语言维护

为组件新增/修改 demo 时，同步维护多语言与测试。

## 文案与 I18n

- Demo 中所有用户可见文案使用 `I18n.t('key')`，例如：`title="{{I18n.t('basicUsage')}}"`。
- 不在 wxml 中写死中文或英文。

## 维护 strings.json

- 文件路径：`example/i18n/strings.json`。
- 结构：顶层为 `en`、`zh`，其下为 key → 文案。
- 新增或修改文案时，在同一 key 下同时维护：
  - `en[key]`：英文
  - `zh[key]`：中文

## 维护 README 和 README.en

- 如果有新增 demo 需要同步书写到 README 和 README.en 内
- README 内的示例按中/英区块书写，不调用 I18n。
- 每一个新增的 demo 都需要带上一段描述文字
- 如果是新增书写的 demo 则需要在标题后面带上当前开发的版本号 如： 这是一个新增 demo `v2.10.0`
- api 等表格内 新增的属性也需要带上版本号 如： newColor `v2.10.0`

## 流程

1. **改 demo**：在对应 `packages/<组件名>/demo/` 下改 wxml/ts/less，所有展示文案用 `I18n.t('key')`。
2. **改多语言**：在 `example/i18n/strings.json` 的 `en`、`zh` 中补全或修改该 key。
3. 在 README、README.en 内同步 增加或检查 demo 代码和说明。其中标题需要和 `packages/<组件名>/demo/` 内的 demo 标题对应的多语言实际的文案一一对应
4. **跑测试**：执行 `yarn test`；若 demo 结构或文案变了，执行 `npx jest -u` 更新快照。若更新快照报错，先修正测试直到快照可正常生成。

## 检查清单

- [ ] Demo 中无硬编码中文/英文，均通过 I18n.t('key') 展示
- [ ] 所用 key 在 strings.json 的 en、zh 中均有对应文案
- [ ] 所有 README 内 demo 的标题以及内容均和 `packages/<组件名>/demo/` 内代码一一对应
- [ ] `yarn test` 通过，必要时已更新快照
