---
layout: post
title: Object.create(null) 的用法
category: js
tag: js
---

Object.create(null)，返回一个新创建的对象，它的原型是 null，意味着它没有继承任何对象。

本文要讨论的问题是：什么时候才需要用到这种对象？

### Object.create(null) vs {}

当使用语句 var obj = {}; 创建对象时，它其实并不是一个真的“空对象”，它从 Object.prototype 上继承了一些方法：

  * hasOwnProperty
  * valueOf
  * toString
  * isPrototypeOf
  * propertyIsEnumerable

那么本文要讨论的问题相当于：创建的对象需不需要用到上面的方法？

我们先来看下这些方法。

##### hasOwnProperty

在使用语句 for(var key in obj) 遍历对象的时候，只能使用 hasOwnProperty 判断 key 是否为 obj 对象自身的属性。

>现在可以使用 Object.keys(obj).forEach(...) 来遍历对象。

>不能通过 if(obj[property]) 来判断，因为 obj[property] 可能是"假值"，这样 if 条件就不成立。我相信绝大多数人都踩过这个坑。

##### valueOf

valueOf 很少直接使用。在隐式转换类型时，JavaScript 引擎会调用 valueOf 方法，强制把对象转换成原始值：

{% highlight javascript %}
var obj = Object.create(null);
obj + 1;
// Uncaught TypeError: Cannot convert object to primitive value
{% endhighlight %}

##### toString、isPrototypeOf 和 propertyIsEnumerable

这几个方法直接使用的情况较少，但自己的代码中不用并不表示别人写的代码不会调用。比如，有些框架可能会调用 toString 方法来判断结果是否为 [object Object]。

### 结论

因此，我们可以得出结论：当创建的对象只在当前执行环境中使用并且不会用到任何从 Object.prototype 上继承来的方法，也不会将该对象作为其他对象的原型的时候，那么可以使用 Object.create(null)。比如，Map(Dictionary) 对象，遍历这种对象时也无需再使用 hasOwnProperty 方法。

### 其他问题

#### 性能

Object.create(null) 的性能不如 {}<sup>\[1\]</sup>。

#### 标准

MDN 上 Object.create() 的 Polyfill<sup>\[2\]</sup> 没考虑参数为 null 的情况。

Object.prototype 的 `__proto__` 属性是存取属性（通过 getter 和 setter 方法），由于绝大多数浏览器都支持这个属性，所以它被加到了 ES6 标准的附录 B<sup>\[3\]</sup> 之中。

>ES6 附录 B 中的内容也是正式标准，但不是核心标准。这部分的标准主要针对浏览器环境，而其他环境(如 Node.js)是可以选择实现的。

可以通过将对象的 `__proto__` 属性设置为 null，达到和 Object.create(null) 一样的效果。所以可以直接使用下面的语句来创建“空对象”。不过性能不如前者<sup>\[4\]</sup>。

{% highlight javascript %}
var obj = {__proto__: null}
{% endhighlight %}

>直接更改对象的原型，在每个浏览器以及 JavaScript 引擎中的性能都很低，推荐使用 Object.create(prototype) 方法。

>尽管 `__proto__` 属性是标准的，但这只是为了浏览器的兼容性考虑。推荐使用 Object.getPrototypeOf() 和 Object.setPrototypeOf()。

如果想给对象添加 `__proto__` 属性，而又不影响它的原型，则可以使用 ES6 中的“计算属性”:

{% highlight javascript %}
var obj = {['__proto__']: null};
console.log(Object.getPrototypeOf(obj) === Object.prototype) // true
console.log(Object.keys(obj)) // ['__proto__']
{% endhighlight %}

>计算属性(computed property)是指该属性也需要求值。它使用 [] 语法，和对象的取值方式 obj[property] 类似。

#### 兼容性

不支持 `__proto__` 属性的浏览器，可以通过 iframe 来创建“空对象”，具体实现请参考 es-sham<sup>\[5\]</sup>。

---

#### 参考资料

\[1\]: [`Object.create(null) vs {}`](https://jsperf.com/object-create-null-vs-literal/2)<br/>
\[2\]: [`MDN Object.create()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create)<br/>
\[3\]: [`ES6 标准的附录 B`](http://www.ecma-international.org/ecma-262/6.0/#sec-additional-properties-of-the-object.prototype-object)<br/>
\[4\]: [`Object.create(null) vs {__proto__: null}`](https://jsperf.com/object-create-null-vs-literal/24)<br/>
\[5\]: [`es-sham __proto__`](https://github.com/es-shims/es5-shim/blob/master/es5-sham.js#LC195)


[1]: http://stackoverflow.com/questions/32262809/is-it-bad-practice-to-use-object-createnull-versus
[2]: http://ferrante.pl/frontend/javascript/objectcreate-history-and-memory-leaks/
[3]: http://javascript.crockford.com/prototypal.html
[4]: http://www.devthought.com/2012/01/18/an-object-is-not-a-hash/
[5]: http://www.2ality.com/2012/01/objects-as-maps.html
[6]: http://hax.iteye.com/blog/1663476
[7]: https://www.nczonline.net/blog/2008/07/10/naked-javascript-objects/
