---
uid: 202604221045
title: React Context 只是结构上像观察者模式，它没法只通知一个订阅者
aliases: []
description: Provider 是主题、useContext 是观察者——但 Context 做不到按订阅者筛选
tags: []
date-created: 2026-04-21
date-modified: 2026-10-24
content-type: atomic
up: "[[React Context]]"
noteId: 1792465708472
---

> React Context 的角色划分与观察者模式一致：Provider 是主题，`useContext` / Consumer 是观察者。但通知是粗粒度的——Provider 的 value 一变，所有消费者一起重渲染，它没有「只通知某一个」的能力。

**边界**：这是结构类比，不是实现等价。真正的观察者模式能精确通知单个订阅者，Context 做不到——Provider 的 value 一变，所有消费者一起重渲染，它没有「按订阅者筛选」这一层。所以别指望靠拆分 Context 之外的方式做精确更新。

## 论据/示例

| 观察者模式 | React Context | 作用 |
|:---|:---|:---|
| Subject / Observable | `Context.Provider` | 持有数据，触发更新 |
| Observer | `useContext` / `Consumer` | 订阅数据变化 |
| `subscribe()` | `useContext` 调用 | 建立订阅关系 |
| `notify()` | Provider value 变化 | 通知所有订阅者 |

React 内部为每个 Context 维护一条消费者链表，Provider 更新时遍历整条链表触发更新——这就是「Provider 持有 Consumer 引用」的具体形式。

## 关联

- [[React Context]] — 父级概念
