---
title: Vue2 与 Vue3 数组响应式原理深度剖析
date-created: 2026-08-31
date-modified: 2026-08-31
status: completed
content-type: [article]
---

## 一、 为什么无法拦截"通过索引直接修改值"？

从 JavaScript 语言底层的角度来看，数组实际上是一个**特殊的对象**，其索引（如 `0, 1, 2`）在底层对应的是对象的**属性名**（即字面量字符串 `"0"`, `"1"`, `"2"`）。

既然如此，`Object.defineProperty` 理论上是可以对已有的索引（比如 `arr`）进行劫持的。**但在实际设计中，Vue 2 放弃了这么做，原因在于"性能与收益严重失衡"**：

- **动态性极高**：数组的长度和内容在运行时是高度动态变化的。如果要在数组初始化时，为每一个潜在的索引都通过 `Object.defineProperty` 递归注册 `getter/setter`，在遇到数万条大数据的数组时，会导致极其恐怖的**内存开销**和**初始化耗时**。- **新增索引无法感知**：`Object.defineProperty` 只能劫持**已经存在**的对象属性。如果你声明了一个空数组 `const arr = []`，随后通过 `arr = 'value'` 写入数据，由于 `"0"` 这个属性在初始化时根本不存在，响应式拦截自然也就无法触发。

因此，为了性能的权衡，Vue 2 **主动选择不使用** **Object.defineProperty** **去初始化监听数组的数值索引**。

---

## 二、 为什么无法拦截"对 `length` 属性的修改"？

当你尝试通过修改数组的 `length`（例如 `arr.length = 0`）来清空数组时，Vue 2 同样无法拦截。这涉及到 JS 引擎对数组 `length` 属性的严格底层限制：

在 ECMAScript 规范中，Array 的 `length` 属性具有极高的内部特殊性。如果我们去查看数组 `length` 的属性描述符（Property Descriptor）：

```js
const arr = [2-4];
console.log(Object.getOwnPropertyDescriptor(arr, 'length'));
// 输出:
// { value: 3, writable: true, enumerable: false, configurable: false }
```

可以看到，**length** **属性的** **configurable****（可配置性）永远为** **false**。

在 JavaScript 中，如果一个属性的 `configurable` 为 `false`，就意味着**无法通过** **Object.defineProperty** **重新定义它的描述符（如将其转换为响应式的 getter/setter 拦截器）**。强制对其重写会直接抛出 `TypeError` 错误。这就是为什么 Vue 2 在技术上**绝对无法**原生劫持 `length` 属性。

---

## 三、 Vue 2 是如何"妥协"和"挽救"的？

为了让开发者能够愉快地使用数组，Vue 2 底层使用了一套**黑魔法（Prototype Hacking）**来间接解决这个问题：

1. 拦截并重写 7 个变异方法（Mutation Methods）

Vue 2 在初始化数组时，会拦截数组实例的原型链，用一套**自定义的数组方法**去覆盖原生的 `Array.prototype`。这些被拦截并重写的方法包括：

- **增加元素**：`push`、`unshift`、`splice`- **删除元素**：`pop`、`shift`、`splice`- **排序/反转**：`sort`、`reverse`

当你在代码中调用 `arr.push(4)` 时，执行的其实是 Vue 2 包装过的方法：

- 调用原生的 `Array.prototype.push` 执行数组操作。- 如果是 `push`/`unshift`/`splice` 这种能产生新元素的方法，Vue 会自动获取到这些新增的元素，并对它们**再次进行响应式包装（Observer）**。- 手动触发该数组关联的依赖管理器（`dep.notify()`），通知视图进行更新。

2. 提供规避局限的 API：`Vue.set()`

如果开发者不得不使用索引来修改值，Vue 2 提供了 **this.$set(arr, index, value)**（即全局 `Vue.set`）作为官方出口。 其底层的核心逻辑是：**在内部调用** **arr.splice(index, 1, value)**。因为 `splice` 方法是被 Vue 2 重写过的，所以它能够完美绕过索引修改的限制，顺利触发视图更新。

对于修改 `length`，官方也建议改用 `arr.splice(newLength)` 来代替直接修改 `length`。

---

## 四、 Vue 3 的终极破局：`Proxy` 代理

到了 Vue 3，由于彻底抛弃了 `Object.defineProperty`，改用 ES6 的 **Proxy** 机制，这一历史痛点不复存在：

- **代理的是整个数组，而非单个属性**：`Proxy` 可以在**对象（包括数组）的外层**套上一层"拦截网"，任何对数组的操作（不管是读写数值、删除元素、还是修改属性）都必须穿过这个网。- **原生支持拦截** **set** 和 **deleteProperty**：当你运行 `arr = new` 或 `arr.length = 0` 时，会直接触发 `Proxy` 的 `set` 陷阱（Trap）。Vue 3 能够顺理成章地捕捉到这一行为，执行对应的依赖触发（`trigger`）流程。
