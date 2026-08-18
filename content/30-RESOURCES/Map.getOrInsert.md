---
uid: 202607121901
title: Map.prototype.getOrInsert
aliases: ["T-Map-upsert", "T-Upsert"]
description: "ES2026 新增的 Map/WeakMap upsert 方法，合并 get 和 set 为一步"
tags: ["#JavaScript/API", "#ECMAScript/ES2026"]
status: fleeting
content-type: term
up: [[ES2026]]
---

## 术语：Map.prototype.getOrInsert (Upsert)

> **主题**：#JavaScript/API

### 定义

`Map.prototype.getOrInsert(key, value)` 是 ES2026 新增的 Map 方法，当 key 不存在时插入 key-value 并返回 value，当 key 已存在时返回现有值。替代了 `if (!map.has(key)) map.set(key, value)` 的样板代码。`WeakMap.prototype.getOrInsert` 同理。

```js
const settings = new Map();
settings.set("language", "en");

settings.getOrInsert("theme", "dark");
// "dark"（新插入）

settings.getOrInsert("language", "pl");
// "en"（已有，返回现有值）
```

### 跨学科含义

- **在 JavaScript 数据结构中**：简化 Map 的 upsert 模式，消除手动检查 key 是否存在的样板代码
- **在数据库类比中**：类似于 SQL 的 `INSERT OR UPDATE` / `MERGE` 语义——如果记录存在则返回，不存在则创建后返回

### 知识网络

- **父级概念**：[[ES2026]] — 属于 ES2026 数据结构增强
- **相关概念**：`Map`, `WeakMap`
