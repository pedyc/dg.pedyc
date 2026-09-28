先看最简单的情况：

```bash
LLM
 ↓
Tool Call
 ↓
Runtime
 ↓
read_file()
 ↓
立即返回结果
 ↓
LLM
```

`read_file` 通常很快，可以看成一次同步调用。

但很多 Agent Tool 并不是这样。

例如：

```bash
run_command("npm test")
```

可能需要几十秒甚至几分钟。

或者：

```bash
deploy()
```

可能需要等待远程服务完成。

甚至：

```bash
ask_user_confirmation()
```

需要**等待用户做决定**。

于是 Tool Calling 可能变成：

```bash
LLM
 ↓
Tool Call
 ↓
Runtime
 ↓
Tool 执行
 ↓
等待……
 ↓
Tool Result
 ↓
LLM
```

这里就出现一个重要概念：

> **LLM 发起 Tool Call 后，并不意味着 Runtime 可以立即得到 Tool Result。**

Runtime 需要处理 Tool 的生命周期：

```bash
Tool Call
   ↓
Pending
   ↓
Running
   ↓
Success / Failure
   ↓
Tool Result
```

例如执行测试：

```bash
LLM
 ↓
run_command("npm test")
 ↓
Runtime
 ↓
Running
 ↓
……
 ↓
exit code = 1
 ↓
Failure
 ↓
Tool Result
 ↓
LLM
```

那么，假设 LLM 发起：

```bash
Tool Call:
deploy()
```

Runtime 调用部署服务后，需要等待 30 秒。

**在这 30 秒里，LLM 应该继续推理吗？为什么？**

不应该，

在 `deploy()` 等异步 Tool 中：

```text
LLM
 ↓ Tool Call: deploy()
Runtime
 ↓
Tool: deploy
 ↓
Running…
 ↓ 30s
Tool Result
 ↓
Context 更新
 ↓
LLM 下一轮推理
```

如果部署还没结束，LLM 就提前基于"部署结果未知"的状态继续推理，那么它实际上是在**缺少关键环境信息的情况下做决策**。

**Tool Result 不只是给 LLM 提供数据，而是在 Agent Loop 中完成一次"环境状态更新"。**

所以可以记住：

> **LLM 决策 → Tool Call → Runtime 执行 → 等待结果 → Context 更新 → LLM 再决策**

### 一个重要的补充

"LLM 不能继续推理"并不是说**任何情况下都不能并行**。

如果存在两个互不依赖的 Tool Call：

```text
LLM
 ├─ read_file(A)
 └─ read_file(B)
```

Runtime 可以并行执行它们。

但如果：

```text
deploy()
   ↓
根据部署结果决定下一步
```

那么下一轮推理就必须等待 `deploy()` 的结果。

因此真正的原则是：

> **依赖某个 Tool Result 的推理，必须等待该 Result；无依赖的工作可以并行。**

这也开始涉及 Agent Runtime 中的一个重要能力：**Tool 的生命周期管理与并发控制**。