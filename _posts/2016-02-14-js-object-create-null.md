---
layout: post
title: Object.create(null)
category: js
tag: js
---

`Object.create(null)`，返回一个新创建的对象，它的原型是 `null`，意味着它没有继承任何对象。

本文要讨论的问题是：什么时候才需要使用这种对象？

### Object.create(null) vs {}

当使用语句 `var obj = {};` 创建对象时，它其实并不是一个真的 `空对象`，它从 `Object.prototype` 上继承了一些方法，比如 `hasOwnProperty`、`toString`、`valueOf` 等。

##### hasOwnProperty

在有 `Object.keys(obj).forEach(...)` 这种方法之前，我们只能通过 `hasOwnProperty` 来判断某个对象自身（不包括原型）是否具有某个属性。

>不能通过 `if(obj[property])`` 来判断，因为 `obj[property]` 可能是 `假值`，这样 if 条件就不成立。我已经记不清帮过多少人填过这个坑了。

#### 参考资料
[1]: http://stackoverflow.com/questions/32262809/is-it-bad-practice-to-use-object-createnull-versus
[2]: http://ferrante.pl/frontend/javascript/objectcreate-history-and-memory-leaks/
[3]: http://javascript.crockford.com/prototypal.html
[4]: http://www.devthought.com/2012/01/18/an-object-is-not-a-hash/
[5]: http://www.2ality.com/2012/01/objects-as-maps.html
[6]: http://hax.iteye.com/blog/1663476
[7]: https://www.nczonline.net/blog/2008/07/10/naked-javascript-objects/
