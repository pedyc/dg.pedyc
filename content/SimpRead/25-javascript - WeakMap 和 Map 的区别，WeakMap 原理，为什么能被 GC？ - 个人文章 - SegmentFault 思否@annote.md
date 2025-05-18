---
UID: 20250517155926
title: "srAnnote@javascript - WeakMap 和 Map 的区别，WeakMap 原理，为什么能被 GC？ - 个人文章 - SegmentFault 思否"
alias: ["srAnnote@javascript - WeakMap 和 Map 的区别，WeakMap 原理，为什么能被 GC？ - 个人文章 - SegmentFault 思否"]
type: Simpread
index: 25
---

# [[25-javascript - WeakMap 和 Map 的区别，WeakMap 原理，为什么能被 GC？ - 个人文章 - SegmentFault 思否]]

> [!timeline]+ 简介
>> **元数据**
>---
> **原文**:: [javascript - WeakMap 和 Map 的区别，WeakMap 原理，为什么能被 GC？ - 个人文章 - SegmentFault 思否](https://segmentfault.com/a/1190000039862872)
> **日期**:: [[2025-05-17]]
> **标签**:: #SimpRead 
>> **摘要**
>---
> 很简单，JS 引擎中有一个后台进程称为垃圾回收器，它监视所有对象，观察对象是否可被访问，然后按照固定的时间间隔周期性的删除掉那些不可访问的对象即可

## 笔记

> [!abstract]+ <mark style="background-color: #ffeb3b">Highlight</mark> [🧷](<http://localhost:7026/reading/25#id=1747468885349>)
> 在我们的开发过程中，如果我们想要让垃圾回收器回收某一对象，就将对象的引用直接设置为 `null`
^sran-1747468885349


