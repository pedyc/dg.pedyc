---
uid: 20261108103000
title: Cache-Control
aliases: [T-Cache-Control, 缓存控制标头, Cache-Control 指令集]
description: "RFC 9111 定义的缓存控制标头，用一组指令声明响应能否存储、有效期与复用前的验证要求；请求侧与响应侧的同名指令语义不同"
tags: [计算机网络/HTTP, 计算机网络/缓存]
date-created: 2026-11-08
date-modified: 2026-11-08
content-type: term
up: "[[HTTP缓存机制]]"
---

## 术语：Cache-Control

> 主题：#计算机网络/HTTP

### 定义

Cache-Control 是 RFC 9111 §5.2 定义的 HTTP 标头字段，由一组逗号分隔的指令组成，用来声明一份响应能不能存、能存多久、复用前要不要回源验证。它同时出现在请求与响应两侧：响应侧由源站声明策略，请求侧由客户端临时改写本次判定，浏览器刷新时注入的 `no-cache` / `max-age=0` 就出自这里。

它不是一个开关，而是一组彼此独立、可叠加的指令。最容易被误读的一点也来自这里：同一个 `no-cache` 在请求侧表示「本次强制验证」，在响应侧表示「允许存下来，但每次复用前必须验证」，两者都和不缓存无关。真正禁止存储的是 `no-store`。

指令按作用对象分三组：

| 组 | 指令 | 管什么 |
|:---|:---|:---|
| 有效期 | `max-age`、`s-maxage`、`stale-while-revalidate`、`stale-if-error` | 副本多久算新鲜，过期后能否先用旧的 |
| 复用与验证 | `no-cache`、`must-revalidate`、`proxy-revalidate`、`immutable`、`no-transform` | 能否直接复用、什么时候必须回源 |
| 存储与可见性 | `no-store`、`private`、`public` | 能不能存、能存在共享缓存里吗 |

四条必须记住的事实：

- `max-age` 是相对秒数，优先级高于 `Expires`；后者是另一标头的绝对时间，依赖客户端时钟对齐。
- `s-maxage` 只对共享缓存生效，且在这类缓存上覆盖 `max-age`，所以同一份响应在浏览器与 CDN 上可以有不同有效期。
- `public` / `private` 管的是共享缓存能否存储，与数据是否敏感、是否加密无关；含鉴权信息的响应应显式声明 `private` 或 `no-store`。
- 指令冲突时取最严格的一条，`Age` 响应头参与 `current_age` 的计算。配置了长 `max-age` 也不保证副本一定存在，配额与淘汰可以随时清掉它。

### 边界

| 能力 | 实际归属 | 与本术语的关系 |
|:---|:---|:---|
| 判定副本当前是否仍新鲜 | [[新鲜度]] | 本术语只提供参数，判定由缓存按 `freshness_lifetime > current_age` 执行 |
| 生成内容版本标识 | [[ETag]] / [[Last-Modified]] | 另一组标头，本术语只决定「要不要去问」 |
| 决定副本落在内存还是磁盘 | [[Memory Cache 与 Disk Cache]] | 浏览器实现细节，协议不约束 |
| 让长期缓存可被主动撤销 | [[Content-Hash]] | 构建期改名；协议层没有撤销通道 |
| 拦截请求并自行应答 | [[Cache API]] | 另一套缓存，`no-store` 也拦不住 `cache.put()` |

还有一层不在它管辖内：`Cache-Control` 属于存储期与复用期的判定，而 304 之后如何刷新本地元数据是 RFC 9111 §4.3 的事。把这两件事混起来，会得出「配了 `no-cache` 就等于每次重下」的错误结论。

### 知识图谱

- **上位**：[[HTTP缓存机制]] — 本术语是它存储期与复用期判定的指令载体
- **并列**：
	- [[ETag]] — 同为响应标头，但管的是版本标识而非策略
	- [[Last-Modified]] — 同上，时间戳式验证器
- **相关**：
	- [[HTTP强缓存]] — `max-age` / `immutable` 主要落在这一侧的判定链
	- [[HTTP协商缓存]] — `no-cache` / `must-revalidate` 把请求推进这一侧
	- [[浏览器缓存与客户端存储体系]] — 本术语只约束其中的 HTTP 缓存层
	- [[CDN]] — `s-maxage`、`public`、`Age` 在共享缓存上生效
	- [[Content-Hash]] — 长 `max-age` 能安全成立的前提
- **外部资料**
	- [RFC 9111 §5.2 Cache-Control](https://www.rfc-editor.org/rfc/rfc9111#section-5.2) — 指令语法与语义
	- [RFC 9111 §4.2.1 Calculating Freshness Lifetime](https://www.rfc-editor.org/rfc/rfc9111#section-4.2.1) — `max-age` / `s-maxage` / `Expires` 的取值顺序
	- [RFC 8246 HTTP Immutable Responses](https://www.rfc-editor.org/rfc/rfc8246) — `immutable` 的定义与安全考量
	- [RFC 5861 HTTP Cache-Control Extensions for Stale Content](https://www.rfc-editor.org/rfc/rfc5861) — `stale-while-revalidate` / `stale-if-error`
	- [MDN: Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) — 指令速查
