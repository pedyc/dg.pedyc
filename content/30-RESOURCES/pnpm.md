---
title: pnpm
date-created: 2026-08-28
date-modified: 2026-08-28
---

## 核心洞察

- pnpm在物理层利用全局内容寻址存储（Global Store）实现磁盘空间的一份物理存储和去重；
- pnpm在应用层利用硬链接（Hard Link）实现零拷贝引用；
- pnpm在结构层利用符号链接（Symlink）在`node_modules`中构建隔离幽灵依赖的虚拟目录布局；

## 工作原理

- 当 pnpm 下载包时，它不会直接把文件平铺到项目的 `node_modules` 中，而是将它们解压并平铺保存到磁盘上的一个**全局统一目录**（即 Global Store，通常在用户家目录下）。
- 存储时，它是**基于文件内容哈希（Content Hash）** 来寻址的。这意味着，即使是不同作者写的不同包，只要里面有两份一模一样的代码文件，在 Global Store 里也只会存储一份实体。
- 当你在具体项目执行 `pnpm install` 时，pnpm 会通过操作系统原生的 **硬链接 (Hard Link)**，将项目里 `node_modules/.pnpm` 下的路径直接指向 Global Store 中对应的物理文件。
