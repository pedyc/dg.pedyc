---
title: 快速幂Pow(x,n)
tags: [数组]
date-created: 2025-04-04
date-modified: 2026-02-25
---

## 题目

https://leetcode.cn/problems/powx-n/description/

实现 [pow(_x_, _n_)](https://www.cplusplus.com/reference/valarray/pow/) ，即计算 `x` 的整数 `n` 次幂函数（即，`xn` ）。

## 实现

思路：快速幂，详见👉[【图解】一张图秒懂快速幂！](https://leetcode.cn/problems/powx-n/solutions/2858114/tu-jie-yi-zhang-tu-miao-dong-kuai-su-mi-ykp3i/)

> [!hint] 复杂度分析
> - 时间复杂度：$O(logn)$
> - 空间复杂度：$O(1)$

```javascript
var myPow = function (x, n) {
    let ans = 1;
    if (n < 0) { // x^-n = (1/x)^n
        n = -n;
        x = 1 / x;
    }
    while (n) { // 从低到高枚举 n 的每个比特位
        if (n % 2) { // 这个比特位是 1
            ans *= x; // 把 x 乘到 ans 中
        }
        x *= x; // x 自身平方
        n >>= 1; // 继续枚举下一个比特位
    }
    return ans;
}
```
