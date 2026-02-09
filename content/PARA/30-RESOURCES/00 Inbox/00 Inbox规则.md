---
title: 00 Inbox规则
date-created: 2026-02-09
date-modified: 2026-02-09
---

> 定期归档机制：
> 如果 Inbox 中的某个笔记在两周内未被转化为 `Zettelkasten` 或移动到 `Areas`，说明它目前的 " 信噪比 " 较低，应直接移动到 `30-RESOURCES/Archive`

实现：

使用 **Templater** 插件的 **Startup Templates** 功能（在 Templater 插件启动时运行一次）运行脚本： [[autoArchiveInbox.js]]
