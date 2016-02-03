---
layout: post
title: Web Development with Node and Express Chapter 10 - Middleware
category: wdwne
---

* 中间件是一种封装功能的方式：尤其是操作 HTTP request 的功能。

* 中间件以 pipeline 的方式顺序执行。

* 在 Express 中，通过 `app.use` 添加中间件。

* 如果某个中间件不调用 `next` 方法，则请求在该中间件终止。

* 路由处理程序（Route handler）可以认为是处理指定 HTTP verb （GET、POST 等）的中间件。而中间件可以认为是处理所有 HTTP verb 的路由处理程序（本质上等同于 `app.all`，对于普通 verb，效果是一样的，对于其他特别的像是 `purge` 这种则有细微的区别）。

* 路由处理程序和中间件的回调函数如果有 3 个参数，则分别是 `req`、`res`、`next`，如果有 4 个参数，则是错误处理程序，参数分别是 `err`、`req`、`res`、`next`。

* 如果中间件不调用 `next` 方法，则请求到这里终止，此时应该调用向客户端发送响应（`res.send`、`res.json`、`res.render`等）。如果不发送呼应，则客户端会一直等待直到超时。

* 如果中间件调用了 `next` 方法又向客户端发送了响应，一般来说这么做是不对的。如果确实这么做了，那之后的中间件或者路由处理程序还是会执行，但是它们发送的响应会被忽略。

* Express 不会使用中间件的返回值，所以:

{% highlight javascript %}
next();
return;
// 可以简写为：
return next();
{% endhighlight %}

* 4.0 之前的版本，Express 捆绑了 [Connect](https://github.com/senchalabs/connect)（它几乎囊括了几乎所有常见的中间件）。可能会这么写：

{% highlight javascript %}
app.use(express.bodyParser)
{% endhighlight %}

这就导致一个问题：会以为这些中间件是属于 Express。4.0 中已经将 Connect 从 Express 中移除，同时 Connect 的有些中间件也从 Connect 中分离出来作为独立的项目（比如 `body-parser`）。Express 保保留了 `static` 中间件。

* 目前没有第三方中间件的仓库或者索引，可以在 `npm` 中搜索 `Express`、`Connect`、`Middleware`等关键词。
