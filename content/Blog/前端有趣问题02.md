---
title: someInterestingQuestions02
tags: [JS, 有趣的问题]
date-created: 2025-03-05
date-modified: 2025-03-17
categories: [一些有趣的问题]
date: 2021-02-25 10:15:54
---

`以下语句会如何输出？`

```javascript
console.log('start')

setTimeout(() => {
  console.log('setTimeout')
}, 0)

new Promise((resolve) => {
  console.log('promise')
  resolve()
})
  .then(() => {
    console.log('then1')
  })
  .then(() => {
    console.log('then2')
  })

console.log('end')
```

结果：打印 start promise end then1 then2 setTimeout

原因：简单来说，JS 代码的执行顺序为：同步代码 -->异步代码（微任务 -->宏任务）

分析：

1. 打印 start
2. setTimeout 加入消息队列
3. new Promise 的同步部分执行，打印 promise，then 部分加入消息队列
4. 打印 end
5. 消息队列中先处理微任务 then 的部分，打印 then1，then2
6. 消息队列处理宏任务 setTimeout，打印 setTimeout

## `参考资料`

> [并发模型与事件循环](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop)
>
> [深入理解 js 事件循环机制（浏览器篇）](http://lynnelv.github.io/js-event-loop-browser)
