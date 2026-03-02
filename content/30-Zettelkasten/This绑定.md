---
title: This绑定
date-created: 2025-05-19
date-modified: 2025-12-26
---

在前端开发中，`this` 的绑定是一个常见的概念，它的值取决于函数的调用方式。以下是几种常见的 `this` 绑定情形：

## 1. 默认绑定

- **情形**：函数直接调用时，`this` 指向全局对象（在浏览器中是 `window`，在 Node.js 中是 `global`）。
- **示例**：

	```javascript
  function showThis() {
      console.log(this);
  }
  showThis(); // 在浏览器中输出：window
  ```

## 2. 隐式绑定

- **情形**：函数作为对象的方法调用时，`this` 指向调用该方法的对象。
- **示例**：

	```javascript
  const obj = {
      name: 'Trae',
      greet() {
          console.log(`Hello, ${this.name}`);
      }
  };
  obj.greet(); // 输出：Hello, Trae
  ```

## 3. 显式绑定

- **情形**：使用 `call`、`apply` 或 `bind` 方法显式指定 `this` 的值。
- **示例**：

	```javascript
  function greet() {
      console.log(`Hello, ${this.name}`);
  }
  const obj = { name: 'Trae' };
  greet.call(obj); // 输出：Hello, Trae
  ```

## 4. 箭头函数绑定

- **情形**：箭头函数没有自己的 `this`，它会捕获外层函数的 `this` 值。
- **示例**：

	```javascript
  const obj = {
      name: 'Trae',
      greet: () => {
          console.log(`Hello, ${this.name}`);
      }
  };
  obj.greet(); // 输出：Hello, undefined（因为箭头函数捕获的是全局 this）
  ```

## 5. 构造函数绑定

- **情形**：使用 `new` 关键字调用构造函数时，`this` 指向新创建的对象实例。
- **示例**：

	```javascript
  function Person(name) {
      this.name = name;
  }
  const person = new Person('Trae');
  console.log(person.name); // 输出：Trae
  ```

## 6. 事件处理函数绑定

- **情形**：在事件处理函数中，`this` 通常指向触发事件的 DOM 元素。
- **示例**：

	```javascript
  document.querySelector('button').addEventListener('click', function() {
      console.log(this); // 输出：<button>…</button>
  });
  ```

## 7. 回调函数绑定

- **情形**：在回调函数中，`this` 的值取决于回调函数的调用方式。如果没有显式绑定，`this` 可能指向全局对象。
- **示例**：

	```javascript
  setTimeout(function() {
      console.log(this); // 在浏览器中输出：window
  }, 1000);
  ```

## 总结

- `this` 的值取决于函数的调用方式，常见情形包括默认绑定、隐式绑定、显式绑定、箭头函数绑定、构造函数绑定、事件处理函数绑定和回调函数绑定。
- 在编写代码时，需要特别注意 `this` 的绑定，尤其是在使用回调函数和箭头函数时。
