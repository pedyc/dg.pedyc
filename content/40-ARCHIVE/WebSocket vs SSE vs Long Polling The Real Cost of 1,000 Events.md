---
title: WebSocket vs SSE vs Long Polling The Real Cost of 1,000 Events
author: ["[[Serdarcan Büyükdereli]]"]
description: "Compare WebSocket, SSE and long polling with real measurements: wire bytes per event, latency at a 50 ms round trip, and what HTTP/2 changes for each."
tags: ["clippings"]
date-created: 2026-08-16
date-modified: 2026-08-16
created: 2026-08-16
published: 2026-08-12
source: "https://theinfinity.dev/articles/websocket-vs-sse-vs-polling?via=dailydev"
---

Delivering 1,000 events of roughly 117 bytes each costs 119,692 bytes over a WebSocket and 884,698 bytes over long polling. Same server, same event schedule, same payload. Long polling moved 7.4 times the traffic to deliver identical data.

Nearly two thirds of that long-polling total — 569,890 bytes — was HTTP request headers, re-sent 1,000 times. A single session cookie accounted for more of it than the events themselves.

This comparison usually gets decided from a table that says "bidirectional: yes/no" and nothing else. So I built the three transports in Node, put a byte-counting TCP proxy between client and server, and ran the same event stream through each. Every number below came out of that harness. Where I could not measure something, I say so.

The conclusion is not "use WebSockets." For most server-to-client feeds, SSE costs 10% more bytes than a WebSocket, gives you reconnection for free, and needs no new operational surface. That is usually the right trade.

## What does each transport cost on the wire?

Delivering the same 1,000 events costs 119,692 bytes over a WebSocket, 131,596 over SSE, and 884,698 over long polling with realistic browser headers. The gap is framing, not payload — every scenario carried the same ~116.9 KB of JSON.

| Transport | Total wire bytes | Bytes per event | × payload | TCP connections | HTTP requests |
| --- | --- | --- | --- | --- | --- |
| WebSocket (HTTP/1.1) | 119,692 | 119.7 | 1.02 | 1 | 0 |
| SSE (HTTP/1.1) | 131,596 | 131.6 | 1.13 | 1 | 1 |
| SSE (HTTP/2) | 134,534 | 134.5 | 1.15 | 1 | 1 |
| Long polling (HTTP/2) | 182,475 | 182.5 | 1.56 | 1 | 1,000 |
| Long polling (HTTP/1.1, keep-alive) | 884,698 | 884.7 | 7.57 | 1 | 1,000 |
| Long polling (HTTP/1.1, no keep-alive) | 851,691 | 851.7 | 7.29 | 1,000 | 1,000 |
| WebSocket + permessage-deflate | 30,434 | 30.4 | 0.26 | 1 | 0 |

The WebSocket number matches the spec arithmetic. [RFC 6455](https://www.rfc-editor.org/rfc/rfc6455#section-5.2) gives a server-to-client frame a 2-byte header for payloads up to 125 bytes, and my measured server-to-client overhead was 2.1 bytes per message — the extra tenth is the handful of messages whose timestamp pushed them past 125 bytes into a 4-byte header. There is nothing else on the wire: no headers, no status line, no cookie.

SSE costs 14.2 bytes per event. Eight of those are the wire format itself — `data: ` plus the blank-line terminator. The remaining six are HTTP/1.1 chunked transfer encoding, which wraps every write in a hex length and two CRLFs. That is the entire price of using a plain HTTP response instead of a binary frame.

Long polling pays 570 bytes of request headers and 198 bytes of response headers for each 117-byte event. Strip the browser headers down to what a bare Node client sends and the total falls to 406,710 bytes — better, but still 3.5× the payload, because the response headers and the request line never go away.

> [!note] Note
> ⚠️ **Watch out:** the no-keep-alive row looks cheaper (851,691 vs 884,698 bytes) only because `Connection: close` is a shorter string than `Connection: keep-alive`. It opened 1,000 TCP connections instead of 1, and my proxy counts TCP payload bytes only — not the SYN/ACK and FIN exchanges, and not a TLS handshake per connection. On HTTPS it is the most expensive row by a wide margin.

For a refresher on what a connection setup costs at the packet level, the [TCP/UDP visualizer](https://theinfinity.dev/simulators/tcp-udp-visualizer) walks through the handshake step by step.

## Does HTTP/2 fix long polling?

Mostly, yes. Moving long polling to HTTP/2 cut per-request header bytes from 570 to 36 — a 15.6× reduction — and the total from 884,698 bytes to 182,475. HPACK compresses the repeated header set down to references after the first request, so the cookie and user-agent stop being re-sent literally.

That changes the decision. Long polling on HTTP/2 costs 1.56× the payload, against 1.13× for SSE and 1.02× for a WebSocket. It is no longer absurd, merely mediocre. If you already terminate HTTP/2 at the edge and your event rate is low, the byte argument against long polling largely evaporates.

HTTP/2 does not make SSE cheaper, though — it made it slightly worse, 134,534 bytes against 131,596, because each DATA frame carries a 9-byte header where chunked encoding used about 6. The reason to run SSE over HTTP/2 is the connection limit, not bandwidth.

Browsers cap HTTP/1.1 at six connections per origin, and [MDN is blunt about what that does to SSE](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events): the limit "is per browser and is set to a very low number (6)," shared across every tab pointed at the same domain. A user with seven tabs open has one tab that silently never connects. Over HTTP/2 the ceiling becomes the negotiated stream limit, which [RFC 9113 recommends](https://www.rfc-editor.org/rfc/rfc9113.html#name-defined-settings) be no smaller than 100. This is the most common way a working SSE implementation fails in production.

I could not measure WebSocket over HTTP/2 ([RFC 8441](https://www.rfc-editor.org/rfc/rfc8441) Extended CONNECT), because Node's built-in `http2` server does not implement it. That row is absent rather than estimated.

## Is WebSocket actually faster per message?

No. At one event every 100 ms over a simulated 50 ms round trip, all three transports delivered in about 26.5 ms — the difference between them was under 0.3 ms. Long polling only falls behind when events arrive faster than a round trip.

| Scenario (50 ms simulated RTT) | Mean | p50 | p95 | Max | Events per HTTP response |
| --- | --- | --- | --- | --- | --- |
| WebSocket, 1 event / 100 ms | 26.46 ms | 26.47 | 26.84 | 27.66 | — (frames) |
| SSE, 1 event / 100 ms | 26.52 ms | 26.56 | 26.91 | 27.10 | — (one stream) |
| Long polling, 1 event / 100 ms | 26.75 ms | 26.86 | 27.28 | 28.05 | 1.0 |
| WebSocket, 1 event / 20 ms | 26.16 ms | 26.25 | 26.82 | 27.40 | — (frames) |
| SSE, 1 event / 20 ms | 26.29 ms | 26.38 | 27.00 | 30.03 | — (one stream) |
| Long polling, 1 event / 20 ms | 52.44 ms | 51.95 | 76.96 | 80.37 | 2.5 |

The mechanism is a gap, not a protocol tax. A long-poll client is only listening while its request is parked on the server. The moment the server answers, the client is deaf for one full round trip while the response travels down and the next request travels back up. Events produced inside that window queue up and ship on the next poll. At one event per 100 ms the gap almost never catches one; at one event per 20 ms it catches two or three every cycle.

That batching is what saves long polling from collapsing — the client delivers in bursts instead of falling permanently behind. If your product tolerates bursts, a notification bell or an order status or a build log, long polling is not slow. If it does not, a cursor position or a trading tick, it is structurally wrong and no tuning fixes it.

Loopback hides all of this. Without the injected delay every transport measured well under a millisecond and long polling looked free. Benchmark real-time transports on localhost and you will conclude they are identical, right up until you deploy.

## What does a connection cost the server?

Holding 500 idle connections cost the Node server about 13 KB of RSS per WebSocket, 23 KB per SSE stream, and 21 KB per parked long-poll request. Across four repeat runs each figure varied by 1 KB per connection or less.

WebSockets came out cheapest, which surprised me and is worth stating plainly: 6.2-6.7 MB for 500 connections, against 11.0-11.2 MB for SSE and 10.3-10.9 MB for long polling. Once the `ws` library takes the socket over, Node's HTTP machinery is out of the picture. An open SSE response, by contrast, keeps an `IncomingMessage`, a `ServerResponse` and the HTTP parser state alive for as long as the stream lives.

Read that as a Node result, not a law of nature — a Go or Rust server would produce different ratios. What transfers is the shape of the problem: all three hold one open connection per client, so the file-descriptor and memory ceiling is the same order of magnitude. Long polling does not save you connections. A correct implementation parks the request server-side, which is exactly as open as an SSE stream.

## When is SSE enough?

SSE is enough whenever the data flows server to client, is text, and the client does not need to send anything back over the same channel. That covers notifications, live dashboards, progress and log streams, LLM token streaming, and price feeds — most of what people reach for WebSockets to build.

What you get for that 10% byte premium is reconnection you do not have to write. The [HTML specification](https://html.spec.whatwg.org/multipage/server-sent-events.html) requires `EventSource` to reconnect on its own, and to send the last received `id` back as a `Last-Event-ID` request header. Your server reads that header and resumes from the right point. The server can tune the delay by sending a `retry:` field. With a WebSocket, you write the reconnect loop, the backoff, the resume cursor and the duplicate suppression yourself — every time.

The limits are real and worth knowing before you commit:

- **One direction only.** MDN states it flatly: "This is a one-way connection, so you can't send events from a client to a server." Client-to-server messages go over ordinary `fetch` calls, which is fine for low-rate actions and bad for high-rate ones.
- **UTF-8 text only.** The spec requires event streams to be encoded as UTF-8. Binary means base64, which costs 33% before any framing.
- **No custom request headers.** `EventSource` takes a URL and `withCredentials`; there is no header option. Bearer-token auth needs a cookie, a query parameter, or a `fetch` -based polyfill.
- **Six connections per origin** under HTTP/1.1, as covered above.

```javascript
// The whole client, including resume-after-disconnect.
const es = new EventSource('/events', { withCredentials: true });

es.addEventListener('trade', (e) => {
  render(JSON.parse(e.data));
});

// No reconnect handler needed: the browser retries and replays
// the last id back as the Last-Event-ID request header.
```

```javascript
// Server side: emit an id so the browser can resume, and tell it how
// long to wait before retrying.
res.writeHead(200, {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-store',
  'X-Accel-Buffering': 'no', // nginx buffers proxied responses by default
});
res.flushHeaders();
res.write('retry: 2000\n\n');

function send(event, id, data) {
  res.write(\`id: ${id}\nevent: ${event}\ndata: ${JSON.stringify(data)}\n\n\`);
}
```

An `id:` line costs about 11 more bytes per event at five-digit ids. On my numbers that moves SSE from 14.2 to roughly 25 bytes of overhead per event — still a fraction of long polling's 768.

## What breaks these in production?

Idle timeouts break them, and they break SSE and WebSocket alike because both depend on a connection nobody is talking on. An [Application Load Balancer defaults to a 60-second connection idle timeout](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/edit-load-balancer-attributes.html) — "the period of time an existing client or target connection can remain inactive, with no data being sent or received, before the load balancer closes the connection" — configurable from 1 to 4,000 seconds. [Cloudflare](https://developers.cloudflare.com/network/websockets/) supports WebSockets on all plans and likewise "will close a WebSocket connection when no data is transmitted in either direction for a period of time."

The fix is a heartbeat, and the SSE spec spells out the cheap version: send a comment line starting with `:` every 15 seconds or so. A line starting with a colon is ignored by the client and costs a handful of bytes. WebSockets have protocol-level ping/pong frames for the same job. Note that ALB documents one gap here: it "does not support HTTP/2 PING frames. These do not reset the connection idle timeout."

The second classic failure is buffering. Nginx ships with [`proxy_buffering on` by default](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffering), which means it collects the response before forwarding it. An SSE stream behind default nginx config arrives all at once, at the end, or never. The response header `X-Accel-Buffering: no` disables it per response, which is why it is in the snippet above.

> [!note] Note
> ⚠️ **Watch out:** these two failures look identical from the browser — a stream that connects and then goes quiet. Check the proxy before you rewrite the application. A stream that dies at a suspiciously round interval (60 s, 100 s) is a timeout; a stream that delivers everything in one burst at the end is buffering.

The third is fan-out. All three pin a client to one server process, so an event produced on instance B has to reach a client connected to instance A. That means Redis pub/sub, a message bus, or sticky routing — and it is the same problem for all three. Choosing long polling to dodge it does not work, because a parked request is just as pinned.

## Which one should you actually pick?

Pick by the direction and rate of your data, not by which protocol sounds most modern.

| Requirement | Choose | Why |
| --- | --- | --- |
| Server → client, text, any rate | **SSE** | 1.13× payload, reconnect and resume are free |
| Client → server at high rate (cursors, presence, collab editing, games) | **WebSocket** | SSE cannot send upstream; a `fetch` per keystroke is worse than long polling |
| Binary frames (audio, video, protobuf, CBOR) | **WebSocket** | SSE is UTF-8 only, base64 costs 33% |
| Bandwidth-critical, high message rate | **WebSocket + permessage-deflate** | Measured 30,434 bytes for the same 1,000 events, 0.26× payload |
| Under ~1 event/second, HTTP/2 edge already in place | **Long polling** | 1.56× payload, no new operational surface, works through anything |
| Intermediary strips `Upgrade` headers | **SSE or long polling** | Both are ordinary HTTP responses |
| Many tabs, HTTP/1.1 only | **WebSocket** | SSE hits the six-connection cap |
| Per-request auth headers required | **WebSocket or fetch-based polyfill** | `EventSource` cannot set headers |

The honest default for a server-to-client feed is SSE. The 10% byte premium over a WebSocket buys reconnection, resume, plain-HTTP debuggability and no second protocol in your stack. Reach for a WebSocket when you genuinely need the upstream channel or binary frames — and if you find yourself building a reconnect-with-resume loop over a WebSocket for a one-way feed, you have reimplemented SSE badly.

## How I measured this

Everything above came from one harness, run locally on an Apple M5 (32 GB) under macOS 26.6.1, Node v26.6.0, `ws` 8.21.3. No remote servers were involved.

One Node process serves the same event stream three ways: a `ws` WebSocket endpoint, a `text/event-stream` response, and a `/poll?cursor=N` endpoint that parks the request until an event exists. A control port on a separate socket starts each run and reports server-side counters, so control traffic never pollutes the measurement.

**Byte counting.** A TCP proxy sits between client and server and counts every byte in both directions. These are real wire bytes at the TCP payload level: request lines, headers, chunked-encoding markers, WebSocket frame headers. Not counted: TCP/IP packet headers, ACKs, handshake and teardown packets, and TLS. Those exclusions all favour long polling, so its numbers here are optimistic.

**Event stream.** 1,000 events, one every 3 ms, each a JSON object averaging 116.9 bytes (`{"id":7,"ts":…,"type":"trade","sym":"ADAUSDT","px":60009.59,…}`). Varied rather than filler text, so the permessage-deflate result is not fake. Server compression was off; at ~117-byte bodies gzip usually costs more than it saves.

**Header profiles.** Every transport ran twice — once with a bare `Accept: */*`, once with the header set a real Chrome tab sends, cookie and user-agent included. Both profiles hit all three transports, so WebSocket and SSE pay the same handshake cost. They just pay it once.

**Latency.** The cross-process clock problem is solved with `performance.timeOrigin + performance.now()`, a high-resolution epoch timestamp comparable across processes on one host. The server stamps each event at emit, the client subtracts on receive. The proxy injects a fixed 25 ms one-way delay in each direction to emulate a 50 ms round trip.

**Memory.** 500 idle clients, no events flowing, server RSS after two forced GC passes with `--expose-gc`, repeated four times. Only the server process is measured.

**Reproducibility.** An independent re-run of the byte benchmark landed within 0.1% on every row — the largest gap was 317 bytes out of 406,710. That residual comes from the timestamp field changing digit count between runs, not from the transports.

**What I did not measure:** CPU under load, throughput ceilings, behaviour past 500 connections, TLS handshake cost, HTTP/3, WebSocket over HTTP/2, real WAN jitter and packet loss (my delay is fixed and lossless), mobile radio wake-up cost, and anything at all about browser-side performance. The latency figures come from a simulated network, not a real one — treat the shape as transferable and the absolute numbers as not.

## FAQ

### Is SSE slower than WebSocket?

No. In my measurements SSE delivered events in 26.29-26.52 ms mean against WebSocket's 26.16-26.46 ms over a simulated 50 ms round trip — a difference of well under half a millisecond. SSE costs about 10% more bytes on the wire, but the per-message delivery delay is effectively the same.

### Can SSE send data from client to server?

Not over the same connection. SSE is one-way by design; the client sends data with ordinary `fetch` or `XMLHttpRequest` calls. That is fine for occasional actions like a button click, and a poor fit for high-rate upstream data like cursor positions or keystrokes, where a WebSocket is the right tool.

### Does long polling still make sense in 2026?

Yes, in two situations. If your event rate is below roughly one per second and you already terminate HTTP/2 at the edge, it costs 1.56× the payload and needs no new operational surface. It is also the fallback that survives intermediaries that strip `Upgrade` headers or buffer streaming responses.

### Why does my SSE stream arrive all at once at the end?

Something in the path is buffering the response. Nginx enables `proxy_buffering` by default, so it collects the proxied response before forwarding. Send the `X-Accel-Buffering: no` response header from your application, or set `proxy_buffering off` for that location.

### Why does my SSE connection die after exactly 60 seconds?

An idle timeout is closing it. AWS Application Load Balancer defaults to 60 seconds of no data in either direction, and Cloudflare closes idle WebSocket connections on a similar principle. Send a comment line (`:heartbeat\n\n`) every 15 seconds or so; the SSE spec designed comment lines for exactly this, and the client ignores them.

### How many SSE connections can a browser hold?

Six per origin under HTTP/1.1, shared across all tabs. That limit applies to all HTTP/1.1 connections to the domain, not just SSE, so a user with several tabs open will find one that silently never connects. Serving over HTTP/2 raises the ceiling to the negotiated stream limit, which RFC 9113 recommends be at least 100.

### Does permessage-deflate make WebSockets always better?

It made the same 1,000 events cost 30,434 bytes instead of 119,692 in my run, a 74% reduction — but that is a property of compressible JSON, not of WebSockets. An SSE stream with gzip enabled should compress comparably, though I did not measure that. Compression also costs CPU and per-connection memory for the deflate context, which matters more than bandwidth at high connection counts.

## The part worth remembering

The byte table is the interesting result, and it does not point where people expect. Long polling on HTTP/1.1 is genuinely bad — 7.4× the payload, two thirds of it request headers re-sent a thousand times. But on HTTP/2 that collapses to 1.56×, and at a low event rate its latency was indistinguishable from a WebSocket. Most of what long polling gets blamed for is HTTP/1.1's header handling, not the polling pattern.

And WebSocket's win over SSE is 10% of bytes. That is the whole margin. Against it you are trading a protocol your proxies understand for one they might not, a `Last-Event-ID` header that resumes for free against a reconnect loop you maintain, and a curl-able endpoint for a binary frame you cannot read in a terminal. Ten percent does not buy that.

Build the SSE version first. Move to WebSockets the day you need to send something upstream, and not before.

### Read More Related Articles

#### [WebSocket vs SSE vs Long Polling: The Real Cost of 1,000 Events](https://theinfinity.dev/articles/websocket-vs-sse-vs-polling)

Delivering 1,000 events costs 119 KB over a WebSocket and 885 KB over long polling. Measured wire bytes, delivery latency under a 50 ms round trip, and server memory for 500 connections, with the benchmark code included.

#### [I Audited My AI Agent's Guardrails. Most of Them Weren't Running.](https://theinfinity.dev/articles/ai-agent-guardrails-audit)

A rule written in a config file is a wish. I audited the rules I had given my coding agents and found that five of seven findings were the same failure: the rule existed, the thing that enforces it did not. Here are the four silent failure modes and the test runner that now catches them.

#### [How Cloudflare Bot Fight Mode Quietly Killed Our Google Rankings](https://theinfinity.dev/articles/cloudflare-bot-fight-mode-seo)

Daily impressions fell from 1,153 to 16 and average position went from 10 to 68 in a single day. The pages were still indexed, the site was up, and nothing had been deployed. The cause was a Cloudflare toggle that serves Googlebot a challenge page carrying noindex,nofollow.

#### [Cache Eviction Algorithms: FIFO vs LRU vs LFU vs S3-FIFO Benchmark](https://theinfinity.dev/articles/cache-eviction-benchmark)

I implemented FIFO, LRU, LFU and S3-FIFO from scratch and ran them over one million requests across three access patterns. LRU returned exactly zero hits on a cyclic scan. S3-FIFO led 8 of 12 tests, but not the ones you would guess. Code and raw output included.

0m read

0% complete
