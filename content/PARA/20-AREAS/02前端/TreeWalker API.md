---
title: TreeWalker API
description: TreeWalker 接口表示一个 DOM 树节点的过滤器和一个方向。
tags: [前端开发, DOM]
date-created: 2025-06-02
date-modified: 2025-06-02
content-type: concept
keywords: [TreeWalker, DOM 遍历]
para: AREA
related: ["[[DOM]]", "[[NodeIterator]]"]
zettel: permanent
---

## 定义

TreeWalker 接口表示一个 DOM 树节点的过滤器和一个方向。它提供了一种在 DOM 树中高效地进行遍历的方式，可以根据指定的过滤器选择节点，而无需手动编写递归函数。

## 核心特点

- **高效遍历：** TreeWalker 提供了高效的 DOM 树遍历方式，避免了手动编写递归函数的复杂性。
- **灵活过滤：** 可以根据指定的过滤器选择节点，只遍历符合条件的节点。
- **可控方向：** 可以控制遍历的方向，例如向前、向后、向上等。
- **只读访问：** TreeWalker 只能用于读取 DOM 树，不能用于修改 DOM 树。

## 如何使用 TreeWalker？

1. **创建 TreeWalker 对象：**

```javascript
const treeWalker = document.createTreeWalker(
	root,
	whatToShow,
	filter,
	expandEntityReferences
);
```

- `root`：指定遍历的根节点。
- `whatToShow`：指定要显示的节点类型，例如元素节点、文本节点等。
- `filter`：指定一个过滤器函数，用于选择符合条件的节点。
- `expandEntityReferences`：是否展开实体引用节点。

2. **使用 TreeWalker 对象的方法进行遍历：**
		- `parentNode()`：移动到当前节点的父节点。
		- `firstChild()`：移动到当前节点的第一个子节点。
		- `lastChild()`：移动到当前节点的最后一个子节点。
		- `nextSibling()`：移动到当前节点的下一个兄弟节点。
		- `previousSibling()`：移动到当前节点的上一个兄弟节点。
		- `nextNode()`：按照深度优先的顺序移动到下一个节点。
		- `previousNode()`：按照深度优先的顺序移动到上一个节点。

## 应用场景

1. **查找特定类型的节点：** 可以使用 TreeWalker 查找特定类型的节点，例如查找所有的链接节点或图片节点。
2. **过滤特定属性的节点：** 可以使用 TreeWalker 过滤特定属性的节点，例如查找所有包含特定 class 名称的节点。
3. **提取文本内容：** 可以使用 TreeWalker 提取 DOM 树中的所有文本内容。
4. **实现自定义选择器：** 可以使用 TreeWalker 实现自定义的选择器，用于查找符合特定条件的节点。

## 示例

### 查找所有链接节点

```javascript
const treeWalker = document.createTreeWalker(
  document.body,
  NodeFilter.SHOW_ELEMENT,
  {
    acceptNode: function(node) {
      return node.tagName === 'A' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  },
  false
);

let link;
while (link = treeWalker.nextNode()) {
  console.log(link.href);
}
```

## 注意事项

1. **性能：** 避免在大型 DOM 树中使用 TreeWalker，否则可能会影响页面性能。
2. **过滤器：** 合理使用过滤器，可以提高遍历效率。
3. **只读访问：** TreeWalker 只能用于读取 DOM 树，不能用于修改 DOM 树。

## 参考资料

- MDN Web Docs: [https://developer.mozilla.org/zh-CN/docs/Web/API/TreeWalker](https://developer.mozilla.org/zh-CN/docs/Web/API/TreeWalker)
- DOM Living Standard: [https://dom.spec.whatwg.org/#treewalker](https://dom.spec.whatwg.org/#treewalker)
