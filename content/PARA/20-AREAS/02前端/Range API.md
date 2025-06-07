---
title: Range API
description: Range 接口表示 HTML 文档或 XML 文档文档片段中连续的范围区域。
tags: [前端开发, DOM]
date-created: 2025-06-02
date-modified: 2025-06-02
content-type: concept
keywords: [Range, DOM API]
para: AREA
related: ["[[DOM]]"]
zettel: permanent
---

## 定义

Range 接口表示 HTML 文档或 XML 文档文档片段中连续的范围区域。可以使用 Range 对象在文档中选择内容片段，并执行复制、删除、插入等操作。

## 核心特点

- **灵活选择：** Range 对象可以精确地选择文档中的内容片段，包括文本、元素和属性。
- **多种操作：** Range 对象提供了多种操作方法，可以对选定的内容进行复制、删除、插入、提取等操作。
- **跨节点选择：** Range 对象可以选择跨多个节点的连续内容。
- **独立于 DOM 树：** Range 对象只是一个表示文档范围的抽象概念，并不直接操作 DOM 树。

## 如何使用 Range API？

1. **创建 Range 对象：**

```javascript
const range = document.createRange();
```

2. **设置 Range 对象的起始和结束位置：**
		- `setStart(node, offset)`：设置 Range 对象的起始位置。
		- `setEnd(node, offset)`：设置 Range 对象的结束位置。
		- `setStartBefore(node)`：设置 Range 对象的起始位置在指定节点之前。
		- `setStartAfter(node)`：设置 Range 对象的起始位置在指定节点之后。
		- `setEndBefore(node)`：设置 Range 对象的结束位置在指定节点之前。
		- `setEndAfter(node)`：设置 Range 对象的结束位置在指定节点之后。

3. **使用 Range 对象的方法进行操作：**
		- `cloneRange()`：创建一个新的 Range 对象，与当前 Range 对象具有相同的起始和结束位置。
		- `deleteContents()`：从文档中删除 Range 对象选定的内容。
		- `extractContents()`：将 Range 对象选定的内容从文档中提取出来，并返回一个 DocumentFragment 对象。
		- `cloneContents()`：复制 Range 对象选定的内容，并返回一个 DocumentFragment 对象。
		- `insertNode(node)`：在 Range 对象的起始位置插入一个节点。
		- `surroundContents(node)`：将 Range 对象选定的内容用指定的节点包裹起来。
		- `toString()`：返回 Range 对象选定的文本内容。

## 应用场景

1. **富文本编辑器：** 可以使用 Range API 实现富文本编辑器的各种功能，例如选择文本、复制文本、删除文本、插入文本、设置文本样式等。
2. **文本高亮：** 可以使用 Range API 实现文本高亮功能，例如在搜索结果中高亮关键词。
3. **内容提取：** 可以使用 Range API 提取文档中的特定内容，例如提取文章的摘要或关键词。
4. **自定义选择器：** 可以使用 Range API 实现自定义的选择器，用于选择符合特定条件的文本或元素。

## 示例

### 提取选定的文本内容

```html
<p id="paragraph">This is a paragraph with some <strong>important</strong> text.</p>
```

```javascript
const paragraph = document.getElementById('paragraph');
const range = document.createRange();
range.setStart(paragraph.firstChild, 0);
range.setEnd(paragraph.lastChild.firstChild, 8);

const selectedText = range.toString();
console.log(selectedText); // "This is a paragraph with some "
```

### 高亮目标文本内容

- [[怎样实现一个文本高亮功能？]]

## 注意事项

1. **性能：** 避免在大型文档中使用 Range API 进行频繁操作，否则可能会影响页面性能。
2. **兼容性：** Range API 在现代浏览器中得到了广泛支持，但在旧版本浏览器中可能需要使用 polyfill。
3. **错误处理：** 在使用 Range API 时，需要注意处理可能出现的错误，例如 Range 对象选定的内容不存在或无效。

## 参考资料

- MDN Web Docs: [https://developer.mozilla.org/zh-CN/docs/Web/API/Range](https://developer.mozilla.org/zh-CN/docs/Web/API/Range)
- DOM Living Standard: [https://dom.spec.whatwg.org/#range](https://dom.spec.whatwg.org/#range)
