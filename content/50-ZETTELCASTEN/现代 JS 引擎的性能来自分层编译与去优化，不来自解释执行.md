---
uid: 202603160000
title: 现代 JS 引擎的性能来自分层编译与去优化，不来自解释执行
aliases: []
description: JavaScript 引擎通过解析、编译和执行将 JS 代码转换为机器码
tags:
  - 前端开发/JavaScript
date-created: 2026-03-15
date-modified: 2026-03-21
status: active
content-type: atomic
up: "[[JavaScript 引擎]]"
noteId: 1792465707008
---

> JavaScript 引擎读取源代码，通过词法分析、语法分析生成抽象语法树 (AST)，然后~~解释执行~~或~~编译执行~~。

**边界**：现代引擎的核心早已不是「解释执行」，而是分层编译与优化/去优化的循环。用「解释 + 执行」描述它，解释不了为什么同一段代码热身后能快几十倍。

## 论据/示例

```mermaid
flowchart LR
    Code[源代码] -->|词法分析| Tokens[词法单元]
    Tokens -->|语法分析| AST[抽象语法树]
    AST -->|解释执行| Output1[逐行执行]
    AST -->|编译执行| Output2[机器码执行]
```

1. **解析 (Parsing)**：词法分析 + 语法分析 → 生成 AST
2. **解释/编译**：AST → 字节码或机器码
3. **执行**：在虚拟机或直接执行机器码

## 关联

- **父级**：[[JavaScript 引擎]]
- **相关**：[[V8 引擎]] [[字节码]]
