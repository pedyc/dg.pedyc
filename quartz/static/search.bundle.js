"use strict"
;(() => {
  var kn = Object.create
  var bt = Object.defineProperty
  var Nn = Object.getOwnPropertyDescriptor
  var _n = Object.getOwnPropertyNames
  var zn = Object.getPrototypeOf,
    Un = Object.prototype.hasOwnProperty
  var b = (t, e) => () => (t && (e = t((t = 0))), e)
  var wt = (t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports)
  var Hn = (t, e, n, r) => {
    if ((e && typeof e == "object") || typeof e == "function")
      for (let i of _n(e))
        !Un.call(t, i) &&
          i !== n &&
          bt(t, i, { get: () => e[i], enumerable: !(r = Nn(e, i)) || r.enumerable })
    return t
  }
  var Rt = (t, e, n) => (
    (n = t != null ? kn(zn(t)) : {}),
    Hn(e || !t || !t.__esModule ? bt(n, "default", { value: t, enumerable: !0 }) : n, t)
  )
  var tt,
    nt,
    rt = b(() => {
      "use strict"
      ;((tt = class t {
        static instance = null
        CACHE_PREFIXES = { content: "content_", link: "link_", search: "search_" }
        constructor() {}
        static getInstance() {
          return (t.instance || (t.instance = new t()), t.instance)
        }
        processURL(e, n = {}) {
          let {
            removeHash: r = !0,
            normalizePath: i = !0,
            validate: s = !0,
            cacheType: o = "content",
          } = n
          try {
            if (s && !this.isValidURL(e))
              return {
                original: e,
                processed: new URL("about:blank"),
                cacheKey: "",
                isValid: !1,
                error: "Invalid URL format",
              }
            let l = e
            r && (l = l.split("#")[0])
            let a = new URL(l)
            i && (a.pathname = this.normalizePath(a.pathname))
            let u = this.generateCacheKey(a.toString(), o)
            return (
              console.debug(`[URLHandler Debug] Cache Key: ${u}`),
              { original: e, processed: a, cacheKey: u, isValid: !0 }
            )
          } catch (l) {
            return {
              original: e,
              processed: new URL("about:blank"),
              cacheKey: "",
              isValid: !1,
              error: l.message,
            }
          }
        }
        getContentURL(e) {
          let n = this.processURL(e, {
            removeHash: !0,
            normalizePath: !0,
            validate: !0,
            cacheType: "content",
          })
          if (!n.isValid) throw new Error(`Invalid URL: ${e} - ${n.error}`)
          return n.processed
        }
        getCacheKey(e, n = "content") {
          return this.processURL(e, { cacheType: n }).cacheKey
        }
        processBatch(e, n = {}) {
          return e.map((r) => this.processURL(r, n))
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
          let n = e.split("/").filter(Boolean),
            r = [],
            i = new Set()
          for (let o of n) i.has(o) || (i.add(o), r.push(o))
          return "/" + r.join("/")
        }
        generateCacheKey(e, n) {
          let r = encodeURIComponent(e)
          return `${this.CACHE_PREFIXES[n]}${r}`
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
            let n = new URL(e)
            return !(
              [".pdf", ".zip", ".rar", ".7z", ".tar", ".gz"].some((i) =>
                n.pathname.toLowerCase().endsWith(i),
              ) ||
              n.pathname.startsWith("/api/") ||
              n.pathname.startsWith("/admin/") ||
              (n.pathname === window.location.pathname && n.hash)
            )
          } catch {
            return !1
          }
        }
        isSamePage(e) {
          return e.origin === window.location.origin && e.pathname === window.location.pathname
        }
      }),
        (nt = tt.getInstance()))
    })
  var ee,
    L,
    br,
    wr,
    Rr,
    Ir,
    Or,
    Br,
    ue,
    It,
    kr,
    Nr,
    _r,
    ke = b(() => {
      "use strict"
      rt()
      te()
      ;((ee = (t) =>
        t
          ? t
              .toLowerCase()
              .replace(S.CONVENTIONS.FORBIDDEN_CHARS, "")
              .replace(/\s+/g, S.SEPARATOR)
              .replace(/_+/g, S.SEPARATOR)
              .replace(/^_|_$/g, "")
              .substring(0, S.CONVENTIONS.MAX_LENGTH)
          : ""),
        (L = {
          generateContentKey: (t, e) => {
            let n = nt.processURL(t, { cacheType: "content" })
            if (!n.isValid)
              return (
                console.warn(`Invalid URL for cache key generation: ${t}`),
                `${S.PREFIXES.CONTENT}invalid_${ee(t)}`
              )
            let r = n.cacheKey
            return e ? `${r}${S.SEPARATOR}${e}` : r
          },
          generateSearchKey: (t, e) => {
            let n = ee(t)
            return e ? `${S.PREFIXES.SEARCH}${n}${S.SEPARATOR}${ee(e)}` : `${S.PREFIXES.SEARCH}${n}`
          },
          generateUserKey: (t, e) => {
            let n = ee(t)
            return e ? `${S.PREFIXES.USER}${e}${S.SEPARATOR}${n}` : `${S.PREFIXES.USER}${n}`
          },
          generateFontKey: (t, e) => {
            let n = ee(t)
            return e ? `${S.PREFIXES.FONT}${n}${S.SEPARATOR}${e}` : `${S.PREFIXES.FONT}${n}`
          },
          generateSystemKey: (t, e) => {
            let n = ee(t)
            return e ? `${S.PREFIXES.SYSTEM}${n}${S.SEPARATOR}${ee(e)}` : `${S.PREFIXES.SYSTEM}${n}`
          },
          identifyType: (t) => {
            let e = Object.entries(S.PREFIXES)
            for (let [n, r] of e) if (t.startsWith(r)) return n
            return null
          },
          extractOriginalKey: (t) => {
            let e = Object.values(S.PREFIXES)
            for (let n of e) if (t.startsWith(n)) return t.substring(n.length)
            return t
          },
          generateStorageKey: (t, e) =>
            L.identifyType(t)
              ? t
              : `${{ MEMORY: S.PREFIXES.CONTENT, SESSION: S.PREFIXES.CONTENT }[e] || S.PREFIXES.CONTENT}${t}`,
          validateKeyFormat: (t) => {
            let e = [],
              n = []
            return (
              (!t || t.length === 0) &&
                (e.push("\u952E\u4E0D\u80FD\u4E3A\u7A7A"),
                n.push("\u63D0\u4F9B\u4E00\u4E2A\u975E\u7A7A\u7684\u952E")),
              t.length > S.CONVENTIONS.MAX_LENGTH &&
                (e.push(`\u952E\u8FC7\u957F: ${t.length} > ${S.CONVENTIONS.MAX_LENGTH}`),
                n.push("\u7F29\u77ED\u952E\u540D\u6216\u4F7F\u7528\u54C8\u5E0C\u503C")),
              S.CONVENTIONS.FORBIDDEN_CHARS.test(t) &&
                (e.push("\u952E\u5305\u542B\u7981\u7528\u5B57\u7B26"),
                n.push("\u79FB\u9664\u952E\u4E2D\u7684\u7279\u6B8A\u5B57\u7B26")),
              L.identifyType(t) ||
                (e.push("\u952E\u7F3A\u5C11\u5FC5\u9700\u7684\u524D\u7F00"),
                n.push("\u4E3A\u952E\u6DFB\u52A0\u9002\u5F53\u7684\u524D\u7F00")),
              { isValid: e.length === 0, issues: e, suggestions: n }
            )
          },
          parseKey: (t) => {
            let e = L.identifyType(t),
              n = Object.values(S.PREFIXES).find((s) => t.startsWith(s)) || null,
              r = L.extractOriginalKey(t),
              i = L.validateKeyFormat(t)
            return { original: r, type: e, prefix: n, isValid: i.isValid }
          },
        }),
        ({
          generateContentKey: br,
          generateSearchKey: wr,
          generateUserKey: Rr,
          generateFontKey: Ir,
          generateSystemKey: Or,
          identifyType: Br,
          extractOriginalKey: ue,
          generateStorageKey: It,
          validateKeyFormat: kr,
          parseKey: Nr,
        } = L),
        (_r = {
          identifyType: L.identifyType,
          extractOriginalKey: L.extractOriginalKey,
          generateStorageKey: L.generateStorageKey,
          validateKey: L.validateKeyFormat,
          parseKey: L.parseKey,
        }))
    })
  function ce(t) {
    return Bt[t] || Bt.DEFAULT
  }
  var S,
    Bt,
    Ne,
    _e,
    Hr,
    kt,
    Pr,
    W,
    te = b(() => {
      "use strict"
      ke()
      ;((S = {
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
        (Bt = {
          CONTENT: {
            capacity: 200,
            ttl: 15 * 60 * 1e3,
            maxMemoryMB: 30,
            warningThreshold: 160,
            description:
              "\u7EDF\u4E00\u5185\u5BB9\u7F13\u5B58\uFF0C\u652F\u6301\u9875\u9762\u548C\u5F39\u7A97\u5185\u5BB9",
            keyPrefix: S.PREFIXES.CONTENT,
            cleanupIntervalMs: 3 * 60 * 1e3,
            memoryThreshold: 0.85,
          },
          LINK: {
            capacity: 1e3,
            ttl: 60 * 60 * 1e3,
            maxMemoryMB: 15,
            warningThreshold: 800,
            description: "\u94FE\u63A5\u6709\u6548\u6027\u548C\u5931\u8D25\u94FE\u63A5\u7F13\u5B58",
            keyPrefix: S.PREFIXES.LINK,
            cleanupIntervalMs: 10 * 60 * 1e3,
            memoryThreshold: 0.8,
          },
          SEARCH: {
            capacity: 500,
            ttl: 60 * 60 * 1e3,
            maxMemoryMB: 50,
            warningThreshold: 400,
            description: "\u641C\u7D22\u7ED3\u679C\u548C\u5185\u5BB9\u9884\u89C8\u7F13\u5B58",
            keyPrefix: S.PREFIXES.SEARCH,
            cleanupIntervalMs: 5 * 60 * 1e3,
            memoryThreshold: 0.8,
          },
          USER: {
            capacity: 100,
            ttl: 24 * 60 * 60 * 1e3,
            maxMemoryMB: 5,
            warningThreshold: 80,
            description: "\u7528\u6237\u504F\u597D\u548C\u8BBE\u7F6E\u7F13\u5B58",
            keyPrefix: S.PREFIXES.USER,
            cleanupIntervalMs: 30 * 60 * 1e3,
            memoryThreshold: 0.9,
          },
          SYSTEM: {
            capacity: 200,
            ttl: 60 * 60 * 1e3,
            maxMemoryMB: 10,
            warningThreshold: 160,
            description: "\u7CFB\u7EDF\u7EC4\u4EF6\u548C\u914D\u7F6E\u7F13\u5B58",
            keyPrefix: S.PREFIXES.SYSTEM,
            cleanupIntervalMs: 15 * 60 * 1e3,
            memoryThreshold: 0.8,
          },
          DEFAULT: {
            capacity: 100,
            ttl: 10 * 60 * 1e3,
            maxMemoryMB: 5,
            warningThreshold: 80,
            description: "\u9ED8\u8BA4\u7F13\u5B58\u914D\u7F6E",
            keyPrefix: S.PREFIXES.SYSTEM,
            cleanupIntervalMs: 5 * 60 * 1e3,
            memoryThreshold: 0.8,
          },
        }),
        (Ne = {
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
        (_e = {
          LARGE_CONTENT_SIZE: 1024 * 1024,
          HUGE_CONTENT_SIZE: 5 * 1024 * 1024,
          MAX_MEMORY_USAGE: 50 * 1024 * 1024,
          MEMORY_CLEANUP_THRESHOLD: 0.8,
          SESSION_CLEANUP_THRESHOLD: 0.9,
          MAX_REFERENCE_COUNT: 1e3,
          HASH_COLLISION_THRESHOLD: 10,
        }),
        (Hr = {
          MAX_KEY_LENGTH: 256,
          FORBIDDEN_CHARS: /[\s<>:"/\\|?*]/,
          REQUIRED_PREFIX: !0,
          MIN_CONTENT_LENGTH: 1,
          MAX_CONTENT_LENGTH: 10 * 1024 * 1024,
          KEY_FORMAT_REGEX: /^[a-z0-9_-]+$/,
        }),
        (kt = {
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
      ;((Pr = {
        content: L.generateContentKey,
        search: L.generateSearchKey,
        font: L.generateFontKey,
        user: L.generateUserKey,
        system: L.generateSystemKey,
      }),
        (W = {
          ENABLE_MONITORING: !0,
          MONITOR_INTERVAL: 5 * 60 * 1e3,
          REPORT_INTERVAL: 30 * 60 * 1e3,
          CONSOLE_WARNINGS: !0,
          ENABLE_KEY_VALIDATION: !0,
        }))
    })
  var Ee,
    it,
    Fe,
    st = b(() => {
      "use strict"
      te()
      ;((Ee = class {
        constructor(e, n, r = null, i = null) {
          this.key = e
          this.value = n
          this.prev = r
          this.next = i
        }
      }),
        (it = class {
          constructor(e) {
            this.capacity = e
            ;((this.head = new Ee("__head__", {})),
              (this.tail = new Ee("__tail__", {})),
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
            let n = this.cache.get(e)
            return n ? (this.moveToHead(n), n.value) : null
          }
          set(e, n) {
            let r = this.cache.get(e)
            if (r) return ((r.value = n), this.moveToHead(r), null)
            let i = new Ee(e, n),
              s = null
            return (
              this.cache.size >= this.capacity &&
                ((s = this.removeTail()), s && this.cache.delete(s.key)),
              this.cache.set(e, i),
              this.addToHead(i),
              s
            )
          }
          delete(e) {
            let n = this.cache.get(e)
            return n ? (this.removeNode(n), this.cache.delete(e), n.value) : null
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
        (Fe = class {
          cache
          config
          currentMemoryUsage = 0
          totalHits = 0
          totalRequests = 0
          cleanupInterval = null
          constructor(e) {
            let n = Object.fromEntries(Object.entries(e).filter(([, i]) => i !== void 0)),
              r = ce("DEFAULT")
            ;((this.config = {
              capacity: r.capacity,
              ttl: r.ttl,
              maxMemoryMB: r.maxMemoryMB,
              warningThreshold: r.warningThreshold,
              description: r.description,
              keyPrefix: r.keyPrefix,
              cleanupIntervalMs: r.cleanupIntervalMs,
              memoryThreshold: r.memoryThreshold,
              ...n,
            }),
              (this.cache = new it(this.config.capacity)),
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
                if (Array.isArray(e)) return e.reduce((n, r) => n + this.estimateSize(r), 24)
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
          set(e, n, r = 30 * 60 * 1e3) {
            try {
              let i = this.estimateSize(n),
                s = this.config.maxMemoryMB * 1024 * 1024
              if (
                this.currentMemoryUsage + i > s &&
                (this.cleanup(), this.currentMemoryUsage + i > s)
              )
                return (
                  console.warn(
                    `\u7F13\u5B58\u5185\u5B58\u4E0D\u8DB3\uFF0C\u65E0\u6CD5\u6DFB\u52A0\u952E: ${e}\uFF0C\u9700\u8981 ${i} \u5B57\u8282`,
                  ),
                  !1
                )
              let o = { data: n, timestamp: Date.now(), ttl: r, size: i, accessCount: 0 },
                l = this.cache.set(e, o)
              if ((l && (this.currentMemoryUsage -= l.value.size), l))
                this.currentMemoryUsage -= l.value.size
              else {
                let a = this.cache.get(e)
                a && a !== o && (this.currentMemoryUsage -= a.size)
              }
              return ((this.currentMemoryUsage += i), !0)
            } catch (i) {
              return (
                console.error(`\u8BBE\u7F6E\u7F13\u5B58\u9879\u5931\u8D25\uFF0C\u952E: ${e}`, i),
                !1
              )
            }
          }
          get(e) {
            this.totalRequests++
            try {
              let n = this.cache.get(e)
              if (!n) return null
              if (Date.now() - n.timestamp > n.ttl) return (this.delete(e), null)
              let r = { ...n, accessCount: n.accessCount + 1 }
              return (this.cache.set(e, r), this.totalHits++, n.data)
            } catch (n) {
              return (
                console.error(`\u83B7\u53D6\u7F13\u5B58\u9879\u5931\u8D25\uFF0C\u952E: ${e}`, n),
                null
              )
            }
          }
          has(e) {
            try {
              let n = this.cache.get(e)
              return n ? (Date.now() - n.timestamp > n.ttl ? (this.delete(e), !1) : !0) : !1
            } catch (n) {
              return (
                console.error(`\u68C0\u67E5\u7F13\u5B58\u9879\u5931\u8D25\uFF0C\u952E: ${e}`, n),
                !1
              )
            }
          }
          delete(e) {
            try {
              let n = this.cache.delete(e)
              return n ? ((this.currentMemoryUsage -= n.size), !0) : !1
            } catch (n) {
              return (
                console.error(`\u5220\u9664\u7F13\u5B58\u9879\u5931\u8D25\uFF0C\u952E: ${e}`, n),
                !1
              )
            }
          }
          cleanup() {
            try {
              let e = Date.now(),
                n = this.config.maxMemoryMB * 1024 * 1024,
                r = n * this.config.memoryThreshold,
                i = 0,
                s = 0,
                o = []
              for (let l of this.cache.keys()) {
                let a = this.cache.get(l)
                a && e - a.timestamp > a.ttl && o.push(l)
              }
              for (let l of o) {
                let a = this.cache.delete(l)
                a && ((s += a.size), (this.currentMemoryUsage -= a.size), i++)
              }
              if (this.currentMemoryUsage > r) {
                let l = this.cache
                  .values()
                  .map((a, u) => ({
                    key: this.cache.keys()[u],
                    item: a,
                    priority: a.size / Math.max(a.accessCount, 1),
                  }))
                  .sort((a, u) => u.priority - a.priority)
                for (let { key: a } of l) {
                  if (this.currentMemoryUsage <= r) break
                  let u = this.cache.delete(a)
                  u && ((s += u.size), (this.currentMemoryUsage -= u.size), i++)
                }
              }
              i > 0 &&
                console.log(
                  `\u7F13\u5B58\u6E05\u7406\u5B8C\u6210\uFF1A\u79FB\u9664 ${i} \u9879\uFF0C\u91CA\u653E ${(s / 1024).toFixed(2)} KB \u5185\u5B58\uFF0C\u5F53\u524D\u4F7F\u7528\u7387: ${((this.currentMemoryUsage / n) * 100).toFixed(1)}%`,
                )
            } catch (e) {
              console.error("\u7F13\u5B58\u6E05\u7406\u5931\u8D25:", e)
            }
          }
          getStats() {
            let e = this.config.maxMemoryMB * 1024 * 1024,
              n = this.totalRequests > 0 ? this.totalHits / this.totalRequests : 0
            return {
              size: this.cache.size,
              memoryUsage: this.currentMemoryUsage,
              maxMemoryUsage: e,
              memoryUsagePercentage: this.currentMemoryUsage / e,
              hitRate: n,
              keys: this.cache.keys(),
            }
          }
          getConfig() {
            return { ...this.config }
          }
          getItemInfo(e) {
            try {
              let n = this.cache.get(e)
              if (!n) return null
              let r = Date.now() - n.timestamp > n.ttl
              return { ...n, isExpired: r }
            } catch (n) {
              return (
                console.error(
                  `\u83B7\u53D6\u7F13\u5B58\u9879\u4FE1\u606F\u5931\u8D25\uFF0C\u952E: ${e}`,
                  n,
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
  var ve,
    ot = b(() => {
      "use strict"
      ve = class {
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
        setTimeout(e, n) {
          let r = window.setTimeout(() => {
            ;(this.timers.delete(r), e())
          }, n)
          return this.registerTimer(r)
        }
        setInterval(e, n) {
          let r = window.setInterval(e, n)
          return this.registerTimer(r)
        }
        addEventListener(e, n, r, i) {
          this.eventListeners.some((o) => o.element === e && o.type === n && o.listener === r) ||
            (e.addEventListener(n, r, i),
            this.eventListeners.push({ element: e, type: n, listener: r, options: i }))
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
        removeEventListener(e, n, r, i) {
          e.removeEventListener(n, r, i)
          let s = this.eventListeners.findIndex(
            (o) => o.element === e && o.type === n && o.listener === r,
          )
          s !== -1 && this.eventListeners.splice(s, 1)
        }
        abortController(e) {
          this.abortControllers.has(e) && (e.abort(), this.abortControllers.delete(e))
        }
        getStats() {
          let e = {}
          this.observers.forEach((r) => {
            let i = r.constructor.name
            e[i] = (e[i] || 0) + 1
          })
          let n = {}
          return (
            this.eventListeners.forEach(({ type: r }) => {
              n[r] = (n[r] || 0) + 1
            }),
            {
              observers: this.observers.size,
              timers: this.timers.size,
              eventListeners: this.eventListeners.length,
              abortControllers: this.abortControllers.size,
              details: { observerTypes: e, eventTypes: n },
            }
          )
        }
        cleanupObserversAndListeners() {
          ;(this.observers.forEach((e) => {
            try {
              e.disconnect()
            } catch (n) {
              console.error("\u6E05\u7406\u89C2\u5BDF\u5668\u65F6\u51FA\u9519:", n)
            }
          }),
            this.observers.clear(),
            this.timers.forEach((e) => {
              try {
                ;(clearTimeout(e), clearInterval(e))
              } catch (n) {
                console.error("\u6E05\u7406\u5B9A\u65F6\u5668\u65F6\u51FA\u9519:", n)
              }
            }),
            this.timers.clear(),
            this.eventListeners.forEach(({ element: e, type: n, listener: r, options: i }) => {
              try {
                e.removeEventListener(n, r, i)
              } catch (s) {
                console.error("\u6E05\u7406\u4E8B\u4EF6\u76D1\u542C\u5668\u65F6\u51FA\u9519:", s)
              }
            }),
            (this.eventListeners.length = 0),
            this.abortControllers.forEach((e) => {
              try {
                e.abort()
              } catch (n) {
                console.error("\u6E05\u7406 AbortController \u65F6\u51FA\u9519:", n)
              }
            }),
            this.abortControllers.clear())
        }
        cleanupNonCriticalResources() {
          ;(this.observers.forEach((i) => {
            try {
              i.disconnect()
            } catch (s) {
              console.error("\u6E05\u7406\u89C2\u5BDF\u5668\u65F6\u51FA\u9519:", s)
            }
          }),
            this.observers.clear(),
            this.timers.forEach((i) => {
              try {
                ;(clearTimeout(i), clearInterval(i))
              } catch (s) {
                console.error("\u6E05\u7406\u5B9A\u65F6\u5668\u65F6\u51FA\u9519:", s)
              }
            }),
            this.timers.clear())
          let e = ["click", "popstate"],
            n = [window, document],
            r = []
          ;(this.eventListeners.forEach(({ element: i, type: s, listener: o, options: l }) => {
            if (e.includes(s) && n.some((a) => a === i))
              (r.push({ element: i, type: s, listener: o, options: l }),
                console.log(
                  `[SPA DEBUG] \u4FDD\u7559\u5173\u952E\u4E8B\u4EF6\u76D1\u542C\u5668: ${s} on ${i.constructor.name}`,
                ))
            else
              try {
                ;(i.removeEventListener(s, o, l),
                  console.log(
                    `[SPA DEBUG] \u6E05\u7406\u975E\u5173\u952E\u4E8B\u4EF6\u76D1\u542C\u5668: ${s} on ${i.constructor.name} (Tag: ${i instanceof HTMLElement ? i.tagName : "N/A"}, ID: ${i instanceof HTMLElement ? i.id : "N/A"}, Class: ${i instanceof HTMLElement ? i.className : "N/A"})`,
                  ))
              } catch (a) {
                console.error("\u6E05\u7406\u4E8B\u4EF6\u76D1\u542C\u5668\u65F6\u51FA\u9519:", a)
              }
          }),
            (this.eventListeners.length = 0),
            this.eventListeners.push(...r),
            this.abortControllers.forEach((i) => {
              try {
                i.abort()
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
              } catch (n) {
                console.error("\u6267\u884C\u6E05\u7406\u4EFB\u52A1\u65F6\u51FA\u9519:", n)
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
            eventListeners: this.eventListeners.map(({ element: e, type: n }) => ({
              element: e.constructor.name,
              type: n,
            })),
            abortControllers: this.abortControllers.size,
          }
        }
      }
    })
  var Se,
    at = b(() => {
      "use strict"
      te()
      Se = class t {
        static config = ce("DEFAULT")
        static DEFAULT_QUOTA = _e.MAX_MEMORY_USAGE
        static async checkStorageQuota(e) {
          try {
            if (navigator.storage?.estimate) {
              let r = await navigator.storage.estimate(),
                i = r.usage || 0,
                s = r.quota || this.DEFAULT_QUOTA
              return { used: i, total: s, percentage: s > 0 ? i / s : 0, available: s - i }
            }
          } catch (r) {
            console.warn("\u65E0\u6CD5\u83B7\u53D6\u5B58\u50A8\u914D\u989D\u4FE1\u606F:", r)
          }
          let n = this.calculateStorageSize(e)
          return {
            used: n,
            total: this.DEFAULT_QUOTA,
            percentage: n / this.DEFAULT_QUOTA,
            available: this.DEFAULT_QUOTA - n,
          }
        }
        static calculateStorageSize(e) {
          let n = 0
          try {
            for (let r = 0; r < e.length; r++) {
              let i = e.key(r)
              if (i) {
                let s = e.getItem(i)
                n += (i.length + (s?.length || 0)) * 2
              }
            }
          } catch (r) {
            console.warn("\u65E0\u6CD5\u4F30\u7B97\u5B58\u50A8\u5927\u5C0F:", r)
          }
          return n
        }
        static async safeSetItem(e, n, r) {
          return (await this.checkAndCleanupIfNeeded(e), this.attemptSetItem(e, n, r))
        }
        static async checkAndCleanupIfNeeded(e) {
          try {
            let n = await this.checkStorageQuota(e),
              r = this.config.memoryThreshold || 0.9
            n.percentage > r &&
              (W.CONSOLE_WARNINGS &&
                console.warn(
                  "\u5B58\u50A8\u914D\u989D\u5373\u5C06\u8017\u5C3D\uFF0C\u6267\u884C\u6E05\u7406...",
                ),
              this.cleanupStorage(e),
              (await this.checkStorageQuota(e)).percentage > r &&
                (W.CONSOLE_WARNINGS &&
                  console.warn(
                    "\u6E05\u7406\u540E\u914D\u989D\u4ECD\u7136\u4E0D\u8DB3\uFF0C\u6267\u884C\u7D27\u6025\u6E05\u7406...",
                  ),
                this.emergencyCleanup(e)))
          } catch (n) {
            W.CONSOLE_WARNINGS && console.warn("\u914D\u989D\u68C0\u67E5\u5931\u8D25:", n)
          }
        }
        static attemptSetItem(e, n, r) {
          try {
            return (e.setItem(n, r), !0)
          } catch (i) {
            return i instanceof DOMException && i.name === "QuotaExceededError"
              ? this.handleQuotaExceeded(e, n, r)
              : (console.error("\u8BBE\u7F6E\u5B58\u50A8\u9879\u5931\u8D25:", i), !1)
          }
        }
        static handleQuotaExceeded(e, n, r) {
          ;(console.warn(
            "\u5B58\u50A8\u914D\u989D\u8D85\u9650\uFF0C\u5C1D\u8BD5\u6E05\u7406\u540E\u91CD\u8BD5...",
          ),
            this.cleanupStorage(e))
          try {
            return (e.setItem(n, r), !0)
          } catch {
            ;(console.warn(
              "\u6E05\u7406\u540E\u91CD\u8BD5\u4ECD\u5931\u8D25\uFF0C\u6267\u884C\u7D27\u6025\u6E05\u7406...",
            ),
              this.emergencyCleanup(e))
            try {
              return (e.setItem(n, r), !0)
            } catch (s) {
              return (console.error("\u6700\u7EC8\u8BBE\u7F6E\u5931\u8D25:", s), !1)
            }
          }
        }
        static safeGetItem(e, n) {
          try {
            return e.getItem(n)
          } catch (r) {
            return (console.error("\u83B7\u53D6\u5B58\u50A8\u9879\u5931\u8D25:", r), null)
          }
        }
        static safeRemoveItem(e, n) {
          try {
            e.removeItem(n)
          } catch (r) {
            console.error("\u79FB\u9664\u5B58\u50A8\u9879\u5931\u8D25:", r)
          }
        }
        static cleanupStorage(e) {
          try {
            let n = this.findExpiredKeys(e)
            ;(this.removeKeys(e, n),
              W.CONSOLE_WARNINGS &&
                n.length > 0 &&
                console.log(`\u6E05\u7406\u4E86 ${n.length} \u4E2A\u8FC7\u671F\u9879\u76EE`))
          } catch (n) {
            W.CONSOLE_WARNINGS && console.error("\u6E05\u7406\u5B58\u50A8\u5931\u8D25:", n)
          }
        }
        static findExpiredKeys(e) {
          let n = [],
            r = Date.now()
          for (let i = 0; i < e.length; i++) {
            let s = e.key(i)
            if (!s || !Object.values(S.PREFIXES).some((a) => s.startsWith(a))) continue
            let l = e.getItem(s)
            l && this.isExpiredItem(l, r) && n.push(s)
          }
          return n
        }
        static isExpiredItem(e, n) {
          try {
            let r = JSON.parse(e)
            if (r && typeof r == "object" && r.timestamp) {
              let i = n - r.timestamp,
                s = (this.config.ttl || 24 * 60 * 60) * 1e3
              return i > s
            }
          } catch {
            let r = new Blob([e]).size,
              i = (this.config.maxMemoryMB || _e.LARGE_CONTENT_SIZE / 1024) * 1024
            return r > i
          }
          return !1
        }
        static removeKeys(e, n) {
          n.forEach((r) => {
            try {
              e.removeItem(r)
            } catch (i) {
              console.warn(`\u5220\u9664\u952E ${r} \u5931\u8D25:`, i)
            }
          })
        }
        static emergencyCleanup(e) {
          try {
            let n = [],
              r = this.config.keyPrefix || "sys_"
            for (let s = 0; s < e.length; s++) {
              let o = e.key(s)
              o && o.startsWith(r) && n.push(o)
            }
            let i = Math.ceil(n.length / 2)
            for (let s = 0; s < i; s++) e.removeItem(n[s])
            W.CONSOLE_WARNINGS &&
              console.warn(
                `\u7D27\u6025\u6E05\u7406\uFF1A\u79FB\u9664\u4E86 ${i} \u4E2A\u5B58\u50A8\u9879`,
              )
          } catch (n) {
            W.CONSOLE_WARNINGS && console.error("\u7D27\u6025\u6E05\u7406\u5931\u8D25:", n)
          }
        }
        async setSessionItem(e, n) {
          return t.safeSetItem(sessionStorage, e, n)
        }
        getSessionItem(e) {
          return t.safeGetItem(sessionStorage, e)
        }
        removeSessionItem(e) {
          t.safeRemoveItem(sessionStorage, e)
        }
        async setLocalItem(e, n) {
          return t.safeSetItem(localStorage, e, n)
        }
        getLocalItem(e) {
          return t.safeGetItem(localStorage, e)
        }
        removeLocalItem(e) {
          t.safeRemoveItem(localStorage, e)
        }
        async setItem(e, n, r) {
          return e === "local" ? this.setLocalItem(n, r) : this.setSessionItem(n, r)
        }
        getItem(e, n) {
          return e === "local" ? this.getLocalItem(n) : this.getSessionItem(n)
        }
        removeItem(e, n) {
          return e === "local" ? this.removeLocalItem(n) : this.removeSessionItem(n)
        }
        getStorageStats() {
          let e = (n) => {
            let r = 0,
              i = 0,
              s = t.config.keyPrefix || "sys_"
            for (let l = 0; l < n.length; l++) {
              let a = n.key(l)
              if (a && a.startsWith(s)) {
                let u = n.getItem(a)
                u && ((r += new Blob([a + u]).size), i++)
              }
            }
            let o = (t.config.capacity || _e.HUGE_CONTENT_SIZE / (1024 * 1024)) * 1024 * 1024
            return { used: r, available: Math.max(0, o - r), itemCount: i }
          }
          return { localStorage: e(localStorage), sessionStorage: e(sessionStorage) }
        }
        cleanupAllStorage() {
          let e = Date.now(),
            n = (t.config.cleanupIntervalMs || 60) * 60 * 1e3,
            r = parseInt(this.getItem("local", "last_cleanup") || "0")
          e - r < n ||
            (t.cleanupStorage(localStorage),
            t.cleanupStorage(sessionStorage),
            this.setItem("local", "last_cleanup", e.toString()),
            document.dispatchEvent(new CustomEvent("cacheCleared", { detail: {} })))
        }
        cleanup() {
          this.cleanupAllStorage()
        }
        getStats() {
          let e = this.getStorageStats(),
            n = {
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
          return Promise.resolve(n)
        }
      }
    })
  var Ae,
    lt = b(() => {
      "use strict"
      te()
      ke()
      Ae = class t {
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
        constructor(e, n) {
          ;(console.log("UnifiedContentCacheManager constructor"),
            (this.memoryCache = e),
            (this.storageManager = n),
            t._initialized ||
              (console.log(
                "[UnifiedCache] Initializing UnifiedContentCacheManager from sessionStorage...",
              ),
              this.initializeFromStorage(),
              (t._initialized = !0)))
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
              n = (r, i, s) => {
                if (!r) {
                  console.warn(
                    `[UnifiedCache] ${s}Storage \u4E0D\u53EF\u7528\uFF0C\u8DF3\u8FC7\u521D\u59CB\u5316\u3002`,
                  )
                  return
                }
                for (let o = 0; o < r.length; o++) {
                  let l = r.key(o)
                  if (!l || !L.identifyType(l)) continue
                  let u = r.getItem(l)
                  if (!u) continue
                  let c = ue(l)
                  if (!c || this.referenceMap.has(c)) continue
                  let h = {
                    storageLayer: i,
                    storageKey: l,
                    refCount: 0,
                    lastAccessed: Date.now(),
                    size: this.calculateSize(u),
                  }
                  this.referenceMap.set(c, h)
                  let g = this.calculateHash(u)
                  ;(this.contentHashMap.has(g) || this.contentHashMap.set(g, c), e[i]++)
                }
              }
            ;(n(window.sessionStorage, "SESSION", "session"),
              n(window.localStorage, "LOCAL", "local"),
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
          let n = ue(e),
            r = this.referenceMap.get(n)
          if (!r) {
            if (
              (console.log(
                `[UnifiedCache] Cache miss for key: ${e}, originalKey: ${n}. referenceMap size: ${this.referenceMap.size}`,
              ),
              this.referenceMap.size > 0)
            ) {
              let i = Array.from(this.referenceMap.keys())
              console.debug("[UnifiedCache] Available keys in referenceMap:", i)
            }
            if (
              this.referenceMap.size === 0 &&
              typeof window < "u" &&
              window.sessionStorage &&
              window.sessionStorage.length > 0
            ) {
              this.forceReinitializeFromStorage()
              let i = this.referenceMap.get(n)
              if (i) return this.getContentFromReference(n, i)
            }
            return null
          }
          return this.getContentFromReference(n, r)
        }
        getContentFromReference(e, n) {
          ;((n.lastAccessed = Date.now()), n.refCount++)
          let r = null
          switch (n.storageLayer) {
            case "MEMORY":
              ;((r = this.memoryCache.get(n.storageKey) || null), r && this.stats.memoryHits++)
              break
            case "SESSION":
              ;((r = this.storageManager.getSessionItem(n.storageKey)),
                r && this.stats.sessionHits++)
              break
            case "LOCAL":
              ;((r = this.storageManager.getLocalItem(n.storageKey)), r && this.stats.localHits++)
              break
          }
          return (r || this.referenceMap.delete(e), r)
        }
        forceReinitializeFromStorage() {
          ;(this.referenceMap.clear(), this.contentHashMap.clear(), this.initializeFromStorage())
        }
        set(e, n, r = void 0) {
          let i = ue(e),
            s = this.calculateHash(n),
            o = this.contentHashMap.get(s)
          if (o && this.referenceMap.has(o)) {
            let c = this.referenceMap.get(o)
            ;(this.referenceMap.set(i, {
              storageLayer: c.storageLayer,
              storageKey: c.storageKey,
              refCount: 1,
              lastAccessed: Date.now(),
              size: c.size,
            }),
              this.stats.duplicatesAvoided++,
              console.log(`[UnifiedCache] Avoided duplicate storage for ${i}, referencing ${o}`))
            return
          }
          let l = this.selectOptimalLayer(n, r),
            a = It(e, l)
          if (this.storeContent(a, n, l)) {
            let c = {
              storageLayer: l,
              storageKey: a,
              refCount: 1,
              lastAccessed: Date.now(),
              size: this.calculateSize(n),
            }
            ;(this.referenceMap.set(i, c), this.contentHashMap.set(s, i))
          }
        }
        delete(e) {
          let n = ue(e),
            r = this.referenceMap.get(n)
          if (!r) return !1
          if ((r.refCount--, r.refCount <= 0)) {
            this.deleteFromStorage(r.storageKey, r.storageLayer)
            for (let [i, s] of this.contentHashMap.entries())
              if (s === n) {
                this.contentHashMap.delete(i)
                break
              }
          }
          return (this.referenceMap.delete(n), !0)
        }
        has(e) {
          let n = ue(e)
          return this.referenceMap.has(n)
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
            n = [],
            r = kt.MEMORY_CHECK_INTERVAL
          for (let [i, s] of this.referenceMap.entries()) e - s.lastAccessed > r && n.push(i)
          ;(n.forEach((i) => this.delete(i)),
            n.length > 0 &&
              console.log(`[UnifiedCache] Cleaned up ${n.length} expired cache entries`))
        }
        selectOptimalLayer(e, n) {
          let r = this.calculateSize(e),
            i = Ne.MEMORY,
            s = Ne.SESSION,
            o = Ne.LOCAL,
            l = [n, "MEMORY", "SESSION", "LOCAL"].filter(Boolean),
            a = [...new Set(l)]
          for (let u of a)
            switch (u) {
              case "MEMORY":
                if (r < i.maxSizeKB * 1024) return "MEMORY"
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
        storeContent(e, n, r) {
          try {
            switch (r) {
              case "MEMORY":
                return (this.memoryCache.set(e, n), !0)
              case "SESSION":
                return (this.storageManager.setSessionItem(e, n), !0)
              case "LOCAL":
                return (this.storageManager.setLocalItem(e, n), !0)
              default:
                return !1
            }
          } catch (i) {
            return (console.warn(`[UnifiedCache] Failed to store content in ${r}:`, i), !1)
          }
        }
        deleteFromStorage(e, n) {
          try {
            switch (n) {
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
            console.warn(`[UnifiedCache] Failed to delete from ${n}:`, r)
          }
        }
        calculateHash(e) {
          let n = 0
          for (let r = 0; r < e.length; r++) {
            let i = e.charCodeAt(r)
            ;((n = (n << 5) - n + i), (n = n & n))
          }
          return n.toString(36)
        }
        calculateSize(e) {
          return new Blob([e]).size
        }
        calculateTotalMemoryUsage() {
          let e = 0
          for (let n of this.referenceMap.values()) e += n.size
          return e
        }
        validateCacheKey(e) {
          let n = [],
            r = [],
            i = this.referenceMap.get(e)
          if (!i)
            return (
              n.push(`No reference found for key: ${e}`),
              r.push("Check if the key was properly stored"),
              { isValid: !1, issues: n, suggestions: r }
            )
          let s = !1
          switch (i.storageLayer) {
            case "MEMORY":
              s = this.memoryCache.has(i.storageKey)
              break
            case "SESSION":
              s = this.storageManager.getSessionItem(i.storageKey) !== null
              break
            case "LOCAL":
              s = this.storageManager.getLocalItem(i.storageKey) !== null
              break
          }
          return (
            s ||
              (n.push(`Content not found in ${i.storageLayer} layer with key: ${i.storageKey}`),
              r.push("The reference exists but the actual content is missing")),
            { isValid: s, issues: n, suggestions: r }
          )
        }
        repairCacheReference(e) {
          if (this.validateCacheKey(e).isValid) return !0
          this.referenceMap.delete(e)
          for (let [r, i] of this.contentHashMap.entries())
            if (i === e) {
              this.contentHashMap.delete(r)
              break
            }
          return !1
        }
        getCacheDiagnostics(e) {
          let n = this.referenceMap.get(e),
            r = this.validateCacheKey(e),
            i = {
              memory: this.memoryCache.has(e),
              session: this.storageManager.getSessionItem(e) !== null,
              local: this.storageManager.getLocalItem(e) !== null,
            }
          return {
            key: e,
            reference: n,
            validation: r,
            storageLayerInfo: i,
            availableKeys: Array.from(this.referenceMap.keys()),
          }
        }
        static resetSingleton() {
          t._initialized = !1
        }
      }
    })
  var Me,
    ut = b(() => {
      "use strict"
      Me = class {
        managers = new Map()
        register(e, n) {
          this.managers.set(e, n)
        }
        unregister(e) {
          this.managers.delete(e)
        }
        cleanup() {
          this.managers.forEach((e, n) => {
            try {
              e.cleanup()
            } catch (r) {
              console.error(`Error during cleanup of ${n}:`, r)
            }
          })
        }
        getAllStats() {
          let e = {}
          return (
            this.managers.forEach((n, r) => {
              n.getStats && (e[r] = n.getStats())
            }),
            e
          )
        }
        clear() {
          this.managers.clear()
        }
      }
    })
  var ct,
    ne,
    ge,
    fe,
    re,
    ze = b(() => {
      "use strict"
      ht()
      Ue()
      ;((ct = class {
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
              ((this._unifiedContentCache = N.createUnifiedContentCacheManager(
                he.globalUnifiedContentCache,
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
              ((this._urlCacheManager = N.createCacheManager(he.urlCacheManager)),
              console.log("[GlobalManagers] Initialized UrlCacheManager")),
            this._urlCacheManager
          )
        }
        get failedLinksManager() {
          return (
            this._failedLinksManager ||
              ((this._failedLinksManager = N.createCacheManager(he.failedLinksManager)),
              console.log("[GlobalManagers] Initialized FailedLinksManager")),
            this._failedLinksManager
          )
        }
        get storageManager() {
          return (
            this._storageManager ||
              ((this._storageManager = N.createStorageManager(he.globalStorageManager)),
              console.log("[GlobalManagers] Initialized StorageManager")),
            this._storageManager
          )
        }
        get resourceManager() {
          return (
            this._resourceManager ||
              ((this._resourceManager = N.createResourceManager(he.globalResourceManager)),
              console.log("[GlobalManagers] Initialized ResourceManager")),
            this._resourceManager
          )
        }
        get cleanupManager() {
          return (
            this._cleanupManager ||
              ((this._cleanupManager = N.getCleanupManager()),
              console.log("[GlobalManagers] Initialized CleanupManager")),
            this._cleanupManager
          )
        }
        createCache(e) {
          return N.createCacheManager({ type: "CACHE", identifier: e, config: { cacheType: e } })
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
            N.cleanup(),
            console.log("[GlobalManagers] All global manager instances cleaned up"))
        }
        destroy() {
          ;(console.log("[GlobalManagers] Destroying all global manager instances..."),
            N.destroy(),
            (this._initialized = !1),
            Object.keys(this).forEach((e) => {
              e.startsWith("_") && (this[e] = null)
            }),
            (this._initialized = !1),
            console.log("[GlobalManagers] All global manager instances destroyed"))
        }
      }),
        (ne = class {
          static _instance = new ct()
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
          static getInstance(e, n) {
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
        (ge = {
          get instance() {
            return ne.instance.storageManager
          },
        }),
        (fe = {
          get instance() {
            return ne.instance.resourceManager
          },
        }),
        (re = {
          get instance() {
            return ne.instance.defaultCache
          },
        }))
    })
  var Ue = b(() => {
    "use strict"
    ze()
    pe()
  })
  var N,
    he,
    ht = b(() => {
      "use strict"
      st()
      ot()
      at()
      lt()
      ut()
      Ue()
      te()
      ze()
      ;((N = class {
        static instances = new Map()
        static cleanupManager = null
        static _createAndRegisterManager(e, n, r) {
          let i = `${e.type}_${e.identifier || "default"}`
          if (this.instances.has(i)) return this.instances.get(i)
          let s = n()
          return (
            this.instances.set(i, s),
            this.getCleanupManager().register(i, s),
            console.log(`[ManagerFactory] Created ${r}: ${i}`),
            s
          )
        }
        static createCacheManager(e) {
          return this._createAndRegisterManager(
            e,
            () => {
              let n = e.config?.cacheType || "DEFAULT",
                i = {
                  ...ce(n),
                  ...(e.config?.configOverride || {}),
                  enableMemoryLayer: e.config?.enableMemoryLayer ?? !0,
                  enableSessionLayer: e.config?.enableSessionLayer ?? !1,
                }
              return new Fe(i)
            },
            "CacheManager",
          )
        }
        static createResourceManager(e) {
          return this._createAndRegisterManager(e, () => new ve(), "ResourceManager")
        }
        static createStorageManager(e) {
          return this._createAndRegisterManager(e, () => new Se(), "StorageManager")
        }
        static createUnifiedContentCacheManager(e) {
          return this._createAndRegisterManager(
            e,
            () => {
              let n = re.instance,
                r = ge.instance
              return new Ae(n, r)
            },
            "UnifiedContentCacheManager",
          )
        }
        static getCleanupManager() {
          return (
            this.cleanupManager ||
              ((this.cleanupManager = new Me()),
              console.log("[ManagerFactory] Created CleanupManager singleton")),
            this.cleanupManager
          )
        }
        static cleanup() {
          ;(console.log("[ManagerFactory] Cleaning up all registered manager instances..."),
            this.instances.forEach((e, n) => {
              if (e && typeof e.cleanup == "function")
                try {
                  ;(e.cleanup(), console.log(`[ManagerFactory] Cleaned up instance: ${n}`))
                } catch (r) {
                  console.error(`[ManagerFactory] Error cleaning up instance ${n}:`, r)
                }
            }),
            console.log("[ManagerFactory] All registered manager instances cleaned up."))
        }
        static destroy() {
          ;(console.log("[ManagerFactory] Destroying all registered manager instances..."),
            this.instances.forEach((e, n) => {
              if (e && typeof e.destroy == "function")
                try {
                  ;(e.destroy(), console.log(`[ManagerFactory] Destroyed instance: ${n}`))
                } catch (r) {
                  console.error(`[ManagerFactory] Error destroying instance ${n}:`, r)
                }
              else if (e && typeof e.cleanup == "function")
                try {
                  ;(e.cleanup(),
                    console.log(`[ManagerFactory] Cleaned up (as destroy) instance: ${n}`))
                } catch (r) {
                  console.error(`[ManagerFactory] Error cleaning up (as destroy) instance ${n}:`, r)
                }
            }),
            this.instances.clear(),
            (this.cleanupManager = null),
            console.log(
              "[ManagerFactory] All registered manager instances destroyed and registry cleared.",
            ))
        }
        static getInstance(e, n = "default") {
          let r = `${e}_${n}`
          return this.instances.get(r) || null
        }
        static hasInstance(e, n = "default") {
          let r = `${e}_${n}`
          return this.instances.has(r)
        }
        static removeInstance(e, n = "default") {
          let r = `${e}_${n}`
          if (this.instances.has(r)) {
            let i = this.instances.get(r)
            if (
              (this.cleanupManager && this.cleanupManager.unregister(r),
              i && typeof i.cleanup == "function")
            )
              try {
                i.cleanup()
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
          for (let n of this.instances.keys()) {
            let r = n.split("_")[0]
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
        (he = {
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
  var pe = b(() => {
    "use strict"
    st()
    ot()
    at()
    lt()
    ut()
    ht()
    ze()
  })
  var zt = b(() => {
    "use strict"
    te()
    ke()
    Ue()
    pe()
  })
  var He,
    Pe,
    gt = b(() => {
      "use strict"
      pe()
      zt()
      ;((He = class {
        config
        state
        resourceManager = fe.instance
        storageManager = ge.instance
        cacheManager = re.instance
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
              e.forEach((n) => this.state.elements.add(n)),
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
                } catch (n) {
                  console.error(`[${this.config.name}] Cleanup task failed:`, n)
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
          return L.generateSystemKey(this.config.cacheConfig.prefix, ...e)
        }
        generateUserCacheKey(e) {
          return L.generateUserKey(this.config.cacheConfig.prefix, e)
        }
        generateContentCacheKey(e) {
          return L.generateContentKey(e)
        }
        setStorageItem(e, n) {
          if (!this.storageManager)
            throw new Error(`[${this.config.name}] StorageManager not available`)
          this.storageManager.setItem("local", e, n)
        }
        getStorageItem(e, n) {
          if (!this.storageManager)
            throw new Error(`[${this.config.name}] StorageManager not available`)
          let r = this.storageManager.getItem("local", e)
          return r !== null ? r : (n ?? null)
        }
        setCacheItem(e, n, r) {
          if (!this.cacheManager)
            throw new Error(`[${this.config.name}] CacheManager not available`)
          this.cacheManager.set(e, n, r ?? this.config.cacheConfig.ttl)
        }
        getCacheItem(e) {
          if (!this.cacheManager)
            throw new Error(`[${this.config.name}] CacheManager not available`)
          return this.cacheManager.get(e)
        }
        addCleanupTask(e) {
          this.state.cleanupTasks.push(e)
        }
        addEventListener(e, n, r, i) {
          this.resourceManager
            ? this.resourceManager.addEventListener(e, n, r, i)
            : (e.addEventListener(n, r, i),
              this.addCleanupTask(() => {
                e.removeEventListener(n, r, i)
              }))
        }
        log(e, ...n) {
          this.config.debug && console.log(`[${this.config.name}] ${e}`, ...n)
        }
        error(e, ...n) {
          console.error(`[${this.config.name}] ${e}`, ...n)
        }
        validateGlobalInstances() {
          if (!this.resourceManager)
            throw new Error(`[${this.config.name}] ResourceManager not available`)
          if (!this.storageManager)
            throw new Error(`[${this.config.name}] StorageManager not available`)
          if (!this.cacheManager)
            throw new Error(`[${this.config.name}] CacheManager not available`)
        }
      }),
        (Pe = class {
          static instances = new Map()
          static register(e, n) {
            ;(this.instances.set(e, n), console.log(`Component manager '${e}' registered`))
          }
          static get(e) {
            return this.instances.get(e)
          }
          static async initialize(e) {
            let n = this.get(e)
            if (!n) throw new Error(`Component manager '${e}' not registered`)
            await n.initialize()
          }
          static async initializeAll() {
            let e = Array.from(this.instances.values()).map((n) =>
              n.initialize().catch((r) => {
                console.error("Component manager initialization failed:", r)
              }),
            )
            await Promise.all(e)
          }
          static getRegisteredComponents() {
            return Array.from(this.instances.keys())
          }
        }))
    })
  var Ut = b(() => {})
  var Ni,
    Ht = b(() => {
      Ut()
      Ni = Object.hasOwnProperty
    })
  var Kt = wt((zi, Pt) => {
    "use strict"
    Pt.exports = Xn
    function de(t) {
      return t instanceof Buffer
        ? Buffer.from(t)
        : new t.constructor(t.buffer.slice(), t.byteOffset, t.length)
    }
    function Xn(t) {
      if (((t = t || {}), t.circles)) return Yn(t)
      let e = new Map()
      if (
        (e.set(Date, (o) => new Date(o)),
        e.set(Map, (o, l) => new Map(r(Array.from(o), l))),
        e.set(Set, (o, l) => new Set(r(Array.from(o), l))),
        t.constructorHandlers)
      )
        for (let o of t.constructorHandlers) e.set(o[0], o[1])
      let n = null
      return t.proto ? s : i
      function r(o, l) {
        let a = Object.keys(o),
          u = new Array(a.length)
        for (let c = 0; c < a.length; c++) {
          let h = a[c],
            g = o[h]
          typeof g != "object" || g === null
            ? (u[h] = g)
            : g.constructor !== Object && (n = e.get(g.constructor))
              ? (u[h] = n(g, l))
              : ArrayBuffer.isView(g)
                ? (u[h] = de(g))
                : (u[h] = l(g))
        }
        return u
      }
      function i(o) {
        if (typeof o != "object" || o === null) return o
        if (Array.isArray(o)) return r(o, i)
        if (o.constructor !== Object && (n = e.get(o.constructor))) return n(o, i)
        let l = {}
        for (let a in o) {
          if (Object.hasOwnProperty.call(o, a) === !1) continue
          let u = o[a]
          typeof u != "object" || u === null
            ? (l[a] = u)
            : u.constructor !== Object && (n = e.get(u.constructor))
              ? (l[a] = n(u, i))
              : ArrayBuffer.isView(u)
                ? (l[a] = de(u))
                : (l[a] = i(u))
        }
        return l
      }
      function s(o) {
        if (typeof o != "object" || o === null) return o
        if (Array.isArray(o)) return r(o, s)
        if (o.constructor !== Object && (n = e.get(o.constructor))) return n(o, s)
        let l = {}
        for (let a in o) {
          let u = o[a]
          typeof u != "object" || u === null
            ? (l[a] = u)
            : u.constructor !== Object && (n = e.get(u.constructor))
              ? (l[a] = n(u, s))
              : ArrayBuffer.isView(u)
                ? (l[a] = de(u))
                : (l[a] = s(u))
        }
        return l
      }
    }
    function Yn(t) {
      let e = [],
        n = [],
        r = new Map()
      if (
        (r.set(Date, (a) => new Date(a)),
        r.set(Map, (a, u) => new Map(s(Array.from(a), u))),
        r.set(Set, (a, u) => new Set(s(Array.from(a), u))),
        t.constructorHandlers)
      )
        for (let a of t.constructorHandlers) r.set(a[0], a[1])
      let i = null
      return t.proto ? l : o
      function s(a, u) {
        let c = Object.keys(a),
          h = new Array(c.length)
        for (let g = 0; g < c.length; g++) {
          let p = c[g],
            f = a[p]
          if (typeof f != "object" || f === null) h[p] = f
          else if (f.constructor !== Object && (i = r.get(f.constructor))) h[p] = i(f, u)
          else if (ArrayBuffer.isView(f)) h[p] = de(f)
          else {
            let d = e.indexOf(f)
            d !== -1 ? (h[p] = n[d]) : (h[p] = u(f))
          }
        }
        return h
      }
      function o(a) {
        if (typeof a != "object" || a === null) return a
        if (Array.isArray(a)) return s(a, o)
        if (a.constructor !== Object && (i = r.get(a.constructor))) return i(a, o)
        let u = {}
        ;(e.push(a), n.push(u))
        for (let c in a) {
          if (Object.hasOwnProperty.call(a, c) === !1) continue
          let h = a[c]
          if (typeof h != "object" || h === null) u[c] = h
          else if (h.constructor !== Object && (i = r.get(h.constructor))) u[c] = i(h, o)
          else if (ArrayBuffer.isView(h)) u[c] = de(h)
          else {
            let g = e.indexOf(h)
            g !== -1 ? (u[c] = n[g]) : (u[c] = o(h))
          }
        }
        return (e.pop(), n.pop(), u)
      }
      function l(a) {
        if (typeof a != "object" || a === null) return a
        if (Array.isArray(a)) return s(a, l)
        if (a.constructor !== Object && (i = r.get(a.constructor))) return i(a, l)
        let u = {}
        ;(e.push(a), n.push(u))
        for (let c in a) {
          let h = a[c]
          if (typeof h != "object" || h === null) u[c] = h
          else if (h.constructor !== Object && (i = r.get(h.constructor))) u[c] = i(h, l)
          else if (ArrayBuffer.isView(h)) u[c] = de(h)
          else {
            let g = e.indexOf(h)
            g !== -1 ? (u[c] = n[g]) : (u[c] = l(h))
          }
        }
        return (e.pop(), n.pop(), u)
      }
    }
  })
  var $t,
    qn,
    jt = b(() => {
      "use strict"
      ;(($t = Rt(Kt(), 1)), (qn = (0, $t.default)()))
    })
  function Qn(t) {
    try {
      let e,
        n = "",
        r = ""
      if (t.startsWith("http") || t.startsWith("/"))
        if (t.startsWith("http"))
          try {
            let u = new URL(t)
            ;((e = u.pathname), (n = u.search), (r = u.hash))
          } catch (u) {
            return (console.warn(`Failed to parse URL in removeDuplicatePathSegments: ${t}`, u), t)
          }
        else {
          let u = t.split("#"),
            c = u[0]
          r = u[1] ? "#" + u[1] : ""
          let h = c.indexOf("?")
          h !== -1 ? ((e = c.substring(0, h)), (n = c.substring(h))) : (e = c)
        }
      else e = t
      let i = e.split("/").filter((u) => u.length > 0),
        s = [],
        o = new Set()
      for (let u of i) {
        let c = s.length > 0 && s[s.length - 1] === u,
          h = o.has(u)
        !c && !h && (s.push(u), o.add(u))
      }
      return (s.length > 0 ? "/" + s.join("/") : "/") + n + r
    } catch (e) {
      return (console.warn("Failed to clean duplicate path segments:", e), t)
    }
  }
  function ft(t) {
    return t.document.body.dataset.slug
  }
  function Jn(t) {
    let e = Xt(nr(t, "index"), !0)
    return e.length === 0 ? "/" : e
  }
  function Wt(t, e) {
    let n = "data-urls-normalized"
    ;(t instanceof Element && t.hasAttribute(n)) ||
      (t instanceof Document && t.documentElement?.hasAttribute(n)) ||
      (t
        .querySelectorAll('[href=""], [href^="./"], [href^="../"]')
        .forEach((r) => Gt(r, "href", e)),
      t.querySelectorAll('[src=""], [src^="./"], [src^="../"]').forEach((r) => Gt(r, "src", e)),
      t instanceof Element
        ? t.setAttribute(n, "true")
        : t instanceof Document && t.documentElement && t.documentElement.setAttribute(n, "true"))
  }
  function Zn(t) {
    let e = t
      .split("/")
      .filter((n) => n !== "")
      .slice(0, -1)
      .map((n) => "..")
      .join("/")
    return (e.length === 0 && (e = "."), e)
  }
  function Vt(t, e) {
    return er(Zn(t), Jn(e))
  }
  function er(...t) {
    if (t.length === 0) return ""
    let e = t
      .filter((n) => n !== "" && n !== "/")
      .map((n) => Xt(n))
      .join("/")
    return (
      t[0].startsWith("/") && (e = "/" + e),
      t[t.length - 1].endsWith("/") && (e = e + "/"),
      e
    )
  }
  function tr(t, e) {
    return t === e || t.endsWith("/" + e)
  }
  function nr(t, e) {
    return (tr(t, e) && (t = t.slice(0, -e.length)), t)
  }
  function Xt(t, e) {
    return (
      t.startsWith("/") && (t = t.substring(1)),
      !e && t.endsWith("/") && (t = t.slice(0, -1)),
      t
    )
  }
  var Gt,
    pt = b(() => {
      "use strict"
      Ht()
      jt()
      pe()
      rt()
      Gt = (t, e, n) => {
        let r = t.getAttribute(e)
        if (r)
          try {
            let i = new URL(r, n),
              s = i.pathname
            ;((s = Qn(s)), t.setAttribute(e, s + (i.hash || "")))
          } catch (i) {
            console.warn(`Failed to rebase ${e} for element:`, i)
          }
      }
    })
  function Ke(t, e) {
    if (!t) return
    function n(i) {
      i.target === this && (i.preventDefault(), i.stopPropagation(), e())
    }
    function r(i) {
      i.key.startsWith("Esc") && (i.preventDefault(), e())
    }
    ;(t?.addEventListener("click", n),
      fe.instance.addCleanupTask(() => t?.removeEventListener("click", n)),
      document.addEventListener("keydown", r),
      fe.instance.addCleanupTask(() => document.removeEventListener("keydown", r)))
  }
  function xe(t) {
    for (; t.firstChild; ) t.removeChild(t.firstChild)
  }
  var dt = b(() => {
    "use strict"
    pe()
  })
  var mt = wt(() => {})
  function O(t, e, n) {
    let r = typeof n,
      i = typeof t
    if (r !== "undefined") {
      if (i !== "undefined") {
        if (n) {
          if (i === "function" && r === i)
            return function (l) {
              return t(n(l))
            }
          if (((e = t.constructor), e === n.constructor)) {
            if (e === Array) return n.concat(t)
            if (e === Map) {
              var s = new Map(n)
              for (var o of t) s.set(o[0], o[1])
              return s
            }
            if (e === Set) {
              o = new Set(n)
              for (s of t.values()) o.add(s)
              return o
            }
          }
        }
        return t
      }
      return n
    }
    return i === "undefined" ? e : t
  }
  function R() {
    return Object.create(null)
  }
  function H(t) {
    return typeof t == "string"
  }
  function we(t) {
    return typeof t == "object"
  }
  function rr(t) {
    let e = []
    for (let n of t.keys()) e.push(n)
    return e
  }
  function Re(t, e) {
    if (H(e)) t = t[e]
    else for (let n = 0; t && n < e.length; n++) t = t[e[n]]
    return t
  }
  function ir(t) {
    let e = 0
    for (let n = 0, r; n < t.length; n++) (r = t[n]) && e < r.length && (e = r.length)
    return e
  }
  function De(t = {}) {
    if (!this || this.constructor !== De) return new De(...arguments)
    if (arguments.length) for (t = 0; t < arguments.length; t++) this.assign(arguments[t])
    else this.assign(t)
  }
  function se(t) {
    ;((t.H = null), t.B.clear(), t.G.clear())
  }
  async function ur(t) {
    t = t.data
    var e = t.task
    let n = t.id,
      r = t.args
    switch (e) {
      case "init":
        ;((Le = t.options || {}),
          (e = t.factory)
            ? (Function("return " + e)()(self),
              (me = new self.FlexSearch.Index(Le)),
              delete self.FlexSearch)
            : (me = new K(Le)),
          postMessage({ id: n }))
        break
      default:
        let i
        ;(e === "export" && (r[1] ? ((r[0] = Le.export), (r[2] = 0), (r[3] = 1)) : (r = null)),
          e === "import"
            ? r[0] && ((t = await Le.import.call(me, r[0])), me.import(r[0], t))
            : (i = r && me[e].apply(me, r)) && i.then && (i = await i),
          postMessage(e === "search" ? { id: n, msg: i } : { id: n }))
    }
  }
  function At(t) {
    ;(Te.call(t, "add"),
      Te.call(t, "append"),
      Te.call(t, "search"),
      Te.call(t, "update"),
      Te.call(t, "remove"))
  }
  function cr() {
    Et = Ge = 0
  }
  function Te(t) {
    this[t + "Async"] = function () {
      let e = arguments
      var n = e[e.length - 1]
      let r
      if (
        (typeof n == "function" && ((r = n), delete e[e.length - 1]),
        Et
          ? Ge || (Ge = Date.now() - qt >= this.priority * this.priority * 3)
          : ((Et = setTimeout(cr, 0)), (qt = Date.now())),
        Ge)
      ) {
        let s = this
        return new Promise((o) => {
          setTimeout(function () {
            o(s[t + "Async"].apply(s, e))
          }, 0)
        })
      }
      let i = this[t].apply(this, e)
      return ((n = i.then ? i : new Promise((s) => s(i))), r && n.then(r), n)
    }
  }
  function ye(t = {}) {
    function e(o) {
      function l(a) {
        a = a.data || a
        let u = a.id,
          c = u && i.h[u]
        c && (c(a.msg), delete i.h[u])
      }
      if (((this.worker = o), (this.h = R()), this.worker))
        return (
          r ? this.worker.on("message", l) : (this.worker.onmessage = l),
          t.config
            ? new Promise(function (a) {
                ;((i.h[++Ce] = function () {
                  ;(a(i), 1e9 < Ce && (Ce = 0))
                }),
                  i.worker.postMessage({ id: Ce, task: "init", factory: n, options: t }))
              })
            : (this.worker.postMessage({ task: "init", factory: n, options: t }),
              (this.priority = t.priority || 4),
              this)
        )
    }
    if (!this || this.constructor !== ye) return new ye(t)
    let n = typeof self < "u" ? self._factory : typeof window < "u" ? window._factory : null
    n && (n = n.toString())
    let r = typeof window > "u",
      i = this,
      s = hr(n, r, t.worker)
    return s.then
      ? s.then(function (o) {
          return e.call(i, o)
        })
      : e.call(this, s)
  }
  function X(t) {
    ye.prototype[t] = function () {
      let e = this,
        n = [].slice.call(arguments)
      var r = n[n.length - 1]
      let i
      return (
        typeof r == "function" && ((i = r), n.pop()),
        (r = new Promise(function (s) {
          ;(t === "export" && typeof n[0] == "function" && (n[0] = null),
            (e.h[++Ce] = s),
            e.worker.postMessage({ task: t, id: Ce, args: n }))
        })),
        i ? (r.then(i), this) : r
      )
    }
  }
  function hr(t, e, n) {
    return e
      ? typeof module < "u"
        ? new (mt().Worker)(__dirname + "/worker/node.js")
        : Promise.resolve()
            .then(() => Rt(mt()))
            .then(function (r) {
              return new r.Worker(ln.dirname + "/node/node.mjs")
            })
      : t
        ? new window.Worker(
            URL.createObjectURL(
              new Blob(["onmessage=" + ur.toString()], { type: "text/javascript" }),
            ),
          )
        : new window.Worker(
            typeof n == "string"
              ? n
              : ln.url
                  .replace("/worker.js", "/worker/worker.js")
                  .replace("flexsearch.bundle.module.min.js", "module/worker/worker.js"),
            { type: "module" },
          )
  }
  function Mt(t, e = 0) {
    let n = [],
      r = []
    e && (e = ((25e4 / e) * 5e3) | 0)
    for (let i of t.entries()) (r.push(i), r.length === e && (n.push(r), (r = [])))
    return (r.length && n.push(r), n)
  }
  function xt(t, e) {
    e || (e = new Map())
    for (let n = 0, r; n < t.length; n++) ((r = t[n]), e.set(r[0], r[1]))
    return e
  }
  function un(t, e = 0) {
    let n = [],
      r = []
    e && (e = ((25e4 / e) * 1e3) | 0)
    for (let i of t.entries())
      (r.push([i[0], Mt(i[1])[0]]), r.length === e && (n.push(r), (r = [])))
    return (r.length && n.push(r), n)
  }
  function cn(t, e) {
    e || (e = new Map())
    for (let n = 0, r, i; n < t.length; n++)
      ((r = t[n]), (i = e.get(r[0])), e.set(r[0], xt(r[1], i)))
    return e
  }
  function hn(t) {
    let e = [],
      n = []
    for (let r of t.keys()) (n.push(r), n.length === 25e4 && (e.push(n), (n = [])))
    return (n.length && e.push(n), e)
  }
  function gn(t, e) {
    e || (e = new Set())
    for (let n = 0; n < t.length; n++) e.add(t[n])
    return e
  }
  function We(t, e, n, r, i, s, o = 0) {
    let l = r && r.constructor === Array
    var a = l ? r.shift() : r
    if (!a) return this.export(t, e, i, s + 1)
    if ((a = t((e ? e + "." : "") + (o + 1) + "." + n, JSON.stringify(a))) && a.then) {
      let u = this
      return a.then(function () {
        return We.call(u, t, e, n, l ? r : null, i, s, o + 1)
      })
    }
    return We.call(this, t, e, n, l ? r : null, i, s, o + 1)
  }
  function Qt(t, e) {
    let n = ""
    for (let r of t.entries()) {
      t = r[0]
      let i = r[1],
        s = ""
      for (let o = 0, l; o < i.length; o++) {
        l = i[o] || [""]
        let a = ""
        for (let u = 0; u < l.length; u++)
          a += (a ? "," : "") + (e === "string" ? '"' + l[u] + '"' : l[u])
        ;((a = "[" + a + "]"), (s += (s ? "," : "") + a))
      }
      ;((s = '["' + t + '",[' + s + "]]"), (n += (n ? "," : "") + s))
    }
    return n
  }
  function Jt(t, e, n, r) {
    let i = []
    for (let s = 0, o; s < t.index.length; s++)
      if (((o = t.index[s]), e >= o.length)) e -= o.length
      else {
        e = o[r ? "splice" : "slice"](e, n)
        let l = e.length
        if (l && ((i = i.length ? i.concat(e) : e), (n -= l), r && (t.length -= l), !n)) break
        e = 0
      }
    return i
  }
  function oe(t) {
    if (!this || this.constructor !== oe) return new oe(t)
    ;((this.index = t ? [t] : []), (this.length = t ? t.length : 0))
    let e = this
    return new Proxy([], {
      get(n, r) {
        if (r === "length") return e.length
        if (r === "push")
          return function (i) {
            ;(e.index[e.index.length - 1].push(i), e.length++)
          }
        if (r === "pop")
          return function () {
            if (e.length) return (e.length--, e.index[e.index.length - 1].pop())
          }
        if (r === "indexOf")
          return function (i) {
            let s = 0
            for (let o = 0, l, a; o < e.index.length; o++) {
              if (((l = e.index[o]), (a = l.indexOf(i)), 0 <= a)) return s + a
              s += l.length
            }
            return -1
          }
        if (r === "includes")
          return function (i) {
            for (let s = 0; s < e.index.length; s++) if (e.index[s].includes(i)) return !0
            return !1
          }
        if (r === "slice")
          return function (i, s) {
            return Jt(e, i || 0, s || e.length, !1)
          }
        if (r === "splice")
          return function (i, s) {
            return Jt(e, i || 0, s || e.length, !0)
          }
        if (r === "constructor") return Array
        if (typeof r != "symbol") return (n = e.index[(r / 2 ** 31) | 0]) && n[r]
      },
      set(n, r, i) {
        return ((n = (r / 2 ** 31) | 0), ((e.index[n] || (e.index[n] = []))[r] = i), e.length++, !0)
      },
    })
  }
  function j(t = 8) {
    if (!this || this.constructor !== j) return new j(t)
    ;((this.index = R()),
      (this.h = []),
      (this.size = 0),
      32 < t ? ((this.B = pn), (this.A = BigInt(t))) : ((this.B = fn), (this.A = t)))
  }
  function P(t = 8) {
    if (!this || this.constructor !== P) return new P(t)
    ;((this.index = R()),
      (this.h = []),
      (this.size = 0),
      32 < t ? ((this.B = pn), (this.A = BigInt(t))) : ((this.B = fn), (this.A = t)))
  }
  function fn(t) {
    let e = 2 ** this.A - 1
    if (typeof t == "number") return t & e
    let n = 0,
      r = this.A + 1
    for (let i = 0; i < t.length; i++) n = ((n * r) ^ t.charCodeAt(i)) & e
    return this.A === 32 ? n + 2 ** 31 : n
  }
  function pn(t) {
    let e = BigInt(2) ** this.A - BigInt(1)
    var n = typeof t
    if (n === "bigint") return t & e
    if (n === "number") return BigInt(t) & e
    n = BigInt(0)
    let r = this.A + BigInt(1)
    for (let i = 0; i < t.length; i++) n = ((n * r) ^ BigInt(t.charCodeAt(i))) & e
    return n
  }
  function Ft(t, e, n, r, i, s) {
    if (((t = t[i]), r === n.length - 1)) e[i] = s || t
    else if (t)
      if (t.constructor === Array)
        for (e = e[i] = Array(t.length), i = 0; i < t.length; i++) Ft(t, e, n, r, i)
      else ((e = e[i] || (e[i] = R())), (i = n[++r]), Ft(t, e, n, r, i))
  }
  function vt(t, e, n, r, i, s, o, l) {
    if ((t = t[o]))
      if (r === e.length - 1) {
        if (t.constructor === Array) {
          if (n[r]) {
            for (e = 0; e < t.length; e++) i.add(s, t[e], !0, !0)
            return
          }
          t = t.join(" ")
        }
        i.add(s, t, l, !0)
      } else if (t.constructor === Array) for (o = 0; o < t.length; o++) vt(t, e, n, r, i, s, o, l)
      else ((o = e[++r]), vt(t, e, n, r, i, s, o, l))
    else i.db && i.remove(s)
  }
  function dn(t, e, n, r, i, s, o) {
    let l = t.length,
      a = [],
      u,
      c
    u = R()
    for (let h = 0, g, p, f, d; h < e; h++)
      for (let m = 0; m < l; m++)
        if (((f = t[m]), h < f.length && (g = f[h])))
          for (let y = 0; y < g.length; y++) {
            if (
              ((p = g[y]),
              (c = u[p]) ? u[p]++ : ((c = 0), (u[p] = 1)),
              (d = a[c] || (a[c] = [])),
              !o)
            ) {
              let E = h + (m || !i ? 0 : s || 0)
              d = d[E] || (d[E] = [])
            }
            if ((d.push(p), o && n && c === l - 1 && d.length - r === n)) return r ? d.slice(r) : d
          }
    if ((t = a.length))
      if (i)
        a = 1 < a.length ? mn(a, n, r, o, s) : (a = a[0]).length > n || r ? a.slice(r, n + r) : a
      else {
        if (t < l) return []
        if (((a = a[t - 1]), n || r))
          if (o) (a.length > n || r) && (a = a.slice(r, n + r))
          else {
            i = []
            for (let h = 0, g; h < a.length; h++)
              if (((g = a[h]), g.length > r)) r -= g.length
              else if (
                ((g.length > n || r) &&
                  ((g = g.slice(r, n + r)), (n -= g.length), r && (r -= g.length)),
                i.push(g),
                !n)
              )
                break
            a = 1 < i.length ? [].concat.apply([], i) : i[0]
          }
      }
    return a
  }
  function mn(t, e, n, r, i) {
    let s = [],
      o = R(),
      l
    var a = t.length
    let u
    if (r) {
      for (i = a - 1; 0 <= i; i--)
        if ((u = (r = t[i]) && r.length)) {
          for (a = 0; a < u; a++)
            if (((l = r[a]), !o[l])) {
              if (((o[l] = 1), n)) n--
              else if ((s.push(l), s.length === e)) return s
            }
        }
    } else
      for (let c = a - 1, h, g = 0; 0 <= c; c--) {
        h = t[c]
        for (let p = 0; p < h.length; p++)
          if ((u = (r = h[p]) && r.length)) {
            for (let f = 0; f < u; f++)
              if (((l = r[f]), !o[l]))
                if (((o[l] = 1), n)) n--
                else {
                  let d = ((p + ((c < a - 1 && i) || 0)) / (c + 1)) | 0
                  if (((s[d] || (s[d] = [])).push(l), ++g === e)) return s
                }
          }
      }
    return s
  }
  function gr(t, e, n) {
    let r = R(),
      i = []
    for (let s = 0, o; s < e.length; s++) {
      o = e[s]
      for (let l = 0; l < o.length; l++) r[o[l]] = 1
    }
    if (n) for (let s = 0, o; s < t.length; s++) ((o = t[s]), r[o] && (i.push(o), (r[o] = 0)))
    else
      for (let s = 0, o, l; s < t.result.length; s++)
        for (o = t.result[s], e = 0; e < o.length; e++)
          ((l = o[e]), r[l] && ((i[s] || (i[s] = [])).push(l), (r[l] = 0)))
    return i
  }
  function Lt(t, e, n, r) {
    if (!t.length) return t
    if (t.length === 1)
      return (
        (t = t[0]),
        (t = n || t.length > e ? (e ? t.slice(n, n + e) : t.slice(n)) : t),
        r ? V.call(this, t) : t
      )
    let i = []
    for (let s = 0, o, l; s < t.length; s++)
      if ((o = t[s]) && (l = o.length)) {
        if (n) {
          if (n >= l) {
            n -= l
            continue
          }
          n < l && ((o = e ? o.slice(n, n + e) : o.slice(n)), (l = o.length), (n = 0))
        }
        if ((l > e && ((o = o.slice(0, e)), (l = e)), !i.length && l >= e))
          return r ? V.call(this, o) : o
        if ((i.push(o), (e -= l), !e)) break
      }
    return ((i = 1 < i.length ? [].concat.apply([], i) : i[0]), r ? V.call(this, i) : i)
  }
  function qe(t, e, n) {
    var r = n[0]
    if (r.then)
      return Promise.all(n).then(function (c) {
        return t[e].apply(t, c)
      })
    if (r[0] && r[0].index) return t[e].apply(t, r)
    r = []
    let i = [],
      s = 0,
      o = 0,
      l,
      a,
      u
    for (let c = 0, h; c < n.length; c++)
      if ((h = n[c])) {
        let g
        if (h.constructor === M) g = h.result
        else if (h.constructor === Array) g = h
        else if (
          ((s = h.limit || 0),
          (o = h.offset || 0),
          (u = h.suggest),
          (a = h.resolve),
          (l = h.enrich && a),
          h.index)
        )
          ((h.resolve = !1), (g = h.index.search(h).result), (h.resolve = a))
        else if (h.and) g = t.and(h.and)
        else if (h.or) g = t.or(h.or)
        else if (h.xor) g = t.xor(h.xor)
        else if (h.not) g = t.not(h.not)
        else continue
        if (g.then) i.push(g)
        else if (g.length) r[c] = g
        else if (!u && (e === "and" || e === "xor")) {
          r = []
          break
        }
      }
    return { O: r, P: i, limit: s, offset: o, enrich: l, resolve: a, suggest: u }
  }
  function Cn(t, e, n, r, i, s) {
    if (e.length) {
      let o = this
      return Promise.all(e).then(function (l) {
        t = []
        for (let a = 0, u; a < l.length; a++) (u = l[a]).length && (t[a] = u)
        return Cn.call(o, t, [], n, r, i, s)
      })
    }
    return (
      t.length &&
        (this.result.length && t.push(this.result),
        2 > t.length ? (this.result = t[0]) : ((this.result = mn(t, n, r, !1, this.h)), (r = 0))),
      s ? this.resolve(n, r, i) : this
    )
  }
  function Dn(t, e, n, r, i, s, o) {
    if (e.length) {
      let l = this
      return Promise.all(e).then(function (a) {
        t = []
        for (let u = 0, c; u < a.length; u++) (c = a[u]).length && (t[u] = c)
        return Dn.call(l, t, [], n, r, i, s, o)
      })
    }
    if (t.length)
      if ((this.result.length && t.unshift(this.result), 2 > t.length)) this.result = t[0]
      else {
        if ((e = ir(t)))
          return (
            (this.result = dn(t, e, n, r, o, this.h, s)),
            s ? (i ? V.call(this.index, this.result) : this.result) : this
          )
        this.result = []
      }
    else o || (this.result = t)
    return s ? this.resolve(n, r, i) : this
  }
  function yn(t, e, n, r, i, s, o) {
    if (e.length) {
      let l = this
      return Promise.all(e).then(function (a) {
        t = []
        for (let u = 0, c; u < a.length; u++) (c = a[u]).length && (t[u] = c)
        return yn.call(l, t, [], n, r, i, s, o)
      })
    }
    if (t.length)
      if ((this.result.length && t.unshift(this.result), 2 > t.length)) this.result = t[0]
      else
        return (
          (this.result = fr.call(this, t, n, r, s, this.h)),
          s ? (i ? V.call(this.index, this.result) : this.result) : this
        )
    else o || (this.result = t)
    return s ? this.resolve(n, r, i) : this
  }
  function fr(t, e, n, r, i) {
    let s = [],
      o = R(),
      l = 0
    for (let a = 0, u; a < t.length; a++)
      if ((u = t[a])) {
        l < u.length && (l = u.length)
        for (let c = 0, h; c < u.length; c++)
          if ((h = u[c])) for (let g = 0, p; g < h.length; g++) ((p = h[g]), (o[p] = o[p] ? 2 : 1))
      }
    for (let a = 0, u, c = 0; a < l; a++)
      for (let h = 0, g; h < t.length; h++)
        if ((g = t[h]) && (u = g[a])) {
          for (let p = 0, f; p < u.length; p++)
            if (((f = u[p]), o[f] === 1))
              if (n) n--
              else if (r) {
                if ((s.push(f), s.length === e)) return s
              } else {
                let d = a + (h ? i : 0)
                if ((s[d] || (s[d] = []), s[d].push(f), ++c === e)) return s
              }
        }
    return s
  }
  function En(t, e, n, r, i, s, o) {
    if (e.length) {
      let l = this
      return Promise.all(e).then(function (a) {
        t = []
        for (let u = 0, c; u < a.length; u++) (c = a[u]).length && (t[u] = c)
        return En.call(l, t, [], n, r, i, s, o)
      })
    }
    if (t.length && this.result.length) this.result = pr.call(this, t, n, r, s)
    else if (s) return this.resolve(n, r, i)
    return s ? (i ? V.call(this.index, this.result) : this.result) : this
  }
  function pr(t, e, n, r) {
    let i = []
    t = new Set(t.flat().flat())
    for (let s = 0, o, l = 0; s < this.result.length; s++)
      if ((o = this.result[s])) {
        for (let a = 0, u; a < o.length; a++)
          if (((u = o[a]), !t.has(u))) {
            if (n) n--
            else if (r) {
              if ((i.push(u), i.length === e)) return i
            } else if ((i[s] || (i[s] = []), i[s].push(u), ++l === e)) return i
          }
      }
    return i
  }
  function M(t) {
    if (!this || this.constructor !== M) return new M(t)
    if (t && t.index)
      return (
        (t.resolve = !1),
        (this.index = t.index),
        (this.h = t.boost || 0),
        (this.result = t.index.search(t).result),
        this
      )
    ;((this.index = null), (this.result = t || []), (this.h = 0))
  }
  function Ct(t, e, n, r, i) {
    let s, o
    for (let a = 0, u, c, h; a < e.length; a++) {
      let g
      if (r) ((g = e), (h = r))
      else {
        var l = e[a]
        if (((h = l.field), !h)) continue
        g = l.result
      }
      ;((c = n.get(h)), (u = c.encoder), (l = c.tokenize), u !== s && ((s = u), (o = s.encode(t))))
      for (let p = 0; p < g.length; p++) {
        let f = "",
          d = Re(g[p].doc, h).split(/\s+/)
        for (let m = 0, y, E; m < d.length; m++) {
          ;((y = d[m]), (E = u.encode(y)), (E = 1 < E.length ? E.join(" ") : E[0]))
          let B
          if (E && y)
            for (let x = 0, v; x < o.length; x++)
              if (((v = o[x]), l === "strict")) {
                if (E === v) {
                  ;((f += (f ? " " : "") + i.replace("$1", y)), (B = !0))
                  break
                }
              } else {
                let T = E.indexOf(v)
                if (-1 < T) {
                  ;((f +=
                    (f ? " " : "") +
                    y.substring(0, T) +
                    i.replace("$1", y.substring(T, T + v.length)) +
                    y.substring(T + v.length)),
                    (B = !0))
                  break
                }
              }
          B || (f += (f ? " " : "") + d[m])
        }
        g[p].highlight = f
      }
      if (r) break
    }
    return e
  }
  function Zt(t) {
    let e = [],
      n = R()
    for (let r = 0, i, s; r < t.length; r++) {
      ;((i = t[r]), (s = i.result))
      for (let o = 0, l, a, u; o < s.length; o++)
        ((a = s[o]),
          typeof a != "object" && (a = { id: a }),
          (l = a.id),
          (u = n[l]) ? u.push(i.field) : ((a.field = n[l] = [i.field]), e.push(a)))
    }
    return e
  }
  function dr(t, e, n, r, i) {
    if (((t = this.tag.get(t)), !t)) return []
    if ((e = (t = t && t.get(e)) && t.length - r) && 0 < e)
      return ((e > n || r) && (t = t.slice(r, r + n)), i && (t = V.call(this, t)), t)
  }
  function V(t) {
    if (!this || !this.store) return t
    let e = Array(t.length)
    for (let n = 0, r; n < t.length; n++) ((r = t[n]), (e[n] = { id: r, doc: this.store.get(r) }))
    return e
  }
  function ae(t) {
    if (!this || this.constructor !== ae) return new ae(t)
    let e = t.document || t.doc || t,
      n,
      r
    if (
      ((this.F = []),
      (this.field = []),
      (this.J = []),
      (this.key = ((n = e.key || e.id) && Ve(n, this.J)) || "id"),
      (r = t.keystore || 0) && (this.keystore = r),
      (this.fastupdate = !!t.fastupdate),
      (this.reg =
        !this.fastupdate || t.worker || t.db
          ? r
            ? new P(r)
            : new Set()
          : r
            ? new j(r)
            : new Map()),
      (this.C = (n = e.store || null) && n && n !== !0 && []),
      (this.store = n && (r ? new j(r) : new Map())),
      (this.cache = (n = t.cache || null) && new le(n)),
      (t.cache = !1),
      (this.worker = t.worker || !1),
      (this.priority = t.priority || 4),
      (this.index = mr.call(this, t, e)),
      (this.tag = null),
      (n = e.tag) && (typeof n == "string" && (n = [n]), n.length))
    ) {
      ;((this.tag = new Map()), (this.D = []), (this.R = []))
      for (let i = 0, s, o; i < n.length; i++) {
        if (((s = n[i]), (o = s.field || s), !o))
          throw Error("The tag field from the document descriptor is undefined.")
        ;(s.custom
          ? (this.D[i] = s.custom)
          : ((this.D[i] = Ve(o, this.J)),
            s.filter &&
              (typeof this.D[i] == "string" && (this.D[i] = new String(this.D[i])),
              (this.D[i].I = s.filter))),
          (this.R[i] = o),
          this.tag.set(o, new Map()))
      }
    }
    if (this.worker) {
      this.fastupdate = !1
      let i = []
      for (let s of this.index.values()) s.then && i.push(s)
      if (i.length) {
        let s = this
        return Promise.all(i).then(function (o) {
          let l = new Map(),
            a = 0
          for (let c of s.index.entries()) {
            let h = c[0]
            var u = c[1]
            if (u.then) {
              u = i[a].encoder || {}
              let g = l.get(u)
              ;(g || ((g = u.encode ? u : new De(u)), l.set(u, g)),
                (u = o[a]),
                (u.encoder = g),
                s.index.set(h, u),
                a++)
            }
          }
          return s
        })
      }
    } else t.db && ((this.fastupdate = !1), this.mount(t.db))
  }
  function mr(t, e) {
    let n = new Map(),
      r = e.index || e.field || e
    H(r) && (r = [r])
    for (let i = 0, s, o; i < r.length; i++) {
      if (
        ((s = r[i]),
        H(s) || ((o = s), (s = s.field)),
        (o = we(o) ? Object.assign({}, t, o) : t),
        this.worker)
      ) {
        let l = new ye(o)
        ;((l.encoder = o.encoder), n.set(s, l))
      }
      ;(this.worker || n.set(s, new K(o, this.reg)),
        o.custom
          ? (this.F[i] = o.custom)
          : ((this.F[i] = Ve(s, this.J)),
            o.filter &&
              (typeof this.F[i] == "string" && (this.F[i] = new String(this.F[i])),
              (this.F[i].I = o.filter))),
        (this.field[i] = s))
    }
    if (this.C) {
      ;((t = e.store), H(t) && (t = [t]))
      for (let i = 0, s, o; i < t.length; i++)
        ((s = t[i]),
          (o = s.field || s),
          s.custom
            ? ((this.C[i] = s.custom), (s.custom.V = o))
            : ((this.C[i] = Ve(o, this.J)),
              s.filter &&
                (typeof this.C[i] == "string" && (this.C[i] = new String(this.C[i])),
                (this.C[i].I = s.filter))))
    }
    return n
  }
  function Ve(t, e) {
    let n = t.split(":"),
      r = 0
    for (let i = 0; i < n.length; i++)
      ((t = n[i]),
        t[t.length - 1] === "]" && (t = t.substring(0, t.length - 2)) && (e[r] = !0),
        t && (n[r++] = t))
    return (r < n.length && (n.length = r), 1 < r ? n : n[0])
  }
  function Fn(t, e, n) {
    let r = (typeof t == "object" ? "" + t.query : t).toLowerCase()
    this.cache || (this.cache = new le())
    let i = this.cache.get(r)
    if (!i) {
      if (((i = this.search(t, e, n)), i.then)) {
        let s = this
        i.then(function (o) {
          return (s.cache.set(r, o), o)
        })
      }
      this.cache.set(r, i)
    }
    return i
  }
  function le(t) {
    ;((this.limit = t && t !== !0 ? t : 1e3), (this.cache = new Map()), (this.h = ""))
  }
  function Ie(t, e) {
    let n = 0
    var r = typeof e > "u"
    if (t.constructor === Array) {
      for (let i = 0, s, o; i < t.length; i++)
        if ((s = t[i]) && s.length)
          if (r) n++
          else if (((o = s.indexOf(e)), 0 <= o)) {
            1 < s.length ? (s.splice(o, 1), n++) : delete t[i]
            break
          } else n++
    } else
      for (let i of t.entries()) {
        r = i[0]
        let s = Ie(i[1], e)
        s ? (n += s) : t.delete(r)
      }
    return n
  }
  function be(t, e, n, r, i, s, o) {
    let l = o ? t.ctx : t.map,
      a
    if (
      (!e[n] || (o && !(a = e[n])[o])) &&
      (o
        ? ((e = a || (e[n] = R())),
          (e[o] = 1),
          (a = l.get(o)) ? (l = a) : l.set(o, (l = new Map())))
        : (e[n] = 1),
      (a = l.get(n)) ? (l = a) : l.set(n, (l = a = [])),
      (l = l[r] || (l[r] = [])),
      !s || !l.includes(i))
    ) {
      if (l.length === 2 ** 31 - 1) {
        if (((e = new oe(l)), t.fastupdate))
          for (let u of t.reg.values()) u.includes(l) && (u[u.indexOf(l)] = e)
        a[r] = l = e
      }
      ;(l.push(i), t.fastupdate && ((r = t.reg.get(i)) ? r.push(l) : t.reg.set(i, [l])))
    }
  }
  function je(t, e, n, r, i) {
    return n && 1 < t
      ? e + (r || 0) <= t
        ? n + (i || 0)
        : (((t - 1) / (e + (r || 0))) * (n + (i || 0)) + 1) | 0
      : 0
  }
  function sn(t, e, n, r, i, s, o) {
    let l = t.length,
      a = t
    if (1 < l) a = dn(t, e, n, r, i, s, o)
    else if (l === 1) return o ? Lt.call(null, t[0], n, r) : new M(t[0])
    return o ? a : new M(a)
  }
  function on(t, e, n, r, i, s, o) {
    return (
      (t = St(this, t, e, n, r, i, s, o)),
      this.db
        ? t.then(function (l) {
            return i ? l || [] : new M(l)
          })
        : t && t.length
          ? i
            ? Lt.call(this, t, n, r)
            : new M(t)
          : i
            ? []
            : new M()
    )
  }
  function an(t, e, n, r) {
    let i = []
    if (t && t.length) {
      if (t.length <= r) {
        e.push(t)
        return
      }
      for (let s = 0, o; s < r; s++) (o = t[s]) && (i[s] = o)
      if (i.length) {
        e.push(i)
        return
      }
    }
    if (!n) return i
  }
  function St(t, e, n, r, i, s, o, l) {
    let a
    return (
      n && (a = t.bidirectional && e > n) && ((a = n), (n = e), (e = a)),
      t.db
        ? t.db.get(e, n, r, i, s, o, l)
        : ((t = n ? (t = t.ctx.get(n)) && t.get(e) : t.map.get(e)), t)
    )
  }
  function K(t, e) {
    if (!this || this.constructor !== K) return new K(t)
    if (t) {
      var n = H(t) ? t : t.preset
      n && (t = Object.assign({}, Cr[n], t))
    } else t = {}
    n = t.context
    let r = n === !0 ? { depth: 1 } : n || {},
      i = H(t.encoder) ? vn[t.encoder] : t.encode || t.encoder || {}
    ;((this.encoder = i.encode ? i : typeof i == "object" ? new De(i) : { encode: i }),
      (this.resolution = t.resolution || 9),
      (this.tokenize = n = ((n = t.tokenize) && n !== "default" && n !== "exact" && n) || "strict"),
      (this.depth = (n === "strict" && r.depth) || 0),
      (this.bidirectional = r.bidirectional !== !1),
      (this.fastupdate = !!t.fastupdate),
      (this.score = t.score || null),
      (n = t.keystore || 0) && (this.keystore = n),
      (this.map = n ? new j(n) : new Map()),
      (this.ctx = n ? new j(n) : new Map()),
      (this.reg = e || (this.fastupdate ? (n ? new j(n) : new Map()) : n ? new P(n) : new Set())),
      (this.U = r.resolution || 3),
      (this.rtl = i.rtl || t.rtl || !1),
      (this.cache = (n = t.cache || null) && new le(n)),
      (this.resolve = t.resolve !== !1),
      (n = t.db) && (this.db = this.mount(n)),
      (this.T = t.commit !== !1),
      (this.commit_task = []),
      (this.commit_timer = null),
      (this.priority = t.priority || 4))
  }
  function Sn(t) {
    t.commit_timer ||
      (t.commit_timer = setTimeout(function () {
        ;((t.commit_timer = null), t.db.commit(t, void 0, void 0))
      }, 1))
  }
  function Ye(t, e = {}) {
    if (!this || this.constructor !== Ye) return new Ye(t, e)
    ;(typeof t == "object" && ((e = t), (t = t.name)),
      t || console.info("Default storage space was used, because a name was not passed."),
      (this.id = "flexsearch" + (t ? ":" + t.toLowerCase().replace(/[^a-z0-9_\-]/g, "") : "")),
      (this.field = e.field ? e.field.toLowerCase().replace(/[^a-z0-9_\-]/g, "") : ""),
      (this.type = e.type),
      (this.fastupdate = this.support_tag_search = !1),
      (this.db = null),
      (this.h = {}))
  }
  function yt(t, e, n) {
    let r = t.value,
      i,
      s = 0
    for (let o = 0, l; o < r.length; o++) {
      if ((l = n ? r : r[o])) {
        for (let a = 0, u, c; a < e.length; a++)
          if (((c = e[a]), (u = l.indexOf(c)), 0 <= u))
            if (((i = 1), 1 < l.length)) l.splice(u, 1)
            else {
              r[o] = []
              break
            }
        s += l.length
      }
      if (n) break
    }
    ;(s ? i && t.update(r) : t.delete(), t.continue())
  }
  function Y(t, e) {
    return new Promise((n, r) => {
      ;((t.onsuccess = t.oncomplete =
        function () {
          ;(e && e(this.result), (e = null), n(this.result))
        }),
        (t.onerror = t.onblocked = r),
        (t = null))
    })
  }
  var ln,
    D,
    sr,
    or,
    ar,
    lr,
    Yt,
    me,
    Le,
    Et,
    qt,
    Ge,
    Ce,
    en,
    $e,
    Dt,
    tn,
    nn,
    rn,
    vn,
    Cr,
    An,
    Xe,
    ie,
    Mn,
    xn = b(() => {
      ln = {}
      ;((sr = /[^\p{L}\p{N}]+/u),
        (or = /(\d{3})/g),
        (ar = /(\D)(\d{3})/g),
        (lr = /(\d{3})(\D)/g),
        (Yt = /[\u0300-\u036f]/g))
      D = De.prototype
      D.assign = function (t) {
        this.normalize = O(t.normalize, !0, this.normalize)
        let e = t.include,
          n = e || t.exclude || t.split,
          r
        if (n || n === "") {
          if (typeof n == "object" && n.constructor !== RegExp) {
            let i = ""
            ;((r = !e),
              e || (i += "\\p{Z}"),
              n.letter && (i += "\\p{L}"),
              n.number && ((i += "\\p{N}"), (r = !!e)),
              n.symbol && (i += "\\p{S}"),
              n.punctuation && (i += "\\p{P}"),
              n.control && (i += "\\p{C}"),
              (n = n.char) && (i += typeof n == "object" ? n.join("") : n))
            try {
              this.split = new RegExp("[" + (e ? "^" : "") + i + "]+", "u")
            } catch {
              this.split = /\s+/
            }
          } else ((this.split = n), (r = n === !1 || 2 > "a1a".split(n).length))
          this.numeric = O(t.numeric, r)
        } else {
          try {
            this.split = O(this.split, sr)
          } catch {
            this.split = /\s+/
          }
          this.numeric = O(t.numeric, O(this.numeric, !0))
        }
        if (
          ((this.prepare = O(t.prepare, null, this.prepare)),
          (this.finalize = O(t.finalize, null, this.finalize)),
          (n = t.filter),
          (this.filter = typeof n == "function" ? n : O(n && new Set(n), null, this.filter)),
          (this.dedupe = O(t.dedupe, !0, this.dedupe)),
          (this.matcher = O((n = t.matcher) && new Map(n), null, this.matcher)),
          (this.mapper = O((n = t.mapper) && new Map(n), null, this.mapper)),
          (this.stemmer = O((n = t.stemmer) && new Map(n), null, this.stemmer)),
          (this.replacer = O(t.replacer, null, this.replacer)),
          (this.minlength = O(t.minlength, 1, this.minlength)),
          (this.maxlength = O(t.maxlength, 1024, this.maxlength)),
          (this.rtl = O(t.rtl, !1, this.rtl)),
          (this.cache = n = O(t.cache, !0, this.cache)) &&
            ((this.H = null),
            (this.S = typeof n == "number" ? n : 2e5),
            (this.B = new Map()),
            (this.G = new Map()),
            (this.L = this.K = 128)),
          (this.h = ""),
          (this.M = null),
          (this.A = ""),
          (this.N = null),
          this.matcher)
        )
          for (let i of this.matcher.keys()) this.h += (this.h ? "|" : "") + i
        if (this.stemmer) for (let i of this.stemmer.keys()) this.A += (this.A ? "|" : "") + i
        return this
      }
      D.addStemmer = function (t, e) {
        return (
          this.stemmer || (this.stemmer = new Map()),
          this.stemmer.set(t, e),
          (this.A += (this.A ? "|" : "") + t),
          (this.N = null),
          this.cache && se(this),
          this
        )
      }
      D.addFilter = function (t) {
        return (
          typeof t == "function"
            ? (this.filter = t)
            : (this.filter || (this.filter = new Set()), this.filter.add(t)),
          this.cache && se(this),
          this
        )
      }
      D.addMapper = function (t, e) {
        return typeof t == "object"
          ? this.addReplacer(t, e)
          : 1 < t.length
            ? this.addMatcher(t, e)
            : (this.mapper || (this.mapper = new Map()),
              this.mapper.set(t, e),
              this.cache && se(this),
              this)
      }
      D.addMatcher = function (t, e) {
        return typeof t == "object"
          ? this.addReplacer(t, e)
          : 2 > t.length && (this.dedupe || this.mapper)
            ? this.addMapper(t, e)
            : (this.matcher || (this.matcher = new Map()),
              this.matcher.set(t, e),
              (this.h += (this.h ? "|" : "") + t),
              (this.M = null),
              this.cache && se(this),
              this)
      }
      D.addReplacer = function (t, e) {
        return typeof t == "string"
          ? this.addMatcher(t, e)
          : (this.replacer || (this.replacer = []),
            this.replacer.push(t, e),
            this.cache && se(this),
            this)
      }
      D.encode = function (t, e) {
        if (this.cache && t.length <= this.K)
          if (this.H) {
            if (this.B.has(t)) return this.B.get(t)
          } else this.H = setTimeout(se, 50, this)
        ;(this.normalize &&
          (typeof this.normalize == "function"
            ? (t = this.normalize(t))
            : (t = Yt ? t.normalize("NFKD").replace(Yt, "").toLowerCase() : t.toLowerCase())),
          this.prepare && (t = this.prepare(t)),
          this.numeric &&
            3 < t.length &&
            (t = t.replace(ar, "$1 $2").replace(lr, "$1 $2").replace(or, "$1 ")))
        let n = !(
            this.dedupe ||
            this.mapper ||
            this.filter ||
            this.matcher ||
            this.stemmer ||
            this.replacer
          ),
          r = [],
          i = R(),
          s,
          o,
          l = this.split || this.split === "" ? t.split(this.split) : [t]
        for (let u = 0, c, h; u < l.length; u++)
          if ((c = h = l[u]) && !(c.length < this.minlength || c.length > this.maxlength)) {
            if (e) {
              if (i[c]) continue
              i[c] = 1
            } else {
              if (s === c) continue
              s = c
            }
            if (n) r.push(c)
            else if (
              !this.filter ||
              (typeof this.filter == "function" ? this.filter(c) : !this.filter.has(c))
            ) {
              if (this.cache && c.length <= this.L)
                if (this.H) {
                  var a = this.G.get(c)
                  if (a || a === "") {
                    a && r.push(a)
                    continue
                  }
                } else this.H = setTimeout(se, 50, this)
              if (this.stemmer) {
                this.N || (this.N = new RegExp("(?!^)(" + this.A + ")$"))
                let g
                for (; g !== c && 2 < c.length; )
                  ((g = c), (c = c.replace(this.N, (p) => this.stemmer.get(p))))
              }
              if (c && (this.mapper || (this.dedupe && 1 < c.length))) {
                a = ""
                for (let g = 0, p = "", f, d; g < c.length; g++)
                  ((f = c.charAt(g)),
                    (f === p && this.dedupe) ||
                      ((d = this.mapper && this.mapper.get(f)) || d === ""
                        ? (d === p && this.dedupe) || !(p = d) || (a += d)
                        : (a += p = f)))
                c = a
              }
              if (
                (this.matcher &&
                  1 < c.length &&
                  (this.M || (this.M = new RegExp("(" + this.h + ")", "g")),
                  (c = c.replace(this.M, (g) => this.matcher.get(g)))),
                c && this.replacer)
              )
                for (a = 0; c && a < this.replacer.length; a += 2)
                  c = c.replace(this.replacer[a], this.replacer[a + 1])
              if (
                (this.cache &&
                  h.length <= this.L &&
                  (this.G.set(h, c),
                  this.G.size > this.S && (this.G.clear(), (this.L = (this.L / 1.1) | 0))),
                c)
              ) {
                if (c !== h)
                  if (e) {
                    if (i[c]) continue
                    i[c] = 1
                  } else {
                    if (o === c) continue
                    o = c
                  }
                r.push(c)
              }
            }
          }
        return (
          this.finalize && (r = this.finalize(r) || r),
          this.cache &&
            t.length <= this.K &&
            (this.B.set(t, r),
            this.B.size > this.S && (this.B.clear(), (this.K = (this.K / 1.1) | 0))),
          r
        )
      }
      Ce = 0
      X("add")
      X("append")
      X("search")
      X("update")
      X("remove")
      X("clear")
      X("export")
      X("import")
      At(ye.prototype)
      oe.prototype.clear = function () {
        this.index.length = 0
      }
      oe.prototype.destroy = function () {
        this.proxy = this.index = null
      }
      oe.prototype.push = function () {}
      j.prototype.get = function (t) {
        let e = this.index[this.B(t)]
        return e && e.get(t)
      }
      j.prototype.set = function (t, e) {
        var n = this.B(t)
        let r = this.index[n]
        r
          ? ((n = r.size), r.set(t, e), (n -= r.size) && this.size++)
          : ((this.index[n] = r = new Map([[t, e]])), this.h.push(r), this.size++)
      }
      P.prototype.add = function (t) {
        var e = this.B(t)
        let n = this.index[e]
        n
          ? ((e = n.size), n.add(t), (e -= n.size) && this.size++)
          : ((this.index[e] = n = new Set([t])), this.h.push(n), this.size++)
      }
      D = j.prototype
      D.has = P.prototype.has = function (t) {
        let e = this.index[this.B(t)]
        return e && e.has(t)
      }
      D.delete = P.prototype.delete = function (t) {
        let e = this.index[this.B(t)]
        e && e.delete(t) && this.size--
      }
      D.clear = P.prototype.clear = function () {
        ;((this.index = R()), (this.h = []), (this.size = 0))
      }
      D.values = P.prototype.values = function* () {
        for (let t = 0; t < this.h.length; t++) for (let e of this.h[t].values()) yield e
      }
      D.keys = P.prototype.keys = function* () {
        for (let t = 0; t < this.h.length; t++) for (let e of this.h[t].keys()) yield e
      }
      D.entries = P.prototype.entries = function* () {
        for (let t = 0; t < this.h.length; t++) for (let e of this.h[t].entries()) yield e
      }
      ae.prototype.add = function (t, e, n) {
        if ((we(t) && ((e = t), (t = Re(e, this.key))), e && (t || t === 0))) {
          if (!n && this.reg.has(t)) return this.update(t, e)
          for (let l = 0, a; l < this.field.length; l++) {
            a = this.F[l]
            var r = this.index.get(this.field[l])
            if (typeof a == "function") {
              var i = a(e)
              i && r.add(t, i, !1, !0)
            } else
              ((i = a.I),
                (!i || i(e)) &&
                  (a.constructor === String ? (a = ["" + a]) : H(a) && (a = [a]),
                  vt(e, a, this.J, 0, r, t, a[0], n)))
          }
          if (this.tag)
            for (r = 0; r < this.D.length; r++) {
              var s = this.D[r]
              i = this.tag.get(this.R[r])
              let l = R()
              if (typeof s == "function") {
                if (((s = s(e)), !s)) continue
              } else {
                var o = s.I
                if (o && !o(e)) continue
                ;(s.constructor === String && (s = "" + s), (s = Re(e, s)))
              }
              if (i && s) {
                H(s) && (s = [s])
                for (let a = 0, u, c; a < s.length; a++)
                  if (
                    ((u = s[a]),
                    !l[u] &&
                      ((l[u] = 1),
                      (o = i.get(u)) ? (c = o) : i.set(u, (c = [])),
                      !n || !c.includes(t)))
                  ) {
                    if (c.length === 2 ** 31 - 1) {
                      if (((o = new oe(c)), this.fastupdate))
                        for (let h of this.reg.values()) h.includes(c) && (h[h.indexOf(c)] = o)
                      i.set(u, (c = o))
                    }
                    ;(c.push(t),
                      this.fastupdate && ((o = this.reg.get(t)) ? o.push(c) : this.reg.set(t, [c])))
                  }
              }
            }
          if (this.store && (!n || !this.store.has(t))) {
            let l
            if (this.C) {
              l = R()
              for (let a = 0, u; a < this.C.length; a++) {
                if (((u = this.C[a]), (n = u.I) && !n(e))) continue
                let c
                if (typeof u == "function") {
                  if (((c = u(e)), !c)) continue
                  u = [u.V]
                } else if (H(u) || u.constructor === String) {
                  l[u] = e[u]
                  continue
                }
                Ft(e, l, u, 0, u[0], c)
              }
            }
            this.store.set(t, l || e)
          }
          this.worker && (this.fastupdate || this.reg.add(t))
        }
        return this
      }
      M.prototype.or = function () {
        let { O: t, P: e, limit: n, offset: r, enrich: i, resolve: s } = qe(this, "or", arguments)
        return Cn.call(this, t, e, n, r, i, s)
      }
      M.prototype.and = function () {
        let t = this.result.length,
          e,
          n,
          r,
          i
        if (!t) {
          let s = arguments[0]
          s &&
            ((t = !!s.suggest), (i = s.resolve), (e = s.limit), (n = s.offset), (r = s.enrich && i))
        }
        if (t) {
          let {
            O: s,
            P: o,
            limit: l,
            offset: a,
            enrich: u,
            resolve: c,
            suggest: h,
          } = qe(this, "and", arguments)
          return Dn.call(this, s, o, l, a, u, c, h)
        }
        return i ? this.resolve(e, n, r) : this
      }
      M.prototype.xor = function () {
        let {
          O: t,
          P: e,
          limit: n,
          offset: r,
          enrich: i,
          resolve: s,
          suggest: o,
        } = qe(this, "xor", arguments)
        return yn.call(this, t, e, n, r, i, s, o)
      }
      M.prototype.not = function () {
        let {
          O: t,
          P: e,
          limit: n,
          offset: r,
          enrich: i,
          resolve: s,
          suggest: o,
        } = qe(this, "not", arguments)
        return En.call(this, t, e, n, r, i, s, o)
      }
      M.prototype.limit = function (t) {
        if (this.result.length) {
          let e = []
          for (let n = 0, r; n < this.result.length; n++)
            if ((r = this.result[n]))
              if (r.length <= t) {
                if (((e[n] = r), (t -= r.length), !t)) break
              } else {
                e[n] = r.slice(0, t)
                break
              }
          this.result = e
        }
        return this
      }
      M.prototype.offset = function (t) {
        if (this.result.length) {
          let e = []
          for (let n = 0, r; n < this.result.length; n++)
            (r = this.result[n]) &&
              (r.length <= t ? (t -= r.length) : ((e[n] = r.slice(t)), (t = 0)))
          this.result = e
        }
        return this
      }
      M.prototype.boost = function (t) {
        return ((this.h += t), this)
      }
      M.prototype.resolve = function (t, e, n) {
        let r = this.result,
          i = this.index
        return (
          (this.result = this.index = null),
          r.length
            ? (typeof t == "object" && ((n = t.enrich), (e = t.offset), (t = t.limit)),
              Lt.call(i, r, t || 100, e, n))
            : r
        )
      }
      R()
      ae.prototype.search = function (t, e, n, r) {
        n || (!e && we(t) ? ((n = t), (t = "")) : we(e) && ((n = e), (e = 0)))
        let i = []
        var s = []
        let o
        var l
        let a,
          u,
          c,
          h = 0
        var g = !0
        let p
        if (n) {
          ;(n.constructor === Array && (n = { index: n }),
            (t = n.query || t),
            (o = n.pluck),
            (a = n.merge),
            (u = o || n.field || ((u = n.index) && (u.index ? null : u))),
            (c = this.tag && n.tag))
          var f = n.suggest
          ;((g = n.resolve !== !1),
            g ||
              o ||
              !(u = u || this.field) ||
              (H(u)
                ? (o = u)
                : (u.constructor === Array && u.length === 1 && (u = u[0]),
                  (o = u.field || u.index))),
            (p = (l = this.store && n.enrich && g) && n.highlight),
            (e = n.limit || e))
          var d = n.offset || 0
          if ((e || (e = 100), c && (!this.db || !r))) {
            c.constructor !== Array && (c = [c])
            var m = []
            for (let x = 0, v; x < c.length; x++)
              if (((v = c[x]), v.field && v.tag)) {
                var y = v.tag
                if (y.constructor === Array)
                  for (var E = 0; E < y.length; E++) m.push(v.field, y[E])
                else m.push(v.field, y)
              } else {
                y = Object.keys(v)
                for (let T = 0, z, I; T < y.length; T++)
                  if (((z = y[T]), (I = v[z]), I.constructor === Array))
                    for (E = 0; E < I.length; E++) m.push(z, I[E])
                  else m.push(z, I)
              }
            if (((c = m), !t)) {
              if (((g = []), m.length))
                for (s = 0; s < m.length; s += 2) {
                  if (this.db) {
                    if (((f = this.index.get(m[s])), !f)) continue
                    g.push((f = f.db.tag(m[s + 1], e, d, l)))
                  } else f = dr.call(this, m[s], m[s + 1], e, d, l)
                  i.push({ field: m[s], tag: m[s + 1], result: f })
                }
              return g.length
                ? Promise.all(g).then(function (x) {
                    for (let v = 0; v < x.length; v++) i[v].result = x[v]
                    return i
                  })
                : i
            }
          }
          u && u.constructor !== Array && (u = [u])
        }
        ;(u || (u = this.field), (m = !r && (this.worker || this.db) && []))
        let B
        for (let x = 0, v, T, z; x < u.length; x++) {
          if (((T = u[x]), this.db && this.tag && !this.F[x])) continue
          let I
          if (
            (H(T) ||
              ((I = T),
              (T = I.field),
              (t = I.query || t),
              (e = I.limit || e),
              (d = I.offset || d),
              (f = I.suggest || f),
              (l = this.store && (I.enrich || l))),
            r)
          )
            v = r[x]
          else if (
            ((y = I || n),
            (E = this.index.get(T)),
            c &&
              (this.db && ((y.tag = c), (B = E.db.support_tag_search), (y.field = u)),
              B || (y.enrich = !1)),
            m)
          ) {
            ;((m[x] = E.search(t, e, y)), y && l && (y.enrich = l))
            continue
          } else ((v = E.search(t, e, y)), y && l && (y.enrich = l))
          if (((z = v && (g ? v.length : v.result.length)), c && z)) {
            if (((y = []), (E = 0), this.db && r)) {
              if (!B)
                for (let U = u.length; U < r.length; U++) {
                  let C = r[U]
                  if (C && C.length) (E++, y.push(C))
                  else if (!f) return g ? i : new M(i)
                }
            } else
              for (let U = 0, C, F; U < c.length; U += 2) {
                if (((C = this.tag.get(c[U])), !C)) {
                  if (f) continue
                  return g ? i : new M(i)
                }
                if ((F = (C = C && C.get(c[U + 1])) && C.length)) (E++, y.push(C))
                else if (!f) return g ? i : new M(i)
              }
            if (E) {
              if (((v = gr(v, y, g)), (z = v.length), !z && !f)) return g ? v : new M(v)
              E--
            }
          }
          if (z) ((s[h] = T), i.push(v), h++)
          else if (u.length === 1) return g ? i : new M(i)
        }
        if (m) {
          if (this.db && c && c.length && !B)
            for (l = 0; l < c.length; l += 2) {
              if (((s = this.index.get(c[l])), !s)) {
                if (f) continue
                return g ? i : new M(i)
              }
              m.push(s.db.tag(c[l + 1], e, d, !1))
            }
          let x = this
          return Promise.all(m).then(function (v) {
            return v.length ? x.search(t, e, n, v) : v
          })
        }
        if (!h) return g ? i : new M(i)
        if (o && (!l || !this.store)) return i[0]
        for (m = [], d = 0; d < s.length; d++) {
          if (
            ((f = i[d]),
            l &&
              f.length &&
              typeof f[0].doc > "u" &&
              (this.db
                ? m.push((f = this.index.get(this.field[0]).db.enrich(f)))
                : (f = V.call(this, f))),
            o)
          )
            return g ? (p ? Ct(t, f, this.index, o, p) : f) : new M(f)
          i[d] = { field: s[d], result: f }
        }
        if (l && this.db && m.length) {
          let x = this
          return Promise.all(m).then(function (v) {
            for (let T = 0; T < v.length; T++) i[T].result = v[T]
            return a ? Zt(i) : p ? Ct(t, i, x.index, o, p) : i
          })
        }
        return a ? Zt(i) : p ? Ct(t, i, this.index, o, p) : i
      }
      D = ae.prototype
      D.mount = function (t) {
        let e = this.field
        if (this.tag)
          for (let s = 0, o; s < this.R.length; s++) {
            o = this.R[s]
            var n = void 0
            ;(this.index.set(o, (n = new K({}, this.reg))),
              e === this.field && (e = e.slice(0)),
              e.push(o),
              (n.tag = this.tag.get(o)))
          }
        n = []
        let r = { db: t.db, type: t.type, fastupdate: t.fastupdate }
        for (let s = 0, o, l; s < e.length; s++) {
          ;((r.field = l = e[s]), (o = this.index.get(l)))
          let a = new t.constructor(t.id, r)
          ;((a.id = t.id),
            (n[s] = a.mount(o)),
            (o.document = !0),
            s ? (o.bypass = !0) : (o.store = this.store))
        }
        let i = this
        return (this.db = Promise.all(n).then(function () {
          i.db = !0
        }))
      }
      D.commit = async function (t, e) {
        let n = []
        for (let r of this.index.values()) n.push(r.commit(t, e))
        ;(await Promise.all(n), this.reg.clear())
      }
      D.destroy = function () {
        let t = []
        for (let e of this.index.values()) t.push(e.destroy())
        return Promise.all(t)
      }
      D.append = function (t, e) {
        return this.add(t, e, !0)
      }
      D.update = function (t, e) {
        return this.remove(t).add(t, e)
      }
      D.remove = function (t) {
        we(t) && (t = Re(t, this.key))
        for (var e of this.index.values()) e.remove(t, !0)
        if (this.reg.has(t)) {
          if (this.tag && !this.fastupdate)
            for (let n of this.tag.values())
              for (let r of n) {
                e = r[0]
                let i = r[1],
                  s = i.indexOf(t)
                ;-1 < s && (1 < i.length ? i.splice(s, 1) : n.delete(e))
              }
          ;(this.store && this.store.delete(t), this.reg.delete(t))
        }
        return (this.cache && this.cache.remove(t), this)
      }
      D.clear = function () {
        let t = []
        for (let e of this.index.values()) {
          let n = e.clear()
          n.then && t.push(n)
        }
        if (this.tag) for (let e of this.tag.values()) e.clear()
        return (
          this.store && this.store.clear(),
          this.cache && this.cache.clear(),
          t.length ? Promise.all(t) : this
        )
      }
      D.contain = function (t) {
        return this.db ? this.index.get(this.field[0]).db.has(t) : this.reg.has(t)
      }
      D.cleanup = function () {
        for (let t of this.index.values()) t.cleanup()
        return this
      }
      D.get = function (t) {
        return this.db
          ? this.index
              .get(this.field[0])
              .db.enrich(t)
              .then(function (e) {
                return (e[0] && e[0].doc) || null
              })
          : this.store.get(t) || null
      }
      D.set = function (t, e) {
        return (
          typeof t == "object" && ((e = t), (t = Re(e, this.key))),
          this.store.set(t, e),
          this
        )
      }
      D.searchCache = Fn
      D.export = function (t, e, n = 0, r = 0) {
        if (n < this.field.length) {
          let o = this.field[n]
          if ((e = this.index.get(o).export(t, o, n, (r = 1))) && e.then) {
            let l = this
            return e.then(function () {
              return l.export(t, o, n + 1)
            })
          }
          return this.export(t, o, n + 1)
        }
        let i, s
        switch (r) {
          case 0:
            ;((i = "reg"), (s = hn(this.reg)), (e = null))
            break
          case 1:
            ;((i = "tag"), (s = this.tag && un(this.tag, this.reg.size)), (e = null))
            break
          case 2:
            ;((i = "doc"), (s = this.store && Mt(this.store)), (e = null))
            break
          default:
            return
        }
        return We.call(this, t, e, i, s, n, r)
      }
      D.import = function (t, e) {
        var n = t.split(".")
        n[n.length - 1] === "json" && n.pop()
        let r = 2 < n.length ? n[0] : ""
        if (((n = 2 < n.length ? n[2] : n[1]), this.worker && r)) return this.index.get(r).import(t)
        if (e) {
          if ((typeof e == "string" && (e = JSON.parse(e)), r))
            return this.index.get(r).import(n, e)
          switch (n) {
            case "reg":
              ;((this.fastupdate = !1), (this.reg = gn(e, this.reg)))
              for (let i = 0, s; i < this.field.length; i++)
                ((s = this.index.get(this.field[i])), (s.fastupdate = !1), (s.reg = this.reg))
              if (this.worker) {
                e = []
                for (let i of this.index.values()) e.push(i.import(t))
                return Promise.all(e)
              }
              break
            case "tag":
              this.tag = cn(e, this.tag)
              break
            case "doc":
              this.store = xt(e, this.store)
          }
        }
      }
      At(ae.prototype)
      le.prototype.set = function (t, e) {
        ;(this.cache.set((this.h = t), e),
          this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value))
      }
      le.prototype.get = function (t) {
        let e = this.cache.get(t)
        return (e && this.h !== t && (this.cache.delete(t), this.cache.set((this.h = t), e)), e)
      }
      le.prototype.remove = function (t) {
        for (let e of this.cache) {
          let n = e[0]
          e[1].includes(t) && this.cache.delete(n)
        }
      }
      le.prototype.clear = function () {
        ;(this.cache.clear(), (this.h = ""))
      }
      ;((en = { normalize: !1, numeric: !1, dedupe: !1 }),
        ($e = {}),
        (Dt = new Map([
          ["b", "p"],
          ["v", "f"],
          ["w", "f"],
          ["z", "s"],
          ["x", "s"],
          ["d", "t"],
          ["n", "m"],
          ["c", "k"],
          ["g", "k"],
          ["j", "k"],
          ["q", "k"],
          ["i", "e"],
          ["y", "e"],
          ["u", "o"],
        ])),
        (tn = new Map([
          ["ae", "a"],
          ["oe", "o"],
          ["sh", "s"],
          ["kh", "k"],
          ["th", "t"],
          ["ph", "f"],
          ["pf", "f"],
        ])),
        (nn = [/([^aeo])h(.)/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2", /(.)\1+/g, "$1"]),
        (rn = {
          a: "",
          e: "",
          i: "",
          o: "",
          u: "",
          y: "",
          b: 1,
          f: 1,
          p: 1,
          v: 1,
          c: 2,
          g: 2,
          j: 2,
          k: 2,
          q: 2,
          s: 2,
          x: 2,
          z: 2,
          ß: 2,
          d: 3,
          t: 3,
          l: 4,
          m: 5,
          n: 5,
          r: 6,
        }),
        (vn = {
          Exact: en,
          Default: $e,
          Normalize: $e,
          LatinBalance: { mapper: Dt },
          LatinAdvanced: { mapper: Dt, matcher: tn, replacer: nn },
          LatinExtra: { mapper: Dt, replacer: nn.concat([/(?!^)[aeo]/g, ""]), matcher: tn },
          LatinSoundex: {
            dedupe: !1,
            include: { letter: !0 },
            finalize: function (t) {
              for (let n = 0; n < t.length; n++) {
                var e = t[n]
                let r = e.charAt(0),
                  i = rn[r]
                for (
                  let s = 1, o;
                  s < e.length &&
                  ((o = e.charAt(s)),
                  o === "h" ||
                    o === "w" ||
                    !(o = rn[o]) ||
                    o === i ||
                    ((r += o), (i = o), r.length !== 4));
                  s++
                );
                t[n] = r
              }
            },
          },
          CJK: { split: "" },
          LatinExact: en,
          LatinDefault: $e,
          LatinSimple: $e,
        }))
      K.prototype.remove = function (t, e) {
        let n = this.reg.size && (this.fastupdate ? this.reg.get(t) : this.reg.has(t))
        if (n) {
          if (this.fastupdate) {
            for (let r = 0, i; r < n.length; r++)
              if ((i = n[r]))
                if (2 > i.length) i.pop()
                else {
                  let s = i.indexOf(t)
                  s === n.length - 1 ? i.pop() : i.splice(s, 1)
                }
          } else (Ie(this.map, t), this.depth && Ie(this.ctx, t))
          e || this.reg.delete(t)
        }
        return (
          this.db && (this.commit_task.push({ del: t }), this.T && Sn(this)),
          this.cache && this.cache.remove(t),
          this
        )
      }
      Cr = {
        memory: { resolution: 1 },
        performance: { resolution: 3, fastupdate: !0, context: { depth: 1, resolution: 1 } },
        match: { tokenize: "forward" },
        score: { resolution: 9, context: { depth: 2, resolution: 3 } },
      }
      K.prototype.add = function (t, e, n, r) {
        if (e && (t || t === 0)) {
          if (!r && !n && this.reg.has(t)) return this.update(t, e)
          ;((r = this.depth), (e = this.encoder.encode(e, !r)))
          let u = e.length
          if (u) {
            let c = R(),
              h = R(),
              g = this.resolution
            for (let p = 0; p < u; p++) {
              let f = e[this.rtl ? u - 1 - p : p]
              var i = f.length
              if (i && (r || !h[f])) {
                var s = this.score ? this.score(e, f, p, null, 0) : je(g, u, p),
                  o = ""
                switch (this.tokenize) {
                  case "full":
                    if (2 < i) {
                      for (let d = 0, m; d < i; d++)
                        for (s = i; s > d; s--) {
                          ;((o = f.substring(d, s)), (m = this.rtl ? i - 1 - d : d))
                          var l = this.score ? this.score(e, f, p, o, m) : je(g, u, p, i, m)
                          be(this, h, o, l, t, n)
                        }
                      break
                    }
                  case "bidirectional":
                  case "reverse":
                    if (1 < i) {
                      for (l = i - 1; 0 < l; l--) {
                        o = f[this.rtl ? i - 1 - l : l] + o
                        var a = this.score ? this.score(e, f, p, o, l) : je(g, u, p, i, l)
                        be(this, h, o, a, t, n)
                      }
                      o = ""
                    }
                  case "forward":
                    if (1 < i) {
                      for (l = 0; l < i; l++)
                        ((o += f[this.rtl ? i - 1 - l : l]), be(this, h, o, s, t, n))
                      break
                    }
                  default:
                    if ((be(this, h, f, s, t, n), r && 1 < u && p < u - 1)) {
                      for (
                        i = R(),
                          o = this.U,
                          s = f,
                          l = Math.min(r + 1, this.rtl ? p + 1 : u - p),
                          i[s] = 1,
                          a = 1;
                        a < l;
                        a++
                      )
                        if ((f = e[this.rtl ? u - 1 - p - a : p + a]) && !i[f]) {
                          i[f] = 1
                          let d = this.score
                              ? this.score(e, s, p, f, a - 1)
                              : je(o + (u / 2 > o ? 0 : 1), u, p, l - 1, a - 1),
                            m = this.bidirectional && f > s
                          be(this, c, m ? s : f, d, t, n, m ? f : s)
                        }
                    }
                }
              }
            }
            this.fastupdate || this.reg.add(t)
          } else e = ""
        }
        return (this.db && (e || this.commit_task.push({ del: t }), this.T && Sn(this)), this)
      }
      K.prototype.search = function (t, e, n) {
        n ||
          (e || typeof t != "object"
            ? typeof e == "object" && ((n = e), (e = 0))
            : ((n = t), (t = "")))
        let r = [],
          i,
          s,
          o,
          l = 0,
          a,
          u,
          c,
          h,
          g
        ;(n
          ? ((t = n.query || t),
            (e = n.limit || e),
            (l = n.offset || 0),
            (s = n.context),
            (o = n.suggest),
            (g = (a = n.resolve !== !1) && n.enrich),
            (c = n.boost),
            (h = n.resolution),
            (u = this.db && n.tag))
          : (a = this.resolve),
          (s = this.depth && s !== !1))
        let p = this.encoder.encode(t, !s)
        if (((i = p.length), (e = e || (a ? 100 : 0)), i === 1))
          return on.call(this, p[0], "", e, l, a, g, u)
        if (i === 2 && s && !o) return on.call(this, p[1], p[0], e, l, a, g, u)
        let f = R(),
          d = 0,
          m
        if (
          (s && ((m = p[0]), (d = 1)), h || h === 0 || (h = m ? this.U : this.resolution), this.db)
        ) {
          if (this.db.search && ((t = this.db.search(this, p, e, l, o, a, g, u)), t !== !1))
            return t
          let y = this
          return (async function () {
            for (let E, B; d < i; d++) {
              if ((B = p[d]) && !f[B]) {
                if (((f[B] = 1), (E = await St(y, B, m, 0, 0, !1, !1)), (E = an(E, r, o, h)))) {
                  r = E
                  break
                }
                m && ((o && E && r.length) || (m = B))
              }
              o &&
                m &&
                d === i - 1 &&
                !r.length &&
                ((h = y.resolution), (m = ""), (d = -1), (f = R()))
            }
            return sn(r, h, e, l, o, c, a)
          })()
        }
        for (let y, E; d < i; d++) {
          if ((E = p[d]) && !f[E]) {
            if (((f[E] = 1), (y = St(this, E, m, 0, 0, !1, !1)), (y = an(y, r, o, h)))) {
              r = y
              break
            }
            m && ((o && y && r.length) || (m = E))
          }
          o &&
            m &&
            d === i - 1 &&
            !r.length &&
            ((h = this.resolution), (m = ""), (d = -1), (f = R()))
        }
        return sn(r, h, e, l, o, c, a)
      }
      D = K.prototype
      D.mount = function (t) {
        return (
          this.commit_timer && (clearTimeout(this.commit_timer), (this.commit_timer = null)),
          t.mount(this)
        )
      }
      D.commit = function (t, e) {
        return (
          this.commit_timer && (clearTimeout(this.commit_timer), (this.commit_timer = null)),
          this.db.commit(this, t, e)
        )
      }
      D.destroy = function () {
        return (
          this.commit_timer && (clearTimeout(this.commit_timer), (this.commit_timer = null)),
          this.db.destroy()
        )
      }
      D.clear = function () {
        return (
          this.map.clear(),
          this.ctx.clear(),
          this.reg.clear(),
          this.cache && this.cache.clear(),
          this.db &&
            (this.commit_timer && clearTimeout(this.commit_timer),
            (this.commit_timer = null),
            (this.commit_task = [{ clear: !0 }])),
          this
        )
      }
      D.append = function (t, e) {
        return this.add(t, e, !0)
      }
      D.contain = function (t) {
        return this.db ? this.db.has(t) : this.reg.has(t)
      }
      D.update = function (t, e) {
        let n = this,
          r = this.remove(t)
        return r && r.then ? r.then(() => n.add(t, e)) : this.add(t, e)
      }
      D.cleanup = function () {
        return this.fastupdate ? (Ie(this.map), this.depth && Ie(this.ctx), this) : this
      }
      D.searchCache = Fn
      D.export = function (t, e, n = 0, r = 0) {
        let i, s
        switch (r) {
          case 0:
            ;((i = "reg"), (s = hn(this.reg)))
            break
          case 1:
            ;((i = "cfg"), (s = null))
            break
          case 2:
            ;((i = "map"), (s = Mt(this.map, this.reg.size)))
            break
          case 3:
            ;((i = "ctx"), (s = un(this.ctx, this.reg.size)))
            break
          default:
            return
        }
        return We.call(this, t, e, i, s, n, r)
      }
      D.import = function (t, e) {
        if (e)
          switch (
            (typeof e == "string" && (e = JSON.parse(e)),
            (t = t.split(".")),
            t[t.length - 1] === "json" && t.pop(),
            t.length === 3 && t.shift(),
            (t = 1 < t.length ? t[1] : t[0]),
            t)
          ) {
            case "reg":
              ;((this.fastupdate = !1), (this.reg = gn(e, this.reg)))
              break
            case "map":
              this.map = xt(e, this.map)
              break
            case "ctx":
              this.ctx = cn(e, this.ctx)
          }
      }
      D.serialize = function (t = !0) {
        let e = "",
          n = "",
          r = ""
        if (this.reg.size) {
          let s
          for (var i of this.reg.keys())
            (s || (s = typeof i), (e += (e ? "," : "") + (s === "string" ? '"' + i + '"' : i)))
          ;((e = "index.reg=new Set([" + e + "]);"),
            (n = Qt(this.map, s)),
            (n = "index.map=new Map([" + n + "]);"))
          for (let o of this.ctx.entries()) {
            i = o[0]
            let l = Qt(o[1], s)
            ;((l = "new Map([" + l + "])"),
              (l = '["' + i + '",' + l + "]"),
              (r += (r ? "," : "") + l))
          }
          r = "index.ctx=new Map([" + r + "]);"
        }
        return t ? "function inject(index){" + e + n + r + "}" : e + n + r
      }
      At(K.prototype)
      ;((An =
        typeof window < "u" &&
        (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB)),
        (Xe = ["map", "ctx", "tag", "reg", "cfg"]),
        (ie = R()))
      D = Ye.prototype
      D.mount = function (t) {
        return t.index ? t.mount(this) : ((t.db = this), this.open())
      }
      D.open = function () {
        if (this.db) return this.db
        let t = this
        ;(navigator.storage && navigator.storage.persist(),
          ie[t.id] || (ie[t.id] = []),
          ie[t.id].push(t.field))
        let e = An.open(t.id, 1)
        return (
          (e.onupgradeneeded = function () {
            let n = (t.db = this.result)
            for (let r = 0, i; r < Xe.length; r++) {
              i = Xe[r]
              for (let s = 0, o; s < ie[t.id].length; s++)
                ((o = ie[t.id][s]),
                  n.objectStoreNames.contains(i + (i !== "reg" && o ? ":" + o : "")) ||
                    n.createObjectStore(i + (i !== "reg" && o ? ":" + o : "")))
            }
          }),
          (t.db = Y(e, function (n) {
            ;((t.db = n),
              (t.db.onversionchange = function () {
                t.close()
              }))
          }))
        )
      }
      D.close = function () {
        ;(this.db && this.db.close(), (this.db = null))
      }
      D.destroy = function () {
        let t = An.deleteDatabase(this.id)
        return Y(t)
      }
      D.clear = function () {
        let t = []
        for (let n = 0, r; n < Xe.length; n++) {
          r = Xe[n]
          for (let i = 0, s; i < ie[this.id].length; i++)
            ((s = ie[this.id][i]), t.push(r + (r !== "reg" && s ? ":" + s : "")))
        }
        let e = this.db.transaction(t, "readwrite")
        for (let n = 0; n < t.length; n++) e.objectStore(t[n]).clear()
        return Y(e)
      }
      D.get = function (t, e, n = 0, r = 0, i = !0, s = !1) {
        t = this.db
          .transaction((e ? "ctx" : "map") + (this.field ? ":" + this.field : ""), "readonly")
          .objectStore((e ? "ctx" : "map") + (this.field ? ":" + this.field : ""))
          .get(e ? e + ":" + t : t)
        let o = this
        return Y(t).then(function (l) {
          let a = []
          if (!l || !l.length) return a
          if (i) {
            if (!n && !r && l.length === 1) return l[0]
            for (let u = 0, c; u < l.length; u++)
              if ((c = l[u]) && c.length) {
                if (r >= c.length) {
                  r -= c.length
                  continue
                }
                let h = n ? r + Math.min(c.length - r, n) : c.length
                for (let g = r; g < h; g++) a.push(c[g])
                if (((r = 0), a.length === n)) break
              }
            return s ? o.enrich(a) : a
          }
          return l
        })
      }
      D.tag = function (t, e = 0, n = 0, r = !1) {
        t = this.db
          .transaction("tag" + (this.field ? ":" + this.field : ""), "readonly")
          .objectStore("tag" + (this.field ? ":" + this.field : ""))
          .get(t)
        let i = this
        return Y(t).then(function (s) {
          return !s || !s.length || n >= s.length
            ? []
            : !e && !n
              ? s
              : ((s = s.slice(n, n + e)), r ? i.enrich(s) : s)
        })
      }
      D.enrich = function (t) {
        typeof t != "object" && (t = [t])
        let e = this.db.transaction("reg", "readonly").objectStore("reg"),
          n = []
        for (let r = 0; r < t.length; r++) n[r] = Y(e.get(t[r]))
        return Promise.all(n).then(function (r) {
          for (let i = 0; i < r.length; i++)
            r[i] = { id: t[i], doc: r[i] ? JSON.parse(r[i]) : null }
          return r
        })
      }
      D.has = function (t) {
        return (
          (t = this.db.transaction("reg", "readonly").objectStore("reg").getKey(t)),
          Y(t).then(function (e) {
            return !!e
          })
        )
      }
      D.search = null
      D.info = function () {}
      D.transaction = function (t, e, n) {
        t += t !== "reg" && this.field ? ":" + this.field : ""
        let r = this.h[t + ":" + e]
        if (r) return n.call(this, r)
        let i = this.db.transaction(t, e)
        this.h[t + ":" + e] = r = i.objectStore(t)
        let s = n.call(this, r)
        return (
          (this.h[t + ":" + e] = null),
          Y(i).finally(function () {
            return ((i = r = null), s)
          })
        )
      }
      D.commit = async function (t, e, n) {
        if (e) (await this.clear(), (t.commit_task = []))
        else {
          let r = t.commit_task
          t.commit_task = []
          for (let i = 0, s; i < r.length; i++)
            if (((s = r[i]), s.clear)) {
              ;(await this.clear(), (e = !0))
              break
            } else r[i] = s.del
          e || (n || (r = r.concat(rr(t.reg))), r.length && (await this.remove(r)))
        }
        t.reg.size &&
          (await this.transaction("map", "readwrite", function (r) {
            for (let i of t.map) {
              let s = i[0],
                o = i[1]
              o.length &&
                (e
                  ? r.put(o, s)
                  : (r.get(s).onsuccess = function () {
                      let l = this.result
                      var a
                      if (l && l.length) {
                        let u = Math.max(l.length, o.length)
                        for (let c = 0, h, g; c < u; c++)
                          if ((g = o[c]) && g.length) {
                            if ((h = l[c]) && h.length) for (a = 0; a < g.length; a++) h.push(g[a])
                            else l[c] = g
                            a = 1
                          }
                      } else ((l = o), (a = 1))
                      a && r.put(l, s)
                    }))
            }
          }),
          await this.transaction("ctx", "readwrite", function (r) {
            for (let i of t.ctx) {
              let s = i[0],
                o = i[1]
              for (let l of o) {
                let a = l[0],
                  u = l[1]
                u.length &&
                  (e
                    ? r.put(u, s + ":" + a)
                    : (r.get(s + ":" + a).onsuccess = function () {
                        let c = this.result
                        var h
                        if (c && c.length) {
                          let g = Math.max(c.length, u.length)
                          for (let p = 0, f, d; p < g; p++)
                            if ((d = u[p]) && d.length) {
                              if ((f = c[p]) && f.length)
                                for (h = 0; h < d.length; h++) f.push(d[h])
                              else c[p] = d
                              h = 1
                            }
                        } else ((c = u), (h = 1))
                        h && r.put(c, s + ":" + a)
                      }))
              }
            }
          }),
          t.store
            ? await this.transaction("reg", "readwrite", function (r) {
                for (let i of t.store) {
                  let s = i[0],
                    o = i[1]
                  r.put(typeof o == "object" ? JSON.stringify(o) : 1, s)
                }
              })
            : t.bypass ||
              (await this.transaction("reg", "readwrite", function (r) {
                for (let i of t.reg.keys()) r.put(1, i)
              })),
          t.tag &&
            (await this.transaction("tag", "readwrite", function (r) {
              for (let i of t.tag) {
                let s = i[0],
                  o = i[1]
                o.length &&
                  (r.get(s).onsuccess = function () {
                    let l = this.result
                    ;((l = l && l.length ? l.concat(o) : o), r.put(l, s))
                  })
              }
            })),
          t.map.clear(),
          t.ctx.clear(),
          t.tag && t.tag.clear(),
          t.store && t.store.clear(),
          t.document || t.reg.clear())
      }
      D.remove = function (t) {
        return (
          typeof t != "object" && (t = [t]),
          Promise.all([
            this.transaction("map", "readwrite", function (e) {
              e.openCursor().onsuccess = function () {
                let n = this.result
                n && yt(n, t)
              }
            }),
            this.transaction("ctx", "readwrite", function (e) {
              e.openCursor().onsuccess = function () {
                let n = this.result
                n && yt(n, t)
              }
            }),
            this.transaction("tag", "readwrite", function (e) {
              e.openCursor().onsuccess = function () {
                let n = this.result
                n && yt(n, t, !0)
              }
            }),
            this.transaction("reg", "readwrite", function (e) {
              for (let n = 0; n < t.length; n++) e.delete(t[n])
            }),
          ])
        )
      }
      Mn = {
        Index: K,
        Charset: vn,
        Encoder: De,
        Document: ae,
        Worker: ye,
        Resolver: M,
        IndexedDB: Ye,
        Language: {},
      }
    })
  function Ln(t, e, n) {
    let r = bn(t),
      i = e.split(/\s+/).filter((a) => a !== ""),
      s = 0,
      o = i.length - 1
    if (n) {
      let a = (g) => r.some((p) => g.toLowerCase().startsWith(p.toLowerCase())),
        u = i.map(a),
        c = 0,
        h = 0
      for (let g = 0; g < Math.max(i.length - Qe, 0); g++) {
        let f = u.slice(g, g + Qe).reduce((d, m) => d + (m ? 1 : 0), 0)
        f >= c && ((c = f), (h = g))
      }
      ;((s = Math.max(h - Qe, 0)), (o = Math.min(s + 2 * Qe, i.length - 1)), (i = i.slice(s, o)))
    }
    let l = i
      .map((a) => {
        for (let u of r)
          if (a.toLowerCase().includes(u.toLowerCase())) {
            let c = new RegExp(u.toLowerCase(), "gi")
            return a.replace(c, '<span class="highlight">$&</span>')
          }
        return a
      })
      .join(" ")
    return `${s === 0 ? "" : "..."}${l}${o === i.length - 1 ? "" : "..."}`
  }
  function Fr(t, e) {
    let n = new DOMParser(),
      r = bn(t),
      i = n.parseFromString(e.innerHTML, "text/html"),
      s = (l) => {
        let a = document.createElement("span")
        return ((a.className = "highlight"), (a.textContent = l), a)
      },
      o = (l, a) => {
        if (l.nodeType === Node.TEXT_NODE) {
          let u = l.nodeValue ?? "",
            c = new RegExp(a.toLowerCase(), "gi"),
            h = u.match(c)
          if (!h || h.length === 0) return
          let g = document.createElement("span"),
            p = 0
          for (let f of h) {
            let d = u.indexOf(f, p)
            ;(g.appendChild(document.createTextNode(u.slice(p, d))),
              g.appendChild(s(f)),
              (p = d + f.length))
          }
          ;(g.appendChild(document.createTextNode(u.slice(p))), l.parentNode?.replaceChild(g, l))
        } else if (l.nodeType === Node.ELEMENT_NODE) {
          if (l.classList.contains("highlight")) return
          Array.from(l.childNodes).forEach((u) => o(u, a))
        }
      }
    for (let l of r) o(i.body, l)
    return i.body
  }
  async function vr(t, e, n) {
    let r = t.querySelector(".search-container")
    if (!r) return
    let i = r.closest(".sidebar"),
      s = t.querySelector(".search-button")
    if (!s) return
    let o = t.querySelector(".search-bar")
    if (!o) return
    let l = t.querySelector(".search-layout")
    if (!l) return
    let a = Object.keys(n),
      u = (C) => {
        l.appendChild(C)
      },
      c = l.dataset.preview === "true",
      h,
      g,
      p = document.createElement("div")
    ;((p.className = "results-container"),
      u(p),
      c && ((h = document.createElement("div")), (h.className = "preview-container"), u(h)))
    function f() {
      ;(r.classList.remove("active"),
        (o.value = ""),
        i && (i.style.zIndex = ""),
        xe(p),
        h && xe(h),
        l.classList.remove("display-results"),
        (q = "basic"),
        s.focus())
    }
    function d(C) {
      ;((q = C), i && (i.style.zIndex = "1"), r.classList.add("active"), o.focus())
    }
    let m = null
    async function y(C) {
      if (C.key === "k" && (C.ctrlKey || C.metaKey) && !C.shiftKey) {
        ;(C.preventDefault(), r.classList.contains("active") ? f() : d("basic"))
        return
      } else if (C.shiftKey && (C.ctrlKey || C.metaKey) && C.key.toLowerCase() === "k") {
        ;(C.preventDefault(), r.classList.contains("active") ? f() : d("tags"), (o.value = "#"))
        return
      }
      if ((m && m.classList.remove("focus"), !!r.classList.contains("active"))) {
        if (C.key === "Enter")
          if (p.contains(document.activeElement)) {
            let F = document.activeElement
            if (F.classList.contains("no-match")) return
            ;(await I(F), F.click())
          } else {
            let F = document.getElementsByClassName("result-card")[0]
            if (!F || F.classList.contains("no-match")) return
            ;(await I(F), F.click())
          }
        else if (C.key === "ArrowUp" || (C.shiftKey && C.key === "Tab")) {
          if ((C.preventDefault(), p.contains(document.activeElement))) {
            let F = m || document.activeElement,
              A = F?.previousElementSibling
            ;(F?.classList.remove("focus"), A?.focus(), A && (m = A), await I(A))
          }
        } else if (
          (C.key === "ArrowDown" || C.key === "Tab") &&
          (C.preventDefault(), document.activeElement === o || m !== null)
        ) {
          let F = m || document.getElementsByClassName("result-card")[0],
            A = F?.nextElementSibling
          ;(F?.classList.remove("focus"), A?.focus(), A && (m = A), await I(A))
        }
      }
    }
    let E = (C, F) => {
      let A = a[F]
      return {
        id: F,
        slug: A,
        title: q === "tags" ? n[A].title : Ln(C, n[A].title ?? ""),
        content: Ln(C, n[A].content ?? "", !0),
        tags: B(C.substring(1), n[A].tags),
      }
    }
    function B(C, F) {
      return !F || q !== "tags"
        ? []
        : F.map((A) =>
            A.toLowerCase().includes(C.toLowerCase())
              ? `<li><p class="match-tag">#${A}</p></li>`
              : `<li><p>#${A}</p></li>`,
          ).slice(0, Er)
    }
    function x(C) {
      return new URL(Vt(e, C), location.toString())
    }
    let v = ({ slug: C, title: F, content: A, tags: G }) => {
      let $ = G.length > 0 ? `<ul class="tags">${G.join("")}</ul>` : "",
        w = document.createElement("a")
      ;(w.classList.add("result-card"),
        (w.id = C),
        (w.href = x(C).toString()),
        (w.innerHTML = `
      <h3 class="card-title">${F}</h3>
      ${$}
      <p class="card-description">${A}</p>
    `),
        w.addEventListener("click", (k) => {
          k.altKey || k.ctrlKey || k.metaKey || k.shiftKey || f()
        }))
      let J = (k) => {
        k.altKey || k.ctrlKey || k.metaKey || k.shiftKey || f()
      }
      async function Z(k) {
        if (!k.target) return
        let Bn = k.target
        await I(Bn)
      }
      return (
        w.addEventListener("mouseenter", Z),
        window.addCleanup(() => w.removeEventListener("mouseenter", Z)),
        w.addEventListener("click", J),
        window.addCleanup(() => w.removeEventListener("click", J)),
        w
      )
    }
    async function T(C) {
      if (
        (xe(p),
        C.length === 0
          ? (p.innerHTML = `<a class="result-card no-match">
          <h3>No results.</h3>
          <p>Try another search term?</p>
      </a>`)
          : p.append(...C.map(v)),
        C.length === 0 && h)
      )
        xe(h)
      else {
        let F = p.firstElementChild
        ;(F.classList.add("focus"), (m = F), await I(F))
      }
    }
    async function z(C) {
      if (Tt.has(C)) return Tt.get(C)
      let F = x(C).toString(),
        A = await fetch(F)
          .then((G) => G.text())
          .then((G) => {
            if (G === void 0) throw new Error(`Could not fetch ${F}`)
            let $ = yr.parseFromString(G ?? "", "text/html")
            return (Wt($, F), [...$.getElementsByClassName("popover-hint")])
          })
      return (Tt.set(C, A), A)
    }
    async function I(C) {
      if (!l || !c || !C || !h) return
      let F = C.id,
        A = await z(F).then(($) => $.flatMap((w) => [...Fr(_, w).children]))
      ;((g = document.createElement("div")),
        g.classList.add("preview-inner"),
        g.append(...A),
        h.replaceChildren(g),
        [...h.getElementsByClassName("highlight")]
          .sort(($, w) => w.innerHTML.length - $.innerHTML.length)[0]
          ?.scrollIntoView({ block: "start" }))
    }
    async function U(C) {
      if (!l || !Oe) return
      ;((_ = C.target.value),
        l.classList.toggle("display-results", _ !== ""),
        (q = _.startsWith("#") ? "tags" : "basic"))
      let F
      if (q === "tags") {
        _ = _.substring(1).trim()
        let w = _.indexOf(" ")
        if (w != -1) {
          let J = _.substring(0, w),
            Z = _.substring(w + 1).trim()
          F = await Oe.searchAsync({
            query: Z,
            limit: Math.max(Je, 1e4),
            index: ["title", "content"],
            tag: J,
          })
          for (let k of F) k.result = k.result.slice(0, Je)
          ;((q = "basic"), (_ = Z))
        } else F = await Oe.searchAsync({ query: _, limit: Je, index: ["tags"] })
      } else
        q === "basic" &&
          (F = await Oe.searchAsync({ query: _, limit: Je, index: ["title", "content"] }))
      let A = (w) => {
          let J = F.filter((Z) => Z.field === w)
          return J.length === 0 ? [] : [...J[0].result]
        },
        $ = [...new Set([...A("title"), ...A("content"), ...A("tags")])].map((w) => E(_, w))
      await T($)
    }
    ;(document.addEventListener("keydown", y),
      window.addCleanup(() => document.removeEventListener("keydown", y)),
      s.addEventListener("click", () => d("basic")),
      window.addCleanup(() => s.removeEventListener("click", () => d("basic"))),
      o.addEventListener("input", U),
      window.addCleanup(() => o.removeEventListener("input", U)),
      Ke(r, f),
      await Sr(n))
  }
  async function Sr(t) {
    if (Tn) return
    let e = 0,
      n = []
    for (let [r, i] of Object.entries(t))
      n.push(Oe.addAsync(e++, { id: e, slug: r, title: i.title, content: i.content, tags: i.tags }))
    ;(await Promise.all(n), (Tn = !0))
  }
  var q,
    _,
    Dr,
    Oe,
    yr,
    Tt,
    Qe,
    Je,
    Er,
    bn,
    Tn,
    wn = b(() => {
      "use strict"
      xn()
      dt()
      pt()
      ;((q = "basic"),
        (_ = ""),
        (Dr = (t) => t.toLowerCase().split(/([^a-z]|[^\x00-\x7F])/)),
        (Oe = new Mn.Document({
          charset: "latin:extra",
          encode: Dr,
          document: {
            id: "id",
            tag: "tags",
            index: [
              { field: "title", tokenize: "forward" },
              { field: "content", tokenize: "forward" },
              { field: "tags", tokenize: "forward" },
            ],
          },
        })),
        (yr = new DOMParser()),
        (Tt = new Map()),
        (Qe = 30),
        (Je = 8),
        (Er = 5),
        (bn = (t) => {
          let e = t.split(/\s+/).filter((r) => r.trim() !== ""),
            n = e.length
          if (n > 1) for (let r = 1; r < n; r++) e.push(e.slice(0, r + 1).join(" "))
          return e.sort((r, i) => i.length - r.length)
        }))
      Tn = !1
      document.addEventListener("nav", async (t) => {
        let e = t.detail.url,
          n = await fetchData,
          r = document.getElementsByClassName("search")
        for (let i of r) await vr(i, e, n)
      })
    })
  var Q,
    Ze,
    Be,
    os,
    Rn = b(() => {
      "use strict"
      gt()
      pt()
      dt()
      wn()
      ;((Q = new Map()),
        (Ze = null),
        (Be = class t extends He {
          currentSlug = null
          static SELECTORS = {
            SEARCH_ROOT: ".search",
            SEARCH_INPUT: ".search-bar",
            SEARCH_BUTTON: ".search-button",
            SEARCH_CONTAINER_ACTIVE: ".search-container.active",
          }
          constructor() {
            super({ name: "Search", debug: !0, cacheConfig: { prefix: "search", ttl: 18e5 } })
          }
          findComponentElements() {
            return Array.from(document.querySelectorAll(t.SELECTORS.SEARCH_ROOT))
          }
          async onInitialize() {
            ;((this.state.elements = new Set()),
              (this.state.currentSlug = ft(window)),
              (this.currentSlug = this.state.currentSlug),
              this.log("Current slug:", this.currentSlug),
              this.schedulePreload())
          }
          onSetupEventListeners() {
            ;(Ke(document.documentElement, () => {
              this.handleEscapeKey()
            }),
              this.addEventListener(document, "keydown", (e) => {
                e.key === "k" &&
                  (e.ctrlKey || e.metaKey) &&
                  !e.shiftKey &&
                  (e.preventDefault(), this.activateFirstSearchElement())
              }))
          }
          onSetupPage(e) {
            if (((this.currentSlug = ft(window)), e.length === 0)) {
              this.log("No search elements found on this page")
              return
            }
            ;(e.forEach((n) => {
              this.setupSearchElement(n)
            }),
              this.log(`Setup completed for ${e.length} search elements`))
          }
          onCleanup() {
            ;(Q.clear(), (Ze = null), this.log("Search component cleanup completed"))
          }
          setupSearchElement(e) {
            if (Q.has(e)) {
              this.log("Search element already setup, skipping")
              return
            }
            let n = e.querySelector(t.SELECTORS.SEARCH_INPUT),
              r = e.querySelector(t.SELECTORS.SEARCH_BUTTON)
            ;(n && this.setupInputTriggers(e, n),
              r && this.setupIconTrigger(e, r),
              Q.set(e, !1),
              this.log("Search element setup completed"))
          }
          setupInputTriggers(e, n) {
            let r = () => {
              ;(this.initializeSearchElement(e), this.removeInputTriggers(n, r))
            }
            ;(this.addEventListener(n, "focus", r),
              this.addEventListener(n, "input", r),
              this.addCleanupTask(() => {
                this.removeInputTriggers(n, r)
              }))
          }
          removeInputTriggers(e, n) {
            ;(e.removeEventListener("focus", n), e.removeEventListener("input", n))
          }
          setupIconTrigger(e, n) {
            let r = () => {
              ;(this.initializeSearchElement(e), n.removeEventListener("click", r))
            }
            ;(this.addEventListener(n, "click", r),
              this.addCleanupTask(() => {
                n.removeEventListener("click", r)
              }))
          }
          async initializeSearchElement(e) {
            if (!Q.get(e)) {
              Q.set(e, !0)
              try {
                let n = await this.loadSearchModule(),
                  r = this.state.currentSlug,
                  i = await window.fetchData
                ;(await (void 0)(i),
                  await (void 0)(e, r, i),
                  Q.set(e, !1),
                  this.log("Search element initialized successfully"))
              } catch (n) {
                ;(console.error("Search initialization failed:", n), Q.set(e, !1))
              }
            }
          }
          async loadSearchModule() {
            return (Ze || (Ze = Promise.resolve().then(() => (In(), Ar))), Ze)
          }
          schedulePreload() {
            "requestIdleCallback" in window
              ? requestIdleCallback(() => {
                  this.loadSearchModule().catch(() => {
                    this.log("Search module preload failed (silent)")
                  })
                })
              : setTimeout(() => {
                  this.loadSearchModule().catch(() => {
                    this.log("Search module preload failed (silent)")
                  })
                }, 3e3)
          }
          handleEscapeKey() {
            ;(document.querySelectorAll(t.SELECTORS.SEARCH_ROOT).forEach((n) => {
              n.classList.remove("active")
              let r = n.querySelector(t.SELECTORS.SEARCH_INPUT)
              r && ((r.value = ""), r.blur())
            }),
              this.log("ESC key handled, closed active searches"))
          }
          activateFirstSearchElement() {
            let e = this.findComponentElements()
            if (e.length > 0) {
              this.initializeSearchElement(e[0])
              let n = e[0].querySelector(t.SELECTORS.SEARCH_ROOT)
              n && n.classList.add("active")
              let r = e[0].querySelector(t.SELECTORS.SEARCH_INPUT)
              ;(r && r.focus(), this.log("Activated first search element via shortcut"))
            }
          }
          getSearchStats() {
            return {
              loadingElements: Array.from(Q.values()).filter((n) => n).length,
              totalElements: this.state.elements?.size || 0,
              cacheHits: 0,
            }
          }
        }),
        (os = new Be()))
    })
  var Ar = {}
  var On,
    In = b(() => {
      gt()
      Rn()
      On = new Be()
      Pe.register("search", On)
      On.initialize().catch((t) => {
        console.error("Search component initialization failed:", t)
      })
    })
  In()
})()
