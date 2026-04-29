---
uid: "202604290002"
title: 在React中有哪些更改数据不触发重新渲染的方式
aliases: [Q-在React中有哪些更改数据不触发重新渲染的方式？]
description: 探索 React 中修改数据但不触发组件重新渲染的方式
tags: [react, react/性能优化]
date-created: 2026-04-29
date-modified: 2026-04-29
status: cultivating
content-type: question
up: "[[SOP-React性能优化|SOP-React性能优化]]"
---

> 在 React 中有哪些更改数据不触发重新渲染的方式？

## 问题背景

React 的核心特性是声明式渲染，通过 `useState`、`useReducer` 等方式管理状态时，每次状态变化都会触发组件重新渲染。但在某些场景下，我们需要在不触发重渲染的情况下存储或修改数据。

## 现有答案

### 1. useRef

修改 `ref.current` 不会触发任何组件重渲染。

```jsx
const countRef = useRef(0);
countRef.current += 1; // 不触发渲染
```

**原理**：ref 被设计为 React 渲染周期之外的「逃生通道」。

### 2. createRef（类组件）

与 `useRef` 类似，但每次渲染会重新创建 ref 对象。

```jsx
class MyComponent extends React.Component {
  countRef = createRef(0);

  handleClick = () => {
    this.countRef.current += 1; // 不触发渲染
  };
}
```

### 3. 类组件实例属性

直接给类组件添加属性，不通过 state。

```jsx
class MyComponent extends React.Component {
  customData = { value: 0 };

  handleClick = () => {
    this.customData.value += 1; // 不触发渲染
  };
}
```

### 4. 外部变量（不推荐）

在函数组件外部声明变量，但这种方式在严格模式下可能有副作用。

```jsx
let externalValue = 0; // 全局/模块级别

function MyComponent() {
  const handleClick = () => {
    externalValue += 1; // 不触发渲染，且跨组件共享
  };
}
```

### 5. useRef 的回调形式

回调 ref 也可以在不触发重渲染的情况下存储 DOM 引用。

## 关键区别

| 方式 | 作用范围 | 持久性 | 推荐程度 |
|:----|:--------|:-------|:--------|
| useRef | 组件内 | 跨渲染持久 | ✅ 推荐 |
| createRef | 组件内 | 每次渲染重建 | ⚠️ 类组件用 |
| 类组件实例属性 | 组件内 | 跨渲染持久 | ⚠️ 类组件用 |
| 外部变量 | 全局/模块 | 进程级别 | ❌ 不推荐 |

## 适用场景

- 存储计时器 ID（setInterval/setTimeout）
- 存储 DOM 引用
- 在 useEffect 中保持稳定的引用，避免闭包陷阱
- 存储第三方库实例

## 待验证点

- [ ] 严格模式下外部变量的行为
- [ ] ref 与 concurrent mode 的交互

## 关联

- [[React R[[Refs(React)]] 总览
- [[useRef变化不会触发重新渲染]] — atomic 笔记
- [[为什么useRef不需要是响应式的]] — 待探索
