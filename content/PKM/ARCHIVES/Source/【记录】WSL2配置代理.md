---
topics: [记录]
uid: 
title: 【记录】WSL2配置代理
aliases: []
author: 
description: 
tags: [记录, WSL, Linux]
date-created: 2025-02-20
date-modified: 2025-02-20
status: 
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
	在 CMD 输入 `ipconfig`，获取 vEthernet 的 ipv4 字段地址，我的是 172.18.80.1

2. 获取端口号
	打开 V2ray 的设置选项或配置文件，`找到端口号`，我的是 10808

3. 配置持久代理
	 在 WSL 中输入 `sudo vi ~/.bashrc`，输入

```bash
export all_proxy:"http://172.18.80.1:1080"
export http_proxy:"http://172.18.80.1:1080"
export https_proxy:"http://172.18.80.1:1080"
```

4. 测试
	在 WSL 中输入 `ping www.google.com -I`，若返回 200 则成功
