---
title: 应该只把提炼后的ToolResult放入Context
date-created: 2026-10-03
date-modified: 2026-10-03
content-type:
  - atomic
up:
  - "[[Context Quality]]"
---

Tool Result 往往是最占空间，噪声最大的部分。

并且 Tool Result 只是 Tool Call 的结果，是任务的原料而非任务的结论。

所以在把 Tool Result 放入 Context 中时应先进行提炼，只保留需要的部分。
