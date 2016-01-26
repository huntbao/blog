---
layout: post
title: Web Development with Node and Express Chapter 9 - Cookies and Sessions
---

* Signed cookie 放在 `req.signedCookies` 对象中：

{% highlight javascript %}
res.cookie(name, value, { signed: true })
{% highlight %}

* 设置 `cookie` 的选项有：domain、path、maxAge、secure、httpOnly、signed 等

* 使用 `session ` 很方便维护状态。为了实现 `session`，必须要将一些东西存到客户端上，否则服务器是无法在不同请求间识别出客户端的。常用方法是利用包含了一个唯一标识符的 `cookie`。

* `session` 对象是挂在 `request` 对象上的:

{% highlight javascript %}
req.session.userName = 'Anonymous';
var colorScheme = req.session.colorScheme || 'dark';
req.session.userName = null; // this sets 'userName' to null, but doesn't remove it
delete req.session.colorScheme; // this removes 'colorScheme'
{% endhighlight %}

* 使用 `session` 实现 `flash messgae`，即在流程中（跨页面）只会出现一次的信息（提示）。

* `session` 可用来认证用户信息，也可以用来收集数据（此时不需要用户登录）。
