### Q: agent-memory.mdc 检查 rule 为什么今天的聊天都没有创建当天的日期文件而是都加在了 2026-03-06 里

- **答**：规则里只写了「今日日期」和「当日文件夹」，未规定「今日」从哪来，导致 agent 可能复用已有文件夹（如 2026-03-06）或未使用对话上下文中的当前日期。已在 .cursor/rules/agent-memory.mdc 中：1) 在存放结构后增加「当日日期来源（必读）」：YYYY-MM-DD 必须使用本次对话上下文中给出的当前日期（如 Cursor 的 Today's date），不得仅因 .agents-history 下已有某日期文件夹就复用；2) 在回答后第二步明确写「YYYY-MM-DD 取本次对话上下文中的今日（如 user_info/系统提供的 Today's date）」。
- 时间：2026-03-06
