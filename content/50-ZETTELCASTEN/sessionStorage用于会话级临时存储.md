---
uid: 202603230021
title: sessionStorage 用于会话级临时存储
aliases: []
description: sessionStorage 数据仅在当前会话有效，关闭标签页后自动清除
tags: [前端开发/浏览器]
date-created: 2026-03-23
date-modified: 2026-03-23
status: active
content-type: atomic
up: [[Web存储]]
---

> sessionStorage 提供会话级的键值对存储，数据仅在当前标签页会话中有效，关闭标签页后自动清除。

### 论据/示例

**基本用法**：
```javascript
// 存储
sessionStorage.setItem('draft', 'some text');

// 读取
const draft = sessionStorage.getItem('draft');

// 关闭标签页后自动清除
```

**特点**：
- 容量：约 5-10MB
- 数据类型：仅字符串
- 有效期：会话级（标签页关闭即清除）
- 作用域：仅当前标签页（不同标签页数据隔离）

**与 localStorage 的区别**：

| 特性 | localStorage | sessionStorage |
|:--- |:--- |:--- |
| 有效期 | 永久 | 会话级 |
| 作用域 | 同源共享 | 仅当前标签页 |
| 关闭标签页 | 保留 | 清除 |

**常见用途**：
- 表单草稿暂存
- 页面间临时数据传递
- 单页应用临时状态

### 关联

- [[Web存储]] — 本观点的主题
- [[localStorage]] — 对比：持久化存储
