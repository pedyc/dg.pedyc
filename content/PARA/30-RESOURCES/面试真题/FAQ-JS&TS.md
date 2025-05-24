---
title: FAQ-JS&TS
tags: [算法题单]
date-created: 2025-04-10
date-modified: 2025-05-21
---

https://grok.com/chat/b9ed646e-33d7-4be1-b4e4-c129d8da580f

## async 和 defer

- [x] 解释 script 标签 async 和 defer 的区别 ✅ 2025-05-17 ^a51aaa

> async：异步下载脚本，一旦下载完成，暂停解析 HTML 直到脚本执行完毕
> defer：异步下载脚本，等待 HTML 解析完毕然后执行脚本

## 防抖和节流

- [x] 说说防抖和节流的区别 ✅ 2025-05-19

> 防抖只执行最后一次请求，例如输入框联想、按钮防重复点击
> 节流限制触发频率，例如表单提交、滚动事件

## HTTP

- [x] 说一下你对 HTTP 和 HTTPS 的理解 ✅ 2025-05-19

> HTTP 是一种基于 TCP/IP 的无状态协议，用于在 Web 浏览器和 Web 服务器之间传输数据。数据通过明文传输，存在安全风险，默认使用 80 端口
> HTTPS 是 HTTP 的安全版本，通过 SSL/TLS 证书对数据进行加密，确保数据传输的安全性，防止数据被窃听或篡改。HTTPS 默认使用 443 端口。SSL/TLS 协议提供身份验证和加密通信

- [x] 说说你对 HTTP、HTTP2、HTTP3 的理解 ✅ 2025-05-21

> 常用的版本是 HTTP1.1，基于 TCP/IP 协议，支持持久连接。但存在队头阻塞和头部冗余等问题。
> HTTP2 增加了多路复用、头部压缩、服务器推送等能力，提高了性能。多路复用允许在一个 TCP 连接上同时发送多个请求和响应，解决了头部阻塞的问题，头部压缩使用 HPACK 算法对头部信息进行压缩，减小了头部大小，提升了带宽利用。服务器推送允许服务器向客户端推送资源，减少了客户端的请求次数。
> HTTP/3 基于 QUIC 协议，QUIC 协议基于 UDP 协议，并在此基础上实现了可靠传输、拥塞控制、加密等功能。 解决了 TCP 队头阻塞问题，提高了在网络环境较差的情况下的传输效率。 HTTP/3 还支持 0-RTT 连接，减少了连接建立的延迟。 此外，QUIC 协议强制使用 TLS 加密，提高了安全性。

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

- [x] 说明一下 this 绑定存在哪些情形？ ✅ 2025-05-19

> 默认绑定：直接调用绑定全局
> 显式绑定：使用 call/apply/bind 绑定到显示对象
> 隐式绑定：对象调用绑定到对象
> new 绑定：绑定到新建的对象
> 箭头函数绑定：绑定到外层函数的 this 值

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
