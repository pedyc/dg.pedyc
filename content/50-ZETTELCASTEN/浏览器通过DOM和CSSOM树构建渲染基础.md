---
uid: 202603230014
title: 浏览器通过 DOM 和 CSSOM 树构建渲染基础
aliases: []
description: 浏览器通过解析 HTML 和 CSS 分别构建 DOM 树和 CSSOM 树，两者独立构建
tags:
  - 前端开发/浏览器
date-created: 2026-03-23
date-modified: 2026-10-27
status: active
content-type: atomic
up: "[[浏览器渲染流程]]"
noteId: 1792465699036
---

> 浏览器通过解析 HTML 和 CSS 分别构建 ~~DOM 树~~ 和 ~~CSSOM 树~~，两者独立构建，为后续渲染提供基础结构。

**边界**：CSSOM 的构建会阻塞渲染——只要有一个样式表没下载完，渲染树就不能合成（这才是 CSS 放 head 的真正原因）。DOM 则是增量构建的，两者并非严格同步并行；JS 执行还会打断 DOM 构建。

## 论据/示例

**DOM 树构建**：
- HTML 解析器读取 HTML 标签
- 将标签转换为节点（Element）
- 节点嵌套形成树形结构

**CSSOM 树构建**：
- CSS 解析器读取 CSS 规则
- 将规则转换为节点
- 同样形成树形结构

**独立性**：
- DOM 和 CSSOM 可以并行构建
- 两者都完成后才能合并为渲染树

## 关联

- [[浏览器渲染流程]] — 本观点的主题
- [[浏览器]] — DOM/CSSOM 是浏览器的核心数据结构
