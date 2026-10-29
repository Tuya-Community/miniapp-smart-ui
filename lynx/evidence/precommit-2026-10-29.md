# Smart UI Lynx 提交前验证（2026-10-29）

分支：`codex/lynx-smart-ui`。原版基线：`45e7e1e30529f79f86f4876f1af42523286c76a1`。
负责人：用户委托 Codex 检查、提交和推送当前适配；本轮新增代码变更仅为
`lynx/overrides/lynx-runtime/model.ts` 中颜色解析函数的声明顺序调整，无行为变化。

## 本轮实际执行

| 检查 | 结果 |
| --- | --- |
| `yarn build:lynx` | 通过；ESM/CJS 均完成 TypeScript 检查及产物生成 |
| `yarn verify:lynx` / 构建内隔离校验 | 70 组件入口完整；原源码、原 WebView 产物 SHA-256 不变 |
| `yarn test:lynx` | 44 项全部通过 |
| `yarn test:lynx:render` | 11 项全部通过 |
| `yarn test --runInBand` | 117 套件、1094 项测试、51 个快照全部通过 |
| `eslint lynx/overrides --ext .ts` | 通过，无新增错误 |
| `node --check`：三个 Lynx 构建脚本及 Jest 配置 | 通过 |
| `npm pack --dry-run --json --ignore-scripts` | 2341 项文件；归档预估 911613 字节；70 组件两种产物入口完整，排除 overrides/test/evidence/ray/.generated |
| `git diff --check` / 暂存区检查 | 通过 |

生成的 `lynx/dist`、`lynx/lib`、fixture 和 Ray 联编产物不进入 Git，消费前应按根目录
README 运行对应构建。包名、版本及原入口保持原有配置；本轮只提交推送，不发布 npm。

## 验收边界

本轮未执行手机交互和全组件多主题验收，也未重跑 MiniPack fixture 编译。
挂载测试中的 SvgRender 是替身，不代表客户端 SVG 已通过。
此前真机验收及限制继续保留在各专项记录中；Picker 首帧文案延迟仍待优化。
70 组件全量运行验收仍为 `IMPLEMENTED_RUNTIME_PENDING`。
