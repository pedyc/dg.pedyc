---
title: React 中的 setState 是同步还是异步的？为什么有时候打印不到最新值？
date-created: 2025-05-21
date-modified: 2026-03-21
content-type: atomic
---

> setState 方法本身不是异步，但批量更新是异步调度——setState 会立即执行，但不会立即触发组件渲染，状态会被放入更新队列中等待当前事件执行完毕统一处理。

### 论据/示例

- **在 setTimeout 中调用 setState**：setTimeout 属于事件循环中的微队列，会在同步代码执行结束后执行，此时打印的值是已经更新过后的值
- **在 useEffect 中打印 state**：useEffect 在组件渲染后、DOM 更新后触发，此时拿到的是新值
- **React 18 后**：可以使用 `flushSync` 方法强制立即触发更新（不推荐）

### 关联

- **相关**：[[React 重新渲染]]
