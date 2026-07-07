---
uid: 202607071532
title: 虚拟列表采用DOM回收而非销毁重建
aliases: []
description: "虚拟列表对离开视口的 DOM 节点采取复用策略，避免频繁的创建和销毁带来的 GC 压力"
tags: [前端开发/性能优化]
date-created: 2026-07-07
date-modified: 2026-07-07
status: fleeting
content-type: atomic
up: "[[虚拟列表]]"
---

> 虚拟列表采用 DOM 回收而非销毁重建——滚动时离开视口的节点不销毁，而是移动到另一端的缓冲区复用，避免频繁的 createElement/removeChild 和 GC 抖动。

## 论据/示例

```js
// 对象池模式：维护固定数量的 DOM 节点
class NodePool {
  constructor(size) {
    this.pool = Array.from({ length: size }, () => this.createNode())
    this.free = [...this.pool]
  }

  acquire() {
    return this.free.pop() || this.createNode()  // 优先复用
  }

  release(node) {
    this.free.push(node)  // 不销毁，放回池中
  }
}

// 对比：销毁重建 vs 回收复用
// 销毁重建：1000 次滚动 → 1000 次 createElement + 1000 次 removeChild
// 回收复用：1000 次滚动 → 0 次 create + 0 次 remove（仅更新 textContent）
```

数据表现：
- 频繁滚动时，销毁重建模式会导致明显的 GC 暂停（~50-200ms）
- 回收复用模式几乎无 GC 开销（~0-5ms）
- 节点对象缓存也保留了样式计算和布局信息，减少重排成本

## 关联

- [[虚拟列表的核心思想是只渲染可见区域]] — 回收策略的前提
- [[实现简易虚拟列表]] — 完整实现中的节点管理
