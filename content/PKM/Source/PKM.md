---
title: PKM
alias: []
uid: 202408181751
author: ped_yc
description: 
date-created: 2024-08-18 17:51
date-modified: 2024-09-11 12:04
type:
  - 方法论
aliases: []
tags: [PKM]
---

::up::[[数字花园]]

## 概述

[[Source/_resources/知识管理/7d25f1ed57357410442f092da56e29cc_MD5.jpeg|知识管理流程.png]]
![[Source/_resources/知识管理/7d25f1ed57357410442f092da56e29cc_MD5.jpeg]]

" 知识管理 " 一词最早起源于工商管理领域，其目的是应用管理学知识使得企业更加高效的运转。本文讨论的是 " 个人知识管理 "，核心在于统筹自己的知识，让我们对自己的知识有更深更全的把握，让我们能够更加系统性的分析自己的能力构成，加强我们希望加强的部分。

知识管理的工作流如下：

> 略读/订阅 --> 稍后读/AI 总结 --> 笔记 --> 存储

## 方法论

信息收集（略读/订阅）：

- 概念：通过高质量 [[信息源]] 来收集优质信息，收集工具要求 " 足够快 "
- 方案：<mark class="hltr-red">简悦 +RSS</mark>方案，实现本地和云端的双向同步，因为本地化，所以可以非常快
- 工具：
	- 简悦：浏览器插件，阅读优化、本地导出
	- RSS：RSSHub Radar + Inoreader/Tidyread

信息筛选（稍后读/AI 总结）：

- 概念：将收集的信息通过个人需求进行筛选，转化为永久笔记，要求 [[标准化内容]]
- 方案：RSS + AI 方案，通过 <mark class="hltr-red">Tidyread</mark> 实现内容噪声过滤
- 工具：
	- Tidyread：浏览器扩展，通过 AI 来对订阅源内容进行解构分析，便于提取信息
	- RSS Hub Radar：浏览器扩展，寻找文章的 RSS 源
	- Obsidian-Linter：obsidian 插件，用于 markdonw 格式化，产出标准化内容

信息提炼（笔记）：

- 概念：将筛选后的信息进一步提炼，转化为适合个人的、利于吸收的知识
- 方案：
	- 阅读（略读 + 稍后读）+ 笔记
	- <mark class="hltr-red">阅读（AI 解构 +AI 提炼）+ 笔记</mark>
- 工具：
	- Tidyread：AI 解构 + 提炼
	- 简悦：高亮 + 笔记

信息管理（存储）：

- 概念：将知识以一定方式组织起来，关注的知识的管理成本和检索成本，一般而言，管理成本和检索成本成反比，本库使用 <mark class="hltr-red">ACCESS 笔记组织法</mark>
- 方案：
	- [[PARA笔记组织法]]
	- [[ACCESS笔记组织法]]
- 工具：
	- Obsidian
	- 坚果云

## 我的方案

<mark class="hltr-red">简悦/RSS + Obsidian + 坚果云</mark>

1. 信息收集：发现并寻找优质信息源
2. 信息筛选：对信息进行略读，决定是否加入稍后读（简悦 +Tidyread）
3. 信息提炼：对收集信息进行提炼，AI 总结 + 笔记（简悦 +Tidyread）
4. 信息管理：通过 ACCESS 笔记组织法管理信息（Obsidian+ 坚果云）

## 参考文章

- [PKMer_Echo 的卡片盒笔记法工作流程及 Obsidian 实践](https://pkmer.cn/Pkmer-Docs/02-%E7%9F%A5%E8%AF%86%E7%AE%A1%E7%90%86%E5%9F%BA%E7%A1%80/%E7%9F%A5%E8%AF%86%E7%AE%A1%E7%90%86%E5%9C%86%E6%A1%8C%E8%AE%A8%E8%AE%BA/echo/echo%E7%9A%84%E5%8D%A1%E7%89%87%E7%9B%92%E7%AC%94%E8%AE%B0%E6%B3%95%E5%B7%A5%E4%BD%9C%E6%B5%81%E7%A8%8B%E5%8F%8Aobsidian%E5%AE%9E%E8%B7%B5/)
- [如何用 AI 重塑我们的信息获取流程？ - 少数派 (sspai.com)](https://sspai.com/post/90423)
