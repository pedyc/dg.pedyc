---
title: await关键字是让出线程的标志
aliases: []
description: await关键字是让出线程的标志，其后的语句被视作微任务
tags: []
date-created: 2026-08-18
date-modified: 2026-10-23
status: fleeting
content-type: atomic
up: "[[事件循环]]"

noteId: 1792475157987
---

> await 是 Generator+Promise的语法糖，是~~让出线程~~的标志，await 之后的语句等价于包裹在Promise.then 的微任务中。

**边界**：让出的是当前 async 函数的执行，不是线程——JS 单线程不交出主线程，只是把后续代码排进微任务队列。等待一个已经 resolve 的值时，这个「让出」不发生实际等待，只发生一次微任务排队。

## 论据/示例

```js
async function func(){
	console.log('func1函数体执行')
	await func2()
	console.log('这里被视作微任务')
}

async function func2(){
	console.log('func2函数体执行')
}

func()

console.log('同步任务执行完毕')
```

以上代码的输出顺序为：
- `func1函数体执行`
- `func2函数体执行`
- `同步任务执行完毕`
- `这里被视作微任务`

## 关联

- [[事件循环]]
- [[async-await|async/await]]
