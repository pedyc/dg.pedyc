---
title: ContextEngineering和PromptEngineering 有什么区别？
date-created: 2026-10-03
date-modified: 2026-10-03
content-type: [question]
up: ["[[Context Engineering]]"]
---

## 问题

Context Engineering 和 Prompt Engineering 有什么区别？

## 回答

一句话先说清：

> **Prompt Engineering 管的是"怎么说"，Context Engineering 管的是"给什么"。**
> Prompt 是 Context 的一部分，但 Context 远不止 Prompt。

---

### 1. 两者关注点不同

| 维度 | Prompt Engineering | Context Engineering |
|---|---|---|
| 关注点 | 指令的措辞与结构 | 整个上下文的内容与组织 |
| 核心问题 | 怎么说，模型才听得懂 | 给什么，模型才做得好 |
| 作用范围 | 单次输入文本 | 多轮、多来源、动态上下文 |
| 时间尺度 | 相对静态 | 动态更新 |
| 主要对象 | 用户指令、系统提示 | 指令 + 状态 + 事实 + 历史 + 工具结果 |

**结论：**

> Prompt Engineering 是"表达层"，Context Engineering 是"信息层"。

---

### 2. Prompt Engineering 解决什么？

它主要解决：

- 指令是否清晰
- 角色是否明确
- 输出格式是否规范
- 示例是否充分
- 约束是否写清楚

例如：

```text
你是一个资深前端工程师。
请用 TypeScript 修复以下 Bug。
只输出 diff，不要解释。
```

这属于 Prompt Engineering。

---

### 3. Context Engineering 解决什么？

它主要解决：

- 模型是否知道当前项目状态
- 关键事实是否齐全
- 信息是否过期
- 是否存在冲突
- 上下文是否超限
- 多轮循环中如何更新
- 工具结果如何压缩与保留

例如：

- 当前文件位置
- 报错日志
- 已尝试过的方案
- 项目约束
- 测试结果

这些都属于 Context Engineering。

---

### 4. 两者的层级关系

```text
Context Engineering
├── Prompt / System Instruction
├── Task
├── Constraints
├── State
├── Facts
├── History
├── Tool Results
└── Retrieved Knowledge
```

Prompt 只是 Context 中的一层。

**结论：**

> Prompt Engineering ⊂ Context Engineering。

---

### 5. 只做 Prompt Engineering 会怎样？

如果只优化 Prompt，但 Context 有问题：

- 指令再清晰，模型也不知道项目状态
- 格式再规范，关键事实仍然缺失
- 角色再明确，冲突信息仍然存在
- 示例再充分，上下文仍然会超限

**结果：**

> Prompt 很漂亮，但模型仍然做错。

---

### 6. 只做 Context Engineering 会怎样？

如果 Context 很全，但 Prompt 很糟：

- 模型不知道要做什么
- 输出格式混乱
- 角色不清
- 约束表达模糊

**结果：**

> 信息很全，但模型用不好。

---

### 7. 两者是互补关系

| 问题 | Prompt Engineering | Context Engineering |
|---|---|---|
| 指令不清 | ✅ | ❌ |
| 输出格式乱 | ✅ | ❌ |
| 角色不明确 | ✅ | ❌ |
| 缺少项目状态 | ❌ | ✅ |
| 信息过期 | ❌ | ✅ |
| 信息冲突 | ❌ | ✅ |
| 上下文超限 | ❌ | ✅ |
| 多轮状态更新 | ❌ | ✅ |

**结论：**

> Prompt 决定"模型怎么理解任务"，Context 决定"模型基于什么做任务"。

---

### 8. 一个类比

把 LLM 比作一个员工：

- **Prompt Engineering** = 怎么给他下指令
- **Context Engineering** = 给他哪些资料、数据、背景、历史

指令再清楚，资料不全，他也会做错。
资料再全，指令不清，他也不知道要干什么。

---

### 9. 总结

| 问题 | 答案 |
|---|---|
| Prompt 是 Context 的一部分吗？ | 是 |
| Context Engineering 等于 Prompt Engineering 吗？ | 不等于，范围更大 |
| Prompt Engineering 管什么？ | 怎么说 |
| Context Engineering 管什么？ | 给什么、怎么组织、何时更新 |
| 两者关系 | 互补，Prompt 是 Context 的一层 |

一句话：

> **Prompt Engineering 让模型"听懂"，Context Engineering 让模型"做对"。**
