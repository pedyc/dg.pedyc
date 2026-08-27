---
uid: "202608270523"
title: HTTP协商缓存
aliases: [协商缓存, 对比缓存, HTTP Conditional Requests, ETag与Last-Modified]
description: "客户端在强缓存失效后携带资源验证标识（ETag / Last-Modified）向服务器发起条件请求，由服务器决策返回 304 Not Modified 复用本地缓存或 200 OK 传输最新资源的网络优化机制。"
tags: [计算机网络, HTTP, 性能优化, 浏览器缓存]
date-created: 2026-08-27
date-modified: 2026-08-27
status: fleeting
content-type: concept
up: ["[[HTTP缓存机制]]"]
---

## 概念：HTTP协商缓存

> **HTTP协商缓存（Conditional Requests）** 是指当浏览器本地强缓存（`Cache-Control` / `Expires`）失效或被显式绕过时，客户端携带该资源的验证元数据（`If-None-Match` / `If-Modified-Since`）向源服务器发起条件请求；服务器校验资源若未发生实质变更，则返回 **304 Not Modified**（无响应体），通知客户端安全复用本地缓存副本的传输优化机制。

**解决的核心痛点**：避免客户端因强缓存过期而盲目拉取未发生变更的静态资源，消除大体积资源重复传输所消耗的网络带宽与首屏延迟，同时保证数据更新时客户端能近实时获取最新版本。

---

### 核心命题

> 核心命题引用 atomic 笔记（陈述句观点），每个命题是一句话洞见

- [[ETag的校验优先级严格高于Last-Modified以保证内容层面的强一致性]]
	- **原理**：依据 RFC 9110 / RFC 7232 规范，当请求头同时存在 `If-None-Match` 和 `If-Modified-Since` 时，服务器必须优先评估 `If-None-Match`；只要 ETag 不匹配，立即判定缓存失效返回 200，忽略时间戳判断。
- [[Last-Modified存在秒级精度截断与伪变更误判双重缺陷]]
	- **原理**：HTTP 时间戳格式（GMT）最小精度为 1 秒，无法感知 1 秒内的多次高频写操作；同时文件重新构建或移动触发修改时间变动但内容不变时，会导致无效的 200 重复下载。
- [[分布式集群环境下默认ETag计算策略容易引发协商缓存击穿]]
	- **原理**：Nginx/Apache 等 Web 服务器默认生成的 ETag 包含底层文件系统的 `Inode` 编号；在多台负载均衡节点上同一文件的 Inode 往往不同，导致跨节点轮询请求时 ETag 无法命中。

---

### 运行机制

客户端与服务器之间的条件请求与协商验证遵循自上而下的优先级裁决链路：

```mermaid
flowchart TD
    Start([强缓存失效 / 强制协商]) --> CheckHeaders{请求头包含验证标识?}
    CheckHeaders -- 无标识 --> Fetch200[发起普通请求 -> 200 OK 返回完整资源]
    
    CheckHeaders -- 携带 If-None-Match 或 If-Modified-Since --> CheckETag{存在 If-None-Match ?}
    
    %% ETag 路径（高优先级）
    CheckETag -- 是 --> ValidateETag{服务器资源 ETag 匹配?}
    ValidateETag -- 不匹配 (内容变更) --> Resp200[200 OK + 返回新资源与新标头]
    ValidateETag -- 匹配 (内容未变) --> CheckBoth{同时存在 If-Modified-Since ?}
    
    CheckBoth -- 是 --> ValidateTime{修改时间未变?}
    CheckBoth -- 否 --> Resp304[304 Not Modified 响应头无 Body]
    ValidateTime -- 是 --> Resp304
    ValidateTime -- 否 / 规范允许忽略时间 --> Resp304
    
    %% 仅 Last-Modified 路径（低优先级兜底）
    CheckETag -- 否 (仅 If-Modified-Since) --> ValidateTimeOnly{资源修改时间 > If-Modified-Since ?}
    ValidateTimeOnly -- 是 (文件已更新) --> Resp200
    ValidateTimeOnly -- 否 (未修改) --> Resp304
````

1. **初次请求阶段**：服务器响应 `200 OK`，并在 Response Headers 中附加 `ETag: "hash-or-version"` 与 `Last-Modified: <GMT时间戳>`，客户端将响应体与两类元数据存入本地缓存。
2. **二次验证阶段**：

		- 客户端在 Request Headers 中自动将 `ETag` 转换为 `If-None-Match`，将 `Last-Modified` 转换为 `If-Modified-Since`。

		- **优先级决策**：服务器端优先比对 `If-None-Match`。若 ETag 一致，即使某些系统判定修改时间有微小差异，仍直接返回 `304 Not Modified`（约 1KB 极小响应头）。若 ETag 发生变化，直接中断后续比对并返回 `200 OK`。

### 关键区别

|**维度**|**[[ETag]]（实体标签）**|**[[Last-Modified]]（最后修改时间）**|
|---|---|---|
|**本质定位**|资源的**内容指纹 / 版本标识**（Hash 或版本号）|资源的**时间元数据**（GMT 绝对时间戳）|
|**请求映射头**|`If-None-Match`（或 `If-Match` 用于并发更新锁）|`If-Modified-Since`（或 `If-Unmodified-Since`）|
|**精度粒度**|**精确到字节级**（强 ETag）或语义级（弱 ETag `W/`）|**秒级（1s）**，1 秒以内的修改无法感知|
|**RFC 优先级**|**最高**（RFC 9110 规定其优先级高于时间戳验证）|**次之**（通常作为降级兜底方案）|
|**服务器开销**|需读取文件或哈希计算（CPU 开销相对较高）|直接读取文件系统 `mtime` 属性（极低 I/O 与 CPU 消耗）|
|**分布式一致性**|需配置剥离 Inode（仅保留 mtime + size 或内容哈希）|只依赖各节点时钟同步（NTP 对齐即可）|

### 适用范围

- ✅ **适用场景**
	- **频繁迭代但依赖缓存的静态入口**：如 SPA 单页应用的 `index.html`，配置 `Cache-Control: no-cache` 强制每次走协商缓存，既能秒级感知发布上线，又能在未更新时复用本地 HTML。
	- **动态接口响应**：服务端返回大体积 JSON 报文时，可通过对响应体进行 MD5 计算生成 ETag，实现 304 节省接口带宽。
- ⛔ **误用**
	- **在带 Content-Hash 的打包资源上单独依赖协商缓存**：如 Webpack/Vite 产出的 `app.[contenthash].js`，此类资源应使用 `Cache-Control: max-age=31536000, immutable` 走极致强缓存，若配置为协商缓存将徒增大量无意义的 304 网络往返（RTT）。
	- **高并发大文件实时计算强 ETag**：若每个请求都对几十兆的动态流式文件计算 SHA-256，会造成网关 CPU 瞬间过载击穿。
- **失效边界**
	- **跨源代理缓存剥离**：部分反向代理中间件可能会抹除自定义 ETag 或篡改时间戳，导致协商失效。
	- **CDN 边缘节点弱 ETag 降级**：当开启 Gzip/Brotli 动态压缩时，CDN 边缘可能将源站的强 ETag 自动转为弱 ETag（`W/"…"`），若下游客户端逻辑硬匹配强 ETag 则会误判为未命中。

### 批判

- **外部批判**
	- **RTT 往返时延代价（Web 性能学派观点）**：协商缓存虽然省下了下载 Response Body 的带宽，但仍无法消除建立 TCP/TLS 连接和一次完整的往返时延（1 RTT）。在移动弱网（高 RTT）下，304 的等待白屏时间与 200 几乎没有质的差距。
	- **现代工程构建体系的降维替代**：现代前端构建工具通过 AST 分析与 Content-Hash，已经将静态资源的失效控制完全移交至应用层（URL 指纹），强缓存 + 覆盖式发布的组合使得针对静态 JS/CSS 的协商缓存变得边缘化。
- **内在张力**
	- **计算精确性与网关性能的权衡**：强 ETag 保证 100% 准确但消耗计算资源；Last-Modified 开销低但存在秒级盲区与构建时间抖动；弱 ETag 虽折中了性能但牺牲了字节级严格一致性。

### FAQ

> 与本概念相关的开放性问题，先理解问题（发散），再看标准流程（收敛）

- [[为什么浏览器按F5刷新和Ctrl+F5强制刷新时协商缓存的表现完全不同？]]
- [[Nginx中开启gzip压缩后为什么ETag会自动加上W前缀变成弱验证？]]
- [[大文件分片断点续传时If-Range是如何与ETag协同工作的？]]

### SOP

> 与本概念相关的标准操作流程，是 FAQ 中问题经过实践验证后的收敛成果

- [[SOP-前端静态资源多级缓存配置规范]] — 区分 Hash 资产（强缓存）与入口 HTML（协商缓存）的 Nginx 配置最佳实践
- [[SOP-分布式集群Nginx关闭Inode避免ETag击穿调优]] — 针对负载均衡后端节点统一 `etag on` 与 `etag_format` 调优

### 知识图谱

> 知识图谱链接 term（术语定义）和相关 concept，建立概念关系网络

- **父级概念**：[[HTTP缓存机制]] — 客户端与服务端协同的资源缓存体系
- **子级概念**：
	- [[ETag]] — 实体标签与强弱验证器原理
	- [[Last-Modified]] — 最后修改时间戳机制
	- [[304 Not Modified]] — 资源未修改的轻量级状态码
	- [[If-None-Match]] — 基于 ETag 的条件请求头
	- [[If-Modified-Since]] — 基于时间戳的条件请求头
- **并列概念**：
	- [[HTTP强缓存]] — 不与服务器通信、直接由浏览器拦截的本地缓存机制（Cache-Control / Expires）
- **相关概念**：
	- [[Cache-Control: no-cache]] — 跳过本地强缓存、强制向服务器发起协商验证的指令
	- [[Inode]] — 影响 Linux 文件系统默认 ETag 计算的核心元数据
	- [[Content-Hash]] — 工程化构建阶段直接将内容哈希植入文件名的方案
- **参考文章**
	- RFC 9110: HTTP Semantics - Section 8.8 (Conditional Requests)
	- RFC 7232: Hypertext Transfer Protocol (HTTP/1.1): Conditional Requests
	- MDN Web Docs: _HTTP Conditional Requests & Cache-Control_
