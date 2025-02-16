const LAZYLOAD_CONFIG = {
  preloadMargin: "200px", // 预加载margin
  maxConcurrent: 3, // 最大并发数
  loadTimeout: 5000, // 加载超时时间
  retryCount: 2, // 重试次数
}

// 延迟加载主逻辑
function initializeLazyLoading() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        img.classList.add('loading')

        img.onload = () => {
          img.classList.remove('loading')
          img.classList.add('loaded')
        }

        if (img.complete) {
          img.dispatchEvent(new Event('load'))
        }

        observer.unobserve(img)
      }
    })
  })

  const lazyImages = document.querySelectorAll('#quartz-body img[loading="lazy"]')
  lazyImages.forEach(img => observer.observe(img))
}

// 设置图片加载优先级
function setImageFetchPriority() {
  const hiddenImages = document.querySelectorAll('img[loading="lazy"]')
  hiddenImages.forEach(img => img.setAttribute('fetchpriority', 'low'))
}

// 浏览器环境初始化
if (typeof window !== 'undefined') {
  // 初始化延迟加载
  initializeLazyLoading()

  // 导航完成后设置优先级
  document.addEventListener('nav', () => {
    setImageFetchPriority()
    // 重新初始化以捕获新图片
    initializeLazyLoading()
  })
}

// 导出函数供其他模块使用
export { initializeLazyLoading, setImageFetchPriority }

// 添加默认导出
export default `
// 原初始化代码保持字符串形式
${initializeLazyLoading.toString()}
${setImageFetchPriority.toString()}

// 保留浏览器环境判断
if (typeof window !== 'undefined') {
  initializeLazyLoading();
  document.addEventListener('nav', () => {
    setImageFetchPriority();
    initializeLazyLoading();
  });
}
`