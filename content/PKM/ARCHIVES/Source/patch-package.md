---
topics: 
uid: 202408162330
title: patch-package
aliases: []
author: ped_yc
description: 
tags: [npm]
date-created: 2024-08-15
date-modified: 2025-02-24
status: [YCTODO]
type: 
---

⬆[[npm]]

## 简介

patch-package 用于给项目中的第三方 npm 包打补丁，假如我们的 node_modules 下有一个包 packageA 不符合我们的预期，我们可以修改 packageA 中的文件，运行 `npx patch-package packageA` 命令生成相对应的补丁文件。

npm 地址：[patch-package - npm (npmjs.com)](https://www.npmjs.com/package/patch-package)

## 使用方法

1.安装

```bash
npm i patch-package -D
```

2.修改 `node_modules` 目录下的 `packageA` 包
3.生成补丁

```bash
npx patch-package packageA
```

4.应用补丁（通过 git 钩子）

```json
{
	"postinstall": "patch-package"
}
```

> [!warning] 注意
> - patch-package 的工作原理是通过 git diff 记录**修改后源码和原始源码的区别**，并生成 patch 文件，通过 git 读取 patch 文件还原修改功能
> - pnpm 拥有原生支持，可以通过 pnpm patch 命令进行相同操作
