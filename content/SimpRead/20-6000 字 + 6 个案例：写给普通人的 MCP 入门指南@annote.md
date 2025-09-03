---
title: 20-6000 字 + 6 个案例：写给普通人的 MCP 入门指南@annote
date-created: 2025-04-07
date-modified: 2025-04-22
index: 20
type: Simpread
UID: 20250407084640
---

## [[20-6000 字 + 6 个案例：写给普通人的 MCP 入门指南]]

> [!timeline]+ 简介
>
> > **元数据**
>
> ---
> **原文**:: [6000 字 + 6 个案例：写给普通人的 MCP 入门指南](https://mp.weixin.qq.com/s/BjsoBsUxCzeqXZq46_nrog)
> **日期**:: [[2025-04-07]]
> **标签**:: #SimpRead
>
> > **摘要**
>
> ---
> 这几天终于摸索出来了一些方法让大家可以相对容易理解的方式配置 MCP 服务。\x0d\x0a 后面我也会直接给你几个常用的案例，教你从配置到使用的全过程，希望这个教程看完能让你顺滑的使用 MCP。

### 笔记

> [!abstract]+ <mark style="background-color: #ffeb3b">Highlight</mark> [🧷](<http://localhost:7026/reading/20#id=1743988132270>)
> 简单来说 LLM 使用不同工具时，以前需要同时修改模型和工具，因为各工具的 API 数据格式不统一，导致适配成本高、功能添加慢。
^sran-1743988132270

> [!abstract]+ <mark style="background-color: #ffeb3b">Highlight</mark> [🧷](<http://localhost:7026/reading/20#id=1743988134826>)
> MCP 协议统一了数据格式标准，规定了应用向 LLM 传输数据的方式。任何模型只要兼容 MCP 协议，就能与所有支持 MCP 的应用交互。
^sran-1743988134826

> [!abstract]+ <mark style="background-color: #ffeb3b">Highlight</mark> [🧷](<http://localhost:7026/reading/20#id=1743988137298>)
> 这将适配工作从双向简化为单向（仅应用端），且对于已有 API 的应用，第三方开发者也可基于其 API 进行 MCP 封装适配，无需官方支持。
^sran-1743988137298
