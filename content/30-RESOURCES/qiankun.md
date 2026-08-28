---
title: qiankun
date-created: 2026-08-28
date-modified: 2026-08-28
---

## 核心洞察

- qiankun 通过`Proxy`拦截对全局变量的修改，确保不同子应用间不会互相影响全局环境

> qiankun 提供的代理沙箱（ProxySandbox）主要用于解决全局window对象的污染与隔离

- qiankun 基于 HTML Entry 动态加载机制，将子应用编译后的DOM树和JS直接拉取并渲染到主应用指定的容器中。

> 子应用本质是主应用DOM树的一部分，共享同一个url路由上下文，体验与SPA完全一致
> 解决了iframe路由同步、DOM渲染范围受限的问题

## 关联

- [[微前端]]
- [[iframe]]
