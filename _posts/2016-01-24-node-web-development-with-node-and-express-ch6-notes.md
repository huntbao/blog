---
layout: post
title: Web Development with Node and Express Charpter 6 —— 读书笔记
---

* 在 Node.js 应用中，对于任何请求，参数可以从 `querystring`、`cookie`、`request body` 以及 `route` 中获取，而 `req.param(name)` 方法却将从所有这些参数获取指定名称的参数，这导致的一个问题是，如果各个部分都有相同的参数，那么最终使用的是哪个参数？因此应该避免使用该方法。
