---
title: ToolCalling的并发和依赖
date-created: 2026-09-27
date-modified: 2026-09-27
---

原则：

> **如果下一步推理依赖 Tool Result，就必须等待 Tool Result。**

但 Agent 不一定每次只能调用一个 Tool。

## 1. 没有依赖关系，可以并行

例如用户说：

> "检查 `package.json` 和 `tsconfig.json`。"

LLM 可能生成：

```text
Tool Call A: read_file("package.json")
Tool Call B: read_file("tsconfig.json")
```

两个操作互相不依赖：

```text
             ┌─ read_file(A) ─┐
LLM → Runtime                ├→ Results → Context → LLM
             └─ read_file(B) ─┘
```

Runtime 可以并行执行。

---

## 2. 存在依赖关系，就不能盲目并行

例如：

> "找到项目的入口文件，然后读取它。"

这里存在数据依赖：

```text
search_code("entry")
       ↓
得到 src/main.ts
       ↓
read_file("src/main.ts")
```

第二个 Tool Call 的参数依赖第一个 Tool Result。

所以：

```text
Tool A
 ↓ Result
LLM
 ↓
Tool B
```

不能一开始就让 Runtime 同时执行 A、B。

---

## 3. Runtime 为什么需要关心这个？

因为 **LLM 负责提出行动，Runtime 负责实际调度这些行动**。

因此 Runtime 不只是：

```text
Tool Call → execute()
```

还可能需要处理：

```text
Tool Call
   ↓
判断依赖关系
   ↓
判断是否可以并发
   ↓
执行
   ↓
收集 Tool Result
   ↓
更新 Context
```

这也是为什么 Agent Runtime 会逐渐变成一个**执行协调器（Orchestrator）**，而不仅仅是一个 Tool 调用器。

---

## FAQ

假设 LLM 产生三个 Tool Call：

```text
A = read_file("package.json")

B = read_file("tsconfig.json")

C = read_file(B.result.entryFile)
```

其中 `C` 依赖 `B` 的结果。

**问题：**

1. A、B、C 哪些可以并行？
2. Runtime 应该如何安排这三个 Tool Call？

> A、B 没有依赖关系，可以并行执行；C 依赖 B 的 Tool Result，因此必须等待 B 完成后才能执行。Runtime 收集这些执行结果并更新 Context，再交给 LLM 进行下一轮推理。
