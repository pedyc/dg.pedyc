---
title: "srAnnote@从 Element UI 源码的构建流程来看前端 UI 库设计"
aliases: ["srAnnote@从 Element UI 源码的构建流程来看前端 UI 库设计"]
author: {{author}}
description: 由于业务需要，近期团队要搞一套自己的UI组件库，框架方面还是Vue。而业界已经有比较成熟的一些UI库了，比如ElementUI、AntDesign、Vant等。 结合框架Vue，我们选择在ElementUI基础上进行改造。但造轮子绝非易事，首先需要先去了解它整个但构建流程、目录…
type: Simpread
tags: 
url: https://juejin.cn/post/6844904197863964685
int_uil: http://localhost:7026/reading/4
---
> [!md] Metadata
> 🙇‍♂作者信息：{{author}}
> 🌱文档状态：YCTODO
> 📅创建日期：2024-09-15
> 🔗原文链接：https://juejin.cn/post/6844904197863964685
> 🖋标签列表： 

> [!summary] 描述  
> 由于业务需要，近期团队要搞一套自己的UI组件库，框架方面还是Vue。而业界已经有比较成熟的一些UI库了，比如ElementUI、AntDesign、Vant等。 结合框架Vue，我们选择在ElementUI基础上进行改造。但造轮子绝非易事，首先需要先去了解它整个但构建流程、目录…

## Annotations

> [📌](<http://localhost:7026/reading/4#id=1726414343523>) <mark style="background-color: #ffeb3b">Highlight</mark> 
> 该指令主要用来自动化生成一些文件。



