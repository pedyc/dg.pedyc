---
uid: 202603160001
title: 基础类型和接口（TypeScript）
description: TypeScript 基础类型包括 string、number、boolean 等，接口用于定义对象的结构
tags: [前端/TypeScript]
date-created: 2026-03-16
date-modified: 2026-03-17
status: fleeting
content-type: term
up: "[[TypeScript]]"
---

## 基础类型和接口（TypeScript）

> TypeScript 基础类型是 JS 类型的超集，接口用于定义对象的结构和形状。

### 基础类型

- **原始类型**：`string`、`number`、`boolean`、`null`、`undefined`
- **Symbol**：`symbol`
- **大整数**：`bigint`
- **数组**：`number[]`、`Array<number>`
- **元组**：`[string, number]`
- **枚举**：`enum`
- **Any/Unknown/Void/Never**

### 接口 vs 类型别名

```typescript
// 接口
interface User {
  name: string;
  age: number;
}

// 类型别名
type User = {
  name: string;
  age: number;
};
```

**区别**：接口可被合并（声明合并），类型别名更适合联合类型和映射类型。

### 关联

- **父级**：[[TypeScript]]
- **进阶**：[[泛型（TypeScript）]]
