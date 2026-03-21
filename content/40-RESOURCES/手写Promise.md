---
uid: 202603210143
title: 手写Promise
aliases: [SOP-手写Promise]
date-created: 2026-03-20
date-modified: 2026-03-21
content-type: [sop]
---

## 手写 Promise 核心要点总结

### 1. 三大状态管理

```javascript
// ✅ 状态应该是私有的，不可外部修改
#state = 'pending';     // pending | fulfilled | rejected
#value = undefined;     // 存储成功值或失败原因
#callbacks = [];        // 存储等待回调

// ❌ 错误：状态公开可修改
this.state = 'pending';  // 外部可以 p.state = 'xxx'
```

**关键点**：
- 状态只能从 pending → fulfilled 或 pending → rejected
- 状态一旦改变就不能再变
- 使用私有字段或闭包保证封装性

### 2. 构造函数执行器（Executor）

```javascript
constructor(executor) {
// ✅ 定义 resolve 和 reject 函数
const resolve = (value) => {
	if (this.#state === 'pending') {
		this.#state = 'fulfilled';
		this.#value = value;
		// 执行所有等待的回调
		this.#callbacks.forEach(cb => cb.onFulfilled(value));
	}
};

const reject = (reason) => {
	if (this.#state === 'pending') {
		this.#state = 'rejected';
		this.#value = reason;
		// 执行所有等待的回调
		this.#callbacks.forEach(cb => cb.onRejected(reason));
	}
};

// ✅ 控制反转：将控制权交给用户
try {
	executor(resolve, reject);
} catch (error) {
	reject(error);  // 同步错误自动捕获
}
}
```

**关键点**：
- resolve/reject 只能在 pending 状态时生效
- 状态改变后要立即执行所有已存储的回调
- executor 执行时抛出错误要自动 reject

### 3. Then 方法的完整实现

```javascript
then(onFulfilled, onRejected) {
// ✅ 1. 值穿透：处理回调不存在的情况
onFulfilled = onFulfilled || (value => value);
onRejected = onRejected || (reason => { throw reason });

// ✅ 2. 返回新的 Promise（实现链式调用）
return new MyPromise((resolve, reject) => {
	
	// ✅ 3. 封装回调处理函数
	const handleFulfilled = () => {
		try {
			const result = onFulfilled(this.#value);
			// ✅ 4. 处理返回值为 Promise 的情况
			if (result instanceof MyPromise) {
				result.then(resolve, reject);
			} else {
				resolve(result);
			}
		} catch (error) {
			reject(error);
		}
	};
	
	const handleRejected = () => {
		try {
			const result = onRejected(this.#value);
			if (result instanceof MyPromise) {
				result.then(resolve, reject);
			} else {
				reject(result);
			}
		} catch (error) {
			reject(error);
		}
	};
	
	// ✅ 5. 根据当前状态决定执行时机
	if (this.#state === 'fulfilled') {
		handleFulfilled();  // 同步立即执行
	} else if (this.#state === 'rejected') {
		handleRejected();   // 同步立即执行
	} else if (this.#state === 'pending') {
		// 异步等待：存储回调
		this.#callbacks.push({
			onFulfilled: handleFulfilled,
			onRejected: handleRejected
		});
	}
});
}
```

**关键点**：
- 必须返回新的 Promise，不能返回 this
- 回调执行要用 try-catch 捕获错误
- 回调返回值如果是 Promise 要等待完成
- pending 状态要存储回调到队列

### 4. 完整代码模板

```javascript
class MyPromise {
// 私有字段
#state = 'pending';
#value = undefined;
#callbacks = [];

constructor(executor) {
	// resolve 函数
	const resolve = (value) => {
		if (this.#state === 'pending') {
			this.#state = 'fulfilled';
			this.#value = value;
			this.#callbacks.forEach(cb => cb.onFulfilled(value));
		}
	};
	
	// reject 函数
	const reject = (reason) => {
		if (this.#state === 'pending') {
			this.#state = 'rejected';
			this.#value = reason;
			this.#callbacks.forEach(cb => cb.onRejected(reason));
		}
	};
	
	// 执行 executor
	try {
		executor(resolve, reject);
	} catch (error) {
		reject(error);
	}
}

then(onFulfilled, onRejected) {
	// 值穿透
	onFulfilled = onFulfilled || (value => value);
	onRejected = onRejected || (reason => { throw reason });
	
	// 返回新 Promise
	return new MyPromise((resolve, reject) => {
		
		const handleFulfilled = () => {
			try {
				const result = onFulfilled(this.#value);
				if (result instanceof MyPromise) {
					result.then(resolve, reject);
				} else {
					resolve(result);
				}
			} catch (error) {
				reject(error);
			}
		};
		
		const handleRejected = () => {
			try {
				const result = onRejected(this.#value);
				if (result instanceof MyPromise) {
					result.then(resolve, reject);
				} else {
					reject(result);
				}
			} catch (error) {
				reject(error);
			}
		};
		
		// 状态判断
		if (this.#state === 'fulfilled') {
			handleFulfilled();
		} else if (this.#state === 'rejected') {
			handleRejected();
		} else {
			this.#callbacks.push({
				onFulfilled: handleFulfilled,
				onRejected: handleRejected
			});
		}
	});
}

// 可选：catch 方法
catch(onRejected) {
	return this.then(null, onRejected);
}

// 可选：finally 方法
finally(onFinally) {
	return this.then(
		value => MyPromise.resolve(onFinally()).then(() => value),
		reason => MyPromise.resolve(onFinally()).then(() => { throw reason })
	);
}

// 静态方法
static resolve(value) {
	if (value instanceof MyPromise) return value;
	return new MyPromise(resolve => resolve(value));
}

static reject(reason) {
	return new MyPromise((_, reject) => reject(reason));
}

static all(promises) {
	return new MyPromise((resolve, reject) => {
		const results = [];
		let completed = 0;
		
		if (promises.length === 0) {
			resolve(results);
			return;
		}
		
		promises.forEach((promise, index) => {
			MyPromise.resolve(promise).then(
				value => {
					results[index] = value;
					completed++;
					if (completed === promises.length) {
						resolve(results);
					}
				},
				reject
			);
		});
	});
}

static race(promises) {
	return new MyPromise((resolve, reject) => {
		promises.forEach(promise => {
			MyPromise.resolve(promise).then(resolve, reject);
		});
	});
}
}
```

### 5. 测试用例验证

```javascript
// 测试1：基本功能
const p1 = new MyPromise((resolve) => {
setTimeout(() => resolve('success'), 1000);
});
p1.then(value => console.log(value));  // 1秒后输出: success

// 测试2：链式调用
new MyPromise(resolve => resolve(1))
.then(v => v + 1)
.then(v => v * 2)
.then(v => console.log(v));  // 输出: 4

// 测试3：返回 Promise
new MyPromise(resolve => resolve(1))
.then(v => new MyPromise(resolve => setTimeout(() => resolve(v + 1), 1000)))
.then(v => console.log(v));  // 1秒后输出: 2

// 测试4：错误处理
new MyPromise((_, reject) => reject('error'))
.catch(e => console.log('catch:', e));  // 输出: catch: error

// 测试5：值穿透
new MyPromise(resolve => resolve(100))
.then()
.then()
.then(v => console.log(v));  // 输出: 100

// 测试6：多个 then 等待
const p2 = new MyPromise(resolve => setTimeout(() => resolve('data'), 1000));
p2.then(v => console.log('1:', v));
p2.then(v => console.log('2:', v));
p2.then(v => console.log('3:', v));
// 1秒后同时输出三条
```

### 6. 常见错误及避免

| 错误 | 正确做法 |
|------|---------|
| ❌ 直接修改 this.state | ✅ 使用私有字段 #state |
| ❌ then 返回 this | ✅ 返回新的 Promise 实例 |
| ❌ 直接 resolve(result) | ✅ 判断 result 是否为 Promise |
| ❌ 不处理值穿透 | ✅ 设置默认回调函数 |
| ❌ 不捕获 try-catch | ✅ 所有回调都要 try-catch |
| ❌ pending 时不存储回调 | ✅ 存储到 callbacks 数组 |
| ❌ resolve/reject 不检查状态 | ✅ 只在 pending 时执行 |

### 7. 记忆口诀

```bash
状态私有不能改，pending 只能变一次
构造函数控反转，同步错误要捕获
then 法返回新实例，回调可选值穿透
try-catch 包回调，Promise 返回要等待
pending 状态存队列，fulfilled/rejected 立即行
```

### 8. 自测清单

- [ ] 状态是私有的，外部无法直接修改
- [ ] resolve/reject 只能在 pending 时执行
- [ ] 状态改变后执行所有存储的回调
- [ ] then 返回新的 Promise
- [ ] 值穿透：不传回调时值传递
- [ ] 回调返回值是 Promise 时要等待
- [ ] 回调执行用 try-catch 包裹
- [ ] pending 状态时存储回调
- [ ] 支持链式调用
- [ ] 错误可以冒泡传递
