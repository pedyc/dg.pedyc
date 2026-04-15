---
uid: 202603160005
title: TypeScript的类型是编译时约束
description: TypeScript 的类型检查发生在编译阶段，编译后的 JavaScript 代码不包含类型信息
tags: [前端/TypeScript]
date-created: 2026-03-16
date-modified: 2026-04-15
status: fleeting
content-type: atomic
up: "[[TypeScript]]"
---

## TypeScript 的类型是编译时约束

> TypeScript 的类型检查发生在编译阶段，编译后的 JavaScript 代码不包含类型信息。

### 核心理解

- **编译时**：TS → JS，类型被擦除
- **运行时**：纯 JS 代码，无类型检查
- **目的**：开发阶段发现错误，提升代码质量

### 示例

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

### 注意事项

- 不能依赖类型来做运行时逻辑
- 需要类型断言时要考虑边界情况

### 关联

- **父级**：[[TypeScript]]
