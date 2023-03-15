---
title: Web Development with Node and Express Chapter 16 - Static Content
category: wdwne
---

* CND 专注于静态资源，它会利用特殊的请求头，开启浏览器的缓存。CND 也会使用“地理优化”，即发送离客户端最近的服务器上的静态资源。

* 静态资源可能出现的地方：`View`、`CSS`、`服务端中的 JavaScript`、`客户端中的 JavaScript`。

* Express 内置的 `static` 中间件会设置 `Cache-Control`，但不会设置 `Last-Modified` 和 `ETag`。
