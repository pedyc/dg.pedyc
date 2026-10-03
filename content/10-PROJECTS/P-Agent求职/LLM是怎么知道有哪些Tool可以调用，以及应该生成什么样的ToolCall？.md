---
title: LLM是怎么知道有哪些Tool可以调用，以及应该生成什么样的ToolCall？
date-created: 2026-09-27
date-modified: 2026-10-03
---

## 背景

例如 Runtime 给 LLM 提供：

```json
{
  "name": "read_file",
  "description": "读取文件内容",
  "parameters": {
    "path": "string"
  }
}
```

用户说：「查看 `src/Login.tsx`。」

LLM 根据当前 Context 和 Tool 定义，产生类似的结构化输出：

```json
{
  "name": "read_file",
  "arguments": {
    "path": "src/Login.tsx"
  }
}
```

那么：

> 这个 Tool 定义是怎么进入 LLM 的 Context 的？

## 回答

> Runtime调用LLM时提供ToolDefinition，LLM推理时结合当前Context和ToolDefinition生成符合ToolCalling协议的ToolCall，Runtime根据机制（Policy、Permission）执行或取消工具执行，ToolResult回传给LLM进行下一步推理

---

## 解释

Tool 定义通常不是以「普通文本」被塞进 LLM 的 Context，而是由 Agent Runtime / 模型 API 按 [[ToolCalling协议]]作为结构化的 `tools` 参数提供给模型。

以一次请求为例。

### 1. Runtime 先准备 Tool Definition

例如 Runtime 有一个 `read_file`：

```json
{
  "name": "read_file",
  "description": "读取指定文件内容",
  "parameters": {
    "type": "object",
    "properties": {
      "path": {
        "type": "string",
        "description": "文件路径"
      }
    },
    "required": ["path"]
  }
}
```

它告诉 LLM：

> 你现在拥有一个叫 `read_file` 的能力，它需要一个 `path` 参数。

---

### 2. Runtime 调用 LLM 时提供 Tool Definition

概念上可以理解成：

```text
Runtime
   │
   ├── messages / Context
   │
   └── tools
         └── read_file(…)
              ↓
             LLM
```

例如请求可以抽象成：

```json
{
  "messages": [
    {
      "role": "user",
      "content": "查看 src/Login.tsx"
    }
  ],
  "tools": [
    {
      "name": "read_file",
      "description": "读取指定文件内容",
      "parameters": {
        "type": "object",
        "properties": {
          "path": {
            "type": "string"
          }
        },
        "required": ["path"]
      }
    }
  ]
}
```

所以模型同时获得两类信息：

```text
Context
├── 用户说了什么
├── 之前发生了什么
├── Tool 执行结果
└── …

Tools
├── read_file
├── write_file
├── run_command
└── …
```

**具体 API 是否把 tools 与 messages 分成独立字段，取决于模型/API协议；概念上可以把它理解为"模型本轮可用的工具集合"。**

---

### 3. LLM 根据 Tool Definition 生成 Tool Call

现在 LLM 看到：

```text
用户：
查看 src/Login.tsx

可用 Tool：
read_file(path)
```

于是它可以产生：

```json
{
  "name": "read_file",
  "arguments": {
    "path": "src/Login.tsx"
  }
}
```

这就是我们刚才说的 **Tool Call**。

注意一个非常重要的关系：

```text
Tool Definition
      ↓
告诉 LLM “有哪些能力、怎么调用”
      ↓
LLM 推理
      ↓
Tool Call
      ↓
Runtime
      ↓
实际执行 Tool
```

---

### 4. 那 Tool Definition 是谁决定的？

这就回到了 **Runtime**。

例如一个 Coding Agent：

```text
Agent Runtime
│
├── 注册 read_file
├── 注册 write_file
├── 注册 run_command
│
└── 本轮把可用 Tool Definitions 提供给 LLM
```

因此不是：

```text
LLM 自己发现电脑上有 read_file
```

而是：

```text
Runtime
  ↓
告诉 LLM：
“你现在可以使用这些 Tools”
  ↓
LLM
  ↓
选择其中一个
  ↓
生成 Tool Call
```

这实际上进一步体现了你前面总结的那句话：

> **LLM 决定调用什么，Runtime 决定工具如何进入执行系统。**

---

### 5. 还有一个关键问题

假设 Runtime 提供：

```text
read_file
write_file
delete_file
run_command
```

LLM 就一定可以调用 `delete_file` 吗？

**从"知道这个 Tool 存在"来说，是的；但从"实际能够执行"来说，不一定。**

Runtime 仍然可以：

```text
LLM
 ↓
Tool Call: delete_file
 ↓
Runtime
 ↓
Policy / Permission
 ↓
拒绝
```

所以：

> **Tool Definition 是"可用能力的声明"，不是"无条件执行权限"。**
