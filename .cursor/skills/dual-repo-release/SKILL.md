---
name: dual-repo-release
description: >-
  Drives the paired formal release of miniapp-smart-ui and ray-smart-ui: writes
  the bilingual CHANGELOG from PLANS in miniapp-smart-ui and raises its release
  PR to main, then bumps @tuya-miniapp/smart-ui in ray-smart-ui, syncs PLANS,
  writes the Ray-flavoured CHANGELOG and raises the matching PR. Use when the
  user asks to release/发版 both repos, to sync the Ray repo after the miniapp
  formal version is published, or to raise the "双仓库发布 MR".
---

# 双仓库发布（miniapp-smart-ui + ray-smart-ui）

正式发版时两个仓库要一起走：`miniapp-smart-ui` 是源仓库（原生小程序组件），`ray-smart-ui` 是它的 Ray/React 封装，依赖 npm 包 `@tuya-miniapp/smart-ui`。两边各自从 `release/2.x` 向 `main` 开一个标题为版本号的 PR。

## 适用场景

- 「发正式版 / 发版 / 两个仓库都发一下」
- 「miniapp 正式版本发布了，ray 仓库跟一下」
- 「从 PLANS 到 changelog 再到两个 MR」

## 仓库与前置

| 角色 | 默认路径 | 分支 | npm 包 |
|------|----------|------|--------|
| 源仓库 | `~/Documents/github/miniapp-smart-ui` | `release/2.x` → `main` | `@tuya-miniapp/smart-ui` |
| Ray 封装 | `~/Documents/github/ray-smart-ui` | `release/2.x` → `main` | `@ray-js/smart-ui` |

开工前：`gh auth status` 通过（确认账号符合预期）、两仓库 `git fetch` 且工作区干净、当前分支为 `release/2.x`。

**版本号不要手改**：两个仓库 `package.json` 的 `version` 都由 CI 在合并后打成正式号（`chore(release): npm X.Y.Z release by Github Actions`）。本流程只改 changelog、PLANS 与 ray 的依赖。

---

## 阶段 A：miniapp-smart-ui 写 changelog 并开 PR

细节沿用 `.cursor/skills/changelog-from-plans/SKILL.md`，这里只列双仓库场景下必须做的：

1. 从 `PLANS.md` 目标版本小节取 **`[x]` 已完成** 项；`[ ]` 未完成项不写（对应 PR 未合的也不写）。
2. **逐条与代码核对**，不要照抄 PLANS：
   ```bash
   git log --oneline origin/main..origin/release/2.x
   git diff --stat origin/main...origin/release/2.x
   git diff origin/main...origin/release/2.x -- packages/<组件>/
   ```
   PLANS 里的 CSS 变量名 / 属性名笔误以代码为准，顺手在 PLANS 修正（改前先问用户）。
3. 在 `CHANGELOG.md` 与 `docs/CHANGELOG.en.md` 顶部插入 `## vX.Y.Z (YYYY-M-D)` 区块，Features ✨ / Bug Fixes 🐛 两类，中英文条目与链接一一对应。
4. 点名提交 → push → 开 PR：
   ```bash
   git add CHANGELOG.md docs/CHANGELOG.en.md PLANS.md
   git commit -m "docs: 更新 vX.Y.Z 中英文 changelog"
   git push origin release/2.x
   gh pr create --base main --head release/2.x --title "vX.Y.Z" --body-file <正文文件>
   ```
   正文版式：中文段 → `## English` → 英文段（去掉 `## vX.Y.Z (日期)` 顶层标题）。同版本 PR 已存在则 `gh pr edit <n> --body-file`，不要重复创建。

---

## 阶段 B：等正式包发布

合并后 CI 才会发正式包。**确认 latest 已是目标版本再动 ray 仓库**：

```bash
npm view @tuya-miniapp/smart-ui dist-tags --json
```

`latest` 不等于 `X.Y.Z` 就停下等待，不要提前把 ray 的依赖指过去。

---

## 阶段 C：ray-smart-ui 跟版

1. **同步分支**：`git pull --ff-only origin release/2.x`（ray 的 CI 会往这个分支推 `CI(template)` 和 `chore(release)` 提交，本地常落后）。

2. **依赖不用手改，交给 CI**。`build/updatePackage.js` 会读 miniapp 仓库 `package.json` 的 `version` 并写进依赖：非 beta 写 `^X.Y.Z`，beta 写精确号。只要**在 miniapp 正式版本发布之后**触发一次 `CI(template)`（往 `release/2.x` 推任意提交即可），它就会把依赖和 yarn.lock 一起改对。

   ⚠️ **顺序反了会被回滚**：在 miniapp 的 `package.json` 还是 `X.Y.Z-beta-N` 时手动改成 `^X.Y.Z`，随后跑的 CI 会按 miniapp 当时的版本把它改回 beta 号——2.13.4 就是这么让正式包依赖上 beta 的（见「坑」）。

3. **若确实要手改**（比如等不及 CI），改完 `package.json` 后同步 yarn.lock 的 entry：
   ```bash
   npm view @tuya-miniapp/smart-ui@X.Y.Z dist.shasum dist.integrity
   ```
   `resolved` 用 `https://registry.yarnpkg.com/@tuya-miniapp/smart-ui/-/smart-ui-X.Y.Z.tgz#<shasum>`。改完必须校验：
   ```bash
   yarn install --frozen-lockfile --ignore-scripts
   grep '"version"' node_modules/@tuya-miniapp/smart-ui/package.json
   ```
   并且**确认 miniapp 的 package.json 已经是正式号**，否则下一次 CI 会推翻它。

4. **同步 PLANS.md**：`build/copyPLANS.js` 是**全量覆盖**，所以直接把 miniapp 的 PLANS.md 拷过来，保证两边逐字一致。
   ```bash
   cp ../miniapp-smart-ui/PLANS.md PLANS.md
   ```

5. **写 changelog**（`CHANGELOG.md` + `docs/CHANGELOG.en.md`）。条目与 miniapp 同源，但要**改成 Ray 命名**：
   | miniapp（WXML 连字符） | ray（React 驼峰） |
   |----|----|
   | `loop-map` | `loopMap` |
   | `swipe-threshold` | `swipeThreshold` |
   | `custom-class` | `customClass` / `className` |
   CSS 变量名两边一致，不用改。写之前 `grep` 一下上一个版本号是否存在——**ray 的 changelog 历史上曾整版漏写**（PR 标题写 v2.13.3，实际只补了 v2.13.2），发现缺口就一并补上并在汇报里说明。

6. **不要跑 `node build/syncMiniappData.js`**：它假设 `../miniapp-smart-ui` 与本仓库同级，并且脚本末尾会自行 `git commit`/push；CI 会自动跑（表现为 `CI(template): update CSS var and README` 提交）。需要参考它的逻辑就读源码。

7. 点名提交 → push → 开 PR：
   ```bash
   git add package.json yarn.lock PLANS.md CHANGELOG.md docs/CHANGELOG.en.md
   git commit -m "chore(release): 同步 miniapp X.Y.Z 正式版本并更新 changelog"
   git push origin release/2.x
   gh pr create --base main --head release/2.x --title "vX.Y.Z" --body-file <正文文件>
   ```
   正文版式与 miniapp 一致（中文段 + `## English` + 英文段），用 ray 的 changelog 内容。

---

## 坑（都踩过）

- **依赖降级事故（2.13.4 踩过）**：miniapp 的 PR 合并后，它的 CI 才会把 `package.json` 打成正式号。如果在这之前就在 ray 手改依赖并推送，ray 的 `CI(template)` 会读到 miniapp 仍是 beta 的 `package.json`，把依赖改回 `X.Y.Z-beta-N`，而这个回滚后的内容就是最终合并、发布的版本——结果正式包 `@ray-js/smart-ui@X.Y.Z` 依赖 `@tuya-miniapp/smart-ui@X.Y.Z-beta-N`。已发布的包改不了，只能下个版本带上。**正确做法：确认 miniapp 正式包发布（阶段 B）后再动 ray，并让 CI 去写依赖。**
- **合并前后都要复查依赖**：开 PR 前和合并前各看一次 `git show origin/release/2.x:package.json | grep tuya-miniapp`，确保没被 CI 改回 beta。
- **PLANS 里的「测试版本 `X.Y.Z-beta-N`」两仓库编号不一定对得上**：各自 CI 各自递增。要确认某个修复落在哪个 beta，看**本仓库** `git log` 里 `chore(release)` 提交与该修复合并提交的先后，不要信 PLANS 的数字。
- **ray 的 changelog 可能落后一版**，见阶段 C 第 5 步。
- **PLANS 的变量名/属性名会有笔误**（如同一个变量写两遍），以代码为准。
- **提交只点名文件**，禁止 `git add -A` / `git commit -a`：仓库可能有其他 agent 的改动。共改文件不提交，留在工作区并在汇报里说明。
- **push 与开 PR 是不可逆对外动作**：执行前展示 `git diff --cached --stat` + PR 标题正文草稿，等用户明确同意。

## 检查清单

阶段 A（miniapp-smart-ui）
- [ ] 只收录 PLANS 中 `[x]` 项，且逐条与 `origin/main...origin/release/2.x` 的 diff 对过
- [ ] `CHANGELOG.md` 与 `docs/CHANGELOG.en.md` 版本号、日期、条目顺序、链接一致
- [ ] `package.json` 的 `version` 未手改
- [ ] PR：base `main`、head `release/2.x`、标题为纯版本号、正文含 `## English`

阶段 B
- [ ] `npm view @tuya-miniapp/smart-ui dist-tags` 的 `latest` 已是目标正式版本

阶段 C（ray-smart-ui）
- [ ] 依赖为 `^X.Y.Z`（CI 写的或手改后确认未被回滚），`yarn install --frozen-lockfile` 通过，`node_modules` 内实际版本正确
- [ ] 合并前再确认一次远端 `release/2.x` 的依赖仍是 `^X.Y.Z`
- [ ] `PLANS.md` 与 miniapp 逐字一致（`diff` 无输出）
- [ ] changelog 用 Ray 命名，且没有漏写的历史版本
- [ ] PR：base `main`、head `release/2.x`、标题为纯版本号、正文含 `## English`

收尾
- [ ] 两个 PR 链接都回传给用户，并说明合并后由 CI 打正式版本号、发 npm
- [ ] 合并后把 `main` 合回两个仓库的 `release/2.x`（拿到 CI 打的正式版本号），并核对 `npm view <包名>@X.Y.Z dependencies` 无误

## 与其他 skill 的关系

- `.cursor/skills/changelog-from-plans/SKILL.md`：单仓库「PLANS → 双语 changelog →（可选）MR」的细则，阶段 A 直接复用。
- `.cursor/skills/release-checklist/SKILL.md`：发版前的代码质量自检（测试、多语言、文档），建议在阶段 A 之前跑。
- ray 仓库的 `.cursor/skills/sync-miniapp-to-ray/SKILL.md`：组件代码本身（Props / WXML→TSX / README）的同步规则，属于开发期，不在本发布流程内。
