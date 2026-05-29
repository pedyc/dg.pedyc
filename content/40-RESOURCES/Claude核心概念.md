---
uid: 202603260000
title: Claude核心概念
aliases: ["MOC-Claude核心概念"]
description: Claude Code 核心概念的知识索引，包含代理循环、工具系统、工作流扩展等
tags: [AI/Claude]
date-created: 2026-03-26
date-modified: 2026-03-26
status: cultivating
content-type: moc
up: [["A-Claude Code"]]
---

## MOC：Claude 核心概念

> Claude Code 核心概念的概念地图，帮助前端开发者构建自定义工作流

---

### 核心机制

- [[代理循环]] — Claude 如何循环执行任务：收集 → 行动 → 验证
- [[工具系统]] — Claude 可用的工具能力（Read/Edit/Write/Bash 等）
- [[执行环境]] — 终端、IDE、文件系统访问
- [[上下文管理]] — 上下文窗口、压缩、会话管理

### 工作流扩展

- [[Skills]] — 自定义命令和工作流
- [[Hooks]] — 事件驱动的自动化钩子
- [[MCP]] — Model Context Protocol，连接外部服务
- [[Subagents]] — 子代理，复杂任务拆分

### 配置与项目集成

- [[权限系统]] — 命令白名单/黑名单配置
- [[检查点]] — 会话恢复和状态保存

### 使用模式

- [[会话模式]] — 交互式对话 vs 单次命令
- [[任务委派]] — 如何有效地分配任务
- [[迭代工作流]] — 渐进式完成任务

### 实践指南

- [[Claude Code 使用指南]] — 入门到进阶
- [[Claude Code 进阶使用]] — MCP/Hooks/Subagents
- [[前端工作流]] — 前端开发最佳实践

---

### 外部资源

- [Claude Code 官方文档](https://code.claude.com/docs/zh-CN/overview)
- [Claude Code 快速入门](https://code.claude.com/docs/zh-CN/quickstart)
- [Claude API 文档](https://platform.claude.com/docs/en/home)

---

### 待探索

- [ ] MCP 实战：连接 Figma/GitHub API
- [ ] Hooks 配置：git commit 自动化
- [ ] Subagents：复杂任务拆分实践
- [ ] 权限配置最佳实践
