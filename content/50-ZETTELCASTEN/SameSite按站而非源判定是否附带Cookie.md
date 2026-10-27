---
uid: 202603240002
title: SameSite 按站而非源判定是否附带 Cookie
aliases: [SameSite按站而非源判定是否附带Cookie]
description: SameSite 的判定单位是「站」（scheme + 可注册域名），比同源策略的「源」更粗，所以同站不同源之间仍会带上
tags: [前端开发/浏览器]
date-created: 2026-03-24
date-modified: 2026-10-27
content-type: atomic
up: "[[浏览器安全机制]]"
noteId: 1792465709591
---

> SameSite 的判定单位是「站」而不是「源」——兄弟子域之间互为跨源却同站，`SameSite=Strict` 的 Cookie 照样发得过去。

**边界**：它只决定 Cookie 带不带，不决定请求发不发——请求照发，只是少了凭据。也不覆盖非浏览器客户端，用脚本直接请求完全无视这个属性。所以它是纵深防御的一层，不能替代 CSRF Token 或服务端的 Origin 校验。

## 论据/示例

| 一对地址 | 同源？ | 同站？ |
|:---|:---:|:---:|
| `https://app.example.com` ↔ `https://api.example.com` | ✗ | ✓ |
| `https://example.com:443` ↔ `https://example.com:8080` | ✗ | ✓ |
| `http://example.com` ↔ `https://example.com` | ✗ | ✗ |
| `https://user1.github.io` ↔ `https://user2.github.io` | ✗ | ✗ |

前两行的差别被子域和端口吞掉了，后两行则被 scheme 与公共后缀表顶住——这就是「站」与「源」的全部分歧。细节见 [[浏览器安全机制]] 的「站的两个边界」。

## 关联

- [[浏览器安全机制]] — 父级概念
- [[同源策略]] — 判定单位更细：源 vs 站
- [[CSRF]] — 这条机制最常见的用途
