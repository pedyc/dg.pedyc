/**
 * Service Worker for Quartz static site
 * Caches fonts, CSS, and other static resources for offline access and faster navigation
 */

const CACHE_NAME = 'quartz-static-v1';

// 需要预缓存的静态资源
const PRECACHE_URLS = [
  // 字体文件
  '/static/fonts/lxgw.subset.woff',
  '/static/font/font-style.css',
  '/static/fonts/font.css',
  // CSS
  '/static/index.css',
  '/static/katex.min.css',
  // 其他静态资源
  '/static/icon.png',
];

// 字体文件的 MIME 类型
const FONT_MIME_TYPES = [
  'font/woff',
  'font/woff2',
  'application/font-woff',
  'application/font-woff2',
  'application/x-font-woff',
  'application/x-font-ttf',
];

/**
 * 安装事件 - 预缓存关键资源
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static resources');
      return cache.addAll(PRECACHE_URLS);
    }).then(() => {
      // 立即激活，跳过等待
      return self.skipWaiting();
    })
  );
});

/**
 * 激活事件 - 清理旧缓存
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      // 立即控制所有页面
      return self.clients.claim();
    })
  );
});

/**
 * 请求拦截 - 缓存优先策略
 */
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 只处理同源请求
  if (url.origin !== location.origin) {
    return;
  }

  // 只处理静态资源
  if (!isStaticResource(url.pathname)) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      // 先从缓存查找
      return cache.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log('[SW] Cache hit:', url.pathname);
          // 返回缓存的同时，尝试更新缓存（后台更新）
          updateCache(event.request, cache);
          return cachedResponse;
        }

        // 缓存未命中，从网络获取
        console.log('[SW] Cache miss:', url.pathname);
        return fetch(event.request)
          .then((networkResponse) => {
            // 如果是成功响应，缓存起来
            if (networkResponse.ok) {
              // 克隆响应，因为响应只能使用一次
              const responseToCache = networkResponse.clone();
              cache.put(event.request, responseToCache);
            }
            return networkResponse;
          })
          .catch(() => {
            // 网络失败，返回备用响应
            console.log('[SW] Network failed, no fallback for:', url.pathname);
            // 对于字体文件，返回空响应让浏览器使用系统字体
            if (isFont(url.pathname)) {
              return new Response('', { status: 200 });
            }
            return new Response('Resource not available', { status: 503 });
          });
      });
    })
  );
});

/**
 * 检查是否为静态资源
 */
function isStaticResource(pathname: string): boolean {
  const staticExtensions = [
    '.css',
    '.js',
    '.woff',
    '.woff2',
    '.ttf',
    '.otf',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.ico',
    '.webp',
  ];
  const lowerPath = pathname.toLowerCase();
  return staticExtensions.some((ext) => lowerPath.endsWith(ext));
}

/**
 * 检查是否为字体文件
 */
function isFont(pathname: string): boolean {
  const fontExtensions = ['.woff', '.woff2', '.ttf', '.otf'];
  const lowerPath = pathname.toLowerCase();
  return fontExtensions.some((ext) => lowerPath.endsWith(ext));
}

/**
 * 后台更新缓存
 */
function updateCache(request: Request, cache: Cache): void {
  fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response);
      }
    })
    .catch(() => {
      // 忽略更新失败
    });
}
