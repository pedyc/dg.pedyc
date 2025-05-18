---
title: 24-深入理解 JavaScript 的执行流程，执行上下文 EC、变量对象 VO、活动对象 AO、作用域 Scope（链）_js vo ao 机制 - CSDN 博客
aliases: [深入理解 JavaScript 的执行流程，执行上下文 EC、变量对象 VO、活动对象 AO、作用域 Scope（链）_js vo ao 机制 - CSDN 博客]
tags: []
date-created: 2025-05-16
date-modified: 2025-05-17
desc: 文章浏览阅读1.5k次，点赞5次，收藏9次。本文详细阐述了JavaScript的执行上下文、作用域链、VO/AO概念，包括全局和函数执行上下文的创建流程，以及变量声明和函数声明的优先级。通过实例演示了函数声明覆盖变量声明的过程，适合初学者理解JS核心机制。
url: https://blog.csdn.net/yangxinxiang84/article/details/113051811?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.control&dist_request_id=1328641.10297.16155372256670345&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.control
---

这几天在梳理 JS 基础，花了两天的时间重新完整的梳理了 JS 的执行机制，参考了很多网文、[ECMAScript](https://so.csdn.net/so/search?q=ECMAScript&spm=1001.2101.3001.7020) 规范、MDN 的文章，在此做一个总结。感觉这次梳理的应该比较清晰了。

## 一、名词解释

以下几个概念是 JS 解释引擎层面的概念，JS 中无法直接访问。

### **执行上下文：**

Execution Context，下文中简写为 EC。（没找到一个官方的定义）个人理解是 JS 在运行时候记录 JS 运行的时候需要用到的各种属性等信息的一个对象，主要供 JS 引擎解析执行代码用。执行上下文中记录了 [Scope](https://so.csdn.net/so/search?q=Scope&spm=1001.2101.3001.7020)，VO|AO，this。**也就是 EC 有 3 个重要的属性：Scope，VO|AO，this**

**有 3 种执行上下文**：全局执行上下文，函数执行上下文，Eval 执行上下文。本文讲解前两种。

### 执行上下文栈

Execution Context Stack，下文中简写为 ECS。解释引擎记录执行上下文的容器。栈底是全局 EC（全局 EC 只有在关闭该页面的时候才会出栈、销毁），栈顶是当前正在执行的 EC。函数执行完之后会将栈顶 EC 出栈，将执行权交给下一个 EC。

### **Scope：**

[作用域](https://so.csdn.net/so/search?q=%E4%BD%9C%E7%94%A8%E5%9F%9F&spm=1001.2101.3001.7020)，是根据名称查找变量的一套规则，这套规则用来管理 js 引擎根据标识符名称如何查找变量。而一系列的嵌套作用域就形成了**作用域链**。作用域执行上下文的一个关键属性，以链的方式（底层实现到底是链表还是数组呢？）按顺序记录（持有）可访问的变量对象（函数中是活动对象）

### **VO：**

变量对象 （Variable Object），存储了在上下文中定义的变量和函数声明；除了我们无法访问它外，和普通对象没什么区别。每一个执行上下文都有一个与之相关的变量对象，其中存储着上下文中声明的：
变量 VariableDeclaration VD，注意，必须是 JS 中以 var 声明的变量才会记录在这里。let 或者 const 声明的变量不会存在这里。
函数 FunctionDeclaration FD，必须是显式声明的函数，函数表达式不会记录在这里（也就不会有提升）。

### **AO：**

活动对象（Activation Object），在创建函数的时候初始化的一个对象，包含变量对象中的内容。除了上述 VO 中的变量、函数外，还包括函数 arguments 、参数 parameters。AO = VO + function parameters + arguments。函数中不能访问 VO，只能使用 AO。

## 二、原理梳理

### 1，整体流程概览

JS 解释引擎是边解析边执行的。JS 解释引擎在载入一段脚本（进入任何一段 \<script> 标签范围（包括通过 src 引入的外表脚本））的时候，会执行这个流程：（多个 script 标签之间的加载执行顺序问题本文暂时不讨论）

![[SimpRead/_resources/24-深入理解 JavaScript 的执行流程，执行上下文 EC、变量对象 VO、活动对象 AO、作用域 Scope（链）_js vo ao 机制 - CSDN 博客/dec652c4d24ba72954a2ae3e33ba7334_MD5.jpg]]

### 2，创建执行上下文

#### 2.1，创建执行上下文概览

当浏览器首次载入脚本，它将默认进入全局执行上下文。如果在全局代码中调用一个函数，解释引擎执行流将进入被调用的函数，并创建一个新的执行上下文，并将新创建的上下文压入执行栈的顶部。如果你调用当前函数内部的其他函数，相同的事情会再次上演。代码的执行流程进入内部函数，创建一个新的执行上下文并把它压入执行栈的顶部。浏览器总会执行位于栈顶的执行上下文，一旦当前上下文函数执行结束，它将被从栈顶弹出，并将上下文控制权交给当前的栈。这样，堆栈中的上下文就会被依次执行并且弹出堆栈，直到回到全局的上下文。

**参考下图**：

![[SimpRead/_resources/24-深入理解 JavaScript 的执行流程，执行上下文 EC、变量对象 VO、活动对象 AO、作用域 Scope（链）_js vo ao 机制 - CSDN 博客/540a2eef172906bd1b685141ed942db7_MD5.jpg]]

执行上下文栈示例：

####

![[SimpRead/_resources/24-深入理解 JavaScript 的执行流程，执行上下文 EC、变量对象 VO、活动对象 AO、作用域 Scope（链）_js vo ao 机制 - CSDN 博客/8ec600c0c7097d0ca0cbd0b425db68a2_MD5.jpg]]

#### 2.2，创建执行上下文示例：MDN 上的一个例子

```bash
function foo(i) {
    if (i < 0) return;
    console.log('begin:' + i);
    foo(i - 1);
    console.log('end:' + i);
}
foo(2);
 
// 输出:
// begin:2
// begin:1
// begin:0
// end:0
// end:1
// end:2
```

其执行上下文的入栈、出栈流程示意图：

![[SimpRead/_resources/24-深入理解 JavaScript 的执行流程，执行上下文 EC、变量对象 VO、活动对象 AO、作用域 Scope（链）_js vo ao 机制 - CSDN 博客/aebe67c234ebc7ef9193718ff1192c5a_MD5.jpg]]

### 3，创建全局执行上下文，预编译和执行全局代码

这个环节相对简单点，先直接上一个流程图。细节部分参考函数的预编译和执行。

![[SimpRead/_resources/24-深入理解 JavaScript 的执行流程，执行上下文 EC、变量对象 VO、活动对象 AO、作用域 Scope（链）_js vo ao 机制 - CSDN 博客/2cf3152bc3f7d2bb7ef48e8900495fa0_MD5.jpg]]

### 4，创建函数执行上下文，预编译和执行函数代码

**整体流程**：解析代码，创建函数执行上下文，压入执行上下文栈，然后逐行执行。函数执行完成之后，将该函数的 Execution Context 出栈。

1、查找调用函数的代码。
2、执行代码之前，先进入创建上下文阶段：
    - 初始化作用域 [[Scope]]，（拷贝传入的父执行上下文的 Scope），数据结构应该是数组或者链表。
    - 创建活动对象，创建完成之后，将活动对象推入作用域链的最前端：
        - 创建 arguments 对象，检查上下文，初始化参数名称和值并创建引用的复制。
        - 扫描上下文的函数声明（而非函数表达式）：
            - 为发现的每一个函数，在变量对象上创建一个属性——确切的说是函数的名字——其有一个指向函数在内存中的引用。
            - 如果函数的名字已经存在，引用指针将被重写。**函数声明比变量优先级要高，并且定义过程不会被变量覆盖，除非是赋值**
    - 扫描上下文的变量声明：
        - 为发现的每个变量声明，在变量对象上创建一个属性——就是变量的名字，并且将变量的值初始化为 undefined
        - 如果变量的名字已经在变量对象里存在，将不会进行任何操作并继续扫描。
    - 求出上下文内部 this 的值。

3、激活 / 代码执行阶段：
- 在当前上下文上运行 / 解释函数代码，并随着代码一行行执行指派变量的值。

 流程图参考：

![[SimpRead/_resources/24-深入理解 JavaScript 的执行流程，执行上下文 EC、变量对象 VO、活动对象 AO、作用域 Scope（链）_js vo ao 机制 - CSDN 博客/be65bac4b664014eeff9ee02a87d0747_MD5.jpg]]

### 5，示例分析

#### 5.1，VO/AO 创建分析

```bash
var a = "outer";
function foo(i){
    console.log(a);
    console.log(b);
    console.log(c);
    var a = 'hello'
    var b = function(){}
    function c(){}
    console.log(`------------`);
    console.log(a);
    console.log(b);
    console.log(c);
}
foo(22)
```

上述全局代码的 EC 创建阶段是这样的 

```bash
// 模拟的伪代码
// 全局EC
GlobalECObj = {
    [[Scope]] : [VO],
    VO : {
        foo : fnFoo,
        a : "outer"
    },
    this : {}
}
```

当我们调用 `foo(22)` 时，创建阶段是下面这样的

```bash
// 伪代码，函数EC
ECObj = {
    [[Scope]] : [
        {AO},
        {GlobalVO}
    ],
    AO: {
        arguments: {
                0: 22,
                length: 1
        },
        i: 22,
        c: pointer to function c()
        a: undefined,
        b: undefined
    },
    this: { ... }
}
```

正如我们看到的，在上下文创建阶段，VO 的初始化过程如下（**该过程是有先后顺序的：函数的形参 ==>> 函数声明 ==>> 变量声明**）：

- **函数的形参和 arguments**（当进入函数执行上下文时） —— 活动对象的一个属性，其属性名就是形参的名字，其值就是实参的值；对于没有传递的参数，其值为 undefined
		
- **函数声明**（FunctionDeclaration, FD） —— 活动对象的一个属性，其属性名和值都是函数对象创建出来的；_如果 _ 活动对象 _ 已经包含了相同名字的属性，则替换它的值；（含义之一是如果函数的形参已经包含相同的名字的形参，则替换它的值）。_
		
- **变量声明**（var，VariableDeclaration） —— 活动对象的一个属性，其属性名即为变量名，其值为 undefined; _如果变量名和已经声明的函数名或者函数的参数名相同，则不会影响已经存在的属性。_

对于函数的形参没有什么可说的，主要看一下函数的声明以及变量的声明两个部分。

#### **5.2、如何理解函数声明过程中 `如果变量对象已经包含了相同名字的属性，则替换它的值` 这句话？**

看如下这段代码：

```bash
function foo1(a){
    console.log(a); // 'function a(){}'
    function a(){} 
}
foo1(20)
```

我们知道 AO 创建过程中，函数形参的时机是先于函数的声明的，结果是函数体内部声明的 `function a(){}` 覆盖了函数形参 `a` 的声明，因此最后输出 `a` 是一个 `function` 

详细步骤见：

```bash
// 步骤1：根据形参创建arguments，填充形参，用实参赋值给对应的形参。没有实参的赋值为undefined
AO_Step1: {
    arguments: {
            0: 20,
            length: 1
    },
    a: 20,
},
 
// 步骤2：扫描函数声明，此时发现名称为a的函数声明，将其添加到活动对象上，替换掉已经存在的相同名称的属性a，也就是替换你掉形参a的值，替换为函数引用。
AO_Step2: {
    arguments: {
            0: 20,
            length: 1
    },
    a: 指向 function a(){} ,
},
// 步骤3：扫描变量声明，未发现有变量声明。
// 因此，执行阶段，在函数的第一行，输出的是'function a(){}'
```

#### **5.3、**如何理解**变量声明过程中 `如果变量名和已经声明的函数名或者函数的参数名相同，则不会影响已经存在的属性`**这句话**？**

```bash
//情景一：与参数名相同
function foo2(a){
    console.log(a) // 20
    var a = 10
    console.log(a) // 10
}
foo2(20) 
 
//情景二：变量与函数名相同
function foo21(){
    console.log(a) // function a(){}
    var a = 10
    function a(){}
    console.log(a) // 10
}
foo21() 
 
//情景三：参数、函数名、变量名相同。哈哈，真实项目中，谁这样写得拉出去突突突突半小时。
function foo21(a){
    console.log(a) // function a(){}
    var a = 10
    function a(){}
    console.log(a) // 10
}
foo21("fff");
```

#### **5.4、**再体会**函数声明比变量优先级要高，并且定义过程不会被变量覆盖，除非是赋值**

```bash
function foo3(a){
    console.log(a)  // body line 1   // function a(){}
    var a = 10  // body line 2
    function a(){} // body line 3
    console.log(a)  // body line 4   // 输出 10
}
foo3(22, 500)
```

具体步骤详解：

```bash
// 步骤详解，以下是伪代码
// 步骤1.1，创建arguments，添加形参到VO，将实参赋值给对应的形参
foo3_AO_step1_1 = {
    arguments: {
        0: 22,
        1: 500,
        length: 2
    },
    a: 22,
}
 
// 步骤1.2，扫描函数声明，添加到VO，若有同名属性，替换掉它的值。发现函数a的声明，替换掉形参的值。这也是为啥函数是一等公民，可以替换其他的
foo3_AO_step1_2 = {
    arguments: {
        0: 22,
        1: 500,
        length: 2
    },
    a: FD, // 指向 function a(){}
}
 
// 步骤1.3，扫描变量声明，添加到VO，若有同名属性，不做处理，因此这一步还是这样
foo3_AO_step1_3 = {
    arguments: {
        0: 22,
        1: 500,
        length: 2
    },
    a: FD, // 指向 function a(){}
}
 
// 步骤2开始逐行执行
// 步骤2.1 body line 1， 此时输出的a，也就是AO中的a，是一个函数引用
 
// 步骤2.2 body line 2，这里有一个赋值语句，因此会替换掉AO中a的值，此时AO中a的值变为10
foo3_AO_step2_1 = {
    arguments: {
        0: 22,
        1: 500,
        length: 2
    },
    a: 10
}
 
// 步骤2.3 body line 3，这里仅是声明，扫描阶段已经过了，不会添加到AO
// 步骤2.4 body line 4，此时AO中a为10，因此输出10
```

#### 5.5，一个思考题，下面这个代码输出什么？解释一下原因和具体 JS 引擎的执行步骤

```bash
function foo32(a){
    var a 
    function a(){}
    console.log(a)
}
foo32(20)
```

## 三、总结

1、EC 分为两个阶段，创建执行上下文 (有的也叫预编译) 和执行代码。
2、每个 EC 可以抽象为一个对象，这个对象具有三个属性，分别为：作用域链 Scope，VO|AO（AO，VO 只能有一个）以及 this。
3、函数 EC 中的 AO 在进入函数 EC 时，确定了 arguments 对象的属性；在执行函数 EC 时，其它变量属性具体化。
4、VO（函数中是 AO）创建过程中添加对应属性是有先后顺序的：参数声明 > 函数声明 > 变量声明。
    4.1，添加函数声明时，其属性名和值都是函数对象创建出来的；如果活动对象已经包含了相同名字的属性，则替换它的值。函数的一等公民特性。
    4.2，添加变量声明时，其属性名即为变量名，其值为 undefined；如果变量名和已经声明的函数名或者函数的参数名相同，则不会影响已经存在的属性。

5，几个流程图地址：[https://www.processon.com/view/link/600bcfb9637689349033276e](https://www.processon.com/view/link/600bcfb9637689349033276e)

## 四、（主要）参考文章

1，https://www.ecma-international.org/wp-content/uploads/ECMA-262-10th-edition-June-2019.pdf
2，https://feclub.cn/post/content/ec_ecs_hosting
3，https://www.cnblogs.com/pengnima/p/13051306.html
4，https://www.jianshu.com/p/82691a18562d
5，https://www.cnblogs.com/wilber2013/p/4909430.html
6，https://segmentfault.com/a/1190000015600582
7，https://segmentfault.com/a/1190000013662126
8，https://www.cnblogs.com/lianwei123/articles/12984266.html

（本文中一部分示例代码和图片是 copy 来的哈）
