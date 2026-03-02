---
title: React 中的 setState 是同步还是异步的？为什么有时候打印不到最新值？
date-created: 2025-05-21
date-modified: 2025-05-21
---

Q：React 中的 setState 是同步还是异步的？为什么有时候打印不到最新值？

> setState 方法本身不是异步，但批量更新是异步调度，即：
> setState 会立即执行，但不会立即触发组件渲染
> 状态会被放入更新队列中，等待当前事件执行完毕统一处理
> 所以在 setState 后立即打印拿到的是久值

补充:

> 在 React 18 后，可以使用 FlushSync 方法强制立即触发更新（不推荐）

追问：
Q1：那为什么在 `setTimeout` 里调用 `setState` 就能拿到最新值？

> setTimeout 属于事件循环中的微队列，会在同步代码执行结束后执行，即：
> 此时打印的值是已经更新过后的值

Q2：在 `useEffect` 里打印 state 是新值吗？

> 是的，useEffect 方法在组件渲染后、DOM 更新后触发，此时拿到的是新值

Q3：class 组件 vs 函数组件 的行为一样吗？

> 原则上一样，都是使用批处理更新
