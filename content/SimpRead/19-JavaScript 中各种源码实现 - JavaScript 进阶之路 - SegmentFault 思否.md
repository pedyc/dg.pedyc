---
title: 19-JavaScript 中各种源码实现 - JavaScript 进阶之路 - SegmentFault 思否
aliases: [JavaScript 中各种源码实现 - JavaScript 进阶之路 - SegmentFault 思否]
tags: []
date-created: 2025-03-15
date-modified: 2025-04-03
desc: 能够手撕各种 JavaScript 原生函数，可以说是进大厂必备！同时对 JavaScript 源码的学习和实现也能帮助我们快速扎实地提升自己的前端编程能力。
url: https://segmentfault.com/a/1190000021758529
---

![[SimpRead/_resources/19-JavaScript 中各种源码实现 - JavaScript 进阶之路 - SegmentFault 思否/b7b8b0a80f493763b6097635e59de867_MD5.jpg]]

## 前言

能够手撕各种 JavaScript 原生函数，可以说是进大厂必备！同时对 JavaScript 源码的学习和实现也能帮助我们快速扎实地提升自己的前端编程能力。

最近很多人和我一样在积极地准备前端面试笔试，所以就整理了一些前端面试笔试中非常容易被问到的原生函数实现和各种前端原理实现，其中 [部分源码戳这里](https://link.segmentfault.com/?enc=Dg3FZGu%2FEVUFgROhF8JTBw%3D%3D.VPgdrr7d4u2ZrNfhTcjM3GNNepKUt9tv7EvWb4OHLJRlLarG8Qfeqh2vIYvVHbPePmhStLeYhvhUJdahxc4NIzRsbUEwtmJI2JI08RUVqHdmNgNuXqg55SsERTUcnqNT)。

## 实现一个 new 操作符

我们首先知道 new 做了什么：

1. 创建一个空的简单 JavaScript 对象（即 {}）；
2. 链接该对象（即设置该对象的构造函数）到另一个对象 ；
3. 将步骤（1）新创建的对象作为 this 的上下文 ；
4. 如果该函数没有返回对象，则返回 this。

知道 new 做了什么，接下来我们就来实现它

```javascript
function create(Con, ...args){
  // 创建一个空的对象
  this.obj = {};
  // 将空对象指向构造函数的原型链
  Object.setPrototypeOf(this.obj, Con.prototype);
  // obj绑定到构造函数上，便可以访问构造函数中的属性，即this.obj.Con(args)
  let result = Con.apply(this.obj, args);
  // 如果返回的result是一个对象则返回
  // new方法失效，否则返回obj
  return result instanceof Object ? result : this.obj;
}
```

## 实现一个 Array.isArray

思路很简单，就是利用 Object.prototype.toString

```javascript
Array.myIsArray = function(o) { 
  return Object.prototype.toString.call(Object(o)) === '[object Array]'; 
};
```

## 实现一个 Object.create() 方法

```javascript
function create =  function (o) {
    var F = function () {};
    F.prototype = o;
    return new F();
};
```

## 实现一个 EventEmitter

真实经历，最近在字节跳动的面试中就被面试官问到了，要求手写实现一个简单的 Event 类。

```javascript
class Event {
  constructor () {
    // 储存事件的数据结构
    // 为查找迅速， 使用对象（字典）
    this._cache = {}
  }

  // 绑定
  on(type, callback) {
    // 为了按类查找方便和节省空间
    // 将同一类型事件放到一个数组中
    // 这里的数组是队列， 遵循先进先出
    // 即新绑定的事件先触发
    let fns = (this._cache[type] = this._cache[type] || [])
    if(fns.indexOf(callback) === -1) {
      fns.push(callback)
    }
    return this
    }

  // 解绑
  off (type, callback) {
    let fns = this._cache[type]
    if(Array.isArray(fns)) {
      if(callback) {
        let index = fns.indexOf(callback)
        if(index !== -1) {
          fns.splice(index, 1)
        }
      } else {
        // 全部清空
        fns.length = 0
      }
    }
    return this
  }
  // 触发emit
  trigger(type, data) {
    let fns = this._cache[type]
    if(Array.isArray(fns)) {
      fns.forEach((fn) => {
        fn(data)
      })
    }
    return this
  }

  // 一次性绑定
  once(type, callback) {
    let wrapFun = () => {
      callback.call(this);
      this.off(type, wrapFun); // 执行完以后立即解绑
    };
    this.on(type, wrapFun); // 绑定
    return this;
  }
}

let e = new Event()

e.on('click',function(){
  console.log('on')
})
// e.trigger('click', '666')
console.log(e)
```

## 实现一个 Array.prototype.reduce

先回忆一下 Array.prototype.reduce 语法：

```javascript
Array.prototype.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])
```

然后就可以动手实现了：

```javascript
Array.prototype.myReduce = function(callback, initialValue) {
  let accumulator = initialValue ? initialValue : this[0];
  for (let i = initialValue ? 0 : 1; i < this.length; i++) {
    let _this = this;
    accumulator = callback(accumulator, this[i], i, _this);
  }
  return accumulator;
};

// 使用
let arr = [1, 2, 3, 4];
let sum = arr.myReduce((acc, val) => {
  acc += val;
  return acc;
}, 5);

console.log(sum); // 15
```

## 实现一个 call 或 apply

先来看一个 call 实例，看看 call 到底做了什么：

```javascript
let foo = {
  value: 1
};
function bar() {
  console.log(this.value);
}
bar.call(foo); // 1
```

从代码的执行结果，我们可以看到，call 首先改变了 this 的指向，使函数的 this 指向了 foo, 然后使 bar 函数执行了。
总结一下：

1. call 改变函数 this 指向
2. 调用函数

思考一下：我们如何实现上面的效果呢？代码改造如下：

```javascript
Function.prototype.myCall = function(context) {
  context = context || window;
  //将函数挂载到对象的fn属性上
  context.fn = this;
  //处理传入的参数
  const args = [...arguments].slice(1);
  //通过对象的属性调用该方法
  const result = context.fn(...args);
  //删除该属性
  delete context.fn;
  return result
};
```

我们看一下上面的代码：

1. 首先我们对参数 context 做了兼容处理，不传值，context 默认值为 window；
2. 然后我们将函数挂载到 context 上面, context.fn = this；
3. 处理参数，将传入 myCall 的参数截取，去除第一位，然后转为数组；
4. 调用 context.fn，此时 fn 的 this 指向 context；
5. 删除对象上的属性 delete context.fn；
6. 将结果返回。

以此类推，我们顺便实现一下 apply，唯一不同的是参数的处理, 代码如下：

```javascript
Function.prototype.myApply = function(context) {
  context = context || window
  context.fn = this
  let result
  // myApply的参数形式为(obj,[arg1,arg2,arg3]);
  // 所以myApply的第二个参数为[arg1,arg2,arg3]
  // 这里我们用扩展运算符来处理一下参数的传入方式
  if (arguments[1]) {
    result = context.fn(…arguments[1])
  } else {
    result = context.fn()
  }
  delete context.fn;
  return result
};
```

以上便是 call 和 apply 的模拟实现，唯一不同的是对参数的处理方式。

## 实现一个 Function.prototype.bind

```javascript
function Person(){
  this.name="zs";
  this.age=18;
  this.gender="男"
}
let obj={
  hobby:"看书"
}
//  将构造函数的this绑定为obj
let changePerson = Person.bind(obj);
//  直接调用构造函数,函数会操作obj对象,给其添加三个属性;
changePerson();
//  1、输出obj
console.log(obj);
//  用改变了this指向的构造函数,new一个实例出来
let p = new changePerson();
// 2、输出obj
console.log(p);
```

仔细观察上面的代码，再看输出结果。

我们对 Person 类使用了 bind 将其 this 指向 obj，得到了 changeperson 函数，此处如果我们直接调用 changeperson 会改变 obj，若用 new 调用 changeperson 会得到实例 p, 并且其 __proto__ 指向 Person, 我们发现 bind 失效了。

我们得到结论：__用 bind 改变了 this 指向的函数，如果用 new 操作符来调用，bind 将会失效。__

这个对象就是这个构造函数的实例，那么只要在函数内部执行 __this instanceof 构造函数__ 来判断其结果是否为 true，就能判断函数是否是通过 new 操作符来调用了，若结果为 true 则是用 new 操作符调用的，代码修正如下：

```javascript
// bind实现
Function.prototype.mybind = function(){
  // 1、保存函数
  let _this = this;
  // 2、保存目标对象
  let context = arguments[0]||window;
  // 3、保存目标对象之外的参数,将其转化为数组;
  let rest = Array.prototype.slice.call(arguments,1);
  // 4、返回一个待执行的函数
  return function F(){
    // 5、将二次传递的参数转化为数组;
    let rest2 = Array.prototype.slice.call(arguments)
    if(this instanceof F){
      // 6、若是用new操作符调用,则直接用new 调用原函数,并用扩展运算符传递参数
      return new _this(...rest2)
    }else{
      //7、用apply调用第一步保存的函数，并绑定this，传递合并的参数数组，即context._this(rest.concat(rest2))
      _this.apply(context,rest.concat(rest2));
    }
  }
};
```

## 实现一个 JS 函数柯里化

Currying 的概念其实并不复杂，用通俗易懂的话说：只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。

```javascript
function progressCurrying(fn, args) {

    let _this = this
    let len = fn.length;
    let args = args || [];

    return function() {
        let _args = Array.prototype.slice.call(arguments);
        Array.prototype.push.apply(args, _args);

        // 如果参数个数小于最初的fn.length，则递归调用，继续收集参数
        if (_args.length < len) {
            return progressCurrying.call(_this, fn, _args);
        }

        // 参数收集完毕，则执行fn
        return fn.apply(this, _args);
    }
}
```

## 手写防抖 (Debouncing) 和节流 (Throttling)

### 防抖

防抖函数 onscroll 结束时触发一次，延迟执行

```javascript
function debounce(func, wait) {
  let timeout;
  return function() {
    let context = this; // 指向全局
    let args = arguments;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func.apply(context, args); // context.func(args)
    }, wait);
  };
}
// 使用
window.onscroll = debounce(function() {
  console.log('debounce');
}, 1000);
```

### 节流

节流函数 onscroll 时，每隔一段时间触发一次，像水滴一样

```javascript
function throttle(fn, delay) {
  let prevTime = Date.now();
  return function() {
    let curTime = Date.now();
    if (curTime - prevTime > delay) {
      fn.apply(this, arguments);
      prevTime = curTime;
    }
  };
}
// 使用
var throtteScroll = throttle(function() {
  console.log('throtte');
}, 1000);
window.onscroll = throtteScroll;
```

## 手写一个 JS 深拷贝

乞丐版

```javascript
JSON.parse(JSON.stringfy));
```

非常简单，但缺陷也很明显，比如拷贝其他引用类型、拷贝函数、循环引用等情况。

基础版

```javascript
function clone(target){
  if(typeof target === 'object'){
    let cloneTarget = {};
    for(const key in target){
      cloneTarget[key] = clone(target[key])
    }
    return cloneTarget;
  } else {
    return target
  }
}
```

写到这里已经可以帮助你应付一些面试官考察你的递归解决问题的能力。但是显然，这个深拷贝函数还是有一些问题。

一个比较完整的深拷贝函数，需要同时考虑对象和数组，考虑循环引用：

```javascript
function clone(target, map = new WeakMap()) {
  if(typeof target === 'object'){
    let cloneTarget = Array.isArray(target) ? [] : {};
    if(map.get(target)) {
      return target;
    }
    map.set(target, cloneTarget);
    for(const key in target) {
      cloneTarget[key] = clone(target[key], map)
    }
    return cloneTarget;
  } else {
    return target;
  }
}
```

## 实现一个 instanceOf

原理： L 的 __proto__ 是不是等于 R.prototype，不等于再找 L.__proto__.__proto__ 直到 __proto__ 为 null

```javascript
// L 表示左表达式，R 表示右表达式
function instance_of(L, R) {
    var O = R.prototype;
  L = L.__proto__;
  while (true) {
        if (L === null){
            return false;
        }
        // 这里重点：当 O 严格等于 L 时，返回 true
        if (O === L) {
            return true;
        }
        L = L.__proto__;
  }
}
```

## 实现一个原型链继承

```javascript
function myExtend(C, P) {
    var F = function(){};
    F.prototype = P.prototype;
    C.prototype = new F();
    C.prototype.constructor = C;
    C.super = P.prototype;
}
```

## 实现一个 async/await

### 原理

就是利用 generator（生成器）分割代码片段。然后我们使用一个函数让其自迭代，每一个 yield 用 promise 包裹起来。执行下一步的时机由 promise 来控制

### 实现

```javascript
function _asyncToGenerator(fn) {
  return function() {
    var self = this,
      args = arguments;
    // 将返回值promise化
    return new Promise(function(resolve, reject) {
      // 获取迭代器实例
      var gen = fn.apply(self, args);
      // 执行下一步
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
      }
      // 抛出异常
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
      }
      // 第一次触发
      _next(undefined);
    });
  };
}
```

## 实现一个 Array.prototype.flat() 函数

最近字节跳动的前端面试中也被面试官问到，要求手写实现。

```javascript
Array.prototype.myFlat = function(num = 1) {
  if (Array.isArray(this)) {
    let arr = [];
    if (!Number(num) || Number(num) < 0) {
      return this;
    }
    this.forEach(item => {
      if(Array.isArray(item)){
        let count = num
        arr = arr.concat(item.myFlat(--count))
      } else {
        arr.push(item)
      }  
    });
    return arr;
  } else {
    throw tihs + ".flat is not a function";
  }
};
```

## 实现一个事件代理

这个问题一般还会让你讲一讲事件冒泡和事件捕获机制

```javascript
<ul id="color-list">
    <li>red</li>
    <li>yellow</li>
    <li>blue</li>
    <li>green</li>
    <li>black</li>
    <li>white</li>
  </ul>
  <script> (function () {
      var color_list = document.getElementById('color-list');
      color_list.addEventListener('click', showColor, true);
      function showColor(e) {
        var x = e.target;
        if (x.nodeName.toLowerCase() === 'li') {
          alert(x.innerHTML);
        }
      }
    })(); </script>
```

## 实现一个 Vue 的双向绑定

Vue 2.x 的 Object.defineProperty 版本

```javascript
// 数据
const data = {
  text: 'default'
};
const input = document.getElementById('input');
const span = document.getElementById('span');
// 数据劫持
Object.defineProperty(data, 'text', {
  // 数据变化 —> 修改视图
  set(newVal) {
    input.value = newVal;
    span.innerHTML = newVal;
  }
});
// 视图更改 --> 数据变化
input.addEventListener('keyup', function(e) {
  data.text = e.target.value;
});
```

Vue 3.x 的 proxy 版本

```javascript
// 数据
const data = {
  text: 'default'
};
const input = document.getElementById('input');
const span = document.getElementById('span');
// 数据劫持
const handler = {
  set(target, key, value) {
    target[key] = value;
    // 数据变化 —> 修改视图
    input.value = value;
    span.innerHTML = value;
    return value;
  }
};
const proxy = new Proxy(data, handler);

// 视图更改 --> 数据变化
input.addEventListener('keyup', function(e) {
  proxy.text = e.target.value;
});
```

思考：Vue 双向绑定的实现，使用 ES6 的 Proxy 相比 Object.defineProperty 有什么优势？

## 实现一个 Array.prototype.map()

先看看 reduce 和 map 的使用方法

```javascript
let new_array = arr.map(function callback(currentValue[, index[,array) {}[, thisArg])

let result = arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])
```

最常见的方式我们可以用一个 for 循环来实现：

```javascript
Array.prototype.myMap = function(callback, thisArg) {
  let arr = [];
  for (let i = 0; i < this.length; i++) {
    arr.push(callback.call(thisArg, this[i], i, this));
  }
  return arr;
};
```

同样的我们也可以用数组的 reduce 方法实现

```javascript
Array.prototype.myMap2 = function(callback, thisArg) {
  let result = this.reduce((accumulator, currentValue, index, array) => {
    accumulator.push(callback.call(thisArg, currentValue, index, array));
    return accumulator;
  }, []);
  return result;
};
```

## 结语

看完如果觉得对你有帮助，劳烦点个赞哈，你的鼓励就是我更新最大的动力！

学习使我快乐！

__本文参考：__
[各种源码实现，你想要的这里都有 - 前端技匠 - 掘金](https://link.segmentfault.com/?enc=92j0QKLKd3QeF9E5DKFuuw%3D%3D.Q%2B2sT7RuUaxjBMAlRKkL94dOvEefAVfKcJIsBx7it04BIBACR3r3e6A3JSCxlcGdMdDKtE533pvmVB9rHJ6%2FTmc6fI3IexQo2WGMyilinYYyQGAUrH%2F%2BZkMMv7gwxnRU)
[重写手动实现 bind 函数 - 挥刀北上 - 腾讯云](https://link.segmentfault.com/?enc=ttafn9lVybPQoFEXLe4QUg%3D%3D.bmVyr1R3OrEpSb8clL7Qje%2Fo0vyNSz8HXFOfiQ%2Bzu2XodkznKhtnurl1wQ5eSQq%2BBUEA9mzcPo8udV0MAjVHhw%3D%3D)

__推荐阅读：__
[【专题：JavaScript 进阶之路】](https://segmentfault.com/blog/cloudysjavascript)
[七大经典排序算法小结](https://segmentfault.com/a/1190000021638663)
[深入理解 ES6 Promise](https://segmentfault.com/a/1190000020934044)
[JavaScript 之函数柯理化](https://segmentfault.com/a/1190000021056692)
[ES6 尾调用和尾递归](https://segmentfault.com/a/1190000020694801)

__我是 Cloudy，现居上海，年轻的前端攻城狮一枚，爱专研，爱技术，爱分享。__
__个人笔记，整理不易，感谢 `关注`、`阅读`、`点赞` 和 `收藏`。__
__文章有任何问题欢迎大家指出，也欢迎大家一起交流各种前端问题！__
