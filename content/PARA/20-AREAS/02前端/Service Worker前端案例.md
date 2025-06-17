---
title: Service Worker前端案例
date-created: 2025-06-15
date-modified: 2025-06-15
---

## 离线应用

使用 Service Worker 缓存 Web 应用程序的 HTML、CSS、JavaScript 和图片等资源，实现离线访问。

```javascript
// service-worker.js
const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/image.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
```

## 推送通知

使用 Service Worker 接收服务器推送的通知，并在浏览器中显示。例如，当有新的消息或事件发生时，向用户发送推送通知。

```javascript
// service-worker.js
self.addEventListener('push', event => {
  const title = 'My PWA';
  const options = {
    body: event.data.text(),
    icon: '/image.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
```

## 前端路由缓存

针对单页应用（SPA），缓存路由对应的资源，实现快速页面切换和离线访问。

```javascript
// service-worker.js
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.open(CACHE_NAME)
        .then(cache => {
          return cache.match('/index.html')
            .then(cachedResponse => {
              return cachedResponse || fetch(event.request);
            });
        })
    );
  } else {
    // 其他资源的处理
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          return cachedResponse || fetch(event.request);
        })
    );
  }
});
```
