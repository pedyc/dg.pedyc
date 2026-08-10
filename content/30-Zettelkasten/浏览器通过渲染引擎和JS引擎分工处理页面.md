---
uid: 202603230011
title: 浏览器通过渲染引擎和JS引擎分工处理页面
aliases: []
description: 渲染引擎负责 HTML/CSS 解析和布局，JS 引擎负责执行 JavaScript
tags: [前端开发/浏览器]
date-created: 2026-03-23
date-modified: 2026-03-23
status: active
content-type: atomic
up: "[[浏览器]]"
---

> 浏览器通过渲染引擎和 JS 引擎分工处理页面，前者负责解析 HTML/CSS 和布局，后者负责执行 JavaScript 逻辑。

## 论据/示例

**两大引擎的职责**：

| 引擎 | 职责 | 代表产品 |
|:---|:---|:---|
| 渲染引擎 | 解析 HTML/CSS → 构建 DOM/CSSOM → 布局 → 绘制 | Blink, WebKit, Gecko |
| JS 引擎 | 解析 JavaScript → 编译 → 执行 → 内存管理 | V8, JavaScriptCore, SpiderMonkey |

**协作流程**：
1. 渲染引擎解析 HTML/CSS，构建渲染树
2. JS 引擎执行脚本，可能修改 DOM/CSSOM
3. 渲染引擎重新计算布局和绘制

## 关联

- [[浏览器]] — 本观点的主题
- [[浏览器渲染流程]] — 渲染引擎的工作流程
- [[V8引擎工作原理]] — JS 引擎的详细机制
