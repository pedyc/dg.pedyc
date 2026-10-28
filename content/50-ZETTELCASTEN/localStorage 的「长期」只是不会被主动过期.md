---
uid: 202603230020
title: localStorage 的「长期」只是不会被主动过期
aliases: []
description: localStorage 提供持久化的键值对存储，数据除非手动删除否则永不过期
tags: [前端开发/浏览器]
date-created: 2026-03-23
date-modified: 2026-10-28
status: active
content-type: atomic
up: "[[Web Storage]]"
noteId: 1792465707403
---

> localStorage 提供~~持久化~~的键值对存储，数据除非手动删除否则永不过期，同源策略下数据共享。

**边界**：同步 API，读写发生在主线程，序列化大对象会直接卡住渲染。容量 5–10MB 因浏览器而异，超限抛 `QuotaExceededError`。同源共享意味着任何 XSS 都能读走，所以不该放凭据。「长期」也是相对的：清缓存、无痕模式、存储压力都会让它消失。

## 论据/示例

**基本用法**：

```javascript
// 存储
localStorage.setItem('theme', 'dark');

// 读取
const theme = localStorage.getItem('theme');

// 删除
localStorage.removeItem('theme');
localStorage.clear(); // 清空所有
```

**特点**：
- 容量：约 5-10MB
- 数据类型：仅字符串（可用 JSON 序列化对象）
- 有效期：永久存储
- 作用域：同源（协议+域名+端口）

**常见用途**：
- 用户主题偏好
- 语言设置
- 购物车数据

## 关联

- [[Web Storage]] — 本观点的主题
- [[sessionStorage]] — 对比：会话级存储
- [[Cookie]] — 对比：服务端存储
