---
title: FAQ-浏览器原理与运行机制
date-created: 2025-05-24
date-modified: 2025-05-30
---

| 示例题目                                   | 模块     | 知识点说明                                                         |
| -------------------------------------- | ------ | ------------------------------------------------------------- |
| 浏览器从输入 URL 到页面展示的过程？                   | 页面加载流程 | 包含 DNS 解析、TCP 三次握手、HTTP 请求、响应、浏览器渲染流程                         |
| 浏览器如何进行 DNS 解析？                        | 页面加载流程 | 可本地缓存 / hosts 文件 / DNS 服务器递归查询                                |
| TCP 三次握手的流程是怎样的？                       | 页面加载流程 | 客户端发送 SYN，服务器回应 SYN+ACK，客户端发送 ACK                             |
| 浏览器渲染流程的核心阶段？                          | 渲染机制   | HTML→DOM，CSS→CSSOM → Render Tree → Layout → Paint → Composite |
| DOM 与 CSSOM 合并后会生成什么？                  | 渲染机制   | 渲染树（Render Tree）                                              |
| 什么是重排（Reflow）与重绘（Repaint）？             | 渲染机制   | 重排影响布局，重绘只影响外观，前者更消耗性能                                        |
| JS 是单线程执行的吗？                           | 执行机制   | 是，基于事件循环机制（Event Loop）                                        |
| 事件循环的完整流程是怎样的？                         | 执行机制   | 执行主线程同步代码 → 执行微任务 → 宏任务 → 下一轮循环                               |
| 宏任务与微任务的区别？                            | 执行机制   | 微任务优先（Promise、MutationObserver），宏任务包括 setTimeout 等            |
| 浏览器的垃圾回收机制是什么？                         | 内存管理   | 主要使用标记清除算法（Mark-and-Sweep）                                    |
| 浏览器是如何做内存泄漏检测的？                        | 内存管理   | 通过弱引用机制、开发工具 heap snapshot、观察闭包和事件绑定                          |
| 浏览器如何做性能优化？                            | 性能优化   | 懒加载、合并重绘、DOM 批量处理、防抖节流、图片优化、异步加载脚本等                           |
| Chrome DevTools 中的 performance 面板如何使用？ | 性能优化   | 可用来分析加载、JS 执行、布局、绘制的时间分布                                      |
| 浏览器中的缓存机制有哪些？                          | 缓存机制   | 强缓存（Expires、Cache-Control），协商缓存（ETag、Last-Modified）           |
| localStorage 与 sessionStorage 区别？      | 缓存机制   | 存储范围与生命周期不同，localStorage 跨标签页、sessionStorage 单标签页             |
| 浏览器的同源策略是什么？                           | 安全相关   | 限制不同源之间的 DOM、Cookie、XHR 等操作                                   |
| 什么是 CSP（Content Security Policy）？      | 安全相关   | 限制页面可加载资源来源，防止 XSS 攻击                                         |
