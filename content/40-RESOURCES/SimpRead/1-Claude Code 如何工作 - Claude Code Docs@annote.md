---
title: 1-Claude Code 如何工作 - Claude Code Docs@annote
author: code.claude.com
description: 了解代理循环、内置工具以及 Claude Code 如何与您的项目交互。
tags: []
date-created: 2026-03-03
date-modified: 2026-03-03
alias: ["srAnnote@Claude Code 如何工作 - Claude Code Docs"]
---

## Claude Code 如何工作 - Claude Code Docs

> [!md] Metadata
> **标题**:: Claude Code 如何工作 - Claude Code Docs
> **作者**:: code.claude.com
> **日期**:: [[2026-03-03]]
> **原文链接**:: [原文链接](https://code.claude.com/docs/zh-CN/how-claude-code-works)
> **内部链接**:: [内部链接](http://localhost:7026/unread/1)

> [!summary] 描述
> 了解代理循环、内置工具以及 Claude Code 如何与您的项目交互。

**Highlights & Notes**

> Skills 按需加载。Claude 在会话开始时看到 skill 描述，但完整内容仅在使用 skill 时加载。对于您手动调用的 skills，设置 disable-model-invocation: true 以将描述保留在上下文之外，直到您需要它们。

> Subagents 获得自己的新上下文，完全独立于您的主对话。他们的工作不会膨胀您的上下文。完成后，他们返回摘要。这种隔离是为什么 subagents 有助于长会话。

> Claude 的上下文窗口保存您的对话历史、文件内容、命令输出、CLAUDE.md、加载的 skills 和系统说明。当您工作时，上下文填满。Claude 自动压缩，但对话早期的说明可能会丢失。将持久规则放在 CLAUDE.md 中，并运行 /context 以查看什么在占用空间。

> 每个文件编辑都是可逆的。 在 Claude 编辑任何文件之前，它会对当前内容进行快照。如果出现问题，按两次 Esc 以回退到之前的状态，或要求 Claude 撤销。

> 您也可以在.claude/settings.json 中允许特定命令，以便 Claude 不会每次都询问。这对于受信任的命令（如 npm test 或 git status）很有用。设置可以从组织范围的策略范围到个人偏好。有关详细信息，请参阅权限。

> 想象委派给一个有能力的同事。提供上下文和方向，然后相信 Claude 会弄清楚细节：
