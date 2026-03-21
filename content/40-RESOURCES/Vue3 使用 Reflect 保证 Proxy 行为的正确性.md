---
uid: 20260317000010
title: Vue3 使用 Reflect 保证 Proxy 行为的正确性
description: Reflect 提供了统一的 API 操作对象，确保 this 指向正确
tags: [前端/Vue]
date-created: 2026-03-17
date-modified: 2026-03-16
status: fleeting
content-type: atomic
---

## Vue3 使用 Reflect 保证 Proxy 行为的正确性

> Reflect 提供了统一的 API 操作对象，确保 this 指向正确

### 论据 / 示例

```javascript
const obj = {
  get value() {
    return this._value;
  }
};

const proxy = new Proxy(obj, {
  get(target, key, receiver) {
    // 使用 Reflect 确保 this 指向 proxy 而非 target
    // 如果直接使用 return target[key]，那么 this 永远指向 obj
    return Reflect.get(target, key, receiver);
  }
});

proxy.value; // 正确返回 proxy._value
```

### 关联

- **父级**：[[响应式原理(Vue3)]]
- **相关**：[[Reflect]]
