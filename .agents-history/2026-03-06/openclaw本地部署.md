### Q: 帮我本地部署一下 openclaw

- **答**：OpenClaw 是开源自托管 AI 助手网关（支持 WhatsApp、Telegram、Discord 等）。本地部署：1) 需 Node 22+；2) 修复 npm 缓存权限：`sudo chown -R $(whoami) ~/.npm`；3) 安装：`curl -fsSL https://openclaw.ai/install.sh | bash` 或 `npm install -g openclaw@latest`；4) 引导并安装服务：`openclaw onboard --install-daemon`；5) 启动：`openclaw gateway --port 18789`，控制台 `openclaw dashboard` 或访问 http://127.0.0.1:18789/。配置在 `~/.openclaw/openclaw.json`。本次执行时因 `~/.npm` 含 root 所属文件导致 npm 安装 EACCES，需先执行 chown 再重试安装。
- 时间：2026-03-06 11:42
