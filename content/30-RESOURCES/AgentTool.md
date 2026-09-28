---
title: AgentTool
date-created: 2026-09-27
date-modified: 2026-09-27
---

## 什么是AgentTool？

在 Agent 中，Tool 可以理解为：「Agent 可以调用的、能够与外部环境产生实际交互的能力。」

例如在Coding Agent中：

```bash
read_file
write_file
edit_file
run_command
search_code
```

这些都是tool。

## 为什么需要AgentTool？

LLM本身不能直接知道外部环境中的信息，例如：

```bash
当前项目有哪些文件？
某个文件现在是什么内容？
npm test 是否通过？
Git 当前有什么修改？
```

因此需要Tool担当的是 **Agent 与外部环境之间的接口**。

## AgentTool应该包含哪些部分？

> 从工程角度看，Tool不只是函数，一个Tool通常至少包含「定义」和「实现」

### Tool Definition

告诉Agent有什么能力，怎么调用。

例如：

```JSON
{
  "name": "read_file",
  "description": "读取文件内容",
  "inputSchema": {
    "type": "object",
    "properties": {
      "path": {
        "type": "string"
      }
    },
    "required": ["path"]
  }
}
```

### Tool Implementation

真正执行这个能力。

例如：

```ts
async function readFile(path: string) {
  return fs.readFile(path, "utf-8");
}
```

## AgentTool怎么使用？

```bash
LLM
 ↓
选择 Tool
 ↓
生成 Tool Call
 ↓
Runtime
 ↓
执行 Tool
 ↓
Environment
```

其中：「Tool 是能力，Tool Call 是对能力的一次调用请求。」

## 关联

- [[Agent]]
- [[ToolCalling]]
