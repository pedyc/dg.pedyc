---
title: Claude Code 注意事项
date-created: 2026-03-03
date-modified: 2026-03-15
content-type: concept
---

**上下文**
- Claude 的上下文窗口会保存会话历史、文件内容、命令输出、`CLAUDE.md` 文件内容和系统说明。当 Claude 运行时，上下文填满，Claude 会自动压缩，所以会话早期的内容可能丢失。==将持久规则放在 `CLAUDE.md` 文件中，并运行 `/context` 命令查看上下文。==

**Skills & Subagents**
- Skills 按需加载（Claude 在会话开始时看到 skill 描述，但完整内容仅在 skill 使用时加载）。对于手动调用的 skills，设置 `disable-model-invocation: true` 将描述内容保留在上下文之外，直到需要它们。
- Subagents 拥有自己的新上下文，完全独立于主会话，它们的工作不会膨胀主会话的上下文。Subagents 完成后返回摘要。所以在长会话中使用 Subagents 是有益的。

**检查点**
- ==使用 Claude 对每个文件进行的编辑都是可逆的。在 Claude 编辑任何文件前，会对当前内容进行快照。如果出现问题，按两次 `Esc` 键可以回退到之前的状态，或者要求 Claude 撤销更改。==

**持久化**
- 除了 `CLAUDE.md` 文件外，也可以在 `.claude/settings.json` 中允许特定命令（全局），以便 Claude 不会每次运行命令时都询问，这对于受信任的命令（如 `npm test` 或 `git status`）很有用。

**帮助**
- 可以向 Claude 提出问题，如 " 应该如何设置 hooks?" 或 " 构建 CLAUDE.md 的最佳方式是什么？" Claude 会给出建议。

## 参考

- [[Claude Code 如何工作]]
