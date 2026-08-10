---
uid: '202605161109'
title: props 和 state 有何区别？state 更新是同步还是异步？
aliases: [Q-props 和 state]
description: "React 中 props 和 state 的区别？setState 是同步还是异步？"
tags: [React, props, state, 状态管理, 批量更新]
date-created: 2026-05-16
date-modified: 2026-05-17
status: cultivating
content-type: question
up: "[[React面试题|MOC-React面试题]]"
---

## 问题

> props 和 state 有何区别？state 更新是同步还是异步？

---

## 背景

React 组件的数据来源有两个：**props** 和 **state**。理解它们的区别是 React 入门的第一道坎。

面试常从两个维度考察：
1. **概念层**：props vs state 的职责和用法
2. **原理层**：setState 的异步机制（批量更新、更新队列）

常见困惑：
- 为什么 setState 后 console.log 拿不到最新值？
- 什么时候该用 props、什么时候用 state？
- 为什么 state 更新后组件不立即重新渲染？

---

## 现有答案

### 答案 1：props 和 state 的核心区别

| 维度 | props | state |
|:---|:---|:---|
| **来源** | 父组件传入 | 组件自身定义 |
| **修改权限** | 只读，组件不能修改自己的 props | 可写，组件内部可以更新 state |
| **用途** | 接收外部数据/回调函数 | 管理组件内部状态 |
| **变化时的行为** | 父组件重新渲染时传递新 props | 触发组件重新渲染 |
| **对子组件** | 可以向子组件传递 props | 可以向子组件传递 props（作为数据源） |

**简单记忆**：
- **props** = " 只读配置 "，来自父组件
- **state** = " 可变状态 "，组件自己管理

```tsx
// props 示例
function Child({ name, onClick }) {
  return <button onClick={onClick}>{name}</button>
}

// state 示例
function Counter() {
  const [count, setCount] = useState(0)  // state

  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### 答案 2：setState 的同步/异步问题

**核心结论**：setState **本身不是同步的**，而是**批量异步更新**。

```tsx
// ❌ 常见误区：打印不到最新值
this.setState({ count: 1 })
console.log(this.state.count)  // 0，不是 1！

// ✅ 原因：setState 后 state 不会立即更新
// 而是放入更新队列，等待事件处理完毕统一更新
```

**React 18 前的异步批次（batch）机制：**

```tsx
// React 批量更新示例
handleClick() {
  this.setState({ count: 1 })   // 放入队列
  this.setState({ count: 2 })   // 放入队列
  this.setState({ count: 3 })   // 放入队列
  // 最终只触发一次渲染，count = 3
}
// 而不是三次渲染（1 → 2 → 3）
```

**React 18 后的自动批次（Automatic Batching）：**

```tsx
// React 18 后，所有setState都会自动批次
// 包括 setTimeout、Promise 中的 setState
setTimeout(() => {
  this.setState({ count: 1 })  // 不再触发多次渲染
  this.setState({ count: 2 })  // 合并为一次
}, 0)
```

### 答案 3：为什么 setState 是批量异步的？

**设计原因：性能优化。**

| 场景 | 非批量（同步） | 批量（异步） |
|:---|:---|:---|
| 快速点击按钮 3 次 | 3 次渲染 | 1 次渲染 |
| 事件处理中更新 5 次 state | 5 次渲染 | 1 次渲染 |

**批量的本质**：同一事件回调中多次 setState 合并为一次渲染，避免中间状态的短暂展示。

---

## 我的理解

1. **props 是组件的 " 输入 "，state 是组件的 " 记忆 "**
	 - props 由父组件决定，组件自己不能改
	 - state 是组件自己的状态，想怎么改就怎么改

2. **setState 的异步是 " 批量异步 "，不是 " 推迟到未来某个时间 "**
	 - 它就在当前事件处理完后执行，只是合并了多次更新
	 - 目的是减少渲染次数，提升性能

3. **看到 " 同步/异步 " 直接问：什么环境下？**
	 - React 事件处理中：批量异步
	 - setTimeout / Promise 微任务中：React 18 后也是批量异步
	 - 原生绑定事件、Vue 的 nextTick：同步更新

---

## 探索路径

- [x] 理解 props 和 state 的职责划分
- [x] 理解 setState 的批量更新机制
- [x] 理解为什么打印不到最新值
- [ ] 阅读 React 源码中 `enqueueSetState` 的实现
- [ ] 对比 Class Component 的 setState 和 Function Component 的 useState 区别
- [ ] 理解 `flushSync` 强制同步的场景

---

## 待验证（扩展）

- [ ] 在 React DevTools 中观察 batched updates 的触发时机
- [ ] `flushSync` 在什么场景下必须使用（源码场景）
- [ ] React 18 Automatic Batching 对 setTimeout 中的 setState 的影响

---

## 关联

- **相关问题**：[[React 中的 setState 是同步还是异步的？为什么有时候打印不到最新值？]]
- **相关概念**：[[React 重新渲染]]（state 变化触发重新渲染的完整链路）
- **相关笔记**：[[React Context 是观察者模式的变体]]（跨组件状态共享的另一种方式）
