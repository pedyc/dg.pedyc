---
uid: 202605191600
title: Monorepo
aliases: [T-Monorepo, 单代码仓库]
description: 将多个项目代码存储在同一个代码仓库中的开发模式
tags: [area/前端工程, area/Monorepo]
date-created: 2025-04-29
date-modified: 2026-07-27
status: cultivating
content-type: term
---

## 术语：Monorepo

> **主题**：#软件工程/架构模式

### 定义

Monorepo（Monolithic Repository，单代码仓库）是一种代码仓库管理策略，将多个相关项目（通常是一个组织内的多个前端/后端服务）存储在同一个版本控制仓库中。

**核心特征**：
- 所有代码保存在单一仓库
- 共享依赖和工具链配置
- 统一版本管理和发布流程

### 核心特点

**优势**：
- 代码共享便捷，跨项目引用容易
- 统一依赖版本，避免版本冲突
- 原子提交（Atomic Commit），一个 PR 修改多个相关包
- 简化依赖管理，一个 node_modules 供所有项目使用
- 便于大规模重构和 API 变更

**挑战**：
- 仓库体积膨胀，大团队可能达数 GB
- CI/CD 复杂度增加，需要智能触发
- 权限控制困难，所有人可访问全部代码
- 构建时间可能增加，需要缓存策略

### 工具生态

| 工具 | 用途 |
|:---|:---|
| npm workspace | 简化包管理 |
| pnpm workspace | 高效的 monorepo 包管理 |
| Turborepo | 构建缓存和任务编排 |
| Nx | 高级构建缓存和依赖分析 |
| Lerna | 多包仓库管理（较少维护） |

### 与 Polyrepo 对比

| 维度 | Monorepo | Polyrepo |
|:---|:---|:---|
| 代码共享 | 简单 | 复杂（需要发包） |
| 依赖版本 | 统一 | 各自管理 |
| 仓库大小 | 大 | 小 |
| 权限控制 | 粗粒度 | 细粒度 |
| CI 触发 | 需智能判断 | 按需触发 |
| 适用规模 | 小到中团队 | 大型组织/多团队 |

### 适用场景

- 前端多组件库共享
- 全栈应用（前后端同仓库）
- 微前端多子应用统一管理

### 知识网络

- **父级概念**：[[前端工程]] — Monorepo 是前端工程化的架构模式
- **相关概念**：[[pnpm workspace]], [[Turborepo]], [[Lerna]]
- **协作领域**：[[持续集成与持续部署|CI/CD]] — Monorepo 需要配套的 CI/CD 策略
