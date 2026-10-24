---
uid: 20260317000009
title: Vue3响应式系统分为effect和reactive两部分
description: reactive 负责把对象变响应式，effect 负责收集依赖与触发更新
tags: [前端/Vue]
date-created: 2026-03-17
date-modified: 2026-10-24
content-type: atomic
up: "[[Vue3响应式原理]]"
noteId: 1792465711812
---

> Vue3 的响应式分成两半：**reactive** 负责把普通对象变成响应式对象，**effect** 负责收集依赖、并在依赖变化时触发更新。

**边界**：这是**职责**上的二分，不是两个可各自替换的模块——reactive 的读写里要调用 track / trigger，effect 才知道该通知谁。另外它只覆盖运行时响应式，编译期优化（`ref` 的 `.value` 解包、静态提升）不在这个二分里。

## 论据/示例

```javascript
// reactive：将普通对象转换为响应式
const state = reactive({ count: 0 });

// effect：定义响应式逻辑
effect(() => {
  console.log('count:', state.count);
});

// 修改 count 会自动触发 effect 执行
state.count++; // 输出：count: 1
```

## 关联

- [[Vue3响应式原理]] — 父级概念
- [[Vue3-ref和reactive的区别]] — reactive 这一半内部的取舍
