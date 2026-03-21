---
uid: 20260317000011
title: reactive(Vue)
aliases: [Vue3 reactive, T-reactive]
description: Vue3 中用于将对象转换为响应式对象的函数
tags: [前端/Vue]
date-created: 2026-03-17
date-modified: 2026-03-17
status: fleeting
content-type: term
---

## 术语：reactive

> **领域**：#前端/Vue

### 定义

reactive 是 Vue3 Composition API 中的函数，用于将普通 JavaScript 对象转换为响应式对象。当对象的属性发生变化时，依赖该对象的视图会自动更新。

```javascript
const state = reactive({
  count: 0,
  name: 'Vue'
});

state.count++; // 视图自动更新
```

### 跨学科含义

- **在 Vue3 中**：reactive 是响应式系统的核心 API 之一
- **在 React 中**：类似概念为 useState 或状态管理

### 关联

- **属于**：[[响应式原理(Vue3)]]
- **引用**：[[Vue3 ref 和 reactive 的区别]]，[[怎样实现reactive方法]]
