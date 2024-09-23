---
title: "srAnnote@npm scripts 使用指南 - 阮一峰的网络日志"
aliases: ["srAnnote@npm scripts 使用指南 - 阮一峰的网络日志"]
author: ruanyifeng.com
description: Node 开发离不开 npm，而脚本功能是 npm 最强大、最常用的功能之一。
type: Simpread
tags: 
url: https://ruanyifeng.com/blog/2016/10/npm_scripts.html
int_uil: http://localhost:7026/reading/6
---
> [!md] Metadata  
> **标题**:: "npm scripts 使用指南 - 阮一峰的网络日志"  
> **日期**:: [[2024-09-17]]  
> **外部链接**:: [[6-npm scripts 使用指南 - 阮一峰的网络日志]]


> [!summary] 描述  
> Node 开发离不开 npm，而脚本功能是 npm 最强大、最常用的功能之一。

## Annotations

> [📌](<http://localhost:7026/reading/6#id=1726548144992>) <mark style="background-color: #ffeb3b">Highlight</mark> 
> npm 脚本的原理非常简单。每当执行`npm run`，就会自动新建一个 Shell，在这个 Shell 里面执行指定的脚本命令。因此，只要是 Shell（一般是 Bash）可以运行的命令，就可以写在 npm 脚本里面。


> [📌](<http://localhost:7026/reading/6#id=1726549031027>) <mark style="background-color: #ffeb3b">Highlight</mark> 
> 比较特别的是，`npm run`新建的这个 Shell，会将当前目录的`node_modules/.bin`子目录加入`PATH`变量，执行结束后，再将`PATH`变量恢复原样。



