---
uid: 202607211012
title: UI本质上是状态的函数
aliases: []
description: "UI 是状态到视图的映射函数，而非面向对象的手动操作"
tags: ["React", "编程范式", "UI"]
date-created: 2026-07-21
date-modified: 2026-07-21
status: fleeting
content-type: atomic
up: "[[为什么更倾向函数组件]]"
---

> UI 本质上是状态到视图的映射函数：`UI = f(state)`

## 论据/示例

**函数组件比 Class 组件更贴近这一模型**：
- Class 组件的生命周期思维源于面向对象——`componentDidMount`、`componentDidUpdate` 告诉你在什么时候做什么事
- 函数组件天然表达映射关系：给定 props → 返回视图，每次渲染都是独立快照

**Concurrent Mode 依赖纯函数模型**：
- React 的可中断渲染要求组件函数是幂等的——随时可以暂停和恢复
- Class 组件的实例方法依赖 `this` 引用，容易产生副作用，中断后恢复的语义模糊

**React Forget 编译优化**：
- 自动 memo 编译器的核心假设：组件是纯函数，给定相同输入必然返回相同输出
- 基于此才能安全地跳过不必要的重新渲染

**类比 — Excel 单元格**：
- Excel 单元格 = `UI = f(state)` 的直观体现
- `=A1+B1` 是一个纯函数，A1/B1 变化时自动重算
- 函数组件也是同样的声明式思维：声明"当状态 X 变化时显示 Y"，而不是"在状态变化后手动更新 DOM"

```tsx
// Class 组件 — 侧重"什么时候做什么"
class Counter extends React.Component {
  componentDidMount() { /* 初始化 */ }
  componentDidUpdate() { /* 响应更新 */ }
}

// 函数组件 — 侧重"映射关系"
function Counter({ count }) {
  return <div>{count}</div>; // UI = f(state)
}
```

## 关联

- [[为什么更倾向函数组件]] — 函数组件流行背后正是 `UI = f(state)` 这个心智模型的优势
