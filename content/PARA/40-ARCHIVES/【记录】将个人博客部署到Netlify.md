---
uid: 202408162328
title: 【记录】将个人博客部署到Netlify
aliases: []
author: ped_yc
description: 
tags: [记录]
date-created: 2024-08-15
date-modified: 2025-05-08
status: 
---

⬆[[blog.pedyc|我的博客]]

## 前言

- Hexo：博客构建
- Github：代码托管
- Netlify：站点托管、部署
- Cloudflare：站点加速

## 行为逻辑

当把静态博客部署到 Netlify 上后，可以通过<mark class="hltr-red">https://ped-yc.netlify.app</mark>来访问我们的博客。
之后我们购买了域名<mark class="hltr-red">ped-yc.site</mark>，现在我们想要通过域名定位到 Netlify 部署的文件，就需要使用 DNS 将我们的域名解析成 Netlify 部署的 IP 地址，即通过转发服务 CNAME。

## 总结

## 参考文章

[[31-使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog@annote|使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog]]
