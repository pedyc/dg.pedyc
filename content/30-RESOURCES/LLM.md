---
uid: 202504250000
title: LLM
aliases:
  - C-LLM
  - 大型语言模型
description: 基于 Transformer 架构的海量文本预训练模型，能够理解和生成人类语言
tags:
  - concept
  - AI
  - LLM
  - NLP
date-created: 2025-04-25
date-modified: 2026-09-27
status: active
content-type: concept
related: ["[[Agent]]", "[[人工智能]]", "[[提示词工程]]"]
---

## 概念：LLM

> 大型语言模型（Large Language Model，LLM）是指具有数十亿参数的深度学习模型，通过在海量文本数据上进行预训练，学习语言的模式和结构，能够执行各种自然语言处理任务。

**解决的核心痛点**：传统 NLP 任务需要针对每个任务训练专属模型，LLM 通过预训练 + 泛化能力，实现一个模型处理多种任务，大幅降低 AI 应用门槛。

### 核心命题

- LLM 的本质是「规模涌现」—— 当模型参数达到一定量级时，会涌现出在小模型中不存在的推理能力
- LLM 是「世界知识的压缩器」—— 通过预训练将海量文本中的知识压缩到模型权重中
- LLM 的能力边界取决于「预训练数据的多样性和质量」，而非单纯的参数规模
- LLM是神经符号主义的极佳实践范例

### 核心概念

- Transformer：LLM基础架构，自注意力机制捕捉长距离依赖
- 预训练：学习语言模式，Next Token Prediction
- 微调：任务适应，SFT、RLHF、DPO等方法
- ToolCalling：工具调用请求

### 核心职责

> LLM本质上是通过当前上下文产生下一步输出

### 关键区别

| LLM          | Runtime   |
| ------------ | --------- |
| 理解任务         | 执行任务      |
| 推理           | 控制执行      |
| 决定下一步        | 决定是否允许执行  |
| 生成 Tool Call | 实际调用 Tool |
| 产生语义结果       | 观察真实环境    |
| 可能犯错         | 提供执行结果    |

## 知识图谱

- **父级概念**：[[人工智能]] — LLM 是深度学习在 NLP 领域的重大突破
- **子级概念**：
	- [[Agent]] — LLM 作为 Agent 的推理引擎
	- [[RAG]] — 检索增强生成，扩展 LLM 知识边界
	- [[提示词工程]] — 激发 LLM 能力的工程技术
	- [[上下文窗口]] — LLM 的令牌处理能力上限
	- [[温度]] — 控制 LLM 输出随机性的采样参数
	- [[Top-P]] — 动态截断采样的解码策略
	- [[大模型缓存命中率]] — 一般来说缓存命中率越高，成本越低
- **并列概念**：
	- CV 模型 — 计算机视觉模型（如 ResNet、VIT）
	- 多模态模型 — 融合文本、图像、音频的模型
- **相关概念**：
	- [[Harness]] — 基于 LLM 的工程化框架

## 参考延伸

- [Attention Is All You Need - Transformer 原始论文](https://arxiv.org/abs/1706.03762)
- [GPT-4 Technical Report](https://arxiv.org/abs/2303.08774)
- [Anthropic - Understanding LLMs](https://docs.anthropic.com/)
