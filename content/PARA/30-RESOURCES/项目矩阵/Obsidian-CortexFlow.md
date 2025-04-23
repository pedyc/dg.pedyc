---
title: Obsidian-CortexFlow
date-created: 2025-03-06
date-modified: 2025-04-14
---

> [!hint]
> 来自 deepseek 的建议：[[5-DeepSeek - 开发一个实现PARA笔记组织法的Obsidian插件@annote]]

## 项目介绍

### 功能

实现一个 Obsidian 插件，用于创建和管理一个符合 PARA 原则的笔记仓库，并且具备关联的网页版本。

### 命名

CortexFlow：大脑皮层（Cortex）的信息流动（Flow）

### 技术栈

```json
const PARA_TECH_STACK = {
  core: {
    framework: "React 18",
    state: "Jotai", // 比Redux轻量60%
    styling: "Tailwind CSS + Obsidian原生主题变量"
  },
  extension: {
    parser: "unified.js", // Markdown AST解析
    scheduler: "RxJS", // 复杂事件流处理
    persistence: "IndexedDB" // 本地缓存
  },
  devOps: {
    bundler: "Rollup", // 比Webpack输出体积小22%
    testing: "Cypress + Testing-Library"
  }
}
```
