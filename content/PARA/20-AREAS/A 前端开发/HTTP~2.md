---
title: HTTP~2
date-created: 2025-06-02
date-modified: 2025-12-25
---

## 定义

HTTP/2 (Hypertext Transfer Protocol 2) 是一种应用层协议，是 HTTP 协议的第三个主要版本。它在 HTTP/1.1 的基础上进行了改进，旨在提高 Web 应用的性能和效率。

## 核心特点

- 多路复用 (Multiplexing): 允许在同一个 TCP 连接上同时发送多个 HTTP 请求和响应，解决了 HTTP/1.1 的队头阻塞问题，提高了并发性能。
- 头部压缩 (Header Compression): 使用 HPACK 算法对 HTTP 头部进行压缩，减少了头部的大小，提高了传输效率。
- 服务器推送 (Server Push): 允许服务器主动地向客户端推送资源，而无需客户端显式地请求，减少了客户端的请求次数，提高了性能。
- 优先级 (Prioritization): 允许客户端指定 HTTP 请求的优先级，服务器可以根据优先级来调度请求，保证重要资源的优先传输。
- 二进制协议: HTTP/2 使用二进制协议，而不是像 HTTP/1.1 那样使用文本协议，提高了解析效率。

## 应用

- **Web 浏览器**: Web 浏览器使用 HTTP/2 协议与 Web 服务器进行通信，获取网页内容。
- **Web 服务器**: Web 服务器使用 HTTP/2 协议与 Web 浏览器进行通信，提供网页内容。
- **API**: 许多 API 使用 HTTP/2 协议进行数据传输。

## 优缺点

- 优点:
		- 提高了性能和效率。
		- 解决了队头阻塞问题。
		- 减少了头部的大小。
		- 支持服务器推送。
		- 支持优先级。
- 缺点:
		- 部署和配置相对复杂。
		- 需要 TLS 加密，增加了 CPU 负担。

## 相关概念

- [[HTTP/1.1]]: HTTP 协议的第二个主要版本。
- [[TCP]]: 一种传输层协议，用于在客户端和服务器之间建立可靠的连接。
- [[TLS]]: 一种加密协议，用于保护客户端和服务器之间的通信安全。
- [[HPACK]]: 一种头部压缩算法，用于压缩 HTTP 头部。

## 案例

- **Web 浏览器访问网页**: Web 浏览器使用 HTTP/2 协议与 Web 服务器进行通信，获取网页内容。
- **API 获取数据**: API 使用 HTTP/2 协议进行数据传输。

## 问答卡片

- Q1：HTTP/2 和 HTTP/1.1 有什么区别？
- A：HTTP/2 在 HTTP/1.1 的基础上进行了改进，引入了多路复用、头部压缩、服务器推送和优先级等新的特性，提高了 Web 应用的性能和效率。
- Q2：HTTP/2 为什么需要 TLS 加密？
- A：HTTP/2 规范建议使用 TLS 加密，以提高安全性。虽然 HTTP/2 也可以在非加密的 TCP 连接上运行，但大多数浏览器只支持在 TLS 加密的连接上使用 HTTP/2。

## 参考资料

- MDN Web Docs: [https://developer.mozilla.org/en-US/docs/Web/HTTP/2](https://developer.mozilla.org/en-US/docs/Web/HTTP/2)
