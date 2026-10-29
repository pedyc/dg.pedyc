---
uid: 202605111000
title: Vue 的宏拿不到运行时信息，参数必须是字面量
aliases: []
description: 宏是一种编译时处理的语法糖，源码中写的是 A，编译器实际处理的是 B
tags: []
date-created: 2026-05-11
date-modified: 2026-10-23
status: active
content-type: atomic
up: "[[Vue]]"

noteId: 1792465697716
---

> 宏在编译期就把调用点替换成代码，所以它看到的是源码里写着的字面量，不是运行时才有的值。传一个编译期能算出的常量可以，传一个运行时才确定的表达式不行——那时宏已经不在了。

**边界**：编译时处理意味着它拿不到运行时信息：`defineProps` 无法按运行时条件声明 props，宏的参数必须是字面量或可静态求值的表达式。

## 论据/示例

**Vue 的 `defineProps()` 宏**：

```vue
<script setup>
	// 用户写的代码
	const props = defineProps({ name: String })
</script>
```

编译后实际变成（编译器重写）：

```javascript
const props = defineProps({ name: String })
// 无需 import，编译器自动识别
```

**与普通函数的区别**：

| | 普通函数 | 宏 |
|:---|:---|:---|
| 调用时机 | 运行时 | 编译时 |
| 打包结果 | 包含在 JS bundle | 被移除或转换 |
| 需要 import | 需要 | 不需要 |

**Vue 中的宏**：
- `defineProps()` — 编译时处理 props 声明
- `defineEmits()` — 编译时处理 emits 声明
- `defineExpose()` — 编译时处理暴露属性
- `withDefaults()` — 编译时处理默认值

**其他语言中的宏**：
- C/C++ `#define` — 文本替换
- Rust `macro_rules!` — 语法展开
- TypeScript 装饰器（实验性）— 编译时处理

## 关联

- [[Vue3语法糖]]
- [[编译时与运行时]]
