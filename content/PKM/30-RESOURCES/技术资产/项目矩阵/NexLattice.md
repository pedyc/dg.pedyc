---
topic: [前端开发]
uid: 202502252239
title: NexLattice
aliases: []
author: ped_yc
description: 
tags: []
date-created: 2025-02-25
date-modified: 2025-03-15
status: YCTODO
---

> [!hint]
> DeepSeek 的建议：https://chat.deepseek.com/a/chat/s/19ccca5f-3ea4-4c5b-81ab-ee732561746a

## 💬项目介绍

### 命名

- 灵感："Nexus"（连接点） + "Lattice"（晶格/网状结构）。
- 寓意: 通过网状关联增强知识的耦合度。

### 需求/功能

- 信息分片
- 语义分析
- 概念重组
- 可视化

### 技术选型

| 模块     | 技术选型                                                |
| ------ | --------------------------------------------------- |
| **分片** | Python + `spaCy`（按语义分割） + `LangChain`（文档分块）         |
| **分析** | `Hugging Face Transformers`（语义嵌入） + `DeepKE`（三元组抽取） |
| **存储** | Neo4j（存储知识图谱） + PostgreSQL（存储原始分片数据）                |
| **后端** | FastAPI（提供数据处理和检索接口）                                |
| **前端** | React + ECharts（数据展示） + Cytoscape.js（知识图谱交互）        |
| **部署** | Docker 容器化 + AWS EC2（服务器部署）                         |

## 📖分阶段学习路径

1. 第一阶段：基础开发能力

	- 学习 Python 和 JavaScript 语法，掌握 HTTP 接口和数据库基本操作。
	- 实践：用 Flask/[FastAPI](https://fastapi.tiangolo.com/zh/learn/) 搭建一个简单的文本上传和分片接口。

2. 第二阶段：NLP 与数据处理

	- 掌握 `spaCy`、`Transformers` 的文本处理流程。
	- 实践：对分片后的文本提取实体、关键词，并生成语义向量。

3. 第三阶段：知识重组与存储

	- 学习 Neo4j 的 Cypher 查询语言，设计知识图谱结构。
			s
	- 实践：将分析结果存入 Neo4j，实现简单的关联查询。

4. 第四阶段：可视化与交互

	- 学习 React 和 ECharts，实现数据图表和知识图谱渲染。
	- 实践：用 Cytoscape.js 展示 Neo4j 中的知识关联。

5. 第五阶段：系统整合与优化

	- 结合 Docker 封装前后端服务，部署到云服务器。
	- 优化分片算法和检索速度（如引入缓存、异步处理）。

## 🚧项目实施

### 目录结构

### 规范

### 分段实施
