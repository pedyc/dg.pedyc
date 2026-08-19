---
uid: 202605220003
title: 从输入URL到页面展示发生了什么
aliases: [Q-从输入URL到页面展示发生了什么]
description: 浏览器从输入URL到渲染页面的完整流程
tags: [question, 网络, 浏览器, HTTP]
date-created: 2026-05-22
date-modified: 2026-05-22
status: active
content-type: question
up: ["[[前端面试真题库|前端面试题]]", "[[网络协议相关问题|MOC-网络协议相关问题]]"]
---

## 问题

从输入 URL 到页面展示，浏览器经历了哪些过程？

---

## 答案

### 一、URL 解析

1. **识别输入内容**：判断是搜索关键字还是 URL
2. **URL 组成解析**：协议、域名、端口、路径、查询参数、锚点
3. **特殊处理**：Chrome 会自动补全协议和常见后缀

### 二、DNS 解析

1. **浏览器缓存**：先查浏览器 DNS 缓存
2. **系统缓存**：查本机 DNS 缓存（hosts 文件）
3. **路由器缓存**：查询本地域名服务器
4. **递归查询**：本地域名服务器 → 根域名服务器 → 顶级域名服务器 → 权威域名服务器
5. **返回 IP**：获取目标服务器的 IP 地址

> DNS 解析时会发生 [[Q-DNS 解析过程是怎样的？]] 的完整链路。

### 三、建立 TCP 连接（TCP 三次握手）

1. **客户端发送 SYN**：请求建立连接，seq = x
2. **服务端返回 SYN + ACK**：同意连接，ack = x + 1，seq = y
3. **客户端发送 ACK**：确认连接，ack = y + 1

> 如果是 HTTPS，还需要进行 [[Q-TLS 握手流程是怎样的？|TLS 握手]]。

### 四、发送 HTTP 请求

1. 构建请求行（Method + Path + HTTP Version）
2. 添加请求头（Host、User-Agent、Accept、Cookie 等）
3. 可选：添加请求体（POST/PUT）
4. 发送请求到服务器

### 五、服务器处理并返回响应

1. **服务器处理请求**：负载均衡、Web 服务器（Nginx）、应用服务器
2. **返回响应**：状态码 + 响应头 + 响应体
3. **关闭连接**：HTTP/1.1 默认 Keep-Alive 可复用，HTTP/2/3 多路复用

### 六、浏览器渲染

#### 6.1 解析 HTML 构建 DOM 树

```bash
HTML → Tokenizer → Tokens → DOM Tree
```

#### 6.2 解析 CSS 构建 CSSOM 树

```bash
CSS → Tokenizer → Tokens → CSSOM Tree
```

#### 6.3 合成 Render Tree

DOM + CSSOM → Render Tree（包含所有可见节点及样式）

#### 6.4 Layout（布局/回流）

计算每个节点的几何位置和尺寸

#### 6.5 Paint（绘制）

将节点绘制为多个图层的位图

#### 6.6 Composite（合成）

将不同图层合成最终页面图层

> 涉及 [[回流和重绘]] 优化点：避免触发回流、使用 transform/opacity 做动画。

### 七、JavaScript 执行

1. HTML 解析遇到 `<script>` 会暂停 DOM 构建
2. 同步脚本：立即下载并执行
3. 异步脚本：下载时继续解析 HTML
4. defer 脚本：HTML 解析完成后按顺序执行

---

## ⭐关键面试点

| 阶段 | 面试追问 |
|:---|:---|
| **DNS 解析** | DNS 缓存顺序？DNS 劫持是什么？ |
| **TCP 连接** | 为什么需要三次握手？四次挥手了解吗？ |
| **HTTP 请求** | HTTP 请求头有哪些？强缓存/协商缓存？ |
| **渲染过程** | 重排和重绘的区别？如何避免性能问题？ |
| **JS 阻塞** | script 为何会阻塞渲染？async vs defer？ |

---

## 性能优化点

- **DNS 层面**：使用 DNS 预解析 `<link rel="dns-prefetch">`
- **TCP 层面**：TCP 预连接 `<link rel="preconnect">`
- **资源层面**：预加载关键资源 `<link rel="preload">`
- **渲染层面**：避免同步 JS、使用 requestAnimationFrame

---

## 相关问题

- [[Q-HTTP有哪些请求方法？它们有什么区别？]]
- [[Q-TLS 握手流程是怎样的？]]
- [[回流和重绘]]
- [[浏览器与 Web]]
