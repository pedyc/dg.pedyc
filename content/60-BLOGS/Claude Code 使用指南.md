---
uid: 202603260001
title: Claude Code 使用指南
aliases: [ClaudeCodeGuide]
description: 前端开发者的 Claude Code 入门到进阶指南，从环境配置到自定义工作流构建
tags: [AI/Claude, 前端开发]
date-created: 2026-03-26
date-modified: 2026-07-17
status: completed
category: blog
content-type: article
published: true
---

> Claude Code 是 Anthropic 推出的 AI 代理编码工具，它不仅能帮助你写代码，更能成为你日常工作流的核心枢纽。本文将带领你从零开始，掌握这个强大的 AI 助手。

---

## 引言

作为一名程序员，我们每天都在与代码、构建工具、测试用例打交道。深入了解 Claude Code，让 AI 不仅仅是 " 写代码的工具 "，而是升级为 " 能独立完成任务的智能代理 "。

与传统代码补全工具（如 Copilot）不同，Claude Code 的核心优势在于：
1. **深度代码库理解** - 能理解整个项目的上下文
2. **自主执行能力** - 不仅给建议，还会帮你执行
3. **可扩展的工作流** - 通过 Skills、Hooks、MCP 构建自动化

---

## 主体

### 一、环境配置与基础命令

#### 1.1 安装

```bash
# Node.js 18+ 是前置要求
nvm install 22
nvm use 22

# 全局安装 Claude Code
npm install -g @anthropic-ai/claude
```

#### 1.2 初始化项目

```bash
cd your-project
claude
/init  # 引导创建 CLAUDE.md
```

**CLAUDE.md 是项目的 " 说明书 "**，在这里定义：
- 代码规范和风格
- 项目结构说明
- 常用命令别名
- 特定任务的处理方式

#### 1.3 核心命令一览

| 命令 | 作用 |
|------|------|
| `/init` | 初始化项目 CLAUDE.md |
| `/status` | 查看完整状态 |
| `/context` | 可视化上下文使用 |
| `/compact` | 压缩历史但保留摘要 |
| `/model` | 切换模型 (sonnet/opus) |
| `/mcp` | 管理 MCP 服务器 |
| `/hooks` | 配置事件钩子 |
| `/agents` | 配置自定义代理 |

### 二、代理循环：理解 Claude 的工作方式

Claude Code 的核心是**代理循环（Agent Loop）**：

```bash
收集上下文 → 采取行动 → 验证结果
```

每次交互中，Claude 会：
1. **收集上下文** - 读取相关文件、理解项目结构
2. **采取行动** - 编辑文件、运行命令、搜索内容
3. **验证结果** - 运行测试、检查输出

这种循环模式使得 Claude 能够自主迭代完成任务，而不是一次性的问答。

### 三、工作流扩展：构建自动化

#### 3.1 Skills：自定义命令

Skill 是 Claude Code 最强大的扩展功能之一，允许你定义可复用的工作流。

```markdown
---
name: code-review
description: 运行代码审查并输出报告
argument-hint: 需要审查的文件或目录
allowed-tools:
  - Bash
  - Grep
  - Read
---

# Code Review Skill

1. 运行 eslint 检查代码规范
2. 运行单元测试
3. 检查潜在的安全问题
4. 输出审查报告
```

**最佳实践**：
- Skill 只包含执行步骤，详细知识外置到知识库
- Frontmatter 必须包含 name、description、argument-hint、allowed-tools

#### 3.2 Hooks：事件驱动自动化

Hooks 允许你在特定事件发生时自动触发操作：

```json
// .claude/settings.json
{
  "permissions": {
    "allow": ["npm test", "npm run build"]
  },
  "hooks": {
    "PreCommit": ["npm run lint", "npm test"]
  }
}
```

典型前端场景：
- `git commit` 前自动运行 lint + test
- 文件保存后自动格式化

#### 3.3 MCP：连接外部服务

MCP (Model Context Protocol) 允许 Claude 连接外部 API 和服务：

- **GitHub** - 自动化 PR 管理
- **Figma** - 直接读取设计稿
- **数据库** - 查询和分析数据
- **Jira** - 管理项目和任务

### 四、前端工作流实战

#### 4.1 代码审查自动化

```bash
# 使用内置命令
/review
/security-review
```

#### 4.2 构建验证

在 `CLAUDE.md` 中配置可信命令：

```json
{
  "permissions": {
    "allow": ["npm run lint", "npm run type-check", "npm run test"]
  }
}
```

#### 4.3 组件生成

通过自然语言描述，让 Claude 生成完整组件：

```bash
创建一个 React Modal 组件，包含：
- 标题、关闭按钮
- 动画入场效果
- 允许自定义 footer
- 使用 TypeScript
```

---

## 总结

Claude Code 不仅仅是一个 AI 编程工具，它是编程工作流的 " 操作系统 "。通过掌握：

1. **基础命令** - 快速上手
2. **代理循环** - 理解其工作方式
3. **Skills/Hooks/MCP** - 构建自动化

你将能够构建出完全定制化的开发工作流，让 AI 成为你日常开发的 " 超级助手 "。

---

## 相关阅读

- [[Claude Code]]
- [[Claude Code 辅助编程]]
- [[Claude Code 如何工作]]
