---
uid: 202603121028
title: 自动化方案
description: 记录知识库自动化相关的想法和脚本
tags: [meta/附录]
status: cultivating
date-created: 2025-04-04
date-modified: 2026-03-12
related:
  - "[[00-本库指南]]"
---

## 本库自动化方案

### 笔记自动分类

- 方案：python 脚本调用大模型 AI 分析笔记归类
- 脚本：[[AutoNotesClassification.py]]

### 笔记自动归档

- 方案：采用 AHK（Auto Hot Key）脚本监听本库文件，根据元数据中的相关字段匹配文件存放目录
- 脚本：[[AutoNotesArchive.ahk]]
- 进阶方案：创建 Obsidian 插件，可视化配置规则
	- [ ] 👉[[2025Q2-完成Obsidian插件Obsidian-AutoFileOrganizer]]
