# 当前分支双仓库临时发布

此模式发布 `@tuya/miniapp-smart-ui` 与 `@ray-js/smart-ui` 的 canary 包，不走正式版阶段 A/B/C，不生成正式 CHANGELOG、发布 PR 或 Git tag，也不把临时版本及依赖写回分支。

## 发布前定位

1. 记录两个仓库的 `git status --short`、当前分支、HEAD、远端地址。保留其他人的改动；远端 Actions 不包含本地未提交的内容。需要提交/推送任务改动时按用户授权和仓库规则处理。
2. miniapp 默认选用户所说的当前分支；Ray 优先使用已包含对应封装/API 改动的同名远端分支。不存在时检查 Ray 当前分支是否包含所需封装，不能直接把 miniapp 分支名当作 Ray 分支，更不能静默回退到 `release/2.x`。无法判断时询问 Ray 的目标分支。
3. 查看所选 ref 上工作流内容，核对发布包名。**miniapp 的 `codex/lynx` 分支在 `publish-canary.yml` 中转发到 `publish-lynx-beta.yml`，发布的是独立 Lynx 包，不能用于主包 canary。** 用户明确要 Lynx 时转用独立 Lynx 工作流；主包预览需先选定包含所需代码且不走此转发的分支，不得自动删改分流。
4. 两个仓库目标 ref 都必须包含 `publish-canary.yml`。Ray 新工作流首次需合入默认分支才可手动触发，并同步到目标分支；遇到未注册/404/422 先检查工作流是否就绪，不通过触发其他发布工作流绕过。
5. `gh auth status` 可用，两个仓库已配置 `NPM_TOKEN`（只查 secret 名称，不读取值）。默认 `dist_tag=canary`；多人同时验证可用 `canary-<用途>`。禁止 `latest`、`beta`。安装时优先提供完整版本，因为可变 tag 会被后续发布覆盖。

## 先发布 miniapp

在 miniapp 仓库执行，以下变量使用前面确定的真实值：

```bash
gh workflow run publish-canary.yml --ref "$MINIAPP_BRANCH" -f dist_tag="$DIST_TAG"
gh run list --workflow publish-canary.yml --branch "$MINIAPP_BRANCH" --event workflow_dispatch --limit 10 --json databaseId,headSha,createdAt,status,url
gh run watch "$MINIAPP_RUN_ID" --exit-status
gh run view "$MINIAPP_RUN_ID" --log
```

按触发时间、目标分支和 HEAD 匹配本次 run，不能直接取全仓最新一次运行。记录 run URL、构建 SHA 和日志/summary 中的完整 `CANARY_VERSION` 为 `MINIAPP_VERSION`。不要从可变 `canary` tag 猜版本，也不要要求两仓版本相同。

```bash
npm view "@tuya/miniapp-smart-ui@$MINIAPP_VERSION" version --registry=https://registry.npmjs.org/ --prefer-online
```

只有查询值与本次版本完全一致，才进入 Ray。registry 暂未可见可有限等待（例如最多 5 分钟）；超时或 miniapp 失败就停止，不触发 Ray。

## 再发布 Ray

在 Ray 仓库执行：

```bash
gh workflow run publish-canary.yml --ref "$RAY_BRANCH" \
  -f miniapp_version="$MINIAPP_VERSION" -f dist_tag="$DIST_TAG"
gh run list --workflow publish-canary.yml --branch "$RAY_BRANCH" --event workflow_dispatch --limit 10 --json databaseId,headSha,createdAt,status,url
gh run watch "$RAY_RUN_ID" --exit-status
gh run view "$RAY_RUN_ID" --log
```

同样定位本次 run，取真实 `CANARY_VERSION` 为 `RAY_VERSION`。Ray 工作流会在临时 runner 内精确安装 `@tuya/miniapp-smart-ui@$MINIAPP_VERSION`、构建、校验打包后的依赖并发包；不调用 `syncMiniappData`、不合并分支、不运行 AI 同步、不推送版本。**若涉及新增组件/Props，先在 Ray 目标分支完成对应封装；仅更新依赖不会自动生成 React API。**

```bash
npm view "@ray-js/smart-ui@$RAY_VERSION" version dependencies --json --registry=https://registry.npmjs.org/ --prefer-online
```

核对版本存在，且 `dependencies["@tuya/miniapp-smart-ui"]` **精确等于** `MINIAPP_VERSION`，不能是 `^` 范围或 tag。

## 重试与交付

- canary 版本包含源码 SHA、run ID 和 attempt，同提交再次运行也生成新版本；不要修改已有 npm 版本，不删除已发布包。旧版 miniapp 工作流只有分支+SHA 时，同提交重试会撞号，先检查目标 ref 是否包含新的版本生成逻辑。
- miniapp 成功、Ray 失败：保留已发布的 miniapp 版本，修复 Ray 后使用同一 `miniapp_version` 重跑 Ray；不必重发 miniapp。
- 回传两个包的完整版本、源码分支/SHA、run 链接和依赖核验结果。面向 Ray 使用者提供 `yarn add @ray-js/smart-ui@<RAY_VERSION>`；原生使用者提供 `yarn add @tuya/miniapp-smart-ui@<MINIAPP_VERSION>`。
- 若只完成第一步或工作流尚未启用，明确指出剩余阻塞，不宣称双仓发布成功。
