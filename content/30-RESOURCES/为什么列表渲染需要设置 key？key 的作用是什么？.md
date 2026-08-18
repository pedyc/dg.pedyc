---
uid: '202605171034'
title: 为什么列表渲染需要设置 key？key 的作用是什么？
aliases: [Q-列表渲染 key]
description: "React 中列表渲染为什么需要 key？key 的作用是什么？"
tags: [React, 列表渲染, 性能优化]
date-created: 2026-05-17
date-modified: 2026-08-02
status: cultivating
content-type: question
up: "[[React面试题|MOC-React面试题]]"
---

## 问题

> 为什么列表渲染需要设置 key？key 的作用是什么？

---

## 背景

React 列表渲染时若不提供 key，控制台会抛出警告：

```bash
Warning: Each child in a list should have a unique "key" prop.
```

这是 React 面试中的高频问题，涉及 **Reconciliation（协调）** 机制的核心——如何高效地比较新旧虚拟 DOM 树并计算出最小 DOM 更新。

---

## 现有答案

### 核心答案

React 通过 **Diff 算法**对比新旧虚拟 DOM 树，找出最小更新路径。列表对比（reconcileChildren）是其中的关键环节。

**无 key 时的问题：**

```tsx
// 按 index 作为 key
items.map((item, index) => <li key={index}>{item.name}</li>)
```

当列表中间插入/删除元素时，index 对应的元素身份会发生变化，导致 React 错误地复用 DOM 节点。

**有 key 时的工作方式：**

```tsx
// 使用稳定唯一 ID 作为 key
items.map(item => <li key={item.id}>{item.name}</li>)
```

React 通过 key 识别 " 这是同一个元素 "，而不是 " 这个位置上的元素 "。即使元素位置发生变化，只要 key 相同，React 就知道这是同一个节点，只移动 DOM 而非销毁重建。

**key 的三大作用：**

| 作用 | 说明 |
|:---|:---|
| **身份标识** | 让 React 跨渲染轮次追踪每个列表项的唯一身份 |
| **DOM 复用** | 减少不必要的 DOM 创建/销毁，降低重绘重排 |
| **算法优化** | 使 Diff 算法在 O(n) 时间内完成列表对比 |

> key 在列表渲染中有哪三大作用？ #card
> 身份标识（跨渲染轮次追踪列表项唯一身份）、DOM 复用（减少创建/销毁）、让 Diff 算法在 O(n) 内完成列表对比。

### 原理补充

React Diff 基于两个假设实现 O(n) 复杂度：

1. **不同类型的元素产生不同的树**——跨层级的节点只创建或删除，不移动
2. **开发者通过 key 暗示子元素的稳定性**——key 是列表项身份匹配的关键

无 key 时，React 只能按位置顺序逐个比对，插入/删除会导致后续所有节点被判定为 " 变化 "，触发大量 DOM 操作。

### 最佳实践

```tsx
// ✅ 优先使用数据中的唯一 ID
items.map(item => <li key={item.id}>{item.name}</li>)

// ⚠️ 避免使用 index 作为 key（列表不变时勉强可用）
items.map((item, index) => <li key={index}>{item.name}</li>)

// ❌ 禁止使用随机数作为 key（每次渲染都不同，失去意义）
items.map(item => <li key={Math.random()}>{item.name}</li>)
```

**为什么避免 index 作为 key？**
- 列表增删时，下标对应的元素身份改变
- React 无法区分 " 元素移动 " 和 " 元素变化 "，导致状态错乱（如表单控件值、动画状态）

### 相关问题

**Q: key 只在列表中需要吗？**
A: key 是 prop，但 React 主要在 `Array.prototype.map` 渲染列表时强制检查。唯一子节点（如 `+` 按钮切换显示）也属于 " 同辈列表 " 场景，需要 key。

**Q: key 对性能的影响？**
A: 合适的 key 使 Diff 从 O(n²) 降至接近 O(n)。百万级列表中，index key vs id key 的渲染性能差距可达 10 倍以上。

---

## 我的理解

key 是 React 列表渲染的 " 身份证号 "——让 Diff 算法通过身份而非位置匹配列表项，实现精确的 DOM 复用。

核心理解：React 关心的是 " 这个元素是不是同一个 "，而不是 " 这个位置有没有变化 "。key 提供了稳定、可预测、兄弟节点唯一的身份标识。

---

## 探索路径

- [x] 理解 React Diff 算法的同层比较原则
- [x] 理解无 key 时按位置匹配的缺陷
- [x] 理解 key 作为身份标识的机制
- [ ] 阅读 React 源码中 reconcileChildren 的 key 处理逻辑
- [ ] 对比 index key vs stable key 的实际性能差异

---

## 待验证（扩展）

- [ ] 在 React DevTools 中观察列表更新时的 DOM 操作变化
- [ ] 使用 `react-window` 虚拟列表时的 key 选择策略
- [ ] key 与 React.memo / useMemo 的配合优化

---

## 关联

- **相关问题**：[[React 的 Diff 算法是怎么工作的？为什么性能很高？]]
- **相关概念**：[[React 重新渲染]]、[[React Fiber]]
- **参考资料**：[React 官方文档 - Reconciliation](https://reactjs.org/docs/reconciliation.html)
