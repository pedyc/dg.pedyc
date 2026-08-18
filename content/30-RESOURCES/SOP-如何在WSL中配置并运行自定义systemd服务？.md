---
title: SOP-如何在WSL中配置并运行自定义systemd服务？
author: [AI]
date-created: 2026-03-07
date-modified: 2026-04-07
content-type: [sop]
---

## 🚀 SOP：如何在 WSL 中配置并运行自定义 systemd 服务

### 🎯 目标与触发 (Goal & Trigger)

> [!summary]
>
> **场景**：需要在 WSL 后台持久化运行某个服务（如：自定义 API 代理、数据库或自动化脚本），且希望随 WSL 启动而自动启动。
>
> **结果**：✅ 服务在 `systemctl` 监管下稳定运行，并能通过 `journalctl` 查看日志。

### 🛠 环境准备 (Environment)

- [x] **运行环境**: WSL2 (Ubuntu 22.04+ 推荐) ✅ 2026-03-07
- [x] **核心配置**: `/etc/wsl.conf` 已开启 systemd 支持。 ✅ 2026-03-07
- [x] **必要权限**: 具有 `sudo` 权限的非 root 用户。 ✅ 2026-03-07

### 🪜 核心流程 (The Workflow)

#### 阶段一：开启 WSL 的 systemd 支持（仅需执行一次）

1. **检查并编辑配置**

在 WSL 终端中执行：

```bash
sudo nvim /etc/wsl.conf
```

2. **写入以下内容**：

```bash
[boot]  
systemd=true
```

3. **重启 WSL**（在 Windows PowerShell 执行）：

```bash
wsl --shutdown
```

#### 阶段二：编写 Unit 单元文件

1. **创建并编辑服务文件**

```bash
sudo nvim /etc/systemd/system/my-service.service
```

2. **填充标准模板**（按需修改 `ExecStart`）：

```bash
[Unit]  
Description=My Custom Script Service  
After=network.target

[Service]  
Type=simple  
User=<% tp.user.env("USER") %>  
WorkingDirectory=/home/<% tp.user.env("USER") %>/scripts  
ExecStart=/usr/bin/python3 main.py  
Restart=always

[Install]  
WantedBy=multi-user.target
```

#### 阶段三：激活与启动

3. **重载系统配置**：

```bash
sudo systemctl daemon-reload
```

4. **启动并设置自启**：

```bash
sudo systemctl enable --now my-service
```

### ✅ 验证环节 (Validation)

> [!success] 满足以下条件视为执行成功：
>
> 1. [ ] 执行 `systemctl status my-service` 显示 `active (running)`。
> 
> 2. [ ] 执行 `journalctl -u my-service -n 20` 能看到正常的输出日志。

### ⚠️ 常见坑点 (Troubleshooting)

- ❌ **避坑**: 不要把 `ExecStart` 指向一个会自动退出的脚本（如没加死循环的 Shell），否则服务会不断重启。
- 🔧 **排错**:
- **现象**: `System has not been booted with systemd as init system`.
- **方案**: 检查第一步的 `wsl.conf` 是否配置正确，并确保执行了 `wsl --shutdown`。

### 🔗 关联逻辑

- **方法论依据**: [[systemd]]
- **关联 MOC**: [[A-Linux]]
- **修订记录**:
	- 2026-03-07: 基于新的 SOP 模板生成。
