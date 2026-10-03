---
title: Agent学习专项-ContextEngineering
date-created: 2026-10-02
date-modified: 2026-10-03
---

- [ ] 目标完成

## 目标

理解 [[Context Engineering]] 的核心概念、组成与设计方法，能够解释 Agent 为什么需要构建和管理 Context，以及 Context 如何影响 Agent 的行为。

## 成功标准

- [x] 能够口述 Context Engineering 的核心概念 ✅ 2026-10-03

> 因为LLM的Context受到窗口大小、信息相关性、信息组织方式等因素影响，Agent通过上下文工程管理进入Context的信息。核心目标是：在有限窗口内通过动态选择、组装、压缩、更新、注入等方式确定最适合LLM当前推理目标的可靠上下文。

- [x] 能够画出 Agent Context 的基本组成与构建流程 ✅ 2026-10-03
	![[Agent Context.excalidraw]]
- [x] 能够解释 Context、Memory、Tool Definition、Instruction、Tool Result 之间的关系 ✅ 2026-10-03

> Context：LLM当前能看到什么；
> Memory：过去可能有价值的信息；
> Tool Definition：LLM能够做些什么；
> Instruction：LLM应该怎么做；
> Tool Result：环境实际上发生了什么；
> 关系：Context Build将Instruction、Tool Definition、Memory等信息组装成Context发送给LLM，LLM请求Tool Calling，Runtime执行Tool，得到Tool Result重新组装新的Context发送给LLM。

- [ ] 能够解释 Context 过长、信息缺失或信息冲突对 Agent 行为的影响

> a

- ![[Context Engineering#FAQ]]

- [ ] 能够针对一个简单 Agent 场景设计基本的 Context 结构

> a

## 相关知识点

- [[Context Engineering]]
- [[Context Components]]
- [[Context Quality]]
