---
uid: null
title: 【记录】WSL2配置代理
aliases: []
author: null
description: null
tags: [记录, WSL, Linux]
date-created: 2025-02-19
date-modified: 2025-05-10
status: null
---

> [!md] Metadata
>
>
> :LiCalendarDays: 创建日期：[[2025-02-20]]
>
>
> :LiTags: 标签列表：#记录,WSL,Linux

WSL2 默认使用宿主 Windows 的网络栈，即 WSL2 中的网络可以通过 Windows 的代理转发。
我在 Windows 使用 V2ray 进行代理。

步骤如下：

1. 获取 Windows 的 IP 地址
	在 CMD 输入 `ipconfig`，获取 vEthernet 的 ipv4 字段地址

2. 获取端口号
	打开 V2ray 的设置选项或配置文件，`找到端口号`

3. 配置持久代理
	 在 WSL 中输入 `sudo vi ~/.bashrc`，输入

```bash
export all_proxy:"http://{ip}:{port}"
export http_proxy:"http://{ip}:{port}"
export https_proxy:"http://{ip}:{port}"
```

4. 测试
	在 WSL 中输入 `ping www.google.com -I`，若返回 200 则成功
