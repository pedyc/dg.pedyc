---
uid: 20260317000008
title: Vue3 使用 Proxy 实现响应式
description: Vue3 通过 Proxy 实现对对象操作的全面监听
tags: [前端/Vue]
date-created: 2026-03-17
date-modified: 2026-08-19
status: fleeting
content-type: term
---

## Vue3 使用 Proxy 实现响应式

> Proxy 可以监听对象的任何操作，包括新增属性、删除属性、数组索引变化

> Vue3 为什么用 Proxy 实现响应式？ #card
> Proxy 能监听对象的任何操作，包括新增属性、删除属性、数组索引变化（Object.defineProperty 需要提前递归劫持已有属性，无法感知新增/删除）。

### 论据 / 示例

```javascript
const reactiveObj = new Proxy({}, {
  get(target, key, receiver) {
    console.log(`读取 ${key}`);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    console.log(`设置 ${key} = ${value}`);
    return Reflect.set(target, key, value, receiver);
  }
});

reactiveObj.name = 'Vue'; // 触发 set，输出：设置 name = Vue
console.log(reactiveObj.name); // 触发 get，输出：读取 name
```

### 关联

- **父级**：[[响应式原理(Vue3)]]
- **相关**：[[Proxy]]
