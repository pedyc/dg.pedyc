---
title: CLAUDE
date-created: 2026-03-25
date-modified: 2026-10-25
---

# CLAUDE.md

本仓库的 agent 约定只有一份：同目录的 **`AGENTS.md`**。Claude Code 只自动读本文件，所以本文件是指针，不是内容。

## 读的顺序

1. `AGENTS.md` —— 全部约定：入口表、用户判断、字段 / 目录 / 链接 / 脚本 / Bases 的坑、工具链坑、动手前后的校验。
2. 当前工作目录若另有 `AGENTS.md`，先读那一份：就近优先，冲突时子级覆盖根级。
3. 需要具体定义时按 `AGENTS.md` 的入口表打开 `01-META/Truth/` 下的真值文档。

## 维护本文件

不写细则，只写指向。新增规则时先确认它唯一的真值在哪份文档，补进去，再到 `AGENTS.md` 加一行指过去——本文件只在 `AGENTS.md` 改名时同步一次。
