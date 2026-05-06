---
uid: 202605061500
title: React Fiber 的时间切片基于优先级调度
aliases: []
description: "React Fiber 通过优先级队列调度工作单元，高优先级可打断低优先级"
tags: []
date-created: 2026-05-06
date-modified: 2026-05-06
status: fleeting
content-type: atomic
up:
---

> React Fiber 的时间切片通过优先级调度实现，高优先级任务（如用户输入）可打断低优先级任务（如列表渲染）

## 论据/示例

**1. React Fiber 优先级体系**

```javascript
// 优先级从高到低
const ImmediatePriority = 1;      // 最高：同步任务（如 click）
const UserBlockingPriority = 2;    // 用户阻塞（如输入验证）
const NormalPriority = 3;         // 正常（如列表渲染）
const LowPriority = 4;           // 低优先级（如数据分析）
const IdlePriority = 5;           // 最低：空闲时执行
```

**2. 优先级调度流程**

```bash
当前任务：渲染大列表（NormalPriority）
    ↓
时间片用完，检查是否有更高优先级任务
    ↓
用户点击 → InputPriority > NormalPriority
    ↓
中断列表渲染，优先处理点击事件
    ↓
处理完成后，从断点恢复列表渲染
```

**3. 与 requestIdleCallback 的区别**

| 维度 | requestIdleCallback | Fiber 优先级调度 |
|:---|:---|:---|
| 调度依据 | 空闲时间 | 任务优先级 |
| 打断能力 | 无优先级概念 | 高优先级打断低优先级 |
| 响应性 | 一般 | 更好（用户交互优先） |

> [!tip]
React 没有直接用 requestIdleCallback，而是自己实现了**优先级队列**。

**4. 实际效果**

- 用户输入点击 → 立即响应，无延迟
- 列表渲染在后台继续 → 不卡顿
- 动画/滚动 → 流畅

## 关联

- [[React]]
- [[Fiber架构(React)]]
- [[React Fiber 采用链表结构代替递归]]
- [[React Fiber 是可中断的增量渲染架构]]
