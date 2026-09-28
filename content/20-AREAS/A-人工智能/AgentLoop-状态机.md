---
title: AgentLoop-状态机
date-created: 2026-09-27
date-modified: 2026-09-27
---

可以把AgentLoop建模为一个状态机，帮助我们更严谨的分析执行过程。

状态间的转化由事件和规则决定。

## AgentLoop状态机示例

定义如下状态：

|状态|含义|
|---|---|
|`Ready`|已准备好处理任务|
|`Thinking`|正在等待或处理 LLM 输出|
|`Executing`|正在执行工具|
|`AwaitingApproval`|正在等待用户授权|
|`HandlingFailure`|正在处理执行失败|
|`Verifying`|正在进行任务验证|
|`Completed`|任务已结束|
|`Aborted`|任务被中止|

控制流示意如下：

```bash
Ready
  │
  ▼
Thinking
  │
  ├── 请求工具 ──► Executing
  │                   │
  │                   ├── 成功 ──► Thinking
  │                   └── 失败 ──► HandlingFailure
  │
  ├── 请求授权 ──► AwaitingApproval
  │                   │
  │                   ├── 批准 ──► Executing
  │                   └── 拒绝 ──► Aborted
  │
  └── 请求结束 ──► Verifying
                      │
                      ├── 满足条件 ──► Completed
                      └── 未满足 ──► Thinking
```
