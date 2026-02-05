---
name: release-checklist
description: Runs a pre-release quality checklist for SmartUI miniapp component library. Use when preparing a release, before tagging or publishing, or when the user asks for a release check or quality checklist.
---

# 发版前质量检查

发版或提 MR 前，按下列清单自检；不通过则先修复再发。

## 修改范围

- [ ] 仅改动了 `packages/` 下代码，未误改 example 下的业务/页面逻辑（允许改 `example/i18n/strings.json` 等多语言与打包相关配置）

## 测试

- [ ] 执行 `yarn test` 全部通过
- [ ] 若有新增或修改 demo，已存在或更新 `test/demo.spec.ts`，快照已更新（`npx jest -u`）且无多余失败用例

## 多语言

- [ ] 新增或修改的 demo 文案均在 `example/i18n/strings.json` 的 `en`、`zh` 中维护，且 key 一致、无缺漏

## 文档与结构

- [ ] 新组件或对外 API 变更已更新对应 `README.md` / `README.en.md`，引入方式、示例、Props 与当前实现一致
- [ ] 组件在 `index.json` 的 `usingComponents` 中正确声明依赖，路径相对当前包且可解析

## 代码规范

- [ ] 若有修改或新增 `*.wxs`，仅使用 ES5 语法（无 const/let、箭头函数、模板字符串等）
- [ ] 组件通过 `SmartComponent` 封装，选项与生命周期命名符合仓库约定（参考 AGENTS.md、component-structure rule）

## 建议执行的命令

```bash
yarn test
yarn test:cover   # 可选，确认覆盖率
```

全部打勾后再进行打 tag、发包或合并。
