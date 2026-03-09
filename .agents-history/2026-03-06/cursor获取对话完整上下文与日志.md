### Q: cursor 有办法获取每次对话的完整传给 AI 的上下文和日志吗

- **答**：能拿到的是「对话内容」和本地数据，拿不到「完整请求体」和「服务端日志」。可获取：① 单次对话导出（聊天面板 … → Export chat，Markdown/HTML/文本）；② 全部历史导出（设置/命令面板里 Chat/History 相关）；③ 本地 state.vscdb（`~/Library/Application Support/Cursor/User/globalStorage/`）和 workspaceStorage 里的 prompts/chatdata；④ agent-transcripts（`~/.cursor/projects/<id>/agent-transcripts/*.jsonl`）为结构化对话记录。不能获取：发给模型的完整 payload（系统提示、规则、@ 的文件、截断后的历史等）、服务端请求/响应日志与 token 统计；Cursor 未提供「查看本次完整上下文」或导出请求日志的入口。
- 时间：2026-03-06
