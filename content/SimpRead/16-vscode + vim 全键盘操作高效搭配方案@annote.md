---
title: "vscode + vim 全键盘操作高效搭配方案"
alias: 
  - "vscode + vim 全键盘操作高效搭配方案"
created-date: 2024-08-02T10:22:12+0800
type: Simpread
banner: "https://images-1302522496.cos.ap-nanjing.myqcloud.com/img/image-20211027215222915.png "
banner_icon: 🔖
tag: 
idx: 16
---

# vscode + vim 全键盘操作高效搭配方案

> [!example]- [🧷内部链接](<http://localhost:7026/unread/16>) [🌐外部链接](<>)    
> URI:: [🧷](<http://localhost:7026/unread/16>) [🌐](<>) 
> intURI:: [🧷内部链接](<http://localhost:7026/reading/16>)

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
>  **Description**:: 基础知识 vscode-vim vscode-vim是一款vim模拟器，它将vim的大部分功能都集成在了vscode中，你可以将它理解为一个嵌套在vscode中的vim。 由于该vim是被模拟的的非真实vim，所以原生vim中有些功能它并不支持，如宏录制功能，但这依然不妨碍vscode-vim插件的
%%

> [!md] Metadata  
> **标题**:: [vscode + vim 全键盘操作高效搭配方案](https://www.cnblogs.com/YunyaSir/p/15522565.html)  
> **日期**:: [[2024-08-02]]  

## Annotations


> [!srhl5] [[SR16@vscode + vim 全键盘操作高效搭配方案|📄]] <mark style="background-color: #a8ea68">Highlights</mark> [🧷](<http://localhost:7026/unread/16#id=1723303355831>) [🌐](<#id=1723303355831>)   
> 配置文件
> ^sran-1723303355831


