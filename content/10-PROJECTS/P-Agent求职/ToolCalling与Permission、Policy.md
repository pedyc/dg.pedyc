---
title: ToolCalling与Permission、Policy
date-created: 2026-09-27
date-modified: 2026-09-27
---

假设 LLM 产生：

```text
Tool Call:
run_command("git reset --hard")
```

这个 Tool Call：

- Tool 名称存在 ✅
- 参数是字符串 ✅
- Schema 合法 ✅

但是 Runtime 可能还有：

```text
Policy:
forbiddenCommands:
  - git reset --hard
```

于是：

```text
LLM
 ↓
Tool Call
 ↓
Schema Validation ✅
 ↓
Permission / Policy ❌
 ↓
拒绝执行
 ↓
Tool Result / Error
 ↓
Context
 ↓
LLM
```

这里最重要的区别是：

> **Schema 解决"能不能正确调用"，Permission / Policy 解决"允不允许调用"。**

## FAQ

如果 LLM 发出：

```text
run_command("git reset --hard")
```

并且这个 Tool Call **Schema 完全合法**，但 Policy 禁止这个命令。

**Runtime 应该：**

A. 执行，因为 Schema 已经通过
B. 拒绝执行，并把拒绝信息返回给 LLM
C. 让 LLM 自己决定是否执行

为什么？

> B。Runtime不仅应该校验Scehma合法，还应该校验Policy合法，两者只要一个没通过就禁止执行
