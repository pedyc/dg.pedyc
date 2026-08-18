---
uid: 202604180003
title: Q-useEffect依赖数组为什么不能使用对象
aliases: [Q-useEffect-dependency-object]
description: "为什么 useEffect 的依赖数组使用对象会导致 effect 不按预期执行"
tags: [前端开发/框架/React]
date-created: 2026-04-18
date-modified: 2026-04-18
status: active
content-type: question
related: "[[useEffect]]"
---

## 问题

> useEffect 的依赖数组为什么不能使用对象（如 `seconds`）？

---

## 背景

在 React 中，useEffect 的依赖数组决定 effect 何时重新执行。但如果传入对象作为依赖，可能会出现 " 值变了但 effect 没重新执行 " 的问题。

---

## 现有答案

### 答案 1：React 使用 Object.is() 进行引用比较

React 使用 `Object.is()` 比较依赖数组元素。对象比较的是引用，不是内容。

```tsx
// ❌ 问题：seconds 是对象，每次渲染可能是新引用
const [seconds, setSeconds] = useState({ value: 0 });
useEffect(() => {
  // seconds.value 变化时，effect 不会重新执行
}, [seconds]); // seconds 引用可能没变，但值变了
```

**核心原因**：即使 `seconds.value` 从 0 变成 1，如果 `seconds` 对象引用没变，effect 不会重新执行。

### 答案 2：对象字面量每次创建新引用

```tsx
// ❌ 每次渲染都创建新对象
useEffect(() => {
}, [{ value: 0 }]); // 每次渲染都是新引用 []

// ✅ 每次渲染都是相同引用（如果值真的没变）
const deps = { value: 0 };
useEffect(() => {
}, [deps]); // deps 引用没变，effect 不执行
```

### 我的理解

React 的依赖比较是**引用相等性**检查，不是**值相等性**检查。对象内容变化不等于引用变化。

**解决方式**：
1. 使用原始类型（number、string）作为依赖
2. 使用 `useRef` 保存需要 " 观察 " 但不想触发更新的值
3. 使用 `useMemo` 稳定对象引用

---

## 探索路径

- [x] 理解 Object.is() 的比较规则
- [x] 通过代码示例验证对象引用问题
- [x] 在实际项目中识别这类问题 ✅ 2026-04-18

---

## 待验证

- [ ] 使用 `useMemo` 稳定对象引用是否完全可靠
- [ ] React 18 的 Strict Mode 是否有助于发现这类问题

---

## 关联

- **相关问题**：
	- [[useEffect]] — 本问题的上位概念
	- [[Q-useState的参数为什么不能直接用对象写法]] — 相关问题
- **相关概念**：
	- [[useRef]] — 解决方案之一
	- [[useMemo]] — 稳定对象引用的方案
- **参考资料**：
	- [React 官方文档 - Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
