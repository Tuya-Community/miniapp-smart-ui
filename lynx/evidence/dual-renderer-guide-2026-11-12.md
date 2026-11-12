# 新项目双渲染接入指南验证

日期：2026-11-12。执行：Codex。范围：新增根目录 `GUIDE-LYNX-WEBVIEW.md`，添加中英文 README 及 Lynx README 入口，并将指南加入 npm 发布白名单。没有修改组件逻辑、版本号、业务项目或 node_modules。

## 文档覆盖

- 宿主 / 小程序 SDK / Ray 包装层的职责，原生小程序分目录引用。
- 固定版本与完整产物预检，说明已知缺编译目录的 canary 不能作为完整 Lynx 包。
- 源码生成 Ray 适配器、两个包名的解析别名、AutoImport 与 TypeScript paths。
- 页面模式上下文、Popup / Picker / Toast 示例、实例 API 分流及 Slider / 插槽 / ref 边界。
- 适配器复制的是源码构建产物且含 Slider 绝对路径；流水线须重新生成。
- CI 顺序、双端验收矩阵、故障排查与当前真机验收边界。

## 实际检查

1. 使用只读的业务依赖生成临时适配器，参数与指南一致：包装层 `2.13.3`、Slider `0.3.10-beta.3`。输出仅在被忽略的 `lynx/.generated/guide-validation/smart-ui-bridge/`；原依赖未修改。
2. 从指南代码块提取真实 `ray.config.ts` 片段与 JSX 示例，在临时目录采用指南的 TS paths 做严格类型检查（TypeScript `4.9.5`），退出码 0。配置使用 Node `createRequire`，避免与小程序全局 `require` 类型冲突。
3. 所有 JSON 代码块可解析，全部 shell 代码块通过 `bash -n`，文档相对文件链接目标存在，`git diff --check` 通过。
4. `yarn verify:package` 通过：70 组件隔离校验、原 WebView 源码及基准产物摘要一致，npm 清单 2341 项。
5. 实际 `npm pack --ignore-scripts` 成功，归档位于 `/tmp/smart-ui-guide-archive-20261112/tuya-miniapp-smart-ui-2.13.7.tgz`。确认指南内容与工作区逐字节一致，包含 1134 个 Lynx 编译文件及 `lynx/package.json`，不含临时适配器。归档检查结果与编译示例保存在本地 `lynx/.generated/guide-validation/`，不进入 Git 或 npm。
6. 执行生成适配器保留的 AutoImport 转换，Picker、Popup、Toast、Slider 及三种显式 Lynx 实例 API 共 7 个入口均能找到生成的 JS 和类型文件。

这些检查证明文档命令可生成适配器、示例类型成立、指南可随包分发；本轮没有部署业务、操作手机或进行新一轮真机视觉 / 交互验收。组件总体 `IMPLEMENTED_RUNTIME_PENDING` 状态保持。本轮未提交、推送或发布 npm。

## 按用户反馈简化

入口指南收敛为安装依赖、生成适配器、配置引用、按页面传模式四步。完整原生接入、CI、示例与排查内容迁入 `GUIDE-LYNX-WEBVIEW-DETAILS.md`，两份文档均纳入发布白名单。重新检查 JSON、shell 语法、相对文件链接及 diff；本次只重组文档，没有重跑组件测试或重打归档，以上归档数值对应简化前验证。
