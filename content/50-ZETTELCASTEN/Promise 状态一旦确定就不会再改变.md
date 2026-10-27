---
uid: 202610201468
title: Promise 状态一旦确定就不会再改变
aliases: []
description: 状态迁移只有 pending → fulfilled / rejected 两条边；离开 pending 之后，后续 resolve/reject 调用一律是空操作，不改值也不报错
tags: [前端]
date-created: 2026-10-20
date-modified: 2026-10-27
content-type: atomic
up: "[[Promise]]"
noteId: 1792475165512
---

> 状态迁移只有两条合法边：pending → fulfilled 与 pending → rejected。一旦离开 pending，后续任何 resolve / reject 调用都是空操作——不改值，不抛错，也不发警告。

**边界**：这条锁的是最终值，不是「调用过 resolve」这个动作——resolve 一个 thenable 时状态仍停在 pending，要等它自己兑现，把这两件事混为一谈是最常见的误读。另外，跨实现混用（不同 polyfill、不同 realm）时，约束只在自己的实现内部成立。

## 论据/示例

规范把状态改写收敛到 FulfillPromise 与 RejectPromise 两个内部方法，两者入口都先断言当前状态为 pending——「不可再变」就落在这个断言上。所以 `new Promise((r) => { r(1); r(2); throw new Error('x') })` 的结果必然是 1：后两次调用连同那次抛错，都因状态已离开 pending 而变成空操作。

## 关联

- [[Promise]] — 三态模型是这条命题的宿主
- [[手写Promise]] — `#settle` 的第一行状态检查就是它的实现形态
- [[Promise 通过 thenable 接口实现链式调用，解决回调地狱]] — 链上每一环都靠这条规则才不会被重复落定
