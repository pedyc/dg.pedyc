---
title: await关键字是让出线程的标志
aliases: []
description: await关键字是让出线程的标志，其后的语句被视作微任务
tags: []
date-created: 2026-08-18
date-modified: 2026-08-30
status: fleeting
content-type: atomic
up: ["[[事件循环]]"]
---

> await 是 Generator+Promise的语法糖，是让出线程的标志，await 之后的语句等价于包裹在Promise.then 的微任务中。

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
