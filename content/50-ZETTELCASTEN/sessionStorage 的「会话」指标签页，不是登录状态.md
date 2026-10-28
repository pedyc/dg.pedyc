---
uid: 202603230021
title: sessionStorage 的「会话」指标签页，不是登录状态
aliases: []
description: sessionStorage 数据仅在当前会话有效，关闭标签页后自动清除
tags: [前端开发/浏览器]
date-created: 2026-03-23
date-modified: 2026-10-28
status: active
content-type: atomic
up: "[[Web Storage]]"
noteId: 1792465709775
---

> sessionStorage 提供~~会话级~~的键值对存储，数据仅在当前标签页会话中有效，关闭标签页后自动清除。

**边界**：「会话」的粒度是标签页，不是登录状态。用 `window.open` 打开的新标签页会复制一份快照，之后两边各走各的。所以它适合草稿，不适合需要跨标签页共享的状态。

## 论据/示例

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

**常见用途**：
- 表单草稿暂存
- 页面间临时数据传递
- 单页应用临时状态

## 关联

- [[Web Storage]] — 本观点的主题
- [[localStorage]] — 对比：持久化存储
