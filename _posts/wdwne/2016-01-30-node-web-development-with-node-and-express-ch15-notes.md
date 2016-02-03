---
layout: post
title: Web Development with Node and Express Chapter 15 - REST APIs and JSON
category: wdwne
---

* 错误分类：
  * 服务器崩溃错误：唯一安全的方法是重启服务器，理想状态下，挂起的请求会收到 500 错误，如果错误非常严重，则请求会超时。
  * 可恢复的错误：不需要重启服务器，比如数据库连接错误，错误可能是暂时的或者永久的，这种情况可以使用 500 状态码。
  * 客户端错误：参数缺少或者是无效的，服务器可以返回 200 并描述错误信息，或者可以使用合适的 HTTP 状态码，比如 404（Not Found）、400（Bad Request）、401（Unauthorized），并在响应体中描述错误内容，如果想更进一步，可以在错误中增加文档链接。

* [CORS](https://github.com/expressjs/cors)。

* REST API 单元测试：[restler](https://github.com/danwrong/restler)。

* 可以考虑将 REST API 放到单独的子域名中。
