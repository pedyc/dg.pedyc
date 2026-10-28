---
uid: 202603230014
title: 浏览器通过 DOM 和 CSSOM 树构建渲染基础
aliases: []
description: 解析 HTML 与 CSS 分别得到 DOM 和 CSSOM，两者独立但 CSSOM 不进入布局树
tags:
  - 前端开发/浏览器
date-created: 2026-03-23
date-modified: 2026-10-28
content-type: atomic
up: "[[浏览器渲染流程]]"
noteId: 1792465699036
---

> 浏览器通过解析 HTML 和 CSS 分别构建 ~~DOM 树~~ 和 ~~CSSOM 树~~，两者独立构建，为后续渲染提供基础结构。

**边界**：两者独立，但不平等。CSSOM 会阻塞渲染——只要有一个样式表没下载完，样式计算就无法完成，首次绘制被推迟（这才是 CSS 放 `head` 的真正原因：不是「必须放在那」，而是放在别处同样会阻塞，不如早点开始下载）。DOM 是增量构建的，与 CSSOM 并非同步推进；JS 执行还会打断 DOM 构建。

还有一处要分清：**CSSOM 不进入最终的树**。它是规则集，在样式计算阶段被逐元素匹配，产物是每个元素的 ComputedStyle；承载结构与几何的那棵树由布局阶段建立，节点是 `LayoutObject`（WebKit 时代叫 `RenderObject`，中文教材称渲染树）。所以「DOM 与 CSSOM 合并成渲染树」是教学简化，真实的动作是查表，不是归并。

## 论据/示例

**DOM 树构建**：
- HTML 解析器流式读取字节，逐个产出 token
- token 转换为节点（Element、Text），按嵌套关系组成树
- 解析可以被脚本打断，恢复后从断点继续

**CSSOM 构建**：
- CSS 解析器把规则编译成规则集（按选择器索引），供后续快速匹配
- 它也暴露成 JS 可读的 API（`document.styleSheets`），但那是旁路，不是渲染用的形态

**独立而非归并**：
- DOM 与 CSSOM 可以并行构建，互不等待
- 两者都就绪后发生的不是「合并」，而是样式计算：为每个元素匹配规则、处理级联与继承，得出 ComputedStyle
- 布局树由布局阶段建立，只收参与布局的节点：`display: none`、`head`、`script` 不在，伪元素与匿名盒反而会多出来

## 关联

- [[浏览器渲染流程]] — 本观点的主题
- [[浏览器]] — DOM/CSSOM 是浏览器的核心数据结构
