---
uid: 
title: JavaScript模块化系统解析
aliases: []
author: ped_yc
description: 
tags: [JS, 模块化, 前端工程化]
date-created: 2024-09-16
date-modified: 2025-05-15
status: [YCDONE]
categories: [方法论]
type: [blog]
---

## 前言

模块化是编程中绕不过去的一环，可以说在我们的开发流程中，每时每刻都在使用着模块化，这无疑是一个非常重要的知识点。本文只讨论 JS 模块化，旨在加强对 JS 模块化的认识。主要涉及以下几点：

- JS 模块化的前世今生（为什么要模块化）
- JS 模块化的本质（如何实现模块化）

## 一、JS 模块化的前世今生

### 无模块化

大家都知道模块化是复杂项目中必不可少的一环，良好的模块化能让项目结构更加清晰，提高代码复用性，逻辑与功能分离，加强可维护性。但在一开始，Javascript 中是不存在模块化的，它只是一门玩具语言，为网页添加一点特效而已。功能简单，用法单一。

此时的 js 代码的书写方式是，从上到下，简单明了，直到 `ajax` 出现。

### 模块化萌芽

Google 将 ajax 概念发扬光大，在 Gmail 和 Google 地球等网页应用中大量使用了 ajax 技术，此时人们才惊觉利用 javascript 能够在网页中做到什么。于是越来越多的大型 web 项目开始出现，随之而来的是越来越复杂的业务逻辑与项目结构。问题不可避免的出现了。

1. `全局变量污染`
因为大家写的代码都在同一个全局作用域中，一不小心就可能声明一个已经存在的全局变量，往往就会发生难以预测的错误，这里举一个例子：

```html
<!-- 这是我写的 -->
<script src="a.js"></script>
<script src="b.js"></script>
<!-- 这是同事写的 -->
<script src="c.js"></script>
```

```javascript
// a.js
var name = '这里请不要改'

// c.js
function name(){
	...
}
```

上面有 3 个脚本，a.js、b.js 是我写的，c.js 是同事写的，我定义了一个全局变量 name，同事不知道，他定义了一个全局方法 name()，于是我俩都得懵逼。

*解决方案*

解决方法之一是使用自执行函数包裹（IIFE）：

```javascript
var Module = (function () {
    var _private = 0;
    function getPrivate() {
        return _private;
    }

    return {
        _public: 1,
        getPrivate: getPrivate
    }
})()

Module._private;//undefined
Module.getPrivate();//0
Module._public;//1

//这种方式解决了全局变量污染的问题，但仍暴露了一个全局函数在全局，仍可能存在命名冲突，并且有时需定义许多个这种类型的函数，不够优雅。
```

这种类型的代码确实有用，但大大增加了书写的负担，你只想调用一个方法，却不得不写一长串的前缀。

1. `文件依赖混乱`
文件的依赖往往是无法避免的，例如实现一个 dialog 组件，它调用了一些 utils.js 文件里的方法，那么在引入 `<script src="dialog">` 之前，需要先引入 `<script src="utils">`，当类似的情况越来越多时，依赖就难免混杂，从而增加维护难度。

*解决方案*

这是 Yahoo! 的 YUI3 框架解决方案，通过 requires 一个依赖数组来指定依赖：

```javascript
YUI.add('my-module', function (Y) {
  // ...
}, '0.0.1', {
    requires: ['node', 'event']
});
```

这种类型的代码确实解决了依赖混乱的问题，但当一个文件依赖增多时，这种配置型的代码就会变得复杂而且难看。

在这个时期，不同的 web 团队为了解决项目中遇到的这类难题提出了自己的解决方案，但没有哪种解决方案可以解决所有的问题。

### 几种模块化规范

从以上的例子中可以观察到一些模块化所面临的难题：

1. 如何安全的包装一个模块（不污染模块外的代码）
2. 如何定义模块的唯一标识（解决命名冲突）
3. 如何优雅的暴露模块（不增加复杂依赖）
4. 模块间互相引用的循环依赖问题

在 nodeJS 出现后，Javascript 可以用来编写服务端程序，这时 Javascript 没有模块化的缺点变得更加令人难以忍受，nodeJS 社区开始制定 JS 模块化规范。[Modules/1.0 规范]([Modules/1.0 - CommonJS Spec Wiki](https://wiki.commonjs.org/wiki/Modules/1.0))，首次定义了一个模块应该如何编写：

> 1. 模块的标识应遵循的规则（书写规范）
> 2. 定义全局函数 require，通过传入模块标识来引入其他模块，执行的结果即为别的模块暴漏出来的 API
> 3. 如果被 require 函数引入的模块中也包含依赖，那么依次加载这些依赖
> 4. 如果引入模块失败，那么 require 函数应该报一个异常
> 5. 模块通过变量 exports 来向往暴漏 API，exports 只能是一个对象，暴漏的 API 须作为此对象的属性。

一开始实现 Modules/1.0 规范的是 ServerJS（CommonJS 改名之前的叫法），它的写法如下：

```javascript
// math.js
exports.add = function(){
	var sum = 0,i = 0, args = arguments;
	while(i < 1){
		sum += args[i++];
	}
	return sum;
};

// increment.js
var add = require('math').add;
exports.increment = function(val){
	return add(val,1);
}

// program.js
var inc = require('increment').increment;
var a = 1;
inc(a); //2
```

相比于之前的阶段，此时的代码更加简洁明了，但它只能在服务端运行而难以向浏览器端推广，原因如下：

1. 外层没有 function 包裹，变量直接暴露在全局（如上 increment.js 中的 add 方法）
2. 资源加载方式不同，在服务端，require 一个模块可以直接从内存中读取，消耗时间很小，但在浏览器端，require 一个模块需要向服务器发起一个 http 请求，下载完成后才能运行模块中的代码，也就是说 require 之后的代码必须等到 require 完成后才能执行。
因为这些问题，社区中的主张分裂为 3 种，分别是
- Modules/1.x 派
- Modules/Async 派
- Modules/2.0 派

`Modules/1.x,CommonJS,browserify`
这一派人认为既然 ServerJS 能够在服务端运行良好，只需要在现有基础上进行改进就能适应浏览器端的需求，浏览器端需要 function 包裹（为了保护变量）、需要异步加载，那么就使用一种工具将现有模块转化为适合浏览器端的代码，基于这种想法有基于这个主张，制定了 [Modules/Transport 规范](https://wiki.commonjs.org/wiki/Modules/Transport)，`browserify` 是这种规范的一种实现，它是一种浏览器端的打包工具，能够将 nodeJS 模块转化为浏览器端可用的模块。

`Modules/Async,AMD,RequireJS`
这一派人认为浏览器端与服务端差别巨大，不能沿用原有模块标准。既然浏览器端需要异步加载代码，就通过回调的形式设计规范。其原理是：在模块定义时就指明并加载依赖，当依赖加载完毕后再执行回调中的本模块。因为这种异步的特性设计的规范名为 [AMD（Asynchronous Module Definition）](https://github.com/amdjs/amdjs-api/wiki/AMD-（中文版）)，根据 AMD 规范出现了 `RequireJS` 的实现，它的写法如下：

```javascript
define(id?, dependencies?, factory);

define('increment',['math','other'],function(math){
	// 此时 math 和 other 模块内的代码已经执行完毕
	function increment(val){
		return math.add(val,1)
	}
	// 即使 other 没有被使用到，other 还是被提前执行了
	if(false){
		other.doSomething();
	}
})
```

`Modules/2.0 CMD Sea.js`
这一派人有点类似中间派，既不想丢弃旧的规范，也不像 AMD 那样推倒重来，最终他们制定了 [Modules/Wrappings 规范]([http://wiki.commonjs.org/wiki/Modules/Wrappings](http://wiki.commonjs.org/wiki/Modules/Wrappings)),`SeaJS` 是它的一个实现。写法如下：

```javascript
define(factory);

define(function(require,exports,module){
	// 就近原则，哪里使用哪里声明
	var math = require('math');
	return{
		increment:function(val){
			return math.add(val,1);
		}
	}
}
```

可以看到，它的写法和 RequireJS 很像，那么不同之处在哪里呢？RequireJS 会在依赖加载的第一时间加载并执行依赖内的代码，然后再执行回调内的模块代码；而 SeaJS 会在声明依赖之后才会执行依赖内的代码。总的来说就是：`AMD 推崇依赖前置、提前执行，CMD 推崇依赖就近、延迟执行。`

`ES6 Module`
从 ES6 开始，Javascript 开始有了标准层面的模块化，旨在成为浏览器端和服务器端的通用模块化方案。它的写法很简单，具体如下：

```javascript
// math.js
function add(){
...
}
export {add};

//increment.js
import {add} from './math';
function increment(val){
	return add(val,1);
}
```

那么它和上面提到的几种模块化方案有哪些不同呢？

1. 动态只读引用

> ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令 `import`，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。换句话说，ES6 的 `import` 有点像 Unix 系统的 " 符号连接 "，原始值变了，`import` 加载的值也会跟着变。因此

1. 编译时输出

> ES6 模块不是对象，而是通过 `export` 命令显式指定输出的代码，`import` 时采用静态命令的形式。即在 `import` 时可以指定加载某个输出值，而不是加载整个模块，这种加载称为 " 编译时加载 "。模块内部引用的变化，会反应在外部。

### 总结

1. AMD/CMD/CommonJs 是 js 模块化开发的规范，对应的实现是 require.js/sea.js/Node.js，ES Module 是 ES6 在语言规范上的模块化实现。
2. CommonJS 主要针对服务端，AMD/CMD/ES Module 主要针对浏览器端，容易混淆的是 AMD/CMD。针对服务器端和针对浏览器端有什么本质的区别呢？服务器端一般采用同步加载文件，也就是说需要某个模块，服务器端便停下来，等待它加载再执行，因为这部分很快。而浏览器端采用异步加载，因为需要发送 http 请求，这就需要一个预处理，提前将所需要的模块文件并行加载好。
3. AMD/CMD 的区别：虽然都是并行加载 js 文件，但还是有所区别，AMD 是预加载，在并行加载 js 文件同时，还会解析执行该模块（因为还需要执行，所以在加载某个模块前，这个模块的依赖模块需要先加载完成）；而 CMD 是懒加载，虽然会一开始就并行加载 js 文件，但是不会执行，而是在需要的时候才执行。
4. AMD/CMD 的优缺点：JS 引擎是单线程的，单位时间内只能执行单个任务，所以在加载多个大文件时，会阻塞脚本执行。AMD 会在文件全部加载完毕后才执行代码，CMD 则会遇见依赖再加载代码，在此种情况 CMD 会更快，其他情形则相差不多。

## 二、模块化的本质

> 模块化的本质在于外部只能访问模块暴露出来的属性和方法，可以通过闭包的特性实现。

```javascript
// 原生模块模式
function moduleA() {
    var something = "something";
    var another = "another";
    function doSomething() {
        console.log(something);
    }

    
    function doAnother() {
        console.log(another);
    }
    return {
        doSomething: doSomething,
        doAnother: doAnother
    };
}
// 调用模块内方法
var foo = moduleA();
foo.doSomething(); // something
foo.another; // undefined

// jQuery 类型的模块
// var $ = window.jQuery()
```

在这里通过调用 moduleA() 这个函数来创建模块实例 foo，通过这个模块实例可以调用模块内暴露的变量和方法，但仍存在问题，在于 moduleA 是一个全局函数，可能会造成函数名污染。也可以使用 IIFE 的方式创建：

```javascript
// IIFE
var foo = (function(){
	var something = "something";
	var another = "another";
	function doSomething(){...}
	function doAnother(){...}
	return {
		doSomething: doSomething,
		doAnother: doAnother
	};
})()
```

这种形式避免了函数名冲突，并且实现了单例模式。

大多数模块加载器本质上就是将这种模块定义封装进一个 API，下面给出进一步实现：

```javascript
var moduleCreater = (function Manager(){
	var modules = {};
	// 通过 define 方法定义模块
	function define(id,deps,impl){
		for(let i = 0;i < deps.length;i++){
			// 在这里解包依赖数组
			deps[i] = modules[deps[i]];
		}
		modules[id] = impl.apply(imply,deps);
	}
	function get(id){
		return modules[id];
	}
	return {
		define: define,
		get: get
	}
})()
```

## 参考资料

- 《你不知道的 Javascript》（上卷）
- [js 模块化历程](https://www.cnblogs.com/lvdabao/p/js-modules-develop.html)
- [js 模块化编程之彻底弄懂 CommonJS 和 AMD/CMD！](https://www.cnblogs.com/moxiaowohuwei/p/8692359.html)
- [前端模块化开发那点历史 · Issue #588 · seajs/seajs (github.com)](https://github.com/seajs/seajs/issues/588)
- [从 CommonJS 到 Sea.js · Issue #269 · seajs/seajs (github.com)](https://github.com/seajs/seajs/issues/269)
