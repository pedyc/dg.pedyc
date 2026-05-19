---
uid: 202604131800
title: Q-何时选微前端或Monorepo
aliases: [Q-何时选微前端vsMonorepo]
description: 多团队独立交付场景下，如何在微前端和 Monorepo 之间做选择
tags: [前端工程/架构]
date-created: 2026-04-13
date-modified: 2026-05-19
status: cultivating
content-type: question
---

## 问题

> 何时选微前端 vs Monorepo？

---

## 背景

随着团队扩张，前端应用面临巨石应用问题。团队通常面临两个方向的选择：微前端（应用级解耦）和 Monorepo（代码级复用）。两个方向解决不同问题，需要根据团队实际场景判断。

---

## 现有答案

### 答案 1：按交付独立性选择

- **选微前端**：多团队维护独立业务，各团队有自己的仓库和部署流水线，需要**独立部署**
- **选 Monorepo**：团队共享代码，希望**统一版本**和**统一构建**，各模块不需要独立部署

### 答案 2：按团队规模选择

- **选微前端**：团队规模大（10+ 人并行开发），发布冲突频繁
- **选 Monorepo**：团队规模小到中等（3-10 人），代码复用需求大于独立交付需求

### 我的理解

核心判断标准是**团队间是否存在发布依赖**。如果有，选择微前端；如果没有，选择 Monorepo。

---

## 探索路径

- [ ] 梳理团队间发布依赖关系图
- [ ] 评估独立部署的收益是否大于增加的架构复杂度

---

## 关联

- **相关概念**：[[微前端]]、[[Monorepo]]
- **参考资料**：[Micro Frontends - Martin Fowler](https://martinfowler.com/articles/micro-frontends.html)
