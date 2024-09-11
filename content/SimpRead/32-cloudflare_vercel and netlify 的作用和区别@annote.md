---
title: "cloudflare_vercel and netlify 的作用和区别"
alias: 
  - "cloudflare_vercel and netlify 的作用和区别"
created-date: 2024-08-17T19:49:13+0800
type: Simpread
banner: "https://assets.cnblogs.com/logo_square.png "
banner_icon: 🔖
tag: 
idx: 32
---

# cloudflare_vercel and netlify 的作用和区别

> [!example]- [🧷内部链接](<http://localhost:7026/unread/32>) [🌐外部链接](<>)    
> URI:: [🧷](<http://localhost:7026/unread/32>) [🌐](<>) 
> intURI:: [🧷内部链接](<http://localhost:7026/reading/32>)

%%
> [!example]+ **Comments**  
> ```dataview
> TABLE 
>     WITHOUT ID
>     link(Source, dateformat(date(Source), "yyyy-MM-dd")) as Date___, 
>     regexreplace(rows.Comments,"^@@\[\[.+?\]\]\s","") as "Comments"
> FROM "journals"
> WHERE  contains(cmnt, this.file.name)
> FLATTEN cmnt as Comments
> WHERE contains(Comments, this.file.name)
> GROUP BY file.link as Source
> SORT rows.file.day desc
> ```
>  **Description**:: Cloudflare，Vercel和Netlify都是为开发者提供的云计算服务，但它们的功能和特性有所不同。 Cloudflare的主要使命是帮助构建更好的互联网。它是世界上最大的网络之一，为企业、非营利组织、博客作者和任何有互联网存在的人提供更快、更安全的网站和应用。Cloudflare的网络上有
%%

> [!md] Metadata  
> **标题**:: [cloudflare_vercel and netlify 的作用和区别](https://www.cnblogs.com/KairusZhang/p/17923459.html)  
> **日期**:: [[2024-08-17]]  

## Annotations


> [!srhl2] [[SR32@cloudflare_vercel and netlify 的作用和区别|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/32#id=1723895366692>) [🌐](<#id=1723895366692>)   
> **Cloudflare**
> ^sran-1723895366692

> [!srhl2] [[SR32@cloudflare_vercel and netlify 的作用和区别|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/32#id=1723895367939>) [🌐](<#id=1723895367939>)   
> **Vercel**
> ^sran-1723895367939

> [!srhl2] [[SR32@cloudflare_vercel and netlify 的作用和区别|📄]] <mark style="background-color: #ffeb3b">Highlights</mark> [🧷](<http://localhost:7026/unread/32#id=1723895368898>) [🌐](<#id=1723895368898>)   
> **Netlify**
> ^sran-1723895368898


