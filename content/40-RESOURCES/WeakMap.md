---
uid: 20260317000006
title: WeakMap
aliases: [弱映射, T-WeakMap]
description: JavaScript 中键为对象且键的引用为弱引用的 Map
tags: [前端/JavaScript]
date-created: 2026-03-17
date-modified: 2026-03-16
status: fleeting
content-type: term
---

## 术语：WeakMap

> **领域**：#前端/JavaScript

### 定义

WeakMap 是 JavaScript 中的一种数据结构，其键必须是对象，且对键的引用是弱引用的 Map。弱引用意味着当键对象没有其他引用时，垃圾回收器可以回收该键值对。

```javascript
const weakMap = new WeakMap();
const obj = {};
weakMap.set(obj, 'value');
weakMap.get(obj); // 'value'
```

### 跨学科含义

- **在 JavaScript 中**：WeakMap 用于存储对象的私有数据，避免内存泄漏
- **在其他语言中**：类似概念（如 Java 的 WeakHashMap）

### 关联

- **属于**：[[JavaScript]]
- **引用**：[[闭包]]
