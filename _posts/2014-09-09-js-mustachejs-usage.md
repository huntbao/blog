---
layout: post
title: Mustache.js 使用简介
---

![Mustache.js]({{ site.baseurl }}public/images/mustache.png)

2009 年 10 月，[Chris Wanstrath](http://twitter.com/defunkt){:target="_blank"} 发布了 [Mustache](https://github.com/defunkt/mustache){:target="_blank"}，它是一个 Ruby 工具类库。不久后，[Jan Lehnardt](https://github.com/janl){:target="_blank"} 便发布了 [Mustache.js](https://github.com/janl/mustache.js){:target="_blank"}。

Mustache 的设计哲学是 logic-less template，即不用编写逻辑语句的模板系统，即没有 if 语句、else 从句以及循环等逻辑语句，这意味着它的语法相对简单，从某种意义上来说不容易出错。

Mustache 的立场是让使用者来适应它，而不是它来满足使用者遇到的各种场景。到目前为止，Mustache 有数十种编程语言的实现，Mustache.js 是 Mustache 模板系统的 JavaScript 实现。本文只讲解 Mustache.js，版本如下：

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

其实确切地说 `this` 指向的是所在层级的父层对象(区块运算符 `'#'` 运算符见下小节)。

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

但像下面这么写，`this` 又是指向 `view` (运算符 `'.'` 见下小点的内容)，这是对 `'.'` 运算符作特殊处理时导致的前后不一致的情况，这是个问题。

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

*  如果区块的键不存在，或者键的值是 `null`、`undefined`、`false`、`0`、`NaN`、空字符串或者空数组，则区块不会渲染。注意，如果是空对象 `{}`，是会渲染的。

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
    '{{ "{{#names"}}}}' +
    '<b>{{ "{{name"}}}}</b>' +
    '{{ "{{/names"}}}}'

var view = {
    names: [
        {'firstName': 'Don', 'lastName': 'Quixote'}
    ],
    name: function () {
        return this.firstName + ' ' + this.lastName
    }
}

Mustache.render(template, view) // <b>Don Quixote</b>
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

## 局部模板 `{{ "{{>name"}}}}`

* 局部模板在运行期渲染（而不是编译期），所以局部模板可以递归使用，但要避免产生无限循环。将局部模板传给 `Mustache.render` 方法的第三个参数即可。

{% highlight javascript %}

var template = '' +
    '{{ "{{#names"}}}}' +
    '{{ "{{> user"}}}}' +
    '{{ "{{/names"}}}}'

var userTemplate = '<strong>{{ "{{name"}}}}</strong>'

var view = {
    names: [
        {
            name: 'Don Quixote'
        }
    ]
}

// <strong>Don Quixote</strong>
Mustache.render(template, view, {
    user: userTemplate
})

{% endhighlight %}

下面的例子会产生无限循环。因为 Mustache.js 发现当前对象没有 `children` 属性时，它会往上查找，这和 JavaScript 中查找变量的过程是类似的：在当前作用域中找不到变量，就到父级作用域中查找。

{% highlight javascript %}

var view = {
    title: 'title1',
    children: [
        {
            title: 'title1-1'
        },
        {
            title: 'title1-2',
            children: [
                {
                    title: 'title1-2-1'
                }
            ]
        }
    ]
}

var template = '' +
    '{{ "{{title"}}}}' +
    '<ul>' +
    '{{ "{{#children"}}}}' +
    '   <li>{{ "{{>panel"}}}}</li>' +
    '{{ "{{/children"}}}}' +
    '</ul>'

var partials = {panel: template}

// Uncaught RangeError: Maximum call stack size exceeded
Mustache.render(template, view, partials)

{% endhighlight %}

## 设置自定义标签（Set Delimiter）

* Mustache.js 的标签是两对大括号，但如果想输出两对大括号就比较麻烦(可以使用 html 标签把单个大括号包起来，但在实际情况中这么做就太麻烦了)。Mustache.js 可以设置自定义标签，不使用默认的`{{ "{{"}}}}`。

{% highlight javascript %}

var template = '' +
    '{{ "{{ firstName "}}}}' +
    '{{ "{{=<% %>="}}}}' +
    '<% lastName %>' +
    '<%={{ "{{ "}}}}=%>' +
    ' is {{ "{{ title "}}}}'

var view = {
    firstName: 'Don',
    lastName: 'Quixote',
    title: 'Knight'
}

Mustache.render(template, view) // Don Quixote is Knight

{% endhighlight %}

Mustache.js 把标签存放在 `tags` 属性中，可以通过更改 `Mustache.tags` 的值，则会更换默认标签，注意，这是全局范围内的更换，所以不要轻易这么做。

{% highlight javascript %}

Mustache.tags = ['<%', '%>']

var template = '<% name %>'

var view = {
    name: 'Don Quixote'
}

Mustache.render(template, view)

{% endhighlight %}

## 预解析和缓存模板

默认情况下，当 Mustache.js 首次解析了某个模板后，它会把完整的标记树（token tree，这个涉及到 Mustache.js 的实现）缓存起来。之后如果又遇到相同的模板，就会绕过解析步骤直接使用缓存模板，这样渲染就快得多了。可以预先使用 `Mustache.parse` 方法。

{% highlight javascript %}

Mustache.parse(template);

// Then, sometime later.
Mustache.render(template, view);

{% endhighlight %}

## API

Mustache.js 暴露的 API 主要就是一个，即 `Mustache.render` 方法。还有一个 `Mustache.to_html` 方法，这个方法是为了兼容 `0.4.x` 版本的，所以已经不推荐使用这个方法，官方文档甚至都没提到这个方法。

## 问题

在使用 Mustache.js 的过程中，遇到比较多的一个问题是无法遍历对象，即需要同时使用对象的 `key` 和 `value`。这个问题 Mustache.js 没提供解决方案，只能预先对对象进行处理，所以说，Mustache.js 的立场是让使用者来适应它，而不是它来满足使用者遇到的各种场景。

## 结语

2011 年 2 月，Jan Lehnardt 写了一篇[博客](http://writing.jan.io/mustache-2.0.html){:target="_blank"}，展望了 Mustache 2.0 和 Mustache 的未来。他例举了在使用 Mustache 过程中遇到的一些问题（很多 idea 都是来自于后起之秀 [Handlebars.js](https://github.com/wycats/handlebars.js){:target="_blank"}），并打算积极推动 Mustache 的社区建设并推动大家起草 Mustache 2.0 规范，然后所有语言都实现新的规范。

2013 年 11 月，Jan Lehnardt 又写了一篇[博客](http://writing.jan.io/2013/11/01/the-parable-of-mustache-js.html){:target="_blank"}，介绍了 Mustache.js 的一些背景知识。我想他有点无奈，因为两年前的愿景进展缓慢，Mustache 2.0 更是遥遥无期。主要是 Mustache 的作者们难以达成共识，我想他们是不想破坏 Mustache 的设计哲学，即不想把 logic-less template 变成 logic template。于是，Jan Lehnardt 又把他的精力放在其他事情上面了。

对于 Mustache 作者们的坚持，是对的还是错的？我想每个人都有自己的看法。世界就是如此的奇妙，坚持的路上，有失去的机会，也有不错的回报。

在刚开始使用 Mustache.js 时，有时很纳闷怎么这么简单的功能也不提供呢？随着对 Mustache 的深入了解，我现在挺欣赏 Mustache 作者们的坚持。
