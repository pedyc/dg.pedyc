---
title: META-笔记分类系统
aliases: [本库笔记内容分类系统]
date-created: 2025-05-10
date-modified: 2026-03-06
content-type: [MOC]
---

## 笔记分类系统

此系统基于 **信息熵** 和 **行动导向** 来对笔记进行分类

### 原子类（Atomic）

| A    | B                             |
| ---- | ----------------------------- |
| 元数据  | content-type: atomic          |
| 定义   | 最小单位的知识点、术语、API 接口、单一函数、专有名词  |
| 适用类型 | \[[LocalStorage]]、\[[MCP 协议]] |
| 模板   | [[template_atomic]]           |

### 概念类（Concept）

| A    | B                                   |
| ---- | ----------------------------------- |
| 元数据  | content-type: concept               |
| 定义   | 包含多个定义，解释 " 为什么 " 或 " 如何运作 " 的逻辑集合。 |
| 适用类型 | \[[浏览器存储机制]]、\[[AI Agent 编排逻辑]]     |
| 模板   | [[template_concept]]                |

### 对比类（Comparison）

| A    | B                                                       |
| ---- | ------------------------------------------------------- |
| 元数据  | content-type: comparison                                |
| 定义   | 跨越多个概念，进行横向评测、优劣分析、选型建议。                                |
| 适用类型 | [[各种前端存储方式间有什么区别？]], \[[Claude Code vs GitHub Copilot]] |
| 模板   | [[template_comp]]                                       |

### 流程类（SOP）

| A    | B                                                          |
| ---- | ---------------------------------------------------------- |
| 元数据  | content-type: sop                                          |
| 定义   | 具有明确步骤的操作指南，旨在 " 可复现 "。                                       |
| 适用类型 | `[[WSL 环境下配置 Neovim 指南]]`, `[[Claude Code 集成 Minimax 流程]]` |
| 模板   | [[template_sop]]                                           |

- 示例：[[PARA笔记法]]

### 索引类（MOC）

|A|B|
|---|---|
|元数据|content-type: comparison|
|定义|跨越多个概念，进行横向评测、优劣分析、选型建议。|
|适用类型|[各种前端存储方式间有什么区别？](各种前端存储方式间有什么区别？), [[Claude Code vs GitHub Copilot]]|
|模板|[template_comp](template_comp)|

### 日志类（Log）

| A    | B                                                                     |
| ---- | --------------------------------------------------------------------- |
| 元数据  | content-type: comparison                                              |
| 定义   | 跨越多个概念，进行横向评测、优劣分析、选型建议。                                              |
| 适用类型 | [各种前端存储方式间有什么区别？](各种前端存储方式间有什么区别？), [[Claude Code vs GitHub Copilot]] |
| 模板   | [template_comp](template_comp)                                        |
