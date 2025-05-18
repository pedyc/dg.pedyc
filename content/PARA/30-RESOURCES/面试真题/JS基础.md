---
title: JS基础
tags: [算法题单]
date-created: 2025-04-10
date-modified: 2025-05-17
---

https://grok.com/chat/b9ed646e-33d7-4be1-b4e4-c129d8da580f

## JS 基础

- [x] async 和 defer 的区别 ✅ 2025-05-17 ^a51aaa

> async：异步下载脚本，一旦下载完成，暂停解析 HTML 直到脚本执行完毕
> defer：异步下载脚本，等待 HTML 解析完毕然后执行脚本

## 事件循环

- [x] 解释 JavaScript 的事件循环机制 ✅ 2025-05-17

> 同步代码 -> 微任务 -> 渲染 -> 宏任务 -> 微任务 ->..
> 1.执行同步代码：同步代码从上到下执行，遇见函数压入调用栈，执行完毕弹出。
> 2.检查微任务队列：调用栈清空后检查微任务队列，依次执行所有微任务，直至队列清空
> 3.渲染：浏览器可能进行 DOM 更新、布局计算、绘制
> 4.执行宏任务：从宏任务队列取出任务执行
> 5.重复循环（第二步）

- [x] 宏任务和微任务的区别是什么？ ✅ 2025-05-17

> 1.宏任务在每次事件循环执行一个，微任务会清空队列
> 2.宏任务由宿主环境触发，微任务由 JS 引擎触发
> 3.宏任务可能阻塞渲染（长时间宏任务），微任务一定阻塞渲染（清空队列后才能渲染）

- [x] 常见的宏任务和微任务有哪些？ ✅ 2025-05-17

> 宏任务：setTimeout/setInterval, I/O， DOM 事件回调（click, load, scroll, resize）
> 微任务：Promise.then, queryMicrotask, process.nextTick, MutationObserver

- [x] 解释以下代码的输出： ✅ 2025-05-17

```javascript
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);
```

> 1 4 3 2

## 闭包

- [x] 什么是闭包？举例说明闭包的使用场景。 ✅ 2025-05-17

> 闭包是函数定义时和作用域的绑定
> 模块化、私有变量

- [x] 以下代码如何输出？为什么？如何修复？ ✅ 2025-05-17

```javascript
for (var i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 0);
}
```

> 5 5 5 5 5
> setTimeout 是一个微任务，会在同步代码执行完毕后执行，此时 i 的值为 5
> 使用 let 代替 var，或者使用 IIFE

## This

- [x] 以下代码中 this 指向哪里？ ✅ 2025-05-17

```javascript
const obj = {
  name: 'test',
  fn: function() { console.log(this.name); }
};
obj.fn(); // 输出？
const fn2 = obj.fn;
fn2(); // 输出？
```

> 输出：test, undefined
> this 会绑定到调用函数的对象

## 深拷贝与浅拷贝

👉[[深拷贝和浅拷贝]]

- [x] 深拷贝和浅拷贝的区别？实现一个深拷贝函数。 ✅ 2025-05-17

> 深拷贝创造一个全新的对象，修改新对象不会影响原对象
> 浅拷贝复制指向原对象的指针，修改新对象会影响原对象，反之亦然

```javascript
var deepClone = function(obj){
	if(obj === null || typeof obj !== 'object') return obj;
	const map = new WeakMap();
	if(map.has(obj)) return map.get(obj);
	const result = Array.isArray(obj) ? [] : {};
	map.set(obj,result);
	for(let key in obj){
		if(obj.hasOwnProperty(key)){
			result[key] = deepClone(obj[key],map);
		}
	}
	return result;
}
```

## WeakMap、WeakSet、WeakRef

👉[[25-javascript - WeakMap 和 Map 的区别，WeakMap 原理，为什么能被 GC？ - 个人文章 - SegmentFault 思否|javascript - WeakMap 和 Map 的区别，WeakMap 原理，为什么能被 GC？ - 个人文章 - SegmentFault 思否]]

- [x] 说一下你对 WeakMap、WeakSet、WeakRef 三者的理解 ✅ 2025-05-17

> 与原类型相比，Weak 类型创建对对象的弱引用
> 不阻止垃圾回收
> 不可枚举，没有 size 属性
> 适用于内存敏感的场景（如缓存、临时记录等）
