---
title: Context Isolation
date-created: 2026-10-03
date-modified: 2026-10-03
---

- 不同子Agent/子任务使用**独立上下文**
- 避免污染：工具返回的原始数据不应直接进入主上下文
- 常见做法：Sub-agent只返回摘要给主Agent
