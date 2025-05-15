---
title: Git命令与工作流速查
description: "Git 常用命令和工作流的速查表，方便快速查找和使用。"
tags: ["Git", "版本控制", "工作流", "前端工程", "速查表"]
date-created: 2025-04-29
date-modified: 2025-04-29
keywords: [Git 命令, 工作流, 分支管理, 版本控制, 代码管理]
para: "Area"
related: ["[[版本控制系统]]", "[[Git 分支策略]]", "[[代码协作]]"]
---

## Git 常用命令速查

### 基础命令

| 命令        | 描述                     | 示例                                  |
| ----------- | ------------------------ | ------------------------------------- |
| `git init`  | 初始化一个新的 Git 仓库 | `git init`                            |
| `git clone` | 克隆一个远程仓库         | `git clone <remote_url>`              |
| `git add`   | 添加文件到暂存区         | `git add <file>` 或 `git add.`       |
| `git commit`| 提交暂存区的文件         | `git commit -m "提交信息"`             |
| `git status`| 查看仓库状态             | `git status`                          |

### 分支管理

| 命令           | 描述                 | 示例                                  |
| -------------- | -------------------- | ------------------------------------- |
| `git branch`   | 查看分支             | `git branch`                          |
| `git branch <branch_name>` | 创建分支           | `git branch dev`                      |
| `git checkout` | 切换分支             | `git checkout <branch_name>`            |
| `git merge`    | 合并分支             | `git merge <branch_name>`             |
| `git branch -d <branch_name>` | 删除分支           | `git branch -d dev`                   |

### 远程操作

| 命令          | 描述                 | 示例                                  |
| ------------- | -------------------- | ------------------------------------- |
| `git remote add` | 添加远程仓库         | `git remote add origin <remote_url>`  |
| `git push`    | 推送本地分支到远程仓库 | `git push origin <branch_name>`       |
| `git pull`    | 从远程仓库拉取代码   | `git pull origin <branch_name>`       |
| `git fetch`   | 从远程仓库获取最新信息 | `git fetch origin`                    |

## Git 工作流

### 常用工作流模式

1. **集中式工作流：** 所有开发者都向同一个主分支提交代码。
2. **特性分支工作流：** 每个新特性都在独立的分支上开发，完成后合并到主分支。
3. **Gitflow 工作流：** 使用 develop 分支和 release 分支来管理开发和发布流程。

### 如何选择合适的工作流

* 根据团队规模和项目复杂度选择合适的工作流。
* 保持工作流的简单和易于理解。
* 定期回顾和优化工作流。

## 总结

Git 是一个强大的版本控制工具，掌握常用命令和选择合适的工作流可以提高代码管理和团队协作的效率。
