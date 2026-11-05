---
uid: '20260829170600'
title: 通过husky+lint-staged进行代码质量防护
aliases: [SOP-使用Husky与lint-staged进行代码质量防护]
description: 配置 Git Hooks 拦截机制，在提交暂存区代码时自动执行 ESLint/Prettier 等检查与修复
tags: [前端工程化, 代码质量, GitHooks, SOP]
date-created: 2026-08-29
date-modified: 2026-11-05
content-type: sop
up: "[[前端质量闸门]]"
---

## SOP：使用 Husky 与 lint-staged 实现代码提交质量防护

通过 Husky 拦截 Git commit 操作，配合 lint-staged 仅对暂存区（Git Staged）文件执行代码检查与格式化，实现轻量、自动化的本地代码质量卡点。

* **目标**：在代码提交（`git commit`）阶段自动化拦截不符合规范的代码，防止劣质代码入库。
* **实现**：安装配置 `husky` (v9+) 与 `lint-staged`，并在 `.husky/pre-commit` 中注入触发钩子。
* **问题溯源**：本 SOP 是 [[如何确保代码在本地提交前通过规范校验]] 的收敛成果——全量与增量两种方案的对比在那一篇，结论固化为本流程。

---

### 适用场景

* 场景 1：团队协作的前端/全栈项目，需要统一 ESLint、Prettier、Stylelint 规范。
* 场景 2：大型存量仓库改造，全量检查耗时过长，仅需针对每次提交的修改文件做增量拦截。

---

### 流程图解

```mermaid
flowchart TD
    A[开发者执行 git commit] --> B[Husky 拦截: 触发 pre-commit 钩子]
    B --> C[lint-staged 获取 Git 暂存区文件]
    C --> D{匹配文件规则}
    D -->|*.js, *.ts, *.vue 等| E[执行 eslint --fix / prettier --write]
    D -->|无需检查的文件| F[跳过]
    E --> G{校验与自动修复是否通过?}
    G -->|成功| H[自动重新暂存并允许 Commit]
    G -->|失败/存在未修复错误| I[中止 Commit 并抛出错误日志]
````

### 核心步骤

1. **步骤 1：安装依赖**
	* 安装 `husky` 与 `lint-staged` 到开发依赖：

```bash
npm install -D husky lint-staged
# 或
pnpm add -D husky lint-staged
```

2. **步骤 2：初始化 Husky 配置**
	* 初始化 husky（生成 `.husky/_` 执行器、一个示例 `.husky/pre-commit`，并配置 `package.json` 的 `prepare` 脚本）：

	```bash
	npx husky init
	```

	* _注意_：`prepare` 脚本（`"prepare": "husky"`）会在每次 `npm install` 后自动执行，确保团队其他成员拉取代码后自动激活 Git Hooks。

3. **步骤 3：配置 lint-staged 规则**
	* 在 `package.json` 或独立的 `.lintstagedrc.json` 中定义过滤与执行规则：

```json
{
	"lint-staged": {
		"*.{js,jsx,ts,tsx,vue}": [
			"eslint --fix",
			"prettier --write"
		],
		"*.{css,scss,less}": [
			"stylelint --fix",
			"prettier --write"
		],
		"*.{json,md,html}": [
			"prettier --write"
		]
	}
}
```

4. **步骤 4：添加 pre-commit 钩子执行命令**
	* 在 `.husky/pre-commit` 文件中写入执行指令：

```bash
npx lint-staged
```

### 实践/示例

**完整 package.json 片段示例**：

```json
{
  "name": "project-name",
  "scripts": {
    "prepare": "husky",
    "lint": "eslint .",
    "format": "prettier --write ."
  },
  "lint-staged": {
    "*.{js,ts,jsx,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  },
  "devDependencies": {
    "eslint": "^9.0.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0",
    "prettier": "^3.0.0"
  }
}
```

### 常见坑点

* ⛔ **反模式**：在 `lint-staged` 规则中执行 `git add .`。现代 `lint-staged` 会自动将修改后的暂存区文件重新 stage，手动加 `git add` 反而可能把未被暂存的改动误提上去。
* ⛔ **反模式**：在 `pre-commit` 中直接运行全量 `npm run lint`。项目体量庞大时会导致每次 commit 卡顿数十秒，应使用 `lint-staged` 做增量过滤。
* 🔧 **排查**：若提交时未触发检查，按下面顺序查。前两条最常见，且**都不会报错**——表现为「提交顺利通过」，看起来像没问题：

	1. 根目录是否存在 `.git` 仓库；
	2. `git config core.hooksPath` 是否输出 `.husky/_`。为空说明 `prepare` 没跑过：`npm install --ignore-scripts`、生产安装不装 devDependencies、从旧版本拖过来的工作区都会这样，此时钩子根本不存在；
	3. `.husky/pre-commit` 是否已提交、文件名是否拼对。v9 由 `.husky/_/h` 按文件名转调，**可执行位与 shebang 都不再是必要条件**（那是 v8 及以前的写法，照旧清单去 chmod 只会白折腾）；
	4. 是否被跳过：`git commit -n` / `--no-verify`、`HUSKY=0`、或走自带 Git 实现的 GUI 客户端。

### 知识图谱

* **上位**：[[前端质量闸门]] — 它按「错误在哪一刻被拦下」分三道门，本页是「提交前」那道门的搭法
* **相关**：
	* [[Husky]] — 钩子的分发层；本页第 2 步只写命令，`prepare` 与 `core.hooksPath` 在哪一层见那篇
	* [[ESLint]] — 代码语法与风格检查工具
	* [[Prettier]] — 专注代码排版的格式化工具
	* [[Git Hooks]] — Git 提供的生命周期拦截机制
* **问题来源**：
	* [[如何确保代码在本地提交前通过规范校验]] — 此 SOP 解决的问题来源：全量还是增量、这道门要不要强制
