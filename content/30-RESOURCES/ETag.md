---
uid: 20261108103001
title: ETag
aliases: [T-ETag, 实体标签, Entity Tag]
description: "源站给出的不透明内容版本标识，由 If-None-Match 回传比对；强弱验证器的差别在等价标准，不在精度"
tags: [计算机网络/HTTP, 计算机网络/缓存]
date-created: 2026-11-08
date-modified: 2026-11-08
content-type: term
up: "[[HTTP协商缓存]]"
---

## 术语：ETag

> 主题：#计算机网络/HTTP

### 定义

ETag（entity tag，实体标签）是 RFC 9110 §8.8.3 定义的响应标头，值是一个由源站生成的不透明字符串，用来标识某个 URI 在某次响应里的具体内容版本。客户端把它随副本缓存下来，后续通过 `If-None-Match` 回传，源站比对后决定回 `304 Not Modified` 还是 `200 OK`。

语法只有两种形态：`ETag: "33a64df5"` 是强验证器，`ETag: W/"33a64df5"` 是弱验证器，值必须带双引号。强弱不是精度高低，而是等价标准不同：强验证器要求字节级一致，因此能用于 `If-Range` 断点续传；弱验证器只要求语义等价，动态压缩与 CDN 改写常把强降为弱。`If-None-Match: *` 里的星号是请求侧的通配值，不是 ETag 的合法取值。

规范只要求验证器「能代表这一版本的内容」，没规定怎么生成。实现上常见三类：文件元数据（`mtime` + `size`，Nginx 默认）、内容哈希（MD5 / SHA，多数应用框架）、或业务版本号。这个自由度正是集群问题的根源：若生成输入掺入节点本地属性（inode、部署时刻、未同步的 `mtime`），同一份内容在 A、B 两台机器上会算出不同 ETag，客户端带着 A 的值请求到 B 就验证失败，304 退化成 200。排查口径见 [[分布式集群ETag缓存失效]]。

三个容易漏掉的细节：

1. 优先级不是「两个都验一遍」。请求同时带 `If-None-Match` 与 `If-Modified-Since` 时，源站必须忽略后者（RFC 9110 §13.2.2）；只要 ETag 不匹配就直接 200，不再看时间戳。
2. 条件请求比缓存宽。`If-Match` / `If-Unmodified-Since` 用同一对验证器做并发写的乐观锁，`If-Range` 用强 ETag 判断分片能否续传，这些都不是缓存场景。
3. 304 不是空响应。它可以带新的 `Cache-Control`、`ETag`、`Date`、`Vary`，客户端据此刷新本地副本的元数据；漏掉这一环，会以为协商完还得再回源一次。

### 边界

| 能力 | 实际归属 | 与本术语的关系 |
|:---|:---|:---|
| 判定副本是否仍新鲜 | [[新鲜度]] / [[Cache-Control]] | 新鲜度由有效期判定，ETag 只在需要验证时才被读取 |
| 判定本次要不要发条件请求 | [[Cache-Control]] | `no-cache` 与 `must-revalidate` 决定，ETag 只是被携带的值 |
| 决定私有／共享缓存能否存储 | [[Cache-Control]] | `private` / `no-store` 属存储期，与验证器无关 |
| 提供跨请求的持久副本 | [[Memory Cache 与 Disk Cache]] | 浏览器实现，ETag 不参与选址 |
| 用名字保证内容可撤回 | [[Content-Hash]] | 另一条失效路径：不比对，直接换 URL |

ETag 自身也有边界：它是不透明标识符，客户端不得解析其结构；它的作用域是同一 URI 的单一表征，内容协商场景必须配合 `Vary`，否则不同编码或不同语言的响应会被当成同一版本。

### 知识图谱

- **上位**：[[HTTP协商缓存]] — 本术语是它条件请求里优先采用的那一半验证器
- **并列**：
	- [[Last-Modified]] — 同为验证器，但以时间元数据比对，精度与开销都不同
	- [[Cache-Control]] — 同为缓存标头，但管的是策略而非版本标识
- **相关**：
	- [[HTTP缓存机制]] — 完整判定链里验证器所在的位置
	- [[HTTP强缓存]] — 它的判定通过时，ETag 根本不会被读取
	- [[分布式集群ETag缓存失效]] — 生成口径不统一导致命中率下降的部署视角
	- [[新鲜度]] — 304 之后靠新的 `Date` 重新起算的那一侧
	- [[Cache API]] — 另一套不读 ETag、由代码判失效的缓存
- **外部资料**
	- [RFC 9110 §8.8.3 ETag](https://www.rfc-editor.org/rfc/rfc9110#section-8.8.3) — 语法与强弱验证器
	- [RFC 9110 §13.2.2 Precedence of Preconditions](https://www.rfc-editor.org/rfc/rfc9110#section-13.2.2) — 条件头的求值顺序
	- [MDN: ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) — 强弱验证器与生成策略
	- [Nginx: etag 指令](https://nginx.org/en/docs/http/ngx_http_core_module.html#etag) — 默认生成口径
