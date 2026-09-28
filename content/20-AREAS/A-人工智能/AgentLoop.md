---
title: AgentLoop
aliases:
  - C-Agent-Loop
  - 智能体循环
date-created: 2026-09-22
date-modified: 2026-09-27
content-type: [concept]
up: ["[[Agent]]"]
---

## AgentLoo核心概念

| 概念                   | 含义             | 登录按钮示例           |
| -------------------- | -------------- | ---------------- |
| **Reasoning / 决策**   | 根据当前信息决定下一步做什么 | 决定先读取登录表单        |
| **Action / 行动**      | 对环境执行操作        | 读取文件、修改代码、运行测试   |
| **Observation / 观察** | 获取行动产生的结果      | 获得文件内容、测试结果或错误信息 |

- 决策产生行动建议
- 行动改变环境
- 观察为下一轮决策提供新的依据

## AgentLoop基本运行机制

核心流程：感知/观察→决策→调用工具→观察结果→下一轮循环→直到终止

![[../../_resources/Agent Loop/f017fb5f816873ea29602b6a778b35c8_MD5.webp]]

### 进阶：实际项目中的AgentLoop

- [[ClaudeCode怎么实现AgentLoop？]]
- [[CrewAI怎么实现AgentLoop？]]
- [[DSH怎么实现AgentLoop？]]

## Runtime控制流

> [[ControlFlow]]

## AgentLoop状态机

> [[AgentLoop-状态机]]

## 终止与异常

> [[AgentLoop-终止与异常处理]]

## FAQ

- [[为什么Agent需要循环？]]
- [[ClaudeCode怎么实现AgentLoop？]]
- [[CrewAI怎么实现AgentLoop？]]
- [[DSH怎么实现AgentLoop？]]
