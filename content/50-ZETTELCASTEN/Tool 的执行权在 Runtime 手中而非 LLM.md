---
uid: 202610200117
title: Tool 的执行权在 Runtime 手中而非 LLM
aliases: []
description: "LLM 输出 Tool Call 只是请求执行，不代表工具真的执行、更不代表执行成功；执行权、权限校验都在 Runtime 手中"
tags: [AI, Agent]
date-created: 2026-10-20
date-modified: 2026-10-20
status: active
content-type: atomic
up: "[[ToolCalling]]"
---

> Tool 的执行权在 Runtime 手中，而非 LLM。

## 论据/示例（可选）

LLM 输出 Tool Call 只是请求 Runtime 执行，Runtime 可能依据 Policy / Permission 拒绝执行。因为 Tool 是 LLM 与外部环境交互的接口，可能影响外部环境，所以需要权限约束，不能完全信任 LLM 进行越权操作。Tool 的执行结果也必须由 Runtime 提供——Tool Calling 本身不能证明执行成功。

## 关联

- [[ToolCalling]]
- [[ToolCalling为什么需要结构化输出？]]
- [[Agent 的循环控制由 Runtime 决定而非模型自行决定]]
