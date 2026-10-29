---
uid: 202603160006
title: TS 泛型在运行时不存在，参数化只在编译期成立
aliases: []
description: 泛型允许在定义函数、接口、类时不指定具体类型，而是在使用时再确定类型
tags:
  - 前端/TypeScript
date-created: 2026-03-16
date-modified: 2026-06-23
status: fleeting
content-type: atomic
up: "[[TypeScript]]"
noteId: 1792465696972
---

> 泛型的本质是~~类型参数化~~——像函数参数一样，类型参数在调用时传入具体类型。

**边界**：TypeScript 的泛型在运行时不存在（类型擦除），「参数化」只在编译期成立。不能像 C# 那样用泛型做运行时类型判断，也不能据此创建实例。

## 论据/示例

```typescript
// 函数参数：运行时传入值
function identity(value) {
  return value;
}

// 泛型：编译时传入类型
function identity<T>(value: T): T {
  return value;
}

identity<string>("hello"); // 显式传入类型
identity("hello");        // 类型推断
```

- **核心优势**：代码复用、类型安全、灵活性

## 关联

- **父级**：[[TypeScript]]
- **相关**：[[泛型（TypeScript）]]
