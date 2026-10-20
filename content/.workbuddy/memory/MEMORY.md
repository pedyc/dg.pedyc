# 项目长期记忆（dg.pedyc / llm-wiki）

## 核心原则（用户明确约定，必须遵守）

### 1. 断链 ≠ 错误，而是「未掌握完全的知识」
- 知识库中的 `[[断链]]` 不是 bug，而是标记了「这个洞见我认可了、引用了，但还没提炼成 atomic 掌握」。
- 从断链提炼 atomic 是在「消化」这些悬而未决的知识，批量创建 atomic 只是副产品，本质是补全知识。
- 因此「断链扫描 → 提炼 atomic」是持续可做的知识治理动作，不是一次性修复。

### 2. 40-ARCHIVE 是「免维护区」（垃圾场）
- 归档目录只管往里丢过期/废弃的笔记，**不关心 content-type 是否规范**。
- 不要花精力去规整 40-ARCHIVE 里的 content-type、frontmatter 格式等——那是浪费。
- 之前把 6 篇算法题/提示词从 atomic 改成 record 是多余动作，以后不再做。

### 3. 内容/包装二维分工
- 人类管「内容」（洞察、理解），AI 管「包装」（frontmatter、uid、up、aliases、交叉引用、index）。
- 按职责划分，不按目录划分。

### 4. atomic 的本质
- atomic = 有信息增量的陈述句洞见，标题即观点。
- 论据归 concept，atomic 只存结论。
- 靠 concept 的「核心命题」段 + MOC 索引挂载。

### 5. 20-AREAS 边界（领域容器规则）
- 一个领域 = 一个目录 = 一份 area 笔记。目录是「责任领域」的容器，不是「同类文件的堆」。
- 判断口诀：「领域问『我负责什么』（→area 放 20-AREAS），知识问『我懂什么』（→concept/term/question 放 30-RESOURCES，用 up 挂回领域）」。
- 一个领域目录通常只有 1 份 `XX.md`（area 本身）+ `_resources/`。`A-知识管理` 只有一份 `知识管理.md` 是正常的。
- 已固化到 `Truth/本库目录结构.md` 的「20-AREAS 边界（领域容器规则）」小节。

### 6. 用户写作习惯
- 10-PROJECTS：项目制，围绕项目的文件全丢进 `P-XXX/`，结束后再消化/归档。
- 治理成本原则：**「先不管遗留，遇到再改」**——不要为了「目录整洁」专门花一轮成本去搬历史遗留文件，等自然遇到时顺手改。

## 技术约定

- 真值表在 `00-META/Truth/`（目录结构、笔记类型规范、命名规范、元数据规范、标签规范、人机分工规范、真值索引）。
- 合法 content-type：atomic→50-ZETTELCASTEN；concept/term/sop/question/comparison/record/roadmap/person/moc→30-RESOURCES；article→60-BLOGS 或 00-META 元文档。
- 新字段 `content-type:`，旧字段 `type:` 是历史遗留（扫描时两个都查）。
- yanki 识别：`~~挖空~~`→Cloze 卡片；孤立 `---`→Basic 分隔符（需避免）；`noteId` 字段自动添加勿删。
- Templater 只认 `<% %>`，不认 `{{ }}`；Linter 的 `lintOnSave` 不走 foldersToIgnore，模板保护靠 filesToIgnore。
- dataviewjs 的 DataArray 无 reduce/find，用 flatMap/first。
- 双副本：活跃 `D:\Workspace\pedyc\dg,pedyc\content`，旧副本 `D:\Workspace\pedyc\site\apps\dg\content`。
