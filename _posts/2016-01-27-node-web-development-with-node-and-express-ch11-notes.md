---
layout: post
title: Web Development with Node and Express Chapter 11 - Sending Email
---

* 发送邮件的库：[Nodemailer](https://github.com/nodemailer/nodemailer)。

* 邮件中的 `from` 字段可以设置为任意值，但不能为空，必须要设置值。

* 博客文章：[About HTML Email](http://kb.mailchimp.com/campaigns/ways-to-build/about-html-email)。

* HTML 邮件模板：[Email-Boilerplate](https://github.com/seanpowell/Email-Boilerplate)。

* 调用多次 `res.render`，只有第一次会生效。如果 `res.render` 有回调函数，则不会发送给客户端：

{% highlight javascript %}
res.render(viewName, options, function(err, html) {
  //
});
{% endhighlight %}
