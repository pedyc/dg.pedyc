---
title: 【一些有趣的问题】05，for..in 与 for..of
date: 2021-03-20 11:15:54
tags:
  - JS
  - 有趣的问题
categories:
  - 一些有趣的问题
---

`以下语句会如何输出？`
```javascript
let arr = [3, 5, 7];
arr.foo = "hello";
// 此时 arr 对象的结构：[3,5,7,foo: 'hello']

for (let i in arr) {
  console.log(i); // 输出 "0", "1", "2", "foo"
}

for (let i of arr) {
  console.log(i); // 输出 "3", "5", "7"
}

// 注意 for...of 的输出没有出现 "hello"

```
`for...in `
- 循环一个指定的变量来循环一个对象所有可枚举的属性。JavaScript 会为每一个不同的属性执行指定的语句。
- 深入一点

`for...of `
- 在可迭代对象（包括 Array、Map、Set、arguments 等等）上创建了一个循环，对值的每一个独特属性调用一次迭代。
- 首先会在向访问对象请求一个迭代器对象，然后通过调用迭代器对象的 next() 方法来遍历所有返回值。

`Symbol.iterator`
-  为每一个对象定义了默认的迭代器。该迭代器可以被 for...of 循环使用。
- 可以通过 Symbol.iterator 来访问可迭代对象的@@iterator 属性
```javascript
var myArray = [1,2,3];
var it = myArray[Symbol.iterator]();
```
