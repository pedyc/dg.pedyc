---
uid: 202604132000
title: Q-qiankun和ModuleFederation怎么选
aliases: [Q-qiankun和ModuleFederation怎么选]
description: 在运行时隔离方案 qiankun 和依赖共享方案 Module Federation 之间如何选择
tags: [前端工程/架构]
date-created: 2026-04-13
date-modified: 2026-04-13
status: cultivating
content-type: question
---

## 问题

> qiankun 和 Module Federation 怎么选？

---

## 背景

qiankun 和 Module Federation 都是当前主流的微前端实现方案。qiankun 基于 Single SPA，提供完整的沙箱隔离；Module Federation 是 Webpack 5 内置方案，依赖共享能力强。两者定位不同，选择时需要权衡。

---

## 现有答案

### 答案 1：按隔离需求选择

- **选 qiankun**：需要完整沙箱隔离（JS + CSS），对应用间变量污染零容忍
- **选 Module Federation**：接受弱隔离，追求更好的依赖共享和构建时性能

### 答案 2：按迁移策略选择

- **选 qiankun**：从 Single SPA 迁移，现有应用已经有一定架构
- **选 Module Federation**：全新项目或渐进迁移，不希望引入过多框架约束

### 我的理解

qiankun 是**运行时方案**，Module Federation 是**构建时 + 运行时方案**。前者隔离强但依赖共享弱；后者依赖共享强但隔离弱。

---

## 探索路径

- [ ] 评估团队对 JS/CSS 隔离的实际需求程度
- [ ] 评估现有应用迁移成本

---

## 关联

- **相关概念**：[[微前端]]
- **技术栈关联**：[[qiankun]]、[[Module Federation]]
