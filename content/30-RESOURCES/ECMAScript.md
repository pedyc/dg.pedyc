---
uid: "20261027202418"
title: ECMAScript
aliases: [ECMA-262, T-ECMAScript, ES规范]
description: Ecma International 通过 TC39 维护的编程语言规范（标准号 ECMA-262），JavaScript 是它的实现，2015 年起每年 6 月发布一版
tags: [前端开发/JavaScript, 计算机科学]
date-created: 2026-10-27
date-modified: 2026-10-27
content-type: term
up: "[[JavaScript]]"
---

## 术语：ECMAScript

> **别名**: ECMA-262、ES 规范
> **领域**: #前端开发/JavaScript/标准

### 定义

ECMAScript 是 Ecma International 制定的通用、跨平台、与厂商无关的编程语言规范，以标准号 ECMA-262 发布，规范全称 `ECMAScript Language Specification`。它规定语法、语义、内置对象与标准库的行为，是 JavaScript 这个名字背后真正被标准化的东西。

规定范围：词法与语法、类型系统与抽象操作、内置对象（`Object`、`Array`、`Promise`、`Map`……）的语义、错误抛出条件。凡是「同一段代码在 Chrome 和 Firefox 里结果必须一样」的部分，都在这份文档里。

不在范围内：

- 宿主 API——`document`、`fetch`、`localStorage` 归 HTML 标准，`fs`、`process` 归 Node.js 文档，不在 ECMA-262 里
- 实现方式——解释执行还是 JIT、用什么垃圾回收算法，由引擎自己决定
- 工具链与框架——`Babel`、`TypeScript`、`Webpack` 都不在标准范围内

名称之间的分工（最容易混的一处）：

| 名字 | 是什么 |
|:---|:---|
| Ecma International | 标准组织，1996 年 11 月启动标准化工作 |
| TC39 | Ecma 下设的技术委员会，负责撰写与演进规范 |
| ECMA-262 | 标准编号；第 17 版即 ECMAScript 2026 |
| ECMAScript | 由 ECMA-262 定义的语言规范 |
| JavaScript | 按这份规范实现的编程语言，也是日常称呼 |

两个名字的法律状态不同：`JavaScript` 是 Oracle 的商标，`ECMAScript` 是 Ecma 的注册商标。1996 年 Netscape 向 Ecma 提交标准化时，因 Sun 持有 Java 商标，语言不能继续叫 JavaScript，标准侧才改用 ECMAScript——所以「ECMAScript 和 JavaScript 是两个语言」的说法不成立，前者是规范名，后者是实现与常用名。

### 版本线

| 版次 | 发布时间 | 常称 | 关键内容 |
|:---|:---|:---|:---|
| 第 1 版 | 1997-06 | ES1 | 首个标准，把当时 Netscape 的 JavaScript 与微软 JScript 收拢成一份定义 |
| 第 2 版 | 1998-08 | ES2 | 编辑性修订，与 ISO/IEC 16262 对齐 |
| 第 3 版 | 1999-12 | ES3 | 正则、`try/catch`、`do-while`，此后十年成为事实基准 |
| 第 4 版 | — | ES4 | **编号被预留但从未发布**，Ecma 的出版物里不存在这一版 |
| 第 5 版 | 2009-12 | ES5 | 严格模式、`JSON`、`Object.create`、数组迭代方法 |
| 第 5.1 版 | 2011-06 | ES5.1 | 最后一次与 ISO/IEC 16262 对齐的版本 |
| 第 6 版 | 2015-06 | ES2015 / ES6 | 史上最大一次更新；自此改为**每年一版**并按年份命名 |
| 第 7–15 版 | 2016–2024 | ES2016–ES2024 | 每年一版，增量见 [[Javascript版本演进]] |
| 第 16 版 | 2025-06 | ES2025 | 迭代器辅助方法、Set 集合运算 |
| 第 17 版 | 2026-06 | ES2026 | 七项标准库补齐，无语法变化；当前版本 |

规范正本是 HTML 版（Ecma 明说 PDF 仅供打印），第 17 版可读 `262.ecma-international.org/17.0/index.html`。

三条容易记错的规则：

1. ES6 就是 ES2015，不是 ES2016。2015 年改命名法时，第 6 版被追认为 ES2015，此后版次与年份对齐：第 N 版 = ES(2009+N)，仅对 N ≥ 6 成立。
2. 262 不是版本号。`ECMA-262` 是标准编号，`17th edition` 才是版次。
3. 2026 这个年份不表示「2026 年的新功能」。一份特性往往几年前就到 Stage 4，只是赶上了某一年的年度快照——`Array.fromAsync` 三个引擎 2023 年就能用，2026 年才进标准。

各版之间的增量与特性归属，见 [[Javascript版本演进]]；单版详情见 [[ES2015]]、[[ES2025]]、[[ES2026]]。

### 提案如何进入标准

新特性一律走 TC39 的提案流程，共六档（0–4 加 2.7）：

| 阶段 | 名称 | 含义 |
|:---|:---|:---|
| 0 | Strawperson | 想法，尚未提交委员会 |
| 1 | Proposal | 有提案人与公开仓库，问题空间与解法方向被接受 |
| 2 | Draft | 选定方案，写出含主要语义的规范文本，仍可能大改 |
| 2.7 | Validation | 设计基本定稿，靠测试与原型实现验证（2020 年代新增的过渡档） |
| 3 | Candidate | 推荐实现，等引擎反馈与 Web 兼容性验证 |
| 4 | Finished | 完成，可并入标准 |

进入 Stage 4 有两条硬判据，不是「委员会觉得可以」：

- **两个兼容实现通过 Test262 验收测试**，且这两个实现来自独立的 VM，有实际发布经验
- 规范文本的 PR 已合入 `tc39/ecma262`（或 `ecma402`）并通过编辑组签字

年度节奏（TC39 流程文档给出的近似日历）：2 月 1 日产出候选草案 → 2 至 3 月走 60 天专利选择退出期 → 3 月会议上并入所有 Stage 4 提案并拉出年度分支，此后只接受编辑性修改 → 4 至 6 月由 Ecma 执委会与大会审阅 → 6 月底由大会批准（文档写的近似时点是 7 月，近年实际落在 6 月下旬：ES2025 为 2025-06-25，ES2026 为 2026-06-30）。

与年度快照并行的是活文档（living draft，`tc39.es/ecma262`）：年度版本分支冻结后，主分支继续吸纳新内容。所以 2026 年 10 月打开活文档，标题已经是 ECMAScript 2027——查「某特性现在算哪一版」时，以 TC39 的 finished-proposals 表为准，不要看活文档。

### 易混

| 说法 | 实际 |
|:---|:---|
| ECMAScript 是 JavaScript 的方言 | 反了。ECMAScript 是规范，JavaScript 是按规范实现的语言 |
| ES2026 有语法新特性 | 没有。第 17 版七项全是标准库方法 |
| `Temporal` 属于 ES2026 | 不属于。2026-03 达 Stage 4、错过截止，归 ES2027 |
| TC39 的 Stage 3 等于「快发布了」 | 不等于。装饰器在 Stage 3 停了四年，2026-05 被降回 Stage 2.7 |
| ECMA-402 / ECMA-404 是 ECMAScript 的版本 | 不是。402 是 `Intl` 国际化 API，404 是 JSON，414 是标准套件，都是同组织的独立标准 |

### 知识网络

- **上位**：
	- [[Web标准]] — ECMA-262 是标准化组织发布的平台规范之一，与 HTML、CSS 同属「浏览器按标准实现」这一层
- **下位**：
	- [[ES2015]] — 第 6 版，年度发布模式的起点
	- [[ES2025]] — 第 16 版
	- [[ES2026]] — 第 17 版，当前版本
- **并列**：
	- [[HTML]] — 结构与宿主 API 的标准，由 WHATWG 维护
	- [[CSS]] — 样式标准，由 W3C 维护
	- [[DOM]] — 文档对象模型标准
- **相关**：
	- [[JavaScript]] — 规范的实现与常用名，本笔记在归档树上挂在它下面
	- [[Javascript版本演进]] — 各版增量与特性归属的时间线
	- [[Babel]] — 把新标准语法转译到旧环境
	- [[TypeScript]] — 在 ECMAScript 之上加类型系统
- **外部资料**
	- [Ecma International - ECMA-262 第 17 版](https://ecma-international.org/publications-and-standards/standards/ecma-262/)
	- [TC39 - 规范活文档](https://tc39.es/ecma262/)
	- [The TC39 Process](https://tc39.es/process-document/)
	- [tc39/proposals - 各阶段提案与 finished-proposals 表](https://github.com/tc39/proposals)
	- [MDN - ECMAScript](https://developer.mozilla.org/en-US/docs/Glossary/ECMAScript)
