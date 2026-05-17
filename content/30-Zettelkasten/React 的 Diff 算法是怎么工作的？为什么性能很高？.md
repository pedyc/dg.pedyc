---
uid: 202605210100
title: React 的 Diff 算法是怎么工作的？为什么性能很高？
aliases: [ReactDiff, Q-React Diff 算法]
description: React Diff 算法的原理、为什么性能高、key 的核心作用
tags: [React, Diff, Reconciliation, 性能优化]
date-created: 2025-05-21
date-modified: 2026-05-17
status: cultivating
content-type: question
up: "[[React面试题|MOC-React面试题]]"
---

> React 使用的是一种基于树的 diff 算法，通过比较新旧虚拟 DOM 树，计算出最小的 DOM 更新操作，最小化实际 DOM 操作次数 + 避免不必要的重绘重排。

---

## 背景

React 的 Diff 算法（Reconciliation）解决的核心问题：**如何在 O(n²) 复杂度的树对比问题中，用 O(n) 的启发式算法找到最小更新路径？**

传统树 diff 复杂度为 O(n³)，1000 个节点需要 10 亿次操作。React 通过两个假设将复杂度降至 O(n)：
1. 不同类型的元素产生不同的树
2. 开发者通过 key 暗示子元素的稳定性

---

## Diff 算法的三个策略

### 1. 同级比较（只对比同层节点）

React 只比较同层级的节点，跨层级的节点（移动/删除）不追踪位置变化。

```bash
// 不比较跨层级的移动
<div>          <div>
  <p />   →     <span />
</div>        </div>
```

`<p>` 和 `<span>` 类型不同，直接销毁重建，不尝试移动。

### 2. 类型对比（元素 vs 组件）

| 场景 | 处理方式 |
|:---|:---|
| 类型不同（如 `div` → `span`） | 销毁旧树，重建新树 |
| 类型相同（如 `div` → `div`） | 复用 DOM，只更新属性 |

```tsx
// 类型不同 -> 整个子树重建
<div> → <span>  // 销毁 div，重建 span

// 类型相同 -> 复用 DOM，只更新变化的部分
<div className="a"> → <div className="b">  // 只更新 className
```

**组件的 diff 规则：**
- 同一组件类型，React 认为是同一个组件，只更新 props
- 组件 `props` 变化时，组件实例保持不变，Fiber 节点更新

### 3. List Diff（列表对比 + key 的作用）

这是面试最常问的部分。

**无 key 时的问题：**

```bash
旧列表：[A, B, C]
新列表：[A, B, D]  // 中间插入 D

无 key 按 index 比对：
index 0: A → A  (复用 ✅)
index 1: B → B  (复用 ✅)
index 2: C → D  (C 销毁，D 创建 ❌)  // 错误！C 没有变化
```

**有 key 时的工作：**

```bash
旧列表：[A, B, C]  key: [1, 2, 3]
新列表：[A, B, D]  key: [1, 2, 4]

按 key 比对：
key 1: A → A  (复用 ✅)
key 2: B → B  (复用 ✅)
key 3: C → 无  (删除 C ✅)
key 4: 无 → D  (创建 D ✅)

正确结果：A、B 复用，C 删除，D 创建
```

**key 的三大作用：**

| 作用 | 说明 |
|:---|:---|
| 身份标识 | React 通过 key 判断 " 这是不是同一个元素 " |
| DOM 复用 | 元素没变化就复用已有 DOM，只做移动 |
| 算法优化 | 使列表 diff 从 O(n²) 降至 O(n) |

---

## 性能为什么高？

### O(n) 复杂度的来源

React Diff 不是找到最优解，而是通过启发式假设找到**足够好的解**：

1. **同级比较**：只比较同层，把 O(n³) 降为 O(n)
2. **key 匹配**：不需要比较元素内容，通过 key 直接定位

### Fiber 架构的加持

React Fiber 对 Diff 的改进：

| 改进点 | 说明 |
|:---|:---|
| 可中断 | Diff 可被高优先级任务打断，不阻塞主线程 |
| 增量渲染 | 把 Diff 工作分成小单元，每帧执行一点 |
| 优先级调度 | 用户交互优先，渲染任务可延迟 |

```tsx
// React 16+ Fiber 架构
// 每个 fiber 节点是一个工作单元
{
  type: 'li',
  key: item.id,       // key 用于列表项匹配
  child: fiberNode,    // 第一个子节点
  sibling: fiberNode,  // 下一个兄弟节点
  return: fiberNode,   // 父节点（用于回溯）
}
```

---

## 代码示例

### 典型场景：列表中间插入

```tsx
const [items, setItems] = useState([
  { id: 1, name: 'A' },
  { id: 2, name: 'B' },
  { id: 3, name: 'C' },
])

// 在 B 和 C 之间插入 X
setItems([
  { id: 1, name: 'A' },
  { id: 2, name: 'B' },
  { id: 4, name: 'X' },  // 新增
  { id: 3, name: 'C' },
])
```

| key 类型 | 行为 |
|:---|:---|
| `key={index}` | A、B、C 全部重新创建（因为 index 2 从 C 变成 X） |
| `key={item.id}` | 复用 A、B、C 的 DOM，只移动 C 的位置，创建 X |

### 错误的 key 选择导致的问题

```tsx
// ❌ 状态丢失问题（表单控件为例）
function Form() {
  const [items, setItems] = useState([
    { id: 0, text: 'A' },
    { id: 1, text: 'B' },
  ])

  return items.map((item, index) => (
    <input key={index} value={item.text} />
  ))
}

// 在前面插入一项后
setItems([{ id: 0, text: 'NEW' }, ...])

// index 0 原本对应 'A' 的 input，现在对应 'NEW' 的 input
// 但 React 复用了原来的 DOM，value 被错误保留
```

---

## 关联

- **相关问题**：[[为什么列表渲染需要设置 key？key 的作用是什么？]]
- **相关概念**：[[React Fiber 是可中断的增量渲染架构]]、[[React Fiber 采用链表结构代替递归]]
- **相关笔记**：[[React 重新渲染]]
