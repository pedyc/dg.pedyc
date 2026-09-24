---
title: AgentLoop
aliases:
  - C-Agent-Loop
  - 智能体循环
date-created: 2026-09-22
date-modified: 2026-09-23
content-type: [concept]
up: ["[[Agent]]"]
---

## AgentLoo核心概念

> Re-Act

| 概念                   | 含义             | 登录按钮示例           |
| -------------------- | -------------- | ---------------- |
| **Reasoning / 决策**   | 根据当前信息决定下一步做什么 | 决定先读取登录表单        |
| **Action / 行动**      | 对环境执行操作        | 读取文件、修改代码、运行测试   |
| **Observation / 观察** | 获取行动产生的结果      | 获得文件内容、测试结果或错误信息 |

- 决策产生行动建议
- 行动改变环境
- 观察为下一轮决策提供新的依据

## AgentLoop基本运行机制

核心流程：获取上下文（Observe）→模型决策（Think）→执行动作（Act）→观察结果（Observe）→更新上下文（Think）→再次决策（Act）

![[../../_resources/Agent Loop/f017fb5f816873ea29602b6a778b35c8_MD5.webp]]

## AgentLoop控制流（Control Flow）

> 在AgentLoop中，究竟是谁决定下一步做什么、谁负责执行，以及谁决定循环何时继续或结束？

**三个核心概念**：
- 模型决策：LLM 根据上下文提出下一步行动。
- 运行时控制：Runtime/Orchestrator 根据系统规则协调和执行流程。
- 任务完成判断：模型可能提出完成请求，但系统仍需根据中止条件决定是否结束，并在必要时验证。


## FAQ

- [[为什么Agent需要循环？]]
