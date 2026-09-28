---
title: ToolDefinition
date-created: 2026-09-27
date-modified: 2026-09-27
---

## 什么是Tool Definition？

## 三个核心字段

### name

> 工具名称，LLM可以根据名字获取部分语义。

例如：

```bash
read_file
write_file
run_command
search_code
```

LLM 根据名字可以获得一部分语义，但**不能完全依赖名字**。

比如：

```bash
search
```

到底是搜索文件、搜索网页，还是搜索代码？

所以还需要 `description`。

### description

> 工具用途，主要提供Tool的**语义**信息，帮助LLM判定何时采用

例如：

```bash
read_file：
读取指定文件的内容

run_command：
在项目环境中执行 shell 命令

search_code：
在项目代码中搜索匹配内容
```

LLM 根据用户目标和这些描述进行匹配。

例如用户：

> "找一下项目里所有使用 `useEffect` 的地方。"

LLM 可能判断：

```bash
search_code
```

因为它的 description 与当前目标匹配。

所以：

> **description 主要提供 Tool 的语义信息，帮助 LLM 判断"什么时候应该使用这个 Tool"。**

### schema

> 工具调用方式，告诉LLM如何调用，帮助 LLM 理解 **应该如何构造参数**

假设：

```bash
read_file(path)
```

Schema 告诉 LLM：

```bash
{
  "type": "object",
  "properties": {
    "path": {
      "type": "string"
    }
  },
  "required": ["path"]
}
```

那么 LLM 应该产生：

```bash
{
  "name": "read_file",
  "arguments": {
    "path": "src/Login.tsx"
  }
}
```

而不是：

```bash
{
  "name": "read_file",
  "arguments": {
    "file": "src/Login.tsx"
  }
}
```

## LLM 真的是"严格按照 Schema 编程"吗？

不是。

```bash
Tool Definition
       ↓
     LLM
       ↓
   Tool Call
```

**Tool Definition 是给 LLM 的约束和指导，不是 Runtime 的安全边界。**

LLM 仍然可能产生：

```bash
{
  "path": 123
}
```

或者：

```bash
{
  "file": "Login.tsx"
}
```

甚至产生一个不存在的 Tool。

所以 Runtime 仍然需要验证。

这也是为什么形成了：

```bash
LLM
 ↓
Tool Call
 ↓
Runtime
 ├── Schema Validation
 ├── Permission
 ├── Policy
 └── …
 ↓
Tool
```

## 示例

### 一个完整的Tool Definition

```json
{
  "name": "read_file",
  "description": "读取指定文件的内容",
  "parameters": {
    "type": "object",
    "properties": {
      "path": {
        "type": "string",
        "description": "要读取的文件路径"
      }
    },
    "required": ["path"]
  }
}
```

## FAQ

假设有两个 Tool：

```bash
Tool A
name: search_code
description: 在项目源代码中搜索指定文本
schema: { query: string }

Tool B
name: read_file
description: 读取指定文件的内容
schema: { path: string }
```

用户说：

> **"找一下项目中哪里使用了 `useEffect`。"**

请回答：

1. LLM 为什么会倾向选择 `search_code`？

> 用户目标是"在项目中找"，LLM会结合Tool Definition的description字段进行选择，很明显search_code工具的描述更加匹配目标语义。

2. `description` 和 `schema` 在这个过程中分别起什么作用？

> description字段提供的语义帮助LLM选择正确的工具；schema帮助LLM正确的调用工具，例如使用正确的格式和参数。

3. 如果 LLM 最终产生了错误参数，谁负责阻止错误调用真正执行？

> Runtime提供的schema验证程序。如果参数错误，走错误处理流程，例如将错误信息回传LLM进行下一步推理。
