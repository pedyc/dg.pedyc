---
title: Webpack
aliases: [模块打包器]
description: 一个开源的 JavaScript 模块打包器，用于将各种资源打包成浏览器可以识别和加载的静态资源。
date-created: 2025-05-29
date-modified: 2025-06-16
status: active
para: area
related: ["[[前端构建与打包]]", "[[Vite]]"]
zettel: moc
---

## 🔎描述

Webpack 是一个开源的 JavaScript 模块打包器。它将项目中的各种资源（JavaScript, CSS, 图片等）视为模块，通过分析模块间的依赖关系，将它们打包成浏览器可以识别和加载的静态资源。

## 🔗 活跃连接

- 相关领域
	- [[前端构建与打包]]: 「Webpack 是前端构建与打包的核心工具」
	- [[Vite]]: 「Vite 是 Webpack 的替代方案，提供了更快的构建速度」
- 相关概念
	- [[Loader]]: 「Webpack 使用 Loader 转换各种类型的文件」
	- [[Plugin]]: 「Webpack 使用 Plugin 扩展其功能」

## 🧱 关键要素

- 概述
	- [[Webpack 的定义]]: 「一个开源的 JavaScript 模块打包器」
- 方法论
	- [[Loader 的使用]]: 「使用 Loader 转换各种类型的文件」
	- [[Plugin 的使用]]: 「使用 Plugin 扩展 Webpack 的功能」
- 工作流
	- [[Webpack 的工作流程]]: 「Webpack 读取配置文件，构建 Compiler 对象，递归解析模块的依赖关系，使用 Loader 进行转换，使用 Plugin 进行优化，输出最终的 Bundle」
	- [[splitChunks]]

## 📚 核心资源

### 官方资源

- [Webpack 官方文档](https://www.webpackjs.com/): 「最权威的 Webpack 学习资料，包含了 Webpack 的所有 API 和配置选项」

### 学习资源

- [[Webpack 入门教程]]: 「一个 Webpack 入门教程，介绍了 Webpack 的基本概念和使用方法」
- [[Webpack 实战]]: 「一本 Webpack 实战书籍，介绍了 Webpack 在实际项目中的应用」

### 知识卡片

![[FAQ-Webpack]]

## ⚠️ 挑战与问题

- [[Webpack 配置复杂]]: 「Webpack 的配置非常复杂，需要一定的学习成本，参考 Webpack 配置指南」
- [[Webpack 打包速度慢]]: 「Webpack 在大型项目中打包速度可能较慢，需要进行优化，参考 Webpack 性能优化策略」
