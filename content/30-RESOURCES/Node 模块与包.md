---
uid: '20261116111346'
title: Node 模块与包
aliases: [MOC-Node模块与包, Node模块与包, Node 模块系统]
description: Node 模块专题 MOC：require 解析顺序、条件导出与 CJS 与 ESM 的互操作
tags: [前端开发/Node]
date-created: 2026-11-16
date-modified: 2026-11-26
content-type: moc
up: "[[Node.js]]"
---

## MOC：Node 模块与包

> 本 MOC 只索引「代码如何被加载」这一段：`require` 按什么顺序找文件、`exports` 的条件怎么匹配、CJS 与 ESM 在同一个进程里怎么互操作、依赖布局对启动时间的代价。
> 包管理工具的命令与用法不在此列，归 [[前端构建与打包]]。

### 核心原则

分类只看**加载发生在什么时候**：解析期（找文件）、实例化期（建立引用）、执行期（跑副作用）。这三个时点错位，就是循环依赖、双包实例、`__dirname` 缺失这些问题的成因。

### 两种模块规范

- [[ESModule]] — 静态结构，加载前就能确定依赖图
- [[CommonJS]]（待写）— 运行期求值，导出是可变的 `module.exports`

### 解析与加载

- [[Node 模块解析]]（待写）— core → 逐级上溯 `node_modules` → `package.json` 的 `main` 与 `exports`
- [[CommonJS 与 ESM 的互操作]]（待写）— 双包、`__dirname` 缺失、循环依赖差异、加载时机
- [[模块化与组件化开发]] — 两种规范的上游背景，讲的是为什么要分模块

### 边界外：依赖与包

> 这两条挂 `[[前端构建与打包]]`，本页只标出它们是同一块知识的另一侧，不搬过来。

- [[package.json]] — 依赖与入口声明的载体
- [[pnpm]] — 依赖布局的实现，扁平与嵌套的取舍

### 知识图谱

> 四桶：上位 / 并列 / 相关 / 外部资料。下位就是上面的分类节，不再重复进桶——判据见 [[知识图谱词表]]。

- **上位**：[[Node.js]] — 本领域三段里的第二段
- **并列**：
	- [[Node 运行时模型]] — 代码何时拿到控制权
	- [[Node IO 与并发]] — 数据如何进出与扩展
- **相关**：
	- [[前端构建与打包]] — 打包器对 CJS 与 ESM 的处理，以本段的结论为前提
	- [[JavaScript]] — 语言层的模块语义，宿主侧的解析规则归本页
- **外部资料**
	- [Modules: CommonJS modules](https://nodejs.org/api/modules.html) — `require` 的解析算法与 `module` 对象
	- [Modules: Packages](https://nodejs.org/api/packages.html) — `exports` 条件导出与双包声明

### 待探索

- [ ] `exports` 的条件匹配顺序，以及它为什么能取代 `main`
- [ ] 同一个包同时被 CJS 与 ESM 引用时，是否会得到两份实例
- [ ] 深层依赖树里，一次 `require` 的查找在什么规模下开始明显拖慢启动
