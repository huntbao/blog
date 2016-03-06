---
layout: post
title: Object.create(null) 的使用场景
category: js
tag: js
---

`Object.create(null)`，返回一个新创建的对象，它的原型是 `null`，意味着它没有继承任何对象。

本文要讨论的问题是：什么时候才需要使用这种对象？

### Object.create(null) vs {}

当使用语句 `var obj = {};` 创建对象时，它其实并不是一个真的“空对象”，它从 `Object.prototype` 上继承了一些方法：

  * `hasOwnProperty`
  * `valueOf`
  * `toString`
  * `isPrototypeOf`
  * `propertyIsEnumerable`

那么本文要讨论的问题也可以换一种问法：创建的对象需要用到上面方法吗？

我们先来看下这些方法的功能。

##### hasOwnProperty

在使用 `for(var key in obj)` 语句遍历对象的时候，一般来说都需要判断 `key` 是否为 `obj` 对象自身的属性，此时只能使用 `hasOwnProperty` 方法。

>现在可以使用 `Object.keys(obj).forEach(...)` 来遍历对象。

>不能通过 `if(obj[property])` 来判断，因为 `obj[property]` 可能是 `假值`，这样 if 条件就不成立。我相信绝大多数人都踩过这个坑。

##### valueOf

`valueOf` 很少直接使用。在隐式转换类型时，JavaScript 引擎会调用 `valueOf` 方法，强制把对象转换成原始值：

{% highlight javascript %}
> var obj = Object.create(null);
> obj + 1;
Uncaught TypeError: Cannot convert object to primitive value
{% endhighlight %}

##### toString、isPrototypeOf 和 propertyIsEnumerable

这几个方法直接使用的情况较小，但自己的代码中不用并不表示别人写的代码不会用。比如，有些框架可能会调用 `toString` 方法来判断结果是否为 `[object Object]`。

### 结论

综上所述，可以得出结论：当创建的对象只在当前执行环境中使用并且不会用到任何从 `Object.prototype` 上继承来的方法，也不会将该对象作为其他对象的原型，那么可以使用 `Object.create(null)`。比如，只存放数据的 `Map` 对象，遍历这种对象时也无需使用 `hasOwnProperty` 方法。

### 其他相关问题

#### 性能

`Object.create(null)` 的性能不如 `{}`，[查看测试结果](https://jsperf.com/object-create-null-vs-literal/2)。

#### 兼容性和标准

MDN 上 `Object.create()` 的 [Polyfill](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create) 没考虑参数为 `null` 的情况。

`Object.prototype` 的 `__proto__` 属性是存取属性（getter 和 setter 方法），由于绝大多数浏览器都支持这个属性，所以被加到了 [ES6 标准](http://www.ecma-international.org/ecma-262/6.0/#sec-additional-properties-of-the-object.prototype-object)之中。

可以通过将对象的 `__proto__` 属性设置为 `null`，达到和 `Object.create(null)` 的效果。所以可以直接使用 `var obj = {__proto__: null}` 语句创建“空对象”。不过性能不如前者，[查看测试结果](https://jsperf.com/object-create-null-vs-literal/24)。

>直接更改对象的原型，在每个浏览器以及 JavaScript 引擎中的性能都很低，推荐使用 `Object.create(prototype)` 方法。

>尽管 `__proto__` 属性是标准的，但这只是为了浏览器的兼容性考虑。推荐使用 `Object.getPrototypeOf()` 和 `Object.setPrototypeOf()`。

不支持 `__proto__` 属性的浏览器，可以通过 `iframe` 来创建“空对象”，具体实现请参考 [es-sham](https://github.com/es-shims/es5-shim/blob/master/es5-sham.js#LC195)。



#### 参考资料
[1]: http://stackoverflow.com/questions/32262809/is-it-bad-practice-to-use-object-createnull-versus
[2]: http://ferrante.pl/frontend/javascript/objectcreate-history-and-memory-leaks/
[3]: http://javascript.crockford.com/prototypal.html
[4]: http://www.devthought.com/2012/01/18/an-object-is-not-a-hash/
[5]: http://www.2ality.com/2012/01/objects-as-maps.html
[6]: http://hax.iteye.com/blog/1663476
[7]: https://www.nczonline.net/blog/2008/07/10/naked-javascript-objects/
