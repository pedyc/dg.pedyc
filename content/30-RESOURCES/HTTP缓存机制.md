---
uid: "202608270526"
title: HTTP缓存机制
aliases: [HTTP Caching, 浏览器缓存机制, Web缓存机制]
description: "客户端与服务端通过约定HTTP标头控制资源复用与过期验证的协同策略，旨在降低网络带宽消耗、消除无谓网络往返并加速首屏渲染。"
tags: [计算机网络, HTTP, 性能优化, 浏览器缓存]
date-created: 2026-08-27
date-modified: 2026-08-27
status: fleeting
content-type: concept
up: ["[[HTTP]]"]
---

## 概念：HTTP缓存机制

> **HTTP缓存机制（HTTP Caching）** 是 Web 架构中客户端（如浏览器）、中间代理（如 CDN、反向代理）与源服务器之间遵循 HTTP 规范（RFC 9111），通过特定响应头与请求头协同控制资源在各级缓存节点上的**存储、新鲜度判定（强缓存）与有效性重新校验（协商缓存）** 的完整技术体系。

**解决的核心痛点**：解决无状态 HTTP 协议下静态与半静态资源频繁重复拉取带来的网络拥塞、服务器计算/I/O 过载以及客户端页面加载白屏与长等待时延（RTT）问题。

---

### 核心命题

> 核心命题引用 atomic 笔记（陈述句观点），每个命题是一句话洞见

- [[强缓存与协商缓存共同构成HTTP双层渐进式缓存决策模型]]
	- **原理**：浏览器先以本地时钟/计时器判定强缓存（`Cache-Control: max-age` / `Expires`）是否有效；一旦失效才回退降级至与服务端的条件请求（`ETag` / `Last-Modified`），形成无通信拦截与极小响应头校验的梯次防御。
- [[现代前端缓存的最佳实践是入口HTML协商缓存配合资产文件永不过期强缓存]]
	- **原理**：通过构建工具为 JS/CSS/图片赋予 `[contenthash]` 文件名，赋予其长达一年的强缓存（`max-age=31536000, immutable`）；入口 `index.html` 则配置 `no-cache` 进行协商缓存，以极小体积的 304 换取应用发布的秒级版本感知能力。
- [[Cache-Control的no-cache与no-store存在根本性的行为语义差异]]
	- **原理**：`no-cache` 并不代表"不缓存"，而是"跳过本地强缓存立即发起协商验证"；`no-store` 才是真正的"完全禁止任何设备进行任何形式的本地或中间持久化存储"。

---

### 运行机制

浏览器发起 HTTP 资源请求时的标准多层决策流程：

```mermaid
flowchart TD
    Start([发起资源请求]) --> CheckMemory{Service Worker / 内存缓存存在有效副本?}
    CheckMemory -- 是 --> ReadSW[从 Service Worker / Memory Cache 返回 200]
    
    CheckMemory -- 否 --> CheckDisk{检查强缓存: Cache-Control / Expires}
    CheckDisk -- 未过期 --> ReadDisk[从 Disk Cache 命中返回 200]
    
    CheckDisk -- 已过期 / no-cache --> CheckConditional{携带 ETag / Last-Modified 发起条件请求}
    
    CheckConditional -- 服务器验证未修改 --> Return304[服务器返回 304 Not Modified<br/>刷新本地缓存元数据并读取本地磁盘副本]
    CheckConditional -- 服务器验证已变更 --> Return200[服务器返回 200 OK<br/>携带完整新 Body 并写入本地缓存]
````

1. **缓存位置判定层级**：`Service Worker` $\rightarrow$ `Memory Cache`（内存缓存，生命周期伴随 Tab 页） $\rightarrow$ `Disk Cache`（磁盘持久缓存） $\rightarrow$ `Push Cache`（HTTP/2 推送） $\rightarrow$ 网络请求。
2. **强缓存决策（本地拦截）**：优先读取 `Cache-Control: max-age`，若未配置则读取 `Expires`；未过期直接由浏览器拦截返回 `200 (from disk cache)`，不产生实际网络 I/O。
3. **协商缓存决策（网络往返）**：强缓存失效或命中 `no-cache`，发起携带 `If-None-Match` / `If-Modified-Since` 的条件请求；未修改返回 `304 Not Modified`，已修改返回 `200 OK` 伴随全新资源。

> **RFC 规范行为规则**：若请求中同时存在 `If-None-Match` 和 `If-Modified-Since`，根据 HTTP 规范，服务器 **必须以 `If-None-Match` 的评估结果为主**。只要 ETag 匹配失败，即判定缓存过期，直接返回 `200 OK`，不再受 `If-Modified-Since` 影响。
> 即 ETag 校验优先级更高，304 响应意味着客户端可以直接使用本地缓存。

### 关键区别

|**维度**|**[[HTTP强缓存]]**|**[[HTTP协商缓存]]**|
|---|---|---|
|**判定决策方**|**客户端（浏览器）**独立计算|**服务端（源站 / CDN）**比对后裁决|
|**是否产生网络请求**|**完全不发请求**（状态码为 `200 OK (from disk/memory cache)`）|**产生网络请求**（状态码为 `304 Not Modified` 或 `200 OK`）|
|**核心标头 (Headers)**|`Cache-Control: max-age=…`、`Expires`|`ETag` / `If-None-Match`、`Last-Modified` / `If-Modified-Since`|
|**性能收益**|消除 100% 的网络往返延时（0 RTT）与流量传输|节省 Response Body 的传输流量，但存在 1 次 RTT 握手延时|

### 适用范围

- ✅ **适用场景**
	- **内容哈希静态资产（JS/CSS/WebP/字体）**：配置 `Cache-Control: max-age=31536000, immutable`（强缓存）。
	- **频繁变更的 SPA 入口与动态 API**：配置 `Cache-Control: no-cache` 配合 `ETag`（协商缓存）。
	- **公共共享代理加速**：利用 `Cache-Control: public, s-maxage=…` 提升 CDN 边缘节点的命中率。
- ⛔ **误用**
	- **对敏感用户个人数据接口开启公共缓存**：未声明 `private` 或 `no-store`，导致包含鉴权信息的私有数据被共享代理/CDN 缓存引发数据越权泄漏。
	- **对无 Hash 标识的静态文件名开启长周期强缓存**：如 `app.js` 设为 30 天强缓存，发布更新后由于客户端无法发起网络请求，将导致线上版本严重不同步且无法远程主动撤销。
- **失效边界**
	- **浏览器用户主动交互干预**：
		- `F5`（普通刷新）：忽略部分内存强缓存，直接对磁盘资源发起携带协商头的条件请求。
		- `Ctrl + F5` / `Cmd + Shift + R`（强制刷新）：请求头强制注入 `Cache-Control: no-cache` 和 `Pragma: no-cache`，强行跳过强缓存与协商缓存直接拉取 `200 OK` 全新资源。

### 批判

- **外部批判**
	- **中心化失效不可控性（缓存撤销困境）**：一旦强缓存写入了用户的客户端本地磁盘，在 `max-age` 耗尽前服务端**没有任何标准 HTTP 手段主动让其失效**，强行把缓存版本管理的复杂度转移给了前端工程化体系（强制推行 URL 哈希指纹化）。
	- **时钟与计算不对称**：`Expires` 依赖客户端本地时钟对齐；强 `ETag` 依赖网关服务器的 CPU 算力，在大规模高并发流式计算下带来额外的算力瓶颈。
- **内在张力**
	- **新鲜度（Real-time Freshness）与性能（Zero Latency）的绝对矛盾**：想要 0 RTT 必须牺牲实时感知力；想要秒级感知变更必须付出至少 1 次 RTT 的网络请求开销。

### FAQ

> 与本概念相关的开放性问题，先理解问题（发散），再看标准流程（收敛）

- [[为什么现代前端打包构建一定要使用contenthash而非chunkhash或hash？]]
- [[Service Worker的Cache Storage与标准HTTP Disk Cache的拦截优先级是怎样的？]]
- [[在跨域CORS请求中，缓存响应头是否需要额外的配置才能正常生效？]]

### SOP

> 与本概念相关的标准操作流程，是 FAQ 中问题经过实践验证后的收敛成果

- [[SOP-前端静态资源多级缓存配置规范]] — 区分 Hash 资产与 HTML 入口的 Nginx 缓存策略编排
- [[SOP-Web性能监控中缓存命中率与LCP指标关联分析]] — 通过 Navigation Timing API 排查因缓存击穿导致的首屏劣化

### 知识图谱

> 知识图谱链接 term（术语定义）和相关 concept，建立概念关系网络

- **父级概念**：[[HTTP]] — 超文本传输协议
- **子级概念**：
	- [[HTTP强缓存]] — 本地直接拦截的缓存阶段
	- [[HTTP协商缓存]] — 与服务器握手比对的条件请求阶段
	- [[Cache-Control]] — 核心缓存控制指令集
	- [[ETag]] — 实体内容指纹验证器
	- [[Last-Modified]] — 最后修改时间戳验证器
- **并列概念**：
	- [[Service Worker 缓存]] — 运行在客户端独立线程的应用级离线拦截缓存
	- [[Memory Cache 与 Disk Cache]] — 浏览器底层的内存与磁盘存储实现
- **相关概念**：
	- [[CDN]] — 分布式多级网络代理节点缓存
	- [[Content-Hash]] — 构建阶段生成的内容签名
	- [[304 Not Modified]] — 协商缓存成功命中的响应状态码
- **参考文章**
	- RFC 9111: HTTP Caching (Obsoletes RFC 7234)
	- MDN Web Docs: _HTTP Caching Architecture_
	- web.dev: _Prevent unnecessary network requests with the HTTP Cache_
