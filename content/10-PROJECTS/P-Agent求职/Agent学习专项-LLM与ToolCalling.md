---
title: Agent学习专项-LLM与ToolCalling
date-created: 2026-09-27
date-modified: 2026-09-27
---

- [x] 完成状态 ✅ 2026-09-28

## 目标

理解 LLM 在 Agent 中的作用，以及 [[ToolCalling]] 的基本机制，能够解释 LLM 如何通过Tool与外部环境交互。

## 成功标准

- [x] 能够口述 **LLM、Tool、Tool Call、Agent Runtime** 之间的关系 ✅ 2026-09-28

> LLM生成Tool Call请求调用Tool，Agent Runtime决定是否调用Tool以及怎样把Tool的执行信息回传给LLM。

- [x] 能够解释一次完整 「ToolCalling流程」：LLM 决策 → 生成 Tool Call → Runtime 执行 → 返回结果 → LLM 继续推理 ✅ 2026-09-28

> LLM
> ↓ Runtime提供ToolDefinition和Context
> 生成Tool Call
> ↓
> Runtime
> ↓
> 权限 / Policy / 参数检查 （Runtime机制）
> ↓
> 执行Tool
> ↓
> Environment
> ↓
> Tool Result （Observation）
> ↓
> Runtime
> ↓
> LLM Context
> ↓
> LLM 下一轮推理

- [x] 能够区分 **LLM 输出 Tool Call** 与 **Runtime 实际执行 Tool** 的区别 ✅ 2026-09-28

> LLM输出ToolCall只是请求Runtime执行Tool，不代表Runtime实际执行了Tool，Runtime可能会根据Policy / Permission 拒绝执行。

- [x] 能够画出一个基本的 **LLM + Tool Calling + Runtime** 架构图 ✅ 2026-09-28
	![[ToolCalling.excalidraw]]
- [x] 能够解释 Tool Calling 为什么不能证明工具执行成功，以及执行结果为什么必须由 Runtime 提供 ✅ 2026-09-28

> Tool的执行权在Runtime手中，LLM只是生成ToolCall，不代表Tool执行，更不代表Tool执行成功。因为Tool是LLM和外部环境交互的接口，可能会影响外部环境，所以需要Policy、Permission等约束，而不能完全信任LLM进行越权操作。

- [x] 能够解释Tool Calling 为什么需要结构化输出 ✅ 2026-09-28

> Tool是由Runtime来执行的，Runtime 需要能够可靠地解析 LLM 的输出，并据此找到 Tool、提取参数、执行调用。

## 关联

- [[LLM]]
- [[AgentTool]]
- [[ToolCalling]]
- [[ToolCalling为什么需要结构化输出？]]
