---
title: HTTP~1.1
date-created: 2025-06-02
date-modified: 2025-12-25
---

## 定义

HTTP/1.1 (Hypertext Transfer Protocol 1.1) 是一种应用层协议，是 HTTP 协议的第二个主要版本。它在 HTTP/1.0 的基础上进行了改进，引入了许多新的特性，例如==持久连接、管道化、分块传输和内容协商等==，提高了 Web 应用的性能和效率。

## 核心特点

- [[持久连接]] (Persistent Connection): 允许在同一个 TCP 连接上发送多个 HTTP 请求和响应，减少了 TCP 连接的建立和关闭次数，提高了性能。
- [[管道化]] (Pipelining): 允许在同一个 TCP 连接上同时发送多个 HTTP 请求，而无需等待前一个请求的响应，进一步提高了性能。
- [[分块传输]] (Chunked Transfer): 允许将 HTTP 响应分成多个块进行传输，而无需在发送响应之前知道响应的总长度，提高了灵活性。
- [[内容协商]] (Content Negotiation): 允许客户端和服务器之间协商使用哪种内容类型，例如文本、图片、视频等，提高了用户体验。
- Host 头部: 强制要求客户端在 HTTP 请求中包含 Host 头部，用于指定服务器的域名，支持虚拟主机。

## 应用

- **Web 浏览器**: Web 浏览器使用 HTTP/1.1 协议与 Web 服务器进行通信，获取网页内容。
- **Web 服务器**: Web 服务器使用 HTTP/1.1 协议与 Web 浏览器进行通信，提供网页内容。
- **API**: 许多 API 使用 HTTP/1.1 协议进行数据传输。

## 优缺点

- 优点:
		- 提高了性能和效率。
		- 支持虚拟主机。
		- 提高了灵活性。
- 缺点:
		- 头部冗余，每个 HTTP 请求和响应都包含大量的头部信息。
		- 队头阻塞 (Head-of-Line Blocking)，如果一个 HTTP 请求的响应被阻塞，后续的 HTTP 请求也会被阻塞。

## 相关概念

- [[HTTP~1.0]]: HTTP 协议的第一个主要版本。
- [[HTTP~2]]: HTTP 协议的第三个主要版本，在 HTTP/1.1 的基础上进行了进一步的改进，例如多路复用和头部压缩等。
- [[TCP]]: 一种传输层协议，用于在客户端和服务器之间建立可靠的连接。

## 案例

- **Web 浏览器访问网页**: Web 浏览器使用 HTTP/1.1 协议与 Web 服务器进行通信，获取网页内容。
- **API 获取数据**: API 使用 HTTP/1.1 协议进行数据传输。

## 问答卡片

- Q1：HTTP/1.1 和 HTTP/1.0 有什么区别？
- A：HTTP/1.1 在 HTTP/1.0 的基础上进行了改进，引入了持久连接、管道化、分块传输和内容协商等新的特性，提高了 Web 应用的性能和效率。
- Q2：HTTP/1.1 存在哪些问题？
- A：HTTP/1.1 存在头部冗余和队头阻塞等问题。

## 参考资料

- MDN Web Docs: [https://developer.mozilla.org/en-US/docs/Web/HTTP/1.1](https://developer.mozilla.org/en-US/docs/Web/HTTP/1.1)
