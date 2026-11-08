---
uid: 20261108103002
title: Last-Modified
aliases: [T-Last-Modified, 最后修改时间, Last-Modified 响应头]
description: "源站给出的 GMT 时间元数据，由 If-Modified-Since 回传比对；秒级精度与伪变更让它只能当 ETag 的兜底"
tags: [计算机网络/HTTP, 计算机网络/缓存]
date-created: 2026-11-08
date-modified: 2026-11-08
content-type: term
up: "[[HTTP协商缓存]]"
---

## 术语：Last-Modified

> 主题：#计算机网络/HTTP

### 定义

Last-Modified 是 RFC 9110 §8.8.2 定义的响应标头，由源站给出资源最后一次被修改的 GMT 时间，格式是 HTTP-date（IMF-fixdate），例如 `Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT`。客户端缓存这个值，后续通过 `If-Modified-Since` 回传；源站判定资源在该时刻之后未改动则回 304，否则回 200 与全量内容。

它是时间元数据，不是内容指纹。这一点决定了它的全部优缺点：读 `mtime` 几乎零成本，但只能精确到秒，而且「时间变了」与「内容变了」并不等价。

四类典型失准：

| 失准 | 触发 | 后果 |
|:---|:---|:---|
| 精度截断 | 1 秒内连写两次 | 第二次改动看不见，误判未变，回 304 给出旧内容 |
| 伪变更 | `touch`、重新部署、构建产物重生成 | 字节未变但 `mtime` 变了，回 200 重传一份相同内容 |
| 时钟偏差 | 多节点未做 NTP 对齐 | 同一资源在各节点给出不同时间，条件请求在节点间失效 |
| 无自然时间戳 | 动态拼装的 API 响应 | 没有可对应的「最后修改」对象，只能退回 ETag |

规范地位也由这些缺陷决定：请求同时带 `If-None-Match` 与 `If-Modified-Since` 时，源站必须忽略后者，以 ETag 的比对结果为准（RFC 9110 §13.2.2）。所以 Last-Modified 在现代配置里是兜底，不是主验证器——它仍有价值的场景是未启用 ETag 的老服务端、纯静态文件，以及爬虫与增量同步这类只问「大概什么时候变了」的场合。

`If-Modified-Since` 还有两条使用限制：只在 GET / HEAD 且没有 `If-None-Match` 时被评估；若响应的 `Date` 早于请求里携带的 `If-Modified-Since`，规范建议忽略该条件。反向的 `If-Unmodified-Since` 与 `If-Match` 一样服务于乐观锁，不属于缓存。

### 边界

| 能力 | 实际归属 | 与本术语的关系 |
|:---|:---|:---|
| 判定副本是否仍新鲜 | [[新鲜度]] / [[Cache-Control]] | 有效期判定的事，时间戳只在验证阶段被读取 |
| 提供字节级的内容一致性 | [[ETag]] | 同时在场时以它为准，本术语不作数 |
| 判定本次要不要发条件请求 | [[Cache-Control]] | `no-cache` / `must-revalidate` 决定 |
| 保证多节点时间一致 | [[分布式集群ETag缓存失效]] | 属部署问题，NTP 是外部手段，协议层无法纠正 |
| 决定副本存放位置 | [[Memory Cache 与 Disk Cache]] | 浏览器实现，与时间戳无关 |

还需要注意方向：Last-Modified 描述的是源站资源，客户端并不据此推算本地副本的存放时长；副本能放多久始终由 `max-age` / `Expires` 说了算。把「最后修改时间」读成「缓存到期时间」是这类误配最常见的起点。

### 知识图谱

- **上位**：[[HTTP协商缓存]] — 本术语是它条件请求里退居其次的那一半验证器
- **并列**：
	- [[ETag]] — 同为验证器，但以内容版本比对，精度与服务端开销都不同
	- [[Cache-Control]] — 同为缓存标头，但管的是策略而非版本标识
- **相关**：
	- [[HTTP缓存机制]] — 完整判定链里时间戳所在的位置
	- [[HTTP强缓存]] — 判定通过时，本术语不会被读取
	- [[新鲜度]] — 时间戳不参与新鲜度计算，两者的分工在这里
	- [[分布式集群ETag缓存失效]] — 对比视角：时钟偏差可对齐，ETag 口径不统一更难查
	- [[RTT]] — 即便回 304，这一次往返也省不掉
- **外部资料**
	- [RFC 9110 §8.8.2 Last-Modified](https://www.rfc-editor.org/rfc/rfc9110#section-8.8.2) — 定义与生成要求
	- [RFC 9110 §13.1.3 If-Modified-Since](https://www.rfc-editor.org/rfc/rfc9110#section-13.1.3) — 求值条件与例外
	- [MDN: Last-Modified](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Last-Modified) — 语法与用途
	- [MDN: If-Modified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since) — 请求侧写法
