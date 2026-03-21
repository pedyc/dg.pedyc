---
uid: 202505290000
title: Webpack
aliases: [模块打包器]
description: 开源的 JavaScript 模块打包器，将各种资源打包成静态资源
tags: [前端/构建工具]
date-created: 2025-05-29
date-modified: 2026-03-15
status: active
content-type: term
up: "[[前端工程化]]"
---

## Webpack

> Webpack 是开源的 JavaScript 模块打包器，将项目中的各种资源（JS、CSS、图片等）视为模块，分析依赖关系后打包成静态资源。

### 核心概念

- **入口**：构建依赖图的起点
- **出口**：打包输出的位置
- **Loader**：转换非 JS 资源（如 CSS、图片）
- **Plugin**：扩展功能（优化、压缩等）

### 工作流程

1. 读取配置文件
2. 构建 Compiler 对象
3. 递归解析模块依赖
4. 使用 Loader 转换
5. 使用 Plugin 优化
6. 输出 Bundle

### 适用场景

- ✅ 大型复杂项目（完善生态）
- ✅ 需要细粒度打包控制
- ⚠️ 中小型项目（配置重，启动慢）

### 关联

- **上游**：[[前端工程化]]
- **相关工具**：[[Vite]]（对比学习）
- **深入主题**：[[T-Webpack]]
