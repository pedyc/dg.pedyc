---
name: cache-strategy
description: 前端缓存策略指南。包含浏览器缓存、Web Storage、Service Worker、LRU 算法等最佳实践。
argument-hint: [topic]
allowed-tools: Glob,Grep,Read
---

回答前端缓存策略相关问题：

1. **缓存层次**：Memory Cache → Service Worker → HTTP Cache → CDN → Server
2. **HTTP 缓存**：Cache-Control、ETag、Last-Modified
3. **Web Storage**：localStorage、sessionStorage
4. **Service Worker**：Cache First、Network First、Stale While Revalidate
5. **算法**：LRU、LFU、FIFO、TTL

详细文档见：content/30-Zettelkasten/前端缓存策略.md
