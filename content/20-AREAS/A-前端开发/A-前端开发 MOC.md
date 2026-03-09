---
uid: '202603082345'
title: A-前端开发 MOC
tags: [area, status/active]
date-created: 2026-03-08
date-modified: 2026-03-08
---

## 前端开发

### 🔰 一句话定义

> 创建用户交互界面的技术领域，关注体验、性能与兼容性。

### 🗺️ 知识结构

- **核心基础**：HTML/CSS/JavaScript、浏览器原理
- **进阶深化**：React/Vue、状态管理、工程化
- **实践应用**：性能优化、跨端开发、AI 融合

### 🔗 关联

#### 子领域

- [[前端基础]]
- [[前端工程化]]
- [[前端框架]]
- [[算法真题库]]

#### 进行中项目

```dataview
TABLE 
  file.link as "项目",
  status,
  expire,
  date(expire) - date(today) as "剩余天数"
FROM "10-PROJECTS"
WHERE 
  contains(area, [[A-前端开发 MOC]]) AND
  status != "已完成"
SORT 
  choice(date(expire) < date(today), 0, 1) ASC, 
  expire ASC
```

- [[P-优化前端项目dg.pedyc]]
- [[P-学习OpenClaw]]

### 🎯 当前焦点

- [x] WSL + OpenClaw 环境配置
- [ ] Webpack 原理深入学习
- [ ] React 19 新特性调研

### 📝 待办

- [ ] 创建 [[前端工程化 MOC]]
- [ ] 整理常用代码片段
