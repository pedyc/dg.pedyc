---
title: 如何用 AI 重塑我们的信息获取流程？
alias: 2-如何用 AI 重塑我们的信息获取流程？
uid: 
author: 
description: 
date-created: 2024-09-15 23:27
date-modified: 2024-09-15 23:27
type: 
banner: "https://cdnfile.sspai.com/2024/07/12/255ddbb2ead1104308d5a826a64be47a.png"
banner_icon: 🔖
tag: []
tags: 
url: https://sspai.com/post/90423
---

## **前言**

在这个数字时代，我们有很多信息来源：

**多媒体**：新闻网站、Medium、电子书、研报、在线期刊

**社交媒体**：Twitter、Instagram、Facebook、LinkedIn

**流媒体**：YouTube、TikTok、播客

**论坛**：Reddit、Quora

**即时通讯工具**：WhatsApp、Telegram、Wechat

你觉得什么来源对你最有价值呢？

对我来说，无论是哪个来源，只要能让我主动订阅、筛选和检索，都有价值。然而，许多来源由于商业化考虑，会插入个性化广告或推荐刺激多巴胺的内容，让人一不小心就滑入成瘾、失控的境地。

好消息是，RSS 可以有效缓解这类问题，并且在 LLM 时代焕发出新的生机。

## **过去的信息获取流程及其问题**

RSS 是一种不被广告和算法污染的信息聚合方式，可以在任何支持 RSS 订阅的产品中订阅和阅读。需要注意的是，没有广告和算法并非绝对，取决于源的提供方是否纯粹。这里有一篇 [RSS 介绍好文](https://sspai.com/link?target=https%3A%2F%2Fncase.me%2Frss%2F)。

在 LLM 大发展之前，我的信息获取流程是：信源订阅 => 略读 => 稍后阅读 => 原文阅读。

RSS 订阅 => 略读，我使用的方案是：RSSHub + RSSHub Radar + FreshRSS + Fluent Reader + Unread。

其中，FreshRSS 用于管理、存储订阅数据，并暴露 Fever API，让阅读器（Fluent Reader、Unread）能一键订阅。RSSHub 用于找寻 RSS 源，Radar 用于探测网站的 RSS。如果还找不到源，我会尝试一些 anything to RSS 服务，可参考 [链接](https://sspai.com/link?target=https%3A%2F%2Ftidyread.ai%2Fblog%2Fhow-to-find-rss)。

稍后阅读我使用 [Pocket](https://sspai.com/link?target=https%3A%2F%2Fgetpocket.com%2F)。

这一套方案用了一年多，但存在一些问题：

* 无法订阅所有感兴趣的信源。一些网站找不到，也无法转化为 RSS 源。
* 内容噪声过多。对一个源感兴趣不代表对它所有内容感兴趣，有些内容并非我此时需要的。
* 阅读效率低
    * 许多内容不需要看完，只需一段摘要了解发生了什么及其影响。
    * 外语资讯源读起来效率低。
* 稍后阅读工具不便于检索。虽然叫稍后阅读，但阅读的时机可能是在未来某天解决特定问题时，然而此时往往难以通过想象的关键词检索到特定内容。

## **AI 带来的变化**

在 LLM 大发展后，上述问题得到改善。

通过类似 [lightfeed](https://sspai.com/link?target=https%3A%2F%2Fwww.lightfeed.ai%2F) 的智能 RSS 转换工具，可以让 Anything To RSS 变得更容易，并提供定制 Prompt 过滤能力，减少内容噪声。

![[SimpRead/_resources/2-如何用 AI 重塑我们的信息获取流程？/5cd071c5a5ad298f404ed62753421931_MD5.webp]]

![](https://cdnfile.sspai.com/2024/07/12/article/e8f294eab94d134888815a571ff346e7.png?imageView2/2/format/webp)

阅读效率低的问题也可通过 Readwise Reader 的 AI 摘要能力部分改善。

![](https://cdnfile.sspai.com/2024/07/12/article/d2a0b5f11f8cbea1cf462ba21f4cdd32.png?imageView2/2/format/webp)

新生代的稍后阅读工具，如 [Cubox](https://sspai.com/link?target=https%3A%2F%2Fcubox.cc%2F)、[iki.ai](https://sspai.com/link?target=https%3A%2F%2Fiki.ai%2F)，可以自动对内容打标，让检索变得更容易。

![](https://cdnfile.sspai.com/2024/07/12/article/daaf7703b6e1a39d214d75f9dc61aebb.png?imageView2/2/format/webp)

同时，支持结构化阅读的工具如 [elmo](https://sspai.com/link?target=https%3A%2F%2Fwww.elmo.chat%2F)、[zKnown](https://sspai.com/link?target=https%3A%2F%2Freadknown.cn%2F)，可以输出思维导图、要点等信息，并可以进一步提问进行对话式阅读。

![](https://cdnfile.sspai.com/2024/07/12/article/a3ae7a124b928a7a2501405f60832860.png?imageView2/2/format/webp)

信息获取流程变革为：信源订阅 => **信息整理** => 略读 => 稍后阅读 => **结构化 + 对话式阅读** => 原文阅读。并且各环节得到**优化和提效**。

然而使用后，仍然存在一些问题：

* **费用高**。readwise reader 年订阅平摊到每月 10 美元，lightfeed 订阅 5 个站点每月 3 美元。

![](https://cdnfile.sspai.com/2024/07/12/article/08d510f19a6d60b6ea4c9340b10af687.png?imageView2/2/format/webp)

![](https://cdnfile.sspai.com/2024/07/12/article/9257bda11ef7ee4b19518a4620309858.png?imageView2/2/format/webp)

* **工具分散**。需要游走在 lightfeed、readwise、elmo 等工具之间。
* **过滤能力不足**。不支持关键词过滤，有些场景关键词过滤就够了，不必浪费 AI 调用。
* **摘要定制能力不足**。虽然 readwise reader 支持全局自定义 prompt，但无法根据某类信息定制。
* **无法翻译标题**。

最重要的是，无法建立起一种秩序感：

* 长时间不读会积攒很多信息，虽然可以一键清空，但重新开始阅读前会有巨大的心理负担。就像 todo list 中躺着的两百多个过期任务，不能一键清空，只能逐一处理。
* 订阅的源越来越多后，碎片时间阅读会感到信息洪流袭来，增加焦虑感。像社交媒体的信息流一样，永远刷不完。

因此，我开发了一款工具 [Tidyread](https://sspai.com/link?target=https%3A%2F%2Ftidyread.ai%2F) 来解决上述问题。

## **新的解决方案**

Tidyread 引入了一个新概念：Recipe。一个 Recipe 下可以订阅若干信息源，如 AI 相关信息源，并定制摘要 Prompt 和过滤器，在指定周期和时间点，以简报形式推送摘要信息。

![](https://cdnfile.sspai.com/2024/07/12/6ef233fc4ad8f964cebd166f94f23fd6.jpeg?imageView2/2/format/webp)

![](https://cdnfile.sspai.com/2024/07/12/8b984890ecc77e3fde33431e8d7bd313.png?imageView2/2/format/webp)

弱化了信息条目概念，不再看到数不清的红点，取而代之的是每日几条未读简报的红点。如果某段时间不想读，可随时一键关闭，或指定关闭某个 recipe。

![](https://cdnfile.sspai.com/2024/07/12/b8b2f869496bd3271ff561374a799d6e.png?imageView2/2/format/webp)

结合强大的过滤器功能，帮助你聚焦于最感兴趣的内容。支持 AI Prompt 过滤及传统过滤，可以直接预览过滤效果，并通过逻辑短路算法、AI 调用前过滤逻辑判断等手段，尽量降低 token 消耗：

![](https://cdnfile.sspai.com/2024/08/01/03195e8cca906a6a269a1168c3b31e8a.png?imageView2/2/format/webp)

AI 过滤器 + 传统过滤器

![](https://cdnfile.sspai.com/2024/08/01/c8a35f13bf01d5b480938205b8eb10b8.png?imageView2/2/format/webp)

过滤效果预览

如果你面临：

* 信息焦虑
* 信息过载
* 资讯阅读低效

如果你想要：

* 为资讯阅读建立秩序感
* 提升资讯阅读效率

欢迎试试 [Tidyread](https://sspai.com/link?target=https%3A%2F%2Ftidyread.ai%2F)，也许能帮你解决部分问题 😉
