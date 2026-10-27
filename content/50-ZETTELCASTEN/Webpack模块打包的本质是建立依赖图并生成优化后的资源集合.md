---
uid: 202605180001
title: Webpack模块打包的本质是建立依赖图并生成优化后的资源集合
aliases: []
description: Webpack 通过递归解析模块依赖构建依赖图，再生成优化后的资源集合
tags:
  - 前端/构建工具
date-created: 2026-05-18
date-modified: 2026-10-27
status: active
content-type: atomic
up: "[[Webpack]]"
noteId: 1792465712060
---

> Webpack 模块打包的本质是建立~~依赖图~~并生成优化后的资源集合。

**边界**：依赖图只覆盖构建期能静态看到的模块。运行时拼出的 `import()`、外部 CDN 脚本、以变量为参数的 `require` 都不在图里，拆包与 tree shaking 的边界到图为止。

## 论据/示例

「图 → chunk → 文件」这条链解释了两件事：为什么改一个深层模块会让某个 chunk 的 hash 全变；为什么 `splitChunks` 是在图上切分，而不是按目录切分。

构建流程与 chunk 划分规则见 [[Webpack]]。

## 关联

- [[Webpack]] — 本观点的上位概念
- [[Webpack配置流程]] — 配置 Webpack 的标准流程
