---
name: obsidian-note
description: 使用 content/_templates 目录下的模板创建 Obsidian 笔记
allowed-tools: Glob,Read,Write,Edit,Bash
---

## 任务

根据用户输入的内容，创建符合 Obsidian 规范的笔记。

## 模板位置

模板位于 `content/_templates/` 目录：

| content-type | 模板文件 |
|--------------|----------|
| term | template_term.md |
| concept | template_concept.md |
| atomic | template_atomic.md |
| comparison | template_comp.md |
| sop | template_sop.md |
| project | template_project.md |
| area | template_area.md |
| moc | template_moc.md |

## 步骤

### 1. 判断笔记类型

根据内容判断 content-type：

**PARA 逻辑（优先）**：
- 标题以 `P-` 开头，或有明确目标/截止日期 → **project**
- 标题以 `A-` 开头，或需长期维护的领域 → **area**

**信息熵逻辑**：
- 单一术语客观定义 → **term**
- 多维度概念介绍 → **concept**
- 独立观点/论证 → **atomic**
- 两个事物对比 → **comparison**
- 操作步骤/流程 → **sop**
- 链接集合 → **moc**

### 2. 确定存放目录

| content-type | 目录 |
|--------------|------|
| project | 10-PROJECTS |
| area | 20-AREAS |
| term/concept/atomic/comparison/sop/moc | 30-ZETTELCASTEN |
| 外部资源剪藏 | 40-RESOURCES |
| 已归档 | 50-ARCHIVE |
| 日记 | 90-DIARY |

### 3. 读取模板

读取对应模板文件：`content/_templates/template_{type}.md`

### 4. 生成笔记

1. 替换模板中的占位符（如 `{{标题}}`、`{{描述}}`）
2. 根据内容填充具体章节
3. 生成合适的文件名（中文命名）

### 5. 输出结果

告诉用户：
- 选择的类型和理由
- 建议的文件名和存放位置
- 生成的笔记内容（Markdown 格式）

## 注意事项

- 使用 WikiLink 格式：`[[笔记标题]]`
- 不要使用 HTML 标签或 `obsidian://` 链接
- status 初始值一般为 `fleeting`（新笔记）或 `cultivating`（正在加工）
- 项目笔记需要填写 consequence、urgency、expire 等字段
