---
uid: 202603160002
title: 泛型（TypeScript）
description: 泛型允许创建可复用的组件，能够支持多种类型而非单一类型
tags: [前端/TypeScript]
date-created: 2026-03-16
date-modified: 2026-03-17
status: fleeting
content-type: term
up: "[[TypeScript]]"
---

## 泛型（TypeScript）

> 泛型的本质是类型参数化，允许组件支持多种类型而非单一类型。

### 核心概念

- **类型参数**：用尖括号 `<T>` 表示
- **类型约束**：`extends` 限制泛型范围

### 基本用法

```typescript
// 泛型函数
function identity<T>(arg: T): T {
  return arg;
}

// 泛型接口
interface Container<T> {
  value: T;
}

// 泛型类
class Box<T> {
  contents: T;
}
```

### 类型约束

```typescript
interface Lengthwise {
  length: number;
}

function log<T extends Lengthwise>(arg: T): void {
  console.log(arg.length);
}
```

### 关联

- **父级**：[[TypeScript]]
- **前置**：[[基础类型和接口（TypeScript）]]
- **进阶**：[[高级类型（TypeScript）]]
