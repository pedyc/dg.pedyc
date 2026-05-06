---
uid: 202605061400
title: React Fiber 采用链表结构代替递归
description: React Fiber 用链表代替递归树遍历，实现可中断的渲染
tags: []
date-created: 2026-05-06
date-modified: 2026-05-06
status: active
content-type: atomic
up: ["[[Fiber架构(React)]]"]
---

> React Fiber 用链表代替递归树遍历，使渲染过程可中断、可恢复

## 论据/示例

**1. 递归的问题：无法中断**

传统 VDOM 采用递归遍历：

```javascript
function render(element, parentNode) {
  // 递归调用 - 一旦开始必须完成
  element.children.forEach(child => render(child, domNode))
}
```

递归调用栈一旦开始，**无法中途暂停**，必须等全部完成。

**2. 链表的优势：可中断**

Fiber 节点用链表连接：

```javascript
{
  type: 'ul',
  child: fiberLi1,        // 第一个子节点
  sibling: null,          // 没有兄弟节点
  return: parentFiber     // 父节点
}

// 链表遍历（可中断）
function workLoop(fiber) {
  // 处理当前节点
  process(fiber)

  // 先遍历子节点
  if (fiber.child) return fiber.child

  // 子节点处理完，回到父节点继续
  while (fiber) {
    if (fiber.sibling) return fiber.sibling
    fiber = fiber.return
  }
}
```

**3. 中断与恢复机制**

```bash
时间片用完，需要中断渲染：

当前节点：A → B → C → D（正在处理 D）
    ↓ 中断
保存 D 的进度（workInProgress）
    ↓
处理用户高优先级事件（如点击）
    ↓
恢复：从 D 继续，而不是从头开始
```

> [!tip] tips
> 因为是链表，指针可以保存位置，递归无法做到这一点。

## 关联

- [[React]]
- [[React Fiber]]
- [[React Fiber 是可中断的增量渲染架构]]
