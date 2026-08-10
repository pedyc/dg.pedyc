---
uid: 202607121903
title: JSON.rawJSON
aliases: ["T-JSON.rawJSON", "T-JSON.parse-source-access"]
description: "ES2026 新增 JSON.parse 源文本访问机制，通过 reviver 第三参数和 JSON.rawJSON 保持原始精度"
tags: ["JavaScript/API", "ECMAScript/ES2026"]
date-created: 2026-07-12
date-modified: 2026-07-12
status: fleeting
content-type: term
up: [[ES2026]]
---

## 术语：JSON.parse source text access

> **主题**：#JavaScript/API

### 定义

ES2026 为 `JSON.parse` 的 reviver 回调新增了第三参数 `{ source }`，暴露原始 JSON 文本中的字符串值，配合 `JSON.rawJSON()` 解决 JSON 序列化/反序列化中的精度丢失问题——特别是大整数和 BigInt。

```js
// reviver 第三参数获取原始文本
JSON.parse("999999999999999999", (key, value, { source }) =>
  BigInt(source)
);
// 999999999999999999n（而非被截断的 1000000000000000000）

// JSON.rawJSON 在 stringify 中保持原值
JSON.stringify(
  9999999999999999n,
  (key, value) => JSON.rawJSON(value)
);
// "9999999999999999"（而非 TypeError）
```

### 跨学科含义

- **在 JavaScript 数据处理中**：消除了 JSON 做序列化/反序列化时对大整数和特定浮点数的精度损失，BigInt 终于可以无损地通过 JSON 传递
- **在 API 设计中**：服务端返回的大整数 ID 或精度敏感的数值可以准确还原，不再需要额外字符串化约定

### 知识网络

- **父级概念**：[[ES2026]] — 属于 ES2026 数据处理增强
- **相关概念**：`JSON.parse`, `JSON.stringify`, `BigInt`
