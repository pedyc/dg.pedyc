---
title: LLM为什么能够选择正确的Tool？
date-created: 2026-09-27
date-modified: 2026-09-27
---

## 背景

例如Runtime提供给了LLM以下Tool：

```bash
read_file
write_file
run_command
search_code
```

用户说；「看看 Login.tsx 里面的登录逻辑。」

为什么 LLM 会选择：

```bash
read_file("Login.tsx")
```

而不是：

```bash
run_command(…)
```

## 回答

> Tool Definition 不只是告诉 LLM"这个工具存在"，还通过 `name + description + schema` 给 LLM 提供了工具的**语义**和调用方式。

## 解释

### 1. Tool Definition定义了字段语义

例如`read_file`：

```json
{
	"name": "read_file",
	"description": "读取文件",
  "type": "object",
  "properties": {
    "path": {
      "type": "string"
    }
  },
  "required": ["path"]
}
```

- name定义了工具名
- description提供了工具用途的语义
- schema提供了工具的调用方式

### 2. LLM根据语义推理出应该使用什么工具

LLM根据上下文（用户目标、当前任务等）+ Tool Definition description 推理出应该 Tool Call

### 3. 也就是说

LLM选择正确Tool的流程：

```bash
用户目标
   +
当前 Context
   +
Tool Definitions
   ↓
推理
   ↓
选择合适的 Tool
   ↓
生成 Tool Call
```

## 关联

- [[ToolCalling]]
- [[ToolDefinition]]
