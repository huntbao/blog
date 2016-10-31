---
layout: post
title: 关于转义 html 的一点思考
category: js
tag: js html-escape
---
先思考一个问题：数据库存用户的输入内容，是存原始的内容，还是存转义后的内容？

我们知道，在页面显示用户输入的内容时，需要对输入内容进行转义，不然会有 XSS 的问题。
