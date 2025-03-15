---
url: https://segmentfault.com/a/1190000020420469
aliases: JavaScript - 手动实现 new - 个人文章 - SegmentFault 思否
tags: 
desc: new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。new 关键字会进行如下的操作： 创建一个空的简单 JavaScript 对象（即 {}）； 链...
---
## 概念

`new` **运算符**创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。`new` 关键字会进行如下的操作：

1.  创建一个空的简单 JavaScript 对象（即`{}`）；
2.  链接该新创建的对象（即设置该对象的__proto__）到该函数的原型对象 prototype 上 ；
3.  将步骤 1 新创建的对象作为 `this` 的上下文 ；
4.  如果该函数没有返回对象类型 `Object`(`包含Functoin`, `Array`, `Date`, `RegExg`, `Error`)，则返回新创建的对象。

`new constructor[([arguments])]`  
参数：  
`constructor`

*   一个指定对象实例的类型的类或函数。

`arguments`

*   一个用于被 constructor 调用的参数列表。

```
function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
}

var car1 = new Car('Eagle', 'Talon TSi', 1993);

console.log(car1.make); // "Eagle"
```

## 简单实现

```
function newOperator(ctor) {
    if (typeof ctor !== 'function'){
        throw 'newOperator function the first param must be a function';
    }

    var args = Array.prototype.slice.call(arguments, 1);
    // 1.创建一个空的简单JavaScript对象（即{}）
    var obj = {};
    // 2.链接该新创建的对象（即设置该对象的__proto__）到该函数的原型对象prototype上
    obj.__proto__ = ctor.prototype;
    // 3.将步骤1新创建的对象作为this的上下文
    var result = ctor.apply(obj, args);
    // 4.如果该函数没有返回对象，则返回新创建的对象

    var isObject = typeof result === 'object' && result !== null;
    var isFunction = typeof result === 'function';
    return isObject || isFunction ? result : obj;
}

function Car(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
  }
  
  var car1 = newOperator(Car, 'Eagle', 'Talon TSi', 1993);
  console.log('car1: ', car1);
```

## 更完整的实现

```
/**
 * 模拟实现 new 操作符
 * @param  {Function} ctor [构造函数]
 * @return {Object|Function|Regex|Date|Error}      [返回结果]
 */
function newOperator(ctor){
    if(typeof ctor !== 'function'){
      throw 'newOperator function the first param must be a function';
    }
    // ES6 new.target 是指向构造函数
    newOperator.target = ctor;
    // 1.创建一个全新的对象，
    // 2.并且执行[[Prototype]]链接
    // 4.通过`new`创建的每个对象将最终被`[[Prototype]]`链接到这个函数的`prototype`对象上。
    var newObj = Object.create(ctor.prototype);
    // ES5 arguments转成数组 当然也可以用ES6 [...arguments], Aarry.from(arguments);
    // 除去ctor构造函数的其余参数
    var argsArr = [].slice.call(arguments, 1);
    // 3.生成的新对象会绑定到函数调用的`this`。
    // 获取到ctor函数返回结果
    var ctorReturnResult = ctor.apply(newObj, argsArr);
    // 小结4 中这些类型中合并起来只有Object和Function两种类型 typeof null 也是'object'所以要不等于null，排除null
    var isObject = typeof ctorReturnResult === 'object' && ctorReturnResult !== null;
    var isFunction = typeof ctorReturnResult === 'function';
    if(isObject || isFunction){
        return ctorReturnResult;
    }
    // 5.如果函数没有返回对象类型`Object`(包含`Functoin`, `Array`, `Date`, `RegExg`, `Error`)，那么`new`表达式中的函数调用会自动返回这个新的对象。
    return newObj;
}
```

更详细介绍请看大佬的这篇[面试官问：能否模拟实现 JS 的 new 操作符](https://link.segmentfault.com/?enc=pGehacYnQCKPXR%2Bz%2F59IwA%3D%3D.hf4%2FEKPHYoPovc98A7WJoR15srWazP4a5kiTTZ%2Bam%2BHFEwklvsLxIRNKvQOJXcDY)