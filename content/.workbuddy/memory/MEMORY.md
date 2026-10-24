# 项目长期记忆（dg.pedyc / llm-wiki）

> 只放「必须遵守的约定」与「反直觉的坑」。过程叙事、一次性数字、失效判断都在 `daily log` 里，不要往这里搬。

## 一、核心原则（用户明确约定）

1. **断链 ≠ 错误，是「未掌握完全的知识」**。`[[断链]]` 标记「引用了但还没提炼成 atomic」。故「断链扫描 → 提炼 atomic」是持续的治理动作，`01-META/Index/知识缺口.md`（断链医院）**永远不该被清空**——它是库的熵。
2. **40-ARCHIVE 免维护**。只管往里丢，不规整其 content-type、frontmatter、status。花精力规整归档区是浪费。
3. **内容/包装二维分工**：人管内容（洞察、理解），AI 管包装（frontmatter、uid、up、aliases、交叉引用、index）。按职责分，不按目录分。
4. **atomic 的本质**：有信息增量的陈述句洞见，标题即观点。论据归 concept，atomic 只存结论；靠 concept 的「核心命题」段 + MOC 挂载。**瘦身顺序：先读它的 up 概念，再删 atomic**——>500 字的 atomic 超出的部分几乎都能在 concept 里找到，删掉的是重复不是知识。常见形态错误：把「限定」（什么时候不成立）写成论据——那属于**边界**位，写进论据会越写越长。判据：这句话在支撑观点，还是在给观点划范围？
5. **20-AREAS 边界**：一个领域 = 一个目录 = 一份 area 笔记，是「责任领域」的容器而非同类文件堆。口诀：领域问「我负责什么」→area；知识问「我懂什么」→concept/term/question 挂 `up` 回领域。
6. **治理成本原则**：先不管遗留，遇到再改（=「即用即改」）。不为「目录整洁」专门跑一轮搬迁。**上游是「Less is More」，而这句话在本库只读作「维护动作的最小化」，不是内容少**——反证是库里 1220 篇。边界：它约束「无收益的动作」，不约束「有收益的动作」（判据=收益能否指认）。读法真值在 `01-META/Guide/本库设计原则` 第二节。
7. **用户写作习惯**：10-PROJECTS 项目制，相关文件全丢 `P-XXX/`，结束再消化归档。
8. **正文排版约定**：**中文不用斜体**（屏幕上不表达强调只降低可读性）；**加粗只留给真正的判断**（如 `**不要**`），「标签：内容」式加粗（`**工具**：` / `**现象**：` / `**反模式X**：`）一律降为纯文本——全篇 20 处加粗等于没有加粗，层级交给标题、有序列表和 ⛔🔧❓✅ 这类符号承载；引号统一中文「」，且**引号内外不留空格**（`" 图形与背景 "` 是排版事故）；**不写 LaTeX 箭头** `$\rightarrow$`，直接 `→`；中英混排括号用全角。

## 二、字段铁律

- **派生值一律走 formula / 脚本，不落 frontmatter**。总分、评级、quadrant、占比都是。理由：可派生的值手工维护必然不一致。
- **需要二次推导的字段必然被放弃**（实测结论，不是推测）：`quadrant` / `energy-type` 全库 0 篇；`status` 已确证并废除（见下条）。能填的只有「创建时一眼可见」的字段。凡是需要人定期回看内容才能填的字段，一律不设。
- **自定义章节名只有两种成分**：机制展开（工作原理 / 实现方式 / 属性值 / 条件清单 → 属 concept）和限定（注意事项 / 为什么需要 / 适用场景 → 属 `边界`）。各归各位后剩下的多半不够一个 `## 论据/示例`，所以这类篇的操作是「补边界」而非「删内容」。
- **定义式 atomic 不要搬到 concept**（concept 通常已有那份定义了），而是**改写成它能够断言的那一句**：`CORS是浏览器允许服务端控制跨域访问的机制` → `CORS的约束只在浏览器侧生效，服务端无法单方面实施`。旧标题进 `aliases`、`uid`/`noteId` 沿用、concept 的引用同步改。
- **`## 论据/示例` 下再套 `### 论据 / ### 示例 / ### 推论` 是固定病灶**：父标题本身就是多余的层，机械的 `###`→`##` 替换治不了，只能整篇重写成「观点 + 边界 + 一段论据」。判据：一个 atomic 只该有一个论据，出现 `### 论据` 通常意味着有 3-5 条。
- **`content-type` 必须纯字符串**。写 `[moc]` / `"concept"` 会被 YAML 解析成数组，`.base` 的 `content-type == "x"` 与 dataview 字符串比较**静默失效**（症状：视图什么都不显示，极难反查）。合法值 14 种：atomic / concept / term / sop / question / comparison / record / roadmap / person / moc / area / project / article / diary。旧字段 `type:` 是历史遗留，扫描两个都查。
- **`up` 必须写 `"[[x]]"`**。`up: [[x]]` 解析成嵌套列表 `[["x"]]`、`up: x` 是普通字符串，两者都拿不到链接且**不报错**。单父级用标量、多父级才用数组、无父级留空。根因曾是 `Truth/元数据规范` 自己教错了示例——**真值文档里的错误示例会稳定复制错误**。
- **`status` 字段已废除**（2026-10-24 用户拍板）。现无任何模板/base/脚本读它：阶段由目录表达（INBOX→RESOURCES→ZETTELCASTEN→ARCHIVE），新旧由 `file.mtime` 表达，「哪些卡住了」用 `99-ASSETS/Bases/笔记滞留与陈旧.base`。**不要加回来**，理由与实测证据在 `Truth/元数据规范`「为什么没有 status 字段」节。存量 913 篇字段保留不删（遇到再改），新代码/新视图不得依赖它。`validate_meta.py` 会在模板里发现 `status` 时报错。
- **信源卡字段**：`source_type` / `verify_status`（候选·待验证·已验证·已弃，一条生命周期而非并列标签）/ `source_risk`（无·推演型·立场型，**不参与总分**）/ `scored_at` / 五维 1-5。`description` 在此库承担「一句话结论」，故无独立 verdict 字段。四态里「已弃」不删卡片，留作历史基线。
- **`source_risk` 不要删**：五维量的全是信息供给量，**没有一维量信息保真度**，故立场型源也能拿 B 级。它回答「这条信息能拿来做什么」：推演型只能当假设种子，转译走 `question` 不走 `atomic`（atomic 标题即主张，阴谋论一旦成 atomic 就静默变成「你相信的东西」）。
- **`output_rate` 不设否决线**（用户判断）：它量「被转化成笔记的频率」不是价值。产出率 0 而总分 A/B 级反证其质量高（视野补充型，价值在改变判断框架）。判定顺序先总分、再看产出率。

## 三、目录与命名

- 顶层：`00-INBOX`（唯一入口，不计入知识资产）→ `01-META` → 10-PROJECTS / 20-AREAS / 30-RESOURCES / 40-ARCHIVE / 50-ZETTELCASTEN / 60-BLOGS / 80-PRIVATE / 90-DIARY / 99-ASSETS。`_` 前缀 = 非知识工件（模板/脚本/附件）。
- 前缀语义：十位 = 档位，个位 = 档内序号，**宽度统一 2 位**。真值在 `01-META/Truth/本库目录结构.md`。
- **目录与 content-type 已解耦**：归属由目录决定、形态由 content-type 决定，**互不推导、不做一致性校验**。唯一方向性约束：三个单形态目录 `50-ZETTELCASTEN`→atomic、`60-BLOGS`→article、`90-DIARY`→diary。
- **命名规则按对象分三层**：目录名 → `Truth/本库目录结构`；文件名 + aliases → `Truth/文件名与别名规范`；atomic 标题须为陈述句 → `Truth/笔记类型规范`。
- **Guide/ 下不得有与 Truth/ 同名的文件**（曾出现僵尸副本，导致链接解析不可预测）。
- 改顶层目录名：Obsidian 运行时 `git mv` 整目录会 Permission denied，用 `robocopy /MOVE` + `git add -A`（仍识别 rename）。

## 四、链接规范

- **链接一律用文件名，绝不用别名**：`[[闭包]]` 而非 `[[C-闭包]]`。别名只服务检索与语义提示。两条理由：① 别名随时该换，被依赖后改名即断链；② **别名甚至可能不存在**（实测 `[[A-宗教与神秘学]]` 被引 9 次而目标从未定义该别名）。
- **引用写法（2026-10-24 定，真值在 `Truth/文件名与别名规范`「引用写法」节）**：分界线是「被引用那句话在本库有没有文件」。
  - **本库格言（atomic 标题）→ 内联 `[[全句]]`，链接即引文**，不加引号、不复述、不加显示文本。三个引用位长度要求不同：`## 关联` 区不限（独占一行）；concept 核心命题段中等；正文里当论据（格言位）**≤14 字**。
  - **外来格言（Less is More、奥卡姆剃刀原话…）→ 直写 + 引号，绝不建链接**。理由是库自己的断链语义：`[[断链]]` = 「认可了但还没提炼成 atomic」，所以 `[[Less is More]]` 是一张永远不打算清偿的欠条。要让它有用，靠的是**把读法写下来**，不是链接。
  - 长度数据：229 篇 atomic 标题中位数 **22 字**——多数是「判断」（需要语境）不是「格言」（可脱语境）。嫌长别加显示文本，**改文件名**。
- **`[[标题|显示文本]]` 允许**，但与 `aliases` 严格区分：`aliases` 是文件属性（改一次影响全库、可能不存在），显示文本是单次引用的局部写法。文件名通顺就别加 `|`；表格内写 `\|`；若同一显示文本重复十几处，说明**文件名该改**。
- **改链接时不能碰的四类文件**：规范文档里的反例示例、`99-ASSETS/copilot/`（对话存档，改了等于篡改历史）、`.claude/`（配置示例）、`01-META/Log/`（流水日志）。
- 常驻检查：`python _scripts/validate_meta.py --all`（脏值）、`--links`（别名引用 / 假前缀引用 / up 写法）。
- **补 `up` 必须先校验目标真存在**（`_scripts/check_targets.py`）。实测凭印象写的父级名三个都不存在（`React Server Components` / `编译时与运行时` / `Vue3语法糖`），不校验就是用**一个新断链换掉一个空字段**。
- **清单里的篇数会过期，动手前先重扫**。原子笔记整理清单原写「up 为空 51 篇」，前三组改写 frontmatter 时顺手消掉 24 篇，实测只剩 27 篇。

## 五、脚本体系（详见 `01-META/Guide/本库脚本化.md`）

- **脚本价值只来自三样：收口 / 排序 / 校验**。不做自动补字段打标签、不做依赖「记得定期跑」的提醒、不做自动提炼 atomic。
- 分工：`_scripts/*.js` = Obsidian 运行时（`dv.view` 或 Templater）；`_scripts/*.py` = 终端批处理。
- 已有：`scorecard.js`（信源五维速览）、`areaBacklinks.js`（领域页反链分组）、`diaryPanel.js`（日记双面板，`input.part` 分派）、`weekPanel.js`（周记五段）、`brokenLinks.js`（断链医院）、`validate_meta.py`（校验，枚举从 Truth 现场解析不硬编码）、`stats.py`（生成 `01-META/Log/本库统计.md`）、`count_words.py`（剔除 frontmatter 与代码块的字数，瘦身复核）、`scan_orphan_atomic.py`（列 `up` 为空的 atomic）、`check_targets.py`（校验候选父级存在性）、`apply_up_mapping.py`（按写死映射补 `up`）。
- **`dv.view` 三条契约**（dataview 0.5.68，`main.js:18953`，`async view(name, input)`）：
  1. 逻辑放 `_scripts/<name>.js`，正文只留 `await dv.view("_scripts/x")`，路径不带 `.js`。
  2. **脚本内不能出现异步等待关键字**——dataview 用纯字符串匹配，注释里出现也会把整份文件包进 async IIFE，`return` 静默失效。
  3. 执行环境是 `new Function("dv","input",contents)`，**作用域里只有全局变量与这两个形参**：`app`/`moment` 不保证可见，日期比较用 ISO 字符串字典序，ISO 周手写。`input` 可当分派开关。
  4. 非空返回值会被 `renderValue` 二次渲染，**只靠 `dv.xxx` 渲染、不 return**。
- **`dv.pages("[[名字]]")` 不计别名**，是反查类查询的默认陷阱（实测领域页只显示 28 应为 82，82 条引用里 54 条走别名，整批静默丢弃无报错）。正确做法：遍历 `p.file.inlinks`，用去 `.md` 的路径精确比对 `dv.current().file.path`。
- **dataviewjs 可离线验证**：`new Function("dv", code)(stubDv)`，stub 提供 `current/table/paragraph` 并打印入参，node 直接跑。本库 `package.json` 有 `"type": "module"`，测试脚本要 `.cjs`。
- **本地统计 vs 全局指标**：全局指标（原子数/总数/占比）由 `stats.py` 一次算出写成 **dataview inline field**（`原子笔记 [atom_count:: 226] 篇`），别处用 `dv.page("01-META/Log/本库统计").atom_count` 读——全库唯一数据源。inline field 不进 frontmatter，绕开「派生值不落库」。

## 六、Bases

- **组织形态：md + 独立 `.base` 文件**（用户明确偏好），不要 md 内联 ```base 代码块。理由：独立文件可图形调视图、可 `![[xx.base]]` 嵌入；笔记再被嵌入时二级 base 不渲染。
- **filters 两个层级**：顶层 = 作用于全部视图；`views[]` 条目下 = 只作用于该视图。（信源库靠此让 `总览` 排除已弃、看板仍显示四列——「看板是生命周期全景，表是当前阅读清单」。）
- **`formulas` / `properties` 是顶层键**（非 view 内），视图里用 `formula.<名>` 引用，公式可互引。`if()` 支持 3 参。**坑：空属性在 JS 语义下被当 0 静默计入**，求和前须 `if(x == null, null, ...)`。列名中文化用 `properties: {x: {displayName: 中文}}`，中文不进表达式。
- **看板（kanban）**：一卡 = 一文件，清单类内容要转看板必须先拆成独立笔记；分列属性**不可用 `status`**，用业务属性（`play_status`/`read_status`/`apply_status`）；显式写 `groupOrder` 列全所有列，否则只渲染有值的列；属性引用统一 `note.` 前缀。
- **base 读不到别的笔记的字段**（一行 = 一个笔记，无法跨笔记取值），故它永远「产出清单」不「产出数字」。下钻用它，指标别用它。
- **零维护观测用 `file.ctime` / `file.mtime` 的 `.relative()`**（`笔记滞留与陈旧.base`）：文件系统时间不依赖任何字段、不可能漏记，比 `date-modified` 更根本（后者有 17 篇缺值）。formula **名用英文**、中文放 `properties.<名>.displayName`——中文 formula 名未验证。`file.inFolder()` 白名单列目录比「排除式 filter」可靠（已在元数据巡检实测）。

## 七、工具链坑

- **`git add` 的 pathspec 大小写会静默零命中**：索引记的是 `90-Diary`，实际写 `90-DIARY`，Windows 上两者都能访问但 pathspec **一条都匹配不上、不报错**，commit 照常「成功」。**提交后必须 `git show --stat` 核对文件清单**。
- git 仓库根在上一级 `D:/Workspace/pedyc/dg,pedyc`，vault 只是 `content/`。根 `.gitignore` 含忽略自身的规则（第 3 行），不要新建；`.obsidian/` 被忽略但部分已跟踪，`git add` 需 `-f`。
- **换行一律 LF**。**坑：python `pathlib.write_text()` 在 Windows 默认写 `\r\n`**，批量脚本必须 `write_bytes(b.replace(b"\r\n", b"\n"))` 或 `open(newline="")`。
- **shell 会吞反斜杠**：带正则/转义的扫描一律写成 `.py` 文件再执行，不要 `python -c`。
- **覆盖已存在文件前先看 `git status`**（用户可能同时在 Obsidian 里改）。
- yanki：`~~挖空~~`→Cloze，孤立 `---`→Basic 分隔符。**同步范围只有 `50-ZETTELCASTEN`**，别处的 `---` 不会切卡。`noteId` 自动添加勿删。
- Templater 只认 `<% %>`；Linter 的 `lintOnSave` 不走 foldersToIgnore，模板保护靠 filesToIgnore；Linter **不会**改 `up` 的写法。
- **模板正文分隔线**：`---` 只分隔 `##` 一级章节，`##` 与 `###` 之间不加（否则三级标题被抬到与二级等权）。
- **Templater 启动模板在 `_scripts/template_startup.md`**，不在 `_templates/`（放模板目录会被收进「插入模板」列表，误选即归档当前笔记）。路径登记在 `.obsidian/plugins/templater-obsidian/data.json` 的 `startup_templates`，移动必须同步改。
- 双副本：活跃 `D:\Workspace\pedyc\dg,pedyc\content`，旧副本 `D:\Workspace\pedyc\site\apps\dg\content`。
