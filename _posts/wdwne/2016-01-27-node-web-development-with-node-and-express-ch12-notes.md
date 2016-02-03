---
layout: post
title: Web Development with Node and Express Chapter 12 - Production Concerns
---

* Express 支持 `执行环境` 的概念：应用可以在 `production`、`development`、`test` 等环境中运行（例举的 3 个是标准环境）。默认是 `development` 环境。

* `domain` 从本质上说是一个执行环境，它会捕获发生在它里面的错误（注：v5.5中已经不推荐使用这个模块）。

* 压力测试（stress test）模块 `loadtest`。
