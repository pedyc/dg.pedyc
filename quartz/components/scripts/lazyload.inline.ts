export interface LazyloadConfig {
  preloadMargin: string
  maxConcurrent: number
  loadTimeout: number
  retryCount: number
}

const LAZYLOAD_CONFIG: LazyloadConfig = {
  preloadMargin: "200px", // 预加载margin
  maxConcurrent: 3, // 最大并发数
  loadTimeout: 5000, // 加载超时时间
  retryCount: 2, // 重试次数
}

// 延迟加载主逻辑
function initializeLazyLoading() {
  let activeloads = 0
  const loadQueue: HTMLImageElement[] = []
  // 新增缓存机制，缓存图片url
  const loadedCache = new Set<string>()
  // 添加请求中止控制器
  const abortControllers = new WeakMap<HTMLImageElement, AbortController>()

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const img = entry.target as HTMLImageElement
        const src = img.dataset.src || img.src

        // 优化1：添加缓存检查
        if (loadedCache.has(src)) {
          observer.unobserve(img)
          return
        }

        if (entry.isIntersecting) {
          img.classList.add("loading")
          loadQueue.push(img)
          scheduleLoading()
          observer.unobserve(img)
        } else {
          // 优化3：离开视口时取消加载
          const controller = abortControllers.get(img)
          if (controller) {
            controller.abort()
            abortControllers.delete(img)
          }
        }
      })
    },
    {
      rootMargin: LAZYLOAD_CONFIG.preloadMargin,
      threshold: 0.01, // 降低阈值提升响应速度
    },
  )

  function scheduleLoading() {
    // 优化4：使用空闲回调优化性能
    "requestIdleCallback" in window
      ? requestIdleCallback(processQueue)
      : setTimeout(processQueue, 50)
  }

  function processQueue(deadline?: IdleDeadline) {
    while (
      activeloads < LAZYLOAD_CONFIG.maxConcurrent &&
      loadQueue.length > 0 &&
      (deadline?.timeRemaining() ?? 1) > 0
    ) {
      const img = loadQueue.shift()
      if (img) loadImage(img)
    }
  }

  function loadImage(img: HTMLImageElement) {
    const src = img.dataset.src || img.src
    if (loadedCache.has(src)) {
      activeloads--
      return scheduleLoading()
    }

    const controller = new AbortController()
    abortControllers.set(img, controller)

    // 优化5：添加尺寸预设避免布局偏移
    if (img.dataset.width && img.dataset.height) {
      img.style.aspectRatio = `${img.dataset.width}/${img.dataset.height}`
    }

    // 优化6：增强错误处理
    let retries = 0
    const tryLoad = () => {
      const timeout = setTimeout(() => {
        controller.abort()
        img.dispatchEvent(new Event("error"))
      }, LAZYLOAD_CONFIG.loadTimeout)

      const onLoad = () => {
        clearTimeout(timeout)
        console.log("Image loaded:", src)
        loadedCache.add(src)

        // 确保类名正确添加
        img.classList.remove("loading")
        img.classList.add("loaded")

        // 清理资源
        abortControllers.delete(img)
        activeloads--
        scheduleLoading()
      }

      const onError = () => {
        clearTimeout(timeout)
        console.error(`Image load failed: ${src}`)

        if (retries++ < LAZYLOAD_CONFIG.retryCount) {
          console.log(`Retrying (${retries}/${LAZYLOAD_CONFIG.retryCount}):`, src)
          setTimeout(tryLoad, 1000 * retries)
        } else {
          img.classList.remove("loading")
          img.classList.add("error")
          activeloads--
          scheduleLoading()
        }
      }

      // 先添加事件监听器
      img.addEventListener("load", onLoad, { once: true })
      img.addEventListener("error", onError, { once: true })

      // 最后设置 src 触发加载
      if (img.src !== src) {
        img.src = src
      } else if (img.complete) {
        // 如果图片已经加载完成，手动触发 load 事件
        onLoad()
      }
    }

    activeloads++
    tryLoad()
  }

  // 优化8：添加内存清理逻辑
  const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.contentRect.height) {
        const img = entry.target as HTMLImageElement
        resizeObserver.unobserve(img)
        abortControllers.get(img)?.abort()
      }
    })
  })

  const lazyImages = document.querySelectorAll('#quartz-body img[loading="lazy"]')
  lazyImages.forEach((img) => {
    if (img.hasAttribute("noLazy")) {
      return
    }
    const article = img.closest("article")
    if (article?.hasAttribute("noLazy")) {
      return
    }

    observer.observe(img)
    resizeObserver.observe(img) // 监控元素卸载
  })
}

// esbuild配置了inline文件的导出，不需要额外导出
initializeLazyLoading()
document.addEventListener("nav", initializeLazyLoading)
