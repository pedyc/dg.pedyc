---
uid: 20261028165605
title: IndexedDB
aliases: [T-IndexedDB, 索引数据库]
description: 浏览器里的异步事务型对象数据库：容量大到可以放弃清理策略，代价是复杂度全在版本与事务上
tags:
  - 前端开发/浏览器
  - 性能优化
content-type: term
category: learning
up: "[[浏览器缓存与客户端存储体系]]"
date-created: 2026-10-28
date-modified: 2026-10-28
---

## 术语：IndexedDB

> **主题**：#前端/浏览器 API

### 定义

IndexedDB 是浏览器内置的**异步、事务型、带索引**的对象数据库。键值对里的值不是字符串，而是结构克隆（`structured clone`）能复制的任何东西：对象、数组、`Blob`、`File`、`ArrayBuffer`、`Date`、`Map`。

判定它是否该用的三个条件，缺一个就不必上它：

| 条件 | 不满足时该用什么 |
|:--|:--|
| 数据量超过几 MB | `localStorage`（同步、简单） |
| 需要按非主键字段查询 | 全量读进内存再筛（数据小的时候更快） |
| 需要事务（多条写入要么全成要么全不成） | 逐条写 + 自己处理失败回滚 |

**它不是「更快的 localStorage」。** 按单条读写比，它比 `localStorage` 慢：一次读写要开连接、起事务、等 `onsuccess`。它赢的是「量大且要查」——用索引查一万条里的十条，而 `localStorage` 只能把一万条全反序列化一遍。

### 结构

四层，命名借自关系数据库，但语义不完全对应：

| 层级 | 对应关系 | 说明 |
|:--|:--|:--|
| Database | 一个库 | 用版本号控制结构升级，变更只在 `onupgradeneeded` 里做 |
| Object Store | 类似「表」 | 必须指定 `keyPath` 或 key generator，二选一 |
| Index | 类似「索引」 | 按非主键字段查询；不建索引就只能游标全表遍历 |
| Record | 一行 | 结构化克隆的任何类型，不限于字符串 |

```javascript
const req = indexedDB.open('app', 1)
req.onupgradeneeded = (e) => {
  const db = e.target.result
  const store = db.createObjectStore('users', { keyPath: 'id' })
  store.createIndex('name', 'name', { unique: false })
}
req.onsuccess = (e) => {
  const db = e.target.result
  const tx = db.transaction('users', 'readwrite')
  tx.objectStore('users').add({ id: 1, name: 'Alice' })
}
```

两层回调不能省：`indexedDB.open()` 立刻返回一个 `IDBOpenDBRequest`，库还没打开；只有 `onsuccess` 之后拿到的 `e.target.result` 才是 `IDBDatabase`。这是它「简单读写反而绕远」的直接原因。

**选型分界**：要事务、要索引、要存大对象才用它。存几十条配置用 `localStorage` 更快也更简单——后者的读写是一行同步调用，前者要「开连接 → 起事务 → 等事件」三步。

### 与 Web Storage 的分界

两者常被放在一张表里比容量，但它们的差别不在容量：

| | Web Storage | IndexedDB |
|:--|:--|:--|
| 规范 | Web Storage | Indexed Database API |
| 读写 | 同步，阻塞主线程 | 异步，不阻塞 |
| 值类型 | 只能是字符串 | 结构化克隆的任何类型 |
| 查询 | 只有按键取 | 索引、游标、范围查询 |
| 事务 | 无 | 有（`readonly` / `readwrite`） |
| 跨标签页 | 共享同一份 | 共享同一份 |
| 在 Worker / SW 中 | 可用（无 `window` 时也能访问 `indexedDB`） | 可用 |

**「IndexedDB 属于 Web Storage」是一处常见误标。** 它们只是都归浏览器存储，规范与能力完全不同：一个同步、只收字符串；一个异步、带事务与索引。把前者当成后者的超集，会误推出一条结论——「Web Storage 的容量上限就是 IndexedDB 的上限」，而两者的配额与淘汰规则并不相同。

### 复杂度全在两处

**一、版本升级。** 结构变更只能在 `onupgradeneeded` 里做，而它只在打开时的版本号高于已存版本时触发一次。这意味着「加一个索引」必须发一次版本号，并且要写迁移逻辑——不能像 SQL 那样随手 `ALTER TABLE`。

```javascript
const req = indexedDB.open('app', 3)              // 版本号 +1 才会触发升级
req.onupgradeneeded = (e) => {
  const db = e.target.result
  if (!db.objectStoreNames.contains('drafts')) {
    db.createObjectStore('drafts', { keyPath: 'id' })
  }
}
```

**二、事务的生命周期。** 事务是自动提交的：一旦本轮微任务里没有新的请求排队，它就提交了。所以**不能在事务里 `await` 一个非 IndexedDB 的异步操作**（比如 `fetch`），事务会先提交，后续写入抛 `TransactionInactiveError`。正确做法是先把网络数据拿全，再开事务写入。

### 边界

- **默认不是持久化存储。** 磁盘紧张时浏览器可以按整源清空，除非 `navigator.storage.persist()` 申请豁免并获批。离线应用必须在启动时检查 `navigator.storage.persisted()`。
- **配额是整源共享的。** 它和 `Cache API` 分同一块磁盘，别把大文件同时塞进两处。
- **跨标签页没有冲突检测。** 同一 origin 的所有标签页写的是同一个库，事务只保证单次操作的一致性，不保证业务语义——两个标签页同时编辑同一份草稿，需要自己加锁（`BroadcastChannel` 或一条 `lock` 记录）。
- **不适合当缓存用。** 存接口响应可以，但它没有 TTL、没有 LRU，过期要自己写；接口缓存优先考虑 HTTP 缓存或运行时缓存，只有在「离线也要读」时才进来。
- **第三方库能省掉大半复杂度。** `idb` 把回调包成 Promise，`localForage` 提供 `localStorage` 风格的 API 并在底层降级。代价是多一层封装，排查时要多穿一层。

### 知识网络

- **上位**：
	- [[浏览器缓存与客户端存储体系]] — 「你写你删」那一层的代表，容量最大
- **下位**：
	- [[IndexedDB 的复杂度买的是「能查」，不是「快」]] — 一条判断：它解决「量大且要查」，不解决「要快」
- **并列**：
	- [[Cache API]] — 同为异步、同受配额限制；区别是它按 `Request` 存整个响应
	- [[Web Storage]] — 同步、只存字符串、容量小两个数量级
- **相关**：
	- [[Cookie]] — 唯一会随请求自动发送的存储，容量最小
	- [[StorageManager API]]（待写） — 查配额、申请持久化的那组接口
- **外部资料**
	- [MDN: IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) — 概念模型与事务语义
	- [MDN: Storage quotas and eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) — 配额与淘汰规则原文
	- [idb](https://github.com/jakearchibald/idb) — 官方推荐的 Promise 封装，源码很短，适合读一遍
