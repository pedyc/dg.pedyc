---
name: content-evaluator-local
version: 1.0.0
description: |
  评估笔记在知识库中的健康度和地位，对接 llm-wiki-schema.md 的 lint 工作流。
  识别孤立/过时笔记，提供 status 流转建议。
  触发条件：用户要求评估笔记健康度、检查孤立笔记、或执行知识库健康检查。
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
---

# content-evaluator-local — 知识库健康度评估

> 适配本库的 llm-wiki-schema.md lint 工作流。

## 前置检查

1. 确认知识库根目录：`content/`
2. 读取 `content/00-META/llm-wiki-schema.md` 获取 lint 检查清单
3. 读取 `content/00-META/wiki-index.md` 了解知识库结构

## 评估维度

### 1. 矛盾检测

检查同一主题的多个页面是否有互相矛盾的说法：

- 搜索同一概念的多个笔记（atomic、concept）
- 标注矛盾点及来源页面
- 建议保留哪个版本

### 2. 孤儿页面

检查没有 inbound link 的页面：

- 孤立 concept/moc/area
- 建议补充引用或归档

### 3. 概念缺口

识别被多次提及但无专属页面的概念：

- 扫描 atomic 中高频概念
- 建议创建新 concept

### 4. 过时断言

检查被新知识 supersede 的断言：

- 检查 status=archived 的笔记
- 标记对应 wiki 页面中的过时内容

### 5. 索引一致性

检查 `wiki-index.md` 与实际页面是否一致：

- 列出缺失的条目
- 列出不存在的条目

## 输出格式

```
知识库健康度评估报告

检查范围：{N} 页

## 矛盾检测
- [[页面A]] vs [[页面B]]: {描述}

## 孤儿页面
- [[页面C]]: 无 inbound link

## 概念缺口
- "{概念}" 被提及 N 次，建议创建 [[C-xxx]]

## 过时断言
- [[页面D]] 的 {断言} 已被 supersede

## 索引不一致
- {问题}

## 建议
- {具体行动建议}
```