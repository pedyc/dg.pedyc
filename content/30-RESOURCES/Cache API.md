---
uid: 20261028165340
title: Cache API
aliases: [T-Cache-API, CacheStorage, caches]
description: 唯一能把完整响应存起来、且完全由代码决定何时失效的原生存储
tags:
  - 前端开发/浏览器
  - 性能优化
content-type: term
category: learning
up: "[[Service Worker]]"
date-created: 2026-10-28
date-modified: 2026-10-28
---

## 术语：Cache API

> **主题**：#前端/浏览器 API

### 定义

Cache API 是一组挂在 `caches`（全局 `CacheStorage` 对象）上的异步接口，按 **`Request` → `Response`** 的键值对保存完整的网络响应。

它不是「HTTP 缓存的 JS 版本」，而是**另一套缓存**：键由你写、内容由你放、过期由你判。和 HTTP 缓存唯一的共同点是都存响应。

```javascript
const cache = await caches.open('v1')
await cache.add('/app.css')                 // 发请求并存下响应
await cache.put(new Request('/api/user'), response.clone())
const hit = await cache.match('/app.css')   // 命中返回 Response，未命中返回 undefined
await caches.delete('v0')                   // 整个仓库作废
```

**三个必须记住的事实**：

- **不会自动过期。** 没有 `max-age`、没有 `ETag` 校验，放进去就一直在，直到你删。
- **不会自动命中。** 请求不会「顺路」落到这里——必须在 Service Worker 的 `fetch` 里显式判断并返回。
- **`caches` 在页面上下文也可用。** 它不归 Service Worker 独占，只是脱离 SW 就没人替它拦截请求，价值大减。

### 与 HTTP 缓存的边界

| | HTTP 缓存（磁盘） | Cache API |
|:--|:--|:--|
| 谁决定存不存 | 响应头（`Cache-Control` 等） | 你的代码 |
| 谁判失效 | 协议：时间 + 验证器 | 你的代码（版本号、删除、覆盖） |
| 键是什么 | URL（+`Vary` 头） | 你传的 `Request`，可改 `ignoreSearch` |
| 能否离线 | 不能保证，可被淘汰 | 能，只要没被删 |
| 排查手段 | DevTools 的 Size 列 | DevTools → Application → Cache Storage |

**一条容易踩的交叉**：响应里的 `Cache-Control: no-store` 不会阻止 `cache.put()` 把它存下来。这个响应头约束的是 HTTP 缓存那一层，不是你的仓库。所以「我明明设了 `no-store`，SW 里怎么还有旧数据」是一个真实的坑——它来自两套缓存各管各的。

### 版本管理是它的全部难点

没有自动过期，就只剩一种可靠的失效方式：**换仓库名**。

```javascript
const VERSION = 'v3'                      // 每次发版改这里
await caches.open(VERSION)
// activate 阶段清掉所有非当前版本
const keys = await caches.keys()
await Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))
```

这带来两个下游结论：

- **别把版本号写死在多个地方**，否则清理逻辑会漏掉某个仓库，磁盘上留下几份永远不用的副本。
- **别把业务数据放进缓存仓库**。`Cache API` 的粒度是「整个仓库」，删 `v2` 就全删；需要按条删的数据属于 `IndexedDB`。

### 边界

- **匹配遵循 `Vary`。** 服务端写了 `Vary: Accept-Encoding`，`cache.match` 就会按请求头比对；对不上视为未命中。要放宽可以传 `ignoreVary` / `ignoreSearch`，但那等于放弃这份副本的一部分正确性。
- **跨域的 opaque 响应能存但读不了。** `no-cors` 请求拿到的响应 `status` 被抹成 `0`（读取时表现为 200 的假象）、body 不可读，只能原样返回。所以「缓存了 CDN 上的图片但拿不到大小」是预期行为。
- **它自己也受配额管。** Cache Storage 与 IndexedDB 共享同一份磁盘配额，磁盘紧张时浏览器可以整体清掉；要豁免得调 `navigator.storage.persist()`。
- **不是所有请求都该走缓存优先。** 导航请求（HTML）用 cache-first 会让用户长期看到旧版本；接口请求用 cache-first 会让数据永远停在第一次。策略要按请求类型分，不是按「能不能缓存」分。

### 知识网络

- **上位**：
	- [[Service Worker]] — 它最常出现的位置：作为 `fetch` 事件里的响应来源
	- [[浏览器缓存与客户端存储体系]] — 「代码判失效」这一层的代表
- **并列**：
	- [[IndexedDB]] — 同为异步、同受配额约束；区别是它按条存结构化数据，本术语按 `Request` 存整个响应
	- [[Web Storage]] — 同步、只存字符串、容量小得多
- **相关**：
	- [[HTTP缓存机制]] — 另一套缓存，判失效的依据完全不同
	- [[Content-Hash]] — SW 里的缓存键由人写，不带哈希就是自己制造旧副本
- **外部资料**
	- [MDN: CacheStorage](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage) — 接口全集与浏览器支持
	- [Service Workers: an Introduction](https://web.dev/articles/service-workers-introduction) — 缓存策略（cache-first / network-first / stale-while-revalidate）的原始论述
