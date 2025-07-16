"use strict"
;(() => {
  var ve = Object.create
  var X = Object.defineProperty
  var Se = Object.getOwnPropertyDescriptor
  var be = Object.getOwnPropertyNames
  var Le = Object.getPrototypeOf,
    Te = Object.prototype.hasOwnProperty
  var Re = ((a) =>
    typeof require < "u"
      ? require
      : typeof Proxy < "u"
        ? new Proxy(a, { get: (e, t) => (typeof require < "u" ? require : e)[t] })
        : a)(function (a) {
    if (typeof require < "u") return require.apply(this, arguments)
    throw Error('Dynamic require of "' + a + '" is not supported')
  })
  var f = (a, e) => () => (a && (e = a((a = 0))), e)
  var Ie = (a, e) => () => (e || a((e = { exports: {} }).exports, e), e.exports),
    xe = (a, e) => {
      for (var t in e) X(a, t, { get: e[t], enumerable: !0 })
    },
    Oe = (a, e, t, r) => {
      if ((e && typeof e == "object") || typeof e == "function")
        for (let n of be(e))
          !Te.call(a, n) &&
            n !== t &&
            X(a, n, { get: () => e[n], enumerable: !(r = Se(e, n)) || r.enumerable })
      return a
    }
  var ie = (a, e, t) => (
    (t = a != null ? ve(Le(a)) : {}),
    Oe(e || !a || !a.__esModule ? X(t, "default", { value: a, enumerable: !0 }) : t, a)
  )
  var Y,
    j,
    q = f(() => {
      "use strict"
      ;((Y = class a {
        static instance = null
        CACHE_PREFIXES = { content: "content_", link: "link_", search: "search_" }
        constructor() {}
        static getInstance() {
          return (a.instance || (a.instance = new a()), a.instance)
        }
        processURL(e, t = {}) {
          let {
            removeHash: r = !0,
            normalizePath: n = !0,
            validate: s = !0,
            cacheType: o = "content",
          } = t
          try {
            if (s && !this.isValidURL(e))
              return {
                original: e,
                processed: new URL("about:blank"),
                cacheKey: "",
                isValid: !1,
                error: "Invalid URL format",
              }
            let u = e
            r && (u = u.split("#")[0])
            let i = new URL(u)
            n && (i.pathname = this.normalizePath(i.pathname))
            let c = this.generateCacheKey(i.toString(), o)
            return (
              console.debug(`[URLHandler Debug] Cache Key: ${c}`),
              { original: e, processed: i, cacheKey: c, isValid: !0 }
            )
          } catch (u) {
            return {
              original: e,
              processed: new URL("about:blank"),
              cacheKey: "",
              isValid: !1,
              error: u.message,
            }
          }
        }
        getContentURL(e) {
          let t = this.processURL(e, {
            removeHash: !0,
            normalizePath: !0,
            validate: !0,
            cacheType: "content",
          })
          if (!t.isValid) throw new Error(`Invalid URL: ${e} - ${t.error}`)
          return t.processed
        }
        getCacheKey(e, t = "content") {
          return this.processURL(e, { cacheType: t }).cacheKey
        }
        processBatch(e, t = {}) {
          return e.map((r) => this.processURL(r, t))
        }
        isValidURL(e) {
          if (!e || typeof e != "string" || e.length === 0) return !1
          try {
            return (new URL(e), !0)
          } catch {
            return !1
          }
        }
        normalizePath(e) {
          if (
            (e.endsWith(".md") && (e = e.slice(0, -3)),
            e.endsWith("/index") && (e = e.slice(0, -6)),
            e.endsWith("/") && e.length > 1 && (e = e.slice(0, -1)),
            e === "")
          )
            return "/"
          let t = e.split("/").filter(Boolean),
            r = [],
            n = new Set()
          for (let o of t) n.has(o) || (n.add(o), r.push(o))
          return "/" + r.join("/")
        }
        generateCacheKey(e, t) {
          let r = encodeURIComponent(e)
          return `${this.CACHE_PREFIXES[t]}${r}`
        }
        isInternalLink(e) {
          try {
            return new URL(e).origin === window.location.origin
          } catch {
            return !1
          }
        }
        shouldPreload(e) {
          if (!this.isInternalLink(e)) return !1
          try {
            let t = new URL(e)
            return !(
              [".pdf", ".zip", ".rar", ".7z", ".tar", ".gz"].some((n) =>
                t.pathname.toLowerCase().endsWith(n),
              ) ||
              t.pathname.startsWith("/api/") ||
              t.pathname.startsWith("/admin/") ||
              (t.pathname === window.location.pathname && t.hash)
            )
          } catch {
            return !1
          }
        }
        isSamePage(e) {
          return e.origin === window.location.origin && e.pathname === window.location.pathname
        }
      }),
        (j = Y.getInstance()))
    })
  var y,
    p,
    Ze,
    Je,
    et,
    tt,
    rt,
    nt,
    S,
    oe,
    at,
    st,
    it,
    H = f(() => {
      "use strict"
      q()
      M()
      ;((y = (a) =>
        a
          ? a
              .toLowerCase()
              .replace(g.CONVENTIONS.FORBIDDEN_CHARS, "")
              .replace(/\s+/g, g.SEPARATOR)
              .replace(/_+/g, g.SEPARATOR)
              .replace(/^_|_$/g, "")
              .substring(0, g.CONVENTIONS.MAX_LENGTH)
          : ""),
        (p = {
          generateContentKey: (a, e) => {
            let t = j.processURL(a, { cacheType: "content" })
            if (!t.isValid)
              return (
                console.warn(`Invalid URL for cache key generation: ${a}`),
                `${g.PREFIXES.CONTENT}invalid_${y(a)}`
              )
            let r = t.cacheKey
            return e ? `${r}${g.SEPARATOR}${e}` : r
          },
          generateSearchKey: (a, e) => {
            let t = y(a)
            return e ? `${g.PREFIXES.SEARCH}${t}${g.SEPARATOR}${y(e)}` : `${g.PREFIXES.SEARCH}${t}`
          },
          generateUserKey: (a, e) => {
            let t = y(a)
            return e ? `${g.PREFIXES.USER}${e}${g.SEPARATOR}${t}` : `${g.PREFIXES.USER}${t}`
          },
          generateFontKey: (a, e) => {
            let t = y(a)
            return e ? `${g.PREFIXES.FONT}${t}${g.SEPARATOR}${e}` : `${g.PREFIXES.FONT}${t}`
          },
          generateSystemKey: (a, e) => {
            let t = y(a)
            return e ? `${g.PREFIXES.SYSTEM}${t}${g.SEPARATOR}${y(e)}` : `${g.PREFIXES.SYSTEM}${t}`
          },
          identifyType: (a) => {
            let e = Object.entries(g.PREFIXES)
            for (let [t, r] of e) if (a.startsWith(r)) return t
            return null
          },
          extractOriginalKey: (a) => {
            let e = Object.values(g.PREFIXES)
            for (let t of e) if (a.startsWith(t)) return a.substring(t.length)
            return a
          },
          generateStorageKey: (a, e) =>
            p.identifyType(a)
              ? a
              : `${{ MEMORY: g.PREFIXES.CONTENT, SESSION: g.PREFIXES.CONTENT }[e] || g.PREFIXES.CONTENT}${a}`,
          validateKeyFormat: (a) => {
            let e = [],
              t = []
            return (
              (!a || a.length === 0) &&
                (e.push("\u952E\u4E0D\u80FD\u4E3A\u7A7A"),
                t.push("\u63D0\u4F9B\u4E00\u4E2A\u975E\u7A7A\u7684\u952E")),
              a.length > g.CONVENTIONS.MAX_LENGTH &&
                (e.push(`\u952E\u8FC7\u957F: ${a.length} > ${g.CONVENTIONS.MAX_LENGTH}`),
                t.push("\u7F29\u77ED\u952E\u540D\u6216\u4F7F\u7528\u54C8\u5E0C\u503C")),
              g.CONVENTIONS.FORBIDDEN_CHARS.test(a) &&
                (e.push("\u952E\u5305\u542B\u7981\u7528\u5B57\u7B26"),
                t.push("\u79FB\u9664\u952E\u4E2D\u7684\u7279\u6B8A\u5B57\u7B26")),
              p.identifyType(a) ||
                (e.push("\u952E\u7F3A\u5C11\u5FC5\u9700\u7684\u524D\u7F00"),
                t.push("\u4E3A\u952E\u6DFB\u52A0\u9002\u5F53\u7684\u524D\u7F00")),
              { isValid: e.length === 0, issues: e, suggestions: t }
            )
          },
          parseKey: (a) => {
            let e = p.identifyType(a),
              t = Object.values(g.PREFIXES).find((s) => a.startsWith(s)) || null,
              r = p.extractOriginalKey(a),
              n = p.validateKeyFormat(a)
            return { original: r, type: e, prefix: t, isValid: n.isValid }
          },
        }),
        ({
          generateContentKey: Ze,
          generateSearchKey: Je,
          generateUserKey: et,
          generateFontKey: tt,
          generateSystemKey: rt,
          identifyType: nt,
          extractOriginalKey: S,
          generateStorageKey: oe,
          validateKeyFormat: at,
          parseKey: st,
        } = p),
        (it = {
          identifyType: p.identifyType,
          extractOriginalKey: p.extractOriginalKey,
          generateStorageKey: p.generateStorageKey,
          validateKey: p.validateKeyFormat,
          parseKey: p.parseKey,
        }))
    })
  function b(a) {
    return ce[a] || ce.DEFAULT
  }
  var g,
    ce,
    k,
    K,
    ct,
    le,
    lt,
    E,
    M = f(() => {
      "use strict"
      H()
      ;((g = {
        PREFIXES: {
          CONTENT: "content_",
          LINK: "link_",
          SEARCH: "search_",
          FONT: "font_",
          USER: "user_",
          SYSTEM: "sys_",
        },
        SEPARATOR: "_",
        CONVENTIONS: { CASE_STYLE: "snake_case", MAX_LENGTH: 100, FORBIDDEN_CHARS: /[^a-z0-9_-]/g },
      }),
        (ce = {
          CONTENT: {
            capacity: 200,
            ttl: 15 * 60 * 1e3,
            maxMemoryMB: 30,
            warningThreshold: 160,
            description:
              "\u7EDF\u4E00\u5185\u5BB9\u7F13\u5B58\uFF0C\u652F\u6301\u9875\u9762\u548C\u5F39\u7A97\u5185\u5BB9",
            keyPrefix: g.PREFIXES.CONTENT,
            cleanupIntervalMs: 3 * 60 * 1e3,
            memoryThreshold: 0.85,
          },
          LINK: {
            capacity: 1e3,
            ttl: 60 * 60 * 1e3,
            maxMemoryMB: 15,
            warningThreshold: 800,
            description: "\u94FE\u63A5\u6709\u6548\u6027\u548C\u5931\u8D25\u94FE\u63A5\u7F13\u5B58",
            keyPrefix: g.PREFIXES.LINK,
            cleanupIntervalMs: 10 * 60 * 1e3,
            memoryThreshold: 0.8,
          },
          SEARCH: {
            capacity: 500,
            ttl: 60 * 60 * 1e3,
            maxMemoryMB: 50,
            warningThreshold: 400,
            description: "\u641C\u7D22\u7ED3\u679C\u548C\u5185\u5BB9\u9884\u89C8\u7F13\u5B58",
            keyPrefix: g.PREFIXES.SEARCH,
            cleanupIntervalMs: 5 * 60 * 1e3,
            memoryThreshold: 0.8,
          },
          USER: {
            capacity: 100,
            ttl: 24 * 60 * 60 * 1e3,
            maxMemoryMB: 5,
            warningThreshold: 80,
            description: "\u7528\u6237\u504F\u597D\u548C\u8BBE\u7F6E\u7F13\u5B58",
            keyPrefix: g.PREFIXES.USER,
            cleanupIntervalMs: 30 * 60 * 1e3,
            memoryThreshold: 0.9,
          },
          SYSTEM: {
            capacity: 200,
            ttl: 60 * 60 * 1e3,
            maxMemoryMB: 10,
            warningThreshold: 160,
            description: "\u7CFB\u7EDF\u7EC4\u4EF6\u548C\u914D\u7F6E\u7F13\u5B58",
            keyPrefix: g.PREFIXES.SYSTEM,
            cleanupIntervalMs: 15 * 60 * 1e3,
            memoryThreshold: 0.8,
          },
          DEFAULT: {
            capacity: 100,
            ttl: 10 * 60 * 1e3,
            maxMemoryMB: 5,
            warningThreshold: 80,
            description: "\u9ED8\u8BA4\u7F13\u5B58\u914D\u7F6E",
            keyPrefix: g.PREFIXES.SYSTEM,
            cleanupIntervalMs: 5 * 60 * 1e3,
            memoryThreshold: 0.8,
          },
        }),
        (k = {
          MEMORY: {
            capacityRatio: 0.6,
            maxSizeKB: 500,
            priority: 3,
            description:
              "\u5185\u5B58\u5C42 - \u6700\u5FEB\u8BBF\u95EE\uFF0C\u5B58\u50A8\u70ED\u6570\u636E",
          },
          SESSION: {
            capacityRatio: 0.2,
            maxSizeKB: 1e3,
            priority: 2,
            description:
              "\u4F1A\u8BDD\u5C42 - \u9875\u9762\u5237\u65B0\u4FDD\u7559\uFF0C\u5B58\u50A8\u91CD\u8981\u6570\u636E",
          },
          LOCAL: {
            capacityRatio: 0.2,
            maxSizeKB: 1e3,
            priority: 2,
            description:
              "\u672C\u5730\u5C42 - \u957F\u671F\u5B58\u50A8\uFF0C\u5B58\u50A8\u957F\u671F\u6570\u636E",
          },
        }),
        (K = {
          LARGE_CONTENT_SIZE: 1024 * 1024,
          HUGE_CONTENT_SIZE: 5 * 1024 * 1024,
          MAX_MEMORY_USAGE: 50 * 1024 * 1024,
          MEMORY_CLEANUP_THRESHOLD: 0.8,
          SESSION_CLEANUP_THRESHOLD: 0.9,
          MAX_REFERENCE_COUNT: 1e3,
          HASH_COLLISION_THRESHOLD: 10,
        }),
        (ct = {
          MAX_KEY_LENGTH: 256,
          FORBIDDEN_CHARS: /[\s<>:"/\\|?*]/,
          REQUIRED_PREFIX: !0,
          MIN_CONTENT_LENGTH: 1,
          MAX_CONTENT_LENGTH: 10 * 1024 * 1024,
          KEY_FORMAT_REGEX: /^[a-z0-9_-]+$/,
        }),
        (le = {
          BATCH_SIZE: 10,
          MAX_CONCURRENT_PRELOADS: 3,
          HIT_RATE_WARNING_THRESHOLD: 0.7,
          MEMORY_CHECK_INTERVAL: 30 * 1e3,
          AUTO_CLEANUP_THRESHOLD: 0.9,
          PRELOAD_STRATEGY: { enabled: !0, count: 5, delay: 100 },
          MONITORING: {
            ENABLE_MONITORING: !0,
            MONITOR_INTERVAL: 5 * 60 * 1e3,
            REPORT_INTERVAL: 30 * 60 * 1e3,
            CONSOLE_WARNINGS: !0,
            ENABLE_KEY_VALIDATION: !0,
          },
        }))
      ;((lt = {
        content: p.generateContentKey,
        search: p.generateSearchKey,
        font: p.generateFontKey,
        user: p.generateUserKey,
        system: p.generateSystemKey,
      }),
        (E = {
          ENABLE_MONITORING: !0,
          MONITOR_INTERVAL: 5 * 60 * 1e3,
          REPORT_INTERVAL: 30 * 60 * 1e3,
          CONSOLE_WARNINGS: !0,
          ENABLE_KEY_VALIDATION: !0,
        }))
    })
  var O,
    Q,
    B,
    Z = f(() => {
      "use strict"
      M()
      ;((O = class {
        constructor(e, t, r = null, n = null) {
          this.key = e
          this.value = t
          this.prev = r
          this.next = n
        }
      }),
        (Q = class {
          constructor(e) {
            this.capacity = e
            ;((this.head = new O("__head__", {})),
              (this.tail = new O("__tail__", {})),
              (this.head.next = this.tail),
              (this.tail.prev = this.head))
          }
          cache = new Map()
          head
          tail
          addToHead(e) {
            ;((e.prev = this.head),
              (e.next = this.head.next),
              (this.head.next.prev = e),
              (this.head.next = e))
          }
          removeNode(e) {
            ;((e.prev.next = e.next), (e.next.prev = e.prev))
          }
          moveToHead(e) {
            ;(this.removeNode(e), this.addToHead(e))
          }
          removeTail() {
            let e = this.tail.prev
            return e === this.head ? null : (this.removeNode(e), e)
          }
          get(e) {
            let t = this.cache.get(e)
            return t ? (this.moveToHead(t), t.value) : null
          }
          set(e, t) {
            let r = this.cache.get(e)
            if (r) return ((r.value = t), this.moveToHead(r), null)
            let n = new O(e, t),
              s = null
            return (
              this.cache.size >= this.capacity &&
                ((s = this.removeTail()), s && this.cache.delete(s.key)),
              this.cache.set(e, n),
              this.addToHead(n),
              s
            )
          }
          delete(e) {
            let t = this.cache.get(e)
            return t ? (this.removeNode(t), this.cache.delete(e), t.value) : null
          }
          has(e) {
            return this.cache.has(e)
          }
          clear() {
            ;(this.cache.clear(), (this.head.next = this.tail), (this.tail.prev = this.head))
          }
          get size() {
            return this.cache.size
          }
          keys() {
            return Array.from(this.cache.keys())
          }
          values() {
            return Array.from(this.cache.values()).map((e) => e.value)
          }
        }),
        (B = class {
          cache
          config
          currentMemoryUsage = 0
          totalHits = 0
          totalRequests = 0
          cleanupInterval = null
          constructor(e) {
            let t = Object.fromEntries(Object.entries(e).filter(([, n]) => n !== void 0)),
              r = b("DEFAULT")
            ;((this.config = {
              capacity: r.capacity,
              ttl: r.ttl,
              maxMemoryMB: r.maxMemoryMB,
              warningThreshold: r.warningThreshold,
              description: r.description,
              keyPrefix: r.keyPrefix,
              cleanupIntervalMs: r.cleanupIntervalMs,
              memoryThreshold: r.memoryThreshold,
              ...t,
            }),
              (this.cache = new Q(this.config.capacity)),
              this.startPeriodicCleanup())
          }
          estimateSize(e) {
            if (e == null) return 8
            switch (typeof e) {
              case "string":
                return e.length * 2 + 24
              case "number":
                return 8
              case "boolean":
                return 4
              case "bigint":
                return e.toString().length + 16
              case "symbol":
                return 8
              case "function":
                return e.toString().length * 2 + 32
              case "object":
                if (e instanceof Date) return 24
                if (e instanceof RegExp) return e.source.length * 2 + 32
                if (Array.isArray(e)) return e.reduce((t, r) => t + this.estimateSize(r), 24)
                try {
                  return JSON.stringify(e).length * 2 + 32
                } catch {
                  return 1024
                }
              default:
                return 8
            }
          }
          startPeriodicCleanup() {
            typeof window > "u" ||
              (this.stopPeriodicCleanup(),
              (this.cleanupInterval = window.setInterval(() => {
                this.cleanup()
              }, this.config.cleanupIntervalMs)))
          }
          stopPeriodicCleanup() {
            this.cleanupInterval &&
              typeof window < "u" &&
              (clearInterval(this.cleanupInterval), (this.cleanupInterval = null))
          }
          set(e, t, r = 30 * 60 * 1e3) {
            try {
              let n = this.estimateSize(t),
                s = this.config.maxMemoryMB * 1024 * 1024
              if (
                this.currentMemoryUsage + n > s &&
                (this.cleanup(), this.currentMemoryUsage + n > s)
              )
                return (
                  console.warn(
                    `\u7F13\u5B58\u5185\u5B58\u4E0D\u8DB3\uFF0C\u65E0\u6CD5\u6DFB\u52A0\u952E: ${e}\uFF0C\u9700\u8981 ${n} \u5B57\u8282`,
                  ),
                  !1
                )
              let o = { data: t, timestamp: Date.now(), ttl: r, size: n, accessCount: 0 },
                u = this.cache.set(e, o)
              if ((u && (this.currentMemoryUsage -= u.value.size), u))
                this.currentMemoryUsage -= u.value.size
              else {
                let i = this.cache.get(e)
                i && i !== o && (this.currentMemoryUsage -= i.size)
              }
              return ((this.currentMemoryUsage += n), !0)
            } catch (n) {
              return (
                console.error(`\u8BBE\u7F6E\u7F13\u5B58\u9879\u5931\u8D25\uFF0C\u952E: ${e}`, n),
                !1
              )
            }
          }
          get(e) {
            this.totalRequests++
            try {
              let t = this.cache.get(e)
              if (!t) return null
              if (Date.now() - t.timestamp > t.ttl) return (this.delete(e), null)
              let r = { ...t, accessCount: t.accessCount + 1 }
              return (this.cache.set(e, r), this.totalHits++, t.data)
            } catch (t) {
              return (
                console.error(`\u83B7\u53D6\u7F13\u5B58\u9879\u5931\u8D25\uFF0C\u952E: ${e}`, t),
                null
              )
            }
          }
          has(e) {
            try {
              let t = this.cache.get(e)
              return t ? (Date.now() - t.timestamp > t.ttl ? (this.delete(e), !1) : !0) : !1
            } catch (t) {
              return (
                console.error(`\u68C0\u67E5\u7F13\u5B58\u9879\u5931\u8D25\uFF0C\u952E: ${e}`, t),
                !1
              )
            }
          }
          delete(e) {
            try {
              let t = this.cache.delete(e)
              return t ? ((this.currentMemoryUsage -= t.size), !0) : !1
            } catch (t) {
              return (
                console.error(`\u5220\u9664\u7F13\u5B58\u9879\u5931\u8D25\uFF0C\u952E: ${e}`, t),
                !1
              )
            }
          }
          cleanup() {
            try {
              let e = Date.now(),
                t = this.config.maxMemoryMB * 1024 * 1024,
                r = t * this.config.memoryThreshold,
                n = 0,
                s = 0,
                o = []
              for (let u of this.cache.keys()) {
                let i = this.cache.get(u)
                i && e - i.timestamp > i.ttl && o.push(u)
              }
              for (let u of o) {
                let i = this.cache.delete(u)
                i && ((s += i.size), (this.currentMemoryUsage -= i.size), n++)
              }
              if (this.currentMemoryUsage > r) {
                let u = this.cache
                  .values()
                  .map((i, c) => ({
                    key: this.cache.keys()[c],
                    item: i,
                    priority: i.size / Math.max(i.accessCount, 1),
                  }))
                  .sort((i, c) => c.priority - i.priority)
                for (let { key: i } of u) {
                  if (this.currentMemoryUsage <= r) break
                  let c = this.cache.delete(i)
                  c && ((s += c.size), (this.currentMemoryUsage -= c.size), n++)
                }
              }
              n > 0 &&
                console.log(
                  `\u7F13\u5B58\u6E05\u7406\u5B8C\u6210\uFF1A\u79FB\u9664 ${n} \u9879\uFF0C\u91CA\u653E ${(s / 1024).toFixed(2)} KB \u5185\u5B58\uFF0C\u5F53\u524D\u4F7F\u7528\u7387: ${((this.currentMemoryUsage / t) * 100).toFixed(1)}%`,
                )
            } catch (e) {
              console.error("\u7F13\u5B58\u6E05\u7406\u5931\u8D25:", e)
            }
          }
          getStats() {
            let e = this.config.maxMemoryMB * 1024 * 1024,
              t = this.totalRequests > 0 ? this.totalHits / this.totalRequests : 0
            return {
              size: this.cache.size,
              memoryUsage: this.currentMemoryUsage,
              maxMemoryUsage: e,
              memoryUsagePercentage: this.currentMemoryUsage / e,
              hitRate: t,
              keys: this.cache.keys(),
            }
          }
          getConfig() {
            return { ...this.config }
          }
          getItemInfo(e) {
            try {
              let t = this.cache.get(e)
              if (!t) return null
              let r = Date.now() - t.timestamp > t.ttl
              return { ...t, isExpired: r }
            } catch (t) {
              return (
                console.error(
                  `\u83B7\u53D6\u7F13\u5B58\u9879\u4FE1\u606F\u5931\u8D25\uFF0C\u952E: ${e}`,
                  t,
                ),
                null
              )
            }
          }
          clear() {
            try {
              ;(this.cache.clear(),
                (this.currentMemoryUsage = 0),
                (this.totalHits = 0),
                (this.totalRequests = 0),
                console.log("\u7F13\u5B58\u5DF2\u6E05\u7A7A"))
            } catch (e) {
              console.error("\u6E05\u7A7A\u7F13\u5B58\u5931\u8D25:", e)
            }
          }
          destroy() {
            try {
              ;(this.stopPeriodicCleanup(),
                this.clear(),
                console.log("\u7F13\u5B58\u7BA1\u7406\u5668\u5DF2\u9500\u6BC1"))
            } catch (e) {
              console.error("\u9500\u6BC1\u7F13\u5B58\u7BA1\u7406\u5668\u5931\u8D25:", e)
            }
          }
          forceCleanup() {
            this.cleanup()
          }
          resetStats() {
            ;((this.totalHits = 0), (this.totalRequests = 0))
          }
        }))
    })
  var N,
    J = f(() => {
      "use strict"
      N = class {
        observers = new Set()
        timers = new Set()
        eventListeners = []
        abortControllers = new Set()
        cleanupTasks = []
        registerIntersectionObserver(e) {
          return (this.observers.add(e), e)
        }
        registerMutationObserver(e) {
          return (this.observers.add(e), e)
        }
        registerResizeObserver(e) {
          return (this.observers.add(e), e)
        }
        registerObserver(e) {
          return (this.observers.add(e), e)
        }
        registerTimer(e) {
          return (this.timers.add(e), e)
        }
        setTimeout(e, t) {
          let r = window.setTimeout(() => {
            ;(this.timers.delete(r), e())
          }, t)
          return this.registerTimer(r)
        }
        setInterval(e, t) {
          let r = window.setInterval(e, t)
          return this.registerTimer(r)
        }
        addEventListener(e, t, r, n) {
          this.eventListeners.some((o) => o.element === e && o.type === t && o.listener === r) ||
            (e.addEventListener(t, r, n),
            this.eventListeners.push({ element: e, type: t, listener: r, options: n }))
        }
        createAbortController() {
          let e = new AbortController()
          return (this.abortControllers.add(e), e)
        }
        registerAbortController(e) {
          return (this.abortControllers.add(e), e)
        }
        removeObserver(e) {
          this.observers.has(e) && (e.disconnect(), this.observers.delete(e))
        }
        removeTimer(e) {
          this.timers.has(e) && (clearTimeout(e), clearInterval(e), this.timers.delete(e))
        }
        clearTimeout(e) {
          this.timers.has(e) && (clearTimeout(e), this.timers.delete(e))
        }
        clearInterval(e) {
          this.timers.has(e) && (clearInterval(e), this.timers.delete(e))
        }
        removeEventListener(e, t, r, n) {
          e.removeEventListener(t, r, n)
          let s = this.eventListeners.findIndex(
            (o) => o.element === e && o.type === t && o.listener === r,
          )
          s !== -1 && this.eventListeners.splice(s, 1)
        }
        abortController(e) {
          this.abortControllers.has(e) && (e.abort(), this.abortControllers.delete(e))
        }
        getStats() {
          let e = {}
          this.observers.forEach((r) => {
            let n = r.constructor.name
            e[n] = (e[n] || 0) + 1
          })
          let t = {}
          return (
            this.eventListeners.forEach(({ type: r }) => {
              t[r] = (t[r] || 0) + 1
            }),
            {
              observers: this.observers.size,
              timers: this.timers.size,
              eventListeners: this.eventListeners.length,
              abortControllers: this.abortControllers.size,
              details: { observerTypes: e, eventTypes: t },
            }
          )
        }
        cleanupObserversAndListeners() {
          ;(this.observers.forEach((e) => {
            try {
              e.disconnect()
            } catch (t) {
              console.error("\u6E05\u7406\u89C2\u5BDF\u5668\u65F6\u51FA\u9519:", t)
            }
          }),
            this.observers.clear(),
            this.timers.forEach((e) => {
              try {
                ;(clearTimeout(e), clearInterval(e))
              } catch (t) {
                console.error("\u6E05\u7406\u5B9A\u65F6\u5668\u65F6\u51FA\u9519:", t)
              }
            }),
            this.timers.clear(),
            this.eventListeners.forEach(({ element: e, type: t, listener: r, options: n }) => {
              try {
                e.removeEventListener(t, r, n)
              } catch (s) {
                console.error("\u6E05\u7406\u4E8B\u4EF6\u76D1\u542C\u5668\u65F6\u51FA\u9519:", s)
              }
            }),
            (this.eventListeners.length = 0),
            this.abortControllers.forEach((e) => {
              try {
                e.abort()
              } catch (t) {
                console.error("\u6E05\u7406 AbortController \u65F6\u51FA\u9519:", t)
              }
            }),
            this.abortControllers.clear())
        }
        cleanupNonCriticalResources() {
          ;(this.observers.forEach((n) => {
            try {
              n.disconnect()
            } catch (s) {
              console.error("\u6E05\u7406\u89C2\u5BDF\u5668\u65F6\u51FA\u9519:", s)
            }
          }),
            this.observers.clear(),
            this.timers.forEach((n) => {
              try {
                ;(clearTimeout(n), clearInterval(n))
              } catch (s) {
                console.error("\u6E05\u7406\u5B9A\u65F6\u5668\u65F6\u51FA\u9519:", s)
              }
            }),
            this.timers.clear())
          let e = ["click", "popstate"],
            t = [window, document],
            r = []
          ;(this.eventListeners.forEach(({ element: n, type: s, listener: o, options: u }) => {
            if (e.includes(s) && t.some((i) => i === n))
              (r.push({ element: n, type: s, listener: o, options: u }),
                console.log(
                  `[SPA DEBUG] \u4FDD\u7559\u5173\u952E\u4E8B\u4EF6\u76D1\u542C\u5668: ${s} on ${n.constructor.name}`,
                ))
            else
              try {
                ;(n.removeEventListener(s, o, u),
                  console.log(
                    `[SPA DEBUG] \u6E05\u7406\u975E\u5173\u952E\u4E8B\u4EF6\u76D1\u542C\u5668: ${s} on ${n.constructor.name}`,
                  ))
              } catch (i) {
                console.error("\u6E05\u7406\u4E8B\u4EF6\u76D1\u542C\u5668\u65F6\u51FA\u9519:", i)
              }
          }),
            (this.eventListeners.length = 0),
            this.eventListeners.push(...r),
            this.abortControllers.forEach((n) => {
              try {
                n.abort()
              } catch (s) {
                console.error("\u6E05\u7406 AbortController \u65F6\u51FA\u9519:", s)
              }
            }),
            this.abortControllers.clear())
        }
        cleanup() {
          ;(this.cleanupObserversAndListeners(),
            this.cleanupTasks.forEach((e) => {
              try {
                e()
              } catch (t) {
                console.error("\u6267\u884C\u6E05\u7406\u4EFB\u52A1\u65F6\u51FA\u9519:", t)
              }
            }),
            (this.cleanupTasks.length = 0))
        }
        addCleanupTask(e) {
          this.cleanupTasks.push(e)
        }
        hasActiveResources() {
          return (
            this.observers.size > 0 ||
            this.timers.size > 0 ||
            this.eventListeners.length > 0 ||
            this.abortControllers.size > 0
          )
        }
        getActiveResourcesDetails() {
          return {
            observers: Array.from(this.observers).map((e) => e.constructor.name),
            timers: Array.from(this.timers),
            eventListeners: this.eventListeners.map(({ element: e, type: t }) => ({
              element: e.constructor.name,
              type: t,
            })),
            abortControllers: this.abortControllers.size,
          }
        }
      }
    })
  var w,
    ee = f(() => {
      "use strict"
      M()
      w = class a {
        static config = b("DEFAULT")
        static DEFAULT_QUOTA = K.MAX_MEMORY_USAGE
        static async checkStorageQuota(e) {
          try {
            if (navigator.storage?.estimate) {
              let r = await navigator.storage.estimate(),
                n = r.usage || 0,
                s = r.quota || this.DEFAULT_QUOTA
              return { used: n, total: s, percentage: s > 0 ? n / s : 0, available: s - n }
            }
          } catch (r) {
            console.warn("\u65E0\u6CD5\u83B7\u53D6\u5B58\u50A8\u914D\u989D\u4FE1\u606F:", r)
          }
          let t = this.calculateStorageSize(e)
          return {
            used: t,
            total: this.DEFAULT_QUOTA,
            percentage: t / this.DEFAULT_QUOTA,
            available: this.DEFAULT_QUOTA - t,
          }
        }
        static calculateStorageSize(e) {
          let t = 0
          try {
            for (let r = 0; r < e.length; r++) {
              let n = e.key(r)
              if (n) {
                let s = e.getItem(n)
                t += (n.length + (s?.length || 0)) * 2
              }
            }
          } catch (r) {
            console.warn("\u65E0\u6CD5\u4F30\u7B97\u5B58\u50A8\u5927\u5C0F:", r)
          }
          return t
        }
        static async safeSetItem(e, t, r) {
          return (await this.checkAndCleanupIfNeeded(e), this.attemptSetItem(e, t, r))
        }
        static async checkAndCleanupIfNeeded(e) {
          try {
            let t = await this.checkStorageQuota(e),
              r = this.config.memoryThreshold || 0.9
            t.percentage > r &&
              (E.CONSOLE_WARNINGS &&
                console.warn(
                  "\u5B58\u50A8\u914D\u989D\u5373\u5C06\u8017\u5C3D\uFF0C\u6267\u884C\u6E05\u7406...",
                ),
              this.cleanupStorage(e),
              (await this.checkStorageQuota(e)).percentage > r &&
                (E.CONSOLE_WARNINGS &&
                  console.warn(
                    "\u6E05\u7406\u540E\u914D\u989D\u4ECD\u7136\u4E0D\u8DB3\uFF0C\u6267\u884C\u7D27\u6025\u6E05\u7406...",
                  ),
                this.emergencyCleanup(e)))
          } catch (t) {
            E.CONSOLE_WARNINGS && console.warn("\u914D\u989D\u68C0\u67E5\u5931\u8D25:", t)
          }
        }
        static attemptSetItem(e, t, r) {
          try {
            return (e.setItem(t, r), !0)
          } catch (n) {
            return n instanceof DOMException && n.name === "QuotaExceededError"
              ? this.handleQuotaExceeded(e, t, r)
              : (console.error("\u8BBE\u7F6E\u5B58\u50A8\u9879\u5931\u8D25:", n), !1)
          }
        }
        static handleQuotaExceeded(e, t, r) {
          ;(console.warn(
            "\u5B58\u50A8\u914D\u989D\u8D85\u9650\uFF0C\u5C1D\u8BD5\u6E05\u7406\u540E\u91CD\u8BD5...",
          ),
            this.cleanupStorage(e))
          try {
            return (e.setItem(t, r), !0)
          } catch {
            ;(console.warn(
              "\u6E05\u7406\u540E\u91CD\u8BD5\u4ECD\u5931\u8D25\uFF0C\u6267\u884C\u7D27\u6025\u6E05\u7406...",
            ),
              this.emergencyCleanup(e))
            try {
              return (e.setItem(t, r), !0)
            } catch (s) {
              return (console.error("\u6700\u7EC8\u8BBE\u7F6E\u5931\u8D25:", s), !1)
            }
          }
        }
        static safeGetItem(e, t) {
          try {
            return e.getItem(t)
          } catch (r) {
            return (console.error("\u83B7\u53D6\u5B58\u50A8\u9879\u5931\u8D25:", r), null)
          }
        }
        static safeRemoveItem(e, t) {
          try {
            e.removeItem(t)
          } catch (r) {
            console.error("\u79FB\u9664\u5B58\u50A8\u9879\u5931\u8D25:", r)
          }
        }
        static cleanupStorage(e) {
          try {
            let t = this.findExpiredKeys(e)
            ;(this.removeKeys(e, t),
              E.CONSOLE_WARNINGS &&
                t.length > 0 &&
                console.log(`\u6E05\u7406\u4E86 ${t.length} \u4E2A\u8FC7\u671F\u9879\u76EE`))
          } catch (t) {
            E.CONSOLE_WARNINGS && console.error("\u6E05\u7406\u5B58\u50A8\u5931\u8D25:", t)
          }
        }
        static findExpiredKeys(e) {
          let t = [],
            r = Date.now()
          for (let n = 0; n < e.length; n++) {
            let s = e.key(n)
            if (!s || !Object.values(g.PREFIXES).some((i) => s.startsWith(i))) continue
            let u = e.getItem(s)
            u && this.isExpiredItem(u, r) && t.push(s)
          }
          return t
        }
        static isExpiredItem(e, t) {
          try {
            let r = JSON.parse(e)
            if (r && typeof r == "object" && r.timestamp) {
              let n = t - r.timestamp,
                s = (this.config.ttl || 24 * 60 * 60) * 1e3
              return n > s
            }
          } catch {
            let r = new Blob([e]).size,
              n = (this.config.maxMemoryMB || K.LARGE_CONTENT_SIZE / 1024) * 1024
            return r > n
          }
          return !1
        }
        static removeKeys(e, t) {
          t.forEach((r) => {
            try {
              e.removeItem(r)
            } catch (n) {
              console.warn(`\u5220\u9664\u952E ${r} \u5931\u8D25:`, n)
            }
          })
        }
        static emergencyCleanup(e) {
          try {
            let t = [],
              r = this.config.keyPrefix || "sys_"
            for (let s = 0; s < e.length; s++) {
              let o = e.key(s)
              o && o.startsWith(r) && t.push(o)
            }
            let n = Math.ceil(t.length / 2)
            for (let s = 0; s < n; s++) e.removeItem(t[s])
            E.CONSOLE_WARNINGS &&
              console.warn(
                `\u7D27\u6025\u6E05\u7406\uFF1A\u79FB\u9664\u4E86 ${n} \u4E2A\u5B58\u50A8\u9879`,
              )
          } catch (t) {
            E.CONSOLE_WARNINGS && console.error("\u7D27\u6025\u6E05\u7406\u5931\u8D25:", t)
          }
        }
        async setSessionItem(e, t) {
          return a.safeSetItem(sessionStorage, e, t)
        }
        getSessionItem(e) {
          return a.safeGetItem(sessionStorage, e)
        }
        removeSessionItem(e) {
          a.safeRemoveItem(sessionStorage, e)
        }
        async setLocalItem(e, t) {
          return a.safeSetItem(localStorage, e, t)
        }
        getLocalItem(e) {
          return a.safeGetItem(localStorage, e)
        }
        removeLocalItem(e) {
          a.safeRemoveItem(localStorage, e)
        }
        async setItem(e, t, r) {
          return e === "local" ? this.setLocalItem(t, r) : this.setSessionItem(t, r)
        }
        getItem(e, t) {
          return e === "local" ? this.getLocalItem(t) : this.getSessionItem(t)
        }
        removeItem(e, t) {
          return e === "local" ? this.removeLocalItem(t) : this.removeSessionItem(t)
        }
        getStorageStats() {
          let e = (t) => {
            let r = 0,
              n = 0,
              s = a.config.keyPrefix || "sys_"
            for (let u = 0; u < t.length; u++) {
              let i = t.key(u)
              if (i && i.startsWith(s)) {
                let c = t.getItem(i)
                c && ((r += new Blob([i + c]).size), n++)
              }
            }
            let o = (a.config.capacity || K.HUGE_CONTENT_SIZE / (1024 * 1024)) * 1024 * 1024
            return { used: r, available: Math.max(0, o - r), itemCount: n }
          }
          return { localStorage: e(localStorage), sessionStorage: e(sessionStorage) }
        }
        cleanupAllStorage() {
          let e = Date.now(),
            t = (a.config.cleanupIntervalMs || 60) * 60 * 1e3,
            r = parseInt(this.getItem("local", "last_cleanup") || "0")
          e - r < t ||
            (a.cleanupStorage(localStorage),
            a.cleanupStorage(sessionStorage),
            this.setItem("local", "last_cleanup", e.toString()),
            document.dispatchEvent(new CustomEvent("cacheCleared", { detail: {} })))
        }
        cleanup() {
          this.cleanupAllStorage()
        }
        getStats() {
          let e = this.getStorageStats(),
            t = {
              localStorage: {
                used: e.localStorage.used,
                total: e.localStorage.used + e.localStorage.available,
                percentage: e.localStorage.used / (e.localStorage.used + e.localStorage.available),
              },
              sessionStorage: {
                used: e.sessionStorage.used,
                total: e.sessionStorage.used + e.sessionStorage.available,
                percentage:
                  e.sessionStorage.used / (e.sessionStorage.used + e.sessionStorage.available),
              },
            }
          return Promise.resolve(t)
        }
      }
    })
  var U,
    te = f(() => {
      "use strict"
      M()
      H()
      U = class a {
        memoryCache
        storageManager
        referenceMap = new Map()
        contentHashMap = new Map()
        stats = {
          totalRequests: 0,
          memoryHits: 0,
          sessionHits: 0,
          localHits: 0,
          duplicatesAvoided: 0,
        }
        static _initialized = !1
        constructor(e, t) {
          ;(console.log("UnifiedContentCacheManager constructor"),
            (this.memoryCache = e),
            (this.storageManager = t),
            a._initialized ||
              (console.log(
                "[UnifiedCache] Initializing UnifiedContentCacheManager from sessionStorage...",
              ),
              this.initializeFromStorage(),
              (a._initialized = !0)))
        }
        initializeFromStorage() {
          try {
            if (typeof window > "u") {
              console.warn(
                "[UnifiedCache] window \u5BF9\u8C61\u4E0D\u53EF\u7528\uFF0C\u8DF3\u8FC7\u521D\u59CB\u5316\u3002",
              )
              return
            }
            let e = { memory: 0, session: 0, local: 0 },
              t = (r, n, s) => {
                if (!r) {
                  console.warn(
                    `[UnifiedCache] ${s}Storage \u4E0D\u53EF\u7528\uFF0C\u8DF3\u8FC7\u521D\u59CB\u5316\u3002`,
                  )
                  return
                }
                for (let o = 0; o < r.length; o++) {
                  let u = r.key(o)
                  if (!u || !p.identifyType(u)) continue
                  let c = r.getItem(u)
                  if (!c) continue
                  let h = S(u)
                  if (!h || this.referenceMap.has(h)) continue
                  let l = {
                    storageLayer: n,
                    storageKey: u,
                    refCount: 0,
                    lastAccessed: Date.now(),
                    size: this.calculateSize(c),
                  }
                  this.referenceMap.set(h, l)
                  let d = this.calculateHash(c)
                  ;(this.contentHashMap.has(d) || this.contentHashMap.set(d, h), e[n]++)
                }
              }
            ;(t(window.sessionStorage, "SESSION", "session"),
              t(window.localStorage, "LOCAL", "local"),
              e.session > 0 || e.local > 0
                ? console.log(
                    `[UnifiedCache] Successfully restored ${e.session} items from sessionStorage and ${e.local} items from localStorage.`,
                  )
                : console.log(
                    "[UnifiedCache] No items found in sessionStorage or localStorage to restore.",
                  ))
          } catch (e) {
            console.warn("[UnifiedCache] Error initializing storage references:", e)
          }
        }
        get(e) {
          this.stats.totalRequests++
          let t = S(e),
            r = this.referenceMap.get(t)
          if (!r) {
            if (
              (console.log(
                `[UnifiedCache] Cache miss for key: ${e}, originalKey: ${t}. referenceMap size: ${this.referenceMap.size}`,
              ),
              this.referenceMap.size > 0)
            ) {
              let n = Array.from(this.referenceMap.keys())
              console.debug("[UnifiedCache] Available keys in referenceMap:", n)
            }
            if (
              this.referenceMap.size === 0 &&
              typeof window < "u" &&
              window.sessionStorage &&
              window.sessionStorage.length > 0
            ) {
              this.forceReinitializeFromStorage()
              let n = this.referenceMap.get(t)
              if (n) return this.getContentFromReference(t, n)
            }
            return null
          }
          return this.getContentFromReference(t, r)
        }
        getContentFromReference(e, t) {
          ;((t.lastAccessed = Date.now()), t.refCount++)
          let r = null
          switch (t.storageLayer) {
            case "MEMORY":
              ;((r = this.memoryCache.get(t.storageKey) || null), r && this.stats.memoryHits++)
              break
            case "SESSION":
              ;((r = this.storageManager.getSessionItem(t.storageKey)),
                r && this.stats.sessionHits++)
              break
            case "LOCAL":
              ;((r = this.storageManager.getLocalItem(t.storageKey)), r && this.stats.localHits++)
              break
          }
          return (r || this.referenceMap.delete(e), r)
        }
        forceReinitializeFromStorage() {
          ;(this.referenceMap.clear(), this.contentHashMap.clear(), this.initializeFromStorage())
        }
        set(e, t, r = void 0) {
          let n = S(e),
            s = this.calculateHash(t),
            o = this.contentHashMap.get(s)
          if (o && this.referenceMap.has(o)) {
            let h = this.referenceMap.get(o)
            ;(this.referenceMap.set(n, {
              storageLayer: h.storageLayer,
              storageKey: h.storageKey,
              refCount: 1,
              lastAccessed: Date.now(),
              size: h.size,
            }),
              this.stats.duplicatesAvoided++,
              console.log(`[UnifiedCache] Avoided duplicate storage for ${n}, referencing ${o}`))
            return
          }
          let u = this.selectOptimalLayer(t, r),
            i = oe(e, u)
          if (this.storeContent(i, t, u)) {
            let h = {
              storageLayer: u,
              storageKey: i,
              refCount: 1,
              lastAccessed: Date.now(),
              size: this.calculateSize(t),
            }
            ;(this.referenceMap.set(n, h), this.contentHashMap.set(s, n))
          }
        }
        delete(e) {
          let t = S(e),
            r = this.referenceMap.get(t)
          if (!r) return !1
          if ((r.refCount--, r.refCount <= 0)) {
            this.deleteFromStorage(r.storageKey, r.storageLayer)
            for (let [n, s] of this.contentHashMap.entries())
              if (s === t) {
                this.contentHashMap.delete(n)
                break
              }
          }
          return (this.referenceMap.delete(t), !0)
        }
        has(e) {
          let t = S(e)
          return this.referenceMap.has(t)
        }
        clear() {
          ;(this.referenceMap.clear(), this.contentHashMap.clear(), this.memoryCache.clear())
        }
        getStats() {
          let e =
            ((this.stats.memoryHits + this.stats.sessionHits + this.stats.localHits) /
              this.stats.totalRequests) *
            100
          return {
            ...this.stats,
            hitRate: e,
            totalCacheEntries: this.referenceMap.size,
            uniqueContentCount: this.contentHashMap.size,
            memoryUsage: this.calculateTotalMemoryUsage(),
          }
        }
        cleanup() {
          let e = Date.now(),
            t = [],
            r = le.MEMORY_CHECK_INTERVAL
          for (let [n, s] of this.referenceMap.entries()) e - s.lastAccessed > r && t.push(n)
          ;(t.forEach((n) => this.delete(n)),
            t.length > 0 &&
              console.log(`[UnifiedCache] Cleaned up ${t.length} expired cache entries`))
        }
        selectOptimalLayer(e, t) {
          let r = this.calculateSize(e),
            n = k.MEMORY,
            s = k.SESSION,
            o = k.LOCAL,
            u = [t, "MEMORY", "SESSION", "LOCAL"].filter(Boolean),
            i = [...new Set(u)]
          for (let c of i)
            switch (c) {
              case "MEMORY":
                if (r < n.maxSizeKB * 1024) return "MEMORY"
                break
              case "SESSION":
                if (r < s.maxSizeKB * 1024) return "SESSION"
                break
              case "LOCAL":
                if (r < o.maxSizeKB * 1024) return "LOCAL"
                break
            }
          return "MEMORY"
        }
        storeContent(e, t, r) {
          try {
            switch (r) {
              case "MEMORY":
                return (this.memoryCache.set(e, t), !0)
              case "SESSION":
                return (this.storageManager.setSessionItem(e, t), !0)
              case "LOCAL":
                return (this.storageManager.setLocalItem(e, t), !0)
              default:
                return !1
            }
          } catch (n) {
            return (console.warn(`[UnifiedCache] Failed to store content in ${r}:`, n), !1)
          }
        }
        deleteFromStorage(e, t) {
          try {
            switch (t) {
              case "MEMORY":
                this.memoryCache.delete(e)
                break
              case "SESSION":
                this.storageManager.removeSessionItem(e)
                break
              case "LOCAL":
                this.storageManager.removeLocalItem(e)
                break
            }
          } catch (r) {
            console.warn(`[UnifiedCache] Failed to delete from ${t}:`, r)
          }
        }
        calculateHash(e) {
          let t = 0
          for (let r = 0; r < e.length; r++) {
            let n = e.charCodeAt(r)
            ;((t = (t << 5) - t + n), (t = t & t))
          }
          return t.toString(36)
        }
        calculateSize(e) {
          return new Blob([e]).size
        }
        calculateTotalMemoryUsage() {
          let e = 0
          for (let t of this.referenceMap.values()) e += t.size
          return e
        }
        validateCacheKey(e) {
          let t = [],
            r = [],
            n = this.referenceMap.get(e)
          if (!n)
            return (
              t.push(`No reference found for key: ${e}`),
              r.push("Check if the key was properly stored"),
              { isValid: !1, issues: t, suggestions: r }
            )
          let s = !1
          switch (n.storageLayer) {
            case "MEMORY":
              s = this.memoryCache.has(n.storageKey)
              break
            case "SESSION":
              s = this.storageManager.getSessionItem(n.storageKey) !== null
              break
            case "LOCAL":
              s = this.storageManager.getLocalItem(n.storageKey) !== null
              break
          }
          return (
            s ||
              (t.push(`Content not found in ${n.storageLayer} layer with key: ${n.storageKey}`),
              r.push("The reference exists but the actual content is missing")),
            { isValid: s, issues: t, suggestions: r }
          )
        }
        repairCacheReference(e) {
          if (this.validateCacheKey(e).isValid) return !0
          this.referenceMap.delete(e)
          for (let [r, n] of this.contentHashMap.entries())
            if (n === e) {
              this.contentHashMap.delete(r)
              break
            }
          return !1
        }
        getCacheDiagnostics(e) {
          let t = this.referenceMap.get(e),
            r = this.validateCacheKey(e),
            n = {
              memory: this.memoryCache.has(e),
              session: this.storageManager.getSessionItem(e) !== null,
              local: this.storageManager.getLocalItem(e) !== null,
            }
          return {
            key: e,
            reference: t,
            validation: r,
            storageLayerInfo: n,
            availableKeys: Array.from(this.referenceMap.keys()),
          }
        }
        static resetSingleton() {
          a._initialized = !1
        }
      }
    })
  var _,
    re = f(() => {
      "use strict"
      _ = class {
        managers = new Map()
        register(e, t) {
          this.managers.set(e, t)
        }
        unregister(e) {
          this.managers.delete(e)
        }
        cleanup() {
          this.managers.forEach((e, t) => {
            try {
              e.cleanup()
            } catch (r) {
              console.error(`Error during cleanup of ${t}:`, r)
            }
          })
        }
        getAllStats() {
          let e = {}
          return (
            this.managers.forEach((t, r) => {
              t.getStats && (e[r] = t.getStats())
            }),
            e
          )
        }
        clear() {
          this.managers.clear()
        }
      }
    })
  var ne,
    A,
    T,
    R,
    v,
    $ = f(() => {
      "use strict"
      ae()
      G()
      ;((ne = class {
        _initialized = !1
        _unifiedContentCache = null
        _linkCache = null
        _searchCache = null
        _userCache = null
        _systemCache = null
        _defaultCache = null
        _urlCacheManager = null
        _failedLinksManager = null
        _storageManager = null
        _resourceManager = null
        _cleanupManager = null
        get unifiedContentCache() {
          return (
            this._unifiedContentCache ||
              ((this._unifiedContentCache = C.createUnifiedContentCacheManager(
                L.globalUnifiedContentCache,
              )),
              console.log("[GlobalManagers] Initialized UnifiedContentCacheManager")),
            this._unifiedContentCache
          )
        }
        get linkCache() {
          return (
            this._linkCache ||
              ((this._linkCache = this.createCache("LINK")),
              console.log("[GlobalManagers] Initialized LinkCache")),
            this._linkCache
          )
        }
        get searchCache() {
          return (
            this._searchCache ||
              ((this._searchCache = this.createCache("SEARCH")),
              console.log("[GlobalManagers] Initialized SearchCache")),
            this._searchCache
          )
        }
        get userCache() {
          return (
            this._userCache ||
              ((this._userCache = this.createCache("USER")),
              console.log("[GlobalManagers] Initialized UserCache")),
            this._userCache
          )
        }
        get systemCache() {
          return (
            this._systemCache ||
              ((this._systemCache = this.createCache("SYSTEM")),
              console.log("[GlobalManagers] Initialized SystemCache")),
            this._systemCache
          )
        }
        get defaultCache() {
          return (
            this._defaultCache ||
              ((this._defaultCache = this.createCache("DEFAULT")),
              console.log("[GlobalManagers] Initialized DefaultCache")),
            this._defaultCache
          )
        }
        get urlCacheManager() {
          return (
            this._urlCacheManager ||
              ((this._urlCacheManager = C.createCacheManager(L.urlCacheManager)),
              console.log("[GlobalManagers] Initialized UrlCacheManager")),
            this._urlCacheManager
          )
        }
        get failedLinksManager() {
          return (
            this._failedLinksManager ||
              ((this._failedLinksManager = C.createCacheManager(L.failedLinksManager)),
              console.log("[GlobalManagers] Initialized FailedLinksManager")),
            this._failedLinksManager
          )
        }
        get storageManager() {
          return (
            this._storageManager ||
              ((this._storageManager = C.createStorageManager(L.globalStorageManager)),
              console.log("[GlobalManagers] Initialized StorageManager")),
            this._storageManager
          )
        }
        get resourceManager() {
          return (
            this._resourceManager ||
              ((this._resourceManager = C.createResourceManager(L.globalResourceManager)),
              console.log("[GlobalManagers] Initialized ResourceManager")),
            this._resourceManager
          )
        }
        get cleanupManager() {
          return (
            this._cleanupManager ||
              ((this._cleanupManager = C.getCleanupManager()),
              console.log("[GlobalManagers] Initialized CleanupManager")),
            this._cleanupManager
          )
        }
        createCache(e) {
          return C.createCacheManager({ type: "CACHE", identifier: e, config: { cacheType: e } })
        }
        initialize(e = !1) {
          if (this._initialized) {
            console.log("[GlobalManagers] Already initialized, skipping...")
            return
          }
          ;(console.log("[GlobalManagers] Initializing global manager instances..."),
            this.cleanupManager,
            this.unifiedContentCache,
            e &&
              (this.linkCache,
              this.searchCache,
              this.userCache,
              this.systemCache,
              this.defaultCache,
              this.storageManager,
              this.resourceManager,
              this.failedLinksManager,
              this.urlCacheManager,
              console.log("[GlobalManagers] All manager instances preloaded")),
            (this._initialized = !0),
            console.log("[GlobalManagers] Global manager instances initialized"))
        }
        cleanup() {
          ;(console.log("[GlobalManagers] Cleaning up all global manager instances..."),
            C.cleanup(),
            console.log("[GlobalManagers] All global manager instances cleaned up"))
        }
        destroy() {
          ;(console.log("[GlobalManagers] Destroying all global manager instances..."),
            C.destroy(),
            (this._initialized = !1),
            Object.keys(this).forEach((e) => {
              e.startsWith("_") && (this[e] = null)
            }),
            (this._initialized = !1),
            console.log("[GlobalManagers] All global manager instances destroyed"))
        }
      }),
        (A = class {
          static _instance = new ne()
          static get instance() {
            return this._instance
          }
          static initialize(e = !1) {
            this._instance.initialize(e)
          }
          static cleanup() {
            this._instance.cleanup()
          }
          static destroy() {
            this._instance.destroy()
          }
          static getInstance(e, t) {
            switch (e) {
              case "CACHE":
                return this.instance.defaultCache
              case "RESOURCE":
                return this.instance.resourceManager
              case "STORAGE":
                return this.instance.storageManager
              case "UNIFIED_CONTENT_CACHE":
                return this.instance.unifiedContentCache
              case "CLEANUP":
                return this.instance.cleanupManager
              default:
                throw new Error(`[GlobalManagerController] Unknown manager type: ${e}`)
            }
          }
        }),
        (T = {
          get instance() {
            return A.instance.storageManager
          },
        }),
        (R = {
          get instance() {
            return A.instance.resourceManager
          },
        }),
        (v = {
          get instance() {
            return A.instance.defaultCache
          },
        }))
    })
  var G = f(() => {
    "use strict"
    $()
    I()
  })
  var C,
    L,
    ae = f(() => {
      "use strict"
      Z()
      J()
      ee()
      te()
      re()
      G()
      M()
      $()
      ;((C = class {
        static instances = new Map()
        static cleanupManager = null
        static _createAndRegisterManager(e, t, r) {
          let n = `${e.type}_${e.identifier || "default"}`
          if (this.instances.has(n)) return this.instances.get(n)
          let s = t()
          return (
            this.instances.set(n, s),
            this.getCleanupManager().register(n, s),
            console.log(`[ManagerFactory] Created ${r}: ${n}`),
            s
          )
        }
        static createCacheManager(e) {
          return this._createAndRegisterManager(
            e,
            () => {
              let t = e.config?.cacheType || "DEFAULT",
                n = {
                  ...b(t),
                  ...(e.config?.configOverride || {}),
                  enableMemoryLayer: e.config?.enableMemoryLayer ?? !0,
                  enableSessionLayer: e.config?.enableSessionLayer ?? !1,
                }
              return new B(n)
            },
            "CacheManager",
          )
        }
        static createResourceManager(e) {
          return this._createAndRegisterManager(e, () => new N(), "ResourceManager")
        }
        static createStorageManager(e) {
          return this._createAndRegisterManager(e, () => new w(), "StorageManager")
        }
        static createUnifiedContentCacheManager(e) {
          return this._createAndRegisterManager(
            e,
            () => {
              let t = v.instance,
                r = T.instance
              return new U(t, r)
            },
            "UnifiedContentCacheManager",
          )
        }
        static getCleanupManager() {
          return (
            this.cleanupManager ||
              ((this.cleanupManager = new _()),
              console.log("[ManagerFactory] Created CleanupManager singleton")),
            this.cleanupManager
          )
        }
        static cleanup() {
          ;(console.log("[ManagerFactory] Cleaning up all registered manager instances..."),
            this.instances.forEach((e, t) => {
              if (e && typeof e.cleanup == "function")
                try {
                  ;(e.cleanup(), console.log(`[ManagerFactory] Cleaned up instance: ${t}`))
                } catch (r) {
                  console.error(`[ManagerFactory] Error cleaning up instance ${t}:`, r)
                }
            }),
            console.log("[ManagerFactory] All registered manager instances cleaned up."))
        }
        static destroy() {
          ;(console.log("[ManagerFactory] Destroying all registered manager instances..."),
            this.instances.forEach((e, t) => {
              if (e && typeof e.destroy == "function")
                try {
                  ;(e.destroy(), console.log(`[ManagerFactory] Destroyed instance: ${t}`))
                } catch (r) {
                  console.error(`[ManagerFactory] Error destroying instance ${t}:`, r)
                }
              else if (e && typeof e.cleanup == "function")
                try {
                  ;(e.cleanup(),
                    console.log(`[ManagerFactory] Cleaned up (as destroy) instance: ${t}`))
                } catch (r) {
                  console.error(`[ManagerFactory] Error cleaning up (as destroy) instance ${t}:`, r)
                }
            }),
            this.instances.clear(),
            (this.cleanupManager = null),
            console.log(
              "[ManagerFactory] All registered manager instances destroyed and registry cleared.",
            ))
        }
        static getInstance(e, t = "default") {
          let r = `${e}_${t}`
          return this.instances.get(r) || null
        }
        static hasInstance(e, t = "default") {
          let r = `${e}_${t}`
          return this.instances.has(r)
        }
        static removeInstance(e, t = "default") {
          let r = `${e}_${t}`
          if (this.instances.has(r)) {
            let n = this.instances.get(r)
            if (
              (this.cleanupManager && this.cleanupManager.unregister(r),
              n && typeof n.cleanup == "function")
            )
              try {
                n.cleanup()
              } catch (s) {
                console.error(`[ManagerFactory] Error cleaning up ${r}:`, s)
              }
            return (
              this.instances.delete(r),
              console.log(`[ManagerFactory] Removed instance: ${r}`),
              !0
            )
          }
          return !1
        }
        static getStats() {
          let e = {}
          for (let t of this.instances.keys()) {
            let r = t.split("_")[0]
            e[r] = (e[r] || 0) + 1
          }
          return {
            totalInstances: this.instances.size,
            hasCleanupManager: this.cleanupManager !== null,
            instanceKeys: Array.from(this.instances.keys()),
            instancesByType: e,
          }
        }
      }),
        (L = {
          globalCacheManager: {
            type: "CACHE",
            identifier: "global",
            config: { cacheType: "DEFAULT", enableMemoryLayer: !0, enableSessionLayer: !1 },
          },
          urlCacheManager: {
            type: "CACHE",
            identifier: "url",
            config: { cacheType: "LINK", enableMemoryLayer: !0, enableSessionLayer: !1 },
          },
          failedLinksManager: {
            type: "CACHE",
            identifier: "failedLinks",
            config: { cacheType: "LINK", enableMemoryLayer: !1, enableSessionLayer: !0 },
          },
          globalResourceManager: { type: "RESOURCE", identifier: "global" },
          globalStorageManager: { type: "STORAGE", identifier: "global" },
          globalUnifiedContentCache: {
            type: "UNIFIED_CONTENT_CACHE",
            identifier: "global",
            config: { cacheType: "CONTENT", enableMemoryLayer: !0, enableSessionLayer: !0 },
          },
        }))
    })
  var I = f(() => {
    "use strict"
    Z()
    J()
    ee()
    te()
    re()
    ae()
    $()
  })
  var pe = Ie((or, de) => {
    "use strict"
    de.exports = He
    function x(a) {
      return a instanceof Buffer
        ? Buffer.from(a)
        : new a.constructor(a.buffer.slice(), a.byteOffset, a.length)
    }
    function He(a) {
      if (((a = a || {}), a.circles)) return ke(a)
      let e = new Map()
      if (
        (e.set(Date, (o) => new Date(o)),
        e.set(Map, (o, u) => new Map(r(Array.from(o), u))),
        e.set(Set, (o, u) => new Set(r(Array.from(o), u))),
        a.constructorHandlers)
      )
        for (let o of a.constructorHandlers) e.set(o[0], o[1])
      let t = null
      return a.proto ? s : n
      function r(o, u) {
        let i = Object.keys(o),
          c = new Array(i.length)
        for (let h = 0; h < i.length; h++) {
          let l = i[h],
            d = o[l]
          typeof d != "object" || d === null
            ? (c[l] = d)
            : d.constructor !== Object && (t = e.get(d.constructor))
              ? (c[l] = t(d, u))
              : ArrayBuffer.isView(d)
                ? (c[l] = x(d))
                : (c[l] = u(d))
        }
        return c
      }
      function n(o) {
        if (typeof o != "object" || o === null) return o
        if (Array.isArray(o)) return r(o, n)
        if (o.constructor !== Object && (t = e.get(o.constructor))) return t(o, n)
        let u = {}
        for (let i in o) {
          if (Object.hasOwnProperty.call(o, i) === !1) continue
          let c = o[i]
          typeof c != "object" || c === null
            ? (u[i] = c)
            : c.constructor !== Object && (t = e.get(c.constructor))
              ? (u[i] = t(c, n))
              : ArrayBuffer.isView(c)
                ? (u[i] = x(c))
                : (u[i] = n(c))
        }
        return u
      }
      function s(o) {
        if (typeof o != "object" || o === null) return o
        if (Array.isArray(o)) return r(o, s)
        if (o.constructor !== Object && (t = e.get(o.constructor))) return t(o, s)
        let u = {}
        for (let i in o) {
          let c = o[i]
          typeof c != "object" || c === null
            ? (u[i] = c)
            : c.constructor !== Object && (t = e.get(c.constructor))
              ? (u[i] = t(c, s))
              : ArrayBuffer.isView(c)
                ? (u[i] = x(c))
                : (u[i] = s(c))
        }
        return u
      }
    }
    function ke(a) {
      let e = [],
        t = [],
        r = new Map()
      if (
        (r.set(Date, (i) => new Date(i)),
        r.set(Map, (i, c) => new Map(s(Array.from(i), c))),
        r.set(Set, (i, c) => new Set(s(Array.from(i), c))),
        a.constructorHandlers)
      )
        for (let i of a.constructorHandlers) r.set(i[0], i[1])
      let n = null
      return a.proto ? u : o
      function s(i, c) {
        let h = Object.keys(i),
          l = new Array(h.length)
        for (let d = 0; d < h.length; d++) {
          let D = h[d],
            m = i[D]
          if (typeof m != "object" || m === null) l[D] = m
          else if (m.constructor !== Object && (n = r.get(m.constructor))) l[D] = n(m, c)
          else if (ArrayBuffer.isView(m)) l[D] = x(m)
          else {
            let F = e.indexOf(m)
            F !== -1 ? (l[D] = t[F]) : (l[D] = c(m))
          }
        }
        return l
      }
      function o(i) {
        if (typeof i != "object" || i === null) return i
        if (Array.isArray(i)) return s(i, o)
        if (i.constructor !== Object && (n = r.get(i.constructor))) return n(i, o)
        let c = {}
        ;(e.push(i), t.push(c))
        for (let h in i) {
          if (Object.hasOwnProperty.call(i, h) === !1) continue
          let l = i[h]
          if (typeof l != "object" || l === null) c[h] = l
          else if (l.constructor !== Object && (n = r.get(l.constructor))) c[h] = n(l, o)
          else if (ArrayBuffer.isView(l)) c[h] = x(l)
          else {
            let d = e.indexOf(l)
            d !== -1 ? (c[h] = t[d]) : (c[h] = o(l))
          }
        }
        return (e.pop(), t.pop(), c)
      }
      function u(i) {
        if (typeof i != "object" || i === null) return i
        if (Array.isArray(i)) return s(i, u)
        if (i.constructor !== Object && (n = r.get(i.constructor))) return n(i, u)
        let c = {}
        ;(e.push(i), t.push(c))
        for (let h in i) {
          let l = i[h]
          if (typeof l != "object" || l === null) c[h] = l
          else if (l.constructor !== Object && (n = r.get(l.constructor))) c[h] = n(l, u)
          else if (ArrayBuffer.isView(l)) c[h] = x(l)
          else {
            let d = e.indexOf(l)
            d !== -1 ? (c[h] = t[d]) : (c[h] = u(l))
          }
        }
        return (e.pop(), t.pop(), c)
      }
    }
  })
  function Ce(a, e) {
    if (!a) return
    function t(n) {
      n.target === this && (n.preventDefault(), n.stopPropagation(), e())
    }
    function r(n) {
      n.key.startsWith("Esc") && (n.preventDefault(), e())
    }
    ;(a?.addEventListener("click", t),
      R.instance.addCleanupTask(() => a?.removeEventListener("click", t)),
      document.addEventListener("keydown", r),
      R.instance.addCleanupTask(() => document.removeEventListener("keydown", r)))
  }
  function De(a) {
    for (; a.firstChild; ) a.removeChild(a.firstChild)
  }
  var Fe = f(() => {
    "use strict"
    I()
  })
  var ye = {}
  xe(ye, { cleanupMermaid: () => We, initializeMermaid: () => Ge })
  async function Ge(a) {
    if (a.length === 0) return
    Ee ||= await import("https://cdnjs.cloudflare.com/ajax/libs/mermaid/11.4.0/mermaid.esm.min.mjs")
    let e = Ee.default,
      t = new WeakMap()
    for (let s of a) t.set(s, s.innerText)
    async function r() {
      for (let u of a) {
        u.removeAttribute("data-processed")
        let i = t.get(u)
        i && (u.innerHTML = i)
      }
      let s = $e.reduce(
          (u, i) => (
            (u[i] = window.getComputedStyle(document.documentElement).getPropertyValue(i)),
            u
          ),
          {},
        ),
        o = document.documentElement.getAttribute("saved-theme") === "dark"
      ;(e.initialize({
        startOnLoad: !1,
        securityLevel: "loose",
        theme: o ? "dark" : "base",
        themeVariables: {
          fontFamily: s["--codeFont"],
          primaryColor: s["--light"],
          primaryTextColor: s["--darkgray"],
          primaryBorderColor: s["--tertiary"],
          lineColor: s["--darkgray"],
          secondaryColor: s["--secondary"],
          tertiaryColor: s["--tertiary"],
          clusterBkg: s["--light"],
          edgeLabelBackground: s["--highlight"],
        },
      }),
        await e.run({ nodes: a }))
    }
    await r()
    let n = r
    return (
      document.addEventListener("themechange", n),
      Ve(a),
      {
        cleanup: () => {
          document.removeEventListener("themechange", n)
        },
      }
    )
  }
  function Ve(a) {
    let e = []
    for (let n = 0; n < a.length; n++) {
      let D = function () {
          let F = l.querySelector("#mermaid-space"),
            P = l.querySelector(".mermaid-content")
          if (!P) return
          De(P)
          let Ae = s.querySelector("svg").cloneNode(!0)
          ;(P.appendChild(Ae),
            l.classList.add("active"),
            (F.style.cursor = "grab"),
            (d = new se(F, P)),
            e.push(d))
        },
        m = function () {
          if ((l.classList.remove("active"), d)) {
            d.cleanup()
            let F = e.indexOf(d)
            ;(F > -1 && e.splice(F, 1), (d = null))
          }
        }
      var t = D,
        r = m
      let s = a[n],
        o = s.parentElement,
        u = o.querySelector(".clipboard-button"),
        i = o.querySelector(".expand-button")
      if (!i) continue
      let c = window.getComputedStyle(u),
        h = u.offsetWidth + parseFloat(c.marginLeft || "0") + parseFloat(c.marginRight || "0")
      ;((i.style.right = `calc(${h}px + 0.3rem)`), o.prepend(i))
      let l = o.querySelector("#mermaid-container")
      if (!l) continue
      let d = null
      ;(i.addEventListener("click", D), Ce(l, m))
    }
    return {
      cleanup: () => {
        ;(e.forEach((n) => n.cleanup()), (e.length = 0))
      },
    }
  }
  function We() {
    document.querySelectorAll("#mermaid-container").forEach((e) => {
      e.classList.remove("active")
    })
  }
  var se,
    $e,
    Ee,
    Me = f(() => {
      "use strict"
      Fe()
      ;((se = class {
        constructor(e, t) {
          this.container = e
          this.content = t
          ;(this.setupEventListeners(), this.setupNavigationControls(), this.resetTransform())
        }
        isDragging = !1
        startPan = { x: 0, y: 0 }
        currentPan = { x: 0, y: 0 }
        scale = 1
        MIN_SCALE = 0.5
        MAX_SCALE = 3
        cleanups = []
        setupEventListeners() {
          let e = this.onMouseDown.bind(this),
            t = this.onMouseMove.bind(this),
            r = this.onMouseUp.bind(this),
            n = this.resetTransform.bind(this)
          ;(this.container.addEventListener("mousedown", e),
            document.addEventListener("mousemove", t),
            document.addEventListener("mouseup", r),
            window.addEventListener("resize", n),
            this.cleanups.push(
              () => this.container.removeEventListener("mousedown", e),
              () => document.removeEventListener("mousemove", t),
              () => document.removeEventListener("mouseup", r),
              () => window.removeEventListener("resize", n),
            ))
        }
        cleanup() {
          for (let e of this.cleanups) e()
        }
        setupNavigationControls() {
          let e = document.createElement("div")
          e.className = "mermaid-controls"
          let t = this.createButton("+", () => this.zoom(0.1)),
            r = this.createButton("-", () => this.zoom(-0.1)),
            n = this.createButton("Reset", () => this.resetTransform())
          ;(e.appendChild(r), e.appendChild(n), e.appendChild(t), this.container.appendChild(e))
        }
        createButton(e, t) {
          let r = document.createElement("button")
          return (
            (r.textContent = e),
            (r.className = "mermaid-control-button"),
            r.addEventListener("click", t),
            this.cleanups.push(() => r.removeEventListener("click", t)),
            r
          )
        }
        onMouseDown(e) {
          e.button === 0 &&
            ((this.isDragging = !0),
            (this.startPan = {
              x: e.clientX - this.currentPan.x,
              y: e.clientY - this.currentPan.y,
            }),
            (this.container.style.cursor = "grabbing"))
        }
        onMouseMove(e) {
          this.isDragging &&
            (e.preventDefault(),
            (this.currentPan = { x: e.clientX - this.startPan.x, y: e.clientY - this.startPan.y }),
            this.updateTransform())
        }
        onMouseUp() {
          ;((this.isDragging = !1), (this.container.style.cursor = "grab"))
        }
        zoom(e) {
          let t = Math.min(Math.max(this.scale + e, this.MIN_SCALE), this.MAX_SCALE),
            r = this.content.getBoundingClientRect(),
            n = r.width / 2,
            s = r.height / 2,
            o = t - this.scale
          ;((this.currentPan.x -= n * o),
            (this.currentPan.y -= s * o),
            (this.scale = t),
            this.updateTransform())
        }
        updateTransform() {
          this.content.style.transform = `translate(${this.currentPan.x}px, ${this.currentPan.y}px) scale(${this.scale})`
        }
        resetTransform() {
          this.scale = 1
          let e = this.content.querySelector("svg")
          ;((this.currentPan = {
            x: e.getBoundingClientRect().width / 2,
            y: e.getBoundingClientRect().height / 2,
          }),
            this.updateTransform())
        }
      }),
        ($e = [
          "--secondary",
          "--tertiary",
          "--gray",
          "--light",
          "--lightgray",
          "--highlight",
          "--dark",
          "--darkgray",
          "--codeFont",
        ]))
    })
  I()
  M()
  H()
  G()
  I()
  var V = class {
      config
      state
      resourceManager = R.instance
      storageManager = T.instance
      cacheManager = v.instance
      constructor(e) {
        ;((this.config = {
          debug: !1,
          cacheConfig: { prefix: e.name.toLowerCase(), ttl: 36e5 },
          ...e,
        }),
          (this.state = {
            initialized: !1,
            eventListenersSetup: !1,
            elements: new Set(),
            cleanupTasks: [],
          }),
          this.log("BaseComponentManager created"))
      }
      async initialize() {
        if (this.state.initialized) {
          this.log("Component already initialized, skipping")
          return
        }
        try {
          ;(this.log("Initializing component..."),
            this.validateGlobalInstances(),
            this.setupEventListeners(),
            await this.onInitialize(),
            this.setupPage(),
            (this.state.initialized = !0),
            this.log("Component initialized successfully"))
        } catch (e) {
          throw (console.error(`[${this.config.name}] Initialization failed:`, e), e)
        }
      }
      setupEventListeners() {
        if (!this.resourceManager)
          throw new Error(`[${this.config.name}] ResourceManager not available`)
        if (this.state.eventListenersSetup) {
          this.log("Event listeners already setup, skipping")
          return
        }
        ;(this.log("Setting up event listeners..."),
          this.resourceManager.addEventListener(document, "nav", () => this.setupPage()),
          this.resourceManager.addEventListener(document, "DOMContentLoaded", () =>
            this.setupPage(),
          ),
          this.resourceManager.addCleanupTask(() => {
            this.cleanup()
          }),
          this.onSetupEventListeners(),
          (this.state.eventListenersSetup = !0),
          this.log("Event listeners setup completed"))
      }
      setupPage() {
        try {
          this.log("Setting up page...")
          let e = this.findComponentElements()
          ;(this.state.elements.clear(),
            e.forEach((t) => this.state.elements.add(t)),
            this.onSetupPage(e),
            this.log(`Page setup completed, found ${e.length} elements`))
        } catch (e) {
          console.error(`[${this.config.name}] Page setup failed:`, e)
        }
      }
      cleanup() {
        this.log("Cleaning up component...")
        try {
          ;(this.onCleanup(),
            this.state.cleanupTasks.forEach((e) => {
              try {
                e()
              } catch (t) {
                console.error(`[${this.config.name}] Cleanup task failed:`, t)
              }
            }),
            this.state.elements.clear(),
            (this.state.cleanupTasks.length = 0),
            this.log("Component cleanup completed"))
        } catch (e) {
          console.error(`[${this.config.name}] Cleanup failed:`, e)
        }
      }
      generateCacheKey(...e) {
        return p.generateSystemKey(this.config.cacheConfig.prefix, ...e)
      }
      generateUserCacheKey(e) {
        return p.generateUserKey(this.config.cacheConfig.prefix, e)
      }
      generateContentCacheKey(e) {
        return p.generateContentKey(e)
      }
      setStorageItem(e, t) {
        if (!this.storageManager)
          throw new Error(`[${this.config.name}] StorageManager not available`)
        this.storageManager.setItem("local", e, t)
      }
      getStorageItem(e, t) {
        if (!this.storageManager)
          throw new Error(`[${this.config.name}] StorageManager not available`)
        let r = this.storageManager.getItem("local", e)
        return r !== null ? r : (t ?? null)
      }
      setCacheItem(e, t, r) {
        if (!this.cacheManager) throw new Error(`[${this.config.name}] CacheManager not available`)
        this.cacheManager.set(e, t, r ?? this.config.cacheConfig.ttl)
      }
      getCacheItem(e) {
        if (!this.cacheManager) throw new Error(`[${this.config.name}] CacheManager not available`)
        return this.cacheManager.get(e)
      }
      addCleanupTask(e) {
        this.state.cleanupTasks.push(e)
      }
      addEventListener(e, t, r, n) {
        this.resourceManager
          ? this.resourceManager.addEventListener(e, t, r, n)
          : (e.addEventListener(t, r, n),
            this.addCleanupTask(() => {
              e.removeEventListener(t, r, n)
            }))
      }
      log(e, ...t) {
        this.config.debug && console.log(`[${this.config.name}] ${e}`, ...t)
      }
      error(e, ...t) {
        console.error(`[${this.config.name}] ${e}`, ...t)
      }
      validateGlobalInstances() {
        if (!this.resourceManager)
          throw new Error(`[${this.config.name}] ResourceManager not available`)
        if (!this.storageManager)
          throw new Error(`[${this.config.name}] StorageManager not available`)
        if (!this.cacheManager) throw new Error(`[${this.config.name}] CacheManager not available`)
      }
    },
    z = class {
      static instances = new Map()
      static register(e, t) {
        this.instances.set(e, t)
      }
      static get(e) {
        return this.instances.get(e)
      }
      static async initialize(e) {
        let t = this.get(e)
        if (!t) throw new Error(`Component manager '${e}' not registered`)
        await t.initialize()
      }
      static async initializeAll() {
        let e = Array.from(this.instances.values()).map((t) =>
          t.initialize().catch((r) => {
            console.error("Component manager initialization failed:", r)
          }),
        )
        await Promise.all(e)
      }
      static getRegisteredComponents() {
        return Array.from(this.instances.keys())
      }
    }
  var sr = Object.hasOwnProperty
  var fe = ie(pe(), 1),
    Ke = (0, fe.default)()
  I()
  q()
  function me(a) {
    return a.document.body.dataset.slug
  }
  var W = class extends V {
    constructor(e = {}) {
      ;(super({
        name: "Mermaid",
        debug: !1,
        enableLazyLoad: !0,
        lazyLoadRootMargin: "100px",
        lazyLoadThreshold: 0.1,
        enablePreload: !0,
        preloadDelay: 3e3,
        enableBatchProcessing: !0,
        cacheConfig: { prefix: "mermaid", ttl: 18e5 },
        ...e,
      }),
        (this.state.currentSlug = null),
        (this.state.loadingStates = new Map()),
        (this.state.currentObserver = null),
        (this.state.mermaidModulePromise = null))
    }
    findComponentElements() {
      let e = document.querySelector(".center")
      return e ? Array.from(e.querySelectorAll("code.mermaid")) : []
    }
    async onInitialize() {
      ;((this.state.currentSlug = me(window)),
        this.log("Mermaid component initialized for slug:", this.state.currentSlug))
    }
    onSetupEventListeners() {
      this.log("Mermaid event listeners setup completed")
    }
    onSetupPage(e) {
      if (e.length === 0) {
        this.log("No Mermaid code blocks found")
        return
      }
      ;(this.cleanupObserver(),
        this.config.enableLazyLoad ? this.setupLazyLoading(e) : this.initializeMermaidElements(e),
        this.config.enablePreload && this.schedulePreload(),
        this.log(`Mermaid page setup completed: ${e.length} elements found`))
    }
    onCleanup() {
      ;(this.state.loadingStates.clear(),
        (this.state.currentSlug = null),
        (this.state.mermaidModulePromise = null),
        this.cleanupObserver(),
        this.log("Mermaid cleanup completed"))
    }
    setupLazyLoading(e) {
      ;((this.state.currentObserver = new IntersectionObserver(
        (t) => {
          if (this.config.enableBatchProcessing) {
            let r = []
            ;(t.forEach((n) => {
              if (n.isIntersecting) {
                let s = n.target
                ;(this.state.currentObserver?.unobserve(s), r.push(s))
              }
            }),
              r.length > 0 && this.initializeMermaidElements(r))
          } else
            t.forEach((r) => {
              if (r.isIntersecting) {
                let n = r.target
                ;(this.state.currentObserver?.unobserve(n), this.initializeMermaidElements([n]))
              }
            })
        },
        { rootMargin: this.config.lazyLoadRootMargin, threshold: this.config.lazyLoadThreshold },
      )),
        e.forEach((t) => {
          this.state.currentObserver?.observe(t)
        }),
        this.addCleanupTask(() => {
          this.cleanupObserver()
        }))
    }
    async initializeMermaidElements(e) {
      if (e.length === 0) return
      let t = e[0]
      if (!this.state.loadingStates.get(t)) {
        this.state.loadingStates.set(t, !0)
        try {
          let r = await this.preloadMermaidModule(),
            n = this.createNodeList(e),
            s = await r.initializeMermaid(n)
          ;(s?.cleanup && this.addCleanupTask(s.cleanup),
            this.log(`Mermaid initialized successfully for ${e.length} elements`))
        } catch (r) {
          ;(this.error("Failed to load mermaid module:", r), this.showErrorState(e))
        } finally {
          this.state.loadingStates.set(t, !1)
        }
      }
    }
    preloadMermaidModule() {
      return (
        this.state.mermaidModulePromise ||
          (this.state.mermaidModulePromise = Promise.resolve().then(() => (Me(), ye))),
        this.state.mermaidModulePromise
      )
    }
    schedulePreload() {
      "requestIdleCallback" in window
        ? requestIdleCallback(() => {
            this.preloadMermaidModule().catch(() => {})
          })
        : setTimeout(() => {
            this.preloadMermaidModule().catch(() => {})
          }, this.config.preloadDelay)
    }
    createNodeList(e) {
      return {
        ...e,
        item: (t) => e[t] || null,
        [Symbol.iterator]: function* () {
          for (let t of e) yield t
        },
        length: e.length,
      }
    }
    showErrorState(e) {
      e.forEach((t) => {
        let r = t.parentElement
        if (r) {
          let n = document.createElement("div")
          ;((n.className = "mermaid-error"),
            (n.innerHTML = `
          <p>Failed to load Mermaid diagram</p>
          <button onclick="location.reload()">Retry</button>
        `),
            r.appendChild(n))
        }
      })
    }
    cleanupObserver() {
      this.state.currentObserver &&
        (this.state.currentObserver.disconnect(), (this.state.currentObserver = null))
    }
  }
  var Xe = new W({
    name: "mermaid",
    debug: !1,
    enableLazyLoad: !0,
    lazyLoadRootMargin: "50px",
    enablePreload: !0,
    preloadDelay: 2e3,
  })
  z.register("mermaid", Xe)
  z.initialize("mermaid").catch((a) => {
    console.error("Mermaid component initialization failed:", a)
  })
})()
