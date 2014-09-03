---
layout: page
title: Mustache.js 使用简介
---

![Mustache.js]({{ site.baseurl }}public/images/mustache.png)

2009 年的 10 月份，[Chris Wanstrath](http://twitter.com/defunkt){:target="_blank"} 发布了 [Mustache](https://github.com/defunkt/mustache){:target="_blank"}，它是一个 Ruby 工具类库。不久后，[Jan Lehnardt](https://github.com/janl){:target="_blank"} 便发布了 [Mustache.js](https://github.com/janl/mustache.js){:target="_blank"}。

Mustache 的设计哲学是 logic-less template，即不用编写逻辑语句的模板，即没有 if 语句、else 从句以及循环等逻辑语句，这意味着它的语法相对简单，从某种意义上来说不容易出错。

Mustache 的立场是让使用者来适应它，而不是它来满足使用者遇到的各种使用场景。到目前为止，Mustache 有数十种编程语言的实现，Mustache.js 是 Mustache 模板系统的 JavaScript 实现。本文只讨论 Mustache.js。

Mustache.js 主要支持以下 5 种语法：

* `{{ "{{name"}}}}` 变量
* `{{ "{{#name"}}}}...{{ "{{/name"}}}}` 区块
* `{{ "{{^name"}}}}...{{ "{{/name"}}}}` 反向区块
* `{{ "{{!name"}}}}` 注释
* `{{ "{{>name"}}}}` 局部模板

用两对大括号(大括号顺时针转 90 度后就是 Mustache 的 logo)括起来的标记(`{{ "{{name"}}}}`)叫做 Mustache 标签，大括号中的内容(`name`)叫做该标签的键(`key`)。

1. `{{ "{{name"}}}}` 变量

	* 最常见的标签类型就是简单变量。`{{ "{{name"}}}}` 会替换为当前 context 对象上的 `name` 属性的值，如果当前 context 对象没有 `name` 属性，则替换为空字符串。

	* 默认所有的变量都会转义 html 字符，如果不想转义 html 字符，则可以使用 `{{ "{{{name"}}}}}` 或者 `{{ "{{&name"}}}}`。




