---
uid: 202603230011
title: 渲染引擎与 JS 引擎是分工不是并行，它们共用主线程
aliases: []
description: 渲染引擎负责 HTML/CSS 解析和布局，JS 引擎负责执行 JavaScript
tags:
  - 前端开发/浏览器
date-created: 2026-03-23
date-modified: 2026-10-27
status: active
content-type: atomic
up: "[[浏览器]]"
noteId: 1792465698652
---

> 浏览器通过~~渲染引擎~~和 ~~JS 引擎~~分工处理页面，前者负责解析 HTML/CSS 和布局，后者负责执行 JavaScript 逻辑。

**边界**：分工不是「各管一摊」的松散协作——两者共享主线程。JS 执行期间渲染引擎停摆，所以「分工」只描述职责划分，不描述并行。真正的并行发生在进程之间（渲染进程、GPU 进程、网络进程）。

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
