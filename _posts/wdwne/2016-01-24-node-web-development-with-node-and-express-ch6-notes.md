---
title: Web Development with Node and Express Chapter 6 - The Request and Response Objects
category: wdwne
---

* `req.param(name)` 方法会依次从路径参数、请求体、查询字符串中获取参数值，找到就立即返回。Express 4.x 已经不推荐使用这个方法。源代码如下：

{% highlight javascript %}
req.param = function param(name, defaultValue) {
  var params = this.params || {};
  var body = this.body || {};
  var query = this.query || {};

  var args = arguments.length === 1
    ? 'name'
    : 'name, default';
  deprecate('req.param(' + args + '): Use req.params, req.body, or req.query instead');

  if (null != params[name] && params.hasOwnProperty(name)) return params[name];
  if (null != body[name]) return body[name];
  if (null != query[name]) return query[name];

  return defaultValue;
};
{% endhighlight %}

* [Express API](http://expressjs.com/en/api.html)。
