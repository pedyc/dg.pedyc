---
uid: 202604180004
title: Q-为什么useEffect需要return-cleanup函数
aliases: [Q-useEffect-cleanup]
description: "useEffect 返回的 cleanup 函数的作用和必要性"
tags: [前端开发/框架/React]
date-created: 2026-04-18
date-modified: 2026-04-18
status: active
content-type: question
related: "[[useEffect]]"
---

## 问题

> 为什么 useEffect 需要 return cleanup 函数？

---

## 背景

useEffect 可以返回一个函数，称为 cleanup 函数。这个函数在两种情况下被调用：
1. 依赖变化，effect 重新执行前
2. 组件卸载时

---

## 现有答案

### 答案 1：防止内存泄漏

cleanup 函数确保上一次 effect 创建的资源被释放。

```tsx
// ❌ 没有 cleanup：每次点击都添加新监听器，累积内存泄漏
useEffect(() => {
  window.addEventListener('click', handler);
}, []);

// ✅ 有 cleanup：组件卸载时移除监听器
useEffect(() => {
  window.addEventListener('click', handler);
  return () => window.removeEventListener('click', handler);
}, []);
```

### 答案 2：避免状态不一致和竞态条件

当 effect 重新执行时，如果上一次的异步操作还在进行，可能导致状态不一致。

```tsx
useEffect(() => {
  let isCancelled = false;
  fetchData().then(data => {
    if (!isCancelled) {
      setResult(data);
    }
  });
  return () => { isCancelled = true; };
}, [id]);
```

### 答案 3：防止 effect 重复注册

对于订阅类操作，cleanup 确保不会重复注册。

```tsx
useEffect(() => {
  const subscription = api.subscribe(handler);
  return () => subscription.unsubscribe();
}, []);
```

### 我的理解

cleanup 是 React 推崇的 **" 每次 effect 执行都是干净的开始 "** 理念的体现。它是一种防御性编程，确保副作用可以被正确清理。

---

## 探索路径

- [x] 理解 cleanup 在依赖变化时的行为
- [x] 理解 cleanup 在组件卸载时的行为
- [x] 通过内存泄漏示例验证 cleanup 的必要性

---

## 待验证

- [ ] 在 React 18 Strict Mode 下，effect 会被执行两次，cleanup 行为是否正确
- [ ] 使用 AbortController 替代 cleanup 函数的优势

---

## 关联

- **相关问题**：
	- [[useEffect]] — 本问题的上位概念
	- [[useEffect的return语句在组件卸载和依赖变化时都会被调用]] — cleanup 调用时机
- **相关概念**：
	- [[cleanup函数防止内存泄漏]] — cleanup 的核心作用
- **参考资料**：
	- [React 官方文档 - Cleaning up an Effect](https://react.dev/learn/cleaning-up-an-effect)
