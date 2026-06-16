---
uid: 202605201737
title: wiki-log
aliases: [wiki-log, wiki日志]
tags: [llm-wiki, 元数据]
date-created: 2026-05-20
date-modified: 2026-06-15
status: active
content-type: [article]
up: ["[[本库指南]]"]
---

## Wiki Log

本文件是知识库的 append-only 时间线，记录知识加工事件。格式：`## [日期] 操作类型 | 标题`。

**应记录的操作类型**：`ingest`、`inbox-review`、`lint`、`query`
**不应记录的操作**：`sync`、`update`、`create`（系统维护）

---

## 2026

### 2026-06

#### 2026-06-15

- [2026-06-15] ingest | 创建 Q-note「如何在信息过载时代保持高信噪比」
	- 位置：40-RESOURCES/如何在信息过载时代保持高信噪比.md
	- 父页面：[[A-知识管理]]（已纳入"待解问题"章节）
	- 覆盖 3 套策略（Gatekeeping、分层处理、Pull 驱动）+ 探索路径
- [2026-06-15] ingest | 创建 SOP「信息收集工作流」
	- 位置：40-RESOURCES/信息收集工作流.md
	- 父页面：[[知识获取|MOC-知识获取]]
	- 覆盖三层管道：Follow RSS（主力）→ 抖音/掘金（补充）→ 个人博客（深读）
	- 包含 mermaid 流程图和三管道核心步骤
- [2026-06-15] ingest | 创建 Q-note「双向链接如何从引用变成思维脚手架」
	- 位置：40-RESOURCES/双向链接如何从引用变成思维脚手架.md
	- 父页面：[[A-知识管理]]（已纳入"待解问题"章节）
	- 覆盖 3 套策略：理由化链接、链接类型语义、被动浮现
- [2026-06-15] refactor | 知识管理领域全面修复（创建5个缺失笔记 + 移动2条atomic + 更新领域页）
	- 创建：认知心理学（concept）、SOP-知识花园修剪指南、SOP-笔记标签命名与使用规范
	- 创建：常用工具（MOC）、Q-知识管理的ROI如何衡量（question）
	- 移动：知识只有被调用时才产生价值、信息应按可行动性而非主题分类 → 30-ZETTELKASTEN
	- 更新：SOP-CODE知识全生命周期工作流（移除简悦，对齐Follow）
	- 更新：A-知识管理（Q3里程碑、健康度指标、复盘v2.0）
	- 修复：知识组织MOC引用（维护清单→修剪指南）
- [2026-06-15] ingest | 创建 SOP「全渠道快速捕获工作流」
	- 位置：40-RESOURCES/SOP-全渠道快速捕获工作流.md
	- 父页面：[[知识获取]]
	- 覆盖手机/电脑/离线三端捕获场景
- [2026-06-15] ingest | 创建 SOP「PARA笔记归档流程」
	- 位置：40-RESOURCES/SOP-PARA笔记归档流程.md
	- 父页面：[[知识组织]]
	- 覆盖项目完成后按 PARA 四象限归档的完整流程
- [2026-06-15] ingest | 创建 SOP「原子笔记拆分标准」
	- 位置：40-RESOURCES/SOP-原子笔记拆分标准.md
	- 父页面：[[知识组织]]
	- 覆盖单一性检查、拆分红线、关联重建
- [2026-06-15] ingest | 创建 SOP「渐进式总结法」
	- 位置：40-RESOURCES/SOP-渐进式总结法.md
	- 父页面：[[知识内化]]
	- 覆盖四层提炼：摘录→加粗→批注→重构
- [2026-06-15] ingest | 创建 SOP「卡片盒笔记链接法」
	- 位置：40-RESOURCES/SOP-卡片盒笔记链接法.md
	- 父页面：[[知识内化]]
	- 覆盖反向检索、理由化链接、类型标注
- [2026-06-15] ingest | 创建 atomic「笔记的价值取决于连接」
	- 位置：30-ZETTELKASTEN/笔记的价值取决于连接.md
	- 父页面：[[卡片盒笔记法]]
	- 核心观点：笔记的连接密度决定了知识库的活性
- [2026-06-15] ingest | 创建 atomic「收敛过程本质上的熵减过程」
	- 位置：30-ZETTELKASTEN/收敛过程本质上的熵减过程.md
	- 父页面：[[A-知识管理]]
	- 核心观点：收敛（算法/思维/知识）本质上是系统熵减的过程

- [2026-06-15] ingest | 创建 atomic「熵减必然有信息代价」
	- 位置：30-ZETTELKASTEN/熵减必然有信息代价.md
	- 父页面：[[收敛过程本质上是熵减过程]]
	- 核心观点：任何熵减操作都伴随着信息的舍弃——收敛必有取舍

- [2026-06-15] ingest | 创建 SOP「信源质量审计标准」
	- 位置：40-RESOURCES/信源质量审计标准.md
	- 父页面：[[知识获取]]
	- 覆盖五维评分（密度/时效/深度/独特性/产出率）+ 四级判定

- [2026-06-15] refactor | 重写「经过验证的高信噪比信源」按五维评分标准评级
	- 位置：20-AREAS/A-知识管理/经过验证的高信噪比信源.md
	- 评分：Zsolt A级、PKMer B级、阮一峰 B级、潮流周刊 C级
	- 遗留：B站信源评分待补充，X/知乎/播客暂缺

- [2026-06-15] ingest | 创建 concept「信息论」
	- 位置：40-RESOURCES/信息论.md
	- 父页面：[[知识获取]]
	- 覆盖香农信息论核心概念 + 知识管理应用映射 + 信噪比/熵的学科源头
	- 更新信噪比.md 添加「上游学科」反向链接

- [2026-06-15] ingest | 创建 atomic「信噪比决定了信息传递的有效性」
	- 位置：30-ZETTELKASTEN/信噪比决定了信息传递的有效性.md
	- 父页面：[[信息论]]
	- 核心观点：香农公式 C = B×log2(1+S/N) 是知识管理信噪比策略的数学原点

#### 2026-06-12

- [2026-06-12] ingest | 新建 MOC「Angular面试题」
	- 位置：40-RESOURCES/MOC-Angular面试题.md
	- 父页面：[[MOC-前端面试真题库]]、[[A-前端/Angular]]
	- 覆盖 14 个模块、7 个待探索问题
- [2026-06-12] ingest | 新建 SOP「AI提问技巧」
	- 位置：40-RESOURCES/SOP-AI提问技巧.md
	- 父页面：[[A-知识管理]]
- [2026-06-12] ingest | 新增 atomic「AI提问质量取决于上下文结构化程度」
	- 位置：30-ZETTELKASTEN/AI提问质量取决于上下文结构化程度.md
	- 父页面：[[AI提问技巧]]
- [2026-06-12] refactor | 重写知识获取工作流为 SOP
	- 位置：40-RESOURCES/知识获取工作流.md
	- 变更：atomic → sop，覆盖剪藏 + AI 对话两种模式
	- 更新引用：MOC-知识获取、wiki-index
- [2026-06-12] refactor | 新增本库指南「系统设计」章节
- [2026-06-12] refactor | 本库指南重构为 MOC 入口
	- 拆分元数据规范 → 00-META/Guide/元数据规范.md
	- 拆分命名规范 → 00-META/Guide/命名规范.md
	- 本库指南保留核心理念/目录/模板/标签/工作流/系统设计/工具链/LLM Wiki 及索引链接
	- 位置：00-META/Guide/本库指南.md
	- 内容：架构总览 mermaid 图 + 组件总览表 + 导航指引
- [2026-06-12] refactor | skill 三层分层重构
	- obsidian-note-local v1.0.0 → v2.1.0：移除 wiki-index/wiki-log 职责，只负责创建 + 挂父页面
	- wiki-sync-local v2.0.0 → v3.0.0：明确只碰 00-META/，接管 index/log 职责
	- 新增 _skills-overview.md 作为所有 skill 的总览
	- 更新 llm-wiki-schema.md、CLAUDE.md 硬规则
	- 更新 _lint-rules.md 加入分析脚本模板
	- 补充 wiki-log 支持 refactor 操作类型
- [2026-06-12] lint | full 健康检查
	- 检查范围：30-Zettelkasten、40-RESOURCES、20-AREAS、50-ARCHIVE
	- **矛盾**：0 个
	- **孤儿页面**：4 个（MOC-心流体验、MOC-时政、MOC-政治经济、MOC-前端缓存方案）
		- 均仅 wiki-index 自引用，建议补充相关页面引用或移至归档
		- MOC-OpenClaw 已由 [[P-学习OpenClaw]] 引用，解除孤儿状态
		- MOC-神秘主义 已由 [[C-超验]] 引用，解除孤儿状态
	- **概念缺口**：1 个
		- [[Svelte vs React]]：wiki-index 和 [[Svelte]] 均引用此页面，但文件不存在。建议创建或在 wiki-index 中修正链接
	- **过时断言**：0 个
	- **索引一致性**：1 处断裂（[[Svelte vs React]] 链接无效）
	- **预警**：无（矛盾 0/3、孤儿 4/5、概念缺口 1/5，均在安全线内）

## Lint Report - 2026-06-12

### 矛盾

- 无

### 孤儿页面

- [[MOC-心流体验]]：仅 wiki-index 自引用，建议补充 inbound link 或归档
- [[MOC-时政]]：仅 wiki-index 自引用，建议补充 inbound link 或归档
- [[MOC-政治经济]]：仅 wiki-index 自引用，建议补充 inbound link 或归档
- [[MOC-前端缓存方案]]：仅 wiki-index 自引用，建议补充 inbound link 或归档

### 概念缺口

- "Svelte vs React" 被 [[Svelte]] 和 [[wiki-index]] 引用 2 次但无专属页面，建议创建 [[Svelte vs React]]

#### 2026-06-01

- [2026-06-01] lint | full 健康检查
	- 检查范围：30-Zettelkasten、40-RESOURCES、20-AREAS
	- **矛盾**：0 个
	- **孤儿页面**：5 个（MOC-心流体验、MOC-神秘主义、MOC-时政、MOC-政治经济、MOC-OpenClaw）
		- 均仅 wiki-index 自引用，建议补充相关页面引用或移至归档
	- **概念缺口**：0 个
	- **过时断言**：0 个
	- **索引一致性**：通过

### 2026-05

#### 2026-05-28

- [2026-05-28] ingest | 消化 5 个未引用的 atomic 笔记
	- 补充到对应 concept：作用域链、浏览器核心架构、事件循环、NextJS
	- 新增 atomic 引用：变量提升、浏览器渲染引擎与 JS 引擎分工、同步异步任务协调
	- 检查了全部 56 个 atomic，确认 wiki 层引用完整
- [2026-05-28] ingest | 补充 Wiki 层内联规则
	- 新增「Wiki 层内联规则」章节到 llm-wiki-schema.md
	- 补全 SOP/term/comparison/record/question/moc/diary 的定位和内联规则
	- 新增 content-type 定位速查表
	- 定义各类型在 wiki-index 的位置和引用来源
- [2026-05-28] ingest | 创建概念「本库子系统概述」
	- 位置：00-META/本库子系统概述.md
	- content-type：concept，aliases：C- 本库子系统概述
	- 内容：记录 9 个子系统及其关联关系
	- 更新 wiki-index 添加「本库指南」分类
	- 移动到 00-META/ 方便检索
- [2026-05-28] refactor | 整理 00-META 目录结构
	- 删除 01 索引/（5 个文件，与 wiki-index 重复）
	- 删除 02 附录/（内容已分流到 40-RESOURCES/50-ARCHIVE/）
	- 删除所有.tmp.* 临时文件（22 个）
	- 移动 Q- 问题笔记到 40-RESOURCES/
	- 移动过时文档到 50-ARCHIVE/
- [2026-05-28] refactor | 解耦 llm-wiki-schema 为主索引 + 5 个子文档
	- llm-wiki-schema.md 降级为索引文件（~50 行）
	- 新增 _content-type-rules.md（~150 行）
	- 新增 _ingest-rules.md（~100 行）
	- 新增 _query-rules.md（~50 行）
	- 新增 _lint-rules.md（~100 行）
	- 新增 _sync-rules.md（~80 行）
	- LLM 可按需读取子文档，而非全量 400 行
	- 补充到对应 concept：作用域链、浏览器核心架构、事件循环、NextJS
	- 新增 atomic 引用：变量提升、浏览器渲染引擎与 JS 引擎分工、同步异步任务协调
	- 检查了全部 56 个 atomic，确认 wiki 层引用完整

#### 2026-05-27

- [2026-05-27] ingest | 创建了 SOP-Babel 使用指南
	- 位置：`40-RESOURCES/SOP-Babel使用指南.md`
	- content-type：sop
	- 内容：Babel 配置与使用流程、preset/plugin 配置、常见问题排查
- [2026-05-27] ingest | 创建了 ESLint 术语笔记
	- 位置：`40-RESOURCES/ESLint.md`
	- content-type：term，aliases：T-ESLint
	- 内容：JavaScript 静态代码分析、Rules/Config/Plugins/Extends

#### 2026-05-26

- [2026-05-26] inbox-review | 移动 4 个文章到 BLOGS
	- 教你如何构建自己的依赖注入工具.md → 60-BLOGS/
	- 新兴前端框架 Svelte 从入门到原理.md → 60-BLOGS/
	- 聊聊前端模块化.md → 60-BLOGS/
	- 聊聊网页断点调试及其扩展.md → 60-BLOGS/
	- 类型判断：均为 article（有 source、author、published）
- [2026-05-26] inbox-review | 添加 Inbox Review 工作流
	- llm-wiki-local SKILL.md 新增 review 路由
	- llm-wiki-schema.md 新增 Inbox Review 章节
	- 定义 content-type 判断规则和目标目录映射
- [2026-05-26] lint | full 健康检查
	- 检查范围：30-Zettelkasten、40-RESOURCES、20-AREAS
	- **矛盾**：0 个
	- **孤儿页面**：0 个
	- **概念缺口**：0 个（知识网络完整）
	- **过时断言**：0 个
	- **索引一致性**：通过

#### 2026-05-22

- [2026-05-22] ingest | 新增 comparison「Vue vs React」
	- 位置：`40-RESOURCES/Vue vs React.md`
	- 更新 [[wiki-index]] 添加 Comparisons 条目
- [2026-05-22] ingest | 新增 question「从输入 URL 到页面展示发生了什么？」
	- 位置：`40-RESOURCES/Q-从输入URL到页面展示发生了什么.md`
	- 已收录于 [[MOC-网络协议相关问题]] 索引

#### 2026-05-21

- [2026-05-21] ingest | 完善 Q-note「Vite HMR 原理与 Webpack 区别」
	- 内容：Vite HMR 基于原生 ESM 按需编译，Webpack HMR 需要重建依赖链
	- 核心区别：更新范围、编译时机、实现机制
	- 已收录于 [[MOC-Vite相关问题]] 索引
- [2026-05-21] ingest | 新增 concept「荣格心理学」
	- 位置：`40-RESOURCES/荣格心理学.md`
	- 更新 [[wiki-index]] 添加 Concepts 条目
- [2026-05-21] ingest | 重写 concept「存在主义」+ 新增 atomic「存在先于本质」
	- 位置：`40-RESOURCES/存在主义.md`
	- 新增 atomic：`30-ZETTELKASTEN/存在先于本质.md`
	- 更新 [[wiki-index]] 添加 Concepts 条目

- [2026-06-15] ingest | 创建 concept「GTD」
	- 位置：40-RESOURCES/GTD.md
	- 父页面：[[A-时间管理]]
	- 覆盖 GTD 五阶段工作流（收集→厘清→组织→反思→执行）+ 核心原则（心如止水、2 分钟原则、每周回顾）
	- 关联：[[四象限法则]]、[[PARA笔记法]]、[[番茄工作法]]

- [2026-06-15] ingest | 创建 atomic「痛点是知识管理的唯一动力源」
	- 位置：30-ZETTELKASTEN/痛点是知识管理的唯一动力源.md
	- 父页面：[[A-知识管理]]（已纳入核心心智模型 → 原子洞见）
	- 核心观点：没有真实痛点驱动的知识管理系统注定无法持续

- [2026-06-15] refactor | 重写「怎样架构混合型知识库」sop → concept
	- 位置：40-RESOURCES/怎样架构混合型知识库.md
	- 变更：sop → concept（内容实质是架构设计，非标准流程）
	- aliases：SOP-怎样架构混合型知识库 → C-混合型知识库架构
	- 更新：wiki-index（SOP → Concepts）、补全核心命题/运行机制/知识图谱

- [2026-06-15] refactor | 修复 _templates 目录前缀规范（2 处）
	- template_comp.md: aliases MOC- → VS-（comparison 应使用 VS- 前缀）
	- template_roadmap.md: aliases R- → []（roadmap 无定义前缀，不应使用 R-）

- [2026-06-15] refactor | 清除模板正文中的前缀 Wikilink
	- template_area.md: SOP-/Q-/MOC- 前缀引用 → {{纯标题占位符}}
	- template_concept.md: SOP-/Q- 前缀引用 → {{纯标题占位符}}
	- 原则：前缀只在 aliases 字段使用，正文引用用纯标题

- [2026-06-15] refactor | 修复数字花园概述（归档→资源 + 4 类问题）
	- 位置：50-ARCHIVE/ → 40-RESOURCES/（active 状态不应在归档）
	- 来源更正："Maggie Appleton 提出" → Mark Bernstein(1998) 源头 + Appleton 系统阐述
	- 创建 3 条 atomic 补充核心命题：中间态/观点联系/状态标记
	- 重写运行机制 mermaid：消除花圃/花朵的混乱比喻
	- 重写关键区别表格：统一对比维度为内容粒度/公开程度/更新方式/发布门槛/组织逻辑
	- 补充关键人物（Bernstein/Appleton/Critchlow）、状态标记特征
	- 更新：wiki-index Concepts 章节

- [2026-06-15] refactor | 修复第二大脑笔记（来源/运行机制/对比/FAQ/局限性）
	- 来源更正："Tiago Forte 提出 PARA 方法" → "Tiago Forte, Building a Second Brain"
	- 运行机制补充：渐进式总结（4 层提炼法）+ PARA 组织框架
	- 关键区别：范围"主要是私有"→"完全私有"，新增与卡片盒的定位对比表
	- 新增局限性章节：维护成本/工具绑定/过度外化/投入产出比
	- 新增 FAQ 章节（2 个 Q-note 引用）
	- 更新：知识图谱补充卡片盒笔记法和认知负荷

- [2026-06-16] refactor | 去重数字花园笔记（删除旧版，保留已修复版）
	- 删除 40-RESOURCES/数字花园.md（旧版残留 uid 重复）
	- 保留 40-RESOURCES/数字花园概述.md（已修复完整内容）
	- [[数字花园]] 引用通过别名正常解析到数字花园概述

- [2026-06-16] ingest | 创建 comparison「Angular vs React」
	- 位置：40-RESOURCES/Angular vs React.md
	- 父页面：[[MOC-前端面试真题库]]
	- 覆盖架构哲学/响应式模型/变更检测/表单/HTTP/状态管理 8 维对比
	- 更新：wiki-index Comparisons 章节

- [2026-06-16] ingest | 创建 term「Signal(Angular)」
	- 位置：40-RESOURCES/Signal(Angular).md
	- aliases：T-Angular-Signal
	- 父页面：[[Angular|A-前端/Angular]]
	- 覆盖核心 API（signal/computed/effect/input/output/model 等 9 个）+ RxJS 互通 + 使用示例

- [2026-06-16] ingest | 创建 concept「Angular变更检测」
	- 位置：40-RESOURCES/Angular变更检测.md
	- aliases：C-Angular-变更检测
	- 父页面：[[Angular|A-前端/Angular]]
	- 覆盖 Zone.js 触发 → Default/OnPush 策略 → Signal 模式演进
	- 包含性能优化示例代码（OnPush / runOutsideAngular / Signal）


#### 2026-05-20

- [2026-05-20] ingest | 批量导入所有 MOC/Area/SOP/Term/Comparison/Record 到 Wiki
	- 扫描了所有 content-type 为 moc、area、sop、term、comparison、record 的页面
	- 统计：
		- Areas：22 个（前端、AI、个人成长、政治经济等）
		- MOCs：35 个（前端工程、算法、PWA、浏览器等）
		- SOPs：44 个（开发流程、React、ThreeJS、Canvas 等）
		- Terms：60 个（前端、HTTP、TypeScript、设计模式等）
		- Comparisons：9 个（Webpack vs Vite、React 对比、状态管理等）
		- Records：4 个（俄乌冲突、美以袭击伊朗）
	- 更新了 [[wiki-index]] 全量内容
- [2026-05-20] ingest | 视觉思维领域试点
	- 领域：[[A-视觉思维]]
	- 核心 concept：
		- [[双重编码理论]] — 更新了知识图谱和 FAQ
		- [[认知负荷]] — 更新了应用场景
		- [[Gestalt视觉法则]] — 从 atomic 升级为完整 concept 结构
	- 更新了 [[wiki-index]] 中的 Areas 和 Concepts 分类
- [2026-05-20] ingest | 知识管理领域纳入 Wiki
	- 领域：[[A-知识管理]]
	- 核心 concept：
		- [[知识地图]] — 领域知识的结构化视图
		- [[PARA笔记法]] — 按项目 - 领域 - 资源 - 归档分类
		- [[卡片盒笔记法]] — 原子笔记和双向链接
		- [[费曼技巧]] — 通过教学加深理解
		- [[认知负荷]] — 已有，复用
	- 核心 SOP：
		- [[CODE知识全生命周期工作流]] — Capture, Organize, Distill, Express
	- 更新了 [[wiki-index]] 中的 Areas、Concepts、SOPs 分类
- [2026-05-20] init | 初始化 LLM Wiki 系统
	- 创建 [[llm-wiki-schema]]
	- 创建 [[wiki-index]]
	- 创建 [[wiki-log]]

*Log 开始于 2026-05-20*

- [2026-06-15] refactor | 批量重分类 163 条笔记的 content-type
		- 原子笔记以陈述句命名，大量笔记误标为 atomic
		- 重分类结果：concept × 126、term × 17、question × 16、sop × 3、moc × 1
		- 保留 atomic × 3（TypeScript的类型是编译时约束、Vue3 响应式系统分为 effect 和 reactive 两部分、执行上下文分为创建阶段和执行阶段）
		- 自动为无前缀的文件补齐 aliases 前缀

- [2026-06-15] refactor | 修复 00-META 规格文档与实操的不一致
		- settings.local.json: Skill(content-verifier) → Skill(content-verifier-local)，去掉冗余 skill(obsidian-note)
		- _content-type-rules.md: "Diay" 拼写修正为 "Diary"
		- 命名规范.md: 前缀表格中的空格清理（P- 求职 → P-求职 等）
