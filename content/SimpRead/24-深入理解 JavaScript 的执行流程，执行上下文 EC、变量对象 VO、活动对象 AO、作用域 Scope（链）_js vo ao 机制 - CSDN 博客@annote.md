---
title: 24-深入理解 JavaScript 的执行流程，执行上下文 EC、变量对象 VO、活动对象 AO、作用域 Scope（链）_js vo ao 机制 - CSDN 博客@annote
date-created: 2025-05-16
date-modified: 2025-05-21
alias: ["srAnnote@深入理解 JavaScript 的执行流程，执行上下文 EC、变量对象 VO、活动对象 AO、作用域 Scope（链）_js vo ao 机制 - CSDN 博客"]
index: 24
type: Simpread
UID: 20250517000354
---

## [[24-深入理解 JavaScript 的执行流程，执行上下文 EC、变量对象 VO、活动对象 AO、作用域 Scope（链）_js vo ao 机制 - CSDN 博客]]

> [!timeline]+ 简介
>
> > **元数据**
>
> ---
> **原文**:: [深入理解 JavaScript 的执行流程，执行上下文 EC、变量对象 VO、活动对象 AO、作用域 Scope（链）_js vo ao 机制 - CSDN 博客](https://blog.csdn.net/yangxinxiang84/article/details/113051811?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.control&dist_request_id=1328641.10297.16155372256670345&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.control)
> **日期**:: [[2025-05-17]]
> **标签**:: #SimpRead
>
> > **摘要**
>
> ---
> 文章浏览阅读 1.5k 次，点赞 5 次，收藏 9 次。本文详细阐述了 JavaScript 的执行上下文、作用域链、VO/AO 概念，包括全局和函数执行上下文的创建流程，以及变量声明和函数声明的优先级。通过实例演示了函数声明覆盖变量声明的过程，适合初学者理解 JS 核心机制。

### 笔记
