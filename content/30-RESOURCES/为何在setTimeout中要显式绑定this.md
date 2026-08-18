---
uid: 202603201030
title: 为何在setTimeout中要显式绑定this
aliases: [Q-为何在setTimeout中要显式绑定this]
description: setTimeout 的回调函数 this 默认指向 window，需用 bind/箭头函数显式绑定
tags: [topic/JavaScript, type/question]
date-created: 2026-03-20
date-modified: 2026-03-21
status: cultivating
content-type: question
up: "[[JavaScript]]"
---

## 问题

> 为何 setTimeout 回调需要显式绑定 this？

---

## 背景

在对象方法中使用 setTimeout 包装异步操作时，回调函数中的 this 不再指向该对象，而是指向全局对象（window/global）。这会导致无法访问对象属性。

---

## 现有答案

### 答案 1：执行上下文原理

setTimeout 是一个宏任务，在执行时同步任务已经执行完毕，此时调用栈中已经没有了外围对象的执行上下文。异步回调在调用时创建新的执行上下文，因为是在全局执行上下文中调用，所以 this 指向全局。

```javascript
class ContextDemo {
    constructor() {
        this.name = 'ContextDemo';
    }

    start() {
        console.log('1. start 执行上下文入栈');
        console.log(`this 指向: ${this.name}`);

        setTimeout(function() {
            console.log('2. setTimeout 回调执行上下文入栈');
            console.log(`this 指向: ${this.name || '全局对象'}`);
            console.log('3. setTimeout 回调执行上下文出栈');
        }, 0);

        console.log('4. start 执行上下文出栈');
    }
}

const demo = new ContextDemo();
demo.start();

// 执行顺序和上下文变化：
// 1. start 执行上下文入栈
//    this 指向: ContextDemo
// 4. start 执行上下文出栈  ← 关键：start 先结束
//
// 2. setTimeout 回调执行上下文入栈  ← 之后回调才执行
//    this 指向: 全局对象
// 3. setTimeout 回调执行上下文出栈
```

### 答案 2：this 绑定规则

普通函数作为回调被调用时（非严格模式下），this 默认绑定到 globalThis（window/global），而不是调用时的对象。

### 我的理解

setTimeout 将回调函数作为普通函数调用（而非方法调用），因此遵循默认绑定规则，this 指向全局。

---

## 探索路径

- [x] 理解执行上下文与调用栈的关系
- [x] 理解 this 的默认绑定规则
- [ ] 阅读 V8 源码验证

---

## 待验证

- [ ] 在 Node.js 环境中验证 this 指向

---

## 关联

- **相关问题**：[[This绑定]]、[[防抖和节流]]
- **参考资料**：[[JavaScript]], [[闭包]]
