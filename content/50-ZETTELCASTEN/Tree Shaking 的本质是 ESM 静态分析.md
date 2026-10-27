---
uid: 202605180002
title: Tree Shaking 的本质是 ESM 静态分析
aliases: []
description: Tree Shaking 利用 ES Module 的静态结构在打包阶段移除未使用的导出
tags:
  - 前端/构建工具
date-created: 2026-05-18
date-modified: 2026-10-27
status: active
content-type: atomic
up: "[[Webpack]]"
noteId: 1792465710541
---

> Tree Shaking 的本质是 ESM~~静态分析~~。

**边界**：静态分析只保证「能判定」，不保证「会删除」。`sideEffects` 标记不当、Babel 把 ESM 编成 CJS、模块顶层有副作用，都会让分析结果落不了地。

## 论据/示例

判据只有一条：能不能在不运行代码的前提下，确定某个导出没人引用。能，就可以删；不能，任何工具都救不了。

ESM 为什么满足、CommonJS 为什么不满足、`sideEffects` 怎么配，见 [[Webpack]] 的「Tree Shaking 的前提」。

## 关联

- [[Webpack]] — Tree Shaking 是 Webpack 的核心优化手段
- [[Webpack配置流程]] — 配置 Tree Shaking 的标准流程
