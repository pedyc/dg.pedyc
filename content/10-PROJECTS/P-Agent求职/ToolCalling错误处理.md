---
title: ToolCalling错误处理
date-created: 2026-09-27
date-modified: 2026-09-27
---

考虑一个情况：

```text
LLM
 ↓
Tool Call: read_file("foo.ts")
 ↓
Runtime
 ↓
Tool
 ↓
❌ File not found
```

这时候 Runtime **不能假装 Tool 成功了**，而应该把失败信息作为 Tool Result 返回给 LLM，例如：

```json
{
  "status": "error",
  "error": "File not found: foo.ts"
}
```

然后 LLM 才能决定下一步：

```text
File not found
      ↓
LLM 分析
      ↓
可能是路径错误
      ↓
search_code(…)
      ↓
获得正确路径
      ↓
read_file(…)
```

所以这里有一个非常重要的原则：

> **Tool Failure 本身也是 Agent 下一轮推理的输入。**

## FAQ

假设：

```text
Tool Call: run_command("npm test")
```

Runtime 执行后得到：

```text
exit code = 1
error = "3 tests failed"
```

此时 LLM 说：

> "测试执行失败了，我再运行一次 npm test。"

**Runtime 应该直接允许它重试，还是应该先做一些判断？为什么？**

> 先做一些判断。LLM的下一步推理应该包含Tool Failure的信息,并且Runtime不应该无条件执行LLM的Retry，而应该在执行边界重新进行验证。

例如：

```text
npm test
  ↓
exit code = 1
  ↓
Tool Result
  ↓
Context
  ↓
LLM
  ↓
Retry npm test
  ↓
Runtime
  ├─ Permission
  ├─ Policy
  ├─ Retry Limit
  └─ Execution
```

为什么要判断？

因为不判断 Agent 可能陷入：

```text
npm test → 失败
    ↓
LLM → 再次 npm test
    ↓
失败
    ↓
LLM → 再次 npm test
    ↓
失败
    ↓
无限循环
```

所以这里可以形成一个很重要的 Runtime 原则：

> **LLM 决定"下一步想做什么"，Runtime 决定"这个动作是否允许以及是否应该继续执行"。**

这和 **"3 次连续失败 → Failure → handleFailure"** 是同一个思想。

---

### 继续一个问题

现在假设：

```text
Tool: npm test
Result: exit code = 1

LLM:
“测试失败，应该是代码问题，我修改 src/Button.tsx 后重新测试。”
```

Runtime 收到两个 Tool Call：

```text
edit_file("src/Button.tsx")
run_command("npm test")
```

**这两个 Tool Call 能不能并行执行？为什么？**

> 不能。npm test 命令要在修改文件之后执行，即 run_command 依赖 edit_file。
