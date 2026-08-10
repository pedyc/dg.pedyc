---
uid: 202603240006
title: JSONP
aliases: [T-JSONP, JSON with Padding]
description: 一种利用script标签绕过同源策略的古老跨域技术（已过时）
tags: [前端开发/归档]
date-created: 2026-03-24
date-modified: 2026-03-23
status: archived
content-type: term
---

> JSONP（JSON with Padding）是一种利用 `<script>` 标签绕过同源策略的跨域技术，现已被 CORS 取代。

## 定义

通过动态创建 `<script>` 标签，以回调函数的形式获取跨域数据。

## 原理

1. 前端定义回调函数
2. 服务端返回函数调用包裹的数据
3. 脚本加载时执行回调

## 示例

**前端**：

```javascript
function handleData(data) {
  console.log(data);
}

const script = document.createElement('script');
script.src = 'https://api.example.com/data?callback=handleData';
document.body.appendChild(script);
```

**服务端响应**：

```javascript
handleData({ name: 'Alice', age: 30 })
```

## 缺点

| 缺点 | 说明 |
|:---|:---|
| 仅支持 GET | 无法发送 POST 请求 |
| 不安全 | 相当于允许执行任意 JS |
| 缺乏错误处理 | 脚本加载失败难以捕获 |
| 不规范 | 依赖服务端配合 |

## 现状

**已不推荐使用**，CORS 是现代标准解决方案。

## 知识网络

- **相关概念**：
	- [[CORS]] — 现代跨域标准
	- [[同源策略]] — JSONP 绕过的安全策略
