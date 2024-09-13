---
title: 49-双剑合璧：Obsidian 和 Logseq 联用的一些经验
alias: 49-双剑合璧：Obsidian 和 Logseq 联用的一些经验
uid: 
author: 
description: 
date-created: 2024-09-12 07:26
date-modified: 2024-09-13 09:20
type: 
tags: []
---

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [sspai.com](https://sspai.com/post/80042)

> Obsidian 和 Logseq 都是纯文本、本地化存储的软件，我很早就知道二者的库可以通用。

Obsidian 和 Logseq 都是纯文本、本地化存储的软件，我很早就知道二者的库可以通用。最近因为上了 Obsidian 的车，突然就想到如果二者共用一个库，岂不是 Logseq 也可以白嫖 Obsidian 的官方同步？

激动的心，颤抖的手，经过自己的一番摸索之后终于基本鼓捣明白了。

## 适用对象

以下人群我认为是可以尝试 Obsidian-Logseq 联用的：

纯文本爱好者（Notion 和思源等自有格式用户谨慎观看）

开通 Obsidan 官方同步（Logseq 的同步还是不如 Obsidian 稳。当然有稳定的第三方同步方式也可以）

认同重器轻用而不是 all in one

## 用法及原因

用法：使用 Logseq 的「日记」功能来做 Daily note，使用 Obsidan 或者一款喜欢的 Markdown 编辑器来进行文本编辑特别是长文本的输入，最后使用 Obsidian 来进行漫游、发布或者其他操作。

原因嘛，自然是因为 Daily note 如今快跟双链笔记绑在一块了。我在 [关于知识管理的一些新思考 - 少数派 (sspai.com)](https://sspai.com/post/71926) 中提到了 Roam 和 Logseq 这种大纲型笔记是现下最合适的做 Daily note 的工具，这点相信使用过 Roam、Logseq、Obsidian 等工具的朋友都有认可，论做 Daily note 的综合感受，还是大纲型笔记最舒服。

但实际上 Daily note 只是降低了门槛而已，记录的压力是降低了，但是记录的质量并没有因为使用哪种工具而得到质的改变。实际上我们要真的认识完整一个事物，多少是要写个几百字乃至几千字，把来龙去脉搞清楚，把个人感悟写明白，一张原本的小小卡片就自然变成了一篇长文。没有输出的输入，只是机械的复制粘贴罢了。

说到长文本阅读，这就又是 Obsidan 的长项了。加上 Obsidian 应有尽有的插件生态，随后的漫游、修改、发布等都能够很方便的完成。

简而言之，我们重器轻用，取 Logseq 写日记之 " 长 " 和 Obsidan 读写长文本之 " 长 "，来让我们获得最优的知识管理体验。

## 具体步骤

1. 备份现有的库；
2. 打开 Obsidian，将核心插件 - 日记中的日期格式改为「YYYY_MM_DD」，新建日记的存放位置改为「journals」；

![](https://cdnfile.sspai.com/2023/05/28/9a945dea4d58fab356b5b28a8443d87a.png?imageView2/2/format/webp)

  3. 将 Obsidian 中选项 - 文件与链接中的新建笔记存放位置改为「指定的附件文件夹」，存放新建笔记的文件夹改为「pages」，制定附件文件夹同样改为「指定的附件文件夹」，存放文件夹改为「assets」, 忽略文件中选择「assets」、「logseq」

![](https://cdnfile.sspai.com/2023/05/28/0ecf28da3e21803e03e313062a301a89.png?imageView2/2/format/webp)

1. 在 Obsidian 中选择 Logseq 的库

这里需要说明的是所有需要改动的步骤基本只涉及 Obsidian，因为 Ob 的包容性实在是太好了，而 Logseq 虽然也是纯文本，但其实还是有很多私有语法的，让 Obsidian 去适应 Logseq 要轻松很多。

## 效果呈现

![](https://cdnfile.sspai.com/2023/05/28/2d15875896dd25b06cde20837dbe9da6.png?imageView2/2/format/webp)Logseq - 日记![](https://cdnfile.sspai.com/2023/05/28/f4a84287830d6f15385f4c68e699f55a.png?imageView2/2/format/webp) Obsidian - 日记![](https://cdnfile.sspai.com/2023/05/28/80a4dc2e859823fd4884764ec63badce.png?imageView2/2/format/webp)![](https://cdnfile.sspai.com/2023/05/28/6b1755d2b686af81cd3186436beb5968.png?imageView2/2/format/webp)![](https://cdnfile.sspai.com/2023/05/28/afcc838cd18ce200be66d0a67c28295b.png?imageView2/2/format/webp)文本编辑基本是在 Mark Text 中完成的

## Tips

正如上一段所说，Logseq 其实不是那么的「纯 [注释 1]」，所以我们记录的时候尽量使用最最基本的 Markdown 语法，比如标题、加重、斜体等，其他语法使用可以放在 Markdown 编辑器或者 Obsidian 中进行，这样就能避免出现诸如「Template::true」等在 Logseq 隐形但在 ob 和其他编辑器中可见的尴尬局面。

另外，我个人推荐 Markdown 编辑也最好使用一款专用的，比如 Typora、Marktext 等，因为 Obsidian 的所见即所得模式就是还是带点源码模式的影子，使用体验上并不是特别好。我其实特别赞同 [终极卡片笔记编辑器：FSNotes](https://sspai.com/link?target=https%3A%2F%2Futgd.net%2Farticle%2F20138%2F) 和 [功能和软件的解耦：以卡片笔记为例](https://sspai.com/link?target=https%3A%2F%2Futgd.net%2Farticle%2F20159) 的说法，「卡片笔记编辑器」、「卡片笔记浏览器」是有区别的，Obsidian、Logseq 都可以归入「优秀的卡片笔记浏览器」之列，而「卡片笔记编辑器」则还是应当有专门的工具来承担。

我最近使用过 Mark Text 和 Sublime Text。单就 md 的编辑体验而言自然是 Mark Text 胜出，不过我最近更爱 Sublime Text 一点，因为 Sublime 更简单，所以它不会出现语法混乱 [注释 2] 的情况。当然这一点大家使用顺手的工具就可以，用 Obsidian 也不是不行。

祝大家多多产出高质量的笔记内容，更关注笔记的内容而不是其他。

注释 [1]：Logseq 会自动添加很多注释性的语法

注释 [2]：指会出现语法出现或者字符间距突然拉大的情况，比如输入 Logseq 变成了 "L o g s e q" 等。
