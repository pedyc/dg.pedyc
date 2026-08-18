---
uid: "202604290001"
title: useRef变化不会触发重新渲染
aliases: []
description: useRef 变化不会触发重新渲染，可用于存储不需要渲染的可变值
tags: []
date-created: 2026-04-29
date-modified: 2026-04-29
status: cultivating
content-type: atomic
up: "[[Refs(React)]]"
---

> useRef 变化不会触发重新渲染，可用于存储不需要渲染的可变值

## 论据/示例

**核心原理**：

- `useRef` 返回一个 ref 对象，修改其 `.current` 属性不会触发组件重新渲染
- 这是因为 ref 被设计为 React 渲染周期之外的「逃生通道」

**代码示例**：

```jsx
function Counter() {
  const countRef = useRef(0);

  const handleClick = () => {
    countRef.current += 1; // 修改 ref，不触发渲染
    console.log('countRef:', countRef.current);
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

点击按钮只会打印日志，不会更新 UI。

**对比 useState**：

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1); // 修改 state，触发渲染
  };

  return <button onClick={handleClick}>{count}</button>;
}
```

点击按钮会更新 UI。

**典型应用场景**：

- 存储计时器 ID（`setInterval`/`setTimeout`）
- 存储 DOM 引用
- 存储不需要触发 UI 更新的可变数据
- 在 `useEffect` 中保持引用稳定，避免闭包陷阱

## 关联

- [[Refs(React)]] — Ref 概念总览
- [[Ref 的 current 属性是响应式与非响应式的分界线]] — 来自 React Refs 的核心命题
- [[在React中有哪些更改数据不触发重新渲染的方式|Q-在React中有哪些更改数据不触发重新渲染的方式？]]
