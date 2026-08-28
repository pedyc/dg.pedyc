---
title: iframe
date-created: 2026-08-28
date-modified: 2026-08-28
---

## 核心洞察

- iframe 拥有完全独立的window上下文和浏览历史

> 导致路由同步、DOM渲染范围受限。例如在iframe中跳转url时，主应用的url不变；在主应用刷新页面时，子应用直接重置，直接回到子应用首页。

## 关联

- [[iframe在微前端中的应用与演进]]
- [[微前端]]
- [[qiankun]]
