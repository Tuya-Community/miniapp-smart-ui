---
name: changelog-from-plans
description: >-
  Drafts or updates root CHANGELOG.md and docs/CHANGELOG.en.md from PLANS.md
  completed items for a target version, matching existing changelog section
  structure and link style. Use when preparing release notes, syncing changelog
  with PLANS, adding a version block to CHANGELOG, or keeping English changelog
  in docs/CHANGELOG.en.md aligned with the Chinese CHANGELOG.
---

# 从 PLANS 同步更新日志

根据 `PLANS.md` 中**已勾选**的某版本发布计划，在仓库根目录 `CHANGELOG.md` 与 `docs/CHANGELOG.en.md` 顶部插入对应版本区块；条目、顺序与链接以 PLANS 为准，版式沿用历史 CHANGELOG。

## 适用场景

- 发版前根据 PLANS 补齐或修订某一版本（如 `v2.12.0`）的更新说明
- 用户要求「按 PLANS 写 CHANGELOG」「中英文 changelog 对齐」
- 仅中文版更新后，需要同步 `docs/CHANGELOG.en.md`

## 输入与范围

1. **版本号**：以 `PLANS.md` 中对应小节标题为准（如 `# v2.12.0`），并与根目录 `package.json` 的 `version` 核对；日期可采用 PLANS 中的计划发布日，或用户指定日，格式与历史一致（如 `(2026-3-26)`）。
2. **条目来源**：只收录该版本下 PLANS 列表里 **`[x]` 已完成** 的项；**不要**写入仍为 `[ ]` 的待定项。
3. **PLANS 未附链接的项**：可仅写描述（如文档笔误修复）；若后续有 commit/PR，可再补链接。

## 版式（必须与历史一致）

根目录 `CHANGELOG.md`：

- 文件首行为 `# 更新日志`
- 新版本块插在**最上方**（紧邻标题后、上一最新版本之前）
- 二级标题：`## vX.Y.Z (YYYY-M-D)`
- 两个三级标题：
  - `### Features ✨` — 新能力、样式/API 增强、导出方法、全局主题变量等
  - `### Bug Fixes 🐛` — 缺陷修复、文档错误修正、类型补全等

`docs/CHANGELOG.en.md`：

- 首行为 `# Changelog`
- 同级结构与中文章节一致；**逐条英文化**，**链接与中文版相同**（同一 PR/commit URL）

## 分类指引

| PLANS 常见表述 | 建议归类 |
|----------------|----------|
| 新增、支持、导出、接入能力、全局 CSS 变量 | Features ✨ |
| 修复、对齐文档/变量笔误、补充 TS 类型 | Bug Fixes 🐛 |
| 同一 PR 含新功能 + 多类修复 | 按 PLANS 拆成两条或分别归入两类 |

组件名、属性名、CSS 变量名保持与原仓库一致；英文说明用现在时或 “Fix …” / “Add …”，与 `docs/CHANGELOG.en.md` 既有语气一致。

## 链接与仓库

- 优先使用 PLANS 中已给出的 `[commit](url)`、`pull/xxx` 链接。
- 历史 CHANGELOG 会混用 `miniapp-smart-ui` 与 `ray-smart-ui` 的 commit 链接：**不要擅自改仓库**，与 PLANS 或原 PR 指向一致即可。

## 执行步骤

1. 打开 `PLANS.md`，定位目标版本小节，列出所有 `[x]` 项及链接。
2. 阅读 `CHANGELOG.md` 与 `docs/CHANGELOG.en.md` 各读**最近 1～2 个版本**，确认标题层级、列表符号、括号与链接空格等习惯。
3. 在 `CHANGELOG.md` 顶部写入中文版 `## vX.Y.Z`，分类填入 Features / Bug Fixes。
4. 在 `docs/CHANGELOG.en.md` 顶部写入同版本英文块，**条目一一对应**，链接复制中文版。
5. 快速自检：无遗漏已完成项、无写入未完成项、英文块与中文章节数量一致。

## 检查清单

- [ ] 仅包含 PLANS 该版本中已勾选项
- [ ] `CHANGELOG.md` 与 `docs/CHANGELOG.en.md` 版本号与日期一致
- [ ] 中英文条目顺序与链接一致
- [ ] 分类（Features / Bug Fixes）合理且与历史风格接近

## 与其他 skill 的关系

- 发版前完整自检可配合 `.cursor/skills/release-checklist/SKILL.md`；其中文档与测试项与本流程互补，但不替代「PLANS → 双语文 CHANGELOG」的专门同步。
