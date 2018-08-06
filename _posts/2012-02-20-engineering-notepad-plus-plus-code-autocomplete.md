---
layout: post
category: engineering
title: Notepad++ 代码自动完成制作方法
---

**注**：写在前面：一直很喜欢 Notepad++ 这款IDE，小巧灵活、功能齐全。这篇文章早就写了，但一直没有放到外部的blog中来，今天移到这儿，让更多的人知道其实Notepad++照样可以很强大。Notepad++有很多的插件可以安装，有兴趣的同学不妨自己研究一下，相信会有惊喜等着你。

## Notepad++代码自动完成(jQuery版)

Notepad++的代码提示文件是一个XML文件，位置是在：..\Program Files\Notepad++\plugins\APIs\，该目录下面有各种语言的提示文件。

使用方法：

将这三个文件：html.xml, css.xml, javascript.xml 复制到上面所说的目录下面即可。友情提醒：覆盖前请备份原来的文件。

[打包文件下载](/public/others/notepad4jquery.zip)

html.xml 收录 264 项， css.xml 收录 562 项， javascript.xml 收录了 2284 项

html部分包含了 HTML5 的新标签，css部分包含了 CSS3 的新属性。

javascript包含了 Firefox6、chrome13、ie9、safari5、opera11.51 的各种属性，也包括了 jQuery 中 "jQuery"全局对象 和 用 "$"取到的元素的各种属性和方法。

(制作过程有点匆忙，可能会有遗漏或者错误的内容，请自行修改文件即可，或者给我留言，我会修复)

打开自动提示的功能:

打开Notepad++的代码自动完成的功能：设置-->首选项-->备份与自动完成，"所有输入均启用自动完成"前面打上钩：

![演示1](/public/images/npca/1.jpg)

注：自动完成默认的呼出快捷键是：ctrl+space，该快捷键和输入法冲突，建议把输入法的快捷键给改了。


### 效果演示：

![演示2](/public/images/npca/2.png)

![演示3](/public/images/npca/3.png)

![演示4](/public/images/npca/4.png)

![演示5](/public/images/npca/5.png)

![演示6](/public/images/npca/6.png)

![演示7](/public/images/npca/7.png)


注：关于制作过程，这里就不解释了，也写了好些JS，稍微看下代码相信都能明白的。HTML和CSS没什么捷径可寻，基本上是人肉完成的。

[制作包下载](/public/others/np-autocomplete.zip)

本文最初发表于[博客园](http://www.cnblogs.com/huntbao/archive/2012/02/20/notepad-code-autocomplete.html){:target="_blank"}





