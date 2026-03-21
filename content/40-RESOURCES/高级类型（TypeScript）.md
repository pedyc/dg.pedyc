---
uid: 202603160003
title: 高级类型（TypeScript）
description: 高级类型包括联合类型、交叉类型、映射类型、条件类型等
tags: [前端/TypeScript]
date-created: 2026-03-16
date-modified: 2026-03-18
status: fleeting
content-type: term
up: "[[TypeScript]]"
---

## 高级类型（TypeScript）

> 高级类型是 TypeScript 类型系统的强大特性，支持更复杂的类型操作和抽象。

### 联合类型与交叉类型

```typescript
// 联合类型：可以是其中之一
type ID = string | number;

// 交叉类型：合并多个类型
type Extended = Base & Extra;
```

### 映射类型

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

### 条件类型

```typescript
type IsString<T> = T extends string ? true : false;
```

### 工具类型

TypeScript 内置的工具类型：

| 工具类型              | 说明                | 示例                            | 备注                               |
| ----------------- | ----------------- | ----------------------------- | -------------------------------- |
| `Partial<T>`      | 所有属性可选            | `Partial<User>`               | `{ id?: number; name?: string }` |
| `Required<T>`     | 所有属性必需            | `Required<User>`              | `{ id: number; name: string }`   |
| `Readonly<T>`     | 所有属性只读            | `Readonly<User>`              | `{ readonly id: number }`        |
| `Pick<T, K>`      | 选择属性              | `Pick<User, 'id' \| 'name'>`  | 只保留指定属性                          |
| `Omit<T, K>`      | 排除属性              | `Omit<User, 'password'>`      | 排除指定属性                           |
| `Record<K, T>`    | 构造对象类型            | `Record<string, number>`      | `{ [key: string]: number }`      |
| `Exclude<T, U>`   | 排除类型              | `Exclude<'a' \| 'b', 'a'>`    | 结果为 `'b'`                        |
| `Extract<T, U>`   | 提取类型              | `Extract<'a' \| 'b', 'a'>`    | 结果为 `'a'`                        |
| `NonNullable<T>`  | 排除 null/undefined | `NonNullable<string \| null>` | 结果为 `string`                     |
| `ReturnType<T>`   | 获取函数返回类型          | `ReturnType<typeof fn>`       | 获取返回值类型                          |
| `Parameters<T>`   | 获取函数参数类型          | `Parameters<typeof fn>`       | 获取参数元组类型                         |
| `InstanceType<T>` | 获取构造函数实例类型        | `InstanceType<typeof Class>`  | 获取实例类型                           |
|                   |                   |                               |                                  |

### 关联

- **父级**：[[TypeScript]]
- **前置**：[[泛型（TypeScript）]]
