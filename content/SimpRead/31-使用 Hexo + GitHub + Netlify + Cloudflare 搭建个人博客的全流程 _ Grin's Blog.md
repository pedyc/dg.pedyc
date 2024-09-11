---
title: "31-使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog"
uid: 
author: 
description: 
date-created: 2024-08-17 11:06
date-modified: 2024-08-19 19:01
type: 
aliases: []
status: 
tags: []
---

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [blog.grin.cool](https://blog.grin.cool/blog/hexo-blog)

> 介绍了使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程，并列举了选择这些工具的原因。

![[ClippingVault/SimpRead/output/_resources/31-使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog/624d2ffe036c2c95bbe5cb4d31ecc327_MD5.jpg]]

> 2024 年 1 月 11 日更新: 这篇文章写的较早, 现在我的博客已经换成了 tailwindBlog + vercel + cloudflare，具体操作步骤和原文类似，尤其是 cloudflare 部分没变。还是只需要花一个域名的钱，其余都是免费的。可查看 [github 源码](https://github.com/cloudGrin/tailwind-blog)

## [](#前言) 前言

对于程序员，写博客的重要性不言而喻，借用网上的一张图（侵删）：

![[ClippingVault/SimpRead/output/_resources/31-使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog/2d306f5e8db8b84149ad4e00a7c29bb3_MD5.png]]

而且只要一杯瑞幸的钱 😄（买域名，不买的话完全是白嫖啊）就可以拥有自己的一片空间，想想就很兴奋，是不是。

以下除了具体流程，也会列出我在实践的过程中踩了一些坑，希望能帮助到大家。

## [](#为什么选择-hexo--github--netlify--cloudflare) 为什么选择 Hexo + GitHub + Netlify + Cloudflare

不需要云服务器，不需要备案，全部免费

### [](#hexo)Hexo

[Hexo](https://hexo.io/zh-cn/) 是一个基于 nodejs 的静态博客网站生成器，作者是来自台湾的 Tommy Chen。

* 静态文件快速生成
* 支持 Markdown
* 仅需一道指令即可部署到 GitHub Pages 和 Heroku
* 已移植 Octopress 插件
* 高扩展性、自订性
* 兼容于 Windows, Mac & Linux
* 社区主题、插件很多，适合喜欢折腾的小伙伴

### [](#github)GitHub

搭建博客最简单快速的方式就是使用 [GitHub Pages](https://pages.github.com/)，但国内访问 github 的速度 😂；可能你会说 Coding Pages 在国内访问快，除了广告之外好像也没啥缺点，大伙也可以试试，但是这样就没折腾的乐趣了。

我们把 github 仅仅作为博客的托管仓库，不使用它的 GitHub Pages 部署，只要想个办法加速访问就可以了。

### [](#netlify)Netlify

[Netlify](https://www.netlify.com/) 是一个提供静态网站托管的服务，提供 CI 服务，能够将托管 GitHub，GitLab 等网站上的 Jekyll，Hexo，Hugo 等静态网站。使用也非常简单。

* 可以托管静态资源
* 可以将静态网站部署到 CDN 上, 加速国内访问
* Continuous Deployment 持续部署, 当你提交改变到 git 仓库, 它就会自动运行 build command , 进行自动部署
* 可以添加自定义域名
* 可以启用免费的 TLS 证书, 启用 HTTPS
* 最强大的 cms, 用来管理静态资源
* 自带 CI、支持自定义页面重定向、自定义插入代码、打包和压缩 JS 和 CSS、压缩图片、处理图片

### [](#cloudflare)Cloudflare

Netlify 虽然已经提供了 CDN 加速，但在使用过程中发现国内访问还是比较慢，[Cloudflare](https://www.cloudflare.com/zh-cn/) 相对于国内的七牛云、阿里云等云服务商的 CDN 速度会慢一些，但是它有免费版本，而且最重要的是域名不用备案。

## [](#动手时间) 动手时间

### [](#hexo-生成博客项目)Hexo 生成博客项目

* 安装

```Javascript
npm install -g hexo-cli 
yarn global add hexo-cli


```

* 初始化

```Javascript
hexo init "博客目录"
cd "博客目录"
npm install 
yarn


```

* 目录结构

```Javascript
.
├── _config.yml
├── package.json
├── scaffolds
│   ├── draft.md
│   ├── page.md
│   └── post.md
├── source
│   └── _posts
└── themes
    └── landscape


```

**_config.yml**

全局配置文件，网站的很多信息都在这里配置，诸如网站名称，副标题，描述，作者，语言，主题，部署等等参数。

```Javascript
title: Hexo 
subtitle: 
description: 
author: John Doe 
language: 
timezone: 




url: http://yoursite.com 
root: / 
permalink: :year/:month/:day/:title/ 
permalink_defaults: 


source_dir: source 
public_dir: public 
tag_dir: tags 
archive_dir: archives 
category_dir: categories 
code_dir: downloads/code 
i18n_dir: :lang 
skip_render: 


new_post_name: :title.md 
default_layout: post 
titlecase: false 
external_link: true 
filename_case: 0 
render_drafts: false 
post_asset_folder: false 
relative_link: false 
future: true 
highlight: 
  enable: true 
  line_number: true 
  auto_detect: false 
  tab_replace: 


default_category: uncategorized
category_map: 
tag_map: 





date_format: YYYY-MM-DD 
time_format: HH:mm:ss 



per_page: 10 
pagination_dir: page 




theme: landscape 




deploy:
  type: 


```

可查看 [官网](https://hexo.io/zh-cn/docs/configuration.html) 详细配置。

**scaffolds**

scaffolds 是 " 脚手架、骨架 " 的意思，当你新建一篇文章（hexo new 'title'）的时候，hexo 是根据这个目录下的文件进行构建的。基本不用关心。

**source**

这个目录很重要，新建的文章都是在保存在这个目录下的. _posts 。需要新建的博文都放在 _posts 目录下。

_posts 目录下是一个个 markdown 文件。你应该可以看到一个 hello-world.md 的文件，文章就在这个文件中编辑。

_posts 目录下的 md 文件，会被编译成 html 文件，放到 public （此文件现在应该没有，因为你还没有编译过）文件夹下。

**themes**

网站主题目录，hexo 有非常好的主题拓展，支持的主题也很丰富。该目录下，每一个子目录就是一个主题。

* 生成文章

```Javascript
hexo new post "第一篇博客" 
hexo g 
hexo s 


```

> 可查看官网详细的 [CLI](https://hexo.io/zh-cn/docs/commands) 命令

### [](#添加-npm-script) 添加 npm script

```Javascript
scripts: {
  "build": "hexo generate",
  "clean": "hexo clean",
  "server": "hexo server",
  "netlify": "npm run clean && npm run build"
}


```

### [](#托管到-github) 托管到 Github

* 创建仓库 | Create a new repository
* 本地项目推送到远程服务器

```Javascript
git init
git add .
git commit -m "my blog first commit"
git remote add origin git@github.com:【你的 github 名字】/【你的 repository 名字】.git
git push -u origin master


```

### [](#连接-netlify) 连接 Netlify

* 注册 [Netlify](https://www.netlify.com/) 并登陆
* 创建 site

![[ClippingVault/SimpRead/output/_resources/31-使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog/c492d00a0cbd9d61ca9ffb19e9cb33c7_MD5.png]]

* 连接 github

![[ClippingVault/SimpRead/output/_resources/31-使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog/5b4ce5bc5fb0f366ec1b12357de7590b_MD5.png]]

* 选择刚刚上传的项目

![[ClippingVault/SimpRead/output/_resources/31-使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog/89ccf3e7ef6f493ecb51a7a245a22630_MD5.png]]

* 选择构建分支、构建命令和静态文件目录，点击 Deploy site 发布

![[ClippingVault/SimpRead/output/_resources/31-使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog/8fa6bb03c674dcfd5efb2f480eb1e6f1_MD5.png]]

* 等构建结束后，会看到这里有个网址，打开就是你的博客了

![[ClippingVault/SimpRead/output/_resources/31-使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog/93d24949f662eb65da772781d49dacc8_MD5.png]]

* 可以点击下方 Domain settings，自定义二级域名

![[ClippingVault/SimpRead/output/_resources/31-使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog/87876d98186a3e488b6be154d71367f9_MD5.png]]

* 可以欣赏你的博客了

之后每次对 master 分支提交 commit 时都会触发 Netlify 自动构建。

很多博文都让大家安装 hexo-deployer-git 这个依赖包，这个包把 public 文件夹提交到单独的分支，然后 Netlify 绑定到这个分支，不需要 Netlify 构建，完全把 Netlify 当做静态文件托管，把 CI 功能舍弃掉了。

### [](#买域名) 买域名

* 购买域名
* 配置域名解析

![[ClippingVault/SimpRead/output/_resources/31-使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog/89459bba6c4aac0e89943c506c895ad1_MD5.png]]

* 按照下图设置 CNAME， 指向 Netlify 里设置的域名

![[ClippingVault/SimpRead/output/_resources/31-使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog/728c7d67108c46a820a18f1418c7855e_MD5.png]]

* 稍等会就可以正常访问了

### [](#cloudflare-加速)Cloudflare 加速

* 注册 [Cloudflare](https://www.cloudflare.com/zh-cn/) 并登陆
* 添加站点

![[ClippingVault/SimpRead/output/_resources/31-使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog/2ec747bea6508825d7940adae62f1786_MD5.png]]

* 选择免费套餐
* 添加 DNS 记录

![[ClippingVault/SimpRead/output/_resources/31-使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog/a26a9ce35353fb3ec539d6961b0198bc_MD5.png]]

**坑 1：**

> **知识补充 1**：我们在上面提到域名解析的时候已经提到 CNAME 类型了，这里又出现了 A 和 AAAA，除此之外还有很多其他类型，有兴趣可以查资料了解下。 DNS 的作用就是把域名翻译成 IP 地址，所以一般在做域名解析的时候，需要添加 A（IPV4）或者 AAAA（IPV6），把域名指向 IP 地址。但有的时候会需要设置多个域名指向同一个 IP 地址的情况，这时我们就可以把其他的域名的解析设置成 CNAME 类型，并填写记录值为那个设置了 A 或 AAAA 直接指向 IP 地址的域名。这样可以避免服务器 IP 变更需要重新设置多个域名解析。直白点说 A 或 AAAA 就是域名直接指向 IP，CNAME 就是域名指向另一个域名。

一般情况下 Cloudflare 会检测出来几条 DNS 记录，类型大多数是 A，或者 AAAA，由于我们是转发，所以应该是 CNAME 类型才对。所以全部删除，手动添加。

![[ClippingVault/SimpRead/output/_resources/31-使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog/a80fe0c32e677640dc3d8692765af6c0_MD5.png]]

如图，把名称替换成你的域名，内容填你的博客的 Netlify 地址。 www 的名称不用修改，修改内容同上。

> **知识补充 2**：CDN 加速往往有两种方式，一种是 CDN 服务商提供一个域名，然后设置你的域名 CNAME 指向这个加速域名；另一种是 CND 服务商提供 几个 NS（DNS 解析服务器）地址，然后覆盖你的域名的 NS 地址。Cloudflare 就是采用的后者

* 修改 NS

![[ClippingVault/SimpRead/output/_resources/31-使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog/2d9e145ac81e1c5a29d18d9456e97e83_MD5.png]]

在你的域名服务商那里修改 dns 解析服务器为 cloudflare 提供的地址，修改完成后点击完成。

* 设置强制 HTTPS，文件压缩等

![[ClippingVault/SimpRead/output/_resources/31-使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog/ef4fd8bfde677c0bb49a67d8088a4c94_MD5.png]]

* 点击完成，设置完毕，NS 方式修改的生效时间会比较长一些，官网上说 24 小时以内，不过一般不会这么长时间，耐心等待下。成功之后 Cloudflare 会发一封邮件给你，或者重新登录控制台也能看到。
* 检验成果

返回头部的 server 字段从 Netlify 变成了 cloudflare，速度应该快很多了。

![[ClippingVault/SimpRead/output/_resources/31-使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog/f51101c866c609e1babe94c9922fef8f_MD5.png]]

🎉 恭喜，你的博客已经搭建完毕，现在可以开始写文章了。

## [](#写文) 写文

### [](#换主题--theme) 换主题 | Theme

hexo 默认的主题样式欣赏不来，[社区](https://hexo.io/themes/) 里有很多主题可以下载。我使用的是简约的 next 主题。

设置步骤如下：

* GitHub 里 fork 主题项目到你的仓库
* 在你的 hexo 项目里执行

```Javascript
git submodule add git@github.com:【fork的项目】.git themes/【主题的名字，例如 next】


```

git submodule 的使用方式可以 google 了解下。

* 修改 根目录 _config.yml 文件的 theme 的值为你使用的主题名字
* 本地看效果
* 主题的文件夹里也有 _config.yml，这个是主题的配置文件，根据你的喜好自定义。
* 提交 commit 到远程服务器，更新线上博客。

**坑 2：**

打开博客发现并没有更新主题，查看 netlify 构建日志发现失败了，提示没有 submodule 的主题项目的权限：

![[ClippingVault/SimpRead/output/_resources/31-使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog/0c306b150d244c33330397a046dbc375_MD5.png]]

需要添加 Deploy key 到 GitHub

![[ClippingVault/SimpRead/output/_resources/31-使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog/f9f9f9879baa5911b2727661abf810d7_MD5.png]]

![[ClippingVault/SimpRead/output/_resources/31-使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog/4edd4ce7b7cee200ac97e2c9a201b190_MD5.png]]

![[ClippingVault/SimpRead/output/_resources/31-使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog/ce2b0efaded55636e67b488a760114e3_MD5.png]] 重新构建，成功 🎉，线上博客主题已更新。

### [](#添加博客评论--gitalk) 添加博客评论 | Gitalk

可以参考 [此文](https://asdfv1929.github.io/2018/01/20/gitalk/) 设置

callback 务必填写你的域名，这样评论里 github 登录后才能正确回跳到你的博客。

![[ClippingVault/SimpRead/output/_resources/31-使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog/21a29bdb1e0af1e11a50a9d214b6ec83_MD5.png]]

**坑 3**

部署到线上后，在你的文章底部就会出现 gitalk 的组件，但是会发现存在这样的情况：

![[ClippingVault/SimpRead/output/_resources/31-使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog/2d8a923221a2e69a173a2e545ab16cd3_MD5.png]]

有的会报错 network error

原因如下：

1. hexo 的全局配置 _config.yml 里关于文章 url 路径的配置是这样：

```Javascript
permalink: :year/:month/:day/:title/


```

如果你的文章 title 是中文，这会导致你的文章地址栏的地址很长。这会带来两个问题，第一如果修改了文章 title，原来的地址就失效了，SEO 也没了。第二就是 gitalk 需要在 GitHub 中创建 issue，而 issue 的 label 长度必须小于 50，而 gitalk 会拿地址栏的 path 作为 label，所以会导致 gitalk 连接失败。

使用 hexo-abbrlink 插件，解决 path 超出：

```Javascript
npm i hexo-abbrlink --save-dev


```

修改 _config.yml

```Javascript
abbrlink:
  alg: crc16 
  rep: hex 


permalink: p/:abbrlink.html


```

重新运行静态构建

生成的文章 url 将会是这样的：

```Javascript
https://yourwebsite.com/p/37232.html


```

放心，之后每次 generate 都不会变更。

1. 还需要为每一篇文章新增 issue，这样才能初始化评论。

* 在你的 GitHub 博客项目中添加 issue
* ![[ClippingVault/SimpRead/output/_resources/31-使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog/7f2fc3ae75ec56daf5d6137be84ee3e7_MD5.png]]
* 添加 label 为 Gitalk 和你的文章 path（比如 / p/37232）

![[ClippingVault/SimpRead/output/_resources/31-使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog/4a7c9cc79321788fea5a3aa2eb6dc73c_MD5.png]]

* 然后重新提交 commit，等待 Netlify 构建完毕，查看你的文章底部 Gitalk 是否已经可以评论

![[ClippingVault/SimpRead/output/_resources/31-使用 Hexo + GitHub + Netlify + Cloudflare 搭建个人博客的全流程 _ Grin's Blog/1d9694c1ea82c6e0ba388332575599a6_MD5.png]]

## [](#完结) 完结

以上就是全部手摸手搭博客教程，大家如果按照步骤，应该已经完成搭建了，hexo 和 netlify 还有很多好玩的功能，可以去玩玩看，我还在摸索中 😵，欢迎交流。

所谓万事开头难，其实不然，最难的是坚持，这是我的第二篇文章，之后还会继续写下去，也期待与你同行，共勉之 😁。

「Stay Hungry, Stay Foolish.」

文中若有错误或补充，请不吝赐教。
