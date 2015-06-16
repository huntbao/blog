---
layout: post
title: Underscore 学习笔记
---


###### `_.each(list, iteratee, [context])`(or `_.forEach`)：

1. 迭代不能 break。
2. iteratee 中的 this，非严格模式下是全局对象，严格模式下是 undefined。 jQuery.each 则不同。
3. 传递给 iteratee 三个参数：(element, index, list)。所以如果 iteratee 默认支持多个参数则需要小心，比如 parseInt 函数。


###### `_.map`(`_.collect`)：

1. 