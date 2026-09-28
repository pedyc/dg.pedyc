---
title: ToolCalling为什么需要结构化输出？
date-created: 2026-09-27
date-modified: 2026-09-27
---

## 背景

为什么ToolCalling需要结构化输出？直接使用LLM生成的自然语言不行吗？

## 回答

Runtime 需要能够可靠地解析 LLM 的输出，并据此找到 Tool、提取参数、执行调用。

## 解释

### 1. 如果 LLM 只输出自然语言

例如：

```text
我需要读取 package.json 文件，请帮我读取一下。
```

Runtime 很难可靠判断：

```text
Tool 是谁？
参数是什么？
path 是 package.json 吗？
这到底是 Tool Call，还是普通回答？
```

LLM 甚至可能说：

```text
好的，我已经读取了 package.json。
```

但它实际上没有产生任何可执行的调用请求。

---

### 2. 结构化 Tool Call

如果约定：

```json
{
  "name": "read_file",
  "arguments": {
    "path": "package.json"
  }
}
```

Runtime 就可以明确知道：

```text
name
  ↓
read_file

arguments
  ↓
path = package.json
```

然后：

```text
Runtime
 ↓
找到 read_file
 ↓
验证 arguments
 ↓
执行
```

因此结构化输出实际上建立了一个**机器可处理的协议边界**：

```text
LLM
 │
 │ 结构化 Tool Call
 ↓
Runtime
```

---

### 3. Schema 在这里有什么作用？

假设 `read_file` 的定义规定：

```json
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

那么：

```json
{
  "path": "package.json"
}
```

符合 Schema。

但：

```json
{
  "file": "package.json"
}
```

就不符合要求，因为缺少 `path`。

因此 Tool Definition 中的 Schema 不只是给 LLM 看，也可以帮助 Runtime：

```text
Tool Definition
      │
      ├── description → 帮助 LLM 理解能力
      │
      └── schema → 约束 Tool Call 参数
```

不过要注意：

> **Schema 验证参数合法，不等于证明这个操作应该被允许。**

例如：

```json
{
  "path": "/etc/passwd"
}
```

它可能完全符合：

```text
path: string
```

但 Runtime 仍然可以根据权限 / Policy 拒绝它。

所以又形成了一层区分：

```text
Tool Call
   ↓
Schema Validation
   ↓
参数格式是否正确？
   ↓
Permission / Policy
   ↓
是否允许执行？
   ↓
Tool Execution
```

---

### 4. 这对 Agent Runtime 很重要

你现在可以看到 Runtime 并不是简单的：

```text
ToolCall → Tool()
```

而更接近：

```text
ToolCall
   ↓
解析
   ↓
Schema Validation
   ↓
Permission / Policy
   ↓
Tool Execution
   ↓
捕获 Result / Error
   ↓
返回给 LLM
```

这其实已经开始和你之前学习的 **Agent Runtime 控制 AgentLoop** 联系起来了。
