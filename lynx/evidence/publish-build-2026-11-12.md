# 默认云构建带齐Lynx产物与归档校验

> 日期：2026-11-12（Asia/Shanghai）
> 负责人：田坤（tiankun）；AI工具：Codex。
> 来源：用户提供线上yarn build日志，确认只执行buildEs/buildLib/buildExample，要求在本地miniapp-smart-ui修改并验证。
> 状态：本地代码修改、云入口模拟构建、发布前正反向校验及实际npm/Yarn归档验证通过；未提交、未推送、未发布npm。

## 原问题与复现

原build和preMinipackBuild都只有WebView的Gulp任务，prepublishOnly只做CSS变量/图片JSON后处理，不生成Lynx。原正式canary归档只有lynx/package.json。先把本地既有lynx/dist、lynx/lib和构建回执移动至私有临时备份，在Node22.14执行未修改的yarn build：退出0、20.43秒，但归档验证仍报Missing dist/action-sheet/index.js（指独立Lynx目录），证明缺文件会被旧构建掩盖。源码和原WebView基线未改。

## 修改内容

- package.json的build在原Gulp三项之后，执行build:lynx及verify:package。移除构建命令里Node24会拒绝的旧no-experimental-fetch选项；dev命令本轮保持原样。
- preMinipackBuild调用yarn run build，平台和普通构建使用同一链路。
- prepublishOnly先执行verify:package，成功后保留原资源后处理；它不自动补构建，缺产物时直接失败，阻止空Lynx入口被发布。
- 新增build/verify-package.cjs：调用既有70组件/WebView SHA验证，检查公共adapters/model等关键运行时及完整npm pack实际文件清单；开发目录、构建元数据和demo不允许进入包。
- npm10.9.2会在pack --ignore-scripts --json输出前夹入prepare/Husky日志；解析器识别实际文件清单并拒绝无效清单。build/verify-package.test.cjs新增4项回归。
- 发布files改用正向白名单：显式纳入lynx/package.json、lynx/dist、lynx/lib；WebView按组件顶层文件和非demo子目录纳入。消除以!开头的files条目，避免Yarn1.22.22再次取反后把整个仓库纳入。Npm/Yarn实包均验证，原WebView发布文件没有删改。
- README-LYNX.md更新默认构建与发布门禁说明，本验证索引同步更新。版本号仍2.13.7，依赖和yarn.lock未改。

## 验证结果

| 验证 | 结果 |
| --- | --- |
| Node24.19执行yarn preMinipackBuild（内部调用build） | 原Gulp三项→70个Lynx组件→归档门禁全部通过，18.43秒 |
| yarn prepublishOnly | 归档校验通过，原后处理执行，无发布动作 |
| 真实缺产物负向验证 | 临时移走lynx/lib，prepublishOnly退出1并提示Missing lynx/lib；567文件及哈希完整恢复，恢复后校验通过 |
| Node22.14/npm10.9.2 | 归档校验通过，prepare前缀解析正常 |
| test:package | 4/4通过 |
| test:lynx | 50/50通过 |
| test:lynx:render | 11/11通过 |
| ESLint与语法/空白检查 | 新增校验脚本零error；git diff --check通过 |
| WebView隔离 | 源码与生成产物的既有SHA基线通过；两种实际归档的1200个原WebView文件路径/字节一致 |
| 实际npm pack与yarn pack | 各包含1135个Lynx文件，dist/lib各70组件，入口/模板/样式/公共运行时齐全，与磁盘SHA逐项一致 |

Npm归档2340文件，Yarn归档2341文件；Yarn额外自动纳入根CHANGELOG.md，运行时载荷一致。构建回执、源覆盖、模板测试、临时Ray适配器和demo均未纳入。

验证过程中发现模板挂载测试会临时创建__lynx-test-holder，不能与实际归档检查并行。本轮将两类检查串行，并在清理后重新打出最终归档；并发产生的中间失败不计作最终结果。

## 范围与交付

原packages/**组件逻辑、接口和WebView行为未修改；70个隔离组件内容沿用既有修复。此改动解决默认编译遗漏及发布归档不完整，不生成或发布消费方Ray分流适配器，也未改业务项目接线。后续新版本要从包含这些改动的分支构建，再由业务按renderer选择独立入口。

机器可读证据与日志位于[publish-build-20261112](publish-build-20261112/archive-validation.json)，真实归档的临时绝对路径及SHA-256记录在该JSON中。未运行npm publish、未推手机，未改版本号或Git提交。

## 提交前最终复核（2026-11-12）

用户授权提交并推送当前 Smart UI 分支用于打包。最终工作区再次通过 4 项归档解析测试、50 项 Lynx 逻辑测试、11 项模板挂载测试及新增 CJS 脚本 ESLint，全部无失败。平台入口 `yarn preMinipackBuild` 完整执行成功（26.51 秒），随后 `yarn prepublishOnly` 成功（3.83 秒）。最终 npm 清单为 2342 项，包含快速指南与详细附录；70 组件隔离及 WebView 基准摘要检查通过。

上文 2340 / 2341 项的实际归档记录保留为加入指南前的验证快照；最终清单增加两份指南。版本仍为 `2.13.7`，本次 Git 提交与推送不包含 npm 发布或手机推包，提交号以 Git 记录为准。
