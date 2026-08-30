---
uid: 202605061300
title: React Fiber 是可中断的增量渲染架构
description: React Fiber 通过拆分渲染任务实现可中断的增量渲染
tags: []
date-created: 2026-05-06
date-modified: 2026-08-30
status: fleeting
content-type: atomic
up:
---

> React Fiber 是把渲染工作拆成小任务，利用浏览器空闲时间执行，实现可中断的增量渲染架构

## 论据/示例

**1. 问题背景：渲染阻塞主线程**

React 15 及之前，渲染大列表时 JS 执行需要独占主线程，
用户的点击、输入等交互必须等待渲染完成才能响应。

**2. Fiber 的解决方案**

```javascript
// Fiber 节点结构（简化）
{
  type: 'div',
  child: fiberNode,      // 第一个子节点
  sibling: fiberNode,    // 下一个兄弟节点
  return: fiberNode,     // 父节点
  // ...其他属性
}
```

把树形结构转换为**链表**，每个节点可独立执行。

**3. 时间分片执行**

```javascript
// 利用 requestIdleCallback 在空闲时间执行
requestIdleCallback((deadline) => {
  while (nextUnitOfWork && deadline.timeRemaining() > 0) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }
})
```

- 每个 Fiber 节点是一个「工作单元」
- 浏览器空闲时执行一个单元
- 有更高优先级任务（如用户点击）可随时中断
- 完成后从断点继续

**4. 实际效果**

| 场景 | 传统渲染 | Fiber 渲染 |
|:---|:---|:---|
| 大列表渲染 | 阻塞，直到全部渲染完成 | 分片执行，每帧留时间给交互 |
| 用户输入 | 等待渲染完成后响应 | 立即响应，渲染在后台继续 |
| 动画帧率 | 可能掉帧 | 更稳定 |

## 关联

- [[React]]
- [[Fiber|React Fiber]]
