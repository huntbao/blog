---
layout: post
title: Web Development with Node and Express Chapter 3 - Saving Time with Express
category: wdwne
---

* Express 项目初始工程生成工具：[Express application generator](http://expressjs.com/en/starter/generator.html)。

* 前端工程模板文件：[HTML5 Boilerplate](https://html5boilerplate.com/)。

* Express 中间件（middleware）可以理解为：处理和所有路由规则不匹配的请求的程序。这就意味着在 Express 中，路由和中间件的添加顺序是很重要的。

* Express 可以通过中间件的回调函数的参数个数来区分 404 和 500 错误，如下所示：
{% highlight javascript %}
// 404 catch-all handler (middleware)
app.use(function(req, res, next){
  res.status(404);
  res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});
{% endhighlight %}

* 本质上来说，`View` 是发送给用户的东西，拿网站来说，一般是指 HTML，也可以是 PNG 或者 PDF 以及其他任何能被客户端渲染的资源。

* Node.js 的模板引擎有 [jade](http://jade-lang.com/)、[ejs](https://github.com/tj/ejs)、[express-handlebars](https://github.com/ericf/express-handlebars)等，前两个都是 [TJ](https://github.com/tj) 开发的。

* Express 的 `static` 中间件，效果等同于为每个静态资源文件创建一个路由：
{% highlight javascript %}
app.use(express.static(__dirname + '/public'));
{% endhighlight %}
