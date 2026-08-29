---
title: Husky
tags: [engineering/git-hooks, code-quality, front-end]
date-created: 2026-08-29
date-modified: 2026-08-29
status: active
created: 2026-08-29
type: concept
---

## Husky

### 1. 核心定义

**Husky** 是一个针对 Node.js / 前端工程化项目的现代 **Git Hooks** 管理工具。它将 Git 原生存放在本地 `.git/hooks` 中的钩子脚本抽象为项目目录下的可版本化配置文件（`.husky/`），从而实现团队开发中 Git 钩子脚本的统一配置、自动分发与无缝执行。

---

### 2. 核心价值与解决的痛点

* **环境孤岛问题**：Git 默认的 `.git/hooks` 属于本地目录，无法直接提交至远程仓库，难以在多人协作团队中保持统一。
* **质量左移（Shift-Left）**：在代码进入远端仓库或 CI/CD 流水线之前，在本地 `git commit` 或 `git push` 阶段提前拦截不符合规范的代码（格式、类型、测试、Commit Message 等）。
* **极简与轻量（Husky v9+）**：基于现代 Shell 脚本机制，摒弃繁重的配置逻辑，利用 `core.hooksPath` 直接绑定项目中的 `.husky` 目录。

---

### 3. 常见拦截场景与触发机制

| 钩子阶段 (`Hook`) | 触发时机 | 典型拦截任务 |
| :--- | :--- | :--- |
| `pre-commit` | 提交暂存区代码前 | 配合 `lint-staged` 执行 ESLint / Prettier 校验与格式化修复 |
| `commit-msg` | 编辑完提交信息后 | 配合 `@commitlint/cli` 校验是否符合 Conventional Commits 规范 |
| `pre-push` | 推送分支到远端前 | 执行单元测试（Vitest / Jest）、TypeScript 类型检查（`tsc --noEmit`） |

---

### 4. 协同生态与技术配合

* **[[通过husky+lint-staged进行代码质量防护]]**：Husky 负责**触发**，`lint-staged` 负责**精准作用于增量代码（Staged files）**，避免每次提交全量扫描导致的性能瓶颈。
* **Commitlint**：结合 `commit-msg` 钩子，确保版本历史符合语义化规范（如 `feat:`, `fix:`, `refactor:`）。

---

### 5. 关联与延伸

* **Upstream / 依赖概念**：[[Git Hooks]]、`Git 内部机制 (core.hooksPath)`
* **Downstream / 落地实践**：[[通过husky+lint-staged进行代码质量防护]]
* **相关工具**：`lint-staged`、`commitlint`、`simple-git-hooks`
