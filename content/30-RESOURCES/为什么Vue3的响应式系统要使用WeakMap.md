---
uid: 20260317000007
title: 为什么Vue3的响应式系统要使用WeakMap
aliases: [Q-为什么Vue3的响应式系统要使用WeakMap]
description: 探讨 Vue3 响应式系统选择 WeakMap 的原因
tags: [前端/框架]
date-created: 2026-03-17
date-modified: 2026-03-21
status: completed
content-type: question
---

## 问题

> 为什么 Vue3 的响应式系统要使用 WeakMap？

---

## 背景

Vue3 的响应式系统底层使用了 WeakMap 来存储 target → reactivity map 的映射。了解这一设计选择的原因有助于深入理解 Vue3 的响应式原理。

---

## 现有答案

### 答案 1：避免内存泄漏

WeakMap 的键是弱引用的，当对象不再被其他地方引用时，可以被垃圾回收，从而避免内存泄漏。

### 答案 2：与对象生命周期绑定

响应式数据与原始对象生命周期绑定，当原始对象被回收时，响应式映射也应该被自动清理。

### 我的理解

Vue3 使用 WeakMap 是因为响应式映射不应该阻止原对象被回收，这与 Vue2 中使用闭包或普通 Map 可能导致的内存问题形成对比。

---

## 探索路径

- [ ] 阅读 Vue3 源码中 reactive.ts 的实现
- [x] 对比 WeakMap 和 Map 在响应式场景下的行为差异 ✅ 2026-03-22

---

## 待验证

- [ ] WeakMap 在 Vue3 响应式中的具体作用机制

---

## 关联

- **相关概念**：[[WeakMap]]、[[Vue]]
