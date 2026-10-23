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

- **`quadrant` / `energy-type` 是僵尸字段**（2026-10-23 实测）：`10-PROJECTS` 里 `content-type: project` 只有 2 篇，`consequence`/`urgency`/`expire` 各 2 篇（填了），而 `quadrant` 与 `energy-type` **0 篇**——只在模板、40-ARCHIVE 和 copilot 示例里出现。规律：需要二次推导的字段会被放弃，直观数字会被填。故 `quadrant` 应由 `consequence × urgency` 派生而非手工维护；`energy-type` 属日程层，不进 project 字段。

- **Bases 看板（kanban）做法**（Obsidian 1.14+ 原生 `type: kanban`）：一卡 = 一文件，故清单类内容要转看板必须先拆成独立笔记；分列属性**不可用 `status`**（保留给笔记生命周期），改用业务属性如 `play_status`；视图里显式写 `groupOrder` 列出全部列，否则只有有值的列会渲染；属性引用统一用 `note.` 前缀（也规避了 `content-type` 这类带连字符标识符的表达式解析问题）。
- **base 的组织形态：用户明确偏好「md + 独立 .base 文件」**，不要用 md 内的 ```base 内联代码块（曾按内联方案做过一版被否）。理由：独立 `.base` 能用图形界面调视图，且 `![[xx.base]]` 可直接嵌进别的笔记；而笔记再被嵌入时二级 base 不渲染。
- **base 的 `formulas` 用法**（真实语法出处 help.obsidian.md/bases/functions）：`formulas:` 是**顶层键**（非 view 内），定义为表达式字符串，视图里用 `formula.<名>` 引用，公式之间可互引（不可循环）。`if()` 支持 3 参；`== null`、`||`、JS 语义均可用。**关键坑：JS 里 `number + null === 5`，空属性不守卫会被当 0 静默计入**，求和前须 `if(x == null, null, ...)` 判空。派生值一律走 formula，不落 frontmatter（与「quadrant 不落库」同一原则）。
- **信源库结构（2026-10-23 起）**：`30-RESOURCES/信源/` 一源一卡（content-type: record，`aliases: R-源名`），`99-ASSETS/Bases/信源.base` 按 `verify_status`（待验证 / 已验证）分列。字段：`source_type` / `verify_status` / `source_risk` / 五维 `density`·`timeliness`·`depth`·`uniqueness`·`output_rate`（1-5）。
- **`source_risk` 的意义（不要删）**：五维评分量的全是「信息供给量」，**没有一维量「信息保真度」**，故阴谋论源与立场型源都能拿 3/3/4 稳定落在 B 级「观察」。`source_risk` 取 `无 / 推演型 / 立场型`，**不参与总分与评级**，回答的是「这条信息能拿来做什么」：推演型只能当假设种子，转译必须走 `question` 而非 `atomic`（atomic 标题即主张，阴谋论一旦成 atomic 就静默变成「你相信的东西」）；立场型只能当对立视角对冲，须成对消费。
- **本库 git 仓库根在上一级** `D:/Workspace/pedyc/dg,pedyc`，vault 只是其中的 `content/`。根 `.gitignore` 已存在且**含忽略 `.gitignore` 自身的规则**（第 3 行），因此不要在 vault 内新建 .gitignore——改根文件。另：`.obsidian/` 被根忽略但其中若干文件已被跟踪，`git add` 需 `-f`。
- **`status` 只允许 3 个值**：fleeting / active / archived（2026-10-23 由 5 值收窄，`cultivating` 与 `completed` 并入 `active`，改写 344 篇）。历史上存在大量脏值（seed/sprout/evergreen/emoji/YCTODO 等），同日已清理 28 处；常驻巡检视图 `99-ASSETS/Bases/元数据巡检.base`。40-ARCHIVE 按免维护原则保留旧值（31 处）。仍有约 277 篇缺该字段。

- **顶层目录结构（2026-10-23 起）**：`00-INBOX`（捕获篮，唯一入口）→ `01-META`（系统元数据）→ 10-PROJECTS / 20-AREAS / 30-RESOURCES / 40-ARCHIVE / 50-ZETTELCASTEN / 60-BLOGS / 80-PRIVATE / 90-DIARY / 99-ASSETS。原 `00-META` 已更名 `01-META`，原 `30-RESOURCES/Inbox` 已提升为顶层 `00-INBOX`。
- **前缀语义（真值见 `01-META/Truth/本库目录结构.md`）**：十位 = 档位（0x 系统入口 / 1x 现在 / 2x 长期 / 3x 参考 / 4x 退役 / 5x 沉淀 / 6x 输出 / 8x 私密 / 9x 附属），个位 = 档内序号；**宽度统一 2 位**，禁止 `000-`/`010-` 混用；`_` 前缀 = 非知识工件（模板/脚本/附件）；留空档位即预留（7x 空着）。
- **00-INBOX 不计入知识资产**：Inbox 是未加工原料，不参与沉淀统计（日记「今日知识资产沉淀」的排除条件为 `-"01-META" and -"_templates" and -"00-INBOX"`，21 篇日记 + 模板）。只有完成 ingest 迁出的内容才算沉淀。
- 改顶层目录名的坑：Obsidian 运行时 `git mv` 整目录会 Permission denied，用 `robocopy /MOVE` + `git add -A`（仍识别 rename）。
- **目录与 content-type 已解耦（2026-10-23）**：归属由目录决定、形态由 content-type 决定，两者**互不推导、不做一致性校验**。旧「目录↔类型一一映射」与「特定型/通用型」规则已废止。`project`/`area` 收窄为「工作区主页」角色；`10-PROJECTS`/`20-AREAS` 是工作区/容器，**形态不限**（项目里出现 concept/question 不是错位）。唯一方向性约束：三个单形态目录 `50-ZETTELCASTEN`→atomic、`60-BLOGS`→article、`90-DIARY`→diary。
- 真值表在 `01-META/Truth/`（目录结构、笔记类型规范、命名规范、元数据规范、标签规范、人机分工规范、真值索引）。
- **命名规则按对象分三层，各有唯一真值**：目录名 → `Truth/本库目录结构`「前缀语义」；文件名 + `aliases` → `Truth/文件名与别名规范`（2026-10-23 由 `命名规范.md` 改名，旧名保留为 alias）；`atomic` 标题须为陈述句 → `Truth/笔记类型规范`（形态特征，不属命名规则）。
- **Guide/ 下不得存在与 Truth/ 同名的文件**：曾有过 `Guide/命名规范.md`、`Guide/元数据规范.md` 两个僵尸副本，导致 `[[命名规范]]` 等链接解析不可预测、锚点失效。Truth 建立后必须同步删除 Guide 旧版。
- 合法 content-type 共 14 种：atomic / concept / term / sop / question / comparison / record / roadmap / person / moc / area / project / article / diary。校验只看取值合法性 + 单形态目录，不看目录匹配。
- 新字段 `content-type:`，旧字段 `type:` 是历史遗留（扫描时两个都查）。
- yanki 识别：`~~挖空~~`→Cloze 卡片；孤立 `---`→Basic 分隔符（需避免）；`noteId` 字段自动添加勿删。**但 yanki 的同步范围只有 `50-ZETTELCASTEN`（data.json 的 folders 仅此一项），所以 `_templates` 与 30-RESOURCES 里的 `---` 不会触发切卡**——切卡风险只存在于 50-ZETTELCASTEN 内的笔记。另：`obsidian-to-anki-plugin` 装了但未启用。
- Templater 只认 `<% %>`，不认 `{{ }}`；Linter 的 `lintOnSave` 不走 foldersToIgnore，模板保护靠 filesToIgnore。
- **模板正文分隔线约定（2026-10-23）**：frontmatter 的 `---` 必需；正文只用 `---` 分隔 `##` 一级章节，`##` 与 `###` 之间不要加——否则三级标题被抬到与二级等权。现状 15 处（article/project/question 各 4/4/6 + moc 1）。
- **Templater 启动模板在 `_scripts/template_startup.md`，不在 `_templates/`**：放模板目录会被收进「插入模板」列表，误选即把当前笔记归档走。其路径登记在 `.obsidian/plugins/templater-obsidian/data.json` 的 `startup_templates`，移动文件必须同步改那里（插件按库内路径解析，不要求位于 templates_folder）。
- dataviewjs 的 DataArray 无 reduce/find，用 flatMap/first。
- 双副本：活跃 `D:\Workspace\pedyc\dg,pedyc\content`，旧副本 `D:\Workspace\pedyc\site\apps\dg\content`。
