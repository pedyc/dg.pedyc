---
title: 23-How Google handles JavaScript throughout the indexing process – Vercel
alias: 23-How Google handles JavaScript throughout the indexing process – Vercel
uid: 
author: 
description: 
date-created: 2024-08-12 11:36
date-modified: 2024-09-13 11:31
type: 
tags: []
---

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [vercel.com](https://vercel.com/blog/how-google-handles-javascript-throughout-the-indexing-process)

> Over the years, Google's treatment of JavaScript has changed, leaving us with misconceptions of how i……

Understanding how search engines crawl, render, and index web pages is crucial for optimizing sites for search engines. Over the years, as search engines like Google change their processes, it's tough to keep track of what works and doesn't—especially with client-side JavaScript.

We've noticed that a number of old beliefs have stuck around and kept the community unsure about best practices for application SEO:

1. "Google can't render client-side JavaScript."
2. "Google treats JavaScript pages differently."
3. "Rendering queue and timing significantly impact SEO."
4. "JavaScript-heavy sites have slower page discovery."

To address these beliefs, we've partnered with [MERJ](https://merj.com/), a leading SEO & data engineering consultancy, to conduct new experiments on Google's crawling behavior. We analyzed over 100,000 Googlebot fetches across various sites to test and validate Google's SEO capabilities.

Let's look at how Google's rendering has evolved. Then, we'll explore our findings and their real-world impact on modern web apps.

* * *

**Article contents:**

* [The evolution of Google's rendering capabilities](https://vercel.com/blog/how-google-handles-javascript-throughout-the-indexing-process#the-evolution-of-google%E2%80%99s-rendering-capabilities)
* [Methodology](https://vercel.com/blog/how-google-handles-javascript-throughout-the-indexing-process#methodology)
* [Myth 1: "Google can't render JavaScript content"](https://vercel.com/blog/how-google-handles-javascript-throughout-the-indexing-process#myth-1-%E2%80%9Cgoogle-can%E2%80%99t-render-javascript-content%E2%80%9D)
* [Myth 2: "Google treats JavaScript pages differently"](https://vercel.com/blog/how-google-handles-javascript-throughout-the-indexing-process#myth-2-%E2%80%9Cgoogle-treats-javascript-pages-differently%E2%80%9D)
* [Myth 3: "Rendering queue and timing significantly impact SEO"](https://vercel.com/blog/how-google-handles-javascript-throughout-the-indexing-process#myth-3-%E2%80%9Crendering-queue-and-timing-significantly-impact-seo)
* [Myth 4: "JavaScript-heavy sites have slower page discovery"](https://vercel.com/blog/how-google-handles-javascript-throughout-the-indexing-process#myth-4-%E2%80%9Cjavascript-heavy-sites-have-slower-page-discovery%E2%80%9D)
* [Overall implications and recommendations](https://vercel.com/blog/how-google-handles-javascript-throughout-the-indexing-process#overall-implications-and-recommendations)
* [Moving forward with new information](https://vercel.com/blog/how-google-handles-javascript-throughout-the-indexing-process#moving-forward-with-new-information)
* [About MERJ](https://vercel.com/blog/how-google-handles-javascript-throughout-the-indexing-process#about-merj)

[The evolution of Google’s rendering capabilities](#the-evolution-of-google’s-rendering-capabilities)
-----------------------------------------------------------------------------------------------------

Over the years, Google's ability to crawl and index web content has significantly changed. Seeing this evolution is important to understand the current state of SEO for modern web applications.

## [**Pre-2009: Limited JavaScript support**](#pre-2009-limited-javascript-support)

In the early days of search, Google primarily indexed static HTML content. JavaScript-generated content was largely invisible to search engines, leading to the widespread use of static HTML for SEO purposes.

## [**2009–2015: AJAX crawling scheme**](#2009–2015-ajax-crawling-scheme)

Google introduced the AJAX crawling scheme, allowing websites to provide HTML snapshots of dynamically generated content. This was a stopgap solution that required developers to create separate, crawlable versions of their pages.

## [**2015–2018: Early JavaScript rendering**](#2015–2018-early-javascript-rendering)

Google began rendering pages using a headless Chrome browser, marking a significant step forward. However, this older browser version still had limitations in processing modern JS features.

## [**2018–present: Modern rendering capabilities**](#2018–present-modern-rendering-capabilities)

Today, Google uses an up-to-date version of Chrome for rendering, keeping pace with the latest web technologies. Key aspects of the current system include:

1. **Universal rendering:** Google now attempts to render all HTML pages, not just a subset.
2. **Up-to-date browser:** Googlebot uses the latest stable version of Chrome/Chromium, supporting modern JS features.
3. **Stateless rendering:** Each page render occurs in a fresh browser session, without retaining cookies or state from previous renders. Google will generally not click on items on the page, [such as tabbed content](https://merj.com/blog/12-experiments-for-tabbed-content-seo) or cookie banners.
4. **Cloaking**: Google prohibits showing different content to users and search engines to manipulate rankings. Avoid code that alters content based on `User-Agent`. Instead, optimize your app's stateless rendering for Google, and implement personalization through stateful methods.
5. **Asset caching:** Google speeds up webpage rendering by caching assets, which is useful for pages sharing resources and for repeated renderings of the same page. Instead of using HTTP `Cache-Control` headers, [Google's Web Rendering Service employs its own internal heuristics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics#caching) to determine when cached assets are still fresh and when they need to be downloaded again.

![[Source/SimpRead/output/_resources/23-How Google handles JavaScript throughout the indexing process – Vercel/763fd884f7909e5e82972018647d780a_MD5.png]]

Today, Google's indexing process looks something like this.

![[Source/SimpRead/output/_resources/23-How Google handles JavaScript throughout the indexing process – Vercel/613922c8ed1f6d78fcbe3d8f5f7bc4ad_MD5.png]]

Today, Google's indexing process looks something like this.

![[Source/SimpRead/output/_resources/23-How Google handles JavaScript throughout the indexing process – Vercel/4f4f26a0052dff36df1bd9cba5238dcc_MD5.png]]

Today, Google's indexing process looks something like this.

![[Source/SimpRead/output/_resources/23-How Google handles JavaScript throughout the indexing process – Vercel/51159991c2701e99ae052e5ff6a97f42_MD5.png]]

Today, Google's indexing process looks something like this.

* * *

With a better understanding of what Google is capable of, let's look at some common myths and how they impact SEO.

[Methodology](#methodology)
---------------------------

To investigate the following myths, we conducted a study using Vercel's infrastructure and MERJ's Web Rendering Monitor (WRM) technology. Our research focused on [`nextjs.org`](http://nextjs.org/), with supplemental data from [`monogram.io`](http://monogram.io/) and [`basement.io`](http://basement.io/), spanning from April 1 to April 30, 2024.

## [Data collection](#data-collection)

We placed a custom [Edge Middleware](https://vercel.com/docs/functions/edge-middleware) on these sites to intercept and analyze requests from search engine bots. This middleware allowed us to:

1. Identify and track requests from various search engines and AI crawlers. (No user data was included in this query.)
2. Inject a [lightweight JavaScript library](https://github.com/merj/wrm-research-vercel) in HTML responses for bots.

The JavaScript library, triggered when a page finished rendering, sent data back to a long-running server, including:

* The page URL.
* The unique request identifier (to match the page rendering against regular server access logs).
* The timestamp of the rendering completion (this is calculated using the JavaScript Library request reception time on the server).

## [Data analysis](#data-analysis)

By comparing the initial request present in server access logs with the data sent from our middleware to an external beacon server, we could:

1. Confirm which pages were successfully rendered by search engines.
2. Calculate the time difference between the initial crawl and the completed render.
3. Analyze patterns in how different types of content and URLs were processed.

## [Data scope](#data-scope)

For this article, we primarily focused on data from Googlebot, which provided the largest and most reliable dataset. Our analysis included over 37,000 rendered HTML pages matched with server-beacon pairs, giving us a robust sample from which to draw conclusions.

We are still gathering data about other search engines, including AI providers like OpenAI and Anthropic, and hope to talk more about our findings in the future.

In the following sections, we'll dive into each myth, providing more relevant methodology as necessary.

[Myth 1: “Google can’t render JavaScript content”](#myth-1-“google-can’t-render-javascript-content”)
----------------------------------------------------------------------------------------------------

This myth has led many developers to avoid JS frameworks or resort to complex workarounds for SEO.

## [The test](#the-test)

To test Google's ability to render JavaScript content, we focused on three key aspects:

1. **JS framework compatibility:** We analyzed Googlebot's interactions with Next.js using data from `nextjs.org`, which uses a mix of static prerendering, server-side rendering, and client-side rendering.
2. **Dynamic content indexing**: We examined pages on `nextjs.org` that load content asynchronously via API calls. This allowed us to determine if Googlebot could process and index content not present in the initial HTML response.
3. **Streamed content via React Server Components (RSCs):** Similar to the above, much of `nextjs.org` is built with the [Next.js App Router](https://nextjs.org/docs/app) and [RSCs](https://vercel.com/blog/understanding-react-server-components?nxtPslug=understanding-react-server-components). We could see how Googlebot processed and indexed content incrementally streamed to the page.
4. **Rendering success rate**: We compared the number of Googlebot requests in our server logs to the number of successful rendering beacons received. This gave us insight into what percentage of crawled pages were fully rendered.

## [Our findings](#our-findings)

1. Out of over 100,000 Googlebot fetches analyzed on `nextjs.org`, excluding status code errors and non-indexable pages, **100% of HTML pages resulted in full-page renders, including pages with complex JS interactions.**
2. All content loaded asynchronously via API calls was successfully indexed, demonstrating Googlebot's ability to process dynamically loaded content.
3. Next.js, a React-based framework, was fully rendered by Googlebot, confirming compatibility with modern JavaScript frameworks.
4. Streamed content via RSCs was also fully rendered, confirming that [streaming does not adversely impact SEO](https://vercel.com/guides/does-streaming-affect-seo).
5. Google attempts to render virtually all HTML pages it crawls, not just a subset of JavaScript-heavy pages.

[Myth 2: “Google treats JavaScript pages differently”](#myth-2-“google-treats-javascript-pages-differently”)
------------------------------------------------------------------------------------------------------------

A common misconception is that Google has a separate process or criteria for JavaScript-heavy pages. Our research, combined with [official statements from Google](https://www.youtube.com/watch?v=XBT_DUzUbOI), debunks this myth.

## [The test](#the-test)

To test where Google treats JS-heavy pages differently, we took several targeted approaches:

1. **CSS** **`@import`** **test:** We created a test page _without_ JavaScript, but _with_ a CSS file that `@imports` a second CSS file (which would only be downloaded and present in server logs upon rendering the first CSS file). By comparing this behavior to JS-enabled paged, we could verify if Google's renderer processes CSS any differently with and without JS enabled.
2. **Status code and meta tag handling:** We developed a Next.js application with middleware to test various HTTP status codes with Google. Our analysis focused on how Google processes pages with different status codes (200, 304, 3xx, 4xx, 5xx) and those with `noindex` meta tags. This helped us understand if JavaScript-heavy pages are treated differently in these scenarios.
3. **JavaScript complexity analysis**: We compared Google's rendering behavior across pages with varying levels of JS complexity on [nextjs.org](http://nextjs.org/). This included pages with minimal JS, those with moderate interactivity, and highly dynamic pages with extensive client-side rendering. We also calculated and compared the time between the initial crawl and the completed render to see if more complex JS led to longer rendering queues or processing times.

## [Our findings](#our-findings)

1. Our CSS `@import` test confirmed that Google successfully renders pages with or without JS.
2. Google renders _all_ 200 status HTML pages, regardless of JS content. Pages with 304 status are rendered using the content of the original 200 status page. Pages with other 3xx, 4xx, and 5xx errors were not rendered.
3. Pages with `noindex` meta tags in the initial HTML response were not rendered, regardless of JS content. **Client-side removal of** **`noindex`** **tags is** **_not_** **effective for SEO purposes;** if a page contains the `noindex` tag in the initial HTML response, it won't be rendered, and the JavaScript that removes the tag won't be executed.
4. We found no significant difference in Google's success rate in rendering pages with varying levels of JS complexity. At `nextjs.org`'s scale, we also found no correlation between JavaScript complexity and rendering delay. However, more complex JS on a much larger site [can impact crawl efficiency](https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget).

[Myth 3: “Rendering queue and timing significantly impact SEO](#myth-3-“rendering-queue-and-timing-significantly-impact-seo)
----------------------------------------------------------------------------------------------------------------------------

Many SEO practitioners believe that JavaScript-heavy pages face significant delays in indexing due to a rendering queue. Our research provides a clearer view of this process.

## [The test](#the-test)

To address the impact of rendering queue and timing on SEO, we investigated:

1. **Rendering delays:** We examined the time difference between Google's initial crawl of a page and its completion of rendering, using data from over 37,000 matched server-beacon pairs on `nextjs.org`.
2. **URL types:** We analyzed rendering times for URLs with and without query strings, as well as for different sections of `nextjs.org` (e.g., `/docs`, `/learn`, `/showcase`).
3. **Frequency patterns:** We looked at how often Google re-renders pages and if there were patterns in rendering frequency for different types of content.

## [Our findings](#our-findings)

The rendering delay distribution was as follows:

* 50th percentile (median): 10 seconds.
* 75th percentile: 26 seconds
* 90th percentile: ~3 hours
* 95th percentile: ~6 hours
* 99th percentile: ~18 hours

![[Source/SimpRead/output/_resources/23-How Google handles JavaScript throughout the indexing process – Vercel/ab2baf90dafeefe4fc372b9cfd55a68d_MD5.png]]

The exact rendering delay distribution we found across over 37,000 matched server-beacon pairs.

![[Source/SimpRead/output/_resources/23-How Google handles JavaScript throughout the indexing process – Vercel/f81b3f4e565dd86206cf41e9cc4c03ad_MD5.png]]

The exact rendering delay distribution we found across over 37,000 matched server-beacon pairs.

![[Source/SimpRead/output/_resources/23-How Google handles JavaScript throughout the indexing process – Vercel/2c162d18d2260577dddc64657b8e1be6_MD5.png]]

The exact rendering delay distribution we found across over 37,000 matched server-beacon pairs.

![[Source/SimpRead/output/_resources/23-How Google handles JavaScript throughout the indexing process – Vercel/30477996f66a20090a2a43383292469c_MD5.png]]

The exact rendering delay distribution we found across over 37,000 matched server-beacon pairs.

Surprisingly, the 25th percentile of pages were rendered within 4 seconds of the initial crawl, challenging the notion of a long "queue."

While some pages faced significant delays (up to ~18 hours at the 99th percentile), these were the exception and not the rule.

* * *

We also observed interesting patterns related to how quickly Google renders URLs with query strings (?param=xyz):

<table><tbody><tr><th><p><b>URL Type</b></p></th><th><p><b>50th Percentile</b></p></th><th><p><b>75th Percentile</b></p></th><th><p><b>90th Percentile</b></p></th></tr><tr><td><p><b>All URLs</b></p></td><td><p>10 seconds</p></td><td><p>26 seconds</p></td><td><p>~3 hours</p></td></tr><tr><td><p><b>URLs without Query String</b></p></td><td><p>10 seconds</p></td><td><p>22 seconds</p></td><td><p>~2.5 hours</p></td></tr><tr><td><p><b>URLs with Query String</b></p></td><td><p>13 seconds</p></td><td><p>31 minutes</p></td><td><p>~8.5 hours</p></td></tr></tbody></table>

This data suggests that Google treats URLs differently if they have query strings that don't affect the content. For example, on `nextjs.org`, pages with `?ref=` parameters experienced longer rendering delays, especially at higher percentiles.

Additionally, we noticed that frequently updated sections like `/docs` had shorter median rendering times compared to more static sections. For example, the `/showcase` page, despite being frequently linked, showed longer rendering times, suggesting that Google may slow down re-rendering for pages that don't change significantly.

[Myth 4: “JavaScript-heavy sites have slower page discovery”](#myth-4-“javascript-heavy-sites-have-slower-page-discovery”)
--------------------------------------------------------------------------------------------------------------------------

A persistent belief in the SEO community is that JavaScript-heavy sites, especially those relying on client-side rendering (CSR) like Single Page Applications (SPAs), suffer from slower page discovery by Google. Our research provides new insights here.

## [The test](#the-test)

To investigate the impact of JavaScript on page discovery, we:

1. **Analyzed link discovery in different rendering scenarios:** We compared how quickly Google discovered and crawled links in server-rendered, statically generated, and client-side rendered pages on [nextjs.org](http://nextjs.org/).
2. **Tested non-rendered JavaScript payloads:** We added a JSON object similar to a React Server Component (RSC) payload to the `/showcase` page of [nextjs.org](http://nextjs.org/), containing links to new, previously undiscovered pages. This allowed us to test if Google could discover links in JavaScript data that wasn't rendered.
3. **Compared discovery times:** We monitored how quickly Google discovered and crawled new pages linked in different ways: standard HTML links, links in client-side rendered content, and links in non-rendered JavaScript payloads.

## [Our findings](#our-findings)

1. Google successfully discovered and crawled links in fully rendered pages, regardless of rendering method.
2. Google can discover links in non-rendered JavaScript payloads on the page, such as those in React Server Components or similar structures.
3. In both initial and rendered HTML, Google processes content by identifying strings that look like URLs, using the current host and port as a base for relative URLs. (Google did _not_ discover an encoded URL—i.e., `https%3A%2F%2Fwebsite.com`—in our RSC-like payload, suggesting its link parsing is very strict.)
4. The source and format of a link (e.g., in an `<a>` tag or embedded in a JSON payload) did not impact how Google prioritized its crawl. Crawl priority remained consistent regardless of whether a URL was found in the initial crawl or post-rendering.
5. While Google successfully discovers links in CSR pages, these pages do need to be rendered first. Server-rendered pages or partially pre-rendered pages have a slight advantage in immediate link discovery.
6. Google differentiates between link discovery and link value assessment. The evaluation of a link's value for site architecture and crawl prioritization occurs after full-page rendering.
7. Having an updated `sitemap.xml` significantly reduces, if not eliminates, the time-to-discovery differences between different rendering patterns.

[Overall implications and recommendations](#overall-implications-and-recommendations)
-------------------------------------------------------------------------------------

Our research has debunked several common myths about Google's handling of JavaScript-heavy websites. Here are the key takeaways and actionable recommendations:

## [Implications](#implications)

1. **JavaScript compatibility:** Google can effectively render and index JavaScript content, including complex SPAs, dynamically loaded content, and streamed content.
2. **Rendering parity:** There's no fundamental difference in how Google processes JavaScript-heavy pages compared to static HTML pages. All pages are rendered.
3. **Rendering queue reality:** While a rendering queue exists, its impact is less significant than previously thought. Most pages are rendered within minutes, not days or weeks.
4. **Page discovery:** JavaScript-heavy sites, including SPAs, are not inherently disadvantaged in page discovery by Google.
5. **Content timing:** When certain elements (like `noindex` tags) are added to the page is crucial, as Google may not process client-side changes.
6. **Link value assessment:** Google differentiates between link discovery and link value assessment. The latter occurs after full-page rendering.
7. **Rendering prioritization:** Google's rendering process isn't strictly first-in-first-out. Factors like content freshness and update frequency influence prioritization more than JavaScript complexity.
8. **Rendering performance and crawl budget:** While Google can effectively render JS-heavy pages, the process is more resource-intensive compared to static HTML, both for you and Google. For large sites (10,000+ unique and frequently changing pages), this can [impact the site’s crawl budget](https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget). Optimizing application performance and minimizing unnecessary JS can help speed up the rendering process, improve crawl efficiency, and potentially allow more of your pages to be crawled, rendered, and indexed.

## [Recommendations](#recommendations)

1. **Embrace JavaScript:** Leverage JavaScript frameworks freely for enhanced user and developer experiences, but prioritize performance and adhere to [Google's best practices for lazy-loading](https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading).
2. **Error handling:** Implement [error boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) in React applications to prevent total render failures due to individual component errors.
3. **Critical SEO elements:** Use server-side rendering or static generation for critical SEO tags and important content to ensure they're present in the initial HTML response.
4. **Resource management:** Ensure [critical resources for rendering](https://merj.com/blog/managing-webpages-resources-for-efficient-crawling-and-rendering) (APIs, JavaScript files, CSS files) are not blocked by `robots.txt`.
5. **Content updates:** For content that needs to be quickly re-indexed, ensure changes are reflected in the server-rendered HTML, not just in client-side JavaScript. Consider strategies like [Incremental Static Regeneration](https://vercel.com/docs/incremental-static-regeneration#differences-between-isr-and-cache-control-headers) to balance content freshness with SEO and performance.
6. **Internal linking and URL structure:** Create a clear, logical internal linking structure. Implement important navigational links as real HTML anchor tags (`<a href="…">`) rather than JavaScript-based navigation. This approach aids both user navigation and search engine crawling efficiency while potentially reducing rendering delays.
7. **Sitemaps:** [Use and regularly update sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview). For large sites or those with frequent updates, use the `<lastmod>` tag in XML sitemaps to guide Google's crawling and indexing processes. Remember to update the `<lastmod>` only when a significant content update occurs.
8. **Monitoring:** Use Google Search Console's [URL Inspection Tool](https://support.google.com/webmasters/answer/9012289?hl=en) or [Rich Results Tool](https://search.google.com/test/rich-results) to verify how Googlebot sees your pages. Monitor crawl stats to ensure your chosen rendering strategy isn't causing unexpected issues.

[Moving forward with new information](#moving-forward-with-new-information)
---------------------------------------------------------------------------

As we've explored, there are some differences between [rendering strategies](https://vercel.com/blog/how-to-choose-the-best-rendering-strategy-for-your-app) when it comes to Google's abilities:

<table><tbody><tr><th><p><b>Feature</b></p></th><th><p><b>Static Site Generation (SSG)</b></p></th><th><p><b>Incremental Static Regeneration (ISR)</b></p></th><th><p><b>Server-Side Rendering (SSR)</b></p></th><th><p><b>Client-Side Rendering (CSR)</b></p></th></tr><tr><td><p><b>Crawl efficiency: </b>How quickly and effectively Google can access, render, and retrieve webpages.</p></td><td><p>Excellent</p></td><td><p>Excellent</p></td><td><p>Very Good</p></td><td><p>Poor</p></td></tr><tr><td><p><b>Discovery:</b> The process of finding new URLs to crawl.*</p></td><td><p>Excellent</p></td><td><p>Excellent</p></td><td><p>Excellent</p></td><td><p>Average</p></td></tr><tr><td><p><b>Rendering completeness (errors, failures, etc):</b> How accurately and completely Google can load and process your web pages without errors.</p></td><td><p>Robust</p></td><td><p>Robust</p></td><td><p>Robust</p></td><td><p>Might fail**</p></td></tr><tr><td><p><b>Rendering time:</b> How long Google takes to fully render and process web pages.</p></td><td><p>Excellent</p></td><td><p>Excellent</p></td><td><p>Excellent</p></td><td><p>Poor</p></td></tr><tr><td><p><b>Link structure evaluation:</b> How Google assesses links to understand the website architecture and pages' importance.</p></td><td><p>After rendering</p></td><td><p>After rendering</p></td><td><p>After rendering</p></td><td><p>After rendering, links might be missing if rendering fails</p></td></tr><tr><td><p><b>Indexing:</b> The process by which Google stores and organizes your site's content.</p></td><td><p>Robust</p></td><td><p>Robust</p></td><td><p>Robust</p></td><td><p>Might not be indexed if rendering fails</p></td></tr></tbody></table>

* Having an updated `sitemap.xml` significantly reduces, if not eliminates, the time-to-discovery differences between different rendering patterns.

** Rendering in Google usually doesn't fail, as proven in our research; when it does, it's often due to blocked resources in `robots.txt` or specific edge cases.

* * *

These fine-grained differences exist, but Google will quickly discover and index your site regardless of rendering strategy. Focus on creating performant web applications that benefit users more than worrying about special accommodations for Google's rendering process.

After all, **page speed is still a ranking factor,** since Google's page experience ranking system evaluates the performance of your site based on Google's [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals) metrics.

Plus, page speed is linked to good user experience—with every 100ms of load time saved [correlated to an 8% uptick in website conversion](https://www2.deloitte.com/content/dam/Deloitte/ie/Documents/Consulting/Milliseconds_Make_Millions_report.pdf). Fewer users bouncing off your page means Google treats it as more relevant. Performance compounds; milliseconds matter.

## [Further resources](#further-resources)

To learn more about these topics, we recommend:

* [**How Core Web Vitals affect your SEO**](https://vercel.com/blog/how-core-web-vitals-affect-seo-giuMUCEQOZjD5Q1z65gix)**:** Provides a comprehensive overview of how Core Web Vitals (CWVs) affect SEO, explaining Google's page experience ranking system and the difference between field data (used for ranking) and lab data (Lighthouse scores).
* [**How to choose the right rendering strategy**](https://vercel.com/blog/how-to-choose-the-best-rendering-strategy-for-your-app)**:** Guides developers in choosing optimal rendering strategies for web applications, explaining various methods like SSG, ISR, SSR, and CSR, their use cases, and implementation considerations using Next.js.
* [**The user experience of the Frontend Cloud**](https://vercel.com/blog/the-user-experience-of-the-frontend-cloud-43fi9hfOeVbRkJN0nZiik7?__vercel_draft=1)**:** Explains how Vercel's Frontend Cloud enables fast, personalized web experiences by combining advanced caching strategies, Edge Network capabilities, and flexible rendering options to optimize both user experience and developer productivity.

Trusted by performance-critical applications.

Next.js and Vercel automatically optimize the performance of your application to meet today's high standards. We can walk you through how it works for your application.

[Contact Us](https://vercel.com/contact/sales)

[About MERJ](#about-merj)
-------------------------

MERJ is a leading SEO and data engineering consultancy specializing in technical SEO and performance optimization for complex web applications.

With a track record of success across various industries, MERJ brings cutting-edge expertise to help businesses navigate the ever-evolving landscape of search engine optimization.

If you need assistance with any of the SEO topics raised in this research, or if you're looking to optimize your web application for better search visibility and performance, don't hesitate to [contact MERJ](https://merj.com/).
