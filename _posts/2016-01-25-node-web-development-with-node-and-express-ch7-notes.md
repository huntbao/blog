---
layout: post
title: Web Development with Node and Express Chapter 7 - Templating with Handlebars
---

* 命令式语言（imperative language）：做这个，然后做那个，再然后做其他的。

* 使用 JavaScript 生成 HTML 的问题有：

  * 得担心哪些字符需要转义？
  * 如果要生成的 HTML 中又包含了 JavaScript，这就麻烦了。
  * 编辑器语法高亮会有挑战
  * 很难看出 HTML 是否有效
  * 不够直观
  * 其他人看不懂写得是什么东西

使用模板引擎可以解决上面这些问题。

* Veena Basavaraj’s [blog post about her selection criteria when choosing a templating language for LinkedIn](https://engineering.linkedin.com/frontend/client-side-templating-throwdown-mustache-handlebars-dustjs-and-more)

* Express 的模板引擎，默认在生产环境中会缓存编译后的模板，在开发环境中会禁用缓存。可以使用下面的语句开启：

{% highlight javascript %}
app.set('view cache', true);
{% endhighlight %}

* 将 View 中的多个 section 放置到对应 Layout 的多个地方：

`SEVER`:

{% highlight javascript %}
var handlebars = require('express3-handlebars').create({
  defaultLayout:'main',
  helpers: {
    section: function(name, options){
      if(!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});
{% endhighlight %}

`VIEW`:
{% highlight html %}
{{#section 'head'}}
<!-- we want Google to ignore this page -->
<meta name="robots" content="noindex">
{{/section}}
<h1>Test Page</h1>
<p>We're testing some jQuery stuff.</p>
{{#section 'jquery'}}
<script>
$('document').ready(function(){
  $('h1').html('jQuery Works');
});
</script>
{{/section}}
{% endhighlight %}

`LAYOUT`:
{% highlight html %}
<!doctype html>
<html>
  <head>
    <title>Meadowlark Travel</title>
    {{{_sections.head}}}
  </head>
  <body>
    {{{body}}}
    <script src="http://code.jquery.com/jquery-2.0.2.min.js"></script>
    {{{_sections.jquery}}}
  </body>
</html>
{% endhighlight %}
