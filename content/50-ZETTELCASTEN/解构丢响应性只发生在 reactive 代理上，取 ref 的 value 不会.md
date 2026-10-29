---
uid: 202608191041
title: 解构丢响应性只发生在 reactive 代理上，取 ref 的 value 不会
aliases: []
description: 在Vue3中解构响应式对象会丢失响应性
tags: []
date-created: 2026-08-19
date-modified: 2026-10-23
status: fleeting
content-type: atomic
up: "[[Vue3响应式原理]]"

noteId: 1792475156331
---

> 在Vue3中解构响应式对象会~~丢失响应性~~

**边界**：只在解构的对象是 `reactive()` 返回的代理时成立。`props` 本身也是响应式代理，解构 `props` 同样丢；而解构一个 `ref`（取 `.value`）不涉及代理，问题形式完全不同。

## 论据/示例

```js
const { name } = state; // name只是普通变量
```

Vue3使用`Proxy`代理整个对象，一旦将对象属性解构拿到的就是一个普通变量，失去了对代理对象的拦截联系。

Vue3由此提供了`toRefs`来做兜底。

## 关联

- [[Vue|vue]]
- [[Proxy]]
