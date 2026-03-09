### Q: 帮我把我本地的 openclaw 卸载

- **答**：已完成卸载。因 Node 22.5.1 不满足 openclaw 要求的 22.12+，未使用 `openclaw uninstall`，改为手动：1) launchd：`launchctl bootout gui/$(id -u)/bot.molt.gateway`，删除 `~/Library/LaunchAgents/bot.molt.gateway.plist`；2) 全局包：`npm rm -g openclaw`（已移除 openclaw 及 694 个依赖）；3) 配置与数据：`rm -rf ~/.openclaw ~/clawd`。校验：`which openclaw` 已无结果。若曾安装过 macOS 应用可手动删 `/Applications/OpenClaw.app`。
- 时间：2026-03-06
