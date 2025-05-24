---
title: Promise.all
date-created: 2025-05-20
date-modified: 2025-05-21
---

## 实现

```javascript
/**
 * Promise.all 实现
 * 
 * 接受一个promise数组，返回一个新的promise
 * 当数组中所有的promise都完成时，返回结果数组
 * 当数组中任意一个promise失败时，返回第一个失败的原因
 *
 * @param {Array} promises promise数组
 * @returns {Promise} 新的promise
 */
Promise.all = function (promises) {
    // 参数检查：确保promises是可迭代对象
    if (!promises || typeof promises[Symbol.iterator] !== 'function') {
        return Promise.reject(new TypeError('参数必须是可迭代对象'))
    }
    
    // 空数组直接返回空结果数组
    if (promises.length === 0) {
        return Promise.resolve([])
    }
    
    return new Promise((resolve, reject) => {
        const result = []
        let count = 0
        
        // 使用forEach正确遍历promises数组
        promises.forEach((promise, index) => {
            // 使用Promise.resolve包装，确保非Promise值也能正确处理
            Promise.resolve(promise).then((res) => {
                // 保存结果到对应索引位置
                result[index] = res
                count++
                
                // 当所有promise都完成时，解析最终结果
                if (count === promises.length) {
                    resolve(result)
                }
            }).catch(err => reject(err)) // 任何一个promise失败都会导致整个Promise.all失败
        })
    })
}
```
