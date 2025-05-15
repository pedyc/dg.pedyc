---
title: 「记录」WSL2配置代理
description: 记录在 WSL2 中配置代理以利用宿主 Windows 代理的方法。
tags: [记录, WSL, Linux]
date-created: 2025-05-10
date-modified: 2025-05-13
content-type: record
keywords: [WSL2, 代理, V2ray]
para: archive
zettel: permanent
---

## 记录内容：WSL2 配置代理

### 前置条件

- 确保 Windows 上已配置好代理工具（如 V2ray）。

### 步骤

1. **获取 Windows 的 IP 地址**
		- 在 CMD 中输入 `ipconfig`，找到 vEthernet 的 IPv4 地址。

2. **获取端口号**
		- 打开 V2ray 的设置选项或配置文件，找到端口号。

3. **配置持久代理**
		- 在 WSL 中输入 `sudo vi ~/.bashrc`，并添加以下内容：

```bash
export all_proxy="http://{ip}:{port}"  
export http_proxy="http://{ip}:{port}"  
export https_proxy="http://{ip}:{port}"

```

- 将 `{ip}` 替换为第一步获取的 IP 地址，`{port}` 替换为第二步获取的端口号。

4. **测试**
		- 在 WSL 中输入 `curl -I https://www.google.com`，若返回 200 则配置成功。
