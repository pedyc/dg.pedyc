---
uid: <% tp.file.creation_date("YYYYMMDDHHmm") %>
title: "{ SOP名称 }"
description: "{ 一句话描述这个 SOP 的用途 }"
tags: []
content-type: sop
status: cultivating
date-created: <% tp.date.now("YYYY-MM-DD") %>
date-modified: <% tp.date.now("YYYY-MM-DD") %>
up: ""
aliases: ["SOP-{{标题名称}}"]
---

## SOP：{{动宾结构标题}}

> 一句话描述这个 SOP 的目标和适用场景

---

### 适用场景

- 场景1：{{具体情况}}
- 场景2：{{具体情况}}

---

### 流程图解

```mermaid
flowchart TD
    A[开始] --> B[步骤1]
    B --> C{判断?}
    C -->|是| D[步骤2]
    C -->|否| E[步骤3]
    D --> F[结束]
    E --> F
```

---

### 核心步骤

1. **步骤1**：{{做什么}}
   - 注意：{{关键点}}
2. **步骤2**：{{做什么}}
3. **步骤3**：{{做什么}}

---

### 常见坑点

- ⛔ **反模式**：{{不要做什么}}
- 🔧 **排查**：如果 {{错误}}，检查 {{检查点}}

---

### 知识图谱

- **父级概念**：[[{{父级}}]]
- **关联概念**：[[{{相关笔记}}]]