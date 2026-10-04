---
title: Context Quality
date-created: 2026-10-03
date-modified: 2026-10-03
up: ["[[Context Engineering]]"]
---

## 怎样评价Context质量？

可以通过五个质量维度：

```bash
Context Quality
│
├── Relevance          相关性，信息是否相关
├── Sufficient         充足性，信息是否足够
├── Consistency        一致性，信息是否冲突
├── Freshness          时效性，信息是否过时
├── Signal-to-Noise    信噪比，有效信息占比
├── Structure&Locality 结构化与可定位性，关键信息能否被有效检索
└── Task Alignment     任务对齐度，是否服务于当前阶段
```

进一步抽象为观测指标：

```bash
                                Context Quality
                                       │
       ┌───────────────┼────────── ─┐
       ↓                              ↓                       ↓
   Too Long                          Missing                Conflicting
       ↓                              ↓                       ↓
    噪声增加                        信息不足                 判断冲突
       └───────────────┼────────── ─┘
                                       ↓
                                 Agent Behavior
```

## 可能产生质量问题的3个因素

- **Context过长**：超出LLM窗口限制，降低信噪比
	- [[Context过长会怎样？]]
	- [[Context Window用完之后会怎样？]]
	- [[Context太长时应该优先压缩哪一部分？]]
- **Context缺失关键信息**：信息不足，不完整推理或者错误推理
	- [[Context缺少关键信息会发生什么？]]
	- [[Context中什么信息才算缺失？]]
	- [[如果Context缺失信息应该怎么办？]]
	- [[关键信息应该怎样放入Context？]]
	- [[压缩Context时怎样避免丢失关键信息？]]
- **Context信息冲突**：信息冲突，错误判断
	- [[Context中出现冲突信息会怎样？]]
	- [[LLM如何理解Context？为什么冲突信息会让Agent决策失灵？]]
	- [[Context中信息缺失和信息冲突有什么区别？]]
- **总结**
	- [[如何设计一个Context更新策略？]]

## SOP

- [[构建高质量上下文|SOP-Context质量标准]]
