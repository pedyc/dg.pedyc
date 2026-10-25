# 项目记忆（WorkBuddy 注入点）

> **本轮的第一个动作：读同目录的 `AGENTS.md`，读完再动手。本文件不复制它的任何一条约定。**

本文件存在的唯一理由：WorkBuddy 每轮自动注入它，但**不会**自动读 `AGENTS.md`。它是一张开机指令，不是内容载体。

## WorkBuddy 侧的机制

- 每轮注入：本文件全文 + 目录快照（文件名与文件数，不含内容）。`CLAUDE.md`、`AGENTS.md` 都不会被自动加载。
- 2026-10-25 起只做指针。此前它 12314 字符、注入时被截断，且大段与 `01-META/Truth` 重复。
- 工作记事 → `.workbuddy/memory/YYYY-MM-DD.md`（append-only）：一次性数字、过程叙事、待办都写那里，不进本文件。
- 新增一条约定时先判归属：**跨 agent 通用 → `AGENTS.md`**；WorkBuddy 独有 → 这里；有真值的定义 → 对应的 `01-META/Truth` 文档，两处都不抄。

## 如果发现约定冲突

以 `AGENTS.md` 与 `01-META/Truth/` 为准，本文件与 `CLAUDE.md` 都是指针，过期即改，不要反过来以它们为准。
