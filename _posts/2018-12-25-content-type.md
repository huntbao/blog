---
layout: post
title: 掌握 Content-Type
category: Engineering
tag: content-type
permalink: content-type
---

很多年前，一位前端领域的专家找到我，然后有了下面的对话：

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

* `media-type`，资源或者数据的 [MIME Types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)，比如 `image/png`（Multipurpose Internet Mail Extensions，多用途 Internet 邮件扩展，简称 MIME）。

* `charset`，资源或者数据的字符编码标准，比如 `utf-8`。

* `boundary`，对于复合实体（multipart entities），boundary 是必需的，其包括来自一组字符的1到70个字符，已知通过电子邮件网关是非常健壮的，而不是以空白结尾。它用于封装消息的多个部分的边界。通常 boundary 的最前面和最后面都添加了两个横线。


## MIME 语法及种类

MIME 的语法如下：

```
type/subtype
```

MIME的组成结构非常简单；由类型与子类型两个字符串中间用`/`分隔而组成。不允许空格存在。type 表示可以被分多个子类的独立类别。subtype 表示细分后的每个类型。

MIME 类型对大小写不敏感，但是传统写法都是小写。

MIME 种类可以分成两个大数，独立类型 和 Multipart 类型。

* 独立类型
  * text，表明文件是普通文本，理论上是人类可读。
  * image，表明是某种图像。不包括视频，但是动态图（比如动态gif）也使用image类型。
  * audio，表明是某种音频文件。
  * video，表明是某种视频文件。
  * application，表明是某种二进制数据。

>对于text文件类型若没有特定的 subtype，就使用 text/plain。类似的，二进制文件没有特定或已知的 subtype，即使用 application/octet-stream。

* Multipart 类型
  * multipart/form-data
  * multipart/byteranges

> Multipart 类型表示细分领域的文件类型的种类，经常对应不同的 MIME 类型。这是复合文件的一种表现方式。multipart/form-data 可用于联系 HTML Forms 和 POST 方法，此外 multipart/byteranges 使用状态码 206 Partial Content 来发送整个文件的子集，而 HTTP 对不能处理的复合文件使用特殊的方式：将信息直接传送给浏览器（这时可能会建立一个“另存为”窗口，但是却不知道如何去显示内联文件。）


## 常见的 MIME 值

对于前端工程师来说，有几个 MIME 值必须要掌握，我们挨个来看一下。


### application/octet-stream

二进制文件的默认类型，表示未知二进制文件，浏览器通常无需自动执行或询问执行。浏览器会像对待设置了 HTTP 头 Content-Disposition 值为 attachment 的文件一样来对待这类文件。通常是显示另存为的弹窗。


### text/plain

文本文件默认值。即使它意味着未知的文本文件，但浏览器认为是可以直接展示的。


### text/css

在网页中要被解析为 CSS 的文件必须指定 MIME 为 text/css。通常，服务器不识别以 .css 为后缀的文件的 MIME 类型，而是将其以 MIME 为 text/plain 或 application/octet-stream 来发送给浏览器，在这种情况下，大多数浏览器不识别其为 CSS 文件，直接忽略掉。

在 Chrome 浏览器中，如果 CSS 没有指定 MIME 类型，它会在控制台显示一条如下的警告信息：

```
Resource interpreted as Stylesheet but transferred with MIME type text/plain: "http://127.0.0.1:8080/a.css".
```

如果 CSS 是通过外部链接的方式引入文档的，也就是使用 link 标签，需要指定它的 `rel` 值为 `stylesheet`，又因为 `stylesheet` 类型对应的文件只有 CSS 一种，此时 link 标签的 type 属性值是可以省略的，也就是不用写 `type="text/css"`，这也是现在推荐的做法。内联方式的 `style` 标签也同理。


### JavaScript 的 MIME 类型

据 MIME 嗅探标准，下面是有效的 JavaScript MIME 类型：

* `application/javascript`
* `application/ecmascript`

其他所有的 `text` 开头的值已经全部被废弃。


### 图片类型

常见的有 `image/gif`、`image/jpeg`、`image/png`、`image/svg+xml` 等。


### multipart/form-data

当需要将浏览器中的整个 HTML 表单数据发送给服务器时，可以使用 `multipart/form-data`。它表示一种复合文档格式（multipart document format），由不同的部分组成，使用 boundary （一个以 -- 开头的字符串）分隔。对于文件上传字段，每个部分都有各自的 HTTP 头、Content-Disposition 和 Content-Type。

比如下面这个表单：

```html
<form action="http://127.0.0.1:3000/api/data" method="post" enctype="multipart/form-data">
  <label>Name: <input name="myTextField" value="Test"></label>
  <label><input type="checkbox" name="myCheckBox"> Check</label>
  <label>Upload file: <input type="file" name="myFile"></label>
  <button>Send the file</button>
</form>
```

后端接收代码为：

```js
const fs = require('fs');
const http = require('http');
const url = require('url');

http.createServer(function (req, res) {
  const request = url.parse(req.url, true);
  const pathname = request.pathname;
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      console.log(body);
      res.end('ok');
    });
  } else if (pathname === '/') {
    const html = fs.readFileSync(__dirname + '/test.html');
    res.writeHead(200);
    res.end(html, 'binary');
  } else {
    res.writeHead(200);
  }
}).listen(3000, '127.0.0.1');
```

填写下表单，选择一个文本文件，发送的内容大致为（使用 [Charles](https://www.charlesproxy.com/download/) 抓包看的结果）：

```
POST /api/data HTTP/1.1
Host: 127.0.0.1:3000
Content-Length: 396
Pragma: no-cache
Cache-Control: no-cache
Origin: http://127.0.0.1:3000
Upgrade-Insecure-Requests: 1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryO6aTo0R62isSQqNd
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
Referer: http://127.0.0.1:3000/
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7

------WebKitFormBoundaryO6aTo0R62isSQqNd
Content-Disposition: form-data; name="myTextField"

Test
------WebKitFormBoundaryO6aTo0R62isSQqNd
Content-Disposition: form-data; name="myCheckBox"

on
------WebKitFormBoundaryO6aTo0R62isSQqNd
Content-Disposition: form-data; name="myFile"; filename="test.txt"
Content-Type: text/plain

hello world
------WebKitFormBoundaryO6aTo0R62isSQqNd--
```

后端拿到的请求体数据为：

```
------WebKitFormBoundaryto3g2TNiB3G3GHmd
Content-Disposition: form-data; name="myTextField"

Test
------WebKitFormBoundaryto3g2TNiB3G3GHmd
Content-Disposition: form-data; name="myCheckBox"

on
------WebKitFormBoundaryto3g2TNiB3G3GHmd
Content-Disposition: form-data; name="myFile"; filename="test.txt"
Content-Type: text/plain

hello world
------WebKitFormBoundaryto3g2TNiB3G3GHmd--
```

### application/x-www-form-urlencoded

我们先把上面的表单改一下：

```html
<form action="http://127.0.0.1:3000/api/data" method="post" enctype="application/x-www-form-urlencoded">
  <label>Name: <input name="myTextField" value="Test"></label>
  <label><input type="checkbox" name="myCheckBox"> Check</label>
  <label>Upload file: <input type="file" name="myFile"></label>
  <button>Send the file</button>
</form>
```

此时发送的内容为：

```
POST /api/data HTTP/1.1
Host: 127.0.0.1:3000
Content-Length: 30
Pragma: no-cache
Cache-Control: no-cache
Origin: http://127.0.0.1:3000
Upgrade-Insecure-Requests: 1
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
Referer: http://127.0.0.1:3000/
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7

myTextField=Test&myCheckBox=on&myFile=test.txt
```

后端接收到的数据为：

```
myTextField=Test&myCheckBox=on&myFile=test.txt
```

它是一段字符串，没有二进制的文件内容。这段字符串是以 `名称=值` 对的形式连接，连接符是 `&`。根据[规范](https://www.w3.org/TR/html401/interact/forms.html)中`17.13.4 Form content types`的描述，Form 表单默认的编码类型（enctype）是 `application/x-www-form-urlencoded`，并且必须按照下面的规则处理：

* 控件的名称和值（names and values） 必须转义。空格转换成 `+`，不是字母数字的字符，需要转换为 `%HH` 的格式，前面一个百分号，之后跟的是该字符的 ASCII 码的十六进制形式，用两个字节表示。换行使用`CR LF`对表示，比如 `%0D%0A`。
* 控制的名称和值对按照它们在文档中出现的顺序排列。名称和值以`=`连接，然后再以`&`将所有的名称和值对连接起来。


### multipart/form-data vs application/x-www-form-urlencoded

根据上面的描述，`multipart/form-data` 和 `application/x-www-form-urlencoded` 都可以用来发送表单数据，但需要注意的是：

* 因为 `application/x-www-form-urlencoded` 会对字符进行转义，所以它不适合发送大量的二进制数据或者是包含非 ASCII 码字符的文本，这非常低效。此时需要使用 `multipart/form-data`。
* 那是不是只用 `multipart/form-data` 就可以了？并非如此。如果发送的数据量很小，并且都是字母数据类型的值（大多数场景都是如此），此时就适合使用 `application/x-www-form-urlencoded`，因为 `multipart/form-data` 要增加的 boundary 等开销可能比实际的数据量还要大。


### application/json

它是 JSON 的官方 MIME 类型。下面是使用 [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) 方法来发送 json 数据的示例代码：

```js
  (async () => {
    const res = await fetch('http://127.0.0.1:3000/api/json', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({a: 1, b: 'b'})
    });
    const content = await res.json();
    console.log(content);
  })();
```

发送的是一个字符串，内容是：

```
{"a":1,"b":"b"}
```

后端拿到的也是一个字符串，内容同上。之后就可以使用解析 JSON 字符串的库将字符串转换成程序容易处理的 JSON 对象，比如 Node.js 原生支持的 `JSON` 对象。

关于 `Content-Type` 的介绍就讲到这里，相信看到这里的你已经掌握了这个 Web 开发最常见的知识点了。