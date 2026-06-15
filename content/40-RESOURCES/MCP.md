---
content-type: term
title: MCP
aliases: ["T-MCP", Model Context Protocol]
date-created: 2026-03-01
date-modified: 2026-03-07
status: 🌰 seed
---

## MCP (Model Context Protocol)

**一句话总结**：MCP 是一个开源的标准化协议，让 AI 助手能够安全地、双向地访问本地数据源（如本地文件、数据库、终端服务），而无需为每个数据源编写定制插件。

**核心机制**：
采用 Client-Server 架构。
- **Host (宿主)**：比如你正在使用的支持 MCP 的 AI IDE 或工具。
- **Client (客户端)**：维持与服务器的连接。
- **Server (服务端)**：暴露特定的能力（Resources, Prompts, Tools）。比如你可以跑一个本地的 Node.js 进程作为 MCP Server，专门读取本地的 Obsidian 笔记库。

**与我的关联 / 实践场景**：
这解决了以前 AI 无法感知我本地环境的问题。如果在 WSL 环境下启动一个 MCP Server，就可以让 AI 直接读取我特定的日志文件或代码目录，进行上下文分析。

**关联概念**：
- 上位概念：[[AI 基础设施]]
- 相关概念：[[Tool Use / Function Calling]]
- 参考来源：[[Anthropic MCP 官方文档解析 (简悦剪藏)]]
