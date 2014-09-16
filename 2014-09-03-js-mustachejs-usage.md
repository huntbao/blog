---
layout: page
title: Mustache.js 使用简介
---

![Mustache.js]({{ site.baseurl }}public/images/mustache.png)

2009 年的 10 月份，[Chris Wanstrath](http://twitter.com/defunkt){:target="_blank"} 发布了 [Mustache](https://github.com/defunkt/mustache){:target="_blank"}，它是一个 Ruby 工具类库。不久后，[Jan Lehnardt](https://github.com/janl){:target="_blank"} 便发布了 [Mustache.js](https://github.com/janl/mustache.js){:target="_blank"}。

Mustache 的设计哲学是 logic-less template，即不用编写逻辑语句的模板，即没有 if 语句、else 从句以及循环等逻辑语句，这意味着它的语法相对简单，从某种意义上来说不容易出错。

Mustache 的立场是让使用者来适应它，而不是它来满足使用者遇到的各种使用场景。到目前为止，Mustache 有数十种编程语言的实现，Mustache.js 是 Mustache 模板系统的 JavaScript 实现。本文只讲解 Mustache.js，版本如下：

{% highlight javascript %}
console.log(Mustache.version) // 0.8.1
{% endhighlight %}

Mustache.js 主要支持以下 5 种语法：

* `{{ "{{name"}}}}` 变量
* `{{ "{{#name"}}}}...{{ "{{/name"}}}}` 区块
* `{{ "{{^name"}}}}...{{ "{{/name"}}}}` 反向区块
* `{{ "{{!name"}}}}` 注释
* `{{ "{{>name"}}}}` 局部模板

用两对大括号(大括号顺时针转 90 度后就是 Mustache 的 logo)括起来的标记(`{{ "{{name"}}}}`)叫做 Mustache 标签，大括号中的内容(`name`)叫做该标签的键(`key`)。

## 变量 `{{ "{{name"}}}}` 

* 如果 `name` 是简单变量，它会替换为当前 context 对象上的 `name` 属性的值。如果 `name` 属性未定义或者 `name` 的值为 `null` 或者 `undefined`，则替换为空字符串，否则就调用 `name` 值的 `toString()` 方法作为替换的值。

{% highlight javascript %}

var template = '{{ "{{name"}}}}'

// {} 没有 `name` 属性，结果是空字符串
Mustache.render(template, {})

Mustache.render(template, {name: null}) // ''
Mustache.render(template, {name: undefined}) // ''

// false.toString() === 'false'
Mustache.render(template, {name: false})

// {}.toString() === '[object Object]'
Mustache.render(template, {name: {}})

// [].toString() === ''
Mustache.render(template, {name: []})

{% endhighlight %}

* 如果 `name` 是函数，则使用函数的返回值，然后再按上面的规则取值。函数调用中的上下文对象 `this` 为 `view` 对象。

{% highlight javascript %}

var template = '{{ "{{name"}}}}'

var view = {
    name: function () {
        console.log(this === view) // true
        return 'Don Quixote'
    }
}

Mustache.render(template, view) // 'Don Quixote'

{% endhighlight %}

其实确切地说 `this` 指向的是所在层级的父层对象(运算符 `'#'` 运算符见下小节)。

{% highlight javascript %}

var template = '' +
    '{{ "{{#user"}}}}' +
    '   {{ "{{#hasName"}}}}' +
    '   <strong>{{ "{{user.name"}}}}</strong>' +
    '   {{ "{{/hasName"}}}}' +
    '{{ "{{/user"}}}}'

var view = {
    user: {
        hasName: function () {
            console.log(this === view.user) // true
            return true
        }
    }
}

Mustache.render(template, view)

{% endhighlight %}

但像下面这么写，`this` 又是指向 `view` (运算符 `'.'` 见下小点的内容)，这是对 `'.'` 运算符作特殊处理时出现的前后不一致的情况，这是个问题。

{% highlight javascript %}

var template = '' +
    '{{ "{{#user.hasName"}}}}' +
    '   <strong>{{ "{{user.name"}}}}</strong>' +
    '{{ "{{/user.hasName"}}}}'

var view = {
    user: {
        hasName: function () {
            console.log(this === view) // true
            return true
        }
    }
}

Mustache.render(template, view)

{% endhighlight %}



* `name` 除了不能出现 `.` 字符外，只要可以作为对象的键名都是有效的，包括中间带空格的变量和 JavaScript 关键字以及保留字等等。

{% highlight javascript %}

var template = '{{ "{{my name is"}}}}'

var view = {
    'my name is': 'Don Quixote'
}

Mustache.render(template, view) // 'Don Quixote'

{% endhighlight %}

* `'.'` 运算符有特殊的作用，和 js 的语法一样，取对象的值。只支持 `'.'` 取对象的值，不支持 `'[]'` 取值运算符。

{% highlight javascript %}

var template = '{{ "{{name.lastName"}}}} {{ "{{name.firstName"}}}}'

var view = {
    name: {
        firstName: 'Quixote',
        lastName: 'Don'
    }
}

Mustache.render(template, view) // 'Don Quixote'

template = '{{ "{{name.lastName"}}}}'

view = {
    'name.lastName': 'Don'
}

Mustache.render(template, view) // ''

template = '{{ '{{name["lastName"]'}}}}'

view = {
    name: {
        lastName: 'Don'
    }
}

Mustache.render(template, view) // ''

{% endhighlight %}



* 默认所有的变量都会转义 html 字符，如果不想转义 html 字符，则可以使用 `{{ "{{{name"}}}}}` 或者 `{{ "{{&name"}}}}`。


{% highlight javascript %}

var view = {
    'title': '<b>Knight</b>'
}

Mustache.render('{{ "{{title"}}}}', view) // &lt;b&gt;Knight&lt;&#x2F;b&gt;
Mustache.render('{{ "{{&title"}}}}', view) // <b>Knight</b>
Mustache.render('{{ "{{{title"}}}}}', view) // <b>Knight</b>

{% endhighlight %}


## 区块 `{{ "{{#name"}}}}...{{ "{{/name"}}}}`

*  如果区块的键不存在，或者键的值是 `null`、`undefined`、`false`、`0`、`NaN`、空字符串或者空数组，则区块不会渲染。注意，如果是空对象 `{}`，则是会渲染的。

{% highlight javascript %}

var template = '' +
    '{{ "{{{#name"}}}}' +
    'Never shown!' +
    '{{ "{{{/name"}}}}'

var view = {
    'name': {}
}

Mustache.render(template, view) // ''

view = {
    'name': []
}

Mustache.render(template, view) // 'Never shown!'

{% endhighlight %}

* 否则，会渲染区块的内容。如果键的值是数组，则会渲染多次区块内容，次数为数组的长度。

{% highlight javascript %}

var template = '' +
    '{{ "{{#stooges"}}}}' +
    '<b>{{ "{{name"}}}}</b>' +
    '{{ "{{{/stooges"}}}}'

var view = {
    'stooges': [
        {'name': 'Moe'},
        {'name': 'Larry'},
        {'name': 'Curly'}
    ]
}

Mustache.render(template, view) // <b>Moe</b><b>Larry</b><b>Curly</b>

{% endhighlight %}

如果是字符串数组，则可以使用 `.` 代表当前迭代的字符串值。

{% highlight javascript %}

var template = '' +
    '{{ "{{#stooges"}}}}' +
    '<b>{{ "{{."}}}}</b>' +
    '{{ "{{{/stooges"}}}}'

var view = {
    'stooges': ['Moe', 'Larry','Curly']
}

Mustache.render(template, view) // <b>Moe</b><b>Larry</b><b>Curly</b>

{% endhighlight %}

如果区块中的键的值是函数，则会调用该函数，函数中的 `this` 为当前所迭代的对象。

{% highlight javascript %}

var template = '' +
    '{{ "{{#beatles"}}}}' +
    '<b>{{ "{{name"}}}}</b>' +
    '{{ "{{/beatles"}}}}'

var view = {
    'beatles': [
        {'firstName': 'John', 'lastName': 'Lennon'},
        {'firstName': 'Paul', 'lastName': 'McCartney'},
        {'firstName': 'George', 'lastName': 'Harrison'},
        {'firstName': 'Ringo', 'lastName': 'Starr'}
    ],
    'name': function () {
        return this.firstName + ' ' + this.lastName
    }
}

Mustache.render(template, view) // <b>John Lennon</b><b>Paul McCartney</b><b>George Harrison</b><b>Ringo Starr</b> 

{% endhighlight %}

* 如果区块的键是函数，则会调用该函数。函数的第一个参数是区块的内容块（未渲染）。第二个参数是一个特殊的渲染函数，它的 `view` 参数是当前的 `view`，调用的 `context` 对象即为当前的 `view` 对象。

{% highlight javascript %}

var template = '' +
        '{{ "{{#bold"}}}}' +
        'Hi {{ "{{name"}}}}.' +
        '{{ "{{/bold"}}}}'

var view = {
    'name': 'Tater',
    'bold': function () {
        return function (text, render) {
            return '<b>' + render(text) + '</b>'
        }
    }
}

Mustache.render(template, view) // <b>Hi Tater.</b> 

{% endhighlight %}

## 反向区块 `{{ "{{^name"}}}}...{{ "{{/name"}}}}` 

* 反向区块，顾名思义，情况和区块正相反，即区块会渲染的话，则反向区块就不渲染。如果区块的键是函数，则依据函数的返回值进行判断。

{% highlight javascript %}

var template = '' +
    '{{ "{{^name"}}}}' +
    'Shown!' +
    '{{ "{{/name"}}}}'

var view = {
    'name': []
}

Mustache.render(template, view) // 'Shown!' 

{% endhighlight %}


## 注释 `{{ "{{!name"}}}}` 


* 注释块中的内容不会显示。注释中可以换行。


{% highlight javascript %}

var template = '<h1>Today{{ "{{! ignore me"}}}}.</h1>'

Mustache.render(template) // <h1>Today.</h1> 

{% endhighlight %}




 



