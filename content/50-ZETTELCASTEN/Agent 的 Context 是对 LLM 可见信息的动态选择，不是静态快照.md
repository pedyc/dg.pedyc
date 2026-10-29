---
uid: 202610200118
title: Agent 的 Context 是对 LLM 可见信息的动态选择，不是静态快照
aliases: []
description: Context Engineering 的核心目标是在有限窗口内动态选择、组装、压缩、更新、注入信息，确定最适合 LLM 当前推理目标的可靠上下文
tags:
  - AI
  - Agent
date-created: 2026-10-20
date-modified: 2026-10-20
status: active
content-type: atomic
up: "[[Context Engineering]]"
noteId: 1792465705747
---

> Context 是 Agent 对 LLM 可见信息的~~动态选择~~，而非~~静态快照~~。

**边界**：动态选择的前提是有选择器（检索、摘要、裁剪）和明确的预算。任务短、窗口充裕时，全量塞入比选择更可靠——选择本身就是一个可能漏掉关键信息的环节。

## 论据/示例（可选）

LLM 的 Context 受窗口大小、信息相关性、信息组织方式等因素限制。Context Engineering 通过动态选择、组装、压缩、更新、注入等方式，在有限窗口内确定最适合 LLM 当前推理目标的可靠上下文。Context、Memory、Tool Definition、Instruction、Tool Result 五者的关系：Context 是 LLM 当前看到的，Memory 是过去可能有价值的，Tool Definition 是能做什么，Instruction 是该怎么做，Tool Result 是环境实际发生了什么。

## 关联

- [[Context Engineering]]
- [[Context Components]]
- [[Context Quality]]
