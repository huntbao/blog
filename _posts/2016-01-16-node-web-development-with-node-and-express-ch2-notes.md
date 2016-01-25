---
layout: post
title: Web Development with Node and Express Chapter 2: Getting Started with Node
---

* [nvm](https://github.com/creationix/nvm)，在一台机器上面安装管理多个 Node.js 版本。

* Node.js 的核心哲学是事件驱动编程(event-driven programming)，[Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)。

* [__dirname](https://nodejs.org/docs/latest/api/globals.html#globals_dirname) 是被执行文件的所在目录。[process.cwd()](https://nodejs.org/docs/latest/api/process.html#process_process_cwd) 是执行 `node` 命令时所在的目录(cwd 即是 current work directory 的缩写)。`.` 在 `require` 语句中是相对当前被执行文件所在的目录，其他时候等同于 `process.cwd()`。

假设某项目有如下目录结构：

{% highlight console %}
.
└── dir1
    └── dir2
        └── path.js
{% endhighlight %}

`path.js` 的内容如下：

{% highlight javascript %}
'use strict'
let path = require("path")
module.exports = "yes"
console.log(". = %s", path.resolve("."))
console.log("__dirname = %s", path.resolve(__dirname))
console.log("process.cwd() = %s", path.resolve(process.cwd()))
console.log("found path.js: " + require('./path.js'))
{% endhighlight %}

执行以下命令：

{% highlight console %}
cd dir1/dir2
node path.js
{% endhighlight %}

输出结果是：

{% highlight console %}
. = /dir1/dir2
__dirname = /dir1/dir2
process.cwd() = /dir1/dir2
found path.js: yes
{% endhighlight %}

> 实际的输出路径前面还有项目的绝对路径，这里省略不写，下同。

然后再执行：

{% highlight console %}
cd ..
node dir2/path.js
{% endhighlight %}

输出结果是：

{% highlight console %}
. = /dir1
__dirname = /dir1/dir2
process.cwd() = /dir1
found path.js: yes
{% endhighlight %}
