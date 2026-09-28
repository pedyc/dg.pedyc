---
title: ToolCalling
date-created: 2026-09-27
date-modified: 2026-09-27
---

## 什么是ToolCalling？

> Tool Calling 本质上不是 LLM 自己执行函数，而是 LLM 按照约定的结构（ToolCalling协议）生成一个「调用请求」。

## ToolCalling核心流程

首先关注一个问题：[[LLM是怎么知道有哪些Tool可以调用，以及应该生成什么样的ToolCall？]]

了解后可知ToolCalling的核心流程如下

```bash
用户输入
   ↓
Runtime 准备 Context + Tool Definitions
   ↓
LLM 推理
   ↓
Tool Call
   │
   │ read_file("package.json")
   ↓
Runtime
   │
   ├─ 参数检查
   ├─ 权限 / Policy 检查
   │
   └─ 允许
        ↓
      Tool
        ↓
   文件系统
        ↓
   Tool Result
        ↓
      Runtime
        ↓
   更新 Context
        ↓
       LLM
```

## ToolCalling中的同步和异步

> [[ToolCalling中的同步和异步]]

## ToolCalling的并发和依赖

> [[ToolCalling的并发和依赖]]

## ToolCalling错误处理

> [[ToolCalling错误处理]]

## ToolCalling与Permission/Policy

> [[ToolCalling与Permission、Policy]]

## FAQ

- [[LLM是怎么知道有哪些Tool可以调用，以及应该生成什么样的ToolCall？]]
- [[ToolCalling为什么需要结构化输出？]]
- [[LLM为什么能够选择正确的Tool？]]

## 关联

- [[Agent]]
- [[AgentTool]]
- [[ToolDefinition]]
