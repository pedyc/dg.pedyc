---
title: SOP-从问题到图形的决策路径
tags: [sop, visualization, thinking-model]
date-created: 2025-12-18
date-modified: 2025-12-18
type: sop
up: "[[视觉思维]]"
---

## 🚀 SOP：从问题到图形的映射路径

### 💡 核心逻辑

不要为了画图而画图。画图的第一步是**诊断**你面对的信息具有什么**逻辑特征**。

### 1. 诊断你的 " 信息特征 " (The Diagnosis)

请对自己发问，你现在的核心痛点是什么？

#### Q1: 我关注的是 " 时间 " 或 " 步骤 " 吗？

- **特征**: 先后顺序、步骤、阶段、死板的流程。
- **判定**: [[线性思维]]
- **工具**:
		- 简单步骤 $\rightarrow$ **流程图 (Flowchart)**
		- 时间跨度 $\rightarrow$ **时间轴 (Timeline)**
		- 项目排期 $\rightarrow$ **甘特图 (Gantt)**

#### Q2: 我关注的是 " 包含关系 " 或 " 结构 " 吗？

- **特征**: 父子关系、分类、组成部分、拆解。
- **判定**: [[结构化思维]] (收敛)
- **工具**:
		- 发散/分类 $\rightarrow$ **思维导图 (Mind Map)**
		- 代码/组件结构 $\rightarrow$ **树状图 (Tree Diagram)**
		- 包含/交集 $\rightarrow$ **韦恩图 (Venn Diagram)**

#### Q3: 我关注的是 " 互为因果 " 或 " 循环 " 吗？

- **特征**: A 导致 B，B 反过来影响 A，没有明显的起点和终点。
- **判定**: [[系统思维]]
- **工具**:
		- 寻找根本解 $\rightarrow$ **因果回路图 (Causal Loop Diagram)**
		- 分析存量变化 $\rightarrow$ **系统动力学模型 (Stock & Flow)**

#### Q4: 我关注的是 " 对比 " 或 " 评价 " 吗？

- **特征**: 多个选项、优劣分析、权重。
- **判定**: [[批判性思维]] (收敛)
- **工具**:
		- 多维度对比 $\rightarrow$ **矩阵图 (Matrix)** / **雷达图**
		- 优劣分析 $\rightarrow$ **SWOT 分析图**
		- 决策打分 $\rightarrow$ **决策矩阵**

### 2. 快速速查表

![[思维分类及视觉工具.excalidraw]]

### 3. 前端开发实战映射

- **场景**: 分析 Event Loop 执行顺序
		- **路径**: 关注步骤 $\rightarrow$ 线性 $\rightarrow$ **序列图 (Sequence Diagram)**
- **场景**: 设计 Redux State 结构
		- **路径**: 关注组成 $\rightarrow$ 结构 $\rightarrow$ **思维导图/JSON 树**
- **场景**: 排查 " 内存泄漏 "
		- **路径**: 关注累积与释放 $\rightarrow$ 系统 $\rightarrow$ **浴缸模型 (存量流量图)**
