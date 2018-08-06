---
layout: post
category: engineering
title: 广联云 static 架构及原理介绍
---


## 背景知识

项目上线后，静态资源（JavaScript 和 CSS）需要压缩合并，以减少 HTTP 请求，降低服务器压力，从而提升网站性能。压缩是指去除换行、空格、制表符等空白字符，如果是 JavaScript 代码，还可以进行变量替换，所有这些工作都是为了降低文件体积。合并是指将多个文件合并成一个文件，以减少 HTTP 请求。但在本地开发环境，代码是没有压缩的，文件也是分模块的。所以在发版的过程中，需要借助工具进行自动化处理。

为了做到上面这些要求，需要一些约定，以便发版工具能正确处理。下面介绍广联云 static 的架构设计。


## 约定写法

一般地，一张页面只需引入一个 CSS 文件并放置在 `head` 标签中，文件命名须为 `xxx.merge.css`；页面只需引入一个 JavaScript 文件并放置在 `body` 的最后面，文件命名须为 `xxx.merge.js`。(以下称这些文件为 `merge` 文件)

下面以[广联云首页](https://yun.glodon.com/portal/){:target="_blank"}为例，分别介绍 CSS 和 JavaScript 的约定写法。

页面在 `head` 里面引入了 `index.merge.css`，文件内容如下：

{% highlight css %}
@import url("../../../common/css/reset.css");
@import url("../../../common/css/glodon.css");
@import url("../../../common/css/module/button.css");
@import url("../../../common/css/module/module.dialog.css");
@import url("../../../common/css/module/module.nav.css");
@import url("../../../common/css/module/module.footer.g2.css");
@import url("../../../common/js/libs/jquery/flexslide/flexslider.css");
@import url("../module/module.header.css");
@import url("../page/page.index.css");
{% endhighlight %}

每一行 `import`(引入) 一个 `css` 文件，使用相对路径。注意，不可以使用绝对路径，这是约定写法。

有人可能会有疑问为什么不使用绝对路径呢？这是因为在 `css` 代码中需要引用图片路径，由于静态版本号（这个下面会介绍）的存在，`css` 代码中是不可能书写版本号的，亦即不能使用绝对路径，只能使用相对路径。脚本工具需要正确地计算出引用图片的相对路径并对最初编写的图片路径进行修正，这样就避免了静态版本号的问题。

由于 `merge` 文件不一定和被引入的 `css` 文件在同一个目录中，而 `css` 引用的图片目录可以放在任何目录中，所以当把内容写入 `merge` 文件中时，势必会产生 `路径偏移`，需要进行修正。

当然引入的文件也可以使用绝对路径，即所有的资源（包括 `css` 中引用的图片路径）都使用绝对路径，但这对广联云项目不大合适。

`index.merge.css` 文件的唯一作用就是引入一个个的 `css` 模块文件，不可在其中编写其他样式代码。这是约定！

单个的 `css` 文件中，不可再 `import` 其他 `css` 文件，这也是约定！

页面在 `body` 的后面引入了 `index.merge.js`，文件内容如下：

{% highlight javascript %}
document.write('<script src="//static.glodon.com/static/common/proxy/ajaxproxy.js"></script>')
document.write('<script src="//static.glodon.com/static/common/js/libs/jquery/jquery.js"></script>')
document.write('<script src="//static.glodon.com/static/common/js/libs/jquery/flexslide/jquery.flexslider.js"></script>')
document.write('<script src="//static.glodon.com/static/common/js/libs/jquery/mousewheel/jquery.mousewheel.js"></script>')
document.write('<script src="//static.glodon.com/static/common/js/libs/skrollr/skrollr.js"></script>')
document.write('<script src="//static.glodon.com/static/common/js/libs/mustache.js"></script>')
document.write('<script src="//static.glodon.com/static/common/js/glodon.js"></script>')
document.write('<script src="//static.glodon.com/static/common/js/module/module.dialog.js"></script>')
document.write('<script src="//static.glodon.com/static/common/js/module/module.nav.js"></script>')
document.write('<script src="//static.glodon.com/static/common/js/module/module.footer.g2.js"></script>')
document.write('<script src="//static.glodon.com/static/portal/js/page/page.index.js"></script>')
{% endhighlight %}

每一行 `write`(输出) 一个 `javascript` 文件。注意，这里不同于 `css` 的写法，使用的是`伪绝对路径`。说它是`伪绝对路径`，是因为线上环境中是不存在这个地址的，即直接访问 [https://static.glodon.com/static/common/js/libs/jquery/jquery.js](https://static.glodon.com/static/common/js/libs/jquery/jquery.js){:target="_blank"}，会是 `404 Not Found` 错误。这个问题还是和静态版本号有关，后面会有解释。

`index.merge.js` 文件的唯一作用就是引入一个个的 `javascript` 模块文件，不可在其中再编写其他 `javascript` 脚本代码。这是约定！

`javascript` 文件的路径以 `//` 开头，它的作用是自动匹配页面所使用的协议。这个之后再解释为什么要这么写。

按照上面的约定写法，发布工具（`maven`插件）会找到这些 `merge` 文件。发布工具要做的事情就是挨个读取引入文件的内容(当然还要修正 `css` 代码中引用的资源路径)，然后用所有单个文件的内容之和替换掉 `merge` 文件本身的内容，然后再对 `merge` 文件进行压缩。注意，发布工具并未对单个的文件进行压缩处理，它只是读取了它们的内容，这么做是为了方便调试，之后会演示如何直接调试线上环境的代码。

## jsp 文件中引入 merge 文件的方式

仍旧以[广联云首页](https://yun.glodon.com/portal/){:target="_blank"}为例，引入 `merge` 文件的方式如下：

{% highlight html %}
<link rel="stylesheet" href="//static.glodon.com/static${staticVersion}/portal/css/merge/index.merge.css">
......
<script src="//static.glodon.com/static${staticVersion}/portal/js/merge/index.merge.js"></script>
{% endhighlight %}

`${staticVersion}` 就是静态版本号变量，在本地开发环境中，这个变量的值一般为空。在线上环境中，它的格式是 `vxxx`，每次发完版后，这个值都会变化，以便起到缓存破坏的作用，这样每次发完版后，用户不会受到缓存的影响。


## 静态版本号 staticVersion

静态版本号的作用是破坏缓存。

静态版本号对开发人员毫无用处，应该对开发人员透明才对，除了在 `jsp` 里面引入 `merge` 文件时需要用到静态版本号之外，在代码中不应该再出现这个变量。正因为如此，前端才让运维人员加了两种不受静态版本号控制的 `resources` 和 `latest` 路径，这个之后再解释它们的由来。

细心的朋友可能已经发现，本地环境中的资源路径和线上环境中的资源路径是不一样的，即线上环境中的路径的中间会插入静态版本号的值。在本地环境看到的是这样的：

{% highlight html %}
<link rel="stylesheet" href="//static.glodon.com/static/portal/css/merge/index.merge.css">
......
<script src="//static.glodon.com/static/portal/js/merge/index.merge.js"></script>
{% endhighlight %}

而在线上环境中看到的可能是这样的：

{% highlight html %}
<link rel="stylesheet" href="//static.glodon.com/static/v964/portal/css/merge/index.merge.css">
......
<script src="//static.glodon.com/static/v964/portal/js/merge/index.merge.js"></script>
{% endhighlight %}

v964 这个文件夹在线上服务器中是真实存在的，这是每次发版后自动生成的一个文件夹。本地开发环境没有这样的文件夹。

如果前端开发人员只需要管本地开发环境，那没什么问题。但事实上这是不大可能的，前端需要调试线上环境的 `bug`，如果只需切换一下 `host`，就可以使用线上的页面和本地的 `static` 服务，这将是非常便利的。

换句话说，两种地址都得有效才行，即不带静态版本号的地址和带静态版本号的地址都得是有效地址，即地址：

{% highlight html %}
<link rel="stylesheet" href="//static.glodon.com/static/v964/portal/css/merge/index.merge.css">
{% endhighlight %}

和地址：

{% highlight html %}
<link rel="stylesheet" href="//static.glodon.com/static/portal/css/merge/index.merge.css">
{% endhighlight %}

返回的内容都是：

{% highlight css %}
@import url("../../../common/css/reset.css");
@import url("../../../common/css/glodon.css");
@import url("../../../common/css/module/button.css");
@import url("../../../common/css/module/module.dialog.css");
@import url("../../../common/css/module/module.nav.css");
@import url("../../../common/css/module/module.footer.g2.css");
@import url("../../../common/js/libs/jquery/flexslide/flexslider.css");
@import url("../module/module.header.css");
@import url("../page/page.index.css");
{% endhighlight %}

是 `Nginx` 大显身手的时候了，下面就介绍 `Nginx`。

ps：还有一个问题，本地开发环境使用的是 `http` 协议，而线上环境使用的是 `https` 协议。这个问题很好解决，路径以 `//` 开头即可，它会自动匹配页面所使用的协议。

## Nginx

使用 `nginx` 可以很容易地解决 `有时需要静态版本号有时不需要静态版本号` 的问题。配置 `https` 也很方便。`nginx` 配置如下：

{% highlight console %}

server {

	listen 80;
	server_name static.glodon.com;


	location ~* static/v\d*/(\S*) {
		add_header Access-Control-Allow-Origin *;
		alias  /Users/glodon/paas/static/src/main/webapp/$1;
	}

	location /static {
		add_header Access-Control-Allow-Origin *;
		alias  /Users/glodon/paas/static/src/main/webapp;
	}

}

{% endhighlight %}

使用 `nginx` 的 `loaction` 指令的正则表达式，匹配任何 `static/v` 跟上任意数字的 `URI`，然后把请求地址转向到本地机器上的文件地址。

`https` 的配置也类似，如下：

{% highlight console %}

server {

	listen       443 ssl;
	server_name static.glodon.com;

	ssl_certificate server.crt;
	ssl_certificate_key server.key;

	ssl_protocols SSLv3 TLSv1 TLSv1.1 TLSv1.2;
	ssl_ciphers RC4:HIGH:!aNULL:!MD5;
	ssl_prefer_server_ciphers on;

	location ~* static/v\d*/(\S*) {
		add_header Access-Control-Allow-Origin *;
		alias  /Users/glodon/paas/static/src/main/webapp/$1;
	}

	location /static {
		add_header Access-Control-Allow-Origin *;
		alias  /Users/glodon/paas/static/src/main/webapp;
	}

}

{% endhighlight %}

`Nginx` 的配置就这么简单，这样 `//static.glodon.com/static/v964/portal/css/merge/index.merge.css` 和 `//static.glodon.com/static/portal/css/merge/index.merge.css` 都会指向本地机器上的文件，成功地‘忽略’了静态版本号。


## resources 和 latest 路径的由来

由于只有在广联云的系统中才会有静态版本号这个东西，但静态资源是可以被别人引用的，比如兄弟部门的网站。他们的项目中并不知道静态版本号这个东西。所以需要提供不受版本号控制的路径，方便其他人引用。

开始时，前端和运维约定，把不想受版本控制的文件统一放到一个叫 `resources` 的目录中，在每次发版时，运维需要把 `resources` 目录拷贝到和版本号目录平级的目录下。这是 `resources` 路径的由来。

后来发现，光有 `resources` 还不够用，比如前端需要写一些静态的 `demo` 文件，如果把需要的静态资源文件全放到 `resources` 目录中去，这是不大现实的，也没必要在两处放一样的文件。所以前端又让运维提供一个 `latest` 的路径，在每次发版时，运维需要把整个静态资源目录拷贝一份放到和版本号目录平级的目录下。这是 `latest` 路径的由来。

`另外约定，如非需要，请不要在项目中直接引用这两个路径`。

## 使用方法

不管是本地环境还是线上环境，如果 `static` 的 `host` 地址指向本地，那么看到的是这样的：

![static](/public/images/static-architecture/local.png)

`index.merge.js` 是本地文件，这样就可以直接调试线上环境的问题了，很方便。

如果 `static` 的 `host` 地址指向线上，那么看到的是这样的：

![static](/public/images/static-architecture/online.png)

`index.merge.js` 是线上文件，它的内容已经被替换，它的内容是所有引入文件内容之和，并已经压缩，如图所示：

![static](/public/images/static-architecture/online-d.png)

以上都是需要在本地启 `static` 服务才可以。如果开发人员不在公司，在自己的电脑上没有整套 `static` 环境，那有没有办法直接调试线上的问题呢？因为线上的代码都是压缩过的，绝大多数时候是无法直接调试的。

这用 `fiddler` 可以做到。

## 使用 fiddler 调试线上代码

只要能看到单个的未压缩过的模块文件，就可以调试。先看未作任何处理时的情况：

![static](/public/images/static-architecture/fiddler-1.png)

线上的代码是压缩过的。

先在本地准备一个文件 `index.merge.js` （文件名可以随意取），如图所示：

![static](/public/images/static-architecture/fiddler-2.png)

然后打开 `fiddler`，选中 `AutoResponder` 标签，勾选 `Enable automatic responses`，然后把左边要替换的文件 `index.merge.js` 拖到右边的方框中，在右最下面的输入框中选择 `Find a file...`，在弹出来的文件选择器中选择刚才准备好的放在本地电脑上的 `index.merge.js` 文件，然后点 `save` 按钮：

![static](/public/images/static-architecture/fiddler-3.png)

刷新页面，效果如图所示：

![static](/public/images/static-architecture/fiddler-4.png)

单个未处理过的模块文件已经出现，这样就可以调试代码了。这也是为什么发版工具没有对单个的模块文件进行压缩处理的原因。

## 结语

对于开发人员来说，能方便地调试代码是非常重要的。

广联云采用的 `static` 架构设计和主流的不大一样，所以大家也不要认为 `static` 架构只能这么设计或者认为这种设计是最好的。

广联云的这套方案并不算很好，特别是不满足目前流行的模块化加载方式。以后如果想切换开发方式，成本是相当大的。

但就目前来说，这套方案是完全可以满足需求的，也没遇到过什么无法解决的问题，用起来也很方便。
