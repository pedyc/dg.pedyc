---
uid: 202608191041
title: 在Vue3中解构响应式对象会丢失响应性
aliases: []
description: 在Vue3中解构响应式对象会丢失响应性
tags: []
date-created: 2026-08-19
date-modified: 2026-08-19
status: fleeting
content-type: atomic
up: ["[[Vue]]"]
---

> 在Vue3中解构响应式对象会丢失响应性

## 论据/示例

```js
const { name } = state; // name只是普通变量
```

Vue3使用`Proxy`代理整个对象，一旦将对象属性解构拿到的就是一个普通变量，失去了对代理对象的拦截联系。

Vue3由此提供了`toRefs`来做兜底。

## 关联

- [[Vue|vue]]
- [[Proxy]]
