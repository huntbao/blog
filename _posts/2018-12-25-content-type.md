---
layout: post
title: 掌握 Content-Type
category: Engineering
tag: content-type
permalink: content-type
---

很多年前，一位前端领域的专家级人物找到我，然后有了下面的对话：

专家：这个图片地址（类似于这种 `http://www.example.com/xyz`）是不是搞错了？

我：没错啊，就是这样的。

专家：图片地址不应该是以 `.jpg`、`.png` 这种结尾的吗？

我：这个地址后端处理过的，返回的是一张图片。

专家：真奇怪还能这样，然后就走开了。

这位专家的技术水平毋庸置疑，这个只是他的知识盲区罢了。在之后的工作中，也发现不少人对 `Content-Type` 不甚了解，本文就来探讨下这个问题。


## 问题重现

比如在访问 `/a` 这个地址时，返回的是一张图片，使用 Node.js 可以这么实现：

```js
// content_type.js
const fs = require('fs');
const http = require('http');
const url = require('url');

http.createServer(function (req, res) {
  const request = url.parse(req.url, true);
  const pathname = request.pathname;

  if (pathname === '/a') {
    const img = fs.readFileSync(__dirname + '/mimes.jpg');
    res.writeHead(200, {
      'Content-Type': 'image/jpeg'
    });
    res.end(img, 'binary');
  }
}).listen(8080, '127.0.0.1');
```

使用 `node content_type.js` 启动程序，然后访问 `http://127.0.0.1:8080/a`，我们发现它返回的是一张图片。此时我们打开网络请求面板，看到 Response Header 中的 Content-type 就是 image/jpeg，它告诉浏览器返回的内容是一张图片，要把它当作图片来渲染。


## 内容嗅探（Content Sniffing）

上面这段代码，如果把 `'Content-Type': 'image/jpeg'` 这行去掉，我们发现结果并没有区别，浏览器中显示的还是一张图片。甚至把这行代码改成 `'Content-Type': 'text/plain'`，结果还是没有区别。

看起来好像是浏览器会忽视 Content-Type 的值。我们有理由相信，当浏览器按照指定的 Content-Type 无法正确转换响应内容时，会尝试自己去猜测内容的类型（缺失 Content-Type 时会直接进入这一步），这种技术叫内容嗅探（Content Sniffing）。

内容嗅探，也叫媒体类型嗅探（media type sniffing），或者叫 MIME 嗅探，它会根据响应内容的二进制流数据来推断文件类型。通常是根据文件的额外冗余数据来推断，比如文件签名、魔法数字、众所周知的字符子串等等。

UNIX 系统中的 `file` 命令就是一种内容嗅探应用。

## 禁止内容嗅探

内容嗅探，也可以关闭，已经有一些浏览器支持了这个特性，只要在响应头`X-Content-Type-Options`设置为`nosniff`即可，它告诉浏览器不要去猜测文件类型，就按照指定的 Content-Type 来解析，所以下面这么写时，浏览器不会把结果渲染成图片了：

```js
res.writeHead(200, {
  'Content-Type': 'text/plain',
  'X-Content-Type-Options': 'nosniff'
});
```

测试发现，将 `http://127.0.0.1:8080/a` 赋值给 img 标签的 src，也是不能正常显示图片的。

## Content-Type 值

Content-Type 的值可以由三个部分组成，如下：

```
Content-Type: [media-type];[charset=charset];[boundary=boundary]
```

* `media-type`，资源或者数据的 [MIME Types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)，比如 `image/png`。

* `charset`，资源或者数据的字符编码标准，比如 `utf-8`。

* `boundary`，对于复合实体（multipart entities），boundary 是必需的，其包括来自一组字符的1到70个字符，已知通过电子邮件网关是非常健壮的，而不是以空白结尾。它用于封装消息的多个部分的边界。通常 boundary 的最前面和最后面都添加了两个横线。


## 常见的 Content-Type 值

对于前端工程师来说，有几个 Content-Type 值必须要掌握，我们挨个来看一下。


### application/octet-stream

二进制文件的默认类型，表示未知二进制文件，浏览器通常无需自动执行或询问执行。浏览器会像对待设置了 HTTP 头 Content-Disposition 值为 attachment 的文件一样来对待这类文件。通常是显示另存为的弹窗。


### text/plain

文本文件默认值。即使它意味着未知的文本文件，但浏览器认为是可以直接展示的。


### text/css

在网页中要被解析为 CSS 的任何 CSS 文件必须指定 MIME 为 text/css。通常，服务器不识别以 .css 为后缀的文件的 MIME 类型，而是将其以 MIME 为 text/plain 或 application/octet-stream 来发送给浏览器：在这种情况下，大多数浏览器不识别其为 CSS 文件，直接忽略掉。特别要注意为 CSS 文件提供正确的 MIME 类型。
