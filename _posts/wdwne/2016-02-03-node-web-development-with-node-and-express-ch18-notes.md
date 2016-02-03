---
layout: post
title: Web Development with Node and Express Chapter 18 - Security
category: wdwne
---

* 使用 HTTPS 协议需要在服务器上面放置公钥证书，也叫 SSL 证书。目前 SSL 证书的标准是 x.509。证书（certificate）是由证书管理机构（certificate authorities，CA）颁发的。证书管理机构会给浏览器厂商受信根证书（trusted root certificates）。在安装浏览器的时候会包含这些受信根证书文件，所以 CA 和浏览器的信任链就建立起来了。为了能使这条信任链正常工作，因此你的服务器上需要有由 CA 颁发的证书。

* SSL 证书可以从免费 CA 处获取，也可以从商业 CA 处购买。

* 浏览器只信任知名 CA 颁发的证书。如果你的网站使用了未知实体颁发的证书，则浏览器会有警告。

* 如果可以控制浏览器的发布和安装，则你可以使浏览默认就安装你的根证书，这样用户在登录你的网站的时候就不会产生警告。

* 使用 [OpenSSL](http://www.openssl.org/docs/manmaster/apps/req.html) 生成自己的证书。

* HTTPS 的端口号是 443，浏览器一般不会显示这个端口号。

* [csurf](https://github.com/expressjs/csurf) 中间件。
