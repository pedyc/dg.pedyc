---
uid: 20250519000000
title: This绑定
aliases: [T-This绑定, this binding]
tags: [前端/JavaScript]
date-created: 2025-05-19
date-modified: 2026-08-02
status: active
content-type: [term]
up: "[[JavaScript]]"
---

## 术语：This 绑定

> **领域**：#前端/JavaScript

### 定义

`this` 是 JavaScript 中一个==指向执行上下文对象==的特殊关键字，其绑定在函数调用时==动态确定==。

> [!warning] 注意！
> 每次函数调用都会产生新的执行上下文，this 是执行上下文的一个属性，this 的值在创建执行上下文时确定，函数内部访问 this，就是从当前执行上下文中读取。

> [!key] 关键点
> - this 不是在定义时确定，而是在调用时（创建执行上下文时）
> - 不同调用方式创建不同的执行上下文，因此 this 不同
> - 箭头函数没有自己的执行上下文，从外层普通函数继承
> - 异步回调创建新的执行上下文，this 重新绑定

> this 的值是在什么时候确定的？有哪几种绑定规则？ #card
> 在调用时（创建执行上下文时）确定，而非定义时。规则：默认绑定（全局）、隐式绑定（对象方法）、显式绑定（call/apply/bind）、new 绑定；箭头函数没有自己的执行上下文，从外层作用域继承 this。

**示例**：

- **默认绑定**：函数直接调用时，`this` 指向全局对象

```javascript
function showThis() { console.log(this); }
showThis(); // window
```

- **隐式绑定**：作为对象方法调用时，`this` 指向该对象

```javascript
const obj = { name: 'Trae', greet() { console.log(this.name); } };
obj.greet(); // Trae
```

- **显式绑定**：通过 `call/apply/bind` 指定 `this`

```javascript
const obj = { name: 'Trae' };
function greet() { console.log(this.name); }
greet.call(obj); // Trae
```

- **箭头函数**：捕获外层作用域的 `this`，（箭头函数没有自己的执行上下文）
- **构造函数**：使用 `new` 时 `this` 指向新实例

### 跨学科含义

- **在 JavaScript 中**：`this` 指向当前执行上下文，在不同调用方式下有不同的绑定规则
- **在其他语言中**：`this` 通常指向当前实例对象（如 Java、C++）

### 关联

- **属于**：[[JavaScript]]
- **引用**：[[闭包]]、[[原型]]、[[执行上下文]]

### FAQ

- [[为何在setTimeout中要显式绑定this]]
