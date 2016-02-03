---
layout: post
title: Web Development with Node and Express Chapter 8 - Form Handling
category: wdwne
---

* `POST` 比 `GET` 安全是站不住脚的。

* `302(Found)` 和 `303(See Other)` 跳转的区别。操作完成(Form POST 提交)后的跳转一般要使用 `303` 跳转，规范也强调了 `303` 跳转需要使用 `GET` 请求，不管之前页面的请求方式是什么，[规范](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html)。

* `301` 是永远性跳转，也就是后续的请求会直接去向服务器第一次返回的地址，即不会经过中间页面处理。

* 文件上传：[formidable](https://github.com/felixge/node-formidable)。
