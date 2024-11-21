---
title: 14-分享｜从集合论到位运算，常见位运算技巧分类总结！ - 力扣（LeetCode）
aliases: []
uid: 
author: 
description: 
date-created: 2024-11-03
date-modified: 2024-11-19
status: 
tags: []
---

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [leetcode.cn](https://leetcode.cn/circle/discuss/CaOJ45/)

> 图：集合交、按位与之间存在某种联系。

![][img-0]

> 图：集合交、按位与之间存在某种联系。

[](#前言) 前言
---------

本文将扫清位运算的迷雾，在集合论与位运算之间建立一座桥梁。

在高中，我们学了集合论（set theory）的相关知识。例如，包含若干整数的集合 S={0,2,3}。在编程中，通常用哈希表（hash table）表示集合。例如 Java 中的 `HashSet`，C++ 中的 `std::unordered_set`。

在集合论中，有交集 ∩、并集 ∪、包含于 ⊆ 等等概念。如果编程实现「求两个哈希表的交集」，需要一个一个地遍历哈希表中的元素。那么，有没有效率更高的做法呢？

该二进制登场了。

集合可以用二进制表示，二进制**从低到高**第 i 位为 1 表示 i 在集合中，为 0 表示 i 不在集合中。例如集合 {0,2,3} 可以用二进制数 1101(2)​ 表示；反过来，二进制数 1101(2)​ 就对应着集合 {0,2,3}。

正式地说，包含非负整数的集合 S 可以用如下方式「压缩」成一个数字：

 f(S)=i∈S∑​2i

例如集合 {0,2,3} 可以压缩成 20+22+23=13，也就是二进制数 1101(2)​。

利用位运算「并行计算」的特点，我们可以高效地做一些和集合有关的运算。按照常见的应用场景，可以分为以下四类：

1. 集合与集合
2. 集合与元素
3. 遍历集合
4. 枚举集合

[](#一、集合与集合) 一、集合与集合
-------------------

其中 & 表示按位与，∣ 表示按位或，⊕ 表示按位异或，∼ 表示按位取反。

两个集合的「对称差」是只属于其中一个集合，而不属于另一个集合的元素组成的集合，也就是不在交集中的元素组成的集合。

<table><thead><tr><th>术语</th><th>集合</th><th>位运算</th><th>集合示例</th><th>位运算示例</th></tr></thead><tbody><tr><td>交集</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>A</mi><mo>∩</mo><mi>B</mi></mrow><annotation encoding="application/x-tex">A\cap B</annotation></semantics></math>A∩B</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>a</mi><mi mathvariant="normal">&amp;</mi><mi>b</mi></mrow><annotation encoding="application/x-tex">a\&amp;b</annotation></semantics></math>a&amp;b</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mtable rowspacing="0.24999999999999992em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>∩</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>1</mn><mo separator="true">,</mo><mn>2</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>=</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>2</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\begin{aligned}&amp;\{0,2,3\}\\\cap\ &amp;\{0,1,2\}\\=\ &amp;\{0,2\}\end{aligned}</annotation></semantics></math>∩&nbsp;=&nbsp;​{0,2,3}{0,1,2}{0,2}​</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mtable rowspacing="0.24999999999999992em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>1101</mn></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mi mathvariant="normal">&amp;</mi><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>0111</mn></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>=</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>0101</mn></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\begin{aligned}&amp;1101\\\&amp;\ &amp;0111\\=\ &amp;0101\end{aligned}</annotation></semantics></math>&amp;&nbsp;=&nbsp;​110101110101​</td></tr><tr><td>并集</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>A</mi><mo>∪</mo><mi>B</mi></mrow><annotation encoding="application/x-tex">A\cup B</annotation></semantics></math>A∪B</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>a</mi><mtext>&nbsp;</mtext><mi mathvariant="normal">∣</mi><mtext>&nbsp;</mtext><mi>b</mi></mrow><annotation encoding="application/x-tex">a\ \vert\ b</annotation></semantics></math>a&nbsp;∣&nbsp;b</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mtable rowspacing="0.24999999999999992em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>∪</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>1</mn><mo separator="true">,</mo><mn>2</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>=</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>1</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\begin{aligned}&amp;\{0,2,3\}\\\cup\ &amp;\{0,1,2\}\\=\ &amp;\{0,1,2,3\}\end{aligned}</annotation></semantics></math>∪&nbsp;=&nbsp;​{0,2,3}{0,1,2}{0,1,2,3}​</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mtable rowspacing="0.24999999999999992em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>1101</mn></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mi mathvariant="normal">∣</mi><mtext>&nbsp;&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>0111</mn></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>=</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>1111</mn></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\begin{aligned}&amp;1101\\\vert\ \ &amp;0111\\=\ &amp;1111\end{aligned}</annotation></semantics></math>∣&nbsp;&nbsp;=&nbsp;​110101111111​</td></tr><tr><td>对称差</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>A</mi><mtext>&nbsp;</mtext><mi mathvariant="normal">Δ</mi><mtext>&nbsp;</mtext><mi>B</mi></mrow><annotation encoding="application/x-tex">A\ \Delta\ B</annotation></semantics></math>A&nbsp;Δ&nbsp;B</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>a</mi><mo>⊕</mo><mi>b</mi></mrow><annotation encoding="application/x-tex">a\oplus b</annotation></semantics></math>a⊕b</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mtable rowspacing="0.24999999999999992em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mi mathvariant="normal">Δ</mi><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>1</mn><mo separator="true">,</mo><mn>2</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>=</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>1</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\begin{aligned}&amp;\{0,2,3\}\\\Delta\ &amp;\{0,1,2\}\\=\ &amp;\{1,3\}\end{aligned}</annotation></semantics></math>Δ&nbsp;=&nbsp;​{0,2,3}{0,1,2}{1,3}​</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mtable rowspacing="0.24999999999999992em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>1101</mn></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>⊕</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>0111</mn></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>=</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>1010</mn></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\begin{aligned}&amp;1101\\\oplus\ &amp;0111\\=\ &amp;1010\end{aligned}</annotation></semantics></math>⊕&nbsp;=&nbsp;​110101111010​</td></tr><tr><td>差</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>A</mi><mo>∖</mo><mi>B</mi></mrow><annotation encoding="application/x-tex">A\setminus B</annotation></semantics></math>A∖B</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>a</mi><mi mathvariant="normal">&amp;</mi><mo>∼</mo><mi>b</mi></mrow><annotation encoding="application/x-tex">a\&amp;\sim b</annotation></semantics></math>a&amp;∼b</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mtable rowspacing="0.24999999999999992em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>∖</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>1</mn><mo separator="true">,</mo><mn>2</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>=</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\begin{aligned}&amp;\{0,2,3\}\\\setminus\ &amp;\{1,2\}\\=\ &amp;\{0,3\}\end{aligned}</annotation></semantics></math>∖&nbsp;=&nbsp;​{0,2,3}{1,2}{0,3}​</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mtable rowspacing="0.24999999999999992em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>1101</mn></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mi mathvariant="normal">&amp;</mi><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>1001</mn></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>=</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>1001</mn></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\begin{aligned}&amp;1101\\\&amp;\ &amp;1001\\=\ &amp;1001\end{aligned}</annotation></semantics></math>&amp;&nbsp;=&nbsp;​110110011001​</td></tr><tr><td>差（子集）</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>A</mi><mo>∖</mo><mi>B</mi><mo separator="true">,</mo><mtext>&nbsp;</mtext><mi>B</mi><mo>⊆</mo><mi>A</mi></mrow><annotation encoding="application/x-tex">A\setminus B,\ B\subseteq A</annotation></semantics></math>A∖B,&nbsp;B⊆A</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>a</mi><mo>⊕</mo><mi>b</mi></mrow><annotation encoding="application/x-tex">a\oplus b</annotation></semantics></math>a⊕b</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mtable rowspacing="0.24999999999999992em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>∖</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>2</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>=</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mo stretchy="false">{</mo><mn>3</mn><mo stretchy="false">}</mo></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\begin{aligned}&amp;\{0,2,3\}\\\setminus\ &amp;\{0,2\}\\=\ &amp;\{3\}\end{aligned}</annotation></semantics></math>∖&nbsp;=&nbsp;​{0,2,3}{0,2}{3}​</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mtable rowspacing="0.24999999999999992em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>1101</mn></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>⊕</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>0101</mn></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>=</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>1000</mn></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\begin{aligned}&amp;1101\\\oplus\ &amp;0101\\=\ &amp;1000\end{aligned}</annotation></semantics></math>⊕&nbsp;=&nbsp;​110101011000​</td></tr><tr><td>包含于</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>A</mi><mo>⊆</mo><mi>B</mi></mrow><annotation encoding="application/x-tex">A\subseteq B</annotation></semantics></math>A⊆B</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>a</mi><mi mathvariant="normal">&amp;</mi><mi>b</mi><mo>=</mo><mi>a</mi></mrow><annotation encoding="application/x-tex">a\&amp; b = a</annotation></semantics></math>a&amp;b=a<br><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>a</mi><mtext>&nbsp;</mtext><mi mathvariant="normal">∣</mi><mtext>&nbsp;</mtext><mi>b</mi><mo>=</mo><mi>b</mi></mrow><annotation encoding="application/x-tex">a\ \vert\ b = b</annotation></semantics></math>a&nbsp;∣&nbsp;b=b</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>2</mn><mo stretchy="false">}</mo><mo>⊆</mo><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex">\{0,2\}\subseteq \{0,2,3\}</annotation></semantics></math>{0,2}⊆{0,2,3}</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0101</mn><mi mathvariant="normal">&amp;</mi><mn>1101</mn><mo>=</mo><mn>0101</mn></mrow><annotation encoding="application/x-tex">0101\&amp; 1101 = 0101</annotation></semantics></math>0101&amp;1101=0101<br><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0101</mn><mtext>&nbsp;</mtext><mi mathvariant="normal">∣</mi><mtext>&nbsp;</mtext><mn>1101</mn><mo>=</mo><mn>1101</mn></mrow><annotation encoding="application/x-tex">0101\ \vert\ 1101 = 1101</annotation></semantics></math>0101&nbsp;∣&nbsp;1101=1101</td></tr></tbody></table>

> 注 1：按位取反的例子中，仅列出最低 4 个比特位取反后的结果，即 0110 取反后是 1001。
>
> 注 2：包含于（判断子集）的两种位运算写法是等价的，在编程时只需判断其中任意一种。此外，还可以用 `(a & ~b) == 0` 判断，如果成立，也表示 A 是 B 的子集。
>
> 注 3：编程时，请注意运算符的优先级。例如 `==` 在某些语言中优先级比位运算更高。

[](#二、集合与yuan素) 二、集合与元素
----------------------

通常会用到移位运算。

其中 << 表示左移，>> 表示右移。

> 注：左移 i 位相当于乘以 2i，右移 i 位相当于除以 2i。

<table><thead><tr><th>术语</th><th>集合</th><th>位运算</th><th>集合示例</th><th>位运算示例</th></tr></thead><tbody><tr><td>空集</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi mathvariant="normal">∅</mi></mrow><annotation encoding="application/x-tex">\varnothing</annotation></semantics></math>∅</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0</mn></mrow><annotation encoding="application/x-tex">0</annotation></semantics></math>0</td><td></td><td></td></tr><tr><td>单元素集合</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">{</mo><mi>i</mi><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex">\{i\}</annotation></semantics></math>{i}</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1</mn><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&lt;&lt;</mtext><mtext>&nbsp;</mtext><mi>i</mi></mrow><annotation encoding="application/x-tex">1\ \texttt{&lt;&lt;}\ i</annotation></semantics></math>1&nbsp;&lt;&lt;&nbsp;i</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">{</mo><mn>2</mn><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex">\{2\}</annotation></semantics></math>{2}</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1</mn><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&lt;&lt;</mtext><mtext>&nbsp;</mtext><mn>2</mn></mrow><annotation encoding="application/x-tex">1\ \texttt{&lt;&lt;}\ 2</annotation></semantics></math>1&nbsp;&lt;&lt;&nbsp;2</td></tr><tr><td>全集</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>U</mi><mo>=</mo><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>1</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mo>⋯</mo><mi>n</mi><mo>−</mo><mn>1</mn><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex">U=\{0,1,2,\cdots n-1\}</annotation></semantics></math>U={0,1,2,⋯n−1}</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mn>1</mn><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&lt;&lt;</mtext><mtext>&nbsp;</mtext><mi>n</mi><mo stretchy="false">)</mo><mo>−</mo><mn>1</mn></mrow><annotation encoding="application/x-tex">(1\ \texttt{&lt;&lt;}\ n) - 1</annotation></semantics></math>(1&nbsp;&lt;&lt;&nbsp;n)−1</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>1</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex">\{0,1,2,3\}</annotation></semantics></math>{0,1,2,3}</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mn>1</mn><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&lt;&lt;</mtext><mtext>&nbsp;</mtext><mn>4</mn><mo stretchy="false">)</mo><mo>−</mo><mn>1</mn></mrow><annotation encoding="application/x-tex">(1\ \texttt{&lt;&lt;}\ 4)-1</annotation></semantics></math>(1&nbsp;&lt;&lt;&nbsp;4)−1</td></tr><tr><td>补集</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi mathvariant="normal">∁</mi><mi>U</mi></msub><mi>S</mi><mo>=</mo><mi>U</mi><mo>∖</mo><mi>S</mi></mrow><annotation encoding="application/x-tex">\complement_US = U\setminus S</annotation></semantics></math>∁U​S=U∖S</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mo stretchy="false">(</mo><mn>1</mn><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&lt;&lt;</mtext><mtext>&nbsp;</mtext><mi>n</mi><mo stretchy="false">)</mo><mo>−</mo><mn>1</mn><mo stretchy="false">)</mo><mo>⊕</mo><mi>s</mi></mrow><annotation encoding="application/x-tex">((1\ \texttt{&lt;&lt;}\ n) - 1)\oplus s</annotation></semantics></math>((1&nbsp;&lt;&lt;&nbsp;n)−1)⊕s</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>U</mi><mo>=</mo><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>1</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex">U=\{0,1,2,3\}</annotation></semantics></math>U={0,1,2,3}<br><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi mathvariant="normal">∁</mi><mi>U</mi></msub><mo stretchy="false">{</mo><mn>1</mn><mo separator="true">,</mo><mn>2</mn><mo stretchy="false">}</mo><mo>=</mo><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex">\complement_U \{1,2\} = \{0,3\}</annotation></semantics></math>∁U​{1,2}={0,3}</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mtable rowspacing="0.24999999999999992em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>1111</mn></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>⊕</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>0110</mn></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mo>=</mo><mtext>&nbsp;</mtext></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mn>1001</mn></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\begin{aligned}&amp;1111\\\oplus\ &amp;0110\\=\ &amp;1001\end{aligned}</annotation></semantics></math>⊕&nbsp;=&nbsp;​111101101001​</td></tr><tr><td>属于</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>i</mi><mo>∈</mo><mi>S</mi></mrow><annotation encoding="application/x-tex">i\in S</annotation></semantics></math>i∈S</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mi>s</mi><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&gt;&gt;</mtext><mtext>&nbsp;</mtext><mi>i</mi><mo stretchy="false">)</mo><mtext>&nbsp;</mtext><mi mathvariant="normal">&amp;</mi><mtext>&nbsp;</mtext><mn>1</mn><mo>=</mo><mn>1</mn></mrow><annotation encoding="application/x-tex">(s\ \texttt{&gt;&gt;}\ i)\ \&amp;\ 1 =1</annotation></semantics></math>(s&nbsp;&gt;&gt;&nbsp;i)&nbsp;&amp;&nbsp;1=1</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>2</mn><mo>∈</mo><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex">2\in \{0,2,3\}</annotation></semantics></math>2∈{0,2,3}</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mn>1101</mn><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&gt;&gt;</mtext><mtext>&nbsp;</mtext><mn>2</mn><mo stretchy="false">)</mo><mtext>&nbsp;</mtext><mi mathvariant="normal">&amp;</mi><mtext>&nbsp;</mtext><mn>1</mn><mo>=</mo><mn>1</mn></mrow><annotation encoding="application/x-tex">(1101\ \texttt{&gt;&gt;}\ 2)\ \&amp;\ 1 =1</annotation></semantics></math>(1101&nbsp;&gt;&gt;&nbsp;2)&nbsp;&amp;&nbsp;1=1</td></tr><tr><td>不属于</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>i</mi><mo mathvariant="normal">∉</mo><mi>S</mi></mrow><annotation encoding="application/x-tex">i\notin S</annotation></semantics></math>i∈/​S</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mi>s</mi><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&gt;&gt;</mtext><mtext>&nbsp;</mtext><mi>i</mi><mo stretchy="false">)</mo><mtext>&nbsp;</mtext><mi mathvariant="normal">&amp;</mi><mtext>&nbsp;</mtext><mn>1</mn><mo>=</mo><mn>0</mn></mrow><annotation encoding="application/x-tex">(s\ \texttt{&gt;&gt;}\ i)\ \&amp;\ 1 =0</annotation></semantics></math>(s&nbsp;&gt;&gt;&nbsp;i)&nbsp;&amp;&nbsp;1=0</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1</mn><mo mathvariant="normal">∉</mo><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex">1\notin\{0,2,3\}</annotation></semantics></math>1∈/​{0,2,3}</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mn>1101</mn><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&gt;&gt;</mtext><mtext>&nbsp;</mtext><mn>1</mn><mo stretchy="false">)</mo><mtext>&nbsp;</mtext><mi mathvariant="normal">&amp;</mi><mtext>&nbsp;</mtext><mn>1</mn><mo>=</mo><mn>0</mn></mrow><annotation encoding="application/x-tex">(1101\ \texttt{&gt;&gt;}\ 1)\ \&amp;\ 1 =0</annotation></semantics></math>(1101&nbsp;&gt;&gt;&nbsp;1)&nbsp;&amp;&nbsp;1=0</td></tr><tr><td>添加元素</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>S</mi><mo>∪</mo><mo stretchy="false">{</mo><mi>i</mi><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex">S\cup \{i\}</annotation></semantics></math>S∪{i}</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>s</mi><mtext>&nbsp;</mtext><mi mathvariant="normal">∣</mi><mtext>&nbsp;</mtext><mo stretchy="false">(</mo><mn>1</mn><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&lt;&lt;</mtext><mtext>&nbsp;</mtext><mi>i</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">s\ \vert\ (1\ \texttt{&lt;&lt;}\ i)</annotation></semantics></math>s&nbsp;∣&nbsp;(1&nbsp;&lt;&lt;&nbsp;i)</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo><mo>∪</mo><mo stretchy="false">{</mo><mn>2</mn><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex">\{0,3\}\cup \{2\}</annotation></semantics></math>{0,3}∪{2}</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1001</mn><mtext>&nbsp;</mtext><mi mathvariant="normal">∣</mi><mtext>&nbsp;</mtext><mo stretchy="false">(</mo><mn>1</mn><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&lt;&lt;</mtext><mtext>&nbsp;</mtext><mn>2</mn><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">1001\ \vert\ (1\ \texttt{&lt;&lt;}\ 2)</annotation></semantics></math>1001&nbsp;∣&nbsp;(1&nbsp;&lt;&lt;&nbsp;2)</td></tr><tr><td>删除元素</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>S</mi><mo>∖</mo><mo stretchy="false">{</mo><mi>i</mi><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex">S\setminus \{i\}</annotation></semantics></math>S∖{i}</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>s</mi><mi mathvariant="normal">&amp;</mi><mo>∼</mo><mo stretchy="false">(</mo><mn>1</mn><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&lt;&lt;</mtext><mtext>&nbsp;</mtext><mi>i</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">s\&amp;\sim (1\ \texttt{&lt;&lt;}\ i)</annotation></semantics></math>s&amp;∼(1&nbsp;&lt;&lt;&nbsp;i)</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo><mo>∖</mo><mo stretchy="false">{</mo><mn>2</mn><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex">\{0,2,3\}\setminus \{2\}</annotation></semantics></math>{0,2,3}∖{2}</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1101</mn><mi mathvariant="normal">&amp;</mi><mo>∼</mo><mo stretchy="false">(</mo><mn>1</mn><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&lt;&lt;</mtext><mtext>&nbsp;</mtext><mn>2</mn><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">1101\&amp;\sim (1\ \texttt{&lt;&lt;}\ 2)</annotation></semantics></math>1101&amp;∼(1&nbsp;&lt;&lt;&nbsp;2)</td></tr><tr><td>删除元素（一定在集合中）</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>S</mi><mo>∖</mo><mo stretchy="false">{</mo><mi>i</mi><mo stretchy="false">}</mo><mo separator="true">,</mo><mtext>&nbsp;</mtext><mi>i</mi><mo>∈</mo><mi>S</mi></mrow><annotation encoding="application/x-tex">S\setminus \{i\},\ i\in S</annotation></semantics></math>S∖{i},&nbsp;i∈S</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>s</mi><mo>⊕</mo><mo stretchy="false">(</mo><mn>1</mn><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&lt;&lt;</mtext><mtext>&nbsp;</mtext><mi>i</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">s\oplus (1\ \texttt{&lt;&lt;}\ i)</annotation></semantics></math>s⊕(1&nbsp;&lt;&lt;&nbsp;i)</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">{</mo><mn>0</mn><mo separator="true">,</mo><mn>2</mn><mo separator="true">,</mo><mn>3</mn><mo stretchy="false">}</mo><mo>∖</mo><mo stretchy="false">{</mo><mn>2</mn><mo stretchy="false">}</mo></mrow><annotation encoding="application/x-tex">\{0,2,3\}\setminus \{2\}</annotation></semantics></math>{0,2,3}∖{2}</td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1101</mn><mo>⊕</mo><mo stretchy="false">(</mo><mn>1</mn><mtext>&nbsp;</mtext><mtext mathvariant="monospace">&lt;&lt;</mtext><mtext>&nbsp;</mtext><mn>2</mn><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">1101\oplus (1\ \texttt{&lt;&lt;}\ 2)</annotation></semantics></math>1101⊕(1&nbsp;&lt;&lt;&nbsp;2)</td></tr><tr><td>删除最小元素</td><td></td><td><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>s</mi><mi mathvariant="normal">&amp;</mi><mo stretchy="false">(</mo><mi>s</mi><mo>−</mo><mn>1</mn><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">s\&amp; (s-1)</annotation></semantics></math>s&amp;(s−1)</td><td></td><td>见下</td></tr></tbody></table>

```
      s = 101100
    s-1 = 101011 // 最低位的 1 变成 0，同时 1 右边的 0 都取反，变成 1
s&(s-1) = 101000


```

特别地，如果 s 是 2 的幂，那么 s&(s−1)=0。

此外，编程语言提供了一些和二进制有关的库函数，例如：

* 计算二进制中的 1 的个数，也就是**集合大小**；
* 计算二进制长度，**减一**后得到**集合最大元素**；
* 计算二进制尾零个数，也就是**集合最小元素**。

调用这些函数的时间复杂度都是 O(1)。

<table><thead><tr><th>术语</th><th>Python</th><th>Java</th><th>C++</th><th>Go</th></tr></thead><tbody><tr><td>集合大小</td><td><code>s.bit_count()</code></td><td><code>Integer.bitCount(s)</code></td><td><code>__builtin_popcount(s)</code></td><td><code>bits.OnesCount(s)</code></td></tr><tr><td>二进制长度</td><td><code>s.bit_length()</code></td><td><code>32-Integer.numberOfLeadingZeros(s)</code></td><td><code>__lg(s)+1</code></td><td><code>bits.Len(s)</code></td></tr><tr><td>集合最大元素</td><td><code>s.bit_length()-1</code></td><td><code>31-Integer.numberOfLeadingZeros(s)</code></td><td><code>__lg(s)</code></td><td><code>bits.Len(s)-1</code></td></tr><tr><td>集合最小元素</td><td><code>(s&amp;-s).bit_length()-1</code></td><td><code>Integer.numberOfTrailingZeros(s)</code></td><td><code>__builtin_ctz(s)</code></td><td><code>bits.TrailingZeros(s)</code></td></tr></tbody></table>

请特别注意 s=0 的情况。对于 C++ 来说，`__lg(0)` 和 `__builtin_ctz(0)` 是未定义行为。其他语言请查阅 API 文档。

此外，对于 C++ 的 `long long`，需使用相应的 `__builtin_popcountll` 等函数，即函数名后缀添加 `ll`（两个小写字母 L）。`__lg` 支持 `long long`。

特别地，只包含最小元素的子集，即二进制最低 1 及其后面的 0，也叫 lowbit，可以用 `s & -s` 算出。举例说明：

```
     s = 101100
    ~s = 010011
(~s)+1 = 010100 // 根据补码的定义，这就是 -s  =>  s 的最低 1 左侧取反，右侧不变
s & -s = 000100 // lowbit


```

[](#三、遍历集合) 三、遍历集合
-----------------

设元素范围从 0 到 n−1，枚举范围中的元素 i，判断 i 是否在集合 s 中。

* Python3
* Java
* C++
* Go

```
for i in range(n):
    if (s >> i) & 1:  # i 在 s 中
        # 处理 i 的逻辑


```

```
for (int i = 0; i < n; i++) {
    if (((s >> i) & 1) == 1) { // i 在 s 中
        // 处理 i 的逻辑
    }
}


```

```
for (int i = 0; i < n; i++) {
    if ((s >> i) & 1) { // i 在 s 中
        // 处理 i 的逻辑
    }
}


```

```
for i := 0; i < n; i++ {
    if s>>i&1 == 1 { // i 在 s 中
        // 处理 i 的逻辑
    }
}


```

也可以直接遍历集合 s 中的元素：不断地计算集合最小元素、去掉最小元素，直到集合为空。

* Python3
* Java
* C++
* Go

```
t = s
while t:
    lowbit = t & -t
    t ^= lowbit
    i = lowbit.bit_length() - 1
    # 处理 i 的逻辑


```

```
for (int t = s; t > 0; t &= t - 1) {
    int i = Integer.numberOfTrailingZeros(t);
    // 处理 i 的逻辑
}


```

```
for (int t = s; t; t &= t - 1) {
    int i = __builtin_ctz(t);
    // 处理 i 的逻辑
}


```

```
for t := uint(s); t > 0; t &= t - 1 {
    i := bits.TrailingZeros(t)
    // 处理 i 的逻辑
}


```

[](#四、枚举集合) 四、枚举集合
-----------------

## [](#§41-枚举所有集合)§4.1 枚举所有集合

设元素范围从 0 到 n−1，从空集 ∅ 枚举到全集 U：

* Python3
* Java
* C++
* Go

```
for s in range(1 << n):
    # 处理 s 的逻辑


```

```
for (int s = 0; s < (1 << n); s++) {
    // 处理 s 的逻辑
}


```

```
for (int s = 0; s < (1 << n); s++) {
    // 处理 s 的逻辑
}


```

```
for s := 0; s < 1<<n; s++ {
    // 处理 s 的逻辑
}


```

## [](#§42-枚举非空子集)§4.2 枚举非空子集

设集合为 s，**从大到小**枚举 s 的所有**非空**子集 sub：

* Python3
* Java
* C++
* Go

```
sub = s
while sub:
    # 处理 sub 的逻辑
    sub = (sub - 1) & s


```

```
for (int sub = s; sub > 0; sub = (sub - 1) & s) {
    // 处理 sub 的逻辑
}


```

```
for (int sub = s; sub; sub = (sub - 1) & s) {
    // 处理 sub 的逻辑
}


```

```
for sub := s; sub > 0; sub = (sub - 1) & s {
    // 处理 sub 的逻辑
}


```

为什么要写成 `sub = (sub - 1) & s` 呢？

暴力做法是从 s 出发，不断减一，直到 0。但这样做，中途会遇到很多并不是 s 的子集的情况。例如 s=10101 时，减一得到 10100，这是 s 的子集。但再减一就得到 10011 了，这并不是 s 的子集，下一个子集应该是 10001。

把所有的合法子集按顺序列出来，会发现我们做的相当于「压缩版」的二进制减法，例如

 10101→10100→10001→10000→00101→⋯

如果忽略掉 10101 中的两个 0，数字的变化和二进制减法是一样的，即

 111→110→101→100→011→⋯

如何快速跳到下一个子集呢？比如，怎么从 10100 跳到 10001？

* 普通的二进制减法，是 10100−1=10011，也就是把最低位的 1 变成 0，同时把最低位的 1 右边的 0 都变成 1。
* 压缩版的二进制减法也是类似的，对于 10100→10001，也会把最低位的 1 变成 0，对于最低位的 1 右边的 0，并不是都变成 1，只有在 s=10101 中的 1 才会变成 1。怎么做到？减一后 & 10101 就行，也就是 (10100−1) & 10101=10001。

## [](#§43-枚举子集（包含空集）)§4.3 枚举子集（包含空集）

如果要从大到小枚举 s 的所有子集 sub（从 s 枚举到空集 ∅），可以这样写：

* Python3
* Java
* C++
* Go

```
sub = s
while True:
    # 处理 sub 的逻辑
    sub = (sub - 1) & s
    if sub == s:
        break


```

```
int sub = s;
do {
    // 处理 sub 的逻辑
    sub = (sub - 1) & s;
} while (sub != s);


```

```
int sub = s;
do {
    // 处理 sub 的逻辑
    sub = (sub - 1) & s;
} while (sub != s);


```

```
for sub := s; ; {
    // 处理 sub 的逻辑
    sub = (sub - 1) & s
    if sub == s {
        break
    }
}


```

原理是当 sub=0 时（空集），再减一就得到 −1，对应的二进制为 111⋯1，再 &s 就得到了 s。所以当循环到 sub=s 时，说明最后一次循环的 sub=0（空集），s 的所有子集都枚举到了，退出循环。

**注**：还可以枚举全集 U 的所有大小**恰好**为 k 的子集，这一技巧叫做 **Gosper's Hack**，具体请看 [视频讲解](https://leetcode.cn/link/?target=https://www.bilibili.com/video/BV1na41137jv?t=15m43s)。

## [](#§44-枚举超集)§4.4 枚举超集

如果 T 是 S 的子集，那么称 S 是 T 的**超集**（superset）。

枚举超集的原理和上文枚举子集是类似的，这里通过**或运算**保证枚举的集合 S 一定包含集合 T 中的所有元素。

枚举 S，满足 S 是 T 的超集，也是全集 U={0,1,2,⋯,n−1} 的子集。

* Python3
* Java
* C++
* Go

```
s = t
while s < (1 << n):
    # 处理 s 的逻辑
    s = (s + 1) | t


```

```
for (int s = t; s < (1 << n); s = (s + 1) | t) {
    // 处理 s 的逻辑
}


```

```
for (int s = t; s < (1 << n); s = (s + 1) | t) {
    // 处理 s 的逻辑
}


```

```
for s := t; s < 1<<n; s = (s + 1) | t {
    // 处理 s 的逻辑
}


```

[](#关联题单) 关联题单
-------------

* [位运算题单](https://leetcode.cn/circle/discuss/dHn9Vk/)
* [数据结构题单](https://leetcode.cn/circle/discuss/mOr1u6/) 中的「**前缀异或和**」
* [动态规划题单](https://leetcode.cn/circle/discuss/tXLS3i/) 中的「**状压 DP**」

[](#分类题单) 分类题单
-------------

[如何科学刷题？](https://leetcode.cn/circle/discuss/RvFUtj/)

1. [滑动窗口与双指针（定长 / 不定长 / 单序列 / 双序列 / 三指针）](https://leetcode.cn/circle/discuss/0viNMK/)
2. [二分算法（二分答案 / 最小化最大值 / 最大化最小值 / 第 K 小）](https://leetcode.cn/circle/discuss/SqopEo/)
3. [单调栈（基础 / 矩形面积 / 贡献法 / 最小字典序）](https://leetcode.cn/circle/discuss/9oZFK9/)
4. [网格图（DFS/BFS / 综合应用）](https://leetcode.cn/circle/discuss/YiXPXW/)
5. [位运算（基础 / 性质 / 拆位 / 试填 / 恒等式 / 思维）](https://leetcode.cn/circle/discuss/dHn9Vk/)
6. [图论算法（DFS/BFS / 拓扑排序 / 最短路 / 最小生成树 / 二分图 / 基环树 / 欧拉路径）](https://leetcode.cn/circle/discuss/01LUak/)
7. [动态规划（入门 / 背包 / 状态机 / 划分 / 区间 / 状压 / 数位 / 数据结构优化 / 树形 / 博弈 / 概率期望）](https://leetcode.cn/circle/discuss/tXLS3i/)
8. [常用数据结构（前缀和 / 差分 / 栈 / 队列 / 堆 / 字典树 / 并查集 / 树状数组 / 线段树）](https://leetcode.cn/circle/discuss/mOr1u6/)
9. [数学算法（数论 / 组合 / 概率期望 / 博弈 / 计算几何 / 随机算法）](https://leetcode.cn/circle/discuss/IYT3ss/)
10. [贪心与思维（基本贪心策略 / 反悔 / 区间 / 字典序 / 数学 / 思维 / 脑筋急转弯 / 构造）](https://leetcode.cn/circle/discuss/g6KTKL/)
11. [链表、二叉树与一般树（前后指针 / 快慢指针 / DFS/BFS / 直径 / LCA）](https://leetcode.cn/circle/discuss/K0n2gO/)
12. [字符串（KMP/Z 函数 / Manacher / 字符串哈希 / AC 自动机 / 后缀数组 / 子序列自动机）](https://leetcode.cn/circle/discuss/SJFwQI/)

[我的题解精选（已分类）](https://leetcode.cn/link/?target=https://github.com/EndlessCheng/codeforces-go/blob/master/leetcode/SOLUTIONS.md)

欢迎关注 [B 站 @灵茶山艾府](https://leetcode.cn/link/?target=https://space.bilibili.com/206214)

[img-0]:data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoMAAAG/CAYAAAAjPt3FAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAIo5SURBVHhe7d0JvEzlGwfwR/Z933eJJPS372uWCFmiLFESJWkRRbYslaRCCSFKEhLKLktK2cpa9p1Q2bO7f7933nPvmZkzc+fOnX1+389nPvO8x7jL3Jk5z3mX500Sc4cQERERUVS6S98TERERURRiMkhEREQUxZgMEhEREUUxJoNEREREUYzJIBEREVEUYzJIREREFMWYDBIRERFFMSaDRERERFGMySARERFRFGMySERERBTFmAwSERERRTHuTUxERD5x6dIl2bNnj+zatUtOnDgh586dk71798r58+fl2LFj6hjcvn079h43nIZwM7eNx9x1112SJEkSdW+0zcfM/5YnTx7Jly+fusdx3OfNm1fdmjdvrh5DRM6YDBK5cebMGdm6dascPnxYjh8/LtevX5dt27ape7TNJzfzycxo37p1y+44GCcz84nMMcYNjJMZ7tOmTavujVv9+vXVY4gC6cKFC7Jy5UpZsGCBrFq1SiV8eD/ghtd7KEuWLJm6pUiRQt03a9ZMmjZtKg8//LA6RhStmAxS1Dt16pR8//33snDhQvn111/l6tWrcu3aNXUL9ZNb8uTJ1UksZcqUkjVrVmnQoIG64SRH5C0keCtWrFDvibVr16qevXB5T3gLF2B4H+E9hfuGDRtK48aNpVKlSlKkSBH9KKLIxGSQosLJkydjE75NmzapkxqSPtwi9eSGno9UqVKpk1v69OnVyQ29IFWqVJFs2bLpR1G0+/rrr+XDDz+U3bt3x74vbt68qf814e655x4pV66c6r3OmDGj3H333eoePdy5c+dWj0maNGlsTzhiozccr1kjxnHA+xO96sb7FPfmY0YMeJ+jxx73OLWh5x4x7r/77jv1GG/hvYQkMXXq1DJy5EjVm5g5c2b9r0ThjckgRRScFCZNmqRuR44ckStXrqibcSLxRunSpaVs2bLqRIZeuPvvv1/d42RnPrkZJzDjhpMdEjHcG8fAOIEZJzEjxlsR9zgRm09uxgntv//+i20fOHBA1q9frx7jDfysOLnhxIYexffee0+d3Ciy7dixQ9555x01zHv58mW5ePGiet0lVPHixaVJ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
