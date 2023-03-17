---
title: 老外的前端面试题
category: engineering
---

**注**：翻译水平实在有限，看的不明白之处还请查看[原文](http://darcyclarke.me/development/front-end-job-interview-questions/){:target="_blank"}

### 普通问题：

- 用Twitter吗？
	- 如果用，你在Twitter上面关注谁了？
- 用Github吗？
	- 如果用，请列举几个你在上面关注的存储库(repos)。
- 你关注了什么博客？
- 你用过什么版本控制系统？
- 你偏爱的开发环境是什么？（操作系统，编辑器，浏览器，工具等等）
- 你能描述一下当你创建一张网页时的流程吗？
- 你能描述一下渐进增强和平稳降级的不同之处吗？
	- 如果回答了“没人能描述”，则加分
	- 如果描述了“特征检测”，则额外加分
- 解释“语义化的HTML”的意思。
- JS压缩（Minification）是作什么用的？
- 为什么把站点资源文件放在多个域下的做法比较好？
	- 一个浏览器一次从一个域下下载几个资源？
- 如果你为某个设计稿做了8个不同的css文件，你是如何把它们集成到网站当中去的？
	- 文件合并
	- 用@import，除非这部分工作在构建系统里面已经做掉了
- 如果你加入了一个项目，他们用tabs，而你用空格，你会怎么做？
	- 问题：retab! 命令
- 写一个简单的幻灯片放映的页面。
	- 如果不用JS，则加分
- 你用什么工具来测试你的代码性能？
- 如果今年你能掌握一门技术，它将会是什么？
- 说出3种减少页面加载时间的方法。（感觉上或者真实地减少了时间）
- 解释一下标准的重要性。


### HTML细节问题：
- doctype是干嘛用的？你能说出几种来？
- 标准模式和怪异模式的区别是什么？
- 在用XHTML页面时有什么限制吗？
	- 用application/xhtml+xml?会有什么问题
- 你是如何做多语言内容的页面的？
- HTML5中能使用XHTML的语法吗？在HTML5中你是怎么使用XML的？
- data- 开头的这种属性有什么好处？
- HTML4中的内容模型（content model）是什么？和HTML5中的有区别吗？
- 试想HTML5为一个开发的网络平台，那HTML5的基础模块(building blocks)是什么？
- 描述一下cookie，sessionStorage和localStorage的区别。


### JS细节问题：
- 你用过什么JavaScript库？
- JavaScript和Java有何不同？
- 未定义（undefined）和未申明（undeclared）变量分别是指什么？
- 闭包（closure）是什么？如何/为什么 使用？
	- 你最喜欢的闭包写法是哪种？Argyle(只适用于立即调用模型（IIFEs）)
- 匿名函数（anonymous functions）的典型使用案例是什么？
- 解释一下JavaScript 模块化模式以及你何时使用。
	- 提到清晰的命名空间（clean namespace），加分
	- 如果你的模块没有命名，那将会怎么？
- 你是如何组织你的代码的？（模块模式（module pattern），类继承（classical inheritance）？）
- 宿主对象(host objects)和原生对象(native objects)有何不同？
- 以下语句的区别：

{% highlight javascript %}
function Person(){}
var person = Person()
var person = new Person()
{% endhighlight %}

- call 和 apply的区别？
- 解释 Function.prototype.bind
- 你何时优化你的代码？
- 你能解释下继承在JavaScript中是如何工作的吗？
	- 如果说出“没人会”的有趣答案，加分
	- 如果他开始认真解释了，额外加分
- 你何时用过document.write()？
	- 正确答案：1999年 – 淘汰初级开发者的时候（time to weed out the junior devs）
- 特征检测（feature detection），特征推断(feature inference)，用户代理（UA）字符串的区别？
- 尽可能细地解释一下AJAX。
- 解释一下JSONP是如何工作的？（为什么它不是真正的AJAX？）
- 解释一下“提升（hoisting）”
- 什么是[FOUC](http://en.wikipedia.org/wiki/FOUC){:target="_blank"}？你是如何避免FOUC的？
- 描述一下事件冒泡
-  “attribute” 和 “property”的区别是？
- 用过JavaScript模板吗？如果用过，那是什么模板或者是怎么用的？
- 为什么扩展内置的JavaScript对象（extending built in JavaScript objects）不是一个好的主意？
- 为什么扩展内置组件（extending built ins）是个不错的主意？
- document load事件和document ready事件的区别
- == 和 === 的区别是什么？
- 解释一下你是如何从window的URL中获取查询字符串参数的（query string parameter）？
- 解释一下关于Javascript的同源策略（same-origin policy）
- 解释一下事件代理（event delegation）
- 描述一下JavaScript中的继承模式
- 使下面的代码工作：

{% highlight javascript %}
[1,2,3,4,5].duplicator(); // [1,2,3,4,5,1,2,3,4,5]
{% endhighlight %}

- 解释一下 [Memoization](http://en.wikipedia.org/wiki/Memoization){:target="_blank"} 的策略
- 为什么叫三元（Ternary）操作符？“三元”暗示着什么？
- 函数的参数数量（arity）是什么？

### JS代码例子：

{% highlight javascript %}
~~3.14
{% endhighlight %}

问题：上述语句的返回结果是什么？

{% highlight javascript %}
"i'm a lasagna hog".split("").reverse().join("");
{% endhighlight %}

问题：上述语句的返回结果是什么？

{% highlight javascript %}
( window.foo || ( window.foo = "bar" ) );
{% endhighlight %}

问题：window.foo的值是多少

{% highlight javascript %}
var foo = "Hello";
(function() {
  var bar = " World";
  alert(foo + bar);
})();
alert(foo + bar);
{% endhighlight %}

问题：2个alert的输出结果是什么

### jQuery细节问题：

- 解释一下“链式（chaining）”操作
- .end() 是做什么的？
- 在绑定事件的时候，你是如何（为什么）加上事件的命名空间（namespace）
- 效果队列（effects queue）（或者FX）是什么？
- .get(), [], .eq() 的区别
- .bind(), live()和.delegate()的区别是什么？
- $ 和 $.fn 的区别？或只说$.fn是什么？
- 优化下面的选择方法：

{% highlight javascript %}
$(".foo div#bar:eq(0)")
{% endhighlight %}

### CSS细节问题：

- 描述一下“reset”css文件的作用以及它为什么是有用的？
- 描述一下浮动（Floats）及是如何工作的
- 清除浮动的技术有哪些？什么场景下该用什么技术？
- 解释一下CSS Sprite及你是如何在一张页面或者一个站点上面使用该技术的？
- 对于功能有限的浏览器（feature-constrained browsers），你是如何制作你的页面的？
- 你使用什么技术（处理）
- 有什么方法在视觉层面上隐藏内容（使之仅对屏幕阅读者（screenreaders）可用）？
- 你使用过栅格系统（grid system）吗？如果用过，你喜欢哪种？
- 你在其它媒体或者移动设备上使用过或者实现过布局（css）吗？（Have you used or implement media queries or mobile specific layouts/CSS?）
- 给SVG添加样式，熟悉吗？
- 对于打印，你是如何优化你的页面的？
- 在写css时有什么gotchas？（What are some of the “gotchas” for writing efficient CSS?）
- 使用过LESS吗？
- 网页设计使用非标准字体的排版，你将如何实现？（避免提及网页字体（webfonts），那样的话他们会想到(你的意图)）（How would you implement a web design comp that uses non-standard fonts?）
- 解释一下浏览器是如何将元素和css选择器进行匹配的？

### 随意有趣的问题：

- 你最酷的编码作品是什么，让你自豪的是什么？
- 你知道HTML5小组的标记吗？
- 你现在在或者曾经在过小船上面吗？
- 告诉我你最喜欢的Firebug/Webkit Inspector的功能
- 你有养宠物计划吗？哪种宠物
- 解释一下“cornify”的重要性
- 在一张纸上，竖直写下A，B，C，D  4个字母。然后不写代码，将这些字母降序排列。
	- 等着看他们是否把纸给上下颠倒过来
	- 这是一个在面试将要结束，缓解紧张气氛的好方法，应该会有笑声：）
- 海盗或是忍者：
	- 如果能说出好的理由做由海盗和忍者的组成物，加分（若是猴子僵尸海盗忍者，+2分）
	- 如果不做web开发，你会做什么？
	- 怪盗卡门（Carmen Sandiego）在哪个世界（提示： 他们的回答总是错的）
	- 你最喜欢IE的什么特性？


本文最初发表于[博客园](http://www.cnblogs.com/huntbao/archive/2012/02/16/front-end-job-interview-questions.html){:target="_blank"}
