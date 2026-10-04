---
title: ContextEngineering和RAG是什么关系？
date-created: 2026-10-03
date-modified: 2026-10-03
content-type: [question]
up: ["[[Context Engineering]]"]
---

## 问题

Context Engineering 和 RAG 是什么关系？

## 回答

一句话先说清：

> **RAG 是 Context Engineering 的一种手段，不是它的全部。**
> Context Engineering 管的是"整个上下文怎么组织"，RAG 管的是"怎么从外部找信息补进来"。

---

### 1. 两者目标不同

| 维度 | Context Engineering | RAG |
|---|---|---|
| 目标 | 让 Context 最新、相关、无冲突、不超限 | 从外部知识库检索相关信息 |
| 范围 | 整个上下文生命周期 | 信息检索与注入 |
| 关注点 | 放什么、怎么放、何时更新、如何压缩 | 找什么、怎么找、找多少 |
| 层级 | 更高层的方法论 | 其中的一个子系统 |

**结论：**

> Context Engineering 是"总设计"，RAG 是"找资料"。

---

### 2. RAG 解决的是"缺失"问题

RAG 最典型的用途是：

- 模型不知道 → 去知识库检索
- 上下文没有 → 从外部补进来
- 信息过期 → 检索最新版本

也就是说，RAG 主要处理的是：

> **Context 中信息缺失。**

但它不负责：

- 冲突裁决
- 优先级排序
- 历史压缩
- 窗口管理
- 状态更新

这些都属于 Context Engineering。

---

### 3. Context Engineering 包含但不限于 RAG

一个完整的 Context 至少包括：

```text
System / Role
Task
Constraints
State
Facts
History
Tool Results
Retrieved Knowledge   ← RAG 主要作用在这里
```

RAG 只负责其中"Retrieved Knowledge"这一层。

而 Context Engineering 还要管：

- 这些信息如何分层
- 哪些保留、哪些压缩
- 冲突怎么处理
- 何时更新
- 如何避免超限

**结论：**

> RAG 是 Context Engineering 的一个子集。

---

### 4. 两者是互补关系

| 场景 | RAG 能解决 | Context Engineering 能解决 |
|---|---|---|
| 知识不在模型里 | ✅ | 决定是否检索、检索后怎么放 |
| 信息过期 | ✅ | 标注时效、移除旧版 |
| 信息冲突 | ❌ | ✅ |
| 上下文超限 | ❌ | ✅ |
| 多轮状态更新 | ❌ | ✅ |
| 历史压缩 | ❌ | ✅ |
| 优先级排序 | ❌ | ✅ |

**结论：**

> RAG 负责"找得到"，Context Engineering 负责"用得好"。

---

### 5. 只有 RAG 不够，只有 Context Engineering 也不够

**只有 RAG，没有 Context Engineering：**

- 检索回来一堆内容，全塞进去
- 冲突、过期、重复无人处理
- 窗口很快爆掉

**只有 Context Engineering，没有 RAG：**

- 外部知识进不来
- 模型只能靠已有上下文
- 遇到知识盲区仍然会脑补

**结论：**

> 两者不是替代关系，而是协作关系。

---

### 6. 一个类比

把 LLM 比作一个正在做题的学生：

- **RAG** = 去图书馆查资料
- **Context Engineering** = 决定带哪些书进考场、怎么摆、先看哪本、什么时候换

查资料很重要，但带什么、怎么用更重要。

---

### 7. 总结

| 问题 | 答案 |
|---|---|
| RAG 是 Context Engineering 的一部分吗？ | 是，是其中"检索注入"环节 |
| Context Engineering 等于 RAG 吗？ | 不等于，范围更大 |
| 两者关系 | 互补，RAG 管找，CE 管用 |
| 只做 RAG 够吗？ | 不够 |
| 只做 CE 够吗？ | 也不够 |

一句话：

> **RAG 解决"信息从哪来"，Context Engineering 解决"信息怎么用"。**
