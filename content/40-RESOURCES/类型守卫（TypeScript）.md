---
uid: 202603160004
title: 类型守卫（TypeScript）
description: 类型守卫是在运行时检查类型的方式，用于缩小型别范围
tags:
  - 前端/TypeScript
content-type: term
status: fleeting
up: "[[TypeScript]]"
date-created: 2026-03-16
date-modified: 2026-03-16
---

## 类型守卫（TypeScript）

> 类型守卫是在运行时缩小类型范围的技术，帮助 TypeScript 更精确地推断联合类型。

### 类型守卫方式

```typescript
// typeof
function padLeft(value: string | number) {
  if (typeof value === "string") {
    return value.padStart(5, " "); // value 被推断为 string
  }
  return value.toFixed(2); // value 被推断为 number
}

// instanceof
class Dog { bark() {} }
class Cat { meow() {} }

function makeSound(pet: Dog | Cat) {
  if (pet instanceof Dog) {
    pet.bark();
  } else {
    pet.meow();
  }
}

// in
"bark" in pet;

// 自定义类型守卫
function isString(val: unknown): val is string {
  return typeof val === "string";
}
```

### 关联

- **父级**：[[TypeScript]]
- **前置**：[[基础类型和接口（TypeScript）]]
