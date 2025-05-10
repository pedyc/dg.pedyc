---
title: pre-commit Hook工作流
tags: [workflow/git, tool/husky, tool/lint-staged, practice/linting, practice/formatting, area/frontend-engineering, topic/code-quality]
date-created: 2025-04-24
date-modified: 2025-04-24
---

## pre-commit Hook 工作流

**pre-commit Hook 工作流** 是在执行 `git commit` 命令之前自动触发的一系列操作，旨在确保即将提交到代码库的代码符合预设的规范和质量标准。这是 [[代码规范与质量保证]] 实践中的一个重要环节，通过自动化手段强制执行代码检查和格式化，防止不符合规范的代码进入版本控制。

### 核心目标

* **自动化**: 在提交前自动执行检查和修复任务，减少人工操作。
* **强制性**: 阻止不符合规范的代码提交，保证代码库的整洁和一致性。
* **效率**: 通常只针对本次提交修改的文件进行操作，避免全量检查带来的性能开销。

### 实现方式与常用工具

该工作流通常利用 Git Hooks 机制，并结合以下工具实现：

1. **[[Husky]]**: 一个流行的 Git Hooks 管理工具，可以方便地在 `.husky/` 目录下配置各种 Git Hook 脚本（如 `pre-commit`, `commit-msg`, `pre-push` 等）。它使得在项目中共享和管理 Git Hooks 变得简单。
2. **[[lint-staged]]**: 这个工具通常与 Husky 配合使用在 `pre-commit` 钩子中。它的核心作用是**只对 Git 暂存区 (staged) 的文件**执行指定的命令（如 Linting 和 Formatting）。这极大地提高了效率，因为只处理了本次提交将要包含的文件，而不是整个项目。

### 典型工作流程 (在 `pre-commit` 阶段)

1. 开发者执行 `git commit` 命令。
2. [[Husky]] 捕获到 `pre-commit` 事件，触发预设的脚本。
3. 该脚本通常会调用 `npx lint-staged` (或其他包管理器命令)。
4. [[lint-staged]] 读取其配置文件 (通常在 `package.json` 或独立的配置文件中)。
5. 根据配置，[[lint-staged]] 对暂存区中的匹配文件执行一系列命令，例如：
		* 运行 `prettier --write <staged_files>`: 使用 [[Prettier]] 自动格式化代码。`--write` 参数会直接修改文件。
		* 运行 `eslint --fix <staged_files>`: 使用 [[ESLint]] 检查代码质量并尝试自动修复问题。`--fix` 参数会尝试修复。
		* 运行 `stylelint --fix <staged_css_files>`: 使用 [[Stylelint]] 检查样式文件并尝试自动修复。
6. [[lint-staged]] 会自动将格式化或修复后**重新暂存 (re-stage)** 这些文件。
7. **检查结果**:
		* 如果所有命令成功执行（没有错误，或者所有错误都被 `--fix` 解决了），`lint-staged` 退出码为 0，`git commit` 继续执行，代码成功提交。
		* 如果任何命令执行失败（例如，[[ESLint]] 或 [[Stylelint]] 发现无法自动修复的错误），`lint-staged` 退出码非 0，`pre-commit` 钩子失败，`git commit` 操作被**阻止**。开发者需要手动修复这些问题后才能重新提交。

### 价值

* **保证入库代码质量**: 从源头上阻止低质量或风格不一致的代码。
* **提升开发体验**: 自动格式化和部分修复，减少开发者手动处理的负担。
* **统一团队规范**: 强制所有成员遵循相同的代码标准。

---
**关联:** [[代码规范与质量保证]], [[Husky]], [[lint-staged]], [[ESLint]], [[Prettier]], [[Stylelint]], [[Git Hooks]]
