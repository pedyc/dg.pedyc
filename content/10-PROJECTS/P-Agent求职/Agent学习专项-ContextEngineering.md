---
title: Agent学习专项-ContextEngineering
date-created: 2026-10-02
date-modified: 2026-10-02
---

## 目标

理解 [[Context Engineering]] 的核心概念、组成与设计方法，能够解释 Agent 为什么需要构建和管理 Context，以及 Context 如何影响 Agent 的行为。

## 成功标准

- 能够口述 Context Engineering 的核心概念

> 因为LLM的上下文窗口有限并且对于结构和顺序敏感，Agent通过上下文工程管理上下文。核心目标是：在有限窗口内通过动态选择、组装、压缩、更新、注入等方式确定最适合LLM当前推理目标的可靠上下文。

- 能够画出 Agent Context 的基本组成与构建流程
	![[Agent Context.excalidraw]]
- 能够解释 Context、Memory、Tool Definition、Instruction、Tool Result 之间的关系
- 能够说明 Context 过长、信息缺失或信息冲突会如何影响 Agent
- 能够针对一个简单 Agent 场景设计基本的 Context 结构
