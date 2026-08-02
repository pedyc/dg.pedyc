---
uid: 202605201737
title: wiki-log
aliases: [wiki-log, wiki日志]
tags: [llm-wiki, 元数据]
date-created: 2026-05-20
date-modified: 2026-08-02
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

### 2026-07

#### 2026-07-31

- [2026-07-31] refactor | 收敛空壳领域：个人博客 area→MOC，个人成长重新定义
	- 个人博客（area→moc）：`20-AREAS/A-个人成长/个人博客.md` → `40-RESOURCES/个人博客.md`，挂 [[知识管理]]；写作选题/流程收敛为 MOC，发布工作流留待探索
	- 个人成长：重新定义核心范畴（认知提升/习惯养成/自我管理），移除"个人品牌"（让给博客 MOC），迁移至新 area 模板
	- 健康管理：保留 area 并标注「待培育（2026-07）」
	- wiki-index：Areas 14→13，MOCs 45→46
- [2026-07-31] refactor | 全量重建 wiki-index（按 _wiki-index-format 规范）
	- 重排 9 区顺序（Areas→MOCs→Concepts→Terms→SOPs→Comparisons→Questions→Records→Meta），修正 Areas 子区嵌套错误
	- 修正计数（MOC 45 / Concepts 36 / Terms 70 / SOPs 41 / Comparisons 11 / Questions 2 / Records 3）
	- 补入 12 个缺失 MOC、移除 2 个悬空链接（Claude核心概念 / MOC-动画效果SOP）、修正 1 处错误链接目标
	- 移除内联别名标注，子条目统一 1-tab 缩进，仅保留头部更新标记
- [2026-07-31] refactor | 起草 wiki-index 索引格式规范 `_wiki-index-format.md`
	- 新建规范：`00-META/Specification/_wiki-index-format.md`，定义分区顺序 / 条目格式 / 排序 / 计数 / 更新标记
	- 接入引用：`llm-wiki-schema` 详细规则列表、wiki-index Meta 分区
- [2026-07-31] refactor | 新增 content-type「person」并集成创建工作流
	- 新建模板：`_templates/template_person.md`
	- 注册规范：`_笔记类型规范.md` / `_content-type-rules.md` 新增 person 类型（R- 前缀与 record/roadmap 共享）
	- 升级 skill：`obsidian-note-local` v3.1.0 → v3.2.0，`content-evaluator-local` v1.1.0 → v1.2.0
- [2026-07-31] refactor | person 挂载规则改为 MOC 主挂载
	- `_笔记类型规范.md` 内联规则与 `obsidian-note-local` 映射更新；skill v3.2.0 → v3.3.0
- [2026-07-31] ingest | 新建 person「Andrej Karpathy」
	- 位置：40-RESOURCES/Andrej Karpathy.md，父级：[[知识内化]]（MOC-知识内化）
- [2026-07-31] ingest | 新建 person「李新野」
	- 位置：40-RESOURCES/李新野.md，父级：[[MOC-时政]]
- [2026-07-31] ingest | 新建 atomic「视觉思维能降低认知负荷」
	- 位置：30-ZETTELKASTEN/视觉思维能降低认知负荷.md，父级：[[视觉思维]]
- [2026-07-31] ingest | 新建 person「Zsolt Viczian」
	- 位置：40-RESOURCES/Zsolt Viczian.md，父级：[[知识内化]]（MOC-知识内化）
- [2026-07-31] ingest | 新建 person「尤雨溪」
	- 位置：40-RESOURCES/尤雨溪.md，父级：[[Vue]]
- [2026-07-31] refactor | 全库去重与 content-type 规范修复
	- 合并归档 7 组重复/残桩笔记至 50-ARCHIVE（类比思维、广度优先搜索、Web存储、Web通信、前端监控、赢学@ds、Element.closet）
	- 判定 知识组织概述/原则/方法、网络协议+网络协议相关问题 为互补保留
	- 修复 14 个 content-type 违规（大写 MOC / mco / method / tool / 模板残留 → 规范类型）
- [2026-07-31] refactor | 领域/角色边界归位（严格按 content-type）
	- 迁出至 40-RESOURCES：知识获取/组织/分享/内化、经过验证的高信噪比信源、MOC-时政、MOC-神秘主义、Claude Code
	- 迁入 A-前端：浏览器、JavaScript、TypeScript（area 类型）
	- 修双前缀别名（知识内化/政治经济/Claude Code）、补迁出 MOC 的 up、修悬空 up（人工智能）
- [2026-07-31] ingest | 新建 area「求职」+ moc「哲学与认知」
	- 位置：20-AREAS/A-求职/求职.md（收拢面试题库/算法/职业规划 MOC 集群）
	- 位置：40-RESOURCES/MOC-哲学与认知.md（存在论/认识论/思维方法论/认知心理学/哲学人物）
- [2026-07-31] refactor | 重建 wiki-index
	- 头部计数对齐真实状态（Areas 14 / MOCs 45 / SOPs 70 / Terms 119 / Comparisons 15 / Records 3）
	- 删内部重复条目、悬空 [[MOC-政治经济]]、笔误；补 A-求职 / MOC-哲学与认知 / 前端子领域

#### 2026-07-28

- [2026-07-28] ingest | 新建 concept「软件工程三大基石」
		- 位置：40-RESOURCES/软件工程三大基石.md
		- 父页面：[[软件工程]]
		- 更新：wiki-index（Concepts > 软件工程 新增条目）
- [2026-07-28] archive | 移除 area「软件工程」
		- 位置：20-AREAS/软件工程.md
		- 原因：文件已删除，恢复 moc 版本位于 40-RESOURCES/软件工程.md
- [2026-07-28] update | 更新 moc「软件工程」(新增核心原则、知识网络章节)
		- 位置：40-RESOURCES/软件工程.md
		- 变更：新增核心原则、知识网络章节，up: [[前端开发]]
- [2026-07-28] refactor | 软件工程 moc → area
		- 位置：20-AREAS/软件工程.md
		- 变更：moc → area，aliases: MOC-软件工程 → A-软件工程
		- 更新：wiki-index（MOCs → Areas）
- [2026-07-28] refactor | 设计模式 concept → term
		- 位置：40-RESOURCES/设计模式.md
		- 变更：concept → term，aliases: C-设计模式 → T-设计模式
		- 更新：wiki-index（添加 Terms 条目）
- [2026-07-28] refactor | 设计模式 term → moc
		- 位置：40-RESOURCES/设计模式.md
		- 变更：term → moc，aliases: T-设计模式 → MOC-设计模式，status: active → cultivating
		- 更新：wiki-index（Terms → MOCs）
- [2026-07-28] refactor | 设计模式 MOC 新增知识网络章节
		- 位置：40-RESOURCES/设计模式.md
		- 变更：新增知识网络章节，关联 软件工程/SOLID原则/重构/面向对象编程
		- 更新：wiki-index（条目已存在，description 不变）
- [2026-07-28] ingest | 新建 area「软件工程」
		- 位置：20-AREAS/软件工程.md
		- 父页面：无（顶层 Area）
		- 更新：wiki-index（Areas 条目已存在，内容充实）
- [2026-07-28] ingest | 新建 term「工厂模式」
		- 位置：40-RESOURCES/工厂模式.md
		- 父页面：[[设计模式]]
		- 更新：wiki-index（Terms > 设计模式 新增条目）
- [2026-07-28] ingest | 新建 term「建造者模式」
		- 位置：40-RESOURCES/建造者模式.md
		- 父页面：[[设计模式]]
		- 更新：wiki-index（Terms > 设计模式 新增条目）
- [2026-07-28] ingest | 新建 term「装饰器模式」
		- 位置：40-RESOURCES/装饰器模式.md
		- 父页面：[[设计模式]]
		- 更新：wiki-index（Terms > 设计模式 新增条目）
- [2026-07-28] ingest | 新建 term「组合模式」
		- 位置：40-RESOURCES/组合模式.md
		- 父页面：[[设计模式]]
		- 更新：wiki-index（Terms > 设计模式 新增条目）
- [2026-07-28] ingest | 新建 term「适配器模式」
		- 位置：40-RESOURCES/适配器模式.md
		- 父页面：[[设计模式]]
		- 更新：wiki-index（Terms > 设计模式 新增条目）
- [2026-07-28] ingest | 新建 term「策略模式」
		- 位置：40-RESOURCES/策略模式.md
		- 父页面：[[设计模式]]
		- 更新：wiki-index（Terms > 设计模式 新增条目）
- [2026-07-28] ingest | 新建 concept「SOLID 原则」
		- 位置：40-RESOURCES/SOLID 原则.md
		- 父页面：[[软件工程]]
		- 更新：wiki-index（Concepts > 软件工程 新增条目）
- [2026-07-28] ingest | 新建 concept「重构」
		- 位置：40-RESOURCES/重构.md
		- 父页面：[[软件工程]]
		- 更新：wiki-index（Concepts > 软件工程 新增条目）
- [2026-07-28] ingest | 新建 concept「面向对象编程」
		- 位置：40-RESOURCES/面向对象编程.md
		- 父页面：[[软件工程]]
		- 更新：wiki-index（Concepts > 软件工程 新增条目）
- [2026-07-28] update | 更新 concept「单例模式」(添加 up: 设计模式)
		- 位置：40-RESOURCES/单例模式.md
		- 变更：添加 up: ["[[设计模式]]"]
		- 更新：wiki-index（Concepts > 软件工程 新增条目）
- [2026-07-28] update | 更新 term「观察者模式」(修复 frontmatter, 添加 up: 设计模式)
		- 位置：40-RESOURCES/观察者模式.md
		- 变更：修复 tags 引号问题，添加 up: ["[[设计模式]]"]
		- 更新：wiki-index（Terms > 设计模式 新增条目）

#### 2026-07-27

- [2026-07-27] ingest | 新建 moc「软件工程」
		- 位置：40-RESOURCES/软件工程.md
		- 父页面：无（独立顶层 MOC）
- [2026-07-27] ingest | 消化 Inbox 素材（3篇）
	- 新建 [[ML求职面试指南]] — 从 ML Job Interviews The Ultimate Guide 提炼
	- 更新 [[使用Claude Code进行大型代码迁移]] — 追加业务场景判断和最佳实践
	- 更新 [[Vue3 混合文件夹结构]] — 追加核心原则和方案对比

#### 2026-07-25

- [2026-07-25] refactor | Vue3 混合文件夹结构 concept → sop
		- 位置：40-RESOURCES/Vue3 混合文件夹结构.md
		- 变更：concept → sop，aliases: C- → SOP-
		- 更新：Vue.md（关键领域 → SOP 章节）、wiki-index（Concepts → SOPs）
		- 来源：_resources/How I Build Vue 3 Applications (Part 1) Why I Use a Hybrid Folder Structure/
- [2026-07-25] ingest | 新建 concept「Vue3 混合文件夹结构」
		- 位置：40-RESOURCES/Vue3 混合文件夹结构.md
		- 父页面：[[Vue]]
		- 来源：_resources/How I Build Vue 3 Applications (Part 1) Why I Use a Hybrid Folder Structure/
		- 核心观点：根目录按技术职责划分，内部按业务领域分组，兼顾可维护性与可发现性

#### 2026-07-21

- [2026-07-21] ingest | 新建 atomic「UI本质上是状态的函数」
		- 位置：30-Zettelkasten/UI本质上是状态的函数.md
		- 父页面：[[为什么社区更倾向函数组件]]
		- 核心观点：UI 是状态到视图的映射函数 `UI = f(state)`，函数组件比 Class 组件更贴近这一模型
- [2026-07-21] ingest | 新建 question「为什么更倾向函数组件」
		- 位置：40-RESOURCES/为什么更倾向函数组件.md
		- 父页面：[[React面试题|MOC-React面试题]]
		- 覆盖 4 个答案（认知负担、Hooks 优势、官方方向、TypeScript 契合）+ 探索路径与待验证点

#### 2026-07-20

- [2026-07-20] ingest | 新建 sop「使用Claude Code进行大型代码迁移」
	- 位置：40-RESOURCES/使用Claude Code进行大型代码迁移.md
	- 父页面：[[知识获取]]
	- 覆盖 Anthropic 的 6 步骤迁移流程（规则手册→压力测试→批量翻译→编译→冒烟测试→行为匹配）+ Bun Zig→Rust 百万行迁移与 Python→TypeScript 16.5 万行迁移实战
- [2026-07-20] ingest | 新建 question「如何进行代码重构？」
	- 位置：40-RESOURCES/如何进行代码重构？.md
	- 父页面：[[前端开发]]
	- 覆盖三种重构策略（绞杀者模式/由外到内/大爆炸式）+ 探索路径与待验证点

#### 2026-07-17

- [2026-07-17] refactor | 重写「Claude Code」area → concept
	- 位置：20-AREAS/A-人工智能/Claude Code.md
	- 变更：area → concept，新增核心命题/运行机制/适用范围/知识图谱
	- 保留：核心要素八项能力组件
	- 更新：wiki-index（Areas → Concepts）
- [2026-07-17] ingest | 新建 sop「使用Claude Code自动化CI/CD流水线」
	- 位置：40-RESOURCES/SOP-使用Claude-Code自动化CI-CD流水线.md
	- 父页面：[[Claude Code]]、[[CI-CD流程]]
	- 覆盖 Headless 模式配置、GitHub Actions 集成示例、常见坑点
- [2026-07-17] refactor | 合并笔记类型规范，消除 3 处冗余
	- 新建 _笔记类型规范.md 作为类型规范的唯一可信源
	- 更新 Guide/元数据规范.md、命名规范.md、本库常见问题解答汇总.md 引用新规范，移除重复内容
	- 更新 _content-type-rules.md、_skills-overview.md、llm-wiki-schema.md 指向新规范
	- 归档快速开始.md（内容已被其他 Guide 覆盖）

#### 2026-07-13

- [2026-07-13] ingest | 新建 roadmap「Angular版本演进」
	- 位置：40-RESOURCES/Angular版本演进.md
	- 父页面：[[Angular]]
	- 覆盖 AngularJS 到 v22 五代架构演进路线图
- [2026-07-13] ingest | 新建 concept「Zoneless变更检测」
	- 位置：40-RESOURCES/Zoneless变更检测.md
	- 父页面：[[Angular]]

#### 2026-07-12

- [2026-07-12] inbox-review | 移动 2 篇 ECMAScript 文章到 BLOGS
	- What's new in ECMAScript 2025.md → 60-BLOGS/
	- What's new in ECMAScript 2026.md → 60-BLOGS/
	- 更新 front matter（移除 clippings 标签，添加 article/content-type/category/up）
- [2026-07-12] ingest | 新建 term「Math.sumPrecise」— ES2026 精确求和
	- 位置：40-RESOURCES/Math.sumPrecise.md
	- 父页面：[[ES2026]]
- [2026-07-12] ingest | 新建 term「Map.getOrInsert」— ES2026 Map upsert
	- 位置：40-RESOURCES/Map.getOrInsert.md
	- 父页面：[[ES2026]]
- [2026-07-12] ingest | 新建 term「Iterator.concat」— ES2026 迭代器串联
	- 位置：40-RESOURCES/Iterator.concat.md
	- 父页面：[[ES2026]]
- [2026-07-12] ingest | 新建 term「JSON.rawJSON」— ES2026 JSON 源文本访问
	- 位置：40-RESOURCES/JSON.rawJSON.md
	- 父页面：[[ES2026]]
- [2026-07-12] ingest | 新建 term「Promise.try」— ES2025 Promise 统一包装
	- 位置：40-RESOURCES/Promise.try.md
	- 父页面：[[ES2025]]
- [2026-07-12] ingest | 新建 term「Set 原型方法」— ES2025 集合运算
	- 位置：40-RESOURCES/Set 原型方法.md
	- 父页面：[[ES2025]]
- [2026-07-12] ingest | 新建 term「RegExp.escape」— ES2025 正则转义
	- 位置：40-RESOURCES/RegExp.escape.md
	- 父页面：[[ES2025]]
- [2026-07-12] ingest | 新建 comparison「Array.fromAsync() vs Promise.all()」
	- 位置：40-RESOURCES/Array.fromAsync() vs Promise.all().md
	- 父页面：[[JavaScript]]
- [2026-07-12] ingest | 更新 concept「ES2026」补充缺失特性
	- 新增：Math.sumPrecise、Iterator.concat、JSON.rawJSON、Map.getOrInsert
	- 更新：运行机制 mermaid、应用场景、知识图谱
- [2026-07-12] ingest | 更新 term「ES2025」补充正确特性
	- 新增：Duplicate Named Capturing Groups、Set 方法、Pattern Modifiers、Import Attributes、Promise.try、Float16Array、RegExp.escape
	- 更新：特性表格

### 2026-08

#### 2026-08-02

- [2026-08-02] ingest | 新增 roadmap「Vue版本演进」
	- 位置：40-RESOURCES/Vue版本演进.md
	- 父页面：[[Vue]]
- [2026-08-02] ingest | 新增 concept「Vapor Mode」
	- 位置：40-RESOURCES/Vapor Mode.md
	- 父页面：[[Vue]]
- [2026-08-02] ingest | 新增 concept「Vue编译器优化」
	- 位置：40-RESOURCES/Vue编译器优化.md
	- 父页面：[[Vue]]
- [2026-08-02] refactor | Anki 集成子系统落地，新增 _anki-sync-rules
	- 新建规范：00-META/Specification/_anki-sync-rules.md（content-type: article，Anki 集成规则）
	- 接入引用：llm-wiki-schema（详细规则列表）、_skills-overview、本库子系统概述、wiki-index（Meta 分区）
- [2026-08-02] refactor | _anki-sync-rules 补充 Deck 分类原则与前端面试示例
	- 变更：新增「Deck 分类原则」（deck 是调度容器非知识索引，少量 deck + 主题子 deck，不复制 PARA/MOC 目录）、「实践示例：前端面试复习」（deck 结构 / 卡片优先级表 / 手写代码卡注意点）
	- 引用：[[MOC-前端面试知识清单]]（70/20/10 精力分配）

#### 2026-08-01

- [2026-08-01] refactor | 孤儿笔记修复：126 个孤儿接入父级（双向链接）
	- 检测：40-RESOURCES 与 20-AREAS 中无内容入链的页面，共 126 个孤儿、143 个弱连接
	- 孤儿侧：为 123 个孤儿补充 `up` 字段指向父级（3 个跳过：已挂载/无父级）
	- 父级侧：为 33 个父级页面补充反向引用（MOC/area/concept 的对应章节）
	- 顺带修正死链：网络协议 Q- 前缀错链 ×3、Tailwind CSS→TailwindCSS、类型守卫大小写、SOP-在React中正确使用Ref 空格差异
	- 结果：126 个孤儿全部获得入链，孤儿数为 0

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
- [2026-06-17] ingest | 创建 concept「Angular依赖注入」
	- 位置：40-RESOURCES/Angular依赖注入.md
	- aliases：C-Angular-依赖注入
	- 父页面：[[Angular|A-前端/Angular]]
	- 覆盖注入器树层级（root/module/component）+ 3 种注册方式 + 4 种提供者语法 + 令牌类型
- [2026-06-17] ingest | 创建 concept「控制反转」
	- 位置：40-RESOURCES/控制反转.md
	- aliases：C-控制反转
	- 父页面：[[设计模式]]
	- 覆盖 4 种实现方式（DI/模板方法/策略/事件）+ IoC vs DI 关键区别
	- 修复 2 处断链：[[依赖注入]]、[[Angular依赖注入]] 中的 [[控制反转]] 引用
- [2026-06-19] ingest | 创建 atomic「权力是资源分配的核心驱动力」
	- 位置：30-ZETTELKASTEN/权力是资源分配的核心驱动力.md
	- 父页面：[[政治经济|MOC-政治经济]]
	- 覆盖 5 个论据：市场规则/预算博弈/注意力经济/公共财政/稀缺性制造
- [2026-06-19] ingest | 创建 atomic「权力的日常形态是共识，终极担保是暴力」
	- 位置：30-ZETTELKASTEN/权力的日常形态是共识，终极担保是暴力.md
	- 父页面：[[政治经济|MOC-政治经济]]
	- 论据覆盖韦伯/阿伦特/日常体验/征税逻辑/暴力-共识反比关系
- [2026-06-19] ingest | 消化 2 条政治经济原子笔记到 Wiki 层
	- 更新 A-政治经济 原子洞见：纳入 [[权力的日常形态是共识，终极担保是暴力]]
	- 更新 MOC-政治经济：新增「原子洞见」章节，收录 2 条 atomic
	- 父页面：[[政治经济|MOC-政治经济]]、[[政治经济|A-政治经济]]
- [2026-06-19] refactor | A-前端 Area 架构重构 + 冗余合并
	- 合并 A-前端.md → 前端开发.md（A-前端 已作为 alias）
	- 删除 A-前端.md，保持单一顶层 Area：前端开发
	- 降级 4 个子 Area 为 MOC → 40-RESOURCES：前端工程、前端交互、前端性能优化、算法与数据结构
	- 迁移 6 个框架/工具 Area 为 Concept → 40-RESOURCES：Angular、React、Vue、CSS、ThreeJS、Web安全
	- 更新 wiki-index（Areas → 前端 精简，新增 Concepts/MOCs 条目）
- [2026-06-19] refactor | 20-AREAS 全面审计修复 + A-知识管理重构
	- 重命名 6 个 area 文件（去掉文件名中 A- 前缀）：个人成长、个人博客、时间管理、健康管理、知识管理、宗教与神秘学
	- 修正 3 个 MOC title 前缀（MOC-政治经济→政治经济，MOC-时政→时政，MOC-神秘主义→神秘主义）
	- 补齐 3 个 MOC aliases 缺失的 MOC- 前缀
	- 删除重复文件：A-视觉思维.md
	- 修复 A-宗教与神秘学 缺失的 content-type 字段
	- 修复 3 处 broken up 字段（个人博客→A-个人成长，个人成长/健康管理 设为顶层）
	- 视觉思维(area) → concept，迁移到 40-RESOURCES
	- 更新 wiki-index
- [2026-06-20] ingest | 创建领域 A-设计
	- 位置：20-AREAS/A-设计/设计.md
	- 整合已有概念：视觉设计、视觉设计原则、色彩心理学、设计系统与组件库工程实践
	- 为 4 个概念笔记添加 up: [[A-设计]]
	- 标记 5 个待创建概念：排版基础、布局系统、交互设计模式、无障碍设计、Figma
- [2026-06-20] ingest | 创建概念「色彩理论」C-色彩理论
	- 位置：40-RESOURCES/色彩理论.md
	- 父页面：[[A-设计]]
	- 覆盖色彩模型（RGB/CMYK/HSL）、配色模式（互补/类似/三等分/四边形）、感知理论、实用法则
	- 更新 A-设计 核心心智模型
- [2026-06-20] ingest | 创建 atomic「习惯由触发、行为、奖励构成」
	- 位置：30-ZETTELKASTEN/习惯由触发、行为、奖励构成.md
	- 父页面：[[A-个人成长]]
	- 核心观点：习惯回路三要素（Cue→Routine→Reward），改变习惯是替换行为而非消除
	- [2026-06-20] ingest | 创建概念「否定之否定」C-否定之否定
		- 位置：40-RESOURCES/否定之否定.md
		- 父页面：[[政治经济|A-政治经济]]
		- 覆盖三阶段模型（肯定→否定→否定之否定）、螺旋上升运行机制、与形而上学发展观的对比
		- 关联：[[反者道之动]]、[[形而上学]]、[[逻辑学]]
	- [2026-06-20] ingest | 创建 atomic「否定是扬弃，既克服又保留」
		- 位置：30-ZETTELKASTEN/否定是扬弃，既克服又保留.md
		- 父页面：[[否定之否定]]
		- 核心观点：辩证否定不是全盘抛弃，而是"扬弃"——克服局限性，保留合理成分
		- 更新 否定之否定 核心命题引用该 atomic

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
- [2026-06-24] ingest | 创建 Q-note「在响应式对象频繁更新的场景下如何减少不必要的响应式开销？」
	- 位置：40-RESOURCES/在响应式对象频繁更新的场景下如何减少不必要的响应式开销？.md
	- 父页面：[[A-前端]]
	- 覆盖 4 套策略（框架选型、React 优化、Vue 优化、通用策略）+ 探索路径
- [2026-06-24] ingest | 创建 atomic「本体论承诺决定了理论的解释力」
	- 位置：30-ZETTELKASTEN/本体论承诺决定了理论的解释力.md
	- 父页面：[[本体论]]
	- 核心观点：任何理论都需要承诺实体存在，承诺范围决定解释边界
- [2026-06-24] ingest | 创建 atomic「存在是最普遍的概念，不能被定义，只能被描述」
	- 位置：30-ZETTELKASTEN/存在是最普遍的概念，不能被定义，只能被描述.md
	- 父页面：[[本体论]]
	- 核心观点：存在是最高的范畴，没有上位概念，只能被描述
- [2026-06-24] ingest | 创建 concept「本体论」
	- 位置：40-RESOURCES/本体论.md
	- 父页面：[[形而上学]]
	- 覆盖核心命题/运行机制/关键区别/适用范围/批判/知识图谱
	- 更新：wiki-index Concepts 章节新增本体论、形而上学、存在条目
	- 位置：40-RESOURCES/Svelte vs React.md
	- 父页面：[[前端框架]]
	- 覆盖架构哲学/响应式机制/DOM 更新/组件模型/状态管理/生命周期/TypeScript/生态 8 维对比
	- 更新：wiki-index 断裂链接[[Svelte vs React]] 已恢复
- [2026-06-27] ingest | 创建 concept「实现一个带并发限制的异步任务调度器」
	- 位置：40-RESOURCES/实现一个带并发限制的异步任务调度器（Scheduler）.md
	- 父页面：[[MOC-前端面试真题库]]
	- 覆盖 3 种实现（Class 封装 / 函数式 Worker / 信号量）+ 常见追问

#### 2026-06-28

- [2026-06-28] ingest | 创建 3 个 LLM 核心参数术语笔记
	- 新建：[[上下文窗口]] — LLM 的令牌处理能力上限
	- 新建：[[温度]] — 控制 LLM 输出随机性的采样参数
	- 新建：[[Top-P]] — 动态截断采样的解码策略
	- 父页面：[[LLM]]（已添加到知识图谱子级概念）
	- 更新：[[wiki-index]] Terms 分类新增 AI 子分类
	- 更新：[[A-人工智能]] 核心概念补充描述
	- 位置：40-RESOURCES/

#### 2026-06-23

- [2026-06-23] lint | full 健康检查
	- 检查范围：30-ZETTELKASTEN、40-RESOURCES、20-AREAS
	- **矛盾**：0 个
	- **孤儿页面**：0 个
	- **概念缺口**：3 个
		- [[数字花园概述]] (3x) — 原子笔记引用，但文件实际为 `数字花园.md`（别名无"数字花园概述"）
		- [[localStorage]] (2x) — 无专用 term 页面
		- [[Scope]] (2x) — 无专用页面
	- **半缺口**：1 个（[[变量提升]] (3x) — 有对应文件但无"变量提升"别名）
	- **过时断言**：0 个
	- **索引断裂链接**：3 个
		- [[MOC-政治经济]] — 6/19 refactor 已删除，`政治经济.md` 未包含该别名
		- [[MOC-动画效果SOP]] — 页面不存在
		- [[Svelte vs React]] — 页面不存在（上次 lint 已知）
	- **归档引用**：无
	- **预警**：无（均在安全线内）

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
- [2026-06-19] ingest | 消化 2 条政治经济原子笔记到 Wiki 层
		- 更新 A-政治经济 原子洞见：纳入 [[权力的日常形态是共识，终极担保是暴力]]
		- 更新 MOC-政治经济：新增「原子洞见」章节，收录 2 条 atomic
		- 父页面：[[政治经济|MOC-政治经济]]、[[政治经济|A-政治经济]]
