---
name: changelog-from-plans
description: >-
  Drafts or updates root CHANGELOG.md and docs/CHANGELOG.en.md from PLANS.md
  completed items for a target version, then optionally opens a release Pull
  Request to main whose title is the version and whose body is the bilingual
  changelog. Use when preparing release notes, syncing changelog with PLANS,
  adding a version block to CHANGELOG, keeping the English changelog aligned
  with the Chinese one, or raising the "PLANS → changelog → main" release MR.
---

# 从 PLANS 同步更新日志 →（可选）开发布 MR

根据 `PLANS.md` 中**已勾选**的某版本发布计划，在仓库根目录 `CHANGELOG.md` 与 `docs/CHANGELOG.en.md` 顶部插入对应版本区块；条目、顺序与链接以 PLANS 为准，版式沿用历史 CHANGELOG。写好 changelog 后，**可选**继续走 git 提交并对 `main` 开一个发布 PR（标题=版本号，正文=中英文 changelog 拼接）。

## 适用场景

- 发版前根据 PLANS 补齐或修订某一版本（如 `v2.12.0`）的更新说明
- 用户要求「按 PLANS 写 CHANGELOG」「中英文 changelog 对齐」
- 仅中文版更新后，需要同步 `docs/CHANGELOG.en.md`
- 用户要求「从 plans 到 changelog 再到 main 的 MR / PR」——一条龙：写 changelog → 提交 → 开 PR

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

## 检查清单（changelog 部分）

- [ ] 仅包含 PLANS 该版本中已勾选项
- [ ] `CHANGELOG.md` 与 `docs/CHANGELOG.en.md` 版本号与日期一致
- [ ] 中英文条目顺序与链接一致
- [ ] 分类（Features / Bug Fixes）合理且与历史风格接近

## 开发布 MR（可选，写完 changelog 后）

仅当用户要求「开 PR / MR / 到 main」时执行。前置：本机已装并登录 `gh`（`gh auth status` 通过）。

### 分支与提交策略

- **分支**：默认**用当前分支直接开**（本仓库发布流为 `release/2.x` → `main`，PR 标题就是版本号）。不要新建分支，除非用户另行指定。
- **提交**：只提交 changelog 改动（`CHANGELOG.md`、`docs/CHANGELOG.en.md`）；若同一版本还改了 `package.json` version，可一并提交。提交信息用约定式：`docs: 更新 vX.Y.Z 中英文 changelog`（尾部保留仓库要求的 Co-Authored-By）。

### PR 版式（对齐历史 PR，如 [pull/203](https://github.com/Tuya-Community/miniapp-smart-ui/pull/203)）

- **base**：`main`；**head**：当前分支（如 `release/2.x`）。
- **标题**：版本号，形如 `v2.13.3`（不带日期）。
- **正文**：从刚写好的 changelog 中取该版本区块，**去掉 `## vX.Y.Z (日期)` 顶层标题**，按下面顺序拼接：
  1. 中文段：`### Features ✨` / `### Bug Fixes 🐛`（直接来自 `CHANGELOG.md`）
  2. 分隔标题：`## English`
  3. 英文段：`### Features ✨` / `### Bug Fixes 🐛`（直接来自 `docs/CHANGELOG.en.md`）
  - 中英文条目、链接与 changelog 完全一致；无对应分类时该 `###` 小节可省略。

### 执行步骤

1. `gh auth status` 确认已登录；`git branch --show-current` 记录当前分支。
2. `git add CHANGELOG.md docs/CHANGELOG.en.md`（含其他随发版改动则一并 add）。
3. 生成 PR 正文文件（写入临时目录，避免 shell 转义问题），内容按上面版式拼接。
4. **停下确认**：向用户展示 `git diff --staged` 摘要 + PR 标题与正文草稿，**等用户明确同意后**再继续 push / 开 PR。
5. 用户同意后：`git commit` → `git push -u origin <当前分支>` → `gh pr create --base main --head <当前分支> --title "vX.Y.Z" --body-file <正文文件>`。
6. 回传 `gh pr create` 输出的 PR 链接。若同版本 PR 已存在，改用 `gh pr edit <n> --title/--body-file` 更新，不要重复创建。

### 检查清单（MR 部分）

- [ ] `gh auth status` 通过，确认开 PR 的账号符合预期
- [ ] base=`main`、head=当前分支正确
- [ ] 标题为纯版本号；正文含中文段 + `## English` + 英文段
- [ ] push / 开 PR 前已获用户明确同意（不可逆对外动作）
- [ ] 未把仍为 `[ ]` 的未完成项写进 PR

## 与其他 skill 的关系

- 发版前完整自检可配合 `.cursor/skills/release-checklist/SKILL.md`；其中文档与测试项与本流程互补，但不替代「PLANS → 双语文 CHANGELOG」的专门同步。
