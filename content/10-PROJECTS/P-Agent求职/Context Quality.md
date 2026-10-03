---
title: Context Quality
date-created: 2026-10-03
date-modified: 2026-10-03
---

## 怎样评价Context质量？

可以通过五个维度：

```bash
Context Quality
│
├── Completeness  信息是否足够
├── Relevance     信息是否相关
├── Consistency   信息是否冲突
├── Freshness     信息是否过时
└── Reliability   信息是否可信
```

进一步抽象为行为模型：

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

- Context过长：超出LLM窗口限制，降低信噪比
	- [[Context过长会怎样？]]
	- [[Context Window用完之后会怎样？]]
- Context信息缺失：信息不足，不完整推理或者错误推理
	- [[Context缺少关键信息会发生什么？]]
	- [[Context中什么信息才算缺失？]]
- Context信息冲突：信息冲突，错误判断
	- [[Context中出现冲突信息会怎样？]]
	- [[Context中信息缺失和信息冲突有什么区别？]]
