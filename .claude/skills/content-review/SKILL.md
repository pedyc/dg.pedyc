---
name: content-review
description: 审查 content/ 目录中的 Markdown 文件，遵循 Quartz 规范
argument-hint: [path]
allowed-tools: Glob,Grep,Read
---

审查 Markdown 内容时，确保遵循以下规范：

1. **Frontmatter 格式**
   - 必须包含 title 字段
   - 日期字段使用标准格式 (YYYY-MM-DD)
   - 可选字段：tags, draft, date, modified

2. **内部链接**
   - 使用相对路径或 Quartz 链接语法 `[[slug]]`
   - 链接到其他笔记时使用完整的 slug 路径
   - **只检查格式**，不关心链接目标是否存在（待创建链接不报错）

3. **图片和资源**
   - 图片应放在 content/ 目录或使用图床
   - 确保图片路径正确

4. **特殊语法**
   - Callout 使用 `> [!note]` 格式
   - 代码块指定语言
   - 避免使用 Obsidian 特定语法（除非在 ofm 插件支持范围内）

检查完成后，报告发现的问题（忽略占位链接）。
