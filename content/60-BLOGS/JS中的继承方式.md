---
uid: 202603221800
title: JS中的继承方式
aliases: [JavaScript继承方式]
description: 全面介绍JavaScript中的7种继承方式及其优缺点
tags: [前端开发/JavaScript]
date-created: 2026-03-22
date-modified: 2026-03-25
status: cultivating
category: blog
content-type: article
published: true
---

## JS 中的继承方式

> JavaScript 中有多种继承方式，本文全面介绍 7 种继承方式的原理、优缺点及适用场景。

---

## 引言

继承是面向对象编程的核心特性之一。在 JavaScript 中，由于其独特的原型链机制，继承的实现方式比传统类语言更加多样。本文将介绍 7 种常见的继承方式，帮助你理解每种方式的原理和适用场景。

---

## 主体

### 1. 原型链继承

```javascript
function Parent() {
  this.name = 'parent';
}
function Child() {}
Child.prototype = new Parent();
```

**优点**：简单直观
**缺点**：所有实例共享原型对象的引用类型属性

### 2. 构造函数继承

```javascript
function Parent(name) {
  this.name = name;
}
function Child(name) {
  Parent.call(this, name);
}
```

**优点**：解决引用类型共享问题
**缺点**：方法无法复用

### 3. 组合继承

```javascript
function Parent(name) {
  this.name = name;
}
function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}
Child.prototype = new Parent();
Child.prototype.constructor = Child;
```

**优点**：结合原型链和构造函数优点
**缺点**：调用两次父构造函数

### 4. 原型式继承

```javascript
const parent = { name: 'parent' };
const child = Object.create(parent);
```

**优点**：简洁
**缺点**：引用类型共享问题

### 5. 寄生式继承

```javascript
function createChild(parent) {
  const child = Object.create(parent);
  child.sayHi = () => {};
  return child;
}
```

**优点**：可增强对象
**缺点**：方法无法复用

### 6. 寄生组合继承（推荐）

```javascript
function inherit(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype);
  Child.prototype.constructor = Child;
}
```

**优点**：寄生组合继承实际上不调用父构造函数，而是通过 Object.create 复制父类 prototype
**缺点**：代码略复杂

### 7. ES6 class 继承

```javascript
class Parent {
  constructor(name) {
    this.name = name;
  }
}
class Child extends Parent {
  constructor(name, age) {
    super(name);
    this.age = age;
  }
}
```

**优点**：语法简洁，语义清晰
**缺点**：本质还是原型链

---

## 总结

JavaScript 提供了多种继承方式，从最初的原型链继承到现代的 ES6 class 继承。理解这些方式的原理有助于更好地掌握 JavaScript 的面向对象编程。**寄生组合继承**是最理想的继承方式，而 **ES6 class** 是最推荐的写法。

---

## 相关阅读

- [[继承]]
- [[原型链]]
- [[原型]]
- [[class]]
