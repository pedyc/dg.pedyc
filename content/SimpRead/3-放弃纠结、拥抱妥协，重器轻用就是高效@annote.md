---
title: "放弃纠结、拥抱妥协，重器轻用就是高效"
alias: 3-放弃纠结、拥抱妥协，重器轻用就是高效@annote
uid: 
author: 
description: 
date-created: 2024-09-11 21:11
date-modified: 2024-09-13 11:31
type: Simpread
banner: "https://cdn.sspai.com/2022/02/21/88f0c0c3d31e13ff8e8c004893de5394.png "
banner_icon: 🔖
created-date: 2022-09-24T16:36:20+0800
idx: 3
tag: []
tags: 
---

## 放弃纠结、拥抱妥协，重器轻用就是高效

> [!example]- [🧷内部链接](<http://localhost:7026/unread/3>) [🌐外部链接](<>)
> URI:: [🧷](<http://localhost:7026/unread/3>) [🌐](<>)
> intURI:: [🧷内部链接](<http://localhost:7026/reading/3>)

%%

> [!example]+ **Comments**
>
> ```dataview
> TABLE 
>     WITHOUT ID
>     link(Source, dateformat(date(Source), "yyyy-MM-dd")) as Date___, 
>     regexreplace(rows.Comments,"^@@\[\[.+?\]\]\s","") as "Comments"
> FROM "journals"
> WHERE  contains(cmnt, this.file.name)
> FLATTEN cmnt as Comments
> WHERE contains(Comments, this.file.name)
> GROUP BY file.link as Source
> SORT rows.file.day desc
> ```
>  **Description**:: 大家好，我是 Kenshin，简悦的作者，这次跟大家分享我对极简效率工作的一些理解，我接触效率相关的内容，与简悦的诞生有关：

简悦始于 2016 年…… 那时因为家里的一些事情，我解散了团队，注销了公司。
%%

> [!md] Metadata
> **标题**:: [放弃纠结、拥抱妥协，重器轻用就是高效](https://sspai.com/post/71576)
> **日期**:: [[2022-09-24]]

### Annotations

> [!srhl2] [[SR3@放弃纠结、拥抱妥协，重器轻用就是高效|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/3#id=1722359663390>) [🌐](<#id=1722359663390>)
> 本文是少数派 [2021 年度征文](https://sspai.com/post/70693) 活动 `#效率 21` 标签下的入围文章。本文仅代表作者本人观点，少数派对标题和排版略作调整。
>
> 和往年不同，今年文章的数据表现将很大程度上决定征文活动的最终走向，包括「双倍稿酬（由飞书赞助）」活动奖励、最终票选名单以及征文奖品类型。如果你喜欢这篇文章，不妨通过充电或评论的方式支持作者。
> ^sran-1722359663390

> [!srhl2] [[SR3@放弃纠结、拥抱妥协，重器轻用就是高效|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/3#id=1664008601679>) [🌐](<#id=1664008601679>)
> 我非常不喜欢安装各种 App，再加上越来越强大的电脑性能与大前端的普及，所以一个浏览器几乎可以覆盖全部的工作，因此我的工作环境被压缩为下面几个工具：
>
> - Chrome
> - VS Code
> - Github + git
> - iTerm + oh-my-zsh
> ^sran-1664008601679

> [!srhl4] [[SR3@放弃纠结、拥抱妥协，重器轻用就是高效|📄]] <mark style="background-color: #a1e0ff">Highlights</mark> [🧷](<http://localhost:7026/unread/3#id=1722359823588>) [🌐](<#id=1722359823588>)
> 极简的例子比比皆是，让很多喜欢效率的朋友趋之若鹜，但大多数人（包括我）都忽略了一件事情：上面的例子都是各个领域的精英，因此他们做的很多事情并不能被普通人「成功效仿」，这些人不仅使用着最简单且最高效工作方式，甚至很多理论在几十年后仍影响着我们。
> ^sran-1722359823588

> [!srhl2] [[SR3@放弃纠结、拥抱妥协，重器轻用就是高效|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/3#id=1722359892257>) [🌐](<#id=1722359892257>)
> 例如：我每天都要固定做八件事情，每件事情需要四个步骤，每个步骤花费十五分钟，这样每天正好每天八小时。如果将这些步骤简化 / 优化后，每个步骤只要简化为三步，就能节省 15*8 共计 120 分钟，也就是在相同条件下，六个小时后，我就可以休息了。
>
> 工欲善其事，必先利其器，选对工具是提升效率的必要手段。
> ^sran-1722359892257

> [!srhl2] [[SR3@放弃纠结、拥抱妥协，重器轻用就是高效|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/3#id=1664008622457>) [🌐](<#id=1664008622457>)
> 如果为了极简而极简则显然丧失了极简的目的：**高效**。
>
> - 只选择 Notion 的用户，虽然可以一键登录你全部的数据，但失去了 Obsidian / Logseq 本地应用的高效性。
> - 只选择印象笔记的用户，虽然得到了强大无比的全平台一键导入的便利性，但失去了「数据所有权」。
> - 只选择 Typora 的用户，虽然得到了完美的所见即所得，但失去了同步的便利性。
> ^sran-1664008622457

> [!srhl2] [[SR3@放弃纠结、拥抱妥协，重器轻用就是高效|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/3#id=1722361581920>) [🌐](<#id=1722361581920>)
> 增加个浏览器，效率增加不止一倍
> ^sran-1722361581920

> [!srhl5] [[SR3@放弃纠结、拥抱妥协，重器轻用就是高效|📄]] <mark style="background-color: #a8ea68">Highlights</mark> [🧷](<http://localhost:7026/unread/3#id=1722359903191>) [🌐](<#id=1722359903191>)
> 为什么使用 Slack 作为暂存方案而不使用 Raindrop 等书签工具？
>
> - Slack 有着全平台覆盖的优势，免费版足够使用。
> - 当保存链接后会自动生成链接的 Deeplink。
> ^sran-1722359903191
