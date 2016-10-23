---
layout: post
title: 如何愉快地写个小 Parser —— PEG.js 介绍
category: js
tag: js pegjs
---
在编写程序的时候，我们经常需要处理文本：从目标文本中提取所需信息，然后再交给其他程序进行处理。最常用的文本处理工具就是正则表达式，相信大家都已经用过。还有一种方式就是编写 Parser。[Mustache.js](https://github.com/janl/mustache.js) 的最初版本是用正则表达式编写的，后来被其他人改写成使用 Parser 的方式来实现，这一点也让作者唏嘘不已。

除了开发一些效率工具，在日常的开发工作中，直接编写 Parser 似乎是很少见的。一来是编写 Parser 有较高的门槛，二来也可能是对这方面的知识关注较少。

但是，在日常的开发工作中，如果在有一些需求功能中使用自己编写的 Parser，那么不管需求变更有多频繁，也可能不用修改代码，因为该 Parser 能应付所有可能出现的情形。

例如，开发一个按日期条件过滤的筛选器，一开始的筛选条件是：“三天内”、“一周内”、“一月前”。这是一个很大的坑，如果代码不好好设计下，那之后可能需要不断重构。因为业界根本没有通用的日期筛选条件规则，不可能有也不需要有，所以很可能会出现各种各样的筛选条件：“半个月前”、“三天之前十天之内”等等。所以，很有必要将筛选规则通用化，然后编写 Parser 解析规则，提取有效信息。比如 “三天之前十天之内” 可以用 “>3d<10d” 来表示，然后将该规则写在筛选按钮的自定义属性上，这样就不用修改代码了。

可能有人会说，这也不用编写 Parser 那么麻烦吧，使用正则表达式足够了。

说得很对，但是这不重要，正则表达式也会总有力不从心的时候。今天要介绍的工具 PEG.js，是用来解决“编写 Parser ”这个麻烦的。PEG.js 的文法对前端工程师特别友好，只要掌握基本的正则语法就足够了，生成的 Parser 就是一个 JavaScript 文件，在浏览器和 Node.js 中都可以使用。


## 入门

PEG.js 有[在线版本](http://pegjs.org/online)，推荐从这里开始练手，请在新窗口打开这个链接。

打开后，请将左边的 textarea 中的内容删除，这时它的下方会有警告信息，在 textarea 中输入下面的内容：

{% highlight property %}

StartRule = ""

{% endhighlight %}

此时警告信息就消失了，将右边的 textarea 的内容也删除。

接下来我们使用 PEG.js 语法来生成一个 Parser，用来检验一段输入文本是否为有效的 CSS 规则，为了方便起见，我们约定“有效的 CSS 规则”是这样的：

{% highlight css %}

.SELECTOR {
  PROPERTY: VALUE;
}

{% endhighlight %}

规则说明：

* 只能以 “.” 开头，后面紧跟选择器名称 SELECTOR，SELECTOR 只能由英文字母组成
* SELECTOR 后面可以是任意数量的空白字符或者换行符，然后是左大括号
* 左大括号之后可以跟换行符加任意数量的空白字符，也可以没有换行符
* PROPERTY 只能由英文字母组成，PROPERTY 后面可以是任意数量的空白字符，然后再出现冒号“:”
* 冒号“:”后面可以是任意数量的空白字符，然后再出现 VALUE，VALUE 只能由英文字母和数字组成
* VALUE 后面可以是任意数量的空白字符，然后是分号“;”
* 最后是右大括号

根据上面的规则说明，可以知道下面的都是“有效的 CSS 规则”：

{% highlight css %}

.main{margin: 20px;}

.main { margin  : 20px;  }

.main
{
  margin  : 20px;  
}

{% endhighlight %}

但下面的都不是“有效的 CSS 规则”：

{% highlight css %}

#main{margin: 20px;}

.m-main { margin  : 20px;  }

.main
{
  font-size : 20px;  
}

{% endhighlight %}

如果是“有效的 CSS 规则”，就返回下面的 JSON 对象：

{% highlight json %}

{
  "selector": "{{SELECTOR}}",
  "property": "{{PROPERTY}}",
  "value": "{{VALUE}}"
}

{% endhighlight %}

接下来我们就按规则来编写实现上述功能的 PEG.js 文法。通览所有的规则，我们发现下面的规则是可以提取出来复用的：

* 只能由英文字母组成
* 任意数量的空白字符
* 换行符
* 只能由英文字母和数字组成

首先我们定义匹配单个英文字符的规则“AlphaChars”：

{% highlight property %}

AlphaChars
    = [a-zA-Z]

{% endhighlight %}

“[characters]” 是 pegjs 的文法，它从集合“characters”中匹配单个字符并返回，“characters”集合也可以是范围，如“a-zA-Z”，意思和 JavaScript 中的正则是一样的。在最后加一个“i”可以表示不区分大小写，下面的文法和上面的是等价的：

{% highlight property %}

AlphaChars
    = [a-z]i

{% endhighlight %}

然后定义“只能由英文字母组成”的规则“Word”：

{% highlight property %}

Word
    = l:AlphaChars+ {
        return l.join('');
    }

AlphaChars
    = [a-zA-Z]

{% endhighlight %}

我们可以对匹配结果添加引用“l”，“+”表示匹配一次或者多次，每次匹配的结果会存在一个数组中，并可以使用 JavaScript 代码对结果进行处理再返回，这是 PEG.js 最强大的功能之一。

“任意数量的空白字符”也同理可以实现，先定义空白字符的规则“WS”，然后再定义“任意数量的空白字符”的规则“WSS” ：

{% highlight property %}

WS "whitespace"
    = [ \t]

WSS "whitespaces"
    = WS*

{% endhighlight %}

每条规则也可以添加对人类友好的名称（如 WS 规则中的“whitespace”），它会用在出错信息中。

“换行符”和“只能由英文字母和数字组成”分别如下：

{% highlight property %}

LB "Linebreak"
    = [\r\n]

WordWithNumeric
    = l:ALPHA_NUMERIC_CHARS+ {
        return l.join('');
    }

ALPHA_NUMERIC_CHARS
  = [z-aA-Z0-9]

{% endhighlight %}

除了上述规则，还有一些固定写死的字符，使用引号或者双引号就可以了，它表示只匹配引号中的字符。

完整的文法如下所示：

{% highlight property %}

StartRule
  = '.'selector:(Word) WSS LB* '{' LB* WSS property:(Word) WSS ':' WSS value:(WordWithNumeric) WSS ';' WSS LB* '}' {
    return {
        "selector": selector,
        "property": property,
        "value": value
    }
  }

Word
    = l:AlphaChars+ {
        return l.join('');
    }

WordWithNumeric
    = l:ALPHA_NUMERIC_CHARS+ {
        return l.join('');
    }

AlphaChars
    = [a-zA-Z]

ALPHA_NUMERIC_CHARS
  = [a-zA-Z0-9]

WS "whitespace"
    = [ \t]

WSS "whitespaces"
    = WS*  

LB "Linebreak"
    = [\r\n]

{% endhighlight %}

验证结果：

![pegjs]({{ site.baseurl }}public/images/pegjs/result1.jpg)

![pegjs]({{ site.baseurl }}public/images/pegjs/result2.jpg)


## 一个实际例子
[NEI](https://nei.netease.com) 中有一个功能，是解析 JavaBean 文件，从中提取所需信息，在 NEI 创建相应的数据模型。代码已经托管在 github 上，有兴趣的同学可以去研究一下：[jsonbean](https://github.com/huntbao/jsonbean)


## 结语

可以这么说，只要稍微学习下 PEG.js 的文法，前端工程师就能完成一些较复杂或者很有趣的任务，学习成本很小。

细心的你或许已经发现，使用 PEG.js 提供的在线工具，也可以在日常生活中处理一些工作，比如从一大堆无规律的文字中提取所有客户的电话号码和公司信息。

本文只介绍了 PEG.js 最基本的用法，如果已经引起了你的兴趣，那么本文的目标也就达到了:)

---

#### 参考资料

\[1\]: [PEG.js offical site](http://pegjs.org/)<br/>
\[2\]: [Parsing expression grammar(PEG)](https://en.wikipedia.org/wiki/Parsing_expression_grammar)<br/>
