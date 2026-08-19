function observerLCP() {
    let lcpValue = 0;
    let lcpEntry = null;

    // 创建PerformanceObserver实例
    const observer = new PerfermanceObserver(entryList => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]
        // 每次触发更新最大元素信息及时间戳
        lcpEntry = lastEntry
        lcpValue = lastEntry.startTime
    })

    // 注册监听，buffered: true 用于捕获监听器建立前已经发生的绘制
    observer.observe({ type: 'largest-contentful-paint', buffered: true })

    // 定义何时确定并上报LCP
    const reportLCP = () => {
        if (observer) {
            observer.takeRecords()
            observer.disconnect()
        }

        if (lcpEntry) {
            const metric = {
                name: 'LCP',
                value: lcpValue,
                element: lcpEntry.element, // 对应DOM元素，可能为null
                url: lcpEntry.url, // 如果是图片/视频，为资源地址
                size: lcpEntry.size, // 元素再视口内的渲染像素面积
                id: lcpEntry.id
            }
        }

        // 使用sendBeacon上报，防止页面卸载时丢失
        navigator.sendBeacon('/analytic', JSON.stringify(metric))
    }

    // 监听页面隐藏或卸载时上报
    ['visibilitychange', 'pagehide'].forEach(type => {
        window.addEventListener(type, () => {
            if (document.visibilityState === 'hidden')
                reportLCP()
        })
    }, { once: true })
}