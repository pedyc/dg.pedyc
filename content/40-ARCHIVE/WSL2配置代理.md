---
title: WSL2配置代理
description: 记录在 WSL2 中配置代理以利用宿主 Windows 代理的方法。
tags: [记录, WSL, Linux]
date-created: 2025-05-10
date-modified: 2026-03-26
content-type: record
---

## 记录内容：WSL2 配置代理

### 前置条件

- 确保 Windows 上已配置好代理工具（如 V2ray）。

### 步骤

1. 在 `C:\Users\<user>` 目录下创建 WSL 配置文件 `.wslconfig `

```ini
[wsl2]
networkingMode=mirrored
dnsTunneling=true
firewall=true
autoProxy=true
```

2. 在 WSL 中配置动态代理，`vi ~/.bashrc`，输入以下内容

```ini
# 动态代理配置 - 使用 localhost（镜像网络模式下有效）
export http_proxy="http://localhost:10808"
export https_proxy="http://localhost:10808"
export HTTP_PROXY="http://localhost:10808"
export HTTPS_PROXY="http://localhost:10808"

# 可选：为某些地址不走代理
export no_proxy="localhost,127.0.0.1,::1"
```

3. 运行 `source ~/.bashrc` 刷新配置
4. 运行 `curl cip.cc` 进行测试
