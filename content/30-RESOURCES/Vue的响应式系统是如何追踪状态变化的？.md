---
title: Vue的响应式系统是如何追踪状态变化的？
date-created: 2026-09-22
date-modified: 2026-09-22
content-type:
  - question
up:
  - "[[前端状态管理]]"
---

[[Vue3响应式原理|Vue3响应式系统]]在读取状态时建立依赖关系，在修改状态时找到依赖并触发更新。

**建立依赖**

```bash
读取 → track → 建立依赖
```

**更新依赖**

```bash
修改 → trigger → 更新依赖
```
