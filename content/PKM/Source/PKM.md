---
title: PKM
uid: 202408181751
aliases: [个人知识管理, Personal Knowledge Manager]
author: ped_yc
description: 
tags: [PKM]
date-created: 2024-08-18
date-modified: 2025-02-14
status: 
type: [概念]
---

⬆[[数字花园]]

## 概述

[[Source/_resources/知识管理/7d25f1ed57357410442f092da56e29cc_MD5.jpeg|知识管理流程.png]]
![[Source/_resources/知识管理/7d25f1ed57357410442f092da56e29cc_MD5.jpeg]]

" 知识管理 " 一词最早起源于工商管理领域，其目的是应用管理学知识使得企业更加高效的运转。本文讨论的是 " 个人知识管理 "，核心在于统筹自己的知识，让我们对自己的知识有更深更全的把握，让我们能够更加系统性的分析自己的能力构成，加强我们希望加强的部分。

知识管理的工作流可见 [[» 播客笔记工作流]] 如下：

> 略读/订阅 --> 稍后读/AI 总结 --> 笔记 --> 存储

## 方法论/我的 PKM 方案

### 信息收集（略读/订阅）

- 概念：通过高质量 [[信息源]] 来收集优质信息，收集工具要求 " 足够快 "
- 方法：<mark class="hltr-red">简悦 +RSS</mark>方案，实现本地和云端的双向同步，因为本地化，所以可以非常快
- 工具：
	- 简悦：浏览器插件，阅读优化、本地导出
	- [[RSS]]：RSSHub Radar + Inoreader/Tidyread/Readwise
- 我的方案：

### 信息筛选（稍后读/AI 总结）

- 概念：将收集的信息通过个人需求进行筛选，转化为 [[永久笔记]]，可以定制 [[标准化内容]]，对信息格式进行定制输出，便于信息整理
- 方法：RSS + AI 方案，通过 <mark class="hltr-red">Tidyread</mark> 实现内容噪声过滤
- 工具：
	- [[Tidyread]]：浏览器扩展，通过 AI 来对订阅源内容进行解构分析，便于提取信息
	- Obsidian-Linter：obsidian 插件，用于 markdonw 格式化，产出标准化内容
	- 简悦 AI 插件：输出文章简介、主要内容
	- Obsidian AI 插件：输出文章简介、主要内容
- 我的方案：

### 信息提炼（笔记）

- 概念：将筛选后的信息进一步提炼，转化为适合个人的、利于吸收的知识
- 方法：
	- 精读 + AI 辅助（ 解构 + 提炼）+ 笔记
- 工具：
	- Tidyread：AI 解构 + 提炼，不能做笔记
	- 简悦稍后读：高亮 + 笔记，可以做笔记，体验一般
	- Follow：开源 RSS 阅读器，不能做笔记
- 我的方案：

### 信息管理（存储）

- 概念：将知识以一定方式组织起来，关注的知识的管理成本和检索成本，一般而言，管理成本和检索成本成反比，本库使用 <mark class="hltr-red">ACCESS 笔记组织法</mark>
- 方法：
	- [[PARA笔记组织法]]
	- [[卢曼卡片盒笔记法]]
	- [[ACCESS笔记组织法]]
- 工具：
	- Obsidian
	- 坚果云
- 我的方案：

### 分享

## 一些 PKM 方案

- Zettelkasten
- 第二大脑
- GTD
- Mind Mapping
- Personal Wiki
- Evergreen Notes
- Notion-based PKM
- Roam Research
- Obsidian
- 日记法

## 我的方案

<mark class="hltr-red">简悦/RSS + Obsidian + 坚果云</mark>

1. 信息收集：发现并寻找优质信息源
2. 信息筛选：对信息进行略读，决定是否加入稍后读（简悦 +Tidyread）
3. 信息提炼：对收集信息进行提炼，AI 总结 + 笔记（简悦 +Tidyread）
4. 信息管理：通过 ACCESS 笔记组织法管理信息（Obsidian+ 坚果云）

## 参考文章

- [PKMer_Echo 的卡片盒笔记法工作流程及 Obsidian 实践](https://pkmer.cn/Pkmer-Docs/02-%E7%9F%A5%E8%AF%86%E7%AE%A1%E7%90%86%E5%9F%BA%E7%A1%80/%E7%9F%A5%E8%AF%86%E7%AE%A1%E7%90%86%E5%9C%86%E6%A1%8C%E8%AE%A8%E8%AE%BA/echo/echo%E7%9A%84%E5%8D%A1%E7%89%87%E7%9B%92%E7%AC%94%E8%AE%B0%E6%B3%95%E5%B7%A5%E4%BD%9C%E6%B5%81%E7%A8%8B%E5%8F%8Aobsidian%E5%AE%9E%E8%B7%B5/)
- [PKMer_个人知识管理 - 简化生活的终极指南](https://pkmer.cn/Pkmer-Docs/02-%E7%9F%A5%E8%AF%86%E7%AE%A1%E7%90%86%E5%9F%BA%E7%A1%80/para%E4%BF%A1%E6%81%AF%E7%BB%84%E7%BB%87%E6%B3%95/%E4%B8%AA%E4%BA%BA%E7%9F%A5%E8%AF%86%E7%AE%A1%E7%90%86-%E7%AE%80%E5%8C%96%E7%94%9F%E6%B4%BB%E7%9A%84%E7%BB%88%E6%9E%81%E6%8C%87%E5%8D%97/)
- [PKMer_myZettelkasten 介绍](https://pkmer.cn/Pkmer-Docs/02-%E7%9F%A5%E8%AF%86%E7%AE%A1%E7%90%86%E5%9F%BA%E7%A1%80/%E7%9F%A5%E8%AF%86%E7%AE%A1%E7%90%86%E5%9C%86%E6%A1%8C%E8%AE%A8%E8%AE%BA/terry/myzettelkasten-%E4%BB%8B%E7%BB%8D/)
- [如何用 AI 重塑我们的信息获取流程？ - 少数派 (sspai.com)](https://sspai.com/post/90423)
