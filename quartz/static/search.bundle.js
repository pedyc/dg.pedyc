"use strict"
;(() => {
  var Dr = Object.create
  var Pe = Object.defineProperty
  var yr = Object.getOwnPropertyDescriptor
  var Er = Object.getOwnPropertyNames
  var Fr = Object.getPrototypeOf,
    Sr = Object.prototype.hasOwnProperty
  var b = (t, e) => () => (t && (e = t((t = 0))), e)
  var dt = (t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports),
    vr = (t, e) => {
      for (var r in e) Pe(t, r, { get: e[r], enumerable: !0 })
    },
    Ar = (t, e, r, n) => {
      if ((e && typeof e == "object") || typeof e == "function")
        for (let i of Er(e))
          !Sr.call(t, i) &&
            i !== r &&
            Pe(t, i, { get: () => e[i], enumerable: !(n = yr(e, i)) || n.enumerable })
      return t
    }
  var mt = (t, e, r) => (
    (r = t != null ? Dr(Fr(t)) : {}),
    Ar(e || !t || !t.__esModule ? Pe(r, "default", { value: t, enumerable: !0 }) : r, t)
  )
  var Ke,
    $e,
    je = b(() => {
      "use strict"
      ;((Ke = class t {
        static instance = null
        CACHE_PREFIXES = { content: "content_", link: "link_", search: "search_" }
        constructor() {}
        static getInstance() {
          return (t.instance || (t.instance = new t()), t.instance)
        }
        processURL(e, r = {}) {
          let {
            removeHash: n = !0,
            normalizePath: i = !0,
            validate: s = !0,
            cacheType: o = "content",
          } = r
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
            n && (u = u.split("#")[0])
            let a = new URL(u)
            i && (a.pathname = this.normalizePath(a.pathname))
            let l = this.generateCacheKey(a.toString(), o)
            return (
              console.debug(`[URLHandler Debug] Cache Key: ${l}`),
              { original: e, processed: a, cacheKey: l, isValid: !0 }
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
          let r = this.processURL(e, {
            removeHash: !0,
            normalizePath: !0,
            validate: !0,
            cacheType: "content",
          })
          if (!r.isValid) throw new Error(`Invalid URL: ${e} - ${r.error}`)
          return r.processed
        }
        getCacheKey(e, r = "content") {
          return this.processURL(e, { cacheType: r }).cacheKey
        }
        processBatch(e, r = {}) {
          return e.map((n) => this.processURL(n, r))
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
          let r = e.split("/").filter(Boolean),
            n = [],
            i = new Set()
          for (let o of r) i.has(o) || (i.add(o), n.push(o))
          return "/" + n.join("/")
        }
        generateCacheKey(e, r) {
          let n = encodeURIComponent(e)
          return `${this.CACHE_PREFIXES[r]}${n}`
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
            let r = new URL(e)
            return !(
              [".pdf", ".zip", ".rar", ".7z", ".tar", ".gz"].some((i) =>
                r.pathname.toLowerCase().endsWith(i),
              ) ||
              r.pathname.startsWith("/api/") ||
              r.pathname.startsWith("/admin/") ||
              (r.pathname === window.location.pathname && r.hash)
            )
          } catch {
            return !1
          }
        }
        isSamePage(e) {
          return e.origin === window.location.origin && e.pathname === window.location.pathname
        }
      }),
        ($e = Ke.getInstance()))
    })
  var j,
    v,
    ln,
    cn,
    hn,
    gn,
    fn,
    pn,
    re,
    Ct,
    dn,
    mn,
    Cn,
    xe = b(() => {
      "use strict"
      je()
      G()
      ;((j = (t) =>
        t
          ? t
              .toLowerCase()
              .replace(F.CONVENTIONS.FORBIDDEN_CHARS, "")
              .replace(/\s+/g, F.SEPARATOR)
              .replace(/_+/g, F.SEPARATOR)
              .replace(/^_|_$/g, "")
              .substring(0, F.CONVENTIONS.MAX_LENGTH)
          : ""),
        (v = {
          generateContentKey: (t, e) => {
            let r = $e.processURL(t, { cacheType: "content" })
            if (!r.isValid)
              return (
                console.warn(`Invalid URL for cache key generation: ${t}`),
                `${F.PREFIXES.CONTENT}invalid_${j(t)}`
              )
            let n = r.cacheKey
            return e ? `${n}${F.SEPARATOR}${e}` : n
          },
          generateSearchKey: (t, e) => {
            let r = j(t)
            return e ? `${F.PREFIXES.SEARCH}${r}${F.SEPARATOR}${j(e)}` : `${F.PREFIXES.SEARCH}${r}`
          },
          generateUserKey: (t, e) => {
            let r = j(t)
            return e ? `${F.PREFIXES.USER}${e}${F.SEPARATOR}${r}` : `${F.PREFIXES.USER}${r}`
          },
          generateFontKey: (t, e) => {
            let r = j(t)
            return e ? `${F.PREFIXES.FONT}${r}${F.SEPARATOR}${e}` : `${F.PREFIXES.FONT}${r}`
          },
          generateSystemKey: (t, e) => {
            let r = j(t)
            return e ? `${F.PREFIXES.SYSTEM}${r}${F.SEPARATOR}${j(e)}` : `${F.PREFIXES.SYSTEM}${r}`
          },
          identifyType: (t) => {
            let e = Object.entries(F.PREFIXES)
            for (let [r, n] of e) if (t.startsWith(n)) return r
            return null
          },
          extractOriginalKey: (t) => {
            let e = Object.values(F.PREFIXES)
            for (let r of e) if (t.startsWith(r)) return t.substring(r.length)
            return t
          },
          generateStorageKey: (t, e) =>
            v.identifyType(t)
              ? t
              : `${{ MEMORY: F.PREFIXES.CONTENT, SESSION: F.PREFIXES.CONTENT }[e] || F.PREFIXES.CONTENT}${t}`,
          validateKeyFormat: (t) => {
            let e = [],
              r = []
            return (
              (!t || t.length === 0) &&
                (e.push("\u952E\u4E0D\u80FD\u4E3A\u7A7A"),
                r.push("\u63D0\u4F9B\u4E00\u4E2A\u975E\u7A7A\u7684\u952E")),
              t.length > F.CONVENTIONS.MAX_LENGTH &&
                (e.push(`\u952E\u8FC7\u957F: ${t.length} > ${F.CONVENTIONS.MAX_LENGTH}`),
                r.push("\u7F29\u77ED\u952E\u540D\u6216\u4F7F\u7528\u54C8\u5E0C\u503C")),
              F.CONVENTIONS.FORBIDDEN_CHARS.test(t) &&
                (e.push("\u952E\u5305\u542B\u7981\u7528\u5B57\u7B26"),
                r.push("\u79FB\u9664\u952E\u4E2D\u7684\u7279\u6B8A\u5B57\u7B26")),
              v.identifyType(t) ||
                (e.push("\u952E\u7F3A\u5C11\u5FC5\u9700\u7684\u524D\u7F00"),
                r.push("\u4E3A\u952E\u6DFB\u52A0\u9002\u5F53\u7684\u524D\u7F00")),
              { isValid: e.length === 0, issues: e, suggestions: r }
            )
          },
          parseKey: (t) => {
            let e = v.identifyType(t),
              r = Object.values(F.PREFIXES).find((s) => t.startsWith(s)) || null,
              n = v.extractOriginalKey(t),
              i = v.validateKeyFormat(t)
            return { original: n, type: e, prefix: r, isValid: i.isValid }
          },
        }),
        ({
          generateContentKey: ln,
          generateSearchKey: cn,
          generateUserKey: hn,
          generateFontKey: gn,
          generateSystemKey: fn,
          identifyType: pn,
          extractOriginalKey: re,
          generateStorageKey: Ct,
          validateKeyFormat: dn,
          parseKey: mn,
        } = v),
        (Cn = {
          identifyType: v.identifyType,
          extractOriginalKey: v.extractOriginalKey,
          generateStorageKey: v.generateStorageKey,
          validateKey: v.validateKeyFormat,
          parseKey: v.parseKey,
        }))
    })
  function ne(t) {
    return yt[t] || yt.DEFAULT
  }
  var F,
    yt,
    be,
    Te,
    En,
    Et,
    Fn,
    z,
    G = b(() => {
      "use strict"
      xe()
      ;((F = {
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
        (yt = {
          CONTENT: {
            capacity: 200,
            ttl: 15 * 60 * 1e3,
            maxMemoryMB: 30,
            warningThreshold: 160,
            description:
              "\u7EDF\u4E00\u5185\u5BB9\u7F13\u5B58\uFF0C\u652F\u6301\u9875\u9762\u548C\u5F39\u7A97\u5185\u5BB9",
            keyPrefix: F.PREFIXES.CONTENT,
            cleanupIntervalMs: 3 * 60 * 1e3,
            memoryThreshold: 0.85,
          },
          LINK: {
            capacity: 1e3,
            ttl: 60 * 60 * 1e3,
            maxMemoryMB: 15,
            warningThreshold: 800,
            description: "\u94FE\u63A5\u6709\u6548\u6027\u548C\u5931\u8D25\u94FE\u63A5\u7F13\u5B58",
            keyPrefix: F.PREFIXES.LINK,
            cleanupIntervalMs: 10 * 60 * 1e3,
            memoryThreshold: 0.8,
          },
          SEARCH: {
            capacity: 500,
            ttl: 60 * 60 * 1e3,
            maxMemoryMB: 50,
            warningThreshold: 400,
            description: "\u641C\u7D22\u7ED3\u679C\u548C\u5185\u5BB9\u9884\u89C8\u7F13\u5B58",
            keyPrefix: F.PREFIXES.SEARCH,
            cleanupIntervalMs: 5 * 60 * 1e3,
            memoryThreshold: 0.8,
          },
          USER: {
            capacity: 100,
            ttl: 24 * 60 * 60 * 1e3,
            maxMemoryMB: 5,
            warningThreshold: 80,
            description: "\u7528\u6237\u504F\u597D\u548C\u8BBE\u7F6E\u7F13\u5B58",
            keyPrefix: F.PREFIXES.USER,
            cleanupIntervalMs: 30 * 60 * 1e3,
            memoryThreshold: 0.9,
          },
          SYSTEM: {
            capacity: 200,
            ttl: 60 * 60 * 1e3,
            maxMemoryMB: 10,
            warningThreshold: 160,
            description: "\u7CFB\u7EDF\u7EC4\u4EF6\u548C\u914D\u7F6E\u7F13\u5B58",
            keyPrefix: F.PREFIXES.SYSTEM,
            cleanupIntervalMs: 15 * 60 * 1e3,
            memoryThreshold: 0.8,
          },
          DEFAULT: {
            capacity: 100,
            ttl: 10 * 60 * 1e3,
            maxMemoryMB: 5,
            warningThreshold: 80,
            description: "\u9ED8\u8BA4\u7F13\u5B58\u914D\u7F6E",
            keyPrefix: F.PREFIXES.SYSTEM,
            cleanupIntervalMs: 5 * 60 * 1e3,
            memoryThreshold: 0.8,
          },
        }),
        (be = {
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
        (Te = {
          LARGE_CONTENT_SIZE: 1024 * 1024,
          HUGE_CONTENT_SIZE: 5 * 1024 * 1024,
          MAX_MEMORY_USAGE: 50 * 1024 * 1024,
          MEMORY_CLEANUP_THRESHOLD: 0.8,
          SESSION_CLEANUP_THRESHOLD: 0.9,
          MAX_REFERENCE_COUNT: 1e3,
          HASH_COLLISION_THRESHOLD: 10,
        }),
        (En = {
          MAX_KEY_LENGTH: 256,
          FORBIDDEN_CHARS: /[\s<>:"/\\|?*]/,
          REQUIRED_PREFIX: !0,
          MIN_CONTENT_LENGTH: 1,
          MAX_CONTENT_LENGTH: 10 * 1024 * 1024,
          KEY_FORMAT_REGEX: /^[a-z0-9_-]+$/,
        }),
        (Et = {
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
      ;((Fn = {
        content: v.generateContentKey,
        search: v.generateSearchKey,
        font: v.generateFontKey,
        user: v.generateUserKey,
        system: v.generateSystemKey,
      }),
        (z = {
          ENABLE_MONITORING: !0,
          MONITOR_INTERVAL: 5 * 60 * 1e3,
          REPORT_INTERVAL: 30 * 60 * 1e3,
          CONSOLE_WARNINGS: !0,
          ENABLE_KEY_VALIDATION: !0,
        }))
    })
  var he,
    Ge,
    ge,
    We = b(() => {
      "use strict"
      G()
      ;((he = class {
        constructor(e, r, n = null, i = null) {
          this.key = e
          this.value = r
          this.prev = n
          this.next = i
        }
      }),
        (Ge = class {
          constructor(e) {
            this.capacity = e
            ;((this.head = new he("__head__", {})),
              (this.tail = new he("__tail__", {})),
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
            let r = this.cache.get(e)
            return r ? (this.moveToHead(r), r.value) : null
          }
          set(e, r) {
            let n = this.cache.get(e)
            if (n) return ((n.value = r), this.moveToHead(n), null)
            let i = new he(e, r),
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
            let r = this.cache.get(e)
            return r ? (this.removeNode(r), this.cache.delete(e), r.value) : null
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
        (ge = class {
          cache
          config
          currentMemoryUsage = 0
          totalHits = 0
          totalRequests = 0
          cleanupInterval = null
          constructor(e) {
            let r = Object.fromEntries(Object.entries(e).filter(([, i]) => i !== void 0)),
              n = ne("DEFAULT")
            ;((this.config = {
              capacity: n.capacity,
              ttl: n.ttl,
              maxMemoryMB: n.maxMemoryMB,
              warningThreshold: n.warningThreshold,
              description: n.description,
              keyPrefix: n.keyPrefix,
              cleanupIntervalMs: n.cleanupIntervalMs,
              memoryThreshold: n.memoryThreshold,
              ...r,
            }),
              (this.cache = new Ge(this.config.capacity)),
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
                if (Array.isArray(e)) return e.reduce((r, n) => r + this.estimateSize(n), 24)
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
          set(e, r, n = 30 * 60 * 1e3) {
            try {
              let i = this.estimateSize(r),
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
              let o = { data: r, timestamp: Date.now(), ttl: n, size: i, accessCount: 0 },
                u = this.cache.set(e, o)
              if ((u && (this.currentMemoryUsage -= u.value.size), u))
                this.currentMemoryUsage -= u.value.size
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
              let r = this.cache.get(e)
              if (!r) return null
              if (Date.now() - r.timestamp > r.ttl) return (this.delete(e), null)
              let n = { ...r, accessCount: r.accessCount + 1 }
              return (this.cache.set(e, n), this.totalHits++, r.data)
            } catch (r) {
              return (
                console.error(`\u83B7\u53D6\u7F13\u5B58\u9879\u5931\u8D25\uFF0C\u952E: ${e}`, r),
                null
              )
            }
          }
          has(e) {
            try {
              let r = this.cache.get(e)
              return r ? (Date.now() - r.timestamp > r.ttl ? (this.delete(e), !1) : !0) : !1
            } catch (r) {
              return (
                console.error(`\u68C0\u67E5\u7F13\u5B58\u9879\u5931\u8D25\uFF0C\u952E: ${e}`, r),
                !1
              )
            }
          }
          delete(e) {
            try {
              let r = this.cache.delete(e)
              return r ? ((this.currentMemoryUsage -= r.size), !0) : !1
            } catch (r) {
              return (
                console.error(`\u5220\u9664\u7F13\u5B58\u9879\u5931\u8D25\uFF0C\u952E: ${e}`, r),
                !1
              )
            }
          }
          cleanup() {
            try {
              let e = Date.now(),
                r = this.config.maxMemoryMB * 1024 * 1024,
                n = r * this.config.memoryThreshold,
                i = 0,
                s = 0,
                o = []
              for (let u of this.cache.keys()) {
                let a = this.cache.get(u)
                a && e - a.timestamp > a.ttl && o.push(u)
              }
              for (let u of o) {
                let a = this.cache.delete(u)
                a && ((s += a.size), (this.currentMemoryUsage -= a.size), i++)
              }
              if (this.currentMemoryUsage > n) {
                let u = this.cache
                  .values()
                  .map((a, l) => ({
                    key: this.cache.keys()[l],
                    item: a,
                    priority: a.size / Math.max(a.accessCount, 1),
                  }))
                  .sort((a, l) => l.priority - a.priority)
                for (let { key: a } of u) {
                  if (this.currentMemoryUsage <= n) break
                  let l = this.cache.delete(a)
                  l && ((s += l.size), (this.currentMemoryUsage -= l.size), i++)
                }
              }
              i > 0 &&
                console.log(
                  `\u7F13\u5B58\u6E05\u7406\u5B8C\u6210\uFF1A\u79FB\u9664 ${i} \u9879\uFF0C\u91CA\u653E ${(s / 1024).toFixed(2)} KB \u5185\u5B58\uFF0C\u5F53\u524D\u4F7F\u7528\u7387: ${((this.currentMemoryUsage / r) * 100).toFixed(1)}%`,
                )
            } catch (e) {
              console.error("\u7F13\u5B58\u6E05\u7406\u5931\u8D25:", e)
            }
          }
          getStats() {
            let e = this.config.maxMemoryMB * 1024 * 1024,
              r = this.totalRequests > 0 ? this.totalHits / this.totalRequests : 0
            return {
              size: this.cache.size,
              memoryUsage: this.currentMemoryUsage,
              maxMemoryUsage: e,
              memoryUsagePercentage: this.currentMemoryUsage / e,
              hitRate: r,
              keys: this.cache.keys(),
            }
          }
          getConfig() {
            return { ...this.config }
          }
          getItemInfo(e) {
            try {
              let r = this.cache.get(e)
              if (!r) return null
              let n = Date.now() - r.timestamp > r.ttl
              return { ...r, isExpired: n }
            } catch (r) {
              return (
                console.error(
                  `\u83B7\u53D6\u7F13\u5B58\u9879\u4FE1\u606F\u5931\u8D25\uFF0C\u952E: ${e}`,
                  r,
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
  var fe,
    Ve = b(() => {
      "use strict"
      fe = class {
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
        setTimeout(e, r) {
          let n = window.setTimeout(() => {
            ;(this.timers.delete(n), e())
          }, r)
          return this.registerTimer(n)
        }
        setInterval(e, r) {
          let n = window.setInterval(e, r)
          return this.registerTimer(n)
        }
        addEventListener(e, r, n, i) {
          this.eventListeners.some((o) => o.element === e && o.type === r && o.listener === n) ||
            (e.addEventListener(r, n, i),
            this.eventListeners.push({ element: e, type: r, listener: n, options: i }))
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
        removeEventListener(e, r, n, i) {
          e.removeEventListener(r, n, i)
          let s = this.eventListeners.findIndex(
            (o) => o.element === e && o.type === r && o.listener === n,
          )
          s !== -1 && this.eventListeners.splice(s, 1)
        }
        abortController(e) {
          this.abortControllers.has(e) && (e.abort(), this.abortControllers.delete(e))
        }
        getStats() {
          let e = {}
          this.observers.forEach((n) => {
            let i = n.constructor.name
            e[i] = (e[i] || 0) + 1
          })
          let r = {}
          return (
            this.eventListeners.forEach(({ type: n }) => {
              r[n] = (r[n] || 0) + 1
            }),
            {
              observers: this.observers.size,
              timers: this.timers.size,
              eventListeners: this.eventListeners.length,
              abortControllers: this.abortControllers.size,
              details: { observerTypes: e, eventTypes: r },
            }
          )
        }
        cleanupObserversAndListeners() {
          ;(this.observers.forEach((e) => {
            try {
              e.disconnect()
            } catch (r) {
              console.error("\u6E05\u7406\u89C2\u5BDF\u5668\u65F6\u51FA\u9519:", r)
            }
          }),
            this.observers.clear(),
            this.timers.forEach((e) => {
              try {
                ;(clearTimeout(e), clearInterval(e))
              } catch (r) {
                console.error("\u6E05\u7406\u5B9A\u65F6\u5668\u65F6\u51FA\u9519:", r)
              }
            }),
            this.timers.clear(),
            this.eventListeners.forEach(({ element: e, type: r, listener: n, options: i }) => {
              try {
                e.removeEventListener(r, n, i)
              } catch (s) {
                console.error("\u6E05\u7406\u4E8B\u4EF6\u76D1\u542C\u5668\u65F6\u51FA\u9519:", s)
              }
            }),
            (this.eventListeners.length = 0),
            this.abortControllers.forEach((e) => {
              try {
                e.abort()
              } catch (r) {
                console.error("\u6E05\u7406 AbortController \u65F6\u51FA\u9519:", r)
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
            r = [window, document],
            n = []
          ;(this.eventListeners.forEach(({ element: i, type: s, listener: o, options: u }) => {
            if (e.includes(s) && r.some((a) => a === i))
              (n.push({ element: i, type: s, listener: o, options: u }),
                console.log(
                  `[SPA DEBUG] \u4FDD\u7559\u5173\u952E\u4E8B\u4EF6\u76D1\u542C\u5668: ${s} on ${i.constructor.name}`,
                ))
            else
              try {
                ;(i.removeEventListener(s, o, u),
                  console.log(
                    `[SPA DEBUG] \u6E05\u7406\u975E\u5173\u952E\u4E8B\u4EF6\u76D1\u542C\u5668: ${s} on ${i.constructor.name}`,
                  ))
              } catch (a) {
                console.error("\u6E05\u7406\u4E8B\u4EF6\u76D1\u542C\u5668\u65F6\u51FA\u9519:", a)
              }
          }),
            (this.eventListeners.length = 0),
            this.eventListeners.push(...n),
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
              } catch (r) {
                console.error("\u6267\u884C\u6E05\u7406\u4EFB\u52A1\u65F6\u51FA\u9519:", r)
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
            eventListeners: this.eventListeners.map(({ element: e, type: r }) => ({
              element: e.constructor.name,
              type: r,
            })),
            abortControllers: this.abortControllers.size,
          }
        }
      }
    })
  var pe,
    Xe = b(() => {
      "use strict"
      G()
      pe = class t {
        static config = ne("DEFAULT")
        static DEFAULT_QUOTA = Te.MAX_MEMORY_USAGE
        static async checkStorageQuota(e) {
          try {
            if (navigator.storage?.estimate) {
              let n = await navigator.storage.estimate(),
                i = n.usage || 0,
                s = n.quota || this.DEFAULT_QUOTA
              return { used: i, total: s, percentage: s > 0 ? i / s : 0, available: s - i }
            }
          } catch (n) {
            console.warn("\u65E0\u6CD5\u83B7\u53D6\u5B58\u50A8\u914D\u989D\u4FE1\u606F:", n)
          }
          let r = this.calculateStorageSize(e)
          return {
            used: r,
            total: this.DEFAULT_QUOTA,
            percentage: r / this.DEFAULT_QUOTA,
            available: this.DEFAULT_QUOTA - r,
          }
        }
        static calculateStorageSize(e) {
          let r = 0
          try {
            for (let n = 0; n < e.length; n++) {
              let i = e.key(n)
              if (i) {
                let s = e.getItem(i)
                r += (i.length + (s?.length || 0)) * 2
              }
            }
          } catch (n) {
            console.warn("\u65E0\u6CD5\u4F30\u7B97\u5B58\u50A8\u5927\u5C0F:", n)
          }
          return r
        }
        static async safeSetItem(e, r, n) {
          return (await this.checkAndCleanupIfNeeded(e), this.attemptSetItem(e, r, n))
        }
        static async checkAndCleanupIfNeeded(e) {
          try {
            let r = await this.checkStorageQuota(e),
              n = this.config.memoryThreshold || 0.9
            r.percentage > n &&
              (z.CONSOLE_WARNINGS &&
                console.warn(
                  "\u5B58\u50A8\u914D\u989D\u5373\u5C06\u8017\u5C3D\uFF0C\u6267\u884C\u6E05\u7406...",
                ),
              this.cleanupStorage(e),
              (await this.checkStorageQuota(e)).percentage > n &&
                (z.CONSOLE_WARNINGS &&
                  console.warn(
                    "\u6E05\u7406\u540E\u914D\u989D\u4ECD\u7136\u4E0D\u8DB3\uFF0C\u6267\u884C\u7D27\u6025\u6E05\u7406...",
                  ),
                this.emergencyCleanup(e)))
          } catch (r) {
            z.CONSOLE_WARNINGS && console.warn("\u914D\u989D\u68C0\u67E5\u5931\u8D25:", r)
          }
        }
        static attemptSetItem(e, r, n) {
          try {
            return (e.setItem(r, n), !0)
          } catch (i) {
            return i instanceof DOMException && i.name === "QuotaExceededError"
              ? this.handleQuotaExceeded(e, r, n)
              : (console.error("\u8BBE\u7F6E\u5B58\u50A8\u9879\u5931\u8D25:", i), !1)
          }
        }
        static handleQuotaExceeded(e, r, n) {
          ;(console.warn(
            "\u5B58\u50A8\u914D\u989D\u8D85\u9650\uFF0C\u5C1D\u8BD5\u6E05\u7406\u540E\u91CD\u8BD5...",
          ),
            this.cleanupStorage(e))
          try {
            return (e.setItem(r, n), !0)
          } catch {
            ;(console.warn(
              "\u6E05\u7406\u540E\u91CD\u8BD5\u4ECD\u5931\u8D25\uFF0C\u6267\u884C\u7D27\u6025\u6E05\u7406...",
            ),
              this.emergencyCleanup(e))
            try {
              return (e.setItem(r, n), !0)
            } catch (s) {
              return (console.error("\u6700\u7EC8\u8BBE\u7F6E\u5931\u8D25:", s), !1)
            }
          }
        }
        static safeGetItem(e, r) {
          try {
            return e.getItem(r)
          } catch (n) {
            return (console.error("\u83B7\u53D6\u5B58\u50A8\u9879\u5931\u8D25:", n), null)
          }
        }
        static safeRemoveItem(e, r) {
          try {
            e.removeItem(r)
          } catch (n) {
            console.error("\u79FB\u9664\u5B58\u50A8\u9879\u5931\u8D25:", n)
          }
        }
        static cleanupStorage(e) {
          try {
            let r = this.findExpiredKeys(e)
            ;(this.removeKeys(e, r),
              z.CONSOLE_WARNINGS &&
                r.length > 0 &&
                console.log(`\u6E05\u7406\u4E86 ${r.length} \u4E2A\u8FC7\u671F\u9879\u76EE`))
          } catch (r) {
            z.CONSOLE_WARNINGS && console.error("\u6E05\u7406\u5B58\u50A8\u5931\u8D25:", r)
          }
        }
        static findExpiredKeys(e) {
          let r = [],
            n = Date.now()
          for (let i = 0; i < e.length; i++) {
            let s = e.key(i)
            if (!s || !Object.values(F.PREFIXES).some((a) => s.startsWith(a))) continue
            let u = e.getItem(s)
            u && this.isExpiredItem(u, n) && r.push(s)
          }
          return r
        }
        static isExpiredItem(e, r) {
          try {
            let n = JSON.parse(e)
            if (n && typeof n == "object" && n.timestamp) {
              let i = r - n.timestamp,
                s = (this.config.ttl || 24 * 60 * 60) * 1e3
              return i > s
            }
          } catch {
            let n = new Blob([e]).size,
              i = (this.config.maxMemoryMB || Te.LARGE_CONTENT_SIZE / 1024) * 1024
            return n > i
          }
          return !1
        }
        static removeKeys(e, r) {
          r.forEach((n) => {
            try {
              e.removeItem(n)
            } catch (i) {
              console.warn(`\u5220\u9664\u952E ${n} \u5931\u8D25:`, i)
            }
          })
        }
        static emergencyCleanup(e) {
          try {
            let r = [],
              n = this.config.keyPrefix || "sys_"
            for (let s = 0; s < e.length; s++) {
              let o = e.key(s)
              o && o.startsWith(n) && r.push(o)
            }
            let i = Math.ceil(r.length / 2)
            for (let s = 0; s < i; s++) e.removeItem(r[s])
            z.CONSOLE_WARNINGS &&
              console.warn(
                `\u7D27\u6025\u6E05\u7406\uFF1A\u79FB\u9664\u4E86 ${i} \u4E2A\u5B58\u50A8\u9879`,
              )
          } catch (r) {
            z.CONSOLE_WARNINGS && console.error("\u7D27\u6025\u6E05\u7406\u5931\u8D25:", r)
          }
        }
        async setSessionItem(e, r) {
          return t.safeSetItem(sessionStorage, e, r)
        }
        getSessionItem(e) {
          return t.safeGetItem(sessionStorage, e)
        }
        removeSessionItem(e) {
          t.safeRemoveItem(sessionStorage, e)
        }
        async setLocalItem(e, r) {
          return t.safeSetItem(localStorage, e, r)
        }
        getLocalItem(e) {
          return t.safeGetItem(localStorage, e)
        }
        removeLocalItem(e) {
          t.safeRemoveItem(localStorage, e)
        }
        async setItem(e, r, n) {
          return e === "local" ? this.setLocalItem(r, n) : this.setSessionItem(r, n)
        }
        getItem(e, r) {
          return e === "local" ? this.getLocalItem(r) : this.getSessionItem(r)
        }
        removeItem(e, r) {
          return e === "local" ? this.removeLocalItem(r) : this.removeSessionItem(r)
        }
        getStorageStats() {
          let e = (r) => {
            let n = 0,
              i = 0,
              s = t.config.keyPrefix || "sys_"
            for (let u = 0; u < r.length; u++) {
              let a = r.key(u)
              if (a && a.startsWith(s)) {
                let l = r.getItem(a)
                l && ((n += new Blob([a + l]).size), i++)
              }
            }
            let o = (t.config.capacity || Te.HUGE_CONTENT_SIZE / (1024 * 1024)) * 1024 * 1024
            return { used: n, available: Math.max(0, o - n), itemCount: i }
          }
          return { localStorage: e(localStorage), sessionStorage: e(sessionStorage) }
        }
        cleanupAllStorage() {
          let e = Date.now(),
            r = (t.config.cleanupIntervalMs || 60) * 60 * 1e3,
            n = parseInt(this.getItem("local", "last_cleanup") || "0")
          e - n < r ||
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
            r = {
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
          return Promise.resolve(r)
        }
      }
    })
  var de,
    Ye = b(() => {
      "use strict"
      G()
      xe()
      de = class t {
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
        constructor(e, r) {
          ;(console.log("UnifiedContentCacheManager constructor"),
            (this.memoryCache = e),
            (this.storageManager = r),
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
              r = (n, i, s) => {
                if (!n) {
                  console.warn(
                    `[UnifiedCache] ${s}Storage \u4E0D\u53EF\u7528\uFF0C\u8DF3\u8FC7\u521D\u59CB\u5316\u3002`,
                  )
                  return
                }
                for (let o = 0; o < n.length; o++) {
                  let u = n.key(o)
                  if (!u || !v.identifyType(u)) continue
                  let l = n.getItem(u)
                  if (!l) continue
                  let c = re(u)
                  if (!c || this.referenceMap.has(c)) continue
                  let h = {
                    storageLayer: i,
                    storageKey: u,
                    refCount: 0,
                    lastAccessed: Date.now(),
                    size: this.calculateSize(l),
                  }
                  this.referenceMap.set(c, h)
                  let g = this.calculateHash(l)
                  ;(this.contentHashMap.has(g) || this.contentHashMap.set(g, c), e[i]++)
                }
              }
            ;(r(window.sessionStorage, "SESSION", "session"),
              r(window.localStorage, "LOCAL", "local"),
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
          let r = re(e),
            n = this.referenceMap.get(r)
          if (!n) {
            if (
              (console.log(
                `[UnifiedCache] Cache miss for key: ${e}, originalKey: ${r}. referenceMap size: ${this.referenceMap.size}`,
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
              let i = this.referenceMap.get(r)
              if (i) return this.getContentFromReference(r, i)
            }
            return null
          }
          return this.getContentFromReference(r, n)
        }
        getContentFromReference(e, r) {
          ;((r.lastAccessed = Date.now()), r.refCount++)
          let n = null
          switch (r.storageLayer) {
            case "MEMORY":
              ;((n = this.memoryCache.get(r.storageKey) || null), n && this.stats.memoryHits++)
              break
            case "SESSION":
              ;((n = this.storageManager.getSessionItem(r.storageKey)),
                n && this.stats.sessionHits++)
              break
            case "LOCAL":
              ;((n = this.storageManager.getLocalItem(r.storageKey)), n && this.stats.localHits++)
              break
          }
          return (n || this.referenceMap.delete(e), n)
        }
        forceReinitializeFromStorage() {
          ;(this.referenceMap.clear(), this.contentHashMap.clear(), this.initializeFromStorage())
        }
        set(e, r, n = void 0) {
          let i = re(e),
            s = this.calculateHash(r),
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
          let u = this.selectOptimalLayer(r, n),
            a = Ct(e, u)
          if (this.storeContent(a, r, u)) {
            let c = {
              storageLayer: u,
              storageKey: a,
              refCount: 1,
              lastAccessed: Date.now(),
              size: this.calculateSize(r),
            }
            ;(this.referenceMap.set(i, c), this.contentHashMap.set(s, i))
          }
        }
        delete(e) {
          let r = re(e),
            n = this.referenceMap.get(r)
          if (!n) return !1
          if ((n.refCount--, n.refCount <= 0)) {
            this.deleteFromStorage(n.storageKey, n.storageLayer)
            for (let [i, s] of this.contentHashMap.entries())
              if (s === r) {
                this.contentHashMap.delete(i)
                break
              }
          }
          return (this.referenceMap.delete(r), !0)
        }
        has(e) {
          let r = re(e)
          return this.referenceMap.has(r)
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
            r = [],
            n = Et.MEMORY_CHECK_INTERVAL
          for (let [i, s] of this.referenceMap.entries()) e - s.lastAccessed > n && r.push(i)
          ;(r.forEach((i) => this.delete(i)),
            r.length > 0 &&
              console.log(`[UnifiedCache] Cleaned up ${r.length} expired cache entries`))
        }
        selectOptimalLayer(e, r) {
          let n = this.calculateSize(e),
            i = be.MEMORY,
            s = be.SESSION,
            o = be.LOCAL,
            u = [r, "MEMORY", "SESSION", "LOCAL"].filter(Boolean),
            a = [...new Set(u)]
          for (let l of a)
            switch (l) {
              case "MEMORY":
                if (n < i.maxSizeKB * 1024) return "MEMORY"
                break
              case "SESSION":
                if (n < s.maxSizeKB * 1024) return "SESSION"
                break
              case "LOCAL":
                if (n < o.maxSizeKB * 1024) return "LOCAL"
                break
            }
          return "MEMORY"
        }
        storeContent(e, r, n) {
          try {
            switch (n) {
              case "MEMORY":
                return (this.memoryCache.set(e, r), !0)
              case "SESSION":
                return (this.storageManager.setSessionItem(e, r), !0)
              case "LOCAL":
                return (this.storageManager.setLocalItem(e, r), !0)
              default:
                return !1
            }
          } catch (i) {
            return (console.warn(`[UnifiedCache] Failed to store content in ${n}:`, i), !1)
          }
        }
        deleteFromStorage(e, r) {
          try {
            switch (r) {
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
          } catch (n) {
            console.warn(`[UnifiedCache] Failed to delete from ${r}:`, n)
          }
        }
        calculateHash(e) {
          let r = 0
          for (let n = 0; n < e.length; n++) {
            let i = e.charCodeAt(n)
            ;((r = (r << 5) - r + i), (r = r & r))
          }
          return r.toString(36)
        }
        calculateSize(e) {
          return new Blob([e]).size
        }
        calculateTotalMemoryUsage() {
          let e = 0
          for (let r of this.referenceMap.values()) e += r.size
          return e
        }
        validateCacheKey(e) {
          let r = [],
            n = [],
            i = this.referenceMap.get(e)
          if (!i)
            return (
              r.push(`No reference found for key: ${e}`),
              n.push("Check if the key was properly stored"),
              { isValid: !1, issues: r, suggestions: n }
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
              (r.push(`Content not found in ${i.storageLayer} layer with key: ${i.storageKey}`),
              n.push("The reference exists but the actual content is missing")),
            { isValid: s, issues: r, suggestions: n }
          )
        }
        repairCacheReference(e) {
          if (this.validateCacheKey(e).isValid) return !0
          this.referenceMap.delete(e)
          for (let [n, i] of this.contentHashMap.entries())
            if (i === e) {
              this.contentHashMap.delete(n)
              break
            }
          return !1
        }
        getCacheDiagnostics(e) {
          let r = this.referenceMap.get(e),
            n = this.validateCacheKey(e),
            i = {
              memory: this.memoryCache.has(e),
              session: this.storageManager.getSessionItem(e) !== null,
              local: this.storageManager.getLocalItem(e) !== null,
            }
          return {
            key: e,
            reference: r,
            validation: n,
            storageLayerInfo: i,
            availableKeys: Array.from(this.referenceMap.keys()),
          }
        }
        static resetSingleton() {
          t._initialized = !1
        }
      }
    })
  var me,
    qe = b(() => {
      "use strict"
      me = class {
        managers = new Map()
        register(e, r) {
          this.managers.set(e, r)
        }
        unregister(e) {
          this.managers.delete(e)
        }
        cleanup() {
          this.managers.forEach((e, r) => {
            try {
              e.cleanup()
            } catch (n) {
              console.error(`Error during cleanup of ${r}:`, n)
            }
          })
        }
        getAllStats() {
          let e = {}
          return (
            this.managers.forEach((r, n) => {
              r.getStats && (e[n] = r.getStats())
            }),
            e
          )
        }
        clear() {
          this.managers.clear()
        }
      }
    })
  var Qe,
    W,
    se,
    H,
    V,
    Re = b(() => {
      "use strict"
      Je()
      we()
      ;((Qe = class {
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
              ((this._unifiedContentCache = L.createUnifiedContentCacheManager(
                ie.globalUnifiedContentCache,
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
              ((this._urlCacheManager = L.createCacheManager(ie.urlCacheManager)),
              console.log("[GlobalManagers] Initialized UrlCacheManager")),
            this._urlCacheManager
          )
        }
        get failedLinksManager() {
          return (
            this._failedLinksManager ||
              ((this._failedLinksManager = L.createCacheManager(ie.failedLinksManager)),
              console.log("[GlobalManagers] Initialized FailedLinksManager")),
            this._failedLinksManager
          )
        }
        get storageManager() {
          return (
            this._storageManager ||
              ((this._storageManager = L.createStorageManager(ie.globalStorageManager)),
              console.log("[GlobalManagers] Initialized StorageManager")),
            this._storageManager
          )
        }
        get resourceManager() {
          return (
            this._resourceManager ||
              ((this._resourceManager = L.createResourceManager(ie.globalResourceManager)),
              console.log("[GlobalManagers] Initialized ResourceManager")),
            this._resourceManager
          )
        }
        get cleanupManager() {
          return (
            this._cleanupManager ||
              ((this._cleanupManager = L.getCleanupManager()),
              console.log("[GlobalManagers] Initialized CleanupManager")),
            this._cleanupManager
          )
        }
        createCache(e) {
          return L.createCacheManager({ type: "CACHE", identifier: e, config: { cacheType: e } })
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
            L.cleanup(),
            console.log("[GlobalManagers] All global manager instances cleaned up"))
        }
        destroy() {
          ;(console.log("[GlobalManagers] Destroying all global manager instances..."),
            L.destroy(),
            (this._initialized = !1),
            Object.keys(this).forEach((e) => {
              e.startsWith("_") && (this[e] = null)
            }),
            (this._initialized = !1),
            console.log("[GlobalManagers] All global manager instances destroyed"))
        }
      }),
        (W = class {
          static _instance = new Qe()
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
          static getInstance(e, r) {
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
        (se = {
          get instance() {
            return W.instance.storageManager
          },
        }),
        (H = {
          get instance() {
            return W.instance.resourceManager
          },
        }),
        (V = {
          get instance() {
            return W.instance.defaultCache
          },
        }))
    })
  var we = b(() => {
    "use strict"
    Re()
    X()
  })
  var L,
    ie,
    Je = b(() => {
      "use strict"
      We()
      Ve()
      Xe()
      Ye()
      qe()
      we()
      G()
      Re()
      ;((L = class {
        static instances = new Map()
        static cleanupManager = null
        static _createAndRegisterManager(e, r, n) {
          let i = `${e.type}_${e.identifier || "default"}`
          if (this.instances.has(i)) return this.instances.get(i)
          let s = r()
          return (
            this.instances.set(i, s),
            this.getCleanupManager().register(i, s),
            console.log(`[ManagerFactory] Created ${n}: ${i}`),
            s
          )
        }
        static createCacheManager(e) {
          return this._createAndRegisterManager(
            e,
            () => {
              let r = e.config?.cacheType || "DEFAULT",
                i = {
                  ...ne(r),
                  ...(e.config?.configOverride || {}),
                  enableMemoryLayer: e.config?.enableMemoryLayer ?? !0,
                  enableSessionLayer: e.config?.enableSessionLayer ?? !1,
                }
              return new ge(i)
            },
            "CacheManager",
          )
        }
        static createResourceManager(e) {
          return this._createAndRegisterManager(e, () => new fe(), "ResourceManager")
        }
        static createStorageManager(e) {
          return this._createAndRegisterManager(e, () => new pe(), "StorageManager")
        }
        static createUnifiedContentCacheManager(e) {
          return this._createAndRegisterManager(
            e,
            () => {
              let r = V.instance,
                n = se.instance
              return new de(r, n)
            },
            "UnifiedContentCacheManager",
          )
        }
        static getCleanupManager() {
          return (
            this.cleanupManager ||
              ((this.cleanupManager = new me()),
              console.log("[ManagerFactory] Created CleanupManager singleton")),
            this.cleanupManager
          )
        }
        static cleanup() {
          ;(console.log("[ManagerFactory] Cleaning up all registered manager instances..."),
            this.instances.forEach((e, r) => {
              if (e && typeof e.cleanup == "function")
                try {
                  ;(e.cleanup(), console.log(`[ManagerFactory] Cleaned up instance: ${r}`))
                } catch (n) {
                  console.error(`[ManagerFactory] Error cleaning up instance ${r}:`, n)
                }
            }),
            console.log("[ManagerFactory] All registered manager instances cleaned up."))
        }
        static destroy() {
          ;(console.log("[ManagerFactory] Destroying all registered manager instances..."),
            this.instances.forEach((e, r) => {
              if (e && typeof e.destroy == "function")
                try {
                  ;(e.destroy(), console.log(`[ManagerFactory] Destroyed instance: ${r}`))
                } catch (n) {
                  console.error(`[ManagerFactory] Error destroying instance ${r}:`, n)
                }
              else if (e && typeof e.cleanup == "function")
                try {
                  ;(e.cleanup(),
                    console.log(`[ManagerFactory] Cleaned up (as destroy) instance: ${r}`))
                } catch (n) {
                  console.error(`[ManagerFactory] Error cleaning up (as destroy) instance ${r}:`, n)
                }
            }),
            this.instances.clear(),
            (this.cleanupManager = null),
            console.log(
              "[ManagerFactory] All registered manager instances destroyed and registry cleared.",
            ))
        }
        static getInstance(e, r = "default") {
          let n = `${e}_${r}`
          return this.instances.get(n) || null
        }
        static hasInstance(e, r = "default") {
          let n = `${e}_${r}`
          return this.instances.has(n)
        }
        static removeInstance(e, r = "default") {
          let n = `${e}_${r}`
          if (this.instances.has(n)) {
            let i = this.instances.get(n)
            if (
              (this.cleanupManager && this.cleanupManager.unregister(n),
              i && typeof i.cleanup == "function")
            )
              try {
                i.cleanup()
              } catch (s) {
                console.error(`[ManagerFactory] Error cleaning up ${n}:`, s)
              }
            return (
              this.instances.delete(n),
              console.log(`[ManagerFactory] Removed instance: ${n}`),
              !0
            )
          }
          return !1
        }
        static getStats() {
          let e = {}
          for (let r of this.instances.keys()) {
            let n = r.split("_")[0]
            e[n] = (e[n] || 0) + 1
          }
          return {
            totalInstances: this.instances.size,
            hasCleanupManager: this.cleanupManager !== null,
            instanceKeys: Array.from(this.instances.keys()),
            instancesByType: e,
          }
        }
      }),
        (ie = {
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
  var X = b(() => {
    "use strict"
    We()
    Ve()
    Xe()
    Ye()
    qe()
    Je()
    Re()
  })
  var vt = b(() => {})
  var mi,
    At = b(() => {
      vt()
      mi = Object.hasOwnProperty
    })
  var xt = dt((Di, Mt) => {
    "use strict"
    Mt.exports = Ir
    function oe(t) {
      return t instanceof Buffer
        ? Buffer.from(t)
        : new t.constructor(t.buffer.slice(), t.byteOffset, t.length)
    }
    function Ir(t) {
      if (((t = t || {}), t.circles)) return Or(t)
      let e = new Map()
      if (
        (e.set(Date, (o) => new Date(o)),
        e.set(Map, (o, u) => new Map(n(Array.from(o), u))),
        e.set(Set, (o, u) => new Set(n(Array.from(o), u))),
        t.constructorHandlers)
      )
        for (let o of t.constructorHandlers) e.set(o[0], o[1])
      let r = null
      return t.proto ? s : i
      function n(o, u) {
        let a = Object.keys(o),
          l = new Array(a.length)
        for (let c = 0; c < a.length; c++) {
          let h = a[c],
            g = o[h]
          typeof g != "object" || g === null
            ? (l[h] = g)
            : g.constructor !== Object && (r = e.get(g.constructor))
              ? (l[h] = r(g, u))
              : ArrayBuffer.isView(g)
                ? (l[h] = oe(g))
                : (l[h] = u(g))
        }
        return l
      }
      function i(o) {
        if (typeof o != "object" || o === null) return o
        if (Array.isArray(o)) return n(o, i)
        if (o.constructor !== Object && (r = e.get(o.constructor))) return r(o, i)
        let u = {}
        for (let a in o) {
          if (Object.hasOwnProperty.call(o, a) === !1) continue
          let l = o[a]
          typeof l != "object" || l === null
            ? (u[a] = l)
            : l.constructor !== Object && (r = e.get(l.constructor))
              ? (u[a] = r(l, i))
              : ArrayBuffer.isView(l)
                ? (u[a] = oe(l))
                : (u[a] = i(l))
        }
        return u
      }
      function s(o) {
        if (typeof o != "object" || o === null) return o
        if (Array.isArray(o)) return n(o, s)
        if (o.constructor !== Object && (r = e.get(o.constructor))) return r(o, s)
        let u = {}
        for (let a in o) {
          let l = o[a]
          typeof l != "object" || l === null
            ? (u[a] = l)
            : l.constructor !== Object && (r = e.get(l.constructor))
              ? (u[a] = r(l, s))
              : ArrayBuffer.isView(l)
                ? (u[a] = oe(l))
                : (u[a] = s(l))
        }
        return u
      }
    }
    function Or(t) {
      let e = [],
        r = [],
        n = new Map()
      if (
        (n.set(Date, (a) => new Date(a)),
        n.set(Map, (a, l) => new Map(s(Array.from(a), l))),
        n.set(Set, (a, l) => new Set(s(Array.from(a), l))),
        t.constructorHandlers)
      )
        for (let a of t.constructorHandlers) n.set(a[0], a[1])
      let i = null
      return t.proto ? u : o
      function s(a, l) {
        let c = Object.keys(a),
          h = new Array(c.length)
        for (let g = 0; g < c.length; g++) {
          let p = c[g],
            f = a[p]
          if (typeof f != "object" || f === null) h[p] = f
          else if (f.constructor !== Object && (i = n.get(f.constructor))) h[p] = i(f, l)
          else if (ArrayBuffer.isView(f)) h[p] = oe(f)
          else {
            let d = e.indexOf(f)
            d !== -1 ? (h[p] = r[d]) : (h[p] = l(f))
          }
        }
        return h
      }
      function o(a) {
        if (typeof a != "object" || a === null) return a
        if (Array.isArray(a)) return s(a, o)
        if (a.constructor !== Object && (i = n.get(a.constructor))) return i(a, o)
        let l = {}
        ;(e.push(a), r.push(l))
        for (let c in a) {
          if (Object.hasOwnProperty.call(a, c) === !1) continue
          let h = a[c]
          if (typeof h != "object" || h === null) l[c] = h
          else if (h.constructor !== Object && (i = n.get(h.constructor))) l[c] = i(h, o)
          else if (ArrayBuffer.isView(h)) l[c] = oe(h)
          else {
            let g = e.indexOf(h)
            g !== -1 ? (l[c] = r[g]) : (l[c] = o(h))
          }
        }
        return (e.pop(), r.pop(), l)
      }
      function u(a) {
        if (typeof a != "object" || a === null) return a
        if (Array.isArray(a)) return s(a, u)
        if (a.constructor !== Object && (i = n.get(a.constructor))) return i(a, u)
        let l = {}
        ;(e.push(a), r.push(l))
        for (let c in a) {
          let h = a[c]
          if (typeof h != "object" || h === null) l[c] = h
          else if (h.constructor !== Object && (i = n.get(h.constructor))) l[c] = i(h, u)
          else if (ArrayBuffer.isView(h)) l[c] = oe(h)
          else {
            let g = e.indexOf(h)
            g !== -1 ? (l[c] = r[g]) : (l[c] = u(h))
          }
        }
        return (e.pop(), r.pop(), l)
      }
    }
  })
  var bt,
    Br,
    Tt = b(() => {
      "use strict"
      ;((bt = mt(xt(), 1)), (Br = (0, bt.default)()))
    })
  function Ze(t) {
    return t.document.body.dataset.slug
  }
  function kr(t) {
    let e = wt(zr(t, "index"), !0)
    return e.length === 0 ? "/" : e
  }
  function Nr(t) {
    let e = t
      .split("/")
      .filter((r) => r !== "")
      .slice(0, -1)
      .map((r) => "..")
      .join("/")
    return (e.length === 0 && (e = "."), e)
  }
  function Rt(t, e) {
    return _r(Nr(t), kr(e))
  }
  function _r(...t) {
    if (t.length === 0) return ""
    let e = t
      .filter((r) => r !== "" && r !== "/")
      .map((r) => wt(r))
      .join("/")
    return (
      t[0].startsWith("/") && (e = "/" + e),
      t[t.length - 1].endsWith("/") && (e = e + "/"),
      e
    )
  }
  function Ur(t, e) {
    return t === e || t.endsWith("/" + e)
  }
  function zr(t, e) {
    return (Ur(t, e) && (t = t.slice(0, -e.length)), t)
  }
  function wt(t, e) {
    return (
      t.startsWith("/") && (t = t.substring(1)),
      !e && t.endsWith("/") && (t = t.slice(0, -1)),
      t
    )
  }
  var et = b(() => {
    "use strict"
    At()
    Tt()
    X()
    je()
  })
  var tt = dt(() => {})
  function T(t, e, r) {
    let n = typeof r,
      i = typeof t
    if (n !== "undefined") {
      if (i !== "undefined") {
        if (r) {
          if (i === "function" && n === i)
            return function (u) {
              return t(r(u))
            }
          if (((e = t.constructor), e === r.constructor)) {
            if (e === Array) return r.concat(t)
            if (e === Map) {
              var s = new Map(r)
              for (var o of t) s.set(o[0], o[1])
              return s
            }
            if (e === Set) {
              o = new Set(r)
              for (s of t.values()) o.add(s)
              return o
            }
          }
        }
        return t
      }
      return r
    }
    return i === "undefined" ? e : t
  }
  function A() {
    return Object.create(null)
  }
  function O(t) {
    return typeof t == "string"
  }
  function Fe(t) {
    return typeof t == "object"
  }
  function Hr(t) {
    let e = []
    for (let r of t.keys()) e.push(r)
    return e
  }
  function Se(t, e) {
    if (O(e)) t = t[e]
    else for (let r = 0; t && r < e.length; r++) t = t[e[r]]
    return t
  }
  function Pr(t) {
    let e = 0
    for (let r = 0, n; r < t.length; r++) (n = t[r]) && e < n.length && (e = n.length)
    return e
  }
  function le(t = {}) {
    if (!this || this.constructor !== le) return new le(...arguments)
    if (arguments.length) for (t = 0; t < arguments.length; t++) this.assign(arguments[t])
    else this.assign(t)
  }
  function q(t) {
    ;((t.H = null), t.B.clear(), t.G.clear())
  }
  async function Wr(t) {
    t = t.data
    var e = t.task
    let r = t.id,
      n = t.args
    switch (e) {
      case "init":
        ;((De = t.options || {}),
          (e = t.factory)
            ? (Function("return " + e)()(self),
              (ae = new self.FlexSearch.Index(De)),
              delete self.FlexSearch)
            : (ae = new k(De)),
          postMessage({ id: r }))
        break
      default:
        let i
        ;(e === "export" && (n[1] ? ((n[0] = De.export), (n[2] = 0), (n[3] = 1)) : (n = null)),
          e === "import"
            ? n[0] && ((t = await De.import.call(ae, n[0])), ae.import(n[0], t))
            : (i = n && ae[e].apply(ae, n)) && i.then && (i = await i),
          postMessage(e === "search" ? { id: r, msg: i } : { id: r }))
    }
  }
  function lt(t) {
    ;(ye.call(t, "add"),
      ye.call(t, "append"),
      ye.call(t, "search"),
      ye.call(t, "update"),
      ye.call(t, "remove"))
  }
  function Vr() {
    st = Be = 0
  }
  function ye(t) {
    this[t + "Async"] = function () {
      let e = arguments
      var r = e[e.length - 1]
      let n
      if (
        (typeof r == "function" && ((n = r), delete e[e.length - 1]),
        st
          ? Be || (Be = Date.now() - Ot >= this.priority * this.priority * 3)
          : ((st = setTimeout(Vr, 0)), (Ot = Date.now())),
        Be)
      ) {
        let s = this
        return new Promise((o) => {
          setTimeout(function () {
            o(s[t + "Async"].apply(s, e))
          }, 0)
        })
      }
      let i = this[t].apply(this, e)
      return ((r = i.then ? i : new Promise((s) => s(i))), n && r.then(n), r)
    }
  }
  function ce(t = {}) {
    function e(o) {
      function u(a) {
        a = a.data || a
        let l = a.id,
          c = l && i.h[l]
        c && (c(a.msg), delete i.h[l])
      }
      if (((this.worker = o), (this.h = A()), this.worker))
        return (
          n ? this.worker.on("message", u) : (this.worker.onmessage = u),
          t.config
            ? new Promise(function (a) {
                ;((i.h[++ue] = function () {
                  ;(a(i), 1e9 < ue && (ue = 0))
                }),
                  i.worker.postMessage({ id: ue, task: "init", factory: r, options: t }))
              })
            : (this.worker.postMessage({ task: "init", factory: r, options: t }),
              (this.priority = t.priority || 4),
              this)
        )
    }
    if (!this || this.constructor !== ce) return new ce(t)
    let r = typeof self < "u" ? self._factory : typeof window < "u" ? window._factory : null
    r && (r = r.toString())
    let n = typeof window > "u",
      i = this,
      s = Xr(r, n, t.worker)
    return s.then
      ? s.then(function (o) {
          return e.call(i, o)
        })
      : e.call(this, s)
  }
  function K(t) {
    ce.prototype[t] = function () {
      let e = this,
        r = [].slice.call(arguments)
      var n = r[r.length - 1]
      let i
      return (
        typeof n == "function" && ((i = n), r.pop()),
        (n = new Promise(function (s) {
          ;(t === "export" && typeof r[0] == "function" && (r[0] = null),
            (e.h[++ue] = s),
            e.worker.postMessage({ task: t, id: ue, args: r }))
        })),
        i ? (n.then(i), this) : n
      )
    }
  }
  function Xr(t, e, r) {
    return e
      ? typeof module < "u"
        ? new (tt().Worker)(__dirname + "/worker/node.js")
        : Promise.resolve()
            .then(() => mt(tt()))
            .then(function (n) {
              return new n.Worker(jt.dirname + "/node/node.mjs")
            })
      : t
        ? new window.Worker(
            URL.createObjectURL(
              new Blob(["onmessage=" + Wr.toString()], { type: "text/javascript" }),
            ),
          )
        : new window.Worker(
            typeof r == "string"
              ? r
              : jt.url
                  .replace("/worker.js", "/worker/worker.js")
                  .replace("flexsearch.bundle.module.min.js", "module/worker/worker.js"),
            { type: "module" },
          )
  }
  function ct(t, e = 0) {
    let r = [],
      n = []
    e && (e = ((25e4 / e) * 5e3) | 0)
    for (let i of t.entries()) (n.push(i), n.length === e && (r.push(n), (n = [])))
    return (n.length && r.push(n), r)
  }
  function ht(t, e) {
    e || (e = new Map())
    for (let r = 0, n; r < t.length; r++) ((n = t[r]), e.set(n[0], n[1]))
    return e
  }
  function Gt(t, e = 0) {
    let r = [],
      n = []
    e && (e = ((25e4 / e) * 1e3) | 0)
    for (let i of t.entries())
      (n.push([i[0], ct(i[1])[0]]), n.length === e && (r.push(n), (n = [])))
    return (n.length && r.push(n), r)
  }
  function Wt(t, e) {
    e || (e = new Map())
    for (let r = 0, n, i; r < t.length; r++)
      ((n = t[r]), (i = e.get(n[0])), e.set(n[0], ht(n[1], i)))
    return e
  }
  function Vt(t) {
    let e = [],
      r = []
    for (let n of t.keys()) (r.push(n), r.length === 25e4 && (e.push(r), (r = [])))
    return (r.length && e.push(r), e)
  }
  function Xt(t, e) {
    e || (e = new Set())
    for (let r = 0; r < t.length; r++) e.add(t[r])
    return e
  }
  function ke(t, e, r, n, i, s, o = 0) {
    let u = n && n.constructor === Array
    var a = u ? n.shift() : n
    if (!a) return this.export(t, e, i, s + 1)
    if ((a = t((e ? e + "." : "") + (o + 1) + "." + r, JSON.stringify(a))) && a.then) {
      let l = this
      return a.then(function () {
        return ke.call(l, t, e, r, u ? n : null, i, s, o + 1)
      })
    }
    return ke.call(this, t, e, r, u ? n : null, i, s, o + 1)
  }
  function Bt(t, e) {
    let r = ""
    for (let n of t.entries()) {
      t = n[0]
      let i = n[1],
        s = ""
      for (let o = 0, u; o < i.length; o++) {
        u = i[o] || [""]
        let a = ""
        for (let l = 0; l < u.length; l++)
          a += (a ? "," : "") + (e === "string" ? '"' + u[l] + '"' : u[l])
        ;((a = "[" + a + "]"), (s += (s ? "," : "") + a))
      }
      ;((s = '["' + t + '",[' + s + "]]"), (r += (r ? "," : "") + s))
    }
    return r
  }
  function kt(t, e, r, n) {
    let i = []
    for (let s = 0, o; s < t.index.length; s++)
      if (((o = t.index[s]), e >= o.length)) e -= o.length
      else {
        e = o[n ? "splice" : "slice"](e, r)
        let u = e.length
        if (u && ((i = i.length ? i.concat(e) : e), (r -= u), n && (t.length -= u), !r)) break
        e = 0
      }
    return i
  }
  function Q(t) {
    if (!this || this.constructor !== Q) return new Q(t)
    ;((this.index = t ? [t] : []), (this.length = t ? t.length : 0))
    let e = this
    return new Proxy([], {
      get(r, n) {
        if (n === "length") return e.length
        if (n === "push")
          return function (i) {
            ;(e.index[e.index.length - 1].push(i), e.length++)
          }
        if (n === "pop")
          return function () {
            if (e.length) return (e.length--, e.index[e.index.length - 1].pop())
          }
        if (n === "indexOf")
          return function (i) {
            let s = 0
            for (let o = 0, u, a; o < e.index.length; o++) {
              if (((u = e.index[o]), (a = u.indexOf(i)), 0 <= a)) return s + a
              s += u.length
            }
            return -1
          }
        if (n === "includes")
          return function (i) {
            for (let s = 0; s < e.index.length; s++) if (e.index[s].includes(i)) return !0
            return !1
          }
        if (n === "slice")
          return function (i, s) {
            return kt(e, i || 0, s || e.length, !1)
          }
        if (n === "splice")
          return function (i, s) {
            return kt(e, i || 0, s || e.length, !0)
          }
        if (n === "constructor") return Array
        if (typeof n != "symbol") return (r = e.index[(n / 2 ** 31) | 0]) && r[n]
      },
      set(r, n, i) {
        return ((r = (n / 2 ** 31) | 0), ((e.index[r] || (e.index[r] = []))[n] = i), e.length++, !0)
      },
    })
  }
  function _(t = 8) {
    if (!this || this.constructor !== _) return new _(t)
    ;((this.index = A()),
      (this.h = []),
      (this.size = 0),
      32 < t ? ((this.B = qt), (this.A = BigInt(t))) : ((this.B = Yt), (this.A = t)))
  }
  function B(t = 8) {
    if (!this || this.constructor !== B) return new B(t)
    ;((this.index = A()),
      (this.h = []),
      (this.size = 0),
      32 < t ? ((this.B = qt), (this.A = BigInt(t))) : ((this.B = Yt), (this.A = t)))
  }
  function Yt(t) {
    let e = 2 ** this.A - 1
    if (typeof t == "number") return t & e
    let r = 0,
      n = this.A + 1
    for (let i = 0; i < t.length; i++) r = ((r * n) ^ t.charCodeAt(i)) & e
    return this.A === 32 ? r + 2 ** 31 : r
  }
  function qt(t) {
    let e = BigInt(2) ** this.A - BigInt(1)
    var r = typeof t
    if (r === "bigint") return t & e
    if (r === "number") return BigInt(t) & e
    r = BigInt(0)
    let n = this.A + BigInt(1)
    for (let i = 0; i < t.length; i++) r = ((r * n) ^ BigInt(t.charCodeAt(i))) & e
    return r
  }
  function ot(t, e, r, n, i, s) {
    if (((t = t[i]), n === r.length - 1)) e[i] = s || t
    else if (t)
      if (t.constructor === Array)
        for (e = e[i] = Array(t.length), i = 0; i < t.length; i++) ot(t, e, r, n, i)
      else ((e = e[i] || (e[i] = A())), (i = r[++n]), ot(t, e, r, n, i))
  }
  function at(t, e, r, n, i, s, o, u) {
    if ((t = t[o]))
      if (n === e.length - 1) {
        if (t.constructor === Array) {
          if (r[n]) {
            for (e = 0; e < t.length; e++) i.add(s, t[e], !0, !0)
            return
          }
          t = t.join(" ")
        }
        i.add(s, t, u, !0)
      } else if (t.constructor === Array) for (o = 0; o < t.length; o++) at(t, e, r, n, i, s, o, u)
      else ((o = e[++n]), at(t, e, r, n, i, s, o, u))
    else i.db && i.remove(s)
  }
  function Qt(t, e, r, n, i, s, o) {
    let u = t.length,
      a = [],
      l,
      c
    l = A()
    for (let h = 0, g, p, f, d; h < e; h++)
      for (let C = 0; C < u; C++)
        if (((f = t[C]), h < f.length && (g = f[h])))
          for (let D = 0; D < g.length; D++) {
            if (
              ((p = g[D]),
              (c = l[p]) ? l[p]++ : ((c = 0), (l[p] = 1)),
              (d = a[c] || (a[c] = [])),
              !o)
            ) {
              let y = h + (C || !i ? 0 : s || 0)
              d = d[y] || (d[y] = [])
            }
            if ((d.push(p), o && r && c === u - 1 && d.length - n === r)) return n ? d.slice(n) : d
          }
    if ((t = a.length))
      if (i)
        a = 1 < a.length ? Jt(a, r, n, o, s) : (a = a[0]).length > r || n ? a.slice(n, r + n) : a
      else {
        if (t < u) return []
        if (((a = a[t - 1]), r || n))
          if (o) (a.length > r || n) && (a = a.slice(n, r + n))
          else {
            i = []
            for (let h = 0, g; h < a.length; h++)
              if (((g = a[h]), g.length > n)) n -= g.length
              else if (
                ((g.length > r || n) &&
                  ((g = g.slice(n, r + n)), (r -= g.length), n && (n -= g.length)),
                i.push(g),
                !r)
              )
                break
            a = 1 < i.length ? [].concat.apply([], i) : i[0]
          }
      }
    return a
  }
  function Jt(t, e, r, n, i) {
    let s = [],
      o = A(),
      u
    var a = t.length
    let l
    if (n) {
      for (i = a - 1; 0 <= i; i--)
        if ((l = (n = t[i]) && n.length)) {
          for (a = 0; a < l; a++)
            if (((u = n[a]), !o[u])) {
              if (((o[u] = 1), r)) r--
              else if ((s.push(u), s.length === e)) return s
            }
        }
    } else
      for (let c = a - 1, h, g = 0; 0 <= c; c--) {
        h = t[c]
        for (let p = 0; p < h.length; p++)
          if ((l = (n = h[p]) && n.length)) {
            for (let f = 0; f < l; f++)
              if (((u = n[f]), !o[u]))
                if (((o[u] = 1), r)) r--
                else {
                  let d = ((p + ((c < a - 1 && i) || 0)) / (c + 1)) | 0
                  if (((s[d] || (s[d] = [])).push(u), ++g === e)) return s
                }
          }
      }
    return s
  }
  function Yr(t, e, r) {
    let n = A(),
      i = []
    for (let s = 0, o; s < e.length; s++) {
      o = e[s]
      for (let u = 0; u < o.length; u++) n[o[u]] = 1
    }
    if (r) for (let s = 0, o; s < t.length; s++) ((o = t[s]), n[o] && (i.push(o), (n[o] = 0)))
    else
      for (let s = 0, o, u; s < t.result.length; s++)
        for (o = t.result[s], e = 0; e < o.length; e++)
          ((u = o[e]), n[u] && ((i[s] || (i[s] = [])).push(u), (n[u] = 0)))
    return i
  }
  function gt(t, e, r, n) {
    if (!t.length) return t
    if (t.length === 1)
      return (
        (t = t[0]),
        (t = r || t.length > e ? (e ? t.slice(r, r + e) : t.slice(r)) : t),
        n ? P.call(this, t) : t
      )
    let i = []
    for (let s = 0, o, u; s < t.length; s++)
      if ((o = t[s]) && (u = o.length)) {
        if (r) {
          if (r >= u) {
            r -= u
            continue
          }
          r < u && ((o = e ? o.slice(r, r + e) : o.slice(r)), (u = o.length), (r = 0))
        }
        if ((u > e && ((o = o.slice(0, e)), (u = e)), !i.length && u >= e))
          return n ? P.call(this, o) : o
        if ((i.push(o), (e -= u), !e)) break
      }
    return ((i = 1 < i.length ? [].concat.apply([], i) : i[0]), n ? P.call(this, i) : i)
  }
  function ze(t, e, r) {
    var n = r[0]
    if (n.then)
      return Promise.all(r).then(function (c) {
        return t[e].apply(t, c)
      })
    if (n[0] && n[0].index) return t[e].apply(t, n)
    n = []
    let i = [],
      s = 0,
      o = 0,
      u,
      a,
      l
    for (let c = 0, h; c < r.length; c++)
      if ((h = r[c])) {
        let g
        if (h.constructor === S) g = h.result
        else if (h.constructor === Array) g = h
        else if (
          ((s = h.limit || 0),
          (o = h.offset || 0),
          (l = h.suggest),
          (a = h.resolve),
          (u = h.enrich && a),
          h.index)
        )
          ((h.resolve = !1), (g = h.index.search(h).result), (h.resolve = a))
        else if (h.and) g = t.and(h.and)
        else if (h.or) g = t.or(h.or)
        else if (h.xor) g = t.xor(h.xor)
        else if (h.not) g = t.not(h.not)
        else continue
        if (g.then) i.push(g)
        else if (g.length) n[c] = g
        else if (!l && (e === "and" || e === "xor")) {
          n = []
          break
        }
      }
    return { O: n, P: i, limit: s, offset: o, enrich: u, resolve: a, suggest: l }
  }
  function Zt(t, e, r, n, i, s) {
    if (e.length) {
      let o = this
      return Promise.all(e).then(function (u) {
        t = []
        for (let a = 0, l; a < u.length; a++) (l = u[a]).length && (t[a] = l)
        return Zt.call(o, t, [], r, n, i, s)
      })
    }
    return (
      t.length &&
        (this.result.length && t.push(this.result),
        2 > t.length ? (this.result = t[0]) : ((this.result = Jt(t, r, n, !1, this.h)), (n = 0))),
      s ? this.resolve(r, n, i) : this
    )
  }
  function er(t, e, r, n, i, s, o) {
    if (e.length) {
      let u = this
      return Promise.all(e).then(function (a) {
        t = []
        for (let l = 0, c; l < a.length; l++) (c = a[l]).length && (t[l] = c)
        return er.call(u, t, [], r, n, i, s, o)
      })
    }
    if (t.length)
      if ((this.result.length && t.unshift(this.result), 2 > t.length)) this.result = t[0]
      else {
        if ((e = Pr(t)))
          return (
            (this.result = Qt(t, e, r, n, o, this.h, s)),
            s ? (i ? P.call(this.index, this.result) : this.result) : this
          )
        this.result = []
      }
    else o || (this.result = t)
    return s ? this.resolve(r, n, i) : this
  }
  function tr(t, e, r, n, i, s, o) {
    if (e.length) {
      let u = this
      return Promise.all(e).then(function (a) {
        t = []
        for (let l = 0, c; l < a.length; l++) (c = a[l]).length && (t[l] = c)
        return tr.call(u, t, [], r, n, i, s, o)
      })
    }
    if (t.length)
      if ((this.result.length && t.unshift(this.result), 2 > t.length)) this.result = t[0]
      else
        return (
          (this.result = qr.call(this, t, r, n, s, this.h)),
          s ? (i ? P.call(this.index, this.result) : this.result) : this
        )
    else o || (this.result = t)
    return s ? this.resolve(r, n, i) : this
  }
  function qr(t, e, r, n, i) {
    let s = [],
      o = A(),
      u = 0
    for (let a = 0, l; a < t.length; a++)
      if ((l = t[a])) {
        u < l.length && (u = l.length)
        for (let c = 0, h; c < l.length; c++)
          if ((h = l[c])) for (let g = 0, p; g < h.length; g++) ((p = h[g]), (o[p] = o[p] ? 2 : 1))
      }
    for (let a = 0, l, c = 0; a < u; a++)
      for (let h = 0, g; h < t.length; h++)
        if ((g = t[h]) && (l = g[a])) {
          for (let p = 0, f; p < l.length; p++)
            if (((f = l[p]), o[f] === 1))
              if (r) r--
              else if (n) {
                if ((s.push(f), s.length === e)) return s
              } else {
                let d = a + (h ? i : 0)
                if ((s[d] || (s[d] = []), s[d].push(f), ++c === e)) return s
              }
        }
    return s
  }
  function rr(t, e, r, n, i, s, o) {
    if (e.length) {
      let u = this
      return Promise.all(e).then(function (a) {
        t = []
        for (let l = 0, c; l < a.length; l++) (c = a[l]).length && (t[l] = c)
        return rr.call(u, t, [], r, n, i, s, o)
      })
    }
    if (t.length && this.result.length) this.result = Qr.call(this, t, r, n, s)
    else if (s) return this.resolve(r, n, i)
    return s ? (i ? P.call(this.index, this.result) : this.result) : this
  }
  function Qr(t, e, r, n) {
    let i = []
    t = new Set(t.flat().flat())
    for (let s = 0, o, u = 0; s < this.result.length; s++)
      if ((o = this.result[s])) {
        for (let a = 0, l; a < o.length; a++)
          if (((l = o[a]), !t.has(l))) {
            if (r) r--
            else if (n) {
              if ((i.push(l), i.length === e)) return i
            } else if ((i[s] || (i[s] = []), i[s].push(l), ++u === e)) return i
          }
      }
    return i
  }
  function S(t) {
    if (!this || this.constructor !== S) return new S(t)
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
  function rt(t, e, r, n, i) {
    let s, o
    for (let a = 0, l, c, h; a < e.length; a++) {
      let g
      if (n) ((g = e), (h = n))
      else {
        var u = e[a]
        if (((h = u.field), !h)) continue
        g = u.result
      }
      ;((c = r.get(h)), (l = c.encoder), (u = c.tokenize), l !== s && ((s = l), (o = s.encode(t))))
      for (let p = 0; p < g.length; p++) {
        let f = "",
          d = Se(g[p].doc, h).split(/\s+/)
        for (let C = 0, D, y; C < d.length; C++) {
          ;((D = d[C]), (y = l.encode(D)), (y = 1 < y.length ? y.join(" ") : y[0]))
          let R
          if (y && D)
            for (let M = 0, E; M < o.length; M++)
              if (((E = o[M]), u === "strict")) {
                if (y === E) {
                  ;((f += (f ? " " : "") + i.replace("$1", D)), (R = !0))
                  break
                }
              } else {
                let x = y.indexOf(E)
                if (-1 < x) {
                  ;((f +=
                    (f ? " " : "") +
                    D.substring(0, x) +
                    i.replace("$1", D.substring(x, x + E.length)) +
                    D.substring(x + E.length)),
                    (R = !0))
                  break
                }
              }
          R || (f += (f ? " " : "") + d[C])
        }
        g[p].highlight = f
      }
      if (n) break
    }
    return e
  }
  function Nt(t) {
    let e = [],
      r = A()
    for (let n = 0, i, s; n < t.length; n++) {
      ;((i = t[n]), (s = i.result))
      for (let o = 0, u, a, l; o < s.length; o++)
        ((a = s[o]),
          typeof a != "object" && (a = { id: a }),
          (u = a.id),
          (l = r[u]) ? l.push(i.field) : ((a.field = r[u] = [i.field]), e.push(a)))
    }
    return e
  }
  function Jr(t, e, r, n, i) {
    if (((t = this.tag.get(t)), !t)) return []
    if ((e = (t = t && t.get(e)) && t.length - n) && 0 < e)
      return ((e > r || n) && (t = t.slice(n, n + r)), i && (t = P.call(this, t)), t)
  }
  function P(t) {
    if (!this || !this.store) return t
    let e = Array(t.length)
    for (let r = 0, n; r < t.length; r++) ((n = t[r]), (e[r] = { id: n, doc: this.store.get(n) }))
    return e
  }
  function J(t) {
    if (!this || this.constructor !== J) return new J(t)
    let e = t.document || t.doc || t,
      r,
      n
    if (
      ((this.F = []),
      (this.field = []),
      (this.J = []),
      (this.key = ((r = e.key || e.id) && Ne(r, this.J)) || "id"),
      (n = t.keystore || 0) && (this.keystore = n),
      (this.fastupdate = !!t.fastupdate),
      (this.reg =
        !this.fastupdate || t.worker || t.db
          ? n
            ? new B(n)
            : new Set()
          : n
            ? new _(n)
            : new Map()),
      (this.C = (r = e.store || null) && r && r !== !0 && []),
      (this.store = r && (n ? new _(n) : new Map())),
      (this.cache = (r = t.cache || null) && new Z(r)),
      (t.cache = !1),
      (this.worker = t.worker || !1),
      (this.priority = t.priority || 4),
      (this.index = Zr.call(this, t, e)),
      (this.tag = null),
      (r = e.tag) && (typeof r == "string" && (r = [r]), r.length))
    ) {
      ;((this.tag = new Map()), (this.D = []), (this.R = []))
      for (let i = 0, s, o; i < r.length; i++) {
        if (((s = r[i]), (o = s.field || s), !o))
          throw Error("The tag field from the document descriptor is undefined.")
        ;(s.custom
          ? (this.D[i] = s.custom)
          : ((this.D[i] = Ne(o, this.J)),
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
          let u = new Map(),
            a = 0
          for (let c of s.index.entries()) {
            let h = c[0]
            var l = c[1]
            if (l.then) {
              l = i[a].encoder || {}
              let g = u.get(l)
              ;(g || ((g = l.encode ? l : new le(l)), u.set(l, g)),
                (l = o[a]),
                (l.encoder = g),
                s.index.set(h, l),
                a++)
            }
          }
          return s
        })
      }
    } else t.db && ((this.fastupdate = !1), this.mount(t.db))
  }
  function Zr(t, e) {
    let r = new Map(),
      n = e.index || e.field || e
    O(n) && (n = [n])
    for (let i = 0, s, o; i < n.length; i++) {
      if (
        ((s = n[i]),
        O(s) || ((o = s), (s = s.field)),
        (o = Fe(o) ? Object.assign({}, t, o) : t),
        this.worker)
      ) {
        let u = new ce(o)
        ;((u.encoder = o.encoder), r.set(s, u))
      }
      ;(this.worker || r.set(s, new k(o, this.reg)),
        o.custom
          ? (this.F[i] = o.custom)
          : ((this.F[i] = Ne(s, this.J)),
            o.filter &&
              (typeof this.F[i] == "string" && (this.F[i] = new String(this.F[i])),
              (this.F[i].I = o.filter))),
        (this.field[i] = s))
    }
    if (this.C) {
      ;((t = e.store), O(t) && (t = [t]))
      for (let i = 0, s, o; i < t.length; i++)
        ((s = t[i]),
          (o = s.field || s),
          s.custom
            ? ((this.C[i] = s.custom), (s.custom.V = o))
            : ((this.C[i] = Ne(o, this.J)),
              s.filter &&
                (typeof this.C[i] == "string" && (this.C[i] = new String(this.C[i])),
                (this.C[i].I = s.filter))))
    }
    return r
  }
  function Ne(t, e) {
    let r = t.split(":"),
      n = 0
    for (let i = 0; i < r.length; i++)
      ((t = r[i]),
        t[t.length - 1] === "]" && (t = t.substring(0, t.length - 2)) && (e[n] = !0),
        t && (r[n++] = t))
    return (n < r.length && (r.length = n), 1 < n ? r : r[0])
  }
  function nr(t, e, r) {
    let n = (typeof t == "object" ? "" + t.query : t).toLowerCase()
    this.cache || (this.cache = new Z())
    let i = this.cache.get(n)
    if (!i) {
      if (((i = this.search(t, e, r)), i.then)) {
        let s = this
        i.then(function (o) {
          return (s.cache.set(n, o), o)
        })
      }
      this.cache.set(n, i)
    }
    return i
  }
  function Z(t) {
    ;((this.limit = t && t !== !0 ? t : 1e3), (this.cache = new Map()), (this.h = ""))
  }
  function ve(t, e) {
    let r = 0
    var n = typeof e > "u"
    if (t.constructor === Array) {
      for (let i = 0, s, o; i < t.length; i++)
        if ((s = t[i]) && s.length)
          if (n) r++
          else if (((o = s.indexOf(e)), 0 <= o)) {
            1 < s.length ? (s.splice(o, 1), r++) : delete t[i]
            break
          } else r++
    } else
      for (let i of t.entries()) {
        n = i[0]
        let s = ve(i[1], e)
        s ? (r += s) : t.delete(n)
      }
    return r
  }
  function Ee(t, e, r, n, i, s, o) {
    let u = o ? t.ctx : t.map,
      a
    if (
      (!e[r] || (o && !(a = e[r])[o])) &&
      (o
        ? ((e = a || (e[r] = A())),
          (e[o] = 1),
          (a = u.get(o)) ? (u = a) : u.set(o, (u = new Map())))
        : (e[r] = 1),
      (a = u.get(r)) ? (u = a) : u.set(r, (u = a = [])),
      (u = u[n] || (u[n] = [])),
      !s || !u.includes(i))
    ) {
      if (u.length === 2 ** 31 - 1) {
        if (((e = new Q(u)), t.fastupdate))
          for (let l of t.reg.values()) l.includes(u) && (l[l.indexOf(u)] = e)
        a[n] = u = e
      }
      ;(u.push(i), t.fastupdate && ((n = t.reg.get(i)) ? n.push(u) : t.reg.set(i, [u])))
    }
  }
  function Oe(t, e, r, n, i) {
    return r && 1 < t
      ? e + (n || 0) <= t
        ? r + (i || 0)
        : (((t - 1) / (e + (n || 0))) * (r + (i || 0)) + 1) | 0
      : 0
  }
  function Pt(t, e, r, n, i, s, o) {
    let u = t.length,
      a = t
    if (1 < u) a = Qt(t, e, r, n, i, s, o)
    else if (u === 1) return o ? gt.call(null, t[0], r, n) : new S(t[0])
    return o ? a : new S(a)
  }
  function Kt(t, e, r, n, i, s, o) {
    return (
      (t = ut(this, t, e, r, n, i, s, o)),
      this.db
        ? t.then(function (u) {
            return i ? u || [] : new S(u)
          })
        : t && t.length
          ? i
            ? gt.call(this, t, r, n)
            : new S(t)
          : i
            ? []
            : new S()
    )
  }
  function $t(t, e, r, n) {
    let i = []
    if (t && t.length) {
      if (t.length <= n) {
        e.push(t)
        return
      }
      for (let s = 0, o; s < n; s++) (o = t[s]) && (i[s] = o)
      if (i.length) {
        e.push(i)
        return
      }
    }
    if (!r) return i
  }
  function ut(t, e, r, n, i, s, o, u) {
    let a
    return (
      r && (a = t.bidirectional && e > r) && ((a = r), (r = e), (e = a)),
      t.db
        ? t.db.get(e, r, n, i, s, o, u)
        : ((t = r ? (t = t.ctx.get(r)) && t.get(e) : t.map.get(e)), t)
    )
  }
  function k(t, e) {
    if (!this || this.constructor !== k) return new k(t)
    if (t) {
      var r = O(t) ? t : t.preset
      r && (t = Object.assign({}, en[r], t))
    } else t = {}
    r = t.context
    let n = r === !0 ? { depth: 1 } : r || {},
      i = O(t.encoder) ? ir[t.encoder] : t.encode || t.encoder || {}
    ;((this.encoder = i.encode ? i : typeof i == "object" ? new le(i) : { encode: i }),
      (this.resolution = t.resolution || 9),
      (this.tokenize = r = ((r = t.tokenize) && r !== "default" && r !== "exact" && r) || "strict"),
      (this.depth = (r === "strict" && n.depth) || 0),
      (this.bidirectional = n.bidirectional !== !1),
      (this.fastupdate = !!t.fastupdate),
      (this.score = t.score || null),
      (r = t.keystore || 0) && (this.keystore = r),
      (this.map = r ? new _(r) : new Map()),
      (this.ctx = r ? new _(r) : new Map()),
      (this.reg = e || (this.fastupdate ? (r ? new _(r) : new Map()) : r ? new B(r) : new Set())),
      (this.U = n.resolution || 3),
      (this.rtl = i.rtl || t.rtl || !1),
      (this.cache = (r = t.cache || null) && new Z(r)),
      (this.resolve = t.resolve !== !1),
      (r = t.db) && (this.db = this.mount(r)),
      (this.T = t.commit !== !1),
      (this.commit_task = []),
      (this.commit_timer = null),
      (this.priority = t.priority || 4))
  }
  function sr(t) {
    t.commit_timer ||
      (t.commit_timer = setTimeout(function () {
        ;((t.commit_timer = null), t.db.commit(t, void 0, void 0))
      }, 1))
  }
  function Ue(t, e = {}) {
    if (!this || this.constructor !== Ue) return new Ue(t, e)
    ;(typeof t == "object" && ((e = t), (t = t.name)),
      t || console.info("Default storage space was used, because a name was not passed."),
      (this.id = "flexsearch" + (t ? ":" + t.toLowerCase().replace(/[^a-z0-9_\-]/g, "") : "")),
      (this.field = e.field ? e.field.toLowerCase().replace(/[^a-z0-9_\-]/g, "") : ""),
      (this.type = e.type),
      (this.fastupdate = this.support_tag_search = !1),
      (this.db = null),
      (this.h = {}))
  }
  function it(t, e, r) {
    let n = t.value,
      i,
      s = 0
    for (let o = 0, u; o < n.length; o++) {
      if ((u = r ? n : n[o])) {
        for (let a = 0, l, c; a < e.length; a++)
          if (((c = e[a]), (l = u.indexOf(c)), 0 <= l))
            if (((i = 1), 1 < u.length)) u.splice(l, 1)
            else {
              n[o] = []
              break
            }
        s += u.length
      }
      if (r) break
    }
    ;(s ? i && t.update(n) : t.delete(), t.continue())
  }
  function $(t, e) {
    return new Promise((r, n) => {
      ;((t.onsuccess = t.oncomplete =
        function () {
          ;(e && e(this.result), (e = null), r(this.result))
        }),
        (t.onerror = t.onblocked = n),
        (t = null))
    })
  }
  var jt,
    m,
    Kr,
    $r,
    jr,
    Gr,
    It,
    ae,
    De,
    st,
    Ot,
    Be,
    ue,
    _t,
    Ie,
    nt,
    Ut,
    zt,
    Ht,
    ir,
    en,
    or,
    _e,
    Y,
    ar,
    ur = b(() => {
      jt = {}
      ;((Kr = /[^\p{L}\p{N}]+/u),
        ($r = /(\d{3})/g),
        (jr = /(\D)(\d{3})/g),
        (Gr = /(\d{3})(\D)/g),
        (It = /[\u0300-\u036f]/g))
      m = le.prototype
      m.assign = function (t) {
        this.normalize = T(t.normalize, !0, this.normalize)
        let e = t.include,
          r = e || t.exclude || t.split,
          n
        if (r || r === "") {
          if (typeof r == "object" && r.constructor !== RegExp) {
            let i = ""
            ;((n = !e),
              e || (i += "\\p{Z}"),
              r.letter && (i += "\\p{L}"),
              r.number && ((i += "\\p{N}"), (n = !!e)),
              r.symbol && (i += "\\p{S}"),
              r.punctuation && (i += "\\p{P}"),
              r.control && (i += "\\p{C}"),
              (r = r.char) && (i += typeof r == "object" ? r.join("") : r))
            try {
              this.split = new RegExp("[" + (e ? "^" : "") + i + "]+", "u")
            } catch {
              this.split = /\s+/
            }
          } else ((this.split = r), (n = r === !1 || 2 > "a1a".split(r).length))
          this.numeric = T(t.numeric, n)
        } else {
          try {
            this.split = T(this.split, Kr)
          } catch {
            this.split = /\s+/
          }
          this.numeric = T(t.numeric, T(this.numeric, !0))
        }
        if (
          ((this.prepare = T(t.prepare, null, this.prepare)),
          (this.finalize = T(t.finalize, null, this.finalize)),
          (r = t.filter),
          (this.filter = typeof r == "function" ? r : T(r && new Set(r), null, this.filter)),
          (this.dedupe = T(t.dedupe, !0, this.dedupe)),
          (this.matcher = T((r = t.matcher) && new Map(r), null, this.matcher)),
          (this.mapper = T((r = t.mapper) && new Map(r), null, this.mapper)),
          (this.stemmer = T((r = t.stemmer) && new Map(r), null, this.stemmer)),
          (this.replacer = T(t.replacer, null, this.replacer)),
          (this.minlength = T(t.minlength, 1, this.minlength)),
          (this.maxlength = T(t.maxlength, 1024, this.maxlength)),
          (this.rtl = T(t.rtl, !1, this.rtl)),
          (this.cache = r = T(t.cache, !0, this.cache)) &&
            ((this.H = null),
            (this.S = typeof r == "number" ? r : 2e5),
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
      m.addStemmer = function (t, e) {
        return (
          this.stemmer || (this.stemmer = new Map()),
          this.stemmer.set(t, e),
          (this.A += (this.A ? "|" : "") + t),
          (this.N = null),
          this.cache && q(this),
          this
        )
      }
      m.addFilter = function (t) {
        return (
          typeof t == "function"
            ? (this.filter = t)
            : (this.filter || (this.filter = new Set()), this.filter.add(t)),
          this.cache && q(this),
          this
        )
      }
      m.addMapper = function (t, e) {
        return typeof t == "object"
          ? this.addReplacer(t, e)
          : 1 < t.length
            ? this.addMatcher(t, e)
            : (this.mapper || (this.mapper = new Map()),
              this.mapper.set(t, e),
              this.cache && q(this),
              this)
      }
      m.addMatcher = function (t, e) {
        return typeof t == "object"
          ? this.addReplacer(t, e)
          : 2 > t.length && (this.dedupe || this.mapper)
            ? this.addMapper(t, e)
            : (this.matcher || (this.matcher = new Map()),
              this.matcher.set(t, e),
              (this.h += (this.h ? "|" : "") + t),
              (this.M = null),
              this.cache && q(this),
              this)
      }
      m.addReplacer = function (t, e) {
        return typeof t == "string"
          ? this.addMatcher(t, e)
          : (this.replacer || (this.replacer = []),
            this.replacer.push(t, e),
            this.cache && q(this),
            this)
      }
      m.encode = function (t, e) {
        if (this.cache && t.length <= this.K)
          if (this.H) {
            if (this.B.has(t)) return this.B.get(t)
          } else this.H = setTimeout(q, 50, this)
        ;(this.normalize &&
          (typeof this.normalize == "function"
            ? (t = this.normalize(t))
            : (t = It ? t.normalize("NFKD").replace(It, "").toLowerCase() : t.toLowerCase())),
          this.prepare && (t = this.prepare(t)),
          this.numeric &&
            3 < t.length &&
            (t = t.replace(jr, "$1 $2").replace(Gr, "$1 $2").replace($r, "$1 ")))
        let r = !(
            this.dedupe ||
            this.mapper ||
            this.filter ||
            this.matcher ||
            this.stemmer ||
            this.replacer
          ),
          n = [],
          i = A(),
          s,
          o,
          u = this.split || this.split === "" ? t.split(this.split) : [t]
        for (let l = 0, c, h; l < u.length; l++)
          if ((c = h = u[l]) && !(c.length < this.minlength || c.length > this.maxlength)) {
            if (e) {
              if (i[c]) continue
              i[c] = 1
            } else {
              if (s === c) continue
              s = c
            }
            if (r) n.push(c)
            else if (
              !this.filter ||
              (typeof this.filter == "function" ? this.filter(c) : !this.filter.has(c))
            ) {
              if (this.cache && c.length <= this.L)
                if (this.H) {
                  var a = this.G.get(c)
                  if (a || a === "") {
                    a && n.push(a)
                    continue
                  }
                } else this.H = setTimeout(q, 50, this)
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
                n.push(c)
              }
            }
          }
        return (
          this.finalize && (n = this.finalize(n) || n),
          this.cache &&
            t.length <= this.K &&
            (this.B.set(t, n),
            this.B.size > this.S && (this.B.clear(), (this.K = (this.K / 1.1) | 0))),
          n
        )
      }
      ue = 0
      K("add")
      K("append")
      K("search")
      K("update")
      K("remove")
      K("clear")
      K("export")
      K("import")
      lt(ce.prototype)
      Q.prototype.clear = function () {
        this.index.length = 0
      }
      Q.prototype.destroy = function () {
        this.proxy = this.index = null
      }
      Q.prototype.push = function () {}
      _.prototype.get = function (t) {
        let e = this.index[this.B(t)]
        return e && e.get(t)
      }
      _.prototype.set = function (t, e) {
        var r = this.B(t)
        let n = this.index[r]
        n
          ? ((r = n.size), n.set(t, e), (r -= n.size) && this.size++)
          : ((this.index[r] = n = new Map([[t, e]])), this.h.push(n), this.size++)
      }
      B.prototype.add = function (t) {
        var e = this.B(t)
        let r = this.index[e]
        r
          ? ((e = r.size), r.add(t), (e -= r.size) && this.size++)
          : ((this.index[e] = r = new Set([t])), this.h.push(r), this.size++)
      }
      m = _.prototype
      m.has = B.prototype.has = function (t) {
        let e = this.index[this.B(t)]
        return e && e.has(t)
      }
      m.delete = B.prototype.delete = function (t) {
        let e = this.index[this.B(t)]
        e && e.delete(t) && this.size--
      }
      m.clear = B.prototype.clear = function () {
        ;((this.index = A()), (this.h = []), (this.size = 0))
      }
      m.values = B.prototype.values = function* () {
        for (let t = 0; t < this.h.length; t++) for (let e of this.h[t].values()) yield e
      }
      m.keys = B.prototype.keys = function* () {
        for (let t = 0; t < this.h.length; t++) for (let e of this.h[t].keys()) yield e
      }
      m.entries = B.prototype.entries = function* () {
        for (let t = 0; t < this.h.length; t++) for (let e of this.h[t].entries()) yield e
      }
      J.prototype.add = function (t, e, r) {
        if ((Fe(t) && ((e = t), (t = Se(e, this.key))), e && (t || t === 0))) {
          if (!r && this.reg.has(t)) return this.update(t, e)
          for (let u = 0, a; u < this.field.length; u++) {
            a = this.F[u]
            var n = this.index.get(this.field[u])
            if (typeof a == "function") {
              var i = a(e)
              i && n.add(t, i, !1, !0)
            } else
              ((i = a.I),
                (!i || i(e)) &&
                  (a.constructor === String ? (a = ["" + a]) : O(a) && (a = [a]),
                  at(e, a, this.J, 0, n, t, a[0], r)))
          }
          if (this.tag)
            for (n = 0; n < this.D.length; n++) {
              var s = this.D[n]
              i = this.tag.get(this.R[n])
              let u = A()
              if (typeof s == "function") {
                if (((s = s(e)), !s)) continue
              } else {
                var o = s.I
                if (o && !o(e)) continue
                ;(s.constructor === String && (s = "" + s), (s = Se(e, s)))
              }
              if (i && s) {
                O(s) && (s = [s])
                for (let a = 0, l, c; a < s.length; a++)
                  if (
                    ((l = s[a]),
                    !u[l] &&
                      ((u[l] = 1),
                      (o = i.get(l)) ? (c = o) : i.set(l, (c = [])),
                      !r || !c.includes(t)))
                  ) {
                    if (c.length === 2 ** 31 - 1) {
                      if (((o = new Q(c)), this.fastupdate))
                        for (let h of this.reg.values()) h.includes(c) && (h[h.indexOf(c)] = o)
                      i.set(l, (c = o))
                    }
                    ;(c.push(t),
                      this.fastupdate && ((o = this.reg.get(t)) ? o.push(c) : this.reg.set(t, [c])))
                  }
              }
            }
          if (this.store && (!r || !this.store.has(t))) {
            let u
            if (this.C) {
              u = A()
              for (let a = 0, l; a < this.C.length; a++) {
                if (((l = this.C[a]), (r = l.I) && !r(e))) continue
                let c
                if (typeof l == "function") {
                  if (((c = l(e)), !c)) continue
                  l = [l.V]
                } else if (O(l) || l.constructor === String) {
                  u[l] = e[l]
                  continue
                }
                ot(e, u, l, 0, l[0], c)
              }
            }
            this.store.set(t, u || e)
          }
          this.worker && (this.fastupdate || this.reg.add(t))
        }
        return this
      }
      S.prototype.or = function () {
        let { O: t, P: e, limit: r, offset: n, enrich: i, resolve: s } = ze(this, "or", arguments)
        return Zt.call(this, t, e, r, n, i, s)
      }
      S.prototype.and = function () {
        let t = this.result.length,
          e,
          r,
          n,
          i
        if (!t) {
          let s = arguments[0]
          s &&
            ((t = !!s.suggest), (i = s.resolve), (e = s.limit), (r = s.offset), (n = s.enrich && i))
        }
        if (t) {
          let {
            O: s,
            P: o,
            limit: u,
            offset: a,
            enrich: l,
            resolve: c,
            suggest: h,
          } = ze(this, "and", arguments)
          return er.call(this, s, o, u, a, l, c, h)
        }
        return i ? this.resolve(e, r, n) : this
      }
      S.prototype.xor = function () {
        let {
          O: t,
          P: e,
          limit: r,
          offset: n,
          enrich: i,
          resolve: s,
          suggest: o,
        } = ze(this, "xor", arguments)
        return tr.call(this, t, e, r, n, i, s, o)
      }
      S.prototype.not = function () {
        let {
          O: t,
          P: e,
          limit: r,
          offset: n,
          enrich: i,
          resolve: s,
          suggest: o,
        } = ze(this, "not", arguments)
        return rr.call(this, t, e, r, n, i, s, o)
      }
      S.prototype.limit = function (t) {
        if (this.result.length) {
          let e = []
          for (let r = 0, n; r < this.result.length; r++)
            if ((n = this.result[r]))
              if (n.length <= t) {
                if (((e[r] = n), (t -= n.length), !t)) break
              } else {
                e[r] = n.slice(0, t)
                break
              }
          this.result = e
        }
        return this
      }
      S.prototype.offset = function (t) {
        if (this.result.length) {
          let e = []
          for (let r = 0, n; r < this.result.length; r++)
            (n = this.result[r]) &&
              (n.length <= t ? (t -= n.length) : ((e[r] = n.slice(t)), (t = 0)))
          this.result = e
        }
        return this
      }
      S.prototype.boost = function (t) {
        return ((this.h += t), this)
      }
      S.prototype.resolve = function (t, e, r) {
        let n = this.result,
          i = this.index
        return (
          (this.result = this.index = null),
          n.length
            ? (typeof t == "object" && ((r = t.enrich), (e = t.offset), (t = t.limit)),
              gt.call(i, n, t || 100, e, r))
            : n
        )
      }
      A()
      J.prototype.search = function (t, e, r, n) {
        r || (!e && Fe(t) ? ((r = t), (t = "")) : Fe(e) && ((r = e), (e = 0)))
        let i = []
        var s = []
        let o
        var u
        let a,
          l,
          c,
          h = 0
        var g = !0
        let p
        if (r) {
          ;(r.constructor === Array && (r = { index: r }),
            (t = r.query || t),
            (o = r.pluck),
            (a = r.merge),
            (l = o || r.field || ((l = r.index) && (l.index ? null : l))),
            (c = this.tag && r.tag))
          var f = r.suggest
          ;((g = r.resolve !== !1),
            g ||
              o ||
              !(l = l || this.field) ||
              (O(l)
                ? (o = l)
                : (l.constructor === Array && l.length === 1 && (l = l[0]),
                  (o = l.field || l.index))),
            (p = (u = this.store && r.enrich && g) && r.highlight),
            (e = r.limit || e))
          var d = r.offset || 0
          if ((e || (e = 100), c && (!this.db || !n))) {
            c.constructor !== Array && (c = [c])
            var C = []
            for (let M = 0, E; M < c.length; M++)
              if (((E = c[M]), E.field && E.tag)) {
                var D = E.tag
                if (D.constructor === Array)
                  for (var y = 0; y < D.length; y++) C.push(E.field, D[y])
                else C.push(E.field, D)
              } else {
                D = Object.keys(E)
                for (let x = 0, N, w; x < D.length; x++)
                  if (((N = D[x]), (w = E[N]), w.constructor === Array))
                    for (y = 0; y < w.length; y++) C.push(N, w[y])
                  else C.push(N, w)
              }
            if (((c = C), !t)) {
              if (((g = []), C.length))
                for (s = 0; s < C.length; s += 2) {
                  if (this.db) {
                    if (((f = this.index.get(C[s])), !f)) continue
                    g.push((f = f.db.tag(C[s + 1], e, d, u)))
                  } else f = Jr.call(this, C[s], C[s + 1], e, d, u)
                  i.push({ field: C[s], tag: C[s + 1], result: f })
                }
              return g.length
                ? Promise.all(g).then(function (M) {
                    for (let E = 0; E < M.length; E++) i[E].result = M[E]
                    return i
                  })
                : i
            }
          }
          l && l.constructor !== Array && (l = [l])
        }
        ;(l || (l = this.field), (C = !n && (this.worker || this.db) && []))
        let R
        for (let M = 0, E, x, N; M < l.length; M++) {
          if (((x = l[M]), this.db && this.tag && !this.F[M])) continue
          let w
          if (
            (O(x) ||
              ((w = x),
              (x = w.field),
              (t = w.query || t),
              (e = w.limit || e),
              (d = w.offset || d),
              (f = w.suggest || f),
              (u = this.store && (w.enrich || u))),
            n)
          )
            E = n[M]
          else if (
            ((D = w || r),
            (y = this.index.get(x)),
            c &&
              (this.db && ((D.tag = c), (R = y.db.support_tag_search), (D.field = l)),
              R || (D.enrich = !1)),
            C)
          ) {
            ;((C[M] = y.search(t, e, D)), D && u && (D.enrich = u))
            continue
          } else ((E = y.search(t, e, D)), D && u && (D.enrich = u))
          if (((N = E && (g ? E.length : E.result.length)), c && N)) {
            if (((D = []), (y = 0), this.db && n)) {
              if (!R)
                for (let U = l.length; U < n.length; U++) {
                  let I = n[U]
                  if (I && I.length) (y++, D.push(I))
                  else if (!f) return g ? i : new S(i)
                }
            } else
              for (let U = 0, I, Cr; U < c.length; U += 2) {
                if (((I = this.tag.get(c[U])), !I)) {
                  if (f) continue
                  return g ? i : new S(i)
                }
                if ((Cr = (I = I && I.get(c[U + 1])) && I.length)) (y++, D.push(I))
                else if (!f) return g ? i : new S(i)
              }
            if (y) {
              if (((E = Yr(E, D, g)), (N = E.length), !N && !f)) return g ? E : new S(E)
              y--
            }
          }
          if (N) ((s[h] = x), i.push(E), h++)
          else if (l.length === 1) return g ? i : new S(i)
        }
        if (C) {
          if (this.db && c && c.length && !R)
            for (u = 0; u < c.length; u += 2) {
              if (((s = this.index.get(c[u])), !s)) {
                if (f) continue
                return g ? i : new S(i)
              }
              C.push(s.db.tag(c[u + 1], e, d, !1))
            }
          let M = this
          return Promise.all(C).then(function (E) {
            return E.length ? M.search(t, e, r, E) : E
          })
        }
        if (!h) return g ? i : new S(i)
        if (o && (!u || !this.store)) return i[0]
        for (C = [], d = 0; d < s.length; d++) {
          if (
            ((f = i[d]),
            u &&
              f.length &&
              typeof f[0].doc > "u" &&
              (this.db
                ? C.push((f = this.index.get(this.field[0]).db.enrich(f)))
                : (f = P.call(this, f))),
            o)
          )
            return g ? (p ? rt(t, f, this.index, o, p) : f) : new S(f)
          i[d] = { field: s[d], result: f }
        }
        if (u && this.db && C.length) {
          let M = this
          return Promise.all(C).then(function (E) {
            for (let x = 0; x < E.length; x++) i[x].result = E[x]
            return a ? Nt(i) : p ? rt(t, i, M.index, o, p) : i
          })
        }
        return a ? Nt(i) : p ? rt(t, i, this.index, o, p) : i
      }
      m = J.prototype
      m.mount = function (t) {
        let e = this.field
        if (this.tag)
          for (let s = 0, o; s < this.R.length; s++) {
            o = this.R[s]
            var r = void 0
            ;(this.index.set(o, (r = new k({}, this.reg))),
              e === this.field && (e = e.slice(0)),
              e.push(o),
              (r.tag = this.tag.get(o)))
          }
        r = []
        let n = { db: t.db, type: t.type, fastupdate: t.fastupdate }
        for (let s = 0, o, u; s < e.length; s++) {
          ;((n.field = u = e[s]), (o = this.index.get(u)))
          let a = new t.constructor(t.id, n)
          ;((a.id = t.id),
            (r[s] = a.mount(o)),
            (o.document = !0),
            s ? (o.bypass = !0) : (o.store = this.store))
        }
        let i = this
        return (this.db = Promise.all(r).then(function () {
          i.db = !0
        }))
      }
      m.commit = async function (t, e) {
        let r = []
        for (let n of this.index.values()) r.push(n.commit(t, e))
        ;(await Promise.all(r), this.reg.clear())
      }
      m.destroy = function () {
        let t = []
        for (let e of this.index.values()) t.push(e.destroy())
        return Promise.all(t)
      }
      m.append = function (t, e) {
        return this.add(t, e, !0)
      }
      m.update = function (t, e) {
        return this.remove(t).add(t, e)
      }
      m.remove = function (t) {
        Fe(t) && (t = Se(t, this.key))
        for (var e of this.index.values()) e.remove(t, !0)
        if (this.reg.has(t)) {
          if (this.tag && !this.fastupdate)
            for (let r of this.tag.values())
              for (let n of r) {
                e = n[0]
                let i = n[1],
                  s = i.indexOf(t)
                ;-1 < s && (1 < i.length ? i.splice(s, 1) : r.delete(e))
              }
          ;(this.store && this.store.delete(t), this.reg.delete(t))
        }
        return (this.cache && this.cache.remove(t), this)
      }
      m.clear = function () {
        let t = []
        for (let e of this.index.values()) {
          let r = e.clear()
          r.then && t.push(r)
        }
        if (this.tag) for (let e of this.tag.values()) e.clear()
        return (
          this.store && this.store.clear(),
          this.cache && this.cache.clear(),
          t.length ? Promise.all(t) : this
        )
      }
      m.contain = function (t) {
        return this.db ? this.index.get(this.field[0]).db.has(t) : this.reg.has(t)
      }
      m.cleanup = function () {
        for (let t of this.index.values()) t.cleanup()
        return this
      }
      m.get = function (t) {
        return this.db
          ? this.index
              .get(this.field[0])
              .db.enrich(t)
              .then(function (e) {
                return (e[0] && e[0].doc) || null
              })
          : this.store.get(t) || null
      }
      m.set = function (t, e) {
        return (
          typeof t == "object" && ((e = t), (t = Se(e, this.key))),
          this.store.set(t, e),
          this
        )
      }
      m.searchCache = nr
      m.export = function (t, e, r = 0, n = 0) {
        if (r < this.field.length) {
          let o = this.field[r]
          if ((e = this.index.get(o).export(t, o, r, (n = 1))) && e.then) {
            let u = this
            return e.then(function () {
              return u.export(t, o, r + 1)
            })
          }
          return this.export(t, o, r + 1)
        }
        let i, s
        switch (n) {
          case 0:
            ;((i = "reg"), (s = Vt(this.reg)), (e = null))
            break
          case 1:
            ;((i = "tag"), (s = this.tag && Gt(this.tag, this.reg.size)), (e = null))
            break
          case 2:
            ;((i = "doc"), (s = this.store && ct(this.store)), (e = null))
            break
          default:
            return
        }
        return ke.call(this, t, e, i, s, r, n)
      }
      m.import = function (t, e) {
        var r = t.split(".")
        r[r.length - 1] === "json" && r.pop()
        let n = 2 < r.length ? r[0] : ""
        if (((r = 2 < r.length ? r[2] : r[1]), this.worker && n)) return this.index.get(n).import(t)
        if (e) {
          if ((typeof e == "string" && (e = JSON.parse(e)), n))
            return this.index.get(n).import(r, e)
          switch (r) {
            case "reg":
              ;((this.fastupdate = !1), (this.reg = Xt(e, this.reg)))
              for (let i = 0, s; i < this.field.length; i++)
                ((s = this.index.get(this.field[i])), (s.fastupdate = !1), (s.reg = this.reg))
              if (this.worker) {
                e = []
                for (let i of this.index.values()) e.push(i.import(t))
                return Promise.all(e)
              }
              break
            case "tag":
              this.tag = Wt(e, this.tag)
              break
            case "doc":
              this.store = ht(e, this.store)
          }
        }
      }
      lt(J.prototype)
      Z.prototype.set = function (t, e) {
        ;(this.cache.set((this.h = t), e),
          this.cache.size > this.limit && this.cache.delete(this.cache.keys().next().value))
      }
      Z.prototype.get = function (t) {
        let e = this.cache.get(t)
        return (e && this.h !== t && (this.cache.delete(t), this.cache.set((this.h = t), e)), e)
      }
      Z.prototype.remove = function (t) {
        for (let e of this.cache) {
          let r = e[0]
          e[1].includes(t) && this.cache.delete(r)
        }
      }
      Z.prototype.clear = function () {
        ;(this.cache.clear(), (this.h = ""))
      }
      ;((_t = { normalize: !1, numeric: !1, dedupe: !1 }),
        (Ie = {}),
        (nt = new Map([
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
        (Ut = new Map([
          ["ae", "a"],
          ["oe", "o"],
          ["sh", "s"],
          ["kh", "k"],
          ["th", "t"],
          ["ph", "f"],
          ["pf", "f"],
        ])),
        (zt = [/([^aeo])h(.)/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2", /(.)\1+/g, "$1"]),
        (Ht = {
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
        (ir = {
          Exact: _t,
          Default: Ie,
          Normalize: Ie,
          LatinBalance: { mapper: nt },
          LatinAdvanced: { mapper: nt, matcher: Ut, replacer: zt },
          LatinExtra: { mapper: nt, replacer: zt.concat([/(?!^)[aeo]/g, ""]), matcher: Ut },
          LatinSoundex: {
            dedupe: !1,
            include: { letter: !0 },
            finalize: function (t) {
              for (let r = 0; r < t.length; r++) {
                var e = t[r]
                let n = e.charAt(0),
                  i = Ht[n]
                for (
                  let s = 1, o;
                  s < e.length &&
                  ((o = e.charAt(s)),
                  o === "h" ||
                    o === "w" ||
                    !(o = Ht[o]) ||
                    o === i ||
                    ((n += o), (i = o), n.length !== 4));
                  s++
                );
                t[r] = n
              }
            },
          },
          CJK: { split: "" },
          LatinExact: _t,
          LatinDefault: Ie,
          LatinSimple: Ie,
        }))
      k.prototype.remove = function (t, e) {
        let r = this.reg.size && (this.fastupdate ? this.reg.get(t) : this.reg.has(t))
        if (r) {
          if (this.fastupdate) {
            for (let n = 0, i; n < r.length; n++)
              if ((i = r[n]))
                if (2 > i.length) i.pop()
                else {
                  let s = i.indexOf(t)
                  s === r.length - 1 ? i.pop() : i.splice(s, 1)
                }
          } else (ve(this.map, t), this.depth && ve(this.ctx, t))
          e || this.reg.delete(t)
        }
        return (
          this.db && (this.commit_task.push({ del: t }), this.T && sr(this)),
          this.cache && this.cache.remove(t),
          this
        )
      }
      en = {
        memory: { resolution: 1 },
        performance: { resolution: 3, fastupdate: !0, context: { depth: 1, resolution: 1 } },
        match: { tokenize: "forward" },
        score: { resolution: 9, context: { depth: 2, resolution: 3 } },
      }
      k.prototype.add = function (t, e, r, n) {
        if (e && (t || t === 0)) {
          if (!n && !r && this.reg.has(t)) return this.update(t, e)
          ;((n = this.depth), (e = this.encoder.encode(e, !n)))
          let l = e.length
          if (l) {
            let c = A(),
              h = A(),
              g = this.resolution
            for (let p = 0; p < l; p++) {
              let f = e[this.rtl ? l - 1 - p : p]
              var i = f.length
              if (i && (n || !h[f])) {
                var s = this.score ? this.score(e, f, p, null, 0) : Oe(g, l, p),
                  o = ""
                switch (this.tokenize) {
                  case "full":
                    if (2 < i) {
                      for (let d = 0, C; d < i; d++)
                        for (s = i; s > d; s--) {
                          ;((o = f.substring(d, s)), (C = this.rtl ? i - 1 - d : d))
                          var u = this.score ? this.score(e, f, p, o, C) : Oe(g, l, p, i, C)
                          Ee(this, h, o, u, t, r)
                        }
                      break
                    }
                  case "bidirectional":
                  case "reverse":
                    if (1 < i) {
                      for (u = i - 1; 0 < u; u--) {
                        o = f[this.rtl ? i - 1 - u : u] + o
                        var a = this.score ? this.score(e, f, p, o, u) : Oe(g, l, p, i, u)
                        Ee(this, h, o, a, t, r)
                      }
                      o = ""
                    }
                  case "forward":
                    if (1 < i) {
                      for (u = 0; u < i; u++)
                        ((o += f[this.rtl ? i - 1 - u : u]), Ee(this, h, o, s, t, r))
                      break
                    }
                  default:
                    if ((Ee(this, h, f, s, t, r), n && 1 < l && p < l - 1)) {
                      for (
                        i = A(),
                          o = this.U,
                          s = f,
                          u = Math.min(n + 1, this.rtl ? p + 1 : l - p),
                          i[s] = 1,
                          a = 1;
                        a < u;
                        a++
                      )
                        if ((f = e[this.rtl ? l - 1 - p - a : p + a]) && !i[f]) {
                          i[f] = 1
                          let d = this.score
                              ? this.score(e, s, p, f, a - 1)
                              : Oe(o + (l / 2 > o ? 0 : 1), l, p, u - 1, a - 1),
                            C = this.bidirectional && f > s
                          Ee(this, c, C ? s : f, d, t, r, C ? f : s)
                        }
                    }
                }
              }
            }
            this.fastupdate || this.reg.add(t)
          } else e = ""
        }
        return (this.db && (e || this.commit_task.push({ del: t }), this.T && sr(this)), this)
      }
      k.prototype.search = function (t, e, r) {
        r ||
          (e || typeof t != "object"
            ? typeof e == "object" && ((r = e), (e = 0))
            : ((r = t), (t = "")))
        let n = [],
          i,
          s,
          o,
          u = 0,
          a,
          l,
          c,
          h,
          g
        ;(r
          ? ((t = r.query || t),
            (e = r.limit || e),
            (u = r.offset || 0),
            (s = r.context),
            (o = r.suggest),
            (g = (a = r.resolve !== !1) && r.enrich),
            (c = r.boost),
            (h = r.resolution),
            (l = this.db && r.tag))
          : (a = this.resolve),
          (s = this.depth && s !== !1))
        let p = this.encoder.encode(t, !s)
        if (((i = p.length), (e = e || (a ? 100 : 0)), i === 1))
          return Kt.call(this, p[0], "", e, u, a, g, l)
        if (i === 2 && s && !o) return Kt.call(this, p[1], p[0], e, u, a, g, l)
        let f = A(),
          d = 0,
          C
        if (
          (s && ((C = p[0]), (d = 1)), h || h === 0 || (h = C ? this.U : this.resolution), this.db)
        ) {
          if (this.db.search && ((t = this.db.search(this, p, e, u, o, a, g, l)), t !== !1))
            return t
          let D = this
          return (async function () {
            for (let y, R; d < i; d++) {
              if ((R = p[d]) && !f[R]) {
                if (((f[R] = 1), (y = await ut(D, R, C, 0, 0, !1, !1)), (y = $t(y, n, o, h)))) {
                  n = y
                  break
                }
                C && ((o && y && n.length) || (C = R))
              }
              o &&
                C &&
                d === i - 1 &&
                !n.length &&
                ((h = D.resolution), (C = ""), (d = -1), (f = A()))
            }
            return Pt(n, h, e, u, o, c, a)
          })()
        }
        for (let D, y; d < i; d++) {
          if ((y = p[d]) && !f[y]) {
            if (((f[y] = 1), (D = ut(this, y, C, 0, 0, !1, !1)), (D = $t(D, n, o, h)))) {
              n = D
              break
            }
            C && ((o && D && n.length) || (C = y))
          }
          o &&
            C &&
            d === i - 1 &&
            !n.length &&
            ((h = this.resolution), (C = ""), (d = -1), (f = A()))
        }
        return Pt(n, h, e, u, o, c, a)
      }
      m = k.prototype
      m.mount = function (t) {
        return (
          this.commit_timer && (clearTimeout(this.commit_timer), (this.commit_timer = null)),
          t.mount(this)
        )
      }
      m.commit = function (t, e) {
        return (
          this.commit_timer && (clearTimeout(this.commit_timer), (this.commit_timer = null)),
          this.db.commit(this, t, e)
        )
      }
      m.destroy = function () {
        return (
          this.commit_timer && (clearTimeout(this.commit_timer), (this.commit_timer = null)),
          this.db.destroy()
        )
      }
      m.clear = function () {
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
      m.append = function (t, e) {
        return this.add(t, e, !0)
      }
      m.contain = function (t) {
        return this.db ? this.db.has(t) : this.reg.has(t)
      }
      m.update = function (t, e) {
        let r = this,
          n = this.remove(t)
        return n && n.then ? n.then(() => r.add(t, e)) : this.add(t, e)
      }
      m.cleanup = function () {
        return this.fastupdate ? (ve(this.map), this.depth && ve(this.ctx), this) : this
      }
      m.searchCache = nr
      m.export = function (t, e, r = 0, n = 0) {
        let i, s
        switch (n) {
          case 0:
            ;((i = "reg"), (s = Vt(this.reg)))
            break
          case 1:
            ;((i = "cfg"), (s = null))
            break
          case 2:
            ;((i = "map"), (s = ct(this.map, this.reg.size)))
            break
          case 3:
            ;((i = "ctx"), (s = Gt(this.ctx, this.reg.size)))
            break
          default:
            return
        }
        return ke.call(this, t, e, i, s, r, n)
      }
      m.import = function (t, e) {
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
              ;((this.fastupdate = !1), (this.reg = Xt(e, this.reg)))
              break
            case "map":
              this.map = ht(e, this.map)
              break
            case "ctx":
              this.ctx = Wt(e, this.ctx)
          }
      }
      m.serialize = function (t = !0) {
        let e = "",
          r = "",
          n = ""
        if (this.reg.size) {
          let s
          for (var i of this.reg.keys())
            (s || (s = typeof i), (e += (e ? "," : "") + (s === "string" ? '"' + i + '"' : i)))
          ;((e = "index.reg=new Set([" + e + "]);"),
            (r = Bt(this.map, s)),
            (r = "index.map=new Map([" + r + "]);"))
          for (let o of this.ctx.entries()) {
            i = o[0]
            let u = Bt(o[1], s)
            ;((u = "new Map([" + u + "])"),
              (u = '["' + i + '",' + u + "]"),
              (n += (n ? "," : "") + u))
          }
          n = "index.ctx=new Map([" + n + "]);"
        }
        return t ? "function inject(index){" + e + r + n + "}" : e + r + n
      }
      lt(k.prototype)
      ;((or =
        typeof window < "u" &&
        (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB)),
        (_e = ["map", "ctx", "tag", "reg", "cfg"]),
        (Y = A()))
      m = Ue.prototype
      m.mount = function (t) {
        return t.index ? t.mount(this) : ((t.db = this), this.open())
      }
      m.open = function () {
        if (this.db) return this.db
        let t = this
        ;(navigator.storage && navigator.storage.persist(),
          Y[t.id] || (Y[t.id] = []),
          Y[t.id].push(t.field))
        let e = or.open(t.id, 1)
        return (
          (e.onupgradeneeded = function () {
            let r = (t.db = this.result)
            for (let n = 0, i; n < _e.length; n++) {
              i = _e[n]
              for (let s = 0, o; s < Y[t.id].length; s++)
                ((o = Y[t.id][s]),
                  r.objectStoreNames.contains(i + (i !== "reg" && o ? ":" + o : "")) ||
                    r.createObjectStore(i + (i !== "reg" && o ? ":" + o : "")))
            }
          }),
          (t.db = $(e, function (r) {
            ;((t.db = r),
              (t.db.onversionchange = function () {
                t.close()
              }))
          }))
        )
      }
      m.close = function () {
        ;(this.db && this.db.close(), (this.db = null))
      }
      m.destroy = function () {
        let t = or.deleteDatabase(this.id)
        return $(t)
      }
      m.clear = function () {
        let t = []
        for (let r = 0, n; r < _e.length; r++) {
          n = _e[r]
          for (let i = 0, s; i < Y[this.id].length; i++)
            ((s = Y[this.id][i]), t.push(n + (n !== "reg" && s ? ":" + s : "")))
        }
        let e = this.db.transaction(t, "readwrite")
        for (let r = 0; r < t.length; r++) e.objectStore(t[r]).clear()
        return $(e)
      }
      m.get = function (t, e, r = 0, n = 0, i = !0, s = !1) {
        t = this.db
          .transaction((e ? "ctx" : "map") + (this.field ? ":" + this.field : ""), "readonly")
          .objectStore((e ? "ctx" : "map") + (this.field ? ":" + this.field : ""))
          .get(e ? e + ":" + t : t)
        let o = this
        return $(t).then(function (u) {
          let a = []
          if (!u || !u.length) return a
          if (i) {
            if (!r && !n && u.length === 1) return u[0]
            for (let l = 0, c; l < u.length; l++)
              if ((c = u[l]) && c.length) {
                if (n >= c.length) {
                  n -= c.length
                  continue
                }
                let h = r ? n + Math.min(c.length - n, r) : c.length
                for (let g = n; g < h; g++) a.push(c[g])
                if (((n = 0), a.length === r)) break
              }
            return s ? o.enrich(a) : a
          }
          return u
        })
      }
      m.tag = function (t, e = 0, r = 0, n = !1) {
        t = this.db
          .transaction("tag" + (this.field ? ":" + this.field : ""), "readonly")
          .objectStore("tag" + (this.field ? ":" + this.field : ""))
          .get(t)
        let i = this
        return $(t).then(function (s) {
          return !s || !s.length || r >= s.length
            ? []
            : !e && !r
              ? s
              : ((s = s.slice(r, r + e)), n ? i.enrich(s) : s)
        })
      }
      m.enrich = function (t) {
        typeof t != "object" && (t = [t])
        let e = this.db.transaction("reg", "readonly").objectStore("reg"),
          r = []
        for (let n = 0; n < t.length; n++) r[n] = $(e.get(t[n]))
        return Promise.all(r).then(function (n) {
          for (let i = 0; i < n.length; i++)
            n[i] = { id: t[i], doc: n[i] ? JSON.parse(n[i]) : null }
          return n
        })
      }
      m.has = function (t) {
        return (
          (t = this.db.transaction("reg", "readonly").objectStore("reg").getKey(t)),
          $(t).then(function (e) {
            return !!e
          })
        )
      }
      m.search = null
      m.info = function () {}
      m.transaction = function (t, e, r) {
        t += t !== "reg" && this.field ? ":" + this.field : ""
        let n = this.h[t + ":" + e]
        if (n) return r.call(this, n)
        let i = this.db.transaction(t, e)
        this.h[t + ":" + e] = n = i.objectStore(t)
        let s = r.call(this, n)
        return (
          (this.h[t + ":" + e] = null),
          $(i).finally(function () {
            return ((i = n = null), s)
          })
        )
      }
      m.commit = async function (t, e, r) {
        if (e) (await this.clear(), (t.commit_task = []))
        else {
          let n = t.commit_task
          t.commit_task = []
          for (let i = 0, s; i < n.length; i++)
            if (((s = n[i]), s.clear)) {
              ;(await this.clear(), (e = !0))
              break
            } else n[i] = s.del
          e || (r || (n = n.concat(Hr(t.reg))), n.length && (await this.remove(n)))
        }
        t.reg.size &&
          (await this.transaction("map", "readwrite", function (n) {
            for (let i of t.map) {
              let s = i[0],
                o = i[1]
              o.length &&
                (e
                  ? n.put(o, s)
                  : (n.get(s).onsuccess = function () {
                      let u = this.result
                      var a
                      if (u && u.length) {
                        let l = Math.max(u.length, o.length)
                        for (let c = 0, h, g; c < l; c++)
                          if ((g = o[c]) && g.length) {
                            if ((h = u[c]) && h.length) for (a = 0; a < g.length; a++) h.push(g[a])
                            else u[c] = g
                            a = 1
                          }
                      } else ((u = o), (a = 1))
                      a && n.put(u, s)
                    }))
            }
          }),
          await this.transaction("ctx", "readwrite", function (n) {
            for (let i of t.ctx) {
              let s = i[0],
                o = i[1]
              for (let u of o) {
                let a = u[0],
                  l = u[1]
                l.length &&
                  (e
                    ? n.put(l, s + ":" + a)
                    : (n.get(s + ":" + a).onsuccess = function () {
                        let c = this.result
                        var h
                        if (c && c.length) {
                          let g = Math.max(c.length, l.length)
                          for (let p = 0, f, d; p < g; p++)
                            if ((d = l[p]) && d.length) {
                              if ((f = c[p]) && f.length)
                                for (h = 0; h < d.length; h++) f.push(d[h])
                              else c[p] = d
                              h = 1
                            }
                        } else ((c = l), (h = 1))
                        h && n.put(c, s + ":" + a)
                      }))
              }
            }
          }),
          t.store
            ? await this.transaction("reg", "readwrite", function (n) {
                for (let i of t.store) {
                  let s = i[0],
                    o = i[1]
                  n.put(typeof o == "object" ? JSON.stringify(o) : 1, s)
                }
              })
            : t.bypass ||
              (await this.transaction("reg", "readwrite", function (n) {
                for (let i of t.reg.keys()) n.put(1, i)
              })),
          t.tag &&
            (await this.transaction("tag", "readwrite", function (n) {
              for (let i of t.tag) {
                let s = i[0],
                  o = i[1]
                o.length &&
                  (n.get(s).onsuccess = function () {
                    let u = this.result
                    ;((u = u && u.length ? u.concat(o) : o), n.put(u, s))
                  })
              }
            })),
          t.map.clear(),
          t.ctx.clear(),
          t.tag && t.tag.clear(),
          t.store && t.store.clear(),
          t.document || t.reg.clear())
      }
      m.remove = function (t) {
        return (
          typeof t != "object" && (t = [t]),
          Promise.all([
            this.transaction("map", "readwrite", function (e) {
              e.openCursor().onsuccess = function () {
                let r = this.result
                r && it(r, t)
              }
            }),
            this.transaction("ctx", "readwrite", function (e) {
              e.openCursor().onsuccess = function () {
                let r = this.result
                r && it(r, t)
              }
            }),
            this.transaction("tag", "readwrite", function (e) {
              e.openCursor().onsuccess = function () {
                let r = this.result
                r && it(r, t, !0)
              }
            }),
            this.transaction("reg", "readwrite", function (e) {
              for (let r = 0; r < t.length; r++) e.delete(t[r])
            }),
          ])
        )
      }
      ar = {
        Index: k,
        Charset: ir,
        Encoder: le,
        Document: J,
        Worker: ce,
        Resolver: S,
        IndexedDB: Ue,
        Language: {},
      }
    })
  var pr = {}
  vr(pr, {
    cleanupSearch: () => nn,
    createSearchPreview: () => gr,
    highlightSearchResults: () => pt,
    initializeSearch: () => tn,
    initializeSearchIndex: () => cr,
    performSearch: () => hr,
    renderSearchResults: () => fr,
  })
  function cr(t, e = {}) {
    ;((ft = t),
      (ee = { ...ee, ...e }),
      (Ae = new ar.Document({
        document: {
          id: "slug",
          index: ["title", "content", "tags"],
          store: ["title", "content", "tags", "slug"],
        },
        tokenize: "forward",
        resolution: 9,
        context: { depth: 2, resolution: 5, bidirectional: !0 },
      })))
    for (let r of ft) Ae.add(r)
  }
  function hr(t, e = 10) {
    if (!Ae || !t.trim()) return []
    try {
      let r = Ae.search(t, { limit: e, enrich: !0 }),
        n = []
      for (let i of r)
        if (Array.isArray(i.result))
          for (let s of i.result) {
            let o = s.doc
            n.push({ id: n.length, slug: o.slug, title: o.title, content: o.content, tags: o.tags })
          }
      return n.slice(0, e)
    } catch (r) {
      return (console.error("Search error:", r), [])
    }
  }
  function pt(t, e) {
    if (!e.trim()) return t
    let r = new RegExp(`(${e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    return t.replace(r, '<mark class="search-highlight">$1</mark>')
  }
  function gr(t, e, r = 200) {
    if (!ee.enablePreview) return ""
    let n = t.replace(/<[^>]*>/g, "").trim()
    if (!e.trim()) return n.slice(0, r) + (n.length > r ? "..." : "")
    let i = n.toLowerCase().indexOf(e.toLowerCase())
    if (i === -1) return n.slice(0, r) + (n.length > r ? "..." : "")
    let s = Math.max(0, i - Math.floor(r / 2)),
      o = Math.min(n.length, s + r),
      u = n.slice(s, o)
    return (s > 0 && (u = "..." + u), o < n.length && (u = u + "..."), pt(u, e))
  }
  function fr(t, e, r, n) {
    if (t.length === 0) {
      r.innerHTML = `
      <div class="search-no-results">
        <p>No results found for "${e}"</p>
      </div>
    `
      return
    }
    let i = t
      .map((s) => {
        let o = gr(s.content, e),
          u = pt(s.title, e),
          a = Rt(n, s.slug),
          l =
            ee.showTags && s.tags.length > 0
              ? `<div class="search-tags">${s.tags.map((c) => `<span class="search-tag">#${c}</span>`).join("")}</div>`
              : ""
        return `
      <li class="search-result-item">
        <a href="${a}" class="search-result-link">
          <h3 class="search-result-title">${u}</h3>
          ${o ? `<p class="search-result-preview">${o}</p>` : ""}
          ${l}
        </a>
      </li>
    `
      })
      .join("")
    r.innerHTML = `
    <div class="search-results-header">
      <p class="search-results-count">Found ${t.length} result${t.length === 1 ? "" : "s"} for "${e}"</p>
    </div>
    <ul class="search-results-list">
      ${i}
    </ul>
  `
  }
  async function tn(t, e) {
    try {
      let r = JSON.parse(t.dataset.cfg || "{}")
      ee = { ...ee, ...r }
      let n = new URL("static/contentIndex.json", window.location.origin),
        i = await fetch(n.toString())
      if (!i.ok) throw new Error(`Failed to fetch search data: ${i.status}`)
      let s = await i.json(),
        o = Object.values(s)
      ;(cr(o, ee), rn(t, e))
    } catch (r) {
      ;(console.error("Failed to initialize search:", r),
        (t.innerHTML = `
      <div class="search-error">
        <p>Failed to load search functionality</p>
        <button onclick="location.reload()">Retry</button>
      </div>
    `))
    }
  }
  function rn(t, e) {
    let r = t.querySelector(".search-input"),
      n = t.querySelector(".search-results")
    if (!r || !n) {
      console.error("Search input or results container not found")
      return
    }
    let i,
      s = () => {
        let o = r.value.trim()
        if (o.length < 2) {
          n.innerHTML = ""
          return
        }
        let u = hr(o, 10)
        fr(u, o, n, e)
      }
    ;(r.addEventListener("input", () => {
      ;(clearTimeout(i), (i = setTimeout(s, 300)))
    }),
      r.addEventListener("keydown", (o) => {
        o.key === "Escape" && (r.blur(), (n.innerHTML = ""))
      }),
      lr &&
        lr.addCleanupTask(() => {
          clearTimeout(i)
        }))
  }
  function nn() {
    ;((Ae = null), (ft = []))
  }
  var lr,
    Ae,
    ft,
    ee,
    dr = b(() => {
      "use strict"
      ur()
      et()
      X()
      ;((lr = H.instance),
        (Ae = null),
        (ft = []),
        (ee = { enablePreview: !0, showTags: !0, searchType: "basic" }))
    })
  X()
  G()
  xe()
  we()
  X()
  var Le = class {
      config
      state
      resourceManager = H.instance
      storageManager = se.instance
      cacheManager = V.instance
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
            e.forEach((r) => this.state.elements.add(r)),
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
              } catch (r) {
                console.error(`[${this.config.name}] Cleanup task failed:`, r)
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
        return v.generateSystemKey(this.config.cacheConfig.prefix, ...e)
      }
      generateUserCacheKey(e) {
        return v.generateUserKey(this.config.cacheConfig.prefix, e)
      }
      generateContentCacheKey(e) {
        return v.generateContentKey(e)
      }
      setStorageItem(e, r) {
        if (!this.storageManager)
          throw new Error(`[${this.config.name}] StorageManager not available`)
        this.storageManager.setItem("local", e, r)
      }
      getStorageItem(e, r) {
        if (!this.storageManager)
          throw new Error(`[${this.config.name}] StorageManager not available`)
        let n = this.storageManager.getItem("local", e)
        return n !== null ? n : (r ?? null)
      }
      setCacheItem(e, r, n) {
        if (!this.cacheManager) throw new Error(`[${this.config.name}] CacheManager not available`)
        this.cacheManager.set(e, r, n ?? this.config.cacheConfig.ttl)
      }
      getCacheItem(e) {
        if (!this.cacheManager) throw new Error(`[${this.config.name}] CacheManager not available`)
        return this.cacheManager.get(e)
      }
      addCleanupTask(e) {
        this.state.cleanupTasks.push(e)
      }
      addEventListener(e, r, n, i) {
        this.resourceManager
          ? this.resourceManager.addEventListener(e, r, n, i)
          : (e.addEventListener(r, n, i),
            this.addCleanupTask(() => {
              e.removeEventListener(r, n, i)
            }))
      }
      log(e, ...r) {
        this.config.debug && console.log(`[${this.config.name}] ${e}`, ...r)
      }
      error(e, ...r) {
        console.error(`[${this.config.name}] ${e}`, ...r)
      }
      validateGlobalInstances() {
        if (!this.resourceManager)
          throw new Error(`[${this.config.name}] ResourceManager not available`)
        if (!this.storageManager)
          throw new Error(`[${this.config.name}] StorageManager not available`)
        if (!this.cacheManager) throw new Error(`[${this.config.name}] CacheManager not available`)
      }
    },
    Ce = class {
      static instances = new Map()
      static register(e, r) {
        this.instances.set(e, r)
      }
      static get(e) {
        return this.instances.get(e)
      }
      static async initialize(e) {
        let r = this.get(e)
        if (!r) throw new Error(`Component manager '${e}' not registered`)
        await r.initialize()
      }
      static async initializeAll() {
        let e = Array.from(this.instances.values()).map((r) =>
          r.initialize().catch((n) => {
            console.error("Component manager initialization failed:", n)
          }),
        )
        await Promise.all(e)
      }
      static getRegisteredComponents() {
        return Array.from(this.instances.keys())
      }
    }
  et()
  X()
  function Lt(t, e) {
    if (!t) return
    function r(i) {
      i.target === this && (i.preventDefault(), i.stopPropagation(), e())
    }
    function n(i) {
      i.key.startsWith("Esc") && (i.preventDefault(), e())
    }
    ;(t?.addEventListener("click", r),
      H.instance.addCleanupTask(() => t?.removeEventListener("click", r)),
      document.addEventListener("keydown", n),
      H.instance.addCleanupTask(() => document.removeEventListener("keydown", n)))
  }
  var te = new Map(),
    He = null,
    Me = class t extends Le {
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
          (this.state.currentSlug = Ze(window)),
          (this.currentSlug = this.state.currentSlug),
          this.log("Current slug:", this.currentSlug),
          this.schedulePreload())
      }
      onSetupEventListeners() {
        ;(Lt(document.documentElement, () => {
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
        if (((this.currentSlug = Ze(window)), e.length === 0)) {
          this.log("No search elements found on this page")
          return
        }
        ;(e.forEach((r) => {
          this.setupSearchElement(r)
        }),
          this.log(`Setup completed for ${e.length} search elements`))
      }
      onCleanup() {
        ;(te.clear(), (He = null), this.log("Search component cleanup completed"))
      }
      setupSearchElement(e) {
        if (te.has(e)) {
          this.log("Search element already setup, skipping")
          return
        }
        let r = e.querySelector(t.SELECTORS.SEARCH_INPUT),
          n = e.querySelector(t.SELECTORS.SEARCH_BUTTON)
        ;(r && this.setupInputTriggers(e, r),
          n && this.setupIconTrigger(e, n),
          te.set(e, !1),
          this.log("Search element setup completed"))
      }
      setupInputTriggers(e, r) {
        let n = () => {
          ;(this.initializeSearchElement(e), this.removeInputTriggers(r, n))
        }
        ;(this.addEventListener(r, "focus", n),
          this.addEventListener(r, "input", n),
          this.addCleanupTask(() => {
            this.removeInputTriggers(r, n)
          }))
      }
      removeInputTriggers(e, r) {
        ;(e.removeEventListener("focus", r), e.removeEventListener("input", r))
      }
      setupIconTrigger(e, r) {
        let n = () => {
          ;(this.initializeSearchElement(e), r.removeEventListener("click", n))
        }
        ;(this.addEventListener(r, "click", n),
          this.addCleanupTask(() => {
            r.removeEventListener("click", n)
          }))
      }
      async initializeSearchElement(e) {
        if (te.get(e)) {
          this.log("Search element already loading, skipping")
          return
        }
        te.set(e, !0)
        try {
          ;(this.log("Initializing search element..."),
            this.showLoadingState(e),
            await (await this.loadSearchModule()).initializeSearch(e, this.currentSlug),
            this.restoreSearchInput(e))
          let n = e.querySelector(t.SELECTORS.SEARCH_ROOT)
          ;(n && n.classList.add("active"), this.log("Search element initialized successfully"))
        } catch (r) {
          ;(this.error("Failed to load search module:", r), this.showErrorState(e))
        } finally {
          te.set(e, !1)
        }
      }
      showLoadingState(e) {
        let r = e.querySelector(t.SELECTORS.SEARCH_INPUT)
        r &&
          (r.setAttribute("placeholder", "Loading search..."), r.setAttribute("disabled", "true"))
      }
      restoreSearchInput(e) {
        let r = e.querySelector(t.SELECTORS.SEARCH_INPUT)
        r && (r.removeAttribute("disabled"), r.setAttribute("placeholder", "Search..."))
      }
      showErrorState(e) {
        let r = e.querySelector(t.SELECTORS.SEARCH_INPUT)
        r && (r.setAttribute("placeholder", "Search failed to load"), r.removeAttribute("disabled"))
      }
      async loadSearchModule() {
        return (He || (He = Promise.resolve().then(() => (dr(), pr))), He)
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
        ;(document.querySelectorAll(t.SELECTORS.SEARCH_ROOT).forEach((r) => {
          r.classList.remove("active")
          let n = r.querySelector(t.SELECTORS.SEARCH_INPUT)
          n && ((n.value = ""), n.blur())
        }),
          this.log("ESC key handled, closed active searches"))
      }
      activateFirstSearchElement() {
        let e = this.findComponentElements()
        if (e.length > 0) {
          this.initializeSearchElement(e[0])
          let r = e[0].querySelector(t.SELECTORS.SEARCH_ROOT)
          r && r.classList.add("active")
          let n = e[0].querySelector(t.SELECTORS.SEARCH_INPUT)
          ;(n && n.focus(), this.log("Activated first search element via shortcut"))
        }
      }
      getSearchStats() {
        return {
          loadingElements: Array.from(te.values()).filter((r) => r).length,
          totalElements: this.state.elements?.size || 0,
          cacheHits: 0,
        }
      }
    },
    Hi = new Me()
  function mr() {
    let t = new Me()
    ;(Ce.register("search", t), Ce.initialize("search"))
  }
  window.initSearch = mr
})()
