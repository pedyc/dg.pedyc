---
name: template-sync
description: 同步 _templates 模板到 AI 提示词，确保 Obsidian Copilot 使用的模板与标准模板一致
allowed-tools: Glob,Read,Write,Edit
---

## 任务

将 `content/_templates/` 目录下的模板内容同步到 AI 提示词文件。

## 模板位置

`content/_templates/` 目录下的模板：

| 模板文件 | content-type |
|-----------|--------------|
| template_term.md | term |
| template_concept.md | concept |
| template_atomic.md | atomic |
| template_comp.md | comparison |
| template_sop.md | sop |
| template_project.md | project |
| template_area.md | area |
| template_moc.md | moc |

## AI 提示词文件位置

`content/99-ASSETS/copilot/system-prompts/Obsidian Smart Librarian.md`

## 同步规则

1. **读取所有模板文件** - 从 `content/_templates/` 获取最新的模板结构
2. **更新元数据标准** - 确保提示词中的 YAML frontmatter 与模板一致
3. **更新各类型模板** - 将提示词中的简化模板替换为完整模板内容
4. **保持提示词其他内容不变** - 如角色定义、判断逻辑等

## 执行步骤

1. 读取 `content/_templates/` 下所有模板文件
2. 读取 AI 提示词文件
3. 识别需要更新的部分（元数据、各类型模板）
4. 进行替换更新
5. 保存文件

## 注意事项

- 模板中的 `<% tp.file.creation_date() %>` 等 Templater 语法应保留在模板文件中
- AI 提示词中应使用占位符 `{{字段名}}` 而非 Templater 语法
- 确保 status 值一致：fleeting / cultivating / active / completed / archived
