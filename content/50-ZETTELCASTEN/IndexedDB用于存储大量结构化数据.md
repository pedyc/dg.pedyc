---
uid: 202603230022
title: IndexedDB 用于存储大量结构化数据
aliases: []
description: IndexedDB 是浏览器内置的数据库，支持存储大量结构化数据、事务和索引
tags: [前端开发/浏览器]
date-created: 2026-03-23
date-modified: 2026-03-23
status: active
content-type: atomic
up: [[Web存储]]
---

> IndexedDB 是浏览器内置的 NoSQL 数据库，支持存储大量结构化对象、事务操作和索引查询，适合离线应用和大数据存储场景。

### 论据/示例

**基本结构**：
```
数据库 (Database)
  ↓
对象仓库 (Object Store) → 类似表
  ↓
索引 (Index)
  ↓
数据 (Record)
```

**基本用法**：
```javascript
// 打开数据库
const request = indexedDB.open('MyDB', 1);

// 创建对象仓库
request.onupgradeneeded = (e) => {
    const db = e.target.result;
    const store = db.createObjectStore('users', { keyPath: 'id' });
    store.createIndex('name', 'name', { unique: false });
};

// 写入数据
const tx = db.transaction('users', 'readwrite');
const store = tx.objectStore('users');
store.add({ id: 1, name: 'Alice' });
```

**特点**：
- 容量：无明确限制（取决于磁盘空间）
- 数据类型：结构化对象（不限于字符串）
- API：异步 API（基于回调/Promise）
- 事务：支持事务，保证数据一致性
- 索引：支持创建索引加速查询

**常见用途**：
- 离线应用数据缓存
- 大型数据集存储
- 客户端搜索功能

### 关联

- [[Web存储]] — 本观点的主题
- [[localStorage]] — 对比：简单键值对
- [[Cache API]] — 对比：资源缓存
