---
title: Inbox规则
date-created: 2026-02-09
date-modified: 2026-10-25
tags: [META/FAQ]
content-type: article
up: "[[本库常见问题解答汇总]]"
---

> 位置：`00-INBOX/`（顶层捕获篮，全库唯一入口；原 `30-RESOURCES/Inbox/` 已迁出）

## 归档规则

Inbox 本身就是待消化队列，只有一层，不设子目录区分。

某篇笔记超过 14 天没被转化为 `Zettelkasten` 或移入 `Areas`，说明当前信噪比不足以推进，启动时由脚本移入 `40-ARCHIVE/`。

归档不等于丢弃：`40-ARCHIVE` 免维护，需要时按文件名取回即可。个别笔记要越过时限慢慢消化，不必另建容器，直接从归档区处理。

## 判据

滞留时长取文件系统 ctime（文件进入 vault 的时刻），不取 frontmatter 的 `date-created`。

后者在剪藏笔记里存的是网页发布时间：2026-10-25 重启时，7 篇跨 2026-03 至 2026-09 的剪藏被这个字段判成 200 天以上，整批搬进归档区。它们其实来自同一次 2026-10-08 的批量导入，按 ctime 只有 17 天。同一批文件在两种判据下相差两百天，说明这个字段与「在 Inbox 待了多久」无关。

## 实现

`_scripts/templater/autoArchiveInbox.js`，经 Templater 的 Startup Templates（`_scripts/template_startup.md`）在 Obsidian 启动时跑一次。归档区已有同名文件时跳过并记日志，不覆盖。

观测：`99-ASSETS/Bases/笔记滞留与陈旧.base` 的「INBOX 滞留」视图按 ctime 升序排列当前 Inbox，等价于一份待消化清单。
