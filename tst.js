function observerLCP() {
    let lcpEntry = null

    const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        lcpEntry = entries[entries.length - 1]
    })

    observer.observe({ type: 'largest-contentful-paint', buffered: true })

    // Report the LCP entry when the page is hidden or unloaded
    const reportLCP = () => {
        if (observer) {
            observer.takeRecords()
            observer.disconnect()
        }

        if (lcpEntry) {
            console.log('Largest Contentful Paint:', lcpEntry.startTime)
            const metrics = {
                lcp: lcpEntry.startTime,
                element: lcpEntry.element ? lcpEntry.element.tagName : null,
                size: lcpEntry.size,
                url: lcpEntry.url || null,
            }
            console.log('LCP Metrics:', metrics)
            onReport(metrics)
        }

    }
    // Return a promise that resolves with the LCP entry when the page is hidden or unloaded 
    return new Promise((resolve) => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                reportLCP()
                resolve(lcpEntry)
            }
        }


    }