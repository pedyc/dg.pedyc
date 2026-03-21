---
uid: '<% tp.file.creation_date("YYYYMMDDHHmm") %>'
title: systemd
author: AI
description: 原子笔记类型定义最小单位的知识点、术语、API接口、单一函数、专有名词
tags: [atomic, topic/待分类]
date-created: 2026-03-07
date-modified: 2026-03-09
status: 🌲 evergreen
content-type: atomic
up: "[[Linux]]"
---

## ⚛️ 定义：systemd

> [!quote] 核心论点
>
> systemd 是 Linux 的系统和服务管理器，通过 " 并行启动 " 和 " 按需激活 " 机制，取代了传统的 SysV init，成为现代 Linux 分发版的标准初始化系统（PID 1）。

### 🧬 技术原理 / 逻辑 (Mechanism)

#### ⚙️ 核心逻辑 (Logic)

- **并行化启动**：通过 Socket 激活（Socket Activation）技术，systemd 在服务启动前就创建好所有 Socket，使依赖这些服务的进程可以同时启动，极大地缩短了开机耗时。
- **单元 (Unit) 架构**：将系统资源抽象为不同类型的 Unit（如 `.service`, `.mount`, `.timer`, `.target`），通过声明式的配置文件管理依赖关系。
- **cgroups 隔离**：使用控制组（Control Groups）跟踪服务进程。即便服务派生出多个子进程，systemd 也能通过 cgroups 确保它们被统一监控或彻底清理，避免出现 " 孤儿进程 "。

#### 💻 代码示例 / 语法 (Syntax)

```bash
# 一个典型的前端项目守护进程配置示例：/etc/systemd/system/my-app.service
[Unit]
Description=Node.js Frontend App
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/var/www/my-app
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

### 💭 语境与应用 (Context & Application)

- **适用场景**：
	- **开发环境后台化**：在 WSL 中将数据库（Redis, PostgreSQL）或自定义代理工具配置为自动启动。
	- **生产部署**：管理 Node.js 或 Go 编写的服务进程。
- **🚀 最佳实践/行动**：
	1. `systemctl daemon-reload`: 修改 `.service` 文件后必须执行，重载配置。
	2. `journalctl -u my-app.service -f`: 实时滚动查看服务日志，调试利器。
- **⚠️ 避坑指南/局限**：
	- **WSL 兼容性**：在较旧版本的 WSL 中，systemd 默认不启动，需要在 `/etc/wsl.conf` 中显式配置 `[boot] systemd=true`。
	- **非交互式环境**：systemd 启动的服务没有交互式 Shell 环境，环境变量需在 `Environment=` 字段显式定义。

### 🔗 链接网络

- **MOC 索引**: [[A-Linux]], [[DevOps 实务]]
- **技术支撑**: [[cgroups]], [[Init System 演进史]]
- **对比反面**: [[SysVinit]], [[OpenRC]]
- **SOP**: [[SOP-如何在WSL中配置并运行自定义systemd服务？]]
