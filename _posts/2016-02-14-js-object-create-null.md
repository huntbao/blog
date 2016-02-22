---
layout: post
title: Object.create(null)
category: js
tag: js
---

`Object.create(null)`，返回一个新创建的对象，它的原型是 `null`，意味着它没有继承任何对象。

本文要讨论的问题是：什么时候才需要使用这种对象？

### 创建对象的方法

当使用语句 `var obj = {};` 创建对象时，它其实并不是一个真的 `空对象`，它从 `Object.prototype` 上继承了一些方法：`hasOwnProperty`、`isPrototypeOf`、`propertyIsEnumerable`、`toString / toLocaleString`、`valueOf` 等。

#### 参考资料
[1]: http://stackoverflow.com/questions/32262809/is-it-bad-practice-to-use-object-createnull-versus
[2]: http://ferrante.pl/frontend/javascript/objectcreate-history-and-memory-leaks/
[3]: http://javascript.crockford.com/prototypal.html
[4]: http://www.devthought.com/2012/01/18/an-object-is-not-a-hash/
[5]: http://www.2ality.com/2012/01/objects-as-maps.html
[6]: http://hax.iteye.com/blog/1663476
[7]: https://www.nczonline.net/blog/2008/07/10/naked-javascript-objects/
