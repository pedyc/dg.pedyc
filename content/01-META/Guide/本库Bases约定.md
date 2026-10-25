---
uid: 20261025034500
title: 本库Bases约定
aliases: [Bases约定, Bases 约定]
description: "本库 .base 文件的组织形态、三层字段结构与已知陷阱"
tags: [META/工具]
date-created: 2026-10-25
date-modified: 2026-10-25
content-type: article
up: "[[本库指南]]"
---

# 本库 Bases 约定

本文件回答「本库的 `.base` 怎么写」。定位与 [[本库脚本化]] 平行：那份讲脚本该做什么、不做什么，这份讲看板与表的写法与坑。清单文件本身在 `99-ASSETS/Bases/`。

## 一、组织形态：独立文件，不用内联代码块

`.base` 一律存为独立文件（`99-ASSETS/Bases/xx.base`），**不要**写成 md 内的 ```` ```base ```` 代码块。这是用户明确偏好，不是技术偏好：

- 独立文件可在图形界面里调视图、加列、改过滤；
- 可以被 `![[xx.base]]` 嵌入到任意笔记；
- 内联块的致命问题：笔记被别的笔记嵌入时，二级 base 不渲染——看起来是空的，且不报错。

## 二、字段结构：三个层级不能混

| 位置 | 作用范围 | 放什么 |
|:---|:---|:---|
| 顶层 `filters` | **全部视图** | 这个库管哪批文件（通常是 `file.inFolder(...)`） |
| `views[].filters` | 只作用于该视图 | 视图内的进一步筛选 |
| 顶层 `formulas` / `properties` | 全部视图可见 | 派生列、列名中文化 |

分层的实际用途：`信源.base` 靠它让「总览」排除已弃卡片、看板仍显示四列——**看板是生命周期全景，表是当前阅读清单**。

`formulas` 与 `properties` 是**顶层键**，不在 `views[]` 里；视图内用 `formula.<名>` 引用，公式之间也可互引（`信源.base` 的 `grade` 引 `formula.total`）。

```yaml
formulas:
  total: if(density == null || ... , null, density + timeliness + ...)
  grade: if(formula.total == null, "待评", if(formula.total >= 20, "A", ...))
properties:
  formula.grade:
    displayName: 评级
```

`if()` 支持三参。列名中文化只走 `properties.<字段>.displayName`，**中文不进表达式**——formula 名用英文（中文 formula 名未验证）。

## 三、已知陷阱

- **空属性在 JS 语义下被当 0 静默计入**。求和前必须显式排除：`if(x == null, null, ...)`。漏了这一步不会报错，只会给出偏低的分数（`信源.base` 的 `total` 就是因为这个写成五个 `== null` 的并联判断）。
- **base 读不到别的笔记的字段**。一行 = 一个笔记，无法跨笔记取值。所以 base 永远「产出清单」，不「产出数字」：下钻用它，指标用 `_scripts/stats.py` + [[本库统计]]。
- **看板一卡 = 一文件**。清单类内容（比如一篇笔记里的 20 条书单）要转看板，必须先拆成 20 篇独立笔记。
- **看板分列属性不可用 `status`**（已废除），要业务属性：`play_status` / `read_status` / `apply_status`。
- **必须显式写 `groupOrder` 列全所有列**，否则只渲染「有值的列」，空列消失、顺序由数据决定。
- **白名单列目录比排除式 filter 可靠**：`file.inFolder()` 白名单已在元数据巡检实测；`!file.inFolder(...)` 这种排除写法一旦新增目录就漏。

## 四、零维护观测

观测「笔记滞留与陈旧」时，用 `file.ctime` / `file.mtime` 的 `.relative()`，**不要用 `date-modified` 字段**：文件系统时间不依赖任何字段、不可能漏记，而 `date-modified` 实测有 17 篇缺值。

这条与 [[Inbox规则]] 同源：判断「在 Inbox 待了多久」也只认 ctime——剪藏笔记的 `date-created` 存的是网页发布时间。

## 五、现有清单

| 文件 | 用途 |
|:---|:---|
| `信源.base` | 信源卡评分速览（五维 + 评级） |
| `笔记滞留与陈旧.base` | 零维护观测：INBOX 滞留、长期未改、新建未消化 |
| `元数据巡检.base` | 缺 uid / 类型脏值 / 日期倒挂 |
| `书单.base`、`游戏收藏.base`、`电影收藏.base`、`求职投递.base` | 看板形态的进度清单 |
| `ALL.base`、`SOP.base`、`EXCALIDRAW.base` | 全库与类型清单 |

新增或改视图后无需同步任何索引——base 是查询，不是数据。
