---
title: 【一些有趣的问题】03，浮点数
date: 2021-03-06 15:15:54
tags:
  - JS
  - 有趣的问题
categories:
  - 一些有趣的问题
---

`以下语句会如何输出？`
```javascript
0.1 + 0.2 == 0.3；
// false

1 - 0.9 == 0.1;
// false
```
在 JS 中只有一种数值类型，以 64 位表示的双精度浮点类型

`解决方法`
```javascript
(0.1 + 0.2).toFixed(10) == 0.3;
// true

(1 - 0.9).toFixed(10) == 0.1;
// true
```

`可以把运算封装成方法`
```javascript
//加法函数，用来得到精确的加法结果
//说明：javascript 的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
//调用：accAdd(arg1,arg2)
//返回值：arg1 加上 arg2 的精确结果
function accAdd(arg1,arg2){
  var r1,r2,m;
  try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
  try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
  m=Math.pow(10,Math.max(r1,r2))
  return (arg1*m+arg2*m)/m
}
//给 Number 类型增加一个 add 方法，调用起来更加方便。
Number.prototype.add = function (arg){
  return accAdd(arg,this);
}
 
//减法函数，用来得到精确的减法结果
//说明：javascript 的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的减法结果。
//调用：accSub(arg1,arg2)
//返回值：arg1 减去 arg2 的精确结果
function accSub(arg1,arg2){
  var r1,r2,m,n;
  try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
  try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
  m=Math.pow(10,Math.max(r1,r2));
  //last modify by deeka
  //动态控制精度长度
  n=(r1>=r2)?r1:r2;
  return ((arg1*m-arg2*m)/m).toFixed(n);
}
 
//除法函数，用来得到精确的除法结果
//说明：javascript 的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
//调用：accDiv(arg1,arg2)
//返回值：arg1 除以 arg2 的精确结果
function accDiv(arg1,arg2){
  var t1=0,t2=0,r1,r2;
  try{t1=arg1.toString().split(".")[1].length}catch(e){}
  try{t2=arg2.toString().split(".")[1].length}catch(e){}
  with(Math){
    r1=Number(arg1.toString().replace(".",""))
    r2=Number(arg2.toString().replace(".",""))
    return (r1/r2)*pow(10,t2-t1);
  }
}
//给 Number 类型增加一个 div 方法，调用起来更加方便。
Number.prototype.div = function (arg){
  return accDiv(this, arg);
}
 
//乘法函数，用来得到精确的乘法结果
//说明：javascript 的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
//调用：accMul(arg1,arg2)
//返回值：arg1 乘以 arg2 的精确结果
function accMul(arg1,arg2) {
  var m=0,s1=arg1.toString(),s2=arg2.toString();
  try{m+=s1.split(".")[1].length}catch(e){}
  try{m+=s2.split(".")[1].length}catch(e){}
  return  Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
}
//给 Number 类型增加一个 mul 方法，调用起来更加方便。
Number.prototype.mul = function (arg){
  return accMul(arg, this);
}
<br>//验证一下：
console.log(accAdd(1.79, 0.12));  //1.91
console.log(accSub(2.01, 0.12));  //1.89
console.log(accDiv(0.69, 10));    //0.069<br>console.log(accMul(1.01, 1.3));   //1.313　　
```

## `参考资料`
- [浅谈 JavaScript 浮点数及其运算](https://www.cnblogs.com/ppforever/p/5011660.html)
- [JavaScript 数字
](https://www.w3school.com.cn/js/js_numbers.asp)