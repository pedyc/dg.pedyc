---
uid: 202603160005
title: TypeScript的类型是编译时约束
description: 类型检查只发生在编译阶段，编译产物里没有任何类型信息
tags: [前端/TypeScript]
date-created: 2026-03-16
date-modified: 2026-10-24
content-type: atomic
up: "[[TypeScript]]"
noteId: 1792465710684
---

> TypeScript 的类型检查**只发生在编译阶段**，编译后的 JavaScript 里不包含任何类型信息——类型在开发时约束你，运行时管不了你。

**边界**：因此不能依赖类型做运行时逻辑（用 `typeof` 判断接口、靠泛型做分支都不会生效）。类型断言更是只告诉编译器「相信我」，它不做任何检查。需要运行时保障就得自己写校验。

## 论据/示例

```typescript
// TypeScript
function greet(name: string): string {
  return "Hello, " + name;
}

// 编译后的 JavaScript
function greet(name) {
  return "Hello, " + name;
}
```

类型被整个擦除，产物是纯 JS。这决定了 TS 的定位：它是开发期发现错误的工具，不是运行时的安全边界。

## 关联

- [[TypeScript]] — 父级概念
