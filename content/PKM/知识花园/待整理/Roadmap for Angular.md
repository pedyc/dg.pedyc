---
title: Roadmap for Angular
uid: 
author: 
description: 
date-created: 2024-08-15 05:01
date-modified: 2024-08-19 18:45
type: 
aliases: [Angular知识地图]
tags: []
---

[Angular Developer Roadmap: Learn to become a Angular developer](https://roadmap.sh/angular)

## Introduction to Angular

### Angular and History

AngularJS 是一个由谷歌公司推出的前端框架，旨在开发 SPA 应用，将静态 HTML 转化为动态 HTML，其核心在于：

- MVC 架构
- 模板
- 模块化
- 服务化
- 依赖注入（scope）

Angular 是 AngularJS 的重写升级版本，沿用了模块化、服务化、依赖注入等核心设定，修改了框架架构、双向绑定等设定。可以通过官方工具让 Angular 应用兼容 AngularJS 应用。其核心如下：

- <mark style="background: #FF5582A6;">MVVM 架构</mark>
- <mark style="background: #FF5582A6;">Typescript(静态检查)</mark>
- 模板
- 模块化
- <mark style="background: #FF5582A6;">组件化</mark>
- 服务化
- <mark style="background: #FF5582A6;">双向绑定</mark>
- 依赖注入 (service)
- <mark style="background: #FF5582A6;">状态管理</mark>

我们可以来做一个对比：

- 相比 AngularJS 的 MVC 架构，Angular 升级成了 MVVM 架构，原因是 MVC 架构的业务代码都部署在 Controller 层，导致其臃肿复杂。MVVM 架构通过数据双向绑定自动化了视图层和数据层的数据流动，可以减轻 ViewModel 层的压力。
- 组件化相比模块化粒度更小，更能够做功能划分，减少耦合度。
- Typescript 提供的静态类型检查。
- RxJS 提供的状态管理

下图是 Angular 的运行流程。
![[_resources/Roadmap for Angular/97a5e5ae630a256acb3e88ff787459da_MD5.jpeg]]

### Angular Architecture

### Setting up a New Project
