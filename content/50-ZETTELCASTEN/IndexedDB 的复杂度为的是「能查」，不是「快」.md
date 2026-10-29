---
uid: 202603230022
title: IndexedDB 的复杂度为的是「能查」，不是「快」
aliases: []
description: IndexedDB 是浏览器内置的数据库，支持存储大量结构化数据、事务和索引
tags: [前端开发/浏览器]
date-created: 2026-03-23
date-modified: 2026-10-28
content-type: atomic
up: "[[IndexedDB]]"
noteId: 1792465706811
---

> IndexedDB 是浏览器内置的 NoSQL 数据库，支持存储大量~~结构化对象~~、事务操作和索引查询，适合离线应用和大数据存储场景。

**边界**：它解决的是「量大且要查询」，不是「要快」。单条小数据读写不如 localStorage 直接；而且默认不是持久化存储——浏览器在磁盘紧张时可以先清掉它，除非调用 `navigator.storage.persist()` 申请豁免。

## 论据/示例

它的复杂度全部来自「要能查」：对象仓库对应表、索引对应查询路径、事务保证一致性。只存不查的数据放进来，就只是把简单问题做复杂。

四层结构（Database / Object Store / Index / Record）、最小用法与选型分界见 [[IndexedDB]]。

## 关联

- [[IndexedDB]] — 本观点的主题
- [[localStorage 的「长期」只是不会被主动过期]] — 对比：同步、只存字符串、小两个数量级
- [[Cache API]] — 对比：资源缓存
