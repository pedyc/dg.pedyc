---
uid: 202603230020
title: localStorage 用于长期存储简单键值对数据
aliases: []
description: localStorage 提供持久化的键值对存储，数据除非手动删除否则永不过期
tags: [前端开发/浏览器]
date-created: 2026-03-23
date-modified: 2026-03-23
status: active
content-type: atomic
up: [[Web存储]]
---

> localStorage 提供持久化的键值对存储，数据除非手动删除否则永不过期，同源策略下数据共享。

### 论据/示例

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

### 关联

- [[Web存储]] — 本观点的主题
- [[sessionStorage]] — 对比：会话级存储
- [[Cookie]] — 对比：服务端存储
