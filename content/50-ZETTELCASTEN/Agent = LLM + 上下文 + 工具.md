---
uid: 202608201105
title: Agent = LLM + 上下文 + 工具
aliases: []
description: Agent 由 LLM（思考）、上下文（感知）、工具（能力）三者构成，缺一不可
tags:
  - AI
  - Agent
date-created: 2026-08-20
date-modified: 2026-10-20
status: active
content-type: atomic
up:
  - "[[Agent]]"
noteId: 1792465705185
---

> Agent = LLM + ~~上下文~~ + ~~工具~~：LLM 负责思考，上下文负责感知，工具负责能力。

## 论据/示例（可选）

三者各司其职：LLM 负责理解和生成，上下文决定 Agent 能感知到什么信息，工具决定 Agent 能对环境影响或获取什么能力。这解释了 Agent 与普通 LLM 调用的本质区别——LLM 只生成/推理，Agent 则是围绕目标、通过感知-决策-行动与环境循环交互的系统。

## 关联

- [[Agent]]
- [[Agent 的循环控制由 Runtime 决定而非模型自行决定]]
- [[Tool 的执行权在 Runtime 手中而非 LLM]]

