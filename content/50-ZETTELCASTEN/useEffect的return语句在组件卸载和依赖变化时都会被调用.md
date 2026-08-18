---
uid: 202604180002
title: useEffect的return语句在组件卸载和依赖变化时都会被调用
aliases: [A-useEffect-cleanup调用时机]
description: "useEffect 返回的 cleanup 函数在组件卸载和依赖变化时都会被调用，确保副作用被正确清理"
tags: [前端开发/框架/React]
date-created: 2026-04-18
date-modified: 2026-04-18
status: active
content-type: atomic
up: "[[useEffect]]"
---

> useEffect 返回的 cleanup 函数在组件卸载和依赖变化时都会被调用，确保副作用被正确清理。

## 论据/示例

**场景 1：依赖变化时调用**

```tsx
useEffect(() => {
  console.log('effect 执行');
  return () => console.log('cleanup 执行');
}, [count]);

// 首次渲染: effect 执行
// count 变化: cleanup 执行 → effect 执行
// 组件卸载: cleanup 执行
```

**场景 2：组件卸载时调用**

```tsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log('tick');
  }, 1000);

  return () => clearInterval(timer); // 组件卸载时清理
}, []);

// 组件卸载时: cleanup 执行（timer 被清除）
```

**场景 3：常见误解**

```tsx
// ❌ 误解：空依赖数组只在卸载时调用 cleanup
useEffect(() => {
  return () => console.log('只调用一次？');
}, []);

// ✅ 正确：空依赖数组在组件卸载时调用 cleanup
// 依赖变化不会触发 effect 重新执行，所以 cleanup 也不会
// 但组件卸载时一定会调用 cleanup
```

## 关联

- [[useEffect]] — 本笔记的上位概念
- [[React渲染后执行副作用]] — cleanup 执行的时机
- [[cleanup函数防止内存泄漏]] — cleanup 的核心作用
