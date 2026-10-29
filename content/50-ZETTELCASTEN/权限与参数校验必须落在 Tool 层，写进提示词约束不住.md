---
title: 权限与参数校验必须落在 Tool 层，写进提示词约束不住
date-created: 2026-10-20
date-modified: 2026-10-23
content-type: atomic
up: "[[AgentTool]]"
noteId: 1792771582844
---

> 接口的职责是「把意图翻译成一次可执行的外部动作」——参数校验、权限与副作用都发生在这一层，而不是在 LLM 的推理里。

**边界**：接口只保证「可调用」，不保证「会调用」。Tool 的 schema 写得再全，选错工具、填错参数仍然发生，这一层挡不住决策失误。

## 关联

- [[AgentTool]]
